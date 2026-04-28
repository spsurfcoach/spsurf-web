import { NosotrosHero } from "@/components/sections/NosotrosHero";
import { NosotrosIntroSection } from "@/components/sections/NosotrosIntroSection";
import { NosotrosCertSection } from "@/components/sections/NosotrosCertSection";
import { NosotrosQuoteSection } from "@/components/sections/NosotrosQuoteSection";
import { VisionMisionSection } from "@/components/sections/VisionMisionSection";
import { SpFamilySection } from "@/components/sections/SpFamilySection";
import { SurfTalksSection } from "@/components/sections/SurfTalksSection";
import { SurfTalksVideosPicksSection } from "@/components/sections/SurfTalksVideosPicksSection";
import { NosotrosTestimoniosVideosSection } from "@/components/sections/NosotrosTestimoniosVideosSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { surftripsSpFamilyPhotos } from "@/lib/content";

export default function NosotrosPage() {
  return (
    <>
      <NosotrosHero />
      <NosotrosIntroSection />
      <NosotrosCertSection />
      <NosotrosQuoteSection />
      <NosotrosTestimoniosVideosSection />
      <PartnersSection />
      <VisionMisionSection />
      <SpFamilySection photos={surftripsSpFamilyPhotos} />
      <SurfTalksSection />
      <SurfTalksVideosPicksSection />
    </>
  );
}
