import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing env values. Required: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const docs = [
  {
    _id: "surftrip-surf-city",
    _type: "surftrip",
    title: "Surf City",
    slug: { _type: "slug", current: "surf-city" },
    country: "El Salvador",
    level: "Intermedio",
    startDate: "2026-05-11",
    endDate: "2026-05-18",
    shortDescription:
      "Entrena dentro y fuera del agua con sesiones personalizadas, video analisis y una experiencia inmersiva junto a la comunidad SP.",
    groupSize: "12 personas",
    hospedaje: "Hotel Pacifico",
    duracion: "7 dias",
    aeropuerto: "San Salvador (SAL)",
    available: 8,
    capacity: 15,
    featured: true,
    contentBlocks: [
      {
        _key: "hero-surf-city",
        _type: "heroBlock",
        kicker: "SURFTRIP",
        heading: "Surf City",
        subheading:
          "Una semana de entrenamiento, comunidad y olas constantes para elevar tu surfing.",
        mediaType: "video",
        videoUrl: "/videos/0315.mp4",
        ctaLabel: "Reservar ahora",
        ctaHref: "#reserva",
      },
      {
        _key: "body-surf-city",
        _type: "richTextBlock",
        kicker: "ACERCA DE",
        heading: "Entrenamiento aplicado en destino",
        body:
          "Cada dia combinamos sesiones en el agua con feedback tecnico y video analisis. El enfoque es progresar con claridad y consistencia, sesion tras sesion.",
      },
      {
        _key: "cta-surf-city",
        _type: "ctaBlock",
        heading: "Listo para reservar tu cupo",
        body: "Escribenos para validar nivel y asegurar tu lugar en el proximo Surftrip.",
        buttonLabel: "Quiero reservar",
        buttonHref: "#reserva",
      },
    ],
  },
  {
    _id: "surftrip-chicama",
    _type: "surftrip",
    title: "Chicama",
    slug: { _type: "slug", current: "chicama" },
    country: "Peru",
    level: "Intermedio",
    startDate: "2026-06-01",
    endDate: "2026-06-07",
    shortDescription:
      "Un destino iconico para trabajar lectura de ola, lineas largas y control tecnico en condiciones de clase mundial.",
    groupSize: "12 - 20 personas",
    hospedaje: "Buena Vista Lobitos",
    duracion: "10 dias",
    aeropuerto: "Talara (TYL)",
    available: 8,
    capacity: 16,
    featured: true,
    contentBlocks: [
      {
        _key: "hero-chicama",
        _type: "heroBlock",
        kicker: "SURFTRIP",
        heading: "Chicama",
        subheading: "Entrena en una de las olas izquierdas mas largas del mundo.",
        mediaType: "image",
      },
      {
        _key: "body-chicama",
        _type: "richTextBlock",
        kicker: "METODOLOGIA",
        heading: "Progressive coaching",
        body:
          "Disenamos objetivos diarios, evaluamos video y ajustamos tecnica en funcion de cada sesion para sostener un progreso medible durante todo el viaje.",
      },
    ],
  },
  {
    _id: "surftrip-lobitos",
    _type: "surftrip",
    title: "Lobitos",
    slug: { _type: "slug", current: "lobitos" },
    country: "Peru",
    level: "Intermedio",
    startDate: "2026-01-15",
    endDate: "2026-01-20",
    shortDescription:
      "Entrenamiento tecnico enfocado en decisiones dentro del agua, adaptacion a diferentes picos y mejora consistente del rendimiento.",
    groupSize: "12 personas",
    hospedaje: "Buena Vista Lobitos",
    duracion: "10 dias",
    aeropuerto: "Talara (TYL)",
    available: 2,
    capacity: 14,
    featured: false,
    contentBlocks: [
      {
        _key: "hero-lobitos",
        _type: "heroBlock",
        kicker: "SURFTRIP",
        heading: "Lobitos",
        subheading: "Comunidad, entrenamiento y olas para seguir creciendo como surfista.",
        mediaType: "image",
      },
      {
        _key: "cta-lobitos",
        _type: "ctaBlock",
        heading: "Te sumas al proximo grupo",
        body: "Recibe informacion completa de hospedaje, cronograma y requisitos del viaje.",
        buttonLabel: "Solicitar info",
        buttonHref: "/contacto",
      },
    ],
  },
];

async function run() {
  for (const doc of docs) {
    await client.createOrReplace(doc);
    console.log(`Seeded ${doc.title}`);
  }
  console.log("Surftrip seed complete.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
