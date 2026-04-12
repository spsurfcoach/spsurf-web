import { ServiciosHero } from "@/components/sections/ServiciosHero";
import { ServiciosIntroSection } from "@/components/sections/ServiciosIntroSection";
import { ServiciosDetailSection } from "@/components/sections/ServiciosDetailSection";
import { TestimoniosSection } from "@/components/sections/TestimoniosSection";
import { ComunidadSection } from "@/components/sections/ComunidadSection";
import { FaqsSection } from "@/components/sections/FaqsSection";

export default function ServiciosPage() {
  return (
    <>
      <ServiciosHero />
      <ServiciosIntroSection />
      <ServiciosDetailSection />
      <TestimoniosSection />
      <ComunidadSection />
      <FaqsSection />
    </>
  );
}
