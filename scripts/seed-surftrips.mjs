import "dotenv/config";
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

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

const imageToMime = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

function toSanityImage(assetId) {
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: assetId,
    },
  };
}

async function uploadImage(relativePath, label) {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const extension = path.extname(absolutePath).toLowerCase();
  const contentType = imageToMime[extension] || "application/octet-stream";
  const fileBuffer = await readFile(absolutePath);
  const asset = await client.assets.upload("image", fileBuffer, {
    filename: path.basename(absolutePath),
    contentType,
    label,
  });
  return toSanityImage(asset._id);
}

async function run() {
  const heroSurfCity = await uploadImage("public/photos/el_salvador.JPG", "Surf City Hero");
  const waveSurfCity = await uploadImage("public/photos/chicama.jpg", "Surf City Wave");
  const hotelSurfCity = await uploadImage("public/photos/lobitos.jpg", "Surf City Hotel");

  const heroChicama = await uploadImage("public/photos/chicama.jpg", "Chicama Hero");
  const heroLobitos = await uploadImage("public/photos/lobitos.jpg", "Lobitos Hero");

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
      cardImage: heroSurfCity,
      heroImage: heroSurfCity,
      heroKicker: "SURFTRIP",
      heroSubtitle: "Una semana de entrenamiento, comunidad y olas constantes para elevar tu surfing.",
      waveTitle: "Olas con consistencia para progresar",
      waveBody:
        "Surf City ofrece condiciones ideales para trabajar lectura de ola, seleccion de secciones y ejecucion con confianza. Cada sesion termina con feedback tecnico para sostener mejoras reales durante todo el viaje.",
      waveImage: waveSurfCity,
      hotelTitle: "Hospedaje comodo y funcional para entrenar",
      hotelBody:
        "Nos quedamos en un espacio pensado para recuperarte bien entre sesiones: descanso, buena ubicacion y contexto perfecto para mantener el foco en tu progreso.",
      hotelImage: hotelSurfCity,
      itineraryTitle: "Como se vive este surftrip",
      itineraryBody:
        "Cada dia alterna sesiones en el agua, analisis en video y trabajo complementario fuera del mar. El objetivo es que vuelvas con mejoras visibles en tecnica, lectura y toma de decisiones.",
      primaryCtaLabel: "Reservar ahora",
      primaryCtaHref: "#reserva",
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
      cardImage: heroChicama,
      heroImage: heroChicama,
      heroKicker: "SURFTRIP",
      heroSubtitle: "Entrena en una de las olas izquierdas mas largas del mundo.",
      waveTitle: "Lineas largas para construir tecnica",
      waveBody:
        "Chicama te permite repetir patrones y ajustar detalles de posicion, timing y lectura con una continuidad dificil de encontrar en otros destinos.",
      waveImage: heroChicama,
      hotelTitle: "Base comoda para recuperarte y rendir",
      hotelBody:
        "La logistica del viaje esta pensada para priorizar descanso, alimentacion y tiempos de sesion que potencien tu evolucion dentro del agua.",
      hotelImage: heroChicama,
      itineraryTitle: "Como se vive este surftrip",
      itineraryBody:
        "Plan diario con enfoque tecnico, sesiones guiadas y video feedback para medir progreso durante toda la semana.",
      primaryCtaLabel: "Solicitar informacion",
      primaryCtaHref: "#reserva",
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
      cardImage: heroLobitos,
      heroImage: heroLobitos,
      heroKicker: "SURFTRIP",
      heroSubtitle: "Comunidad, entrenamiento y olas para seguir creciendo como surfista.",
      waveTitle: "Picos diversos para lectura y adaptacion",
      waveBody:
        "En Lobitos trabajamos decisiones rapidas y lectura de diferentes escenarios, fortaleciendo confianza y criterio en cada sesion.",
      waveImage: heroLobitos,
      hotelTitle: "Hospedaje enfocado en la experiencia",
      hotelBody:
        "Ubicacion estrategica, descanso y vida de comunidad para aprovechar cada jornada de entrenamiento.",
      hotelImage: heroLobitos,
      itineraryTitle: "Como se vive este surftrip",
      itineraryBody:
        "Sesiones tecnicas, ejercicios complementarios y feedback constante para consolidar avances de forma consistente.",
      primaryCtaLabel: "Quiero reservar",
      primaryCtaHref: "#reserva",
    },
  ];

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
