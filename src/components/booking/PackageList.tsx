"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DEFAULT_PRODUCT_IMAGES, productCategoryLabel } from "@/lib/booking/storefront";
import { toCurrencyPEN, toCurrencyUSD } from "@/lib/utils";

type PackageItem = {
  id: string;
  slug?: string;
  name: string;
  category: "package" | "membership" | "videoanalysis" | "surfskate" | "surftrip";
  fulfillmentType: "class_booking" | "direct_purchase" | "surftrip_booking";
  /** From Firestore packages; when `subscription`, price is the monthly fee. */
  packageType?: "credits" | "unlimited" | "subscription";
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
  highlightProductId?: string | null;
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
  surftrip: "Surfcamps",
};

const CATEGORY_BY_PREFIX: Record<string, PackageItem["category"]> = {
  "surftrip:": "surftrip",
  "package:": "package",
};

function categoryFromProductId(productId: string): PackageItem["category"] | null {
  for (const [prefix, category] of Object.entries(CATEGORY_BY_PREFIX)) {
    if (productId.startsWith(prefix)) return category;
  }
  return null;
}

export function PackageList({ items, highlightProductId, onCheckout }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>(() => {
    if (highlightProductId) {
      return categoryFromProductId(highlightProductId) ?? "all";
    }
    return "all";
  });
  const [sort, setSort] = useState<SortOrder | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(highlightProductId ?? null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const didScrollRef = useRef(false);

  const cardRef = useCallback(
    (node: HTMLDivElement | null) => {
      highlightRef.current = node;
      if (node && !didScrollRef.current) {
        didScrollRef.current = true;
        requestAnimationFrame(() => {
          node.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
    },
    [],
  );

  useEffect(() => {
    if (!highlightedId) return;
    const timer = setTimeout(() => setHighlightedId(null), 2500);
    return () => clearTimeout(timer);
  }, [highlightedId]);

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
    if (product.fulfillmentType === "surftrip_booking") return "Comprar";
    return "Comprar";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl bg-black/[0.04] p-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

          const isHighlighted = product.id === highlightedId;

          return (
            <div
              key={product.id}
              ref={product.id === highlightProductId ? cardRef : undefined}
              className={`overflow-hidden rounded-[28px] border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 ${
                isHighlighted
                  ? "border-[var(--color-primary-900)] ring-2 ring-[var(--color-primary-900)]/30 animate-[highlight-pulse_1.5s_ease-in-out]"
                  : "border-black/10"
              }`}
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

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-3 mt-1">
                  <div className="shrink-0">
                    <p className="text-xs uppercase tracking-[0.14em] text-black/40">Precio</p>
                    <p className="flex flex-wrap items-baseline gap-x-1.5 text-2xl font-bold text-black">
                      <span>{product.category === "surftrip" ? toCurrencyUSD(product.price) : toCurrencyPEN(product.price)}</span>
                      {product.packageType === "subscription" ? (
                        <span className="text-base font-semibold text-black/55">/ mes</span>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row shrink-0 gap-2 sm:items-center w-full sm:w-auto">
                    {product.category === "surftrip" && product.slug ? (
                      <Link
                        href={`/surftrips/${product.slug}`}
                        className="inline-flex h-11 sm:h-10 w-full sm:w-auto justify-center items-center whitespace-nowrap rounded-full border border-black/15 px-6 sm:px-4 text-sm font-semibold text-black/70 transition-colors hover:bg-black/[0.04] hover:text-black"
                      >
                        Conoce más
                      </Link>
                    ) : null}
                    {product.category === "surftrip" ? (
                      <a
                        href={(() => {
                          const formattedDates = product.startDate && product.endDate
                            ? `${new Date(product.startDate).toLocaleDateString("es-PE")} - ${new Date(product.endDate).toLocaleDateString("es-PE")}`
                            : "por definir";
                          const message = `Hola! Estoy interesado en el Surfcamp ${product.name} con fechas ${formattedDates}`;
                          return `https://wa.me/51998153542?text=${encodeURIComponent(message)}`;
                        })()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex h-11 sm:h-10 w-full sm:w-auto justify-center items-center whitespace-nowrap rounded-full bg-black px-6 sm:px-4 text-sm font-semibold text-white hover:bg-zinc-800 ${soldOut ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        {ctaLabel(product, soldOut)}
                      </a>
                    ) : (
                      <Button
                        className="h-11 sm:h-10 w-full sm:w-auto whitespace-nowrap rounded-full bg-black px-6 sm:px-4 text-sm font-semibold text-white hover:bg-zinc-800"
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
