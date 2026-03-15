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
  createdAt: string;
  updatedAt?: string;
};

export type BookingDoc = {
  userId: string;
  classSlotId: string;
  purchaseId: string;
  bookedAt: string;
  status: BookingStatus;
};
