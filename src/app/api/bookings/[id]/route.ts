import { NextRequest, NextResponse } from "next/server";
import { cancelBookingTransaction } from "@/lib/booking/transactions";
import { forbiddenResponse, getRequiredUser, unauthorizedResponse } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getRequiredUser();
    const { id: bookingId } = await params;

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
    }

    await cancelBookingTransaction({ userId: user.uid, bookingId });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    if (error instanceof Error && error.message === "BOOKING_NOT_OWNED") {
      return forbiddenResponse();
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Cancellation failed" }, { status: 500 });
  }
}
