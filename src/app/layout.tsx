import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://spsurfcoach.com"),
  title: {
    default: "SP Surf Coach",
    template: "%s | SP Surf Coach",
  },
  description:
    "Entrenamiento de surf personalizado, surftrips, videoanálisis y comunidad para progresar dentro y fuera del agua.",
  keywords: [
    "surf coaching",
    "clases de surf",
    "surftrips",
    "videoanálisis surf",
    "entrenamiento surf",
    "surf Perú",
    "método MAP",
    "surf camps",
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://spsurfcoach.com",
    siteName: "SP Surf Coach",
    title: "SP Surf Coach — Entrenamiento de surf personalizado",
    description:
      "Entrenamiento de surf personalizado, surftrips, videoanálisis y comunidad para progresar dentro y fuera del agua.",
    images: [
      {
        url: "/photos/hero.jpg",
        width: 1200,
        height: 630,
        alt: "SP Surf Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SP Surf Coach",
    description:
      "Entrenamiento de surf personalizado, surftrips, videoanálisis y comunidad.",
    images: ["/photos/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <div className="min-h-screen bg-[var(--color-background-default)] text-[var(--color-text-default)]">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
