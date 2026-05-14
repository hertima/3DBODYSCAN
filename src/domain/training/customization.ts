import type { Workout } from "@/data/library";

export type WorkoutEditAction =
  | {
      type: "replace_exercise";
      workoutId: string;
      fromExerciseId: string;
      toExerciseId: string;
      reason?: string;
    }
  | {
      type: "add_exercise";
      workoutId: string;
      exerciseId: string;
      reason?: string;
    }
  | {
      type: "remove_exercise";
      workoutId: string;
      exerciseId: string;
      reason?: string;
    }
  | {
      type: "reorder_exercise";
      workoutId: string;
      exerciseId: string;
      newOrder: number;
    };

export type WorkoutCustomizationState = {
  workoutId: string;
  edits: WorkoutEditAction[];
  updatedAt: string;
};

export type WorkoutCustomizationValidation = {
  valid: boolean;
  issues: string[];
};

function clampIndex(value: number, max: number) {
  return Math.min(Math.max(value, 0), max);
}

export function applyWorkoutCustomization(workout: Workout, customization: WorkoutCustomizationState) {
  if (customization.workoutId !== workout.id) return workout;

  let exercises = [...workout.exercises];

  for (const edit of customization.edits) {
    if (edit.workoutId !== workout.id) continue;

    if (edit.type === "replace_exercise") {
      exercises = exercises.map((exercise) =>
        exercise.exerciseId === edit.fromExerciseId
          ? { ...exercise, exerciseId: edit.toExerciseId }
          : exercise,
      );
      continue;
    }

    if (edit.type === "add_exercise") {
      const reference = exercises[exercises.length - 1];
      exercises = [
        ...exercises,
        {
          exerciseId: edit.exerciseId,
          sets: reference?.sets ?? [{ reps: 12, weight: 0 }],
          rest: reference?.rest ?? 60,
        },
      ];
      continue;
    }

    if (edit.type === "remove_exercise") {
      exercises = exercises.filter((exercise) => exercise.exerciseId !== edit.exerciseId);
      continue;
    }

    const currentIndex = exercises.findIndex((exercise) => exercise.exerciseId === edit.exerciseId);
    if (currentIndex === -1) continue;

    const [exercise] = exercises.splice(currentIndex, 1);
    const nextIndex = clampIndex(edit.newOrder, exercises.length);
    exercises.splice(nextIndex, 0, exercise);
  }

  return { ...workout, exercises };
}

export function validateWorkoutCustomization(
  workout: Workout,
  customization: WorkoutCustomizationState,
): WorkoutCustomizationValidation {
  if (customization.workoutId !== workout.id) {
    return { valid: false, issues: ["Customização enviada para treino incorreto."] };
  }

  const customizedWorkout = applyWorkoutCustomization(workout, customization);
  const issues: string[] = [];

  if (customizedWorkout.exercises.length === 0) {
    issues.push("O treino não pode ficar sem exercícios.");
  }

  const duplicateIds = customizedWorkout.exercises
    .map((exercise) => exercise.exerciseId)
    .filter((exerciseId, index, array) => array.indexOf(exerciseId) !== index);

  if (duplicateIds.length > 0) {
    issues.push("A customização gerou exercícios duplicados.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
