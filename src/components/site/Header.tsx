"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { navItems } from "@/lib/content";

const NAV_ORDER = ["/", "/servicios", "/surftrips", "/blog", "/nosotros"];
const HERO_ROUTES = ["/", "/surftrips", "/servicios", "/nosotros"];

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const isHeroRoute = HERO_ROUTES.includes(pathname);
  const isOverlay = isHeroRoute && isAtTop && !mobileOpen;

  const links = useMemo(
    () =>
      [...navItems].sort((a, b) => NAV_ORDER.indexOf(a.href) - NAV_ORDER.indexOf(b.href)),
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
      className={`inset-x-0 z-50 border-b transition-[top,background-color,border-color] duration-200 ${
        isHeroRoute ? "fixed" : "sticky"
      } ${
        isOverlay
          ? "top-3 border-transparent bg-transparent lg:top-5"
          : "top-0 border-white/10 bg-[var(--color-surface-dark)]/95 backdrop-blur-sm"
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
          {user && (
            <>
              <Link
                href="/clases"
                className={`ds-nav-link transition-colors duration-150 ${
                  isOverlay ? "text-white hover:text-white/80" : "text-white/60 hover:text-white"
                }`}
              >
                Clases
              </Link>
              <Link
                href="/admin"
                className={`ds-nav-link transition-colors duration-150 ${
                  isOverlay ? "text-white hover:text-white/80" : "text-white/60 hover:text-white"
                }`}
              >
                Admin
              </Link>
            </>
          )}
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
        <div className="flex items-center gap-2">
          <Link
            href="/clases"
            className="ds-btn inline-flex h-9 items-center gap-2 whitespace-nowrap border border-white bg-white px-3 text-[13px] text-[var(--color-text-default)] hover:bg-white/90 sm:px-4 sm:text-sm"
            aria-label="Acceder"
          >
            <User className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
            Acceder
          </Link>
          {user ? (
            <button
              className="hidden lg:inline-flex ds-btn ds-btn-secondary h-9 px-4 text-sm"
              onClick={() => void logout()}
            >
              Salir
            </button>
          ) : null}

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
            {user && (
              <>
                <Link
                  href="/clases"
                  className={`ds-nav-link py-4 border-b border-white/5 transition-colors duration-150 ${
                    pathname === "/clases" ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Clases
                </Link>
                <Link
                  href="/admin"
                  className={`ds-nav-link py-4 border-b border-white/5 transition-colors duration-150 ${
                    pathname === "/admin" ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
