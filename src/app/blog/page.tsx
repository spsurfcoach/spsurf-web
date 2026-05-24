import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { blogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos sobre técnica de surf, entrenamiento físico, mentalidad y viajes para surfistas.",
};

export default function BlogPage() {
  const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL ?? "#";

  return (
    <>
      <Hero
        title="Blog"
        subtitle="Técnica, mentalidad, viajes y novedades para surfistas que quieren seguir aprendiendo."
      />

      <section className="section-space bg-zinc-100 text-zinc-900">
        <div className="container-site space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="ds-h2">Últimos artículos</h2>
              <p className="ds-body-s mt-2 text-zinc-600">Contenido curado para mejorar dentro y fuera del agua.</p>
            </div>
            <input
              type="search"
              placeholder="Buscar artículos"
              className="ds-input md:w-72"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.title} className="ds-card ds-card-interactive p-5">
                <p className="ds-label text-zinc-500">{post.category}</p>
                <h3 className="ds-h3 mt-2">{post.title}</h3>
                <p className="ds-body-s mt-3 text-zinc-700">{post.excerpt}</p>
                <button className="ds-link mt-4">Leer más</button>
              </article>
            ))}
          </div>

          <div className="ds-card p-6">
            <h3 className="ds-h3">Suscripción al newsletter</h3>
            <p className="ds-body-s mt-2 text-zinc-700">Conecta este botón a Substack en la siguiente fase para captar suscriptores.</p>
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
