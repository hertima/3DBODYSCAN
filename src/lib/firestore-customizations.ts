import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { WorkoutCustomizationState } from "@/domain/training/customization";

export async function saveCustomizationToFirestore(uid: string, customization: WorkoutCustomizationState) {
  await setDoc(doc(db, "users", uid, "customizations", customization.workoutId), customization);
}

export async function deleteCustomizationFromFirestore(uid: string, workoutId: string) {
  await deleteDoc(doc(db, "users", uid, "customizations", workoutId));
}

export async function loadCustomizationsFromFirestore(uid: string): Promise<Record<string, WorkoutCustomizationState>> {
  const snap = await getDocs(collection(db, "users", uid, "customizations"));
  const result: Record<string, WorkoutCustomizationState> = {};
  snap.docs.forEach((d) => {
    result[d.id] = d.data() as WorkoutCustomizationState;
  });
  return result;
}
