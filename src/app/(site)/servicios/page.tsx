import { ServiciosHero } from "@/components/sections/ServiciosHero";
import { ServiciosIntroSection } from "@/components/sections/ServiciosIntroSection";
import { ServiciosDetailSection } from "@/components/sections/ServiciosDetailSection";
import { ServiciosMembresiasSection } from "@/components/sections/ServiciosMembresiasSection";
import { ComunidadSection } from "@/components/sections/ComunidadSection";
import { FaqsSection } from "@/components/sections/FaqsSection";

export default function ServiciosPage() {
  return (
    <>
      <ServiciosHero />
      <ServiciosIntroSection />
      <ServiciosDetailSection />
      <ServiciosMembresiasSection />
      <ComunidadSection />
      <FaqsSection />
    </>
  );
}
