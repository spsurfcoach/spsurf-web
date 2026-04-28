import {
  urlForFile,
  urlForImage,
  type SanityImage,
  type SurftripDetail,
  type SurftripFeatureSection,
  type SurftripPackageSection,
} from "@/lib/sanity";
import { SurftripDetailAdditionalInfoSection } from "@/components/sections/SurftripDetailAdditionalInfoSection";
import { SurftripDetailDaySection } from "@/components/sections/SurftripDetailDaySection";
import { SurftripDetailFaqSection } from "@/components/sections/SurftripDetailFaqSection";
import { SurftripDetailFeatureBlock } from "@/components/sections/SurftripDetailFeatureBlock";
import { SurftripDetailHero } from "@/components/sections/SurftripDetailHero";
import { SurftripDetailPackageSection } from "@/components/sections/SurftripDetailPackageSection";
import { SurftripDetailSummarySection } from "@/components/sections/SurftripDetailSummarySection";
import { SurftripDetailVideoSection } from "@/components/sections/SurftripDetailVideoSection";
import { toCurrencyPEN } from "@/lib/utils";

type SurftripBlocksRendererProps = {
  trip: SurftripDetail;
};

type FeatureImage = {
  src: string;
  alt: string;
};

function imageUrl(image: SanityImage | null | undefined, fallback: string) {
  return image ? urlForImage(image).width(1800).height(1200).fit("crop").url() : fallback;
}

function normalizeFeatureSection(
  section: SurftripFeatureSection | null | undefined,
  fallback: {
    eyebrow?: string;
    icon?: string;
    title: string;
    body: string;
    image?: SanityImage | null;
    theme?: "light" | "dark";
    bullets?: string[];
  },
): SurftripFeatureSection {
  return {
    eyebrow: section?.eyebrow ?? fallback.eyebrow,
    icon: section?.icon ?? fallback.icon,
    title: section?.title || fallback.title,
    body: section?.body || fallback.body,
    theme: section?.theme || fallback.theme || "light",
    image: section?.image ?? fallback.image ?? null,
    gallery: section?.gallery ?? [],
    bullets: section?.bullets ?? fallback.bullets ?? [],
  };
}

function featureImages(section: SurftripFeatureSection, fallbackImage: SanityImage | null | undefined): FeatureImage[] {
  const images = section.gallery?.length ? section.gallery : section.image ? [section.image] : fallbackImage ? [fallbackImage] : [];

  return images.map((image, index) => ({
    src: imageUrl(image, "/photos/chicama.jpg"),
    alt: image?.alt || `${section.title} ${index + 1}`,
  }));
}

