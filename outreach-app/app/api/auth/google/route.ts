import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { googleOAuthClient } from "@/lib/google";

export async function GET() {
  const state = crypto.randomBytes(24).toString("base64url");
  const store = await cookies();
  store.set("growth_radar_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    path: "/"
  });

  const client = googleOAuthClient();
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: true,
    state,
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/gmail.compose"
    ]
  });
  return NextResponse.redirect(url);
}
