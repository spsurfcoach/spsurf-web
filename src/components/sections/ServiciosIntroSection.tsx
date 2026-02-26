import Image from "next/image";

export function ServiciosIntroSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-16">
      <div className="container-site">
        {/* Kicker */}
        <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">
          SERVICIOS
        </p>

        {/* Heading */}
        <div className="mt-6 max-w-[1230px]">
          <p className="ds-display-title text-black">
            Cada servicio ha sido creado para acompañarte en tu proceso de crecimiento como surfista. A través de una metodología integral que combina técnica, análisis, cuerpo y mente, te ayudamos a progresar dentro y fuera del agua.
          </p>
          <p className="ds-display-title mt-6 text-black">
            Elige la experiencia que mejor se adapte a ti y da el siguiente paso hacia tu mejor versión en el mar.
          </p>
        </div>

        {/* Full-width photo */}
        <div className="relative mt-14 h-[280px] w-full overflow-hidden rounded-[40px] sm:h-[360px] lg:h-[521px]">
          <Image
            src="/photos/home2.jpg"
            alt="Surfistas en el agua"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
