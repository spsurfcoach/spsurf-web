import Image from "next/image";
import { RevealGroup } from "@/components/animations/Reveal";

type ImagePartner = {
  type: "image";
  /** Path under `public/` */
  src: string;
  alt: string;
  unoptimized?: boolean;
  invert?: boolean;
  /** Extra inset so the logo reads smaller (Tailwind padding on the image) */
  imagePaddingClass?: string;
};

type TextPartner = {
  type: "text";
  name: string;
  subtitle?: string;
};

type Partner = ImagePartner | TextPartner;

const PARTNERS: Partner[] = [
  {
    type: "image",
    src: "/photos/soma_logo_verde.svg",
    alt: "Soma",
    unoptimized: true,
    imagePaddingClass: "p-6 md:p-7",
  },
  {
    type: "image",
    src: "/photos/surfplace.png",
    alt: "Surf Place",
    imagePaddingClass: "p-6 md:p-7",
  },
  { type: "image", src: "/channelilsands.png", alt: "Channel Islands", invert: true },
  { type: "image", src: "/photos/Logo minimalista de Futures..png", alt: "Futures" },
];

export function PartnersSection() {
  return (
    <section className="relative overflow-hidden px-4 py-10 text-center sm:px-6 md:px-10 lg:px-16">
      {/* Decorative ellipse */}
      <div className="deco-ellipse -left-[150px] top-[173px] h-[588px] w-[588px] bg-[radial-gradient(circle,rgba(24,212,213,0.12),transparent)] hidden lg:block" />

      <RevealGroup className="relative">
        <p className="ds-label text-[var(--color-label-muted)]">PARTNERS</p>
        <h2 className="ds-display-title ds-section-lead-gap">Nuestros partners</h2>
        <div className="mx-auto mt-8 grid max-w-[1200px] grid-cols-2 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8">
          {PARTNERS.map((partner) =>
            partner.type === "image" ? (
              <div
                key={partner.src}
                className="relative flex h-[120px] items-center justify-center overflow-hidden rounded-xl bg-transparent p-4 md:h-[140px]"
              >
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  fill
                  className={`object-contain ${partner.imagePaddingClass ?? "p-4"}${partner.invert ? " brightness-0" : ""}`}
                  unoptimized={partner.unoptimized ?? false}
                />
              </div>
            ) : (
              <div
                key={partner.name}
                className="flex min-h-[135px] flex-col items-center justify-center rounded-xl border border-black/10 bg-white/60 p-5 md:min-h-[159px]"
              >
                <p className="text-lg font-bold tracking-tight text-black">{partner.name}</p>
                {partner.subtitle && (
                  <p className="mt-1 text-xs font-medium uppercase tracking-[1.5px] text-black/40">{partner.subtitle}</p>
                )}
              </div>
            )
          )}
        </div>
      </RevealGroup>
    </section>
  );
}
