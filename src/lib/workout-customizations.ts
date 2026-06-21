import type { WorkoutCustomizationState } from "@/domain/training/customization";

const STORAGE_KEY = "zyrox-workout-customizations-v2";

type WorkoutCustomizationMap = Record<string, WorkoutCustomizationState>;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStore(): WorkoutCustomizationMap {
  if (!canUseStorage()) return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as WorkoutCustomizationMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: WorkoutCustomizationMap) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage failures to avoid breaking workout rendering.
  }
}

export function getWorkoutCustomization(workoutId: string) {
  return readStore()[workoutId] ?? null;
}

export function saveWorkoutCustomization(customization: WorkoutCustomizationState) {
  const store = readStore();
  store[customization.workoutId] = customization;
  writeStore(store);
  import("./firestore-customizations").then(({ saveCustomizationToFirestore }) =>
    import("./firebase").then(({ auth }) => {
      const user = auth.currentUser;
      if (user) saveCustomizationToFirestore(user.uid, customization).catch(() => {});
    }),
  );
}

export function clearWorkoutCustomization(workoutId: string) {
  const store = readStore();
  delete store[workoutId];
  writeStore(store);
  import("./firestore-customizations").then(({ deleteCustomizationFromFirestore }) =>
    import("./firebase").then(({ auth }) => {
      const user = auth.currentUser;
      if (user) deleteCustomizationFromFirestore(user.uid, workoutId).catch(() => {});
    }),
  );
}

export async function restoreCustomizationsFromFirestore(uid: string) {
  try {
    const { loadCustomizationsFromFirestore } = await import("./firestore-customizations");
    const remote = await loadCustomizationsFromFirestore(uid);
    const local = readStore();
    const merged = { ...remote, ...local };
    writeStore(merged);
  } catch {
    // silent — local state takes precedence
  }
}
