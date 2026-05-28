import { useState, useEffect, useRef } from "react";
import { Bell, BellRing, X, Flame, Target, Dumbbell, Clock, AlertTriangle, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { getWorkoutHistory } from "@/lib/workout-history";
import { getStoredLocale } from "@/lib/locale";
import { loadOnboarding } from "@/lib/onboarding";
import type { AppLocale } from "@/lib/locale";
import {
  saveNotificationToFirestore,
  deleteNotificationFromFirestore,
  markAllNotificationsReadInFirestore,
  getNotificationsFromFirestore,
  subscribeToNotifications,
  saveAlarmToFirestore,
  loadAlarmFromFirestore,
  clearAlarmFromFirestore,
  saveMealAlarmsToFirestore,
  loadMealAlarmsFromFirestore,
  type StoredNotification,
  type MealAlarms,
} from "@/lib/firestore-notifications";

function getDefaultMealTimes(mealFrequency: string): string[] {
  switch (mealFrequency) {
    case "2":   return ["08:00", "19:00"];
    case "3":   return ["07:30", "12:30", "19:00"];
    case "4-5": return ["07:00", "10:30", "13:00", "16:30", "19:30"];
    case "6+":  return ["07:00", "09:30", "12:00", "14:30", "17:00", "20:00"];
    default:    return ["07:30", "12:30", "19:00"];
  }
}

type IconName = "Flame" | "Target" | "Dumbbell" | "Clock" | "AlertTriangle" | "Bell";

const ICON_MAP: Record<IconName, LucideIcon> = {
  Flame, Target, Dumbbell, Clock, AlertTriangle, Bell,
};

type BellCopy = {
  panelTitle: string;
  newLabel: (n: number) => string;
  markAllRead: string;
  noNotifications: string;
  alarmSection: string;
  allowNotifications: string;
  save: string;
  alarmActive: string;
  now: string;
  today: string;
  streakTitle: (days: number) => string;
  streakBody: string;
  workoutTitle: string;
  workoutBody: string;
  missionTitle: string;
  missionBody: string;
  missedTitle: (days: number) => string;
  missedBody: string;
  alarmNoteTitle: (time: string) => string;
  alarmNoteBody: string;
  pushMissedTitle: string;
  pushMissedBody: string;
  pushAlarmTitle: string;
  pushAlarmBody: string;
  mealSection: string;
  mealEnabled: string;
  mealDisabled: string;
  mealLabel: (i: number) => string;
  mealPushTitle: string;
  mealPushBody: (i: number) => string;
};

const BELL_COPY: Record<AppLocale, BellCopy> = {
  pt: {
    panelTitle: "Notificações",
    newLabel: (n) => `${n} nova${n > 1 ? "s" : ""}`,
    markAllRead: "Marcar lidas",
    noNotifications: "Nenhuma notificação",
    alarmSection: "Alarme de treino",
    allowNotifications: "Permitir notificações",
    save: "Salvar",
    alarmActive: "Alarme ativo:",
    now: "agora",
    today: "hoje",
    streakTitle: (d) => `🔥 ${d} dias de streak!`,
    streakBody: "Continue assim — não quebre sua sequência.",
    workoutTitle: "Treino de hoje pendente",
    workoutBody: "Você ainda não registrou seu treino de hoje.",
    missionTitle: "Missão diária disponível",
    missionBody: "Complete sua missão de hoje para ganhar XP extra.",
    missedTitle: (d) => `⚠️ ${d} dias sem treinar!`,
    missedBody: "Você faltou dias seguidos. Bora retomar hoje e não perder seu progresso?",
    alarmNoteTitle: (t) => `Alarme definido para ${t}`,
    alarmNoteBody: "Você receberá uma notificação no horário.",
    pushMissedTitle: "3D Body Scanner — Você sumiu! 😤",
    pushMissedBody: "Faz 2+ dias sem treinar. Bora voltar agora?",
    pushAlarmTitle: "3D Body Scanner — Alarme de treino",
    pushAlarmBody: "Hora de treinar! Seu plano te espera.",
    mealSection: "Lembretes de refeição",
    mealEnabled: "Ativo",
    mealDisabled: "Inativo",
    mealLabel: (i) => `Refeição ${i + 1}`,
    mealPushTitle: "3D Body Scanner — Hora de comer! 🍽️",
    mealPushBody: (i) => `Lembrete da refeição ${i + 1}. Alimente-se bem para manter sua energia!`,
  },
  es: {
    panelTitle: "Notificaciones",
    newLabel: (n) => `${n} nueva${n > 1 ? "s" : ""}`,
    markAllRead: "Marcar leídas",
    noNotifications: "Sin notificaciones",
    alarmSection: "Alarma de entrenamiento",
    allowNotifications: "Permitir notificaciones",
    save: "Guardar",
    alarmActive: "Alarma activa:",
    now: "ahora",
    today: "hoy",
    streakTitle: (d) => `🔥 ¡${d} días de racha!`,
    streakBody: "Sigue así — no rompas tu racha.",
    workoutTitle: "Entrenamiento de hoy pendiente",
    workoutBody: "Aún no has registrado tu entrenamiento de hoy.",
    missionTitle: "Misión diaria disponible",
    missionBody: "Completa tu misión de hoy para ganar XP extra.",
    missedTitle: (d) => `⚠️ ¡${d} días sin entrenar!`,
    missedBody: "Llevas días seguidos sin entrenar. ¿Vuelves hoy y no pierdes tu progreso?",
    alarmNoteTitle: (t) => `Alarma definida para ${t}`,
    alarmNoteBody: "Recibirás una notificación a la hora indicada.",
    pushMissedTitle: "3D Body Scanner — ¡Desapareciste! 😤",
    pushMissedBody: "Llevas 2+ días sin entrenar. ¿Vuelves ahora?",
    pushAlarmTitle: "3D Body Scanner — Alarma de entrenamiento",
    pushAlarmBody: "¡Hora de entrenar! Tu plan te espera.",
    mealSection: "Recordatorios de comida",
    mealEnabled: "Activo",
    mealDisabled: "Inactivo",
    mealLabel: (i) => `Comida ${i + 1}`,
    mealPushTitle: "3D Body Scanner — ¡Hora de comer! 🍽️",
    mealPushBody: (i) => `Recordatorio de la comida ${i + 1}. ¡Aliméntate bien!`,
  },
  en: {
    panelTitle: "Notifications",
    newLabel: (n) => `${n} new`,
    markAllRead: "Mark all read",
    noNotifications: "No notifications",
    alarmSection: "Workout alarm",
    allowNotifications: "Allow notifications",
    save: "Save",
    alarmActive: "Active alarm:",
    now: "now",
    today: "today",
    streakTitle: (d) => `🔥 ${d}-day streak!`,
    streakBody: "Keep it up — don't break your streak.",
    workoutTitle: "Today's workout pending",
    workoutBody: "You haven't logged today's workout yet.",
    missionTitle: "Daily mission available",
    missionBody: "Complete today's mission to earn extra XP.",
    missedTitle: (d) => `⚠️ ${d} days without training!`,
    missedBody: "You've missed consecutive days. Come back today and don't lose your progress!",
    alarmNoteTitle: (t) => `Alarm set for ${t}`,
    alarmNoteBody: "You'll receive a notification at the set time.",
    pushMissedTitle: "3D Body Scanner — Where have you been? 😤",
    pushMissedBody: "2+ days without training. Come back now?",
    pushAlarmTitle: "3D Body Scanner — Workout alarm",
    pushAlarmBody: "Time to train! Your plan is waiting.",
    mealSection: "Meal reminders",
    mealEnabled: "Active",
    mealDisabled: "Inactive",
    mealLabel: (i) => `Meal ${i + 1}`,
    mealPushTitle: "3D Body Scanner — Time to eat! 🍽️",
    mealPushBody: (i) => `Meal ${i + 1} reminder. Fuel up to keep your energy going!`,
  },
  fr: {
    panelTitle: "Notifications",
    newLabel: (n) => `${n} nouvelle${n > 1 ? "s" : ""}`,
    markAllRead: "Tout marquer lu",
    noNotifications: "Aucune notification",
    alarmSection: "Alarme d'entraînement",
    allowNotifications: "Autoriser les notifications",
    save: "Enregistrer",
    alarmActive: "Alarme active :",
    now: "maintenant",
    today: "aujourd'hui",
    streakTitle: (d) => `🔥 ${d} jours de série !`,
    streakBody: "Continue comme ça — ne brise pas ta série.",
    workoutTitle: "Entraînement du jour en attente",
    workoutBody: "Tu n'as pas encore enregistré ton entraînement d'aujourd'hui.",
    missionTitle: "Mission quotidienne disponible",
    missionBody: "Complète ta mission du jour pour gagner des XP supplémentaires.",
    missedTitle: (d) => `⚠️ ${d} jours sans entraîner !`,
    missedBody: "Tu as manqué des jours consécutifs. Reprends aujourd'hui et ne perds pas ta progression !",
    alarmNoteTitle: (t) => `Alarme définie pour ${t}`,
    alarmNoteBody: "Tu recevras une notification à l'heure définie.",
    pushMissedTitle: "3D Body Scanner — Tu as disparu ! 😤",
    pushMissedBody: "2+ jours sans entraîner. Tu reviens maintenant ?",
    pushAlarmTitle: "3D Body Scanner — Alarme d'entraînement",
    pushAlarmBody: "L'heure de s'entraîner ! Ton plan t'attend.",
    mealSection: "Rappels de repas",
    mealEnabled: "Actif",
    mealDisabled: "Inactif",
    mealLabel: (i) => `Repas ${i + 1}`,
    mealPushTitle: "3D Body Scanner — L'heure de manger ! 🍽️",
    mealPushBody: (i) => `Rappel du repas ${i + 1}. Mangez bien pour garder votre énergie !`,
  },
  de: {
    panelTitle: "Benachrichtigungen",
    newLabel: (n) => `${n} neue`,
    markAllRead: "Alle als gelesen",
    noNotifications: "Keine Benachrichtigungen",
    alarmSection: "Trainingsalarm",
    allowNotifications: "Benachrichtigungen erlauben",
    save: "Speichern",
    alarmActive: "Aktiver Alarm:",
    now: "jetzt",
    today: "heute",
    streakTitle: (d) => `🔥 ${d} Tage Streak!`,
    streakBody: "Weiter so — brich deine Serie nicht ab.",
    workoutTitle: "Heutiges Training ausstehend",
    workoutBody: "Du hast dein heutiges Training noch nicht aufgezeichnet.",
    missionTitle: "Tägliche Mission verfügbar",
    missionBody: "Schließe deine Tagesaufgabe ab, um Extra-XP zu verdienen.",
    missedTitle: (d) => `⚠️ ${d} Tage ohne Training!`,
    missedBody: "Du hast mehrere Tage in Folge verpasst. Komm heute zurück und verliere nicht deinen Fortschritt!",
    alarmNoteTitle: (t) => `Alarm gesetzt für ${t}`,
    alarmNoteBody: "Du erhältst eine Benachrichtigung zur eingestellten Zeit.",
    pushMissedTitle: "3D Body Scanner — Du bist verschwunden! 😤",
    pushMissedBody: "2+ Tage ohne Training. Kommst du jetzt zurück?",
    pushAlarmTitle: "3D Body Scanner — Trainingsalarm",
    pushAlarmBody: "Zeit zum Trainieren! Dein Plan wartet auf dich.",
    mealSection: "Mahlzeiterinnerungen",
    mealEnabled: "Aktiv",
    mealDisabled: "Inaktiv",
    mealLabel: (i) => `Mahlzeit ${i + 1}`,
    mealPushTitle: "3D Body Scanner — Zeit zu essen! 🍽️",
    mealPushBody: (i) => `Erinnerung für Mahlzeit ${i + 1}. Iss gut, um deine Energie zu erhalten!`,
  },
};

function checkHasWorkoutToday(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return getWorkoutHistory().some((w) => w.date?.slice(0, 10) === today);
}

function getConsecutiveMissedDays(): number {
  const history = getWorkoutHistory();
  const datesWithWorkout = new Set(history.map((w) => w.date.slice(0, 10)));
  const today = new Date();
  let missed = 0;
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (datesWithWorkout.has(key)) break;
    missed++;
  }
  return missed;
}

