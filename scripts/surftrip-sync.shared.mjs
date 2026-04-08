import "dotenv/config";
import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;
const defaultBackfillPrice = Number.parseFloat(process.env.SURFTRIP_BACKFILL_DEFAULT_PRICE_PEN || "1000");

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !token) {
  throw new Error("Missing Sanity env values. Required: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN or SANITY_API_READ_TOKEN");
}

if (!firebaseProjectId || !firebaseClientEmail || !firebasePrivateKey) {
  throw new Error("Missing Firebase env values. Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY");
}

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: "published",
});

const imageBuilder = createImageUrlBuilder(sanityClient);
const adminApp =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: firebaseProjectId,
      clientEmail: firebaseClientEmail,
      privateKey: firebasePrivateKey,
    }),
  });
const adminDb = getFirestore(adminApp);

const SURFTRIP_INVENTORY_COLLECTION = "surftripInventory";
const SURFTRIP_BACKFILL_QUERY = `
  *[_type == "surftrip"] | order(startDate asc) {
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
    heroImage,
    packageSection{
      priceLabel
    }
  }
`;

function normalizeSanityDocumentId(documentId) {
  return String(documentId).replace(/^drafts\./, "");
}

function extractSlug(slugValue) {
  if (typeof slugValue === "string") return slugValue;
  if (slugValue && typeof slugValue.current === "string") return slugValue.current;
  return undefined;
}

function toNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getImageUrl(image, width, height) {
  if (!image) return undefined;

  try {
    return imageBuilder.image(image).width(width).height(height).fit("crop").url();
  } catch {
    return undefined;
  }
}

