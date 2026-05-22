import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { OnboardingState } from "./onboarding";

export async function saveProfileToFirestore(uid: string, profile: OnboardingState) {
  await setDoc(doc(db, "users", uid, "data", "profile"), profile, { merge: true });
}

export async function loadProfileFromFirestore(uid: string): Promise<OnboardingState | null> {
  const snap = await getDoc(doc(db, "users", uid, "data", "profile"));
  return snap.exists() ? (snap.data() as OnboardingState) : null;
}
