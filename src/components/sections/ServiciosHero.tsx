import Image from "next/image";
import Link from "next/link";
import { RevealGroup } from "@/components/animations/Reveal";

export function ServiciosHero() {  return (
    <section className="pt-0">
      <div className="relative min-h-[100svh] overflow-hidden">
        <Image src="/photos/servicios_hero.jpg" alt="Servicios de surf" fill className="object-cover" priority />
        <div className="hero-overlay-gradient absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="px-4 pb-8 text-white sm:px-6 sm:pb-12 md:px-10 lg:px-16 lg:pb-16">
            <RevealGroup className="max-w-[58rem]" start="top 92%" stagger={0.1} y={24}>
              <h1 className="ds-h1 leading-[1.15]">Servicios</h1>
              <p className="ds-body-s mt-4 max-w-[50rem] leading-relaxed text-white/90 lg:mt-6">
                Clases personalizadas, análisis de video y acompañamiento constante para surfistas que quieren subir
                de nivel sin perder la esencia.
              </p>
              <div className="ds-section-lead-gap mt-6 lg:mt-8">
                <Link
                  href="/clases?tab=comprar"
                  className="ds-btn ds-btn-lg inline-flex border border-white bg-white/10 text-white hover:bg-white/20"
                >
                  Comprar
                </Link>
              </div>
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
