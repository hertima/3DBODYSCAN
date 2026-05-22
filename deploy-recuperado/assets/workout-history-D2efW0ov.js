const KEY = "zyrox.workout-history";
function saveWorkoutToHistory(entry) {
  if (typeof window === "undefined") return;
  try {
    const existing = getWorkoutHistory();
    existing.unshift(entry);
    window.localStorage.setItem(KEY, JSON.stringify(existing.slice(0, 50)));
  } catch {
  }
  import("./firestore-workouts-BFlSsvAo.js").then(
    ({ saveWorkoutToFirestore }) => import("./firebase-CeVmTMBf.js").then((n) => n.n).then(({ auth }) => {
      const user = auth.currentUser;
      if (user) saveWorkoutToFirestore(user.uid, entry).catch(() => {
      });
    })
  );
}
function getWorkoutHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function getWorkoutHistoryEntry(id) {
  return getWorkoutHistory().find((e) => e.id === id);
}
export {
  getWorkoutHistoryEntry as a,
  getWorkoutHistory as g,
  saveWorkoutToHistory as s
};