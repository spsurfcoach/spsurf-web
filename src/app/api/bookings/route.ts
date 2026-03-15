import { NextRequest, NextResponse } from "next/server";
import { createBookingTransaction } from "@/lib/booking/transactions";
import { getRequiredUser, unauthorizedResponse } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getRequiredUser();
    const body = (await request.json()) as { classSlotId?: string };
    if (!body.classSlotId) {
      return NextResponse.json({ error: "classSlotId is required" }, { status: 400 });
    }

    const result = await createBookingTransaction({
      userId: user.uid,
      classSlotId: body.classSlotId,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
