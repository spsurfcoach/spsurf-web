import { NextRequest, NextResponse } from "next/server";
import { getPackageById } from "@/lib/booking/transactions";
import { getPreferenceClient } from "@/lib/mercadopago/client";
import { getRequiredUser, unauthorizedResponse } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getRequiredUser();
    const body = (await request.json()) as { packageId?: string };
    if (!body.packageId) {
      return NextResponse.json({ error: "packageId is required" }, { status: 400 });
    }

    const packageData = await getPackageById(body.packageId);
    if (!packageData || packageData.isActive === false) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const preference = getPreferenceClient();
    const appOrigin = request.nextUrl.origin;
    const successUrl = process.env.MP_SUCCESS_URL ?? `${appOrigin}/clases?payment=success`;
    const failureUrl = process.env.MP_FAILURE_URL ?? `${appOrigin}/clases?payment=failure`;
    const pendingUrl = process.env.MP_PENDING_URL ?? `${appOrigin}/clases?payment=pending`;
    const notificationUrl = `${appOrigin}/api/webhooks/mercadopago`;

    const result = await preference.create({
      body: {
        items: [
          {
            id: body.packageId,
            title: String(packageData.name),
            quantity: 1,
            currency_id: "PEN",
            unit_price: Number(packageData.price),
          },
        ],
        metadata: {
          packageId: body.packageId,
          userId: user.uid,
          userEmail: user.email ?? "",
        },
        external_reference: `${user.uid}:${body.packageId}`,
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
