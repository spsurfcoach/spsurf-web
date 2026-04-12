"use client";

import Image from "next/image";
import { useState } from "react";
import { RevealGroup } from "@/components/animations/Reveal";

const serviceCards = [
  {
    title: "Entrenamiento técnico",
    src: "/photos/home_serviciossection.jpg",
    posClass: "lg:absolute lg:right-8 lg:top-6 lg:w-[92%]",
  },
  {
    title: "Análisis y preparación",
    src: "/photos/home_serviciossection2.jpg",
    posClass: "lg:absolute lg:right-0 lg:top-48 lg:w-[96%]",
  },
];

export function HomeServicios() {
  const [swapped, setSwapped] = useState(false);

  return (
    <section className="relative overflow-hidden section-space">
      {/* Decorative ellipse */}
      <div className="deco-ellipse -left-[230px] -top-[7px] h-[588px] w-[588px] bg-[radial-gradient(circle,rgba(24,212,213,0.15),transparent)] hidden lg:block" />

      <div className="relative grid gap-10 px-4 sm:px-6 md:px-10 lg:grid-cols-2 lg:gap-12 lg:px-16">
        <RevealGroup>
          <p className="ds-label text-[var(--color-label-muted)]">SERVICIOS</p>
          <h2 className="ds-h1 ds-section-lead-gap max-w-[540px] leading-[1.5] tracking-[-0.04em] lg:leading-[60px]">
            Entrena dentro y fuera del agua en sesiones para cada nivel y objetivo. Uniendo sesiones en el agua,
            video análisis, entrenamientos complementarios y preparación mental.
          </h2>
          <button className="ds-btn ds-btn-primary ds-btn-lg mt-8">Conoce más de nuestros servicios</button>
        </RevealGroup>

        {/* Cards stack */}
        <div
          className="mx-auto w-full max-w-[620px] space-y-4 lg:relative lg:h-[600px] lg:space-y-0"
          onMouseEnter={() => setSwapped(true)}
          onMouseLeave={() => setSwapped(false)}
        >
          {serviceCards.map((card, i) => {
            const isOnTop = swapped ? i === 0 : i === 1;
            const isCard0 = i === 0;

            return (
              <article
                key={card.title}
                style={{ zIndex: isOnTop ? 10 : 1 }}
                className={[
                  "overflow-hidden rounded-[20px] border-4 border-white transition-all duration-500",
                  card.posClass,
                  isOnTop
                    ? "lg:opacity-100 lg:shadow-xl lg:scale-[1.02]"
                    : isCard0
                    ? "lg:opacity-75 lg:scale-[0.98]"
                    : "lg:rotate-[2deg] lg:opacity-80 lg:scale-[0.98]",
                ].join(" ")}
              >
                <div className="relative aspect-[16/10]">
                  <Image src={card.src} alt={card.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-[rgba(7,82,98,0.52)] to-92%" />
                  <p className="absolute bottom-6 left-5 max-w-[82%] text-[22px] font-bold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] sm:text-[28px]">
                    {card.title}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
