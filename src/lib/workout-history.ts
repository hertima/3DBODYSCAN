const KEY = "zyrox.workout-history";

export type SavedWorkoutSet = { reps: number; weight: number; completed: boolean };
export type SavedWorkoutExercise = {
  id: string;
  name: string;
  muscle: string;
  sets: SavedWorkoutSet[];
};
export type SavedWorkout = {
  id: string;
  workoutId: string;
  name: string;
  date: string;
  duration: number;
  calories: number;
  completedSets: number;
  totalSets: number;
  exercises: SavedWorkoutExercise[];
};

export function saveWorkoutToHistory(entry: SavedWorkout): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getWorkoutHistory();
    existing.unshift(entry);
    window.localStorage.setItem(KEY, JSON.stringify(existing.slice(0, 50)));
  } catch {}
  import("./firestore-workouts").then(({ saveWorkoutToFirestore }) =>
    import("./firebase").then(({ auth }) => {
      const user = auth.currentUser;
      if (user) saveWorkoutToFirestore(user.uid, entry).catch(() => {});
    }),
  );
}

export function getWorkoutHistory(): SavedWorkout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedWorkout[]) : [];
  } catch {
    return [];
  }
}

export function getWorkoutHistoryEntry(id: string): SavedWorkout | undefined {
  return getWorkoutHistory().find((e) => e.id === id);
}
