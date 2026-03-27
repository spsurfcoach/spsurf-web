import Image from "next/image";
import { RevealGroup } from "@/components/animations/Reveal";

export function PartnersSection() {
  return (
    <section className="relative overflow-hidden px-4 py-10 text-center sm:px-6 md:px-10 lg:px-16">
      {/* Decorative ellipse */}
      <div className="deco-ellipse -left-[150px] top-[173px] h-[588px] w-[588px] bg-[radial-gradient(circle,rgba(24,212,213,0.12),transparent)] hidden lg:block" />

      <RevealGroup className="relative">
        <p className="ds-label text-[var(--color-label-muted)]">PARTNERS</p>
        <h2 className="ds-display-title mt-3">Nuestros partners</h2>
        <div className="mx-auto mt-8 grid max-w-[900px] gap-6 sm:gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative flex h-[135px] items-center justify-center overflow-hidden rounded-xl border border-zinc-300 bg-white p-5">
            <Image src="/photos/surfplace.png" alt="Surf Place" fill className="object-contain p-5" />
          </div>
          <div className="relative flex h-[159px] items-center justify-center overflow-hidden rounded-xl border border-zinc-300 bg-white p-5">
            <Image src="/photos/channel_islands.png" alt="Channel Islands" fill className="object-contain p-5" />
          </div>
        </div>
      </RevealGroup>
    </section>
  );
}
