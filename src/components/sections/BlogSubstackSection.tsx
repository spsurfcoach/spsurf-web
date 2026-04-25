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
          <ul className="mt-10 divide-y divide-zinc-200/90 border-t border-zinc-200/90">
            {posts.map((post) => {
              const dateLine = formatPostDate(post.pubDate);
              return (
                <li key={post.link} className="py-8 first:pt-0">
                  <p className="ds-label text-[var(--color-label-muted)]">
                    {dateLine || "Substack"}
                  </p>
                  <h3 className="ds-h3 mt-1 max-w-3xl text-black">
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-black/80"
                    >
                      {post.title}
                    </a>
                  </h3>
                  {post.excerpt ? (
                    <p className="ds-body-s mt-3 max-w-3xl leading-[1.75] text-black/75">{post.excerpt}</p>
                  ) : null}
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ds-link mt-4 inline-block"
                  >
                    Leer en Substack
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
