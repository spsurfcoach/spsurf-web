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

type FilterType = "all" | "credits" | "unlimited";
type SortOrder = "asc" | "desc";

const TYPE_LABELS: Record<string, string> = {
  credits: "Paquete de clases",
  unlimited: "Membership",
};

// One photo per package slot — loops if more packages than photos
const PHOTOS = [
  "/photos/servicios_paquete_premium.jpg",
  "/photos/servicios_paquete_standard.jpg",
  "/photos/servicios_paquete_starter.jpg",
  "/photos/home1.jpg",
  "/photos/home2.jpg",
  "/photos/servicios_hero.jpg",
];

export function PackageList({ items, onCheckout }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortOrder | null>(null);

  if (items.length === 0) {
    return <div className="text-black/60 text-sm">No hay paquetes disponibles en este momento.</div>;
  }

  const filtered = items.filter((pkg) => filter === "all" || pkg.type === filter);
  const sorted = sort
    ? [...filtered].sort((a, b) => sort === "asc" ? a.price - b.price : b.price - a.price)
    : [...filtered].sort((a, b) => {
        if (a.type !== b.type) return a.type === "unlimited" ? -1 : 1;
        return 0;
      });

  // Keep stable photo index based on original order (before filter/sort)
  const photoIndex = new Map(items.map((pkg, i) => [pkg.id, i]));

  const tabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "unlimited", label: "Membership" },
    { key: "credits", label: "Paquetes" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter + sort bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl bg-black/[0.04] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.key
                  ? "bg-white shadow-sm text-black"
                  : "text-black/50 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setSort((current) => {
              if (current === null) return "asc";
              if (current === "asc") return "desc";
              return null;
            })
          }
          className="flex items-center gap-1.5 text-sm font-medium text-black/50 hover:text-black transition-colors px-3 py-2 rounded-lg hover:bg-black/[0.04]"
        >
          Precio
          <span className="text-xs leading-none">
            {sort === "asc" ? "↑" : sort === "desc" ? "↓" : "↕"}
          </span>
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {sorted.map((pkg) => {
          const imgIdx = (photoIndex.get(pkg.id) ?? 0) % PHOTOS.length;

          return (
            <div
              key={pkg.id}
              className="group relative overflow-hidden rounded-2xl h-[120px]"
            >
              {/* Photo background */}
              <Image
                src={PHOTOS[imgIdx]}
                alt={pkg.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/55" />

              {/* Content — fully centered vertically */}
              <div className="absolute inset-0 flex items-center justify-between gap-4 px-6">
                {/* Left: badge + name + detail */}
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      pkg.type === "unlimited"
                        ? "bg-amber-400/20 text-amber-400 border border-amber-400/40"
                        : "bg-white/20 text-white border border-white/30"
                    }`}
                  >
                    {TYPE_LABELS[pkg.type]}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-lg leading-tight truncate">
                      {pkg.name}
                    </p>
                    <p className="text-white/70 text-sm mt-0.5">
                      {pkg.type === "credits"
                        ? `${pkg.classCount ?? 0} sesiones · Videoanálisis incluido`
                        : `Ilimitado · ${pkg.durationDays ?? 30} días`}
                    </p>
                  </div>
                </div>

                {/* Right: price + button */}
                <div className="flex items-center gap-4 shrink-0">
                  <p className="text-xl font-bold text-white tabular-nums">
                    {toCurrencyPEN(pkg.price)}
                  </p>
                  <Button
                    className="h-10 px-5 rounded-full font-semibold bg-white text-black hover:bg-white/90 text-sm shrink-0"
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
          );
        })}
      </div>
    </div>
  );
}
