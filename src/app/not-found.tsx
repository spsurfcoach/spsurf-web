import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center px-4 py-20 text-center sm:px-6 md:px-10 lg:px-16">
      <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">ERROR 404</p>
      <h1 className="ds-h1 mt-4 max-w-xl tracking-[-0.04em]">Página no encontrada</h1>
      <p className="ds-body-s mt-5 max-w-md text-[var(--color-text-default)]/60">
        La dirección que buscas no existe o fue movida. Explora nuestros surfcamps, servicios o reserva una clase.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="ds-btn ds-btn-primary ds-btn-lg">
          Inicio
        </Link>
        <Link href="/surfcamps" className="ds-btn ds-btn-secondary ds-btn-lg">
          Surfcamps
        </Link>
        <Link href="/servicios" className="ds-btn ds-btn-secondary ds-btn-lg">
          Servicios
        </Link>
        <Link href="/clases?tab=reservar" className="ds-btn ds-btn-secondary ds-btn-lg">
          Reservar clase
        </Link>
      </div>
    </div>
  );
}
