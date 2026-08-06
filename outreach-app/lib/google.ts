import { google } from "googleapis";
import { db } from "@/lib/db";
import { decryptSecret, encryptSecret } from "@/lib/crypto";

export function googleOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.APP_URL;
  if (!clientId || !clientSecret || !appUrl) throw new Error("Google OAuth is not configured");
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    `${appUrl.replace(/\/$/, "")}/api/auth/google/callback`
  );
}

export async function gmailForUser(userId: string) {
  const account = await db.emailAccount.findUnique({ where: { userId } });
  if (!account) throw new Error("Gmail не подключён");

  const client = googleOAuthClient();
  client.setCredentials({
    access_token: account.encryptedAccessToken ? decryptSecret(account.encryptedAccessToken) : undefined,
    refresh_token: account.encryptedRefreshToken ? decryptSecret(account.encryptedRefreshToken) : undefined,
    expiry_date: account.tokenExpiresAt?.getTime()
  });

  client.on("tokens", (tokens) => {
    void db.emailAccount.update({
      where: { userId },
      data: {
        encryptedAccessToken: tokens.access_token ? encryptSecret(tokens.access_token) : undefined,
        encryptedRefreshToken: tokens.refresh_token ? encryptSecret(tokens.refresh_token) : undefined,
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined
      }
    });
  });

  return google.gmail({ version: "v1", auth: client });
}
