import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo/json-ld";
import { siteConfig } from "@/lib/seo/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: "%s | SP Surf Coach",
  },
  description: siteConfig.defaultDescription,
  keywords: [
    "clases de surf Lima",
    "escuela de surf Lima",
    "surfcamp Perú",
    "aprender surf Lima",
    "surf coach Lima",
    "SP Surf Coach",
    "paquetes de surf",
    "surfcamp Chicama",
    "surfcamp Lobitos",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "SP Surf Coach — Clases de Surf y Surfcamps en Lima, Perú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [{ url: "/photos/logosp%20-%20copia.png", type: "image/png" }],
    apple: [{ url: "/photos/logosp%20-%20copia.png", type: "image/png" }],
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
        <JsonLd data={[buildOrganizationSchema(), buildWebSiteSchema()]} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
