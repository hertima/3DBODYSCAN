import { type AthleteProfile } from "@/domain/athlete/profile";
import { type BodyTrainingContext } from "@/domain/body/state";
import { type EnvironmentContext } from "@/domain/environment/context";
import { type NutritionTrainingContext } from "@/domain/nutrition/state";

export type TrainingModality = "academia" | "calistenia" | "hibrido";
export type CyclePhase = "base" | "progressao" | "intensificacao" | "deload";

export type PeriodizationWeek = {
  week: number;
  phase: CyclePhase;
  emphasis: string;
  volumeBias: "baixo" | "moderado" | "alto";
  intensityBias: "leve" | "moderada" | "pesada";
};

export type SexSpecificAdjustment = {
  recoveryBias: string;
  hormonalContext: string;
  metabolicContext: string;
  splitBias: string;
};

export type TwelveWeekBlock = {
  modality: TrainingModality;
  goal: string;
  currentWeek: number;
  weeks: PeriodizationWeek[];
  summary: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  adjustments: SexSpecificAdjustment;
};

function resolveTrainingModality(
  profile: AthleteProfile,
  environment: EnvironmentContext,
): TrainingModality {
  if (profile.location === "hibrido") return "hibrido";
  if (profile.location === "outdoor") return "calistenia";
  if (profile.goal === "performance") return "hibrido";

  const homeEquipment = profile.equipment.map((item) => item.toLowerCase());
  const hasGymBias =
    environment.location === "academia" ||
    homeEquipment.some((item) =>
      ["maquina", "cabos", "barra", "halteres", "banco"].includes(item),
    );

  return hasGymBias ? "academia" : "calistenia";
}

function resolveCurrentWeek(profile: AthleteProfile) {
  if (!profile.onboardingCompletedAt) return 1;

  const start = new Date(profile.onboardingCompletedAt);
  if (Number.isNaN(start.getTime())) return 1;

  const diffMs = Date.now() - start.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, ((diffWeeks - 1) % 12) + 1);
}

function resolveWeekPhase(week: number): CyclePhase {
  if (week <= 4) return "base";
  if (week <= 8) return "progressao";
  if (week <= 11) return "intensificacao";
  return "deload";
}

function resolveWeekEmphasis(
  phase: CyclePhase,
  modality: TrainingModality,
  profile: AthleteProfile,
) {
  if (phase === "base") {
    if (modality === "calistenia") return "técnica, controle corporal e volume base";
    if (modality === "hibrido") return "fundação de força e skill";
    return "volume base e execução limpa";
  }

  if (phase === "progressao") {
    if (profile.goal === "forca") return "sobrecarga progressiva nos movimentos principais";
    if (profile.goal === "ganho_massa") return "crescimento de volume e tensão mecânica";
    return "construção de capacidade e aderência";
  }

  if (phase === "intensificacao") {
    if (modality === "calistenia") return "alavancas mais difíceis e consolidação de skill";
    if (modality === "hibrido") return "transferência entre carga externa e domínio corporal";
    return "mais carga, menos dispersão e foco nos compostos";
  }

  return "redução de fadiga, consolidação técnica e transição do bloco";
}

function resolveVolumeBias(phase: CyclePhase): PeriodizationWeek["volumeBias"] {
  if (phase === "base" || phase === "progressao") return "alto";
  if (phase === "intensificacao") return "moderado";
  return "baixo";
}

function resolveIntensityBias(phase: CyclePhase): PeriodizationWeek["intensityBias"] {
  if (phase === "base") return "leve";
  if (phase === "progressao") return "moderada";
  if (phase === "intensificacao") return "pesada";
  return "leve";
}

function buildSexSpecificAdjustment(
  profile: AthleteProfile,
  body: BodyTrainingContext,
  nutrition: NutritionTrainingContext,
): SexSpecificAdjustment {
  if (profile.sex === "feminino") {
    return {
      recoveryBias:
        body.recompositionFocus || nutrition.needsRecoverySupport
          ? "volume distribuído com recuperação mais protegida"
          : "frequência consistente com margem boa de recuperação",
      hormonalContext:
        "ajustes finos de densidade e fadiga devem respeitar flutuações hormonais e resposta individual.",
      metabolicContext:
        body.bodyFatPct && body.bodyFatPct > 18
          ? "foco em aderência metabólica, densidade moderada e consistência."
          : "boa tolerância para frequência e bloco estético quando a recuperação acompanha.",
      splitBias:
        profile.goal === "ganho_massa" || profile.goal === "definicao"
          ? "prioridade de inferiores e glúteos quando o objetivo pedir."
          : "divisão equilibrada sem perder o foco principal.",
    };
  }

  if (profile.sex === "masculino") {
    return {
      recoveryBias:
        nutrition.needsRecoverySupport
          ? "intensidade preservada com volume mais controlado"
          : "janela maior para intensificação progressiva quando a base nutricional sustenta.",
      hormonalContext:
        "blocos de carga podem ser mais agressivos, mas ainda dependem de sono, nutrição e fadiga acumulada.",
      metabolicContext:
        body.bodyFatPct && body.bodyFatPct > 20
          ? "metabolismo pede melhor controle de densidade, energia e aderência."
          : "contexto metabólico favorece ciclos de hipertrofia ou força com boa resposta.",
      splitBias:
        profile.goal === "ganho_massa" || profile.goal === "forca"
          ? "mais espaço para peitoral, costas e ombros quando o objetivo justificar."
          : "divisão equilibrada com foco no objetivo real.",
    };
  }

  return {
    recoveryBias: "recuperação ajustada pelo estado corporal e nutricional atual.",
    hormonalContext: "ajustes hormonais dependem do perfil completo e da resposta individual.",
    metabolicContext: "o metabolismo do bloco é calibrado por composição corporal, nutrição e aderência.",
    splitBias: "o split respeita objetivo, modalidade e contexto do atleta.",
  };
}

function buildSummary(
  modality: TrainingModality,
  goal: AthleteProfile["goal"],
  currentWeek: number,
) {
  return {
    shortTerm: `Semana ${currentWeek} do bloco de 12 semanas com foco em ${goal.replaceAll("_", " ")} dentro da modalidade ${modality}.`,
    mediumTerm:
      "O trimestre alterna base, progressão, intensificação e deload para evitar platô e manter recorrência.",
    longTerm:
      "A jornada anual usa quatro blocos de 12 semanas para sustentar curto, médio e longo prazo com fundamento profissional.",
  };
}

export function buildPeriodizationBlock(
  profile: AthleteProfile,
  body: BodyTrainingContext,
  nutrition: NutritionTrainingContext,
  environment: EnvironmentContext,
): TwelveWeekBlock {
  const modality = resolveTrainingModality(profile, environment);
  const currentWeek = resolveCurrentWeek(profile);

  return {
    modality,
    goal: profile.goal,
    currentWeek,
    weeks: Array.from({ length: 12 }, (_, index) => {
      const week = index + 1;
      const phase = resolveWeekPhase(week);

      return {
        week,
        phase,
        emphasis: resolveWeekEmphasis(phase, modality, profile),
        volumeBias: resolveVolumeBias(phase),
        intensityBias: resolveIntensityBias(phase),
      };
    }),
    summary: buildSummary(modality, profile.goal, currentWeek),
    adjustments: buildSexSpecificAdjustment(profile, body, nutrition),
  };
}
