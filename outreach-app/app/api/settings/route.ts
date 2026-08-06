import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";

const schema = z.object({
  fullName: z.string().min(2).max(100),
  role: z.string().min(2).max(160),
  positioning: z.string().max(1000).nullable().optional(),
  phone: z.string().max(100).nullable().optional(),
  telegram: z.string().max(200).nullable().optional(),
  linkedin: z.string().max(500).nullable().optional(),
  websiteUrl: z.string().max(500).nullable().optional(),
  resumeUrl: z.string().max(500).nullable().optional(),
  signature: z.string().max(2000).nullable().optional(),
  dailyLimit: z.number().int().min(1).max(50),
  minimumIntervalMin: z.number().int().min(1).max(240),
  workdayStartHour: z.number().int().min(0).max(23),
  workdayEndHour: z.number().int().min(1).max(24),
  timezone: z.string().min(2).max(100),
  queuePaused: z.boolean()
});

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const input = schema.parse(await request.json());
    const settings = await db.applicationSettings.upsert({
      where: { userId: user.id },
      update: input,
      create: { userId: user.id, ...input }
    });
    await db.activityLog.create({ data: { userId: user.id, action: "SETTINGS_UPDATED", entity: "ApplicationSettings" } });
    return NextResponse.json(settings);
  } catch (error) {
    return apiError(error);
  }
}
