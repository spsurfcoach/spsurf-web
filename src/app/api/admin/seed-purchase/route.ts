import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getRequiredUser, unauthorizedResponse } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

/**
 * Temporary dev-only endpoint.
 * POST /api/admin/seed-purchase
 * Creates a 10-credit test purchase for the currently logged-in user.
 * Delete this file once done testing.
 */
export async function POST() {
  try {
    const user = await getRequiredUser();

    const now = new Date().toISOString();
    const ref = adminDb.collection("purchases").doc();

    await ref.set({
      userId: user.uid,
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

    return NextResponse.json({ ok: true, purchaseId: ref.id, userId: user.uid, credits: 10 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    return NextResponse.json({ error: "Failed to seed purchase" }, { status: 500 });
  }
}
