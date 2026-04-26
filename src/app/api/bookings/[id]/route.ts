import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { purchaseCanBookClasses } from "@/lib/booking/guards";
import { getRequiredUser, unauthorizedResponse } from "@/lib/server-auth";
import type { BookingDoc, PurchaseDoc } from "@/lib/booking/types";

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

    const bookingRef = adminDb.collection("bookings").doc(bookingId);

    await adminDb.runTransaction(async (transaction) => {
      const bookingSnap = await transaction.get(bookingRef);

      if (!bookingSnap.exists) {
        throw new Error("BOOKING_NOT_FOUND");
      }

      const booking = bookingSnap.data() as BookingDoc;

      if (booking.userId !== user.uid) {
        throw new Error("UNAUTHORIZED");
      }

      if (booking.status === "cancelled") {
        throw new Error("BOOKING_ALREADY_CANCELLED");
      }

      const now = new Date();

      // Enforce 12-hour cancellation window
      const slotRef = adminDb.collection("classSlots").doc(booking.classSlotId);
      const slotSnap = await transaction.get(slotRef);
      if (slotSnap.exists) {
        const slotData = slotSnap.data() as { startsAt?: string };
        if (slotData.startsAt) {
          const startsAt = new Date(slotData.startsAt);
          const hoursUntilClass = (startsAt.getTime() - now.getTime()) / (1000 * 60 * 60);
          if (hoursUntilClass < 12) {
            throw new Error("CANCELLATION_WINDOW_PASSED");
          }
        }
      }

      // All reads must finish before any writes (Firestore transaction rule).
      const purchaseRef = adminDb.collection("purchases").doc(booking.purchaseId);
      const purchaseSnap = await transaction.get(purchaseRef);

      const nowIso = now.toISOString();

      // Cancel the booking
      transaction.update(bookingRef, { status: "cancelled", updatedAt: nowIso });

      // Release the slot spot
      transaction.update(slotRef, {
        enrolledCount: FieldValue.increment(-1),
        updatedAt: nowIso,
      });

      // Refund credit if it was a credits package
      if (purchaseSnap.exists) {
        const purchase = purchaseSnap.data() as PurchaseDoc;
        if (purchaseCanBookClasses(purchase) && purchase.packageType === "credits") {
          transaction.update(purchaseRef, {
            remainingCredits: FieldValue.increment(1),
            updatedAt: nowIso,
          });
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Cancellation failed" }, { status: 500 });
  }
}
