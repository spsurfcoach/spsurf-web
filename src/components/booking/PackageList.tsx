"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DEFAULT_PRODUCT_IMAGES, productCategoryLabel } from "@/lib/booking/storefront";
import { toCurrencyPEN } from "@/lib/utils";

type PackageItem = {
  id: string;
  name: string;
  category: "package" | "membership" | "videoanalysis" | "surfskate" | "surftrip";
  fulfillmentType: "class_booking" | "direct_purchase" | "surftrip_booking";
  shortDescription: string;
  description?: string;
  classCount?: number;
  durationDays?: number;
  capacity?: number;
  enrolledCount?: number;
  startDate?: string;
  endDate?: string;
  price: number;
  image?: string;
  badge?: string;
  features?: string[];
};

type Props = {
  items: PackageItem[];
  onCheckout: (productId: string) => Promise<void>;
};

type FilterType = "all" | PackageItem["category"];
type SortOrder = "asc" | "desc";

const FILTER_LABELS: Record<FilterType, string> = {
  all: "Todos",
  membership: "Memberships",
  package: "Paquetes",
  videoanalysis: "Videoanalisis",
  surfskate: "Surfskate",
  surftrip: "Surftrips",
};

export function PackageList({ items, onCheckout }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortOrder | null>(null);

  if (items.length === 0) {
    return <div className="text-black/60 text-sm">No hay productos disponibles en este momento.</div>;
  }

  const filtered = items.filter((product) => filter === "all" || product.category === filter);
  const sorted = sort
    ? [...filtered].sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price))
    : [...filtered].sort((a, b) => {
        if (a.category === b.category) return a.name.localeCompare(b.name);
        const order = ["membership", "package", "videoanalysis", "surfskate", "surftrip"];
        return order.indexOf(a.category) - order.indexOf(b.category);
      });

  const tabs = (["all", ...new Set(items.map((item) => item.category))] as FilterType[]).map((key) => ({
    key,
    label: FILTER_LABELS[key],
  }));

  function productMeta(product: PackageItem) {
    if (product.category === "package") {
      return `${product.classCount ?? 0} clases`;
    }

    if (product.category === "membership") {
      return `Ilimitado por ${product.durationDays ?? 30} dias`;
    }

    if (product.category === "surftrip" && product.startDate && product.endDate) {
      return `${new Date(product.startDate).toLocaleDateString("es-PE")} - ${new Date(product.endDate).toLocaleDateString("es-PE")}`;
    }

    return product.shortDescription;
  }

  function ctaLabel(product: PackageItem, soldOut: boolean) {
    if (soldOut) return "Sin cupos";
    if (product.fulfillmentType === "surftrip_booking") return "Comprar surftrip";
    return "Comprar";
  }

  return (
    <div className="space-y-6">
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((product) => {
          const soldOut =
            product.fulfillmentType === "surftrip_booking" &&
            product.capacity != null &&
            product.enrolledCount != null &&
            product.enrolledCount >= product.capacity;
          const image = product.image ?? DEFAULT_PRODUCT_IMAGES[product.category];
          const remainingSeats =
            product.capacity != null && product.enrolledCount != null
              ? Math.max(0, product.capacity - product.enrolledCount)
              : null;

          return (
            <div
              key={product.id}
              className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="relative h-52 overflow-hidden">
                <Image src={image} alt={product.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
                  <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {product.badge ?? productCategoryLabel(product.category)}
                  </span>
                  {soldOut ? (
                    <span className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white">
                      Completo
                    </span>
                  ) : null}
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xl font-bold text-white">{product.name}</p>
                  <p className="mt-1 text-sm text-white/75">{productMeta(product)}</p>
                </div>
              </div>

              <div className="space-y-4 px-5 py-5">
                <div>
                  <p className="text-sm text-black/60">{product.description ?? product.shortDescription}</p>
                  {product.category === "surftrip" && remainingSeats != null ? (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-900)]">
                      {remainingSeats} cupos disponibles
                    </p>
                  ) : null}
                </div>

                {product.features?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {product.features.slice(0, 3).map((feature) => (
                      <span key={feature} className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-black/60">
                        {feature}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-black/40">Precio</p>
                    <p className="text-2xl font-bold text-black">{toCurrencyPEN(product.price)}</p>
                  </div>
                  <Button
                    className="h-11 rounded-full bg-[var(--color-primary-900)] px-5 font-semibold text-white hover:bg-[var(--color-primary-700)]"
                    disabled={loadingId === product.id || soldOut}
                    onClick={async () => {
                      setLoadingId(product.id);
                      try {
                        await onCheckout(product.id);
                      } finally {
                        setLoadingId(null);
                      }
                    }}
                  >
                    {loadingId === product.id ? "Cargando..." : ctaLabel(product, soldOut)}
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
