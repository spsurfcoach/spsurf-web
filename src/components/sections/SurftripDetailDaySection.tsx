import Image from "next/image";
import type { SurftripDaySection as SurftripDaySectionData } from "@/lib/sanity";

type SurftripDetailDaySectionProps = {
  section: SurftripDaySectionData;
  imageSrc: string;
  downloadHref?: string;
};

export function SurftripDetailDaySection({
  section,
  imageSrc,
  downloadHref,
}: SurftripDetailDaySectionProps) {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-10 sm:px-6 md:px-10 lg:px-16 lg:py-12">
      <div className="container-site">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] lg:items-center lg:gap-16">
        <div>
          <h2 className="text-[28px] font-medium tracking-[-0.04em] text-black lg:text-[40px]">
            {section.title}
          </h2>

          <ul className="mt-8 space-y-3 text-[15px] leading-7 text-black/88">
            {section.scheduleItems.map((item) => (
              <li key={item._key ?? `${item.time}-${item.label}`}>
                <span className="font-medium">{item.time}</span>
                <span className="text-black/45"> {"\u2014"} </span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-4">
            {section.bodyLinkLabel && section.bodyLinkHref ? (
              <a href={section.bodyLinkHref} className="ds-link inline-flex">
                {section.bodyLinkLabel}
              </a>
            ) : null}

            {section.downloadLabel && downloadHref ? (
              <div>
                <a href={downloadHref} className="inline-flex text-[15px] font-medium text-black underline underline-offset-4">
                  {section.downloadLabel}
                </a>
              </div>
            ) : null}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] lg:rounded-[36px]">
          <Image src={imageSrc} alt={section.title} width={1600} height={1000} className="h-auto w-full object-cover" />
        </div>
      </div>
      </div>
    </section>
  );
}
