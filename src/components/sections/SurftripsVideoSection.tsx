import Image from "next/image";

export function SurftripsVideoSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-6 sm:px-6 md:px-10 lg:px-12 lg:py-8">
      <div className="relative mx-auto overflow-hidden rounded-[40px] h-[280px] sm:h-[380px] lg:h-[652px]">
        <Image
          src="/photos/home2.jpg"
          alt="Surftrip video preview"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            aria-label="Reproducir video"
            className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30 lg:size-[64px]"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="32" fill="white" fillOpacity="0.9" />
              <path d="M26 20L46 32L26 44V20Z" fill="#011a1f" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
