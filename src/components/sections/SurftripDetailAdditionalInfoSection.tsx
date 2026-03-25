import type { SurftripAdditionalInfoSection as SurftripAdditionalInfoSectionData } from "@/lib/sanity";

type SurftripDetailAdditionalInfoSectionProps = {
  section: SurftripAdditionalInfoSectionData;
};

export function SurftripDetailAdditionalInfoSection({
  section,
}: SurftripDetailAdditionalInfoSectionProps) {
  const splitIndex = Math.ceil(section.items.length / 2);
  const leftItems = section.items.slice(0, splitIndex);
  const rightItems = section.items.slice(splitIndex);

  return (
    <section className="bg-[var(--color-background-default)] px-4 py-10 sm:px-6 md:px-10 lg:px-16 lg:py-12">
      <div className="container-site rounded-[32px] bg-white px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
        <h2 className="text-[32px] font-medium tracking-[-0.04em] text-black lg:text-[40px]">
          {section.title}
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-10">
          {[leftItems, rightItems].map((items, index) =>
            items.length ? (
              <ul key={index} className="list-disc space-y-3 pl-5 text-[15px] leading-8 text-black/82">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null,
          )}
        </div>
      </div>
    </section>
  );
}
