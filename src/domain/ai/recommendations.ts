import { type GeneratedTrainingState } from "@/domain/training/engine";

export type AIRecommendation = {
  id: string;
  title: string;
  message: string;
  priority: "alta" | "media" | "baixa";
  type: "treino" | "nutricao" | "recuperacao" | "ambiente" | "hidratacao";
};

function getPrimaryWorkoutName(state: GeneratedTrainingState) {
  return state.workouts[0]?.name ?? "treino atual";
}

function buildRecoveryRecommendation(state: GeneratedTrainingState): AIRecommendation | null {
  if (!state.nutrition.needsRecoverySupport) return null;

  return {
    id: "recovery-support",
    title: "Recovery em proteção",
    message:
      "Sua base nutricional ainda está curta para sustentar carga alta. Mantenha a técnica limpa e segure a agressividade nas últimas séries.",
    priority: "alta",
    type: "recuperacao",
  };
}

function buildNutritionRecommendation(state: GeneratedTrainingState): AIRecommendation | null {
  if (state.nutrition.proteinCompletionPct >= 70) return null;

  return {
    id: "protein-gap",
    title: "Proteína abaixo do alvo",
    message: `Seu dia ainda está em ${state.nutrition.proteinCompletionPct}% da meta de proteína. Feche isso antes do próximo treino pesado.`,
    priority: "alta",
    type: "nutricao",
  };
}

function buildHydrationRecommendation(state: GeneratedTrainingState): AIRecommendation | null {
  if (state.nutrition.hydrationStatus !== "baixa") return null;

  return {
    id: "hydration-gap",
    title: "Hidratação abaixo do alvo",
    message: `Sua água do dia está em ${state.nutrition.hydrationCompletionPct}% da meta. Suba isso antes do treino para melhorar recuperação e rendimento.`,
    priority: "alta",
    type: "hidratacao",
  };
}

function buildBodyPriorityRecommendation(state: GeneratedTrainingState): AIRecommendation | null {
  const focus = state.body.muscularPriorities[0];
  if (!focus) return null;

  return {
    id: "body-priority",
    title: "Prioridade corporal ativa",
    message: `O scan está puxando prioridade para ${focus.replaceAll("_", " ")}. O plano da semana já favorece esse bloco sem perder equilíbrio geral.`,
    priority: state.body.priorityLevel === "alta" ? "alta" : "media",
    type: "treino",
  };
}

function buildEnvironmentRecommendation(state: GeneratedTrainingState): AIRecommendation | null {
  if (state.environment.location !== "academia" && state.environment.location !== "hibrido") {
    return null;
  }

  if (state.environment.crowdLevel !== "pico") return null;

  return {
    id: "peak-hours",
    title: "Academia em horário de pico",
    message:
      "Seu treino foi priorizado com opções mais viáveis para evitar fila e manter fluidez entre os exercícios.",
    priority: "media",
    type: "ambiente",
  };
}

function buildExecutionRecommendation(state: GeneratedTrainingState): AIRecommendation {
  const workoutName = getPrimaryWorkoutName(state);
  const intensity = state.schedule.find((item) => item.workoutId)?.intensity ?? "Moderado";

  return {
    id: "execution-focus",
    title: "Execução do dia",
    message: `No ${workoutName}, mantenha os primeiros movimentos em técnica limpa e use a progressão de carga só quando o bloco estiver estável em intensidade ${intensity.toLowerCase()}.`,
    priority: "media",
    type: "treino",
  };
}

export function buildAIRecommendations(state: GeneratedTrainingState) {
  const recommendations = [
    buildRecoveryRecommendation(state),
    buildHydrationRecommendation(state),
    buildNutritionRecommendation(state),
    buildBodyPriorityRecommendation(state),
    buildEnvironmentRecommendation(state),
    buildExecutionRecommendation(state),
  ].filter((item): item is AIRecommendation => Boolean(item));

  const primary = recommendations[0] ?? buildExecutionRecommendation(state);

  return {
    primary,
    items: recommendations.slice(0, 3),
  };
}
