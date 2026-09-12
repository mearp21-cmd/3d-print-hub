// Run with Node 24: node --test tests/auth.test.mjs
// These tests exercise the Worker routes with real SQLite and Node crypto.
// A Cloudflare preview test is still required for platform limits/cookies.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const bundle = await build({
  entryPoints: [fileURLToPath(new URL("../src/worker/auth-entry.ts", import.meta.url))],
  bundle: true, platform: "node", format: "esm", write: false,
});
const { default: worker } = await import("data:text/javascript;base64," + Buffer.from(bundle.outputFiles[0].contents).toString("base64"));

function database() {
  const sql = new DatabaseSync(":memory:");
  sql.exec(readFileSync(new URL("../migrations/0001_authentication.sql", import.meta.url), "utf8"));
  const DB = {
    prepare(query) {
      const statement = sql.prepare(query);
      let values = [];
      return {
        bind(...args) { values = args; return this; },
        async first() { return statement.get(...values) ?? null; },
        async run() {
          const result = statement.run(...values);
          return { success: true, meta: { last_row_id: Number(result.lastInsertRowid), changes: result.changes } };
        },
      };
    },
  };
  return { sql, DB };
}

function request(DB, path, body, cookie) {
  const headers = new Headers();
  if (body !== undefined) headers.set("Content-Type", "application/json");
  if (cookie) headers.set("Cookie", cookie);
  const method = body !== undefined || path === "logout" ? "POST" : "GET";
  return worker.fetch(new Request(`https://test.example/api/auth/${path}`, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
  }), { DB });
}

test("register, restore session, reject wrong password, sign out, and sign in", async () => {
  const { sql, DB } = database();
  try {
    const credentials = { email: "Maker@Example.com", password: "test-password-🌙-28", display_name: "Test Maker" };
    const registered = await request(DB, "register", credentials);
    assert.equal(registered.status, 201);
    assert.equal(registered.headers.get("Cache-Control"), "no-store");
    const body = await registered.json();
    assert.equal(body.user.email, "maker@example.com");
    assert.equal(body.user.password_hash, undefined);
    const cookieHeader = registered.headers.get("Set-Cookie");
    for (const flag of ["HttpOnly", "Secure", "SameSite=Lax"]) assert.ok(cookieHeader.includes(flag));
    const cookie = cookieHeader.split(";")[0];
    const stored = sql.prepare("SELECT * FROM users").get();
    assert.match(stored.password_hash, /^scrypt-v1:/);
    assert.notEqual(stored.password_hash, credentials.password);
    assert.ok(stored.password_salt);
    const session = sql.prepare("SELECT token_hash FROM sessions").get();
    assert.notEqual(session.token_hash, decodeURIComponent(cookie.split("=").slice(1).join("=")));
    assert.equal((await (await request(DB, "me", undefined, cookie)).json()).user.id, body.user.id);
    assert.equal((await request(DB, "login", { ...credentials, password: "wrong-password" })).status, 401);
    assert.equal((await request(DB, "logout", undefined, cookie)).status, 200);
    assert.equal((await (await request(DB, "me", undefined, cookie)).json()).user, null);
    const signedIn = await request(DB, "login", credentials);
    assert.equal(signedIn.status, 200);
    const newCookie = signedIn.headers.get("Set-Cookie").split(";")[0];
    assert.notEqual(newCookie, cookie);
    assert.equal((await (await request(DB, "me", undefined, newCookie)).json()).user.id, body.user.id);
    assert.equal((await request(DB, "register", credentials)).status, 409);
  } finally { sql.close(); }
});

test("expired sessions and malformed cookies do not authenticate", async () => {
  const { sql, DB } = database();
  try {
    const registered = await request(DB, "register", { email: "expiry@example.com", password: "temporary-test-password", display_name: "Expiry Test" });
    const cookie = registered.headers.get("Set-Cookie").split(";")[0];
    sql.prepare("UPDATE sessions SET expires_at = ?").run(new Date(Date.now() - 1000).toISOString());
    assert.equal((await (await request(DB, "me", undefined, cookie)).json()).user, null);
    assert.equal((await (await request(DB, "me", undefined, "ph_session=%ZZ")).json()).user, null);
  } finally { sql.close(); }
});

test("request failures return JSON and oversized input is rejected", async () => {
  const DB = { prepare() { throw new Error("synthetic database failure"); } };
  const result = await request(DB, "register", { email: "error@example.com", password: "temporary-test-password", display_name: "Error Test" });
  assert.equal(result.status, 503);
  assert.match(result.headers.get("Content-Type"), /application\/json/);
  assert.equal((await result.json()).code, "AUTH_SERVICE_ERROR");
  assert.equal(result.headers.get("Set-Cookie"), null);
  assert.equal((await request(DB, "register", { password: "x".repeat(5000) })).status, 413);
  assert.equal((await request(DB, "login", { email: "test@example.com", password: "x".repeat(129) })).status, 401);
});
