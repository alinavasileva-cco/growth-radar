import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      database: "connected",
      googleOAuth: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      appUrl: process.env.APP_URL || "https://growth-radar-outreach.vercel.app"
    });
  } catch {
    return NextResponse.json(
      { ok: false, database: "unavailable", googleOAuth: false },
      { status: 503 }
    );
  }
}
