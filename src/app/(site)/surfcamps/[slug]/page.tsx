import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SurftripBlocksRenderer } from "@/components/sections/SurftripBlocksRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema, buildEventSchema, buildFaqSchema } from "@/lib/seo/json-ld";
import { getSurftripBySlug, getSurftripSlugs } from "@/lib/sanity";
import { urlForImage } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

type SurftripPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getSurftripSlugs();
  return slugs.map((slug) => ({ slug }));
}

function getHeroImageUrl(image: SanityImage | null | undefined): string | undefined {
  if (!image) return undefined;
  try {
    return urlForImage(image as Parameters<typeof urlForImage>[0])
      .width(1200)
      .height(630)
      .fit("crop")
      .url();
  } catch {
    return undefined;
  }
}

export async function generateMetadata({ params }: SurftripPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getSurftripBySlug(slug);
  if (!trip) return {};

  const heroImageUrl = getHeroImageUrl(trip.heroImage);
  const description = `Surfcamp en ${trip.country} con SP Surf Coach. ${trip.shortDescription}`;

  return {
    title: trip.title,
    description,
    alternates: { canonical: `/surfcamps/${slug}` },
    openGraph: {
      title: `${trip.title} — SP Surf Coach`,
      description,
      url: `/surfcamps/${slug}`,
      type: "website",
      ...(heroImageUrl
        ? {
            images: [
              {
                url: heroImageUrl,
                width: 1200,
                height: 630,
                alt: trip.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${trip.title} — SP Surf Coach`,
      description,
      ...(heroImageUrl ? { images: [heroImageUrl] } : {}),
    },
  };
}

export default async function SurftripDetailPage({ params }: SurftripPageProps) {
  const { slug } = await params;
  const trip = await getSurftripBySlug(slug);

  if (!trip) {
    notFound();
  }

  const heroImageUrl = getHeroImageUrl(trip.heroImage);

  const jsonLdSchemas = [
    buildBreadcrumbSchema([
      { name: "Inicio", href: "/" },
      { name: "Surfcamps", href: "/surfcamps" },
      { name: trip.title, href: `/surfcamps/${slug}` },
    ]),
    buildEventSchema({
      title: trip.title,
      description: trip.shortDescription,
      startDate: trip.startDate,
      endDate: trip.endDate,
      country: trip.country,
      price: trip.price,
      slug,
      heroImageUrl,
    }),
    ...(trip.faqItems && trip.faqItems.length > 0
      ? [buildFaqSchema(trip.faqItems)]
      : []),
  ];

  return (
    <div className="bg-[var(--color-background-default)]">
      <JsonLd data={jsonLdSchemas} />
      <SurftripBlocksRenderer trip={trip} />
    </div>
  );
}
