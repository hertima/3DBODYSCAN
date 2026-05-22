import { type GeneratedTrainingState } from "@/domain/training/engine";
import { buildGamificationState, type GamificationMission } from "@/domain/gamification/engine";
import { getGamificationCopy } from "@/lib/app-copy";

export type DopamineLoopState = {
  headline: string;
  message: string;
  momentumLabel: string;
  nextUnlock: string;
  highlightedMission: GamificationMission;
};

function getTopMission(state: ReturnType<typeof buildGamificationState>) {
  return (
    state.missions.diaria[0] ??
    state.missions.semanal[0] ??
    state.missions.mensal[0]
  );
}

function getMomentumLabel(
  trainingState: GeneratedTrainingState,
  streakDays: number,
  momentum: ReturnType<typeof getGamificationCopy>["loop"]["momentum"],
) {
  if (streakDays >= 21) return momentum.elite;
  if (trainingState.nutrition.hydrationStatus === "baixa") return momentum.hydration;
  if (trainingState.nutrition.readinessLevel === "alta") return momentum.ready;
  if (trainingState.body.priorityLevel === "alta") return momentum.bodyFocus;
  return momentum.building;
}

export function buildDopamineLoop(trainingState: GeneratedTrainingState, locale?: string): DopamineLoopState {
  const copy = getGamificationCopy(locale as Parameters<typeof getGamificationCopy>[0]);
  const l = copy.loop;
  const gamification = buildGamificationState(trainingState, locale);
  const highlightedMission = getTopMission(gamification);
  const missionPct = Math.min(
    100,
    Math.round((highlightedMission.progress / highlightedMission.target) * 100),
  );
  const remainingXp = Math.max(0, gamification.level * 300 - gamification.xp);

  return {
    headline:
      missionPct >= 100
        ? l.missionDone
        : missionPct >= 70
          ? l.nearMilestone
          : l.inProgress,
    message:
      missionPct >= 100
        ? `${highlightedMission.title.toLowerCase()} ${l.missionClosedMsg}`
        : `${highlightedMission.title.toLowerCase()} ${missionPct}%. ${l.missionPctMsg}`,
    momentumLabel: getMomentumLabel(trainingState, gamification.streakDays, l.momentum),
    nextUnlock:
      remainingXp > 0
        ? `${l.xpRemaining} ${remainingXp} ${l.xpToLevel} ${gamification.level + 1}.`
        : `${l.levelConsolidated}`,
    highlightedMission,
  };
}
