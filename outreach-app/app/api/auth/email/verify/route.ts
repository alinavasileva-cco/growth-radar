import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailLoginCookieName, verifyEmailLoginToken } from "@/lib/email-login";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as { code?: unknown } | null;
    const code = typeof body?.code === "string" ? body.code.replace(/\D/g, "") : "";
    if (code.length !== 6) {
      return NextResponse.json({ error: "Введите шестизначный код" }, { status: 400 });
    }

    const store = await cookies();
    const token = store.get(emailLoginCookieName())?.value;
    if (!token) {
      return NextResponse.json({ error: "Срок кода истёк. Запросите новый." }, { status: 400 });
    }

    const email = await verifyEmailLoginToken(token, code);
    const allowed = (process.env.ALLOWED_EMAIL || "alinavasileva.jour@gmail.com").toLowerCase();
    if (!email || email !== allowed) {
      return NextResponse.json({ error: "Неверный или устаревший код" }, { status: 401 });
    }

    const user = await db.user.upsert({
      where: { email },
      update: {},
      create: { email, name: "Алина Васильева" }
    });
    await db.applicationSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id }
    });
    await db.emailAccount.upsert({
      where: { userId: user.id },
      update: { providerEmail: email, scope: "smtp" },
      create: { userId: user.id, providerEmail: email, scope: "smtp" }
    });
    await createSession({ userId: user.id, email });
    await db.activityLog.create({
      data: { userId: user.id, action: "EMAIL_CODE_LOGIN", entity: "User", entityId: user.id }
    });
    store.delete(emailLoginCookieName());
    return NextResponse.json({ ok: true, redirect: "/dashboard" });
  } catch {
    return NextResponse.json({ error: "Не удалось выполнить вход" }, { status: 500 });
  }
}
