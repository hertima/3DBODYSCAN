import { type GeneratedTrainingState } from "@/domain/training/engine";
import { buildGamificationState, type GamificationMission } from "@/domain/gamification/engine";

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

function getMomentumLabel(trainingState: GeneratedTrainingState, streakDays: number) {
  if (streakDays >= 21) return "ritmo elite";
  if (trainingState.nutrition.hydrationStatus === "baixa") return "ajuste de hidratação";
  if (trainingState.nutrition.readinessLevel === "alta") return "pronto para subir";
  if (trainingState.body.priorityLevel === "alta") return "foco corporal ativo";
  return "consistência em construção";
}

export function buildDopamineLoop(trainingState: GeneratedTrainingState): DopamineLoopState {
  const gamification = buildGamificationState(trainingState);
  const highlightedMission = getTopMission(gamification);
  const missionPct = Math.min(
    100,
    Math.round((highlightedMission.progress / highlightedMission.target) * 100),
  );
  const remainingXp = Math.max(0, gamification.level * 300 - gamification.xp);

  return {
    headline:
      missionPct >= 100
        ? "Missão concluída"
        : missionPct >= 70
          ? "Você está perto do próximo marco"
          : "Seu progresso já está em movimento",
    message:
      missionPct >= 100
        ? `A missão ${highlightedMission.title.toLowerCase()} foi fechada. Hora de empilhar a próxima sem perder o ritmo.`
        : `A missão ${highlightedMission.title.toLowerCase()} está em ${missionPct}%. Mantenha o plano para consolidar esse ganho.`,
    momentumLabel: getMomentumLabel(trainingState, gamification.streakDays),
    nextUnlock:
      remainingXp > 0
        ? `Faltam ${remainingXp} XP para o nível ${gamification.level + 1}.`
        : `Nível ${gamification.level} consolidado. Prepare o próximo salto.`,
    highlightedMission,
  };
}
