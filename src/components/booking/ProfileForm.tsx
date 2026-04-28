"use client";

import { type ReactNode, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PROFILE_SECTIONS } from "@/components/booking/profileSections";
import type {
  MarketingSource,
  MedicalCondition,
  SurfGoal,
  SurfLevel,
  SurfTime,
  UserProfileDoc,
} from "@/lib/booking/types";

type Props = {
  initialData: Partial<UserProfileDoc> | null;
  userEmail: string;
  onSave: (data: Partial<UserProfileDoc>) => Promise<void>;
  contextMessage?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
};

export const MEDICAL_CONDITIONS: { value: MedicalCondition; label: string }[] = [
  { value: "cardiaco", label: "Problemas cardiacos" },
  { value: "asma", label: "Asma / problemas respiratorios" },
  { value: "lesiones", label: "Lesiones recientes" },
  { value: "epilepsia", label: "Epilepsia" },
  { value: "alergias", label: "Alergias" },
  { value: "ninguna", label: "Ninguna" },
];

export const SURF_GOALS: { value: SurfGoal; label: string }[] = [
  { value: "pararse", label: "Pararte en la tabla" },
  { value: "remada", label: "Tecnica de remada" },
  { value: "takeoff", label: "Take off (puesta de pie)" },
  { value: "lectura_olas", label: "Lectura de olas" },
  { value: "posicionamiento", label: "Posicionamiento en el pico" },
  { value: "velocidad", label: "Generacion de velocidad" },
  { value: "maniobras_basicas", label: "Maniobras basicas" },
  { value: "maniobras_avanzadas", label: "Maniobras avanzadas" },
  { value: "flow", label: "Flow y estilo" },
  { value: "confianza", label: "Confianza en el mar" },
  { value: "condicion_fisica", label: "Condicion fisica para surf" },
  { value: "competencia", label: "Competencia / alto rendimiento" },
  { value: "otro", label: "Otro" },
];

const [
  DATA_SECTION,
  EMERGENCY_SECTION,
  MEDICAL_SECTION,
  LEVEL_SECTION,
  GOALS_SECTION,
  COACHING_SECTION,
  EQUIPMENT_SECTION,
  OTHER_SECTION,
  SETTINGS_SECTION,
] = PROFILE_SECTIONS;

function calcAge(birthDate: string): number | null {
  if (!birthDate) return null;

  const today = new Date();
  const dob = new Date(birthDate);
  if (Number.isNaN(dob.getTime())) return null;

  let age = today.getFullYear() - dob.getFullYear();
  const monthDelta = today.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-5 border-b border-black/10 pb-2">
      <h3 className="text-base font-bold text-black/80">{title}</h3>
    </div>
  );
}

function ProfileSectionBlock({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-profile-section={id}
      className="scroll-mt-28 rounded-2xl border border-black/10 bg-white px-6 py-6 shadow-sm"
    >
      <SectionHeader title={title} />
      {children}
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-black/70">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>
      {children}
    </div>
  );
}

