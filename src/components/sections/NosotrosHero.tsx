import Image from "next/image";

export function NosotrosHero() {
  return (
    <section className="pt-0">
      <div className="relative min-h-[100svh] overflow-hidden">
        <Image src="/photos/hero.jpg" alt="Sobre SP Surf Coach" fill className="object-cover" priority />
        <div className="hero-overlay-gradient absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="px-4 pb-8 text-white sm:px-6 sm:pb-12 md:px-10 lg:px-16 lg:pb-16">
            <div className="max-w-[58rem]">
              <h1 className="ds-h1 leading-[1.15]">Sobre SP Surf Coach</h1>
              <p className="ds-body-s mt-4 max-w-[50rem] text-white/90 lg:mt-6">
                Clases personalizadas, análisis de video y acompañamiento constante para surfistas que quieren subir
                de nivel sin perder la esencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
