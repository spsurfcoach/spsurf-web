// Remove unused import

type BookingItem = {
  id: string;
  userId: string;
  bookedAt: string;
  status: string;
};

export function SlotBookingsView({ items }: { items: BookingItem[] }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold uppercase">Reservas</h2>
        <p className="text-black/60 mt-2">Alumnos inscritos en el horario seleccionado.</p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-black text-white px-5 py-4 mb-6 shadow-md">
        <span className="font-bold uppercase tracking-wider text-sm text-white/70">Total Reservas</span>
        <span className="text-2xl font-bold">{items.length}</span>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/20 p-8 text-center text-black/60 font-medium">
            Sin reservas en este horario.
          </div>
        ) : (
          items.map((booking) => (
            <div key={booking.id} className="rounded-xl border border-black/10 p-4 transition-colors hover:bg-black/[0.02]">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-sm truncate" title={booking.userId}>
                    {booking.userId}
                  </p>
                  <div className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black text-white">
                    {booking.status}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-black/50 uppercase tracking-wide">
                  <span>Reservado el:</span>
                  <span>{new Date(booking.bookedAt).toLocaleString("es-PE", { 
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
