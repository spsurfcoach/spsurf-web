"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type SurftripDetailVideoSectionProps = {
  title?: string;
  videoUrl: string;
  posterSrc: string;
};

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url) || url.startsWith("/videos/");
}

function getEmbedUrl(url: string) {
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
  }

  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
  }

  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : url;
  }

  return url;
}

export function SurftripDetailVideoSection({
  title,
  videoUrl,
  posterSrc,
}: SurftripDetailVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const directVideo = useMemo(() => isDirectVideo(videoUrl), [videoUrl]);
  const embedUrl = useMemo(() => getEmbedUrl(videoUrl), [videoUrl]);

  return (
    <section className="bg-[var(--color-background-default)] px-4 py-6 sm:px-6 md:px-10 lg:px-16">
      {title ? <p className="ds-label mb-6 text-[var(--color-label-muted)]">{title}</p> : null}

      <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] lg:rounded-[40px]">
        {isPlaying ? (
          directVideo ? (
            <video className="h-full w-full object-cover" controls autoPlay playsInline poster={posterSrc}>
              <source src={videoUrl} />
              Tu navegador no soporta video HTML5.
            </video>
          ) : (
            <div className="aspect-video w-full">
              <iframe
                src={embedUrl}
                title={title || "Surftrip video"}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="group relative block aspect-video w-full overflow-hidden"
            aria-label="Reproducir video del surftrip"
          >
            <Image src={posterSrc} alt={title || "Video del surftrip"} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/20 transition-colors duration-200 group-hover:bg-black/26" />
            <span className="absolute left-1/2 top-1/2 flex size-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 shadow-lg">
              <svg className="ml-1 h-8 w-8 text-[var(--color-primary-900)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
