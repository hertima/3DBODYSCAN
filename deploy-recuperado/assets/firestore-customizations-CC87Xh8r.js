import { k as deleteDoc, e as doc, f as db, h as setDoc } from "./firebase-CeVmTMBf.js";
async function saveCustomizationToFirestore(uid, customization) {
  await setDoc(doc(db, "users", uid, "customizations", customization.workoutId), customization);
}
async function deleteCustomizationFromFirestore(uid, workoutId) {
  await deleteDoc(doc(db, "users", uid, "customizations", workoutId));
}
export {
  deleteCustomizationFromFirestore,
  saveCustomizationToFirestore
};