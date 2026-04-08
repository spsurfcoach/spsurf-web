import "server-only";
import { cache } from "react";
import { buildSurftripProductId } from "@/lib/booking/storefront";
import {
  getSurftripAvailableSpots,
  listSurftripInventory,
  type SurftripInventoryRecord,
} from "@/lib/booking/surftrip-sync";
import { isSanityConfigured, sanityClient } from "./client";
import {
  SURFTRIP_BY_SLUG_QUERY,
  SURFTRIP_LIST_QUERY,
} from "./queries";
import type { SurftripDetail, SurftripListItem } from "./types";

type SurftripSanityListItem = Omit<
  SurftripListItem,
  "enrolledCount" | "availableSpots" | "storeProductId" | "storeHref"
>;

type SurftripSanityDetail = Omit<
  SurftripDetail,
  "enrolledCount" | "availableSpots" | "storeProductId" | "storeHref"
>;

type InventoryIndex = {
  byDocumentId: Map<string, SurftripInventoryRecord>;
  bySlug: Map<string, SurftripInventoryRecord>;
};

function hasValidCommerceFields(trip: { price: number; capacity: number }) {
  return Number.isFinite(trip.price) && trip.price > 0 && Number.isFinite(trip.capacity) && trip.capacity > 0;
}

function preferInventoryCandidate(
  current: SurftripInventoryRecord | undefined,
  next: SurftripInventoryRecord,
) {
  if (!current) return next;
  if ((next.enrolledCount ?? 0) !== (current.enrolledCount ?? 0)) {
    return (next.enrolledCount ?? 0) > (current.enrolledCount ?? 0) ? next : current;
  }
  if (next.isActive !== current.isActive) {
    return next.isActive ? next : current;
  }
  return Date.parse(next.updatedAt || "") > Date.parse(current.updatedAt || "") ? next : current;
}

const getInventoryIndex = cache(async (): Promise<InventoryIndex> => {
  try {
    const records = await listSurftripInventory();
    const byDocumentId = new Map<string, SurftripInventoryRecord>();
    const bySlug = new Map<string, SurftripInventoryRecord>();

    records.forEach((record) => {
      if (record.sanityDocumentId) {
        byDocumentId.set(
          record.sanityDocumentId,
          preferInventoryCandidate(byDocumentId.get(record.sanityDocumentId), record),
        );
      }
      if (record.sanitySlug) {
        bySlug.set(
          record.sanitySlug,
          preferInventoryCandidate(bySlug.get(record.sanitySlug), record),
        );
      }
    });

    return { byDocumentId, bySlug };
  } catch {
    return {
      byDocumentId: new Map<string, SurftripInventoryRecord>(),
      bySlug: new Map<string, SurftripInventoryRecord>(),
    };
  }
});

function mergeSurftripOperationalState<T extends { _id: string; slug: string; price: number; capacity: number; isActive: boolean }>(
  trip: T,
  inventoryIndex: InventoryIndex,
) {
  const inventory =
    inventoryIndex.byDocumentId.get(trip._id) ??
    inventoryIndex.bySlug.get(trip.slug);

  const capacity = Number.isFinite(inventory?.capacity) ? Number(inventory?.capacity) : trip.capacity;
  const enrolledCount = inventory?.enrolledCount ?? 0;
  const availableSpots = getSurftripAvailableSpots(capacity, enrolledCount);
  const price = Number.isFinite(inventory?.price) ? Number(inventory?.price) : trip.price;
  const isActive = inventory?.isActive ?? trip.isActive;
  const storeProductId = inventory ? buildSurftripProductId(inventory.id) : undefined;

  return {
    ...trip,
    price,
    capacity,
    isActive,
    enrolledCount,
    availableSpots,
    storeProductId,
    storeHref: storeProductId ? `/clases?tab=comprar&product=${encodeURIComponent(storeProductId)}` : undefined,
  };
}

export const getSurftrips = cache(async (): Promise<SurftripListItem[]> => {
  if (!isSanityConfigured) return [];

  const [trips, inventoryIndex] = await Promise.all([
    sanityClient.fetch<SurftripSanityListItem[]>(SURFTRIP_LIST_QUERY),
    getInventoryIndex(),
  ]);

  return trips
    .map((trip) => mergeSurftripOperationalState(trip, inventoryIndex))
    .filter((trip) => trip.isActive !== false && hasValidCommerceFields(trip));
});

export const getSurftripBySlug = cache(async (slug: string): Promise<SurftripDetail | null> => {
  if (!isSanityConfigured) return null;

  const [trip, inventoryIndex] = await Promise.all([
    sanityClient.fetch<SurftripSanityDetail | null>(SURFTRIP_BY_SLUG_QUERY, { slug }),
    getInventoryIndex(),
  ]);

  if (!trip) return null;

  const merged = mergeSurftripOperationalState(trip, inventoryIndex);
  return merged.isActive === false || !hasValidCommerceFields(merged) ? null : merged;
});

export const getSurftripSlugs = cache(async (): Promise<string[]> => {
  return (await getSurftrips()).map((trip) => trip.slug);
});
