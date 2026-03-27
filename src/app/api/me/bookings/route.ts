import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { serializeFirestore } from "@/lib/firestore-serialize";
import { getRequiredUser, unauthorizedResponse } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const snapshot = await adminDb.collection("bookings").where("userId", "==", user.uid).get();

    const classSlotIds = [...new Set(snapshot.docs.map((doc) => String(doc.data().classSlotId)))];
    const slotEntries = await Promise.all(
      classSlotIds.map(async (slotId) => {
        const slot = await adminDb.collection("classSlots").doc(slotId).get();
        return [slotId, slot.exists ? serializeFirestore(slot.data() ?? {}) : null] as const;
      }),
    );
    const slotMap = Object.fromEntries(slotEntries);

    const items = snapshot.docs
      .map((doc) => {
        const data = serializeFirestore(doc.data()) as Record<string, unknown>;
        return {
          id: doc.id,
          ...data,
          classSlot: slotMap[String(data.classSlotId)] ?? null,
        };
      })
      .sort((a, b) =>
        String((a as Record<string, unknown>).bookedAt ?? "").localeCompare(
          String((b as Record<string, unknown>).bookedAt ?? ""),
        ),
      );

    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
