import { NextRequest, NextResponse } from "next/server";
import { cancelBookingTransaction } from "@/lib/booking/transactions";
import { requireWhatsappApiKey, resolveUserByPhone, whatsappErrorResponse } from "@/lib/whatsapp/api";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    requireWhatsappApiKey(request);
    const { id: bookingId } = await params;

    if (!bookingId) {
      return NextResponse.json({ ok: false, error: "BOOKING_ID_REQUIRED" }, { status: 400 });
    }

    const user = await resolveUserByPhone(request.nextUrl.searchParams.get("phone") ?? "");

    await cancelBookingTransaction({ userId: user.uid, bookingId });

    return NextResponse.json({ ok: true, bookingId });
  } catch (error) {
    return whatsappErrorResponse(error);
  }
}
