"use client";

import type {
  MarketingSource,
  MedicalCondition,
  SurfGoal,
  SurfLevel,
  SurfTime,
  UserProfileDoc,
} from "@/lib/booking/types";
import { MEDICAL_CONDITIONS, SURF_GOALS } from "@/components/booking/ProfileForm";

const SURF_LEVEL_LABELS: Record<SurfLevel, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

const SURF_TIME_LABELS: Record<SurfTime, string> = {
  nunca: "Nunca",
  menos_6m: "Menos de 6 meses",
  "6m_1y": "6 meses - 1 año",
  "1_3y": "1 - 3 años",
  mas_3y: "Más de 3 años",
  mas_10y: "Más de 10 años",
};

const MARKETING_LABELS: Record<MarketingSource, string> = {
  instagram: "Instagram",
  recomendacion: "Recomendación",
  tienda: "Tienda de surf",
  evento: "Evento / activación",
  otro: "Otro",
};

const MEDICAL_MAP = Object.fromEntries(MEDICAL_CONDITIONS.map((m) => [m.value, m.label])) as Record<
  MedicalCondition,
  string
>;
const GOAL_MAP = Object.fromEntries(SURF_GOALS.map((g) => [g.value, g.label])) as Record<SurfGoal, string>;

const FIELD_LABELS: Partial<Record<keyof UserProfileDoc, string>> = {
  fullName: "Nombre completo",
  dni: "DNI",
  birthDate: "Fecha de nacimiento",
  phone: "Teléfono",
  email: "Email",
  address: "Dirección",
  emergencyName: "Contacto de emergencia",
  emergencyRelation: "Parentesco",
  emergencyPhone: "Teléfono de emergencia",
  medicalConditions: "Condiciones médicas",
  medicalConditionDetail: "Detalle médico",
  takesMedication: "Toma medicación",
  medicationDetail: "Detalle de medicación",
  hasMedicalInsurance: "Tiene seguro médico",
  insuranceName: "Seguro médico",
  insurancePolicyNumber: "Número de póliza",
  preferredClinic: "Clínica preferida",
  surfLevel: "Nivel de surf",
  canSwim: "Sabe nadar",
  surfingTime: "Tiempo surfeando",
  goals: "Objetivos",
  goalOther: "Otro objetivo",
  hasFear: "Miedo o bloqueo",
  fearDetail: "Detalle de miedos",
  hadCoaching: "Coaching previo",
  coachingWith: "Coach previo",
  coachingDuration: "Duración coaching previo",
  hasBoard: "Tabla propia",
  hasWetsuit: "Wetsuit propio",
  marketingSource: "Cómo nos conoció",
  marketingSourceOther: "Cómo nos conoció (detalle)",
  declaresGoodHealth: "Declara buen estado de salud",
  understandsRisk: "Entiende riesgos del surf",
  acceptsTerms: "Acepta términos y condiciones",
  authorizesImageUse: "Autoriza uso de imagen",
  createdAt: "Ficha creada",
  updatedAt: "Última actualización",
};

function formatDateValue(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
}

function formatField(key: keyof UserProfileDoc, value: UserProfileDoc[keyof UserProfileDoc]): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    if (key === "medicalConditions") {
      return (value as MedicalCondition[]).map((v) => MEDICAL_MAP[v] ?? v).join(", ");
    }
    if (key === "goals") {
      return (value as SurfGoal[]).map((v) => GOAL_MAP[v] ?? v).join(", ");
    }
    return (value as string[]).map(String).join(", ");
  }
  if (typeof value === "string") {
    if (key === "birthDate") return formatDateValue(value);
    if (key === "createdAt" || key === "updatedAt") return formatDateValue(value);
    if (key === "surfLevel") return SURF_LEVEL_LABELS[value as SurfLevel] ?? value;
    if (key === "surfingTime") return SURF_TIME_LABELS[value as SurfTime] ?? value;
    if (key === "marketingSource") return MARKETING_LABELS[value as MarketingSource] ?? value;
    return value;
  }
  return String(value);
}

type Props = {
  profile: Partial<UserProfileDoc>;
};

const FIELD_ORDER: (keyof UserProfileDoc)[] = [
  "fullName",
  "dni",
  "birthDate",
  "phone",
  "email",
  "address",
  "emergencyName",
  "emergencyRelation",
  "emergencyPhone",
  "medicalConditions",
  "medicalConditionDetail",
  "takesMedication",
  "medicationDetail",
  "hasMedicalInsurance",
  "insuranceName",
  "insurancePolicyNumber",
  "preferredClinic",
  "surfLevel",
  "canSwim",
  "surfingTime",
  "goals",
  "goalOther",
  "hasFear",
  "fearDetail",
  "hadCoaching",
  "coachingWith",
  "coachingDuration",
  "hasBoard",
  "hasWetsuit",
  "marketingSource",
  "marketingSourceOther",
  "declaresGoodHealth",
  "understandsRisk",
  "acceptsTerms",
  "authorizesImageUse",
  "createdAt",
  "updatedAt",
];

export function AdminStudentProfileReadonly({ profile }: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-black">Ficha del alumno</h3>
      <p className="mt-1 text-sm text-black/50">Solo lectura. Los datos los completa el alumno en su cuenta.</p>
      <dl className="mt-8 grid gap-6 sm:grid-cols-2">
        {FIELD_ORDER.map((key) => {
          const raw = profile[key];
          const text = formatField(key, raw as UserProfileDoc[typeof key]);
          if (text === null || text === "") return null;
          const label = FIELD_LABELS[key];
          if (!label) return null;
          return (
            <div key={key} className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">{label}</dt>
              <dd className="mt-1 text-sm font-medium text-black break-words">{text}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
