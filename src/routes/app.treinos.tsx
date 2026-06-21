import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Calendar,
  Clock,
  Play,
  RefreshCcw,
  CheckCircle2,
  Loader2,
  Target,
  Dumbbell,
} from "lucide-react";
import { useTrainingState } from "@/hooks/use-training-state";
import { cleanLegacyText } from "@/lib/formatting";
import { getStoredLocale } from "@/lib/locale";
import {
  getIntensityLabel,
  getModalityLabel,
  getPhaseLabel,
  getVolumeBiasLabel,
  getWeekDayLabels,
  translateWorkoutName,
} from "@/lib/training-i18n";
import { loadOnboarding, saveOnboarding } from "@/lib/onboarding";
import { cn } from "@/lib/utils";
import type { CyclePhase } from "@/domain/training/periodization";

export const Route = createFileRoute("/app/treinos")({
  head: () => ({
    meta: [
      { title: "Treinos | 3D Body Scanner" },
      { name: "description", content: "Sua semana de treinos organizada pela IA." },
    ],
  }),
  component: TreinosPage,
});

function formatDisplayValue(value: string) {
  return cleanLegacyText(value);
}

const AI_STEPS: Record<string, string[]> = {
  pt: [
    "Analisando histórico de 28 dias...",
    "Detectando platôs e recovery...",
    "Distribuindo volume semanal...",
    "Selecionando exercícios prioritários...",
    "Calibrando intensidade por dia...",
    "Pronto.",
  ],
  es: [
    "Analizando historial de 28 días...",
    "Detectando mesetas y recuperación...",
    "Distribuyendo volumen semanal...",
    "Seleccionando ejercicios prioritarios...",
    "Calibrando intensidad por día...",
    "Listo.",
  ],
  en: [
    "Analyzing 28-day history...",
    "Detecting plateaus and recovery...",
    "Distributing weekly volume...",
    "Selecting priority exercises...",
    "Calibrating daily intensity...",
    "Done.",
  ],
  fr: [
    "Analyse de l'historique 28 jours...",
    "Détection des plateaux et récupération...",
    "Distribution du volume hebdomadaire...",
    "Sélection des exercices prioritaires...",
    "Calibration de l'intensité journalière...",
    "Prêt.",
  ],
  de: [
    "28-Tage-Verlauf wird analysiert...",
    "Plateaus und Recovery erkannt...",
    "Wochenvolumen wird verteilt...",
    "Prioritätsübungen werden ausgewählt...",
    "Tagesintensität wird kalibriert...",
    "Fertig.",
  ],
};

