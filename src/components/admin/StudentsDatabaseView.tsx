"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export type StudentItem = {
  uid: string;
  email: string | null;
  packageType: "credits" | "unlimited" | null;
  remainingCredits: number | null;
  expiresAt: string | null;
  status: string | null;
  purchaseId: string | null;
  createdAt: string | null;
};

type Props = {
  items: StudentItem[];
};

const STATUS_LABELS: Record<string, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  rejected: "Rechazado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-zinc-100 text-zinc-600",
};

function formatDate(isoString: string | null) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function StudentsDatabaseView({ items }: Props) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? items.filter((s) => (s.email ?? s.uid).toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold">Estudiantes</h2>
          <p className="text-sm text-black/50 mt-1">Historial de compras y estado de cada alumno registrado.</p>
        </div>
        <div className="w-full sm:w-72">
          <Input
            className="h-11 bg-black/[0.02] border-transparent focus-visible:ring-black/20 focus-visible:bg-white transition-colors"
            placeholder="Buscar por email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/20 p-10 text-center">
          <p className="text-sm font-medium text-black/50 uppercase tracking-wider">
            {items.length === 0 ? "Aún no hay estudiantes registrados" : "No se encontraron estudiantes con ese criterio"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header row — desktop only */}
          <div className="hidden md:grid grid-cols-[1fr_120px_130px_110px_130px] gap-4 px-5 pb-2 border-b border-black/10">
            <p className="text-xs font-medium text-black/40">Estudiante</p>
            <p className="text-xs font-medium text-black/40">Plan</p>
            <p className="text-xs font-medium text-black/40">Balance</p>
            <p className="text-xs font-medium text-black/40">Estado</p>
            <p className="text-xs font-medium text-black/40">Fecha compra</p>
          </div>

          {filtered.map((student) => (
            <div
              key={student.uid}
              className="grid grid-cols-1 md:grid-cols-[1fr_120px_130px_110px_130px] gap-3 md:gap-4 items-center rounded-xl bg-black/[0.02] px-5 py-4 hover:bg-black/[0.04] transition-colors"
            >
              {/* Email / UID */}
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{student.email ?? "—"}</p>
                <p className="text-[10px] font-mono text-black/30 truncate mt-0.5">{student.uid}</p>
              </div>

              {/* Package type */}
              <div>
                <span className="md:hidden text-xs font-medium text-black/40 mr-2">Plan:</span>
                <span className="text-sm font-medium text-black/70">
                  {student.packageType === "credits" ? "Créditos" : student.packageType === "unlimited" ? "Ilimitado" : "—"}
                </span>
              </div>

              {/* Balance */}
              <div>
                <span className="md:hidden text-xs font-medium text-black/40 mr-2">Balance:</span>
                <span className="text-sm font-medium">
                  {student.packageType === "credits" ? (
                    <span className="font-bold text-[var(--color-primary-900)]">
                      {student.remainingCredits ?? 0} créditos
                    </span>
                  ) : student.packageType === "unlimited" ? (
                    <span className="font-bold text-[var(--color-primary-900)]">
                      ∞ · hasta {formatDate(student.expiresAt)}
                    </span>
                  ) : "—"}
                </span>
              </div>

              {/* Status badge */}
              <div>
                <span className="md:hidden text-xs font-medium text-black/40 mr-2">Estado:</span>
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    STATUS_COLORS[student.status ?? ""] ?? "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {STATUS_LABELS[student.status ?? ""] ?? student.status ?? "—"}
                </span>
              </div>

              {/* Purchase date */}
              <div>
                <span className="md:hidden text-xs font-medium text-black/40 mr-2">Compra:</span>
                <span className="text-sm text-black/60">{formatDate(student.createdAt)}</span>
              </div>
            </div>
          ))}

          <p className="text-xs text-black/40 font-medium pt-2 text-right">
            {filtered.length} {filtered.length === 1 ? "estudiante" : "estudiantes"}
          </p>
        </div>
      )}
    </div>
  );
}
