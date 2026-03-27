import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { sanityApiVersion, sanityDataset, sanityEnvReady, sanityProjectId } from "./sanity/env";

if (!sanityEnvReady) {
  console.warn(
    "[sanity] Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET. Studio will need env values.",
  );
}

export default defineConfig({
  name: "default",
  title: "SP Surf Coach Studio",
  projectId: sanityProjectId || "missing-project-id",
  dataset: sanityDataset || "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  apiVersion: sanityApiVersion,
});
