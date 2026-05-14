import { getExercise, type Workout, type WorkoutExercise, type WorkoutSet } from "@/data/library";
import { buildAthleteProfile, type AthleteProfile } from "@/domain/athlete/profile";
import { buildBodyTrainingContext, type BodyTrainingContext } from "@/domain/body/state";
import {
  buildEnvironmentContextFromOnboarding,
  type EnvironmentContext,
} from "@/domain/environment/context";
import {
  buildExerciseCatalog,
  type ExerciseCatalogRecord,
  type OfficialMuscleCategory,
} from "@/domain/exercises/catalog";
import { applyWorkoutCustomization } from "@/domain/training/customization";
import {
  EXERCISES_PER_WORKOUT,
  resolveTrainingSplit,
  resolveWorkoutDensity,
  resolveWorkoutIntensity,
  resolveWorkoutTemplates,
  type WorkoutTemplate,
} from "@/domain/training/rules";
import {
  buildPeriodizationBlock,
  type TwelveWeekBlock,
} from "@/domain/training/periodization";
import {
  buildNutritionTrainingContext,
  type NutritionTrainingContext,
} from "@/domain/nutrition/state";
import { loadOnboarding } from "@/lib/onboarding";
import { getCategoryLabel, getFocusSeparator, getGoalTagLabel, getWorkoutNameLabel } from "@/lib/training-i18n";
import { getWorkoutCustomization } from "@/lib/workout-customizations";

export type GeneratedWeekPlanEntry = {
  dayIndex: number;
  workoutId: string | null;
  intensity: "Leve" | "Moderado" | "Pesado" | null;
  tag: string | null;
};

export type GeneratedTrainingState = {
  profile: AthleteProfile;
  environment: EnvironmentContext;
  body: BodyTrainingContext;
  nutrition: NutritionTrainingContext;
  periodization: TwelveWeekBlock;
  workouts: Workout[];
  schedule: GeneratedWeekPlanEntry[];
};

type GeneratedTrainingOptions = {
  applyCustomizations?: boolean;
};

const DEFAULT_WEEK_DAYS = [0, 1, 2] as const;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function resolveWorkoutName(template: WorkoutTemplate, profile: AthleteProfile, index: number) {
  return getWorkoutNameLabel(
    template.name,
    {
      prefersLowerPriority: prefersLowerPriority(profile),
      index,
    },
  );
}

function prefersLowerPriority(profile: AthleteProfile) {
  return (
    profile.sex === "feminino" && ["ganho_massa", "definicao", "perda_peso"].includes(profile.goal)
  );
}

function resolveFocus(template: WorkoutTemplate) {
  return unique(template.categories.map((item) => getCategoryLabel(item.primary))).join(
    getFocusSeparator(),
  );
}

function resolveWorkoutTag(profile: AthleteProfile) {
  return getGoalTagLabel(profile.goal);
}

function resolveRestSeconds(
  category: OfficialMuscleCategory,
  intensity: "leve" | "moderada" | "pesada",
) {
  if (category === "membros_inferiores_gluteos") return intensity === "pesada" ? 120 : 90;
  if (category === "peitoral" || category === "costas_trapezio" || category === "deltoides") {
    return intensity === "pesada" ? 90 : 75;
  }
  return intensity === "leve" ? 45 : 60;
}

function resolveSetScheme(
  category: OfficialMuscleCategory,
  intensity: "leve" | "moderada" | "pesada",
  density: "alta" | "moderada" | "controlada",
): WorkoutSet[] {
  const repsBase =
    category === "abdomen_core"
      ? 15
      : category === "panturrilha"
        ? 18
        : intensity === "pesada"
          ? 8
          : 12;
  const numberOfSets = density === "alta" ? 2 : 3;

  return Array.from({ length: numberOfSets }).map((_, index) => ({
    reps: Math.max(8, repsBase - (intensity === "pesada" ? index : 0)),
    weight: 0,
  }));
}

function supportsProfileEquipment(record: ExerciseCatalogRecord, profile: AthleteProfile) {
  if (profile.equipment.length === 0) return true;

  const equipmentMap: Record<string, string[]> = {
    barra: ["barras", "barra"],
    halteres: ["halteres", "halter"],
    cabos: ["cabos", "cabo"],
    maquina: ["maquinas", "maquina"],
    peso_corporal: ["peso corporal"],
    barra_fixa: ["barra fixa"],
    paralelas: ["paralelas"],
    parede: ["parede"],
    banco: ["banco"],
    trx: ["trx"],
    bola: ["bola"],
    elastico: ["elasticos", "elastico"],
  };

  const accepted = equipmentMap[record.equipment] ?? [record.equipment];
  const normalizedEquipment = profile.equipment.map(normalizeName);

  return accepted.some((candidate) => normalizedEquipment.includes(normalizeName(candidate)));
}

