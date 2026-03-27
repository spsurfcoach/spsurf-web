export type PackageType = "credits" | "unlimited";
export type PurchaseStatus = "approved" | "pending" | "rejected" | "cancelled";
export type BookingStatus = "booked" | "cancelled";

export type PackageDoc = {
  name: string;
  type: PackageType;
  classCount?: number;
  durationDays?: number;
  price: number;
  currency: "PEN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ClassSlotDoc = {
  startsAt: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
  coachNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type PurchaseDoc = {
  userId: string;
  packageId: string;
  packageType: PackageType;
  remainingCredits?: number;
  expiresAt?: string;
  mercadopagoPaymentId: string;
  mercadopagoPreferenceId: string;
  status: PurchaseStatus;
  itemType?: "package" | "surftrip";
  surftripId?: string;
  createdAt: string;
  updatedAt?: string;
};

export type SurftripInventoryDoc = {
  sanitySlug: string;
  title: string;
  price: number;
  currency: "PEN";
  capacity: number;
  enrolledCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SurftripBookingDoc = {
  userId: string;
  surftripId: string;
  sanitySlug: string;
  purchaseId: string;
  paymentId: string;
  status: "confirmed" | "cancelled";
  bookedAt: string;
  createdAt: string;
};

export type BookingDoc = {
  userId: string;
  classSlotId: string;
  purchaseId: string;
  bookedAt: string;
  status: BookingStatus;
};

export type MedicalCondition = "cardiaco" | "asma" | "lesiones" | "epilepsia" | "alergias" | "ninguna";
export type SurfLevel = "principiante" | "intermedio" | "avanzado";
export type SurfTime = "nunca" | "menos_6m" | "6m_1y" | "1_3y" | "mas_3y" | "mas_10y";
export type SurfGoal =
  | "pararse" | "remada" | "takeoff" | "lectura_olas" | "posicionamiento"
  | "velocidad" | "maniobras_basicas" | "maniobras_avanzadas" | "flow"
  | "confianza" | "condicion_fisica" | "competencia" | "otro";
export type MarketingSource = "instagram" | "recomendacion" | "tienda" | "evento" | "otro";

export type UserProfileDoc = {
  fullName: string;
  dni: string;
  birthDate: string;
  phone: string;
  email: string;
  address?: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  medicalConditions: MedicalCondition[];
  medicalConditionDetail?: string;
  takesMedication: boolean;
  medicationDetail?: string;
  hasMedicalInsurance: boolean;
  insuranceName?: string;
  insurancePolicyNumber?: string;
  preferredClinic?: string;
  surfLevel: SurfLevel;
  canSwim: boolean;
  surfingTime: SurfTime;
  goals: SurfGoal[];
  goalOther?: string;
  hasFear: boolean;
  fearDetail?: string;
  hadCoaching: boolean;
  coachingWith?: string;
  coachingDuration?: string;
  hasBoard: boolean;
  hasWetsuit: boolean;
  marketingSource?: MarketingSource;
  marketingSourceOther?: string;
  declaresGoodHealth: boolean;
  understandsRisk: boolean;
  acceptsTerms: boolean;
  authorizesImageUse: boolean;
  createdAt: string;
  updatedAt: string;
};
