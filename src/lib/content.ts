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
  { href: "/surftrips", label: "Surfcamps" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Servicios",
    links: [
      { href: "/servicios", label: "Coaching de surf" },
      { href: "/servicios", label: "Videoanalisis" },
      { href: "/servicios", label: "Preparacion fisica" },
    ],
  },
  {
    title: "Surfcamps",
    links: [
      { href: "/surftrips", label: "Proximos viajes" },
      { href: "/surftrips", label: "Calendario" },
      { href: "/surftrips", label: "Para quien es" },
    ],
  },
  {
    title: "Comunidad",
    links: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/blog", label: "Blog" },
      { href: "/", label: "SP Family" },
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
    body: "Entrena dentro del agua con sesiones individuales o grupales segun tu nivel y objetivos.",
  },
  {
    title: "Videotutoriales",
    body: "Analiza tu tecnica con sesiones de video y feedback para corregir detalles clave.",
  },
  {
    title: "Preparacion fisica",
    body: "Fortalece movilidad, resistencia y control corporal para rendir mejor en cada sesion.",
  },
  {
    title: "Preparacion mental",
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
    question: "¿Como se en que nivel estoy?",
    answer: "Antes de tu primera clase, nuestros coaches te hacen una evaluación inicial en el agua para conocer tu nivel real. Así diseñamos el plan que mejor se adapta a ti.",
  },
  {
    question: "¿Debo llevar mi propia tabla o me pueden prestar una?",
    answer: "Puedes traer tu propia tabla o usar una de las nuestras. Contamos con material para todos los niveles. Solo avísanos con anticipación para tenerla lista.",
  },
  {
    question: "¿Cuántas personas hay por clase grupal?",
    answer: "Mantenemos un ratio reducido de máximo 4 alumnos por coach para garantizar atención real y progreso efectivo en cada sesión.",
  },
];

export const testimonials: TestimonialItem[] = [
  {
    quote:
      "Ha sido increíble este surfcamp con Sebas, el grupo se ha vuelto super unido y poder conocer sobre todo a mas mujeres que corren es lo mejor, el coaching me ha servido inmensamente, creo que no podría estar corriendo hoy en día si no fuera por Sebas me ha ayudado tanto técnicamente como en lo mental y en tener la cabeza en el lugar correcto para poder entrar al agua",
    author: "Jimena",
    image: "/photos/testimony_jimena.jpg",
  },
  {
    quote:
      "Este surfcamp me ha parecido increíble, he podido conocer otras playas y el coaching que da Sebas es super preciso, bien detallista en las cosas que puedes corregir y en verdad me sirvió mucho para surfing, todos nos volvimos bien unidos dentro y fuera del agua y lo recomiendo un montón",
    author: "Gino",
    image: "/photos/testimony_2.jpg",
  },
];

export const surftripsTestimonials: TestimonialItem[] = [
  {
    quote:
      "Fui al surfcamp de lobitos con un objetivo super claro que era aprender a correr izquierdas y al segundo día mi primera encarrilada en una y el ultimo día ya en una ola bastante larga y buena, me divertí un montón, todos los tips te ayudan a mejorar",
    author: "Diego",
    image: "/photos/DSC_5848.jpg",
  },
  {
    quote:
      "Este surfcamp en chicama ha significado mucha experiencia, el hecho de trabajar con Sebas me ha facilitado mucho las cosas. La verdad ha sido una gran experiencia y sobre todo por el grupo, se comparten experiencias y el aprendizaje va mas allá de meterse al mar",
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

export type ServicioDetailTab = {
  id: string;
  title: string;
  paragraphs: string[];
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
      "Nuestro coaching de surf está pensado para adaptarse a tu nivel, tus objetivos y tu momento como surfista. Trabajamos tanto en formato individual como grupal, siempre con coaching en el agua y video análisis incluido.",
      "Las clases individuales permiten un trabajo totalmente personalizado, ideal para corregir detalles técnicos, acelerar el progreso y enfocarse en objetivos concretos.",
      "Las clases grupales combinan aprendizaje y motivación en un entorno de comunidad, manteniendo grupos reducidos para asegurar atención real.",
      "En cada sesión grabamos tus olas y las analizamos, revisando postura, línea, timing, velocidad y toma de decisiones. La idea es que entiendas claramente qué estás haciendo y qué ajustar para mejorar.",
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
      "Este servicio está pensado para surfistas que quieren recibir feedback técnico sin necesidad de estar presentes en una sesión de coaching.",
      "Envía tus clips de surfing y realizaremos un análisis detallado de cada ola, evaluando aspectos como posicionamiento en la ola, timing, selección de maniobras, línea de surfing y uso del cuerpo. A partir de este análisis se entrega un feedback claro con correcciones específicas y recomendaciones técnicas para mejorar el rendimiento en el agua.",
      "Este proceso permite identificar errores que muchas veces pasan desapercibidos durante la sesión y enfocar el entrenamiento de manera más consciente y eficiente.",
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
      "El surfskate se utiliza como herramienta de entrenamiento fuera del agua para trabajar técnica, postura y mecánica de movimientos que utilizas en tu surfing.",
      "Practicamos giros, compresión y extensión, transferencia de peso y generación de velocidad, replicando las sensaciones del surfing en la ola.",
      "Esto permite interiorizar patrones de movimiento correctos y mejorar el control y fluidez cuando vuelves al agua.",
    ],
    coach: {
      name: "Ivo Escuza",
      role: "Imparte clases de surfskate",
      imageSrc: IVO_PORTRAIT,
    },
    comprarHref: "/clases?tab=comprar&product=surfskate",
  },
];

export const surfClassSubServices = ["Videoanalisis", "Clases de Surfskate"];

export const methodologyPillars = [
  "Tecnica y lectura de ola",
  "Analisis en video de cada sesion",
  "Trabajo fisico especifico para surf",
  "Mentalidad y constancia para sostener progreso",
];

export const blogPosts: BlogPostItem[] = [
  {
    title: "Como mejorar tu take off en 4 semanas",
    excerpt: "Una rutina simple para tener mas estabilidad y timing en la entrada a la ola.",
    category: "Tecnica",
  },
  {
    title: "Preparacion fisica fuera del agua",
    excerpt: "Ejercicios clave para mantener rendimiento entre sesiones.",
    category: "Entrenamiento",
  },
  {
    title: "Surfcamp checklist: que llevar",
    excerpt: "Checklist practico para viajar con todo listo y surfear con tranquilidad.",
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


