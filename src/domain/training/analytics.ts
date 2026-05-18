import { type Workout } from "@/data/library";
import { type AthleteProfile } from "@/domain/athlete/profile";
import {
  buildExerciseCatalog,
  type ExerciseCatalogRecord,
  type OfficialMuscleCategory,
} from "@/domain/exercises/catalog";
import { type GeneratedTrainingState } from "@/domain/training/engine";
import { getWeekDayLabels, getCategoryLabel, translateWorkoutName } from "@/lib/training-i18n";
import { getStoredLocale, type AppLocale } from "@/lib/locale";

type VolumePoint = {
  day: string;
  volume: number;
  exercises: number;
};

type MuscleRadarPoint = {
  muscle: string;
  value: number;
};

type HeatmapPoint = {
  day: number;
  value: number;
};

type ProgressionPoint = {
  week: string;
  supino: number;
  agachamento: number;
  terra: number;
};

type PlannedWorkoutHistoryEntry = {
  id: string;
  name: string;
  date: string;
  duration: number;
  volume: number;
  sets: number;
  prs: number;
};

export type TrainingAnalytics = {
  volumeTrend: VolumePoint[];
  muscleRadar: MuscleRadarPoint[];
  consistencyHeatmap: HeatmapPoint[];
  progressionData: ProgressionPoint[];
  workoutHistory: PlannedWorkoutHistoryEntry[];
  recoveryScore: number;
  completionTrend: Array<{ day: string; completed: number }>;
};

const ALL_MUSCLE_CATEGORIES: OfficialMuscleCategory[] = [
  "peitoral", "costas_trapezio", "deltoides", "biceps_antebraco",
  "triceps", "abdomen_core", "membros_inferiores_gluteos", "panturrilha",
];

const dayText: Record<AppLocale, [string, string]> = {
  pt: ["dia", "dias"],
  es: ["día", "días"],
  en: ["day", "days"],
  fr: ["jour", "jours"],
  de: ["Tag", "Tage"],
};

function getCategoryBaseLoad(category: OfficialMuscleCategory) {
  if (category === "membros_inferiores_gluteos") return 42;
  if (category === "costas_trapezio") return 32;
  if (category === "peitoral") return 28;
  if (category === "deltoides") return 16;
  if (category === "biceps_antebraco" || category === "triceps") return 14;
  if (category === "panturrilha") return 18;
  return 8;
}

function getEquipmentFactor(equipment: ExerciseCatalogRecord["equipment"]) {
  if (equipment === "maquina") return 1.1;
  if (equipment === "barra") return 1.2;
  if (equipment === "halteres") return 1;
  if (equipment === "cabos") return 0.9;
  if (equipment === "peso_corporal") return 0.75;
  if (equipment === "barra_fixa" || equipment === "paralelas") return 0.85;
  return 0.8;
}

function getLevelFactor(profile: AthleteProfile) {
  if (profile.level === "avancado") return 1.2;
  if (profile.level === "intermediario") return 1;
  return 0.82;
}

function getConsistencyScore(profile: AthleteProfile) {
  if (profile.consistency === "elite") return 5;
  if (profile.consistency === "regular") return 4;
  return 3;
}

function estimateExerciseVolume(
  exerciseId: string,
  sets: Workout["exercises"][number]["sets"],
  catalogById: Map<string, ExerciseCatalogRecord>,
  profile: AthleteProfile,
) {
  const record = catalogById.get(exerciseId);
  if (!record) return 0;

  const estimatedLoad =
    getCategoryBaseLoad(record.category) *
    getEquipmentFactor(record.equipment) *
    getLevelFactor(profile);

  return Math.round(sets.reduce((sum, set) => sum + set.reps * estimatedLoad, 0));
}

function getWorkoutVolume(
  workout: Workout,
  catalogById: Map<string, ExerciseCatalogRecord>,
  profile: AthleteProfile,
) {
  return workout.exercises.reduce(
    (sum, item) => sum + estimateExerciseVolume(item.exerciseId, item.sets, catalogById, profile),
    0,
  );
}

function getWorkoutCategories(workout: Workout, catalogById: Map<string, ExerciseCatalogRecord>) {
  return workout.exercises
    .map((item) => catalogById.get(item.exerciseId)?.category)
    .filter((value): value is OfficialMuscleCategory => Boolean(value));
}

function buildVolumeTrend(
  state: GeneratedTrainingState,
  catalogById: Map<string, ExerciseCatalogRecord>,
  locale: AppLocale,
) {
  return getWeekDayLabels(locale).map((day, index) => {
    const workoutId = state.schedule[index]?.workoutId;
    const workout = state.workouts.find((item) => item.id === workoutId);

    return {
      day,
      volume: workout ? getWorkoutVolume(workout, catalogById, state.profile) : 0,
      exercises: workout?.exercises.length ?? 0,
    };
  });
}

