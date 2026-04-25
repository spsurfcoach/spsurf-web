import Image from "next/image";
import { Reveal } from "@/components/animations/Reveal";

export function SurfTalksSection() {
  return (
    <section className="px-4 py-14 sm:px-6 md:px-10 md:py-16 lg:px-16">
      <Reveal>
        <a
          href="https://www.youtube.com/@SurfTalksbySP"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          {/* Surf Talks banner */}
          <div className="relative h-[240px] overflow-hidden rounded-[30px] bg-[#ffda00] transition-transform duration-200 group-hover:scale-[1.01] lg:h-[318px]">
            <Image
              src="/photos/LOGO POSTCAST SEBASTIAN 3.png"
              alt="Surf Talks podcast by Sebastian Portocarrero"
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain object-center p-0 scale-[1.22] sm:scale-[1.28] lg:scale-[1.32]"
            />
          </div>

          <p className="ds-label mt-12 text-[var(--color-label-muted)]">NUESTROS SURFTALKS</p>
          <h2 className="ds-h1 ds-section-lead-gap max-w-[1312px] leading-[1.5] tracking-[-0.04em] lg:leading-[63px]">
            Canal creado para la comunidad, donde hablamos con diferentes surfistas, entrenadores e iconos del mundo del surf.
          </h2>
          <span className="ds-btn ds-btn-primary ds-btn-lg mt-9 inline-flex">
            Suscríbete a nuestro canal
          </span>
        </a>
      </Reveal>
    </section>
  );
}
