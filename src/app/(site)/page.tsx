import type { Metadata } from "next";
import { HomeHero } from "@/components/sections/HomeHero";
import { HomeTrustBar } from "@/components/sections/HomeTrustBar";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { HomeVideoSection } from "@/components/sections/HomeVideoSection";
import { HomeSurftrips } from "@/components/sections/HomeSurftrips";
import { HomeSubscriptionsSection } from "@/components/sections/HomeSubscriptionsSection";
import { ComunidadSection } from "@/components/sections/ComunidadSection";
import { SurfTalksSection } from "@/components/sections/SurfTalksSection";
import { SurfTalksVideosPicksSection } from "@/components/sections/SurfTalksVideosPicksSection";
import { getSurftrips } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Clases de Surf y Surfcamps en Lima, Perú",
  description:
    "SP Surf Coach — escuela de surf en Lima con clases personalizadas, videoanálisis, surfskate y surfcamps en Chicama y Lobitos. Reserva online.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SP Surf Coach — Clases de Surf y Surfcamps en Lima, Perú",
    description:
      "Escuela de surf en Lima, Perú. Clases personalizadas, paquetes, membresías y surfcamps. Reserva online.",
    url: "/",
  },
};

export default async function Home() {
  const trips = await getSurftrips();

  return (
    <div className="bg-[var(--color-background-default)] text-[var(--color-text-default)]">
      <HomeHero />
      <BrandStatement />
      <HomeVideoSection />
      <HomeSubscriptionsSection />
      <HomeTrustBar />
      <HomeSurftrips trips={trips} />
      <ComunidadSection />
      <SurfTalksSection />
      <SurfTalksVideosPicksSection />
    </div>
  );
}
