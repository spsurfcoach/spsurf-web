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
    const items = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...serializeFirestore(doc.data()),
      }))
      .sort((a, b) =>
        String((a as Record<string, unknown>).bookedAt ?? "").localeCompare(
          String((b as Record<string, unknown>).bookedAt ?? ""),
        ),
      );
    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to fetch slot bookings" }, { status: 500 });
  }
}
