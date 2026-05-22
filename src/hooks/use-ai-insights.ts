import { useMemo } from "react";
import { buildAIRecommendations } from "@/domain/ai/recommendations";
import { getStoredLocale } from "@/lib/locale";
import type { GeneratedTrainingState } from "@/domain/training/engine";

export function useAIInsights(trainingState: GeneratedTrainingState) {
  const locale = getStoredLocale();
  return useMemo(
    () => buildAIRecommendations(trainingState, locale),
    [trainingState, locale],
  );
}
