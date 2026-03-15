import Image from "next/image";

export function SurftripsForMeSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_456px] lg:items-start">
        <div>
          <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">
            COMO SABER SI ESTOS SURFTRIPS SON PARA MI
          </p>
          <div className="mt-6 max-w-[659px] space-y-6">
            <p className="ds-h2 tracking-[-0.04em] text-black leading-[1.53]">
              Estos SurfTrips son para ti si buscas mejorar tu surfing viviendo una experiencia única y real, con guía
              constante, un enfoque claro en tu progreso, conexionarme real con el deporte y recuerdos que duraran
              toda la vida.
            </p>
            <p className="ds-h2 tracking-[-0.04em] text-black leading-[1.53]">
              Si te motiva viajar, entrenar, compartir en comunidad y conectar con el mar, entonces si: este
              SurfTrip es para ti
            </p>
          </div>
        </div>
        <div className="relative h-[420px] overflow-hidden rounded-[24px] sm:h-[470px] lg:h-[707px] lg:rounded-[40px]">
          <Image src="/photos/home1.jpg" alt="SP Surf Coach team" fill className="object-cover" />
          <div className="absolute inset-0 rounded-[24px] bg-[rgba(0,17,22,0.28)] lg:rounded-[40px]" />
        </div>
      </div>
    </section>
  );
}
