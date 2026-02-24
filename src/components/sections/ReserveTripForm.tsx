"use client";

import { FormEvent, useMemo, useState } from "react";
import { surfTrips } from "@/lib/content";

type Status = "idle" | "submitted";

export function ReserveTripForm() {
  const paymentUrl = process.env.NEXT_PUBLIC_MP_PAYMENT_URL ?? "#";
  const [status, setStatus] = useState<Status>("idle");
  const [selectedTrip, setSelectedTrip] = useState(surfTrips[0]?.name ?? "");
  const canOpenPayment = useMemo(() => paymentUrl !== "#", [paymentUrl]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitted");
  };

  return (
    <section id="reserva" className="section-space bg-zinc-900">
      <div className="container-site grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="ds-h2 text-white">Reserva tu surftrip</h2>
          <p className="ds-body-s text-zinc-300">
            Completa tus datos para separar tu cupo. Luego podras ir al link de pago para confirmar la reserva.
          </p>
          <ul className="space-y-2 ds-body-s text-zinc-400">
            <li>- Confirmacion de pre-reserva al instante.</li>
            <li>- Link de pago configurable con Mercado Pago.</li>
            <li>- Seguimiento personalizado en la siguiente fase backend.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/15 bg-zinc-950 p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required name="name" placeholder="Nombre completo" className="ds-input" />
              <input required type="email" name="email" placeholder="Email" className="ds-input" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <select
                name="trip"
                value={selectedTrip}
                onChange={(event) => setSelectedTrip(event.target.value)}
                className="ds-input"
              >
                {surfTrips.map((trip) => (
                  <option key={trip.name} value={trip.name}>
                    {trip.name}
                  </option>
                ))}
              </select>
              <input required type="date" name="date" className="ds-input" />
            </div>
            <textarea
              name="message"
              placeholder="Mensaje (nivel, objetivos, dudas)"
              rows={4}
              className="ds-input min-h-[112px] py-3"
            />
            <button type="submit" className="ds-btn ds-btn-secondary w-full">
              Enviar pre-reserva
            </button>
          </form>

          {status === "submitted" ? (
            <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 ds-body-s">
              <p className="font-semibold text-emerald-300">Pre-reserva enviada para {selectedTrip}.</p>
              <p className="mt-1 text-emerald-100">Siguiente paso: completa el pago para asegurar tu cupo.</p>
              <a
                href={paymentUrl}
                target="_blank"
                rel="noreferrer"
                className={`mt-3 inline-block ds-btn ${
                  canOpenPayment ? "bg-emerald-300 text-zinc-900" : "bg-zinc-700 text-zinc-300"
                }`}
              >
                {canOpenPayment ? "Ir al pago" : "Configura NEXT_PUBLIC_MP_PAYMENT_URL"}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}


