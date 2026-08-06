import crypto from "node:crypto";
import tls from "node:tls";

const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 465;

type SmtpResponse = { code: number; text: string };

function smtpUser(): string {
  return (process.env.GMAIL_SMTP_USER || process.env.ALLOWED_EMAIL || "alinavasileva.jour@gmail.com").trim();
}

function smtpPassword(): string {
  const value = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!value) throw new Error("GMAIL_APP_PASSWORD не настроен");
  return value;
}

function readResponse(socket: tls.TLSSocket): Promise<SmtpResponse> {
  return new Promise((resolve, reject) => {
    let buffer = "";

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("close", onClose);
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const onClose = () => {
      cleanup();
      reject(new Error("SMTP-соединение закрыто раньше времени"));
    };

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const finalLine = [...lines].reverse().find((line) => /^\d{3} /.test(line));
      if (!finalLine) return;
      cleanup();
      resolve({ code: Number(finalLine.slice(0, 3)), text: lines.join("\n") });
    };

    socket.on("data", onData);
    socket.once("error", onError);
    socket.once("close", onClose);
  });
}

async function command(socket: tls.TLSSocket, value: string, expected: number | number[]): Promise<SmtpResponse> {
  socket.write(`${value}\r\n`);
  const response = await readResponse(socket);
  const allowed = Array.isArray(expected) ? expected : [expected];
  if (!allowed.includes(response.code)) {
    throw new Error(`SMTP ${response.code}: ${response.text}`);
  }
  return response;
}

function dotStuff(message: string): string {
  return message.replace(/(^|\r\n)\./g, "$1..");
}

export function smtpConfigured(): boolean {
  return Boolean(process.env.GMAIL_APP_PASSWORD);
}

export async function sendSmtpRaw(input: { to: string; rawBase64Url: string }): Promise<{ messageId: string }> {
  const user = smtpUser();
  const password = smtpPassword();
  const socket = tls.connect({ host: SMTP_HOST, port: SMTP_PORT, servername: SMTP_HOST, rejectUnauthorized: true });
  socket.setTimeout(30_000, () => socket.destroy(new Error("SMTP timeout")));

  try {
    const greeting = await readResponse(socket);
    if (greeting.code !== 220) throw new Error(`SMTP ${greeting.code}: ${greeting.text}`);
    await command(socket, "EHLO growth-radar-outreach.vercel.app", 250);
    await command(socket, "AUTH LOGIN", 334);
    await command(socket, Buffer.from(user, "utf8").toString("base64"), 334);
    await command(socket, Buffer.from(password, "utf8").toString("base64"), 235);
    await command(socket, `MAIL FROM:<${user}>`, 250);
    await command(socket, `RCPT TO:<${input.to}>`, [250, 251]);
    await command(socket, "DATA", 354);

    const raw = Buffer.from(input.rawBase64Url, "base64url").toString("utf8");
    socket.write(`${dotStuff(raw)}\r\n.\r\n`);
    await readResponse(socket).then((response) => {
      if (response.code !== 250) throw new Error(`SMTP ${response.code}: ${response.text}`);
    });
    await command(socket, "QUIT", 221).catch(() => undefined);
    return { messageId: `smtp-${crypto.randomUUID()}` };
  } finally {
    socket.end();
    socket.destroy();
  }
}
