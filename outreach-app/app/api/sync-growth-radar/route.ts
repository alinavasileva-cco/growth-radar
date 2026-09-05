import { NextResponse } from "next/server";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";
import { syncAllGrowthRadar } from "@/lib/growth-radar-all";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    return NextResponse.json(await syncAllGrowthRadar(user.id));
  } catch (error) {
    return apiError(error);
  }
}