const COPY = {
  pt: {
    coach: "Coach IA",
    title: "Sua semana 3D Body Scanner",
    workouts: "treinos",
    organized: "organizados pela IA",
    engine: "Motor IA v2.4",
    active: "Ativo",
    optimized: "Plano otimizado para sua próxima semana.",
    optimizing: "Otimizando",
    reorganize: "Reorganizar",
    statWorkouts: "Treinos",
    statTime: "Tempo",
    statVolume: "Volume",
    statExercises: "Exercícios",
    currentBlock: "Bloco atual",
    week: "Semana",
    phase: "Fase",
    volume: "Volume",
    intensity: "Intensidade",
    cycle: "Direção do ciclo",
    adjustment: "Ajuste do bloco",
    weekPlan: "Plano da semana",
    sorted: "Ordenado pela IA",
    rest: "Descanso ativo",
    mobility: "Mobilidade leve sugerida",
    why: "Por que essa ordem?",
    fullLibrary: "Biblioteca completa",
    cataloged: "500+ exercícios catalogados",
    reason1:
      "Treino de empurrar antes do treino de puxar para aproveitar melhor o descanso anterior.",
    reason2: "Treino de pernas na quinta: você performa melhor com 1 dia de recuperação prévia.",
    reason3: "Sessão técnica no sábado para skill em estado neural mais fresco.",
    pickerTitle: "Dias de treino",
    pickerSubtitle: "Selecione os dias que você treina por semana",
    pickerConfirm: "Gerar plano",
    pickerCancel: "Cancelar",
    pickerMin: "Selecione pelo menos 1 dia",
  },
  es: {
    coach: "Coach IA",
    title: "Tu semana 3D Body Scanner",
    workouts: "entrenamientos",
    organized: "organizados por la IA",
    engine: "Motor IA v2.4",
    active: "Activo",
    optimized: "Plan optimizado para tu próxima semana.",
    optimizing: "Optimizando",
    reorganize: "Reorganizar",
    statWorkouts: "Entrenos",
    statTime: "Tiempo",
    statVolume: "Volumen",
    statExercises: "Ejercicios",
    currentBlock: "Bloque actual",
    week: "Semana",
    phase: "Fase",
    volume: "Volumen",
    intensity: "Intensidad",
    cycle: "Dirección del ciclo",
    adjustment: "Ajuste del bloque",
    weekPlan: "Plan de la semana",
    sorted: "Ordenado por IA",
    rest: "Descanso activo",
    mobility: "Movilidad ligera sugerida",
    why: "¿Por qué este orden?",
    fullLibrary: "Biblioteca completa",
    cataloged: "500+ ejercicios catalogados",
    reason1: "Empuje antes de tirón para aprovechar mejor el descanso previo.",
    reason2: "Piernas el jueves: rindes mejor con un día de recuperación previa.",
    reason3: "Sesión técnica el sábado para skill con el sistema nervioso más fresco.",
    pickerTitle: "Días de entrenamiento",
    pickerSubtitle: "Selecciona los días que entrenas por semana",
    pickerConfirm: "Generar plan",
    pickerCancel: "Cancelar",
    pickerMin: "Selecciona al menos 1 día",
  },
  en: {
    coach: "AI Coach",
    title: "Your 3D Body Scanner week",
    workouts: "workouts",
    organized: "organized by AI",
    engine: "AI Engine v2.4",
    active: "Active",
    optimized: "Plan optimized for your next week.",
    optimizing: "Optimizing",
    reorganize: "Reorganize",
    statWorkouts: "Workouts",
    statTime: "Time",
    statVolume: "Volume",
    statExercises: "Exercises",
    currentBlock: "Current block",
    week: "Week",
    phase: "Phase",
    volume: "Volume",
    intensity: "Intensity",
    cycle: "Cycle direction",
    adjustment: "Block adjustment",
    weekPlan: "Week plan",
    sorted: "Sorted by AI",
    rest: "Active rest",
    mobility: "Light mobility suggested",
    why: "Why this order?",
    fullLibrary: "Full library",
    cataloged: "500+ cataloged exercises",
    reason1: "Push before pull to take better advantage of the previous recovery window.",
    reason2: "Legs on Thursday: you perform better with one prior recovery day.",
    reason3: "Technical session on Saturday for fresher neural skill work.",
    pickerTitle: "Training days",
    pickerSubtitle: "Select the days you train per week",
    pickerConfirm: "Generate plan",
    pickerCancel: "Cancel",
    pickerMin: "Select at least 1 day",
  },
  fr: {
    coach: "Coach IA",
    title: "Votre semaine 3D Body Scanner",
    workouts: "entraînements",
    organized: "organisés par l'IA",
    engine: "Moteur IA v2.4",
    active: "Actif",
    optimized: "Plan optimisé pour votre prochaine semaine.",
    optimizing: "Optimisation",
    reorganize: "Réorganiser",
    statWorkouts: "Entraînements",
    statTime: "Temps",
    statVolume: "Volume",
    statExercises: "Exercices",
    currentBlock: "Bloc actuel",
    week: "Semaine",
    phase: "Phase",
    volume: "Volume",
    intensity: "Intensité",
    cycle: "Direction du cycle",
    adjustment: "Ajustement du bloc",
    weekPlan: "Plan de la semaine",
    sorted: "Ordonné par l'IA",
    rest: "Repos actif",
    mobility: "Mobilité légère suggérée",
    why: "Pourquoi cet ordre ?",
    fullLibrary: "Bibliothèque complète",
    cataloged: "500+ exercices catalogués",
    reason1: "Poussée avant tirage pour mieux profiter de la récupération précédente.",
    reason2: "Jambes le jeudi : vous performez mieux avec un jour de récupération avant.",
    reason3: "Séance technique le samedi pour les skills avec un état neural plus frais.",
    pickerTitle: "Jours d'entraînement",
    pickerSubtitle: "Sélectionnez les jours où vous vous entraînez par semaine",
    pickerConfirm: "Générer le plan",
    pickerCancel: "Annuler",
    pickerMin: "Sélectionnez au moins 1 jour",
  },
  de: {
    coach: "KI-Coach",
    title: "Deine 3D Body Scanner-Woche",
    workouts: "Trainings",
    organized: "von der KI organisiert",
    engine: "KI-Engine v2.4",
    active: "Aktiv",
    optimized: "Plan für deine nächste Woche optimiert.",
    optimizing: "Optimierung",
    reorganize: "Neu ordnen",
    statWorkouts: "Trainings",
    statTime: "Zeit",
    statVolume: "Volumen",
    statExercises: "Übungen",
    currentBlock: "Aktueller Block",
    week: "Woche",
    phase: "Phase",
    volume: "Volumen",
    intensity: "Intensität",
    cycle: "Zyklusrichtung",
    adjustment: "Blockanpassung",
    weekPlan: "Wochenplan",
    sorted: "Von KI sortiert",
    rest: "Aktive Erholung",
    mobility: "Leichte Mobilität empfohlen",
    why: "Warum diese Reihenfolge?",
    fullLibrary: "Komplette Bibliothek",
    cataloged: "500+ katalogisierte Übungen",
    reason1: "Push vor Pull, um die vorherige Erholung besser zu nutzen.",
    reason2: "Beine am Donnerstag: du leistest besser mit einem Erholungstag davor.",
    reason3: "Technische Einheit am Samstag für frischere Skill-Arbeit.",
    pickerTitle: "Trainingstage",
    pickerSubtitle: "Wähle die Tage, an denen du pro Woche trainierst",
    pickerConfirm: "Plan erstellen",
    pickerCancel: "Abbrechen",
    pickerMin: "Wähle mindestens 1 Tag",
  },
} as const;

