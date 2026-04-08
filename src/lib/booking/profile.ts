import type { UserProfileDoc } from "./types";

export function isProfileComplete(profile: Partial<UserProfileDoc> | null | undefined): boolean {
  if (!profile) return false;

  return !!(
    profile.fullName &&
    profile.dni &&
    profile.birthDate &&
    profile.phone &&
    profile.email &&
    profile.emergencyName &&
    profile.emergencyRelation &&
    profile.emergencyPhone &&
    (profile.medicalConditions ?? []).length > 0 &&
    (profile.goals ?? []).length > 0 &&
    profile.declaresGoodHealth &&
    profile.understandsRisk &&
    profile.acceptsTerms
  );
}
