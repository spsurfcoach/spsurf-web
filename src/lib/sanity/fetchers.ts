import { cache } from "react";
import { isSanityConfigured, sanityClient } from "./client";
import {
  SURFTRIP_BY_SLUG_QUERY,
  SURFTRIP_LIST_QUERY,
  SURFTRIP_SLUGS_QUERY,
} from "./queries";
import type { SurftripDetail, SurftripListItem } from "./types";

export const getSurftrips = cache(async (): Promise<SurftripListItem[]> => {
  if (!isSanityConfigured) return [];
  return sanityClient.fetch<SurftripListItem[]>(SURFTRIP_LIST_QUERY);
});

export const getSurftripBySlug = cache(async (slug: string): Promise<SurftripDetail | null> => {
  if (!isSanityConfigured) return null;
  return sanityClient.fetch<SurftripDetail | null>(SURFTRIP_BY_SLUG_QUERY, { slug });
});

export const getSurftripSlugs = cache(async (): Promise<string[]> => {
  if (!isSanityConfigured) return [];
  return sanityClient.fetch<string[]>(SURFTRIP_SLUGS_QUERY);
});
