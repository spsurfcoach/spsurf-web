"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { ClassSlotList } from "@/components/booking/ClassSlotList";
import { PackageList } from "@/components/booking/PackageList";
import { UpcomingBookingsList } from "@/components/booking/UpcomingBookingsList";
import { getActiveClassPurchase } from "@/lib/booking/guards";
import type { ProductDoc, PurchaseDoc, UserProfileDoc } from "@/lib/booking/types";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api-client";
import { isProfileComplete } from "@/lib/booking/profile";

type ClassesTab = "comprar" | "reservar";

type ProductItem = ProductDoc & {
  id: string;
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

type PurchaseItem = PurchaseDoc & {
  id: string;
};

function getTab(value: string | null): ClassesTab {
  return value === "reservar" ? "reservar" : "comprar";
}

type FlashVariant = "success" | "error" | "neutral";

type FlashBanner = { variant: FlashVariant; text: string };

function getPaymentBanner(status: string | null): FlashBanner | null {
  switch (status) {
    case "success":
      return {
        variant: "success",
        text: "Pago confirmado. Tu compra aparecera en tu cuenta en cuanto se procese el webhook.",
      };
    case "failure":
      return {
        variant: "error",
        text: "No se pudo completar el pago. Intentalo nuevamente.",
      };
    case "pending":
      return {
        variant: "neutral",
        text: "Tu pago esta pendiente de confirmacion.",
      };
    default:
      return null;
  }
}

function FlashBanner({ variant, text }: FlashBanner) {
  const Icon = variant === "success" ? CheckCircle2 : variant === "error" ? XCircle : Info;
  const iconClass =
    variant === "success" ? "text-emerald-600" : variant === "error" ? "text-red-600" : "text-black/45";
  const wrapClass =
    variant === "success"
      ? "border border-emerald-200/80 bg-emerald-50"
      : variant === "error"
        ? "border border-red-200/80 bg-red-50"
        : "border border-black/10 bg-white";

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm text-black ${wrapClass}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} aria-hidden />
      <span className="min-w-0 flex-1 leading-snug">{text}</span>
    </div>
  );
}

function buildProfileHref(tab: ClassesTab, context?: "reservar" | "post-payment") {
  const params = new URLSearchParams({
    returnTo: `/clases?tab=${tab}`,
  });

  if (context) {
    params.set("context", context);
  }

  return `/clases/perfil?${params.toString()}`;
}

