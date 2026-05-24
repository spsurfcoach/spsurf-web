import React from "react";

const TRUST_ITEMS = [
  "+15 años de experiencia",
  "Videoanálisis incluido",
  "Método MAP Técnica",
  "Surf camps internacionales",
  "+300 alumnos entrenados",
];

export function TrustBar() {
  return (
    <div className="bg-[var(--color-primary-900)] overflow-x-auto">
      <div className="flex items-center whitespace-nowrap px-4 py-4 sm:justify-center">
        {TRUST_ITEMS.map((item, i) => (
          <React.Fragment key={item}>
            <span className="ds-body-s px-4 text-white/90 shrink-0 tracking-wide">
              {item}
            </span>
            {i < TRUST_ITEMS.length - 1 && (
              <span className="text-white/30 shrink-0 select-none" aria-hidden="true">
                ·
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
