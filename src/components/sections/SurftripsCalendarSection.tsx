"use client";

import { useState } from "react";
import { surftripsCalendar } from "@/lib/content";
import type { CalendarItem } from "@/lib/content";

type CalendarView = "semanal" | "mensual";

function fillColor(available: number, capacity: number): string {
  const ratio = available / capacity;
  if (ratio <= 0.2) return "rgba(251,210,199,0.9)";
  if (ratio <= 0.5) return "rgba(255,203,147,0.4)";
  return "#d4efc4";
}

function CalendarRow({ item }: { item: CalendarItem }) {
  const taken = item.capacity - item.available;
  const fillPct = (taken / item.capacity) * 100;
  const color = fillColor(item.available, item.capacity);

  return (
    <div className="relative h-[67px] overflow-hidden rounded-[40px] border-2 border-black">
      <div
        className="absolute inset-y-0 left-0 rounded-r-[40px]"
        style={{ width: `${fillPct}%`, backgroundColor: color }}
        aria-hidden="true"
      />
      <div className="relative flex h-full items-center justify-between gap-2 px-5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 rounded-full bg-black px-3 py-0.5 text-[12px] font-medium text-white">
            {item.level}
          </span>
          <span className="truncate text-[22px] font-bold text-black leading-none">
            {item.destination}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <span className="text-[14px] font-bold text-black whitespace-nowrap">
            {item.available} DISPONIBLES
          </span>
          <span className="hidden text-[16px] text-black/50 sm:block whitespace-nowrap">
            {item.dates}
          </span>
        </div>
      </div>
    </div>
  );
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
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
  const start = monday.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
  const end = sunday.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  return `${start} – ${end}`;
}

function formatMonthLabel(date: Date): string {
  const label = date.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function SurftripsCalendarSection() {
  const [view, setView] = useState<CalendarView>("semanal");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const allTrips = surftripsCalendar.flat();

  // Semanal: current week + offset
  const baseMonday = getMonday(new Date());
  const monday = addDays(baseMonday, weekOffset * 7);
  const sunday = addDays(monday, 6);
  sunday.setHours(23, 59, 59, 999);

  const semanalTrips = allTrips.filter((item) => {
    const start = new Date(item.startDate + "T12:00:00Z");
    return start >= monday && start <= sunday;
  });

  // Mensual: current month + offset
  const today = new Date();
  const currentMonthBase = new Date(today.getFullYear(), today.getMonth(), 1);
  const activeMonth = addMonths(currentMonthBase, monthOffset);
  const activeMonthEnd = addMonths(activeMonth, 1);

  const mensualTrips = allTrips.filter((item) => {
    const start = new Date(item.startDate + "T12:00:00Z");
    return start >= activeMonth && start < activeMonthEnd;
  });

  // All trips grouped by month for reference
  const allMonthGroups: { month: string; items: CalendarItem[] }[] = [];
  for (const item of allTrips) {
    const d = new Date(item.startDate + "T12:00:00Z");
    const month = capitalize(d.toLocaleString("es-ES", { month: "long", year: "numeric", timeZone: "UTC" }));
    const existing = allMonthGroups.find((g) => g.month === month);
    if (existing) existing.items.push(item);
    else allMonthGroups.push({ month, items: [item] });
  }

  return (
    <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">
        CALENDARIO
      </p>

      {/* View toggle + navigation */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {/* Semanal / Mensual buttons */}
        <div className="flex items-center gap-2">
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

        {/* Week navigation */}
        {view === "semanal" && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWeekOffset((o) => o - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-black/60 transition hover:border-black hover:text-black"
              aria-label="Semana anterior"
            >
              ‹
            </button>
            <span className="ds-body-s min-w-[200px] text-center font-medium text-[var(--color-text-default)]">
              {formatWeekRange(monday)}
            </span>
            <button
              onClick={() => setWeekOffset((o) => o + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-black/60 transition hover:border-black hover:text-black"
              aria-label="Semana siguiente"
            >
              ›
            </button>
          </div>
        )}

        {/* Month navigation */}
        {view === "mensual" && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMonthOffset((o) => o - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-black/60 transition hover:border-black hover:text-black"
              aria-label="Mes anterior"
            >
              ‹
            </button>
            <span className="ds-body-s min-w-[160px] text-center font-medium text-[var(--color-text-default)]">
              {formatMonthLabel(activeMonth)}
            </span>
            <button
              onClick={() => setMonthOffset((o) => o + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-black/60 transition hover:border-black hover:text-black"
              aria-label="Mes siguiente"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {view === "semanal" ? (
        semanalTrips.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {semanalTrips.map((item) => (
              <CalendarRow key={`${item.destination}-${item.dates}`} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-start gap-3">
            <p className="ds-body-s text-[var(--color-label-muted)]">
              No hay viajes esta semana.
            </p>
            <button
              onClick={() => setView("mensual")}
              className="ds-btn ds-btn-secondary"
            >
              Ver todos los viajes
            </button>
          </div>
        )
      ) : (
        mensualTrips.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {mensualTrips.map((item) => (
              <CalendarRow key={`${item.destination}-${item.dates}`} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-start gap-3">
            <p className="ds-body-s text-[var(--color-label-muted)]">
              No hay viajes este mes.
            </p>
          </div>
        )
      )}
    </section>
  );
}
