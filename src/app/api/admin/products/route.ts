import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { listManagedProducts } from "@/lib/booking/storefront.server";
import type { ProductDoc } from "@/lib/booking/types";
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
    const items = await listManagedProducts();
    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as Partial<ProductDoc> & { id?: string };
    if (!body.name || !body.slug || !body.shortDescription || !body.category || !body.fulfillmentType || body.price == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const payload: ProductDoc = {
      slug: body.slug,
      name: body.name,
      shortDescription: body.shortDescription,
      description: body.description,
      category: body.category,
      fulfillmentType: body.fulfillmentType,
      price: body.price,
      currency: "PEN",
      isActive: body.isActive ?? true,
      image: body.image,
      badge: body.badge,
      features: body.features,
      sortOrder: body.sortOrder,
      sourceCollection: body.sourceCollection,
      sourceId: body.sourceId,
      packageType: body.packageType,
      classCount: body.classCount,
      durationDays: body.durationDays,
      capacity: body.capacity,
      enrolledCount: body.enrolledCount,
      startDate: body.startDate,
      endDate: body.endDate,
      createdAt: now,
      updatedAt: now,
    };

    const collection = adminDb.collection("products");
    if (body.id) {
      await collection.doc(body.id).set(payload, { merge: true });
      return NextResponse.json({ id: body.id }, { status: 201 });
    }

    const ref = await collection.add(payload);
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as { id?: string; patch?: Partial<ProductDoc> };
    if (!body.id || !body.patch) {
      return NextResponse.json({ error: "id and patch are required" }, { status: 400 });
    }

    await adminDb
      .collection("products")
      .doc(body.id)
      .set({ ...body.patch, updatedAt: new Date().toISOString() }, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorizedResponse();
    if (error instanceof Error && error.message === "FORBIDDEN") return forbiddenResponse();
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
