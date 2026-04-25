import { Reveal, RevealGroup } from "@/components/animations/Reveal";
import { surftalksPicksYouTube, surftalksPickEmbedSrc } from "@/lib/surftalks-picks-youtube";

export function SurfTalksVideosPicksSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12 lg:px-16">
      <RevealGroup>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {surftalksPicksYouTube.map((video, index) => {
            return (
              <Reveal key={video.id}>
                <div className="relative aspect-video overflow-hidden rounded-[20px] sm:rounded-[24px]">
                  <iframe
                    className="absolute inset-0 h-full w-full border-0"
                    src={surftalksPickEmbedSrc(video)}
                    title={`Charla en YouTube ${index + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </RevealGroup>
    </section>
  );
}
