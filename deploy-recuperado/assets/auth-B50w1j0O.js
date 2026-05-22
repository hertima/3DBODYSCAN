import { s as sendPasswordResetEmail, a as auth, o as onAuthStateChanged, c as createUserWithEmailAndPassword, b as signInWithEmailAndPassword, d as signOut } from "./firebase-CeVmTMBf.js";
function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}
function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}
function logout() {
  return signOut(auth);
}
function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
function getCurrentUser() {
  return auth.currentUser;
}
export {
  signIn as a,
  getCurrentUser as g,
  logout as l,
  onAuth as o,
  resetPassword as r,
  signUp as s
};