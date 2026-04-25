import { Reveal } from "@/components/animations/Reveal";

const SURFTRIPS_YOUTUBE_ID = "2YIrmLz6cOk";

export function SurftripsVideoSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-6 sm:px-6 md:px-10 lg:px-16">
      <Reveal>
        <div className="relative aspect-video overflow-hidden rounded-[24px] sm:rounded-[28px] lg:rounded-[40px]">
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={`https://www.youtube.com/embed/${SURFTRIPS_YOUTUBE_ID}?rel=0`}
            title="Video Surftrips SP Surf Coach"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </Reveal>
    </section>
  );
}
