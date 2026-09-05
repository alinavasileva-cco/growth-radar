import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError } from "@/lib/http";
import { requireUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await requireUser();
    const [account, settings, attachment] = await Promise.all([
      db.emailAccount.findUnique({ where: { userId: user.id }, select: { providerEmail: true, updatedAt: true } }),
      db.applicationSettings.findUnique({ where: { userId: user.id } }),
      db.attachment.findFirst({ where: { userId: user.id, isDefault: true }, select: { id: true, fileName: true, size: true } })
    ]);
    return NextResponse.json({ user, account, settings, attachment });
  } catch (error) {
    return apiError(error);
  }
}
