import "server-only";
import { createClient } from "next-sanity";
import type { DocumentReference } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { urlForImage } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";
import type { SurftripInventoryDoc } from "./types";

const SURFTRIP_INVENTORY_COLLECTION = "surftripInventory";
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const SANITY_READ_TOKEN = process.env.SANITY_API_READ_TOKEN;

const SURFTRIP_SYNC_QUERY = `
  *[_type == "surftrip" && _id == $id][0]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    startDate,
    endDate,
    shortDescription,
    price,
    capacity,
    isActive,
    country,
    level,
    cardImage,
    heroImage
  }
`;

const sanitySyncClient = SANITY_PROJECT_ID
  ? createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      token: SANITY_READ_TOKEN,
      useCdn: false,
      perspective: "published",
    })
  : null;

export type SanitySurftripSyncDoc = {
  _id: string;
  _updatedAt: string;
  title: string;
  slug?: string;
  startDate: string;
  endDate: string;
  shortDescription?: string;
  price?: number;
  capacity?: number;
  isActive?: boolean;
  country?: string;
  level?: string;
  cardImage?: SanityImage | null;
  heroImage?: SanityImage | null;
};

export type SurftripInventoryRecord = SurftripInventoryDoc & {
  id: string;
};

type CandidateRecord = SurftripInventoryRecord & {
  ref: DocumentReference;
};

function toNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toScore(candidate: SurftripInventoryRecord, documentId: string) {
  let score = 0;

  if (candidate.sanityDocumentId === documentId) score += 120;
  if (candidate.id === documentId) score += 60;
  if (candidate.enrolledCount > 0) score += 200 + candidate.enrolledCount;
  if (candidate.isActive) score += 20;
  if (candidate.supersededBySurftripId) score -= 200;

  const updatedAt = Date.parse(candidate.updatedAt || candidate.createdAt || "");
  return score * 1_000_000_000_000 + (Number.isNaN(updatedAt) ? 0 : updatedAt);
}

function sortCandidates(a: SurftripInventoryRecord, b: SurftripInventoryRecord, documentId: string) {
  return toScore(b, documentId) - toScore(a, documentId);
}

function normalizeSanityDocumentId(documentId: string) {
  return documentId.replace(/^drafts\./, "");
}

function imageUrl(image: SanityImage | null | undefined, width: number, height: number) {
  if (!image) return undefined;

  try {
    return urlForImage(image).width(width).height(height).fit("crop").url();
  } catch {
    return undefined;
  }
}

function isSyncableSurftrip(doc: SanitySurftripSyncDoc | null): doc is SanitySurftripSyncDoc {
  if (!doc) return false;

  const price = toNumber(doc.price);
  const capacity = toNumber(doc.capacity);
  return Boolean(
    doc.slug &&
      doc.title?.trim() &&
      doc.startDate &&
      doc.endDate &&
      price !== null &&
      price > 0 &&
      capacity !== null &&
      capacity > 0,
  );
}

function toRecord(ref: DocumentReference, data: SurftripInventoryDoc): CandidateRecord {
  return {
    id: ref.id,
    ref,
    ...data,
  };
}

async function loadInventoryCandidates(documentId: string, slug?: string) {
  const collection = adminDb.collection(SURFTRIP_INVENTORY_COLLECTION);
  const normalizedId = normalizeSanityDocumentId(documentId);

  const [directSnapshot, byDocumentIdSnapshot, bySlugSnapshot] = await Promise.all([
    collection.doc(normalizedId).get(),
    collection.where("sanityDocumentId", "==", normalizedId).get(),
    slug ? collection.where("sanitySlug", "==", slug).get() : Promise.resolve(null),
  ]);

  const candidates = new Map<string, CandidateRecord>();

  if (directSnapshot.exists) {
    candidates.set(directSnapshot.id, toRecord(directSnapshot.ref, directSnapshot.data() as SurftripInventoryDoc));
  }

  byDocumentIdSnapshot.docs.forEach((doc) => {
    candidates.set(doc.id, toRecord(doc.ref, doc.data() as SurftripInventoryDoc));
  });

  bySlugSnapshot?.docs.forEach((doc) => {
    candidates.set(doc.id, toRecord(doc.ref, doc.data() as SurftripInventoryDoc));
  });

  return [...candidates.values()].sort((a, b) => sortCandidates(a, b, normalizedId));
}

