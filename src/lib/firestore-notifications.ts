import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

export type StoredNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  iconName: string;
  color: string;
  createdAt: number;
  locale?: string;
};

export async function saveNotificationToFirestore(uid: string, n: StoredNotification) {
  await setDoc(doc(db, "users", uid, "notifications", n.id), n);
}

export async function deleteNotificationFromFirestore(uid: string, id: string) {
  await deleteDoc(doc(db, "users", uid, "notifications", id));
}

export async function markAllNotificationsReadInFirestore(uid: string, ids: string[]) {
  if (!ids.length) return;
  const batch = writeBatch(db);
  for (const id of ids) {
    batch.set(doc(db, "users", uid, "notifications", id), { read: true }, { merge: true });
  }
  await batch.commit();
}

export async function getNotificationsFromFirestore(uid: string): Promise<StoredNotification[]> {
  const snap = await getDocs(collection(db, "users", uid, "notifications"));
  const items = snap.docs.map((d) => d.data() as StoredNotification);
  items.sort((a, b) => b.createdAt - a.createdAt);
  return items;
}

export function subscribeToNotifications(
  uid: string,
  callback: (items: StoredNotification[]) => void,
): () => void {
  return onSnapshot(collection(db, "users", uid, "notifications"), (snap) => {
    const items = snap.docs.map((d) => d.data() as StoredNotification);
    items.sort((a, b) => b.createdAt - a.createdAt);
    callback(items);
  });
}

export async function saveAlarmToFirestore(uid: string, time: string) {
  await setDoc(doc(db, "users", uid, "data", "alarm"), { time });
}

export async function loadAlarmFromFirestore(uid: string): Promise<string> {
  const snap = await getDoc(doc(db, "users", uid, "data", "alarm"));
  return snap.exists() ? ((snap.data().time as string) ?? "") : "";
}

export async function clearAlarmFromFirestore(uid: string) {
  await setDoc(doc(db, "users", uid, "data", "alarm"), { time: "" });
}

// ── Alarmes de refeição ───────────────────────────────────────────────────────

export type MealAlarms = {
  times: string[];   // ["07:00", "10:30", ...]
  enabled: boolean;
};

export async function saveMealAlarmsToFirestore(uid: string, alarms: MealAlarms) {
  await setDoc(doc(db, "users", uid, "data", "mealAlarms"), alarms);
}

export async function loadMealAlarmsFromFirestore(uid: string): Promise<MealAlarms | null> {
  const snap = await getDoc(doc(db, "users", uid, "data", "mealAlarms"));
  return snap.exists() ? (snap.data() as MealAlarms) : null;
}
