import { NextRequest, NextResponse } from "next/server";
import { getStorefrontProductById } from "@/lib/booking/storefront.server";
import { buildSurftripProductId } from "@/lib/booking/storefront";
import { getPreferenceClient } from "@/lib/mercadopago/client";
import { getRequiredUser, unauthorizedResponse } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getRequiredUser();
    const body = (await request.json()) as { surftripId?: string };
    if (!body.surftripId) {
      return NextResponse.json({ error: "surftripId is required" }, { status: 400 });
    }

    const productId = buildSurftripProductId(body.surftripId);
    const product = await getStorefrontProductById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Surftrip not found or inactive" }, { status: 404 });
    }
    if ((product.enrolledCount ?? 0) >= (product.capacity ?? 0)) {
      return NextResponse.json({ error: "Surftrip is full" }, { status: 409 });
    }

    const preference = getPreferenceClient();
    const appOrigin = process.env.APP_URL ?? request.nextUrl.origin;
    const successUrl = process.env.MP_SUCCESS_URL ?? `${appOrigin}/clases?tab=comprar&payment=success`;
    const failureUrl = process.env.MP_FAILURE_URL ?? `${appOrigin}/clases?tab=comprar&payment=failure`;
    const pendingUrl = process.env.MP_PENDING_URL ?? `${appOrigin}/clases?tab=comprar&payment=pending`;
    const notificationUrl = `${appOrigin}/api/webhooks/mercadopago`;
    const isLocalhost = appOrigin.includes("localhost") || appOrigin.includes("127.0.0.1");

    const result = await preference.create({
      body: {
        items: [
          {
            id: productId,
            title: product.name,
            quantity: 1,
            currency_id: "PEN",
            unit_price: Number(product.price),
          },
        ],
        metadata: {
          productId,
          productCategory: product.category,
          fulfillmentType: product.fulfillmentType,
          sourceCollection: product.sourceCollection,
          sourceId: product.sourceId,
          surftripId: body.surftripId,
          userId: user.uid,
          userEmail: user.email ?? "",
        },
        external_reference: `${user.uid}:${productId}`,
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        ...(isLocalhost ? {} : { notification_url: notificationUrl, auto_return: "approved" as const }),
      },
    });

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point ?? null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("[checkout/surftrip] Failed to create checkout:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to create checkout", detail }, { status: 500 });
  }
}
