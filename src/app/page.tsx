import { HomeHero } from "@/components/sections/HomeHero";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { HomeSurftrips } from "@/components/sections/HomeSurftrips";
import { DestinosSection } from "@/components/sections/DestinosSection";
import { HomeServicios } from "@/components/sections/HomeServicios";
import { ComunidadSection } from "@/components/sections/ComunidadSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { HomeShop } from "@/components/sections/HomeShop";
import { SurfTalksSection } from "@/components/sections/SurfTalksSection";

export default function Home() {
  return (
    <div className="bg-[var(--color-background-default)] text-[var(--color-text-default)]">
      <HomeHero />
      <BrandStatement />
      <HomeSurftrips />
      <DestinosSection />
      <HomeServicios />
      <ComunidadSection />
      <PartnersSection />
      <HomeShop />
      <SurfTalksSection />
    </div>
  );
}
