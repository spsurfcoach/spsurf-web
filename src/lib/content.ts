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
  level: string;
  date: string;
  description: string;
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

export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/surftrips", label: "Surftrips" },
  { href: "/servicios", label: "Servicios" },
  { href: "/shop", label: "Shop" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
];

export const homePackages: PackageItem[] = [
  { name: "Paquete 1", price: "S/ 540", classes: "4 clases", validity: "Vigencia: 1 mes" },
  { name: "Paquete 2", price: "S/ 960", classes: "8 clases", validity: "Vigencia: 1 mes" },
  { name: "Paquete 3", price: "S/ 1200", classes: "12 clases", validity: "Vigencia: 1 mes" },
];

export const surfTrips: SurfTripItem[] = [
  {
    name: "Chicama",
    level: "Avanzado",
    date: "18 al 25 de Noviembre",
    description: "Olas largas y entrenamiento técnico en videoanálisis.",
  },
  {
    name: "El Salvador",
    level: "Intermedio",
    date: "10 al 18 de Diciembre",
    description: "Coaching diario para mejorar lectura de ola y maniobras.",
  },
  {
    name: "Lobitos",
    level: "Avanzado",
    date: "5 al 16 de Enero",
    description: "Plan mixto de surf, físico y enfoque mental para progresar.",
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


