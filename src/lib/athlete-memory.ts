import { getWorkoutHistory } from "@/lib/workout-history";
import { bodyScans, foodScans } from "@/data/scans";
import { bodyMeasures, bodyComposition } from "@/data/body";

export type AthleteMemoryContext = {
  workoutHistory: {
    totalSessions: number;
    last28Days: number;
    lastWorkoutDate: string | null;
    recentSummary: string;
    plateaus: string[];
    strongPoints: string[];
  };
  bodyScanTrend: {
    scanCount: number;
    latestDate: string | null;
    bodyFatCurrent: number | null;
    bodyFatChange: number | null;
    weightKg: number | null;
    weightChange: number | null;
    waistCm: number | null;
    waistChange: number | null;
    musclePriorities: string[];
    trend: string | null;
  };
  measurements: {
    chest: number | null;
    arm: number | null;
    thigh: number | null;
    calf: number | null;
    deltaChest: number | null;
    deltaArm: number | null;
  };
  nutrition: {
    avgProteinG: number | null;
    avgCaloriesKcal: number | null;
    recentScansCount: number;
  };
};

function daysBetween(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function buildWorkoutMemory() {
  const history = getWorkoutHistory();
  const total = history.length;
  const last28 = history.filter((w) => daysBetween(w.date) <= 28).length;
  const lastDate = history[0]?.date ?? null;

  // Detect plateaus: exercises with 0 weight progression in last 3+ sessions
  const exerciseWeightMap = new Map<string, number[]>();
  history.slice(0, 12).forEach((w) => {
    w.exercises.forEach((e) => {
      const maxWeight = Math.max(...e.sets.map((s) => s.weight), 0);
      if (!exerciseWeightMap.has(e.name)) exerciseWeightMap.set(e.name, []);
      exerciseWeightMap.get(e.name)!.push(maxWeight);
    });
  });

  const plateaus: string[] = [];
  const strongPoints: string[] = [];
  exerciseWeightMap.forEach((weights, name) => {
    if (weights.length < 3) return;
    const recent = weights.slice(0, 3);
    const isStagnant = Math.max(...recent) === Math.min(...recent) && recent[0] > 0;
    const isProgressing = recent[0] > recent[recent.length - 1];
    if (isStagnant) plateaus.push(name);
    if (isProgressing) strongPoints.push(name);
  });

  const recentNames = history.slice(0, 5).map((w) => w.name);
  const recentSummary =
    recentNames.length > 0
      ? `Últimos ${recentNames.length} treinos: ${recentNames.join(", ")}`
      : "Sem treinos registrados ainda";

  return { totalSessions: total, last28Days: last28, lastWorkoutDate: lastDate, recentSummary, plateaus, strongPoints };
}

function buildScanMemory() {
  const scans = bodyScans;
  if (scans.length === 0) {
    return {
      scanCount: 0,
      latestDate: null,
      bodyFatCurrent: bodyComposition.bodyFat,
      bodyFatChange: null,
      weightKg: bodyComposition.weight,
      weightChange: null,
      waistCm: null,
      waistChange: null,
      musclePriorities: [],
      trend: null,
    };
  }

  const latest = scans[0];
  const oldest = scans[scans.length - 1];

  return {
    scanCount: scans.length,
    latestDate: latest.data,
    bodyFatCurrent: latest.estimativas.percentualGorduraEstimado,
    bodyFatChange: parseFloat(
      (latest.estimativas.percentualGorduraEstimado - oldest.estimativas.percentualGorduraEstimado).toFixed(1),
    ),
    weightKg: latest.calibragem.pesoKg,
    weightChange: parseFloat((latest.calibragem.pesoKg - oldest.calibragem.pesoKg).toFixed(1)),
    waistCm: latest.estimativas.cinturaCmEstimada,
    waistChange: parseFloat(
      (latest.estimativas.cinturaCmEstimada - oldest.estimativas.cinturaCmEstimada).toFixed(1),
    ),
    musclePriorities: latest.analiseIA.prioridadeMuscular,
    trend: latest.analiseIA.tendenciaCorporal,
  };
}

function buildMeasurementMemory() {
  const chest = bodyMeasures.find((m) => m.key === "peito");
  const arm = bodyMeasures.find((m) => m.key === "braco");
  const thigh = bodyMeasures.find((m) => m.key === "coxa");
  const calf = bodyMeasures.find((m) => m.key === "panturrilha");

  return {
    chest: chest?.value ?? null,
    arm: arm?.value ?? null,
    thigh: thigh?.value ?? null,
    calf: calf?.value ?? null,
    deltaChest: chest?.delta ?? null,
    deltaArm: arm?.delta ?? null,
  };
}

function buildNutritionMemory() {
  const recent = foodScans.slice(0, 10);
  if (recent.length === 0) return { avgProteinG: null, avgCaloriesKcal: null, recentScansCount: 0 };

  const avgProtein = Math.round(
    recent.reduce((sum, f) => sum + f.estimativas.proteinaG, 0) / recent.length,
  );
  const avgCalories = Math.round(
    recent.reduce((sum, f) => sum + f.estimativas.kcal, 0) / recent.length,
  );

  return { avgProteinG: avgProtein, avgCaloriesKcal: avgCalories, recentScansCount: recent.length };
}

export function buildAthleteMemory(): AthleteMemoryContext {
  return {
    workoutHistory: buildWorkoutMemory(),
    bodyScanTrend: buildScanMemory(),
    measurements: buildMeasurementMemory(),
    nutrition: buildNutritionMemory(),
  };
}

export function serializeMemoryForAI(memory: AthleteMemoryContext): string {
  const lines: string[] = ["## Histórico e Memória do Atleta"];

  // Workout history
  lines.push(`\n### Treinos`);
  lines.push(`- Total de sessões registradas: ${memory.workoutHistory.totalSessions}`);
  lines.push(`- Frequência últimos 28 dias: ${memory.workoutHistory.last28Days} treinos`);
  if (memory.workoutHistory.lastWorkoutDate) {
    lines.push(`- Último treino: ${memory.workoutHistory.lastWorkoutDate}`);
  }
  lines.push(`- ${memory.workoutHistory.recentSummary}`);

  if (memory.workoutHistory.plateaus.length > 0) {
    lines.push(`- ⚠️ PLATÔ DETECTADO em: ${memory.workoutHistory.plateaus.slice(0, 3).join(", ")} (peso estagnado 3+ sessões)`);
  }
  if (memory.workoutHistory.strongPoints.length > 0) {
    lines.push(`- ✅ Progredindo em: ${memory.workoutHistory.strongPoints.slice(0, 3).join(", ")}`);
  }

  // Body scan
  if (memory.bodyScanTrend.scanCount > 0) {
    lines.push(`\n### Scans Corporais (${memory.bodyScanTrend.scanCount} scans)`);
    if (memory.bodyScanTrend.bodyFatCurrent !== null) {
      const fatChange = memory.bodyScanTrend.bodyFatChange;
      lines.push(`- Gordura corporal atual: ${memory.bodyScanTrend.bodyFatCurrent}%${fatChange !== null ? ` (${fatChange > 0 ? "+" : ""}${fatChange}% vs início)` : ""}`);
    }
    if (memory.bodyScanTrend.weightKg !== null) {
      const wChange = memory.bodyScanTrend.weightChange;
      lines.push(`- Peso: ${memory.bodyScanTrend.weightKg}kg${wChange !== null ? ` (${wChange > 0 ? "+" : ""}${wChange}kg)` : ""}`);
    }
    if (memory.bodyScanTrend.waistCm !== null) {
      const wChange = memory.bodyScanTrend.waistChange;
      lines.push(`- Cintura: ${memory.bodyScanTrend.waistCm}cm${wChange !== null ? ` (${wChange > 0 ? "+" : ""}${wChange}cm)` : ""}`);
    }
    if (memory.bodyScanTrend.trend) {
      lines.push(`- Tendência corporal: ${memory.bodyScanTrend.trend}`);
    }
    if (memory.bodyScanTrend.musclePriorities.length > 0) {
      lines.push(`- Prioridade muscular pelo scan: ${memory.bodyScanTrend.musclePriorities.join(", ")}`);
    }
  }

  // Measurements
  const m = memory.measurements;
  if (m.chest || m.arm) {
    lines.push(`\n### Medidas`);
    if (m.chest) lines.push(`- Peito: ${m.chest}cm${m.deltaChest ? ` (${m.deltaChest > 0 ? "+" : ""}${m.deltaChest}cm)` : ""}`);
    if (m.arm) lines.push(`- Braço: ${m.arm}cm${m.deltaArm ? ` (${m.deltaArm > 0 ? "+" : ""}${m.deltaArm}cm)` : ""}`);
    if (m.thigh) lines.push(`- Coxa: ${m.thigh}cm`);
    if (m.calf) lines.push(`- Panturrilha: ${m.calf}cm`);
  }

  // Nutrition
  if (memory.nutrition.recentScansCount > 0) {
    lines.push(`\n### Nutrição (média dos últimos ${memory.nutrition.recentScansCount} scans)`);
    if (memory.nutrition.avgProteinG) lines.push(`- Proteína média: ${memory.nutrition.avgProteinG}g/refeição`);
    if (memory.nutrition.avgCaloriesKcal) lines.push(`- Calorias médias: ${memory.nutrition.avgCaloriesKcal}kcal/refeição`);
  }

  return lines.join("\n");
}
