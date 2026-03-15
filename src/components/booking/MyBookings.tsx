import { formatDateTime } from "@/lib/utils";

type BookingItem = {
  id: string;
  status: string;
  classSlot?: {
    startsAt?: string;
  } | null;
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
};

export function MyBookings({ bookings, purchases }: Props) {
  const activePurchase = purchases.find((item) => item.status === "approved");

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-black/10 bg-black text-white p-6 sm:p-8 shadow-md">
        <h2 className="text-2xl font-bold uppercase mb-4 text-white/90">Tu Saldo</h2>
        {activePurchase ? (
          <div className="space-y-2">
            <p className="text-5xl font-bold tracking-tighter">
              {activePurchase.packageType === "credits" ? `${activePurchase.remainingCredits ?? 0}` : "∞"}
            </p>
            <p className="text-white/70 font-medium uppercase tracking-wide text-sm">
              {activePurchase.packageType === "credits" ? "Créditos disponibles" : "Plan ilimitado activo"}
            </p>
            {activePurchase.packageType === "unlimited" && (
              <p className="text-sm text-white/50 mt-4 border-t border-white/10 pt-4">
                Válido hasta: {activePurchase.expiresAt ? new Date(activePurchase.expiresAt).toLocaleDateString("es-PE") : "Sin fecha"}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-5xl font-bold tracking-tighter text-white/30">0</p>
            <p className="text-white/50 font-medium uppercase tracking-wide text-sm">Créditos disponibles</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-bold uppercase mb-6">Próximas Reservas</h2>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-black/60">No tienes reservas todavía.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between border-b border-black/5 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-bold text-lg">
                    {booking.classSlot?.startsAt ? formatDateTime(booking.classSlot.startsAt) : "Horario pendiente"}
                  </p>
                  <p className="text-sm font-medium uppercase tracking-wider text-black/40 mt-1">
                    Estado: <span className="text-black/70">{booking.status}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
