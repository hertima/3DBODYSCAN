import { libraryExercises, type Exercise } from "@/data/library";
import type { LocalizedText } from "@/domain/shared/localization";
import { createLocalizedText } from "@/domain/shared/localization";
import { cleanLegacyText, normalizeText } from "@/lib/formatting";

export const officialMuscleCategories = [
  "peitoral",
  "costas_trapezio",
  "deltoides",
  "biceps_antebraco",
  "triceps",
  "abdomen_core",
  "membros_inferiores_gluteos",
  "panturrilha",
] as const;

export const officialTrainingTypes = ["musculacao", "calistenia"] as const;

export const officialEquipment = [
  "barra",
  "halteres",
  "cabos",
  "maquina",
  "peso_corporal",
  "barra_fixa",
  "paralelas",
  "parede",
  "banco",
  "trx",
  "bola",
  "elastico",
] as const;

export type OfficialMuscleCategory = (typeof officialMuscleCategories)[number];
export type OfficialTrainingType = (typeof officialTrainingTypes)[number];
export type OfficialEquipment = (typeof officialEquipment)[number];

export type ExerciseCatalogRecord = {
  id: string;
  slug: string;
  name: LocalizedText;
  aliases: string[];
  trainingType: OfficialTrainingType;
  category: OfficialMuscleCategory;
  secondaryCategories: OfficialMuscleCategory[];
  equipment: OfficialEquipment;
  movementPattern: LocalizedText;
  sourceGroup: string | null;
  gifPath: string | null;
  gifSource: "official" | "catalog" | "fallback";
  status: "active" | "review" | "hidden";
};

function normalize(value: string) {
  return normalizeText(value);
}

function slugify(value: string) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function displayValue(value: string) {
  return cleanLegacyText(value);
}

function resolveTrainingType(exercise: Exercise): OfficialTrainingType {
  return normalize(exercise.type).includes("calisten") ? "calistenia" : "musculacao";
}

function resolveCategory(exercise: Exercise): OfficialMuscleCategory {
  const muscle = normalize(displayValue(exercise.muscle));
  const sourceGroup = normalize(exercise.sourceGroup ?? "");
  const name = normalize(displayValue(exercise.name));

  const hasToken = (...tokens: string[]) =>
    tokens.some((token) => muscle.includes(token) || sourceGroup.includes(token) || name.includes(token));

  if (hasToken("panturrilha", "gemeos", "calf")) return "panturrilha";
  if (hasToken("gluteos", "gluteo", "glute", "abdutora", "hip thrust", "coice")) {
    return "membros_inferiores_gluteos";
  }
  if (
    hasToken(
      "membros inferiores",
      "pernas",
      "quadriceps",
      "posterior",
      "isquiotib",
      "agach",
      "afundo",
      "avanco",
      "passada",
      "stiff",
      "terra",
      "leg press",
      "extensora",
      "flexora",
    )
  ) {
    return "membros_inferiores_gluteos";
  }
  if (hasToken("costas", "trapezio", "remada", "puxada", "pulldown", "pulley", "barra fixa")) {
    return "costas_trapezio";
  }
  if (hasToken("peitoral", "peito", "supino", "crossover", "crucifixo", "fly", "flexao")) {
    return "peitoral";
  }
  if (
    hasToken(
      "deltoides",
      "ombro",
      "ombros",
      "arnold",
      "elevacao lateral",
      "elevacao frontal",
      "desenvolvimento",
    )
  ) {
    return "deltoides";
  }
  if (hasToken("triceps", "tricep", "corda", "frances", "testa", "mergulho")) {
    return "triceps";
  }
  if (hasToken("biceps", "antebraco", "rosca", "curl", "martelo")) {
    return "biceps_antebraco";
  }
  if (
    hasToken("abdomen", "core", "abdominal", "crunch", "prancha", "plank", "leg raise", "ab roller")
  ) {
    return "abdomen_core";
  }

  if (resolveTrainingType(exercise) === "calistenia") {
    return "abdomen_core";
  }

  return "membros_inferiores_gluteos";
}

function resolveEquipment(exercise: Exercise): OfficialEquipment {
  const value = normalize(displayValue(exercise.equipment));

  if (value.includes("barra fixa")) return "barra_fixa";
  if (value.includes("paralela")) return "paralelas";
  if (value.includes("parede")) return "parede";
  if (value.includes("peso corporal")) return "peso_corporal";
  if (value.includes("halter")) return "halteres";
  if (value.includes("cabo")) return "cabos";
  if (value.includes("maquina")) return "maquina";
  if (value.includes("banco")) return "banco";
  if (value.includes("trx")) return "trx";
  if (value.includes("bola")) return "bola";
  if (value.includes("elastico")) return "elastico";

  return "barra";
}

function resolveGifSource(exercise: Exercise): "official" | "catalog" | "fallback" {
  if (!exercise.gifUrl) return "fallback";
  if (
    exercise.gifUrl.includes("/musculacao-media/") ||
    exercise.gifUrl.includes("/calistenia-pura/")
  ) {
    return "catalog";
  }
  return "official";
}

export function mapExerciseToCatalogRecord(exercise: Exercise): ExerciseCatalogRecord {
  const normalizedName = displayValue(exercise.name);

  return {
    id: exercise.id,
    slug: slugify(normalizedName || exercise.id),
    name: createLocalizedText(normalizedName),
    aliases: [exercise.id, normalizedName, exercise.sourceGroup ?? ""].filter(Boolean),
    trainingType: resolveTrainingType(exercise),
    category: resolveCategory(exercise),
    secondaryCategories: [],
    equipment: resolveEquipment(exercise),
    movementPattern: createLocalizedText(displayValue(exercise.biomechanics)),
    sourceGroup: exercise.sourceGroup ?? null,
    gifPath: exercise.gifUrl ?? null,
    gifSource: resolveGifSource(exercise),
    status: "active",
  };
}

export function isFunctionalExerciseRecord(record: ExerciseCatalogRecord) {
  const movement = normalize(
    [record.name.pt, record.movementPattern.pt, record.sourceGroup ?? ""].join(" "),
  );
  if (record.trainingType === "calistenia") return true;

  const functionalEquipment = [
    "peso_corporal",
    "parede",
    "trx",
    "bola",
    "elastico",
  ];

  return (
    functionalEquipment.includes(record.equipment) ||
    [
      "agach",
      "afundo",
      "unilateral",
      "core",
      "prancha",
      "plank",
      "estabil",
      "isometr",
      "mobilidade",
      "potencia",
      "salto",
      "controle",
      "condicionamento",
    ].some((token) => movement.includes(token))
  );
}

export function buildExerciseCatalog(exercises: Exercise[] = libraryExercises) {
  return exercises.map(mapExerciseToCatalogRecord);
}
