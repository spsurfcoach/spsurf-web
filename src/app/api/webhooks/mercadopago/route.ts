import { createHmac } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  createDirectPurchaseFromPayment,
  createPackagePurchaseFromPayment,
  createSurftripBookingFromPayment,
} from "@/lib/booking/transactions";
import { getPaymentClient } from "@/lib/mercadopago/client";

type MercadoPagoWebhook = {
  type?: string;
  action?: string;
  data?: { id?: string };
  id?: number;
};

export const dynamic = "force-dynamic";

function revalidateSurftripPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/surftrips");
  revalidatePath("/clases");
  if (slug) {
    revalidatePath(`/surftrips/${slug}`);
  }
}

function signatureIsValid(request: NextRequest, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;

  const signatureHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id") ?? "";
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => p.trim().split("=")),
  );
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  // MP signs the template string, not the raw body
  const template = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(template).digest("hex");
  return expected === v1;
}

export async function POST(request: NextRequest) {
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Failed to read body" }, { status: 400 });
  }

  let payload: MercadoPagoWebhook;
  try {
    payload = JSON.parse(rawBody) as MercadoPagoWebhook;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const paymentId = payload.data?.id ?? String(payload.id ?? "");
  const notificationType = payload.type ?? payload.action;

  if (!paymentId || !notificationType?.includes("payment")) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  if (!signatureIsValid(request, paymentId)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const paymentClient = getPaymentClient();
    const payment = await paymentClient.get({ id: paymentId });

    if (payment.status !== "approved") {
      return NextResponse.json({ ok: true, paymentStatus: payment.status });
    }

    const metadata = (payment.metadata ?? {}) as {
      userId?: string;
      productId?: string;
      productCategory?: string;
      fulfillmentType?: string;
      sourceCollection?: string;
      sourceId?: string;
      packageId?: string;
      surftripId?: string;
    };

    if (!metadata.userId) {
      return NextResponse.json({ error: "Missing userId in metadata" }, { status: 400 });
    }

    const preferenceId = String(payment.order?.id ?? payment.id);

    if (metadata.fulfillmentType === "surftrip_booking" || metadata.productCategory === "surftrip") {
      if (!metadata.surftripId) {
        return NextResponse.json({ error: "Missing surftripId in metadata" }, { status: 400 });
      }
      const result = await createSurftripBookingFromPayment({
        userId: metadata.userId,
        surftripId: metadata.surftripId,
        productId: metadata.productId,
        paymentId: String(payment.id),
        preferenceId,
      });
      revalidateSurftripPaths(result.slug);
      return NextResponse.json({ ok: true, ...result });
    }

    if (metadata.fulfillmentType === "direct_purchase") {
      if (!metadata.productId) {
        return NextResponse.json({ error: "Missing productId in metadata" }, { status: 400 });
      }
      const result = await createDirectPurchaseFromPayment({
        userId: metadata.userId,
        productId: metadata.productId,
        paymentId: String(payment.id),
        preferenceId,
      });
      return NextResponse.json({ ok: true, ...result });
    }

    if (!metadata.packageId) {
      return NextResponse.json({ error: "Missing packageId in metadata" }, { status: 400 });
    }
    const result = await createPackagePurchaseFromPayment({
      userId: metadata.userId,
      packageId: metadata.packageId,
      productId: metadata.productId,
      paymentId: String(payment.id),
      preferenceId,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
