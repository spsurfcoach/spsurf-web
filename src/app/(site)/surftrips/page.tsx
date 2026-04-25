import { SurftripsHero } from "@/components/sections/SurftripsHero";
import { SurftripsIntroSection } from "@/components/sections/SurftripsIntroSection";
import { SurftripsVideoSection } from "@/components/sections/SurftripsVideoSection";
import { SurftripsDetailSection } from "@/components/sections/SurftripsDetailSection";
import { SurftripsCalendarSection } from "@/components/sections/SurftripsCalendarSection";
import { SurftripsForMeSection } from "@/components/sections/SurftripsForMeSection";
import { SpFamilySection } from "@/components/sections/SpFamilySection";
import { FaqsSection } from "@/components/sections/FaqsSection";
import { TestimoniosSection } from "@/components/sections/TestimoniosSection";
import { surftripsSpFamilyPhotos, surftripsTestimonials, type FaqItem } from "@/lib/content";
import { getSurftrips } from "@/lib/sanity";

const surftripsFaqs: FaqItem[] = [
  {
    question: "¿Como se en que nivel estoy?",
    answer:
      "Si puedes remar con autonomía, tomar olas de forma constante y mantener control en la ola, ya estás listo para un surftrip. De todas formas, antes de confirmar tu cupo conversamos contigo para entender tu experiencia, tus objetivos y asegurarnos de que el viaje sea el indicado para ti. Nuestro enfoque es que todos los participantes puedan entrenar, disfrutar y progresar en un entorno seguro y alineado a su nivel.",
  },
  {
    question: "¿Tengo que llevar mi propio equipo o me lo pueden prestar?",
    answer:
      "Recomendamos traer tu propia tabla y wetsuit para entrenar con el equipo que ya conoces. En caso no cuentes con estos, nos puedes avisar y organizaremos los equipos que usaras durante el trip.",
  },
  {
    question: "¿Que entrenamientos fuera del agua realizan?",
    answer:
      "Complementamos las sesiones de surf con entrenamientos fuera del agua enfocados en movilidad, fuerza funcional y prevención de lesiones. También trabajamos respiración, mindset y preparación mental aplicada al surf. Todo está pensado para que rindas mejor en el mar, te recuperes bien y sostengas el progreso durante el surftrip.",
  },
];

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
      <TestimoniosSection items={surftripsTestimonials} />
      <SpFamilySection photos={surftripsSpFamilyPhotos} />
      <FaqsSection items={surftripsFaqs} />
    </>
  );
}
