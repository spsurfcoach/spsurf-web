import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { syncSurftripInventoryByDocumentId } from "@/lib/booking/surftrip-sync";

type SanitySurftripWebhookBody = {
  _id?: string;
  _type?: string;
  slug?: string;
};

export const dynamic = "force-dynamic";

function revalidateSurftripPaths(slugs: Array<string | null | undefined>) {
  const paths = new Set<string>(["/", "/surftrips", "/clases"]);

  slugs.forEach((slug) => {
    if (slug) {
      paths.add(`/surftrips/${slug}`);
    }
  });

  paths.forEach((path) => revalidatePath(path));
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_SURFTRIP_WEBHOOK_SECRET ?? process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing Sanity webhook secret" }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<SanitySurftripWebhookBody>(request, secret, true);

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature", body }, { status: 401 });
    }

    if (!body?._id) {
      return NextResponse.json({ error: "Missing _id in payload", body }, { status: 400 });
    }

    if (body._type && body._type !== "surftrip") {
      return NextResponse.json({ ok: true, skipped: true, reason: "ignored_type", body });
    }

    const result = await syncSurftripInventoryByDocumentId(body._id);
    revalidateSurftripPaths([body.slug, result?.slug ?? null]);

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
