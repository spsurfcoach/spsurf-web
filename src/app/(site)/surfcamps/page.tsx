import type { Metadata } from "next";
import { SurftripsHero } from "@/components/sections/SurftripsHero";
import { SurftripsIntroSection } from "@/components/sections/SurftripsIntroSection";
import { SurftripsVideoSection } from "@/components/sections/SurftripsVideoSection";
import { SurftripsDetailSection } from "@/components/sections/SurftripsDetailSection";
import { SurftripsCalendarSection } from "@/components/sections/SurftripsCalendarSection";
import { SurftripsForMeSection } from "@/components/sections/SurftripsForMeSection";
import { SpFamilySection } from "@/components/sections/SpFamilySection";
import { FaqsSection } from "@/components/sections/FaqsSection";
import { TestimoniosSection } from "@/components/sections/TestimoniosSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqSchema } from "@/lib/seo/json-ld";
import { surfcampsFaqs, surftripsSpFamilyPhotos, surftripsTestimonials, testimonials } from "@/lib/content";
import { getSurftrips } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Surfcamps en Perú — Chicama, Lobitos y más destinos",
  description:
    "Surfcamps en Perú con SP Surf Coach. Viajes de surf en grupo a Chicama, Lobitos y El Salvador con coaching, hospedaje y comunidad. Reserva tu lugar.",
  alternates: { canonical: "/surfcamps" },
  openGraph: {
    title: "Surfcamps en Perú — Chicama, Lobitos y más destinos",
    description:
      "Viajes de surf con SP Surf Coach: surfcamps en Chicama, Lobitos y más destinos con coaching incluido.",
    url: "/surfcamps",
  },
};

export default async function SurftripsPage() {
  const trips = await getSurftrips();

  return (
    <>
      <JsonLd data={buildFaqSchema(surfcampsFaqs)} />
      <SurftripsHero />
      <SurftripsIntroSection />
      <SurftripsVideoSection />
      <SurftripsDetailSection trips={trips} />
      <SurftripsCalendarSection trips={trips} />
      <SurftripsForMeSection />
      <TestimoniosSection items={[...testimonials, ...surftripsTestimonials]} />
      <SpFamilySection photos={surftripsSpFamilyPhotos} />
      <FaqsSection items={surfcampsFaqs} />
    </>
  );
}
