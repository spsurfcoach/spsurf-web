import { Reveal, RevealGroup } from "@/components/animations/Reveal";

const TESTIMONIO_SHORT_IDS = ["Nd8hPMoffIg", "jXRrKTdOVbw"] as const;

export function NosotrosTestimoniosVideosSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-10 sm:px-6 md:px-10 lg:py-14">
      <RevealGroup>
        <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">TESTIMONIOS</p>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-10">
          {TESTIMONIO_SHORT_IDS.map((id, index) => (
            <Reveal key={id}>
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[400px] overflow-hidden rounded-[24px] bg-black shadow-lg sm:rounded-[28px] lg:max-w-none lg:rounded-[32px]">
                <iframe
                  className="absolute inset-0 h-full w-full border-0"
                  src={`https://www.youtube.com/embed/${id}?rel=0`}
                  title={`Testimonio en video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </RevealGroup>
    </section>
  );
}
