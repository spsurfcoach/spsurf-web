import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getActiveClassPurchase } from "@/lib/booking/guards";
import type { BookingDoc, ClassSlotDoc, PurchaseDoc } from "@/lib/booking/types";
import { requireWhatsappApiKey, resolveUserByPhone, whatsappErrorResponse } from "@/lib/whatsapp/api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireWhatsappApiKey(request);
    const user = await resolveUserByPhone(request.nextUrl.searchParams.get("phone") ?? "");

    const nowIso = new Date().toISOString();
    const [purchasesSnapshot, bookingsSnapshot] = await Promise.all([
      adminDb.collection("purchases").where("userId", "==", user.uid).get(),
      adminDb.collection("bookings").where("userId", "==", user.uid).where("status", "==", "booked").get(),
    ]);

    const purchases = purchasesSnapshot.docs.map((doc) => doc.data() as PurchaseDoc);
    const activePurchase = getActiveClassPurchase(purchases, nowIso);

    const slotIds = [...new Set(bookingsSnapshot.docs.map((doc) => String((doc.data() as BookingDoc).classSlotId)))];
    const slotEntries = await Promise.all(
      slotIds.map(async (slotId) => {
        const slot = await adminDb.collection("classSlots").doc(slotId).get();
        return [slotId, slot.exists ? (slot.data() as ClassSlotDoc) : null] as const;
      }),
    );
    const slotMap = Object.fromEntries(slotEntries);

    const upcomingBookings = bookingsSnapshot.docs
      .map((doc) => {
        const booking = doc.data() as BookingDoc;
        const slot = slotMap[booking.classSlotId];
        return {
          bookingId: doc.id,
          classSlotId: booking.classSlotId,
          startsAt: slot?.startsAt ?? null,
          bookedAt: booking.bookedAt,
        };
      })
      .filter((booking) => !booking.startsAt || booking.startsAt >= nowIso)
      .sort((a, b) => String(a.startsAt ?? "").localeCompare(String(b.startsAt ?? "")));

    return NextResponse.json({
      ok: true,
      email: user.email,
      canBook: !!activePurchase,
      balance: activePurchase
        ? {
            packageType: activePurchase.packageType ?? null,
            productName: activePurchase.productName ?? null,
            remainingCredits: activePurchase.packageType === "credits" ? activePurchase.remainingCredits ?? 0 : null,
            expiresAt: activePurchase.expiresAt ?? null,
          }
        : null,
      upcomingBookings,
    });
  } catch (error) {
    return whatsappErrorResponse(error);
  }
}
