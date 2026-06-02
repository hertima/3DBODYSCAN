import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

const LS_KEY = "zyrox.bodyScans";

function readLocal(): FirestoreBodyScan[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as FirestoreBodyScan[]; }
  catch { return []; }
}

function writeLocal(scans: FirestoreBodyScan[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(scans));
}

export async function saveBodyScanToFirestore(_uid: string, scan: FirestoreBodyScan) {
  const scans = readLocal().filter((s) => s.id !== scan.id);
  writeLocal([scan, ...scans].slice(0, 50));
}

export async function deleteBodyScanFromFirestore(_uid: string, scanId: string) {
  writeLocal(readLocal().filter((s) => s.id !== scanId));
}

export async function loadBodyScansFromFirestore(uid: string): Promise<FirestoreBodyScan[]> {
  const local = readLocal();
  if (local.length > 0) return local;
  // Fallback: tenta Firestore direto (para novos dispositivos)
  try {
    const snap = await getDoc(doc(db, "users", uid, "data", "measurements"));
    if (snap.exists() && Array.isArray(snap.data().bodyScans)) {
      const scans = snap.data().bodyScans as FirestoreBodyScan[];
      writeLocal(scans);
      return scans;
    }
  } catch {}
  return [];
}
