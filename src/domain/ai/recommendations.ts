import { type GeneratedTrainingState } from "@/domain/training/engine";
import { getRecommendationsCopy } from "@/lib/app-copy";
import { getCategoryLabel, getIntensityLabel } from "@/lib/training-i18n";
import type { OfficialMuscleCategory } from "@/domain/exercises/catalog";
import type { AppLocale } from "@/lib/locale";

export type AIRecommendation = {
  id: string;
  title: string;
  message: string;
  priority: "alta" | "media" | "baixa";
  type: "treino" | "nutricao" | "recuperacao" | "ambiente" | "hidratacao";
};

type Copy = ReturnType<typeof getRecommendationsCopy>;

function buildRecoveryRecommendation(state: GeneratedTrainingState, t: Copy): AIRecommendation | null {
  if (!state.nutrition.needsRecoverySupport) return null;
  return {
    id: "recovery-support",
    title: t.recovery.title,
    message: t.recovery.message,
    priority: "alta",
    type: "recuperacao",
  };
}

function buildNutritionRecommendation(state: GeneratedTrainingState, t: Copy): AIRecommendation | null {
  if (state.nutrition.proteinCompletionPct >= 70) return null;
  return {
    id: "protein-gap",
    title: t.protein.title,
    message: `${t.protein.messagePre} ${state.nutrition.proteinCompletionPct}${t.protein.messageMid}`,
    priority: "alta",
    type: "nutricao",
  };
}

function buildHydrationRecommendation(state: GeneratedTrainingState, t: Copy): AIRecommendation | null {
  if (state.nutrition.hydrationStatus !== "baixa") return null;
  return {
    id: "hydration-gap",
    title: t.hydration.title,
    message: `${t.hydration.messagePre} ${state.nutrition.hydrationCompletionPct}${t.hydration.messageMid}`,
    priority: "alta",
    type: "hidratacao",
  };
}

function buildBodyPriorityRecommendation(state: GeneratedTrainingState, t: Copy, locale?: string): AIRecommendation | null {
  const focus = state.body.muscularPriorities[0];
  if (!focus) return null;
  const focusLabel = getCategoryLabel(focus as OfficialMuscleCategory, locale as AppLocale);
  return {
    id: "body-priority",
    title: t.bodyPriority.title,
    message: `${t.bodyPriority.messagePre} ${focusLabel}. ${t.bodyPriority.messageSuf}`,
    priority: state.body.priorityLevel === "alta" ? "alta" : "media",
    type: "treino",
  };
}

function buildEnvironmentRecommendation(state: GeneratedTrainingState, t: Copy): AIRecommendation | null {
  if (state.environment.location !== "academia" && state.environment.location !== "hibrido") return null;
  if (state.environment.crowdLevel !== "pico") return null;
  return {
    id: "peak-hours",
    title: t.peakHours.title,
    message: t.peakHours.message,
    priority: "media",
    type: "ambiente",
  };
}

function buildExecutionRecommendation(state: GeneratedTrainingState, t: Copy, locale?: string): AIRecommendation {
  const workoutName = state.workouts[0]?.name ?? "";
  const rawIntensity = state.schedule.find((item) => item.workoutId)?.intensity ?? "Moderado";
  const intensityLabel = getIntensityLabel(rawIntensity as "Leve" | "Moderado" | "Pesado", locale as AppLocale).toLowerCase();
  return {
    id: "execution-focus",
    title: t.execution.title,
    message: `${t.execution.messagePre} ${workoutName}, ${t.execution.messageMid} ${intensityLabel}.`,
    priority: "media",
    type: "treino",
  };
}

export function buildAIRecommendations(state: GeneratedTrainingState, locale?: string) {
  const t = getRecommendationsCopy(locale as Parameters<typeof getRecommendationsCopy>[0]);

  const recommendations = [
    buildRecoveryRecommendation(state, t),
    buildHydrationRecommendation(state, t),
    buildNutritionRecommendation(state, t),
    buildBodyPriorityRecommendation(state, t, locale),
    buildEnvironmentRecommendation(state, t),
    buildExecutionRecommendation(state, t, locale),
  ].filter((item): item is AIRecommendation => Boolean(item));

  const primary = recommendations[0] ?? buildExecutionRecommendation(state, t, locale);

  return { primary, items: recommendations.slice(0, 3) };
}
