import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildAIWorkoutCandidates,
  canAddExerciseToSelection,
  getCurrentTrainingState,
} from "@/domain/training/engine";
import { buildAthleteProfile } from "@/domain/athlete/profile";
import { buildEnvironmentContextFromOnboarding } from "@/domain/environment/context";
import { buildExerciseCatalog, type ExerciseCatalogRecord } from "@/domain/exercises/catalog";
import { buildBodyTrainingContext } from "@/domain/body/state";
import { buildPeriodizationBlock } from "@/domain/training/periodization";
import { buildNutritionTrainingContext } from "@/domain/nutrition/state";
import { loadOnboarding } from "@/lib/onboarding";
import { getStoredLocale } from "@/lib/locale";
import { buildAthleteMemory, serializeMemoryForAI } from "@/lib/athlete-memory";
import { getAuthToken } from "@/lib/auth";
import {
  getAIWorkoutPlan,
  setAIWorkoutPlan,
  clearAIWorkoutPlan,
  buildProfileKey,
  type AIWorkoutPlan,
} from "@/lib/ai-workout-cache";
import type { Workout } from "@/data/library";

function collectAIExerciseIds(aiPlan: AIWorkoutPlan | null) {
  if (!aiPlan) return [];
  return Array.from(new Set(aiPlan.workouts.flatMap((workout) => workout.exercises.map((exercise) => exercise.exerciseId))));
}

function mergeAIWorkouts(rulesWorkouts: Workout[], aiPlan: AIWorkoutPlan, trainingType?: string): Workout[] {
  const catalogById = new Map(buildExerciseCatalog().map((record) => [record.id, record]));

  return rulesWorkouts.map((workout) => {
    const aiWorkout = aiPlan.workouts.find((w) => w.id === workout.id);
    if (!aiWorkout) return workout;

    const acceptedRecords: ExerciseCatalogRecord[] = [];
    const mergedExercises = aiWorkout.exercises
      .map((aiEx, index) => {
        const rulesSlot = workout.exercises[index];
        const rulesEx = workout.exercises.find((e) => e.exerciseId === aiEx.exerciseId);
        const aiRecord = catalogById.get(aiEx.exerciseId);
        const slotRecord = rulesSlot ? catalogById.get(rulesSlot.exerciseId) : null;
        const invalidCategory = !!rulesSlot && !!aiRecord && !!slotRecord && aiRecord.category !== slotRecord.category;
        const invalidTrainingType =
          trainingType === "calistenia" && !!aiRecord && aiRecord.trainingType !== "calistenia";
        const repeatedPattern = !!aiRecord && !canAddExerciseToSelection(acceptedRecords, aiRecord);

        if (!aiRecord || invalidCategory || invalidTrainingType || repeatedPattern) {
          if (slotRecord) acceptedRecords.push(slotRecord);
          return rulesSlot;
        }

        acceptedRecords.push(aiRecord);

        return {
          exerciseId: aiEx.exerciseId,
          sets: Array.from({ length: aiEx.sets }).map(() => ({
            reps: Math.round((aiEx.repsMin + aiEx.repsMax) / 2),
            weight: rulesEx?.sets[0]?.weight ?? 0,
          })),
          rest: aiEx.rest,
          notes: aiEx.aiNote || undefined,
        };
      })
      .filter((ex) => !!ex.exerciseId);

    if (mergedExercises.length < 4) return workout;

    return { ...workout, exercises: mergedExercises };
  });
}

export type TrainingStateWithAI = ReturnType<typeof getCurrentTrainingState> & {
  aiReady: boolean;
  aiLoading: boolean;
  aiReasons: string[];
  aiWeekFocus: string;
  regenerate: () => void;
};