function ClasesPageContent() {
  const { user, loading, loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = getTab(searchParams.get("tab"));
  const paymentStatus = searchParams.get("payment");
  const highlightProductId = searchParams.get("product");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [banner, setBanner] = useState<FlashBanner | null>(null);
  const [profile, setProfile] = useState<Partial<UserProfileDoc> | null | undefined>(undefined);

  const loadPublicData = useCallback(async () => {
    const [productsRes, slotsRes] = await Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/class-slots").then((res) => res.json()),
    ]);

    setProducts(productsRes.items ?? []);
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
  }, [loadPrivateData, user]);

  const hasAuth = !!user;
  const profileComplete = isProfileComplete(profile);
  const paymentBanner = useMemo(() => getPaymentBanner(paymentStatus), [paymentStatus]);
  const displayBanner = banner ?? paymentBanner;
  const activePurchase = getActiveClassPurchase(purchases);

  useEffect(() => {
    if (activeTab !== "reservar" || profile === undefined || profileComplete) return;
    router.replace(buildProfileHref("reservar", "reservar"));
  }, [activeTab, profile, profileComplete, router]);

  function goToTab(tab: ClassesTab) {
    if (tab === "reservar" && !profileComplete) {
      router.push(buildProfileHref("reservar", "reservar"));
      return;
    }

    setBanner(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    params.delete("payment");
    router.replace(`/clases?${params.toString()}`);
  }

  if (!loading && !hasAuth) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <Image src="/photos/servicios_hero.jpg" alt="Coaching de surf" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 w-full max-w-sm">
          <div className="space-y-6 rounded-2xl bg-white p-8 shadow-2xl">
            <div>
              <h1 className="text-2xl font-bold">Accede a tu cuenta</h1>
              <p className="mt-1 text-sm text-black/50">Reserva clases y gestiona tus compras.</p>
            </div>

            <div className="space-y-3">
              <Input
                className="h-12 rounded-xl border-transparent bg-black/[0.03] px-4 transition-colors focus-visible:bg-white focus-visible:ring-black/20"
                placeholder="Correo electronico"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Input
                className="h-12 rounded-xl border-transparent bg-black/[0.03] px-4 transition-colors focus-visible:bg-white focus-visible:ring-black/20"
                placeholder="Contrasena"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                className="h-12 flex-1 rounded-xl bg-[var(--color-primary-900)] font-semibold text-white transition-colors hover:bg-[var(--color-primary-700)]"
                onClick={() => void loginWithEmail(email, password)}
              >
                Entrar
              </Button>
              <Button
                className="h-12 flex-1 rounded-xl border border-black/15 font-semibold transition-colors hover:bg-black/[0.03]"
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
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-black/15 font-semibold transition-colors hover:bg-black/[0.03]"
              variant="outline"
              onClick={() => void loginWithGoogle()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar con Google
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <Image src="/photos/servicios_hero.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-default)] pb-20 pt-10">
      <div className="container-site space-y-6">
        {displayBanner ? <FlashBanner variant={displayBanner.variant} text={displayBanner.text} /> : null}

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1 rounded-xl bg-black/[0.04] p-1">
            {(["comprar", "reservar"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => goToTab(tab)}
                className={`rounded-lg px-6 py-2.5 text-sm font-medium capitalize transition-all ${
                  activeTab === tab ? "bg-white text-black shadow-sm" : "text-black/50 hover:text-black"
                }`}
              >
                {tab === "comprar" ? "Comprar" : "Reservar"}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "comprar" ? (
          <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Tu tienda de surf</h2>
                <p className="mt-1 text-sm text-black/50">
                  Elige tu plan, asegura tu cupo en el proximo surfcamp o suma clases sueltas. Todo en un solo lugar.
                </p>
              </div>
              <a
                href="/servicios#clases"
                className="shrink-0 rounded-full border border-black/20 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
              >
                Conoce más
              </a>
            </div>
            <PackageList
              items={products}
              highlightProductId={highlightProductId}
              onCheckout={async (productId) => {
                const response = await apiFetch<{ initPoint?: string; sandboxInitPoint?: string }>("/api/checkout", {
                  method: "POST",
                  body: JSON.stringify({ productId }),
                });
                const checkoutUrl = response.initPoint ?? response.sandboxInitPoint;
                if (checkoutUrl) {
                  window.location.href = checkoutUrl;
                } else {
                  setBanner({ variant: "error", text: "No se pudo obtener la URL de checkout." });
                }
              }}
            />
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Reserva tu clase</h2>
                <p className="mt-1 text-sm text-black/50">Revisa tus proximas reservas y asegura tu siguiente lugar.</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-sm sm:min-w-[220px]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">Creditos disponibles</p>
                <div className="mt-2 flex items-end gap-2">
                  <p className="text-3xl font-bold leading-none text-black">
                    {activePurchase ? (activePurchase.packageType === "credits" ? activePurchase.remainingCredits ?? 0 : "∞") : "0"}
                  </p>
                  <p className="pb-0.5 text-sm text-black/45">
                    {activePurchase?.packageType === "unlimited" ? "plan ilimitado" : "creditos"}
                  </p>
                </div>
              </div>
            </div>
            <UpcomingBookingsList
              bookings={bookings}
              onCancel={async (bookingId) => {
                try {
                  await apiFetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
                  setBanner({ variant: "success", text: "Reserva cancelada. Tu clase ha sido devuelta." });
                  await loadPrivateData();
                } catch (error) {
                  setBanner({
                    variant: "error",
                    text: error instanceof Error ? error.message : "No se pudo cancelar la reserva.",
                  });
                }
              }}
            />
            <ClassSlotList
              items={slots}
              onBook={async (slotId) => {
                if (!profileComplete) {
                  router.push(buildProfileHref("reservar", "reservar"));
                  return;
                }

                try {
                  await apiFetch("/api/bookings", {
                    method: "POST",
                    body: JSON.stringify({ classSlotId: slotId }),
                  });
                  setBanner({ variant: "success", text: "Reserva confirmada exitosamente." });
                  await Promise.all([loadPublicData(), loadPrivateData()]);
                } catch (error) {
                  setBanner({
                    variant: "error",
                    text: error instanceof Error ? error.message : "No se pudo reservar.",
                  });
                }
              }}
            />
          </section>
        )}
      </div>
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
