import { bodyComposition } from "@/data/body";
import { bodyScans, type BodyScan } from "@/data/scans";
import { type OfficialMuscleCategory } from "@/domain/exercises/catalog";

export type BodyPriorityLevel = "baixa" | "media" | "alta";

export type BodyTrainingContext = {
  latestScan: BodyScan | null;
  bodyFatPct: number | null;
  waistCm: number | null;
  confidenceScore: number;
  muscularPriorities: OfficialMuscleCategory[];
  priorityLevel: BodyPriorityLevel;
  recompositionFocus: boolean;
};

const scanPriorityMap: Record<string, OfficialMuscleCategory> = {
  peitoral: "peitoral",
  costas: "costas_trapezio",
  costas_trapezio: "costas_trapezio",
  deltoides: "deltoides",
  ombros: "deltoides",
  biceps: "biceps_antebraco",
  biceps_antebraco: "biceps_antebraco",
  triceps: "triceps",
  abdomen_core: "abdomen_core",
  core: "abdomen_core",
  membros_inferiores_gluteos: "membros_inferiores_gluteos",
  gluteos: "membros_inferiores_gluteos",
  inferiores: "membros_inferiores_gluteos",
  panturrilha: "panturrilha",
};

function dedupe<T>(values: T[]) {
  return Array.from(new Set(values));
}

function resolvePriorityLevel(scan: BodyScan | null): BodyPriorityLevel {
  const confidence = scan?.qualidade.confiancaLeitura ?? 0;
  if (confidence >= 88) return "alta";
  if (confidence >= 75) return "media";
  return "baixa";
}

function resolveMuscularPriorities(scan: BodyScan | null) {
  if (!scan) return [] as OfficialMuscleCategory[];

  return dedupe(
    scan.analiseIA.prioridadeMuscular
      .map((item) => scanPriorityMap[item])
      .filter((value): value is OfficialMuscleCategory => Boolean(value)),
  );
}

export function buildBodyTrainingContext(scans: BodyScan[] = bodyScans): BodyTrainingContext {
  const latestScan = scans[0] ?? null;
  const bodyFatPct = latestScan?.estimativas.percentualGorduraEstimado ?? bodyComposition.bodyFat;
  const waistCm = latestScan?.estimativas.cinturaCmEstimada ?? null;
  const muscularPriorities = resolveMuscularPriorities(latestScan);
  const priorityLevel = resolvePriorityLevel(latestScan);

  return {
    latestScan,
    bodyFatPct,
    waistCm,
    confidenceScore: latestScan?.qualidade.confiancaLeitura ?? 0,
    muscularPriorities,
    priorityLevel,
    recompositionFocus:
      latestScan?.analiseIA.tendenciaCorporal === "recomposicao" || bodyFatPct >= 16,
  };
}
