export const PROFILE_SECTIONS = [
  { id: "datos-personales", label: "Datos personales", title: "Datos personales" },
  { id: "contacto-emergencia", label: "Contacto de emergencia", title: "Contacto de emergencia" },
  { id: "informacion-medica", label: "Información médica y seguro", title: "Información médica y seguro" },
  { id: "nivel-experiencia", label: "Nivel y experiencia", title: "Nivel y experiencia" },
  { id: "objetivos", label: "Objetivos", title: "Objetivos" },
  { id: "coaching", label: "Experiencia de coaching", title: "Experiencia de coaching" },
  { id: "equipamiento", label: "Equipamiento", title: "Equipamiento" },
  { id: "otros", label: "Otros", title: "Otros" },
  { id: "ajustes", label: "Consentimientos", title: "Consentimientos" },
] as const;

export type ProfileSectionId = (typeof PROFILE_SECTIONS)[number]["id"];
