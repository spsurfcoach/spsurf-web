import Link from "next/link";
import Image from "next/image";
import { RevealGroup } from "@/components/animations/Reveal";

const MEMBERSHIPS = [
  {
    label: "3 meses",
    price: "S/1,590",
    unit: "/ mes",
    featured: false,
    description: "Ideal para arrancar tu progreso con compromiso real.",
  },
  {
    label: "12 meses",
    sublabel: "Anual",
    price: "S/1,290",
    unit: "/ mes",
    featured: true,
    description: "El mejor valor. Progreso sostenido durante todo el año.",
  },
  {
    label: "6 meses",
    price: "S/1,450",
    unit: "/ mes",
    featured: false,
    description: "Seis meses de entrenamiento continuo y resultados visibles.",
  },
];

const SESSION_PACKS = [
  { label: "1 sesión", price: "S/160" },
  { label: "4 sesiones", price: "S/580" },
  { label: "6 sesiones", price: "S/840" },
  { label: "8 sesiones", price: "S/990" },
  { label: "12 sesiones", price: "S/1,390" },
];

export function HomeSubscriptionsSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-10 sm:px-6 md:px-10 lg:px-16">
      <div className="relative overflow-hidden rounded-[30px] bg-[var(--color-primary-900)] px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        {/* Background overlay */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/photos/servicios_hero.jpg"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10">
          <RevealGroup>
            {/* Header */}
            <p className="ds-label text-center text-[var(--color-primary-400)]">PLANES Y MEMBRESÍAS</p>
            <h2 className="ds-h2 mt-4 text-center text-white">Elige tu plan</h2>
            <p className="ds-body-s mt-3 text-center text-white/70">
              Membresías mensuales o paquetes de clases sueltas. Tú eliges cómo progresar.
            </p>

            {/* Membership cards */}
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {MEMBERSHIPS.map((m) => (
                <Link
                  key={m.label}
                  href="/clases"
                  className={[
                    "relative flex flex-col rounded-[24px] p-7 transition-transform duration-200 hover:-translate-y-1",
                    m.featured
                      ? "bg-white text-black shadow-2xl ring-2 ring-white"
                      : "bg-white/10 text-white hover:bg-white/15",
                  ].join(" ")}
                >
                  {m.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-primary-400)] px-4 py-1 text-[11px] font-bold uppercase tracking-[1px] text-white">
                      Más popular
                    </span>
                  )}
                  <p className={["ds-label text-xs tracking-[1.5px]", m.featured ? "text-[var(--color-primary-700)]" : "text-white/50"].join(" ")}>
                    MEMBRESÍA
                  </p>
                  <p className={["mt-2 text-xl font-semibold", m.featured ? "text-black" : "text-white"].join(" ")}>
                    {m.label}
                    {m.sublabel && (
                      <span className={["ml-2 rounded-full px-2 py-0.5 text-xs font-bold", m.featured ? "bg-[var(--color-primary-400)] text-white" : "bg-white/20"].join(" ")}>
                        {m.sublabel}
                      </span>
                    )}
                  </p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className={["text-4xl font-bold leading-none", m.featured ? "text-black" : "text-white"].join(" ")}>
                      {m.price}
                    </span>
                    <span className={["pb-1 text-sm", m.featured ? "text-black/50" : "text-white/50"].join(" ")}>
                      {m.unit}
                    </span>
                  </div>
                  <p className={["mt-3 text-sm leading-relaxed", m.featured ? "text-black/60" : "text-white/50"].join(" ")}>
                    {m.description}
                  </p>
                  <span className={["ds-btn mt-6 inline-flex justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors", m.featured ? "ds-btn-primary" : "border border-white/30 text-white hover:bg-white/10"].join(" ")}>
                    Comenzar
                  </span>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="mt-12 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/20" />
              <p className="ds-label text-xs tracking-[2px] text-white/50">PAQUETES DE CLASES</p>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            {/* Session packs */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {SESSION_PACKS.map((pack) => (
                <Link
                  key={pack.label}
                  href="/clases"
                  className="flex flex-col items-center gap-2 rounded-[18px] bg-white/10 px-4 py-5 text-center transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5"
                >
                  <p className="text-sm font-medium text-white/70">{pack.label}</p>
                  <p className="text-xl font-bold text-white">{pack.price}</p>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 text-center">
              <Link href="/clases" className="ds-btn ds-btn-primary ds-btn-lg inline-flex">
                Ver todos los planes
              </Link>
            </div>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