function buildMuscleRadar(
  state: GeneratedTrainingState,
  catalogById: Map<string, ExerciseCatalogRecord>,
  locale: AppLocale,
) {
  const distribution = new Map<OfficialMuscleCategory, number>();

  state.workouts.forEach((workout) => {
    getWorkoutCategories(workout, catalogById).forEach((category) => {
      distribution.set(category, (distribution.get(category) ?? 0) + 1);
    });
  });

  const max = Math.max(...distribution.values(), 1);

  return ALL_MUSCLE_CATEGORIES.map((category) => ({
    muscle: getCategoryLabel(category, locale),
    value: Math.round(((distribution.get(category) ?? 0) / max) * 100),
  }));
}

function buildConsistencyHeatmap(state: GeneratedTrainingState) {
  const activeDays = new Set(
    state.schedule.filter((item) => item.workoutId).map((item) => item.dayIndex),
  );
  const base = getConsistencyScore(state.profile);

  return Array.from({ length: 84 }, (_, index) => {
    const dayIndex = index % 7;
    const active = activeDays.has(dayIndex);
    return {
      day: index,
      value: active ? base : Math.max(1, base - 2),
    };
  });
}

function buildProgressionData(state: GeneratedTrainingState) {
  const baseSupino =
    state.profile.level === "avancado" ? 84 : state.profile.level === "intermediario" ? 68 : 52;
  const baseAgachamento =
    state.profile.level === "avancado" ? 118 : state.profile.level === "intermediario" ? 94 : 72;
  const baseTerra =
    state.profile.level === "avancado" ? 138 : state.profile.level === "intermediario" ? 112 : 86;
  const goalFactor =
    state.profile.goal === "forca" ? 1.5 : state.profile.goal === "ganho_massa" ? 1.2 : 0.9;

  return Array.from({ length: 12 }, (_, index) => ({
    week: `S${index + 1}`,
    supino: Math.round(baseSupino + index * goalFactor * 1.4),
    agachamento: Math.round(baseAgachamento + index * goalFactor * 1.8),
    terra: Math.round(baseTerra + index * goalFactor * 2),
  }));
}

function buildWorkoutHistory(
  state: GeneratedTrainingState,
  catalogById: Map<string, ExerciseCatalogRecord>,
  locale: AppLocale,
) {
  const [singular, plural] = dayText[locale] ?? dayText.pt;
  return state.workouts.map((workout, index) => ({
    id: workout.id,
    name: translateWorkoutName(workout.name, locale),
    date: `${index + 1} ${index === 0 ? singular : plural}`,
    duration: workout.duration,
    volume: getWorkoutVolume(workout, catalogById, state.profile),
    sets: workout.exercises.reduce((sum, item) => sum + item.sets.length, 0),
    prs: state.profile.goal === "forca" && index < 2 ? 1 : 0,
  }));
}

function buildCompletionTrend(state: GeneratedTrainingState, locale: AppLocale) {
  return getWeekDayLabels(locale).map((day, index) => ({
    day,
    completed: state.schedule[index]?.workoutId ? 1 : 0,
  }));
}

function buildRecoveryScore(state: GeneratedTrainingState) {
  let score = 82;

  if (state.environment.crowdLevel === "pico") score -= 4;
  if (state.environment.location === "casa") score -= 3;
  if (state.environment.location === "outdoor") score -= 1;
  if (state.profile.consistency === "elite") score += 5;
  if (state.profile.level === "iniciante") score += 2;
  if (state.profile.workoutDurationMin >= 75) score -= 3;
  if (state.nutrition.readinessLevel === "alta") score += 4;
  if (state.nutrition.readinessLevel === "media") score += 1;
  if (state.nutrition.needsRecoverySupport) score -= 5;
  if (state.nutrition.hydrationStatus === "alta") score += 2;
  if (state.nutrition.hydrationStatus === "baixa") score -= 4;
  if (state.body.priorityLevel === "alta") score += 2;
  if (state.body.recompositionFocus) score -= 2;
  if ((state.body.bodyFatPct ?? 0) >= 18) score -= 2;

  return Math.max(65, Math.min(96, score));
}

export function buildTrainingAnalytics(
  state: GeneratedTrainingState,
  catalog: ExerciseCatalogRecord[] = buildExerciseCatalog(),
  locale: AppLocale = getStoredLocale(),
): TrainingAnalytics {
  const catalogById = new Map(catalog.map((record) => [record.id, record]));

  return {
    volumeTrend: buildVolumeTrend(state, catalogById, locale),
    muscleRadar: buildMuscleRadar(state, catalogById, locale),
    consistencyHeatmap: buildConsistencyHeatmap(state),
    progressionData: buildProgressionData(state),
    workoutHistory: buildWorkoutHistory(state, catalogById, locale),
    recoveryScore: buildRecoveryScore(state),
    completionTrend: buildCompletionTrend(state, locale),
  };
}
