import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Flame,
  Trophy,
  Activity,
  Play,
  Zap,
  Utensils,
  ShieldCheck,
  X,
  ScanLine,
  Moon,
} from "lucide-react";
import { loadMealPlan } from "@/lib/meal-plan";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SkeletonStatCard, SkeletonWorkoutCard } from "@/components/SkeletonCard";
import { useRealGamification } from "@/hooks/use-real-gamification";
import type { SavedWorkout } from "@/lib/workout-history";
import { loadWorkoutsFromFirestore } from "@/lib/firestore-workouts";
import { loadBodyScansFromFirestore, type FirestoreBodyScan } from "@/lib/firestore-body-scans";
import { loadFoodScansFromFirestore, type FirestoreFoodScan } from "@/lib/firestore-food-scans";
import { useTrainingState } from "@/hooks/use-training-state";
import { resolveTrainingSplit } from "@/domain/training/rules";
import {
  getSplitLabel,
  getReadinessLevelLabel,
  translateWorkoutName,
  getModalityLabel,
  getPhaseLabel,
  getVolumeBiasLabel,
} from "@/lib/training-i18n";
import type { AppLocale } from "@/lib/locale";
import { getExercise } from "@/data/library";
import { getDashboardCopy, getNutritionCopy, getGamificationCopy } from "@/lib/app-copy";
import { getStoredLocale } from "@/lib/locale";
import { loadOnboarding, type OnboardingState } from "@/lib/onboarding";
import { buildAthleteProfile } from "@/domain/athlete/profile";
import { auth } from "@/lib/auth";
import { loadProfileFromFirestore } from "@/lib/firestore-profile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Início | 3D Body Scanner" },
      { name: "description", content: "Resumo de treinos, IA e progresso." },
    ],
  }),
  component: Dashboard,
});

const REST_DAY_COPY: Record<AppLocale, { title: string; desc: string }> = {
  pt: { title: "Dia de descanso", desc: "Sem treino programado hoje — aproveite pra recuperar." },
  es: {
    title: "Día de descanso",
    desc: "Sin entrenamiento programado hoy — aprovecha para recuperarte.",
  },
  en: { title: "Rest day", desc: "No workout scheduled today — take time to recover." },
  fr: {
    title: "Jour de repos",
    desc: "Aucun entraînement prévu aujourd'hui — profitez-en pour récupérer.",
  },
  de: { title: "Ruhetag", desc: "Heute ist kein Training geplant — nutze die Zeit zur Erholung." },
};

const PERIOD_COPY: Record<
  AppLocale,
  {
    blockTitle: (w: number) => string;
    blockSub: string;
    cycleTitle: string;
    cycleSub: string;
    recoveryAdj: string;
    volLabel: string;
  }
> = {
  pt: {
    blockTitle: (w) => `Bloco ${w}/12`,
    blockSub: "Leitura profissional do ciclo atual",
    cycleTitle: "Horizonte do ciclo",
    cycleSub: "Curto, médio e longo prazo ligados ao motor",
    recoveryAdj: "Ajuste de recuperação:",
    volLabel: "volume",
  },
  es: {
    blockTitle: (w) => `Bloque ${w}/12`,
    blockSub: "Lectura profesional del ciclo actual",
    cycleTitle: "Horizonte del ciclo",
    cycleSub: "Corto, medio y largo plazo vinculados al motor",
    recoveryAdj: "Ajuste de recuperación:",
    volLabel: "volumen",
  },
  en: {
    blockTitle: (w) => `Block ${w}/12`,
    blockSub: "Professional read of the current cycle",
    cycleTitle: "Cycle horizon",
    cycleSub: "Short, mid and long term linked to the engine",
    recoveryAdj: "Recovery adjustment:",
    volLabel: "volume",
  },
  fr: {
    blockTitle: (w) => `Bloc ${w}/12`,
    blockSub: "Lecture professionnelle du cycle actuel",
    cycleTitle: "Horizon du cycle",
    cycleSub: "Court, moyen et long terme liés au moteur",
    recoveryAdj: "Ajustement récupération :",
    volLabel: "volume",
  },
  de: {
    blockTitle: (w) => `Block ${w}/12`,
    blockSub: "Professionelle Analyse des aktuellen Zyklus",
    cycleTitle: "Zyklushorizont",
    cycleSub: "Kurz-, mittel- und langfristige Ziele verknüpft mit der Engine",
    recoveryAdj: "Recovery-Anpassung:",
    volLabel: "Volumen",
  },
};

