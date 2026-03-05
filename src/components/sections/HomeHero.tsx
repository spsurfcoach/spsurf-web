import Image from "next/image";

export function HomeHero() {
  return (
    <section className="pt-0">
      <div className="relative min-h-[100svh] overflow-hidden">
        <Image src="/photos/hero.jpg" alt="Hero surf" fill className="object-cover" priority />
        <div className="hero-overlay-gradient absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="px-4 pb-8 text-white sm:px-6 sm:pb-12 md:px-10 lg:px-16 lg:pb-16">
            <div className="max-w-[58rem]">
              <h1 className="ds-h1 leading-[1.15]">
                Experiencias de surf para conectar con el mar, mejorar tu surfing y disfrutar cada sesión.
              </h1>
              <div className="mt-5 md:mt-8">
                <button className="ds-btn ds-btn-lg border border-white bg-white/10 text-white hover:bg-white/20">
                  Explora nuestros Surf trips
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
