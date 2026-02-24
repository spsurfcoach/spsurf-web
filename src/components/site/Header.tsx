"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/content";

export function Header() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isHome = pathname === "/";
  const homeNavOrder = ["/surftrips", "/servicios", "/shop", "/blog", "/nosotros"];
  const orderedItems = navItems
    .filter((item) => item.href !== "/")
    .sort((a, b) => homeNavOrder.indexOf(a.href) - homeNavOrder.indexOf(b.href));

  return (
    <header
      className={`z-40 ${
        isHome
          ? "absolute inset-x-0 top-4 border-transparent bg-transparent md:top-8"
          : "ds-nav-dark sticky top-0 border-b border-white/10 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-12 w-[min(1309px,calc(100%-2rem))] items-center justify-between md:w-[min(1309px,calc(100%-3rem))]">
        <Link
          href="/"
          className="block"
        >
          <Image
            src="/photos/logosp.png"
            alt="SP Surf Coach"
            width={111}
            height={48}
            className="h-12 w-[111px] object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:gap-[50px] lg:flex">
          {orderedItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`ds-nav-link transition ${
                  isHome
                    ? "!text-white hover:text-white/90"
                    : isActive
                      ? "text-white"
                      : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button className={`${isHome ? "text-white/90" : "text-zinc-200"} px-2`}>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="7.5" r="3.5" />
              <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
            </svg>
          </button>
          <button className={`${isHome ? "text-white/90" : "text-zinc-200"} px-2`}>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M3 4h2l2.5 11h10.5l2-8H7.5" />
            </svg>
          </button>
          <button
            className={`${isHome ? "text-white/90" : "text-zinc-200"} px-2 lg:hidden`}
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
      {isMobileOpen ? (
        <div className="mx-auto mt-3 w-[min(1309px,calc(100%-2rem))] rounded-xl bg-black/70 p-4 backdrop-blur lg:hidden">
          <nav className="flex flex-col gap-3">
            {orderedItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="ds-nav-link text-white"
                onClick={() => setIsMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}


