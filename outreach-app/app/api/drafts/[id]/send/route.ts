import { NextResponse } from "next/server";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";
import { sendApprovedDraft } from "@/lib/send";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await context.params;
    return NextResponse.json(await sendApprovedDraft(id, user.id));
  } catch (error) {
    return apiError(error);
  }
}
