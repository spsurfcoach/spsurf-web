import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SurftripBlocksRenderer } from "@/components/sections/SurftripBlocksRenderer";
import { getSurftripBySlug, getSurftripSlugs } from "@/lib/sanity";

type SurftripPageProps = {
  params: Promise<{
    slug: string;
  }>;
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

export async function generateStaticParams() {
  const slugs = await getSurftripSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: SurftripPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getSurftripBySlug(slug);
  if (!trip) return {};
  return {
    title: trip.title,
    description: trip.shortDescription,
  };
}

export default async function SurftripDetailPage({ params }: SurftripPageProps) {
  const { slug } = await params;
  const trip = await getSurftripBySlug(slug);

  if (!trip) {
    notFound();
  }

  return (
    <div className="bg-[var(--color-background-default)]">
      <section className="px-4 pb-6 pt-28 sm:px-6 md:px-10 lg:px-16">
        <p className="ds-label text-[var(--color-label-muted)]">NUESTRO SURFTRIP</p>
        <h1 className="ds-h1 mt-4 text-black">{trip.title}</h1>
        <p className="ds-body-m mt-4 max-w-[85ch] text-black/80">{trip.shortDescription}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-black/70">
          <span className="rounded-full border border-black/20 px-4 py-1 text-sm">{trip.country}</span>
          <span className="rounded-full border border-black/20 px-4 py-1 text-sm">{trip.level}</span>
          <span className="rounded-full border border-black/20 px-4 py-1 text-sm">
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
          <span className="rounded-full border border-black/20 px-4 py-1 text-sm">
            {trip.available}/{trip.capacity} cupos
          </span>
        </div>
      </section>

      <SurftripBlocksRenderer blocks={trip.contentBlocks} />
    </div>
  );
}
