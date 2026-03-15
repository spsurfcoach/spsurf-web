import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SurftripBlocksRenderer } from "@/components/sections/SurftripBlocksRenderer";
import { getSurftripBySlug, getSurftripSlugs } from "@/lib/sanity";

type SurftripPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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
      <SurftripBlocksRenderer trip={trip} />
    </div>
  );
}
