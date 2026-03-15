import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/lib/sanity";
import type { SurftripDetail } from "@/lib/sanity";

type SurftripBlocksRendererProps = {
  trip: SurftripDetail;
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

export function SurftripBlocksRenderer({ trip }: SurftripBlocksRendererProps) {
  const heroSrc = trip.heroImage
    ? urlForImage(trip.heroImage).width(2400).height(1500).fit("crop").url()
    : trip.cardImage
      ? urlForImage(trip.cardImage).width(2400).height(1500).fit("crop").url()
      : "/photos/chicama.jpg";
  const waveSrc = trip.waveImage
    ? urlForImage(trip.waveImage).width(1800).height(1200).fit("crop").url()
    : heroSrc;
  const hotelSrc = trip.hotelImage
    ? urlForImage(trip.hotelImage).width(1800).height(1200).fit("crop").url()
    : heroSrc;
  const heroSubtitle = trip.heroSubtitle || trip.shortDescription || "";
  const waveTitle = trip.waveTitle || "La ola";
  const waveBody = trip.waveBody || trip.shortDescription || "";
  const hotelTitle = trip.hotelTitle || "Hospedaje";
  const hotelBody = trip.hotelBody || "Base del viaje enfocada en descanso y entrenamiento.";
  const itineraryTitle = trip.itineraryTitle || "Como se vive este surftrip";
  const itineraryBody = trip.itineraryBody || trip.shortDescription || "";
  const primaryCtaLabel = trip.primaryCtaLabel || "Reservar ahora";
  const primaryCtaHref = trip.primaryCtaHref || "#reserva";

  return (
    <>
      <section className="px-4 pb-8 pt-0 sm:px-6 md:px-10 lg:px-16">
        <div className="relative min-h-[72svh] overflow-hidden rounded-[26px] lg:min-h-[84svh] lg:rounded-[40px]">
          <Image src={heroSrc} alt={trip.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8 lg:p-14">
            <p className="ds-label text-white/80">{trip.heroKicker || "SURFTRIP"}</p>
            <h1 className="ds-h1 mt-4 max-w-[13ch]">{trip.title}</h1>
            <p className="ds-body-m mt-4 max-w-[78ch] text-white/90">{heroSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-background-default)] px-4 py-12 sm:px-6 md:px-10 lg:px-16">
        <div className="rounded-[24px] border border-black/10 bg-white px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex flex-wrap gap-3 text-black/75">
            <span className="rounded-full border border-black/20 px-4 py-1 text-sm">{trip.country}</span>
            <span className="rounded-full border border-black/20 px-4 py-1 text-sm">{trip.level}</span>
            <span className="rounded-full border border-black/20 px-4 py-1 text-sm">
              {formatDateRange(trip.startDate, trip.endDate)}
            </span>
            <span className="rounded-full border border-black/20 px-4 py-1 text-sm">
              {trip.available}/{trip.capacity} cupos
            </span>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div>
            <p className="ds-label text-[var(--color-label-muted)]">LA OLA</p>
            <h2 className="ds-h2 mt-4 text-black">{waveTitle}</h2>
            <p className="ds-body-m mt-5 whitespace-pre-line text-black/85">{waveBody}</p>
          </div>
          <div className="relative overflow-hidden rounded-[28px] lg:rounded-[36px]">
            <Image src={waveSrc} alt={waveTitle} width={1800} height={1200} className="h-auto w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-primary-900)] px-4 py-14 text-white sm:px-6 md:px-10 lg:px-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="relative order-2 overflow-hidden rounded-[28px] lg:order-1 lg:rounded-[36px]">
            <Image src={hotelSrc} alt={trip.hotelTitle} width={1800} height={1200} className="h-auto w-full object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <p className="ds-label text-white/70">HOSPEDAJE</p>
            <h2 className="ds-h2 mt-4">{hotelTitle}</h2>
            <p className="ds-body-m mt-5 whitespace-pre-line text-white/85">{hotelBody}</p>
            <p className="ds-body-m mt-6 text-white/75">
              Base del viaje: <span className="text-white">{trip.hospedaje}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
        <p className="ds-label text-[var(--color-label-muted)]">EXPERIENCIA</p>
        <h2 className="ds-h2 mt-4 text-black">{itineraryTitle}</h2>
        <p className="ds-body-m mt-5 max-w-[95ch] whitespace-pre-line text-black/85">{itineraryBody}</p>
      </section>

      <section className="bg-[var(--color-background-default)] px-4 pb-16 pt-4 sm:px-6 md:px-10 lg:px-16 lg:pb-24">
        <div className="rounded-[30px] bg-[var(--color-primary-900)] p-8 text-white lg:p-12">
          <h3 className="ds-h2">Reserva tu lugar en {trip.title}</h3>
          <p className="ds-body-m mt-4 max-w-[70ch] text-white/85">
            Si este viaje se alinea con tus objetivos, te ayudamos a validar nivel y asegurar tu cupo.
          </p>
          <Link href={primaryCtaHref} className="ds-btn ds-btn-secondary ds-btn-lg mt-8 inline-flex">
            {primaryCtaLabel}
          </Link>
        </div>
      </section>
    </>
  );
}
