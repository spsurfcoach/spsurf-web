import Image from "next/image";
import { CarouselShell } from "@/components/sections/CarouselShell";
import { ResponsiveMediaFrame } from "@/components/sections/ResponsiveMediaFrame";

export function DestinosSection() {
  const destinos = [
    { name: "El Salvador", src: "/photos/el_salvador.JPG" },
    { name: "Lobitos", src: "/photos/lobitos.jpg" },
    { name: "Chicama", src: "/photos/chicama.jpg" },
  ];

  return (
    <section className="relative overflow-hidden py-14 md:py-16">
      {/* Photo background with overlay */}
      <Image src="/photos/chicama.jpg" alt="" fill className="object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-[rgba(1,42,58,0.8)]" />

      <div className="relative px-4 sm:px-6 md:px-10 lg:px-16">
        <p className="ds-label text-[var(--color-label-muted)]">DESTINOS</p>
        <h2 className="ds-section-title mt-4 text-white">Explora nuevos destinos</h2>

        <div className="mt-8">
          <CarouselShell
            ariaLabel="Carrusel de destinos"
            slideClassName="basis-[82%] sm:basis-[52%] lg:basis-[38%]"
            slides={destinos.map((item) => (
              <article key={item.name}>
                <ResponsiveMediaFrame
                  src={item.src}
                  alt={item.name}
                  ratioClassName="aspect-[4/3] lg:aspect-[574/372]"
                />
                <h3 className="ds-h2-lg mt-3 text-white">{item.name}</h3>
              </article>
            ))}
          />
        </div>
      </div>
    </section>
  );
}
