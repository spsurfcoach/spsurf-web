import Image from "next/image";
import Link from "next/link";
import { footerColumns, navItems } from "@/lib/content";

export function Footer() {
  const quickLinks = navItems.filter((item) => item.href !== "/");

  return (
    <footer className="bg-[var(--color-primary-900)] py-12 text-white lg:py-14 rounded-t-[24px] sm:rounded-t-[28px] lg:rounded-t-[40px]">
      <div className="container-site px-6 lg:px-10">
        <div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="sm:col-span-2 lg:col-span-1">
              <Image
                src="/photos/logosp.png"
                alt="SP Surf Coach"
                width={132}
                height={57}
                className="h-auto w-full max-w-[132px] object-contain"
              />
              <p className="ds-body-s mt-4 max-w-[28ch] text-white/80">
                Entrenamiento, comunidad y viajes para crecer dentro y fuera del agua.
              </p>
            </div>

            {footerColumns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className="ds-h3 font-semibold text-white">{column.title}</p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link className="ds-body-s text-white/80 transition-colors hover:text-white" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 sm:justify-start">
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} className="ds-chip text-white/70 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="flex flex-wrap items-center justify-center gap-x-3 text-sm text-white/80 sm:justify-end">
              <Link
                href="/tyc-spsurfcoach.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/80 underline underline-offset-2 transition-colors hover:text-white"
              >
                Términos y Condiciones
              </Link>
              <span className="text-white/40" aria-hidden="true">
                |
              </span>
              <span>&copy; 2026 SP Surf Coach</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
