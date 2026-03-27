"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toCurrencyPEN } from "@/lib/utils";

type PackageItem = {
  id: string;
  name: string;
  type: "credits" | "unlimited";
  classCount?: number;
  durationDays?: number;
  price: number;
  isActive: boolean;
};

type Props = {
  items: PackageItem[];
  isLoading?: boolean;
  onCreate: (payload: {
    name: string;
    type: "credits" | "unlimited";
    classCount?: number;
    durationDays?: number;
    price: number;
  }) => Promise<void>;
  onToggle: (id: string, current: boolean) => Promise<void>;
};

export function PackagesCrud({ items, isLoading = false, onCreate, onToggle }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"credits" | "unlimited">("credits");
  const [price, setPrice] = useState("");
  const [classCount, setClassCount] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onCreate({
        name,
        type,
        price: Number(price),
        classCount: type === "credits" ? Number(classCount) : undefined,
        durationDays: type === "unlimited" ? Number(durationDays) : undefined,
      });
      setName("");
      setPrice("");
      setClassCount("");
      setDurationDays("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Gestión de paquetes</h2>
        <p className="text-sm text-black/50 mt-1">Crea y administra los planes que los estudiantes pueden comprar.</p>
      </div>

      <div className="space-y-8">
        <form className="space-y-6 rounded-xl bg-black/[0.02] p-6 border border-black/5" onSubmit={submit}>
          <h3 className="font-semibold text-sm text-black/50 mb-4">Crear nuevo paquete</h3>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-black/50">Nombre del paquete</p>
              <Input className="h-12 bg-white" placeholder="Ej: 4 clases" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-black/50">Precio en PEN</p>
              <Input
                className="h-12 bg-white"
                placeholder="Ej: 320"
                type="number"
                min={1}
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-black/50">Tipo</p>
              <div className="flex gap-2">
                <Button className="h-12 flex-1" type="button" variant={type === "credits" ? "primary" : "outline"} onClick={() => setType("credits")}>
                  Créditos
                </Button>
                <Button className="h-12 flex-1" type="button" variant={type === "unlimited" ? "primary" : "outline"} onClick={() => setType("unlimited")}>
                  Ilimitado
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {type === "credits" ? (
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm font-medium text-black/50">Número de clases</p>
                <Input
                  className="h-12 bg-white"
                  placeholder="Ej: 4"
                  type="number"
                  min={1}
                  value={classCount}
                  onChange={(event) => setClassCount(event.target.value)}
                  required
                />
                <p className="text-xs font-medium text-black/50 uppercase tracking-wide">Se descontará 1 crédito por reserva confirmada.</p>
              </div>
            ) : (
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm font-medium text-black/50">Duración (días)</p>
                <Input
                  className="h-12 bg-white"
                  placeholder="Ej: 30"
                  type="number"
                  min={1}
                  value={durationDays}
                  onChange={(event) => setDurationDays(event.target.value)}
                  required
                />
                <p className="text-xs font-medium text-black/50 uppercase tracking-wide">Reservas ilimitadas hasta la fecha de expiración.</p>
              </div>
            )}
            
            <div className="flex items-end justify-end">
              <Button type="submit" disabled={isSubmitting} className="h-12 w-full md:w-auto px-8 font-bold">
                {isSubmitting ? "Guardando..." : "Crear paquete"}
              </Button>
            </div>
          </div>
        </form>

        <div className="space-y-3">
          {isLoading ? (
            <div className="rounded-xl border border-dashed border-black/20 p-6 text-center">
              <p className="text-sm font-medium text-black/50 uppercase tracking-wider">Cargando paquetes...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/20 p-8 text-center">
              <p className="text-sm font-medium text-black/50 uppercase tracking-wider">No hay paquetes todavía. Crea el primero para habilitar compras.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((pkg) => (
                <div key={pkg.id} className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="space-y-2">
                      <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${pkg.isActive ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-600"}`}>
                        {pkg.isActive ? "Activo" : "Inactivo"}
                      </div>
                      <h3 className="text-xl font-bold uppercase">{pkg.name}</h3>
                      <p className="text-sm text-black/60 font-medium">
                        {pkg.type === "credits"
                          ? `${pkg.classCount ?? 0} clases`
                          : `Ilimitado ${pkg.durationDays ?? 0} días`}
                      </p>
                    </div>
                    <span className="text-xl font-bold tracking-tight">{toCurrencyPEN(Number(pkg.price))}</span>
                  </div>
                  <Button
                    variant={pkg.isActive ? "outline" : "primary"}
                    className="w-full h-11"
                    disabled={pendingToggleId === pkg.id}
                    onClick={async () => {
                      setPendingToggleId(pkg.id);
                      try {
                        await onToggle(pkg.id, pkg.isActive);
                      } finally {
                        setPendingToggleId(null);
                      }
                    }}
                  >
                    {pendingToggleId === pkg.id ? "Actualizando..." : pkg.isActive ? "Desactivar Paquete" : "Activar Paquete"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
