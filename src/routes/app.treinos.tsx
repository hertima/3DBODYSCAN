import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  Calendar,
  Clock,
  Flame,
  Play,
  RefreshCcw,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
  ScanLine,
  Apple,
  Dumbbell,
  BarChart3,
} from "lucide-react";
import { useTrainingState } from "@/hooks/use-training-state";
import { cleanLegacyText } from "@/lib/formatting";
import { getStoredLocale } from "@/lib/locale";
import { getIntensityLabel, getModalityLabel, getPhaseLabel, getVolumeBiasLabel, getWeekDayLabels, translateWorkoutName } from "@/lib/training-i18n";
import { loadOnboarding } from "@/lib/onboarding";
import type { CyclePhase } from "@/domain/training/periodization";

export const Route = createFileRoute("/app/treinos")({
  head: () => ({
    meta: [
      { title: "Treinos | 3D Body Scan" },
      { name: "description", content: "Sua semana de treinos organizada pela IA." },
    ],
  }),
  component: TreinosPage,
});

function formatDisplayValue(value: string) {
  return cleanLegacyText(value);
}

const AI_STEPS: Record<string, string[]> = {
  pt: ["Analisando histórico de 28 dias...", "Detectando platôs e recovery...", "Distribuindo volume semanal...", "Selecionando exercícios prioritários...", "Calibrando intensidade por dia...", "Pronto."],
  es: ["Analizando historial de 28 días...", "Detectando mesetas y recuperación...", "Distribuyendo volumen semanal...", "Seleccionando ejercicios prioritarios...", "Calibrando intensidad por día...", "Listo."],
  en: ["Analyzing 28-day history...", "Detecting plateaus and recovery...", "Distributing weekly volume...", "Selecting priority exercises...", "Calibrating daily intensity...", "Done."],
  fr: ["Analyse de l'historique 28 jours...", "Détection des plateaux et récupération...", "Distribution du volume hebdomadaire...", "Sélection des exercices prioritaires...", "Calibration de l'intensité journalière...", "Prêt."],
  de: ["28-Tage-Verlauf wird analysiert...", "Plateaus und Recovery erkannt...", "Wochenvolumen wird verteilt...", "Prioritätsübungen werden ausgewählt...", "Tagesintensität wird kalibriert...", "Fertig."],
};

