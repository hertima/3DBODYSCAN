import { useMemo } from "react";
import { buildExerciseCatalog } from "@/domain/exercises/catalog";

export function useExerciseCatalog() {
  return useMemo(() => buildExerciseCatalog(), []);
}
