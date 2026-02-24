export function HomeSurftrips() {
  const trips = [
    { name: "El Salvador", date: "11 - 18 de Junio 2026", availability: "8 DISPONIBLES", width: "40%", color: "#d4efc4" },
    { name: "Chicama", date: "25 - 28 de Julio 2026", availability: "8 DISPONIBLES", width: "40%", color: "#d4efc4" },
    { name: "Lobitos", date: "15 - 20 de Enero 2026", availability: "SOLO 2 DISPONIBLES", width: "80%", color: "rgba(251,210,199,0.9)" },
  ];

  return (
    <section className="py-14 md:py-16">
      <div className="grid gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1.1fr] md:px-10 lg:px-16">
        <div>
          <p className="ds-label text-[var(--color-label-muted)]">NUESTROS SURFTRIPS</p>
          <h2 className="ds-section-title mt-4 max-w-[540px]">
            Mejora tu surfing en los mejores destinos y vive experiencias únicas junto a una comunidad que comparte tu misma pasión por el mar.
          </h2>
          <button className="ds-btn ds-btn-primary ds-btn-lg mt-8">Conoce más</button>
        </div>
        <div className="space-y-7">
          {trips.map((trip) => (
            <div key={trip.name}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="ds-chip inline-block rounded-full bg-black px-3 py-1 text-white">Intermedio</p>
                <span className="text-[18px] text-black/50">{trip.date}</span>
              </div>
              <h3 className="ds-h2-sm mt-2 leading-none">{trip.name}</h3>
              <div className="relative mt-2 h-[60px] overflow-hidden rounded-full border-2 border-black">
                <div style={{ width: trip.width, backgroundColor: trip.color }} className="h-full rounded-l-full" />
                <div className="absolute inset-0 flex h-[60px] items-center justify-end pr-5 ds-body-s">
                  {trip.availability}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
