import { NextResponse } from "next/server";
import { listStorefrontProducts } from "@/lib/booking/storefront.server";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await listStorefrontProducts();
  return NextResponse.json({ items });
}
