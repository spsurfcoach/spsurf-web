import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/lib/sanity";
import type { SurftripBlock } from "@/lib/sanity";

type SurftripBlocksRendererProps = {
  blocks: SurftripBlock[];
};

export function SurftripBlocksRenderer({ blocks }: SurftripBlocksRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        if (block._type === "heroBlock") {
          const heroImage = block.image
            ? urlForImage(block.image).width(2200).height(1400).fit("crop").url()
            : null;

          return (
            <section key={block._key} className="px-4 pb-6 pt-0 sm:px-6 md:px-10 lg:px-16">
              <div className="relative min-h-[65svh] overflow-hidden rounded-[26px] lg:min-h-[76svh] lg:rounded-[40px]">
                {block.mediaType === "video" && block.videoUrl ? (
                  <video className="h-full w-full object-cover" controls preload="metadata">
                    <source src={block.videoUrl} />
                  </video>
                ) : heroImage ? (
                  <Image src={heroImage} alt={block.heading} fill className="object-cover" />
                ) : (
                  <div className="h-full min-h-[65svh] w-full bg-[var(--color-primary-900)]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8 lg:p-12">
                  {block.kicker ? <p className="ds-label text-white/75">{block.kicker}</p> : null}
                  <h1 className="ds-h1 mt-4 max-w-[15ch]">{block.heading}</h1>
                  {block.subheading ? <p className="ds-body-m mt-4 max-w-[70ch] text-white/90">{block.subheading}</p> : null}
                  {block.ctaLabel && block.ctaHref ? (
                    <Link href={block.ctaHref} className="ds-btn ds-btn-secondary ds-btn-lg mt-7 inline-flex">
                      {block.ctaLabel}
                    </Link>
                  ) : null}
                </div>
              </div>
            </section>
          );
        }

        if (block._type === "richTextBlock") {
          return (
            <section key={block._key} className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16">
              {block.kicker ? (
                <p className="ds-label text-[var(--color-label-muted)]">{block.kicker}</p>
              ) : null}
              {block.heading ? <h2 className="ds-h2 mt-4 max-w-[20ch]">{block.heading}</h2> : null}
              <p className="ds-body-m mt-5 max-w-[80ch] whitespace-pre-line text-black/90">{block.body}</p>
            </section>
          );
        }

        if (block._type === "imageBlock") {
          const imageUrl = urlForImage(block.image).width(1800).height(1100).fit("crop").url();
          return (
            <section key={block._key} className="bg-[var(--color-background-default)] px-4 py-6 sm:px-6 md:px-10 lg:px-16">
              {block.heading ? <h3 className="ds-h3 mb-4">{block.heading}</h3> : null}
              <div className="relative overflow-hidden rounded-[24px] lg:rounded-[36px]">
                <Image src={imageUrl} alt={block.alt} width={1800} height={1100} className="h-auto w-full object-cover" />
              </div>
              {block.caption ? <p className="ds-body-s mt-3 text-black/60">{block.caption}</p> : null}
            </section>
          );
        }

        if (block._type === "galleryBlock") {
          return (
            <section key={block._key} className="bg-[var(--color-background-default)] px-4 py-8 sm:px-6 md:px-10 lg:px-16">
              {block.heading ? <h3 className="ds-h3 mb-6">{block.heading}</h3> : null}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {block.images.map((item, idx) => {
                  const imageUrl = urlForImage(item).width(1200).height(900).fit("crop").url();
                  const alt = item.alt || `Galería surftrip ${idx + 1}`;
                  return (
                    <div key={`${block._key}-${idx}`} className="relative overflow-hidden rounded-[20px]">
                      <Image src={imageUrl} alt={alt} width={1200} height={900} className="h-auto w-full object-cover" />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        if (block._type === "ctaBlock") {
          return (
            <section key={block._key} className="bg-[var(--color-background-default)] px-4 py-10 sm:px-6 md:px-10 lg:px-16">
              <div className="rounded-[30px] bg-[var(--color-primary-900)] p-8 text-white lg:p-12">
                <h3 className="ds-h2">{block.heading}</h3>
                {block.body ? <p className="ds-body-m mt-4 max-w-[70ch] text-white/85">{block.body}</p> : null}
                <Link href={block.buttonHref} className="ds-btn ds-btn-secondary ds-btn-lg mt-8 inline-flex">
                  {block.buttonLabel}
                </Link>
              </div>
            </section>
          );
        }

        return null;
      })}
    </>
  );
}
