"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal, RevealGroup } from "@/components/animations/Reveal";

type ServiceEntry = {
  id: string;
  title: string;
  heading: string;
  paragraphs: string[];
  testimonialName: string;
  testimonialText: string;
  image: string;
};

const SERVICES: ServiceEntry[] = [
  {
    id: "clases-surf",
    title: "Clases de surf",
    heading: "Clases de surf",
    paragraphs: [
      "Nuestras clases de surf están diseñadas para adaptarse a tu nivel, tus objetivos y tu estilo de aprendizaje. Ofrecemos clases individuales y grupales, ambas con coaching en el agua y video análisis incluido.",
      "Las clases individuales permiten un trabajo totalmente personalizado, ideal para quienes buscan progresar rápido, corregir detalles técnicos y enfocarse en objetivos específicos. Las clases grupales combinan aprendizaje, motivación y comunidad, manteniendo siempre un ratio reducido para asegurar atención real de nuestros coaches.",
      "En cada sesión grabamos tus olas y luego las analizamos en video, revisando postura, línea, velocidad y maniobras. Esto te permite entender exactamente qué estás haciendo y cómo mejorar en cada entrada al agua.",
    ],
    testimonialName: "Ivo Escuza",
    testimonialText: "Nuestras clases de surf están diseñadas para adaptarse a tu nivel, tus objetivos y tu estilo de aprendizaje. Ofrecemos clases individuales.",
    image: "/photos/servicios_1.jpg",
  },
  {
    id: "clases-surfskate",
    title: "Clases de surfskate",
    heading: "Clases de surfskate",
    paragraphs: [
      "El surfskate es la herramienta perfecta para entrenar tu surf fuera del agua. Trabajamos los mismos movimientos, timing y postura que usarás en el océano, pero en tierra firme.",
      "Nuestras sesiones de surfskate están estructuradas para reforzar el bottom turn, el top turn y la fluidez de movimiento. Ideal para los días sin olas o para acelerar tu progreso técnico.",
      "Con feedback inmediato y repeticiones controladas, el surfskate te ayuda a automatizar los patrones de movimiento que luego aplicas directamente al surf.",
    ],
    testimonialName: "Coach SP Surf",
    testimonialText: "El surfskate te permite trabajar tu técnica todos los días, sin depender de las condiciones del mar. Es una extensión natural del entrenamiento.",
    image: "/photos/servicios_1.jpg",
  },
  {
    id: "videoanalisis",
    title: "Videoanalisis",
    heading: "Videoanalisis",
    paragraphs: [
      "El video análisis es uno de los pilares de nuestra metodología. Grabamos tus olas desde tierra y desde el agua para darte una visión objetiva de tu técnica.",
      "Analizamos postura, posición de pies, movimiento de brazos, timing del take-off y lectura de ola. Cada detalle cuenta para entender qué estás haciendo bien y qué ajustar.",
      "Después de cada sesión revisamos el material contigo, comparando con referencias técnicas. Esto acelera el aprendizaje de forma exponencial porque ves exactamente lo que necesitas corregir.",
    ],
    testimonialName: "Coach SP Surf",
    testimonialText: "Ver tus propias olas en video cambia todo. Lo que creías que estabas haciendo y lo que realmente estás haciendo son dos cosas muy distintas.",
    image: "/photos/servicios_1.jpg",
  },
];

const ACCORDION_ITEMS = [
  {
    id: "validez",
    question: "¿Cuánto tiempo tengo para usar mis créditos?",
    answer: "Los créditos tienen una validez de 90 días desde la fecha de compra. Asegúrate de reservar tus clases dentro de ese período para aprovecharlos al máximo.",
  },
  {
    id: "terminos",
    question: "Términos y condiciones",
    answer: "Al adquirir cualquier paquete o membresía aceptas nuestros términos y condiciones. Los paquetes no son reembolsables una vez activados. Las clases canceladas con menos de 12 horas de anticipación no serán reembolsadas.",
  },
  {
    id: "cancelacion",
    question: "Política de cancelación y reagendamiento",
    answer: "Puedes cancelar o reagendar tu clase hasta 12 horas antes sin costo. Cancelaciones fuera de este plazo consumen el crédito. Las membresías pueden pausarse una vez al mes por un máximo de 7 días.",
  },
];

function AccordionItem({ item }: { item: typeof ACCORDION_ITEMS[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/10 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="ds-body-s font-semibold text-black">{item.question}</span>
        <span
          className={[
            "ml-4 shrink-0 text-xl font-light text-black/40 transition-transform duration-200",
            open ? "rotate-45" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && (
        <p className="pb-4 ds-body-s leading-[1.7] text-black/60">{item.answer}</p>
      )}
    </div>
  );
}

export function ServiciosDetailSection() {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const active = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0];

  return (
    <section id="clases" className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      <div className="container-site">
        <RevealGroup className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: clickable service titles */}
          <div>
            <ul className="space-y-[24px]">
              {SERVICES.map((service) => {
                const isActive = service.id === activeId;
                return (
                  <li key={service.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(service.id)}
                      className={[
                        "ds-h2 text-left transition-colors duration-200",
                        isActive ? "text-black" : "text-zinc-300 hover:text-zinc-500",
                      ].join(" ")}
                    >
                      {service.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: content that changes based on active service */}
          <div key={active.id}>
            {active.paragraphs.map((para, i) => (
              <p
                key={i}
                className={["ds-body-s leading-[1.8] text-black/90", i > 0 ? "mt-6" : ""].join(" ")}
              >
                {para}
              </p>
            ))}

            {/* Testimonial card */}
            <div className="mt-10 flex items-start gap-4">
              <div className="relative size-[60px] shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/photos/servicios_1.jpg"
                  alt={active.testimonialName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="ds-body-s font-semibold text-black">{active.testimonialName}</p>
                <p className="ds-body-s mt-1 leading-[1.7] text-black/70">{active.testimonialText}</p>
              </div>
            </div>

            {/* Accordion: package terms */}
            <div className="mt-10 rounded-[18px] bg-white px-6 py-2">
              {ACCORDION_ITEMS.map((item) => (
                <AccordionItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </RevealGroup>

        {/* Full-width photo card below */}
        <Reveal className="mt-12">
          <div className="relative h-[240px] w-full overflow-hidden rounded-[40px] border-2 border-white sm:h-[280px] lg:h-[335px]">
            <Image
              src={active.image}
              alt={active.title}
              fill
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
