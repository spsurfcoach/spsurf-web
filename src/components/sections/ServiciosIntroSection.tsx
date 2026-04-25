import { RevealGroup } from "@/components/animations/Reveal";
import { ResponsiveMediaFrame } from "@/components/sections/ResponsiveMediaFrame";

export function ServiciosIntroSection() {
  return (
    <section className="bg-[var(--color-background-default)] py-14 lg:py-16">
      <RevealGroup className="w-full px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Kicker */}
        <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">
          SERVICIOS
        </p>

        {/* Heading */}
        <div className="mt-6 max-w-[1230px]">
          <p className="ds-section-title text-black">
            Cada servicio ha sido creado para acompañarte en tu proceso de crecimiento como surfista. A través de una metodología integral que combina técnica, análisis, cuerpo y mente, te ayudamos a progresar dentro y fuera del agua.
          </p>
          <p className="ds-section-title mt-6 text-black">
            Elige la experiencia que mejor se adapte a ti y da el siguiente paso hacia tu mejor versión en el mar.
          </p>
        </div>

        {/* Full-width photo */}
        <ResponsiveMediaFrame
          src="/photos/servicios_1.jpg"
          alt="Surfistas en el agua"
          ratioClassName="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[1512/521]"
          className="mt-14 w-full site-media-frame-lg"
        />
      </RevealGroup>
    </section>
  );
}