function RadioGroup<T extends string>({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: T | boolean | undefined;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={String(value) === option.value}
            onChange={() => onChange(option.value)}
            className="accent-[var(--color-primary-900)]"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

const defaultForm = (): Partial<UserProfileDoc> => ({
  fullName: "",
  dni: "",
  birthDate: "",
  phone: "",
  email: "",
  address: "",
  emergencyName: "",
  emergencyRelation: "",
  emergencyPhone: "",
  medicalConditions: [],
  medicalConditionDetail: "",
  takesMedication: false,
  medicationDetail: "",
  hasMedicalInsurance: false,
  insuranceName: "",
  insurancePolicyNumber: "",
  preferredClinic: "",
  surfLevel: "principiante",
  canSwim: true,
  surfingTime: "nunca",
  goals: [],
  goalOther: "",
  hasFear: false,
  fearDetail: "",
  hadCoaching: false,
  coachingWith: "",
  coachingDuration: "",
  hasBoard: false,
  hasWetsuit: false,
  marketingSource: undefined,
  marketingSourceOther: "",
  declaresGoodHealth: false,
  understandsRisk: false,
  acceptsTerms: false,
  authorizesImageUse: false,
});

export function ProfileForm({
  initialData,
  userEmail,
  onSave,
  contextMessage,
  title = "Mi perfil",
  description = "Actualiza tu informacion de alumno.",
  submitLabel = "Guardar perfil",
  onCancel,
  cancelLabel = "Cancelar",
}: Props) {
  const [form, setForm] = useState<Partial<UserProfileDoc>>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialData ? { ...defaultForm(), email: userEmail, ...initialData } : { ...defaultForm(), email: userEmail });
    setError(null);
  }, [initialData, userEmail]);

  function set<K extends keyof UserProfileDoc>(key: K, value: UserProfileDoc[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleMedical(condition: MedicalCondition) {
    const current = form.medicalConditions ?? [];

    if (condition === "ninguna") {
      set("medicalConditions", current.includes("ninguna") ? [] : ["ninguna"]);
      return;
    }

    const next = current.filter((item) => item !== "ninguna" && item !== condition);
    set("medicalConditions", current.includes(condition) ? next : [...next, condition]);
  }

  function toggleGoal(goal: SurfGoal) {
    const current = form.goals ?? [];
    set("goals", current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]);
  }

  async function handleSave() {
    const required: [keyof UserProfileDoc, string][] = [
      ["fullName", "Nombre completo"],
      ["dni", "DNI / Pasaporte"],
      ["birthDate", "Fecha de nacimiento"],
      ["phone", "Telefono"],
      ["email", "Correo electronico"],
      ["emergencyName", "Nombre del contacto de emergencia"],
      ["emergencyRelation", "Relacion del contacto de emergencia"],
      ["emergencyPhone", "Telefono del contacto de emergencia"],
    ];

    for (const [field, label] of required) {
      if (!form[field]) {
        setError(`El campo "${label}" es obligatorio.`);
        return;
      }
    }

    if ((form.medicalConditions ?? []).length === 0) {
      setError('Selecciona al menos una condicion medica o marca "Ninguna".');
      return;
    }

    if ((form.goals ?? []).length === 0) {
      setError("Selecciona al menos un objetivo.");
      return;
    }

    if (!form.declaresGoodHealth || !form.understandsRisk || !form.acceptsTerms) {
      setError("Debes aceptar todas las declaraciones obligatorias.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  const age = calcAge(form.birthDate ?? "");
  const hasMedicalIssue = (form.medicalConditions ?? []).some((item) => item !== "ninguna");
  const inputClassName =
    "h-11 rounded-xl border-transparent bg-black/[0.03] transition-colors focus-visible:bg-white focus-visible:ring-black/20";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-black/10 bg-white px-6 py-5 shadow-sm">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-black/50">{description}</p>
      </div>

      {contextMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
          {contextMessage}
        </div>
      ) : null}

      <ProfileSectionBlock id={DATA_SECTION.id} title={DATA_SECTION.title}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Nombre completo" required>
              <Input
                className={inputClassName}
                value={form.fullName ?? ""}
                onChange={(event) => set("fullName", event.target.value)}
                placeholder="Tu nombre completo"
              />
            </Field>
          </div>
          <Field label="DNI / Pasaporte" required>
            <Input
              className={inputClassName}
              value={form.dni ?? ""}
              onChange={(event) => set("dni", event.target.value)}
              placeholder="12345678"
            />
          </Field>
          <Field label="Fecha de nacimiento" required>
            <div className="space-y-1">
              <Input
                className={inputClassName}
                type="date"
                value={form.birthDate ?? ""}
                onChange={(event) => set("birthDate", event.target.value)}
              />
              {age !== null ? <p className="pl-1 text-xs text-black/50">Edad: {age} anos</p> : null}
            </div>
          </Field>
          <Field label="Telefono" required>
            <Input
              className={inputClassName}
              type="tel"
              value={form.phone ?? ""}
              onChange={(event) => set("phone", event.target.value)}
              placeholder="+51 999 999 999"
            />
          </Field>
          <Field label="Correo electronico" required>
            <Input
              className={inputClassName}
              type="email"
              value={form.email ?? ""}
              onChange={(event) => set("email", event.target.value)}
              placeholder="tu@email.com"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Direccion">
              <Input
                className={inputClassName}
                value={form.address ?? ""}
                onChange={(event) => set("address", event.target.value)}
                placeholder="Ciudad, distrito..."
              />
            </Field>
          </div>
        </div>
      </ProfileSectionBlock>

      <ProfileSectionBlock id={EMERGENCY_SECTION.id} title={EMERGENCY_SECTION.title}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Nombre completo" required>
              <Input
                className={inputClassName}
                value={form.emergencyName ?? ""}
                onChange={(event) => set("emergencyName", event.target.value)}
                placeholder="Nombre del contacto"
              />
            </Field>
          </div>
          <Field label="Relacion" required>
            <Input
              className={inputClassName}
              value={form.emergencyRelation ?? ""}
              onChange={(event) => set("emergencyRelation", event.target.value)}
              placeholder="Ej: Mama, pareja..."
            />
          </Field>
          <Field label="Telefono" required>
            <Input
              className={inputClassName}
              type="tel"
              value={form.emergencyPhone ?? ""}
              onChange={(event) => set("emergencyPhone", event.target.value)}
              placeholder="+51 999 999 999"
            />
          </Field>
        </div>
      </ProfileSectionBlock>

      <ProfileSectionBlock id={MEDICAL_SECTION.id} title={MEDICAL_SECTION.title}>
        <div className="space-y-5">
          <Field label="Condiciones medicas" required>
            <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {MEDICAL_CONDITIONS.map((condition) => (
                <label key={condition.value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={(form.medicalConditions ?? []).includes(condition.value)}
                    onChange={() => toggleMedical(condition.value)}
                    className="h-4 w-4 accent-[var(--color-primary-900)]"
                  />
                  {condition.label}
                </label>
              ))}
            </div>
          </Field>
          {hasMedicalIssue ? (
            <Field label="Detalle de condicion">
              <Input
                className={inputClassName}
                value={form.medicalConditionDetail ?? ""}
                onChange={(event) => set("medicalConditionDetail", event.target.value)}
                placeholder="Describe tu condicion..."
              />
            </Field>
          ) : null}
          <Field label="Tomas medicamento actualmente?" required>
            <RadioGroup
              name="takesMedication"
              value={form.takesMedication ? "si" : "no"}
              onChange={(value) => set("takesMedication", value === "si")}
              options={[
                { value: "si", label: "Si" },
                { value: "no", label: "No" },
              ]}
            />
          </Field>
          {form.takesMedication ? (
            <Field label="Cual(es)?">
              <Input
                className={inputClassName}
                value={form.medicationDetail ?? ""}
                onChange={(event) => set("medicationDetail", event.target.value)}
                placeholder="Nombre del medicamento..."
              />
            </Field>
          ) : null}
          <Field label="Cuentas con seguro medico o de accidentes?" required>
            <RadioGroup
              name="hasMedicalInsurance"
              value={form.hasMedicalInsurance ? "si" : "no"}
              onChange={(value) => set("hasMedicalInsurance", value === "si")}
              options={[
                { value: "si", label: "Si" },
                { value: "no", label: "No" },
              ]}
            />
          </Field>
          {form.hasMedicalInsurance ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nombre del seguro">
                <Input
                  className={inputClassName}
                  value={form.insuranceName ?? ""}
                  onChange={(event) => set("insuranceName", event.target.value)}
                  placeholder="Ej: Rimac, Pacifico..."
                />
              </Field>
              <Field label="Numero de poliza">
                <Input
                  className={inputClassName}
                  value={form.insurancePolicyNumber ?? ""}
                  onChange={(event) => set("insurancePolicyNumber", event.target.value)}
                  placeholder="Nro. de poliza"
                />
              </Field>
            </div>
          ) : null}
          <Field label="Clinica o centro medico de preferencia">
            <Input
              className={inputClassName}
              value={form.preferredClinic ?? ""}
              onChange={(event) => set("preferredClinic", event.target.value)}
              placeholder="Ej: Clinica San Felipe..."
            />
          </Field>
        </div>
      </ProfileSectionBlock>

      <ProfileSectionBlock id={LEVEL_SECTION.id} title={LEVEL_SECTION.title}>
        <div className="space-y-5">
          <Field label="Cual es tu nivel de surf?" required>
            <RadioGroup<SurfLevel>
              name="surfLevel"
              value={form.surfLevel}
              onChange={(value) => set("surfLevel", value)}
              options={[
                { value: "principiante", label: "Principiante" },
                { value: "intermedio", label: "Intermedio" },
                { value: "avanzado", label: "Avanzado" },
              ]}
            />
          </Field>
          <Field label="Sabes nadar?" required>
            <RadioGroup
              name="canSwim"
              value={form.canSwim ? "si" : "no"}
              onChange={(value) => set("canSwim", value === "si")}
              options={[
                { value: "si", label: "Si" },
                { value: "no", label: "No" },
              ]}
            />
          </Field>
          <Field label="Cuanto tiempo llevas surfeando?">
            <RadioGroup<SurfTime>
              name="surfingTime"
              value={form.surfingTime}
              onChange={(value) => set("surfingTime", value)}
              options={[
                { value: "nunca", label: "Nunca" },
                { value: "menos_6m", label: "Menos de 6 meses" },
                { value: "6m_1y", label: "6 meses - 1 ano" },
                { value: "1_3y", label: "1 - 3 anos" },
                { value: "mas_3y", label: "Mas de 3 anos" },
                { value: "mas_10y", label: "Mas de 10 anos" },
              ]}
            />
          </Field>
        </div>
      </ProfileSectionBlock>

      <ProfileSectionBlock id={GOALS_SECTION.id} title={GOALS_SECTION.title}>
        <div className="space-y-5">
          <Field label="Que te gustaria mejorar?" required>
            <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SURF_GOALS.map((goal) => (
                <label key={goal.value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={(form.goals ?? []).includes(goal.value)}
                    onChange={() => toggleGoal(goal.value)}
                    className="h-4 w-4 accent-[var(--color-primary-900)]"
                  />
                  {goal.label}
                </label>
              ))}
            </div>
          </Field>
          {(form.goals ?? []).includes("otro") ? (
            <Field label="Cual otro objetivo?">
              <Input
                className={inputClassName}
                value={form.goalOther ?? ""}
                onChange={(event) => set("goalOther", event.target.value)}
                placeholder="Describe tu objetivo..."
              />
            </Field>
          ) : null}
          <Field label="Tienes algun miedo en el mar?">
            <RadioGroup
              name="hasFear"
              value={form.hasFear ? "si" : "no"}
              onChange={(value) => set("hasFear", value === "si")}
              options={[
                { value: "no", label: "No" },
                { value: "si", label: "Si" },
              ]}
            />
          </Field>
          {form.hasFear ? (
            <Field label="Cual?">
              <Input
                className={inputClassName}
                value={form.fearDetail ?? ""}
                onChange={(event) => set("fearDetail", event.target.value)}
                placeholder="Describe tu miedo..."
              />
            </Field>
          ) : null}
        </div>
      </ProfileSectionBlock>

      <ProfileSectionBlock id={COACHING_SECTION.id} title={COACHING_SECTION.title}>
        <div className="space-y-5">
          <Field label="Has tenido entrenamiento o surf coaching anteriormente?">
            <RadioGroup
              name="hadCoaching"
              value={form.hadCoaching ? "si" : "no"}
              onChange={(value) => set("hadCoaching", value === "si")}
              options={[
                { value: "no", label: "No" },
                { value: "si", label: "Si" },
              ]}
            />
          </Field>
          {form.hadCoaching ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Con quien?">
                <Input
                  className={inputClassName}
                  value={form.coachingWith ?? ""}
                  onChange={(event) => set("coachingWith", event.target.value)}
                  placeholder="Nombre del coach / escuela"
                />
              </Field>
              <Field label="Durante cuanto tiempo?">
                <Input
                  className={inputClassName}
                  value={form.coachingDuration ?? ""}
                  onChange={(event) => set("coachingDuration", event.target.value)}
                  placeholder="Ej: 3 meses, 1 ano..."
                />
              </Field>
            </div>
          ) : null}
        </div>
      </ProfileSectionBlock>

      <ProfileSectionBlock id={EQUIPMENT_SECTION.id} title={EQUIPMENT_SECTION.title}>
        <div className="space-y-5">
          <Field label="Tienes tabla propia?">
            <RadioGroup
              name="hasBoard"
              value={form.hasBoard ? "si" : "no"}
              onChange={(value) => set("hasBoard", value === "si")}
              options={[
                { value: "no", label: "No" },
                { value: "si", label: "Si" },
              ]}
            />
          </Field>
          <Field label="Tienes wetsuit propio?">
            <RadioGroup
              name="hasWetsuit"
              value={form.hasWetsuit ? "si" : "no"}
              onChange={(value) => set("hasWetsuit", value === "si")}
              options={[
                { value: "no", label: "No" },
                { value: "si", label: "Si" },
              ]}
            />
          </Field>
        </div>
      </ProfileSectionBlock>

      <ProfileSectionBlock id={OTHER_SECTION.id} title={OTHER_SECTION.title}>
        <div className="space-y-5">
          <Field label="Como nos conociste?">
            <RadioGroup<MarketingSource>
              name="marketingSource"
              value={form.marketingSource}
              onChange={(value) => set("marketingSource", value)}
              options={[
                { value: "instagram", label: "Instagram" },
                { value: "recomendacion", label: "Recomendacion" },
                { value: "tienda", label: "Tienda de surf" },
                { value: "evento", label: "Evento / activacion" },
                { value: "otro", label: "Otro" },
              ]}
            />
          </Field>
          {form.marketingSource === "otro" ? (
            <Field label="Detalle">
              <Input
                className={inputClassName}
                value={form.marketingSourceOther ?? ""}
                onChange={(event) => set("marketingSourceOther", event.target.value)}
                placeholder="Como nos conociste?"
              />
            </Field>
          ) : null}
        </div>
      </ProfileSectionBlock>

      <ProfileSectionBlock id={SETTINGS_SECTION.id} title={SETTINGS_SECTION.title}>
        <div className="space-y-5">
          <p className="text-sm text-black/50">
            Revisa las autorizaciones y declaraciones necesarias para mantener activo tu perfil de alumno.
          </p>
          <div className="space-y-3">
            {([
              ["declaresGoodHealth", "Declaro que me encuentro en condiciones fisicas adecuadas para la practica del surf"],
              ["understandsRisk", "Entiendo que el surf es un deporte de riesgo y asumo la responsabilidad de mi participacion"],
              ["acceptsTerms", "He leido y acepto los Terminos y Condiciones"],
              ["authorizesImageUse", "Autorizo el uso de mi imagen para fines promocionales"],
            ] as [keyof UserProfileDoc, string][]).map(([field, label]) => (
              <label key={field} className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={!!form[field]}
                  onChange={(event) => set(field, event.target.checked as UserProfileDoc[typeof field])}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary-900)]"
                />
                <span className="leading-relaxed text-black/70">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </ProfileSectionBlock>

      <div className="space-y-3 rounded-2xl border border-black/10 bg-white px-6 py-5 shadow-sm">
        {error ? (
          <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : null}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {onCancel ? (
            <Button type="button" variant="outline" className="h-11 rounded-xl px-5" onClick={onCancel}>
              {cancelLabel}
            </Button>
          ) : null}
          <Button
            type="button"
            className="h-11 rounded-xl bg-[var(--color-primary-900)] px-6 font-semibold text-white hover:bg-[var(--color-primary-700)]"
            onClick={() => void handleSave()}
            disabled={saving}
          >
            {saving ? "Guardando..." : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
