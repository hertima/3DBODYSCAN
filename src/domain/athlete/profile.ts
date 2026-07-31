import type { MenstrualCyclePhase, OnboardingState, TrainingType } from "@/lib/onboarding";

export const athleteGoals = [
  "perda_peso",
  "ganho_massa",
  "definicao",
  "forca",
  "resistencia",
  "performance",
  "saude",
] as const;

export const athleteLevels = ["iniciante", "intermediario", "avancado"] as const;
export const athleteConsistencyLevels = ["ocasional", "regular", "elite"] as const;
export const athleteLocations = ["academia", "casa", "hibrido", "outdoor"] as const;
export const athleteSexes = ["feminino", "masculino"] as const;

export type AthleteGoal = (typeof athleteGoals)[number];
export type AthleteLevel = (typeof athleteLevels)[number];
export type AthleteConsistency = (typeof athleteConsistencyLevels)[number];
export type AthleteLocation = (typeof athleteLocations)[number];
export type AthleteSex = (typeof athleteSexes)[number];

export type AthleteProfile = {
  id: string;
  name: string;
  sex: AthleteSex | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  goal: AthleteGoal;
  level: AthleteLevel;
  consistency: AthleteConsistency;
  location: AthleteLocation;
  equipment: string[];
  availableDays: number[];
  workoutDurationMin: number;
  preferredFocus: string[];
  limitations: string[];
  injuries: string[];
  trainingType: TrainingType;
  trackCycle: boolean;
  menstrualCyclePhase: MenstrualCyclePhase | null;
  onboardingCompletedAt: string | null;
};

export type AthleteProfileInput = {
  id?: string;
  name?: string;
  sex?: AthleteSex | null;
  age?: number | null;
  heightCm?: number | null;
  weightKg?: number | null;
  preferredFocus?: string[];
  limitations?: string[];
  injuries?: string[];
};

const goalMap: Record<NonNullable<OnboardingState["goal"]>, AthleteGoal> = {
  mass: "ganho_massa",
  strength: "forca",
  hybrid: "ganho_massa",
  athletic: "performance",
  weight_loss: "perda_peso",
  definition: "definicao",
  endurance: "resistencia",
  wellness: "saude",
};

const levelMap: Record<NonNullable<OnboardingState["experience"]>, AthleteLevel> = {
  beginner: "iniciante",
  intermediate: "intermediario",
  advanced: "avancado",
};

const consistencyMap: Record<NonNullable<OnboardingState["consistency"]>, AthleteConsistency> = {
  occasional: "ocasional",
  regular: "regular",
  elite: "elite",
};

const locationMap: Record<NonNullable<OnboardingState["location"]>, AthleteLocation> = {
  gym: "academia",
  home: "casa",
  hybrid: "hibrido",
  outdoor: "outdoor",
};

const resultMap: Record<string, AthleteGoal> = {
  hypertrophy: "ganho_massa",
  strength: "forca",
  skill: "performance",
  performance: "performance",
};

const sexMap: Record<NonNullable<OnboardingState["gender"]>, AthleteSex | null> = {
  male: "masculino",
  female: "feminino",
  other: null,
};

function resolveSex(state: OnboardingState): AthleteSex | null {
  return state.gender ? sexMap[state.gender] : null;
}

function dedupeStrings(values: string[] | undefined) {
  return Array.from(new Set((values ?? []).map((value) => value.trim()).filter(Boolean)));
}

function sortDays(days: number[] | undefined) {
  return Array.from(new Set((days ?? []).filter((day) => day >= 0 && day <= 6))).sort((a, b) => a - b);
}

function resolveGoal(state: OnboardingState) {
  if (state.result && resultMap[state.result]) return resultMap[state.result];
  if (state.goal) return goalMap[state.goal];
  return "ganho_massa" as const;
}

function resolveLevel(state: OnboardingState) {
  return state.experience ? levelMap[state.experience] : "iniciante";
}

function resolveConsistency(state: OnboardingState) {
  return state.consistency ? consistencyMap[state.consistency] : "ocasional";
}

function resolveLocation(state: OnboardingState) {
  return state.location ? locationMap[state.location] : "academia";
}

function resolveTrainingType(state: OnboardingState): TrainingType {
  if (state.trainingType) return state.trainingType;
  if (state.location === "outdoor") return "calistenia";
  if (state.location === "home" && (state.equipment?.length ?? 0) === 0) return "calistenia";
  return "musculacao";
}

function resolveDuration(state: OnboardingState) {
  if (!state.duration) return 60;
  return Math.min(120, Math.max(30, state.duration));
}

export function buildAthleteProfile(
  onboarding: OnboardingState,
  input: AthleteProfileInput = {},
): AthleteProfile {
  return {
    id: input.id ?? "local-athlete",
    name:
      input.name?.trim() ||
      onboarding.name?.trim() ||
      onboarding.email?.trim() ||
      "Atleta 3D Body Scanner",
    sex: input.sex ?? resolveSex(onboarding),
    age: input.age ?? onboarding.age ?? null,
    heightCm: input.heightCm ?? onboarding.height ?? null,
    weightKg: input.weightKg ?? onboarding.weight ?? null,
    goal: resolveGoal(onboarding),
    level: resolveLevel(onboarding),
    consistency: resolveConsistency(onboarding),
    location: resolveLocation(onboarding),
    equipment: dedupeStrings(onboarding.equipment),
    availableDays: sortDays(onboarding.days),
    workoutDurationMin: resolveDuration(onboarding),
    preferredFocus: dedupeStrings([...(onboarding.focusMuscles ?? []), ...(input.preferredFocus ?? [])]),
    limitations: dedupeStrings(input.limitations),
    injuries: dedupeStrings(input.injuries),
    trainingType: resolveTrainingType(onboarding),
    trackCycle: onboarding.gender === "female" && Boolean(onboarding.trackCycle),
    menstrualCyclePhase: onboarding.gender === "female" && onboarding.trackCycle ? onboarding.menstrualCyclePhase ?? null : null,
    onboardingCompletedAt: onboarding.completedAt ?? null,
  };
}
