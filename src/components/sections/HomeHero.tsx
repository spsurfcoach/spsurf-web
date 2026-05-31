"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const HERO_SLIDES = [
  {
    src: "/photos/surftrips/gallery_spfamily_1.jpg",
    alt: "SP Family compartiendo un surfcamp",
    headline: "Surf Coaching premium: Entrena todo lo que puedas.",
    ctaLabel: "Ver Membresias",
    ctaHref: "/clases?tab=comprar",
  },
  {
    src: "/photos/IMG_1401.jpg",
    alt: "Momento de surf con SP Family",
    headline: "Surf camps diseñados para entrenar y viajar con una comunidad que busca lo mismo que tú.",
    ctaLabel: "Explorar Surf Camps",
    ctaHref: "/surftrips",
  },
  {
    src: "/photos/hero.jpg",
    alt: "Surfista entrando al mar",
    headline: "Entrena con sesiones diseñadas para ayudarte a entender y mejorar tu surfing.",
    ctaLabel: "Comenzar entrenamiento",
    ctaHref: "/clases",
  },
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
    return () => mediaQuery.removeEventListener("change", syncReducedMotion);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || HERO_SLIDES.length < 2) return;
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, AUTO_PLAY_MS);
    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion]);

  return (
    <section className="pt-0">
      <div className="relative min-h-[100svh] overflow-hidden rounded-b-[24px] sm:rounded-b-[28px] lg:rounded-b-[40px]">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
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
            <div className="grid max-w-[58rem]">
              {HERO_SLIDES.map((slide, index) => {
                const isActive = index === activeSlide;
                return (
                  <div
                    key={slide.src}
                    style={{ gridArea: "1/1" }}
                    className={`transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                      isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <h1 className="ds-h1 leading-[1.15]">{slide.headline}</h1>
                    <div className="ds-section-lead-gap">
                      <Link
                        href={slide.ctaHref}
                        className="ds-btn ds-btn-lg ds-btn-secondary inline-flex shadow-[0_10px_40px_-8px_rgba(0,0,0,0.45)] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-6px_rgba(0,0,0,0.5)] motion-reduce:hover:translate-y-0"
                        tabIndex={isActive ? 0 : -1}
                      >
                        {slide.ctaLabel}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            {HERO_SLIDES.length > 1 ? (
              <div className="mt-6 flex items-center gap-2">
                {HERO_SLIDES.map((slide, index) => (
                  <button
                    key={slide.src}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Ir a diapositiva ${index + 1}`}
                    className={`block h-1.5 rounded-full transition-all duration-300 ease-out motion-reduce:transition-none ${
                      index === activeSlide ? "w-8 bg-white" : "w-2.5 bg-white/45"
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
