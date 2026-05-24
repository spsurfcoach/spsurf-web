"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { ProfileForm } from "@/components/booking/ProfileForm";
import { PROFILE_SECTIONS, type ProfileSectionId } from "@/components/booking/profileSections";
import { UpcomingBookingsList } from "@/components/booking/UpcomingBookingsList";
import { MisComprasList } from "@/components/booking/MisComprasList";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import { getActiveClassPurchase } from "@/lib/booking/guards";
import type { UserProfileDoc, PurchaseDoc } from "@/lib/booking/types";

type BookingItem = {
  id: string;
  status: string;
  classSlot?: { startsAt?: string; location?: string } | null;
};

type ActiveTab = "reservas" | "datos" | "mis-compras";

const TABS: { id: ActiveTab; label: string }[] = [
  { id: "reservas", label: "Reservas" },
  { id: "datos", label: "Datos" },
  { id: "mis-compras", label: "Mis Compras" },
];

function getInitialTab(context: string | null): ActiveTab {
  if (context === "reservar" || context === "post-payment") {
    return "datos";
  }
  return "reservas";
}

function ClasesProfilePageContent() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [profile, setProfile] = useState<Partial<UserProfileDoc> | null | undefined>(undefined);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [purchases, setPurchases] = useState<(PurchaseDoc & { id: string })[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const context = searchParams.get("context");
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => getInitialTab(context));
  const [activeSection, setActiveSection] = useState<ProfileSectionId>("datos-personales");

  const returnTo = useMemo(() => {
    const candidate = searchParams.get("returnTo");
    return candidate && candidate.startsWith("/") ? candidate : "/clases";
  }, [searchParams]);

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      const [profileRes, bookingsRes, purchasesRes] = await Promise.all([
        apiFetch<{ profile: Partial<UserProfileDoc> | null }>("/api/me/profile"),
        apiFetch<{ items: BookingItem[] }>("/api/me/bookings"),
        apiFetch<{ items: (PurchaseDoc & { id: string })[] }>("/api/me/purchases"),
      ]);
      setProfile(profileRes.profile ?? null);
      setBookings(bookingsRes.items ?? []);
      setPurchases(purchasesRes.items ?? []);
    } catch {
      setProfile(null);
      setMessage("No se pudo cargar tu perfil. Puedes volver a guardarlo desde aquí.");
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/clases");
      return;
    }
    if (!user) return;
    void loadData();
  }, [loading, router, user, loadData]);

  // Intersection observer for scroll-linked section nav (only active on "datos" tab)
  useEffect(() => {
    if (activeTab !== "datos" || profile === undefined) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-profile-section]"));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const nextSection = visible.target.getAttribute("data-profile-section");
        if (nextSection) {
          setActiveSection(nextSection as ProfileSectionId);
        }
      },
      { rootMargin: "-18% 0px -55% 0px", threshold: [0.2, 0.45, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [activeTab, profile]);

  const contextMessage = useMemo(() => {
    if (context === "reservar") {
      return "Para reservar una clase necesitas completar tu perfil de alumno primero.";
    }
    if (context === "post-payment") {
      return "Tu compra fue registrada. Completa tu perfil para poder seguir con tus reservas.";
    }
    return undefined;
  }, [context]);

  const activePurchase = useMemo(() => getActiveClassPurchase(purchases), [purchases]);

  if (loading || !user || profile === undefined) {
    return (
      <div className="min-h-screen bg-[var(--color-background-default)] px-4 py-16 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-black/10 bg-white px-6 py-10 text-sm text-black/50 shadow-sm">
          Cargando perfil...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--color-background-default)] px-4 py-8 sm:px-6 sm:py-10 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl min-w-0 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-[0.18em] text-black/40">Área de clases</p>
            <h1 className="mt-2 text-2xl font-bold text-black sm:text-3xl">
              {user.displayName ? `Hola, ${user.displayName.split(" ")[0]}` : "Mi perfil"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-black/55">
              Organiza tu ficha en secciones para actualizar tus datos rápidamente.
            </p>
            <p className="mt-3 truncate text-sm text-black/45">{user.email ?? user.uid}</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3">
            <Button asChild variant="outline" className="w-full rounded-full px-5 sm:w-auto">
              <Link href={returnTo}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {context === "reservar" ? "Volver a reservar" : "Volver a clases"}
              </Link>
            </Button>
            <Button variant="outline" className="w-full rounded-full px-5 sm:w-auto" onClick={() => void logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>

        {message ? (
          <div className="rounded-xl bg-black px-4 py-3 text-sm text-white">{message}</div>
        ) : null}

        <div className="grid min-w-0 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
              {/* Main tabs */}
              <div className="mb-2 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">Menú</p>
              </div>
              <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-xl px-3 py-3 text-center text-sm font-medium transition-colors sm:px-4 lg:text-left ${
                      activeTab === tab.id
                        ? "bg-[var(--color-primary-900)] text-white"
                        : "text-black/55 hover:bg-black/[0.04] hover:text-black"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Datos sub-nav: desktop only — form sections are scrollable on mobile */}
              {activeTab === "datos" ? (
                <div className="mt-3 hidden border-t border-black/8 pt-3 lg:block">
                  <div className="mb-1 px-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/25">Secciones</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {PROFILE_SECTIONS.map((section) => (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => {
                          setActiveSection(section.id);
                          document
                            .getElementById(section.id)
                            ?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                          activeSection === section.id
                            ? "bg-black/[0.07] text-black"
                            : "text-black/45 hover:bg-black/[0.04] hover:text-black/70"
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </aside>

          {/* Tab content */}
          <main className="min-w-0">
            {activeTab === "reservas" ? (
              <div className="space-y-5">
                {/* Credits card */}
                <div className="rounded-2xl border border-black/10 bg-white px-6 py-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
                    Créditos disponibles
                  </p>
                  <div className="mt-2 flex items-end gap-2">
                    <p className="text-4xl font-bold leading-none text-black">
                      {activePurchase
                        ? activePurchase.packageType === "credits"
                          ? (activePurchase.remainingCredits ?? 0)
                          : "∞"
                        : "0"}
                    </p>
                    <p className="pb-1 text-sm text-black/45">
                      {activePurchase?.packageType === "unlimited" ? "plan ilimitado" : activePurchase?.packageType === "subscription" ? "membresía activa" : "créditos"}
                    </p>
                  </div>
                </div>

                {/* Bookings */}
                <UpcomingBookingsList
                  bookings={bookings}
                  onCancel={async (bookingId) => {
                    await apiFetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
                    setMessage("Reserva cancelada. Tu crédito ha sido devuelto.");
                    void loadData();
                  }}
                />
              </div>
            ) : activeTab === "datos" ? (
              <ProfileForm
                initialData={profile}
                userEmail={user.email ?? ""}
                onSave={async (data) => {
                  await apiFetch("/api/me/profile", {
                    method: "PATCH",
                    body: JSON.stringify(data),
                  });
                  setProfile(data);
                  if (context && returnTo) {
                    router.replace(returnTo);
                    return;
                  }
                  setMessage("Perfil guardado correctamente.");
                }}
                contextMessage={contextMessage}
                title="Completa tu perfil"
                description="Tu información de alumno se usa para reservas, seguimiento y seguridad."
                submitLabel={context ? "Guardar y continuar" : "Guardar perfil"}
              />
            ) : (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-black">Mis Compras</h2>
                  <p className="mt-1 text-sm text-black/50">Historial de tus paquetes y membresías adquiridas.</p>
                </div>
                <MisComprasList purchases={purchases} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ClasesProfilePage() {
  return (
    <Suspense>
      <ClasesProfilePageContent />
    </Suspense>
  );
}
