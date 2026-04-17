import Link from "next/link";
import Image from "next/image";
import { RevealGroup } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

const MEMBERSHIPS = [
  {
    id: "3m",
    duration: "3 meses",
    price: "S/1,590",
    unit: "/ mes",
    featured: false,
    description: "Ideal para arrancar tu progreso con compromiso real.",
    image: "/photos/servicios_paquete_starter.jpg",
  },
  {
    id: "12m",
    duration: "12 meses",
    badge: "Anual",
    price: "S/1,290",
    unit: "/ mes",
    featured: true,
    description: "El mejor valor. Progreso sostenido durante todo el año.",
    image: "/photos/servicios_paquete_premium.jpg",
  },
  {
    id: "6m",
    duration: "6 meses",
    price: "S/1,450",
    unit: "/ mes",
    featured: false,
    description: "Seis meses de entrenamiento continuo y resultados visibles.",
    image: "/photos/servicios_paquete_standard.jpg",
  },
] as const;

export function HomeSubscriptionsSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-10 sm:px-6 md:px-10 lg:px-16">
      <div className="overflow-hidden rounded-[30px] bg-[var(--color-primary-900)] px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <RevealGroup>
          <p className="ds-label text-center text-[var(--color-primary-400)]">MEMBRESÍAS</p>
          <h2 className="ds-h2 mt-4 text-center text-white">Elige tu plan</h2>
          <p className="ds-body-s mt-3 text-center text-white/60">
            Entrena de forma continua y progresa con estructura.
          </p>

          <div className="mt-12 grid items-end gap-5 md:grid-cols-3">
            {MEMBERSHIPS.map((m) => (
              <Link
                key={m.id}
                href="/clases"
                className={cn(
                  "flex flex-col overflow-hidden rounded-[24px] bg-white transition-transform duration-200 hover:-translate-y-1",
                  m.featured && "shadow-2xl ring-2 ring-white/40 md:-translate-y-3",
                )}
              >
                <div className="relative h-[200px] w-full shrink-0">
                  <Image
                    src={m.image}
                    alt={m.duration}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                    priority={m.featured}
                  />
                  {m.featured && (
                    <div className="absolute inset-0 bg-[var(--color-primary-900)]/20" />
                  )}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-700)] px-5 py-2 text-xs font-bold uppercase tracking-[0.9px] text-white shadow-lg">
                      Membresía
                      {"badge" in m && (
                        <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px]">
                          {m.badge}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-center px-6 pb-8 pt-10 text-center">
                  <h3 className="ds-h3 font-semibold text-black">{m.duration}</h3>
                  <div className="mt-3 flex items-end gap-1">
                    <span className="text-3xl font-bold leading-none text-black">{m.price}</span>
                    <span className="pb-0.5 text-sm text-black/40">{m.unit}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-black/50">{m.description}</p>
                  <span
                    className={cn(
                      "ds-btn mt-7 inline-flex w-full justify-center",
                      m.featured ? "ds-btn-primary" : "ds-btn-secondary",
                    )}
                  >
                    Comenzar
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-white/40">
            También disponibles paquetes de sesiones individuales en{" "}
            <Link href="/clases" className="text-white/70 underline underline-offset-2 hover:text-white">
              Clases
            </Link>
            .
          </p>
        </RevealGroup>
      </div>
    </section>
  );
}
