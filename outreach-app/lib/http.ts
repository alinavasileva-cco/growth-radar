import { NextResponse } from "next/server";

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const appUrl = process.env.APP_URL;
  if (!origin || !appUrl) return;
  if (new URL(origin).origin !== new URL(appUrl).origin) throw new Error("INVALID_ORIGIN");
}

export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Неизвестная ошибка";
  const status = message === "UNAUTHORIZED" ? 401 : message === "INVALID_ORIGIN" ? 403 : 400;
  return NextResponse.json({ error: message }, { status });
}