export function SurftripBlocksRenderer({ trip }: SurftripBlocksRendererProps) {
  const heroSrc = trip.heroImage
    ? urlForImage(trip.heroImage).width(2400).height(1500).fit("crop").url()
    : trip.cardImage
      ? urlForImage(trip.cardImage).width(2400).height(1500).fit("crop").url()
      : "/photos/chicama.jpg";
  const summaryDescription = trip.heroLongDescription || trip.heroSubtitle || trip.shortDescription || "";
  const primaryCtaLabel = trip.primaryCtaLabel || "Reservar ahora";
  const defaultStoreHref = trip.storeHref || "#reserva";
  const primaryCtaHref =
    !trip.primaryCtaHref || trip.primaryCtaHref === "#reserva"
      ? defaultStoreHref
      : trip.primaryCtaHref;
  const waveSection = normalizeFeatureSection(trip.waveSection, {
    eyebrow: "SOBRE LA OLA",
    icon: "🌊",
    title: trip.waveTitle || "Sobre la ola",
    body: trip.waveBody || trip.shortDescription || "",
    image: trip.waveImage,
    theme: "light",
  });
  const hotelSection = normalizeFeatureSection(trip.hotelSection, {
    eyebrow: "EL HOTEL",
    icon: "🛏️",
    title: trip.hotelTitle || "El hotel",
    body: trip.hotelBody || "Base del viaje enfocada en descanso y entrenamiento.",
    image: trip.hotelImage,
    theme: "light",
    bullets: trip.hospedaje ? [`Hospedaje base: ${trip.hospedaje}`] : [],
  });
  const packageSection: SurftripPackageSection =
    trip.packageSection
      ? {
          ...trip.packageSection,
          priceLabel: trip.packageSection.priceLabel || toCurrencyPEN(trip.price),
          ctaHref:
            !trip.packageSection.ctaHref || trip.packageSection.ctaHref === "#reserva"
              ? defaultStoreHref
              : trip.packageSection.ctaHref,
        }
      : {
          title: "Paquete",
          subtitle: `Surfcamp de ${trip.duracion} en ${trip.title}`,
          priceLabel: toCurrencyPEN(trip.price),
          priceSuffix: "Precio por persona",
          depositNote:
            trip.availableSpots > 0
              ? `${trip.availableSpots} cupos disponibles`
              : "Completo por el momento",
          columns: [
            {
              title: "Incluye",
              items: [
                `Nivel recomendado: ${trip.level}`,
                `Duración: ${trip.duracion}`,
                `Hospedaje base: ${trip.hospedaje}`,
                `Aeropuerto sugerido: ${trip.aeropuerto}`,
              ],
            },
          ],
          addons: [],
          ctaLabel: primaryCtaLabel,
          ctaHref: primaryCtaHref,
        };
  const dayDownloadHref = trip.dayInTripSection?.downloadFile ? urlForFile(trip.dayInTripSection.downloadFile) : "";
  const videoPosterSrc = trip.videoSection?.videoPoster
    ? urlForImage(trip.videoSection.videoPoster).width(2200).height(1240).fit("crop").url()
    : heroSrc;
  const dayImageSrc = trip.dayInTripSection?.image
    ? urlForImage(trip.dayInTripSection.image).width(1600).height(1000).fit("crop").url()
    : heroSrc;
  const featureSections = [waveSection, hotelSection, ...(trip.experienceSections ?? [])];

  return (
    <>
      <SurftripDetailHero
        imageSrc={heroSrc}
        title={trip.title}
        titleSuffix={trip.heroTitleSuffix}
        kicker={trip.heroKicker || "SURFCAMP"}
      />

      <SurftripDetailSummarySection
        country={trip.country}
        locationLabel={trip.heroLocationLabel}
        title={trip.title}
        duration={trip.duracion}
        groupSizeLabel={trip.groupSizeLabel || trip.groupSize}
        level={trip.level}
        hospedaje={trip.hospedaje}
        aeropuerto={trip.aeropuerto}
        description={summaryDescription}
        ctaLabel={primaryCtaLabel}
        ctaHref={primaryCtaHref}
      />

      {trip.videoSection?.videoUrl ? (
        <SurftripDetailVideoSection
          title={trip.videoSection.title}
          videoUrl={trip.videoSection.videoUrl}
          posterSrc={videoPosterSrc}
        />
      ) : null}

      {(trip.itineraryTitle || trip.itineraryBody) ? (
        <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
          <div className="container-site">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-16">
              <div>
                <p className="ds-label tracking-[2.73px] text-[var(--color-label-muted)]">ITINERARIO</p>
                {trip.itineraryTitle && (
                  <h2 className="mt-4 text-[40px] font-medium leading-tight tracking-[-0.04em] text-black lg:text-[52px]">
                    {trip.itineraryTitle}
                  </h2>
                )}
              </div>
              {trip.itineraryBody && (
                <div className="flex items-center">
                  <p className="text-[16px] leading-9 text-black/80">{trip.itineraryBody}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {trip.dayInTripSection ? (
        <SurftripDetailDaySection
          section={trip.dayInTripSection}
          imageSrc={dayImageSrc}
          downloadHref={dayDownloadHref}
        />
      ) : null}

      {featureSections.map((section, index) => {
        const fallbackImage = index === 0 ? trip.waveImage : index === 1 ? trip.hotelImage : trip.heroImage;

        return (
          <SurftripDetailFeatureBlock
            key={`${section.title}-${index}`}
            section={section}
            images={featureImages(section, fallbackImage)}
            reverse={index % 2 === 1}
            withDivider={index > 0}
          />
        );
      })}

      <SurftripDetailPackageSection section={packageSection} />

      {trip.additionalInfoSection ? (
        <SurftripDetailAdditionalInfoSection section={trip.additionalInfoSection} />
      ) : null}

      <SurftripDetailFaqSection items={trip.faqItems ?? []} />
    </>
  );
}