function triggerMissedDaysAlarm(copy: BellCopy) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([400, 200, 400, 200, 800]);
  }
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification(copy.pushMissedTitle, {
      body: copy.pushMissedBody,
      icon: "/favicon.png",
    });
  }
}

type Props = {
  streakDays?: number;
  hasDailyMission?: boolean;
};

export function NotificationBell({ streakDays = 0, hasDailyMission = false }: Props) {
  const hasWorkoutToday = checkHasWorkoutToday();
  const locale = getStoredLocale();
  const copy = BELL_COPY[locale];
  const uid = auth.currentUser?.uid ?? null;

  const mealFrequency = loadOnboarding().mealFrequency ?? "3";

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [alarm, setAlarm] = useState("");
  const [alarmInput, setAlarmInput] = useState("");
  const [mealAlarms, setMealAlarms] = useState<MealAlarms>({
    times: getDefaultMealTimes(mealFrequency),
    enabled: false,
  });
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");
  const [ringing, setRinging] = useState(false);
  const alarmCheckerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  // Carrega alarme do Firestore
  useEffect(() => {
    if (!uid) return;
    loadAlarmFromFirestore(uid).then((t) => {
      setAlarm(t);
      setAlarmInput(t);
    }).catch(() => {});
  }, [uid]);

  // Carrega alarmes de refeição do Firestore
  useEffect(() => {
    if (!uid) return;
    loadMealAlarmsFromFirestore(uid).then((saved) => {
      if (saved) setMealAlarms(saved);
      else {
        // Primeira vez: salva os defaults baseados no onboarding
        const defaults = { times: getDefaultMealTimes(mealFrequency), enabled: false };
        setMealAlarms(defaults);
        saveMealAlarmsToFirestore(uid, defaults).catch(() => {});
      }
    }).catch(() => {});
  }, [uid]);

  // Subscription em tempo real das notificações no Firestore
  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeToNotifications(uid, (items) => {
      setNotifications(items);
    });
    return unsub;
  }, [uid]);

  // Gera notificações automáticas no Firestore (sem duplicar)
  useEffect(() => {
    if (!uid) return;
    const now = Date.now();

    const check = async () => {
      const existing = await getNotificationsFromFirestore(uid);

      // Apaga notificações de outro locale para regenerar no locale atual
      const wrongLocale = existing.filter((n) => n.locale && n.locale !== locale);
      await Promise.all(wrongLocale.map((n) => deleteNotificationFromFirestore(uid, n.id)));

      const currentLocaleItems = existing.filter((n) => !n.locale || n.locale === locale);
      const ids = new Set(currentLocaleItems.map((n) => n.id));
      const toAdd: StoredNotification[] = [];

      if (streakDays > 0 && !ids.has("streak-active")) {
        toAdd.push({
          id: "streak-active",
          type: "streak",
          title: copy.streakTitle(streakDays),
          body: copy.streakBody,
          time: copy.now,
          read: false,
          iconName: "Flame",
          color: "text-orange-400",
          createdAt: now,
          locale,
        });
      }

      if (!hasWorkoutToday && !ids.has("no-workout-today")) {
        toAdd.push({
          id: "no-workout-today",
          type: "workout",
          title: copy.workoutTitle,
          body: copy.workoutBody,
          time: copy.today,
          read: false,
          iconName: "Dumbbell",
          color: "text-cyan",
          createdAt: now - 1,
          locale,
        });
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(copy.pushAlarmTitle, {
            body: copy.workoutBody,
            icon: "/icon-192.png",
          });
        }
      }

      if (hasDailyMission && !ids.has("daily-mission")) {
        toAdd.push({
          id: "daily-mission",
          type: "mission",
          title: copy.missionTitle,
          body: copy.missionBody,
          time: copy.today,
          read: false,
          iconName: "Target",
          color: "text-primary",
          createdAt: now - 2,
          locale,
        });
      }

      const missedDays = getConsecutiveMissedDays();
      if (missedDays >= 2) {
        const todayKey = new Date().toISOString().slice(0, 10);
        const missedId = `missed-days-${todayKey}`;
        if (!ids.has(missedId)) {
          toAdd.push({
            id: missedId,
            type: "missed",
            title: copy.missedTitle(missedDays),
            body: copy.missedBody,
            time: copy.now,
            read: false,
            iconName: "AlertTriangle",
            color: "text-red-400",
            createdAt: now + 1,
            locale,
          });
          triggerMissedDaysAlarm(copy);
          setRinging(true);
          setTimeout(() => setRinging(false), 8000);
        }
      }

      for (const n of toAdd) {
        await saveNotificationToFirestore(uid, n);
      }
    };

    check().catch(() => {});
  }, [uid, streakDays, hasWorkoutToday, hasDailyMission]);

  // Verifica alarme a cada 30s
  useEffect(() => {
    if (!uid) return;
    alarmCheckerRef.current = setInterval(() => {
      const now = new Date();
      const hh = now.getHours();
      const mm = now.getMinutes();

      // Alarme de treino
      if (alarm) {
        const [ah, am] = alarm.split(":").map(Number);
        if (hh === ah && mm === am) {
          setRinging(true);
          if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 600]);
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification(copy.pushAlarmTitle, { body: copy.pushAlarmBody, icon: "/favicon.png" });
          }
          setTimeout(() => setRinging(false), 8000);
        }
      }

      // Alarmes de refeição
      if (mealAlarms.enabled) {
        mealAlarms.times.forEach((t, i) => {
          if (!t) return;
          const [mh, mmin] = t.split(":").map(Number);
          if (hh === mh && mm === mmin) {
            if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([200, 100, 200]);
            if (typeof Notification !== "undefined" && Notification.permission === "granted") {
              new Notification(copy.mealPushTitle, { body: copy.mealPushBody(i), icon: "/favicon.png" });
            }
          }
        });
      }
    }, 30_000);
    return () => {
      if (alarmCheckerRef.current) clearInterval(alarmCheckerRef.current);
    };
  }, [uid, alarm]);

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Permissão de notificação
  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermissionState(Notification.permission);
    }
  }, []);

  const markAllRead = () => {
    if (!uid) return;
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    markAllNotificationsReadInFirestore(uid, unreadIds).catch(() => {});
  };

  const dismiss = (id: string) => {
    if (!uid) return;
    deleteNotificationFromFirestore(uid, id).catch(() => {});
  };

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermissionState(result);
  };

  const saveAlarmHandler = async () => {
    if (!uid || !alarmInput) return;
    setAlarm(alarmInput);
    await saveAlarmToFirestore(uid, alarmInput).catch(() => {});
    const note: StoredNotification = {
      id: `alarm-${alarmInput}`,
      type: "alarm",
      title: copy.alarmNoteTitle(alarmInput),
      body: copy.alarmNoteBody,
      time: copy.now,
      read: false,
      iconName: "Clock",
      color: "text-cyan",
      createdAt: Date.now(),
      locale,
    };
    // Remove alarme anterior e adiciona novo
    const oldAlarm = notifications.find((n) => n.type === "alarm");
    if (oldAlarm) await deleteNotificationFromFirestore(uid, oldAlarm.id).catch(() => {});
    await saveNotificationToFirestore(uid, note).catch(() => {});
  };

  const removeAlarm = async () => {
    if (!uid) return;
    setAlarm("");
    setAlarmInput("");
    await clearAlarmFromFirestore(uid).catch(() => {});
    const alarmNotes = notifications.filter((n) => n.type === "alarm");
    for (const n of alarmNotes) {
      await deleteNotificationFromFirestore(uid, n.id).catch(() => {});
    }
  };

  const BellIcon = ringing ? BellRing : Bell;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open && unread > 0) markAllRead();
        }}
        aria-label={copy.panelTitle}
        className={cn(
          "relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface transition hover:border-primary/30 hover:bg-elevated",
          ringing && "animate-bounce border-orange-400/60",
        )}
      >
        <BellIcon className={cn("h-3.5 w-3.5", ringing ? "text-orange-400" : "text-muted-foreground")} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 z-50 w-80 max-w-[calc(100vw-1.25rem)] rounded-2xl border border-border shadow-2xl"
            style={{ background: "var(--surface)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">{copy.panelTitle}</span>
                {unread > 0 && (
                  <span className="rounded-full bg-red-500/15 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                    {copy.newLabel(unread)}
                  </span>
                )}
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition"
                >
                  {copy.markAllRead}
                </button>
              )}
            </div>

            {/* Lista */}
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">{copy.noNotifications}</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = ICON_MAP[(n.iconName as IconName)] ?? Bell;
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "group flex items-start gap-3 px-4 py-3 transition hover:bg-elevated",
                        !n.read && "bg-primary/5",
                      )}
                    >
                      <div className={cn("mt-0.5 shrink-0", n.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground leading-tight">{n.title}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">{n.body}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground/60">{n.time}</p>
                      </div>
                      <button
                        onClick={() => dismiss(n.id)}
                        className="shrink-0 rounded p-0.5 text-muted-foreground/40 opacity-0 transition hover:text-foreground group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Alarme */}
            <div className="border-t border-border px-4 py-3">
              <div className="mb-2 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-cyan" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {copy.alarmSection}
                </span>
              </div>

              {permissionState !== "granted" && (
                <button
                  onClick={requestPermission}
                  className="mb-2 w-full rounded-xl border border-border bg-elevated py-2 text-xs font-semibold text-foreground transition hover:border-cyan/40 hover:text-cyan"
                >
                  {copy.allowNotifications}
                </button>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={alarmInput}
                  onChange={(e) => setAlarmInput(e.target.value)}
                  className="flex-1 rounded-xl border border-border bg-elevated px-3 py-2 text-sm text-foreground outline-none transition focus:border-cyan/50"
                />
                <button
                  onClick={saveAlarmHandler}
                  disabled={!alarmInput}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-3 py-2 text-xs font-bold text-white transition disabled:opacity-40 hover:opacity-90"
                >
                  {copy.save}
                </button>
                {alarm && (
                  <button
                    onClick={removeAlarm}
                    className="rounded-xl border border-border bg-elevated p-2 text-muted-foreground transition hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {alarm && (
                <p className="mt-1.5 text-[11px] text-cyan">
                  {copy.alarmActive} {alarm}
                </p>
              )}
            </div>

            {/* Refeições */}
            <div className="border-t border-border px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <UtensilsCrossed className="h-3.5 w-3.5 text-orange-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {copy.mealSection}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const updated = { ...mealAlarms, enabled: !mealAlarms.enabled };
                    setMealAlarms(updated);
                    if (uid) saveMealAlarmsToFirestore(uid, updated).catch(() => {});
                  }}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-bold transition",
                    mealAlarms.enabled
                      ? "bg-orange-400/15 text-orange-400"
                      : "bg-elevated text-muted-foreground hover:text-foreground",
                  )}
                >
                  {mealAlarms.enabled ? copy.mealEnabled : copy.mealDisabled}
                </button>
              </div>
              <div className="space-y-1.5">
                {mealAlarms.times.map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-20 text-[11px] text-muted-foreground">{copy.mealLabel(i)}</span>
                    <input
                      type="time"
                      value={t}
                      onChange={(e) => {
                        const newTimes = [...mealAlarms.times];
                        newTimes[i] = e.target.value;
                        const updated = { ...mealAlarms, times: newTimes };
                        setMealAlarms(updated);
                        if (uid) saveMealAlarmsToFirestore(uid, updated).catch(() => {});
                      }}
                      className="flex-1 rounded-xl border border-border bg-elevated px-2 py-1.5 text-xs text-foreground outline-none transition focus:border-orange-400/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
