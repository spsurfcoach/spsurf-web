import Link from "next/link";

type SurftripDetailSummarySectionProps = {
  country: string;
  locationLabel?: string;
  title: string;
  duration: string;
  groupSizeLabel: string;
  level: string;
  hospedaje: string;
  aeropuerto: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

function UsersIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function paragraphs(text: string) {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function SurftripDetailSummarySection({
  country,
  locationLabel,
  title,
  duration,
  groupSizeLabel,
  level,
  hospedaje,
  aeropuerto,
  description,
  ctaLabel,
  ctaHref,
}: SurftripDetailSummarySectionProps) {
  const introParagraphs = paragraphs(description);

  return (
    <section className="bg-[var(--color-background-default)] px-4 py-10 sm:px-6 md:px-10 lg:px-16 lg:py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="ds-body-s text-black/60">{locationLabel || country}</p>
          <h2 className="mt-3 text-[40px] font-medium leading-none tracking-[-0.04em] text-black lg:text-[52px]">
            {title}
          </h2>
          <p className="mt-2 text-[24px] font-medium tracking-[-0.03em] text-black/35 lg:text-[34px]">
            Surf retreat de {duration}
          </p>

          <div className="mt-8 flex items-center gap-3 text-black">
            <UsersIcon />
            <span className="ds-body-s">{groupSizeLabel}</span>
          </div>

          <div className="mt-6 h-px w-full bg-black/12" />

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 text-black sm:grid-cols-4 lg:grid-cols-2">
            {[
              { label: "NIVEL", value: level },
              { label: "HOSPEDAJE", value: hospedaje },
              { label: "DURACIÓN", value: duration },
              { label: "AEROPUERTO", value: aeropuerto },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] font-medium tracking-[0.12em] text-black/55">{item.label}</p>
                <p className="mt-1 text-[15px] font-medium text-black">{item.value}</p>
              </div>
            ))}
          </div>

          <Link href={ctaHref} className="ds-btn ds-btn-primary ds-btn-lg mt-10 inline-flex">
            {ctaLabel}
          </Link>
        </div>

        <div className="space-y-6">
          {introParagraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 20)}`} className="text-[16px] leading-9 text-black/88">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
