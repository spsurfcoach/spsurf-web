"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type SlotItem = {
  id: string;
  startsAt: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
};

type Props = {
  items: SlotItem[];
  onBook: (slotId: string) => Promise<void>;
};

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

function monthTitle(monthKey: string) {
  return toMonthDate(monthKey).toLocaleDateString("es-PE", {
    month: "long",
    year: "numeric",
  });
}

export function ClassSlotList({ items, onBook }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(() => toMonthKey(new Date()));
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(() => toDateKey(new Date()));

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

  const monthDays = useMemo(() => {
    const firstDay = toMonthDate(selectedMonth);
    const firstWeekDay = (firstDay.getDay() + 6) % 7; // Monday = 0
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

  const filteredSlots = useMemo(() => {
    if (selectedDayKey) {
      return [...(slotsByDateKey.get(selectedDayKey) ?? [])].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    }
    return items
      .filter((slot) => toMonthKey(new Date(slot.startsAt)) === selectedMonth)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [items, selectedDayKey, selectedMonth, slotsByDateKey]);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold uppercase">Calendario</h2>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="icon" className="h-10 w-10 rounded-full border-black/20" onClick={() => setSelectedMonth((current) => shiftMonthKey(current, -1))}>
              &lt;
            </Button>
            <p className="min-w-[140px] text-center text-sm font-bold uppercase tracking-widest">{monthTitle(selectedMonth)}</p>
            <Button type="button" variant="outline" size="icon" className="h-10 w-10 rounded-full border-black/20" onClick={() => setSelectedMonth((current) => shiftMonthKey(current, 1))}>
              &gt;
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-black/40">
          <p>Lun</p>
          <p>Mar</p>
          <p>Mié</p>
          <p>Jue</p>
          <p>Vie</p>
          <p>Sáb</p>
          <p>Dom</p>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((cell, index) => {
            if (!cell.dateKey || !cell.dayNumber) {
              return <div key={`empty-${index}`} className="h-14 sm:h-16" />;
            }

            const dayCount = slotsByDateKey.get(cell.dateKey)?.length ?? 0;
            const isSelected = selectedDayKey === cell.dateKey;
            const isToday = cell.dateKey === toDateKey(new Date());

            return (
              <button
                key={cell.dateKey}
                type="button"
                onClick={() => setSelectedDayKey((current) => (current === cell.dateKey ? null : cell.dateKey))}
                className={`group relative flex h-14 sm:h-16 flex-col items-center justify-center rounded-xl border transition-all ${
                  isSelected 
                    ? "border-black bg-black text-white" 
                    : "border-transparent bg-black/[0.03] hover:bg-black/[0.06]"
                } ${isToday && !isSelected ? "ring-1 ring-inset ring-black/30" : ""}`}
              >
                <span className="text-sm font-bold">{cell.dayNumber}</span>
                {dayCount > 0 && (
                  <span className={`mt-1 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-black/40 group-hover:bg-black/60"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 border-t border-black/10 pt-8">
        <h2 className="text-2xl font-bold uppercase mb-6">
          {selectedDayKey
            ? `${new Date(`${selectedDayKey}T00:00:00`).toLocaleDateString("es-PE", { day: "numeric", month: "long" })}`
            : "Clases del mes"}
        </h2>
        
        <div className="space-y-4">
          {filteredSlots.length === 0 ? (
            <p className="text-black/60">No hay clases programadas para esta fecha.</p>
          ) : (
            filteredSlots.map((slot) => {
              const available = Math.max(0, Number(slot.capacity) - Number(slot.enrolledCount));
              const isFull = available <= 0;
              const dateObj = new Date(slot.startsAt);
              const timeString = dateObj.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
              
              return (
                <div key={slot.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-black/[0.02] p-4 sm:p-5 transition hover:bg-black/[0.04]">
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col items-center justify-center border-r border-black/10 pr-5">
                      <span className="text-xl font-bold">{timeString}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-black/50">Hora</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">Clase de Surf</p>
                      <p className="text-sm text-black/60 mt-0.5">
                        {isFull ? (
                          <span className="text-red-500 font-medium">Cupos agotados</span>
                        ) : (
                          <span>{available} cupos disponibles</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={isFull ? "outline" : "primary"}
                    className={isFull ? "opacity-50" : "bg-black text-white hover:bg-black/80 font-bold px-6 h-11"}
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
