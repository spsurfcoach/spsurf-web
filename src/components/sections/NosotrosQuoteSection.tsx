import { RevealGroup } from "@/components/animations/Reveal";

export function NosotrosQuoteSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      <RevealGroup className="container-site mx-auto max-w-[900px]">
        <p className="ds-display-title leading-[1.4] text-black">
          &ldquo;El surf no es solo un deporte. Es una forma de entenderte a ti mismo, de leer el entorno y de encontrar tu propio ritmo dentro y fuera del agua.&rdquo;
        </p>
        <p className="ds-label mt-6 text-[var(--color-label-muted)] tracking-[2.73px]">
          SP SURF COACH
        </p>
      </RevealGroup>
    </section>
  );
}
