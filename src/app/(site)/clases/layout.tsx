import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comprar Clases y Reservar Sesiones de Surf en Lima",
  description:
    "Compra paquetes de clases de surf o reserva tu sesión en Lima y Sur Chico. Elige horario, ubicación y empieza a surfear con SP Surf Coach.",
  alternates: { canonical: "/clases" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Comprar Clases y Reservar Sesiones de Surf en Lima",
    description:
      "Paquetes de clases, membresías y reservas de sesiones de surf en Lima. Reserva online con SP Surf Coach.",
    url: "/clases",
  },
};

export default function ClasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
