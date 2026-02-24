import { Hero } from "@/components/sections/Hero";
import { ServicesSection } from "@/components/sections/ServicesSection";

export default function ServiciosPage() {
  return (
    <>
      <Hero
        title="Servicios"
        subtitle="Clases, videoanalisis y entrenamiento complementario para progresar con una metodologia integral."
      />

      <section className="section-space bg-zinc-100 text-zinc-900">
        <div className="container-site mx-auto max-w-3xl text-center">
          <h2 className="ds-h2">Intro</h2>
          <p className="ds-body-s mt-5 text-zinc-700">
            Cada servicio ha sido creado para acompanarte en tu proceso de crecimiento como surfista.
          </p>
          <p className="ds-body-s mt-3 text-zinc-700">
            A traves de una metodologia integral que combina tecnica, analisis, cuerpo y mente, te ayudamos a progresar dentro y fuera del agua.
          </p>
        </div>
      </section>

      <ServicesSection />
    </>
  );
}


