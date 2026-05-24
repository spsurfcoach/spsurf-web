import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Perfil — Reservas y Compras",
  robots: { index: false, follow: false },
};

export default function ClasesPerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
