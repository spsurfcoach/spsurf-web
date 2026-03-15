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

export async function GET() {
  try {
    await requireAdmin();
    const snapshot = await adminDb.collection("classSlots").orderBy("startsAt", "asc").get();
    return NextResponse.json({
      items: snapshot.docs.map((doc) => ({
        id: doc.id,
        ...serializeFirestore(doc.data()),
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to fetch class slots" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as {
      startsAt: string;
      capacity: number;
      isActive?: boolean;
      coachNotes?: string;
    };
    const now = new Date().toISOString();
    const ref = await adminDb.collection("classSlots").add({
      startsAt: body.startsAt,
      capacity: Number(body.capacity),
      enrolledCount: 0,
      isActive: body.isActive ?? true,
      coachNotes: body.coachNotes ?? "",
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to create class slot" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as { id?: string; patch?: Record<string, unknown> };
    if (!body.id || !body.patch) {
      return NextResponse.json({ error: "id and patch are required" }, { status: 400 });
    }
    await adminDb
      .collection("classSlots")
      .doc(body.id)
      .set({ ...body.patch, updatedAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to update class slot" }, { status: 500 });
  }
}
