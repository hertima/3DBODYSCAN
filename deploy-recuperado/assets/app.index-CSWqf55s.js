import { W as jsxRuntimeExports, r as reactExports } from "./server-C0e4gypg.js";
import { r as resolveTrainingSplit, e as getSplitLabel, g as getStoredLocale, l as loadOnboarding, f as getReadinessLevelLabel, L as Link, m as motion, t as translateWorkoutName } from "./router-BDD3RgVy.js";
import { l as loadMealPlan } from "./meal-plan-Lo4dABFY.js";
import { A as AIInsightCard } from "./AIInsightCard-CiRV3C7C.js";
import { c as cn } from "./utils-Bz4m9VPB.js";
import { u as useAIInsights } from "./use-ai-insights-FeTbJp09.js";
import { u as useGamification } from "./use-gamification-CyAvBw87.js";
import { u as useTrainingState } from "./use-training-state-DNcnklus.js";
import { b as getDashboardCopy, c as getNutritionCopy, d as getGamificationCopy } from "./app-copy-wxZoQ7QO.js";
import { A as Activity } from "./activity-BvoCTLhw.js";
import { F as Flame } from "./flame-B4I7h4kj.js";
import { T as Trophy } from "./trophy-D4ROBLa0.js";
import { Z as Zap } from "./zap-DR4zCOeL.js";
import { U as Utensils } from "./utensils-DEbQ0tBJ.js";
import { A as ArrowRight } from "./arrow-right-B87Ma675.js";
import { P as Play } from "./play-DI3yn4ti.js";
import { R as ResponsiveContainer, A as AreaChart, a as Area } from "./AreaChart-C6qdhETv.js";
import { T as Tooltip } from "./generateCategoricalChart-BuWpYmVk.js";
import { B as Brain } from "./brain-80Gcp3VO.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
import "./workout-history-D2efW0ov.js";
import "./firebase-CeVmTMBf.js";
function SkeletonCard({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("animate-pulse rounded-2xl bg-elevated", className) });
}
function SkeletonText({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("animate-pulse rounded-lg bg-elevated", className) });
}
function SkeletonStatCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonText, { className: "h-3 w-16" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonText, { className: "h-7 w-12" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonText, { className: "h-3 w-20" })
  ] });
}
function SkeletonWorkoutCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-5 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonText, { className: "h-3 w-24" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonText, { className: "h-6 w-40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonText, { className: "h-4 w-48" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, { className: "h-6 w-16 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, { className: "h-6 w-14 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, { className: "h-6 w-20 rounded-full" })
    ] })
  ] });
}
function Dashboard() {
  const [loaded, setLoaded] = reactExports.useState(false);
  const [userName, setUserName] = reactExports.useState("atleta");
  const trainingState = useTrainingState();
  const today = trainingState.workouts[0];
  const split = resolveTrainingSplit(trainingState.profile);
  const splitLabel = getSplitLabel(split);
  const locale = getStoredLocale();
  const dashboardCopy = getDashboardCopy();
  const nutritionCopy = getNutritionCopy(locale);
  const gamCopy = getGamificationCopy(locale);
  const dateLocale = locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : locale === "de" ? "de-DE" : locale === "fr" ? "fr-FR" : "en-US";
  const aiRecommendations = useAIInsights(trainingState);
  const {
    gamification,
    dopamineLoop
  } = useGamification(trainingState);
  reactExports.useEffect(() => {
    const profile = loadOnboarding();
    const name = profile.name?.split(" ")[0]?.trim() || "atleta";
    setUserName(name);
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);
  const dailyMission = gamification.missions.diaria[0];
  const currentPeriodWeek = trainingState.periodization.weeks[trainingState.periodization.currentWeek - 1];
  const plannedDays = trainingState.schedule.filter((item) => item.workoutId).length;
  const totalSets = trainingState.workouts.reduce((total, workout) => total + workout.exercises.reduce((exerciseTotal, exercise) => exerciseTotal + exercise.sets.length, 0), 0);
  const totalExercises = trainingState.workouts.reduce((total, workout) => total + workout.exercises.length, 0);
  trainingState.workouts.length > 0 ? Math.round(trainingState.workouts.reduce((total, workout) => total + workout.duration, 0) / trainingState.workouts.length) : 0;
  const mealPlan = loadMealPlan();
  const planLocaleMismatch = mealPlan !== null && (mealPlan.locale === void 0 ? locale !== "pt" : mealPlan.locale !== locale);
  const readinessScore = Math.round((gamification.hydrationCompletionRate + gamification.nutritionCompletionRate + trainingState.body.confidenceScore) / 3);
  const dc = dashboardCopy;
  const weeklyPlanLabel = plannedDays === 1 ? `1 ${dc.sessionPlanned}` : `${plannedDays} ${dc.sessionsPlanned}`;
  const weekTrend = nutritionCopy.days.map((day, dayIndex) => {
    const planned = trainingState.schedule.find((entry) => entry.dayIndex === dayIndex)?.workoutId;
    const workout = trainingState.workouts.find((entry) => entry.id === planned);
    return {
      day,
      value: workout ? workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0) : 0
    };
  });
  const stats = [{
    label: dc.statSeries,
    value: String(totalSets),
    delta: `${totalExercises} ${dc.exercisesLabel}`,
    icon: Activity,
    color: "text-cyan"
  }, {
    label: dc.statFrequency,
    value: `${plannedDays}/${Math.max(plannedDays, 1)}`,
    delta: `${plannedDays} ${dc.statDays}`,
    icon: Flame,
    color: "text-primary"
  }, {
    label: dc.statWorkouts,
    value: String(trainingState.workouts.length),
    delta: `${gamification.achievements.filter((item) => item.unlocked).length} ${dc.statAchievements}`,
    icon: Trophy,
    color: "text-success"
  }, {
    label: dc.statReadiness,
    value: `${readinessScore}%`,
    delta: getReadinessLevelLabel(trainingState.nutrition.readinessLevel, locale),
    icon: Zap,
    color: "text-cyan"
  }];
  if (!loaded) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-24 animate-pulse rounded-lg bg-elevated" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-48 animate-pulse rounded-lg bg-elevated" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonWorkoutCard, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: Array.from({
        length: 4
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonStatCard, {}, i)) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          dc.greeting,
          " ",
          userName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-gradient-brand", children: dc.headline })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/mascote.png", alt: "Mascote 3D Body Scan", className: "h-32 w-32 object-contain", style: {
        filter: "drop-shadow(0 0 20px rgba(34,211,238,0.5)) drop-shadow(0 0 10px rgba(251,146,60,0.4))"
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/nutricao", className: `relative overflow-hidden flex items-center justify-between rounded-2xl border p-4 ${planLocaleMismatch ? "border-amber-400/30 bg-amber-400/5" : "border-cyan/20 bg-cyan/5"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${planLocaleMismatch ? "bg-amber-400/10" : "bg-cyan/10"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-2xl", style: planLocaleMismatch ? {
          background: "linear-gradient(135deg,rgba(251,191,36,0.2),rgba(245,158,11,0.2))",
          border: "1px solid rgba(251,191,36,0.25)"
        } : {
          background: "linear-gradient(135deg,rgba(34,211,238,0.2),rgba(59,130,246,0.2))",
          border: "1px solid rgba(34,211,238,0.25)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Utensils, { className: `h-5 w-5 ${planLocaleMismatch ? "text-amber-400" : "text-cyan"}` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: nutritionCopy.emptyTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xs ${planLocaleMismatch ? "text-amber-400" : "text-muted-foreground"}`, children: planLocaleMismatch ? nutritionCopy.localeMismatch : mealPlan ? `${nutritionCopy.twelveWeeks} · ${new Date(mealPlan.generatedAt).toLocaleDateString(dateLocale)}` : nutritionCopy.cardDesc })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: `h-4 w-4 shrink-0 ${planLocaleMismatch ? "text-amber-400" : "text-cyan"}` })
    ] }),
    today ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 10
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "relative overflow-hidden rounded-3xl border border-border bg-gradient-surface p-5 shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-primary", children: dashboardCopy.todayWorkout }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "urgency-pulse rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest", style: {
          background: "rgba(251,146,60,0.15)",
          color: "#fb923c",
          border: "1px solid rgba(251,146,60,0.3)"
        }, children: "Hoje" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-display text-2xl font-bold", children: translateWorkoutName(today.name, locale) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        today.focus,
        " | ",
        today.duration,
        " min | ",
        today.exercises.length,
        " ",
        dc.exercisesLabel
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-cyan/10 px-2 py-1 text-cyan", children: [
          dc.weekLabel,
          " ",
          trainingState.periodization.currentWeek,
          "/12"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/10 px-2 py-1 text-primary", children: gamCopy.phases[currentPeriodWeek?.phase ?? "base"] ?? currentPeriodWeek?.phase ?? "base" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-success/10 px-2 py-1 text-success", children: gamCopy.modalities[trainingState.periodization.modality] ?? trainingState.periodization.modality })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex -space-x-2", children: today.exercises.slice(0, 4).map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-elevated text-[10px] font-bold text-cyan", children: index + 1 }, index)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/treino/$id", params: {
          id: today.id
        }, className: "inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }),
          " ",
          dc.startBtn
        ] })
      ] })
    ] }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: stats.map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-interactive rounded-2xl border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: `h-4 w-4 ${stat.color}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: stat.delta })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 font-display text-2xl font-bold", children: stat.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: stat.label })
    ] }, stat.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-interactive rounded-2xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: dc.levelLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 font-display text-3xl font-bold text-gradient-ai", children: [
          "Lv ",
          gamification.level
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
          gamification.xp,
          " ",
          dc.xpLabel
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-interactive rounded-2xl border bg-surface p-4", style: {
        borderColor: gamification.streakDays > 0 ? "rgba(251,146,60,0.25)" : "rgba(255,255,255,0.08)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: dc.streakLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-baseline gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-display text-3xl font-bold text-primary${gamification.streakDays > 2 ? " streak-glow" : ""}`, children: gamification.streakDays }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-primary", children: dc.streakDays }),
          gamification.streakDays > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/mascote.png", alt: "", className: "h-16 w-16 object-contain", style: {
            filter: "drop-shadow(0 0 14px rgba(251,146,60,0.7))"
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: gamification.streakDays === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "urgency-pulse font-medium", style: {
          color: "rgba(251,146,60,0.9)"
        }, children: "Inicie sua sequência hoje" }) : dc.streakDesc })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-interactive rounded-2xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: dc.dailyMission }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-bold text-gradient-ai", children: [
            Math.min(100, Math.round(dailyMission.progress / dailyMission.target * 100)),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm font-semibold", children: dailyMission.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: dailyMission.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-1.5 w-full overflow-hidden rounded-full bg-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-gradient-ai transition-all duration-700", style: {
          width: `${Math.min(100, Math.round(dailyMission.progress / dailyMission.target * 100))}%`
        } }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AIInsightCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: dopamineLoop.headline }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-muted-foreground", children: dopamineLoop.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan", children: dopamineLoop.momentumLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: dopamineLoop.nextUnlock })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: dc.weekRhythm }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-xl font-bold", children: [
            totalSets,
            " ",
            dc.setsPlanned
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/analytics", className: "text-xs font-semibold text-cyan", children: dc.viewAll })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-28", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: weekTrend, margin: {
        top: 5,
        right: 0,
        bottom: 0,
        left: 0
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "vg", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "var(--primary)", stopOpacity: 0.5 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "var(--primary)", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          color: "var(--foreground)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "value", stroke: "var(--primary)", strokeWidth: 2, fill: "url(#vg)" })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-4 w-4 text-cyan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: dc.aiTitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: aiRecommendations.items.map((recommendation) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AIInsightCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: recommendation.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-muted-foreground", children: recommendation.message })
      ] }, recommendation.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/treinos", className: "card-interactive flex items-center justify-between rounded-2xl border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-cyan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: dashboardCopy.weeklyTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            weeklyPlanLabel,
            " | ",
            splitLabel
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground" })
    ] })
  ] });
}
export {
  Dashboard as component
};