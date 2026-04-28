import Image from "next/image";
import Link from "next/link";
import { RevealGroup } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";
import { packageOfferCards } from "@/lib/content";

export function HomeSubscriptionsSection() {
  return (
    <>
      <section className="bg-[var(--color-background-default)] px-4 py-10 sm:px-6 md:px-10 lg:px-16">
        <div className="overflow-hidden rounded-[30px] bg-[var(--color-primary-900)] px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <RevealGroup>
            <p className="ds-label text-center text-[var(--color-primary-400)]">PAQUETES</p>
            <h2 className="ds-h2 mt-4 text-center text-white">Elige tu paquete</h2>
            <p className="ds-body-s mt-3 text-center text-white/60">
              Compra bloques de sesiones y úsalos con la vigencia que mejor encaje con tu ritmo.
            </p>

            <div className="mt-12 grid gap-5 md:grid-cols-3 md:items-stretch">
              {packageOfferCards.map((p) => (
                <Link
                  key={p.id}
                  href="/clases?tab=comprar"
                  className={cn(
                    "flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] bg-white transition-transform duration-200 hover:-translate-y-1",
                    p.featured && "shadow-2xl ring-2 ring-white/40",
                  )}
                >
                  <div className="relative h-[200px] w-full shrink-0">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                      priority={p.featured}
                    />
                    {p.featured ? (
                      <div className="absolute inset-0 bg-[var(--color-primary-900)]/20" />
                    ) : null}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-700)] px-5 py-2 text-xs font-bold uppercase tracking-[0.9px] text-white shadow-lg">
                        Paquete
                        {p.featured ? (
                          <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px]">Popular</span>
                        ) : null}
                      </span>
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col items-center px-6 pb-8 pt-10 text-center">
                    <h3 className="ds-h3 font-semibold text-black">{p.name}</h3>
                    <p className="mt-2 text-sm text-black/55">
                      {p.classes} · {p.validity}
                    </p>
                    <div className="mt-3 flex items-end gap-1">
                      <span className="text-3xl font-bold leading-none text-black">{p.price}</span>
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-black/50">{p.description}</p>
                    <div className="mt-auto w-full pt-7">
                      <span
                        className={cn(
                          "ds-btn inline-flex w-full justify-center",
                          p.featured ? "ds-btn-primary" : "ds-btn-secondary",
                        )}
                      >
                        Comprar
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </RevealGroup>
        </div>
      </section>

      <section className="bg-[var(--color-background-default)] px-4 py-10 sm:px-6 md:px-10 lg:px-16">
        <div className="relative min-h-[420px] overflow-hidden rounded-[30px] sm:min-h-[420px] lg:min-h-[460px]">
          <Image
            src="/photos/el_salvador_membresias.JPG"
            alt=""
            fill
            className="origin-center scale-110 object-cover object-[56%_50%]"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-[var(--color-primary-900)]/60" aria-hidden />
          <div className="relative z-10 flex min-h-[340px] flex-col items-center justify-center px-6 py-16 text-center sm:min-h-[400px] sm:py-20 lg:min-h-[460px] lg:py-24">
            <h2 className="ds-h2 max-w-[52rem] text-balance text-white">
              Conoce nuestras membresías de clases ilimitadas
            </h2>
            <p className="ds-body-m mt-4 text-white/85">
              3, 6 o 12 meses
            </p>
            <Link
              href="/servicios#membresias"
              className="ds-btn ds-btn-lg mt-8 inline-flex border border-white bg-white/10 text-white hover:bg-white/20"
            >
              Ver membresías
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
