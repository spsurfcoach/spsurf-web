import Image from "next/image";
import { surfTrips } from "@/lib/content";

function PlayIcon() {
  return (
    <div className="flex size-[100px] items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
      <svg width="40" height="40" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="32" fill="white" fillOpacity="0.9" />
        <path d="M26 20L46 32L26 44V20Z" fill="#011a1f" />
      </svg>
    </div>
  );
}

function UsersIcon({ dark }: { dark: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={dark ? "white" : "black"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function SurftripsDetailSection() {
  return (
    <div>
      {surfTrips.map((trip, index) => {
        const isDark = index % 2 === 1;

        const photoCol = (
          <div className="relative h-[280px] overflow-hidden rounded-[30px] sm:h-[360px] lg:h-[405px]">
            <Image
              src={trip.image}
              alt={trip.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayIcon />
            </div>
          </div>
        );

        const infoCol = (
          <div className="flex flex-col justify-center py-4 lg:py-0">
            {/* Country + destination */}
            <p
              className={`ds-body-s font-medium text-[18px] ${isDark ? "text-white/70" : "text-black/60"}`}
            >
              {trip.country}
            </p>
            <h2
              className={`mt-1 font-bold text-[40px] leading-tight ${isDark ? "text-white" : "text-black"}`}
            >
              {trip.name}
            </h2>

            {/* Description */}
            <p
              className={`mt-4 ds-body-s leading-[33px] ${isDark ? "text-white/80" : "text-black"}`}
            >
              {trip.description}
            </p>

            {/* Group size */}
            <div className="mt-4 flex items-center gap-2">
              <UsersIcon dark={isDark} />
              <span
                className={`text-[18px] font-medium ${isDark ? "text-white" : "text-black"}`}
              >
                {trip.groupSize}
              </span>
            </div>

            {/* Divider */}
            <hr className={`my-4 border-t ${isDark ? "border-white/20" : "border-black/15"}`} />

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-4">
              {[
                { label: "NIVEL", value: trip.level },
                { label: "HOSPEDAJE", value: trip.hospedaje },
                { label: "DURACIÓN", value: trip.duracion },
                { label: "AEROPUERTO", value: trip.aeropuerto },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p
                    className={`text-[13px] font-medium tracking-wide ${isDark ? "text-white/50" : "text-black/50"}`}
                  >
                    {label}
                  </p>
                  <p
                    className={`mt-1 text-[15px] ${isDark ? "text-white" : "text-black"}`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <a
                href="#reservar"
                className={`inline-flex items-center justify-center rounded-[50px] px-8 py-4 text-[18px] font-medium transition ${
                  isDark
                    ? "bg-white text-[#011a1f] hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/85"
                }`}
              >
                Reservar ahora
              </a>
            </div>
          </div>
        );

        return (
          <section
            key={trip.name}
            className={isDark ? "py-8 lg:py-10" : "bg-[var(--color-background-default)] py-8 lg:py-10"}
          >
            {isDark ? (
              /* Dark variant: full-width dark card */
              <div className="mx-4 overflow-hidden rounded-[30px] bg-[#011a1f] px-4 py-8 sm:mx-6 sm:px-8 md:mx-10 md:px-10 lg:mx-12 lg:px-16 lg:py-14">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                  <div className="order-2 lg:order-1">{infoCol}</div>
                  <div className="order-1 lg:order-2">{photoCol}</div>
                </div>
              </div>
            ) : (
              /* Light variant: plain background */
              <div className="container-site px-4 sm:px-6 md:px-10 lg:px-16">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                  <div>{photoCol}</div>
                  <div>{infoCol}</div>
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
