import "dotenv/config";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";
const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_DEVELOPER_TOKEN ||
  process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID and a Sanity API token are required.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const docs = await client.fetch(`*[_type == "surftrip" && defined(available)]{ _id, title, available }`);

if (docs.length === 0) {
  console.log("No surftrip documents have the orphaned 'available' field. Nothing to do.");
  process.exit(0);
}

console.log(`Found ${docs.length} surftrip document(s) with orphaned 'available' field:\n`);
docs.forEach((d) => console.log(`  - ${d.title} (_id: ${d._id}, available: ${d.available})`));

for (const doc of docs) {
  await client.patch(doc._id).unset(["available"]).commit();
  console.log(`  ✓ Removed 'available' from "${doc.title}"`);
}

console.log("\nDone. You can now edit these documents in Sanity Studio.");
