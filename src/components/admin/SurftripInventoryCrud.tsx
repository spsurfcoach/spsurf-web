"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export type SurftripInventoryItem = {
  id: string;
  sanityDocumentId: string;
  sanitySlug: string;
  title: string;
  price: number;
  currency: string;
  capacity: number;
  enrolledCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  country?: string;
  level?: string;
  syncedAt?: string;
};

type Props = {
  items: SurftripInventoryItem[];
  isLoading: boolean;
  onSync: (sanityDocumentId: string) => Promise<void>;
  onSyncAll: () => Promise<void>;
  onToggle: (id: string, current: boolean) => Promise<void>;
};

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
}

export function SurftripInventoryCrud({ items, isLoading, onSync, onSyncAll, onToggle }: Props) {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Inventario de Surftrips</h2>
          <p className="text-sm text-black/50 mt-1">
            Este inventario se sincroniza desde Sanity. Aquí solo revisas estado operativo y puedes activar,
            desactivar o resincronizar filas ya enlazadas.
          </p>
        </div>
        <Button
          className="h-10 rounded-full bg-[var(--color-primary-900)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-primary-700)]"
          disabled={syncingAll || isLoading}
          onClick={async () => {
            setSyncingAll(true);
            try {
              await onSyncAll();
            } finally {
              setSyncingAll(false);
            }
          }}
        >
          {syncingAll ? "Sincronizando..." : "Importar desde Sanity"}
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-black/20 p-10 text-center">
          <p className="text-sm text-black/40">Cargando...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/20 p-10 text-center">
          <p className="text-sm font-medium text-black/50 uppercase tracking-wider">
            No hay surftrips en el inventario
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header — desktop */}
          <div className="hidden md:grid grid-cols-[1fr_90px_120px_130px_130px_190px] gap-4 px-5 pb-2 border-b border-black/10">
            <p className="text-xs font-medium text-black/40">Surftrip</p>
            <p className="text-xs font-medium text-black/40">Precio</p>
            <p className="text-xs font-medium text-black/40">Cupos</p>
            <p className="text-xs font-medium text-black/40">Fechas</p>
            <p className="text-xs font-medium text-black/40">Sync</p>
            <p className="text-xs font-medium text-black/40">Acciones</p>
          </div>

          {items.map((item) => {
            const spotsLeft = Math.max(0, item.capacity - item.enrolledCount);
            return (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_90px_120px_130px_130px_190px] gap-3 md:gap-4 items-center rounded-xl bg-black/[0.02] px-5 py-4 hover:bg-black/[0.04] transition-colors"
              >
                {/* Title + slug */}
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{item.title}</p>
                  <p className="text-[10px] font-mono text-black/30 truncate mt-0.5">{item.sanitySlug}</p>
                  <p className="text-[10px] text-black/35 truncate mt-0.5">{item.sanityDocumentId}</p>
                </div>

                {/* Price */}
                <div>
                  <span className="md:hidden text-xs font-medium text-black/40 mr-2">Precio:</span>
                  <span className="text-sm font-semibold">S/. {item.price}</span>
                </div>

                {/* Spots */}
                <div>
                  <span className="md:hidden text-xs font-medium text-black/40 mr-2">Cupos:</span>
                  <span className="text-sm">
                    <span className="font-bold text-[var(--color-primary-900)]">{spotsLeft}</span>
                    <span className="text-black/40"> / {item.capacity}</span>
                  </span>
                </div>

                {/* Dates */}
                <div>
                  <span className="md:hidden text-xs font-medium text-black/40 mr-2">Fechas:</span>
                  <span className="text-xs text-black/60">
                    {formatDate(item.startDate)} → {formatDate(item.endDate)}
                  </span>
                </div>

                {/* Sync */}
                <div>
                  <span className="md:hidden text-xs font-medium text-black/40 mr-2">Sync:</span>
                  <span className="text-xs text-black/60">
                    {item.syncedAt ? `Actualizado ${formatDate(item.syncedAt)}` : "Pendiente"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => void onToggle(item.id, item.isActive)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      item.isActive
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {item.isActive ? "Activo" : "Inactivo"}
                  </button>
                  <Button
                    className="h-8 rounded-full bg-[var(--color-primary-900)] px-3 text-xs font-semibold text-white hover:bg-[var(--color-primary-700)]"
                    disabled={syncingId === item.id || !item.sanityDocumentId}
                    onClick={async () => {
                      setSyncingId(item.id);
                      try {
                        await onSync(item.sanityDocumentId);
                      } finally {
                        setSyncingId((current) => (current === item.id ? null : current));
                      }
                    }}
                  >
                    {syncingId === item.id ? "Sync..." : "Re-sync"}
                  </Button>
                </div>
              </div>
            );
          })}

          <p className="text-xs text-black/40 font-medium pt-2 text-right">
            {items.length} {items.length === 1 ? "surftrip" : "surftrips"}
          </p>
        </div>
      )}
    </div>
  );
}
