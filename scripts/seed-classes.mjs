/**
 * Seed script — SP Surf Coach class slots (with location)
 * Usage: node ./scripts/seed-classes.mjs
 *
 * Deletes all existing classSlots, then re-creates:
 *  - Lima slots: Mon–Sat at 6, 7, 8, 9 AM (Lima = UTC-5)
 *  - Sur Chico slots: Thu 4 PM + Fri–Sat at 6, 7, 8, 9 AM
 *
 * Date range: Mar 19 – Apr 30, 2026
 * Capacity: 8 per slot
 */

import "dotenv/config";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌  Missing Firebase env vars");
  process.exit(1);
}

const app = getApps()[0] ?? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore(app);

const now = new Date().toISOString();
const CAPACITY = 12;

// Convert Lima local time to UTC ISO string (Lima = UTC-5, no DST)
function limaISO(year, month, day, hour, minute = 0) {
  const d = new Date(Date.UTC(year, month - 1, day, hour + 5, minute, 0, 0));
  return d.toISOString();
}

const startDate = new Date("2026-03-19");
const endDate   = new Date("2026-04-30");

function generateSlots() {
  const slots = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const dow = cursor.getUTCDay(); // 0=Sun,1=Mon,...,6=Sat
    const y = cursor.getUTCFullYear();
    const m = cursor.getUTCMonth() + 1;
    const d = cursor.getUTCDate();

    // Lima: Mon(1)–Sat(6) at 6,7,8,9 AM
    if (dow >= 1 && dow <= 6) {
      for (const hour of [6, 7, 8, 9]) {
        slots.push({
          startsAt: limaISO(y, m, d, hour),
          capacity: CAPACITY,
          enrolledCount: 0,
          isActive: true,
          location: "Lima",
          coachNotes: "",
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    // Sur Chico: Thu(4) at 4 PM
    if (dow === 4) {
      slots.push({
        startsAt: limaISO(y, m, d, 16),
        capacity: CAPACITY,
        enrolledCount: 0,
        isActive: true,
        location: "Sur Chico",
        coachNotes: "",
        createdAt: now,
        updatedAt: now,
      });
    }

    // Sur Chico: Fri(5) & Sat(6) at 6,7,8,9 AM
    if (dow === 5 || dow === 6) {
      for (const hour of [6, 7, 8, 9]) {
        slots.push({
          startsAt: limaISO(y, m, d, hour),
          capacity: CAPACITY,
          enrolledCount: 0,
          isActive: true,
          location: "Sur Chico",
          coachNotes: "",
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return slots;
}

async function deleteExistingSlots() {
  const snapshot = await db.collection("classSlots").get();
  if (snapshot.empty) return;
  console.log(`🗑️   Deleting ${snapshot.size} existing slots...`);
  const BATCH = 400;
  for (let i = 0; i < snapshot.docs.length; i += BATCH) {
    const batch = db.batch();
    snapshot.docs.slice(i, i + BATCH).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

async function run() {
  console.log("🏄  SP Surf Coach — class slot seed\n");

  await deleteExistingSlots();

  const slots = generateSlots();
  console.log(`📅  Creating ${slots.length} slots (Mar 19 – Apr 30, 2026)...`);

  // Split Lima vs Sur Chico for logging
  const limaCount = slots.filter((s) => s.location === "Lima").length;
  const scCount = slots.filter((s) => s.location === "Sur Chico").length;

  const BATCH_SIZE = 400;
  for (let i = 0; i < slots.length; i += BATCH_SIZE) {
    const batch = db.batch();
    slots.slice(i, i + BATCH_SIZE).forEach((slot) => {
      batch.set(db.collection("classSlots").doc(), slot);
    });
    await batch.commit();
    console.log(`    ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1} written`);
  }

  console.log(`\n✅  Done!`);
  console.log(`    Lima slots:      ${limaCount}`);
  console.log(`    Sur Chico slots: ${scCount}`);
  console.log(`    Total:           ${slots.length}`);
  process.exit(0);
}

run().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
