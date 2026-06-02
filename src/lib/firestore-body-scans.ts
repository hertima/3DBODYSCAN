import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type FirestoreBodyScan = {
  id: string;
  date: string;
  analysis?: string;
  photoUrl?: string;
  estimativas: {
    peitoCmEstimado: number;
    cinturaCmEstimada: number;
    quadrilCmEstimado: number;
    bracoCmEstimado: number;
    coxaCmEstimada: number;
    panturrilhaCmEstimada: number;
    percentualGorduraEstimado: number;
  };
  calibragem?: { alturaCm: number; pesoKg: number };
  qualidade?: { confiancaLeitura: number };
};

export async function saveBodyScanToFirestore(uid: string, scan: FirestoreBodyScan) {
  await setDoc(doc(db, "users", uid, "bodyScans", scan.id), {
    ...scan,
    savedAt: serverTimestamp(),
  });
}

export async function deleteBodyScanFromFirestore(uid: string, scanId: string) {
  await deleteDoc(doc(db, "users", uid, "bodyScans", scanId));
}

export async function loadBodyScansFromFirestore(uid: string): Promise<FirestoreBodyScan[]> {
  const snap = await getDocs(collection(db, "users", uid, "bodyScans"));
  return snap.docs
    .map((d) => d.data() as FirestoreBodyScan)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 50);
}
