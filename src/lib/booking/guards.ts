import { PurchaseDoc } from "./types";

export function purchaseIsActive(purchase: PurchaseDoc, nowIso: string) {
  if (purchase.status !== "approved") return false;

  if (purchase.packageType === "credits") {
    return (purchase.remainingCredits ?? 0) > 0;
  }

  if (!purchase.expiresAt) return false;
  return new Date(purchase.expiresAt).getTime() > new Date(nowIso).getTime();
}

export function sortPurchasesForConsumption(a: PurchaseDoc, b: PurchaseDoc) {
  if (a.packageType === "credits" && b.packageType === "unlimited") return -1;
  if (a.packageType === "unlimited" && b.packageType === "credits") return 1;
  const aDate = a.expiresAt ?? a.createdAt;
  const bDate = b.expiresAt ?? b.createdAt;
  return new Date(aDate).getTime() - new Date(bDate).getTime();
}
