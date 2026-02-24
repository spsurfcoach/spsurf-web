import Image from "next/image";

export function ComunidadSection() {
  const images = [
    { src: "/photos/home1.jpg", alt: "Community 1" },
    { src: "/photos/home2.jpg", alt: "Community 2" },
    { src: "/photos/home1.jpg", alt: "Community 3" },
  ];

  return (
    <section className="overflow-hidden px-4 py-10 sm:px-6 md:px-10 lg:px-16">
      <p className="ds-label text-[var(--color-label-muted)]">NUESTRA COMUNIDAD</p>
      <h2 className="ds-display-title mt-3">Se parte de la SP Family</h2>

      {/* Flex row with 3rd image overflowing right */}
      <div className="mt-6 flex gap-4 overflow-hidden">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative h-[280px] w-full shrink-0 overflow-hidden rounded-[30px] sm:w-[calc(50%-8px)] lg:h-[372px] lg:w-[574px]"
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
