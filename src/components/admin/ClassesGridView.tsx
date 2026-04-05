"use client";

import { Fragment, useState } from "react";

type SlotItem = {
  id: string;
  startsAt: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
  location?: string;
};

type EnrolledStudent = {
  id: string;
  userId: string;
  bookedAt: string;
  status: string;
  fullName: string | null;
};

type Props = {
  items: SlotItem[];
  onFetchStudents: (slotId: string) => Promise<EnrolledStudent[]>;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

function fmtBookedAt(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("es-PE", { day: "numeric", month: "short" }) +
    " · " +
    d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
  );
}

export function ClassesGridView({ items, onFetchStudents }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [studentsMap, setStudentsMap] = useState<Map<string, EnrolledStudent[]>>(new Map());
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const now = new Date().toISOString();
  const sorted = [...items].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const upcoming = sorted.filter((s) => s.startsAt >= now);
  const past = sorted.filter((s) => s.startsAt < now).reverse();
  const displayed = showAll ? [...upcoming, ...past] : upcoming;

  async function toggleExpand(slotId: string) {
    if (expandedId === slotId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(slotId);
    if (!studentsMap.has(slotId)) {
      setLoadingId(slotId);
      try {
        const students = await onFetchStudents(slotId);
        setStudentsMap((prev) => {
          const next = new Map(prev);
          next.set(slotId, students);
          return next;
        });
      } finally {
        setLoadingId(null);
      }
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-black/10">
        <div>
          <h2 className="text-xl font-bold">Clases programadas</h2>
          <p className="text-sm text-black/50 mt-0.5">
            Horarios con ubicación y alumnos inscritos — haz clic en una fila para expandir.
          </p>
        </div>
        <div className="flex gap-1 rounded-xl bg-black/[0.04] p-1">
          <button
            type="button"
            onClick={() => setShowAll(false)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              !showAll ? "bg-white shadow-sm text-black" : "text-black/50 hover:text-black"
            }`}
          >
            Próximas
          </button>
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              showAll ? "bg-white shadow-sm text-black" : "text-black/50 hover:text-black"
            }`}
          >
            Todas
          </button>
        </div>
      </div>

      {/* Grid */}
      {displayed.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <p className="text-sm text-black/40">No hay clases próximas programadas.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-black/[0.03] border-b border-black/10">
                <th className="text-left px-5 py-3 text-xs font-semibold text-black/40 uppercase tracking-wider whitespace-nowrap">
                  Fecha
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-black/40 uppercase tracking-wider whitespace-nowrap">
                  Hora
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-black/40 uppercase tracking-wider whitespace-nowrap">
                  Lugar
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-black/40 uppercase tracking-wider whitespace-nowrap">
                  Alumnos
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-black/40 uppercase tracking-wider whitespace-nowrap">
                  Estado
                </th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {displayed.map((slot) => {
                const isExpanded = expandedId === slot.id;
                const isPast = slot.startsAt < now;
                const students = studentsMap.get(slot.id);
                const fill = Math.min(100, Math.round((slot.enrolledCount / slot.capacity) * 100));
                const fillColor =
                  fill >= 100 ? "bg-red-400" : fill >= 75 ? "bg-amber-400" : "bg-emerald-400";

                return (
                  <Fragment key={slot.id}>
                    {/* Main row */}
                    <tr
                      className={`border-b border-black/[0.07] cursor-pointer select-none transition-colors ${
                        isExpanded
                          ? "bg-[var(--color-primary-900)]/[0.04]"
                          : "hover:bg-black/[0.02]"
                      } ${isPast ? "opacity-50" : ""}`}
                      onClick={() => void toggleExpand(slot.id)}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-semibold capitalize">{fmtDate(slot.startsAt)}</span>
                        {isPast && (
                          <span className="ml-2 text-[10px] font-bold text-black/30 uppercase tracking-wider">
                            Pasada
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap font-mono font-bold text-[var(--color-primary-900)]">
                        {fmtTime(slot.startsAt)}
                      </td>

                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/[0.06] text-black/70">
                          {slot.location ?? "—"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-1.5 rounded-full bg-black/10 overflow-hidden shrink-0">
                            <div
                              className={`h-full rounded-full transition-all ${fillColor}`}
                              style={{ width: `${fill}%` }}
                            />
                          </div>
                          <span className="font-semibold whitespace-nowrap">
                            {slot.enrolledCount}
                            <span className="text-black/30 font-normal">/{slot.capacity}</span>
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            slot.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${slot.isActive ? "bg-emerald-500" : "bg-zinc-400"}`}
                          />
                          {slot.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <span
                          className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-black/40 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </span>
                      </td>
                    </tr>

                    {/* Expanded student list */}
                    {isExpanded && (
                      <tr className="bg-[var(--color-primary-900)]/[0.02] border-b border-black/[0.07]">
                        <td colSpan={6} className="px-5 py-4">
                          <div className="ml-4 pl-5 border-l-2 border-[var(--color-primary-900)]/20">
                            {loadingId === slot.id ? (
                              <p className="text-sm text-black/40 py-2">Cargando alumnos...</p>
                            ) : !students || students.length === 0 ? (
                              <p className="text-sm text-black/40 py-2">
                                Sin alumnos inscritos en esta clase.
                              </p>
                            ) : (
                              <div>
                                {/* Student table header */}
                                <div className="grid grid-cols-[28px_1fr_160px_80px] gap-x-4 text-xs font-semibold text-black/40 uppercase tracking-wider px-2 mb-1">
                                  <span>#</span>
                                  <span>Alumno</span>
                                  <span>Reservado el</span>
                                  <span>Estado</span>
                                </div>
                                {students.map((student, idx) => (
                                  <div
                                    key={student.id}
                                    className={`grid grid-cols-[28px_1fr_160px_80px] gap-x-4 items-center px-2 py-2 rounded-lg ${
                                      idx % 2 === 0 ? "bg-black/[0.025]" : ""
                                    }`}
                                  >
                                    <span className="text-xs font-bold text-black/30">{idx + 1}</span>
                                    <span className="font-semibold text-sm truncate">
                                      {student.fullName ?? (
                                        <span className="font-mono text-xs text-black/40">
                                          {student.userId.slice(0, 14)}…
                                        </span>
                                      )}
                                    </span>
                                    <span className="text-xs text-black/50 whitespace-nowrap">
                                      {fmtBookedAt(student.bookedAt)}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${
                                        student.status === "booked"
                                          ? "bg-emerald-100 text-emerald-800"
                                          : "bg-zinc-100 text-zinc-600"
                                      }`}
                                    >
                                      {student.status === "booked" ? "Inscrito" : student.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 border-t border-black/[0.06] bg-black/[0.01] flex items-center justify-between">
        <p className="text-xs text-black/40">
          {displayed.length} clase{displayed.length !== 1 ? "s" : ""}
        </p>
        {!showAll && past.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="text-xs font-medium text-black/40 hover:text-black transition-colors"
          >
            + {past.length} clase{past.length !== 1 ? "s" : ""} pasada
            {past.length !== 1 ? "s" : ""}
          </button>
        )}
      </div>
    </div>
  );
}
