// Run with Node 24: node --test tests/blueprint-ownership.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const bundle = await build({
  entryPoints: [fileURLToPath(new URL("../src/worker/auth-entry.ts", import.meta.url))],
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
});
const { default: worker } = await import(
  "data:text/javascript;base64," +
    Buffer.from(bundle.outputFiles[0].contents).toString("base64"),
);

function database() {
  const sql = new DatabaseSync(":memory:");
  sql.exec(readFileSync(new URL("../migrations/0001_authentication.sql", import.meta.url), "utf8"));
  sql.exec(`
    CREATE TABLE blueprints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      creator TEXT NOT NULL,
      category TEXT NOT NULL,
      file_key TEXT,
      preview_key TEXT,
      access_type TEXT NOT NULL,
      price REAL NOT NULL DEFAULT 0,
      downloads INTEGER NOT NULL DEFAULT 0,
      rating REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  const DB = {
    prepare(query) {
      const statement = sql.prepare(query);
      let values = [];
      return {
        bind(...args) {
          values = args;
          return this;
        },
        async first() {
          return statement.get(...values) ?? null;
        },
        async all() {
          return { results: statement.all(...values) };
        },
        async run() {
          const result = statement.run(...values);
          return {
            success: true,
            meta: {
              last_row_id: Number(result.lastInsertRowid),
              changes: Number(result.changes),
            },
          };
        },
      };
    },
  };

  const objects = new Map();
  const BLUEPRINTS = {
    async put(key, body, options) {
      objects.set(key, {
        bytes: new Uint8Array(await new Response(body).arrayBuffer()),
        contentType: options?.httpMetadata?.contentType,
      });
    },
    async delete(key) {
      objects.delete(key);
    },
    async get(key) {
      const stored = objects.get(key);
      if (!stored) return null;
      return {
        body: new Response(stored.bytes).body,
        size: stored.bytes.byteLength,
      };
    },
  };

  return { sql, DB, BLUEPRINTS, objects };
}

async function call(env, path, { method = "GET", body, cookie } = {}) {
  const headers = new Headers();
  if (body instanceof FormData) {
    // Let fetch add the multipart boundary.
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (cookie) headers.set("Cookie", cookie);
  return worker.fetch(
    new Request(`https://test.example${path}`, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
    }),
    env,
  );
}

async function register(env, email, display_name) {
  const response = await call(env, "/api/auth/register", {
    method: "POST",
    body: { email, display_name, password: "test-password-🌙-28" },
  });
  assert.equal(response.status, 201);
  const cookie = response.headers.get("Set-Cookie").split(";")[0];
  const user = (await response.json()).user;
  return { cookie, user };
}

test("publishing uses the signed-in account and protects file ownership", async () => {
  const env = database();
  try {
    const anonymous = await call(env, "/api/blueprints", {
      method: "POST",
      body: {
        name: "Anonymous design",
        description: "Should be rejected",
        category: "Tools & DIY",
        access_type: "Free",
        price: 0,
      },
    });
    assert.equal(anonymous.status, 401);
    assert.equal((await anonymous.json()).code, "AUTH_REQUIRED");

    const alice = await register(env, "alice@example.com", "Alice Maker");
    const created = await call(env, "/api/blueprints", {
      method: "POST",
      cookie: alice.cookie,
      body: {
        name: "Workshop Tray",
        description: "A useful tray",
        creator: "Imposter",
        category: "Tools & DIY",
        access_type: "Free",
        price: 0,
      },
    });
    assert.equal(created.status, 201);
    const createdBody = await created.json();
    assert.equal(createdBody.blueprint.creator, "Alice Maker");
    const row = env.sql.prepare("SELECT user_id, file_key FROM blueprints WHERE id = ?").get(createdBody.blueprint.id);
    assert.equal(row.user_id, alice.user.id);
    assert.equal(row.file_key, "pending");

    const bob = await register(env, "bob@example.com", "Bob Maker");
    const file = new File(["solid tray"], "tray.stl", { type: "model/stl" });
    const preview = new File(["preview"], "tray.png", { type: "image/png" });
    const form = new FormData();
    form.append("file", file);
    form.append("preview", preview);

    const forbidden = await call(env, `/api/blueprints/${createdBody.blueprint.id}/upload`, {
      method: "POST",
      cookie: bob.cookie,
      body: form,
    });
    assert.equal(forbidden.status, 403);
    assert.equal((await forbidden.json()).code, "BLUEPRINT_FORBIDDEN");
    assert.equal(env.objects.size, 0);

    const uploaded = await call(env, `/api/blueprints/${createdBody.blueprint.id}/upload`, {
      method: "POST",
      cookie: alice.cookie,
      body: form,
    });
    assert.equal(uploaded.status, 201);
    const uploadedBody = await uploaded.json();
    assert.equal(uploadedBody.success, true);
    assert.match(uploadedBody.stored_key, /^blueprints\/\d+\//);
    assert.match(uploadedBody.preview_key, /^blueprints\/\d+\/preview-/);
    assert.equal(env.objects.size, 2);

    const stored = env.sql.prepare("SELECT file_key, preview_key, user_id FROM blueprints WHERE id = ?").get(createdBody.blueprint.id);
    assert.equal(stored.user_id, alice.user.id);
    assert.equal(stored.file_key, uploadedBody.stored_key);
    assert.equal(stored.preview_key, uploadedBody.preview_key);

    const duplicate = await call(env, `/api/blueprints/${createdBody.blueprint.id}/upload`, {
      method: "POST",
      cookie: alice.cookie,
      body: form,
    });
    assert.equal(duplicate.status, 409);
  } finally {
    env.sql.close();
  }
});
