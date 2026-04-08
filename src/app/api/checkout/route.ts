import { NextRequest, NextResponse } from "next/server";
import { getStorefrontProductById } from "@/lib/booking/storefront.server";
import { getPreferenceClient } from "@/lib/mercadopago/client";
import { getRequiredUser, unauthorizedResponse } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getRequiredUser();
    const body = (await request.json()) as { productId?: string };
    if (!body.productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const product = await getStorefrontProductById(body.productId);
    if (!product || product.isActive === false) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.fulfillmentType === "surftrip_booking" && product.capacity != null && product.enrolledCount != null) {
      if (product.enrolledCount >= product.capacity) {
        return NextResponse.json({ error: "Surftrip is full" }, { status: 409 });
      }
    }

    const preference = getPreferenceClient();
    const appOrigin = request.nextUrl.origin;
    const successUrl = process.env.MP_SUCCESS_URL ?? `${appOrigin}/clases?tab=comprar&payment=success`;
    const failureUrl = process.env.MP_FAILURE_URL ?? `${appOrigin}/clases?tab=comprar&payment=failure`;
    const pendingUrl = process.env.MP_PENDING_URL ?? `${appOrigin}/clases?tab=comprar&payment=pending`;
    const notificationUrl = `${appOrigin}/api/webhooks/mercadopago`;

    const result = await preference.create({
      body: {
        items: [
          {
            id: body.productId,
            title: String(product.name),
            quantity: 1,
            currency_id: "PEN",
            unit_price: Number(product.price),
          },
        ],
        metadata: {
          productId: body.productId,
          productCategory: product.category,
          fulfillmentType: product.fulfillmentType,
          sourceCollection: product.sourceCollection,
          sourceId: product.sourceId,
          packageId: product.sourceCollection === "packages" ? product.sourceId : undefined,
          surftripId: product.sourceCollection === "surftripInventory" ? product.sourceId : undefined,
          userId: user.uid,
          userEmail: user.email ?? "",
        },
        external_reference: `${user.uid}:${body.productId}`,
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        notification_url: notificationUrl,
        auto_return: "approved",
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
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
