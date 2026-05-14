import { useMemo } from "react";
import { buildAIRecommendations } from "@/domain/ai/recommendations";
import type { GeneratedTrainingState } from "@/domain/training/engine";

export function useAIInsights(trainingState: GeneratedTrainingState) {
  return useMemo(() => buildAIRecommendations(trainingState), [trainingState]);
}
