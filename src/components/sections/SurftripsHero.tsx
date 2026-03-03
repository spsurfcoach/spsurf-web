import Image from "next/image";

export function SurftripsHero() {
  return (
    <section className="pt-0">
      <div className="relative mx-auto w-full max-w-[1512px] overflow-hidden rounded-b-[40px] lg:rounded-b-[60px]">
        <div className="relative h-[60vh] lg:h-[505px]">
          <Image
            src="/photos/hero.jpg"
            alt="Surftrips"
            fill
            className="object-cover"
            priority
          />
          <div className="hero-overlay-gradient absolute inset-0" />
          <div className="absolute bottom-8 left-4 right-4 text-white sm:bottom-12 sm:left-8 md:left-14 lg:bottom-[126px] lg:left-[103px]">
            <h1 className="ds-h1 leading-[1.2] lg:text-[62px] lg:leading-[50px]">
              Surftrips
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
