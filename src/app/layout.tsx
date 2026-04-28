import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SP Surf Coach",
    template: "%s | SP Surf Coach",
  },
  description:
    "Entrenamiento de surf personalizado, surfcamps, videocoaching y comunidad para progresar dentro y fuera del agua.",
  icons: {
    icon: [
      {
        url: "/photos/logosp%20-%20copia.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/photos/logosp%20-%20copia.png",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