const COPY = {
  pt: { coach: "Coach IA", title: "Sua semana 3D Body Scan", workouts: "treinos", organized: "organizados pela IA", engine: "Motor IA v2.4", active: "Ativo", optimized: "Plano otimizado para sua próxima semana.", optimizing: "Otimizando", reorganize: "Reorganizar", statWorkouts: "Treinos", statTime: "Tempo", statVolume: "Volume", currentBlock: "Bloco atual", week: "Semana", phase: "Fase", volume: "Volume", intensity: "Intensidade", cycle: "Direção do ciclo", adjustment: "Ajuste do bloco", weekPlan: "Plano da semana", sorted: "Ordenado pela IA", rest: "Descanso ativo", mobility: "Mobilidade leve sugerida", why: "Por que essa ordem?", fullLibrary: "Biblioteca completa", cataloged: "500+ exercícios catalogados", reason1: "Treino de empurrar antes do treino de puxar para aproveitar melhor o descanso anterior.", reason2: "Treino de pernas na quinta: você performa melhor com 1 dia de recuperação prévia.", reason3: "Sessão técnica no sábado para skill em estado neural mais fresco." },
  es: { coach: "Coach IA", title: "Tu semana 3D Body Scan", workouts: "entrenamientos", organized: "organizados por la IA", engine: "Motor IA v2.4", active: "Activo", optimized: "Plan optimizado para tu proxima semana.", optimizing: "Optimizando", reorganize: "Reorganizar", statWorkouts: "Entrenos", statTime: "Tiempo", statVolume: "Volumen", currentBlock: "Bloque actual", week: "Semana", phase: "Fase", volume: "Volumen", intensity: "Intensidad", cycle: "Direccion del ciclo", adjustment: "Ajuste del bloque", weekPlan: "Plan de la semana", sorted: "Ordenado por IA", rest: "Descanso activo", mobility: "Movilidad ligera sugerida", why: "Por que este orden?", fullLibrary: "Biblioteca completa", cataloged: "500+ ejercicios catalogados", reason1: "Empuje antes de tiron para aprovechar mejor el descanso previo.", reason2: "Piernas el jueves: rindes mejor con un dia de recuperacion previa.", reason3: "Sesion tecnica el sabado para skill con el sistema nervioso mas fresco." },
  en: { coach: "AI Coach", title: "Your 3D Body Scan week", workouts: "workouts", organized: "organized by AI", engine: "AI Engine v2.4", active: "Active", optimized: "Plan optimized for your next week.", optimizing: "Optimizing", reorganize: "Reorganize", statWorkouts: "Workouts", statTime: "Time", statVolume: "Volume", currentBlock: "Current block", week: "Week", phase: "Phase", volume: "Volume", intensity: "Intensity", cycle: "Cycle direction", adjustment: "Block adjustment", weekPlan: "Week plan", sorted: "Sorted by AI", rest: "Active rest", mobility: "Light mobility suggested", why: "Why this order?", fullLibrary: "Full library", cataloged: "500+ cataloged exercises", reason1: "Push before pull to take better advantage of the previous recovery window.", reason2: "Legs on Thursday: you perform better with one prior recovery day.", reason3: "Technical session on Saturday for fresher neural skill work." },
  fr: { coach: "Coach IA", title: "Votre semaine 3D Body Scan", workouts: "entrainements", organized: "organises par l'IA", engine: "Moteur IA v2.4", active: "Actif", optimized: "Plan optimise pour votre prochaine semaine.", optimizing: "Optimisation", reorganize: "Reorganiser", statWorkouts: "Entrainements", statTime: "Temps", statVolume: "Volume", currentBlock: "Bloc actuel", week: "Semaine", phase: "Phase", volume: "Volume", intensity: "Intensite", cycle: "Direction du cycle", adjustment: "Ajustement du bloc", weekPlan: "Plan de la semaine", sorted: "Ordonne par l'IA", rest: "Repos actif", mobility: "Mobilite legere suggeree", why: "Pourquoi cet ordre ?", fullLibrary: "Bibliotheque complete", cataloged: "500+ exercices catalogues", reason1: "Poussee avant tirage pour mieux profiter de la recuperation precedente.", reason2: "Jambes le jeudi : vous performez mieux avec un jour de recuperation avant.", reason3: "Session technique le samedi pour les skills avec un etat neural plus frais." },
  de: { coach: "KI-Coach", title: "Deine 3D Body Scan-Woche", workouts: "Trainings", organized: "von der KI organisiert", engine: "KI-Engine v2.4", active: "Aktiv", optimized: "Plan fur deine nachste Woche optimiert.", optimizing: "Optimierung", reorganize: "Neu ordnen", statWorkouts: "Trainings", statTime: "Zeit", statVolume: "Volumen", currentBlock: "Aktueller Block", week: "Woche", phase: "Phase", volume: "Volumen", intensity: "Intensitat", cycle: "Zyklusrichtung", adjustment: "Blockanpassung", weekPlan: "Wochenplan", sorted: "Von KI sortiert", rest: "Aktive Erholung", mobility: "Leichte Mobilitat empfohlen", why: "Warum diese Reihenfolge?", fullLibrary: "Komplette Bibliothek", cataloged: "500+ katalogisierte Ubungen", reason1: "Push vor Pull, um die vorherige Erholung besser zu nutzen.", reason2: "Beine am Donnerstag: du leistest besser mit einem Erholungstag davor.", reason3: "Technische Einheit am Samstag fur frischere Skill-Arbeit." },
} as const;

