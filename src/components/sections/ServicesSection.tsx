import { services } from "@/lib/content";

export function ServicesSection() {
  return (
    <section className="section-space bg-zinc-100 text-zinc-900">
      <div className="container-site space-y-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="ds-h2">Servicios</h2>
          <p className="ds-body-s mt-3 text-zinc-700">
            Elige la experiencia que mejor se adapta a tu etapa actual para avanzar con foco.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="ds-card p-6">
              <h3 className="ds-h3">{service.title}</h3>
              <p className="ds-body-s mt-3 text-zinc-700">{service.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


