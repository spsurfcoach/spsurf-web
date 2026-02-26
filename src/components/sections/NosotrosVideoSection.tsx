import Image from "next/image";

export function NosotrosVideoSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-6 sm:px-6 md:px-10 lg:px-16">
      <div className="container-site">
        <div className="relative h-[300px] overflow-hidden rounded-[40px] sm:h-[420px] lg:h-[652px]">
          <Image
            src="/photos/home2.jpg"
            alt="SP Surf Coach video"
            fill
            className="object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <svg
                className="ml-1 size-6 text-[var(--color-primary-900)]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