function TreinosPage() {
  const locale = getStoredLocale();
  const copy = COPY[locale] ?? COPY.pt;
  const [refreshKey, setRefreshKey] = useState(0);
  const [aiState, setAiState] = useState<"idle" | "thinking" | "ready">("ready");
  const AI_STEPS_LEN = AI_STEPS.pt.length;
  const [stepIdx, setStepIdx] = useState(AI_STEPS_LEN - 1);
  const [showDaysPicker, setShowDaysPicker] = useState(false);
  const [pickerDays, setPickerDays] = useState<number[]>(
    () => loadOnboarding().days ?? [0, 1, 2, 3, 4],
  );
  const trainingState = useTrainingState(refreshKey);
  const { periodization } = trainingState;
  const weekDays = getWeekDayLabels(locale);
  const weekPlan = weekDays.map((day, index) => ({
    day,
    workoutId: trainingState.schedule[index]?.workoutId ?? null,
    intensity: trainingState.schedule[index]?.intensity,
    tag: trainingState.schedule[index]?.tag,
  }));

  useEffect(() => {
    if (trainingState.aiLoading) {
      setAiState("thinking");
      setStepIdx(0);
    } else if (aiState === "thinking") {
      setAiState("ready");
      setStepIdx(AI_STEPS_LEN - 1);
    }
  }, [trainingState.aiLoading]);

  useEffect(() => {
    if (aiState !== "thinking") return;
    const id = setInterval(() => {
      setStepIdx((current) => (current >= AI_STEPS_LEN - 2 ? current : current + 1));
    }, 900);
    return () => clearInterval(id);
  }, [aiState]);

  const totalWorkouts = weekPlan.filter((day) => day.workoutId).length;
  const totalMinutes = weekPlan.reduce((total, day) => {
    const workout = trainingState.workouts.find((item) => item.id === day.workoutId);
    return total + (workout?.duration ?? 0);
  }, 0);
  const totalExercises = weekPlan.reduce((total, day) => {
    const workout = trainingState.workouts.find((item) => item.id === day.workoutId);
    return total + (workout?.exercises.length ?? 0);
  }, 0);
  const currentPeriodWeek = periodization.weeks[periodization.currentWeek - 1];

  return (
    <div className="space-y-5 pb-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">{copy.coach}</p>
        <h1 className="font-display text-2xl font-bold leading-tight text-gradient-brand">
          {copy.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalWorkouts} {copy.workouts} | {totalMinutes} min {copy.organized}
        </p>
      </div>

      <motion.div
        layout
        className="relative overflow-hidden rounded-2xl border border-cyan/30 bg-gradient-to-br from-cyan/10 via-surface to-primary/10 p-4"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan/20 blur-3xl" />
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan/20 text-cyan">
            <Brain className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{copy.engine}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> {copy.active}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={aiState + stepIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 text-xs text-muted-foreground"
              >
                {aiState === "thinking"
                  ? (AI_STEPS[locale] ?? AI_STEPS.pt)[stepIdx]
                  : copy.optimized}
              </motion.p>
            </AnimatePresence>
          </div>
          <button
            onClick={() => {
              setPickerDays(loadOnboarding().days ?? [0, 1, 2, 3, 4]);
              setShowDaysPicker(true);
            }}
            disabled={aiState === "thinking"}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1.5 text-xs font-semibold text-cyan transition hover:bg-cyan/20 disabled:opacity-60"
          >
            {aiState === "thinking" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCcw className="h-3.5 w-3.5" />
            )}
            {aiState === "thinking" ? copy.optimizing : copy.reorganize}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-2">
        <Stat
          icon={Calendar}
          label={copy.statWorkouts}
          value={`${totalWorkouts}`}
          accent="text-cyan"
        />
        <Stat icon={Clock} label={copy.statTime} value={`${totalMinutes}m`} accent="text-primary" />
        <Stat
          icon={Dumbbell}
          label={copy.statExercises}
          value={`${totalExercises}`}
          accent="text-success"
        />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan">
              {copy.currentBlock}
            </p>
            <h2 className="mt-1 font-display text-lg font-semibold">
              {copy.week} {periodization.currentWeek} de 12
            </h2>
          </div>
          <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            {getModalityLabel(periodization.modality, locale)}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
          <span className="rounded-full bg-cyan/10 px-2 py-1 text-cyan">
            {copy.phase}: {getPhaseLabel(currentPeriodWeek?.phase ?? "base", locale)}
          </span>
          <span className="rounded-full bg-success/10 px-2 py-1 text-success">
            {copy.volume}:{" "}
            {getVolumeBiasLabel(
              (currentPeriodWeek?.volumeBias ?? "alto") as "alto" | "moderado" | "baixo",
              locale,
            )}
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
            {copy.intensity}:{" "}
            {getIntensityLabel(currentPeriodWeek?.intensityBias ?? "leve", locale)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1">
        {weekDays.map((day, index) => {
          const plan = weekPlan[index];
          const active = !!plan.workoutId;
          return (
            <div
              key={day}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl border py-2 ${
                active ? "border-primary/40 bg-primary/10" : "border-border bg-surface"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {day}
              </span>
              {active ? (
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow-primary" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">{copy.weekPlan}</h2>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {copy.sorted}
          </span>
        </div>

        {weekPlan.map((plan, index) => {
          const workout = trainingState.workouts.find((item) => item.id === plan.workoutId);

          if (!workout) {
            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-dashed border-border bg-surface/40 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-elevated text-[11px] font-bold text-muted-foreground">
                    {plan.day}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{copy.rest}</div>
                    <div className="text-xs text-muted-foreground">{copy.mobility}</div>
                  </div>
                </div>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          }

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
                to="/app/treino/$id"
                params={{ id: workout.id }}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition active:scale-[0.99] hover:border-primary/40"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-cyan/20 text-xs font-bold text-foreground">
                  {plan.day}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold">
                      {translateWorkoutName(workout.name, locale)}
                    </span>
                    {plan.tag ? (
                      <span className="rounded-full bg-cyan/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan">
                        {plan.tag}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="truncate">{formatDisplayValue(workout.focus)}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {workout.duration}m
                    </span>
                    <span>|</span>
                    <span className="inline-flex items-center gap-1">
                      <Target className="h-3 w-3" /> {workout.exercises.length} ex
                    </span>
                    {plan.intensity ? (
                      <>
                        <span>|</span>
                        <IntensityPill level={plan.intensity} locale={locale} />
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow-primary transition group-hover:scale-105">
                  <Play className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showDaysPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 pb-8"
            onClick={() => setShowDaysPicker(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-border bg-background p-5 shadow-2xl"
            >
              <div className="mb-4 text-center">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {copy.pickerTitle}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{copy.pickerSubtitle}</p>
              </div>

              <div className="mb-5 grid grid-cols-7 gap-1.5">
                {weekDays.map((label, i) => {
                  const active = pickerDays.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setPickerDays((prev) =>
                          prev.includes(i)
                            ? prev.filter((d) => d !== i)
                            : [...prev, i].sort((a, b) => a - b),
                        );
                      }}
                      className={cn(
                        "aspect-square rounded-2xl border text-xs font-semibold transition",
                        active
                          ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary"
                          : "border-border bg-surface text-foreground hover:border-primary/30",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {pickerDays.length === 0 && (
                <p className="mb-3 text-center text-xs text-destructive">{copy.pickerMin}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setShowDaysPicker(false)}
                  className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-elevated"
                >
                  {copy.pickerCancel}
                </button>
                <button
                  disabled={pickerDays.length === 0}
                  onClick={() => {
                    const current = loadOnboarding();
                    saveOnboarding({ ...current, days: pickerDays });
                    setShowDaysPicker(false);
                    setRefreshKey((k) => k + 1);
                    trainingState.regenerate();
                  }}
                  className="flex-1 rounded-2xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary transition disabled:opacity-50"
                >
                  {copy.pickerConfirm}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <Icon className={`h-3.5 w-3.5 ${accent}`} />
      <div className="mt-1 font-display text-lg font-bold leading-none">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

const INTENSITY_LABELS: Record<string, Record<string, string>> = {
  pt: { Leve: "Leve", Moderado: "Moderado", Pesado: "Pesado" },
  es: { Leve: "Leve", Moderado: "Moderado", Pesado: "Pesado" },
  en: { Leve: "Light", Moderado: "Moderate", Pesado: "Heavy" },
  fr: { Leve: "Léger", Moderado: "Modéré", Pesado: "Intense" },
  de: { Leve: "Leicht", Moderado: "Moderat", Pesado: "Schwer" },
};

function IntensityPill({
  level,
  locale,
}: {
  level: "Leve" | "Moderado" | "Pesado";
  locale: string;
}) {
  const map = { Leve: "text-success", Moderado: "text-cyan", Pesado: "text-primary" } as const;
  const dots = level === "Leve" ? 1 : level === "Moderado" ? 2 : 3;
  const label = (INTENSITY_LABELS[locale] ?? INTENSITY_LABELS.pt)[level] ?? level;

  return (
    <span className={`inline-flex items-center gap-0.5 ${map[level]}`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <span
          key={index}
          className={`h-1 w-1 rounded-full ${index < dots ? "bg-current" : "bg-border"}`}
        />
      ))}
      <span className="ml-1 font-semibold">{label}</span>
    </span>
  );
}
