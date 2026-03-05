import Image from "next/image";
import Link from "next/link";
import { footerColumns, navItems } from "@/lib/content";

export function Footer() {
  const quickLinks = navItems.filter((item) => item.href !== "/");

  return (
    <footer className="bg-[var(--color-primary-900)] py-12 text-white lg:py-14">
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
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} className="ds-chip text-white/70 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="text-sm text-white/80">&copy; 2026 SP Surf Coach</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
