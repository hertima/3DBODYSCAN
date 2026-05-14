import { useMemo } from "react";
import { getCurrentTrainingState } from "@/domain/training/engine";

export function useTrainingState() {
  return useMemo(() => getCurrentTrainingState(), []);
}
