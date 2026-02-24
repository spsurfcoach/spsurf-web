import Image from "next/image";

export function HomeServicios() {
  return (
    <section className="relative overflow-hidden py-14 md:py-16">
      {/* Decorative ellipse */}
      <div className="deco-ellipse -left-[230px] -top-[7px] h-[588px] w-[588px] bg-[radial-gradient(circle,rgba(24,212,213,0.15),transparent)] hidden lg:block" />

      <div className="relative grid gap-10 px-4 sm:px-6 md:px-10 lg:grid-cols-2 lg:gap-12 lg:px-16">
        <div>
          <p className="ds-label text-[var(--color-label-muted)]">SERVICIOS</p>
          <h2 className="ds-h1 mt-4 max-w-[540px] leading-[1.5] tracking-[-0.04em] lg:leading-[60px]">
            Entrena dentro del agua en sesiones diseñadas según tu nivel y objetivos. En las clases individuales, trabajamos en tu técnica, lectura de olas y confianza con atención personalizada.
          </h2>
          <button className="ds-btn ds-btn-primary ds-btn-lg mt-8">Conoce más de nuestros servicios</button>
        </div>

        {/* Stacked service cards */}
        <div className="relative mx-auto h-[380px] w-full max-w-[540px] sm:h-[480px] lg:h-[520px]">
          {/* Back card — Clases de surfskate (opacity 40) */}
          <div className="absolute left-2 top-0 w-[92%] opacity-40 sm:left-4">
            <div className="overflow-hidden rounded-[20px] border-4 border-white">
              <div className="relative h-48 sm:h-[256px]">
                <Image src="/photos/home1.jpg" alt="Clases de surfskate" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-35% to-[rgba(7,82,98,0.44)] to-70%" />
                <p className="absolute bottom-4 left-6 text-[26px] font-bold text-white">Clases de surfskate</p>
              </div>
            </div>
          </div>

          {/* Front card — Clases de surf (full opacity, rotated) */}
          <div className="absolute left-4 top-[115px] w-[92%] rotate-[2.54deg] sm:left-6 sm:top-[130px]">
            <div className="overflow-hidden rounded-[20px] border-4 border-white shadow-xl">
              <div className="relative h-48 sm:h-[256px]">
                <Image src="/photos/home2.jpg" alt="Clases de surf" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-12% to-[rgba(7,82,98,0.44)] to-88%" />
                <p className="absolute bottom-4 left-7 text-[32px] font-bold text-white">Clases de surf</p>
              </div>
            </div>
          </div>

          {/* Bottom card — Talleres de apnea (opacity 40, rotated) */}
          <div className="absolute bottom-0 left-0 w-[92%] -rotate-3 opacity-40 sm:left-1">
            <div className="overflow-hidden rounded-[20px] border-4 border-white">
              <div className="relative h-44 sm:h-[256px]">
                <Image src="/photos/hero.jpg" alt="Talleres de apnea" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-35% to-[rgba(7,82,98,0.44)] to-70%" />
                <p className="absolute bottom-4 left-7 text-[32px] font-bold text-white">Talleres de apnea</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
