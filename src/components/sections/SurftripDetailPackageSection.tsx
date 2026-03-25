import Link from "next/link";
import type { SurftripPackageSection as SurftripPackageSectionData } from "@/lib/sanity";

type SurftripDetailPackageSectionProps = {
  section: SurftripPackageSectionData;
};

export function SurftripDetailPackageSection({ section }: SurftripDetailPackageSectionProps) {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-12 sm:px-6 md:px-10 lg:px-16 lg:py-14">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div>
            <h2 className="text-[36px] font-medium tracking-[-0.04em] text-black lg:text-[48px]">
              {section.title}
            </h2>
            {section.subtitle ? (
              <p className="mt-3 text-[20px] font-medium tracking-[-0.03em] text-black/82">
                {section.subtitle}
              </p>
            ) : null}
          </div>

          <div className="text-left lg:text-right">
            <p className="text-[42px] font-semibold leading-none tracking-[-0.04em] text-black lg:text-[54px]">
              {section.priceLabel}
            </p>
            {section.priceSuffix ? <p className="mt-2 text-[15px] text-black/65">{section.priceSuffix}</p> : null}
            {section.depositNote ? <p className="mt-5 text-[15px] text-black/55">{section.depositNote}</p> : null}
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {section.columns.map((column) => (
            <div key={column._key ?? column.title} className="rounded-[28px] bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <h3 className="text-[20px] font-medium text-black">{column.title}</h3>
              <ul className="mt-5 list-disc space-y-2 pl-5 text-[14px] leading-7 text-black/82">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {section.addons?.length ? (
          <div className="mt-8 space-y-3">
            {section.addons.map((addon) => (
              <div
                key={addon._key ?? addon.label}
                className="flex flex-col justify-between gap-4 rounded-[22px] bg-white px-6 py-5 text-black sm:flex-row sm:items-center"
              >
                <p className="text-[16px] text-black/88">{addon.label}</p>
                <p className="text-[22px] font-semibold tracking-[-0.03em]">{addon.priceLabel}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex justify-start lg:justify-end">
          <Link href={section.ctaHref} className="ds-btn ds-btn-primary ds-btn-lg inline-flex">
            {section.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