function supportsEnvironment(record: ExerciseCatalogRecord, environment: EnvironmentContext) {
  if (environment.location === "outdoor") {
    return (
      record.trainingType === "calistenia" &&
      ["peso_corporal", "barra_fixa", "paralelas", "parede", "trx"].includes(record.equipment)
    );
  }

  if (environment.location === "casa") {
    return record.equipment !== "maquina" && record.equipment !== "cabos";
  }

  return true;
}

function scoreEnvironmentFit(record: ExerciseCatalogRecord, environment: EnvironmentContext) {
  let score = 0;

  if (
    environment.location === "casa" &&
    ["peso_corporal", "halteres", "barra", "elastico", "banco"].includes(record.equipment)
  ) {
    score += 3;
  }

  if (
    environment.location === "outdoor" &&
    ["peso_corporal", "barra_fixa", "paralelas", "parede", "trx"].includes(record.equipment)
  ) {
    score += 4;
  }

  if (
    environment.gymSize === "pequena" &&
    (record.equipment === "maquina" || record.equipment === "cabos")
  ) {
    score -= 1;
  }

  if (
    environment.crowdLevel === "pico" &&
    (record.equipment === "maquina" || record.equipment === "cabos")
  ) {
    score -= 2;
  }

  return score;
}

function getMovementPattern(record: ExerciseCatalogRecord) {
  return record.movementPattern.pt;
}

function scoreExerciseQuality(record: ExerciseCatalogRecord) {
  let score = 0;
  const name = normalizeName(record.name.pt);
  const movement = normalizeName(getMovementPattern(record));

  if (record.status === "active") score += 100;
  if (record.gifSource === "official") score += 8;
  if (record.gifSource === "catalog") score += 2;

  if (["agachamento", "supino", "remada", "puxada", "desenvolvimento", "stiff", "leg press", "elevacao", "triceps", "rosca", "panturrilha", "abdutor", "abdominal", "prancha"].some((token) => name.includes(token))) {
    score += 6;
  }

  if (["coice", "agachado", "deitado unilateral", "com apoio", "improviso"].some((token) => name.includes(token))) {
    score -= 8;
  }

  if (movement.includes("empurrar horizontal") || movement.includes("puxar horizontal") || movement.includes("puxar vertical") || movement.includes("empurrar vertical") || movement.includes("agach") || movement.includes("hip hinge")) {
    score += 4;
  }

  return score;
}

function scoreTemplateFit(record: ExerciseCatalogRecord, template: WorkoutTemplate, profile: AthleteProfile) {
  let score = 0;
  const name = normalizeName(record.name.pt);
  const movement = normalizeName(getMovementPattern(record));

  if (template.name === "Push") {
    if (record.category === "peitoral" && movement.includes("empurrar horizontal")) score += 12;
    if (record.category === "deltoides" && movement.includes("empurrar vertical")) score += 10;
    if (record.category === "triceps") score += 8;
    if (record.category === "abdomen_core") score += 2;
  }

  if (template.name === "Pull") {
    if (record.category === "costas_trapezio" && movement.includes("puxar")) score += 12;
    if (record.category === "biceps_antebraco") score += 8;
    if (record.category === "deltoides" && name.includes("posterior")) score += 6;
    if (record.category === "abdomen_core") score += 2;
  }

  if (template.name === "Legs" || template.name.startsWith("Lower")) {
    if (record.category === "membros_inferiores_gluteos") score += 12;
    if (record.category === "panturrilha") score += 8;
    if (record.category === "abdomen_core") score += 3;
    if (["agachamento", "leg press", "stiff", "extensora", "flexora", "panturrilha", "abdutor", "quadril"].some((token) => name.includes(token))) {
      score += 6;
    }
  }

  if (template.name === "Hybrid Performance") {
    if (["costas_trapezio", "peitoral", "deltoides", "membros_inferiores_gluteos", "abdomen_core"].includes(record.category)) {
      score += 6;
    }
    if (record.trainingType === "calistenia") score += 4;
    if (record.trainingType === "musculacao") score += 2;
  }

  if (profile.location === "casa" && ["halteres", "peso_corporal", "barra", "elastico", "banco"].includes(record.equipment)) {
    score += 5;
  }

  if (profile.location === "hibrido" && (record.trainingType === "calistenia" || ["halteres", "barra", "peso_corporal", "barra_fixa", "paralelas"].includes(record.equipment))) {
    score += 4;
  }

  if (profile.goal === "performance" && (record.trainingType === "calistenia" || movement.includes("vertical") || movement.includes("controle"))) {
    score += 3;
  }

  return score;
}