function TreinosPage() {
  const locale = getStoredLocale();
  const copy = COPY[locale] ?? COPY.pt;
  const [refreshKey, setRefreshKey] = useState(0);
  const [aiState, setAiState] = useState<"idle" | "thinking" | "ready">("ready");
  const AI_STEPS_LEN = AI_STEPS.pt.length;
  const [stepIdx, setStepIdx] = useState(AI_STEPS_LEN - 1);
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
      setStepIdx((current) =>
        current >= AI_STEPS_LEN - 2 ? current : current + 1,
      );
    }, 900);
    return () => clearInterval(id);
  }, [aiState]);

  const totalWorkouts = weekPlan.filter((day) => day.workoutId).length;
  const totalMinutes = weekPlan.reduce((total, day) => {
    const workout = trainingState.workouts.find((item) => item.id === day.workoutId);
    return total + (workout?.duration ?? 0);
  }, 0);
  const currentPeriodWeek = periodization.weeks[periodization.currentWeek - 1];
  const translatedShortTerm =
    locale === "es"
      ? `Semana ${periodization.currentWeek} del bloque de 12 semanas con foco en ${copy.workouts === "entrenamientos" ? "hipertrofia" : "rendimiento"} dentro de la modalidad ${getModalityLabel(periodization.modality, locale).toLowerCase()}.`
      : locale === "en"
        ? `Week ${periodization.currentWeek} of the 12-week block focused on progression within the ${getModalityLabel(periodization.modality, locale).toLowerCase()} modality.`
        : locale === "fr"
          ? `Semaine ${periodization.currentWeek} du bloc de 12 semaines ax\u00E9e sur la progression dans la modalit\u00E9 ${getModalityLabel(periodization.modality, locale).toLowerCase()}.`
          : locale === "de"
            ? `Woche ${periodization.currentWeek} des 12-Wochen-Blocks mit Fokus auf Fortschritt innerhalb der Modalit\u00E4t ${getModalityLabel(periodization.modality, locale).toLowerCase()}.`
            : periodization.summary.shortTerm;
  const translatedMediumTerm =
    locale === "es"
      ? "El trimestre alterna base, progresion, intensificacion y descarga para evitar estancamientos y mantener la recurrencia."
      : locale === "en"
        ? "The quarter alternates base, progression, intensification, and deload to avoid plateaus and maintain consistency."
        : locale === "fr"
          ? "Le trimestre alterne base, progression, intensification et deload pour eviter les plateaux et maintenir la regularite."
          : locale === "de"
            ? "Das Quartal wechselt zwischen Basis, Progression, Intensivierung und Deload, um Plateaus zu vermeiden und die Konstanz zu halten."
            : periodization.summary.mediumTerm;
  const translatedLongTerm =
    locale === "es"
      ? "La jornada anual usa cuatro bloques de 12 semanas para sostener corto, medio y largo plazo con una base profesional."
      : locale === "en"
        ? "The annual path uses four 12-week blocks to support short-, mid-, and long-term progress with a professional foundation."
        : locale === "fr"
          ? "Le parcours annuel utilise quatre blocs de 12 semaines pour soutenir le court, moyen et long terme avec une base professionnelle."
          : locale === "de"
            ? "Der Jahresverlauf nutzt vier 12-Wochen-Blocke, um kurz-, mittel- und langfristigen Fortschritt mit professioneller Grundlage zu sichern."
            : periodization.summary.longTerm;
  const translatedAdjustment =
    locale === "es"
      ? "el split respeta objetivo, modalidad y contexto del atleta."
      : locale === "en"
        ? "the split respects the athlete's goal, modality, and context."
        : locale === "fr"
          ? "le split respecte l'objectif, la modalite et le contexte de l'athlete."
          : locale === "de"
            ? "der Split berucksichtigt Ziel, Modalitat und Kontext des Athleten."
            : periodization.adjustments.splitBias;

  return (
    <div className="space-y-5 pb-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">{copy.coach}</p>
        <h1 className="font-display text-2xl font-bold leading-tight text-gradient-brand">{copy.title}</h1>
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
              setRefreshKey((k) => k + 1);
              trainingState.regenerate();
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
        <Stat icon={Calendar} label={copy.statWorkouts} value={`${totalWorkouts}`} accent="text-cyan" />
        <Stat icon={Clock} label={copy.statTime} value={`${totalMinutes}m`} accent="text-primary" />
        <Stat icon={Flame} label={copy.statVolume} value="+8%" accent="text-success" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
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
              {copy.volume}: {getVolumeBiasLabel((currentPeriodWeek?.volumeBias ?? "alto") as "alto" | "moderado" | "baixo", locale)}
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
              {copy.intensity}: {getIntensityLabel(currentPeriodWeek?.intensityBias ?? "leve", locale)}
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{translatedShortTerm}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan">
            {copy.cycle}
          </p>
          <div className="mt-3 space-y-3 text-sm text-muted-foreground">
            <p>{translatedMediumTerm}</p>
            <p>{translatedLongTerm}</p>
            <p>{copy.adjustment}: {translatedAdjustment}</p>
          </div>
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
                    <span className="truncate text-sm font-semibold">{translateWorkoutName(workout.name, locale)}</span>
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

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan" />
          <h3 className="text-sm font-semibold">{copy.why}</h3>
          {trainingState.aiLoading && (
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              {(AI_STEPS[locale] ?? AI_STEPS.pt)[0]}
            </span>
          )}
          {trainingState.aiReady && !trainingState.aiLoading && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-success">
              <span className="h-1 w-1 rounded-full bg-success" />
              {locale === "en" ? "AI" : "IA"}
            </span>
          )}
        </div>
        {trainingState.aiWeekFocus && (
          <p className="mb-3 text-xs font-medium italic text-primary/80">
            {trainingState.aiWeekFocus}
          </p>
        )}
        <ul className="space-y-2 text-xs text-muted-foreground">
          {(trainingState.aiReady && trainingState.aiReasons.length >= 3
            ? trainingState.aiReasons
            : [copy.reason1, copy.reason2, copy.reason3]
          ).map((reason, i) => (
            <li key={i} className="flex gap-2">
              {i === 0 ? (
                <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              ) : i === 1 ? (
                <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan" />
              ) : (
                <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              )}
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <Link
        to="/app/exercicios"
        className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-elevated text-cyan">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">{copy.fullLibrary}</div>
            <div className="text-[11px] text-muted-foreground">{copy.cataloged}</div>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
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
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
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

function IntensityPill({ level, locale }: { level: "Leve" | "Moderado" | "Pesado"; locale: string }) {
  const map = { Leve: "text-success", Moderado: "text-cyan", Pesado: "text-primary" } as const;
  const dots = level === "Leve" ? 1 : level === "Moderado" ? 2 : 3;
  const label = (INTENSITY_LABELS[locale] ?? INTENSITY_LABELS.pt)[level] ?? level;

  return (
    <span className={`inline-flex items-center gap-0.5 ${map[level]}`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <span key={index} className={`h-1 w-1 rounded-full ${index < dots ? "bg-current" : "bg-border"}`} />
      ))}
      <span className="ml-1 font-semibold">{label}</span>
    </span>
  );
}
