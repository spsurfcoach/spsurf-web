import Link from "next/link";
import Image from "next/image";
import { Reveal, RevealGroup } from "@/components/animations/Reveal";
import { CarouselShell } from "@/components/sections/CarouselShell";
import { ResponsiveMediaFrame } from "@/components/sections/ResponsiveMediaFrame";
import { urlForImage, type SurftripListItem } from "@/lib/sanity";

type DestinosSectionProps = {
  trips: SurftripListItem[];
};

export function DestinosSection({ trips }: DestinosSectionProps) {
  const seenTitles = new Set<string>();
  const destinos = trips
    .filter((trip) => {
      const normalizedTitle = trip.title.trim().toLowerCase();

      if (!trip.cardImage || seenTitles.has(normalizedTitle)) {
        return false;
      }

      seenTitles.add(normalizedTitle);
      return true;
    })
    .slice(0, 6);

  const backgroundSrc = destinos[0]?.cardImage
    ? urlForImage(destinos[0].cardImage).width(1800).height(1100).fit("crop").url()
    : null;

  if (!destinos.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-14 md:py-16">
      {/* Photo background with overlay */}
      {backgroundSrc ? (
        <Image src={backgroundSrc} alt="" fill className="object-cover" aria-hidden="true" />
      ) : null}
      <div className="absolute inset-0 bg-[rgba(1,42,58,0.8)]" />

      <div className="relative px-4 sm:px-6 md:px-10 lg:px-16">
        <RevealGroup>
          <p className="ds-label text-[var(--color-label-muted)]">DESTINOS</p>
          <h2 className="ds-section-title mt-4 text-white">Explora nuevos destinos</h2>
        </RevealGroup>

        <Reveal className="mt-8" delay={0.05}>
          <CarouselShell
            ariaLabel="Carrusel de destinos"
            slideClassName="basis-[82%] sm:basis-[52%] lg:basis-[38%]"
            slides={destinos.map((item) => (
              <Link key={item._id} href={`/surfcamps/${item.slug}`} className="group block">
                <article>
                  <ResponsiveMediaFrame
                    src={urlForImage(item.cardImage!).width(1200).height(900).fit("crop").url()}
                    alt={item.title}
                    ratioClassName="aspect-[4/3] lg:aspect-[574/372]"
                    className="transition-transform duration-200 group-hover:scale-[1.01]"
                  />
                  <p className="ds-chip mt-4 inline-block rounded-full bg-white/12 px-3 py-1 text-white">
                    {item.country}
                  </p>
                  <h3 className="ds-h2-lg mt-3 text-white">{item.title}</h3>
                </article>
              </Link>
            ))}
          />
        </Reveal>
      </div>
    </section>
  );
}
