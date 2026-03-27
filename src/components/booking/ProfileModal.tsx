"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  MedicalCondition,
  MarketingSource,
  SurfGoal,
  SurfLevel,
  SurfTime,
  UserProfileDoc,
} from "@/lib/booking/types";

type Props = {
  open: boolean;
  initialData: Partial<UserProfileDoc> | null;
  userEmail: string;
  onSave: (data: Partial<UserProfileDoc>) => Promise<void>;
  onClose: () => void;
};

const MEDICAL_CONDITIONS: { value: MedicalCondition; label: string }[] = [
  { value: "cardiaco", label: "Problemas cardíacos" },
  { value: "asma", label: "Asma / problemas respiratorios" },
  { value: "lesiones", label: "Lesiones recientes" },
  { value: "epilepsia", label: "Epilepsia" },
  { value: "alergias", label: "Alergias" },
  { value: "ninguna", label: "Ninguna" },
];

const SURF_GOALS: { value: SurfGoal; label: string }[] = [
  { value: "pararse", label: "Pararte en la tabla" },
  { value: "remada", label: "Técnica de remada" },
  { value: "takeoff", label: "Take off (puesta de pie)" },
  { value: "lectura_olas", label: "Lectura de olas" },
  { value: "posicionamiento", label: "Posicionamiento en el pico" },
  { value: "velocidad", label: "Generación de velocidad" },
  { value: "maniobras_basicas", label: "Maniobras básicas" },
  { value: "maniobras_avanzadas", label: "Maniobras avanzadas" },
  { value: "flow", label: "Flow y estilo" },
  { value: "confianza", label: "Confianza en el mar" },
  { value: "condicion_fisica", label: "Condición física para surf" },
  { value: "competencia", label: "Competencia / alto rendimiento" },
  { value: "otro", label: "Otro" },
];

function calcAge(birthDate: string): number | null {
  if (!birthDate) return null;
  const today = new Date();
  const dob = new Date(birthDate);
  if (isNaN(dob.getTime())) return null;
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 0 ? age : null;
}

function SectionHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-5 pb-2 border-b border-black/10">
      <span className="text-xl">{emoji}</span>
      <h3 className="font-bold text-base text-black/80">{title}</h3>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-black/70">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
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
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={String(value) === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-[var(--color-primary-900)]"
          />
          {opt.label}
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

export function ProfileModal({ open, initialData, userEmail, onSave, onClose }: Props) {
  const [form, setForm] = useState<Partial<UserProfileDoc>>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(initialData ? { ...defaultForm(), email: userEmail, ...initialData } : { ...defaultForm(), email: userEmail });
      setError(null);
    }
  }, [open, initialData, userEmail]);

  if (!open) return null;

  function set<K extends keyof UserProfileDoc>(key: K, value: UserProfileDoc[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMedical(condition: MedicalCondition) {
    const current = form.medicalConditions ?? [];
    if (condition === "ninguna") {
      set("medicalConditions", current.includes("ninguna") ? [] : ["ninguna"]);
    } else {
      const without = current.filter((c) => c !== "ninguna" && c !== condition);
      if (current.includes(condition)) {
        set("medicalConditions", without);
      } else {
        set("medicalConditions", [...without, condition] as MedicalCondition[]);
      }
    }
  }

  function toggleGoal(goal: SurfGoal) {
    const current = form.goals ?? [];
    if (current.includes(goal)) {
      set("goals", current.filter((g) => g !== goal));
    } else {
      set("goals", [...current, goal]);
    }
  }

  async function handleSave() {
    const required: [keyof UserProfileDoc, string][] = [
      ["fullName", "Nombre completo"],
      ["dni", "DNI / Pasaporte"],
      ["birthDate", "Fecha de nacimiento"],
      ["phone", "Teléfono"],
      ["email", "Correo electrónico"],
      ["emergencyName", "Nombre contacto de emergencia"],
      ["emergencyRelation", "Relación contacto de emergencia"],
      ["emergencyPhone", "Teléfono contacto de emergencia"],
    ];
    for (const [field, label] of required) {
      if (!form[field]) {
        setError(`El campo "${label}" es obligatorio.`);
        return;
      }
    }
    if ((form.medicalConditions ?? []).length === 0) {
      setError("Selecciona al menos una condición médica (o \"Ninguna\").");
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
    setError(null);
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  const age = calcAge(form.birthDate ?? "");
  const hasMedicalIssue = (form.medicalConditions ?? []).some((c) => c !== "ninguna");
  const inputCls = "h-11 bg-black/[0.03] border-transparent focus-visible:ring-black/20 focus-visible:bg-white transition-colors rounded-xl";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl my-6 mx-4">
        <div className="bg-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
            <div>
              <h2 className="text-xl font-bold">Completa tu perfil</h2>
              <p className="text-sm text-black/50 mt-0.5">Tu información como alumno de SP Surf Coach</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/[0.05] transition-colors text-black/40 hover:text-black"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Form */}
          <div className="px-6 py-6 space-y-10">

            {/* S1: Datos personales */}
            <section>
              <SectionHeader emoji="🔹" title="Datos personales" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Nombre completo" required>
                    <Input className={inputCls} value={form.fullName ?? ""} onChange={(e) => set("fullName", e.target.value)} placeholder="Tu nombre completo" />
                  </Field>
                </div>
                <Field label="DNI / Pasaporte" required>
                  <Input className={inputCls} value={form.dni ?? ""} onChange={(e) => set("dni", e.target.value)} placeholder="12345678" />
                </Field>
                <Field label="Fecha de nacimiento" required>
                  <div className="space-y-1">
                    <Input className={inputCls} type="date" value={form.birthDate ?? ""} onChange={(e) => set("birthDate", e.target.value)} />
                    {age !== null && (
                      <p className="text-xs text-black/50 pl-1">Edad: <strong>{age} años</strong></p>
                    )}
                  </div>
                </Field>
                <Field label="Teléfono" required>
                  <Input className={inputCls} type="tel" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} placeholder="+51 999 999 999" />
                </Field>
                <Field label="Correo electrónico" required>
                  <Input className={inputCls} type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} placeholder="tu@email.com" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Dirección">
                    <Input className={inputCls} value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} placeholder="Ciudad, distrito..." />
                  </Field>
                </div>
              </div>
            </section>

            {/* S2: Contacto de emergencia */}
            <section>
              <SectionHeader emoji="🚨" title="Contacto de emergencia" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Nombre completo" required>
                    <Input className={inputCls} value={form.emergencyName ?? ""} onChange={(e) => set("emergencyName", e.target.value)} placeholder="Nombre del contacto" />
                  </Field>
                </div>
                <Field label="Relación" required>
                  <Input className={inputCls} value={form.emergencyRelation ?? ""} onChange={(e) => set("emergencyRelation", e.target.value)} placeholder="Ej: Mamá, pareja..." />
                </Field>
                <Field label="Teléfono" required>
                  <Input className={inputCls} type="tel" value={form.emergencyPhone ?? ""} onChange={(e) => set("emergencyPhone", e.target.value)} placeholder="+51 999 999 999" />
                </Field>
              </div>
            </section>

            {/* S3: Médica y seguro */}
            <section>
              <SectionHeader emoji="🏥" title="Información médica y seguro" />
              <div className="space-y-5">
                <Field label="¿Presentas alguna de las siguientes condiciones?" required>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {MEDICAL_CONDITIONS.map((c) => (
                      <label key={c.value} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(form.medicalConditions ?? []).includes(c.value)}
                          onChange={() => toggleMedical(c.value)}
                          className="accent-[var(--color-primary-900)] w-4 h-4"
                        />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </Field>
                {hasMedicalIssue && (
                  <Field label="Detalle de condición">
                    <Input className={inputCls} value={form.medicalConditionDetail ?? ""} onChange={(e) => set("medicalConditionDetail", e.target.value)} placeholder="Describe tu condición..." />
                  </Field>
                )}
                <Field label="¿Tomas algún medicamento actualmente?" required>
                  <RadioGroup
                    name="takesMedication"
                    value={form.takesMedication ? "si" : "no"}
                    onChange={(v) => set("takesMedication", v === "si")}
                    options={[{ value: "si", label: "Sí" }, { value: "no", label: "No" }]}
                  />
                </Field>
                {form.takesMedication && (
                  <Field label="¿Cuál(es)?">
                    <Input className={inputCls} value={form.medicationDetail ?? ""} onChange={(e) => set("medicationDetail", e.target.value)} placeholder="Nombre del medicamento..." />
                  </Field>
                )}
                <Field label="¿Cuentas con seguro médico o de accidentes?" required>
                  <RadioGroup
                    name="hasMedicalInsurance"
                    value={form.hasMedicalInsurance ? "si" : "no"}
                    onChange={(v) => set("hasMedicalInsurance", v === "si")}
                    options={[{ value: "si", label: "Sí" }, { value: "no", label: "No" }]}
                  />
                </Field>
                {form.hasMedicalInsurance && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nombre del seguro">
                      <Input className={inputCls} value={form.insuranceName ?? ""} onChange={(e) => set("insuranceName", e.target.value)} placeholder="Ej: Rímac, Pacífico..." />
                    </Field>
                    <Field label="Número de póliza (opcional)">
                      <Input className={inputCls} value={form.insurancePolicyNumber ?? ""} onChange={(e) => set("insurancePolicyNumber", e.target.value)} placeholder="Nro. de póliza" />
                    </Field>
                  </div>
                )}
                <Field label="Clínica o centro médico de preferencia">
                  <Input className={inputCls} value={form.preferredClinic ?? ""} onChange={(e) => set("preferredClinic", e.target.value)} placeholder="Ej: Clínica San Felipe..." />
                </Field>
              </div>
            </section>

            {/* S4: Nivel y experiencia */}
            <section>
              <SectionHeader emoji="🌊" title="Nivel y experiencia" />
              <div className="space-y-5">
                <Field label="¿Cuál es tu nivel de surf?" required>
                  <RadioGroup<SurfLevel>
                    name="surfLevel"
                    value={form.surfLevel}
                    onChange={(v) => set("surfLevel", v)}
                    options={[
                      { value: "principiante", label: "Principiante" },
                      { value: "intermedio", label: "Intermedio" },
                      { value: "avanzado", label: "Avanzado" },
                    ]}
                  />
                </Field>
                <Field label="¿Sabes nadar?" required>
                  <RadioGroup
                    name="canSwim"
                    value={form.canSwim ? "si" : "no"}
                    onChange={(v) => set("canSwim", v === "si")}
                    options={[{ value: "si", label: "Sí" }, { value: "no", label: "No" }]}
                  />
                </Field>
                <Field label="¿Cuánto tiempo llevas surfeando?">
                  <RadioGroup<SurfTime>
                    name="surfingTime"
                    value={form.surfingTime}
                    onChange={(v) => set("surfingTime", v)}
                    options={[
                      { value: "nunca", label: "Nunca" },
                      { value: "menos_6m", label: "Menos de 6 meses" },
                      { value: "6m_1y", label: "6 meses – 1 año" },
                      { value: "1_3y", label: "1 – 3 años" },
                      { value: "mas_3y", label: "Más de 3 años" },
                      { value: "mas_10y", label: "Más de 10 años" },
                    ]}
                  />
                </Field>
              </div>
            </section>

            {/* S5: Objetivos */}
            <section>
              <SectionHeader emoji="🎯" title="Objetivos" />
              <div className="space-y-5">
                <Field label="¿Qué te gustaría mejorar? (puedes seleccionar varias)" required>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {SURF_GOALS.map((g) => (
                      <label key={g.value} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(form.goals ?? []).includes(g.value)}
                          onChange={() => toggleGoal(g.value)}
                          className="accent-[var(--color-primary-900)] w-4 h-4"
                        />
                        {g.label}
                      </label>
                    ))}
                  </div>
                </Field>
                {(form.goals ?? []).includes("otro") && (
                  <Field label="¿Cuál otro objetivo?">
                    <Input className={inputCls} value={form.goalOther ?? ""} onChange={(e) => set("goalOther", e.target.value)} placeholder="Describe tu objetivo..." />
                  </Field>
                )}
                <Field label="¿Tienes algún miedo en el mar?">
                  <RadioGroup
                    name="hasFear"
                    value={form.hasFear ? "si" : "no"}
                    onChange={(v) => set("hasFear", v === "si")}
                    options={[{ value: "no", label: "No" }, { value: "si", label: "Sí" }]}
                  />
                </Field>
                {form.hasFear && (
                  <Field label="¿Cuál?">
                    <Input className={inputCls} value={form.fearDetail ?? ""} onChange={(e) => set("fearDetail", e.target.value)} placeholder="Describe tu miedo..." />
                  </Field>
                )}
              </div>
            </section>

            {/* S6: Coaching */}
            <section>
              <SectionHeader emoji="🏄‍♂️" title="Experiencia en coaching" />
              <div className="space-y-5">
                <Field label="¿Has tenido entrenamiento o surf coaching anteriormente?">
                  <RadioGroup
                    name="hadCoaching"
                    value={form.hadCoaching ? "si" : "no"}
                    onChange={(v) => set("hadCoaching", v === "si")}
                    options={[{ value: "no", label: "No" }, { value: "si", label: "Sí" }]}
                  />
                </Field>
                {form.hadCoaching && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="¿Con quién?">
                      <Input className={inputCls} value={form.coachingWith ?? ""} onChange={(e) => set("coachingWith", e.target.value)} placeholder="Nombre del coach / escuela" />
                    </Field>
                    <Field label="¿Durante cuánto tiempo?">
                      <Input className={inputCls} value={form.coachingDuration ?? ""} onChange={(e) => set("coachingDuration", e.target.value)} placeholder="Ej: 3 meses, 1 año..." />
                    </Field>
                  </div>
                )}
              </div>
            </section>

            {/* S7: Equipamiento */}
            <section>
              <SectionHeader emoji="🏄‍♂️" title="Equipamiento" />
              <div className="space-y-5">
                <Field label="¿Tienes tabla propia?">
                  <RadioGroup
                    name="hasBoard"
                    value={form.hasBoard ? "si" : "no"}
                    onChange={(v) => set("hasBoard", v === "si")}
                    options={[{ value: "no", label: "No" }, { value: "si", label: "Sí" }]}
                  />
                </Field>
                <Field label="¿Tienes wetsuit propio?">
                  <RadioGroup
                    name="hasWetsuit"
                    value={form.hasWetsuit ? "si" : "no"}
                    onChange={(v) => set("hasWetsuit", v === "si")}
                    options={[{ value: "no", label: "No" }, { value: "si", label: "Sí" }]}
                  />
                </Field>
              </div>
            </section>

            {/* S8: Marketing */}
            <section>
              <SectionHeader emoji="📣" title="¿Cómo nos conociste?" />
              <RadioGroup<MarketingSource>
                name="marketingSource"
                value={form.marketingSource}
                onChange={(v) => set("marketingSource", v)}
                options={[
                  { value: "instagram", label: "Instagram" },
                  { value: "recomendacion", label: "Recomendación" },
                  { value: "tienda", label: "Tienda de surf" },
                  { value: "evento", label: "Evento / activación" },
                  { value: "otro", label: "Otro" },
                ]}
              />
              {form.marketingSource === "otro" && (
                <div className="mt-4">
                  <Input className={inputCls} value={form.marketingSourceOther ?? ""} onChange={(e) => set("marketingSourceOther", e.target.value)} placeholder="¿Cómo nos conociste?" />
                </div>
              )}
            </section>

            {/* S9: Declaraciones */}
            <section>
              <SectionHeader emoji="⚠️" title="Declaraciones y aceptación" />
              <div className="space-y-3">
                {([
                  ["declaresGoodHealth", "Declaro que me encuentro en condiciones físicas adecuadas para la práctica del surf"],
                  ["understandsRisk", "Entiendo que el surf es un deporte de riesgo y asumo la responsabilidad de mi participación"],
                  ["acceptsTerms", "He leído y acepto los Términos y Condiciones"],
                  ["authorizesImageUse", "Autorizo el uso de mi imagen para fines promocionales"],
                ] as [keyof UserProfileDoc, string][]).map(([field, label]) => (
                  <label key={field} className="flex items-start gap-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!form[field]}
                      onChange={(e) => set(field, e.target.checked as UserProfileDoc[typeof field])}
                      className="accent-[var(--color-primary-900)] w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span className="text-black/70 leading-relaxed">{label}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-black/10 space-y-3">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
            )}
            <Button
              className="w-full h-12 rounded-xl font-semibold bg-[var(--color-primary-900)] hover:bg-[var(--color-primary-700)] text-white transition-colors"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Completar registro"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
