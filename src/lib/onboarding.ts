export type FitnessGoal = "mass" | "strength" | "hybrid" | "athletic" | "weight_loss" | "definition" | "endurance" | "wellness";
export type Consistency = "occasional" | "regular" | "elite";
export type Experience = "beginner" | "intermediate" | "advanced";
export type Location = "gym" | "home" | "hybrid" | "outdoor";
export type GymSize = "pequena" | "media" | "grande";
export type CrowdLevel = "vazio" | "normal" | "pico";
export type EquipmentAvailability = "alta" | "media" | "baixa";
export type TrainingType = "musculacao" | "funcional" | "calistenia";
export type MenstrualCyclePhase = "menstrual" | "follicular" | "ovulatory" | "luteal";

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
  oneRepMax?: { bench?: number; squat?: number; deadlift?: number; ohp?: number };
  // step 4
  weight?: number;
  height?: number;
  age?: number;
  // step 5
  metabolismType?: "slow" | "balanced" | "fast";
  // step 6
  focusMuscles?: string[];
  // step 7
  location?: Location;
  trainingType?: TrainingType;
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
  menstrualCyclePhase?: MenstrualCyclePhase;
  days?: number[];
  duration?: number;
  result?: string;
  completedAt?: string;
  // plano calórico final — calculado uma vez ao concluir o onboarding (perfil completo)
  // e reutilizado em todas as telas (analytics, nutrição) para evitar divergência
  calorieBmr?: number;
  calorieTdee?: number;
  calorieTarget?: number;
  calorieProtein?: number;
  calorieCarbs?: number;
  calorieFat?: number;
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
  import("./firestore-profile").then(({ saveProfileToFirestore }) =>
    import("./firebase").then(({ auth }) => {
      const user = auth.currentUser;
      if (!user) return;
      saveProfileToFirestore(user.uid, state).catch(() => {});
      import("./firestore-local-state").then(({ scheduleLocalStateSync }) => {
        scheduleLocalStateSync(user.uid);
      });
    }),
  );
}

export function clearOnboarding() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function isOnboarded(): boolean {
  return Boolean(loadOnboarding().completedAt);
}

export function getCurrentOnboardingStep(): number {
  const s = loadOnboarding();
  if (!s.goal) return 1;
  if (!s.problem) return 2;
  if (!s.experience) return 3;
  if (!s.weight || !s.height || !s.age) return 4;
  if (!s.metabolismType) return 5;
  if (!s.focusMuscles?.length) return 6;
  if (!s.location) return 7;
  if (!s.trainingType) return 8;
  if (!s.mealFrequency) return 9;
  if (!s.gender) return 10;
  if (!s.days?.length) return 11;
  return 12;
}