export function useTrainingState(refreshKey = 0): TrainingStateWithAI {
  const locale = getStoredLocale();
  const base = useMemo(() => getCurrentTrainingState(), [refreshKey, locale]);
  const [aiPlan, setAiPlanState] = useState<AIWorkoutPlan | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchAIPlan = useCallback(async (options: { regenerationId?: string; avoidExerciseIds?: string[] } = {}) => {
    setAiLoading(true);
    try {
      const onboarding = loadOnboarding();
      const profile = buildAthleteProfile(onboarding);
      const environment = buildEnvironmentContextFromOnboarding(profile, onboarding);
      const catalog = buildExerciseCatalog();
      const body = buildBodyTrainingContext();

      const { resolveWorkoutTemplates } = await import("@/domain/training/rules");
      const resolvedTemplates = resolveWorkoutTemplates(profile);
      const candidates = buildAIWorkoutCandidates(profile, environment, body, resolvedTemplates, catalog);

      const locale = getStoredLocale();
      const memory = buildAthleteMemory();
      const athleteMemory = serializeMemoryForAI(memory);

      const nutrition = buildNutritionTrainingContext();
      const periodization = buildPeriodizationBlock(profile, body, nutrition, environment, locale);
      const currentWeekData = periodization.weeks[periodization.currentWeek - 1];

      const token = await getAuthToken();
      const res = await fetch("/api/ai-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          profile: {
            goal: profile.goal,
            level: profile.level,
            sex: profile.sex,
            location: profile.location,
            trainingType: profile.trainingType,
            availableDays: profile.availableDays.length || 3,
            workoutDurationMin: profile.workoutDurationMin,
            name: profile.name,
            modality: periodization.modality,
            currentWeek: periodization.currentWeek,
            currentPhase: currentWeekData?.phase ?? "base",
            phaseEmphasis: currentWeekData?.emphasis ?? "",
            volumeBias: currentWeekData?.volumeBias ?? "moderado",
            intensityBias: currentWeekData?.intensityBias ?? "moderada",
            equipment: profile.equipment,
            consistency: profile.consistency,
            splitBias: periodization.adjustments.splitBias,
            trackCycle: profile.trackCycle,
            menstrualCyclePhase: profile.menstrualCyclePhase,
            injuries: profile.injuries,
            limitations: profile.limitations,
            focusMuscles: profile.preferredFocus,
            dietType: onboarding.dietType,
            metabolismType: onboarding.metabolismType,
          },
          workoutCandidates: candidates,
          locale,
          athleteMemory,
          regenerationId: options.regenerationId,
          avoidExerciseIds: options.avoidExerciseIds ?? [],
        }),
      });

      if (!res.ok) throw new Error(`${res.status}`);

      const json = (await res.json()) as {
        workouts: AIWorkoutPlan["workouts"];
        scheduleReasons: string[];
        weekFocus: string;
      };

      const profileKey = buildProfileKey(profile, locale);
      const plan: AIWorkoutPlan = {
        workouts: json.workouts ?? [],
        scheduleReasons: json.scheduleReasons ?? [],
        weekFocus: json.weekFocus ?? "",
        profileKey,
        weekKey: 0,
      };

      setAIWorkoutPlan(plan);
      setAiPlanState(plan);
    } catch {
      // fallback to rules-based — no error shown
    }
    setAiLoading(false);
  }, []);

  useEffect(() => {
    const onboarding = loadOnboarding();
    const profile = buildAthleteProfile(onboarding);
    const profileKey = buildProfileKey(profile, locale);
    const cached = getAIWorkoutPlan(profileKey);
    if (cached) {
      setAiPlanState(cached);
      return;
    }
    fetchAIPlan();
  }, [refreshKey, locale, fetchAIPlan]);

  const mergedWorkouts = useMemo(() => {
    if (!aiPlan) return base.workouts;
    return mergeAIWorkouts(base.workouts, aiPlan, base.profile.trainingType);
  }, [base.workouts, aiPlan, base.profile.trainingType]);

  const regenerate = useCallback(() => {
    const regenerationId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const avoidExerciseIds = collectAIExerciseIds(aiPlan);
    try {
      localStorage.setItem("_zyrox_regen_seed", regenerationId);
    } catch {}
    clearAIWorkoutPlan();
    setAiPlanState(null);
    fetchAIPlan({ regenerationId, avoidExerciseIds });
  }, [aiPlan, fetchAIPlan]);

  return {
    ...base,
    workouts: mergedWorkouts,
    aiReady: !!aiPlan,
    aiLoading,
    aiReasons: aiPlan?.scheduleReasons ?? [],
    aiWeekFocus: aiPlan?.weekFocus ?? "",
    regenerate,
  };
}
