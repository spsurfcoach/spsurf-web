import Image from "next/image";

export function DestinosSection() {
  const destinos = [
    { name: "El Salvador", src: "/photos/home2.jpg" },
    { name: "Lobitos", src: "/photos/hero.jpg" },
    { name: "Chicama", src: "/photos/home1.jpg" },
  ];

  return (
    <section className="relative overflow-hidden py-14 md:py-16">
      {/* Photo background with overlay */}
      <Image src="/photos/home2.jpg" alt="" fill className="object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-[rgba(1,42,58,0.8)]" />

      <div className="relative px-4 sm:px-6 md:px-10 lg:px-16">
        <p className="ds-label text-[var(--color-label-muted)]">DESTINOS</p>
        <h2 className="ds-section-title mt-4 text-white">Explora nuevos destinos</h2>

        {/* Desktop: flex row with overflow on 3rd card */}
        <div className="mt-8 flex gap-4 overflow-hidden">
          {destinos.map((item) => (
            <article key={item.name} className="w-full shrink-0 sm:w-[calc(50%-8px)] lg:w-[574px]">
              <div className="relative h-[280px] overflow-hidden rounded-[30px] lg:h-[372px]">
                <Image src={item.src} alt={item.name} fill className="object-cover" />
              </div>
              <h3 className="ds-h2-lg mt-3 text-white">{item.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
