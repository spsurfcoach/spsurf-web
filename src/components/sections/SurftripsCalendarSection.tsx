import { surftripsCalendar } from "@/lib/content";
import type { CalendarItem } from "@/lib/content";

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

export function SurftripsCalendarSection() {
  const [leftCol, rightCol] = surftripsCalendar;

  return (
    <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">
        CALENDARIO
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {leftCol.map((item) => (
            <CalendarRow key={`${item.destination}-${item.dates}`} item={item} />
          ))}
        </div>
        {/* Right column */}
        <div className="flex flex-col gap-4">
          {rightCol.map((item) => (
            <CalendarRow key={`${item.destination}-${item.dates}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
