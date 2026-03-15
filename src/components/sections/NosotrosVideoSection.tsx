"use client";

import { useRef, useState } from "react";

export function NosotrosVideoSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = async () => {
    if (!videoRef.current) return;
    await videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <section className="bg-[var(--color-background-default)] px-4 py-6 sm:px-6 md:px-10 lg:px-16">
      <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] lg:rounded-[40px]">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          controls
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          <source src="/videos/0315.mp4" type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>

        {!isPlaying && (
          <button
            type="button"
            onClick={handlePlayClick}
            aria-label="Reproducir video"
            className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:bg-white"
          >
            <svg className="ml-1 h-6 w-6 text-[var(--color-primary-900)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
