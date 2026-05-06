"use client";

import { useMemo } from "react";

type PurchaseItem = {
  id: string;
  productName?: string;
  packageType?: string | null;
  status: string;
  remainingCredits?: number | null;
  expiresAt?: string | null;
  createdAt: string;
};

type Props = {
  purchases: PurchaseItem[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; classes: string }> = {
    approved: { label: "Aprobado", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    pending: { label: "Pendiente", classes: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    rejected: { label: "Rechazado", classes: "bg-red-50 text-red-600 border-red-200" },
    cancelled: { label: "Cancelado", classes: "bg-red-50 text-red-600 border-red-200" },
  };
  const { label, classes } = config[status] ?? {
    label: status,
    classes: "bg-black/5 text-black/50 border-black/10",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}

function packageTypeLabel(type?: string | null) {
  if (!type) return null;
  const map: Record<string, string> = {
    credits: "Paquete de clases",
    unlimited: "Plan ilimitado",
    subscription: "Membresía",
  };
  return map[type] ?? type;
}

export function MisComprasList({ purchases }: Props) {
  const sorted = useMemo(
    () => [...purchases].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [purchases],
  );

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/15 p-10 text-center">
        <p className="text-sm text-black/40">Aún no tienes compras registradas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((purchase) => {
        const typeLabel = packageTypeLabel(purchase.packageType);
        const name = purchase.productName ?? typeLabel ?? "Compra";
        const isCredits = purchase.packageType === "credits";
        const isUnlimited =
          purchase.packageType === "unlimited" || purchase.packageType === "subscription";

        return (
          <div
            key={purchase.id}
            className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-semibold text-black leading-snug">{name}</p>
              {typeLabel && purchase.productName ? (
                <p className="text-xs text-black/45">{typeLabel}</p>
              ) : null}
              <p className="text-xs text-black/40">{formatDate(purchase.createdAt)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:shrink-0 sm:flex-col sm:items-end sm:gap-2">
              <StatusBadge status={purchase.status} />

              {purchase.status === "approved" ? (
                <p className="text-xs text-black/50">
                  {isCredits && purchase.remainingCredits != null
                    ? `${purchase.remainingCredits} crédito${purchase.remainingCredits !== 1 ? "s" : ""} restantes`
                    : isUnlimited && purchase.expiresAt
                      ? `Vence ${formatDate(purchase.expiresAt)}`
                      : null}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
