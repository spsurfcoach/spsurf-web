"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  start?: string;
  once?: boolean;
};

type RevealGroupProps = RevealProps & {
  stagger?: number;
  watch?: number | string;
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 0.75,
  y = 32,
  start = "top 88%",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) {
      return;
    }

    const element = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          delay,
          duration,
          ease: "power2.out",
          overwrite: "auto",
          scrollTrigger: {
            trigger: element,
            start,
            once,
          },
        },
      );
    }, ref);

    return () => {
      ctx.revert();
    };
  }, [delay, duration, once, start, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function RevealGroup({
  children,
  className = "",
  delay = 0,
  duration = 0.75,
  y = 32,
  start = "top 88%",
  once = true,
  stagger = 0.12,
  watch,
}: RevealGroupProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) {
      return;
    }

    const items = Array.from(ref.current.children);

    if (!items.length) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          delay,
          duration,
          ease: "power2.out",
          stagger,
          overwrite: "auto",
          scrollTrigger: {
            trigger: ref.current,
            start,
            once,
          },
        },
      );
    }, ref);

    return () => {
      ctx.revert();
    };
  }, [delay, duration, once, stagger, start, watch, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
