import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
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

const scansDocRef = (uid: string) => doc(db, "users", uid, "data", "bodyScans");

export async function saveBodyScanToFirestore(uid: string, scan: FirestoreBodyScan) {
  const ref = scansDocRef(uid);
  const snap = await getDoc(ref);
  const entry = { ...scan, savedAt: new Date().toISOString() };
  if (snap.exists()) {
    await updateDoc(ref, { scans: arrayUnion(entry) });
  } else {
    await setDoc(ref, { scans: [entry] });
  }
}

export async function deleteBodyScanFromFirestore(uid: string, scanId: string) {
  const ref = scansDocRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const scans = (snap.data().scans ?? []) as FirestoreBodyScan[];
  const target = scans.find((s) => s.id === scanId);
  if (target) await updateDoc(ref, { scans: arrayRemove(target) });
}

export async function loadBodyScansFromFirestore(uid: string): Promise<FirestoreBodyScan[]> {
  const snap = await getDoc(scansDocRef(uid));
  if (!snap.exists()) return [];
  const scans = (snap.data().scans ?? []) as FirestoreBodyScan[];
  return [...scans].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 50);
}
