"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { RevealGroup } from "@/components/animations/Reveal";
import { toCurrencyPEN } from "@/lib/utils";

type PackageItem = {
  id: string;
  name: string;
  type: "credits" | "unlimited";
  classCount?: number;
  durationDays?: number;
  price: number;
};

const PACKAGE_IMAGES = [
  "/photos/servicios_paquete_premium.jpg",
  "/photos/servicios_paquete_standard.jpg",
  "/photos/servicios_paquete_starter.jpg",
  "/photos/servicios_hero.jpg",
];

const TYPE_LABELS: Record<PackageItem["type"], string> = {
  credits: "Paquete de clases",
  unlimited: "Membership",
};

function packageDetail(pkg: PackageItem) {
  return pkg.type === "credits"
    ? `${pkg.classCount ?? 0} clases`
    : `Ilimitado por ${pkg.durationDays ?? 30} días`;
}

export function ServiciosPackagesSection() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadPackages = async () => {
      try {
        const response = await fetch("/api/packages");
        const data = (await response.json()) as { items?: PackageItem[] };

        if (!cancelled) {
          setPackages(data.items ?? []);
        }
      } catch {
        if (!cancelled) {
          setPackages([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadPackages();

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedPackages = useMemo(() => {
    const classPackages = packages.filter((p) => p.type === "credits");
    return [...classPackages].sort((a, b) => {
      const ac = a.classCount ?? 0;
      const bc = b.classCount ?? 0;
      if (ac !== bc) return ac - bc;
      return a.price - b.price;
    });
  }, [packages]);

  return (
    <section className="bg-[var(--color-background-default)] px-4 py-10 sm:px-6 md:px-10 lg:px-16">
      <div className="relative overflow-hidden rounded-[30px] bg-[var(--color-primary-900)] px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        {/* Background overlay photo */}
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
          <RevealGroup watch={sortedPackages.length}>
            {/* Header */}
            <h2 className="ds-h2 text-center text-white">Nuestros paquetes</h2>
            <p className="ds-body-s ds-section-lead-gap text-center text-white/70">
              Estos son los mismos paquetes disponibles dentro de Clases.
            </p>

            {/* Pricing cards */}
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {isLoading ? (
                <div className="col-span-full rounded-[30px] border border-white/15 bg-white/5 px-6 py-10 text-center text-white/70">
                  Cargando paquetes...
                </div>
              ) : sortedPackages.length ? (
                sortedPackages.map((pkg, index) => (
                  <Link
                    key={pkg.id}
                    href="/clases"
                    className="flex flex-col overflow-hidden rounded-[30px] bg-white transition-transform duration-200 hover:-translate-y-1"
                  >
                    <div className="relative h-[183px] w-full shrink-0">
                      <Image
                        src={PACKAGE_IMAGES[index % PACKAGE_IMAGES.length]}
                        alt={pkg.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                        <span className="inline-block rounded-full bg-[var(--color-primary-700)] px-6 py-2 text-xs font-bold uppercase tracking-[0.9px] text-white">
                          {TYPE_LABELS[pkg.type]}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col items-center px-5 pb-8 pt-10 text-center">
                      <h3 className="ds-h3 font-semibold text-black">{pkg.name}</h3>
                      <p className="ds-h3 mt-3 font-semibold text-black">{toCurrencyPEN(pkg.price)}</p>
                      <p className="ds-body-s mt-2 text-zinc-500">{packageDetail(pkg)}</p>
                      <span className="ds-btn ds-btn-primary mt-8 inline-flex">
                        Inicia sesión para comprar
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full rounded-[30px] border border-white/15 bg-white/5 px-6 py-10 text-center text-white/70">
                  No hay paquetes activos disponibles en este momento.
                </div>
              )}
            </div>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
