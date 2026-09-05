import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";

type Context = { params: Promise<{ id: string }> };
const schema = z.object({ scheduledAt: z.string().datetime() });

function localScheduleParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  return {
    weekday: parts.find((part) => part.type === "weekday")?.value,
    hour: Number(parts.find((part) => part.type === "hour")?.value)
  };
}

export async function POST(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await context.params;
    const { scheduledAt } = schema.parse(await request.json());
    const date = new Date(scheduledAt);
    if (date.getTime() <= Date.now()) throw new Error("Время отправки должно быть в будущем");

    const [draft, settings] = await Promise.all([
      db.emailDraft.findFirst({ where: { id, userId: user.id } }),
      db.applicationSettings.findUnique({ where: { userId: user.id } })
    ]);
    if (!draft) throw new Error("Черновик не найден");
    if (draft.status !== "APPROVED") throw new Error("Сначала одобрите письмо");

    const timezone = settings?.timezone ?? "Europe/Moscow";
    const local = localScheduleParts(date, timezone);
    if (local.weekday === "Sat" || local.weekday === "Sun") {
      throw new Error("Отправка на выходные отключена");
    }
    const startHour = settings?.workdayStartHour ?? 9;
    const endHour = settings?.workdayEndHour ?? 18;
    if (!Number.isFinite(local.hour) || local.hour < startHour || local.hour >= endHour) {
      throw new Error(`Выберите время в рабочем окне ${startHour}:00–${endHour}:00 (${timezone})`);
    }

    const scheduled = await db.$transaction(async (tx) => {
      await tx.scheduledEmail.updateMany({ where: { draftId: id, status: "PENDING" }, data: { status: "CANCELLED" } });
      const item = await tx.scheduledEmail.create({ data: { draftId: id, scheduledAt: date } });
      await tx.emailDraft.update({ where: { id }, data: { status: "SCHEDULED" } });
      await tx.company.update({ where: { id: draft.companyId }, data: { status: "SCHEDULED" } });
      return item;
    });
    return NextResponse.json(scheduled);
  } catch (error) {
    return apiError(error);
  }
}
