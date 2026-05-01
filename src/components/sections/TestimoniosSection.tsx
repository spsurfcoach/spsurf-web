import Image from "next/image";
import { CarouselShell } from "@/components/sections/CarouselShell";
import { testimonials, type TestimonialItem } from "@/lib/content";

const BLOCK_STYLES = [
  {
    bg: "bg-[var(--color-primary-900)]",
    photo: "/photos/home1.jpg",
  },
  {
    bg: "bg-[var(--color-primary-500)]",
    photo: "/photos/home2.jpg",
  },
];

type TestimoniosSectionProps = {
  items?: TestimonialItem[];
};

export function TestimoniosSection({ items = testimonials }: TestimoniosSectionProps) {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-4 sm:px-6 md:px-0 lg:py-0">
      {/* Kicker above */}
      <p className="ds-label px-4 pb-6 text-[var(--color-label-muted)] tracking-[2.73px] sm:px-6 md:px-10 lg:px-16">
        TESTIMONIOS
      </p>

      <div className="px-4 pb-8 sm:px-6 md:px-10 lg:px-16 lg:pb-10">
        <CarouselShell
          ariaLabel="Carrusel de testimonios"
          darkControls={false}
          slideClassName="basis-[92%] lg:basis-[50%]"
          autoPlayMs={3000}
          options={{ align: "start", loop: items.length > 1 }}
          slides={items.map((item, i) => {
            const style = BLOCK_STYLES[i % BLOCK_STYLES.length];
            const photoSrc = item.image ?? style.photo;
            return (
              <article
                key={`${item.author}-${i}`}
                className={`relative min-h-[360px] overflow-hidden rounded-[30px] lg:min-h-[520px] ${style.bg}`}
              >
                <div className="absolute inset-0">
                  <Image src={photoSrc} alt="" fill className="object-cover" aria-hidden="true" />
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 flex h-full flex-col justify-center px-10 pt-12 pb-10 sm:px-14 sm:pt-14 sm:pb-11 lg:px-20 lg:pt-16 lg:pb-12">
                  <blockquote>
                    <p className="ds-h3 font-semibold leading-[1.5] text-white">&ldquo;{item.quote}&rdquo;</p>
                    <footer className="mt-8">
                      <p className="ds-h3 font-semibold text-white">{item.author}</p>
                    </footer>
                  </blockquote>
                </div>
              </article>
            );
          })}
        />
      </div>
    </section>
  );
}
