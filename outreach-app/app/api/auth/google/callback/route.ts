import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { db } from "@/lib/db";
import { encryptSecret } from "@/lib/crypto";
import { googleOAuthClient } from "@/lib/google";
import { createSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const store = await cookies();
  const expectedState = store.get("growth_radar_oauth_state")?.value;
  store.delete("growth_radar_oauth_state");
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/login?error=oauth_state", request.url));
  }

  try {
    const client = googleOAuthClient();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: client });
    const profile = await oauth2.userinfo.get();
    const email = profile.data.email?.toLowerCase();
    const allowed = process.env.ALLOWED_EMAIL?.toLowerCase();
    if (!email || !allowed || email !== allowed) {
      return NextResponse.redirect(new URL("/login?error=not_allowed", request.url));
    }

    const user = await db.user.upsert({
      where: { email },
      update: { name: profile.data.name ?? undefined, picture: profile.data.picture ?? undefined },
      create: { email, name: profile.data.name ?? undefined, picture: profile.data.picture ?? undefined }
    });

    await db.applicationSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id }
    });

    const previous = await db.emailAccount.findUnique({ where: { userId: user.id } });
    await db.emailAccount.upsert({
      where: { userId: user.id },
      update: {
        providerEmail: email,
        encryptedAccessToken: tokens.access_token ? encryptSecret(tokens.access_token) : previous?.encryptedAccessToken,
        encryptedRefreshToken: tokens.refresh_token ? encryptSecret(tokens.refresh_token) : previous?.encryptedRefreshToken,
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : previous?.tokenExpiresAt,
        scope: tokens.scope ?? previous?.scope
      },
      create: {
        userId: user.id,
        providerEmail: email,
        encryptedAccessToken: tokens.access_token ? encryptSecret(tokens.access_token) : null,
        encryptedRefreshToken: tokens.refresh_token ? encryptSecret(tokens.refresh_token) : null,
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        scope: tokens.scope ?? null
      }
    });

    await createSession({ userId: user.id, email });
    await db.activityLog.create({ data: { userId: user.id, action: "GOOGLE_CONNECTED", entity: "EmailAccount" } });
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
  }
}
