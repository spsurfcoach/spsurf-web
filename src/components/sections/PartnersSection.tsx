import Image from "next/image";
import { RevealGroup } from "@/components/animations/Reveal";

const PARTNERS = [
  { file: "surfplace.png", alt: "Surf Place" },
  { file: "Asset 3.svg", alt: "Partner", unoptimized: true as const },
  { file: "Título secundario.png", alt: "Partner" },
] as const;

function photoSrc(file: string) {
  return `/photos/${encodeURIComponent(file)}`;
}

export function PartnersSection() {
  return (
    <section className="relative overflow-hidden px-4 py-10 text-center sm:px-6 md:px-10 lg:px-16">
      {/* Decorative ellipse */}
      <div className="deco-ellipse -left-[150px] top-[173px] h-[588px] w-[588px] bg-[radial-gradient(circle,rgba(24,212,213,0.12),transparent)] hidden lg:block" />

      <RevealGroup className="relative">
        <p className="ds-label text-[var(--color-label-muted)]">PARTNERS</p>
        <h2 className="ds-display-title ds-section-lead-gap">Nuestros partners</h2>
        <div className="mx-auto mt-8 grid max-w-[1100px] grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:gap-10">
          {PARTNERS.map((partner) => (
            <div
              key={partner.file}
              className="relative flex min-h-[135px] items-center justify-center overflow-hidden rounded-xl bg-transparent p-5 md:min-h-[159px]"
            >
              <Image
                src={photoSrc(partner.file)}
                alt={partner.alt}
                fill
                className="object-contain p-5"
                unoptimized={"unoptimized" in partner ? partner.unoptimized : false}
              />
            </div>
          ))}
        </div>
      </RevealGroup>
    </section>
  );
}
