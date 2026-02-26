import Image from "next/image";

export function ServiciosHero() {
  return (
    <section className="pt-0">
      <div className="relative mx-auto w-full max-w-[1512px] overflow-hidden rounded-b-[40px] lg:rounded-b-[60px]">
        <div className="relative h-[60vh] lg:h-[505px]">
          <Image
            src="/photos/hero.jpg"
            alt="Servicios de surf"
            fill
            className="object-cover"
            priority
          />
          <div className="hero-overlay-gradient absolute inset-0" />
          <div className="absolute bottom-8 left-4 right-4 text-white sm:bottom-12 sm:left-8 md:left-14 lg:bottom-[126px] lg:left-[103px] lg:max-w-[934px]">
            <h1 className="ds-h1 max-w-[934px] leading-[1.2] lg:text-[42px] lg:leading-[50px]">
              Servicios adicionales
            </h1>
            <p className="ds-body-s mt-4 max-w-[776px] text-white/90 lg:mt-6">
              Clases personalizadas, análisis de video y acompañamiento constante para surfistas que quieren subir de nivel sin perder la esencia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
