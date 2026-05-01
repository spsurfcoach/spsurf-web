"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import type { ReactNode } from "react";

type CarouselShellProps = {
  slides: ReactNode[];
  slideClassName?: string;
  options?: EmblaOptionsType;
  ariaLabel: string;
  darkControls?: boolean;
  /** Avanza automáticamente cada N ms. Se pausa al pasar el cursor y cuando la pestaña no está visible. */
  autoPlayMs?: number;
};

export function CarouselShell({
  slides,
  slideClassName = "basis-[86%] sm:basis-[65%] lg:basis-[45%]",
  options = { align: "start", loop: false },
  ariaLabel,
  darkControls = true,
  autoPlayMs,
}: CarouselShellProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const hoverPausedRef = useRef(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    const initialize = window.setTimeout(onSelect, 0);

    return () => {
      window.clearTimeout(initialize);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || autoPlayMs == null || autoPlayMs < 1 || slides.length < 2) {
      return;
    }

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const tick = () => {
      if (!emblaApi || document.visibilityState !== "visible" || hoverPausedRef.current) {
        return;
      }
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    };

    const id = window.setInterval(tick, autoPlayMs);
    return () => window.clearInterval(id);
  }, [emblaApi, autoPlayMs, slides.length]);

  const activeDotClass = darkControls ? "bg-white/95" : "bg-[var(--color-text-default)]";
  const inactiveDotClass = darkControls ? "bg-white/45" : "bg-black/25";
  const controlClass = darkControls
    ? "border-white/40 text-white"
    : "border-black/35 text-[var(--color-text-default)]";

  return (
    <div
      onPointerEnter={() => {
        hoverPausedRef.current = true;
      }}
      onPointerLeave={() => {
        hoverPausedRef.current = false;
      }}
    >
      <div className="overflow-hidden" ref={emblaRef} aria-label={ariaLabel}>
        <div className="-ml-4 flex touch-pan-y">
          {slides.map((slide, index) => (
            <div key={index} className={`min-w-0 flex-[0_0_auto] pl-4 ${slideClassName}`}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={`h-2.5 rounded-full transition-all ${selectedIndex === index ? `w-6 ${activeDotClass}` : `w-2.5 ${inactiveDotClass}`}`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${controlClass} disabled:cursor-not-allowed disabled:opacity-50`}
            aria-label="Slide anterior"
          >
            <span aria-hidden="true">{"<"}</span>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${controlClass} disabled:cursor-not-allowed disabled:opacity-50`}
            aria-label="Slide siguiente"
          >
            <span aria-hidden="true">{">"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
