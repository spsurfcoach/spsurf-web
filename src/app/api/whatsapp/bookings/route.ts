import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { createBookingTransaction } from "@/lib/booking/transactions";
import type { ClassSlotDoc } from "@/lib/booking/types";
import { requireWhatsappApiKey, resolveUserByPhone, whatsappErrorResponse } from "@/lib/whatsapp/api";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    requireWhatsappApiKey(request);
    const body = (await request.json()) as { phone?: string; classSlotId?: string };

    if (!body.classSlotId) {
      return NextResponse.json({ ok: false, error: "CLASS_SLOT_ID_REQUIRED" }, { status: 400 });
    }

    const user = await resolveUserByPhone(body.phone ?? "");

    const result = await createBookingTransaction({
      userId: user.uid,
      classSlotId: body.classSlotId,
    });

    const slotSnapshot = await adminDb.collection("classSlots").doc(body.classSlotId).get();
    const slot = slotSnapshot.exists ? (slotSnapshot.data() as ClassSlotDoc) : null;

    return NextResponse.json({
      ok: true,
      bookingId: result.bookingId,
      classSlotId: body.classSlotId,
      startsAt: slot?.startsAt ?? null,
      email: user.email,
    });
  } catch (error) {
    return whatsappErrorResponse(error);
  }
}
