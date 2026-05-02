/**
 * Seed script — SP Surf Coach subscription membership packages
 * Usage: node ./scripts/seed-subscription-packages.mjs
 *
 * Creates three recurring subscription packages in Firestore:
 *  - Membresía 3 meses  (durationDays: 91)
 *  - Membresía 6 meses  (durationDays: 181)
 *  - Membresía 12 meses (durationDays: 365)
 *
 * Each package bills every 30 days via MercadoPago PreApproval.
 * Set prices (PEN) below before running.
 */

import "dotenv/config";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const db = getFirestore();

// ─── Set your prices here (in PEN) ───────────────────────────────────────────
const PRICE_3M  = 1550;   // Membresía 3 meses
const PRICE_6M  = 1420;   // Membresía 6 meses
const PRICE_12M = 1290;   // Membresía 12 meses
// ─────────────────────────────────────────────────────────────────────────────

const now = new Date().toISOString();

const packages = [
  {
    name: "Membresía 3 meses",
    type: "subscription",
    billingModel: "subscription",
    billingCycleDays: 30,
    durationDays: 91,
    price: PRICE_3M,
    currency: "PEN",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Membresía 6 meses",
    type: "subscription",
    billingModel: "subscription",
    billingCycleDays: 30,
    durationDays: 181,
    price: PRICE_6M,
    currency: "PEN",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Membresía 12 meses",
    type: "subscription",
    billingModel: "subscription",
    billingCycleDays: 30,
    durationDays: 365,
    price: PRICE_12M,
    currency: "PEN",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

const collection = db.collection("packages");

for (const pkg of packages) {
  const ref = await collection.add(pkg);
  console.log(`✓ Created "${pkg.name}" — id: ${ref.id}  (${pkg.durationDays} days @ S/ ${pkg.price})`);
}

console.log("\nDone. 3 subscription packages created in Firestore.");
