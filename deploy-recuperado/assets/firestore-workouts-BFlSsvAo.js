import { h as setDoc, e as doc, f as db } from "./firebase-CeVmTMBf.js";
async function saveWorkoutToFirestore(uid, workout) {
  await setDoc(doc(db, "users", uid, "workouts", workout.id), workout);
}
export {
  saveWorkoutToFirestore
};