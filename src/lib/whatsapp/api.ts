import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const WHATSAPP_CONTACTS_COLLECTION = "whatsappContacts";

export type WhatsappContactDoc = {
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type ResolvedWhatsappUser = {
  uid: string;
  email: string;
  phone: string;
};

/** Keep digits only: "+51 987-654-321" -> "51987654321". */
export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * WhatsApp delivers numbers in full international format without "+",
 * while the contact list may store them as local 9-digit Peruvian numbers.
 * Try both shapes so either format works on both sides.
 */
function phoneCandidates(digits: string): string[] {
  const candidates = new Set<string>([digits]);
  if (digits.length > 9) candidates.add(digits.slice(-9));
  if (digits.length === 9) candidates.add(`51${digits}`);
  return [...candidates];
}

export function requireWhatsappApiKey(request: NextRequest) {
  const expected = process.env.WHATSAPP_API_KEY;
  if (!expected) {
    throw new Error("WHATSAPP_API_NOT_CONFIGURED");
  }

  const provided = request.headers.get("x-api-key") ?? "";
  const providedHash = createHash("sha256").update(provided).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  if (!timingSafeEqual(providedHash, expectedHash)) {
    throw new Error("INVALID_API_KEY");
  }
}

export async function findWhatsappContact(rawPhone: string) {
  const digits = normalizePhone(rawPhone);
  if (!digits) {
    throw new Error("PHONE_REQUIRED");
  }

  for (const candidate of phoneCandidates(digits)) {
    const snapshot = await adminDb.collection(WHATSAPP_CONTACTS_COLLECTION).doc(candidate).get();
    if (snapshot.exists) {
      return { id: snapshot.id, ...(snapshot.data() as WhatsappContactDoc) };
    }
  }

  return null;
}

/**
 * Resolves the WhatsApp sender phone to a site account: the phone must exist
 * in the whatsappContacts allowlist and its email must match a Firebase user.
 */
export async function resolveUserByPhone(rawPhone: string): Promise<ResolvedWhatsappUser> {
  const contact = await findWhatsappContact(rawPhone);
  if (!contact) {
    throw new Error("PHONE_NOT_REGISTERED");
  }

  const user = await adminAuth.getUserByEmail(contact.email).catch(() => null);
  if (!user) {
    throw new Error("ACCOUNT_NOT_FOUND");
  }

  return { uid: user.uid, email: contact.email, phone: contact.id };
}

const ERROR_STATUS: Record<string, number> = {
  WHATSAPP_API_NOT_CONFIGURED: 503,
  INVALID_API_KEY: 401,
  PHONE_REQUIRED: 400,
  PHONE_NOT_REGISTERED: 404,
  ACCOUNT_NOT_FOUND: 404,
  BOOKING_NOT_FOUND: 404,
  BOOKING_NOT_OWNED: 403,
  CLASS_SLOT_NOT_FOUND: 404,
};

export function whatsappErrorResponse(error: unknown) {
  if (error instanceof Error) {
    const status = ERROR_STATUS[error.message] ?? 400;
    return NextResponse.json({ ok: false, error: error.message }, { status });
  }
  return NextResponse.json({ ok: false, error: "INTERNAL_ERROR" }, { status: 500 });
}
