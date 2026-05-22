import { r as reactExports } from "./server-C0e4gypg.js";
import { f as getRecommendationsCopy } from "./app-copy-wxZoQ7QO.js";
import { z as getCategoryLabel, o as getIntensityLabel, g as getStoredLocale } from "./router-BDD3RgVy.js";
function buildRecoveryRecommendation(state, t) {
  if (!state.nutrition.needsRecoverySupport) return null;
  return {
    id: "recovery-support",
    title: t.recovery.title,
    message: t.recovery.message,
    priority: "alta",
    type: "recuperacao"
  };
}
function buildNutritionRecommendation(state, t) {
  if (state.nutrition.proteinCompletionPct >= 70) return null;
  return {
    id: "protein-gap",
    title: t.protein.title,
    message: `${t.protein.messagePre} ${state.nutrition.proteinCompletionPct}${t.protein.messageMid}`,
    priority: "alta",
    type: "nutricao"
  };
}
function buildHydrationRecommendation(state, t) {
  if (state.nutrition.hydrationStatus !== "baixa") return null;
  return {
    id: "hydration-gap",
    title: t.hydration.title,
    message: `${t.hydration.messagePre} ${state.nutrition.hydrationCompletionPct}${t.hydration.messageMid}`,
    priority: "alta",
    type: "hidratacao"
  };
}
function buildBodyPriorityRecommendation(state, t, locale) {
  const focus = state.body.muscularPriorities[0];
  if (!focus) return null;
  const focusLabel = getCategoryLabel(focus, locale);
  return {
    id: "body-priority",
    title: t.bodyPriority.title,
    message: `${t.bodyPriority.messagePre} ${focusLabel}. ${t.bodyPriority.messageSuf}`,
    priority: state.body.priorityLevel === "alta" ? "alta" : "media",
    type: "treino"
  };
}
function buildEnvironmentRecommendation(state, t) {
  if (state.environment.location !== "academia" && state.environment.location !== "hibrido") return null;
  if (state.environment.crowdLevel !== "pico") return null;
  return {
    id: "peak-hours",
    title: t.peakHours.title,
    message: t.peakHours.message,
    priority: "media",
    type: "ambiente"
  };
}
function buildExecutionRecommendation(state, t, locale) {
  const workoutName = state.workouts[0]?.name ?? "";
  const rawIntensity = state.schedule.find((item) => item.workoutId)?.intensity ?? "Moderado";
  const intensityLabel = getIntensityLabel(rawIntensity, locale).toLowerCase();
  return {
    id: "execution-focus",
    title: t.execution.title,
    message: `${t.execution.messagePre} ${workoutName}, ${t.execution.messageMid} ${intensityLabel}.`,
    priority: "media",
    type: "treino"
  };
}
function buildAIRecommendations(state, locale) {
  const t = getRecommendationsCopy(locale);
  const recommendations = [
    buildRecoveryRecommendation(state, t),
    buildHydrationRecommendation(state, t),
    buildNutritionRecommendation(state, t),
    buildBodyPriorityRecommendation(state, t, locale),
    buildEnvironmentRecommendation(state, t),
    buildExecutionRecommendation(state, t, locale)
  ].filter((item) => Boolean(item));
  const primary = recommendations[0] ?? buildExecutionRecommendation(state, t, locale);
  return { primary, items: recommendations.slice(0, 3) };
}
function useAIInsights(trainingState) {
  const locale = getStoredLocale();
  return reactExports.useMemo(
    () => buildAIRecommendations(trainingState, locale),
    [trainingState, locale]
  );
}
export {
  useAIInsights as u
};