function buildSurftripInventoryPayload(
  document: SanitySurftripSyncDoc,
  existing?: SurftripInventoryDoc,
): SurftripInventoryDoc {
  const now = new Date().toISOString();

  return {
    sanityDocumentId: normalizeSanityDocumentId(document._id),
    sanitySlug: document.slug ?? existing?.sanitySlug ?? "",
    title: document.title,
    shortDescription: document.shortDescription?.trim() || existing?.shortDescription,
    cardImageUrl: imageUrl(document.cardImage, 1600, 1000) ?? existing?.cardImageUrl,
    heroImageUrl:
      imageUrl(document.heroImage ?? document.cardImage, 2200, 1300) ??
      existing?.heroImageUrl ??
      existing?.cardImageUrl,
    country: document.country?.trim() || existing?.country,
    level: document.level?.trim() || existing?.level,
    price: toNumber(document.price) ?? existing?.price ?? 0,
    currency: "PEN",
    capacity: toNumber(document.capacity) ?? existing?.capacity ?? 0,
    enrolledCount: existing?.enrolledCount ?? 0,
    startDate: document.startDate,
    endDate: document.endDate,
    isActive: document.isActive !== false,
    sanityUpdatedAt: document._updatedAt,
    syncedAt: now,
    supersededBySurftripId: null,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export function getSurftripAvailableSpots(capacity?: number, enrolledCount?: number) {
  return Math.max(0, Number(capacity ?? 0) - Number(enrolledCount ?? 0));
}

export async function fetchPublishedSurftripByDocumentId(documentId: string) {
  if (!sanitySyncClient) return null;

  return sanitySyncClient.fetch<SanitySurftripSyncDoc | null>(
    SURFTRIP_SYNC_QUERY,
    { id: normalizeSanityDocumentId(documentId) },
  );
}

export async function listSurftripInventory() {
  const snapshot = await adminDb.collection(SURFTRIP_INVENTORY_COLLECTION).orderBy("startDate", "asc").get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as SurftripInventoryDoc),
  }));
}

export async function upsertSurftripInventoryFromSanity(document: SanitySurftripSyncDoc) {
  const normalizedId = normalizeSanityDocumentId(document._id);
  const candidates = await loadInventoryCandidates(normalizedId, document.slug);
  const primary = candidates[0];
  const primaryRef = primary?.ref ?? adminDb.collection(SURFTRIP_INVENTORY_COLLECTION).doc(normalizedId);
  const payload = buildSurftripInventoryPayload(document, primary);
  const duplicates = candidates.filter((candidate) => candidate.id !== primaryRef.id);
  const now = payload.updatedAt;
  const batch = adminDb.batch();

  batch.set(primaryRef, payload, { merge: true });

  duplicates.forEach((candidate) => {
    batch.set(
      candidate.ref,
      {
        sanityDocumentId: normalizedId,
        isActive: false,
        supersededBySurftripId: primaryRef.id,
        syncedAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
  });

  await batch.commit();

  return {
    action: primary ? "updated" : "created",
    inventoryId: primaryRef.id,
    slug: payload.sanitySlug,
    duplicateIds: duplicates.map((candidate) => candidate.id),
  };
}

export async function deactivateSurftripInventorySync(input: { documentId: string; slug?: string }) {
  const normalizedId = normalizeSanityDocumentId(input.documentId);
  const candidates = await loadInventoryCandidates(normalizedId, input.slug);
  if (candidates.length === 0) return null;

  const now = new Date().toISOString();
  const batch = adminDb.batch();

  candidates.forEach((candidate) => {
    batch.set(
      candidate.ref,
      {
        sanityDocumentId: normalizedId,
        isActive: false,
        syncedAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
  });

  await batch.commit();

  return {
    action: "deactivated",
    inventoryIds: candidates.map((candidate) => candidate.id),
    slug: candidates[0]?.sanitySlug ?? input.slug ?? null,
  };
}

export async function syncSurftripInventoryByDocumentId(documentId: string) {
  const normalizedId = normalizeSanityDocumentId(documentId);
  const document = await fetchPublishedSurftripByDocumentId(normalizedId);

  if (!isSyncableSurftrip(document)) {
    return deactivateSurftripInventorySync({
      documentId: normalizedId,
      slug: document?.slug,
    });
  }

  return upsertSurftripInventoryFromSanity(document);
}

const SURFTRIP_ALL_SYNC_QUERY = `
  *[_type == "surftrip"]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    startDate,
    endDate,
    shortDescription,
    price,
    capacity,
    isActive,
    country,
    level,
    cardImage,
    heroImage
  }
`;

export async function syncAllSurftripInventory() {
  if (!sanitySyncClient) {
    throw new Error("Sanity client is not configured");
  }

  const documents = await sanitySyncClient.fetch<SanitySurftripSyncDoc[]>(SURFTRIP_ALL_SYNC_QUERY);
  const results: Array<{ documentId: string; title: string; action: string }> = [];

  for (const doc of documents) {
    const normalizedId = normalizeSanityDocumentId(doc._id);

    if (!isSyncableSurftrip(doc)) {
      const result = await deactivateSurftripInventorySync({
        documentId: normalizedId,
        slug: doc.slug,
      });
      results.push({ documentId: normalizedId, title: doc.title, action: result?.action ?? "skipped" });
      continue;
    }

    const result = await upsertSurftripInventoryFromSanity(doc);
    results.push({ documentId: normalizedId, title: doc.title, action: result.action });
  }

  return { synced: results.length, results };
}
