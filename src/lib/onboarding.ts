export type FitnessGoal = "mass" | "strength" | "hybrid" | "athletic";
export type Consistency = "occasional" | "regular" | "elite";
export type Experience = "beginner" | "intermediate" | "advanced";
export type Location = "gym" | "home" | "hybrid" | "outdoor";
export type GymSize = "pequena" | "media" | "grande";
export type CrowdLevel = "vazio" | "normal" | "pico";
export type EquipmentAvailability = "alta" | "media" | "baixa";

export type OnboardingState = {
  email?: string;
  name?: string;
  avatarUrl?: string;
  goal?: FitnessGoal;
  consistency?: Consistency;
  // step 2
  problem?: string;
  // step 3
  experience?: Experience;
  // step 4
  weight?: number;
  height?: number;
  // step 5
  metabolismType?: "slow" | "balanced" | "fast";
  // step 6
  focusMuscles?: string[];
  // step 7
  location?: Location;
  gymSize?: GymSize;
  crowdLevel?: CrowdLevel;
  equipmentAvailability?: EquipmentAvailability;
  environmentNotes?: string[];
  // step 8
  equipment?: string[];
  // step 9
  mealFrequency?: string;
  dietType?: string;
  // step 10
  gender?: "male" | "female" | "other";
  trackCycle?: boolean;
  days?: number[];
  duration?: number;
  result?: string;
  completedAt?: string;
};

const KEY = "zyrox.onboarding";

export function loadOnboarding(): OnboardingState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OnboardingState) : {};
  } catch {
    return {};
  }
}

export function saveOnboarding(state: OnboardingState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearOnboarding() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function isOnboarded(): boolean {
  return Boolean(loadOnboarding().completedAt);
}
