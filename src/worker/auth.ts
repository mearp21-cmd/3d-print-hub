import type { Hono } from "hono";

const SESSION_COOKIE = "ph_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const PBKDF2_ITERATIONS = 310_000;

const encoder = new TextEncoder();

type AuthApp = Hono<{ Bindings: Env }>;

type UserRow = {
  id: number;
  email: string;
  display_name: string;
  password_hash: string;
  password_salt: string;
  password_iterations: number;
  created_at: string;
};

type PublicUser = {
  id: number;
  email: string;
  display_name: string;
  created_at: string;
};

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function derivePasswordHash(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations,
    },
    keyMaterial,
    256,
  );

  return bytesToBase64(new Uint8Array(bits));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let difference = 0;
  for (let i = 0; i < a.length; i += 1) {
    difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return difference === 0;
}

async function hashSessionToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(token));
  return bytesToBase64(new Uint8Array(digest));
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return null;
  }
  return email;
}

function normalizeDisplayName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 40) return null;
  return name;
}

function normalizePassword(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (value.length < 10 || value.length > 128) return null;
  return value;
}

function parseCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    const key = part.slice(0, separator).trim();
    if (key === name) {
      try { return decodeURIComponent(part.slice(separator + 1).trim()); }
      catch { return null; }
    }
  }

  return null;
}

function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function toPublicUser(user: UserRow): PublicUser {
  return {
    id: user.id,
    email: user.email,
    display_name: user.display_name,
    created_at: user.created_at,
  };
}

async function createSession(db: D1Database, userId: number): Promise<string> {
  const tokenBytes = new Uint8Array(32);
  crypto.getRandomValues(tokenBytes);
  const token = bytesToBase64(tokenBytes);
  const tokenHash = await hashSessionToken(token);
  const expiresAt = new Date(
    Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  ).toISOString();

  await db
    .prepare(
      "INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
    )
    .bind(tokenHash, userId, expiresAt)
    .run();

  return token;
}

async function getCurrentUser(
  db: D1Database,
  request: Request,
): Promise<PublicUser | null> {
  const token = parseCookie(request, SESSION_COOKIE);
  if (!token) return null;

  const tokenHash = await hashSessionToken(token);
  const user = await db
    .prepare(
      `SELECT u.id, u.email, u.display_name, u.password_hash, u.password_salt,
              u.password_iterations, u.created_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND datetime(s.expires_at) > datetime('now')`,
    )
    .bind(tokenHash)
    .first<UserRow>();

  return user ? toPublicUser(user) : null;
}

export function registerAuthRoutes(app: AuthApp): void {
  app.post("/api/auth/register", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return c.json({ success: false, error: "A JSON request body is required." }, 400);
    }

    const input = body as Record<string, unknown>;
    const email = normalizeEmail(input.email);
    const displayName = normalizeDisplayName(input.display_name);
    const password = normalizePassword(input.password);

    if (!email) {
      return c.json({ success: false, error: "Enter a valid email address." }, 400);
    }
    if (!displayName) {
      return c.json({ success: false, error: "Display name must be 2 to 40 characters." }, 400);
    }
    if (!password) {
      return c.json({ success: false, error: "Password must be 10 to 128 characters." }, 400);
    }

    const existing = await c.env.DB
      .prepare("SELECT id FROM users WHERE email = ?")
      .bind(email)
      .first<{ id: number }>();

    if (existing) {
      return c.json({ success: false, error: "An account with that email already exists." }, 409);
    }

    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);
    const passwordHash = await derivePasswordHash(
      password,
      salt,
      PBKDF2_ITERATIONS,
    );

    try {
      const result = await c.env.DB
        .prepare(
          `INSERT INTO users
            (email, display_name, password_hash, password_salt, password_iterations, created_at)
           VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        )
        .bind(
          email,
          displayName,
          passwordHash,
          bytesToBase64(salt),
          PBKDF2_ITERATIONS,
        )
        .run();

      const user = await c.env.DB
        .prepare(
          `SELECT id, email, display_name, password_hash, password_salt,
                  password_iterations, created_at
           FROM users WHERE id = ?`,
        )
        .bind(result.meta.last_row_id)
        .first<UserRow>();

      if (!user) {
        return c.json({ success: false, error: "Unable to create account." }, 500);
      }

      const token = await createSession(c.env.DB, user.id);
      c.header("Set-Cookie", sessionCookie(token));
      return c.json({ success: true, user: toPublicUser(user) }, 201);
    } catch (error) {
      console.error("Registration failed", error instanceof Error ? error.message : error);
      return c.json({ success: false, error: "Unable to create account." }, 500);
    }
  });

  app.post("/api/auth/login", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return c.json({ success: false, error: "A JSON request body is required." }, 400);
    }

    const input = body as Record<string, unknown>;
    const email = normalizeEmail(input.email);
    const password = typeof input.password === "string" ? input.password : "";

    if (!email || !password) {
      return c.json({ success: false, error: "Invalid email or password." }, 401);
    }

    const user = await c.env.DB
      .prepare(
        `SELECT id, email, display_name, password_hash, password_salt,
                password_iterations, created_at
         FROM users WHERE email = ?`,
      )
      .bind(email)
      .first<UserRow>();

    if (!user) {
      return c.json({ success: false, error: "Invalid email or password." }, 401);
    }

    const candidateHash = await derivePasswordHash(
      password,
      base64ToBytes(user.password_salt),
      user.password_iterations,
    );

    if (!constantTimeEqual(candidateHash, user.password_hash)) {
      return c.json({ success: false, error: "Invalid email or password." }, 401);
    }

    const token = await createSession(c.env.DB, user.id);
    c.header("Set-Cookie", sessionCookie(token));
    return c.json({ success: true, user: toPublicUser(user) });
  });

  app.post("/api/auth/logout", async (c) => {
    const token = parseCookie(c.req.raw, SESSION_COOKIE);
    if (token) {
      const tokenHash = await hashSessionToken(token);
      await c.env.DB
        .prepare("DELETE FROM sessions WHERE token_hash = ?")
        .bind(tokenHash)
        .run();
    }

    c.header("Set-Cookie", clearSessionCookie());
    return c.json({ success: true });
  });

  app.get("/api/auth/me", async (c) => {
    const user = await getCurrentUser(c.env.DB, c.req.raw);
    if (!user) {
      return c.json({ success: true, user: null });
    }

    return c.json({ success: true, user });
  });
}
