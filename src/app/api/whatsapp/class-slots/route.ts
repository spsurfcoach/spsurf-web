import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import type { ClassSlotDoc } from "@/lib/booking/types";
import { requireWhatsappApiKey, whatsappErrorResponse } from "@/lib/whatsapp/api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireWhatsappApiKey(request);

    const nowIso = new Date().toISOString();
    const snapshot = await adminDb
      .collection("classSlots")
      .where("startsAt", ">=", nowIso)
      .orderBy("startsAt", "asc")
      .get();

    const items = snapshot.docs
      .map((doc) => {
        const slot = doc.data() as ClassSlotDoc & { location?: string };
        return {
          id: doc.id,
          startsAt: slot.startsAt,
          capacity: slot.capacity,
          enrolledCount: slot.enrolledCount,
          spotsLeft: Math.max(0, slot.capacity - slot.enrolledCount),
          location: slot.location ?? null,
          isActive: slot.isActive,
        };
      })
      .filter((slot) => slot.isActive !== false && slot.spotsLeft > 0);

    return NextResponse.json({ ok: true, items });
  } catch (error) {
    return whatsappErrorResponse(error);
  }
}
