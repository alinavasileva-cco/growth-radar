import crypto from "node:crypto";
import type { Attachment } from "@prisma/client";

function cleanHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function encodeHeader(value: string): string {
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function wrap(value: string): string {
  return value.match(/.{1,76}/g)?.join("\r\n") ?? value;
}

export function buildMimeMessage(input: {
  from: string;
  to: string;
  subject: string;
  body: string;
  attachment?: Attachment | null;
}): string {
  const boundary = `growth_radar_${crypto.randomUUID()}`;
  const lines = [
    `From: ${cleanHeader(input.from)}`,
    `To: ${cleanHeader(input.to)}`,
    `Subject: ${encodeHeader(cleanHeader(input.subject))}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    wrap(Buffer.from(input.body, "utf8").toString("base64"))
  ];

  if (input.attachment) {
    lines.push(
      `--${boundary}`,
      `Content-Type: ${cleanHeader(input.attachment.contentType)}; name="${cleanHeader(input.attachment.fileName)}"`,
      `Content-Disposition: attachment; filename="${cleanHeader(input.attachment.fileName)}"`,
      "Content-Transfer-Encoding: base64",
      "",
      wrap(Buffer.from(input.attachment.data).toString("base64"))
    );
  }

  lines.push(`--${boundary}--`, "");
  return Buffer.from(lines.join("\r\n"), "utf8").toString("base64url");
}
