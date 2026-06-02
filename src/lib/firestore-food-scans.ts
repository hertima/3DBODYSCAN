import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type FirestoreFoodScan = {
  id: string;
  date: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  analysis: string;
  photoUrl?: string;
};

export async function saveFoodScanToFirestore(uid: string, scan: FirestoreFoodScan) {
  await setDoc(doc(db, "users", uid, "data", scan.id), scan);
}

export async function deleteFoodScanFromFirestore(uid: string, scanId: string) {
  await deleteDoc(doc(db, "users", uid, "data", scanId));
}

export async function loadFoodScansFromFirestore(uid: string): Promise<FirestoreFoodScan[]> {
  const snap = await getDocs(collection(db, "users", uid, "data"));
  return snap.docs
    .filter((d) => d.id.startsWith("fs_"))
    .map((d) => d.data() as FirestoreFoodScan)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 50);
}