function derivePriceFromPackageSection(doc) {
  const label = doc?.packageSection?.priceLabel;
  if (!label) return null;

  const numeric = String(label).replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(numeric);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

async function ensureSanityCommerceFields(doc, { dryRun = false } = {}) {
  const patch = {};

  if (toNumber(doc.price) === null) {
    const existingInventory = (await loadInventoryCandidates(doc._id, extractSlug(doc.slug)))[0];
    const derivedPrice =
      derivePriceFromPackageSection(doc) ??
      toNumber(existingInventory?.price) ??
      (Number.isFinite(defaultBackfillPrice) && defaultBackfillPrice > 0 ? defaultBackfillPrice : null);
    if (derivedPrice !== null) {
      patch.price = derivedPrice;
    }
  }

  if (typeof doc.isActive !== "boolean") {
    patch.isActive = true;
  }

  if (Object.keys(patch).length === 0) {
    return doc;
  }

  if (!dryRun) {
    await sanityClient.patch(doc._id).set(patch).commit();
  }

  return {
    ...doc,
    ...patch,
    _updatedAt: new Date().toISOString(),
  };
}

function candidateScore(candidate, documentId) {
  let score = 0;

  if (candidate.sanityDocumentId === documentId) score += 120;
  if (candidate.id === documentId) score += 60;
  if ((candidate.enrolledCount ?? 0) > 0) score += 200 + (candidate.enrolledCount ?? 0);
  if (candidate.isActive) score += 20;
  if (candidate.supersededBySurftripId) score -= 200;

  const updatedAt = Date.parse(candidate.updatedAt || candidate.createdAt || "");
  return score * 1_000_000_000_000 + (Number.isNaN(updatedAt) ? 0 : updatedAt);
}

async function loadInventoryCandidates(documentId, slug) {
  const collection = adminDb.collection(SURFTRIP_INVENTORY_COLLECTION);
  const normalizedId = normalizeSanityDocumentId(documentId);

  const [directSnapshot, byDocumentIdSnapshot, bySlugSnapshot] = await Promise.all([
    collection.doc(normalizedId).get(),
    collection.where("sanityDocumentId", "==", normalizedId).get(),
    slug ? collection.where("sanitySlug", "==", slug).get() : Promise.resolve(null),
  ]);

  const candidates = new Map();

  if (directSnapshot.exists) {
    candidates.set(directSnapshot.id, { id: directSnapshot.id, ref: directSnapshot.ref, ...directSnapshot.data() });
  }

  byDocumentIdSnapshot.docs.forEach((doc) => {
    candidates.set(doc.id, { id: doc.id, ref: doc.ref, ...doc.data() });
  });

  bySlugSnapshot?.docs.forEach((doc) => {
    candidates.set(doc.id, { id: doc.id, ref: doc.ref, ...doc.data() });
  });

  return [...candidates.values()].sort((a, b) => candidateScore(b, normalizedId) - candidateScore(a, normalizedId));
}

function buildInventoryPayload(doc, existing) {
  const now = new Date().toISOString();
  const slug = extractSlug(doc.slug);

  return {
    sanityDocumentId: normalizeSanityDocumentId(doc._id),
    sanitySlug: slug ?? existing?.sanitySlug ?? "",
    title: doc.title,
    shortDescription: doc.shortDescription?.trim() || existing?.shortDescription || "",
    cardImageUrl: getImageUrl(doc.cardImage, 1600, 1000) ?? existing?.cardImageUrl,
    heroImageUrl:
      getImageUrl(doc.heroImage ?? doc.cardImage, 2200, 1300) ??
      existing?.heroImageUrl ??
      existing?.cardImageUrl,
    country: doc.country?.trim() || existing?.country,
    level: doc.level?.trim() || existing?.level,
    price: toNumber(doc.price) ?? existing?.price ?? 0,
    currency: "PEN",
    capacity: toNumber(doc.capacity) ?? existing?.capacity ?? 0,
    enrolledCount: existing?.enrolledCount ?? 0,
    startDate: doc.startDate,
    endDate: doc.endDate,
    isActive: doc.isActive !== false,
    sanityUpdatedAt: doc._updatedAt ?? now,
    syncedAt: now,
    supersededBySurftripId: null,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function getMissingCommerceFields(doc) {
  const missing = [];

  if (!extractSlug(doc?.slug)) missing.push("slug");
  if (!doc?.title) missing.push("title");
  if (!doc?.startDate) missing.push("startDate");
  if (!doc?.endDate) missing.push("endDate");
  if (toNumber(doc?.price) === null || doc.price <= 0) missing.push("price");
  if (toNumber(doc?.capacity) === null || doc.capacity <= 0) missing.push("capacity");

  return missing;
}

function isSyncableDoc(doc) {
  return getMissingCommerceFields(doc).length === 0;
}

export async function upsertInventoryFromSanityDoc(doc, { dryRun = false } = {}) {
  const normalizedId = normalizeSanityDocumentId(doc._id);
  const slug = extractSlug(doc.slug);
  const candidates = await loadInventoryCandidates(normalizedId, slug);
  const primary = candidates[0];
  const primaryRef = primary?.ref ?? adminDb.collection(SURFTRIP_INVENTORY_COLLECTION).doc(normalizedId);
  const payload = buildInventoryPayload(doc, primary);
  const duplicates = candidates.filter((candidate) => candidate.id !== primaryRef.id);

  if (dryRun) {
    return {
      action: primary ? "update" : "create",
      inventoryId: primaryRef.id,
      title: payload.title,
      slug: payload.sanitySlug,
      duplicateIds: duplicates.map((candidate) => candidate.id),
    };
  }

  const batch = adminDb.batch();
  batch.set(primaryRef, payload, { merge: true });

  duplicates.forEach((candidate) => {
    batch.set(
      candidate.ref,
      {
        sanityDocumentId: normalizedId,
        isActive: false,
        supersededBySurftripId: primaryRef.id,
        syncedAt: payload.updatedAt,
        updatedAt: payload.updatedAt,
      },
      { merge: true },
    );
  });

  await batch.commit();

  return {
    action: primary ? "update" : "create",
    inventoryId: primaryRef.id,
    title: payload.title,
    slug: payload.sanitySlug,
    duplicateIds: duplicates.map((candidate) => candidate.id),
  };
}

export async function deactivateInventoryByDocumentId(documentId, slug, { dryRun = false } = {}) {
  const candidates = await loadInventoryCandidates(documentId, slug);
  if (!candidates.length) {
    return { action: "noop", inventoryIds: [] };
  }

  const now = new Date().toISOString();

  if (dryRun) {
    return {
      action: "deactivate",
      inventoryIds: candidates.map((candidate) => candidate.id),
    };
  }

  const batch = adminDb.batch();
  candidates.forEach((candidate) => {
    batch.set(
      candidate.ref,
      {
        sanityDocumentId: normalizeSanityDocumentId(documentId),
        isActive: false,
        syncedAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
  });
  await batch.commit();

  return {
    action: "deactivate",
    inventoryIds: candidates.map((candidate) => candidate.id),
  };
}

export async function syncSurftripDocs(docs, { dryRun = false } = {}) {
  const results = [];

  for (const rawDoc of docs) {
    const doc = await ensureSanityCommerceFields(
      {
        ...rawDoc,
        _updatedAt: rawDoc._updatedAt ?? new Date().toISOString(),
      },
      { dryRun },
    );

    if (!isSyncableDoc(doc)) {
      results.push({
        title: doc.title,
        slug: extractSlug(doc.slug) ?? null,
        skipped: true,
        reason: "missing_required_commerce_fields",
        missingFields: getMissingCommerceFields(doc),
      });
      await deactivateInventoryByDocumentId(doc._id, extractSlug(doc.slug), { dryRun });
      continue;
    }

    results.push(await upsertInventoryFromSanityDoc(doc, { dryRun }));
  }

  return results;
}

export async function backfillSurftripInventory({ dryRun = false, documentIds } = {}) {
  const docs = await sanityClient.fetch(SURFTRIP_BACKFILL_QUERY);
  const filteredDocs =
    Array.isArray(documentIds) && documentIds.length
      ? docs.filter((doc) => documentIds.includes(normalizeSanityDocumentId(doc._id)))
      : docs;

  return syncSurftripDocs(filteredDocs, { dryRun });
}
