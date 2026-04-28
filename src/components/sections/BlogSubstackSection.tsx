import Image from "next/image";
import { type SubstackPostItem, SUBSTACK_PUBLIC_URL, formatPostDate } from "@/lib/substack-feed";

type BlogSubstackSectionProps = {
  posts: SubstackPostItem[];
};

export function BlogSubstackSection({ posts }: BlogSubstackSectionProps) {
  return (
    <section className="bg-[var(--color-background-default)] py-14 md:py-16 lg:py-20">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16">
        <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">BLOG</p>
        <h2 className="ds-h2 mt-2 text-black">Últimos artículos</h2>
        <p className="ds-body-s mt-3 max-w-2xl text-black/75">
          Contenido en <span className="font-medium text-black/90">SP surfcoach</span> (Substack). Cada
          enlace se abre en una pestaña nueva.
        </p>

        {posts.length === 0 ? (
          <div className="mt-10 rounded-[24px] border border-zinc-200/80 bg-white/80 p-8 md:p-10">
            <p className="ds-body-s text-black/80">
              No pudimos cargar el listado ahora. Puedes visitar el blog directamente en Substack.
            </p>
            <a
              href={SUBSTACK_PUBLIC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-btn ds-btn-primary mt-6 inline-flex"
            >
              Abrir Substack
            </a>
          </div>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => {
              const dateLine = formatPostDate(post.pubDate);
              return (
                <li key={post.link} className="min-h-0">
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-zinc-200/80 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-zinc-100">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                          <span className="ds-label text-zinc-400">SP surfcoach</span>
                        </div>
                      )}
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
                      <p className="ds-label text-[var(--color-label-muted)]">{dateLine || "Substack"}</p>
                      <h3 className="ds-h3 mt-2 line-clamp-2 text-black group-hover:text-black/80">{post.title}</h3>
                      {post.excerpt ? (
                        <p className="ds-body-s mt-3 line-clamp-3 flex-1 leading-[1.75] text-black/75">{post.excerpt}</p>
                      ) : null}
                      <span className="ds-link mt-4 inline-block self-start">Leer en Substack</span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={SUBSTACK_PUBLIC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ds-btn ds-btn-secondary"
          >
            Ver publicación en Substack
          </a>
        </div>
      </div>
    </section>
  );
}
