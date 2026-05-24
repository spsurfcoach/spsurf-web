import type { Metadata } from "next";
import { ServiciosHero } from "@/components/sections/ServiciosHero";
import { ServiciosIntroSection } from "@/components/sections/ServiciosIntroSection";
import { ServiciosDetailSection } from "@/components/sections/ServiciosDetailSection";
import { ServiciosMembresiasSection } from "@/components/sections/ServiciosMembresiasSection";
import { ComunidadSection } from "@/components/sections/ComunidadSection";
import { FaqsSection } from "@/components/sections/FaqsSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo/json-ld";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Clases de Surf, Videoanálisis y Membresías en Lima",
  description:
    "Coaching de surf personalizado en Lima: clases individuales, videoanálisis, surfskate y membresías premium. Progresa en las playas de Lima y Sur Chico.",
  alternates: { canonical: "/servicios" },
  openGraph: {
    title: "Clases de Surf, Videoanálisis y Membresías — SP Surf Coach Lima",
    description:
      "Coaching de surf personalizado en Lima: clases, videoanálisis, surfskate y membresías premium.",
    url: "/servicios",
  },
};

export default function ServiciosPage() {
  return (
    <>
      <JsonLd data={buildFaqSchema(faqs)} />
      <ServiciosHero />
      <ServiciosIntroSection />
      <ServiciosDetailSection />
      <ServiciosMembresiasSection />
      <ComunidadSection />
      <FaqsSection />
    </>
  );
}
