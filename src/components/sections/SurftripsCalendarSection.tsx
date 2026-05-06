import { RevealGroup } from "@/components/animations/Reveal";
import type { SurftripListItem } from "@/lib/sanity";

function fillColor(availableSpots: number, capacity: number): string {
  const ratio = availableSpots / capacity;
  if (ratio <= 0.2) return "rgba(251,210,199,0.9)";
  if (ratio <= 0.5) return "rgba(255,203,147,0.4)";
  return "#d4efc4";
}

type CalendarItem = {
  destination: string;
  dates: string;
  level: string;
  availableSpots: number;
  capacity: number;
};

type SurftripsCalendarSectionProps = {
  trips: SurftripListItem[];
};

function formatDateRange(startDate: string, endDate: string) {
  const locale = "es-PE";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameYear = start.getFullYear() === end.getFullYear();
  const startText = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(start);
  const endText = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(end);
  return `${startText} - ${endText}`;
}

function CalendarRow({ item }: { item: CalendarItem }) {
  const safeCapacity = Math.max(item.capacity, 1);
  const taken = Math.min(Math.max(item.capacity - item.availableSpots, 0), safeCapacity);
  const fillPct = (taken / safeCapacity) * 100;
  const color = fillColor(item.availableSpots, safeCapacity);

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
            {item.availableSpots <= 0 ? "COMPLETO" : `${item.availableSpots} DISPONIBLES`}
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

export function SurftripsCalendarSection({ trips }: SurftripsCalendarSectionProps) {
  const items = trips
    .slice()
    .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate))
    .map<CalendarItem>((trip) => ({
      destination: trip.title,
      dates: formatDateRange(trip.startDate, trip.endDate),
      level: trip.level,
      availableSpots: trip.availableSpots,
      capacity: trip.capacity,
    }));

  const splitIndex = Math.ceil(items.length / 2);
  const leftCol = items.slice(0, splitIndex);
  const rightCol = items.slice(splitIndex);

  if (!items.length) {
    return (
      <section
        id="calendario"
        className="scroll-mt-28 bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20"
      >
        <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">CALENDARIO</p>
        <p className="ds-body-m mt-6 text-black">
          Publica surfcamps en <code>/studio</code> para ver disponibilidad y calendario aquí.
        </p>
      </section>
    );
  }

  return (
    <section
      id="calendario"
      className="scroll-mt-28 bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20"
    >
      <RevealGroup>
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
      </RevealGroup>
    </section>
  );
}
