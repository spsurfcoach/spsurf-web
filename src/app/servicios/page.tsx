import type { Metadata } from "next";
import { ServiciosHero } from "@/components/sections/ServiciosHero";
import { ServiciosIntroSection } from "@/components/sections/ServiciosIntroSection";
import { ServiciosDetailSection } from "@/components/sections/ServiciosDetailSection";
import { ServiciosPackagesSection } from "@/components/sections/ServiciosPackagesSection";
import { ClassCalendarSection } from "@/components/sections/ClassCalendarSection";
import { TestimoniosSection } from "@/components/sections/TestimoniosSection";
import { ComunidadSection } from "@/components/sections/ComunidadSection";
import { FaqsSection } from "@/components/sections/FaqsSection";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Clases de surf, videoanálisis, preparación física y mental. Entrena con el método MAP de SP Surf Coach.",
};

export default function ServiciosPage() {
  return (
    <>
      <ServiciosHero />
      <ServiciosIntroSection />
      <ServiciosDetailSection />
      <ServiciosPackagesSection />
      <ClassCalendarSection />
      <TestimoniosSection />
      <ComunidadSection />
      <FaqsSection />
    </>
  );
}
