import { NextResponse } from "next/server";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";
import { syncGrowthRadar } from "@/lib/growth-radar";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    return NextResponse.json(await syncGrowthRadar(user.id));
  } catch (error) {
    return apiError(error);
  }
}
