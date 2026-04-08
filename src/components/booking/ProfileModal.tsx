"use client";

import type { UserProfileDoc } from "@/lib/booking/types";
import { ProfileForm } from "@/components/booking/ProfileForm";

type Props = {
  open: boolean;
  initialData: Partial<UserProfileDoc> | null;
  userEmail: string;
  onSave: (data: Partial<UserProfileDoc>) => Promise<void>;
  onClose: () => void;
  /** Optional banner shown at the top — use when the form is a prerequisite for another action */
  contextMessage?: string;
};

export function ProfileModal({ open, initialData, userEmail, onSave, onClose, contextMessage }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl my-6 mx-4">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black/50 transition-colors hover:bg-white hover:text-black"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <ProfileForm
          initialData={initialData}
          userEmail={userEmail}
          onSave={onSave}
          onCancel={onClose}
          cancelLabel="Cerrar"
          contextMessage={contextMessage}
          title="Completa tu perfil"
          description="Tu informacion como alumno de SP Surf Coach."
          submitLabel="Completar registro"
        />
      </div>
    </div>
  );
}
