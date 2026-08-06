import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("PDF не выбран");
    if (file.type !== "application/pdf") throw new Error("Разрешён только PDF");
    if (file.size > 10 * 1024 * 1024) throw new Error("PDF должен быть не больше 10 МБ");
    const data = Buffer.from(await file.arrayBuffer());

    const attachment = await db.$transaction(async (tx) => {
      await tx.attachment.updateMany({ where: { userId: user.id, isDefault: true }, data: { isDefault: false } });
      return tx.attachment.create({
        data: { userId: user.id, fileName: file.name, contentType: file.type, size: file.size, data, isDefault: true }
      });
    });
    await db.activityLog.create({ data: { userId: user.id, action: "ATTACHMENT_UPLOADED", entity: "Attachment", entityId: attachment.id } });
    return NextResponse.json({ id: attachment.id, fileName: attachment.fileName, size: attachment.size });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    await db.attachment.deleteMany({ where: { userId: user.id, isDefault: true } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
