import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createPurchaseFromPayment } from "@/lib/booking/transactions";
import { getPaymentClient } from "@/lib/mercadopago/client";

type MercadoPagoWebhook = {
  type?: string;
  action?: string;
  data?: { id?: string };
  id?: number;
};

export const dynamic = "force-dynamic";

function signatureIsValid(rawBody: string, request: NextRequest) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;

  const signatureHeader = request.headers.get("x-signature");
  if (!signatureHeader) return false;
  const v1 = signatureHeader
    .split(",")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith("v1="))
    ?.replace("v1=", "");

  if (!v1) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return expected === v1;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!signatureIsValid(rawBody, request)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody) as MercadoPagoWebhook;
    const paymentId = payload.data?.id ?? String(payload.id ?? "");
    const notificationType = payload.type ?? payload.action;

    if (!paymentId || !notificationType?.includes("payment")) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const paymentClient = getPaymentClient();
    const payment = await paymentClient.get({ id: paymentId });

    if (payment.status !== "approved") {
      return NextResponse.json({ ok: true, paymentStatus: payment.status });
    }

    const metadata = (payment.metadata ?? {}) as {
      userId?: string;
      packageId?: string;
    };

    if (!metadata.userId || !metadata.packageId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const result = await createPurchaseFromPayment({
      userId: metadata.userId,
      packageId: metadata.packageId,
      paymentId: String(payment.id),
      preferenceId: String(payment.order?.id ?? payment.id),
    });

    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
