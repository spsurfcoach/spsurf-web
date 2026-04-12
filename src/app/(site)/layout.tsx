import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[var(--color-background-default)] text-[var(--color-text-default)]">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
