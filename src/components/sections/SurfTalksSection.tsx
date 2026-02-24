export function SurfTalksSection() {
  return (
    <section className="px-4 py-14 sm:px-6 md:px-10 md:py-16 lg:px-16">
      {/* Surf Talks banner */}
      <div className="flex h-[240px] items-center justify-center rounded-[30px] bg-[#ffe100] lg:h-[318px]">
        <p className="ds-brand-title text-center">SURF TALKS</p>
      </div>

      <p className="ds-label mt-12 text-[var(--color-label-muted)]">NUESTROS SURFTALKS</p>
      <h2 className="ds-h1 mt-3 max-w-[1312px] leading-[1.5] tracking-[-0.04em] lg:leading-[63px]">
        Cada episodio es una charla honesta entre surfistas, entrenadores y apasionados del mar. Hablamos de progresar, de disfrutar el proceso, de encontrar equilibrio y propósito dentro y fuera del agua.
      </h2>
      <button className="ds-btn ds-btn-primary ds-btn-lg mt-9">Suscríbete a nuestro canal</button>
    </section>
  );
}
