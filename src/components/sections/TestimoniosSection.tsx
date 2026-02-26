import Image from "next/image";
import { testimonials } from "@/lib/content";

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

export function TestimoniosSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-4 sm:px-6 md:px-0 lg:py-0">
      {/* Kicker above */}
      <p className="ds-label px-4 pb-6 text-[var(--color-label-muted)] tracking-[2.73px] sm:px-6 md:px-10 lg:px-16">
        TESTIMONIOS
      </p>

      {/* Two testimonial blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {testimonials.map((item, i) => {
          const style = BLOCK_STYLES[i % BLOCK_STYLES.length];
          return (
            <div
              key={i}
              className={`relative h-[400px] overflow-hidden lg:h-[652px] ${style.bg} ${
                i === 0 ? "md:rounded-none" : "md:rounded-none"
              }`}
            >
              {/* Background photo overlay */}
              <div className="absolute inset-0">
                <Image
                  src={style.photo}
                  alt=""
                  fill
                  className="object-cover"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* Quote content */}
              <div className="relative z-10 flex h-full flex-col justify-center px-8 sm:px-12 lg:px-16">
                <blockquote>
                  <p className="ds-h3 font-semibold leading-[1.65] text-white">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <footer className="mt-8">
                    <p className="ds-h3 font-semibold text-white">{item.author}</p>
                  </footer>
                </blockquote>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
