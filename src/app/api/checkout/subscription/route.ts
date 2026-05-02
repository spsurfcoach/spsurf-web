import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getPreApprovalClient } from "@/lib/mercadopago/client";
import { getRequiredUser, unauthorizedResponse } from "@/lib/server-auth";
import { createSubscriptionPurchase } from "@/lib/booking/transactions";
import { buildPackageProductId } from "@/lib/booking/storefront";
import type { PackageDoc } from "@/lib/booking/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getRequiredUser();
    const body = (await request.json()) as { packageId?: string };

    if (!body.packageId) {
      return NextResponse.json({ error: "packageId is required" }, { status: 400 });
    }

    const packageSnapshot = await adminDb.collection("packages").doc(body.packageId).get();
    if (!packageSnapshot.exists) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const pkg = packageSnapshot.data() as PackageDoc;

    if (!pkg.isActive) {
      return NextResponse.json({ error: "Package is not active" }, { status: 400 });
    }

    if (pkg.type !== "subscription" || pkg.billingModel !== "subscription") {
      return NextResponse.json({ error: "Package is not a subscription plan" }, { status: 400 });
    }

    if (!pkg.durationDays || !pkg.price) {
      return NextResponse.json({ error: "Package is missing durationDays or price" }, { status: 400 });
    }

    const appOrigin = process.env.APP_URL ?? request.nextUrl.origin;
    const backUrl = process.env.MP_SUCCESS_URL ?? `${appOrigin}/clases?tab=comprar&payment=success`;

    const now = new Date();
    const endDate = new Date(now.getTime() + pkg.durationDays * 24 * 60 * 60 * 1000);

    const preapprovalClient = getPreApprovalClient();
    const result = await preapprovalClient.create({
      body: {
        reason: pkg.name,
        payer_email: user.email ?? "",
        back_url: backUrl,
        external_reference: `${user.uid}:${buildPackageProductId(body.packageId)}`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          start_date: now.toISOString(),
          end_date: endDate.toISOString(),
          transaction_amount: Number(pkg.price),
          currency_id: "PEN",
        },
        status: "pending",
      },
    });

    if (!result.id) {
      return NextResponse.json({ error: "Failed to create preapproval" }, { status: 500 });
    }

    const { purchaseId } = await createSubscriptionPurchase({
      userId: user.uid,
      packageId: body.packageId,
      productId: buildPackageProductId(body.packageId),
      preapprovalId: String(result.id),
    });

    const resultAny = result as unknown as Record<string, unknown>;
    return NextResponse.json({
      preapprovalId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: (resultAny.sandbox_init_point as string | undefined) ?? null,
      purchaseId,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("[checkout/subscription] Failed to create subscription:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to create subscription", detail }, { status: 500 });
  }
}
