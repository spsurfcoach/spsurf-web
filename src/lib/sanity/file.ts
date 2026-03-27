import type { SanityFile } from "./types";
import { sanityDataset, sanityProjectId } from "./client";

function parseFileRef(ref: string) {
  const match = ref.match(/^file-(.+)-([a-z0-9]+)$/i);

  if (!match) {
    return null;
  }

  return {
    assetId: match[1],
    extension: match[2],
  };
}

export function urlForFile(file: SanityFile | null | undefined) {
  const ref = file?.asset?._ref;

  if (!ref || !sanityProjectId || !sanityDataset) {
    return "";
  }

  const parsed = parseFileRef(ref);

  if (!parsed) {
    return "";
  }

  return `https://cdn.sanity.io/files/${sanityProjectId}/${sanityDataset}/${parsed.assetId}.${parsed.extension}`;
}
