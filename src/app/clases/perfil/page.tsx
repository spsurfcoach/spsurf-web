"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { ProfileForm } from "@/components/booking/ProfileForm";
import { PROFILE_SECTIONS, type ProfileSectionId } from "@/components/booking/profileSections";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import type { UserProfileDoc } from "@/lib/booking/types";

function ClasesProfilePageContent() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<Partial<UserProfileDoc> | null | undefined>(undefined);
  const [message, setMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<ProfileSectionId>("datos-personales");

  const returnTo = useMemo(() => {
    const candidate = searchParams.get("returnTo");
    return candidate && candidate.startsWith("/") ? candidate : "/clases";
  }, [searchParams]);

  const context = searchParams.get("context");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/clases");
      return;
    }

    if (!user) return;

    let cancelled = false;

    void apiFetch<{ profile: Partial<UserProfileDoc> | null }>("/api/me/profile")
      .then((response) => {
        if (!cancelled) {
          setProfile(response.profile ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProfile(null);
          setMessage("No se pudo cargar tu perfil. Puedes volver a guardarlo desde aqui.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loading, router, user]);

  useEffect(() => {
    if (profile === undefined) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-profile-section]"));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const nextSection = visible.target.getAttribute("data-profile-section");
        if (nextSection) {
          setActiveSection(nextSection as ProfileSectionId);
        }
      },
      {
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0.2, 0.45, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [profile]);

  const contextMessage = useMemo(() => {
    if (context === "reservar") {
      return "Para reservar una clase necesitas completar tu perfil de alumno primero.";
    }

    if (context === "post-payment") {
      return "Tu compra fue registrada. Completa tu perfil para poder seguir con tus reservas.";
    }

    return undefined;
  }, [context]);

  if (loading || !user || profile === undefined) {
    return (
      <div className="min-h-screen bg-[var(--color-background-default)] px-4 py-16 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-black/10 bg-white px-6 py-10 text-sm text-black/50 shadow-sm">
          Cargando perfil...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-default)] px-4 py-10 sm:px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-black/40">Area de clases</p>
            <h1 className="mt-2 text-3xl font-bold text-black">Mi perfil</h1>
            <p className="mt-2 max-w-2xl text-sm text-black/55">
              Organiza tu ficha en secciones para actualizar tus datos rapidamente.
            </p>
            <p className="mt-3 text-sm text-black/45">{user.email ?? user.uid}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link href={returnTo}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {context === "reservar" ? "Volver a reservar" : "Volver a clases"}
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full px-5" onClick={() => void logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>

        {message ? (
          <div className="rounded-xl bg-black px-4 py-3 text-sm text-white">{message}</div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
              <div className="mb-2 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">Secciones</p>
              </div>
              <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                {PROFILE_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors lg:w-full ${
                      activeSection === section.id
                        ? "bg-[var(--color-primary-900)] text-white"
                        : "text-black/55 hover:bg-black/[0.04] hover:text-black"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <ProfileForm
            initialData={profile}
            userEmail={user.email ?? ""}
            onSave={async (data) => {
              await apiFetch("/api/me/profile", {
                method: "PATCH",
                body: JSON.stringify(data),
              });

              setProfile(data);

              if (context && returnTo) {
                router.replace(returnTo);
                return;
              }

              setMessage("Perfil guardado correctamente.");
            }}
            contextMessage={contextMessage}
            title="Completa tu perfil"
            description="Tu informacion de alumno se usa para reservas, seguimiento y seguridad."
            submitLabel={context ? "Guardar y continuar" : "Guardar perfil"}
          />
        </div>
      </div>
    </div>
  );
}

export default function ClasesProfilePage() {
  return (
    <Suspense>
      <ClasesProfilePageContent />
    </Suspense>
  );
}
