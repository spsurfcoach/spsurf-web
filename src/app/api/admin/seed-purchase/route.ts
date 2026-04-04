import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

/**
 * Temporary dev-only endpoint.
 * POST /api/admin/seed-purchase  body: { "userId": "<firebase-uid>" }
 * Creates a 10-credit test purchase for the given userId.
 * Delete this file once done testing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { userId?: string };
    if (!body.userId) {
      return NextResponse.json({ error: "userId is required in body" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const ref = adminDb.collection("purchases").doc();

    await ref.set({
      userId: body.userId,
      packageId: "seed-test",
      packageType: "credits",
      remainingCredits: 10,
      expiresAt: null,
      mercadopagoPaymentId: "seed-test",
      mercadopagoPreferenceId: "seed-test",
      status: "approved",
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ ok: true, purchaseId: ref.id, userId: body.userId, credits: 10 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
