import { Button } from "@/components/ui/button";
import { ClassBalanceCard } from "@/components/booking/ClassBalanceCard";
import { UpcomingBookingsList } from "@/components/booking/UpcomingBookingsList";
import type { PurchaseDoc } from "@/lib/booking/types";

type BookingItem = {
  id: string;
  status: string;
  classSlot?: { startsAt?: string; location?: string } | null;
};

type PurchaseItem = {
  id: string;
  packageType?: "credits" | "unlimited" | null;
  remainingCredits?: number | null;
  expiresAt?: string | null;
  status: string;
  fulfillmentType?: PurchaseDoc["fulfillmentType"];
  itemType?: PurchaseDoc["itemType"];
  surftripId?: string;
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
  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
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
      <div className="border-t border-black/[0.06] p-0">
        <ClassBalanceCard purchases={purchases as unknown as PurchaseDoc[]} className="rounded-none shadow-none" />
      </div>
      <div className="border-t border-black/[0.06] p-6">
        <UpcomingBookingsList bookings={bookings} onCancel={onCancel} title="Próximas reservas" className="border-0 p-0 shadow-none" />
      </div>
    </div>
  );
}
