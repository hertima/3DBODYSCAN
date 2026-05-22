import { collection, doc, getDocs, limit, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { SavedWorkout } from "./workout-history";

export async function saveWorkoutToFirestore(uid: string, workout: SavedWorkout) {
  await setDoc(doc(db, "users", uid, "workouts", workout.id), workout);
}

export async function loadWorkoutsFromFirestore(uid: string): Promise<SavedWorkout[]> {
  const q = query(
    collection(db, "users", uid, "workouts"),
    orderBy("date", "desc"),
    limit(50),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as SavedWorkout);
}
