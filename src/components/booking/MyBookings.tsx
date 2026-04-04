import { useState } from "react";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

type Props = {
  bookings: BookingItem[];
  purchases: PurchaseItem[];
  userEmail?: string;
  onLogout: () => void;
  onEditProfile?: () => void;
  onCancel?: (bookingId: string) => Promise<void>;
};

export function MyBookings({ bookings, purchases, userEmail, onLogout, onEditProfile, onCancel }: Props) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const activePurchase = purchases.find((item) => item.status === "approved");

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
      {/* Profile */}
      <div className="px-6 py-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-base">Mi perfil</p>
          <p className="text-sm text-black/50 truncate mt-0.5">{userEmail}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onEditProfile && (
            <Button variant="outline" className="h-9 text-sm px-3" onClick={onEditProfile}>
              Editar
            </Button>
          )}
          <Button variant="outline" className="h-9 text-sm px-4" onClick={onLogout}>
            Salir
          </Button>
        </div>
      </div>

      {/* Balance */}
      <div className="border-t border-black/[0.06] bg-[var(--color-primary-900)] px-6 py-5">
        <p className="text-sm text-white/60 mb-2">Tu saldo</p>
        <div className="flex items-end gap-3">
          <p className="text-4xl font-bold text-white leading-none">
            {activePurchase
              ? activePurchase.packageType === "credits"
                ? activePurchase.remainingCredits ?? 0
                : "∞"
              : "0"}
          </p>
          <p className="text-white/60 text-sm pb-0.5">
            {activePurchase?.packageType === "unlimited" ? "plan ilimitado" : "clases disponibles"}
          </p>
        </div>
        {activePurchase?.packageType === "unlimited" && activePurchase.expiresAt && (
          <p className="text-white/40 text-xs mt-3">
            Válido hasta {new Date(activePurchase.expiresAt).toLocaleDateString("es-PE")}
          </p>
        )}
      </div>

      {/* Bookings */}
      <div className="border-t border-black/[0.06] px-6 py-5">
        <p className="font-semibold text-base mb-4">Próximas reservas</p>
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/15 p-5 text-center">
              <p className="text-sm text-black/40">No tienes reservas todavía</p>
            </div>
          ) : (
            bookings.map((booking) => {
              const startsAt = booking.classSlot?.startsAt ? new Date(booking.classSlot.startsAt) : null;
              const hoursUntil = startsAt ? (startsAt.getTime() - Date.now()) / (1000 * 60 * 60) : null;
              const canCancel = booking.status !== "cancelled" && (hoursUntil === null || hoursUntil >= 12);

              return (
              <div key={booking.id} className="flex items-center justify-between border-b border-black/5 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-sm">
                    {booking.classSlot?.startsAt ? formatDateTime(booking.classSlot.startsAt) : "Horario pendiente"}
                  </p>
                  {booking.classSlot?.location && (
                    <p className="text-xs text-black/50 mt-0.5">{booking.classSlot.location}</p>
                  )}
                  <p className="text-xs text-black/30 mt-0.5">{booking.status}</p>
                </div>
                {onCancel && booking.status !== "cancelled" && (
                  canCancel ? (
                  <Button
                    variant="outline"
                    className="h-8 text-xs px-3 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 shrink-0"
                    disabled={cancellingId === booking.id}
                    onClick={async () => {
                      setCancellingId(booking.id);
                      try {
                        await onCancel(booking.id);
                      } finally {
                        setCancellingId(null);
                      }
                    }}
                  >
                    {cancellingId === booking.id ? "..." : "Cancelar"}
                  </Button>
                  ) : (
                    <span className="text-xs text-black/30 shrink-0">Sin cancelación</span>
                  )
                )}
              </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
