import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { serializeFirestore } from "@/lib/firestore-serialize";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await adminDb.collection("packages").orderBy("createdAt", "desc").get();
  const items = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...serializeFirestore(doc.data()),
    }))
    .filter((item) => (item as Record<string, unknown>).isActive !== false);
  return NextResponse.json({ items });
}
