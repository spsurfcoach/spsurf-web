"use client";

import { useEffect, useMemo, useState, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ClassSlotList } from "@/components/booking/ClassSlotList";
import { MyBookings } from "@/components/booking/MyBookings";
import { PackageList } from "@/components/booking/PackageList";
import { ProfileModal } from "@/components/booking/ProfileModal";
import type { UserProfileDoc } from "@/lib/booking/types";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api-client";


type PackageItem = {
  id: string;
  name: string;
  type: "credits" | "unlimited";
  classCount?: number;
  durationDays?: number;
  price: number;
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
  status: string;
  classSlot?: { startsAt?: string; location?: string } | null;
};

type PurchaseItem = {
  id: string;
  packageType: "credits" | "unlimited";
  remainingCredits?: number | null;
  expiresAt?: string | null;
  status: string;
};

function ClasesPageContent() {
  const { user, loading, loginWithGoogle, loginWithEmail, signupWithEmail, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"comprar" | "reservar">("comprar");
  const [profileOpen, setProfileOpen] = useState(false);
  // undefined = not yet loaded; null = loaded but no profile exists
  const [profile, setProfile] = useState<Partial<UserProfileDoc> | null | undefined>(undefined);
  const autoOpenedRef = useRef(false);

  const loadPublicData = useCallback(async () => {
    const [pkgRes, slotsRes] = await Promise.all([
      fetch("/api/packages").then((res) => res.json()),
      fetch("/api/class-slots").then((res) => res.json()),
    ]);
    setPackages(pkgRes.items ?? []);
    setSlots(slotsRes.items ?? []);
  }, []);

  const loadPrivateData = useCallback(async () => {
    if (!user) return;
    const [bookingsRes, purchasesRes, profileRes] = await Promise.all([
      apiFetch<{ items: BookingItem[] }>("/api/me/bookings"),
      apiFetch<{ items: PurchaseItem[] }>("/api/me/purchases"),
      apiFetch<{ profile: Partial<UserProfileDoc> | null }>("/api/me/profile"),
    ]);
    setBookings(bookingsRes.items ?? []);
    setPurchases(purchasesRes.items ?? []);
    setProfile(profileRes.profile ?? null);
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPublicData();
  }, [loadPublicData]);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPrivateData();
  }, [user, loadPrivateData]);

  // After payment success: auto-open profile modal if profile is not yet complete
  useEffect(() => {
    if (paymentStatus === "success" && profile === null && !autoOpenedRef.current) {
      autoOpenedRef.current = true;
      setProfileOpen(true);
    }
  }, [paymentStatus, profile]);

  const hasAuth = useMemo(() => !!user, [user]);

  // --- Not logged in: full-screen photo + login card ---
  if (!loading && !hasAuth) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <Image
          src="/photos/servicios_hero.jpg"
          alt="Clases de Surf"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 w-full max-w-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Accede a tu cuenta</h1>
              <p className="text-sm text-black/50 mt-1">Reserva clases y gestiona tus paquetes.</p>
            </div>

            <div className="space-y-3">
              <Input
                className="h-12 bg-black/[0.03] border-transparent px-4 rounded-xl focus-visible:ring-black/20 focus-visible:bg-white transition-colors"
                placeholder="Correo electrónico"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Input
                className="h-12 bg-black/[0.03] border-transparent px-4 rounded-xl focus-visible:ring-black/20 focus-visible:bg-white transition-colors"
                placeholder="Contraseña"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 h-12 rounded-xl font-semibold bg-[var(--color-primary-900)] hover:bg-[var(--color-primary-700)] text-white transition-colors"
                onClick={() => void loginWithEmail(email, password)}
              >
                Entrar
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl font-semibold border border-black/15 hover:bg-black/[0.03] transition-colors"
                variant="outline"
                onClick={() => void signupWithEmail(email, password)}
              >
                Registrarse
              </Button>
            </div>

            <div className="relative flex items-center">
              <div className="grow border-t border-black/10" />
              <span className="shrink-0 px-4 text-xs text-black/40">o</span>
              <div className="grow border-t border-black/10" />
            </div>

            <Button
              className="w-full h-12 rounded-xl font-semibold border border-black/15 hover:bg-black/[0.03] transition-colors flex items-center justify-center gap-3"
              variant="outline"
              onClick={() => void loginWithGoogle()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Loading state ---
  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <Image src="/photos/servicios_hero.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    );
  }

  // --- Logged in: clean content page ---
  return (
    <div className="min-h-screen bg-[var(--color-background-default)] pb-20 pt-10">
      <div className="container-site">
        {message ? (
          <div className="mb-8 rounded-xl bg-black text-white px-4 py-3 text-sm">{message}</div>
        ) : null}

        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Main content */}
          <div className="flex-1 space-y-8">
            {/* Tab switcher */}
            <div className="flex gap-1 rounded-xl bg-black/[0.04] p-1 w-fit">
              {(["comprar", "reservar"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? "bg-white shadow-sm text-black"
                      : "text-black/50 hover:text-black"
                  }`}
                >
                  {tab === "comprar" ? "Comprar" : "Reservar"}
                </button>
              ))}
            </div>

            {activeTab === "comprar" && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Planes y paquetes</h2>
                </div>
                <PackageList
                  items={packages}
                  onCheckout={async (packageId) => {
                    const response = await apiFetch<{ initPoint?: string; sandboxInitPoint?: string }>("/api/checkout", {
                      method: "POST",
                      body: JSON.stringify({ packageId }),
                    });
                    const checkoutUrl = response.initPoint ?? response.sandboxInitPoint;
                    if (checkoutUrl) {
                      window.location.href = checkoutUrl;
                    } else {
                      setMessage("No se pudo obtener la URL de checkout.");
                    }
                  }}
                />
              </section>
            )}

            {activeTab === "reservar" && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Reserva tu clase</h2>
                  <p className="text-sm text-black/50 mt-1">Selecciona un día y asegura tu lugar.</p>
                </div>
                <ClassSlotList
                  items={slots}
                  onBook={async (slotId) => {
                    try {
                      await apiFetch("/api/bookings", {
                        method: "POST",
                        body: JSON.stringify({ classSlotId: slotId }),
                      });
                      setMessage("Reserva confirmada exitosamente.");
                      await Promise.all([loadPublicData(), loadPrivateData()]);
                    } catch (error) {
                      setMessage(error instanceof Error ? error.message : "No se pudo reservar.");
                    }
                  }}
                />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[340px] xl:w-[380px]">
            <div className="sticky top-24">
              <MyBookings
                bookings={bookings}
                purchases={purchases}
                userEmail={user?.email ?? user?.uid}
                onLogout={() => void logout()}
                onEditProfile={() => setProfileOpen(true)}
                onCancel={async (bookingId) => {
                  try {
                    await apiFetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
                    setMessage("Reserva cancelada. Tu clase ha sido devuelta.");
                    await loadPrivateData();
                  } catch (error) {
                    setMessage(error instanceof Error ? error.message : "No se pudo cancelar la reserva.");
                  }
                }}
              />
            </div>
          </aside>
        </div>
      </div>

      <ProfileModal
        open={profileOpen}
        initialData={profile ?? null}
        userEmail={user?.email ?? ""}
        onClose={() => setProfileOpen(false)}
        onSave={async (data) => {
          await apiFetch("/api/me/profile", {
            method: "PATCH",
            body: JSON.stringify(data),
          });
          setProfile(data);
          setProfileOpen(false);
          if (paymentStatus === "success") {
            router.replace("/clases");
          }
        }}
      />
    </div>
  );
}

export default function ClasesPage() {
  return (
    <Suspense>
      <ClasesPageContent />
    </Suspense>
  );
}
