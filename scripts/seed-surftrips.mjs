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
  const chicamaPoster = await uploadImage("public/photos/chicama.jpg", "Chicama Video Poster");
  const chicamaDayImage = await uploadImage("public/photos/home2.jpg", "Chicama Day Section");
  const chicamaWaveAlt = await uploadImage("public/photos/home2.jpg", "Chicama Wave Alt");
  const chicamaHotelRoom = await uploadImage("public/photos/home1.jpg", "Chicama Hotel Room");
  const chicamaHotelTerrace = await uploadImage("public/photos/nosotros_mision.jpg", "Chicama Hotel Terrace");
  const chicamaYoga = await uploadImage("public/photos/nosotros_vision.jpg", "Chicama Yoga");
  const chicamaVideoAnalysis = await uploadImage("public/photos/home_serviciossection.jpg", "Chicama Video Analysis");
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
      heroTitleSuffix: "x Miguel Tudela",
      heroLongDescription:
        "En la costa norte del Peru se encuentra una de las joyas mas legendarias del surf mundial: Chicama. Famosa por ser la izquierda mas larga del planeta, este destino ofrece rides interminables, secciones suaves para fluir y paredes perfectas para trabajar tecnica, estilo y control.\n\nNuestro surftrip a Chicama esta pensado para quienes quieren surfear sin prisa, conectar con el ritmo del oceano y disfrutar cada ola al maximo. Aqui no se trata de correr: se trata de deslizarte durante minutos, leer la pared, afinar tus maniobras y dejar que la ola te lleve.\n\nAdemas del surf, Chicama ofrece una experiencia unica: pueblo tranquilo, gastronomia marina, atardeceres dorados y una atmosfera que invita a bajar revoluciones y vivir el mar de verdad.",
      heroLocationLabel: "Peru",
      groupSizeLabel: "15 personas",
      videoSection: {
        _type: "surftripVideoSection",
        title: "Video del surftrip",
        videoUrl: "/videos/0315.mp4",
        videoPoster: chicamaPoster,
      },
      dayInTripSection: {
        _type: "surftripDaySection",
        title: "Un dia en Chicama",
        scheduleItems: [
          { _type: "surftripScheduleItem", time: "7:00 am", label: "Desayuno grupal" },
          { _type: "surftripScheduleItem", time: "8:00 am", label: "Primera sesion de surf" },
          { _type: "surftripScheduleItem", time: "12:00 pm", label: "Almuerzo y descanso en el hotel" },
          { _type: "surftripScheduleItem", time: "3:30 pm", label: "Segunda sesion de surf segun marea y viento" },
          { _type: "surftripScheduleItem", time: "7:30 pm", label: "Cena y relax" },
        ],
        bodyLinkLabel: "Quieres saber como es un dia en Chicama? Haz click aqui",
        bodyLinkHref: "#reserva",
        image: chicamaDayImage,
      },
      waveTitle: "Lineas largas para construir tecnica",
      waveBody:
        "Chicama te permite repetir patrones y ajustar detalles de posicion, timing y lectura con una continuidad dificil de encontrar en otros destinos.",
      waveImage: heroChicama,
      waveSection: {
        _type: "surftripFeatureSection",
        eyebrow: "SOBRE LA OLA",
        icon: "🌊",
        title: "Sobre la ola",
        body:
          "Chicama es conocida mundialmente por tener la izquierda mas larga del planeta. Dependiendo de la marea y el swell, la ola puede romper en distintas secciones: desde picos mas rapidos y potentes en el point, hasta paredes largas y suaves ideales para fluir y trabajar maniobras.\n\nLa ola corre a lo largo de la bahia, permitiendo rides de mas de un minuto en buenas condiciones. Es una ola perfecta para surfistas intermedios que quieren mejorar lectura de ola, velocidad y estilo, y tambien para avanzados que buscan secciones para maniobras mas tecnicas.\n\nAqui no se trata de cantidad, sino de calidad: pocas olas, pero memorables.",
        theme: "light",
        image: chicamaWaveAlt,
      },
      hotelTitle: "Base comoda para recuperarte y rendir",
      hotelBody:
        "La logistica del viaje esta pensada para priorizar descanso, alimentacion y tiempos de sesion que potencien tu evolucion dentro del agua.",
      hotelImage: heroChicama,
      hotelSection: {
        _type: "surftripFeatureSection",
        eyebrow: "EL HOTEL",
        icon: "🛏️",
        title: "El Hotel",
        body:
          "Hotel Chicama es un lodge frente al mar disenado para surfistas que quieren comodidad, comunidad y acceso directo al point.\n\nDespierta con la vista de la bahia, entra al agua cuando la ola esta perfecta y vuelve caminando a descansar entre sesiones. Aqui el tiempo gira alrededor del surf, la buena comida y el oceano.",
        theme: "light",
        gallery: [chicamaHotelRoom, chicamaHotelTerrace],
        bullets: [
          "Hotel frente al point de Chicama",
          "Habitaciones para 1, 2 o 3 huespedes",
          "Restaurante con vista al mar",
          "Terrazas para ver las olas y el atardecer",
          "Espacios comunes para relajarse y compartir",
          "Wifi y areas de descanso",
          "Acceso directo a la playa y a la ola",
        ],
      },
      itineraryTitle: "Como se vive este surftrip",
      itineraryBody:
        "Plan diario con enfoque tecnico, sesiones guiadas y video feedback para medir progreso durante toda la semana.",
      experienceSections: [
        {
          _type: "surftripFeatureSection",
          eyebrow: "EXPERIENCIAS",
          icon: "🧘",
          title: "Yoga restaurativo",
          body:
            "Durante el viaje incluimos sesiones de yoga restaurativo para soltar el cuerpo, recuperar energia y mantener movilidad entre sesiones.\n\nEs un espacio para bajar revoluciones, soltar tension y volver al agua con mas ligereza y enfoque.",
          theme: "light",
          image: chicamaYoga,
        },
        {
          _type: "surftripFeatureSection",
          eyebrow: "EXPERIENCIAS",
          icon: "🎥",
          title: "Videoanalisis",
          body:
            "Cada dia grabamos tus sesiones para revisar tus mejores olas en video. Analizamos postura, linea, velocidad y maniobras para que entiendas exactamente que esta pasando en cada parte de la ola.",
          theme: "dark",
          image: chicamaVideoAnalysis,
          bullets: [
            "Grabacion diaria de tus sesiones de surf",
            "Revision de tus mejores olas en video",
            "Analisis de postura, linea, velocidad y maniobras",
            "Feedback personalizado de nuestros coaches",
            "Objetivos claros para aplicar en la siguiente sesion",
            "Seguimiento de tu progreso durante todo el trip",
          ],
        },
      ],
      packageSection: {
        _type: "surftripPackageSection",
        title: "Paquete",
        subtitle: "Surftrip de 7 dias en Chicama",
        priceLabel: "USD$1000",
        priceSuffix: "Precio por persona",
        depositNote: "*20% de adelanto para asegurar tu cupo",
        columns: [
          {
            _type: "surftripPackageColumn",
            title: "Surf",
            items: [
              "2 sesiones de surf guiadas por dia",
              "Coaching en el agua con ratio reducido coach / surfista",
              "Video analisis diario de tus sesiones",
              "Grabacion de todas tus olas",
              "Feedback tecnico personalizado",
              "Plan de mejora individual durante el trip",
            ],
          },
          {
            _type: "surftripPackageColumn",
            title: "Alojamiento",
            items: [
              "Alojamiento en Hotel Chicama frente al point",
              "Habitaciones para 1, 2 o 3 personas",
              "Camas comodas y espacios disenados para surfistas",
              "Limpieza diaria",
              "Restaurante dentro del hotel",
              "Terrazas con vista directa a la ola",
            ],
          },
          {
            _type: "surftripPackageColumn",
            title: "Lifestyle",
            items: [
              "Desayuno diario incluido",
              "Almuerzo y cena en el hotel",
              "Snacks post-surf",
              "Agua, cafe y te durante el dia",
              "Atardeceres y relax frente al mar",
              "Tiempo libre para descansar, caminar y disfrutar del pueblo",
            ],
          },
        ],
        addons: [
          {
            _type: "surftripPackageAddon",
            label: "Acompanante no surfista - Este paquete incluye alojamiento, desayunos, transporte y actividades.",
            priceLabel: "+USD$200",
          },
          {
            _type: "surftripPackageAddon",
            label: "Habitacion privada",
            priceLabel: "+USD$400",
          },
        ],
        ctaLabel: "Reservar ahora",
        ctaHref: "#reserva",
      },
      additionalInfoSection: {
        _type: "surftripAdditionalInfoSection",
        title: "Informacion Adicional",
        items: [
          "El monto restante debe cancelarse un mes antes del inicio del viaje.",
          "You are welcome to swap your surfboards as you progress. We have a wide variety of boards available.",
          "Prices are in US dollars and are per person.",
          "All taxes are included.",
          "Travel insurance is mandatory and not included in the package.",
          "Your passport must be valid for at least six months beyond your date of entry.",
          "Plane tickets are not included.",
          "Airport transfers to and from Trujillo are included when you land on the planned travel dates of the trip.",
        ],
      },
      faqItems: [
        {
          _type: "surftripFaqItem",
          question: "¿Debo llevar mi propia tabla o me pueden prestar una?",
          answer:
            "Si ya tienes una tabla con la que te sientes comodo, te recomendamos traerla. De todas formas, podemos ayudarte a conseguir equipo segun tu nivel y el objetivo del viaje.",
        },
        {
          _type: "surftripFaqItem",
          question: "¿El surftrip es solo para surfistas avanzados?",
          answer:
            "No. Chicama funciona muy bien para surfistas intermedios que quieren mejorar lectura de ola, estilo y control, siempre que tengan autonomia basica en el agua.",
        },
        {
          _type: "surftripFaqItem",
          question: "¿Que pasa si quiero viajar con alguien que no surfea?",
          answer:
            "Puedes sumar un acompanante no surfista. En el paquete de add-ons veras la opcion correspondiente para incluir alojamiento y experiencia completa.",
        },
      ],
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
