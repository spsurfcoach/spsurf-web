import Image from "next/image";

const leftPhotos = [
  { src: "/photos/home1.jpg", alt: "SP Family 1", height: "h-[220px]" },
  { src: "/photos/home2.jpg", alt: "SP Family 2", height: "h-[320px]" },
  { src: "/photos/hero.jpg",  alt: "SP Family 3", height: "h-[380px]" },
];

const rightPhotos = [
  { src: "/photos/home2.jpg", alt: "SP Family 4", height: "h-[460px]" },
  { src: "/photos/home1.jpg", alt: "SP Family 5", height: "h-[320px]" },
  { src: "/photos/hero.jpg",  alt: "SP Family 6", height: "h-[155px]" },
];

export function SpFamilySection() {
  return (
    <section className="bg-[#03313b] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      {/* Header */}
      <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">
        NUESTRA COMUNIDAD
      </p>
      <h2 className="ds-display-title mt-3 text-white">La SP Family</h2>

      {/* Photo mosaic */}
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {leftPhotos.map((photo) => (
            <div
              key={photo.alt}
              className={`relative w-full overflow-hidden rounded-[30px] ${photo.height}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {rightPhotos.map((photo) => (
            <div
              key={photo.alt}
              className={`relative w-full overflow-hidden rounded-[30px] ${photo.height}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
