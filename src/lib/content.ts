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
  { href: "/surftrips", label: "Surftrips" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Servicios",
    links: [
      { href: "/servicios", label: "Clases de Surf" },
      { href: "/servicios", label: "Videoanalisis" },
      { href: "/servicios", label: "Preparacion fisica" },
    ],
  },
  {
    title: "Surftrips",
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

export const homePackages: PackageItem[] = [
  { name: "Starter",  price: "s/560",  classes: "4 clases",  validity: "Vigencia: 1 mes" },
  { name: "Standard", price: "s/960",  classes: "8 clases",  validity: "Vigencia: 1 mes" },
  { name: "Premium",  price: "s/1400", classes: "10 clases", validity: "Vigencia: 1 mes" },
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
    title: "Clases de surf",
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
    quote: "My surfing was pushed to another level and I gained every single day on and off the water in lessons with local surf instructors, through video one-on-one analysis and group theory.",
    author: "Jane Doe",
    tripName: "Surftrip Chicama 2024",
  },
  {
    quote: "My surfing was pushed to another level and I gained every single day on and off the water in lessons with local surf instructors, through video one-on-one analysis and group theory.",
    author: "Jane Doe",
    tripName: "Surftrip Chicama 2024",
  },
];

export const surfClassSubServices = [
  "Videoanalisis",
  "Clases de Surfskate",
  "Talleres de Yoga Restaurativo",
  "Talleres de respiración & meditación",
];

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
    title: "Surftrip checklist: que llevar",
    excerpt: "Checklist practico para viajar con todo listo y surfear con tranquilidad.",
    category: "Lifestyle",
  },
];

export const surftripsSpFamilyPhotos: SpFamilyPhotoItem[] = [
  { src: "/photos/surftrips/gallery_spfamily_1.jpg", alt: "SP Family Surftrips 1" },
  { src: "/photos/surftrips/gallery_spfamily_2.jpg", alt: "SP Family Surftrips 2" },
  { src: "/photos/surftrips/gallery_spfamily_3.jpg", alt: "SP Family Surftrips 3" },
  { src: "/photos/surftrips/gallery_spfamily_4.jpg", alt: "SP Family Surftrips 4" },
  { src: "/photos/surftrips/gallery_spfamily_5.jpg", alt: "SP Family Surftrips 5" },
  { src: "/photos/surftrips/gallery_spfamily_6.jpg", alt: "SP Family Surftrips 6" },
];


