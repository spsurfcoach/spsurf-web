import Image from "next/image";
import type { SurftripFeatureSection as SurftripFeatureSectionData } from "@/lib/sanity";

type FeatureImage = {
  src: string;
  alt: string;
};

type SurftripDetailFeatureBlockProps = {
  section: SurftripFeatureSectionData;
  images: FeatureImage[];
  reverse?: boolean;
  withDivider?: boolean;
};

function textParagraphs(text: string) {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function SurftripDetailFeatureBlock({
  section,
  images,
  reverse = false,
  withDivider = true,
}: SurftripDetailFeatureBlockProps) {
  const isDark = section.theme === "dark";
  const contentOrder = reverse ? "lg:order-2" : "lg:order-1";
  const mediaOrder = reverse ? "lg:order-1" : "lg:order-2";
  const paragraphs = textParagraphs(section.body);
  const dividerClass = isDark ? "border-white/10" : "border-black/8";
  const hasMedia = images.length > 0;

  return (
    <section
      className={`px-4 py-12 sm:px-6 md:px-10 lg:px-16 lg:py-14 ${
        isDark ? "bg-[var(--color-primary-900)] text-white" : "bg-[var(--color-background-default)] text-black"
      }`}
    >
      <div className={`container-site ${withDivider ? `border-t ${dividerClass} pt-12` : ""}`}>
        <div className={`grid gap-10 lg:items-start lg:gap-16 ${hasMedia ? "lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]" : ""}`}>
          <div className={contentOrder}>
            {(section.eyebrow || section.icon) ? (
              <p className={`ds-label ${isDark ? "text-white/70" : "text-[var(--color-label-muted)]"}`}>
                {section.icon ? `${section.icon} ` : ""}
                {section.eyebrow || ""}
              </p>
            ) : null}

            <h2 className="mt-4 text-[28px] font-medium tracking-[-0.04em] lg:text-[40px]">
              {section.title}
            </h2>

            <div className={`mt-6 space-y-5 text-[16px] leading-9 ${isDark ? "text-white/88" : "text-black/88"}`}>
              {paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 16)}`}>{paragraph}</p>
              ))}
            </div>

            {section.bullets?.length ? (
              <ul className={`mt-8 list-disc space-y-2 pl-5 text-[15px] leading-7 ${isDark ? "text-white/88" : "text-black/88"}`}>
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>

          {hasMedia ? (
            <div className={`space-y-4 ${mediaOrder}`}>
              {images.map((image) => (
                <div key={image.src} className="relative overflow-hidden rounded-[28px] lg:rounded-[36px]">
                  <Image src={image.src} alt={image.alt} width={1800} height={1200} className="h-auto w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
