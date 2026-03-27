import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SP Surf Coach",
    template: "%s | SP Surf Coach",
  },
  description:
    "Entrenamiento de surf personalizado, surftrips, videocoaching y comunidad para progresar dentro y fuera del agua.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>
          <div className="min-h-screen bg-[var(--color-background-default)] text-[var(--color-text-default)]">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
