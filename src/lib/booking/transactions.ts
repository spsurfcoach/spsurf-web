import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { purchaseIsActive, sortPurchasesForConsumption } from "./guards";
import { ClassSlotDoc, PurchaseDoc } from "./types";

const PACKAGES_COLLECTION = "packages";
const CLASS_SLOTS_COLLECTION = "classSlots";
const PURCHASES_COLLECTION = "purchases";
const BOOKINGS_COLLECTION = "bookings";

type BookClassInput = {
  userId: string;
  classSlotId: string;
};

type BookClassResult = {
  bookingId: string;
  purchaseId: string;
};

export async function getPackageById(packageId: string) {
  const snapshot = await adminDb.collection(PACKAGES_COLLECTION).doc(packageId).get();
  if (!snapshot.exists) return null;
  return {
    id: snapshot.id,
    ...(snapshot.data() as {
      name: string;
      isActive: boolean;
      price: number;
    }),
  };
}

export async function createBookingTransaction(input: BookClassInput): Promise<BookClassResult> {
  const nowIso = new Date().toISOString();

  return adminDb.runTransaction(async (transaction) => {
    const slotRef = adminDb.collection(CLASS_SLOTS_COLLECTION).doc(input.classSlotId);
    const slotSnapshot = await transaction.get(slotRef);

    if (!slotSnapshot.exists) {
      throw new Error("CLASS_SLOT_NOT_FOUND");
    }

    const slotData = slotSnapshot.data() as ClassSlotDoc;
    if (!slotData.isActive) {
      throw new Error("CLASS_SLOT_INACTIVE");
    }
    if (slotData.enrolledCount >= slotData.capacity) {
      throw new Error("CLASS_SLOT_FULL");
    }

    const purchasesQuery = await transaction.get(adminDb.collection(PURCHASES_COLLECTION).where("userId", "==", input.userId));

    const activePurchases = purchasesQuery.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as PurchaseDoc) }))
      .filter((purchase) => purchase.status === "approved")
      .filter((purchase) => purchaseIsActive(purchase, nowIso))
      .sort(sortPurchasesForConsumption);

    const selectedPurchase = activePurchases[0];
    if (!selectedPurchase) {
      throw new Error("NO_ACTIVE_PURCHASE");
    }

    const bookingRef = adminDb.collection(BOOKINGS_COLLECTION).doc();
    transaction.set(bookingRef, {
      userId: input.userId,
      classSlotId: input.classSlotId,
      purchaseId: selectedPurchase.id,
      bookedAt: nowIso,
      status: "booked",
      createdAt: nowIso,
    });

    transaction.update(slotRef, {
      enrolledCount: FieldValue.increment(1),
      updatedAt: nowIso,
    });

    if (selectedPurchase.packageType === "credits") {
      const purchaseRef = adminDb.collection(PURCHASES_COLLECTION).doc(selectedPurchase.id);
      transaction.update(purchaseRef, {
        remainingCredits: FieldValue.increment(-1),
        updatedAt: nowIso,
      });
    }

    return {
      bookingId: bookingRef.id,
      purchaseId: selectedPurchase.id,
    };
  });
}

export async function createPurchaseFromPayment(input: {
  userId: string;
  packageId: string;
  paymentId: string;
  preferenceId: string;
}) {
  const packageSnapshot = await adminDb.collection(PACKAGES_COLLECTION).doc(input.packageId).get();
  if (!packageSnapshot.exists) {
    throw new Error("PACKAGE_NOT_FOUND");
  }

  const packageData = packageSnapshot.data() as {
    type: "credits" | "unlimited";
    classCount?: number;
    durationDays?: number;
  };

  const duplicateQuery = await adminDb
    .collection(PURCHASES_COLLECTION)
    .where("mercadopagoPaymentId", "==", input.paymentId)
    .limit(1)
    .get();

  if (!duplicateQuery.empty) {
    return { idempotent: true, purchaseId: duplicateQuery.docs[0].id };
  }

  const now = new Date();
  const createdAt = now.toISOString();
  const purchaseRef = adminDb.collection(PURCHASES_COLLECTION).doc();
  const expiresAt =
    packageData.type === "unlimited" && packageData.durationDays
      ? new Date(now.getTime() + packageData.durationDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

  await purchaseRef.set({
    userId: input.userId,
    packageId: input.packageId,
    packageType: packageData.type,
    remainingCredits: packageData.type === "credits" ? packageData.classCount ?? 0 : null,
    expiresAt: expiresAt ?? null,
    mercadopagoPaymentId: input.paymentId,
    mercadopagoPreferenceId: input.preferenceId,
    status: "approved",
    createdAt,
    updatedAt: createdAt,
  });

  return { idempotent: false, purchaseId: purchaseRef.id };
}
