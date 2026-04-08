import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { purchaseIsActive, sortPurchasesForConsumption } from "./guards";
import { buildPackageProductId, buildSurftripProductId } from "./storefront";
import {
  ClassSlotDoc,
  PackageDoc,
  ProductDoc,
  PurchaseDoc,
  SurftripBookingDoc,
  SurftripInventoryDoc,
} from "./types";

const PACKAGES_COLLECTION = "packages";
const PRODUCTS_COLLECTION = "products";
const CLASS_SLOTS_COLLECTION = "classSlots";
const PURCHASES_COLLECTION = "purchases";
const BOOKINGS_COLLECTION = "bookings";
const SURFTRIP_INVENTORY_COLLECTION = "surftripInventory";
const SURFTRIP_BOOKINGS_COLLECTION = "surftripBookings";

type BookClassInput = {
  userId: string;
  classSlotId: string;
};

type BookClassResult = {
  bookingId: string;
  purchaseId: string;
};

export async function getSurftripInventoryById(surftripId: string) {
  const snapshot = await adminDb.collection(SURFTRIP_INVENTORY_COLLECTION).doc(surftripId).get();
  if (!snapshot.exists) return null;
  return {
    id: snapshot.id,
    ...(snapshot.data() as SurftripInventoryDoc),
  };
}

export async function createSurftripBookingFromPayment(input: {
  userId: string;
  surftripId: string;
  productId?: string;
  paymentId: string;
  preferenceId: string;
}) {
  // Idempotency: check if a booking already exists for this payment
  const duplicateQuery = await adminDb
    .collection(SURFTRIP_BOOKINGS_COLLECTION)
    .where("paymentId", "==", input.paymentId)
    .limit(1)
    .get();

  if (!duplicateQuery.empty) {
    const existingBooking = duplicateQuery.docs[0].data() as SurftripBookingDoc;
    return {
      idempotent: true,
      bookingId: duplicateQuery.docs[0].id,
      slug: existingBooking.sanitySlug,
    };
  }

  const surftripRef = adminDb.collection(SURFTRIP_INVENTORY_COLLECTION).doc(input.surftripId);

  return adminDb.runTransaction(async (transaction) => {
    const surftripSnap = await transaction.get(surftripRef);
    if (!surftripSnap.exists) throw new Error("SURFTRIP_NOT_FOUND");

    const data = surftripSnap.data() as SurftripInventoryDoc;
    if (!data.isActive) throw new Error("SURFTRIP_INACTIVE");
    if (data.enrolledCount >= data.capacity) throw new Error("SURFTRIP_FULL");

    const now = new Date().toISOString();

    // Create purchase record
    const purchaseRef = adminDb.collection(PURCHASES_COLLECTION).doc();
    transaction.set(purchaseRef, {
      userId: input.userId,
      productId: input.productId ?? buildSurftripProductId(input.surftripId),
      productName: data.title,
      productCategory: "surftrip",
      fulfillmentType: "surftrip_booking",
      sourceCollection: "surftripInventory",
      sourceId: input.surftripId,
      packageId: input.surftripId,
      packageType: null,
      itemType: "surftrip",
      surftripId: input.surftripId,
      mercadopagoPaymentId: input.paymentId,
      mercadopagoPreferenceId: input.preferenceId,
      status: "approved",
      remainingCredits: null,
      expiresAt: null,
      createdAt: now,
      updatedAt: now,
    });

    // Create surftrip booking
    const bookingRef = adminDb.collection(SURFTRIP_BOOKINGS_COLLECTION).doc();
    transaction.set(bookingRef, {
      userId: input.userId,
      surftripId: input.surftripId,
      sanitySlug: data.sanitySlug,
      purchaseId: purchaseRef.id,
      paymentId: input.paymentId,
      status: "confirmed",
      bookedAt: now,
      createdAt: now,
    });

    // Increment enrolled count
    transaction.update(surftripRef, {
      enrolledCount: FieldValue.increment(1),
      updatedAt: now,
    });

    return { idempotent: false, bookingId: bookingRef.id, slug: data.sanitySlug };
  });
}

export async function getPackageById(packageId: string) {
  const snapshot = await adminDb.collection(PACKAGES_COLLECTION).doc(packageId).get();
  if (!snapshot.exists) return null;
  return {
    id: snapshot.id,
    ...(snapshot.data() as Pick<PackageDoc, "name" | "isActive" | "price" | "type" | "classCount" | "durationDays" | "currency">),
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

export async function createPackagePurchaseFromPayment(input: {
  userId: string;
  packageId: string;
  productId?: string;
  paymentId: string;
  preferenceId: string;
}) {
  const packageSnapshot = await adminDb.collection(PACKAGES_COLLECTION).doc(input.packageId).get();
  if (!packageSnapshot.exists) {
    throw new Error("PACKAGE_NOT_FOUND");
  }

  const packageData = packageSnapshot.data() as PackageDoc;

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
    productId: input.productId ?? buildPackageProductId(input.packageId),
    productName: packageData.name,
    productCategory: packageData.type === "unlimited" ? "membership" : "package",
    fulfillmentType: "class_booking",
    sourceCollection: "packages",
    sourceId: input.packageId,
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

export async function createDirectPurchaseFromPayment(input: {
  userId: string;
  productId: string;
  paymentId: string;
  preferenceId: string;
}) {
  const productSnapshot = await adminDb.collection(PRODUCTS_COLLECTION).doc(input.productId).get();
  if (!productSnapshot.exists) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  const product = productSnapshot.data() as ProductDoc;
  if (product.isActive === false) {
    throw new Error("PRODUCT_INACTIVE");
  }

  const duplicateQuery = await adminDb
    .collection(PURCHASES_COLLECTION)
    .where("mercadopagoPaymentId", "==", input.paymentId)
    .limit(1)
    .get();

  if (!duplicateQuery.empty) {
    return { idempotent: true, purchaseId: duplicateQuery.docs[0].id };
  }

  const createdAt = new Date().toISOString();
  const purchaseRef = adminDb.collection(PURCHASES_COLLECTION).doc();

  await purchaseRef.set({
    userId: input.userId,
    productId: input.productId,
    productName: product.name,
    productCategory: product.category,
    fulfillmentType: "direct_purchase",
    sourceCollection: "products",
    sourceId: input.productId,
    packageId: null,
    packageType: null,
    remainingCredits: null,
    expiresAt: null,
    itemType: "product",
    mercadopagoPaymentId: input.paymentId,
    mercadopagoPreferenceId: input.preferenceId,
    status: "approved",
    createdAt,
    updatedAt: createdAt,
  });

  return { idempotent: false, purchaseId: purchaseRef.id };
}

export async function createPurchaseFromPayment(input: {
  userId: string;
  packageId: string;
  paymentId: string;
  preferenceId: string;
}) {
  return createPackagePurchaseFromPayment(input);
}
