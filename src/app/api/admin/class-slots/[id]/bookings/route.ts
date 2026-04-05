import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { serializeFirestore } from "@/lib/firestore-serialize";
import { forbiddenResponse, getRequiredUser, unauthorizedResponse, userIsAdmin } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getRequiredUser();
  if (!userIsAdmin(user)) {
    throw new Error("FORBIDDEN");
  }
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    const snapshot = await adminDb.collection("bookings").where("classSlotId", "==", id).get();
    const rawItems = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...serializeFirestore(doc.data()),
      }))
      .sort((a, b) =>
        String((a as Record<string, unknown>).bookedAt ?? "").localeCompare(
          String((b as Record<string, unknown>).bookedAt ?? ""),
        ),
      );

    // Batch-fetch student names from profiles
    const uids = rawItems
      .map((item) => String((item as Record<string, unknown>).userId ?? ""))
      .filter(Boolean);

    const profileMap = new Map<string, string>();
    if (uids.length > 0) {
      const profileDocs = await Promise.all(
        uids.map((uid) => adminDb.collection("profiles").doc(uid).get()),
      );
      profileDocs.forEach((doc, i) => {
        if (doc.exists) {
          const data = doc.data() as { fullName?: string };
          if (data.fullName) profileMap.set(uids[i], data.fullName);
        }
      });
    }

    const items = rawItems.map((item) => {
      const rec = item as Record<string, unknown>;
      const uid = String(rec.userId ?? "");
      return { ...item, fullName: profileMap.get(uid) ?? null };
    });

    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to fetch slot bookings" }, { status: 500 });
  }
}
