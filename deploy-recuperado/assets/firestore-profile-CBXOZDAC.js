import { h as setDoc, e as doc, g as getDoc, f as db } from "./firebase-CeVmTMBf.js";
async function saveProfileToFirestore(uid, profile) {
  await setDoc(doc(db, "users", uid, "data", "profile"), profile, { merge: true });
}
async function loadProfileFromFirestore(uid) {
  const snap = await getDoc(doc(db, "users", uid, "data", "profile"));
  return snap.exists() ? snap.data() : null;
}
export {
  loadProfileFromFirestore,
  saveProfileToFirestore
};