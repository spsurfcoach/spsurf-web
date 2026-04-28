import Link from "next/link";
import { RevealGroup } from "@/components/animations/Reveal";
import type { SurftripListItem } from "@/lib/sanity";

type HomeSurftripsProps = {
  trips: SurftripListItem[];
};

function fillColor(availableSpots: number, capacity: number): string {
  const ratio = availableSpots / capacity;

  if (ratio <= 0.2) return "rgba(251,210,199,0.9)";
  if (ratio <= 0.5) return "rgba(255,203,147,0.4)";
  return "#d4efc4";
}

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

function availabilityLabel(availableSpots: number) {
  if (availableSpots <= 0) return "COMPLETO";
  return availableSpots <= 2 ? `SOLO ${availableSpots} DISPONIBLES` : `${availableSpots} DISPONIBLES`;
}

export function HomeSurftrips({ trips }: HomeSurftripsProps) {
  const featuredTrips = trips.filter((trip) => trip.featured);
  const displayTrips = (featuredTrips.length ? featuredTrips : trips).slice(0, 3);

  return (
    <section className="py-14 md:py-16">
      <div className="grid gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1.1fr] md:px-10 lg:px-16">
        <RevealGroup>
          <p className="ds-label text-[var(--color-label-muted)]">NUESTROS SURFCAMPS</p>
          <h2 className="ds-section-title ds-section-lead-gap max-w-[540px]">
            Mejora tu surfing en los mejores destinos y vive experiencias únicas junto a una comunidad que comparte tu misma pasión por el mar.
          </h2>
          <Link href="/surftrips" className="ds-btn ds-btn-primary ds-btn-lg mt-8 inline-flex">
            Conoce más
          </Link>
        </RevealGroup>
        <RevealGroup className="space-y-10" stagger={0.14} watch={displayTrips.length}>
          {displayTrips.length ? (
            displayTrips.map((trip) => {
              const safeCapacity = Math.max(trip.capacity, 1);
              const taken = Math.min(Math.max(trip.capacity - trip.availableSpots, 0), safeCapacity);
              const fillPct = (taken / safeCapacity) * 100;

              return (
                <Link
                  key={trip._id}
                  href={`/surftrips/${trip.slug}`}
                  className="group block rounded-[24px] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="ds-chip inline-block rounded-full bg-black px-3 py-1 text-white">
                      {trip.level}
                    </p>
                    <span className="text-[18px] text-black/50">
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </span>
                  </div>
                  <h3 className="ds-h2-sm mt-2 leading-none">{trip.title}</h3>
                  <div className="relative mt-2 h-[60px] overflow-hidden rounded-full border-2 border-black">
                    <div
                      style={{ width: `${fillPct}%`, backgroundColor: fillColor(trip.availableSpots, safeCapacity) }}
                      className="h-full rounded-l-full"
                    />
                    <div className="absolute inset-0 flex h-[60px] items-center justify-end pr-5 ds-body-s transition-colors duration-200 group-hover:text-black">
                      {availabilityLabel(trip.availableSpots)}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="ds-body-m text-black/70">Pronto compartiremos los próximos surfcamps.</p>
          )}
        </RevealGroup>
      </div>
    </section>
  );
}
