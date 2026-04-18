"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Reveal, RevealGroup } from "@/components/animations/Reveal";
import { serviciosDetailTabs } from "@/lib/content";

const LG_MIN = 1024;

type Connector = { x1: number; y: number; x2: number };

export function ServiciosDetailSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [connector, setConnector] = useState<Connector | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const updateConnector = useCallback(() => {
    if (typeof window === "undefined" || window.innerWidth < LG_MIN) {
      setConnector(null);
      return;
    }

    const container = containerRef.current;
    const tabEl = tabRefs.current[activeIndex];
    const contentEl = contentRef.current;

    if (!container || !tabEl || !contentEl) {
      setConnector(null);
      return;
    }

    const c = container.getBoundingClientRect();
    const t = tabEl.getBoundingClientRect();
    const co = contentEl.getBoundingClientRect();

    const y = t.top + t.height / 2 - c.top;
    const x1 = t.right - c.left;
    const x2 = co.left - c.left;

    if (x2 <= x1) {
      setConnector(null);
      return;
    }

    setConnector({ x1, y, x2 });
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateConnector();
  }, [updateConnector]);

  useLayoutEffect(() => {
    const onResize = () => updateConnector();
    window.addEventListener("resize", onResize);

    const node = containerRef.current;
    const ro =
      node && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateConnector())
        : null;
    if (node && ro) ro.observe(node);

    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [updateConnector]);

  const active = serviciosDetailTabs[activeIndex]!;

  return (
    <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      <div className="container-site">
        <RevealGroup>
          <div ref={containerRef} className="relative">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="sr-only">Servicios detallados</h2>
                <div role="tablist" aria-label="Tipos de servicio" className="flex flex-col gap-1">
                  {serviciosDetailTabs.map((item, index) => {
                    const selected = index === activeIndex;
                    return (
                      <button
                        key={item.id}
                        ref={(el) => {
                          tabRefs.current[index] = el;
                        }}
                        type="button"
                        role="tab"
                        id={`servicio-tab-${item.id}`}
                        aria-selected={selected}
                        aria-controls="servicio-tab-panel"
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setActiveIndex(index)}
                        className={`w-full rounded-lg py-3 text-left text-lg font-bold leading-snug transition-colors lg:py-2.5 lg:pr-4 lg:text-xl ${
                          selected ? "text-black" : "text-zinc-400 hover:text-zinc-600"
                        }`}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div ref={contentRef} className="relative z-10">
                <div id="servicio-tab-panel" role="tabpanel" aria-labelledby={`servicio-tab-${active.id}`}>
                  {active.paragraphs.map((p, i) => (
                    <p key={i} className="ds-body-s mt-6 leading-[1.8] text-black/90 first:mt-0">
                      {p}
                    </p>
                  ))}

                  {active.showTestimonial ? (
                    <div className="mt-10 flex items-start gap-4">
                      <div className="relative size-[60px] shrink-0 overflow-hidden rounded-full">
                        <Image
                          src="/photos/servicios_1.jpg"
                          alt="Ivo Escuza"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="ds-body-s font-semibold text-black">Ivo Escuza</p>
                        <p className="ds-body-s mt-1 leading-[1.7] text-black/70">
                          Las clases combinan agua y vídeo: ves el detalle que en la ola pasa desapercibido y progresas
                          con foco.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {connector ? (
              <div
                className="pointer-events-none absolute z-[1] hidden bg-[#96D3DF] lg:block"
                style={{
                  left: connector.x1,
                  top: connector.y,
                  width: connector.x2 - connector.x1,
                  height: 2,
                  transform: "translateY(-50%)",
                }}
                aria-hidden
              />
            ) : null}
          </div>
        </RevealGroup>

        <Reveal className="mt-12">
          <div className="relative h-[240px] w-full overflow-hidden rounded-[40px] border-2 border-white sm:h-[280px] lg:h-[335px]">
            <Image
              src="/photos/servicios_1.jpg"
              alt="Clase de surf"
              fill
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
