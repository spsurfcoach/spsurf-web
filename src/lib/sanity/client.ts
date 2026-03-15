import { createClient } from "next-sanity";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const token = process.env.SANITY_API_READ_TOKEN;

export const isSanityConfigured = Boolean(projectId && dataset);

export const sanityClient = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion,
  useCdn: true,
  token,
  perspective: "published",
});
