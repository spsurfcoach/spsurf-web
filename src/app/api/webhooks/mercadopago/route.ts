import { createHmac } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseSourceProductId } from "@/lib/booking/storefront";
import {
  createDirectPurchaseFromPayment,
  createPackagePurchaseFromPayment,
  createSurftripBookingFromPayment,
  handlePreapprovalWebhook,
  handleSubscriptionPayment,
} from "@/lib/booking/transactions";
import { getPaymentClient } from "@/lib/mercadopago/client";

type MercadoPagoWebhook = {
  type?: string;
  action?: string;
  data?: { id?: string };
  id?: number;
};

const LOG = "[webhook/mp]";

export const dynamic = "force-dynamic";

function revalidateSurftripPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/surftrips");
  revalidatePath("/clases");
  if (slug) {
    revalidatePath(`/surftrips/${slug}`);
  }
}

// MP normalizes preference metadata keys to snake_case when fetched back via
// Payment.get. Read both casings so the webhook never silently fails on a
// camelCase miss.
function pickMeta<T = string>(
  meta: Record<string, unknown>,
  ...keys: string[]
): T | undefined {
  for (const key of keys) {
    const snake = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    const value = meta[key] ?? meta[snake];
    if (value !== undefined && value !== null && value !== "") {
      return value as T;
    }
  }
  return undefined;
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
  const requestId = request.headers.get("x-request-id");

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

  // MP signs the value of the `data.id` query parameter; prefer that over the
  // body so signature verification stays consistent across notification flavors.
  const queryDataId = request.nextUrl.searchParams.get("data.id") ?? "";
  const paymentId = queryDataId || payload.data?.id || String(payload.id ?? "");
  const notificationType = payload.type ?? payload.action;

  // Handle subscription preapproval status updates
  if (notificationType === "subscription_preapproval") {
    const preapprovalId = queryDataId || payload.data?.id || String(payload.id ?? "");
    if (!preapprovalId) {
      return NextResponse.json({ ok: true, skipped: true });
    }
    try {
      const result = await handlePreapprovalWebhook(preapprovalId);
      console.log(`${LOG} subscription preapproval updated`, { preapprovalId, requestId, ...result });
      return NextResponse.json({ ok: true, ...result });
    } catch (error) {
      console.error(`${LOG} preapproval webhook failed`, { preapprovalId, requestId, error });
      return NextResponse.json({ error: "Preapproval webhook failed" }, { status: 500 });
    }
  }

  if (!paymentId || !notificationType?.includes("payment")) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  if (!signatureIsValid(request, paymentId)) {
    console.warn(`${LOG} invalid signature`, { paymentId, requestId });
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const paymentClient = getPaymentClient();
    const payment = await paymentClient.get({ id: paymentId });

    if (payment.status !== "approved") {
      return NextResponse.json({ ok: true, paymentStatus: payment.status });
    }

    // Subscription recurring payment — update lastPaymentDate and return early
    const operationType = (payment as unknown as Record<string, unknown>).operation_type as string | undefined;
    if (operationType === "recurring_payment" || operationType === "subscription_payment") {
      const result = await handleSubscriptionPayment(String(payment.id));
      console.log(`${LOG} subscription payment processed`, { paymentId: String(payment.id), requestId, ...result });
      return NextResponse.json({ ok: true, ...result });
    }

    const meta = (payment.metadata ?? {}) as Record<string, unknown>;
    const metaUserId = pickMeta<string>(meta, "userId");
    const metaProductId = pickMeta<string>(meta, "productId");
    const metaProductCategory = pickMeta<string>(meta, "productCategory");
    const metaFulfillmentType = pickMeta<string>(meta, "fulfillmentType");
    const metaPackageId = pickMeta<string>(meta, "packageId");
    const metaSurftripId = pickMeta<string>(meta, "surftripId");

    // external_reference is set as `${user.uid}:${productId}` by both checkout
    // routes. Use it as a safety net if MP drops or renames metadata keys.
    const externalReference = String(payment.external_reference ?? "");
    let resolvedUserId = metaUserId;
    let resolvedProductId = metaProductId;
    if ((!resolvedUserId || !resolvedProductId) && externalReference.includes(":")) {
      const [refUser, ...refProductParts] = externalReference.split(":");
      resolvedUserId ||= refUser;
      resolvedProductId ||= refProductParts.join(":");
    }

    if (!resolvedUserId) {
      console.error(`${LOG} missing userId`, {
        paymentId,
        requestId,
        externalReference,
        metaKeys: Object.keys(meta),
      });
      // Return 200 so MP stops retrying a permanently broken payload; the log
      // above gives us everything needed to recover manually.
      return NextResponse.json({ ok: false, reason: "missing-user" });
    }

    const parsedProduct = resolvedProductId ? parseSourceProductId(resolvedProductId) : null;
    const resolvedFulfillment =
      metaFulfillmentType ??
      (parsedProduct?.kind === "surftrip"
        ? "surftrip_booking"
        : parsedProduct?.kind === "package"
          ? "class_booking"
          : "direct_purchase");
    const resolvedPackageId =
      metaPackageId ?? (parsedProduct?.kind === "package" ? parsedProduct.sourceId : undefined);
    const resolvedSurftripId =
      metaSurftripId ?? (parsedProduct?.kind === "surftrip" ? parsedProduct.sourceId : undefined);

    const preferenceId = String(payment.order?.id ?? payment.id);
    const stringPaymentId = String(payment.id);

    if (resolvedFulfillment === "surftrip_booking" || metaProductCategory === "surftrip") {
      if (!resolvedSurftripId) {
        console.error(`${LOG} missing surftripId`, {
          paymentId,
          requestId,
          externalReference,
          metaKeys: Object.keys(meta),
        });
        return NextResponse.json({ ok: false, reason: "missing-surftrip" });
      }
      const result = await createSurftripBookingFromPayment({
        userId: resolvedUserId,
        surftripId: resolvedSurftripId,
        productId: resolvedProductId,
        paymentId: stringPaymentId,
        preferenceId,
      });
      revalidateSurftripPaths(result.slug);
      console.log(`${LOG} surftrip booking fulfilled`, {
        paymentId: stringPaymentId,
        userId: resolvedUserId,
        surftripId: resolvedSurftripId,
        bookingId: result.bookingId,
        idempotent: result.idempotent,
      });
      return NextResponse.json({ ok: true, ...result });
    }

    if (resolvedFulfillment === "direct_purchase") {
      if (!resolvedProductId) {
        console.error(`${LOG} missing productId`, {
          paymentId,
          requestId,
          externalReference,
          metaKeys: Object.keys(meta),
        });
        return NextResponse.json({ ok: false, reason: "missing-product" });
      }
      const result = await createDirectPurchaseFromPayment({
        userId: resolvedUserId,
        productId: resolvedProductId,
        paymentId: stringPaymentId,
        preferenceId,
      });
      console.log(`${LOG} direct purchase fulfilled`, {
        paymentId: stringPaymentId,
        userId: resolvedUserId,
        productId: resolvedProductId,
        purchaseId: result.purchaseId,
        idempotent: result.idempotent,
      });
      return NextResponse.json({ ok: true, ...result });
    }

    if (!resolvedPackageId) {
      console.error(`${LOG} missing packageId`, {
        paymentId,
        requestId,
        externalReference,
        metaKeys: Object.keys(meta),
      });
      return NextResponse.json({ ok: false, reason: "missing-package" });
    }
    const result = await createPackagePurchaseFromPayment({
      userId: resolvedUserId,
      packageId: resolvedPackageId,
      productId: resolvedProductId,
      paymentId: stringPaymentId,
      preferenceId,
    });
    console.log(`${LOG} package purchase fulfilled`, {
      paymentId: stringPaymentId,
      userId: resolvedUserId,
      packageId: resolvedPackageId,
      purchaseId: result.purchaseId,
      idempotent: result.idempotent,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error(`${LOG} processing failed`, {
      paymentId,
      requestId,
      error:
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error,
    });
    // Keep 500 for transient failures so MP retries.
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
