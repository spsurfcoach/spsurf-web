import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { serializeFirestore } from "@/lib/firestore-serialize";
import { forbiddenResponse, getRequiredUser, unauthorizedResponse, userIsAdmin } from "@/lib/server-auth";
import type { PurchaseDoc } from "@/lib/booking/types";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getRequiredUser();
  if (!userIsAdmin(user)) {
    throw new Error("FORBIDDEN");
  }
}

export type StudentItem = {
  uid: string;
  email: string | null;
  packageType: "credits" | "unlimited" | null;
  remainingCredits: number | null;
  expiresAt: string | null;
  status: string | null;
  purchaseId: string | null;
  createdAt: string | null;
};

export async function GET() {
  try {
    await requireAdmin();

    // Fetch all purchases ordered by most recent first
    const snapshot = await adminDb.collection("purchases").orderBy("createdAt", "desc").get();

    const purchasesByUser = new Map<string, { id: string } & PurchaseDoc>();

    for (const doc of snapshot.docs) {
      const data = serializeFirestore(doc.data()) as PurchaseDoc;
      // Keep the most recent purchase per user (first one we see, since ordered desc)
      if (!purchasesByUser.has(data.userId)) {
        purchasesByUser.set(data.userId, { id: doc.id, ...data });
      }
    }

    const uids = Array.from(purchasesByUser.keys());

    // Batch fetch emails from Firebase Auth (max 100 at a time)
    const emailMap = new Map<string, string | null>();
    const batchSize = 100;
    for (let i = 0; i < uids.length; i += batchSize) {
      const batch = uids.slice(i, i + batchSize);
      const identifiers = batch.map((uid) => ({ uid }));
      try {
        const result = await adminAuth.getUsers(identifiers);
        for (const userRecord of result.users) {
          emailMap.set(userRecord.uid, userRecord.email ?? null);
        }
        // Users not found get null email
        for (const notFound of result.notFound) {
          if ("uid" in notFound) emailMap.set(notFound.uid as string, null);
        }
      } catch {
        // If auth lookup fails, continue with null emails
        for (const uid of batch) {
          emailMap.set(uid, null);
        }
      }
    }

    const students: StudentItem[] = uids.map((uid) => {
      const purchase = purchasesByUser.get(uid)!;
      return {
        uid,
        email: emailMap.get(uid) ?? null,
        packageType: purchase.packageType ?? null,
        remainingCredits: purchase.remainingCredits ?? null,
        expiresAt: purchase.expiresAt ?? null,
        status: purchase.status ?? null,
        purchaseId: purchase.id,
        createdAt: purchase.createdAt ?? null,
      };
    });

    // Sort by most recent purchase
    students.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt.localeCompare(a.createdAt);
    });

    return NextResponse.json({ items: students, total: students.length });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as { purchaseId?: string; delta?: number };
    if (!body.purchaseId || typeof body.delta !== "number" || body.delta === 0) {
      return NextResponse.json({ error: "purchaseId and non-zero delta are required" }, { status: 400 });
    }

    const docRef = adminDb.collection("purchases").doc(body.purchaseId);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    const data = doc.data() as { packageType?: string; remainingCredits?: number };
    if (data.packageType !== "credits") {
      return NextResponse.json({ error: "Only credit-type purchases can be adjusted" }, { status: 400 });
    }

    const current = data.remainingCredits ?? 0;
    const next = Math.max(0, current + body.delta);
    await docRef.set({ remainingCredits: next, updatedAt: new Date().toISOString() }, { merge: true });

    return NextResponse.json({ ok: true, remainingCredits: next });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
  }
}