function getBodyPriorityScore(record: ExerciseCatalogRecord, body: BodyTrainingContext) {
  const priorityIndex = body.muscularPriorities.indexOf(record.category);
  if (priorityIndex === -1) return 0;

  if (body.priorityLevel === "alta") return 5 - priorityIndex;
  if (body.priorityLevel === "media") return 3 - Math.min(priorityIndex, 2);
  return 1;
}

function downgradeIntensity(intensity: "leve" | "moderada" | "pesada") {
  if (intensity === "pesada") return "moderada" as const;
  if (intensity === "moderada") return "leve" as const;
  return intensity;
}

function resolveAdaptiveIntensity(
  intensity: "leve" | "moderada" | "pesada",
  nutrition: NutritionTrainingContext,
) {
  if (nutrition.readinessLevel === "alta") return intensity;
  if (nutrition.readinessLevel === "media") return intensity === "pesada" ? "moderada" : intensity;
  return downgradeIntensity(intensity);
}

function resolveAdaptiveDensity(
  density: "alta" | "moderada" | "controlada",
  nutrition: NutritionTrainingContext,
  body: BodyTrainingContext,
) {
  if (nutrition.needsRecoverySupport) return "controlada" as const;
  if (body.recompositionFocus && density === "controlada") return "moderada" as const;
  return density;
}

function selectExercisesForTemplate(
  template: WorkoutTemplate,
  catalog: ExerciseCatalogRecord[],
  profile: AthleteProfile,
  environment: EnvironmentContext,
  body: BodyTrainingContext,
) {
  const selected: ExerciseCatalogRecord[] = [];
  const allowedCategories = new Set(
    template.categories.flatMap((rule) =>
      rule.secondary ? [rule.primary, rule.secondary] : [rule.primary],
    ),
  );
  const available = catalog
    .filter((record) => record.status === "active")
    .filter((record) => supportsProfileEquipment(record, profile))
    .filter((record) => supportsEnvironment(record, environment))
    .filter((record) => {
      if (environment.location === "outdoor") return true;
      if (environment.location === "casa") return true;
      return record.trainingType === "musculacao" || template.name === "Hybrid Performance";
    });

  const rankRecords = (records: ExerciseCatalogRecord[]) =>
    [...records].sort(
      (left, right) =>
        scoreExerciseQuality(right) + scoreTemplateFit(right, template, profile) + scoreEnvironmentFit(right, environment) + getBodyPriorityScore(right, body) -
        (scoreExerciseQuality(left) + scoreTemplateFit(left, template, profile) + scoreEnvironmentFit(left, environment) + getBodyPriorityScore(left, body)),
    );

  for (const categoryRule of template.categories) {
    const candidates = rankRecords(
      available.filter(
        (record) =>
          !selected.some((item) => item.id === record.id) &&
          (record.category === categoryRule.primary ||
            (categoryRule.secondary ? record.category === categoryRule.secondary : false)),
      ),
    );

    selected.push(...candidates.slice(0, categoryRule.slots));
  }

  if (selected.length < EXERCISES_PER_WORKOUT) {
    const fallback = rankRecords(
      available.filter(
        (record) =>
          !selected.some((item) => item.id === record.id) &&
          allowedCategories.has(record.category),
      ),
    );
    selected.push(...fallback.slice(0, EXERCISES_PER_WORKOUT - selected.length));
  }

  return selected.slice(0, EXERCISES_PER_WORKOUT);
}

function buildWorkoutExercises(
  selected: ExerciseCatalogRecord[],
  intensity: "leve" | "moderada" | "pesada",
  density: "alta" | "moderada" | "controlada",
): WorkoutExercise[] {
  return selected.map((record, index) => ({
    exerciseId: record.id,
    sets: resolveSetScheme(record.category, intensity, density),
    rest: resolveRestSeconds(record.category, intensity),
    tag:
      index === EXERCISES_PER_WORKOUT - 1 && record.category === "abdomen_core"
        ? "Rest-Pause"
        : undefined,
  }));
}

