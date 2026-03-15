const DEFAULT_API_VERSION = "2025-02-19";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? DEFAULT_API_VERSION;
export const sanityReadToken = process.env.SANITY_API_READ_TOKEN ?? "";

export const sanityEnvReady = Boolean(sanityProjectId && sanityDataset);