function Dashboard() {
  const [loaded] = useState(true);
  const [userName, setUserName] = useState("atleta");
  const [avatarUrl, setAvatarUrl] = useState("");
  const trainingState = useTrainingState();
  const todayDayIndex = (new Date().getDay() + 6) % 7;
  const todayScheduleEntry = trainingState.schedule.find(
    (entry) => entry.dayIndex === todayDayIndex,
  );
  const today = todayScheduleEntry?.workoutId
    ? (trainingState.workouts.find((w) => w.id === todayScheduleEntry.workoutId) ?? null)
    : null;
  const split = resolveTrainingSplit(trainingState.profile);
  const locale = getStoredLocale();
  const splitLabel = getSplitLabel(split, locale);
  const dashboardCopy = getDashboardCopy(locale);
  const nutritionCopy = getNutritionCopy(locale);
  const gamCopy = getGamificationCopy(locale);
  const dateLocale =
    locale === "pt"
      ? "pt-BR"
      : locale === "es"
        ? "es-ES"
        : locale === "de"
          ? "de-DE"
          : locale === "fr"
            ? "fr-FR"
            : "en-US";
  const [realWorkouts, setRealWorkouts] = useState<SavedWorkout[]>([]);
  const [bodyScans, setBodyScans] = useState<FirestoreBodyScan[]>([]);
  const [foodScans, setFoodScans] = useState<FirestoreFoodScan[]>([]);
  const gamification = useRealGamification(realWorkouts, bodyScans, foodScans, trainingState.profile);

  useEffect(() => {
    const onboarding = loadOnboarding();
    const fbUser = auth.currentUser;
    const localName =
      onboarding.name?.trim() || fbUser?.displayName || fbUser?.email?.split("@")[0] || "";
    const athleteProfile = buildAthleteProfile({ ...onboarding, name: localName });
    const firstName = (n: string) => {
      const part = n.split(" ")[0]?.trim() || "atleta";
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    };
    setUserName(firstName(athleteProfile.name));
    if (onboarding.avatarUrl) setAvatarUrl(onboarding.avatarUrl);
    const uid = fbUser?.uid;
    if (uid) {
      loadProfileFromFirestore(uid)
        .then((prof) => {
          if (prof?.name?.trim()) setUserName(firstName(prof.name));
          if (prof?.avatarUrl) setAvatarUrl(prof.avatarUrl);
        })
        .catch(() => {});
      loadWorkoutsFromFirestore(uid).then(setRealWorkouts).catch(() => {});
      loadBodyScansFromFirestore(uid).then(setBodyScans).catch(() => {});
      loadFoodScansFromFirestore(uid).then(setFoodScans).catch(() => {});
    }
  }, []);
  const dailyMission = gamification.missions.diaria[0];
  const mealPlan = loadMealPlan();
  const planLocaleMismatch =
    mealPlan !== null &&
    (mealPlan.locale === undefined ? locale !== "pt" : mealPlan.locale !== locale);
  const currentPeriodWeek =
    trainingState.periodization.weeks[trainingState.periodization.currentWeek - 1];
  const plannedDays = trainingState.schedule.filter((item) => item.workoutId).length;
  const totalSets = trainingState.workouts.reduce(
    (total, workout) =>
      total +
      workout.exercises.reduce(
        (exerciseTotal, exercise) => exerciseTotal + exercise.sets.length,
        0,
      ),
    0,
  );
  const totalExercises = trainingState.workouts.reduce(
    (total, workout) => total + workout.exercises.length,
    0,
  );
  const averageDuration =
    trainingState.workouts.length > 0
      ? Math.round(
          trainingState.workouts.reduce((total, workout) => total + workout.duration, 0) /
            trainingState.workouts.length,
        )
      : 0;
  const readinessScore = Math.round(
    (gamification.hydrationCompletionRate +
      gamification.nutritionCompletionRate +
      trainingState.body.confidenceScore) /
      3,
  );
  const scanConfidence = Math.max(0, Math.round(trainingState.body.confidenceScore));
  const XP_PER_LEVEL = 300;
  const xpInLevel = gamification.xp % XP_PER_LEVEL;
  const xpPct = Math.round((xpInLevel / XP_PER_LEVEL) * 100);
  const dc = dashboardCopy;
  const pc = PERIOD_COPY[locale] ?? PERIOD_COPY.pt;
  const todayFocusSummary = today?.focus
    .split(/\s*[|·]\s*/)
    .filter(Boolean)
    .slice(0, 2)
    .join(" · ");
  const stats = [
    {
      label: dc.statSeries,
      value: String(totalSets),
      delta: `${totalExercises} ${dc.exercisesLabel}`,
      icon: Activity,
      color: "text-cyan",
    },
    {
      label: dc.statFrequency,
      value: `${plannedDays}/${Math.max(plannedDays, 1)}`,
      delta: `${plannedDays} ${dc.statDays}`,
      icon: Flame,
      color: "text-primary",
    },
    {
      label: dc.statWorkouts,
      value: String(trainingState.workouts.length),
      delta: `${gamification.achievements.filter((item) => item.unlocked).length} ${dc.statAchievements}`,
      icon: Trophy,
      color: "text-success",
    },
    {
      label: dc.statReadiness,
      value: `${readinessScore}%`,
      delta: getReadinessLevelLabel(trainingState.nutrition.readinessLevel, locale),
      icon: Zap,
      color: "text-cyan",
    },
  ] as const;

  if (!loaded) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded-lg bg-elevated" />
          <div className="h-8 w-48 animate-pulse rounded-lg bg-elevated" />
        </div>
        <SkeletonWorkoutCard />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={userName}
            className="h-11 w-11 shrink-0 rounded-[0.9rem] object-cover object-top shadow"
          />
        )}
        <div>
          <p className="text-sm text-muted-foreground">
            {dc.greeting} {userName}
          </p>
          <h1 className="font-display text-3xl font-bold text-gradient-brand">{dc.headline}</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/app/nutricao"
          className="relative overflow-hidden flex flex-col justify-between rounded-2xl border border-success/25 bg-success/5 p-4 transition hover:border-success/40 min-h-[100px]"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl bg-success/10" />
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-success/25 bg-success/15">
            <Utensils className="h-4 w-4 text-success" />
          </div>
          <div className="mt-3">
            <div className="font-semibold text-sm leading-tight">{nutritionCopy.emptyTitle}</div>
            <div className="text-[11px] mt-0.5 text-muted-foreground">
              {mealPlan ? nutritionCopy.twelveWeeks : nutritionCopy.cardDesc}
            </div>
          </div>
        </Link>

        <Link
          to="/app/corpo"
          className="relative overflow-hidden flex flex-col justify-between rounded-2xl border border-primary/25 bg-primary/5 p-4 transition hover:border-primary/45 hover:bg-primary/10 min-h-[100px]"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/15 blur-2xl" />
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-primary/30 bg-primary/15">
            <ScanLine className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3">
            <div className="font-semibold text-sm leading-tight">3D Body Scanner</div>
            {scanConfidence > 0 ? (
              <div className="font-display text-lg font-bold text-primary leading-none mt-0.5">
                {scanConfidence}%
              </div>
            ) : (
              <div className="text-[11px] text-muted-foreground mt-0.5">Composição corporal</div>
            )}
          </div>
        </Link>
      </div>

      {today ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-surface p-5 shadow-elevated"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {dashboardCopy.todayWorkout}
            </span>
            <span
              className="urgency-pulse rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
              style={{
                background: "rgba(251,146,60,0.15)",
                color: "#fb923c",
                border: "1px solid rgba(251,146,60,0.3)",
              }}
            >
              {dashboardCopy.todayBadge}
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold">
            {translateWorkoutName(today.name, locale)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {today.duration} min · {today.exercises.length} {dc.exercisesLabel}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
            <span className="rounded-full bg-cyan/10 px-2 py-1 text-cyan">
              {dc.weekLabel} {trainingState.periodization.currentWeek}/12
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
              {gamCopy.phases[
                (currentPeriodWeek?.phase ?? "base") as keyof typeof gamCopy.phases
              ] ??
                currentPeriodWeek?.phase ??
                "base"}
            </span>
            <span className="rounded-full bg-success/10 px-2 py-1 text-success">
              {gamCopy.modalities[
                trainingState.periodization.modality as keyof typeof gamCopy.modalities
              ] ?? trainingState.periodization.modality}
            </span>
            {todayFocusSummary && (
              <span className="rounded-full border border-border bg-elevated/60 px-2 py-1 text-muted-foreground">
                {todayFocusSummary}
              </span>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-2">
              {today.exercises.slice(0, 4).map((_, index) => (
                <div
                  key={index}
                  className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-elevated text-[10px] font-bold text-cyan"
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <Link
              to="/app/treino/$id"
              params={{ id: today.id }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary"
            >
              <Play className="h-4 w-4" /> {dc.startBtn}
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-3xl border border-border bg-gradient-surface p-5 shadow-elevated"
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border bg-elevated/60">
            <Moon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">
              {(REST_DAY_COPY[locale] ?? REST_DAY_COPY.pt).title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {(REST_DAY_COPY[locale] ?? REST_DAY_COPY.pt).desc}
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-2 rounded-3xl border border-border bg-surface p-3">
        <CompactPulseStat
          icon={Flame}
          label={dc.streakLabel}
          value={`${gamification.streakDays}d`}
          tone="#fb923c"
        />
        <CompactPulseStat
          icon={Zap}
          label={dc.statReadiness}
          value={`${readinessScore}%`}
          tone="#22d3ee"
        />
        <CompactPulseStat icon={Trophy} label="Lv" value={gamification.level} tone="#a855f7" />
        <div className="col-span-3 mt-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{gamification.xp} XP</span>
            <span>
              {XP_PER_LEVEL - xpInLevel} XP para Lv {gamification.level + 1}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${xpPct}%`, background: "linear-gradient(90deg,#22d3ee,#a855f7)" }}
            />
          </div>
        </div>
      </div>

      {gamification.level >= 5 && (
        <PlateauBreakerWidget
          level={gamification.level}
          currentWeek={trainingState.periodization.currentWeek}
          todayWorkoutId={today?.id ?? trainingState.workouts[0]?.id}
          todayExercises={(today?.exercises ?? trainingState.workouts[0]?.exercises ?? [])
            .map((e) => {
              const ex = getExercise(e.exerciseId);
              return { id: e.exerciseId, name: ex?.name ?? e.exerciseId, muscle: ex?.muscle };
            })
            .filter((e) => !!e.name)}
        />
      )}
    </div>
  );
}

function CompactPulseStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Flame;
  label: string;
  value: string | number;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
      <div className="flex items-center justify-between gap-2">
        <Icon className="h-4 w-4" style={{ color: tone }} />
        <span className="truncate text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="mt-2 font-display text-2xl font-bold leading-none" style={{ color: tone }}>
        {value}
      </div>
    </div>
  );
}

// ── Quebrador de Platô IA ──────────────────────────────────────────────────

type PlateauTechnique = {
  name: string;
  tag: string;
  color: string;
  desc: (ex: string) => string;
  descFem: (ex: string) => string;
};

type ModalityCtx = "musculacao" | "funcional" | "hibrido" | "home";

const PLATEAU_UI_COPY: Record<
  AppLocale,
  {
    title: string;
    applyBtn: string;
    viewWorkoutBtn: string;
    footerHint: string;
    femaleBadge: string;
    plateau: {
      female: (w: number) => string;
      funcional: (w: number) => string;
      hibrido: (w: number) => string;
      home: (w: number) => string;
      default: (w: number) => string;
    };
  }
> = {
  pt: {
    title: "Quebrador de Platô IA",
    applyBtn: "Aplicar Hoje",
    viewWorkoutBtn: "Ver Treino",
    footerHint: "Sugestão muda diariamente · baseada em IA e perfil de treino",
    femaleBadge: "Feminino",
    plateau: {
      female: (w) => `Platô de glúteo/perna detectado · semana ${w}`,
      funcional: (w) => `Platô de condicionamento detectado · semana ${w}`,
      hibrido: (w) => `Platô híbrido detectado · semana ${w}`,
      home: (w) => `Platô indoor detectado · semana ${w}`,
      default: (w) => `Platô detectado · semana ${w}`,
    },
  },
  es: {
    title: "Rompeplatô IA",
    applyBtn: "Aplicar Hoy",
    viewWorkoutBtn: "Ver Entrenamiento",
    footerHint: "Sugerencia cambia diariamente · basada en IA y perfil de entrenamiento",
    femaleBadge: "Femenino",
    plateau: {
      female: (w) => `Estancamiento glúteo/piernas detectado · semana ${w}`,
      funcional: (w) => `Estancamiento de acondicionamiento detectado · semana ${w}`,
      hibrido: (w) => `Estancamiento híbrido detectado · semana ${w}`,
      home: (w) => `Estancamiento indoor detectado · semana ${w}`,
      default: (w) => `Estancamiento detectado · semana ${w}`,
    },
  },
  en: {
    title: "AI Plateau Breaker",
    applyBtn: "Apply Today",
    viewWorkoutBtn: "View Workout",
    footerHint: "Tip changes daily · based on AI and training profile",
    femaleBadge: "Female",
    plateau: {
      female: (w) => `Glute/leg plateau detected · week ${w}`,
      funcional: (w) => `Conditioning plateau detected · week ${w}`,
      hibrido: (w) => `Hybrid plateau detected · week ${w}`,
      home: (w) => `Indoor plateau detected · week ${w}`,
      default: (w) => `Plateau detected · week ${w}`,
    },
  },
  fr: {
    title: "Briseur de Plateau IA",
    applyBtn: "Appliquer aujourd'hui",
    viewWorkoutBtn: "Voir la séance",
    footerHint: "Suggestion change quotidiennement · basée sur l'IA et le profil",
    femaleBadge: "Féminin",
    plateau: {
      female: (w) => `Plateau fessier/jambes détecté · semaine ${w}`,
      funcional: (w) => `Plateau de conditionnement détecté · semaine ${w}`,
      hibrido: (w) => `Plateau hybride détecté · semaine ${w}`,
      home: (w) => `Plateau indoor détecté · semaine ${w}`,
      default: (w) => `Plateau détecté · semaine ${w}`,
    },
  },
  de: {
    title: "KI Plateau-Brecher",
    applyBtn: "Heute anwenden",
    viewWorkoutBtn: "Training ansehen",
    footerHint: "Tipp wechselt täglich · basiert auf KI und Trainingsprofil",
    femaleBadge: "Weiblich",
    plateau: {
      female: (w) => `Gesäß/Bein-Plateau erkannt · Woche ${w}`,
      funcional: (w) => `Konditionierungs-Plateau erkannt · Woche ${w}`,
      hibrido: (w) => `Hybrides Plateau erkannt · Woche ${w}`,
      home: (w) => `Indoor-Plateau erkannt · Woche ${w}`,
      default: (w) => `Plateau erkannt · Woche ${w}`,
    },
  },
};

const MODALITY_LABELS_I18N: Record<AppLocale, Record<ModalityCtx, string>> = {
  pt: { musculacao: "Musculação", funcional: "Funcional", hibrido: "Híbrido", home: "Indoor" },
  es: { musculacao: "Musculación", funcional: "Funcional", hibrido: "Híbrido", home: "Indoor" },
  en: { musculacao: "Strength", funcional: "Functional", hibrido: "Hybrid", home: "Indoor" },
  fr: { musculacao: "Musculation", funcional: "Fonctionnel", hibrido: "Hybride", home: "Indoor" },
  de: { musculacao: "Krafttraining", funcional: "Funktionell", hibrido: "Hybrid", home: "Indoor" },
};

function buildPlateauMusculacao(locale: AppLocale): PlateauTechnique[] {
  switch (locale) {
    case "es":
      return [
        {
          name: "Rest-Pause",
          tag: "Intensidad",
          color: "#fb923c",
          desc: (ex) =>
            `En la última serie de ${ex}: ejecuta hasta el fallo → descansa 15s → 4-6 reps más. Reclutamiento máximo de fibras tipo II.`,
          descFem: (ex) =>
            `En la última serie de ${ex}: ejecuta hasta el fallo → descansa 15s → 4-6 reps más. Activa fibras profundas del glúteo y femoral.`,
        },
        {
          name: "Cluster Sets",
          tag: "Volumen",
          color: "#22d3ee",
          desc: (ex) =>
            `Convierte ${ex} en Cluster Sets: bloques de 3+3+3 reps con 30s de pausa intra-serie. Alto volumen con máxima potencia.`,
          descFem: (ex) =>
            `Convierte ${ex} en Cluster Sets: bloques de 4+4+4 reps con 20s de pausa. Más volumen para definición y activación glútea.`,
        },
        {
          name: "Isometría Máxima",
          tag: "Tensión",
          color: "#a855f7",
          desc: (ex) =>
            `En la contracción máxima de ${ex}: mantén isometría 3-4 segundos por rep. Tensión mecánica máxima comprobada.`,
          descFem: (ex) =>
            `En la contracción máxima de ${ex}: aguanta 3-4 segundos arriba. Activación profunda del glúteo con máxima tensión muscular.`,
        },
        {
          name: "Drop Set",
          tag: "Metabólico",
          color: "#10b981",
          desc: (ex) =>
            `Última serie de ${ex}: carga total hasta el fallo → reduce 20% → continúa sin descanso. Agotamiento metabólico máximo.`,
          descFem: (ex) =>
            `Última serie de ${ex}: hasta el fallo → reduce 15-20% → continúa sin descanso. Quema metabólica intensa para definición.`,
        },
        {
          name: "Excéntrico 4-1-1",
          tag: "Daño Muscular",
          color: "#3b82f6",
          desc: (ex) =>
            `Aplica tempo 4-1-1 en ${ex}: 4s bajando → 1s pausa → 1s subiendo. Máximo daño muscular controlado para hipertrofia.`,
          descFem: (ex) =>
            `Tempo 4-1-1 en ${ex}: 4s bajando lentamente → 1s pausa → 1s subiendo. Daño muscular máximo para crecimiento y tonificación.`,
        },
      ];
    case "en":
      return [
        {
          name: "Rest-Pause",
          tag: "Intensity",
          color: "#fb923c",
          desc: (ex) =>
            `Last set of ${ex}: perform to failure → rest 15s → 4-6 more reps. Maximum recruitment of Type II muscle fibers.`,
          descFem: (ex) =>
            `Last set of ${ex}: perform to failure → rest 15s → 4-6 more reps. Activates deep glute and hamstring fibers.`,
        },
        {
          name: "Cluster Sets",
          tag: "Volume",
          color: "#22d3ee",
          desc: (ex) =>
            `Turn ${ex} into Cluster Sets: blocks of 3+3+3 reps with 30s intra-set rest. High volume with maximum power.`,
          descFem: (ex) =>
            `Turn ${ex} into Cluster Sets: blocks of 4+4+4 reps with 20s pause. More volume for definition and glute activation.`,
        },
        {
          name: "Maximum Isometrics",
          tag: "Tension",
          color: "#a855f7",
          desc: (ex) =>
            `At peak contraction of ${ex}: hold isometric for 3-4 seconds per rep. Maximum mechanical tension proven effective.`,
          descFem: (ex) =>
            `At peak contraction of ${ex}: hold 3-4 seconds at the top. Deep glute activation with maximum muscle tension.`,
        },
        {
          name: "Drop Set",
          tag: "Metabolic",
          color: "#10b981",
          desc: (ex) =>
            `Last set of ${ex}: full load to failure → reduce 20% → continue without rest. Maximum metabolic exhaustion.`,
          descFem: (ex) =>
            `Last set of ${ex}: to failure → reduce 15-20% → continue without rest. Intense metabolic burn for definition.`,
        },
        {
          name: "Eccentric 4-1-1",
          tag: "Muscle Damage",
          color: "#3b82f6",
          desc: (ex) =>
            `Apply 4-1-1 tempo to ${ex}: 4s lowering → 1s pause → 1s rising. Maximum controlled muscle damage for hypertrophy.`,
          descFem: (ex) =>
            `4-1-1 tempo on ${ex}: 4s slow lowering → 1s pause → 1s rising. Maximum muscle damage for growth and toning.`,
        },
      ];
    case "fr":
      return [
        {
          name: "Rest-Pause",
          tag: "Intensité",
          color: "#fb923c",
          desc: (ex) =>
            `Dernière série de ${ex} : exécute jusqu'à l'échec → repose 15s → 4-6 reps de plus. Recrutement maximal des fibres de type II.`,
          descFem: (ex) =>
            `Dernière série de ${ex} : exécute jusqu'à l'échec → repose 15s → 4-6 reps de plus. Active les fibres profondes des fessiers et ischio-jambiers.`,
        },
        {
          name: "Cluster Sets",
          tag: "Volume",
          color: "#22d3ee",
          desc: (ex) =>
            `Transforme ${ex} en Cluster Sets : blocs de 3+3+3 reps avec 30s de pause intra-série. Volume élevé avec puissance maximale.`,
          descFem: (ex) =>
            `Transforme ${ex} en Cluster Sets : blocs de 4+4+4 reps avec 20s de pause. Plus de volume pour la définition et l'activation des fessiers.`,
        },
        {
          name: "Isométrie Maximale",
          tag: "Tension",
          color: "#a855f7",
          desc: (ex) =>
            `À la contraction maximale de ${ex} : maintiens l'isométrie 3-4 secondes par rep. Tension mécanique maximale prouvée.`,
          descFem: (ex) =>
            `À la contraction maximale de ${ex} : maintiens 3-4 secondes au sommet. Activation profonde des fessiers avec tension musculaire maximale.`,
        },
        {
          name: "Drop Set",
          tag: "Métabolique",
          color: "#10b981",
          desc: (ex) =>
            `Dernière série de ${ex} : charge totale jusqu'à l'échec → réduis de 20% → continue sans repos. Épuisement métabolique maximum.`,
          descFem: (ex) =>
            `Dernière série de ${ex} : jusqu'à l'échec → réduis de 15-20% → continue sans repos. Brûlure métabolique intense pour la définition.`,
        },
        {
          name: "Excentrique 4-1-1",
          tag: "Dommage Musculaire",
          color: "#3b82f6",
          desc: (ex) =>
            `Applique le tempo 4-1-1 sur ${ex} : 4s en descente → 1s pause → 1s en montée. Dommage musculaire maximal contrôlé pour l'hypertrophie.`,
          descFem: (ex) =>
            `Tempo 4-1-1 sur ${ex} : 4s descente lente → 1s pause → 1s montée. Dommage musculaire maximal pour la croissance et la tonification.`,
        },
      ];
    case "de":
      return [
        {
          name: "Rest-Pause",
          tag: "Intensität",
          color: "#fb923c",
          desc: (ex) =>
            `Letzten Satz von ${ex}: bis zum Versagen → 15s Pause → noch 4-6 Reps. Maximale Rekrutierung von Typ-II-Fasern.`,
          descFem: (ex) =>
            `Letzten Satz von ${ex}: bis zum Versagen → 15s Pause → noch 4-6 Reps. Aktiviert tiefe Gesäß- und Beinbeuger-Fasern.`,
        },
        {
          name: "Cluster Sets",
          tag: "Volumen",
          color: "#22d3ee",
          desc: (ex) =>
            `Wandle ${ex} in Cluster Sets um: Blöcke von 3+3+3 Reps mit 30s intra-Satz-Pause. Hohes Volumen mit maximaler Kraft.`,
          descFem: (ex) =>
            `Wandle ${ex} in Cluster Sets um: Blöcke von 4+4+4 Reps mit 20s Pause. Mehr Volumen für Definition und Gesäßaktivierung.`,
        },
        {
          name: "Maximale Isometrie",
          tag: "Spannung",
          color: "#a855f7",
          desc: (ex) =>
            `Bei maximaler Kontraktion von ${ex}: halte 3-4 Sekunden pro Rep isometrisch. Maximale mechanische Spannung bewährt.`,
          descFem: (ex) =>
            `Bei maximaler Kontraktion von ${ex}: halte 3-4 Sekunden oben. Tiefe Gesäßaktivierung mit maximaler Muskelspannung.`,
        },
        {
          name: "Drop Set",
          tag: "Metabolisch",
          color: "#10b981",
          desc: (ex) =>
            `Letzter Satz von ${ex}: maximale Last bis zum Versagen → 20% reduzieren → weiter ohne Pause. Maximale metabolische Erschöpfung.`,
          descFem: (ex) =>
            `Letzter Satz von ${ex}: bis zum Versagen → 15-20% reduzieren → weiter ohne Pause. Intensive metabolische Verbrennung für Definition.`,
        },
        {
          name: "Exzentrisch 4-1-1",
          tag: "Muskelschaden",
          color: "#3b82f6",
          desc: (ex) =>
            `Wende Tempo 4-1-1 bei ${ex} an: 4s absenken → 1s Pause → 1s anheben. Maximaler kontrollierter Muskelschaden für Hypertrophie.`,
          descFem: (ex) =>
            `Tempo 4-1-1 bei ${ex}: 4s langsam absenken → 1s Pause → 1s anheben. Maximaler Muskelschaden für Wachstum und Straffung.`,
        },
      ];
    default:
      return [
        {
          name: "Rest-Pause",
          tag: "Intensidade",
          color: "#fb923c",
          desc: (ex) =>
            `Na última série de ${ex}: execute até a falha → descanse 15s → mais 4-6 reps. Recrutamento máximo de fibras tipo II.`,
          descFem: (ex) =>
            `Na última série de ${ex}: execute até a falha → descanse 15s → mais 4-6 reps. Ativa fibras profundas do glúteo e posterior de coxa.`,
        },
        {
          name: "Cluster Sets",
          tag: "Volume",
          color: "#22d3ee",
          desc: (ex) =>
            `Transforme ${ex} em Cluster Sets: blocos de 3+3+3 reps com 30s de pausa intra-série. Volume alto com máxima potência.`,
          descFem: (ex) =>
            `Transforme ${ex} em Cluster Sets: blocos de 4+4+4 reps com 20s de pausa. Mais volume para definição e ativação glútea.`,
        },
        {
          name: "Isometria Máxima",
          tag: "Tensão",
          color: "#a855f7",
          desc: (ex) =>
            `Na contração máxima de ${ex}: mantenha isometria por 3-4 segundos em cada rep. Tensão mecânica máxima comprovada.`,
          descFem: (ex) =>
            `Na contração máxima de ${ex}: segure 3-4 segundos no topo. Ativação profunda do glúteo com máxima tensão muscular.`,
        },
        {
          name: "Drop Set",
          tag: "Metabólico",
          color: "#10b981",
          desc: (ex) =>
            `Última série de ${ex}: carga total até a falha → reduza 20% → continue sem descanso. Esgotamento metabólico máximo.`,
          descFem: (ex) =>
            `Última série de ${ex}: até a falha → reduza 15-20% → continue sem descanso. Queima metabólica intensa para definição.`,
        },
        {
          name: "Eccêntrico 4-1-1",
          tag: "Dano Muscular",
          color: "#3b82f6",
          desc: (ex) =>
            `Aplique tempo 4-1-1 em ${ex}: 4s descendo → 1s pausa → 1s subindo. Máximo dano muscular controlado para hipertrofia.`,
          descFem: (ex) =>
            `Tempo 4-1-1 em ${ex}: 4s descendo lentamente → 1s pausa → 1s subindo. Dano muscular máximo para crescimento e tonificação.`,
        },
      ];
  }
}

function buildPlateauFuncional(locale: AppLocale): PlateauTechnique[] {
  switch (locale) {
    case "es":
      return [
        {
          name: "AMRAP Finisher",
          tag: "Resistencia",
          color: "#fb923c",
          desc: (ex) =>
            `AMRAP 6min de ${ex}: haz el máximo de reps posibles. Anota el resultado y trata de superarlo la próxima semana. Sin descanso programado.`,
          descFem: (ex) =>
            `AMRAP 6min de ${ex}: máximo de reps sin parar. Registra para superar la próxima semana. Ideal para resistencia glútea.`,
        },
        {
          name: "EMOM Intenso",
          tag: "Potencia",
          color: "#22d3ee",
          desc: (ex) =>
            `EMOM 10min de ${ex}: minutos impares = 8 reps controladas, minutos pares = 6 reps explosivas. Fuerza + velocidad.`,
          descFem: (ex) =>
            `EMOM 10min de ${ex}: minutos impares = 8 reps, minutos pares = 6 reps explosivas con foco en contracción glútea.`,
        },
        {
          name: "Tabata Modificado",
          tag: "Acondicionamiento",
          color: "#a855f7",
          desc: (ex) =>
            `4 rondas Tabata de ${ex}: 20s máximo esfuerzo → 10s descanso. Total 2min de trabajo puro. Estancamiento roto.`,
          descFem: (ex) =>
            `4 rondas Tabata de ${ex}: 20s máximo esfuerzo → 10s descanso. 2min de quema intensa. Excelente para composición corporal.`,
        },
        {
          name: "Complex Flow",
          tag: "Multi-Articular",
          color: "#10b981",
          desc: (ex) =>
            `Complex: ${ex} (5 reps) → sentadilla salto (5 reps) → burpee (3 reps) sin descanso. Repite 3 rondas. Sin parar.`,
          descFem: (ex) =>
            `Complex: ${ex} (5 reps) → sentadilla (6 reps) → saltos de tijera (10 reps) sin descanso. 3 rondas. Acondicionamiento total.`,
        },
        {
          name: "Max Effort",
          tag: "Superación",
          color: "#3b82f6",
          desc: (ex) =>
            `90 segundos de ${ex} sin parar — máximo de reps perfectas. Registra, descansa 3min y repite. Supera el récord la próxima semana.`,
          descFem: (ex) =>
            `90s de ${ex} sin parar — máximo de reps con ejecución perfecta. Registra y supera la próxima semana. Potencia funcional femenina.`,
        },
      ];
    case "en":
      return [
        {
          name: "AMRAP Finisher",
          tag: "Endurance",
          color: "#fb923c",
          desc: (ex) =>
            `AMRAP 6min of ${ex}: do as many reps as possible. Record the result and try to beat it next week. No programmed rest.`,
          descFem: (ex) =>
            `AMRAP 6min of ${ex}: max reps without stopping. Record to beat next week. Great for glute endurance.`,
        },
        {
          name: "Intense EMOM",
          tag: "Power",
          color: "#22d3ee",
          desc: (ex) =>
            `EMOM 10min of ${ex}: odd minutes = 8 controlled reps, even minutes = 6 explosive reps. Strength + speed.`,
          descFem: (ex) =>
            `EMOM 10min of ${ex}: odd minutes = 8 reps, even minutes = 6 explosive reps with focus on glute contraction.`,
        },
        {
          name: "Modified Tabata",
          tag: "Conditioning",
          color: "#a855f7",
          desc: (ex) =>
            `4 Tabata rounds of ${ex}: 20s max effort → 10s rest. 2min of pure work. Plateau broken.`,
          descFem: (ex) =>
            `4 Tabata rounds of ${ex}: 20s max effort → 10s rest. 2min of intense burn. Excellent for body composition.`,
        },
        {
          name: "Complex Flow",
          tag: "Multi-Joint",
          color: "#10b981",
          desc: (ex) =>
            `Complex: ${ex} (5 reps) → jump squat (5 reps) → burpee (3 reps) without rest. Repeat 3 rounds. Keep moving.`,
          descFem: (ex) =>
            `Complex: ${ex} (5 reps) → squat (6 reps) → jumping jack (10 reps) without rest. 3 rounds. Total conditioning.`,
        },
        {
          name: "Max Effort",
          tag: "Personal Best",
          color: "#3b82f6",
          desc: (ex) =>
            `90 seconds of ${ex} without stopping — maximum perfect reps. Record it, rest 3min, repeat. Beat the record next week.`,
          descFem: (ex) =>
            `90s of ${ex} without stopping — max reps with perfect form. Record and beat it next week. Female functional power.`,
        },
      ];
    case "fr":
      return [
        {
          name: "AMRAP Finisher",
          tag: "Endurance",
          color: "#fb923c",
          desc: (ex) =>
            `AMRAP 6min de ${ex} : fais le maximum de reps possible. Note le résultat et essaie de le battre la semaine prochaine. Pas de repos programmé.`,
          descFem: (ex) =>
            `AMRAP 6min de ${ex} : maximum de reps sans s'arrêter. Enregistre pour dépasser la semaine prochaine. Excellent pour l'endurance des fessiers.`,
        },
        {
          name: "EMOM Intense",
          tag: "Puissance",
          color: "#22d3ee",
          desc: (ex) =>
            `EMOM 10min de ${ex} : minutes impaires = 8 reps contrôlées, minutes paires = 6 reps explosives. Force + vitesse.`,
          descFem: (ex) =>
            `EMOM 10min de ${ex} : minutes impaires = 8 reps, minutes paires = 6 reps explosives axées sur la contraction des fessiers.`,
        },
        {
          name: "Tabata Modifié",
          tag: "Conditionnement",
          color: "#a855f7",
          desc: (ex) =>
            `4 rounds Tabata de ${ex} : 20s effort maximal → 10s repos. Total 2min de travail pur. Plateau brisé.`,
          descFem: (ex) =>
            `4 rounds Tabata de ${ex} : 20s effort maximal → 10s repos. 2min de brûlure intense. Excellent pour la composition corporelle.`,
        },
        {
          name: "Complex Flow",
          tag: "Multi-Articulaire",
          color: "#10b981",
          desc: (ex) =>
            `Complex : ${ex} (5 reps) → squat sauté (5 reps) → burpee (3 reps) sans repos. Répète 3 rounds. Sans s'arrêter.`,
          descFem: (ex) =>
            `Complex : ${ex} (5 reps) → squat (6 reps) → jumping jack (10 reps) sans repos. 3 rounds. Conditionnement total.`,
        },
        {
          name: "Max Effort",
          tag: "Dépassement",
          color: "#3b82f6",
          desc: (ex) =>
            `90 secondes de ${ex} sans s'arrêter — maximum de reps parfaites. Note, repose 3min et répète. Bats le record la semaine prochaine.`,
          descFem: (ex) =>
            `90s de ${ex} sans s'arrêter — maximum de reps avec une exécution parfaite. Note et bats la semaine prochaine. Puissance fonctionnelle féminine.`,
        },
      ];
    case "de":
      return [
        {
          name: "AMRAP Finisher",
          tag: "Ausdauer",
          color: "#fb923c",
          desc: (ex) =>
            `AMRAP 6min von ${ex}: so viele Reps wie möglich. Notiere das Ergebnis und versuche es nächste Woche zu überbieten. Keine geplante Pause.`,
          descFem: (ex) =>
            `AMRAP 6min von ${ex}: maximale Reps ohne Pause. Aufzeichnen um nächste Woche zu übertreffen. Ideal für Gesäßausdauer.`,
        },
        {
          name: "Intensives EMOM",
          tag: "Kraft",
          color: "#22d3ee",
          desc: (ex) =>
            `EMOM 10min von ${ex}: ungerade Minuten = 8 kontrollierte Reps, gerade Minuten = 6 explosive Reps. Kraft + Geschwindigkeit.`,
          descFem: (ex) =>
            `EMOM 10min von ${ex}: ungerade Minuten = 8 Reps, gerade Minuten = 6 explosive Reps mit Fokus auf Gesäßkontraktion.`,
        },
        {
          name: "Modifiziertes Tabata",
          tag: "Konditionierung",
          color: "#a855f7",
          desc: (ex) =>
            `4 Tabata-Runden von ${ex}: 20s maximale Anstrengung → 10s Pause. Insgesamt 2min reine Arbeit. Plateau gebrochen.`,
          descFem: (ex) =>
            `4 Tabata-Runden von ${ex}: 20s maximale Anstrengung → 10s Pause. 2min intensive Verbrennung. Ausgezeichnet für die Körperzusammensetzung.`,
        },
        {
          name: "Complex Flow",
          tag: "Multi-Gelenk",
          color: "#10b981",
          desc: (ex) =>
            `Complex: ${ex} (5 Reps) → Sprungkniebeuge (5 Reps) → Burpee (3 Reps) ohne Pause. 3 Runden wiederholen. Nicht aufhören.`,
          descFem: (ex) =>
            `Complex: ${ex} (5 Reps) → Kniebeuge (6 Reps) → Jumping Jack (10 Reps) ohne Pause. 3 Runden. Gesamtkonditionierung.`,
        },
        {
          name: "Max Effort",
          tag: "Leistung",
          color: "#3b82f6",
          desc: (ex) =>
            `90 Sekunden von ${ex} ohne Pause — maximale perfekte Reps. Notiere, ruhe 3min, wiederhole. Überbiete den Rekord nächste Woche.`,
          descFem: (ex) =>
            `90s von ${ex} ohne Pause — maximale Reps mit perfekter Ausführung. Notieren und nächste Woche überbieten. Weibliche funktionelle Kraft.`,
        },
      ];
    default:
      return [
        {
          name: "AMRAP Finisher",
          tag: "Resistência",
          color: "#fb923c",
          desc: (ex) =>
            `AMRAP 6min de ${ex}: faça o máximo de reps possível. Anote o resultado e tente bater semana que vem. Zero descanso programado.`,
          descFem: (ex) =>
            `AMRAP 6min de ${ex}: máximo de reps sem parar. Registre para superar na próxima semana. Ótimo para resistência glútea.`,
        },
        {
          name: "EMOM Intenso",
          tag: "Potência",
          color: "#22d3ee",
          desc: (ex) =>
            `EMOM 10min de ${ex}: minutos ímpares = 8 reps controladas, minutos pares = 6 reps explosivas. Força + velocidade.`,
          descFem: (ex) =>
            `EMOM 10min de ${ex}: minutos ímpares = 8 reps, minutos pares = 6 reps explosivas com foco na contração glútea.`,
        },
        {
          name: "Tabata Modificado",
          tag: "Condicionamento",
          color: "#a855f7",
          desc: (ex) =>
            `4 rounds Tabata de ${ex}: 20s máximo esforço → 10s descanso. Total 2min de trabalho puro. Platô quebrado.`,
          descFem: (ex) =>
            `4 rounds Tabata de ${ex}: 20s máximo esforço → 10s descanso. 2min de queima intensa. Excelente para composição corporal.`,
        },
        {
          name: "Complex Flow",
          tag: "Multi-Articular",
          color: "#10b981",
          desc: (ex) =>
            `Complex: ${ex} (5 reps) → agachamento saltado (5 reps) → burpee (3 reps) sem descanso. Repita 3 rounds. Sem parar.`,
          descFem: (ex) =>
            `Complex: ${ex} (5 reps) → agachamento (6 reps) → polichinelo (10 reps) sem descanso. 3 rounds. Condicionamento total.`,
        },
        {
          name: "Max Effort",
          tag: "Superação",
          color: "#3b82f6",
          desc: (ex) =>
            `90 segundos de ${ex} sem parar — máximo de reps perfeitas. Registre, descanse 3min e repita. Supere o recorde semana que vem.`,
          descFem: (ex) =>
            `90s de ${ex} sem parar — máximo de reps com execução perfeita. Registre e supere semana que vem. Potência funcional feminina.`,
        },
      ];
  }
}

function buildPlateauHibrido(locale: AppLocale): PlateauTechnique[] {
  switch (locale) {
    case "es":
      return [
        {
          name: "Superset Fuerza-Funcional",
          tag: "Híbrido",
          color: "#fb923c",
          desc: (ex) =>
            `Superset sin descanso: ${ex} pesado (5-6 reps) → sentadilla salto o burpee (8 reps). Fuerza + potencia en el mismo bloque.`,
          descFem: (ex) =>
            `Superset: ${ex} (6 reps) → sentadilla salto (8 reps) sin descanso. Fuerza + explosividad — ideal para definición y glúteo.`,
        },
        {
          name: "Potencia Final",
          tag: "Velocidad",
          color: "#22d3ee",
          desc: (ex) =>
            `Tras las series normales de ${ex}, añade 1 set de potencia: 60% de la carga, máxima velocidad concéntrica × 8 reps. Reclutamiento neural máximo.`,
          descFem: (ex) =>
            `Tras ${ex} normal, 1 set de potencia: 60% de carga con máxima velocidad. Activa fibras rápidas — ruptura de estancamiento garantizada.`,
        },
        {
          name: "Circuit Finisher",
          tag: "Acondicionamiento",
          color: "#a855f7",
          desc: (ex) =>
            `Finalizador: ${ex} (30s) → flexión (30s) → plancha (30s). 3 rondas sin descanso. Fuerza muscular + acondicionamiento cardio.`,
          descFem: (ex) =>
            `Finalizador: ${ex} (30s) → sentadilla (30s) → plancha (30s). 3 rondas sin descanso. Definición total del cuerpo.`,
        },
        {
          name: "Progresión Híbrida",
          tag: "Sobrecarga",
          color: "#10b981",
          desc: (ex) =>
            `Semana 1: ${ex} con carga alta (6 reps). Semana 2: versión corporal (12 reps + salto). Alterna para confundir el músculo.`,
          descFem: (ex) =>
            `Alterna ${ex} con carga (6 reps) en el gym y versión bodyweight + sentadilla en casa. Estímulo nuevo cada semana.`,
        },
        {
          name: "Density Block",
          tag: "Volumen Total",
          color: "#3b82f6",
          desc: (ex) =>
            `10min de ${ex}: máximo de series de 5 reps descansando cuando sea necesario. Registra el total. Supéralo la próxima semana.`,
          descFem: (ex) =>
            `10min de ${ex}: máximo de series de 6 reps con descanso corto. Registra el volumen total y supéralo la próxima semana.`,
        },
      ];
    case "en":
      return [
        {
          name: "Strength-Functional Superset",
          tag: "Hybrid",
          color: "#fb923c",
          desc: (ex) =>
            `Superset without rest: heavy ${ex} (5-6 reps) → jump squat or burpee (8 reps). Strength + power in the same block.`,
          descFem: (ex) =>
            `Superset: ${ex} (6 reps) → jump squat (8 reps) without rest. Strength + explosion — ideal for definition and glutes.`,
        },
        {
          name: "Power Finisher",
          tag: "Speed",
          color: "#22d3ee",
          desc: (ex) =>
            `After normal sets of ${ex}, add 1 power set: 60% of load, maximum concentric speed × 8 reps. Maximum neural recruitment.`,
          descFem: (ex) =>
            `After normal ${ex}, 1 power set: 60% load at maximum speed. Activates fast fibers — guaranteed plateau break.`,
        },
        {
          name: "Circuit Finisher",
          tag: "Conditioning",
          color: "#a855f7",
          desc: (ex) =>
            `Finisher: ${ex} (30s) → push-up (30s) → plank (30s). 3 rounds without rest. Muscle strength + cardio conditioning.`,
          descFem: (ex) =>
            `Finisher: ${ex} (30s) → squat (30s) → plank (30s). 3 rounds without rest. Total body definition.`,
        },
        {
          name: "Hybrid Progression",
          tag: "Overload",
          color: "#10b981",
          desc: (ex) =>
            `Week 1: ${ex} with heavy load (6 reps). Week 2: bodyweight version (12 reps + jump). Alternates to confuse the muscle.`,
          descFem: (ex) =>
            `Alternate ${ex} with weight (6 reps) at the gym and bodyweight + squat at home. New stimulus every week.`,
        },
        {
          name: "Density Block",
          tag: "Total Volume",
          color: "#3b82f6",
          desc: (ex) =>
            `10min of ${ex}: maximum sets of 5 reps, resting as needed. Count the total. Beat it next week.`,
          descFem: (ex) =>
            `10min of ${ex}: maximum sets of 6 reps with short rest. Record total volume and beat it next week.`,
        },
      ];
    case "fr":
      return [
        {
          name: "Superset Force-Fonctionnel",
          tag: "Hybride",
          color: "#fb923c",
          desc: (ex) =>
            `Superset sans repos : ${ex} lourd (5-6 reps) → squat sauté ou burpee (8 reps). Force + puissance dans le même bloc.`,
          descFem: (ex) =>
            `Superset : ${ex} (6 reps) → squat sauté (8 reps) sans repos. Force + explosion — idéal pour la définition et les fessiers.`,
        },
        {
          name: "Puissance Finale",
          tag: "Vitesse",
          color: "#22d3ee",
          desc: (ex) =>
            `Après les séries normales de ${ex}, ajoute 1 set de puissance : 60% de la charge, vitesse concentrique maximale × 8 reps. Recrutement neural maximum.`,
          descFem: (ex) =>
            `Après ${ex} normal, 1 set de puissance : 60% de la charge à vitesse maximale. Active les fibres rapides — bris de plateau garanti.`,
        },
        {
          name: "Circuit Finisher",
          tag: "Conditionnement",
          color: "#a855f7",
          desc: (ex) =>
            `Finisher : ${ex} (30s) → pompe (30s) → planche (30s). 3 rounds sans repos. Force musculaire + conditionnement cardio.`,
          descFem: (ex) =>
            `Finisher : ${ex} (30s) → squat (30s) → planche (30s). 3 rounds sans repos. Définition totale du corps.`,
        },
        {
          name: "Progression Hybride",
          tag: "Surcharge",
          color: "#10b981",
          desc: (ex) =>
            `Semaine 1 : ${ex} avec charge élevée (6 reps). Semaine 2 : version corporelle (12 reps + saut). Alterne pour surprendre le muscle.`,
          descFem: (ex) =>
            `Alterne ${ex} avec charge (6 reps) à la salle et version au poids du corps + squat à domicile. Nouveau stimulus chaque semaine.`,
        },
        {
          name: "Density Block",
          tag: "Volume Total",
          color: "#3b82f6",
          desc: (ex) =>
            `10min de ${ex} : maximum de séries de 5 reps en se reposant au besoin. Note le total. Bats-le la semaine prochaine.`,
          descFem: (ex) =>
            `10min de ${ex} : maximum de séries de 6 reps avec repos court. Note le volume total et bats-le la semaine prochaine.`,
        },
      ];
    case "de":
      return [
        {
          name: "Kraft-Funktionell Superset",
          tag: "Hybrid",
          color: "#fb923c",
          desc: (ex) =>
            `Superset ohne Pause: schweres ${ex} (5-6 Reps) → Sprungkniebeuge oder Burpee (8 Reps). Kraft + Power im selben Block.`,
          descFem: (ex) =>
            `Superset: ${ex} (6 Reps) → Sprungkniebeuge (8 Reps) ohne Pause. Kraft + Explosion — ideal für Definition und Gesäß.`,
        },
        {
          name: "Kraftfinale",
          tag: "Geschwindigkeit",
          color: "#22d3ee",
          desc: (ex) =>
            `Nach normalen Sätzen von ${ex} 1 Power-Satz hinzufügen: 60% der Last, maximale konzentrische Geschwindigkeit × 8 Reps. Maximale neuronale Rekrutierung.`,
          descFem: (ex) =>
            `Nach normalem ${ex} 1 Power-Satz: 60% Last mit maximaler Geschwindigkeit. Aktiviert schnelle Fasern — garantierter Plateau-Durchbruch.`,
        },
        {
          name: "Circuit Finisher",
          tag: "Konditionierung",
          color: "#a855f7",
          desc: (ex) =>
            `Finisher: ${ex} (30s) → Liegestütz (30s) → Plank (30s). 3 Runden ohne Pause. Muskelkraft + Kardio-Konditionierung.`,
          descFem: (ex) =>
            `Finisher: ${ex} (30s) → Kniebeuge (30s) → Plank (30s). 3 Runden ohne Pause. Gesamte Körperdefinition.`,
        },
        {
          name: "Hybride Progression",
          tag: "Überladung",
          color: "#10b981",
          desc: (ex) =>
            `Woche 1: ${ex} mit hoher Last (6 Reps). Woche 2: Körpergewichts-Version (12 Reps + Sprung). Wechselt, um den Muskel zu verwirren.`,
          descFem: (ex) =>
            `Wechsle ${ex} mit Gewicht (6 Reps) im Studio und Körpergewichts-Version + Kniebeuge zu Hause. Neuer Reiz jede Woche.`,
        },
        {
          name: "Density Block",
          tag: "Gesamtvolumen",
          color: "#3b82f6",
          desc: (ex) =>
            `10min von ${ex}: maximale Sätze von 5 Reps, bei Bedarf pausieren. Gesamtzahl notieren. Nächste Woche übertreffen.`,
          descFem: (ex) =>
            `10min von ${ex}: maximale Sätze von 6 Reps mit kurzer Pause. Gesamtvolumen notieren und nächste Woche überbieten.`,
        },
      ];
    default:
      return [
        {
          name: "Superset Força-Funcional",
          tag: "Híbrido",
          color: "#fb923c",
          desc: (ex) =>
            `Superset sem descanso: ${ex} pesado (5-6 reps) → agachamento jump ou burpee (8 reps). Força + potência no mesmo bloco.`,
          descFem: (ex) =>
            `Superset: ${ex} (6 reps) → agachamento jump (8 reps) sem descanso. Força + explosão — ideal para definição e glúteo.`,
        },
        {
          name: "Potência Final",
          tag: "Velocidade",
          color: "#22d3ee",
          desc: (ex) =>
            `Após séries normais de ${ex}, adicione 1 set de potência: 60% da carga, máxima velocidade concêntrica × 8 reps. Recrutamento neural máximo.`,
          descFem: (ex) =>
            `Após ${ex} normal, 1 set de potência: 60% da carga com máxima velocidade. Ativa fibras rápidas — quebra de platô garantida.`,
        },
        {
          name: "Circuit Finisher",
          tag: "Condicionamento",
          color: "#a855f7",
          desc: (ex) =>
            `Finalizador: ${ex} (30s) → flexão (30s) → prancha (30s). 3 rounds sem descanso. Força muscular + condicionamento cardio.`,
          descFem: (ex) =>
            `Finalizador: ${ex} (30s) → agachamento (30s) → prancha (30s). 3 rounds sem descanso. Definição total do corpo.`,
        },
        {
          name: "Progressão Híbrida",
          tag: "Sobrecarga",
          color: "#10b981",
          desc: (ex) =>
            `Semana 1: ${ex} com carga alta (6 reps). Semana 2: versão corporal (12 reps + salto). Alterna para confundir o músculo.`,
          descFem: (ex) =>
            `Alterne ${ex} com carga (6 reps) no treino de academia e versão bodyweight + agachamento em casa. Estímulo novo toda semana.`,
        },
        {
          name: "Density Block",
          tag: "Volume Total",
          color: "#3b82f6",
          desc: (ex) =>
            `10min de ${ex}: faça o máximo de séries de 5 reps descansando quando precisar. Anote o total. Supere semana que vem.`,
          descFem: (ex) =>
            `10min de ${ex}: máximo de séries de 6 reps com descanso curto. Registre o volume total e supere semana que vem.`,
        },
      ];
  }
}

function buildPlateauHome(locale: AppLocale): PlateauTechnique[] {
  switch (locale) {
    case "es":
      return [
        {
          name: "1.5 Rep",
          tag: "Tensión Máxima",
          color: "#fb923c",
          desc: (ex) =>
            `En ${ex}: baja completo → sube hasta la mitad → baja de nuevo → sube. Cada ciclo = 1 rep. Tensión muscular doblada sin peso extra.`,
          descFem: (ex) =>
            `En ${ex}: baja completo → sube hasta la mitad → baja → sube totalmente. Cada ciclo = 1 rep. Activación glútea máxima sin equipamiento.`,
        },
        {
          name: "Pausa en el Fallo",
          tag: "Resistencia",
          color: "#22d3ee",
          desc: (ex) =>
            `En ${ex}: ejecuta hasta no poder más → descansa 10s en posición segura → 3-5 reps más. Repite 2x. Hipertrofia sin carga.`,
          descFem: (ex) =>
            `En ${ex}: ejecuta hasta el fallo → 10s de descanso → 3-5 reps más. Repite 2x. Hipertrofia y definición sin gimnasio.`,
        },
        {
          name: "Progresión de Palanca",
          tag: "Progresión",
          color: "#a855f7",
          desc: (ex) =>
            `Aumenta la dificultad de ${ex} cambiando la palanca: unilateral (1 pierna/brazo), eleva los pies, o añade pausa de 3s en el punto más difícil.`,
          descFem: (ex) =>
            `Versión avanzada de ${ex}: unilateral o con elevación + pausa de 3s en la parte más difícil. Progresión bodyweight para glúteo y piernas.`,
        },
        {
          name: "Tabata Corporal",
          tag: "Acondicionamiento",
          color: "#10b981",
          desc: (ex) =>
            `Tabata de ${ex}: 8 rondas × (20s máximo esfuerzo + 10s descanso). Total 4min de intensidad pura. Sin equipamiento, máximo resultado.`,
          descFem: (ex) =>
            `Tabata de ${ex}: 8 rondas × 20s esfuerzo + 10s descanso. 4min de quema total. Perfecto para definición y resistencia en casa.`,
        },
        {
          name: "Density Block",
          tag: "Volumen Total",
          color: "#3b82f6",
          desc: (ex) =>
            `10min de ${ex}: máximo de series de 5 reps descansando según sea necesario. Registra el total de reps y supéralo la próxima semana.`,
          descFem: (ex) =>
            `10min de ${ex}: máximo de series de 6-8 reps. Registra el volumen y supéralo la próxima semana. Progreso sin gimnasio.`,
        },
      ];
    case "en":
      return [
        {
          name: "1.5 Rep",
          tag: "Peak Tension",
          color: "#fb923c",
          desc: (ex) =>
            `In ${ex}: lower fully → rise halfway → lower again → rise fully. Each cycle = 1 rep. Double muscle tension without extra weight.`,
          descFem: (ex) =>
            `In ${ex}: lower fully → rise halfway → lower → rise fully. Each cycle = 1 rep. Maximum glute activation without equipment.`,
        },
        {
          name: "Rest-Pause Failure",
          tag: "Endurance",
          color: "#22d3ee",
          desc: (ex) =>
            `In ${ex}: perform until failure → rest 10s in safe position → 3-5 more reps. Repeat 2x. Hypertrophy without load.`,
          descFem: (ex) =>
            `In ${ex}: perform to failure → 10s rest → 3-5 more reps. Repeat 2x. Hypertrophy and definition without a gym.`,
        },
        {
          name: "Lever Progression",
          tag: "Progression",
          color: "#a855f7",
          desc: (ex) =>
            `Increase the difficulty of ${ex} by changing the lever: unilateral (1 leg/arm), elevate feet, or add a 3s pause at the hardest point.`,
          descFem: (ex) =>
            `Advanced version of ${ex}: unilateral or elevated + 3s pause at the hardest point. Bodyweight progression for glutes and legs.`,
        },
        {
          name: "Body Tabata",
          tag: "Conditioning",
          color: "#10b981",
          desc: (ex) =>
            `${ex} Tabata: 8 rounds × (20s max effort + 10s rest). Total 4min of pure intensity. Zero equipment, maximum results.`,
          descFem: (ex) =>
            `${ex} Tabata: 8 rounds × 20s effort + 10s rest. 4min of total burn. Perfect for definition and endurance at home.`,
        },
        {
          name: "Density Block",
          tag: "Total Volume",
          color: "#3b82f6",
          desc: (ex) =>
            `10min of ${ex}: maximum sets of 5 reps, resting as needed. Record the total reps and beat it next week.`,
          descFem: (ex) =>
            `10min of ${ex}: maximum sets of 6-8 reps. Record the volume and beat it next week. Progress without a gym.`,
        },
      ];
    case "fr":
      return [
        {
          name: "1.5 Rep",
          tag: "Tension Maximale",
          color: "#fb923c",
          desc: (ex) =>
            `Dans ${ex} : descends complètement → monte à mi-chemin → redescends → monte. Chaque cycle = 1 rep. Tension musculaire doublée sans poids supplémentaire.`,
          descFem: (ex) =>
            `Dans ${ex} : descends complètement → monte à mi-chemin → redescends → monte totalement. Chaque cycle = 1 rep. Activation maximale des fessiers sans équipement.`,
        },
        {
          name: "Pause à l'Échec",
          tag: "Endurance",
          color: "#22d3ee",
          desc: (ex) =>
            `Dans ${ex} : exécute jusqu'à l'échec → repose 10s en position sûre → 3-5 reps de plus. Répète 2x. Hypertrophie sans charge.`,
          descFem: (ex) =>
            `Dans ${ex} : exécute jusqu'à l'échec → 10s de repos → 3-5 reps de plus. Répète 2x. Hypertrophie et définition sans salle.`,
        },
        {
          name: "Progression de Levier",
          tag: "Progression",
          color: "#a855f7",
          desc: (ex) =>
            `Augmente la difficulté de ${ex} en changeant le levier : unilatéral (1 jambe/bras), élève les pieds, ou ajoute une pause de 3s au point le plus difficile.`,
          descFem: (ex) =>
            `Version avancée de ${ex} : unilatéral ou surélevé + pause de 3s à la partie la plus difficile. Progression au poids du corps pour fessiers et jambes.`,
        },
        {
          name: "Tabata Corporel",
          tag: "Conditionnement",
          color: "#10b981",
          desc: (ex) =>
            `Tabata de ${ex} : 8 rounds × (20s effort max + 10s repos). Total 4min d'intensité pure. Zéro équipement, résultats maximum.`,
          descFem: (ex) =>
            `Tabata de ${ex} : 8 rounds × 20s effort + 10s repos. 4min de combustion totale. Parfait pour la définition et l'endurance à domicile.`,
        },
        {
          name: "Density Block",
          tag: "Volume Total",
          color: "#3b82f6",
          desc: (ex) =>
            `10min de ${ex} : maximum de séries de 5 reps en vous reposant si nécessaire. Note le total de reps et bats-le la semaine prochaine.`,
          descFem: (ex) =>
            `10min de ${ex} : maximum de séries de 6-8 reps. Note le volume et bats-le la semaine prochaine. Progrès sans salle de sport.`,
        },
      ];
    case "de":
      return [
        {
          name: "1.5 Rep",
          tag: "Maximale Spannung",
          color: "#fb923c",
          desc: (ex) =>
            `Bei ${ex}: ganz absenken → halb anheben → wieder absenken → ganz hoch. Jeder Zyklus = 1 Rep. Doppelte Muskelspannung ohne Mehrgewicht.`,
          descFem: (ex) =>
            `Bei ${ex}: ganz absenken → halb hoch → absenken → ganz hoch. Jeder Zyklus = 1 Rep. Maximale Gesäßaktivierung ohne Ausrüstung.`,
        },
        {
          name: "Pause beim Versagen",
          tag: "Ausdauer",
          color: "#22d3ee",
          desc: (ex) =>
            `Bei ${ex}: ausführen bis zur Erschöpfung → 10s in sicherer Position ruhen → noch 3-5 Reps. 2x wiederholen. Hypertrophie ohne Last.`,
          descFem: (ex) =>
            `Bei ${ex}: bis zum Versagen ausführen → 10s Pause → noch 3-5 Reps. 2x wiederholen. Hypertrophie und Definition ohne Fitnessstudio.`,
        },
        {
          name: "Hebelprogression",
          tag: "Progression",
          color: "#a855f7",
          desc: (ex) =>
            `Erhöhe die Schwierigkeit von ${ex} durch Hebelveränderung: einseitig (1 Bein/Arm), Füße erhöhen oder 3s Pause am schwersten Punkt.`,
          descFem: (ex) =>
            `Fortgeschrittene Version von ${ex}: einseitig oder erhöht + 3s Pause an der schwersten Stelle. Körpergewichtsprogression für Gesäß und Beine.`,
        },
        {
          name: "Körper-Tabata",
          tag: "Konditionierung",
          color: "#10b981",
          desc: (ex) =>
            `${ex} Tabata: 8 Runden × (20s maximale Anstrengung + 10s Pause). Insgesamt 4min reine Intensität. Null Ausrüstung, maximale Ergebnisse.`,
          descFem: (ex) =>
            `${ex} Tabata: 8 Runden × 20s Anstrengung + 10s Pause. 4min Gesamtverbrennung. Perfekt für Definition und Ausdauer zu Hause.`,
        },
        {
          name: "Density Block",
          tag: "Gesamtvolumen",
          color: "#3b82f6",
          desc: (ex) =>
            `10min von ${ex}: maximale Sätze von 5 Reps, bei Bedarf pausieren. Gesamtzahl der Reps notieren und nächste Woche überbieten.`,
          descFem: (ex) =>
            `10min von ${ex}: maximale Sätze von 6-8 Reps. Volumen notieren und nächste Woche überbieten. Fortschritt ohne Fitnessstudio.`,
        },
      ];
    default:
      return [
        {
          name: "1.5 Rep",
          tag: "Tensão Máxima",
          color: "#fb923c",
          desc: (ex) =>
            `Em ${ex}: desce completo → sobe até o meio → desce novamente → sobe. Cada ciclo = 1 rep. Tensão muscular dobrada sem peso extra.`,
          descFem: (ex) =>
            `Em ${ex}: desce completo → sobe até o meio → desce → sobe totalmente. Cada ciclo = 1 rep. Ativação glútea máxima sem equipamento.`,
        },
        {
          name: "Pausa na Falha",
          tag: "Resistência",
          color: "#22d3ee",
          desc: (ex) =>
            `Em ${ex}: execute até não conseguir mais → descanse 10s em posição segura → mais 3-5 reps. Repita 2x. Hipertrofia sem carga.`,
          descFem: (ex) =>
            `Em ${ex}: execute até a falha → 10s de descanso → mais 3-5 reps. Repita 2x. Hipertrofia e definição sem academia.`,
        },
        {
          name: "Progressão de Alavanca",
          tag: "Progressão",
          color: "#a855f7",
          desc: (ex) =>
            `Aumente a dificuldade de ${ex} mudando a alavanca: unilateral (1 perna/braço), eleve os pés, ou adicione pausa de 3s no ponto mais difícil.`,
          descFem: (ex) =>
            `Versão avançada de ${ex}: unilateral ou com elevação + pausa de 3s na parte mais difícil. Progressão bodyweight para glúteo e pernas.`,
        },
        {
          name: "Tabata Corporal",
          tag: "Condicionamento",
          color: "#10b981",
          desc: (ex) =>
            `Tabata de ${ex}: 8 rounds × (20s máximo esforço + 10s descanso). Total 4min de intensidade pura. Zero equipamento, máximo resultado.`,
          descFem: (ex) =>
            `Tabata de ${ex}: 8 rounds × 20s esforço + 10s descanso. 4min de queima total. Perfeito para definição e resistência em casa.`,
        },
        {
          name: "Density Block",
          tag: "Volume Total",
          color: "#3b82f6",
          desc: (ex) =>
            `10min de ${ex}: máximo de séries de 5 reps descansando conforme necessário. Registre o total de reps e supere semana que vem.`,
          descFem: (ex) =>
            `10min de ${ex}: máximo de séries de 6-8 reps. Registre o volume e supere na próxima semana. Progresso sem academia.`,
        },
      ];
  }
}

function resolveModalityCtx(profile: ReturnType<typeof loadOnboarding>): ModalityCtx {
  if (profile.trainingType === "funcional" || profile.trainingType === "calistenia")
    return "funcional";
  if (profile.location === "hybrid") return "hibrido";
  if (profile.location === "home" || profile.location === "outdoor") return "home";
  return "musculacao";
}

function getTechniques(modality: ModalityCtx, locale: AppLocale): PlateauTechnique[] {
  switch (modality) {
    case "funcional":
      return buildPlateauFuncional(locale);
    case "hibrido":
      return buildPlateauHibrido(locale);
    case "home":
      return buildPlateauHome(locale);
    default:
      return buildPlateauMusculacao(locale);
  }
}

const MODALITY_COLORS: Record<ModalityCtx, string> = {
  musculacao: "#fb923c",
  funcional: "#22d3ee",
  hibrido: "#a855f7",
  home: "#10b981",
};

function stableHash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function PlateauBreakerWidget({
  level,
  currentWeek,
  todayExercises,
  todayWorkoutId,
}: {
  level: number;
  currentWeek: number;
  todayExercises: { id: string; name: string; muscle?: string }[];
  todayWorkoutId?: string;
}) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    const ts = localStorage.getItem("zyrox.plateauDismissed");
    if (!ts) return false;
    const daysSince = (Date.now() - parseInt(ts)) / (1000 * 60 * 60 * 24);
    return daysSince < 1;
  });

  const locale = getStoredLocale();
  const uiCopy = PLATEAU_UI_COPY[locale] ?? PLATEAU_UI_COPY.pt;
  // loadOnboarding() só existe de verdade no cliente — chamar direto no corpo do
  // componente causa mismatch de hydration (servidor sempre vê perfil vazio,
  // cliente vê o real), que já quebrou outra tela hoje (paywall).
  const [profile, setProfile] = useState<OnboardingState>({});
  useEffect(() => {
    setProfile(loadOnboarding());
  }, []);
  const isFemale =
    profile.gender === "female" || (profile as Record<string, unknown>).sex === "feminino";
  const modality = resolveModalityCtx(profile);
  const techniques = getTechniques(modality, locale);
  const modalityColor = MODALITY_COLORS[modality];

  const todayKey = new Date().toDateString();

  const technique = useMemo(() => {
    const idx = stableHash(todayKey + "tech") % techniques.length;
    return techniques[idx];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey, modality]);

  const exerciseRecord = useMemo(() => {
    if (!todayExercises.length) return { id: null, name: "seu exercício principal" };
    // Pro perfil feminino, o card sempre fala de platô de glúteo/perna (ver
    // PLATEAU_UI_COPY.plateau.female) — sortear um exercício de peito/costas pra
    // essa mensagem não faz sentido. Prioriza exercícios de perna/glúteo do
    // treino de hoje quando existirem; senão cai pro sorteio normal.
    const lowerBodyPool = isFemale
      ? todayExercises.filter((e) => e.muscle === "Pernas" || e.muscle === "Glúteos")
      : [];
    const pool = lowerBodyPool.length > 0 ? lowerBodyPool : todayExercises;
    const idx = stableHash(todayKey + "ex") % pool.length;
    return pool[idx];
  }, [todayKey, todayExercises, isFemale]);
  const exercise = exerciseRecord.name;

  const isStagnating = currentWeek >= 3;

  const navigate = useNavigate();
  const handleApply = () => {
    localStorage.setItem("zyrox.plateauDismissed", String(Date.now()));
    setDismissed(true);
    if (exerciseRecord.id) {
      void navigate({ to: "/app/exercicio/$id", params: { id: exerciseRecord.id } });
    } else if (todayWorkoutId) {
      void navigate({ to: "/app/treino/$id", params: { id: todayWorkoutId } });
    } else {
      void navigate({ to: "/app/treinos" });
    }
  };

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border p-5"
      style={{
        borderColor: `${modalityColor}40`,
        background: `linear-gradient(135deg, ${modalityColor}0d 0%, rgba(6,11,20,0.98) 60%)`,
      }}
    >
      {/* Glow blobs */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
        style={{ background: `${modalityColor}22` }}
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full blur-3xl"
        style={{ background: `${modalityColor}14` }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border"
            style={{
              background: `${modalityColor}18`,
              borderColor: `${modalityColor}40`,
              boxShadow: `0 0 16px ${modalityColor}30`,
            }}
          >
            <ShieldCheck className="h-5 w-5" style={{ color: modalityColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display text-sm font-black uppercase tracking-widest text-white">
                {uiCopy.title}
              </span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest"
                style={{
                  background: `${modalityColor}20`,
                  color: modalityColor,
                  border: `1px solid ${modalityColor}40`,
                }}
              >
                LV {level}+
              </span>
              {modality !== "musculacao" && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest"
                  style={{
                    background: `${modalityColor}15`,
                    color: modalityColor,
                    border: `1px solid ${modalityColor}35`,
                  }}
                >
                  {MODALITY_LABELS_I18N[locale][modality]}
                </span>
              )}
            </div>
            {isStagnating && (
              <div className="mt-0.5 flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                <span className="text-[10px] font-semibold text-amber-400">
                  {isFemale
                    ? uiCopy.plateau.female(currentWeek)
                    : modality === "funcional"
                      ? uiCopy.plateau.funcional(currentWeek)
                      : modality === "hibrido"
                        ? uiCopy.plateau.hibrido(currentWeek)
                        : modality === "home"
                          ? uiCopy.plateau.home(currentWeek)
                          : uiCopy.plateau.default(currentWeek)}
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.setItem("zyrox.plateauDismissed", String(Date.now()));
            setDismissed(true);
          }}
          className="shrink-0 grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/5 text-white/40 hover:text-white/70 transition"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Technique card */}
      <div
        className="relative mt-4 rounded-2xl border p-4"
        style={{ borderColor: `${technique.color}30`, background: `${technique.color}0a` }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
            style={{ background: `${technique.color}25`, color: technique.color }}
          >
            {technique.tag}
          </span>
          <span className="font-display text-base font-black" style={{ color: technique.color }}>
            {technique.name}
          </span>
          {isFemale && (
            <span className="rounded-full border border-pink-400/30 bg-pink-400/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-pink-400">
              {uiCopy.femaleBadge}
            </span>
          )}
        </div>
        <p className="text-[12px] leading-relaxed text-slate-300">
          {isFemale ? technique.descFem(exercise) : technique.desc(exercise)}
        </p>
      </div>

      {/* CTA */}
      <div className="relative mt-4 flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black uppercase tracking-widest text-white active:scale-[0.97] transition-transform"
          style={{
            background: `linear-gradient(135deg, ${modalityColor}cc, ${modalityColor})`,
            boxShadow: `0 0 20px ${modalityColor}40`,
          }}
        >
          <Zap className="h-4 w-4" /> {uiCopy.applyBtn}
        </button>
        <Link
          to="/app/treinos"
          className="flex items-center justify-center gap-1 rounded-xl border px-4 py-3 text-xs font-semibold transition-transform active:scale-[0.97]"
          style={{
            borderColor: `${modalityColor}30`,
            color: modalityColor,
            background: `${modalityColor}08`,
          }}
        >
          {uiCopy.viewWorkoutBtn} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <p className="relative mt-3 text-center text-[10px] text-slate-600">{uiCopy.footerHint}</p>
    </motion.div>
  );
}
