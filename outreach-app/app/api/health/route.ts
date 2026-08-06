import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Readiness endpoint: reports configuration state without exposing secrets.
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      database: "connected",
      emailTransport: process.env.GMAIL_APP_PASSWORD ? "gmail-smtp" : (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? "gmail-oauth" : "not-configured"),
      loginMode: process.env.GMAIL_APP_PASSWORD ? "email-code" : "not-configured",
      appUrl: process.env.APP_URL || "https://growth-radar-outreach.vercel.app"
    });
  } catch {
    return NextResponse.json(
      { ok: false, database: "unavailable", emailTransport: "unknown", loginMode: "unknown" },
      { status: 503 }
    );
  }
}
