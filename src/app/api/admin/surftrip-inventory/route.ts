import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import {
  listSurftripInventory,
  syncAllSurftripInventory,
  syncSurftripInventoryByDocumentId,
} from "@/lib/booking/surftrip-sync";
import type { SurftripInventoryDoc } from "@/lib/booking/types";
import { serializeFirestore } from "@/lib/firestore-serialize";
import { forbiddenResponse, getRequiredUser, unauthorizedResponse, userIsAdmin } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getRequiredUser();
  if (!userIsAdmin(user)) throw new Error("FORBIDDEN");
}

function revalidateSurftripPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/surftrips");
  revalidatePath("/clases");
  if (slug) {
    revalidatePath(`/surftrips/${slug}`);
  }
}

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({
      items: (await listSurftripInventory()).map((item) => serializeFirestore(item)),
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
      sanityDocumentId?: string;
    };

    if (!body.sanityDocumentId) {
      return NextResponse.json({ error: "sanityDocumentId is required" }, { status: 400 });
    }

    const result = await syncSurftripInventoryByDocumentId(body.sanityDocumentId);
    revalidateSurftripPaths(result?.slug ?? undefined);
    return NextResponse.json({ ok: true, result }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to sync surftrip" }, { status: 500 });
  }
}

export async function PUT() {
  try {
    await requireAdmin();
    const result = await syncAllSurftripInventory();
    revalidateSurftripPaths();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    console.error("[admin/surftrip-inventory] Bulk sync failed:", error);
    return NextResponse.json({ error: "Failed to sync surftrips from Sanity" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as { id?: string; patch?: { isActive?: boolean } };
    if (!body.id || !body.patch || typeof body.patch.isActive !== "boolean") {
      return NextResponse.json({ error: "id and patch.isActive are required" }, { status: 400 });
    }
    const currentSnapshot = await adminDb.collection("surftripInventory").doc(body.id).get();
    await adminDb
      .collection("surftripInventory")
      .doc(body.id)
      .set({ isActive: body.patch.isActive, updatedAt: new Date().toISOString() }, { merge: true });
    revalidateSurftripPaths((currentSnapshot.data() as SurftripInventoryDoc | undefined)?.sanitySlug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to update surftrip" }, { status: 500 });
  }
}
