import { PurchaseDoc } from "./types";

const SUBSCRIPTION_BILLING_CYCLE_MS = 30 * 24 * 60 * 60 * 1000;
const SUBSCRIPTION_GRACE_PERIOD_MS = 5 * 24 * 60 * 60 * 1000;

export function purchaseCanBookClasses(purchase: PurchaseDoc) {
  if (purchase.fulfillmentType) {
    return purchase.fulfillmentType === "class_booking";
  }

  if (purchase.itemType === "surftrip" || purchase.surftripId) {
    return false;
  }

  return (
    purchase.packageType === "credits" ||
    purchase.packageType === "unlimited" ||
    purchase.packageType === "subscription"
  );
}

export function purchaseIsActive(purchase: PurchaseDoc, nowIso: string) {
  if (purchase.status !== "approved" || !purchaseCanBookClasses(purchase)) return false;

  if (purchase.packageType === "credits") {
    return (purchase.remainingCredits ?? 0) > 0;
  }

  if (purchase.packageType === "subscription") {
    if (purchase.subscriptionStatus !== "authorized") return false;
    if (!purchase.expiresAt || new Date(purchase.expiresAt).getTime() <= new Date(nowIso).getTime()) return false;
    if (!purchase.lastPaymentDate) return false;
    const elapsed = new Date(nowIso).getTime() - new Date(purchase.lastPaymentDate).getTime();
    return elapsed <= SUBSCRIPTION_BILLING_CYCLE_MS + SUBSCRIPTION_GRACE_PERIOD_MS;
  }

  if (purchase.packageType !== "unlimited" || !purchase.expiresAt) return false;
  return new Date(purchase.expiresAt).getTime() > new Date(nowIso).getTime();
}

export function sortPurchasesForConsumption(a: PurchaseDoc, b: PurchaseDoc) {
  // credits first, then unlimited, then subscription
  if (a.packageType === "credits" && b.packageType !== "credits") return -1;
  if (a.packageType !== "credits" && b.packageType === "credits") return 1;
  if (a.packageType === "unlimited" && b.packageType === "subscription") return -1;
  if (a.packageType === "subscription" && b.packageType === "unlimited") return 1;
  const aDate = a.expiresAt ?? a.createdAt;
  const bDate = b.expiresAt ?? b.createdAt;
  return new Date(aDate).getTime() - new Date(bDate).getTime();
}

export function getActiveClassPurchase(purchases: PurchaseDoc[], nowIso = new Date().toISOString()) {
  return purchases
    .filter((purchase) => purchaseIsActive(purchase, nowIso))
    .sort(sortPurchasesForConsumption)[0] ?? null;
}
