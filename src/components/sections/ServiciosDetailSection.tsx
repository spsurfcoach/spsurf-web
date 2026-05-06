"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal, RevealGroup } from "@/components/animations/Reveal";
import { serviciosDetailTabs } from "@/lib/content";

function coachInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function ServiciosDetailSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = serviciosDetailTabs[activeIndex]!;

  useEffect(() => {
    const applyHash = () => {
      const raw = window.location.hash.slice(1);
      if (!raw.startsWith("servicio-tab-")) return;
      const tabId = raw.slice("servicio-tab-".length);
      const idx = serviciosDetailTabs.findIndex((t) => t.id === tabId);
      if (idx >= 0) setActiveIndex(idx);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <section id="clases" className="scroll-mt-28 bg-[var(--color-background-default)] py-14 lg:py-20">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16">
        <RevealGroup>
          <div>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
              <div>
                <h2 className="sr-only">Servicios detallados</h2>
                <div
                  role="tablist"
                  aria-label="Tipos de servicio"
                  className="flex flex-col divide-y divide-zinc-200/90 border-y border-zinc-200/90"
                >
                  {serviciosDetailTabs.map((item, index) => {
                    const selected = index === activeIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        id={`servicio-tab-${item.id}`}
                        aria-selected={selected}
                        aria-controls="servicio-tab-panel"
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setActiveIndex(index)}
                        className={`scroll-mt-28 group flex w-full min-w-0 py-7 text-left transition-colors sm:py-8 ${
                          selected && item.coach
                            ? "flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                            : "flex items-center justify-start"
                        }`}
                      >
                        {selected && item.coach ? (
                          <>
                            <span className="flex min-w-0 w-full items-center justify-start gap-3 sm:flex-1 sm:pr-2">
                              <span
                                className="size-2.5 shrink-0 rounded-full border-2 border-black bg-black"
                                aria-hidden
                              />
                              <span
                                className="min-w-0 text-left text-xl font-bold leading-snug tracking-tight sm:text-2xl lg:text-[1.65rem] lg:leading-tight"
                              >
                                {item.title}
                              </span>
                            </span>
                            <span className="flex w-full min-w-0 items-center justify-start gap-2.5 sm:w-auto sm:shrink-0 sm:justify-end sm:gap-3 sm:pl-2">
                              <span className="ds-body-s min-w-0 text-left font-semibold text-black sm:whitespace-nowrap">
                                {item.coach.name}
                              </span>
                              <span
                                className="relative size-12 shrink-0 overflow-hidden rounded-full bg-zinc-200 sm:size-16"
                                aria-hidden
                              >
                                {item.coach.imageSrc ? (
                                  <Image
                                    src={item.coach.imageSrc}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                ) : (
                                  <span className="ds-body-s absolute inset-0 flex items-center justify-center font-semibold text-zinc-700">
                                    {coachInitials(item.coach.name)}
                                  </span>
                                )}
                              </span>
                            </span>                          </>
                        ) : (
                          <span className="flex min-w-0 w-full items-center justify-start gap-3">
                            <span
                              className={`size-2.5 shrink-0 rounded-full border-2 transition-colors ${
                                selected
                                  ? "border-black bg-black"
                                  : "border-zinc-300 bg-transparent group-hover:border-zinc-500"
                              }`}
                              aria-hidden
                            />
                            <span
                              className={`min-w-0 text-left text-xl font-bold leading-snug tracking-tight sm:text-2xl lg:text-[1.65rem] lg:leading-tight ${
                                selected ? "text-black" : "text-zinc-400 hover:text-zinc-600"
                              }`}
                            >
                              {item.title}
                            </span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative z-10 flex min-h-0 flex-col">
                <div id="servicio-tab-panel" role="tabpanel" aria-labelledby={`servicio-tab-${active.id}`}>
                  {active.paragraphs.map((p, i) => (
                    <p key={i} className="ds-body-s mt-6 leading-[1.8] text-black/90 first:mt-0">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="mt-8 flex shrink-0 justify-end">
                  <Link
                    href={active.comprarHref}
                    className="inline-flex max-w-full items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    <span className="truncate">Comprar {active.title}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </RevealGroup>

        <Reveal className="mt-12">
          <div className="relative h-[240px] w-full overflow-hidden rounded-[40px] border-2 border-white sm:h-[280px] lg:h-[335px]">
            <Image
              src="/photos/DSC_5325 copia.jpg"
              alt="Videoanálisis"
              fill
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
