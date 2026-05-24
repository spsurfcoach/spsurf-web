import type { Metadata } from "next";
import { ServiciosHero } from "@/components/sections/ServiciosHero";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Clases de surf, videoanálisis, preparación física y mental. Entrena con el método MAP de SP Surf Coach.",
};
import { ServiciosIntroSection } from "@/components/sections/ServiciosIntroSection";
import { ServiciosDetailSection } from "@/components/sections/ServiciosDetailSection";
import { ServiciosPackagesSection } from "@/components/sections/ServiciosPackagesSection";
import { TestimoniosSection } from "@/components/sections/TestimoniosSection";
import { ComunidadSection } from "@/components/sections/ComunidadSection";
import { FaqsSection } from "@/components/sections/FaqsSection";

export default function ServiciosPage() {
  return (
    <>
      <ServiciosHero />
      <ServiciosIntroSection />
      <ServiciosDetailSection />
      <ServiciosPackagesSection />
      <TestimoniosSection />
      <ComunidadSection />
      <FaqsSection />
    </>
  );
}