function estimateWorkoutDuration(
  exercises: WorkoutExercise[],
  density: "alta" | "moderada" | "controlada",
  targetDuration: number,
) {
  const workMinutes = exercises.reduce((total, exercise) => total + exercise.sets.length * 2, 0);
  const restMinutes = exercises.reduce(
    (total, exercise) => total + (exercise.rest * exercise.sets.length) / 60,
    0,
  );
  const rawDuration = Math.round(workMinutes + restMinutes);

  if (density === "alta") return Math.min(targetDuration, Math.max(30, rawDuration - 8));
  if (density === "controlada") return Math.min(targetDuration, Math.max(35, rawDuration));
  return Math.min(targetDuration, Math.max(35, rawDuration - 3));
}

function mapIntensityLabel(
  intensity: "leve" | "moderada" | "pesada",
): "Leve" | "Moderado" | "Pesado" {
  if (intensity === "pesada") return "Pesado";
  if (intensity === "moderada") return "Moderado";
  return "Leve";
}

function applyStoredCustomizations(workouts: Workout[]) {
  if (typeof window === "undefined") return workouts;

  return workouts.map((workout) => {
    const customization = getWorkoutCustomization(workout.id);
    return customization ? applyWorkoutCustomization(workout, customization) : workout;
  });
}

export function buildGeneratedTrainingState(
  profile: AthleteProfile,
  catalog: ExerciseCatalogRecord[] = buildExerciseCatalog(),
  environment?: EnvironmentContext,
  options: GeneratedTrainingOptions = {},
): GeneratedTrainingState {
  const templates = resolveWorkoutTemplates(profile);
  const body = buildBodyTrainingContext();
  const nutrition = buildNutritionTrainingContext();
  const resolvedEnvironment = environment ?? buildEnvironmentContextFromOnboarding(profile, {});
  const periodization = buildPeriodizationBlock(profile, body, nutrition, resolvedEnvironment);
  const intensity = resolveAdaptiveIntensity(
    resolveWorkoutIntensity(profile.level, profile.consistency),
    nutrition,
  );
  const density = resolveAdaptiveDensity(resolveWorkoutDensity(profile), nutrition, body);

  const workouts = templates.map((template, index) => {
    const selected = selectExercisesForTemplate(
      template,
      catalog,
      profile,
      resolvedEnvironment,
      body,
    );
    const exercises = buildWorkoutExercises(selected, intensity, density);

    return {
      id: `${resolveTrainingSplit(profile)}-${index + 1}`,
      name: resolveWorkoutName(template, profile, index),
      focus: resolveFocus(template),
      duration: estimateWorkoutDuration(exercises, density, profile.workoutDurationMin),
      type: "Musculacao" as Workout["type"],
      exercises,
    } satisfies Workout;
  });
  const resolvedWorkouts =
    options.applyCustomizations === false ? workouts : applyStoredCustomizations(workouts);

  const trainingDays =
    profile.availableDays.length > 0 ? profile.availableDays : [...DEFAULT_WEEK_DAYS];
  const schedule: GeneratedWeekPlanEntry[] = Array.from({ length: 7 }).map((_, dayIndex) => {
    const trainingIndex = trainingDays.indexOf(dayIndex);

    if (trainingIndex === -1) {
      return { dayIndex, workoutId: null, intensity: null, tag: null };
    }

    const workout = resolvedWorkouts[trainingIndex % resolvedWorkouts.length];
    return {
      dayIndex,
      workoutId: workout?.id ?? null,
      intensity: mapIntensityLabel(intensity),
      tag: capitalize(resolveWorkoutTag(profile)),
    };
  });

  return {
    profile,
    environment: resolvedEnvironment,
    body,
    nutrition,
    periodization,
    workouts: resolvedWorkouts,
    schedule,
  };
}

export function getCurrentTrainingState(options: GeneratedTrainingOptions = {}) {
  const onboarding = loadOnboarding();
  const profile = buildAthleteProfile(onboarding);
  const environment = buildEnvironmentContextFromOnboarding(profile, onboarding);
  return buildGeneratedTrainingState(profile, buildExerciseCatalog(), environment, options);
}

export function getGeneratedWorkouts(options: GeneratedTrainingOptions = {}) {
  return getCurrentTrainingState(options).workouts;
}

export function getGeneratedWorkout(id: string, options: GeneratedTrainingOptions = {}) {
  return getGeneratedWorkouts(options).find((workout) => workout.id === id) ?? null;
}

export function getGeneratedExercise(exerciseId: string) {
  return getExercise(exerciseId);
}




