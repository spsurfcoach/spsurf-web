import { NextRequest, NextResponse } from "next/server";
import { getSurftripInventoryById } from "@/lib/booking/transactions";
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

    const surftrip = await getSurftripInventoryById(body.surftripId);
    if (!surftrip || !surftrip.isActive) {
      return NextResponse.json({ error: "Surftrip not found or inactive" }, { status: 404 });
    }
    if (surftrip.enrolledCount >= surftrip.capacity) {
      return NextResponse.json({ error: "Surftrip is full" }, { status: 409 });
    }

    const preference = getPreferenceClient();
    const appOrigin = request.nextUrl.origin;
    const successUrl = process.env.MP_SURFTRIP_SUCCESS_URL ?? `${appOrigin}/surftrips?payment=success`;
    const failureUrl = process.env.MP_FAILURE_URL ?? `${appOrigin}/surftrips?payment=failure`;
    const pendingUrl = process.env.MP_PENDING_URL ?? `${appOrigin}/surftrips?payment=pending`;
    const notificationUrl = `${appOrigin}/api/webhooks/mercadopago`;

    const result = await preference.create({
      body: {
        items: [
          {
            id: body.surftripId,
            title: surftrip.title,
            quantity: 1,
            currency_id: "PEN",
            unit_price: Number(surftrip.price),
          },
        ],
        metadata: {
          itemType: "surftrip",
          surftripId: body.surftripId,
          userId: user.uid,
          userEmail: user.email ?? "",
        },
        external_reference: `${user.uid}:surftrip:${body.surftripId}`,
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
