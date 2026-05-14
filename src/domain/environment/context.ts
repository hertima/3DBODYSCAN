import type { AthleteLocation, AthleteProfile } from "@/domain/athlete/profile";
import type { OnboardingState } from "@/lib/onboarding";

export const gymSizes = ["pequena", "media", "grande"] as const;
export const crowdLevels = ["vazio", "normal", "pico"] as const;
export const equipmentAvailabilityLevels = ["alta", "media", "baixa"] as const;

export type GymSize = (typeof gymSizes)[number];
export type CrowdLevel = (typeof crowdLevels)[number];
export type EquipmentAvailability = (typeof equipmentAvailabilityLevels)[number];
export type TrainingLocation = AthleteLocation;

export type EnvironmentContext = {
  location: TrainingLocation;
  gymSize: GymSize | null;
  crowdLevel: CrowdLevel | null;
  equipmentAvailability: EquipmentAvailability | null;
  notes: string[];
};

export type EnvironmentContextInput = {
  gymSize?: GymSize | null;
  crowdLevel?: CrowdLevel | null;
  equipmentAvailability?: EquipmentAvailability | null;
  notes?: string[];
};

function dedupeNotes(notes: string[] | undefined) {
  return Array.from(new Set((notes ?? []).map((note) => note.trim()).filter(Boolean)));
}

function resolveDefaultGymSize(location: TrainingLocation) {
  return location === "academia" || location === "hibrido" ? "media" : null;
}

function resolveDefaultCrowdLevel(location: TrainingLocation) {
  return location === "academia" || location === "hibrido" ? "normal" : null;
}

function resolveDefaultAvailability(location: TrainingLocation) {
  if (location === "casa") return "baixa";
  if (location === "outdoor") return "media";
  return "alta";
}

export function buildEnvironmentContext(
  profile: AthleteProfile,
  input: EnvironmentContextInput = {},
): EnvironmentContext {
  return {
    location: profile.location,
    gymSize: input.gymSize ?? resolveDefaultGymSize(profile.location),
    crowdLevel: input.crowdLevel ?? resolveDefaultCrowdLevel(profile.location),
    equipmentAvailability: input.equipmentAvailability ?? resolveDefaultAvailability(profile.location),
    notes: dedupeNotes(input.notes),
  };
}

export function buildEnvironmentContextFromOnboarding(
  profile: AthleteProfile,
  onboarding: OnboardingState,
) {
  return buildEnvironmentContext(profile, {
    gymSize: onboarding.gymSize ?? null,
    crowdLevel: onboarding.crowdLevel ?? null,
    equipmentAvailability: onboarding.equipmentAvailability ?? null,
    notes: onboarding.environmentNotes,
  });
}
