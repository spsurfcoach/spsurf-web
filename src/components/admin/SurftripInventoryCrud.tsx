"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type SurftripInventoryItem = {
  id: string;
  sanitySlug: string;
  title: string;
  price: number;
  currency: string;
  capacity: number;
  enrolledCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

type Props = {
  items: SurftripInventoryItem[];
  isLoading: boolean;
  onCreate: (payload: {
    sanitySlug: string;
    title: string;
    price: number;
    capacity: number;
    startDate: string;
    endDate: string;
  }) => Promise<void>;
  onToggle: (id: string, current: boolean) => Promise<void>;
};

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
}

export function SurftripInventoryCrud({ items, isLoading, onCreate, onToggle }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    sanitySlug: "",
    title: "",
    price: "",
    capacity: "",
    startDate: "",
    endDate: "",
  });
  const [saving, setSaving] = useState(false);

  function setField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreate() {
    if (!form.sanitySlug || !form.title || !form.price || !form.capacity || !form.startDate || !form.endDate) return;
    setSaving(true);
    try {
      await onCreate({
        sanitySlug: form.sanitySlug.trim(),
        title: form.title.trim(),
        price: parseFloat(form.price),
        capacity: parseInt(form.capacity, 10),
        startDate: form.startDate,
        endDate: form.endDate,
      });
      setForm({ sanitySlug: "", title: "", price: "", capacity: "", startDate: "", endDate: "" });
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "h-10 bg-black/[0.03] border-transparent focus-visible:ring-black/20 focus-visible:bg-white transition-colors rounded-xl text-sm";

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Inventario de Surftrips</h2>
          <p className="text-sm text-black/50 mt-1">
            Gestiona los viajes disponibles para compra. Enlázalos al slug de Sanity CMS.
          </p>
        </div>
        <Button
          className="h-10 rounded-xl font-semibold bg-[var(--color-primary-900)] hover:bg-[var(--color-primary-700)] text-white text-sm px-5"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancelar" : "+ Nuevo surftrip"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl border border-black/10 bg-black/[0.02] p-5 space-y-4">
          <h3 className="font-semibold text-sm">Nuevo surftrip</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              className={inputCls}
              placeholder="Título *"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
            />
            <Input
              className={inputCls}
              placeholder="Sanity slug * (ej: chicama-2025)"
              value={form.sanitySlug}
              onChange={(e) => setField("sanitySlug", e.target.value)}
            />
            <Input
              className={inputCls}
              placeholder="Precio PEN *"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
            />
            <Input
              className={inputCls}
              placeholder="Capacidad (cupos) *"
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => setField("capacity", e.target.value)}
            />
            <div className="space-y-1">
              <label className="text-xs text-black/40 pl-1">Fecha inicio *</label>
              <Input
                className={inputCls}
                type="date"
                value={form.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-black/40 pl-1">Fecha fin *</label>
              <Input
                className={inputCls}
                type="date"
                value={form.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
              />
            </div>
          </div>
          <Button
            className="h-10 rounded-xl font-semibold bg-[var(--color-primary-900)] hover:bg-[var(--color-primary-700)] text-white text-sm px-6"
            onClick={() => void handleCreate()}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Crear surftrip"}
          </Button>
        </div>
      )}

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
          <div className="hidden md:grid grid-cols-[1fr_100px_120px_140px_100px] gap-4 px-5 pb-2 border-b border-black/10">
            <p className="text-xs font-medium text-black/40">Surftrip</p>
            <p className="text-xs font-medium text-black/40">Precio</p>
            <p className="text-xs font-medium text-black/40">Cupos</p>
            <p className="text-xs font-medium text-black/40">Fechas</p>
            <p className="text-xs font-medium text-black/40">Estado</p>
          </div>

          {items.map((item) => {
            const spotsLeft = item.capacity - item.enrolledCount;
            return (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_100px_120px_140px_100px] gap-3 md:gap-4 items-center rounded-xl bg-black/[0.02] px-5 py-4 hover:bg-black/[0.04] transition-colors"
              >
                {/* Title + slug */}
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{item.title}</p>
                  <p className="text-[10px] font-mono text-black/30 truncate mt-0.5">{item.sanitySlug}</p>
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

                {/* Toggle */}
                <div>
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
