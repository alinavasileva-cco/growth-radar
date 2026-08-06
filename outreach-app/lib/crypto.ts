import crypto from "node:crypto";

function encryptionKey(): Buffer {
  const explicit = process.env.TOKEN_ENCRYPTION_KEY;
  if (explicit && /^[0-9a-fA-F]{64}$/.test(explicit)) {
    return Buffer.from(explicit, "hex");
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("TOKEN_ENCRYPTION_KEY or DATABASE_URL must be configured");
  return crypto
    .createHash("sha256")
    .update(`growth-radar-outreach:token-encryption:v1:${databaseUrl}`)
    .digest();
}

export function encryptSecret(value: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((part) => part.toString("base64url")).join(".");
}

export function decryptSecret(value: string): string {
  const [ivRaw, tagRaw, encryptedRaw] = value.split(".");
  if (!ivRaw || !tagRaw || !encryptedRaw) throw new Error("Invalid encrypted value");
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivRaw, "base64url"));
  decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedRaw, "base64url")),
    decipher.final()
  ]).toString("utf8");
}
