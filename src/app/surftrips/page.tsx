import { SurftripsHero } from "@/components/sections/SurftripsHero";
import { SurftripsIntroSection } from "@/components/sections/SurftripsIntroSection";
import { SurftripsVideoSection } from "@/components/sections/SurftripsVideoSection";
import { SurftripsDetailSection } from "@/components/sections/SurftripsDetailSection";
import { SurftripsCalendarSection } from "@/components/sections/SurftripsCalendarSection";
import { SurftripsForMeSection } from "@/components/sections/SurftripsForMeSection";
import { SpFamilySection } from "@/components/sections/SpFamilySection";
import { FaqsSection } from "@/components/sections/FaqsSection";
import { TestimoniosSection } from "@/components/sections/TestimoniosSection";

export default function SurftripsPage() {
  return (
    <>
      <SurftripsHero />
      <SurftripsIntroSection />
      <SurftripsVideoSection />
      <SurftripsDetailSection />
      <SurftripsCalendarSection />
      <SurftripsForMeSection />
      <SpFamilySection />
      <FaqsSection />
      <TestimoniosSection />
    </>
  );
}
