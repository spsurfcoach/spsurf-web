import { SurftripsHero } from "@/components/sections/SurftripsHero";
import { SurftripsIntroSection } from "@/components/sections/SurftripsIntroSection";
import { SurftripsVideoSection } from "@/components/sections/SurftripsVideoSection";
import { SurftripsDetailSection } from "@/components/sections/SurftripsDetailSection";
import { SurftripsCalendarSection } from "@/components/sections/SurftripsCalendarSection";
import { SurftripsForMeSection } from "@/components/sections/SurftripsForMeSection";
import { SpFamilySection } from "@/components/sections/SpFamilySection";
import { FaqsSection } from "@/components/sections/FaqsSection";
import { TestimoniosSection } from "@/components/sections/TestimoniosSection";
import { surfcampsFaqs, surftripsSpFamilyPhotos, surftripsTestimonials, testimonials } from "@/lib/content";
import { getSurftrips } from "@/lib/sanity";

export default async function SurftripsPage() {
  const trips = await getSurftrips();

  return (
    <>
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
