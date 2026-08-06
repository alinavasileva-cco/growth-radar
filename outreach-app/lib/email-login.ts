import crypto from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "growth_radar_email_login";

function loginSecret(): Uint8Array {
  const source = process.env.SESSION_SECRET || process.env.DATABASE_URL;
  if (!source) throw new Error("Не настроен секрет входа");
  return crypto.createHash("sha256").update(`growth-radar-email-login:${source}`).digest();
}

function codeHash(email: string, code: string): string {
  return crypto.createHmac("sha256", loginSecret()).update(`${email.toLowerCase()}:${code}`).digest("hex");
}

export function emailLoginCookieName(): string {
  return COOKIE_NAME;
}

export async function createEmailLoginToken(email: string, code: string): Promise<string> {
  return new SignJWT({ email: email.toLowerCase(), codeHash: codeHash(email, code) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(loginSecret());
}

export async function verifyEmailLoginToken(token: string, code: string): Promise<string | null> {
  try {
    const result = await jwtVerify(token, loginSecret());
    const email = typeof result.payload.email === "string" ? result.payload.email : null;
    const expectedHash = typeof result.payload.codeHash === "string" ? result.payload.codeHash : null;
    if (!email || !expectedHash) return null;
    const actualHash = codeHash(email, code);
    const expected = Buffer.from(expectedHash, "hex");
    const actual = Buffer.from(actualHash, "hex");
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null;
    return email;
  } catch {
    return null;
  }
}
