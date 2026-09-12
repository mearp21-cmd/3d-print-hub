import { scrypt, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";

// Version 1 uses OWASP's 16 MiB scrypt profile. Its N*r*p cost (655,360)
// is within Workers' 1,048,576 limit, unlike the previous PBKDF2 setting.
// Keep these parameters fixed for this stored version.
const HASH_PREFIX = "scrypt-v1:";
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 5, maxmem: 32 * 1024 * 1024 };
const KEY_LENGTH = 32;

function deriveScrypt(password: string, salt: Uint8Array): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function createPasswordHash(password: string, salt: Uint8Array): Promise<string> {
  const key = await deriveScrypt(password, salt);
  return HASH_PREFIX + key.toString("base64");
}

export async function verifyPasswordHash(
  password: string,
  salt: Uint8Array,
  storedHash: string,
  legacyIterations: number,
): Promise<boolean> {
  if (storedHash.startsWith(HASH_PREFIX)) {
    const storedKey = Buffer.from(storedHash.slice(HASH_PREFIX.length), "base64");
    if (storedKey.length !== KEY_LENGTH) return false;
    const candidate = await deriveScrypt(password, salt);
    return timingSafeEqual(candidate, storedKey);
  }

  // Keep verification of existing PBKDF2 records; never reinterpret or lower
  // their saved iteration count. New records always use versioned scrypt.
  if (!Number.isSafeInteger(legacyIterations) || legacyIterations <= 0) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: legacyIterations }, key, 256);
  const expected = Buffer.from(storedHash, "base64");
  return expected.length === KEY_LENGTH && timingSafeEqual(Buffer.from(bits), expected);
}
