import { NosotrosHero } from "@/components/sections/NosotrosHero";
import { NosotrosIntroSection } from "@/components/sections/NosotrosIntroSection";
import { NosotrosCertSection } from "@/components/sections/NosotrosCertSection";
import { NosotrosVideoSection } from "@/components/sections/NosotrosVideoSection";
import { NosotrosQuoteSection } from "@/components/sections/NosotrosQuoteSection";
import { VisionMisionSection } from "@/components/sections/VisionMisionSection";
import { SpFamilySection } from "@/components/sections/SpFamilySection";
import { SurfTalksSection } from "@/components/sections/SurfTalksSection";
import { TestimoniosSection } from "@/components/sections/TestimoniosSection";

export default function NosotrosPage() {
  return (
    <>
      <NosotrosHero />
      <NosotrosIntroSection />
      <NosotrosCertSection />
      <NosotrosVideoSection />
      <NosotrosQuoteSection />
      <VisionMisionSection />
      <SpFamilySection />
      <SurfTalksSection />
      <TestimoniosSection />
    </>
  );
}
