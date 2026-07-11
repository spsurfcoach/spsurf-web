import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import {
  normalizePhone,
  requireWhatsappApiKey,
  WHATSAPP_CONTACTS_COLLECTION,
  whatsappErrorResponse,
  type WhatsappContactDoc,
} from "@/lib/whatsapp/api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireWhatsappApiKey(request);

    const snapshot = await adminDb.collection(WHATSAPP_CONTACTS_COLLECTION).get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as WhatsappContactDoc) }));

    return NextResponse.json({ ok: true, items, total: items.length });
  } catch (error) {
    return whatsappErrorResponse(error);
  }
}

type ContactInput = { phone?: string; email?: string };

export async function POST(request: NextRequest) {
  try {
    requireWhatsappApiKey(request);
    const body = (await request.json()) as { contacts?: ContactInput[] } | ContactInput;

    const contacts = Array.isArray((body as { contacts?: ContactInput[] }).contacts)
      ? (body as { contacts: ContactInput[] }).contacts
      : [body as ContactInput];

    const now = new Date().toISOString();
    const batch = adminDb.batch();
    const saved: string[] = [];
    const skipped: ContactInput[] = [];

    const validContacts = contacts.flatMap((contact) => {
      const phone = normalizePhone(contact.phone ?? "");
      const email = contact.email?.trim().toLowerCase();
      if (!phone || !email || !email.includes("@")) {
        skipped.push(contact);
        return [];
      }
      return [{ phone, email }];
    });

    const refs = validContacts.map(({ phone }) => adminDb.collection(WHATSAPP_CONTACTS_COLLECTION).doc(phone));
    const existingSnapshots = refs.length > 0 ? await adminDb.getAll(...refs) : [];

    validContacts.forEach(({ phone, email }, index) => {
      const existing = existingSnapshots[index];
      batch.set(refs[index], {
        phone,
        email,
        updatedAt: now,
        createdAt: existing?.exists ? (existing.data() as WhatsappContactDoc).createdAt ?? now : now,
      });
      saved.push(phone);
    });

    if (saved.length > 0) {
      await batch.commit();
    }

    return NextResponse.json({ ok: true, saved: saved.length, skipped });
  } catch (error) {
    return whatsappErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireWhatsappApiKey(request);
    const phone = normalizePhone(request.nextUrl.searchParams.get("phone") ?? "");

    if (!phone) {
      return NextResponse.json({ ok: false, error: "PHONE_REQUIRED" }, { status: 400 });
    }

    await adminDb.collection(WHATSAPP_CONTACTS_COLLECTION).doc(phone).delete();

    return NextResponse.json({ ok: true, phone });
  } catch (error) {
    return whatsappErrorResponse(error);
  }
}
