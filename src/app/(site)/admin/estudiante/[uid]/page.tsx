"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminStudentProfileReadonly } from "@/components/admin/AdminStudentProfileReadonly";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import type { UserProfileDoc } from "@/lib/booking/types";

type StudentProfileResponse = {
  uid: string;
  email: string | null;
  profile: Partial<UserProfileDoc> | null;
};

export default function AdminStudentProfilePage() {
  const params = useParams();
  const uid = typeof params.uid === "string" ? params.uid : "";
  const router = useRouter();
  const { user, loading, loginWithGoogle } = useAuth();
  const [data, setData] = useState<StudentProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!uid || !user) return;
    let cancelled = false;
    setLoadingProfile(true);
    setError(null);
    void apiFetch<StudentProfileResponse>(`/api/admin/students/${encodeURIComponent(uid)}`)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message ?? "No se pudo cargar el perfil");
      })
      .finally(() => {
        if (!cancelled) setLoadingProfile(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid, user]);

  if (!loading && !user) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <Image src="/photos/nosotros_hero.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
          <h1 className="text-2xl font-bold">Perfil de estudiante</h1>
          <p className="mt-1 text-sm text-black/50">Inicia sesión como administrador para continuar.</p>
          <Button
            className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[var(--color-primary-900)] font-semibold text-white hover:bg-[var(--color-primary-700)]"
            onClick={() => void loginWithGoogle()}
          >
            Entrar con Google
          </Button>
        </div>
      </div>
    );
  }

  if (!uid) {
    return (
      <div className="container-site py-16">
        <p className="text-sm text-red-700">Identificador de estudiante no válido.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin")}>
          Volver al panel
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-default)] pb-20 pt-10">
      <div className="container-site max-w-4xl space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Volver a estudiantes
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-black/10 bg-[var(--color-primary-900)] px-6 py-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Estudiante</p>
          <p className="mt-1 truncate text-lg font-bold">{data?.email ?? "—"}</p>
          <p className="mt-1 font-mono text-xs text-white/50 break-all">{uid}</p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>
        ) : null}

        {loadingProfile ? (
          <p className="text-sm text-black/50">Cargando ficha…</p>
        ) : data?.profile && Object.keys(data.profile).length > 0 ? (
          <AdminStudentProfileReadonly profile={data.profile} />
        ) : !loadingProfile && data ? (
          <div className="rounded-2xl border border-dashed border-black/20 bg-white p-10 text-center text-sm text-black/50">
            Este alumno aún no completó su ficha en Clases.
          </div>
        ) : null}
      </div>
    </div>
  );
}
