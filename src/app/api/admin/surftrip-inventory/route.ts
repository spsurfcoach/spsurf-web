import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { serializeFirestore } from "@/lib/firestore-serialize";
import { forbiddenResponse, getRequiredUser, unauthorizedResponse, userIsAdmin } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getRequiredUser();
  if (!userIsAdmin(user)) throw new Error("FORBIDDEN");
}

export async function GET() {
  try {
    await requireAdmin();
    const snapshot = await adminDb.collection("surftripInventory").orderBy("startDate", "asc").get();
    return NextResponse.json({
      items: snapshot.docs.map((doc) => ({
        id: doc.id,
        ...serializeFirestore(doc.data()),
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to fetch surftrip inventory" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as {
      sanitySlug: string;
      title: string;
      price: number;
      capacity: number;
      startDate: string;
      endDate: string;
      isActive?: boolean;
    };

    if (!body.sanitySlug || !body.title || !body.price || !body.capacity || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const ref = await adminDb.collection("surftripInventory").add({
      sanitySlug: body.sanitySlug,
      title: body.title,
      price: body.price,
      currency: "PEN",
      capacity: body.capacity,
      enrolledCount: 0,
      startDate: body.startDate,
      endDate: body.endDate,
      isActive: body.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to create surftrip" }, { status: 500 });
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
      .collection("surftripInventory")
      .doc(body.id)
      .set({ ...body.patch, updatedAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to update surftrip" }, { status: 500 });
  }
}
