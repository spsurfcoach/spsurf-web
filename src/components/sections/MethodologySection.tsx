import { methodologyPillars } from "@/lib/content";

export function MethodologySection() {
  return (
    <section className="section-space bg-zinc-100 text-zinc-900">
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="ds-h2">Nuestra metodologia</h2>
          <p className="ds-body-s mt-4 text-zinc-700">
            Combinamos tecnica, analisis y mentalidad para que progreses de forma real y sostenible.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
          {methodologyPillars.map((pillar) => (
            <div key={pillar} className="ds-card ds-body-s p-4">
              {pillar}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


