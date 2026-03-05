import Image from "next/image";
import type { ReactNode } from "react";

type ResponsiveMediaFrameProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  ratioClassName?: string;
  overlayClassName?: string;
  children?: ReactNode;
};

export function ResponsiveMediaFrame({
  src,
  alt,
  priority = false,
  className = "",
  imageClassName = "",
  ratioClassName = "aspect-[4/3] md:aspect-[16/10]",
  overlayClassName,
  children,
}: ResponsiveMediaFrameProps) {
  return (
    <div className={`site-media-frame ${ratioClassName} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={`object-cover ${imageClassName}`}
      />
      {overlayClassName ? <div aria-hidden="true" className={`absolute inset-0 ${overlayClassName}`} /> : null}
      {children}
    </div>
  );
}
