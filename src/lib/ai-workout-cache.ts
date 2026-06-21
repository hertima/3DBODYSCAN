const CACHE_KEY = "_zyrox_ai_workout_v4";

export type AIWorkoutExercise = {
  exerciseId: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  rest: number;
  aiNote: string;
};

export type AIWorkout = {
  id: string;
  exercises: AIWorkoutExercise[];
};

export type AIWorkoutPlan = {
  workouts: AIWorkout[];
  scheduleReasons: string[];
  weekFocus: string;
  weekKey: number;
  profileKey: string;
};

function weekKey(): number {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
}

export function getAIWorkoutPlan(profileKey: string): AIWorkoutPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AIWorkoutPlan;
    if (parsed.weekKey !== weekKey()) return null;
    if (parsed.profileKey !== profileKey) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setAIWorkoutPlan(plan: Omit<AIWorkoutPlan, "weekKey">): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...plan, weekKey: weekKey() }));
  } catch {}
}

export function clearAIWorkoutPlan(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {}
}

export function buildProfileKey(
  profile: {
    goal: string;
    level: string;
    sex: string | null;
    location: string;
    availableDays: number[];
    workoutDurationMin: number;
    trainingType?: string;
    consistency?: string;
    equipment?: string[];
    preferredFocus?: string[];
  },
  locale = "pt",
): string {
  return [
    profile.goal,
    profile.level,
    profile.sex ?? "null",
    profile.trainingType ?? "musculacao",
    profile.location,
    profile.consistency ?? "ocasional",
    profile.availableDays.join(","),
    profile.workoutDurationMin,
    [...(profile.equipment ?? [])].sort().join(","),
    [...(profile.preferredFocus ?? [])].sort().join(","),
    locale,
  ].join("|");
}
