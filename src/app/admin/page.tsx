"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ClassSlotsCrud } from "@/components/admin/ClassSlotsCrud";
import { PackagesCrud } from "@/components/admin/PackagesCrud";
import { SlotBookingsView } from "@/components/admin/SlotBookingsView";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type PackageItem = {
  id: string;
  name: string;
  type: "credits" | "unlimited";
  classCount?: number;
  durationDays?: number;
  price: number;
  isActive: boolean;
};

type SlotItem = {
  id: string;
  startsAt: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
};

type BookingItem = {
  id: string;
  userId: string;
  bookedAt: string;
  status: string;
};

export default function AdminPage() {
  const { user, loginWithGoogle, logout } = useAuth();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  async function loadAdminData() {
    setIsLoadingData(true);
    try {
      const [packagesRes, slotsRes] = await Promise.all([
        apiFetch<{ items: PackageItem[] }>("/api/admin/packages"),
        apiFetch<{ items: SlotItem[] }>("/api/admin/class-slots"),
      ]);
      setPackages(packagesRes.items ?? []);
      setSlots(slotsRes.items ?? []);
    } finally {
      setIsLoadingData(false);
    }
  }

  useEffect(() => {
    if (!user) return;
    void loadAdminData().catch(() => {
      setMessage({
        type: "error",
        text: "No autorizado para admin. Verifica ADMIN_EMAILS o custom claims.",
      });
    });
  }, [user]);

  const activePackagesCount = packages.filter((item) => item.isActive).length;
  const activeSlotsCount = slots.filter((item) => item.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Hero Header with Image */}
      <div className="relative w-full h-[40vh] min-h-[350px] mb-12">
        <Image
          src="/photos/nosotros_hero.jpg"
          alt="Admin Dashboard"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-4">Panel de Control</h1>
          <p className="text-lg max-w-xl text-white/90">
            Gestiona los paquetes de clases, los horarios disponibles y visualiza las reservas de tus alumnos.
          </p>
        </div>
      </div>

      <div className="container-site space-y-12">
        {!user ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-8 sm:p-10 shadow-sm space-y-8 text-center">
            <div>
              <h2 className="text-2xl font-bold uppercase mb-2">Acceso Restringido</h2>
              <p className="text-black/60">Inicia sesión con una cuenta de administrador para continuar.</p>
            </div>
            <Button className="w-full h-12" onClick={() => void loginWithGoogle()}>Entrar con Google</Button>
          </div>
        ) : null}

        {message ? (
          <div
            className={`rounded-xl px-4 py-3 font-medium ${
              message.type === "success" ? "bg-emerald-500/15 text-emerald-900 border border-emerald-500/30" : "bg-red-500/15 text-red-900 border border-red-500/30"
            }`}
          >
            {message.text}
          </div>
        ) : null}

        {user ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 bg-black text-white rounded-2xl p-6 sm:p-8 shadow-sm">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-white/50 mb-1">Sesión Iniciada</p>
                <p className="font-medium text-lg truncate">{user.email ?? user.uid}</p>
              </div>
              <Button variant="outline" className="h-11 border-white/20 hover:bg-white/10 text-black bg-white" onClick={() => void logout()}>
                Cerrar sesión
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-widest text-black/40 mb-2">Paquetes Activos</p>
                <p className="text-5xl font-bold tracking-tighter">{activePackagesCount}</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-widest text-black/40 mb-2">Horarios Activos</p>
                <p className="text-5xl font-bold tracking-tighter">{activeSlotsCount}</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-widest text-black/40 mb-2">Reservas del Horario</p>
                <p className="text-5xl font-bold tracking-tighter">{selectedSlotId ? bookings.length : 0}</p>
              </div>
            </div>

            <div className="space-y-12">
              <PackagesCrud
                items={packages}
                isLoading={isLoadingData}
                onCreate={async (payload) => {
                  try {
                    await apiFetch("/api/admin/packages", { method: "POST", body: JSON.stringify(payload) });
                    await loadAdminData();
                    setMessage({ type: "success", text: "Paquete creado correctamente." });
                  } catch {
                    setMessage({ type: "error", text: "No se pudo crear el paquete." });
                  }
                }}
                onToggle={async (id, current) => {
                  try {
                    await apiFetch("/api/admin/packages", {
                      method: "PATCH",
                      body: JSON.stringify({ id, patch: { isActive: !current } }),
                    });
                    await loadAdminData();
                    setMessage({ type: "success", text: "Estado del paquete actualizado." });
                  } catch {
                    setMessage({ type: "error", text: "No se pudo actualizar el paquete." });
                  }
                }}
              />

              <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
                <ClassSlotsCrud
                  items={slots}
                  isLoading={isLoadingData}
                  onCreate={async (payload) => {
                    try {
                      await apiFetch("/api/admin/class-slots", { method: "POST", body: JSON.stringify(payload) });
                      await loadAdminData();
                      setMessage({ type: "success", text: "Horario creado correctamente." });
                    } catch {
                      setMessage({ type: "error", text: "No se pudo crear el horario." });
                    }
                  }}
                  onToggle={async (id, current) => {
                    try {
                      await apiFetch("/api/admin/class-slots", {
                        method: "PATCH",
                        body: JSON.stringify({ id, patch: { isActive: !current } }),
                      });
                      await loadAdminData();
                      setMessage({ type: "success", text: "Estado del horario actualizado." });
                    } catch {
                      setMessage({ type: "error", text: "No se pudo actualizar el horario." });
                    }
                  }}
                  onSelectSlot={async (id) => {
                    setIsLoadingBookings(true);
                    try {
                      setSelectedSlotId(id);
                      const response = await apiFetch<{ items: BookingItem[] }>(`/api/admin/class-slots/${id}/bookings`);
                      setBookings(response.items ?? []);
                    } catch {
                      setMessage({ type: "error", text: "No se pudieron cargar las reservas del horario." });
                    } finally {
                      setIsLoadingBookings(false);
                    }
                  }}
                />

                <div className="space-y-6">
                  {selectedSlotId ? (
                    isLoadingBookings ? (
                      <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm text-center text-black/60">Cargando reservas...</div>
                    ) : (
                      <div className="sticky top-24">
                        <SlotBookingsView items={bookings} />
                      </div>
                    )
                  ) : (
                    <div className="sticky top-24 rounded-2xl border border-black/10 bg-white p-8 shadow-sm text-center text-black/60">
                      Selecciona un horario para ver sus reservas.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
