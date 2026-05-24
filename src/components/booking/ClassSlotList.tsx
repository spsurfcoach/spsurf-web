"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type SlotItem = {
  id: string;
  startsAt: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
  location?: string;
};

type Props = {
  items: SlotItem[];
  onBook: (slotId: string) => Promise<void>;
};

type ViewMode = "week" | "month";

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function toMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toMonthDate(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function shiftMonthKey(monthKey: string, delta: number) {
  const date = toMonthDate(monthKey);
  date.setMonth(date.getMonth() + delta);
  return toMonthKey(date);
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfWeek(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const weekday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - weekday);
  return start;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isDateInWeek(dateKey: string, weekStart: Date) {
  const date = parseDateKey(dateKey);
  const weekEnd = addDays(weekStart, 6);
  return date >= weekStart && date <= weekEnd;
}

function monthTitle(monthKey: string) {
  return toMonthDate(monthKey).toLocaleDateString("es-PE", {
    month: "long",
    year: "numeric",
  });
}

function weekTitle(weekStart: Date) {
  const weekEnd = addDays(weekStart, 6);
  const sameMonth =
    weekStart.getMonth() === weekEnd.getMonth() && weekStart.getFullYear() === weekEnd.getFullYear();

  if (sameMonth) {
    const monthYear = weekEnd.toLocaleDateString("es-PE", { month: "long", year: "numeric" });
    return `${weekStart.getDate()} – ${weekEnd.getDate()} ${monthYear}`;
  }

  const startText = weekStart.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
  const endText = weekEnd.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
  return `${startText} – ${endText}`;
}

function slotsHeading(viewMode: ViewMode, selectedDayKey: string | null) {
  if (selectedDayKey) {
    return parseDateKey(selectedDayKey).toLocaleDateString("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  return viewMode === "week" ? "Clases de la semana" : "Clases del mes";
}

export function ClassSlotList({ items, onBook }: Props) {
  const todayKey = toDateKey(new Date());
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(() => toMonthKey(new Date()));
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(todayKey);
  const [locationFilter, setLocationFilter] = useState<"all" | "Lima" | "Sur Chico">("all");

  const slotsByDateKey = useMemo(() => {
    const grouped = new Map<string, SlotItem[]>();
    for (const slot of items) {
      const key = toDateKey(new Date(slot.startsAt));
      const current = grouped.get(key) ?? [];
      current.push(slot);
      grouped.set(key, current);
    }
    return grouped;
  }, [items]);

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = addDays(weekStart, index);
        return {
          dateKey: toDateKey(date),
          dayNumber: date.getDate(),
        };
      }),
    [weekStart],
  );

  const monthDays = useMemo(() => {
    const firstDay = toMonthDate(selectedMonth);
    const firstWeekDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0).getDate();
    const cells: Array<{ dateKey: string | null; dayNumber: number | null }> = [];

    for (let i = 0; i < firstWeekDay; i += 1) {
      cells.push({ dateKey: null, dayNumber: null });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), day);
      cells.push({ dateKey: toDateKey(date), dayNumber: day });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ dateKey: null, dayNumber: null });
    }

    return cells;
  }, [selectedMonth]);

  const calendarCells = viewMode === "week" ? weekDays : monthDays;
  const periodTitle = viewMode === "week" ? weekTitle(weekStart) : monthTitle(selectedMonth);
  const isCurrentPeriod =
    viewMode === "week"
      ? isDateInWeek(todayKey, weekStart)
      : selectedMonth === toMonthKey(new Date());

  const filteredSlots = useMemo(() => {
    let baseSlots: SlotItem[];

    if (selectedDayKey) {
      baseSlots = [...(slotsByDateKey.get(selectedDayKey) ?? [])];
    } else if (viewMode === "week") {
      baseSlots = items
        .filter((slot) => isDateInWeek(toDateKey(new Date(slot.startsAt)), weekStart))
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    } else {
      baseSlots = items
        .filter((slot) => toMonthKey(new Date(slot.startsAt)) === selectedMonth)
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    }

    const locationFiltered =
      locationFilter === "all" ? baseSlots : baseSlots.filter((slot) => slot.location === locationFilter);

    return locationFiltered.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [items, locationFilter, selectedDayKey, selectedMonth, slotsByDateKey, viewMode, weekStart]);

  function goToToday() {
    const today = new Date();
    setWeekStart(startOfWeek(today));
    setSelectedMonth(toMonthKey(today));
    setSelectedDayKey(toDateKey(today));
  }

  function navigatePeriod(delta: number) {
    if (viewMode === "week") {
      setWeekStart((current) => addDays(current, delta * 7));
      setSelectedDayKey((current) => {
        if (!current) return current;
        return toDateKey(addDays(parseDateKey(current), delta * 7));
      });
      return;
    }

    setSelectedMonth((current) => shiftMonthKey(current, delta));
  }

  function switchViewMode(mode: ViewMode) {
    if (mode === viewMode) return;

    if (mode === "week") {
      const anchor = selectedDayKey ? parseDateKey(selectedDayKey) : new Date();
      setWeekStart(startOfWeek(anchor));
      if (!selectedDayKey) {
        setSelectedDayKey(todayKey);
      }
    } else {
      const anchor = selectedDayKey ? parseDateKey(selectedDayKey) : weekStart;
      setSelectedMonth(toMonthKey(anchor));
    }

    setViewMode(mode);
  }

  function handleDaySelect(dateKey: string) {
    setSelectedDayKey((current) => (current === dateKey ? null : dateKey));
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-8 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-bold">Calendario</h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="flex rounded-xl bg-black/[0.04] p-1">
              {([
                { mode: "week" as const, label: "Semana" },
                { mode: "month" as const, label: "Mes" },
              ]).map((option) => (
                <button
                  key={option.mode}
                  type="button"
                  onClick={() => switchViewMode(option.mode)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    viewMode === option.mode
                      ? "bg-white text-black shadow-sm"
                      : "text-black/50 hover:text-black"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-full border-black/20"
                onClick={() => navigatePeriod(-1)}
                aria-label={viewMode === "week" ? "Semana anterior" : "Mes anterior"}
              >
                &lt;
              </Button>
              <p className="min-w-0 flex-1 text-center text-sm font-semibold capitalize sm:min-w-[180px] sm:flex-none lg:min-w-[220px]">
                {periodTitle}
              </p>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-full border-black/20"
                onClick={() => navigatePeriod(1)}
                aria-label={viewMode === "week" ? "Semana siguiente" : "Mes siguiente"}
              >
                &gt;
              </Button>
              {!isCurrentPeriod ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 shrink-0 rounded-full border-black/20 px-4 text-sm font-medium"
                  onClick={goToToday}
                >
                  Hoy
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-black/40">
          {WEEKDAY_LABELS.map((label) => (
            <p key={label}>{label}</p>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((cell, index) => {
            if (!cell.dateKey || !cell.dayNumber) {
              return <div key={`empty-${index}`} className="h-14 sm:h-16" />;
            }

            const dayCount = slotsByDateKey.get(cell.dateKey)?.length ?? 0;
            const isSelected = selectedDayKey === cell.dateKey;
            const isToday = cell.dateKey === todayKey;
            const isOutsideMonth =
              viewMode === "month" && toMonthKey(parseDateKey(cell.dateKey)) !== selectedMonth;

            return (
              <button
                key={cell.dateKey}
                type="button"
                onClick={() => handleDaySelect(cell.dateKey!)}
                className={`group relative flex h-14 sm:h-16 flex-col items-center justify-center rounded-xl border transition-all ${
                  isSelected
                    ? "border-[var(--color-primary-900)] bg-[var(--color-primary-900)] text-white"
                    : "border-transparent bg-black/[0.03] hover:bg-black/[0.06]"
                } ${isToday && !isSelected ? "ring-1 ring-inset ring-[var(--color-primary-500)]" : ""} ${
                  isOutsideMonth ? "opacity-40" : ""
                }`}
              >
                <span className="text-sm font-bold">{cell.dayNumber}</span>
                {dayCount > 0 ? (
                  <span
                    className={`mt-1 h-1.5 w-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-[var(--color-primary-500)] group-hover:opacity-80"
                    }`}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 border-t border-black/10 pt-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold capitalize">{slotsHeading(viewMode, selectedDayKey)}</h2>

          <div className="flex flex-wrap gap-2">
            {([
              { key: "all", label: "Todos" },
              { key: "Lima", label: "Lima" },
              { key: "Sur Chico", label: "Sur Chico" },
            ] as const).map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setLocationFilter(option.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  locationFilter === option.key
                    ? "bg-[var(--color-primary-900)] text-white"
                    : "bg-black/[0.04] text-black/60 hover:bg-black/[0.08] hover:text-black"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredSlots.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/20 p-8 text-center">
              <p className="text-sm text-black/50">
                {selectedDayKey
                  ? "No hay clases programadas para esta fecha"
                  : viewMode === "week"
                    ? "No hay clases programadas para esta semana"
                    : "No hay clases programadas para este mes"}
              </p>
            </div>
          ) : (
            filteredSlots.map((slot) => {
              const available = Math.max(0, Number(slot.capacity) - Number(slot.enrolledCount));
              const isFull = available <= 0;
              const dateObj = new Date(slot.startsAt);
              const timeString = dateObj.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
              const showDate = !selectedDayKey;

              return (
                <div
                  key={slot.id}
                  className="flex flex-col justify-between gap-4 rounded-xl bg-black/[0.02] p-4 transition hover:bg-black/[0.04] sm:flex-row sm:items-center sm:gap-6 sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                    <div className="flex shrink-0 flex-col items-start justify-center border-r border-black/10 pr-4 sm:pr-5">
                      {showDate ? (
                        <span className="text-xs font-semibold uppercase tracking-wide text-black/45">
                          {dateObj.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" })}
                        </span>
                      ) : null}
                      <span className="whitespace-nowrap text-lg font-bold sm:text-xl">{timeString}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-bold sm:text-lg">Clase de Surf</p>
                        {slot.location ? (
                          <span className="shrink-0 rounded-full bg-[var(--color-primary-900)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--color-primary-900)]">
                            {slot.location}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-sm text-black/60">
                        {isFull ? (
                          <span className="font-medium text-red-500">Cupos agotados</span>
                        ) : (
                          <span>{available} cupos disponibles</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={isFull ? "outline" : "primary"}
                    className={`h-11 w-full shrink-0 px-6 font-bold sm:w-auto ${
                      isFull
                        ? "opacity-50"
                        : "bg-[var(--color-primary-900)] text-white hover:bg-[var(--color-primary-700)]"
                    }`}
                    disabled={isFull || loadingId === slot.id}
                    onClick={async () => {
                      setLoadingId(slot.id);
                      try {
                        await onBook(slot.id);
                      } finally {
                        setLoadingId(null);
                      }
                    }}
                  >
                    {loadingId === slot.id ? "Reservando..." : isFull ? "Completo" : "Reservar clase"}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
