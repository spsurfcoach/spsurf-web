import { HomeHero } from "@/components/sections/HomeHero";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { HomeVideoSection } from "@/components/sections/HomeVideoSection";
import { HomeSurftrips } from "@/components/sections/HomeSurftrips";
import { HomeSubscriptionsSection } from "@/components/sections/HomeSubscriptionsSection";
import { ComunidadSection } from "@/components/sections/ComunidadSection";
import { SurfTalksSection } from "@/components/sections/SurfTalksSection";
import { SurfTalksVideosPicksSection } from "@/components/sections/SurfTalksVideosPicksSection";
import { getSurftrips } from "@/lib/sanity";

export default async function Home() {
  const trips = await getSurftrips();

  return (
    <div className="bg-[var(--color-background-default)] text-[var(--color-text-default)]">
      <HomeHero />
      <BrandStatement />
      <HomeVideoSection />
      <HomeSubscriptionsSection />
      <HomeSurftrips trips={trips} />
      <ComunidadSection />
      <SurfTalksSection />
      <SurfTalksVideosPicksSection />
    </div>
  );
}
