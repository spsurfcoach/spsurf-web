"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

type BookingItem = {
  id: string;
  status: string;
  classSlot?: { startsAt?: string; location?: string } | null;
};

type Props = {
  bookings: BookingItem[];
  onCancel?: (bookingId: string) => Promise<void>;
  title?: string;
  className?: string;
};

export function UpcomingBookingsList({
  bookings,
  onCancel,
  title = "Proximas reservas",
  className = "",
}: Props) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const { upcomingBookings, historyBookings } = useMemo(() => {
    const now = Date.now();

    const withStartsAt = bookings
      .map((booking) => ({
        booking,
        startsAtMs: booking.classSlot?.startsAt ? new Date(booking.classSlot.startsAt).getTime() : null,
      }))
      .filter((item) => item.startsAtMs !== null && !Number.isNaN(item.startsAtMs));

    const upcoming = withStartsAt
      .filter((item) => item.booking.status !== "cancelled" && (item.startsAtMs as number) > now)
      .sort((a, b) => (a.startsAtMs as number) - (b.startsAtMs as number))
      .slice(0, 3)
      .map((item) => item.booking);

    const history = withStartsAt
      .filter((item) => item.booking.status === "cancelled" || (item.startsAtMs as number) <= now)
      .sort((a, b) => (b.startsAtMs as number) - (a.startsAtMs as number))
      .map((item) => item.booking);

    return {
      upcomingBookings: upcoming,
      historyBookings: history,
    };
  }, [bookings]);

  function renderBookingRow(booking: BookingItem) {
    const startsAt = booking.classSlot?.startsAt ? new Date(booking.classSlot.startsAt) : null;
    const hoursUntil = startsAt ? (startsAt.getTime() - Date.now()) / (1000 * 60 * 60) : null;
    const canCancel = booking.status !== "cancelled" && (hoursUntil === null || hoursUntil >= 12);

    return (
      <div
        key={booking.id}
        className="flex items-center justify-between gap-4 border-b border-black/5 pb-3 last:border-0 last:pb-0"
      >
        <div>
          <p className="text-sm font-semibold">
            {booking.classSlot?.startsAt ? formatDateTime(booking.classSlot.startsAt) : "Horario pendiente"}
          </p>
          {booking.classSlot?.location ? (
            <p className="mt-0.5 text-xs text-black/50">{booking.classSlot.location}</p>
          ) : null}
          <p className="mt-0.5 text-xs text-black/30">{booking.status}</p>
        </div>
        {onCancel && booking.status !== "cancelled" ? (
          canCancel ? (
            <Button
              variant="outline"
              className="h-8 shrink-0 border-red-200 px-3 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
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
            <span className="shrink-0 text-xs text-black/30">Sin cancelacion</span>
          )
        ) : null}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-black/10 bg-white px-6 py-5 shadow-sm ${className}`.trim()}>
      <p className="mb-4 text-base font-semibold">{title}</p>
      <div className="space-y-3">
        {upcomingBookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 p-5 text-center">
            <p className="text-sm text-black/40">No tienes reservas proximas</p>
          </div>
        ) : (
          upcomingBookings.map((booking) => renderBookingRow(booking))
        )}
      </div>

      {historyBookings.length > 0 ? (
        <div className="mt-5 border-t border-black/8 pt-4">
          <button
            type="button"
            onClick={() => setHistoryOpen((current) => !current)}
            className="flex w-full items-center justify-between rounded-xl px-1 py-2 text-left text-sm font-medium text-black/60 transition-colors hover:text-black"
          >
            <span>Ver reservas pasadas</span>
            {historyOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {historyOpen ? (
            <div className="mt-3 space-y-3">
              {historyBookings.map((booking) => renderBookingRow(booking))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
