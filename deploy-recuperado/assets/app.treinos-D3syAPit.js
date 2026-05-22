import { r as reactExports, W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { c as createLucideIcon, g as getStoredLocale, h as getWeekDayLabels, j as getModalityLabel, m as motion, A as AnimatePresence, k as getPhaseLabel, n as getVolumeBiasLabel, o as getIntensityLabel, L as Link, t as translateWorkoutName, p as cleanLegacyText } from "./router-BDD3RgVy.js";
import { u as useTrainingState } from "./use-training-state-DNcnklus.js";
import { B as Brain } from "./brain-80Gcp3VO.js";
import { L as LoaderCircle } from "./loader-circle-B6zikF32.js";
import { R as RefreshCcw } from "./refresh-ccw-BNfJy4G4.js";
import { C as Clock } from "./clock-pfs1_d9-.js";
import { F as Flame } from "./flame-B4I7h4kj.js";
import { C as CircleCheck } from "./circle-check-CDnoii2G.js";
import { T as Target } from "./target-DclDxru3.js";
import { P as Play } from "./play-DI3yn4ti.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
import { Z as Zap } from "./zap-DR4zCOeL.js";
import { T as TrendingUp } from "./trending-up-DCMFIZtG.js";
import { C as ChevronRight } from "./chevron-right-DRYfnruU.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
import "./workout-history-D2efW0ov.js";
import "./firebase-CeVmTMBf.js";
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode);
function formatDisplayValue(value) {
  return cleanLegacyText(value);
}
const AI_STEPS = {
  pt: ["Analisando histórico de 28 dias...", "Detectando platôs e recovery...", "Distribuindo volume semanal...", "Selecionando exercícios prioritários...", "Calibrando intensidade por dia...", "Pronto."],
  es: ["Analizando historial de 28 días...", "Detectando mesetas y recuperación...", "Distribuyendo volumen semanal...", "Seleccionando ejercicios prioritarios...", "Calibrando intensidad por día...", "Listo."],
  en: ["Analyzing 28-day history...", "Detecting plateaus and recovery...", "Distributing weekly volume...", "Selecting priority exercises...", "Calibrating daily intensity...", "Done."],
  fr: ["Analyse de l'historique 28 jours...", "Détection des plateaux et récupération...", "Distribution du volume hebdomadaire...", "Sélection des exercices prioritaires...", "Calibration de l'intensité journalière...", "Prêt."],
  de: ["28-Tage-Verlauf wird analysiert...", "Plateaus und Recovery erkannt...", "Wochenvolumen wird verteilt...", "Prioritätsübungen werden ausgewählt...", "Tagesintensität wird kalibriert...", "Fertig."]
};
const COPY = {
  pt: {
    coach: "Coach IA",
    title: "Sua semana 3D Body Scan",
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
    reason1: "Treino de empurrar antes do treino de puxar para aproveitar melhor o descanso anterior.",
    reason2: "Treino de pernas na quinta: você performa melhor com 1 dia de recuperação prévia.",
    reason3: "Sessão técnica no sábado para skill em estado neural mais fresco."
  },
  es: {
    coach: "Coach IA",
    title: "Tu semana 3D Body Scan",
    workouts: "entrenamientos",
    organized: "organizados por la IA",
    engine: "Motor IA v2.4",
    active: "Activo",
    optimized: "Plan optimizado para tu proxima semana.",
    optimizing: "Optimizando",
    reorganize: "Reorganizar",
    statWorkouts: "Entrenos",
    statTime: "Tiempo",
    statVolume: "Volumen",
    currentBlock: "Bloque actual",
    week: "Semana",
    phase: "Fase",
    volume: "Volumen",
    intensity: "Intensidad",
    cycle: "Direccion del ciclo",
    adjustment: "Ajuste del bloque",
    weekPlan: "Plan de la semana",
    sorted: "Ordenado por IA",
    rest: "Descanso activo",
    mobility: "Movilidad ligera sugerida",
    why: "Por que este orden?",
    fullLibrary: "Biblioteca completa",
    cataloged: "500+ ejercicios catalogados",
    reason1: "Empuje antes de tiron para aprovechar mejor el descanso previo.",
    reason2: "Piernas el jueves: rindes mejor con un dia de recuperacion previa.",
    reason3: "Sesion tecnica el sabado para skill con el sistema nervioso mas fresco."
  },
  en: {
    coach: "AI Coach",
    title: "Your 3D Body Scan week",
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
    reason3: "Technical session on Saturday for fresher neural skill work."
  },
  fr: {
    coach: "Coach IA",
    title: "Votre semaine 3D Body Scan",
    workouts: "entrainements",
    organized: "organises par l'IA",
    engine: "Moteur IA v2.4",
    active: "Actif",
    optimized: "Plan optimise pour votre prochaine semaine.",
    optimizing: "Optimisation",
    reorganize: "Reorganiser",
    statWorkouts: "Entrainements",
    statTime: "Temps",
    statVolume: "Volume",
    currentBlock: "Bloc actuel",
    week: "Semaine",
    phase: "Phase",
    volume: "Volume",
    intensity: "Intensite",
    cycle: "Direction du cycle",
    adjustment: "Ajustement du bloc",
    weekPlan: "Plan de la semaine",
    sorted: "Ordonne par l'IA",
    rest: "Repos actif",
    mobility: "Mobilite legere suggeree",
    why: "Pourquoi cet ordre ?",
    fullLibrary: "Bibliotheque complete",
    cataloged: "500+ exercices catalogues",
    reason1: "Poussee avant tirage pour mieux profiter de la recuperation precedente.",
    reason2: "Jambes le jeudi : vous performez mieux avec un jour de recuperation avant.",
    reason3: "Session technique le samedi pour les skills avec un etat neural plus frais."
  },
  de: {
    coach: "KI-Coach",
    title: "Deine 3D Body Scan-Woche",
    workouts: "Trainings",
    organized: "von der KI organisiert",
    engine: "KI-Engine v2.4",
    active: "Aktiv",
    optimized: "Plan fur deine nachste Woche optimiert.",
    optimizing: "Optimierung",
    reorganize: "Neu ordnen",
    statWorkouts: "Trainings",
    statTime: "Zeit",
    statVolume: "Volumen",
    currentBlock: "Aktueller Block",
    week: "Woche",
    phase: "Phase",
    volume: "Volumen",
    intensity: "Intensitat",
    cycle: "Zyklusrichtung",
    adjustment: "Blockanpassung",
    weekPlan: "Wochenplan",
    sorted: "Von KI sortiert",
    rest: "Aktive Erholung",
    mobility: "Leichte Mobilitat empfohlen",
    why: "Warum diese Reihenfolge?",
    fullLibrary: "Komplette Bibliothek",
    cataloged: "500+ katalogisierte Ubungen",
    reason1: "Push vor Pull, um die vorherige Erholung besser zu nutzen.",
    reason2: "Beine am Donnerstag: du leistest besser mit einem Erholungstag davor.",
    reason3: "Technische Einheit am Samstag fur frischere Skill-Arbeit."
  }
};
function TreinosPage() {
  const locale = getStoredLocale();
  const copy = COPY[locale] ?? COPY.pt;
  const [refreshKey, setRefreshKey] = reactExports.useState(0);
  const [aiState, setAiState] = reactExports.useState("ready");
  const AI_STEPS_LEN = AI_STEPS.pt.length;
  const [stepIdx, setStepIdx] = reactExports.useState(AI_STEPS_LEN - 1);
  const trainingState = useTrainingState(refreshKey);
  const {
    periodization
  } = trainingState;
  const weekDays = getWeekDayLabels(locale);
  const weekPlan = weekDays.map((day, index) => ({
    day,
    workoutId: trainingState.schedule[index]?.workoutId ?? null,
    intensity: trainingState.schedule[index]?.intensity,
    tag: trainingState.schedule[index]?.tag
  }));
  reactExports.useEffect(() => {
    if (trainingState.aiLoading) {
      setAiState("thinking");
      setStepIdx(0);
    } else if (aiState === "thinking") {
      setAiState("ready");
      setStepIdx(AI_STEPS_LEN - 1);
    }
  }, [trainingState.aiLoading]);
  reactExports.useEffect(() => {
    if (aiState !== "thinking") return;
    const id = setInterval(() => {
      setStepIdx((current) => current >= AI_STEPS_LEN - 2 ? current : current + 1);
    }, 900);
    return () => clearInterval(id);
  }, [aiState]);
  const totalWorkouts = weekPlan.filter((day) => day.workoutId).length;
  const totalMinutes = weekPlan.reduce((total, day) => {
    const workout = trainingState.workouts.find((item) => item.id === day.workoutId);
    return total + (workout?.duration ?? 0);
  }, 0);
  const currentPeriodWeek = periodization.weeks[periodization.currentWeek - 1];
  const translatedShortTerm = locale === "es" ? `Semana ${periodization.currentWeek} del bloque de 12 semanas con foco en ${copy.workouts === "entrenamientos" ? "hipertrofia" : "rendimiento"} dentro de la modalidad ${getModalityLabel(periodization.modality, locale).toLowerCase()}.` : locale === "en" ? `Week ${periodization.currentWeek} of the 12-week block focused on progression within the ${getModalityLabel(periodization.modality, locale).toLowerCase()} modality.` : locale === "fr" ? `Semaine ${periodization.currentWeek} du bloc de 12 semaines axée sur la progression dans la modalité ${getModalityLabel(periodization.modality, locale).toLowerCase()}.` : locale === "de" ? `Woche ${periodization.currentWeek} des 12-Wochen-Blocks mit Fokus auf Fortschritt innerhalb der Modalität ${getModalityLabel(periodization.modality, locale).toLowerCase()}.` : periodization.summary.shortTerm;
  const translatedMediumTerm = locale === "es" ? "El trimestre alterna base, progresion, intensificacion y descarga para evitar estancamientos y mantener la recurrencia." : locale === "en" ? "The quarter alternates base, progression, intensification, and deload to avoid plateaus and maintain consistency." : locale === "fr" ? "Le trimestre alterne base, progression, intensification et deload pour eviter les plateaux et maintenir la regularite." : locale === "de" ? "Das Quartal wechselt zwischen Basis, Progression, Intensivierung und Deload, um Plateaus zu vermeiden und die Konstanz zu halten." : periodization.summary.mediumTerm;
  const translatedLongTerm = locale === "es" ? "La jornada anual usa cuatro bloques de 12 semanas para sostener corto, medio y largo plazo con una base profesional." : locale === "en" ? "The annual path uses four 12-week blocks to support short-, mid-, and long-term progress with a professional foundation." : locale === "fr" ? "Le parcours annuel utilise quatre blocs de 12 semaines pour soutenir le court, moyen et long terme avec une base professionnelle." : locale === "de" ? "Der Jahresverlauf nutzt vier 12-Wochen-Blocke, um kurz-, mittel- und langfristigen Fortschritt mit professioneller Grundlage zu sichern." : periodization.summary.longTerm;
  const translatedAdjustment = locale === "es" ? "el split respeta objetivo, modalidad y contexto del atleta." : locale === "en" ? "the split respects the athlete's goal, modality, and context." : locale === "fr" ? "le split respecte l'objectif, la modalite et le contexte de l'athlete." : locale === "de" ? "der Split berucksichtigt Ziel, Modalitat und Kontext des Athleten." : periodization.adjustments.splitBias;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-cyan", children: copy.coach }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold leading-tight text-gradient-brand", children: copy.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
        totalWorkouts,
        " ",
        copy.workouts,
        " | ",
        totalMinutes,
        " min ",
        copy.organized
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { layout: true, className: "relative overflow-hidden rounded-2xl border border-cyan/30 bg-gradient-to-br from-cyan/10 via-surface to-primary/10 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan/20 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan/20 text-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: copy.engine }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-success" }),
              " ",
              copy.active
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
            opacity: 0,
            y: 4
          }, animate: {
            opacity: 1,
            y: 0
          }, exit: {
            opacity: 0,
            y: -4
          }, className: "mt-1 text-xs text-muted-foreground", children: aiState === "thinking" ? (AI_STEPS[locale] ?? AI_STEPS.pt)[stepIdx] : copy.optimized }, aiState + stepIdx) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          setRefreshKey((k) => k + 1);
          trainingState.regenerate();
        }, disabled: aiState === "thinking", className: "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1.5 text-xs font-semibold text-cyan transition hover:bg-cyan/20 disabled:opacity-60", children: [
          aiState === "thinking" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-3.5 w-3.5" }),
          aiState === "thinking" ? copy.optimizing : copy.reorganize
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Calendar, label: copy.statWorkouts, value: `${totalWorkouts}`, accent: "text-cyan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Clock, label: copy.statTime, value: `${totalMinutes}m`, accent: "text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Flame, label: copy.statVolume, value: "+8%", accent: "text-success" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan", children: copy.currentBlock }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-1 font-display text-lg font-semibold", children: [
              copy.week,
              " ",
              periodization.currentWeek,
              " de 12"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary", children: getModalityLabel(periodization.modality, locale) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-cyan/10 px-2 py-1 text-cyan", children: [
            copy.phase,
            ": ",
            getPhaseLabel(currentPeriodWeek?.phase ?? "base", locale)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-success/10 px-2 py-1 text-success", children: [
            copy.volume,
            ": ",
            getVolumeBiasLabel(currentPeriodWeek?.volumeBias ?? "alto", locale)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-primary/10 px-2 py-1 text-primary", children: [
            copy.intensity,
            ": ",
            getIntensityLabel(currentPeriodWeek?.intensityBias ?? "leve", locale)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: translatedShortTerm })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan", children: copy.cycle }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: translatedMediumTerm }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: translatedLongTerm }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            copy.adjustment,
            ": ",
            translatedAdjustment
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between gap-1", children: weekDays.map((day, index) => {
      const plan = weekPlan[index];
      const active = !!plan.workoutId;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-1 flex-col items-center gap-1 rounded-xl border py-2 ${active ? "border-primary/40 bg-primary/10" : "border-border bg-surface"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: day }),
        active ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary shadow-glow-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-border" })
      ] }, day);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold", children: copy.weekPlan }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: copy.sorted })
      ] }),
      weekPlan.map((plan, index) => {
        const workout = trainingState.workouts.find((item) => item.id === plan.workoutId);
        if (!workout) {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-dashed border-border bg-surface/40 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-lg bg-elevated text-[11px] font-bold text-muted-foreground", children: plan.day }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: copy.rest }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: copy.mobility })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-muted-foreground" })
          ] }, index);
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0,
          y: 6
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          delay: index * 0.04
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/treino/$id", params: {
          id: workout.id
        }, className: "group flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition active:scale-[0.99] hover:border-primary/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-cyan/20 text-xs font-bold text-foreground", children: plan.day }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm font-semibold", children: translateWorkoutName(workout.name, locale) }),
              plan.tag ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-cyan/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan", children: plan.tag }) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: formatDisplayValue(workout.focus) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-2 text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                " ",
                workout.duration,
                "m"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3 w-3" }),
                " ",
                workout.exercises.length,
                " ex"
              ] }),
              plan.intensity ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "|" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(IntensityPill, { level: plan.intensity, locale })
              ] }) : null
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow-primary transition group-hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }) })
        ] }) }, index);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-cyan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: copy.why }),
        trainingState.aiLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
          (AI_STEPS[locale] ?? AI_STEPS.pt)[0]
        ] }),
        trainingState.aiReady && !trainingState.aiLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-success", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-success" }),
          locale === "en" ? "AI" : "IA"
        ] })
      ] }),
      trainingState.aiWeekFocus && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-xs font-medium italic text-primary/80", children: trainingState.aiWeekFocus }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-xs text-muted-foreground", children: (trainingState.aiReady && trainingState.aiReasons.length >= 3 ? trainingState.aiReasons : [copy.reason1, copy.reason2, copy.reason3]).map((reason, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
        i === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" }) : i === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-success" }),
        reason
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/exercicios", className: "flex items-center justify-between rounded-2xl border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-lg bg-elevated text-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: copy.fullLibrary }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: copy.cataloged })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
    ] })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-surface p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-3.5 w-3.5 ${accent}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-lg font-bold leading-none", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] uppercase tracking-wider text-muted-foreground", children: label })
  ] });
}
const INTENSITY_LABELS = {
  pt: {
    Leve: "Leve",
    Moderado: "Moderado",
    Pesado: "Pesado"
  },
  es: {
    Leve: "Leve",
    Moderado: "Moderado",
    Pesado: "Pesado"
  },
  en: {
    Leve: "Light",
    Moderado: "Moderate",
    Pesado: "Heavy"
  },
  fr: {
    Leve: "Léger",
    Moderado: "Modéré",
    Pesado: "Intense"
  },
  de: {
    Leve: "Leicht",
    Moderado: "Moderat",
    Pesado: "Schwer"
  }
};
function IntensityPill({
  level,
  locale
}) {
  const map = {
    Leve: "text-success",
    Moderado: "text-cyan",
    Pesado: "text-primary"
  };
  const dots = level === "Leve" ? 1 : level === "Moderado" ? 2 : 3;
  const label = (INTENSITY_LABELS[locale] ?? INTENSITY_LABELS.pt)[level] ?? level;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-0.5 ${map[level]}`, children: [
    Array.from({
      length: 3
    }).map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1 w-1 rounded-full ${index < dots ? "bg-current" : "bg-border"}` }, index)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 font-semibold", children: label })
  ] });
}
export {
  TreinosPage as component
};