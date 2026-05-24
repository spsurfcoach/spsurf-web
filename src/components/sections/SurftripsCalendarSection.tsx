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
      {/* Fill bar */}
      <div
        className="absolute inset-y-0 left-0 rounded-r-[40px]"
        style={{ width: `${fillPct}%`, backgroundColor: color }}
        aria-hidden="true"
      />
      {/* Row content */}
      <div className="relative flex h-full items-center justify-between gap-2 px-5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Level badge */}
          <span className="shrink-0 rounded-full bg-black px-3 py-0.5 text-[12px] font-medium text-white">
            {item.level}
          </span>
          {/* Destination */}
          <span className="truncate text-[22px] font-bold text-black leading-none">
            {item.destination}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          {/* Available count */}
          <span className="text-[14px] font-bold text-black whitespace-nowrap">
            {item.available} DISPONIBLES
          </span>
          {/* Dates */}
          <span className="hidden text-[16px] text-black/50 sm:block whitespace-nowrap">
            {item.dates}
          </span>
        </div>
      </div>
    </div>
  );
}

function getMonthLabel(startDate: string): string {
  const date = new Date(startDate + "T12:00:00Z");
  return date.toLocaleString("es-ES", { month: "long", year: "numeric", timeZone: "UTC" });
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function SurftripsCalendarSection() {
  const [view, setView] = useState<CalendarView>("semanal");

  const allTrips = surftripsCalendar.flat();

  const now = new Date();
  const eightWeeksFromNow = new Date(now.getTime() + 8 * 7 * 24 * 60 * 60 * 1000);

  const semanalTrips = allTrips.filter((item) => {
    const start = new Date(item.startDate + "T12:00:00Z");
    return start >= now && start <= eightWeeksFromNow;
  });

  // Group by month for mensual view
  const mensualGroups: { month: string; items: CalendarItem[] }[] = [];
  for (const item of allTrips) {
    const month = capitalize(getMonthLabel(item.startDate));
    const existing = mensualGroups.find((g) => g.month === month);
    if (existing) {
      existing.items.push(item);
    } else {
      mensualGroups.push({ month, items: [item] });
    }
  }

  return (
    <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">
        CALENDARIO
      </p>

      {/* Toggle */}
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

      {view === "semanal" ? (
        semanalTrips.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {semanalTrips.map((item) => (
              <CalendarRow key={`${item.destination}-${item.dates}`} item={item} />
            ))}
          </div>
        ) : (
          <p className="mt-8 ds-body-s text-[var(--color-label-muted)]">
            No hay próximos viajes en las próximas 8 semanas. Cambia a vista mensual para ver todos los viajes.
          </p>
        )
      ) : (
        <div className="mt-8 space-y-8">
          {mensualGroups.map((group) => (
            <div key={group.month}>
              <h3 className="ds-body-s mb-3 font-semibold uppercase tracking-widest text-[var(--color-label-muted)]">
                {group.month}
              </h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {group.items.map((item) => (
                  <CalendarRow key={`${item.destination}-${item.dates}`} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
