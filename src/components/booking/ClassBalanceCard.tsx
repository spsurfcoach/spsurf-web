"use client";

import type { PurchaseDoc } from "@/lib/booking/types";
import { getActiveClassPurchase } from "@/lib/booking/guards";

type Props = {
  purchases: PurchaseDoc[];
  title?: string;
  className?: string;
};

export function ClassBalanceCard({ purchases, title = "Tu saldo", className = "" }: Props) {
  const activePurchase = getActiveClassPurchase(purchases);
  const value = activePurchase
    ? activePurchase.packageType === "credits"
      ? activePurchase.remainingCredits ?? 0
      : "∞"
    : "0";
  const label = activePurchase?.packageType === "unlimited" ? "plan ilimitado" : "clases disponibles";

  return (
    <div className={`rounded-2xl bg-[var(--color-primary-900)] px-6 py-5 text-white ${className}`.trim()}>
      <p className="mb-2 text-sm text-white/60">{title}</p>
      <div className="flex items-end gap-3">
        <p className="text-4xl font-bold leading-none">{value}</p>
        <p className="pb-0.5 text-sm text-white/60">{label}</p>
      </div>
      {activePurchase?.packageType === "unlimited" && activePurchase.expiresAt ? (
        <p className="mt-3 text-xs text-white/40">
          Valido hasta {new Date(activePurchase.expiresAt).toLocaleDateString("es-PE")}
        </p>
      ) : null}
      {!activePurchase ? <p className="mt-3 text-sm text-white/70">Compra un paquete o membership para reservar.</p> : null}
    </div>
  );
}
