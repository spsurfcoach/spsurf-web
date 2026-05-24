export type NavItem = {
  href: string;
  label: string;
};

export type PackageItem = {
  name: string;
  price: string;
  classes: string;
  validity: string;
};

/** Paquetes de clases (tarjetas con imagen: home, checkout marketing). */
export type PackageOfferCard = {
  id: string;
  name: string;
  price: string;
  classes: string;
  validity: string;
  description: string;
  image: string;
  featured: boolean;
};

/** Membresías (bloque marketing en home CTA y página servicios). */
export type MembershipPlanItem = {
  id: string;
  duration: string;
  price: string;
  unit: string;
  featured: boolean;
  description: string;
  image: string;
  badge?: string;
};

export const packageOfferCards: PackageOfferCard[] = [
  {
    id: "starter",
    name: "Starter",
    price: "S/560",
    classes: "4 clases",
    validity: "Vigencia: 1 mes",
    description: "Ideal para volver al agua con constancia y feedback claro en cada sesión.",
    image: "/photos/servicios_paquete_starter.jpg",
    featured: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: "S/960",
    classes: "8 clases",
    validity: "Vigencia: 1 mes",
    description: "Más sesiones para consolidar técnica y lectura de olas con acompañamiento continuo.",
    image: "/photos/servicios_paquete_standard.jpg",
    featured: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "S/1,400",
    classes: "12 clases",
    validity: "Vigencia: 1 mes",
    description: "Máxima dedicación para acelerar tu progreso con plan personalizado y seguimiento cercano.",
    image: "/photos/servicios_paquete_premium.jpg",
    featured: false,
  },
];

export const membershipPlans: MembershipPlanItem[] = [
  {
    id: "3m",
    duration: "3 meses",
    price: "S/1,590",
    unit: "/ mes",
    featured: false,
    description: "Ideal para arrancar tu progreso con compromiso real.",
    image: "/photos/servicios_paquete_starter.jpg",
  },
  {
    id: "12m",
    duration: "12 meses",
    badge: "Anual",
    price: "S/1,290",
    unit: "/ mes",
    featured: true,
    description: "El mejor valor. Progreso sostenido durante todo el año.",
    image: "/photos/servicios_paquete_premium.jpg",
  },
  {
    id: "6m",
    duration: "6 meses",
    price: "S/1,450",
    unit: "/ mes",
    featured: false,
    description: "Seis meses de entrenamiento continuo y resultados visibles.",
    image: "/photos/servicios_paquete_standard.jpg",
  },
];

export const homePackages: PackageItem[] = packageOfferCards.map((p) => ({
  name: p.name,
  price: p.price.replace(/^S\//, "s/"),
  classes: p.classes,
  validity: p.validity,
}));

export type SurfTripItem = {
  name: string;
  country: string;
  level: string;
  date: string;
  description: string;
  groupSize: string;
  hospedaje: string;
  duracion: string;
  aeropuerto: string;
  image: string;
};

export type ProductItem = {
  name: string;
  price: string;
  category: string;
};

export type ServiceItem = {
  title: string;
  body: string;
};

export type BlogPostItem = {
  title: string;
  excerpt: string;
  category: string;
};

export type FooterColumn = {
  title: string;
  links: NavItem[];
};

export type SpFamilyPhotoItem = {
  src: string;
  alt: string;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/surfcamps", label: "Surfcamps" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Servicios",
    links: [
      { href: "/servicios#servicio-tab-clases", label: "Coaching de surf" },
      { href: "/servicios#servicio-tab-video", label: "Videoanálisis" },
      { href: "/servicios#servicio-tab-surfskate", label: "Preparación física" },
    ],
  },
  {
    title: "Surfcamps",
    links: [
      { href: "/surfcamps#viajes", label: "Próximos viajes" },
      { href: "/surfcamps#calendario", label: "Calendario" },
      { href: "/surfcamps#para-quien", label: "Para quién es" },
    ],
  },
  {
    title: "Comunidad",
    links: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/blog", label: "Blog" },
      { href: "/surfcamps#sp-family", label: "SP Family" },
    ],
  },
];

