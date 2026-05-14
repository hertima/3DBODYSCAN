import { type Macro, type Meal } from "@/data/nutrition";
import { type FoodScan } from "@/data/scans";
import { type AthleteProfile } from "@/domain/athlete/profile";

export type NutritionSnapshot = {
  kcal: Macro;
  macros: {
    protein: Macro;
    fat: Macro;
    carbs: Macro;
  };
  meals: Meal[];
};

export type NutritionInsight = {
  id: string;
  title: string;
  desc: string;
  tone: "alerta" | "equilibrio" | "performance";
};

export type NutritionEvaluation = {
  balanceLabel: string;
  primaryMessage: string;
  insights: NutritionInsight[];
  latestFoodScan: FoodScan | null;
};

function getGoalLabel(profile: AthleteProfile) {
  if (profile.goal === "ganho_massa") return "ganho de massa";
  if (profile.goal === "perda_peso") return "perda de peso";
  if (profile.goal === "definicao") return "definição";
  if (profile.goal === "forca") return "força";
  if (profile.goal === "performance") return "performance";
  return "saude";
}

function getRemainingPercent(macro: Macro) {
  if (macro.goal <= 0) return 0;
  return Math.max(0, 100 - Math.round((macro.eaten / macro.goal) * 100));
}

export function evaluateNutritionState(
  profile: AthleteProfile,
  snapshot: NutritionSnapshot,
  foodScans: FoodScan[],
): NutritionEvaluation {
  const proteinGap = snapshot.macros.protein.goal - snapshot.macros.protein.eaten;
  const kcalGap = snapshot.kcal.goal - snapshot.kcal.eaten;
  const latestFoodScan = foodScans[0] ?? null;
  const goalLabel = getGoalLabel(profile);
  const proteinRemainingPct = getRemainingPercent(snapshot.macros.protein);

  const primaryMessage =
    proteinGap > 35
      ? `Você ainda está ${proteinRemainingPct}% abaixo da meta de proteína para ${goalLabel}.`
      : kcalGap > 250
        ? `Seu plano ainda tem espaço calórico para fechar o dia alinhado com ${goalLabel}.`
        : `Sua alimentação de hoje está mais alinhada com o objetivo de ${goalLabel}.`;

  const balanceLabel =
    proteinGap > 35 ? "proteína baixa" : kcalGap > 250 ? "janela aberta" : "equilíbrio bom";

  const insights: NutritionInsight[] = [
    {
      id: "hidratacao",
      title: "Hidratação",
      desc:
        profile.location === "outdoor"
          ? "Treino em ambiente externo pede mais água ao longo do dia e reposição antes do treino."
          : "Distribua água ao longo do dia e concentre 2 copos nas horas antes do treino.",
      tone: "equilibrio",
    },
    {
      id: "proteina",
      title: "Proteína do dia",
      desc:
        proteinGap > 35
          ? `Faltam cerca de ${Math.max(0, Math.round(proteinGap))}g de proteína. Uma refeição com carne magra, ovos ou whey ajuda a fechar o alvo.`
          : "A meta de proteína está mais bem distribuída hoje. Mantenha o jantar consistente.",
      tone: proteinGap > 35 ? "alerta" : "equilibrio",
    },
    {
      id: "scan_refeicao",
      title: "Leitura da última refeição",
      desc: latestFoodScan
        ? `O último scan da refeição ${latestFoodScan.refeicao.toLowerCase()} marcou ${latestFoodScan.estimativas.kcal} kcal, ${latestFoodScan.estimativas.proteinaG}g de proteína e ${latestFoodScan.qualidade.confiancaLeitura}% de confiança.`
        : "Ainda não existe scan alimentar salvo para validar o prato de hoje.",
      tone: "performance",
    },
  ];

  return {
    balanceLabel,
    primaryMessage,
    insights,
    latestFoodScan,
  };
}
