import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createEmailLoginToken, emailLoginCookieName } from "@/lib/email-login";
import { buildMimeMessage } from "@/lib/mime";
import { sendSmtpRaw, smtpConfigured } from "@/lib/smtp";

function ownerEmail(): string {
  return (process.env.ALLOWED_EMAIL || "alinavasileva.jour@gmail.com").toLowerCase();
}

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  return `${name.slice(0, 2)}***@${domain}`;
}

export async function POST() {
  if (!smtpConfigured()) {
    return NextResponse.json({ error: "Gmail SMTP ещё не настроен" }, { status: 503 });
  }

  try {
    const email = ownerEmail();
    const code = crypto.randomInt(100000, 1000000).toString();
    const token = await createEmailLoginToken(email, code);
    const raw = buildMimeMessage({
      from: email,
      to: email,
      subject: "Код входа Growth Radar Outreach",
      body: `Код входа: ${code}\n\nОн действует 10 минут. Если вы не запрашивали код, просто проигнорируйте это письмо.`
    });
    await sendSmtpRaw({ to: email, rawBase64Url: raw });

    const store = await cookies();
    store.set(emailLoginCookieName(), token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 600,
      path: "/"
    });
    return NextResponse.json({ ok: true, email: maskEmail(email) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось отправить код";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
