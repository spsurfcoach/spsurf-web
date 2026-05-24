import { Award, Globe, Map, Users, Video } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";

const TRUST_ITEMS = [
  { label: "+15 años de experiencia", icon: Award },
  { label: "Videoanálisis incluido", icon: Video },
  { label: "Método MAP Técnica", icon: Map },
  { label: "Surf camps internacionales", icon: Globe },
  { label: "+300 alumnos entrenados", icon: Users },
] as const;

export function HomeTrustBar() {
  return (
    <Reveal>
      <section
        aria-label="Indicadores de confianza"
        className="relative z-10 border-y border-white/10 bg-[var(--color-primary-900)] text-white shadow-[0_12px_40px_-20px_rgba(7,82,98,0.65)]"
      >
        <div className="px-4 sm:px-6 md:px-10 lg:px-16">
          <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto py-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:py-5 lg:grid lg:grid-cols-5 lg:gap-0 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {TRUST_ITEMS.map((item, index) => {
              const Icon = item.icon;

              return (
                <li
                  key={item.label}
                  className={`flex min-w-[11.5rem] shrink-0 snap-start items-center gap-3 px-1 sm:min-w-[13rem] lg:min-w-0 lg:justify-center lg:px-4 ${
                    index < TRUST_ITEMS.length - 1
                      ? "lg:relative lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:h-8 lg:after:w-px lg:after:-translate-y-1/2 lg:after:bg-white/15"
                      : ""
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--color-primary-400)]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-sm font-medium leading-snug tracking-[-0.01em] text-white/92 sm:text-[15px]">
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </Reveal>
  );
}
