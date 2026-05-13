"use client";

import { Reveal, RevealGroup } from "@/components/animations/Reveal";

const NOSOTROS_TESTIMONIO_VIDEOS = [
  { id: "tRZspEXWW1A", title: "Testimonio de Mario" },
  { id: "7si1AQQkf88", title: "Testimonio SP Surf Coach" },
  { id: "xrYMNWPCdug", title: "Testimonio SP Surf Coach 2" },
  { id: "JjRbYA9EnbM", title: "Testimonio SP Surf Coach 3" },
] as const;

export function NosotrosTestimoniosVideosSection() {
  return (
    <section className="bg-[var(--color-background-default)] py-8 lg:py-10">
      <RevealGroup className="px-4 sm:px-6 md:px-10 lg:px-16">
        <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">TESTIMONIOS</p>
      </RevealGroup>

      <Reveal className="mt-6">
        {/* Mobile / tablet: snap-scroll horizontal */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
          {NOSOTROS_TESTIMONIO_VIDEOS.map(({ id, title }) => (
            <div
              key={id}
              className="relative aspect-[9/16] w-[72vw] max-w-[260px] shrink-0 snap-center overflow-hidden rounded-[24px] bg-black shadow-lg"
            >
              <iframe
                className="absolute inset-0 h-full w-full border-0"
                src={`https://www.youtube.com/embed/${id}?rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Desktop: all videos centered in a row */}
        <div className="hidden lg:flex lg:justify-center lg:gap-5 lg:px-16">
          {NOSOTROS_TESTIMONIO_VIDEOS.map(({ id, title }) => (
            <div
              key={id}
              className="relative aspect-[9/16] w-full max-w-[240px] flex-1 overflow-hidden rounded-[24px] bg-black shadow-lg xl:max-w-[260px] xl:rounded-[28px]"
            >
              <iframe
                className="absolute inset-0 h-full w-full border-0"
                src={`https://www.youtube.com/embed/${id}?rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
