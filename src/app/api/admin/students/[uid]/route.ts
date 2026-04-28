import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { serializeFirestore } from "@/lib/firestore-serialize";
import { forbiddenResponse, getRequiredUser, unauthorizedResponse, userIsAdmin } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getRequiredUser();
  if (!userIsAdmin(user)) {
    throw new Error("FORBIDDEN");
  }
}

export async function GET(_request: Request, context: { params: Promise<{ uid: string }> }) {
  try {
    await requireAdmin();
    const { uid } = await context.params;
    if (!uid || typeof uid !== "string") {
      return NextResponse.json({ error: "uid is required" }, { status: 400 });
    }

    const profileSnap = await adminDb.collection("profiles").doc(uid).get();
    let email: string | null = null;
    try {
      const record = await adminAuth.getUser(uid);
      email = record.email ?? null;
    } catch {
      email = null;
    }

    const profile = profileSnap.exists ? serializeFirestore(profileSnap.data() ?? {}) : null;

    return NextResponse.json({ uid, email, profile });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}
