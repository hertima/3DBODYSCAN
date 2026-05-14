import { useMemo } from "react";
import { buildGamificationState } from "@/domain/gamification/engine";
import { buildDopamineLoop } from "@/domain/gamification/loop";
import type { GeneratedTrainingState } from "@/domain/training/engine";

export function useGamification(trainingState: GeneratedTrainingState) {
  return useMemo(
    () => ({
      gamification: buildGamificationState(trainingState),
      dopamineLoop: buildDopamineLoop(trainingState),
    }),
    [trainingState],
  );
}
