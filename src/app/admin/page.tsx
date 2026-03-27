"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ClassSlotsCrud } from "@/components/admin/ClassSlotsCrud";
import { PackagesCrud } from "@/components/admin/PackagesCrud";
import { SlotBookingsView } from "@/components/admin/SlotBookingsView";
import { StudentsDatabaseView } from "@/components/admin/StudentsDatabaseView";
import type { StudentItem } from "@/components/admin/StudentsDatabaseView";
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
  location?: string;
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
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  async function loadAdminData() {
    setIsLoadingData(true);
    try {
      const [packagesRes, slotsRes, studentsRes] = await Promise.all([
        apiFetch<{ items: PackageItem[] }>("/api/admin/packages"),
        apiFetch<{ items: SlotItem[] }>("/api/admin/class-slots"),
        apiFetch<{ items: StudentItem[]; total: number }>("/api/admin/students"),
      ]);
      setPackages(packagesRes.items ?? []);
      setSlots(slotsRes.items ?? []);
      setStudents(studentsRes.items ?? []);
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

  // --- Not logged in: full-screen photo + login card ---
  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <Image
          src="/photos/nosotros_hero.jpg"
          alt="Admin"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 w-full max-w-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Panel de administración</h1>
              <p className="text-sm text-black/50 mt-1">Acceso restringido a administradores.</p>
            </div>
            <Button
              className="w-full h-12 rounded-xl font-semibold bg-[var(--color-primary-900)] hover:bg-[var(--color-primary-700)] text-white flex items-center justify-center gap-3"
              onClick={() => void loginWithGoogle()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Entrar con Google
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Logged in: clean dashboard ---
  return (
    <div className="min-h-screen bg-[var(--color-background-default)] pb-20 pt-10">
      <div className="container-site space-y-10">

        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--color-primary-900)] text-white rounded-2xl px-6 py-5">
          <div>
            <p className="text-sm text-white/50 mb-0.5">Sesión iniciada</p>
            <p className="font-semibold truncate">{user.email ?? user.uid}</p>
          </div>
          <Button
            variant="outline"
            className="h-10 text-sm border-white/20 hover:bg-white/10 text-[var(--color-primary-900)] bg-white"
            onClick={() => void logout()}
          >
            Cerrar sesión
          </Button>
        </div>

        {message ? (
          <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-900 border border-emerald-500/20"
              : "bg-red-500/10 text-red-900 border border-red-500/20"
          }`}>
            {message.text}
          </div>
        ) : null}

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Paquetes activos", value: activePackagesCount },
            { label: "Horarios activos", value: activeSlotsCount },
            { label: "Reservas del horario", value: selectedSlotId ? bookings.length : 0 },
            { label: "Estudiantes", value: students.length },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-black/10 border-t-[3px] border-t-[var(--color-primary-500)] bg-white p-6 shadow-sm">
              <p className="text-sm text-black/40 mb-2">{stat.label}</p>
              <p className="text-5xl font-bold tracking-tighter text-[var(--color-primary-900)]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-10">
          <StudentsDatabaseView
            items={students}
            onAdjustCredits={async (purchaseId, delta) => {
              await apiFetch("/api/admin/students", {
                method: "PATCH",
                body: JSON.stringify({ purchaseId, delta }),
              });
              await loadAdminData();
              setMessage({ type: "success", text: "Créditos actualizados." });
            }}
          />

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

          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
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

            <div>
              {selectedSlotId ? (
                isLoadingBookings ? (
                  <div className="rounded-2xl border border-dashed border-black/20 p-8 text-center">
                    <p className="text-sm text-black/40">Cargando reservas...</p>
                  </div>
                ) : (
                  <div className="sticky top-24">
                    <SlotBookingsView items={bookings} />
                  </div>
                )
              ) : (
                <div className="sticky top-24 rounded-2xl border border-dashed border-black/20 p-8 text-center">
                  <p className="text-sm text-black/40">Selecciona un horario para ver sus reservas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
