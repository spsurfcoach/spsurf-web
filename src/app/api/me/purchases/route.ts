import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { serializeFirestore } from "@/lib/firestore-serialize";
import { getRequiredUser, unauthorizedResponse } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const snapshot = await adminDb.collection("purchases").where("userId", "==", user.uid).get();

    const items = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...serializeFirestore(doc.data()),
      }))
      .sort((a, b) =>
        String((b as Record<string, unknown>).createdAt ?? "").localeCompare(
          String((a as Record<string, unknown>).createdAt ?? ""),
        ),
      );

    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}
