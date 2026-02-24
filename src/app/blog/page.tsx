import { Hero } from "@/components/sections/Hero";
import { blogPosts } from "@/lib/content";

export default function BlogPage() {
  const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL ?? "#";

  return (
    <>
      <Hero
        title="Blog"
        subtitle="Tecnica, mentalidad, viajes y novedades para surfistas que quieren seguir aprendiendo."
      />

      <section className="section-space bg-zinc-100 text-zinc-900">
        <div className="container-site space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="ds-h2">Ultimos articulos</h2>
              <p className="ds-body-s mt-2 text-zinc-600">Contenido curado para mejorar dentro y fuera del agua.</p>
            </div>
            <input
              type="search"
              placeholder="Buscar articulos"
              className="ds-input md:w-72"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.title} className="ds-card p-5">
                <p className="ds-label text-zinc-500">{post.category}</p>
                <h3 className="ds-h3 mt-2">{post.title}</h3>
                <p className="ds-body-s mt-3 text-zinc-700">{post.excerpt}</p>
                <button className="ds-link mt-4">Leer mas</button>
              </article>
            ))}
          </div>

          <div className="ds-card p-6">
            <h3 className="ds-h3">Suscripcion al newsletter</h3>
            <p className="ds-body-s mt-2 text-zinc-700">Conecta este boton a Substack en la siguiente fase para captar suscriptores.</p>
            <a
              href={substackUrl}
              target="_blank"
              rel="noreferrer"
              className="ds-btn ds-btn-primary mt-4 inline-block"
            >
              Ir a Substack
            </a>
          </div>
        </div>
      </section>
    </>
  );
}


