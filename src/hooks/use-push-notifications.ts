import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { getWorkoutHistory } from "@/lib/workout-history";
import { getStoredLocale } from "@/lib/locale";
import type { AppLocale } from "@/lib/locale";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

const PUSH_COPY: Record<AppLocale, {
  bannerMessage: string;
  bannerAction: string;
  bannerDismiss: string;
  dailyTitle: string;
  dailyBody: string;
  dailyDoneTitle: string;
  dailyDoneBody: string;
}> = {
  pt: {
    bannerMessage: "Ativar notificações de treino?",
    bannerAction: "Permitir",
    bannerDismiss: "Agora não",
    dailyTitle: "3D Body Scanner — Hora do treino! 💪",
    dailyBody: "Você ainda não treinou hoje. Bora manter a sequência!",
    dailyDoneTitle: "3D Body Scanner — Treino registrado! 🏆",
    dailyDoneBody: "Parabéns! Seu treino de hoje está no banco. Continue assim!",
  },
  es: {
    bannerMessage: "¿Activar notificaciones de entrenamiento?",
    bannerAction: "Permitir",
    bannerDismiss: "Ahora no",
    dailyTitle: "3D Body Scanner — ¡Hora de entrenar! 💪",
    dailyBody: "¡Aún no has entrenado hoy. Mantén la racha!",
    dailyDoneTitle: "3D Body Scanner — ¡Entrenamiento registrado! 🏆",
    dailyDoneBody: "¡Felicidades! Tu entrenamiento de hoy está guardado. ¡Sigue así!",
  },
  en: {
    bannerMessage: "Enable workout notifications?",
    bannerAction: "Allow",
    bannerDismiss: "Not now",
    dailyTitle: "3D Body Scanner — Time to train! 💪",
    dailyBody: "You haven't worked out today yet. Keep your streak going!",
    dailyDoneTitle: "3D Body Scanner — Workout logged! 🏆",
    dailyDoneBody: "Great job! Today's workout is saved. Keep it up!",
  },
  fr: {
    bannerMessage: "Activer les notifications d'entraînement ?",
    bannerAction: "Autoriser",
    bannerDismiss: "Pas maintenant",
    dailyTitle: "3D Body Scanner — C'est l'heure de s'entraîner ! 💪",
    dailyBody: "Tu n'as pas encore fait ta séance aujourd'hui. Garde ta série !",
    dailyDoneTitle: "3D Body Scanner — Séance enregistrée ! 🏆",
    dailyDoneBody: "Bravo ! Ta séance du jour est sauvegardée. Continue comme ça !",
  },
  de: {
    bannerMessage: "Trainingsbenachrichtigungen aktivieren?",
    bannerAction: "Erlauben",
    bannerDismiss: "Nicht jetzt",
    dailyTitle: "3D Body Scanner — Zeit zum Trainieren! 💪",
    dailyBody: "Du hast heute noch nicht trainiert. Halte deine Serie aufrecht!",
    dailyDoneTitle: "3D Body Scanner — Training gespeichert! 🏆",
    dailyDoneBody: "Gut gemacht! Dein heutiges Training ist gespeichert. Weiter so!",
  },
};

// Converte base64url → Uint8Array (necessário para applicationServerKey)
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const arr = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i);
  return arr;
}

async function savePushSubscriptionToFirestore(uid: string, sub: PushSubscription) {
  await setDoc(
    doc(db, "users", uid, "data", "pushSubscription"),
    { subscription: JSON.stringify(sub), updatedAt: Date.now() },
    { merge: true },
  );
}

async function registerPushSubscription(uid: string): Promise<void> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  if (!VAPID_PUBLIC_KEY) return;

  const registration = await navigator.serviceWorker.ready;
  let sub = await registration.pushManager.getSubscription();

  if (!sub) {
    sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  await savePushSubscriptionToFirestore(uid, sub);
}

async function markDailyReminderSent(uid: string, today: string) {
  await setDoc(doc(db, "users", uid, "data", "dailyReminder"), { lastSent: today }, { merge: true });
}

async function getDailyReminderLastSent(uid: string): Promise<string> {
  const snap = await getDoc(doc(db, "users", uid, "data", "dailyReminder"));
  return snap.exists() ? ((snap.data().lastSent as string) ?? "") : "";
}

async function sendDailyWorkoutReminder(uid: string, copy: (typeof PUSH_COPY)[AppLocale]) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

  const today = new Date().toISOString().slice(0, 10);
  const lastSent = await getDailyReminderLastSent(uid);
  if (lastSent === today) return;

  const hasWorkoutToday = getWorkoutHistory().some((w) => w.date?.slice(0, 10) === today);

  if (!hasWorkoutToday) {
    // Dispara via SW para funcionar mesmo em background
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready.catch(() => null);
      if (reg) {
        await reg.showNotification(copy.dailyTitle, {
          body: copy.dailyBody,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          data: { url: "/app/treinos" },
        });
        await markDailyReminderSent(uid, today);
        return;
      }
    }
    new Notification(copy.dailyTitle, { body: copy.dailyBody, icon: "/icon-192.png" });
  }

  await markDailyReminderSent(uid, today);
}

export function usePushNotifications() {
  const askedRef = useRef(false);

  useEffect(() => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted") {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const copy = PUSH_COPY[getStoredLocale()];
      // Garante subscription VAPID registrada
      registerPushSubscription(uid).catch(() => {});
      sendDailyWorkoutReminder(uid, copy).catch(() => {});
      return;
    }

    if (Notification.permission === "denied") return;
    if (askedRef.current) return;

    const timer = setTimeout(() => {
      askedRef.current = true;
      const locale = getStoredLocale();
      const copy = PUSH_COPY[locale];

      toast(copy.bannerMessage, {
        duration: 12_000,
        action: {
          label: copy.bannerAction,
          onClick: async () => {
            const result = await Notification.requestPermission();
            if (result === "granted") {
              const uid = auth.currentUser?.uid;
              if (uid) {
                await registerPushSubscription(uid).catch(() => {});
                await sendDailyWorkoutReminder(uid, copy).catch(() => {});
              }
            }
          },
        },
        cancel: {
          label: copy.bannerDismiss,
          onClick: () => {},
        },
      });
    }, 2_000);

    return () => clearTimeout(timer);
  }, []);
}
