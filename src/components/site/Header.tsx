"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/content";

const NAV_ORDER = ["/surftrips", "/servicios", "/shop", "/blog", "/nosotros"];
const HERO_ROUTES = ["/", "/surftrips", "/servicios", "/nosotros"];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const isHeroRoute = HERO_ROUTES.includes(pathname);
  const isOverlay = isHeroRoute && isAtTop && !mobileOpen;

  const links = useMemo(
    () =>
      navItems
        .filter((item) => item.href !== "/")
        .sort((a, b) => NAV_ORDER.indexOf(a.href) - NAV_ORDER.indexOf(b.href)),
    [],
  );

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => {
      setIsAtTop(window.scrollY < 16);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`inset-x-0 top-0 z-50 border-b ${
        isHeroRoute ? "fixed" : "sticky"
      } ${
        isOverlay
          ? "border-transparent bg-transparent"
          : "border-white/10 bg-[var(--color-surface-dark)]/95 backdrop-blur-sm"
      }`}
    >
      {/* Main bar */}
      <div className="container-site flex h-[var(--header-height)] w-full items-center justify-between">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/photos/logosp.png"
            alt="SP Surf Coach"
            width={111}
            height={48}
            className="h-10 w-auto object-contain lg:h-12"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 xl:gap-12 lg:flex">
          {links.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`ds-nav-link transition-colors duration-150 ${
                  isOverlay
                    ? "text-white hover:text-white/80"
                    : isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-0.5">
          {/* Account */}
          <button
            className="p-2.5 text-white/70 hover:text-white transition-colors duration-150"
            aria-label="Mi cuenta"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="7.5" r="3.5" />
              <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
            </svg>
          </button>

          {/* Cart */}
          <button
            className="p-2.5 text-white/70 hover:text-white transition-colors duration-150"
            aria-label="Carrito"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M3 4h2l2.5 11h10.5l2-8H7.5" />
            </svg>
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="p-2.5 text-white/70 hover:text-white transition-colors duration-150 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[var(--color-surface-dark)] lg:hidden">
          <nav className="container-site flex max-h-[calc(100dvh-var(--header-height))] flex-col overflow-y-auto py-2">
            {links.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`ds-nav-link py-4 border-b border-white/5 last:border-0 transition-colors duration-150 ${
                    isActive ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
