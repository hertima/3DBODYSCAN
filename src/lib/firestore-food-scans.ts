import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
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
  await setDoc(doc(db, "users", uid, "foodScans", scan.id), {
    ...scan,
    savedAt: serverTimestamp(),
  });
}

export async function deleteFoodScanFromFirestore(uid: string, scanId: string) {
  await deleteDoc(doc(db, "users", uid, "foodScans", scanId));
}

export async function loadFoodScansFromFirestore(uid: string): Promise<FirestoreFoodScan[]> {
  const q = query(
    collection(db, "users", uid, "foodScans"),
    orderBy("date", "desc"),
    limit(50),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as FirestoreFoodScan);
}
