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
    const snapshot = await adminDb.collection("packages").orderBy("createdAt", "desc").get();
    return NextResponse.json({
      items: snapshot.docs.map((doc) => ({
        id: doc.id,
        ...serializeFirestore(doc.data()),
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as {
      name: string;
      type: "credits" | "unlimited" | "subscription";
      billingModel?: "one_time" | "subscription";
      billingCycleDays?: number;
      classCount?: number;
      durationDays?: number;
      price: number;
      isActive?: boolean;
    };

    if (body.type === "subscription" && !body.durationDays) {
      return NextResponse.json({ error: "durationDays is required for subscription packages" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const ref = await adminDb.collection("packages").add({
      ...body,
      billingModel: body.billingModel ?? (body.type === "subscription" ? "subscription" : "one_time"),
      billingCycleDays: body.billingCycleDays ?? (body.type === "subscription" ? 30 : undefined),
      currency: "PEN",
      isActive: body.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
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
      .collection("packages")
      .doc(body.id)
      .set({ ...body.patch, updatedAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}
