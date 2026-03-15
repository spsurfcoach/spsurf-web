import Image from "next/image";
import { surfClassSubServices } from "@/lib/content";

export function ServiciosDetailSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      <div className="container-site">
        {/* Two-column layout: service list (left) + description (right) */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: Service title + sub-service list */}
          <div>
            <h2 className="ds-h2 text-black">Clases de surf</h2>
            <ul className="mt-6 space-y-[24px]">
              {surfClassSubServices.map((item) => (
                <li key={item} className="ds-body-s text-zinc-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Body copy */}
          <div>
            <p className="ds-body-s leading-[1.8] text-black/90">
              Nuestras clases de surf están{" "}
              <strong>diseñadas para adaptarse a tu nivel, tus objetivos y tu estilo de aprendizaje</strong>
              . Ofrecemos clases individuales y grupales, ambas con coaching en el agua y video análisis incluido.
            </p>
            <p className="ds-body-s mt-6 leading-[1.8] text-black/90">
              Las clases individuales permiten un trabajo totalmente personalizado, ideal para quienes buscan progresar rápido, corregir detalles técnicos y enfocarse en objetivos específicos. Las clases grupales, en cambio, combinan aprendizaje, motivación y comunidad, manteniendo siempre un ratio reducido para asegurar atención real de nuestros coaches.
            </p>
            <p className="ds-body-s mt-6 leading-[1.8] text-black/90">
              En cada sesión grabamos tus olas y luego las analizamos en video, revisando postura, línea, velocidad y maniobras. Esto te permite entender exactamente qué estás haciendo y cómo mejorar en cada entrada al agua.
            </p>
            <p className="ds-body-s mt-6 leading-[1.8] text-black/90">
              Aquí no solo surfeas: aprendes a surfear mejor. 🌊
            </p>

            {/* Testimonial card */}
            <div className="mt-10 flex items-start gap-4">
              <div className="relative size-[60px] shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/photos/servicios_1.jpg"
                  alt="Ivo Escuza"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="ds-body-s font-semibold text-black">Ivo Escuza</p>
                <p className="ds-body-s mt-1 leading-[1.7] text-black/70">
                  Nuestras clases de surf están{" "}
                  <strong>diseñadas para adaptarse a tu nivel, tus objetivos y tu estilo de aprendizaje</strong>
                  . Ofrecemos clases individuales.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width photo card below */}
        <div className="relative mt-12 h-[240px] w-full overflow-hidden rounded-[40px] border-2 border-white sm:h-[280px] lg:h-[335px]">
          <Image
            src="/photos/servicios_1.jpg"
            alt="Clase de surf"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
