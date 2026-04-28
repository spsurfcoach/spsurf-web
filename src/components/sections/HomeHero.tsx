"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RevealGroup } from "@/components/animations/Reveal";

const HERO_SLIDES = [
  { src: "/photos/surftrips/gallery_spfamily_1.jpg", alt: "SP Family compartiendo un surfcamp" },
  { src: "/photos/IMG_1401.jpg", alt: "Momento de surf con SP Family" },
  { src: "/photos/hero.jpg", alt: "Surfista entrando al mar" },
] as const;

const AUTO_PLAY_MS = 5000;

export function HomeHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => setPrefersReducedMotion(mediaQuery.matches);

    syncReducedMotion();
    mediaQuery.addEventListener("change", syncReducedMotion);

    return () => {
      mediaQuery.removeEventListener("change", syncReducedMotion);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || HERO_SLIDES.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % HERO_SLIDES.length);
    }, AUTO_PLAY_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [prefersReducedMotion]);

  return (
    <section className="pt-0">
      <div className="relative min-h-[100svh] overflow-hidden rounded-b-[24px] sm:rounded-b-[28px] lg:rounded-b-[40px]">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeSlide;

          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!isActive}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          );
        })}
        <div className="hero-overlay-gradient absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="px-4 pb-8 text-white sm:px-6 sm:pb-12 md:px-10 lg:px-16 lg:pb-16">
            <RevealGroup className="max-w-[58rem]" start="top 92%" stagger={0.1} y={24}>
              <h1 className="ds-h1 leading-[1.15]">
                Mejora tu surfing, entiende el mar y disfruta cada sesion.
              </h1>
              <div className="ds-section-lead-gap">
                <Link
                  href="/clases?tab=comprar"
                  className="ds-btn ds-btn-lg inline-flex border border-white bg-white/10 text-white hover:bg-white/20"
                >
                  Comprar Clases
                </Link>
              </div>
              {HERO_SLIDES.length > 1 ? (
                <div className="mt-6 flex items-center gap-2" aria-hidden="true">
                  {HERO_SLIDES.map((slide, index) => (
                    <span
                      key={slide.src}
                      className={`block h-1.5 rounded-full transition-all duration-300 ease-out motion-reduce:transition-none ${
                        index === activeSlide ? "w-8 bg-white" : "w-2.5 bg-white/45"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
