import Image from "next/image";
import { RevealGroup } from "@/components/animations/Reveal";

const PARTNERS = [
  { src: "/photos/soma.png", alt: "Soma" },
  { src: "/photos/T%C3%ADtulo%20secundario.png", alt: "Partner" },
  { src: "/photos/surfplace.png", alt: "Surf Place" },
  { src: "/channelilsands.png", alt: "Channel Islands", invert: true },
  { src: "/photos/Logo%20minimalista%20de%20Futures..png", alt: "Futures" },
];

export function PartnersSection() {
  return (
    <section className="relative overflow-hidden px-4 py-10 text-center sm:px-6 md:px-10 lg:px-16">
      {/* Decorative ellipse */}
      <div className="deco-ellipse -left-[150px] top-[173px] h-[588px] w-[588px] bg-[radial-gradient(circle,rgba(24,212,213,0.12),transparent)] hidden lg:block" />

      <RevealGroup className="relative">
        <p className="ds-label text-[var(--color-label-muted)]">PARTNERS</p>
        <h2 className="ds-display-title ds-section-lead-gap">Nuestros partners</h2>
        <div className="mx-auto mt-8 grid max-w-[1200px] grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:grid-cols-5 lg:gap-8">
          {PARTNERS.map((partner) => (
            <div
              key={partner.src}
              className="relative flex h-[120px] items-center justify-center overflow-hidden rounded-xl bg-transparent p-4 md:h-[140px]"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                fill
                className={`object-contain p-4${partner.invert ? " brightness-0" : ""}`}
              />
            </div>
          ))}
        </div>
      </RevealGroup>
    </section>
  );
}
