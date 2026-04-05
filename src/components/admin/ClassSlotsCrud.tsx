"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  isLoading?: boolean;
  onCreate: (payload: { startsAt: string; capacity: number; location: string }) => Promise<void>;
  onToggle: (id: string, current: boolean) => Promise<void>;
  onSelectSlot?: (id: string) => void;
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

export function ClassSlotsCrud({ items, isLoading = false, onCreate, onToggle, onSelectSlot }: Props) {
  const [startsAt, setStartsAt] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("Lima");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
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

  const filteredSlots = useMemo(() => {
    if (selectedDayKey) {
      return [...(slotsByDateKey.get(selectedDayKey) ?? [])].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    }

    return items
      .filter((slot) => toMonthKey(new Date(slot.startsAt)) === selectedMonth)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [items, selectedDayKey, selectedMonth, slotsByDateKey]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onCreate({ startsAt, capacity: Number(capacity), location });
      setStartsAt("");
      setCapacity("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Agenda del coach</h2>
        <p className="text-sm text-black/50 mt-1">Crea los horarios disponibles y monitorea las reservas de los alumnos.</p>
      </div>

      <div className="space-y-8">
        <form className="grid gap-5 md:grid-cols-[1fr_1fr_1fr_auto] rounded-xl bg-black/[0.02] p-6 border border-black/5" onSubmit={submit}>
          <div className="space-y-2">
            <p className="text-sm font-medium text-black/50">Fecha y hora</p>
            <Input className="h-12 bg-white" type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-black/50">Capacidad</p>
            <Input
              className="h-12 bg-white"
              type="number"
              min={1}
              placeholder="Ej: 8"
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-black/50">Ubicación</p>
            <select
              className="h-12 w-full rounded-md border border-input bg-white px-3 text-sm"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            >
              <option value="Lima">Lima</option>
              <option value="Sur Chico">Sur Chico</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={isSubmitting} className="h-12 px-8 font-bold w-full">
              {isSubmitting ? "Creando..." : "Crear"}
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-semibold text-sm text-black/50">Vista de calendario</h3>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="icon" className="h-10 w-10 rounded-full border-black/20" onClick={() => setSelectedMonth((current) => shiftMonthKey(current, -1))}>
                &lt;
              </Button>
              <p className="min-w-[140px] text-center text-sm font-semibold capitalize">{monthTitle(selectedMonth)}</p>
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
                return <div key={`empty-${index}`} className="h-16" />;
              }

              const dayCount = slotsByDateKey.get(cell.dateKey)?.length ?? 0;
              const isSelected = selectedDayKey === cell.dateKey;
              const isToday = cell.dateKey === toDateKey(new Date());

              return (
                <button
                  key={cell.dateKey}
                  type="button"
                  onClick={() => setSelectedDayKey((current) => (current === cell.dateKey ? null : cell.dateKey))}
                  className={`group relative flex h-16 flex-col items-center justify-center rounded-xl border transition-all ${
                    isSelected
                      ? "border-[var(--color-primary-900)] bg-[var(--color-primary-900)] text-white"
                      : "border-transparent bg-black/[0.03] hover:bg-black/[0.06]"
                  } ${isToday && !isSelected ? "ring-1 ring-inset ring-[var(--color-primary-500)]" : ""}`}
                >
                  <span className="text-sm font-bold">{cell.dayNumber}</span>
                  <span className={`text-[10px] font-medium mt-0.5 ${isSelected ? "text-white/70" : dayCount > 0 ? "text-[var(--color-primary-500)]" : "text-black/30"}`}>
                    {dayCount > 0 ? `${dayCount} cls` : "·"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 border-t border-black/10 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold">
              {selectedDayKey
                ? `${new Date(`${selectedDayKey}T00:00:00`).toLocaleDateString("es-PE", { day: "numeric", month: "long" })}`
                : "Clases del mes"}
            </h3>
            {selectedDayKey && (
              <Button type="button" variant="outline" size="sm" className="h-9 font-bold" onClick={() => setSelectedDayKey(null)}>
                Ver todo el mes
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="rounded-xl border border-dashed border-black/20 p-6 text-center">
                <p className="text-sm text-black/50">Cargando horarios...</p>
              </div>
            ) : filteredSlots.length === 0 ? (
              <div className="rounded-xl border border-dashed border-black/20 p-8 text-center">
                <p className="text-sm text-black/50">No hay horarios para la fecha seleccionada</p>
              </div>
            ) : (
              filteredSlots.map((slot) => {
                const available = Math.max(0, Number(slot.capacity) - Number(slot.enrolledCount));
                const dateObj = new Date(slot.startsAt);
                const timeString = dateObj.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
                const dateString = dateObj.toLocaleDateString("es-PE", { day: "numeric", month: "short" });

                return (
                  <div key={slot.id} className={`flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 rounded-xl border p-5 transition-shadow hover:shadow-sm ${slot.isActive ? 'border-black/10 bg-white' : 'border-black/5 bg-black/[0.02]'}`}>
                    <div className="flex items-center gap-5">
                      <div className="flex flex-col items-center justify-center border-r border-black/10 pr-5">
                        <span className="text-xl font-bold">{timeString}</span>
                        <span className="text-xs font-medium text-black/40">{dateString}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${slot.isActive ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-600"}`}>
                            {slot.isActive ? "Activo" : "Inactivo"}
                          </div>
                          <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/10 text-black/70">
                            {slot.enrolledCount}/{slot.capacity} inscritos
                          </div>
                          {slot.location && (
                            <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--color-primary-900)]/10 text-[var(--color-primary-900)]">
                              {slot.location}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-black/50">
                          {available} cupos disponibles
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      {onSelectSlot && (
                        <Button variant="outline" className="flex-1 sm:flex-none font-bold" onClick={() => onSelectSlot(slot.id)}>
                          Ver reservas
                        </Button>
                      )}
                      <Button
                        variant={slot.isActive ? "secondary" : "primary"}
                        className="flex-1 sm:flex-none font-bold"
                        disabled={pendingToggleId === slot.id}
                        onClick={async () => {
                          setPendingToggleId(slot.id);
                          try {
                            await onToggle(slot.id, slot.isActive);
                          } finally {
                            setPendingToggleId(null);
                          }
                        }}
                      >
                        {pendingToggleId === slot.id ? "..." : slot.isActive ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
