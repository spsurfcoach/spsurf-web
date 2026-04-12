"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealGroup } from "@/components/animations/Reveal";

export function HomePrimeSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 pb-6 pt-2 sm:px-6 sm:pb-10 md:px-10 lg:px-16 lg:pb-12">
      <div className="relative min-h-[300px] overflow-hidden rounded-[24px] sm:min-h-[360px] sm:rounded-[28px] lg:min-h-[420px] lg:rounded-[40px]">
        <Image
          src="/photos/servicios_paquete_premium.jpg"
          alt="Comunidad SP Surf Coach"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" aria-hidden />

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10 lg:p-12">
          <RevealGroup className="max-w-xl">
            <h2 className="ds-h2 text-white">Suscripción Prime</h2>
            <p className="ds-body-m ds-section-lead-gap text-white/90">
              Accede a beneficios como descuentos en paquetes de clases, reserva antes que nadie y mucho más…
            </p>
            <Link
              href="/servicios"
              className="ds-label mt-6 inline-flex items-center gap-2 text-white transition-opacity hover:opacity-85"
            >
              <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              Conoce los beneficios
            </Link>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
