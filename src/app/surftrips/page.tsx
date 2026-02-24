import { Hero } from "@/components/sections/Hero";
import { ReserveTripForm } from "@/components/sections/ReserveTripForm";
import { TripsSection } from "@/components/sections/TripsSection";

export default function SurftripsPage() {
  return (
    <>
      <Hero
        title="Surftrips"
        subtitle="Viajes enfocados en progreso real: entrenamiento, videoanalisis y comunidad en destinos de alto potencial."
      />
      <TripsSection
        title="Destinos destacados"
        description="Cada surftrip integra sesiones guiadas, feedback tecnico y objetivos claros por nivel."
      />
      <ReserveTripForm />
    </>
  );
}


