import { nutritionToday } from "@/data/nutrition";
import { foodScans, type FoodScan } from "@/data/scans";

export type NutritionTrainingContext = {
  kcalCompletionPct: number;
  proteinCompletionPct: number;
  carbsCompletionPct: number;
  hydrationCompletionPct: number;
  lastFoodScan: FoodScan | null;
  readinessLevel: "baixa" | "media" | "alta";
  needsRecoverySupport: boolean;
  hydrationStatus: "baixa" | "media" | "alta";
};

function toPercent(eaten: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((eaten / goal) * 100)));
}

function resolveReadinessLevel(kcalPct: number, proteinPct: number, confidence: number) {
  if (kcalPct >= 75 && proteinPct >= 70 && confidence >= 85) return "alta" as const;
  if (kcalPct >= 55 && proteinPct >= 50) return "media" as const;
  return "baixa" as const;
}

export function buildNutritionTrainingContext(
  snapshot = nutritionToday,
  scans: FoodScan[] = foodScans,
): NutritionTrainingContext {
  const lastFoodScan = scans[0] ?? null;
  const kcalCompletionPct = toPercent(snapshot.kcal.eaten, snapshot.kcal.goal);
  const proteinCompletionPct = toPercent(snapshot.macros.protein.eaten, snapshot.macros.protein.goal);
  const carbsCompletionPct = toPercent(snapshot.macros.carbs.eaten, snapshot.macros.carbs.goal);
  const hydrationCompletionPct = toPercent(
    snapshot.hydration.eatenMl,
    snapshot.hydration.goalMl,
  );
  const confidence = lastFoodScan?.qualidade.confiancaLeitura ?? 0;
  const readinessLevel = resolveReadinessLevel(kcalCompletionPct, proteinCompletionPct, confidence);
  const hydrationStatus =
    hydrationCompletionPct >= 80 ? "alta" : hydrationCompletionPct >= 55 ? "media" : "baixa";

  return {
    kcalCompletionPct,
    proteinCompletionPct,
    carbsCompletionPct,
    hydrationCompletionPct,
    lastFoodScan,
    readinessLevel,
    needsRecoverySupport:
      kcalCompletionPct < 60 || proteinCompletionPct < 55 || hydrationCompletionPct < 55,
    hydrationStatus,
  };
}
