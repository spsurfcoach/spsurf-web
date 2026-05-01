import { Reveal, RevealGroup } from "@/components/animations/Reveal";

export function NosotrosTestimoniosVideosSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-8 sm:px-6 md:px-10 lg:py-10">
      <RevealGroup>
        <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">TESTIMONIOS</p>
        <Reveal className="mt-6">
          <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-[24px] bg-black shadow-lg sm:max-w-[300px] sm:rounded-[28px]">
            <iframe
              className="absolute inset-0 h-full w-full border-0"
              src="https://www.youtube.com/embed/tRZspEXWW1A?rel=0"
              title="Testimonio de Mario"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </Reveal>
      </RevealGroup>
    </section>
  );
}
