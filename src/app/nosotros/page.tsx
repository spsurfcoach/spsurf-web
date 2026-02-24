import { Hero } from "@/components/sections/Hero";
import { MethodologySection } from "@/components/sections/MethodologySection";

export default function NosotrosPage() {
  return (
    <>
      <Hero
        title="Nosotros"
        subtitle="SP Surf Coach nace para acompanar surfistas que quieren progresar con metodo, claridad y disfrute."
      />

      <section className="section-space bg-zinc-200 text-zinc-900">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="ds-h2">Sobre SP</h2>
            <p className="ds-body-s text-zinc-700">
              Combinamos entrenamiento tecnico en agua, analisis en video y trabajo fisico-mental para desarrollar surfistas mas completos.
            </p>
            <p className="ds-body-s text-zinc-700">
              Nuestra mision es ayudarte a construir confianza y consistencia, respetando tu estilo y proceso.
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-300 p-8">
            <div className="photo-block ds-body-s flex h-64 items-center justify-center rounded-xl text-zinc-200">
              Espacio para video teaser del coach
            </div>
          </div>
        </div>
      </section>

      <MethodologySection />
    </>
  );
}


