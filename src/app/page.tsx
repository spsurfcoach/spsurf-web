import { HomeHero } from "@/components/sections/HomeHero";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { HomeVideoSection } from "@/components/sections/HomeVideoSection";
import { HomeSurftrips } from "@/components/sections/HomeSurftrips";
import { DestinosSection } from "@/components/sections/DestinosSection";
import { HomeServicios } from "@/components/sections/HomeServicios";
import { ComunidadSection } from "@/components/sections/ComunidadSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { SurfTalksSection } from "@/components/sections/SurfTalksSection";
import { getSurftrips } from "@/lib/sanity";

export default async function Home() {
  const trips = await getSurftrips();

  return (
    <div className="bg-[var(--color-background-default)] text-[var(--color-text-default)]">
      <HomeHero />
      <BrandStatement />
      <HomeVideoSection />
      <HomeSurftrips trips={trips} />
      <DestinosSection trips={trips} />
      <HomeServicios />
      <ComunidadSection />
      <PartnersSection />
      <SurfTalksSection />
    </div>
  );
}
