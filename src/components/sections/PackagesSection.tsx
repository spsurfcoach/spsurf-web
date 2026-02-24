import { homePackages } from "@/lib/content";

export function PackagesSection() {
  return (
    <section className="section-space bg-zinc-900">
      <div className="container-site space-y-10">
        <div className="text-center">
          <h2 className="ds-h2">Paquetes</h2>
          <p className="ds-body-s mt-3 text-zinc-400">Elige el plan de clases que mejor se adapte a tu objetivo.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {homePackages.map((item) => (
            <article key={item.name} className="photo-block rounded-2xl p-5">
              <p className="mb-5 inline-block rounded-full bg-white px-3 py-1 ds-body-s text-zinc-900">{item.price}</p>
              <h3 className="ds-h3">{item.name}</h3>
              <p className="ds-body-s mt-2 text-zinc-200">{item.classes}</p>
              <p className="ds-body-s text-zinc-300">{item.validity}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


