import { Reveal, RevealGroup } from "@/components/animations/Reveal";
import { CarouselShell } from "@/components/sections/CarouselShell";
import { ResponsiveMediaFrame } from "@/components/sections/ResponsiveMediaFrame";

type SpFamilyPhoto = {
  src: string;
  alt: string;
  ratio?: string;
};

type SpFamilySectionProps = {
  photos?: SpFamilyPhoto[];
};

const DEFAULT_PHOTOS: SpFamilyPhoto[] = [
  { src: "/photos/home1.jpg", alt: "SP Family 1", ratio: "aspect-[4/3]" },
  { src: "/photos/home2.jpg", alt: "SP Family 2", ratio: "aspect-[4/3]" },
  { src: "/photos/hero.jpg", alt: "SP Family 3", ratio: "aspect-[5/4]" },
  { src: "/photos/home2.jpg", alt: "SP Family 4", ratio: "aspect-[5/4]" },
  { src: "/photos/home1.jpg", alt: "SP Family 5", ratio: "aspect-[4/3]" },
  { src: "/photos/hero.jpg", alt: "SP Family 6", ratio: "aspect-[16/9]" },
];

export function SpFamilySection({ photos = DEFAULT_PHOTOS }: SpFamilySectionProps) {
  const normalizedPhotos = photos.map((photo) => ({
    ...photo,
    ratio: photo.ratio ?? "aspect-[4/3] lg:aspect-[574/372]",
  }));

  return (
    <section id="sp-family" className="scroll-mt-28 bg-[#03313b] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      {/* Header */}
      <RevealGroup>
        <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">
          NUESTRA COMUNIDAD
        </p>
        <h2 className="ds-display-title mt-3 text-white">La SP Family</h2>
      </RevealGroup>

      <Reveal className="mt-10">
        <CarouselShell
          ariaLabel="Carrusel SP Family"
          slideClassName="basis-[82%] sm:basis-[52%] lg:basis-[38%]"
          slides={normalizedPhotos.map((photo) => (
            <ResponsiveMediaFrame
              key={photo.alt}
              src={photo.src}
              alt={photo.alt}
              ratioClassName={photo.ratio}
              imageClassName="object-top"
            />
          ))}
        />
      </Reveal>
    </section>
  );
}
