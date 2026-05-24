"use client";

import { useState } from "react";
import Link from "next/link";
import { weeklyClassSlots } from "@/lib/content";
import type { ClassSlot } from "@/lib/content";

type CalendarView = "semanal" | "mensual";

const DAY_LABELS_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DAY_LABELS_FULL  = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// ── helpers ──────────────────────────────────────────────────────────────────

function getMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function addMonths(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function formatWeekRange(monday: Date): string {
  const sunday = addDays(monday, 6);
  const start = monday.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  const end = sunday.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  return `${start} – ${end}`;
}

function formatMonthLabel(date: Date): string {
  const s = date.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function availabilityColor(available: number, capacity: number): string {
  const ratio = available / capacity;
  if (ratio === 0) return "bg-zinc-200 text-zinc-400";
  if (ratio <= 0.33) return "bg-red-50 text-red-700 border border-red-200";
  if (ratio <= 0.66) return "bg-amber-50 text-amber-700 border border-amber-200";
  return "bg-emerald-50 text-emerald-800 border border-emerald-200";
}

function availabilityDot(available: number, capacity: number): string {
  const ratio = available / capacity;
  if (ratio === 0) return "bg-zinc-300";
  if (ratio <= 0.33) return "bg-red-400";
  if (ratio <= 0.66) return "bg-amber-400";
  return "bg-emerald-400";
}

// ── sub-components ───────────────────────────────────────────────────────────

function SlotCard({ slot }: { slot: ClassSlot }) {
  const colorClass = availabilityColor(slot.available, slot.capacity);
  const isFull = slot.available === 0;

  return (
    <div className={`rounded-2xl p-3 ${colorClass} transition-all`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[13px] font-bold leading-none">{slot.time}</p>
          <p className="mt-1 text-[12px] font-semibold">{slot.type}</p>
          <p className="mt-0.5 text-[11px] opacity-70">{slot.level}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-semibold">
          {slot.durationMin}min
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] font-medium">
          {isFull ? "Sin cupos" : `${slot.available} cupos`}
        </span>
        {!isFull && (
          <Link
            href="/servicios#reserva"
            className="rounded-full bg-black/10 px-3 py-1 text-[11px] font-semibold hover:bg-black/20 transition-colors"
          >
            Reservar
          </Link>
        )}
      </div>
    </div>
  );
}

function NavButton({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-black/60 text-lg transition hover:border-black hover:text-black"
    >
      {children}
    </button>
  );
}

// ── Weekly view ───────────────────────────────────────────────────────────────

function WeeklyView({ weekOffset, onWeekChange }: { weekOffset: number; onWeekChange: (n: number) => void }) {
  const baseMonday = getMonday(new Date());
  const monday = addDays(baseMonday, weekOffset * 7);

  // Build 7-day columns: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    const dow = date.getDay(); // 0=Sun, 1=Mon...
    const slots = weeklyClassSlots.filter((s) => s.dayOfWeek === dow);
    return { date, dow, slots };
  });

  const hasAnySlot = days.some((d) => d.slots.length > 0);

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <NavButton onClick={() => onWeekChange(weekOffset - 1)} label="Semana anterior">‹</NavButton>
        <span className="ds-body-s min-w-[180px] text-center font-medium">
          {formatWeekRange(monday)}
        </span>
        <NavButton onClick={() => onWeekChange(weekOffset + 1)} label="Semana siguiente">›</NavButton>
      </div>

      {/* Desktop: 7-column grid */}
      {hasAnySlot ? (
        <>
          <div className="mt-6 hidden lg:grid lg:grid-cols-7 lg:gap-3">
            {days.map(({ date, dow, slots }) => {
              const isToday =
                new Date().toDateString() === date.toDateString();
              return (
                <div key={dow} className="min-h-[120px]">
                  <div
                    className={`mb-2 rounded-xl px-2 py-2 text-center ${
                      isToday
                        ? "bg-[var(--color-primary-900)] text-white"
                        : "bg-zinc-100"
                    }`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
                      {DAY_LABELS_SHORT[dow]}
                    </p>
                    <p className={`text-[20px] font-bold leading-none ${isToday ? "text-white" : "text-black"}`}>
                      {date.getDate()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {slots.map((slot, i) => (
                      <SlotCard key={i} slot={slot} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: vertical list grouped by day */}
          <div className="mt-6 space-y-4 lg:hidden">
            {days
              .filter((d) => d.slots.length > 0)
              .map(({ date, dow, slots }) => {
                const isToday = new Date().toDateString() === date.toDateString();
                return (
                  <div key={dow}>
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isToday
                            ? "bg-[var(--color-primary-900)] text-white"
                            : "bg-zinc-100 text-black"
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      <span className="ds-body-s font-semibold">
                        {DAY_LABELS_FULL[dow]}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {slots.map((slot, i) => (
                        <SlotCard key={i} slot={slot} />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <p className="mt-6 ds-body-s text-zinc-400">
          No hay clases programadas esta semana.
        </p>
      )}
    </div>
  );
}

// ── Monthly view ──────────────────────────────────────────────────────────────

function MonthlyView({ monthOffset, onMonthChange }: { monthOffset: number; onMonthChange: (n: number) => void }) {
  const today = new Date();
  const base = new Date(today.getFullYear(), today.getMonth(), 1);
  const activeMonth = addMonths(base, monthOffset);

  const year = activeMonth.getFullYear();
  const month = activeMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Start grid on Monday
  const startDow = firstDay.getDay(); // 0=Sun
  const prefixDays = startDow === 0 ? 6 : startDow - 1;

  const totalCells = prefixDays + lastDay.getDate();
  const rows = Math.ceil(totalCells / 7);

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <NavButton onClick={() => onMonthChange(monthOffset - 1)} label="Mes anterior">‹</NavButton>
        <span className="ds-body-s min-w-[160px] text-center font-medium">
          {formatMonthLabel(activeMonth)}
        </span>
        <NavButton onClick={() => onMonthChange(monthOffset + 1)} label="Mes siguiente">›</NavButton>
      </div>

      {/* Day-of-week headers */}
      <div className="mt-6 grid grid-cols-7 gap-1">
        {DAY_LABELS_SHORT.slice(1).concat(DAY_LABELS_SHORT[0]).map((d) => (
          <div key={d} className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            {d}
          </div>
        ))}

        {/* Prefix empty cells */}
        {Array.from({ length: prefixDays }).map((_, i) => (
          <div key={`pre-${i}`} />
        ))}

        {/* Day cells */}
        {Array.from({ length: lastDay.getDate() }, (_, i) => {
          const dayNum = i + 1;
          const date = new Date(year, month, dayNum);
          const dow = date.getDay();
          const slots = weeklyClassSlots.filter((s) => s.dayOfWeek === dow);
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === dayNum;

          return (
            <div
              key={dayNum}
              className={`rounded-xl border p-1.5 min-h-[56px] ${
                isToday ? "border-[var(--color-primary-700)] bg-[var(--color-primary-900)]/5" : "border-zinc-100"
              }`}
            >
              <p className={`text-[13px] font-bold ${isToday ? "text-[var(--color-primary-700)]" : "text-black"}`}>
                {dayNum}
              </p>
              {slots.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-0.5">
                  {slots.map((slot, si) => (
                    <span
                      key={si}
                      className={`h-2 w-2 rounded-full ${availabilityDot(slot.available, slot.capacity)}`}
                      title={`${slot.time} ${slot.type}`}
                    />
                  ))}
                </div>
              )}
              {slots.length > 0 && (
                <p className="mt-0.5 hidden text-[10px] text-zinc-500 sm:block">
                  {slots.length} clase{slots.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {[
          { color: "bg-emerald-400", label: "Disponible" },
          { color: "bg-amber-400", label: "Pocos cupos" },
          { color: "bg-red-400", label: "Casi lleno" },
          { color: "bg-zinc-300", label: "Sin cupos" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
            <span className="ds-chip text-zinc-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export function ClassCalendarSection() {
  const [view, setView] = useState<CalendarView>("semanal");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  return (
    <section id="calendario" className="section-space bg-zinc-50 px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="max-w-5xl">
        <p className="ds-label tracking-[2.73px] text-[var(--color-label-muted)]">
          RESERVA TU CLASE
        </p>
        <h2 className="ds-h2 mt-2">Horario de clases</h2>

        {/* View toggle */}
        <div className="mt-6 flex items-center gap-2">
          {(["semanal", "mensual"] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`ds-btn ${view === v ? "ds-btn-primary" : "ds-btn-secondary"}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {view === "semanal" ? (
            <WeeklyView weekOffset={weekOffset} onWeekChange={setWeekOffset} />
          ) : (
            <MonthlyView monthOffset={monthOffset} onMonthChange={setMonthOffset} />
          )}
        </div>
      </div>
    </section>
  );
}
