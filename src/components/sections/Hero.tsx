type HeroProps = {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function Hero({ title, subtitle, ctaLabel, ctaHref }: HeroProps) {
  return (
    <section className="hero-gradient">
      <div className="container-site flex min-h-[420px] flex-col justify-center py-20">
        <div className="max-w-2xl space-y-6">
          <h1 className="ds-h1 md:text-[56px]">{title}</h1>
          <p className="ds-body-s max-w-xl text-zinc-200">{subtitle}</p>
          {ctaLabel && ctaHref ? (
            <a
              href={ctaHref}
              className="ds-btn ds-btn-secondary inline-block"
            >
              {ctaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}


