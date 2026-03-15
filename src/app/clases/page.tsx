"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { ClassSlotList } from "@/components/booking/ClassSlotList";
import { MyBookings } from "@/components/booking/MyBookings";
import { PackageList } from "@/components/booking/PackageList";
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
};

type BookingItem = {
  id: string;
  status: string;
  classSlot?: { startsAt?: string } | null;
};

type PurchaseItem = {
  id: string;
  packageType: "credits" | "unlimited";
  remainingCredits?: number | null;
  expiresAt?: string | null;
  status: string;
};

export default function ClasesPage() {
  const { user, loading, loginWithGoogle, loginWithEmail, signupWithEmail, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

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
    const [bookingsRes, purchasesRes] = await Promise.all([
      apiFetch<{ items: BookingItem[] }>("/api/me/bookings"),
      apiFetch<{ items: PurchaseItem[] }>("/api/me/purchases"),
    ]);
    setBookings(bookingsRes.items ?? []);
    setPurchases(purchasesRes.items ?? []);
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

  const hasAuth = useMemo(() => !!user, [user]);

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Hero Header with Image */}
      <div className="relative w-full h-[40vh] min-h-[350px] mb-12">
        <Image
          src="/photos/servicios_hero.jpg"
          alt="Clases de Surf"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-4">Clases y Reservas</h1>
          <p className="text-lg max-w-xl text-white/90">
            Compra un paquete, confirma el pago y reserva tus clases de surf con SP Surf Coach.
          </p>
        </div>
      </div>

      <div className="container-site">
        {!loading && !hasAuth ? (
          <div className="mx-auto max-w-md rounded-[32px] bg-white p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)] space-y-8 -mt-24 relative z-10 border border-black/[0.03]">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold uppercase tracking-widest">Inicia sesión</h2>
              <p className="text-sm text-black/60 font-medium px-4">Para comprar paquetes y reservar clases necesitas acceder a tu cuenta.</p>
            </div>
            
            <div className="grid gap-5">
              <div className="space-y-4">
                <Input 
                  className="h-14 bg-black/[0.03] border-transparent px-5 rounded-2xl focus-visible:ring-black/20 focus-visible:bg-white transition-colors" 
                  placeholder="Correo electrónico" 
                  value={email} 
                  onChange={(event) => setEmail(event.target.value)} 
                />
                <Input
                  className="h-14 bg-black/[0.03] border-transparent px-5 rounded-2xl focus-visible:ring-black/20 focus-visible:bg-white transition-colors"
                  placeholder="Contraseña"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button className="w-full h-14 rounded-2xl text-base font-bold bg-black hover:bg-black/80 text-white transition-colors" onClick={() => void loginWithEmail(email, password)}>
                  Entrar
                </Button>
                <Button className="w-full h-14 rounded-2xl text-base font-bold border-2 border-black/10 hover:bg-black/[0.03] hover:border-black/20 transition-all" variant="outline" onClick={() => void signupWithEmail(email, password)}>
                  Registrarse
                </Button>
              </div>
            </div>
            
            <div className="relative flex items-center py-2">
              <div className="grow border-t border-black/10"></div>
              <span className="shrink-0 px-5 text-[11px] font-bold uppercase tracking-widest text-black/40">O</span>
              <div className="grow border-t border-black/10"></div>
            </div>
            
            <Button className="w-full h-14 rounded-2xl text-base font-bold border-2 border-black/10 hover:bg-black/[0.03] hover:border-black/20 transition-all flex items-center justify-center gap-3" variant="outline" onClick={() => void loginWithGoogle()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </Button>
          </div>
        ) : null}

        {message ? <div className="mb-8 rounded-xl bg-black text-white px-4 py-3">{message}</div> : null}

        {hasAuth ? (
          <div className="flex flex-col gap-12 lg:flex-row">
            {/* Main content - Left Column */}
            <div className="flex-1 space-y-16">
              <section className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold uppercase">Paquetes Disponibles</h2>
                  <p className="text-black/60">Elige el plan que mejor se adapte a tus objetivos.</p>
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

              <section className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold uppercase">Reserva tu Clase</h2>
                  <p className="text-black/60">Selecciona un día para ver los horarios disponibles y asegurar tu lugar.</p>
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
            </div>

            {/* Sidebar - Right Column */}
            <aside className="w-full lg:w-[350px] xl:w-[400px]">
              <div className="sticky top-24 space-y-8">
                <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
                  <h2 className="text-2xl font-bold uppercase">Mi Perfil</h2>
                  <p className="text-black/60 truncate">{user?.email ?? user?.uid}</p>
                  <Button variant="outline" className="w-full h-11" onClick={() => void logout()}>
                    Cerrar sesión
                  </Button>
                </div>

                <MyBookings bookings={bookings} purchases={purchases} />
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </div>
  );
}
