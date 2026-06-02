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

const LS_KEY = "zyrox.foodScans";

function readLocal(): FirestoreFoodScan[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as FirestoreFoodScan[]; }
  catch { return []; }
}

function writeLocal(scans: FirestoreFoodScan[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(scans));
}

export async function saveFoodScanToFirestore(_uid: string, scan: FirestoreFoodScan) {
  const scans = readLocal().filter((s) => s.id !== scan.id);
  writeLocal([scan, ...scans].slice(0, 50));
}

export async function deleteFoodScanFromFirestore(_uid: string, scanId: string) {
  writeLocal(readLocal().filter((s) => s.id !== scanId));
}

export async function loadFoodScansFromFirestore(_uid: string): Promise<FirestoreFoodScan[]> {
  return readLocal();
}
