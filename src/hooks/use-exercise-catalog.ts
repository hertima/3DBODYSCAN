import { buildExerciseCatalog } from "@/domain/exercises/catalog";

const catalog = buildExerciseCatalog();

export function useExerciseCatalog() {
  return catalog;
}
