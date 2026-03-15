"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toCurrencyPEN } from "@/lib/utils";

type PackageItem = {
  id: string;
  name: string;
  type: "credits" | "unlimited";
  classCount?: number;
  durationDays?: number;
  price: number;
};

type Props = {
  items: PackageItem[];
  onCheckout: (packageId: string) => Promise<void>;
};

export function PackageList({ items, onCheckout }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (items.length === 0) {
    return <div className="text-black/60">No hay paquetes disponibles en este momento.</div>;
  }

  // Fallback images array based on index
  const images = [
    "/photos/servicios_paquete_standard.jpg",
    "/photos/servicios_paquete_premium.jpg",
    "/photos/servicios_paquete_starter.jpg",
    "/photos/home1.jpg"
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((pkg, i) => (
        <div
          key={pkg.id}
          className="group relative overflow-hidden rounded-2xl bg-black transition-all hover:shadow-xl flex flex-col min-h-[380px]"
        >
          <Image 
            src={images[i % images.length]} 
            alt={pkg.name} 
            fill 
            className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-50"
          />
          <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-8 text-white">
            <div className="mb-auto">
              <div className="inline-block border border-white/40 bg-black/30 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-widest mb-5">
                {pkg.type === "credits" ? "Paquete de clases" : "Mensual ilimitado"}
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-wide">{pkg.name}</h3>
              <p className="mt-2 text-white/80 font-medium">
                {pkg.type === "credits"
                  ? `${pkg.classCount ?? 0} clases incluidas`
                  : `Válido por ${pkg.durationDays ?? 30} días`}
              </p>
            </div>
            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-bold tracking-tight">{toCurrencyPEN(pkg.price)}</p>
              </div>
              <Button
                className="bg-white text-black hover:bg-white/90 font-bold h-12 px-6 rounded-full"
                disabled={loadingId === pkg.id}
                onClick={async () => {
                  setLoadingId(pkg.id);
                  try {
                    await onCheckout(pkg.id);
                  } finally {
                    setLoadingId(null);
                  }
                }}
              >
                {loadingId === pkg.id ? "Cargando..." : "Comprar"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