export const surfTrips: SurfTripItem[] = [
  {
    name: "Surf City",
    country: "El Salvador",
    level: "Intermedio",
    date: "11 - 18 de Mayo 2026",
    description:
      "Entrena dentro del agua con sesiones diseñadas según tu nivel y objetivos. En las clases individuales, trabajamos en tu técnica, lectura de olas y confianza con atención personalizada. En las clases grupales, compartes energía, aprendes observando y mejoras junto a otros surfistas que también buscan progresar.",
    groupSize: "12 personas",
    hospedaje: "Hotel Pacífico",
    duracion: "7 días",
    aeropuerto: "San Salvador (SAL)",
    image: "/photos/home1.jpg",
  },
  {
    name: "Chicama",
    country: "Perú",
    level: "Intermedio",
    date: "1 - 7 de Junio 2026",
    description:
      "Entrena dentro del agua con sesiones diseñadas según tu nivel y objetivos. En las clases individuales, trabajamos en tu técnica, lectura de olas y confianza con atención personalizada. En las clases grupales, compartes energía, aprendes observando y mejoras junto a otros surfistas que también buscan progresar.",
    groupSize: "12 - 20 personas",
    hospedaje: "Buena Vista Lobitos",
    duracion: "10 días",
    aeropuerto: "Talara (TYL)",
    image: "/photos/home2.jpg",
  },
  {
    name: "Lobitos",
    country: "Perú",
    level: "Intermedio",
    date: "15 - 20 de Enero 2026",
    description:
      "Entrena dentro del agua con sesiones diseñadas según tu nivel y objetivos. En las clases individuales, trabajamos en tu técnica, lectura de olas y confianza con atención personalizada. En las clases grupales, compartes energía, aprendes observando y mejoras junto a otros surfistas que también buscan progresar.",
    groupSize: "12 personas",
    hospedaje: "Buena Vista Lobitos",
    duracion: "10 días",
    aeropuerto: "Talara (TYL)",
    image: "/photos/hero.jpg",
  },
];

export const products: ProductItem[] = [
  { name: "Poncho", price: "S/100.00", category: "Ropa" },
  { name: "Surfskate", price: "S/100.00", category: "Equipamiento" },
  { name: "Polo", price: "S/100.00", category: "Ropa" },
  { name: "Tarjetas de entrenamiento", price: "S/100.00", category: "Accesorios" },
];

