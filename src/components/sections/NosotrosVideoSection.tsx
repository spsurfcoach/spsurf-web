import { ResponsiveMediaFrame } from "@/components/sections/ResponsiveMediaFrame";

export function NosotrosVideoSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-6 sm:px-6 md:px-10 lg:px-16">
      <div className="container-site">
        <ResponsiveMediaFrame
          src="/photos/home2.jpg"
          alt="SP Surf Coach video"
          ratioClassName="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[1512/652]"
          className="site-media-frame-lg"
          overlayClassName="bg-black/30"
        >

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
        </ResponsiveMediaFrame>
      </div>
    </section>
  );
}
