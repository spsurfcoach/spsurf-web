"use client";

import Image from "next/image";
import { useState } from "react";
import { homePackages } from "@/lib/content";

const PACKAGE_TABS = ["Clases de surf", "Surf skate", "Video analisis"];

const packageImageByName: Record<string, string> = {
  Starter: "/photos/servicios_paquete_starter.jpg",
  Standard: "/photos/servicios_paquete_standard.jpg",
  Premium: "/photos/servicios_paquete_premium.jpg",
};

export function ServiciosPackagesSection() {
  const [activeTab, setActiveTab] = useState(0);

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
          {/* Header */}
          <h2 className="ds-h2 text-center text-white">Nuestros paquetes</h2>

          {/* Tab row */}
          <div className="mt-6 flex items-center justify-center gap-8 sm:gap-12">
            {PACKAGE_TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`ds-body-s relative pb-2 transition-colors ${
                  activeTab === i ? "font-semibold text-white" : "text-white/60"
                }`}
              >
                {tab}
                {activeTab === i && (
                  <span className="absolute bottom-0 left-1/2 size-[10px] -translate-x-1/2 translate-y-[6px] rounded-full bg-white" />
                )}
              </button>
            ))}
          </div>

          {/* Pricing cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3 sm:gap-4 lg:gap-6">
            {homePackages.map((pkg) => (
              <article
                key={pkg.name}
                className="flex flex-col overflow-hidden rounded-[30px] bg-white"
              >
                {/* Photo top */}
                <div className="relative h-[183px] w-full shrink-0">
                  <Image
                    src={packageImageByName[pkg.name] ?? "/photos/servicios_paquete_standard.jpg"}
                    alt={pkg.name}
                    fill
                    className="object-cover"
                  />
                  {/* Badge */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <span className="inline-block rounded-full bg-[var(--color-primary-700)] px-8 py-2 text-xs font-bold uppercase tracking-[0.9px] text-white">
                      {pkg.name}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col items-center px-4 pb-8 pt-10 text-center">
                  <p className="ds-h3 font-semibold text-black">{pkg.price}</p>
                  <p className="ds-body-s mt-1 text-zinc-500">{pkg.classes}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
