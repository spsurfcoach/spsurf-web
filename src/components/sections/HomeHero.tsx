import Image from "next/image";

export function HomeHero() {
  return (
    <section className="pt-0">
      <div className="relative mx-auto w-full max-w-[1512px] overflow-hidden rounded-b-[30px] lg:rounded-b-[60px]">
        <div className="relative h-[84vh] sm:h-[78vh] md:h-[82vh] lg:h-[92vh]">
          <Image src="/photos/hero.jpg" alt="Hero surf" fill className="object-cover" priority />
          <div className="hero-overlay-gradient absolute inset-0" />
          <div className="absolute bottom-8 left-4 right-4 text-white sm:bottom-12 sm:left-8 sm:max-w-[640px] md:left-14 md:max-w-[740px] lg:bottom-[126px] lg:left-[92px] lg:max-w-[934px]">
            <h1 className="ds-h1 max-w-[934px] leading-[1.25] lg:leading-[50px]">
              Experiencias de surf para conectar con el mar, mejorar tu surfing y disfrutar cada sesión.
            </h1>
            <button className="ds-btn ds-btn-lg mt-5 border border-white bg-white/10 text-white hover:bg-white/20 md:mt-8">
              Explora nuestros Surf trips
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
