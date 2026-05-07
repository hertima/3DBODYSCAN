export type FitnessGoal = "mass" | "strength" | "hybrid" | "athletic";
export type Consistency = "occasional" | "regular" | "elite";
export type Experience = "beginner" | "intermediate" | "advanced";
export type Location = "gym" | "home" | "hybrid" | "outdoor";

export type OnboardingState = {
  goal?: FitnessGoal;
  consistency?: Consistency;
  experience?: Experience;
  location?: Location;
  equipment?: string[];
  days?: number[]; // 0..6
  duration?: number; // minutes
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