export const services: ServiceItem[] = [
  {
    title: "Coaching de surf",
    body: "Entrena dentro del agua con sesiones individuales o grupales según tu nivel y objetivos.",
  },
  {
    title: "Videotutoriales",
    body: "Analiza tu técnica con sesiones de video y feedback para corregir detalles clave.",
  },
  {
    title: "Preparación física",
    body: "Fortalece movilidad, resistencia y control corporal para rendir mejor en cada sesión.",
  },
  {
    title: "Preparación mental",
    body: "Mejora foco, confianza y toma de decisiones con herramientas mentales aplicadas al surf.",
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export type TestimonialItem = {
  quote: string;
  author: string;
  tripName?: string;
  /** Foto de fondo del slide en testimonios (home) */
  image?: string;
};

export const faqs: FaqItem[] = [
  {
    question: "¿Cómo sé en qué nivel estoy?",
    answer: `Antes de comenzar, todos los alumnos completan un perfil inicial donde recopilamos información sobre experiencia, objetivos, equipamiento, nivel de surf y relación con el mar. Esto nos permite tener una primera referencia para recomendarte el programa más adecuado para ti.

Además, si cuentas con fotos o videos surfeando, puedes enviárnoslos para conocer mejor tu surfing. En caso no tengas material audiovisual, no hay problema. También podemos orientarnos a través de una conversación por audio o mensaje para entender tu nivel y objetivos antes de tu primera sesión.`,
  },
  {
    question: "¿Debo llevar mi propia tabla o me pueden prestar una?",
    answer: `Lo ideal es que entrenes con tu propio equipo, ya que es el material que utilizas normalmente y el que mejor nos permite analizar tu surfing. Si consideramos que tu tabla o equipamiento no están siendo los más adecuados para tu nivel u objetivos, los coaches podrán asesorarte y recomendarte alternativas.

En caso necesites equipo, también podemos ayudarte con tablas y accesorios para las sesiones.`,
  },
  {
    question: "¿Cuántas personas hay por clase grupal?",
    answer: `La cantidad de alumnos puede variar según la sesión, el nivel del grupo y las condiciones del mar. Nuestro objetivo es mantener una atención real y personalizada durante el entrenamiento.

Dependiendo de la sesión, trabajamos con coaches dentro y fuera del agua, además de apoyo audiovisual para grabar las olas y realizar el videoanálisis de cada alumno sin perder detalle del entrenamiento.`,
  },
];

export const surfcampsFaqs: FaqItem[] = [
  {
    question: "¿Cómo sé si el surfcamp es para mi nivel?",
    answer: `Antes del viaje, todos los participantes completan un perfil inicial donde recopilamos información sobre experiencia, objetivos, equipamiento, nivel de surf y relación con el mar. Esto nos permite entender mejor tu surfing y asegurarnos de que el surfcamp sea adecuado para ti.

Además, si cuentas con fotos o videos surfeando, puedes enviárnoslos para tener una referencia más clara de tu nivel. En caso no tengas material audiovisual, también podemos orientarnos a través de una conversación previa para ayudarte y resolver cualquier duda antes del viaje.`,
  },
  {
    question: "¿Debo llevar mi propio equipo o me pueden prestar uno?",
    answer: `Recomendamos que viajes con tu propia tabla y wetsuit para entrenar con el equipo que ya conoces y utilizas normalmente. Esto también nos permite analizar mejor tu surfing y entender cómo responde tu material dentro del agua.

Si consideramos que tu equipamiento no es el más adecuado para tu nivel, objetivos o condiciones del viaje, los coaches podrán asesorarte y recomendarte alternativas.

En caso no cuentes con equipo, puedes avisarnos previamente y organizaremos el material que utilizarás durante el surfcamp.`,
  },
  {
    question: "¿Qué entrenamientos fuera del agua realizan?",
    answer: `Complementamos las sesiones de surf con distintos entrenamientos fuera del agua enfocados en mejorar tu rendimiento, movilidad y comprensión del surfing.

Dependiendo del viaje y la planificación del surfcamp, trabajamos movilidad, fuerza funcional, surfskate, respiración, yoga, prevención de lesiones y preparación mental aplicada al surf. Todo está pensado para ayudarte a moverte mejor, recuperarte correctamente y transferir ese trabajo directamente al agua.

La idea es que el progreso no ocurra solamente durante las sesiones de surf, sino también en todo lo que haces fuera del mar.`,
  },
];

export const testimonials: TestimonialItem[] = [
  {
    quote:
      "Ha sido increíble este surfcamp con Sebas, el grupo se ha vuelto súper unido y poder conocer sobre todo a más mujeres que corren es lo mejor, el coaching me ha servido inmensamente, creo que no podría estar corriendo hoy en día si no fuera por Sebas me ha ayudado tanto técnicamente como en lo mental y en tener la cabeza en el lugar correcto para poder entrar al agua",
    author: "Jimena",
    image: "/photos/testimony_jimena.jpg",
  },
  {
    quote:
      "Este surfcamp me ha parecido increíble, he podido conocer otras playas y el coaching que da Sebas es súper preciso, bien detallista en las cosas que puedes corregir y en verdad me sirvió mucho para surfing, todos nos volvimos bien unidos dentro y fuera del agua y lo recomiendo un montón",
    author: "Gino",
    image: "/photos/testimony_2.jpg",
  },
];

export const surftripsTestimonials: TestimonialItem[] = [
  {
    quote:
      "Fui al surfcamp de lobitos con un objetivo súper claro que era aprender a correr izquierdas y al segundo día mi primera encarrilada en una y el último día ya en una ola bastante larga y buena, me divertí un montón, todos los tips te ayudan a mejorar",
    author: "Diego",
    image: "/photos/DSC_5848.jpg",
  },
  {
    quote:
      "Este surfcamp en chicama ha significado mucha experiencia, el hecho de trabajar con Sebas me ha facilitado mucho las cosas. La verdad ha sido una gran experiencia y sobre todo por el grupo, se comparten experiencias y el aprendizaje va más allá de meterse al mar",
    author: "Jose",
    image: "/photos/DSC_8125.jpg",
  },
];

export type ServicioDetailCoach = {
  name: string;
  /** Qué enseña esta persona en este servicio (línea corta bajo el nombre). */
  role: string;
  imageSrc?: string;
};

export type ServicioDetailBenefits = {
  title: string;
  items: string[];
};

export type ServicioDetailTab = {
  id: string;
  title: string;
  paragraphs: string[];
  /** Lista opcional entre párrafos y `closingParagraphs` (p. ej. beneficios extras). */
  benefitsBullets?: ServicioDetailBenefits;
  /** Párrafos finales tras `benefitsBullets`, si aplica. */
  closingParagraphs?: string[];
  /** Instructor asociado al servicio. */
  coach?: ServicioDetailCoach;
  /** Destino del CTA «Comprar …» en /servicios. */
  comprarHref: string;
};

const SEBASTIAN_PORTRAIT = "/photos/95B6F509-89D2-41CC-8CBA-AC87E4D45ABA.JPG.jpeg";
const IVO_PORTRAIT = "/photos/DSC09031.JPG";

/** Servicios en la página /servicios: títulos seleccionables + textos cortos asociados */
export const serviciosDetailTabs: ServicioDetailTab[] = [
  {
    id: "clases",
    title: "Coaching de surf",
    paragraphs: [
      "Nuestro coaching de surf está diseñado para adaptarse a tu nivel, objetivos y momento como surfista. Buscamos que entiendas tu surfing y progreses de manera consciente dentro del agua.",
      "Cada sesión dura entre 90 y 120 minutos y se realiza según las mejores condiciones del mar para el entrenamiento. Dependiendo de la sesión, trabajamos con coaching dentro y fuera del agua para acompañar tu progreso de forma más completa.",
      "Todas las clases son grabadas para realizar videoanálisis, revisando aspectos como postura, línea, timing, velocidad y toma de decisiones, ayudándote a entender qué ajustar y cómo seguir evolucionando.",
      "Las clases pueden agendarse directamente desde la web.",
      "Aquí no solo surfeas más.",
      "Surfeas mejor.",
    ],
    coach: {
      name: "Sebastián Portocarrero",
      role: "Imparte coaching de surf",
      imageSrc: SEBASTIAN_PORTRAIT,
    },
    comprarHref: "/clases?tab=comprar",
  },
  {
    id: "video",
    title: "Videoanálisis",
    paragraphs: [
      "Este servicio está pensado para surfistas que quieren recibir feedback técnico y entender mejor su surfing, sin necesidad de asistir a una sesión presencial.",
      "Una vez realizado el pago, coordinamos una videollamada personalizada de aproximadamente una hora para analizar juntos tus clips de surfing. Durante la sesión revisamos distintos aspectos técnicos como timing, postura, línea, velocidad, selección de olas y toma de decisiones dentro de la ola.",
      "La idea es que puedas entender claramente qué estás haciendo, qué necesitas ajustar y cómo seguir evolucionando en tu surfing desde cualquier lugar.",
      "El progreso está en los detalles que normalmente no ves.",
    ],
    coach: {
      name: "Sebastián Portocarrero",
      role: "Imparte videoanálisis",
      imageSrc: SEBASTIAN_PORTRAIT,
    },
    comprarHref: "/clases?tab=comprar&product=videoanalysis",
  },
  {
    id: "surfskate",
    title: "Clases de Surfskate",
    paragraphs: [
      "Las clases de surfskate están pensadas como una herramienta de entrenamiento fuera del agua para mejorar técnica, postura, mecánica de movimiento y comprensión del surfing de manera más consciente y eficiente.",
      "Las sesiones son presenciales, tienen una duración aproximada de una hora y se coordinan directamente una vez realizado el pago. Durante la clase trabajamos distintos aspectos técnicos como generación de velocidad, compresión y extensión, postura, transferencia de peso y simulación de maniobras frontside y backside.",
      "A diferencia del surf en el agua, donde el tiempo efectivo sobre la ola es limitado, el surfskate permite entrenar movimientos de manera constante durante toda la sesión, acelerando el aprendizaje y ayudando a interiorizar patrones técnicos con mayor claridad.",
      "La idea es que puedas mejorar tu surfing no solo dentro del agua, sino también fuera de ella.",
    ],
    coach: {
      name: "Ivo Escuza",
      role: "Imparte clases de surfskate",
      imageSrc: IVO_PORTRAIT,
    },
    comprarHref: "/clases?tab=comprar&product=surfskate",
  },
  {
    id: "suscripcion",
    title: "Membresías Premium",
    paragraphs: [
      "Esta membresía premium está pensada para surfistas que quieren entrenar de manera constante, progresar más rápido y formar parte activa de la comunidad de SP Surf Coach.",
      "Las membresías premium están disponibles en planes de 3, 6 y 12 meses, permitiéndote acceder a clases ilimitadas de surf durante todo el período de tu plan. Todas las sesiones se agendan directamente desde la web, de manera flexible y organizada.",
      "El programa incluye los mismos beneficios del coaching de surf: sesiones grabadas, videoanálisis, coaching dentro y fuera del agua y entrenamientos adaptados según las condiciones del mar y los objetivos del alumno.",
    ],
    benefitsBullets: {
      title: "Beneficios extras:",
      items: [
        "Videoanálisis personalizado mensual",
        "Licra oficial personalizada",
        "Merch exclusivo de SP Surf Coach.",
      ],
    },
    closingParagraphs: [
      "Más que una membresía premium, es una forma de vivir el surfing con mayor constancia, intención y evolución.",
    ],
    coach: {
      name: "Sebastián Portocarrero",
      role: "Programa Membresías Premium",
      imageSrc: SEBASTIAN_PORTRAIT,
    },
    comprarHref: "/clases?tab=comprar",
  },
];

export const surfClassSubServices = ["Videoanálisis", "Clases de Surfskate"];

export const methodologyPillars = [
  "Técnica y lectura de ola",
  "Análisis en video de cada sesión",
  "Trabajo físico específico para surf",
  "Mentalidad y constancia para sostener progreso",
];

export const blogPosts: BlogPostItem[] = [
  {
    title: "Cómo mejorar tu take off en 4 semanas",
    excerpt: "Una rutina simple para tener más estabilidad y timing en la entrada a la ola.",
    category: "Técnica",
  },
  {
    title: "Preparación física fuera del agua",
    excerpt: "Ejercicios clave para mantener rendimiento entre sesiones.",
    category: "Entrenamiento",
  },
  {
    title: "Surfcamp checklist: qué llevar",
    excerpt: "Checklist práctico para viajar con todo listo y surfear con tranquilidad.",
    category: "Lifestyle",
  },
];

export const surftripsSpFamilyPhotos: SpFamilyPhotoItem[] = [
  { src: "/photos/DSC_5512.jpg", alt: "SP Family surfcamp" },
  { src: "/photos/surftrips/gallery_spfamily_2.jpg", alt: "SP Family Surfcamps 2" },
  { src: "/photos/DSC_4280%201.jpg", alt: "SP Family Surfcamps 3" },
  { src: "/photos/surftrips/gallery_spfamily_4.jpg", alt: "SP Family Surfcamps 4" },
  { src: "/photos/surftrips/gallery_spfamily_5.jpg", alt: "SP Family Surfcamps 5" },
  { src: "/photos/surftrips/gallery_spfamily_6.jpg", alt: "SP Family Surfcamps 6" },
];


