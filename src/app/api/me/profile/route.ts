import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { serializeFirestore } from "@/lib/firestore-serialize";
import { getRequiredUser, unauthorizedResponse } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const doc = await adminDb.collection("profiles").doc(user.uid).get();
    if (!doc.exists) {
      return NextResponse.json({ profile: null });
    }
    return NextResponse.json({ profile: serializeFirestore(doc.data() ?? {}) });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getRequiredUser();
    const body = (await request.json()) as Record<string, unknown>;

    const now = new Date().toISOString();
    const docRef = adminDb.collection("profiles").doc(user.uid);
    const existing = await docRef.get();

    await docRef.set(
      {
        ...body,
        updatedAt: now,
        ...(existing.exists ? {} : { createdAt: now }),
      },
      { merge: true },
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
