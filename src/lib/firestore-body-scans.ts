import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
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
  await setDoc(doc(db, "users", uid, "data", scan.id), scan);
}

export async function deleteBodyScanFromFirestore(uid: string, scanId: string) {
  await deleteDoc(doc(db, "users", uid, "data", scanId));
}

export async function loadBodyScansFromFirestore(uid: string): Promise<FirestoreBodyScan[]> {
  const snap = await getDocs(collection(db, "users", uid, "data"));
  return snap.docs
    .filter((d) => d.id.startsWith("bs_"))
    .map((d) => d.data() as FirestoreBodyScan)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 50);
}
