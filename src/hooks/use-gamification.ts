import { useMemo } from "react";
import { buildGamificationState } from "@/domain/gamification/engine";
import { buildDopamineLoop } from "@/domain/gamification/loop";
import { getStoredLocale } from "@/lib/locale";
import type { GeneratedTrainingState } from "@/domain/training/engine";

export function useGamification(trainingState: GeneratedTrainingState) {
  const locale = getStoredLocale();
  return useMemo(
    () => ({
      gamification: buildGamificationState(trainingState, locale),
      dopamineLoop: buildDopamineLoop(trainingState, locale),
    }),
    [trainingState, locale],
  );
}
