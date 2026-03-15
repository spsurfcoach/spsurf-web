import { adminDb } from "@/lib/firebase/admin";

export const collections = {
  packages: adminDb.collection("packages"),
  classSlots: adminDb.collection("classSlots"),
  purchases: adminDb.collection("purchases"),
  bookings: adminDb.collection("bookings"),
};
