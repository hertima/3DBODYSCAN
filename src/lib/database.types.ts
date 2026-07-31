// 3D Body Scanner — Firestore document types
// Derivado da estrutura real do banco. Não editar manualmente campos que
// não existam nos arquivos firestore-*.ts correspondentes.

import type { FieldValue } from "firebase/firestore";

// ─── Tipos auxiliares ─────────────────────────────────────────────────────────

type Timestamp = FieldValue | string | null;

// ─── users/{uid}/data/profile ────────────────────────────────────────────────

export type DbProfile = {
  email?: string;
  name?: string;
  avatarUrl?: string;
  goal?: "mass" | "strength" | "hybrid" | "athletic" | "weight_loss" | "definition" | "endurance" | "wellness";
  consistency?: "occasional" | "regular" | "elite";
  problem?: string;
  experience?: "beginner" | "intermediate" | "advanced";
  oneRepMax?: { bench?: number; squat?: number; deadlift?: number; ohp?: number };
  weight?: number;
  height?: number;
  age?: number;
  metabolismType?: "slow" | "balanced" | "fast";
  focusMuscles?: string[];
  location?: "gym" | "home" | "hybrid" | "outdoor";
  trainingType?: "musculacao" | "funcional" | "calistenia";
  gymSize?: "pequena" | "media" | "grande";
  crowdLevel?: "vazio" | "normal" | "pico";
  equipmentAvailability?: "alta" | "media" | "baixa";
  environmentNotes?: string[];
  equipment?: string[];
  mealFrequency?: string;
  dietType?: string;
  gender?: "male" | "female" | "other";
  trackCycle?: boolean;
  menstrualCyclePhase?: "menstrual" | "follicular" | "ovulatory" | "luteal";
  days?: number[];
  duration?: number;
  result?: string;
  completedAt?: string;
};

// ─── users/{uid}/data/subscription ───────────────────────────────────────────

export type DbSubscription = {
  is_premium: boolean;
  premium_since: Timestamp;
};

// ─── users/{uid}/data/measurements ───────────────────────────────────────────

export type DbMeasurements = {
  peito?: number;
  cintura?: number;
  quadril?: number;
  braco?: number;
  coxa?: number;
  panturrilha?: number;
  bodyFat?: number;
  muscleMass?: number;
  weight?: number;
  photoUrl?: string;
  lastAnalysis?: string;
  calibHeight?: string;
  calibWeight?: string;
  updatedAt: Timestamp;
};

// ─── users/{uid}/data/alarm ──────────────────────────────────────────────────

export type DbAlarm = {
  time: string;
};

// ─── users/{uid}/data/mealAlarms ─────────────────────────────────────────────

export type DbMealAlarms = {
  times: string[];
  enabled: boolean;
};

// ─── users/{uid}/data/localStateManifest ─────────────────────────────────────

export type DbLocalStateManifest = {
  keys: string[];
  updatedAt: Timestamp;
};

// ─── users/{uid}/localState/{encodedKey} ─────────────────────────────────────

export type DbLocalStateItem = {
  key: string;
  value: string;
  chunked: boolean;
  chunks: number;
  updatedAt: Timestamp;
};

// users/{uid}/localState/{encodedKey}/chunks/{index}
export type DbLocalStateChunk = {
  value: string;
};

// ─── users/{uid}/workouts/{workoutId} ────────────────────────────────────────

export type DbWorkoutSet = {
  reps: number;
  weight: number;
  completed: boolean;
};

export type DbWorkoutExercise = {
  id: string;
  name: string;
  muscle: string;
  sets: DbWorkoutSet[];
};

export type DbWorkout = {
  id: string;
  workoutId: string;
  name: string;
  date: string;
  duration: number;
  calories: number;
  completedSets: number;
  totalSets: number;
  exercises: DbWorkoutExercise[];
};

// ─── users/{uid}/customizations/{workoutId} ───────────────────────────────────

type DbWorkoutEditAction =
  | { type: "replace_exercise"; workoutId: string; fromExerciseId: string; toExerciseId: string; reason?: string }
  | { type: "add_exercise"; workoutId: string; exerciseId: string; reason?: string }
  | { type: "remove_exercise"; workoutId: string; exerciseId: string; reason?: string }
  | { type: "reorder_exercise"; workoutId: string; exerciseId: string; newOrder: number };

export type DbWorkoutCustomization = {
  workoutId: string;
  edits: DbWorkoutEditAction[];
  updatedAt: string;
};

// ─── users/{uid}/notifications/{notificationId} ───────────────────────────────

export type DbNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  iconName: string;
  color: string;
  createdAt: number;
  locale?: string;
};

// ─── users/{uid}/bodyScanHistory/{scanId} ────────────────────────────────────

export type DbBodyScan = {
  id: string;
  date: string;
  analysis?: string;
  photoUrl?: string;
  locale?: string;
  estimativas: {
    peitoCmEstimado: number;
    cinturaCmEstimada: number;
    quadrilCmEstimado: number;
    bracoCmEstimado: number;
    coxaCmEstimada: number;
    panturrilhaCmEstimada: number;
    percentualGorduraEstimado: number;
  };
  calibragem?: { alturaCm: number; pesoKg: number };
  qualidade?: { confiancaLeitura: number };
  created_at: string;
};

// ─── users/{uid}/foodScanHistory/{scanId} ────────────────────────────────────

export type DbFoodScan = {
  id: string;
  date: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  analysis: string;
  photoUrl?: string;
  locale?: string;
  created_at: string;
};

// ─── Storage paths (documentação, não tipos TypeScript) ───────────────────────
// users/{uid}/bodyPhoto.jpg          — foto corporal principal (sobrescreve)
// users/{uid}/foodPhotos/{ms}.jpg    — foto de refeição por scan
