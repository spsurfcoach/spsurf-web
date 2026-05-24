import type { Metadata } from "next";
import { NosotrosHero } from "@/components/sections/NosotrosHero";
import { NosotrosIntroSection } from "@/components/sections/NosotrosIntroSection";
import { NosotrosCertSection } from "@/components/sections/NosotrosCertSection";
import { VisionMisionSection } from "@/components/sections/VisionMisionSection";
import { SpFamilySection } from "@/components/sections/SpFamilySection";
import { SurfTalksSection } from "@/components/sections/SurfTalksSection";
import { SurfTalksVideosPicksSection } from "@/components/sections/SurfTalksVideosPicksSection";
import { NosotrosTestimoniosVideosSection } from "@/components/sections/NosotrosTestimoniosVideosSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { surftripsSpFamilyPhotos } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sobre SP Surf Coach — Entrenadores y Metodología",
  description:
    "Conoce a SP Surf Coach, escuela de surf en Lima dirigida por Sebastián Portocarrero. Metodología basada en técnica, lectura de mar y comunidad.",
  alternates: { canonical: "/nosotros" },
  openGraph: {
    title: "Sobre SP Surf Coach — Entrenadores y Metodología",
    description:
      "SP Surf Coach: escuela de surf en Lima con metodología personalizada y comunidad activa de surfistas en Perú.",
    url: "/nosotros",
  },
};

export default function NosotrosPage() {
  return (
    <>
      <NosotrosHero />
      <NosotrosIntroSection />
      <NosotrosTestimoniosVideosSection />
      <NosotrosCertSection />
      <PartnersSection />
      <VisionMisionSection />
      <SpFamilySection photos={surftripsSpFamilyPhotos} />
      <SurfTalksSection />
      <SurfTalksVideosPicksSection />
    </>
  );
}
