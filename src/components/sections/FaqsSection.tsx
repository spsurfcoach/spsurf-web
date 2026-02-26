"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";

export function FaqsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[var(--color-background-default)] px-4 py-10 sm:px-6 md:px-10 lg:px-16 lg:py-14">
      <div className="container-site">
        <div className="rounded-[40px] bg-white px-6 py-10 sm:px-10 sm:py-14 lg:rounded-[60px] lg:px-16 lg:py-20">
          <h2 className="ds-h2 text-black">FAQS</h2>

          <div className="mt-10 space-y-0">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              const isLast = i === faqs.length - 1;
              return (
                <div key={faq.question}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="ds-h3 text-black">{faq.question}</span>
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-full transition-transform"
                      aria-hidden="true"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${isOpen ? "rotate-45" : "rotate-0"}`}
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>

                  {isOpen && (
                    <p className="ds-body-s pb-5 text-zinc-600">{faq.answer}</p>
                  )}

                  {!isLast && <div className="h-px w-full bg-zinc-200" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
