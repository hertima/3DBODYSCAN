import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "./firebase";

export type BodyMeasurements = {
  peito?: number;
  cintura?: number;
  quadril?: number;
  braco?: number;
  coxa?: number;
  panturrilha?: number;
  bodyFat?: number;
  muscleMass?: number;
  weight?: number;
  photoUrl?: string;
  lastAnalysis?: string;
  calibHeight?: string;
  calibWeight?: string;
};

export async function saveMeasurementsToFirestore(uid: string, data: BodyMeasurements) {
  await setDoc(
    doc(db, "users", uid, "data", "measurements"),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function loadMeasurementsFromFirestore(uid: string): Promise<BodyMeasurements> {
  const snap = await getDoc(doc(db, "users", uid, "data", "measurements"));
  return snap.exists() ? (snap.data() as BodyMeasurements) : {};
}

export async function uploadBodyPhoto(uid: string, dataUrl: string): Promise<string> {
  const storageRef = ref(storage, `users/${uid}/bodyPhoto.jpg`);
  const base64 = dataUrl.includes(",") ? dataUrl : `data:image/jpeg;base64,${dataUrl}`;
  await uploadString(storageRef, base64, "data_url");
  return getDownloadURL(storageRef);
}

export async function uploadFoodPhoto(uid: string, dataUrl: string): Promise<string> {
  const storageRef = ref(storage, `users/${uid}/foodPhotos/${Date.now()}.jpg`);
  const base64 = dataUrl.includes(",") ? dataUrl : `data:image/jpeg;base64,${dataUrl}`;
  await uploadString(storageRef, base64, "data_url");
  return getDownloadURL(storageRef);
}
