import { W as jsxRuntimeExports, r as reactExports } from "./server-C0e4gypg.js";
import { c as createLucideIcon, Q as Route, u as useNavigate, T as getGeneratedWorkout, U as getWorkoutCustomization, g as getStoredLocale, V as validateWorkoutCustomization, W as toast, t as translateWorkoutName, Y as getExercise, p as cleanLegacyText, P as Plus, L as Link, A as AnimatePresence, m as motion, X, B as getWorkoutTypeLabel, Z as clearWorkoutCustomization, _ as saveWorkoutCustomization, w as isFunctionalExerciseRecord, y as normalizeText } from "./router-BDD3RgVy.js";
import { u as useCurrentFrame, a as useVideoConfig, i as interpolate, s as spring, A as AbsoluteFill, S as Sequence, E as Easing, P as Player } from "./index-CcuZFuTS.js";
import { s as saveWorkoutToHistory } from "./workout-history-D2efW0ov.js";
import { A as AIInsightCard } from "./AIInsightCard-CiRV3C7C.js";
import { E as ExerciseMedia, g as getExerciseName, a as getExerciseBiomechanics, b as getMuscleGroupLabel } from "./exercise-i18n-3xmGI5hM.js";
import { u as useAIInsights } from "./use-ai-insights-FeTbJp09.js";
import { u as useExerciseCatalog, V as VideoPreviewCard } from "./use-exercise-catalog-DyPEApy6.js";
import { u as useTrainingState } from "./use-training-state-DNcnklus.js";
import { d as getGamificationCopy } from "./app-copy-wxZoQ7QO.js";
import { G as GradientBackground } from "./VideoPlayerModal-BQaBY8IB.js";
import { A as AnimatedCounter } from "./AnimatedCounter-D13SVpt3.js";
import { A as AnimatedBar } from "./AnimatedBar-OjSZ2IxW.js";
import { S as ShareVideoButton } from "./ShareVideoButton-DuyJVam8.js";
import { c as cn } from "./utils-Bz4m9VPB.js";
import { A as ArrowLeft } from "./arrow-left-D6mNKGvq.js";
import { F as Flame } from "./flame-B4I7h4kj.js";
import { P as Play } from "./play-DI3yn4ti.js";
import { T as Target } from "./target-DclDxru3.js";
import { Z as Zap } from "./zap-DR4zCOeL.js";
import { R as RefreshCcw } from "./refresh-ccw-BNfJy4G4.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
import { C as Check } from "./check-j8hLnasa.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
import "./activity-BvoCTLhw.js";
import "./dumbbell-DL1Diyp6.js";
import "./firebase-CeVmTMBf.js";
const __iconNode$4 = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
const ArrowDown = createLucideIcon("arrow-down", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
];
const ArrowUp = createLucideIcon("arrow-up", __iconNode$3);
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6h4", key: "135r8i" }]
];
const Clock3 = createLucideIcon("clock-3", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M10 2h4", key: "n1abiw" }],
  ["path", { d: "M12 14v-4", key: "1evpnu" }],
  ["path", { d: "M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6", key: "1ts96g" }],
  ["path", { d: "M9 17H4v5", key: "8t5av" }]
];
const TimerReset = createLucideIcon("timer-reset", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
const copy = {
  pt: { completed: "Treino Concluído", week: "Semana", volumeLabel: "Volume total levantado", duration: "Duração", sets: "Séries", calories: "Calorias", exercises: "Exercícios", series: "séries", bodyweight: "corporal" },
  es: { completed: "Entreno Completado", week: "Semana", volumeLabel: "Volumen total levantado", duration: "Duración", sets: "Series", calories: "Calorías", exercises: "Ejercicios", series: "series", bodyweight: "corporal" },
  en: { completed: "Workout Complete", week: "Week", volumeLabel: "Total volume lifted", duration: "Duration", sets: "Sets", calories: "Calories", exercises: "Exercises", series: "sets", bodyweight: "bodyweight" },
  fr: { completed: "Entraînement Terminé", week: "Semaine", volumeLabel: "Volume total soulevé", duration: "Durée", sets: "Séries", calories: "Calories", exercises: "Exercices", series: "séries", bodyweight: "poids du corps" },
  de: { completed: "Training Abgeschlossen", week: "Woche", volumeLabel: "Gesamtvolumen gehoben", duration: "Dauer", sets: "Sätze", calories: "Kalorien", exercises: "Übungen", series: "Sätze", bodyweight: "Körpergewicht" }
};
function WorkoutCompleteVideo({
  name = "Atleta",
  workoutName = "Push A",
  duration = 62,
  totalSets = 24,
  totalVolume = 4200,
  calories = 380,
  exercises = [],
  weekNumber = 1,
  locale = "pt"
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = copy[locale] ?? copy.pt;
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [8, 28], [0, 1], { extrapolateRight: "clamp" });
  const mascotScale = spring({ frame: frame - 15, fps, config: { damping: 13, stiffness: 90 } });
  const badgeScale = spring({ frame: frame - 35, fps, config: { damping: 14, stiffness: 130 } });
  const metricsOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: "clamp" });
  const exOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });
  const footerOpacity = interpolate(frame, [75, 95], [0, 1], { extrapolateRight: "clamp" });
  const displayExercises = exercises.slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AbsoluteFill, { style: { fontFamily: "sans-serif", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GradientBackground, { variant: "workout" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: -60, left: -60, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(251,146,60,0.12) 0%,transparent 70%)", filter: "blur(40px)" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: 100, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(34,211,238,0.10) 0%,transparent 70%)", filter: "blur(40px)" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      top: 70,
      left: 0,
      right: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      opacity: headerOpacity
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo favicton 3D Body Scan.png", style: { width: 52, height: 52, borderRadius: 14, boxShadow: "0 0 24px rgba(34,211,238,0.6)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 900, fontSize: 24, letterSpacing: -0.5, background: "linear-gradient(90deg,#22d3ee,#fff,#fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }, children: "3D Body Scan" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      top: 190,
      left: 48,
      right: 48,
      textAlign: "center",
      opacity: titleOpacity
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 16, color: "rgba(148,163,184,0.65)", letterSpacing: 5, textTransform: "uppercase", marginBottom: 10 }, children: t.completed }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40, fontWeight: 900, lineHeight: 1.15, letterSpacing: -0.5, background: "linear-gradient(90deg,#fb923c,#fff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }, children: workoutName }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 17, color: "rgba(148,163,184,0.5)", marginTop: 10 }, children: [
        name,
        " · ",
        t.week,
        " ",
        weekNumber
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      top: 420,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      transform: `scale(${mascotScale})`,
      filter: "drop-shadow(0 0 70px rgba(34,211,238,0.5)) drop-shadow(0 0 35px rgba(251,146,60,0.4))"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/superhero character.png", style: { width: 440, height: 440, objectFit: "contain" } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 880, left: 48, right: 48, display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      transform: `scale(${badgeScale})`,
      background: "rgba(251,146,60,0.1)",
      border: "2px solid rgba(251,146,60,0.35)",
      borderRadius: 28,
      padding: "22px 48px",
      textAlign: "center",
      width: "100%",
      boxShadow: "0 0 40px rgba(251,146,60,0.12)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: "rgba(251,146,60,0.8)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 4 }, children: t.volumeLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCounter, { from: 0, to: totalVolume / 1e3, startFrame: 30, endFrame: 65, decimals: 2, suffix: " t", style: { fontSize: 68, fontWeight: 900, color: "#fb923c", display: "block", lineHeight: 1 } })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 45, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 1080, left: 48, right: 48, display: "flex", gap: 18, opacity: metricsOpacity }, children: [
      { label: t.duration, value: `${duration}min`, color: "#22d3ee" },
      { label: t.sets, value: String(totalSets), color: "#a78bfa" },
      { label: t.calories, value: `${calories}kcal`, color: "#4ade80" }
    ].map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, background: "rgba(255,255,255,0.05)", border: `1.5px solid ${m.color}40`, borderRadius: 22, padding: "20px 10px", textAlign: "center", boxShadow: `0 0 20px ${m.color}18` }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(148,163,184,0.5)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }, children: m.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 28, fontWeight: 900, color: m.color }, children: m.value })
    ] }, i)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 60, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 1280, left: 48, right: 48, opacity: exOpacity }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(148,163,184,0.4)", letterSpacing: 3.5, textTransform: "uppercase", marginBottom: 20 }, children: t.exercises }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 20 }, children: displayExercises.map((ex, i) => {
        const barPct = totalVolume > 0 ? ex.volume / totalVolume * 100 : 60;
        const entryOpacity = interpolate(frame, [60 + i * 8, 78 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { opacity: entryOpacity }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16, fontWeight: 700, color: "#e2e8f0" }, children: ex.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 13, color: "rgba(148,163,184,0.5)" }, children: [
              ex.sets,
              " ",
              t.series,
              ex.volume > 0 ? ` · ${ex.volume} kg` : ` · ${t.bodyweight}`
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedBar, { pct: barPct, startFrame: 60 + i * 8, color: "#fb923c", height: 6 })
        ] }, i);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 70, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: footerOpacity }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 200, height: 1, background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.4),transparent)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo favicton 3D Body Scan.png", style: { width: 40, height: 40, borderRadius: 11, boxShadow: "0 0 16px rgba(34,211,238,0.5)" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 900, fontSize: 20, letterSpacing: -0.5, background: "linear-gradient(90deg,#22d3ee,#fff,#fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }, children: "3D Body Scan" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(148,163,184,0.3)", letterSpacing: 2 }, children: "zyrox.app" })
    ] })
  ] });
}
function StatItem({ label, value, unit, delay, frame, fps }) {
  const opacity = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(frame, [delay, delay + 18], [-24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic)
  });
  const s = spring({ fps, frame, from: 0.85, to: 1, durationInFrames: 20, delay, config: { damping: 12 } });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { opacity, transform: `translateX(${x}px) scale(${s})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 36, fontWeight: 900, color: "oklch(0.98 0.01 250)", lineHeight: 1 }, children: [
      value,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16, fontWeight: 600, color: "oklch(0.74 0.17 53)", marginLeft: 3 }, children: unit })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", color: "oklch(0.65 0.04 262)", textTransform: "uppercase" }, children: label })
  ] });
}
function WorkoutSummaryComposition({ exerciseCount = 8, durationMinutes = 45, calories = 380, workoutName = "Treino A" }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const iconScale = spring({ fps, frame, from: 0, to: 1, durationInFrames: 35, delay: 10, config: { damping: 10, stiffness: 100 } });
  const iconOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [38, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [38, 56], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const subtitleOpacity = interpolate(frame, [48, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dividerScale = interpolate(frame, [65, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) });
  const ctaOpacity = interpolate(frame, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [110, 130], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const fadeOut = interpolate(frame, [155, 178], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        background: "oklch(0.14 0.03 260)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        opacity: bgOpacity * fadeOut,
        fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "0 32px"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, oklch(0.74 0.17 53 / 0.2) 0%, transparent 70%)",
          filter: "blur(48px)",
          top: "20%"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          inset: 0,
          opacity: 0.035,
          backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          transform: `scale(${iconScale})`,
          opacity: iconOpacity,
          marginBottom: 12,
          filter: "drop-shadow(0 0 32px rgba(34,211,238,0.5)) drop-shadow(0 0 16px rgba(251,146,60,0.4))"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/superhero character.png",
            style: { width: 140, height: 140, objectFit: "contain" }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { opacity: titleOpacity, transform: `translateY(${titleY}px)`, marginBottom: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 28, fontWeight: 900, color: "oklch(0.98 0.01 250)", textAlign: "center", letterSpacing: "0.05em" }, children: "TREINO COMPLETO" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { opacity: subtitleOpacity, marginBottom: 28 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 500, color: "oklch(0.74 0.17 53)", letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center" }, children: workoutName }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          width: `${dividerScale * 60}%`,
          height: 1,
          background: "linear-gradient(to right, transparent, oklch(0.74 0.17 53 / 0.5), transparent)",
          marginBottom: 28
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 36, alignItems: "flex-start", marginBottom: 36 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Exercícios", value: exerciseCount, unit: "", delay: 82, frame, fps }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, height: 50, background: "oklch(0.30 0.04 262)", alignSelf: "center" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Minutos", value: durationMinutes, unit: "min", delay: 94, frame, fps }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, height: 50, background: "oklch(0.30 0.04 262)", alignSelf: "center" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Calorias", value: calories, unit: "kcal", delay: 106, frame, fps })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          padding: "12px 28px",
          borderRadius: 12,
          background: "oklch(0.74 0.17 53)",
          fontSize: 13,
          fontWeight: 700,
          color: "oklch(0.14 0.03 260)",
          letterSpacing: "0.1em",
          textTransform: "uppercase"
        }, children: "Ver Histórico" })
      ]
    }
  );
}
function WorkoutCompleteAnimation({ exerciseCount, durationMinutes, calories, workoutName, onFinish }) {
  const playerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const handler = () => onFinish?.();
    player.addEventListener("ended", handler);
    return () => player.removeEventListener("ended", handler);
  }, [onFinish]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center",
      style: { background: "oklch(0.14 0.03 260 / 0.96)", backdropFilter: "blur(12px)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 360, height: 560, borderRadius: 28, overflow: "hidden", boxShadow: "0 0 80px oklch(0.74 0.17 53 / 0.2)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Player,
        {
          ref: playerRef,
          component: WorkoutSummaryComposition,
          durationInFrames: 180,
          compositionWidth: 360,
          compositionHeight: 560,
          fps: 30,
          loop: false,
          controls: false,
          style: { width: "100%", height: "100%" },
          inputProps: { exerciseCount, durationMinutes, calories, workoutName },
          autoPlay: true
        }
      ) })
    }
  );
}
const WCOPY = {
  pt: {
    shareWorkout: "Compartilhar treino",
    notFound: "Treino não encontrado",
    notFoundDesc: "O treino solicitado não existe na biblioteca atual.",
    highlight: "Treino em destaque",
    weekLabel: "Semana",
    started: "Treino iniciado",
    startBtn: "Iniciar treino",
    duration: "Duração",
    exercises: "Exercícios",
    avgRest: "Descanso médio",
    totalVolume: "Volume total",
    blockRead: "Leitura do bloco",
    weekCycle: "do ciclo atual",
    strategicAdj: "Ajuste estratégico",
    proDir: "Direção profissional",
    quickSummary: "Resumo rápido",
    sessionMetrics: "Métricas da sessão",
    planned: "Planejado",
    sets: "Séries",
    reps: "Repetições",
    type: "Tipo",
    customTitle: "Customização do treino",
    customDesc: "Ajuste sem perder a coerência",
    customNote: "Troque, remova, adicione ou reordene exercícios mantendo o treino alinhado com categoria e ambiente.",
    addExercise: "Adicionar exercício",
    restoreWorkout: "Restaurar treino",
    validCustom: "Customização válida",
    reviewRec: "Revisão recomendada",
    blocksTitle: "Blocos do treino",
    blocksDesc: "Ordem pronta para executar sem sair da tela",
    exerciseLabel: "Exercício",
    viewExercise: "Ver exercício",
    swap: "Substituir",
    moveUp: "Subir",
    moveDown: "Descer",
    swapRemove: "Trocar / Remover",
    restLabel: "Descanso",
    bodyweight: "Peso corporal",
    volumeLabel: "Volume",
    weightTBD: "Peso a definir",
    progress: "Progresso:",
    setLabel: "Série",
    restTimer: "Descanso",
    skipRest: "Descanso pulado.",
    endWorkout: "Encerrar Treino",
    seriesUnit: "séries",
    setDone: "concluída!",
    workoutStarted: "Treino iniciado! Boa sorte 💪",
    restDone: "Descanse terminado! Próxima série.",
    setWeightTitle: "Definir carga",
    setWeightDesc: "Informe o peso que usará em todas as séries",
    weightPlaceholder: "Ex: 20",
    saveWeight: "Salvar",
    weightSet: "Carga definida:",
    estimatedVol: "Volume estimado:",
    perSet: "kg/série",
    swapTitle: "Trocar exercício",
    removeBtn: "Remover",
    noAlternatives: "Nenhuma substituição compatível encontrada para este ambiente e equipamento.",
    restored: "Treino restaurado para a versão original.",
    customized: "Treino personalizado com sucesso.",
    customFailed: "Não foi possível aplicar a customização.",
    noCompatible: "Nenhum exercício compatível encontrado para adicionar.",
    noSwap: "Nenhuma substituição compatível encontrada."
  },
  es: {
    shareWorkout: "Compartir entrenamiento",
    notFound: "Entrenamiento no encontrado",
    notFoundDesc: "El entrenamiento solicitado no existe en la biblioteca actual.",
    highlight: "Entrenamiento destacado",
    weekLabel: "Semana",
    started: "Entrenamiento iniciado",
    startBtn: "Iniciar entrenamiento",
    duration: "Duración",
    exercises: "Ejercicios",
    avgRest: "Descanso promedio",
    totalVolume: "Volumen total",
    blockRead: "Lectura del bloque",
    weekCycle: "del ciclo actual",
    strategicAdj: "Ajuste estratégico",
    proDir: "Dirección profesional",
    quickSummary: "Resumen rápido",
    sessionMetrics: "Métricas de sesión",
    planned: "Planificado",
    sets: "Series",
    reps: "Repeticiones",
    type: "Tipo",
    customTitle: "Personalización del entrenamiento",
    customDesc: "Ajusta sin perder coherencia",
    customNote: "Intercambia, elimina, agrega o reordena ejercicios manteniendo el entrenamiento alineado con categoría y entorno.",
    addExercise: "Agregar ejercicio",
    restoreWorkout: "Restaurar entrenamiento",
    validCustom: "Personalización válida",
    reviewRec: "Revisión recomendada",
    blocksTitle: "Bloques del entrenamiento",
    blocksDesc: "Orden listo para ejecutar sin salir de la pantalla",
    exerciseLabel: "Ejercicio",
    viewExercise: "Ver ejercicio",
    swap: "Sustituir",
    moveUp: "Subir",
    moveDown: "Bajar",
    swapRemove: "Cambiar / Eliminar",
    restLabel: "Descanso",
    bodyweight: "Peso corporal",
    volumeLabel: "Volumen",
    weightTBD: "Peso a definir",
    progress: "Progreso:",
    setLabel: "Serie",
    restTimer: "Descanso",
    skipRest: "Descanso omitido.",
    endWorkout: "Terminar entrenamiento",
    seriesUnit: "series",
    setDone: "completada!",
    workoutStarted: "¡Entrenamiento iniciado! Mucha suerte 💪",
    restDone: "¡Descanso terminado! Siguiente serie.",
    setWeightTitle: "Definir carga",
    setWeightDesc: "Indica el peso que usarás en todas las series",
    weightPlaceholder: "Ej: 20",
    saveWeight: "Guardar",
    weightSet: "Carga definida:",
    estimatedVol: "Volumen estimado:",
    perSet: "kg/serie",
    swapTitle: "Cambiar ejercicio",
    removeBtn: "Eliminar",
    noAlternatives: "No se encontró sustitución compatible para este entorno y equipamiento.",
    restored: "Entrenamiento restaurado a la versión original.",
    customized: "Entrenamiento personalizado con éxito.",
    customFailed: "No se pudo aplicar la personalización.",
    noCompatible: "No se encontró ejercicio compatible para agregar.",
    noSwap: "No se encontró sustitución compatible."
  },
  en: {
    shareWorkout: "Share workout",
    notFound: "Workout not found",
    notFoundDesc: "The requested workout does not exist in the current library.",
    highlight: "Featured workout",
    weekLabel: "Week",
    started: "Workout started",
    startBtn: "Start workout",
    duration: "Duration",
    exercises: "Exercises",
    avgRest: "Avg rest",
    totalVolume: "Total volume",
    blockRead: "Block overview",
    weekCycle: "of current cycle",
    strategicAdj: "Strategic adjustment",
    proDir: "Professional direction",
    quickSummary: "Quick summary",
    sessionMetrics: "Session metrics",
    planned: "Planned",
    sets: "Sets",
    reps: "Reps",
    type: "Type",
    customTitle: "Workout customization",
    customDesc: "Adjust without losing coherence",
    customNote: "Swap, remove, add or reorder exercises keeping the workout aligned with category and environment.",
    addExercise: "Add exercise",
    restoreWorkout: "Restore workout",
    validCustom: "Valid customization",
    reviewRec: "Review recommended",
    blocksTitle: "Workout blocks",
    blocksDesc: "Order ready to execute without leaving the screen",
    exerciseLabel: "Exercise",
    viewExercise: "View exercise",
    swap: "Swap",
    moveUp: "Move up",
    moveDown: "Move down",
    swapRemove: "Swap / Remove",
    restLabel: "Rest",
    bodyweight: "Bodyweight",
    volumeLabel: "Volume",
    weightTBD: "Weight TBD",
    progress: "Progress:",
    setLabel: "Set",
    restTimer: "Rest",
    skipRest: "Rest skipped.",
    endWorkout: "End Workout",
    seriesUnit: "sets",
    setDone: "done!",
    workoutStarted: "Workout started! Good luck 💪",
    restDone: "Rest done! Next set.",
    setWeightTitle: "Set load",
    setWeightDesc: "Enter the weight you will use for all sets",
    weightPlaceholder: "E.g. 20",
    saveWeight: "Save",
    weightSet: "Load set:",
    estimatedVol: "Estimated volume:",
    perSet: "kg/set",
    swapTitle: "Swap exercise",
    removeBtn: "Remove",
    noAlternatives: "No compatible substitution found for this environment and equipment.",
    restored: "Workout restored to original version.",
    customized: "Workout customized successfully.",
    customFailed: "Could not apply customization.",
    noCompatible: "No compatible exercise found to add.",
    noSwap: "No compatible substitution found."
  },
  fr: {
    shareWorkout: "Partager l'entraînement",
    notFound: "Entraînement introuvable",
    notFoundDesc: "L'entraînement demandé n'existe pas dans la bibliothèque actuelle.",
    highlight: "Entraînement en vedette",
    weekLabel: "Semaine",
    started: "Entraînement démarré",
    startBtn: "Démarrer l'entraînement",
    duration: "Durée",
    exercises: "Exercices",
    avgRest: "Repos moyen",
    totalVolume: "Volume total",
    blockRead: "Lecture du bloc",
    weekCycle: "du cycle actuel",
    strategicAdj: "Ajustement stratégique",
    proDir: "Direction professionnelle",
    quickSummary: "Résumé rapide",
    sessionMetrics: "Métriques de séance",
    planned: "Planifié",
    sets: "Séries",
    reps: "Répétitions",
    type: "Type",
    customTitle: "Personnalisation de l'entraînement",
    customDesc: "Ajustez sans perdre la cohérence",
    customNote: "Échangez, supprimez, ajoutez ou réordonnez des exercices en gardant l'entraînement aligné avec la catégorie et l'environnement.",
    addExercise: "Ajouter un exercice",
    restoreWorkout: "Restaurer l'entraînement",
    validCustom: "Personnalisation valide",
    reviewRec: "Révision recommandée",
    blocksTitle: "Blocs d'entraînement",
    blocksDesc: "Ordre prêt à exécuter sans quitter l'écran",
    exerciseLabel: "Exercice",
    viewExercise: "Voir l'exercice",
    swap: "Remplacer",
    moveUp: "Monter",
    moveDown: "Descendre",
    swapRemove: "Remplacer / Supprimer",
    restLabel: "Repos",
    bodyweight: "Poids du corps",
    volumeLabel: "Volume",
    weightTBD: "Poids à définir",
    progress: "Progrès :",
    setLabel: "Série",
    restTimer: "Repos",
    skipRest: "Repos ignoré.",
    endWorkout: "Terminer l'entraînement",
    seriesUnit: "séries",
    setDone: "terminée !",
    workoutStarted: "Entraînement démarré ! Bonne chance 💪",
    restDone: "Repos terminé ! Prochaine série.",
    setWeightTitle: "Définir la charge",
    setWeightDesc: "Indiquez le poids que vous utiliserez pour toutes les séries",
    weightPlaceholder: "Ex : 20",
    saveWeight: "Sauvegarder",
    weightSet: "Charge définie :",
    estimatedVol: "Volume estimé :",
    perSet: "kg/série",
    swapTitle: "Remplacer l'exercice",
    removeBtn: "Supprimer",
    noAlternatives: "Aucune substitution compatible trouvée pour cet environnement et équipement.",
    restored: "Entraînement restauré à la version originale.",
    customized: "Entraînement personnalisé avec succès.",
    customFailed: "Impossible d'appliquer la personnalisation.",
    noCompatible: "Aucun exercice compatible trouvé à ajouter.",
    noSwap: "Aucune substitution compatible trouvée."
  },
  de: {
    shareWorkout: "Training teilen",
    notFound: "Training nicht gefunden",
    notFoundDesc: "Das angeforderte Training existiert nicht in der aktuellen Bibliothek.",
    highlight: "Empfohlenes Training",
    weekLabel: "Woche",
    started: "Training gestartet",
    startBtn: "Training starten",
    duration: "Dauer",
    exercises: "Übungen",
    avgRest: "Ø Pause",
    totalVolume: "Gesamtvolumen",
    blockRead: "Block-Übersicht",
    weekCycle: "des aktuellen Zyklus",
    strategicAdj: "Strategische Anpassung",
    proDir: "Professionelle Richtung",
    quickSummary: "Kurzübersicht",
    sessionMetrics: "Einheitsmetriken",
    planned: "Geplant",
    sets: "Sätze",
    reps: "Wiederholungen",
    type: "Typ",
    customTitle: "Training anpassen",
    customDesc: "Anpassen ohne Kohärenz zu verlieren",
    customNote: "Tausche, entferne, füge hinzu oder ordne Übungen um, ohne die Ausrichtung nach Kategorie und Umgebung zu verlieren.",
    addExercise: "Übung hinzufügen",
    restoreWorkout: "Training wiederherstellen",
    validCustom: "Anpassung gültig",
    reviewRec: "Überprüfung empfohlen",
    blocksTitle: "Trainingsblöcke",
    blocksDesc: "Reihenfolge bereit ohne den Bildschirm zu verlassen",
    exerciseLabel: "Übung",
    viewExercise: "Übung anzeigen",
    swap: "Ersetzen",
    moveUp: "Nach oben",
    moveDown: "Nach unten",
    swapRemove: "Tauschen / Entfernen",
    restLabel: "Pause",
    bodyweight: "Körpergewicht",
    volumeLabel: "Volumen",
    weightTBD: "Gewicht festzulegen",
    progress: "Fortschritt:",
    setLabel: "Satz",
    restTimer: "Pause",
    skipRest: "Pause übersprungen.",
    endWorkout: "Training beenden",
    seriesUnit: "Sätze",
    setDone: "erledigt!",
    workoutStarted: "Training gestartet! Viel Erfolg 💪",
    restDone: "Pause vorbei! Nächster Satz.",
    setWeightTitle: "Last festlegen",
    setWeightDesc: "Gib das Gewicht ein, das du für alle Sätze verwenden wirst",
    weightPlaceholder: "z. B. 20",
    saveWeight: "Speichern",
    weightSet: "Last festgelegt:",
    estimatedVol: "Geschätztes Volumen:",
    perSet: "kg/Satz",
    swapTitle: "Übung tauschen",
    removeBtn: "Entfernen",
    noAlternatives: "Keine kompatible Ersatzübung für diese Umgebung und Ausrüstung gefunden.",
    restored: "Training auf Originalversion wiederhergestellt.",
    customized: "Training erfolgreich angepasst.",
    customFailed: "Anpassung konnte nicht angewendet werden.",
    noCompatible: "Keine kompatible Übung zum Hinzufügen gefunden.",
    noSwap: "Keine kompatible Ersatzübung gefunden."
  }
};
function formatDisplayValue(value, kind = "text") {
  const cleaned = cleanLegacyText(value);
  return kind === "type" ? getWorkoutTypeLabel(cleaned) : cleaned;
}
function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch {
  }
}
function WorkoutDetailPage() {
  const {
    id
  } = Route.useParams();
  const navigate = useNavigate();
  const exerciseListRef = reactExports.useRef(null);
  const [started, setStarted] = reactExports.useState(false);
  const [showSummary, setShowSummary] = reactExports.useState(false);
  const [subCycleBySlot, setSubCycleBySlot] = reactExports.useState({});
  const [swapPicker, setSwapPicker] = reactExports.useState(null);
  const [weightPicker, setWeightPicker] = reactExports.useState(null);
  const [weightInput, setWeightInput] = reactExports.useState("");
  const [userWeights, setUserWeights] = reactExports.useState({});
  const [completedSets, setCompletedSets] = reactExports.useState(/* @__PURE__ */ new Set());
  const [restTimer, setRestTimer] = reactExports.useState(null);
  const [revision, setRevision] = reactExports.useState(0);
  const trainingState = useTrainingState();
  const baseWorkout = getGeneratedWorkout(id, {
    applyCustomizations: false
  });
  const workout = trainingState.workouts.find((w) => w.id === id) ?? getGeneratedWorkout(id);
  const catalog = useExerciseCatalog();
  const catalogById = reactExports.useMemo(() => new Map(catalog.map((record) => [record.id, record])), [catalog]);
  const storedCustomization = revision >= 0 ? getWorkoutCustomization(id) : null;
  const locale = getStoredLocale();
  const c = WCOPY[locale] ?? WCOPY.pt;
  const gamCopy = getGamificationCopy(locale);
  if (!workout || !baseWorkout) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: c.notFound }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: c.notFoundDesc })
    ] });
  }
  const profile = trainingState.profile;
  const environment = trainingState.environment;
  const currentPeriodWeek = trainingState.periodization.weeks[trainingState.periodization.currentWeek - 1];
  const aiRecommendations = useAIInsights(trainingState);
  const supportsProfileEquipment = (equipment) => {
    if (equipment === "peso_corporal") return true;
    if (profile.equipment.length === 0) {
      if (profile.location === "casa") return false;
      if (profile.location === "outdoor") {
        return ["barra_fixa", "paralelas", "parede", "trx"].includes(equipment);
      }
      return true;
    }
    const equipmentMap = {
      barra: ["barras", "barra", "anilhas", "rack"],
      halteres: ["halteres", "halter", "kettlebell"],
      cabos: ["cabos", "cabo"],
      maquina: ["maquinas", "maquina"],
      peso_corporal: ["peso corporal"],
      barra_fixa: ["barra fixa"],
      paralelas: ["paralelas", "argolas"],
      parede: ["parede"],
      banco: ["banco"],
      trx: ["trx"],
      bola: ["bola"],
      elastico: ["elasticos", "elastico"]
    };
    const accepted = equipmentMap[equipment] ?? [equipment];
    const normalizedEquipment = profile.equipment.map(normalizeText);
    return accepted.some((candidate) => normalizedEquipment.includes(normalizeText(candidate)));
  };
  const supportsTrainingType = (record) => {
    if (profile.trainingType === "calistenia") return record.trainingType === "calistenia";
    if (profile.trainingType === "funcional") return isFunctionalExerciseRecord(record);
    return record.trainingType === "musculacao";
  };
  const supportsEnvironment = (equipment, trainingType) => {
    if (environment.location === "outdoor") {
      return trainingType === "calistenia" && ["peso_corporal", "barra_fixa", "paralelas", "parede", "trx"].includes(equipment);
    }
    if (environment.location === "casa") {
      return equipment !== "maquina" && equipment !== "cabos";
    }
    return true;
  };
  const commitCustomization = (nextCustomization) => {
    if (!nextCustomization || nextCustomization.edits.length === 0) {
      clearWorkoutCustomization(id);
      toast.success(c.restored);
      setRevision((value) => value + 1);
      return;
    }
    const validation = validateWorkoutCustomization(baseWorkout, nextCustomization);
    if (!validation.valid) {
      toast.error(validation.issues[0] ?? c.customFailed);
      return;
    }
    saveWorkoutCustomization(nextCustomization);
    toast.success(c.customized);
    setRevision((value) => value + 1);
  };
  const appendEdit = (edit) => {
    const nextCustomization = {
      workoutId: id,
      edits: [...storedCustomization?.edits ?? [], edit],
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    commitCustomization(nextCustomization);
  };
  const getCompatibleAlternatives = (exerciseId) => {
    const currentRecord = catalogById.get(exerciseId);
    if (!currentRecord) return [];
    const usedIds = new Set(workout.exercises.map((item) => item.exerciseId));
    const strict = catalog.filter((record) => {
      if (record.id === exerciseId) return false;
      if (usedIds.has(record.id)) return false;
      if (record.category !== currentRecord.category) return false;
      if (!supportsTrainingType(record)) return false;
      if (!supportsProfileEquipment(record.equipment)) return false;
      if (!supportsEnvironment(record.equipment, record.trainingType)) return false;
      return true;
    });
    if (strict.length > 0) return strict;
    return catalog.filter((record) => {
      if (record.id === exerciseId) return false;
      if (usedIds.has(record.id)) return false;
      if (!supportsTrainingType(record)) return false;
      return record.category === currentRecord.category;
    });
  };
  const getSuggestedAddRecord = () => {
    const currentCategories = new Set(workout.exercises.map((item) => catalogById.get(item.exerciseId)?.category).filter(Boolean));
    const usedIds = new Set(workout.exercises.map((item) => item.exerciseId));
    return catalog.find((record) => {
      if (usedIds.has(record.id)) return false;
      if (!supportsTrainingType(record)) return false;
      if (!currentCategories.has(record.category)) return false;
      if (!supportsProfileEquipment(record.equipment)) return false;
      if (!supportsEnvironment(record.equipment, record.trainingType)) return false;
      return record.status === "active";
    }) ?? null;
  };
  const previewValidation = storedCustomization ? validateWorkoutCustomization(baseWorkout, storedCustomization) : {
    valid: true
  };
  const totalSets = workout.exercises.reduce((acc, item) => acc + item.sets.length, 0);
  const totalReps = workout.exercises.reduce((acc, item) => acc + item.sets.reduce((sum, set) => sum + set.reps, 0), 0);
  const totalLoad = workout.exercises.reduce((acc, item) => acc + item.sets.reduce((sum, set) => sum + set.reps * set.weight, 0), 0);
  const averageRest = Math.round(workout.exercises.reduce((acc, item) => acc + item.rest, 0) / workout.exercises.length);
  reactExports.useEffect(() => {
    if (!restTimer) return;
    if (restTimer.remaining <= 0) {
      playBeep();
      toast.success(c.restDone, {
        duration: 3e3
      });
      setRestTimer(null);
      return;
    }
    const id2 = setTimeout(() => setRestTimer((prev) => prev ? {
      ...prev,
      remaining: prev.remaining - 1
    } : null), 1e3);
    return () => clearTimeout(id2);
  }, [restTimer]);
  const toggleSet = reactExports.useCallback((exerciseId, setIndex, restSeconds, exerciseName) => {
    const key = `${exerciseId}-${setIndex}`;
    setCompletedSets((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        return next;
      }
      next.add(key);
      return next;
    });
    if (!completedSets.has(key)) {
      toast.success(`${c.setLabel} ${setIndex + 1} ${c.setDone}`, {
        duration: 2e3
      });
      if ("vibrate" in navigator) navigator.vibrate(40);
      if (restSeconds > 0) {
        setRestTimer({
          remaining: restSeconds,
          total: restSeconds,
          exerciseName
        });
      }
    } else {
      setRestTimer(null);
    }
  }, [completedSets, c]);
  const handleStartWorkout = () => {
    setStarted(true);
    toast(c.workoutStarted, {
      duration: 2500
    });
    exerciseListRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  const estimatedCalories = Math.round(workout.duration * 6.5);
  const handleEncerrar = () => {
    const historyId = `${workout.id}-${Date.now()}`;
    saveWorkoutToHistory({
      id: historyId,
      workoutId: workout.id,
      name: workout.name,
      date: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      duration: workout.duration,
      calories: estimatedCalories,
      completedSets: completedSets.size,
      totalSets: workout.exercises.reduce((acc, item) => acc + item.sets.length, 0),
      exercises: workout.exercises.map((item) => {
        const ex = getExercise(item.exerciseId);
        return {
          id: item.exerciseId,
          name: ex?.name ?? item.exerciseId,
          muscle: ex?.muscle ?? "",
          sets: item.sets.map((set, si) => ({
            reps: set.reps,
            weight: set.weight,
            completed: completedSets.has(`${item.exerciseId}-${si}`)
          }))
        };
      })
    });
    setShowSummary(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    showSummary && /* @__PURE__ */ jsxRuntimeExports.jsx(WorkoutCompleteAnimation, { exerciseCount: workout.exercises.length, durationMinutes: workout.duration, calories: estimatedCalories, workoutName: workout.name, onFinish: () => {
      setShowSummary(false);
      navigate({
        to: "/app/historico/$id",
        params: {
          id: workout.id
        }
      });
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
          to: "/app/treinos"
        }), className: "grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-foreground", "aria-label": "Voltar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-cyan", children: c.highlight }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-gradient-brand", children: translateWorkoutName(workout.name, locale) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden rounded-[2rem] border border-border bg-gradient-surface p-4 shadow-elevated sm:p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.74_0.17_53_/_0.18),transparent_34%),radial-gradient(circle_at_bottom_left,oklch(0.78_0.14_220_/_0.14),transparent_36%)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3 w-3" }),
                "Workout protocol"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-display text-2xl font-bold sm:mt-3 sm:text-3xl", children: translateWorkoutName(workout.name, locale) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground sm:mt-2", children: formatDisplayValue(workout.focus) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-cyan/10 px-2 py-1 text-cyan", children: [
                  c.weekLabel,
                  " ",
                  trainingState.periodization.currentWeek,
                  "/12"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/10 px-2 py-1 text-primary", children: gamCopy.phases[currentPeriodWeek?.phase ?? "base"] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-success/10 px-2 py-1 text-success", children: gamCopy.modalities[trainingState.periodization.modality] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleStartWorkout, className: "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary sm:px-6 sm:py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }),
                started ? c.started : c.startBtn
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShareVideoButton, { composition: WorkoutCompleteVideo, inputProps: {
                name: trainingState.profile.name ?? "Atleta",
                workoutName: workout.name,
                duration: workout.duration,
                totalSets,
                totalVolume: Math.round(totalLoad / 1e3),
                calories: estimatedCalories,
                weekNumber: trainingState.periodization.currentWeek,
                locale,
                exercises: workout.exercises.map((item) => {
                  const ex = getExercise(item.exerciseId);
                  return {
                    name: cleanLegacyText(ex?.name ?? item.exerciseId),
                    muscle: cleanLegacyText(ex?.muscle ?? ""),
                    sets: item.sets.length,
                    completed: item.sets.filter((_, si) => completedSets.has(`${item.exerciseId}-${si}`)).length,
                    topWeight: Math.max(...item.sets.map((s) => s.weight ?? 0))
                  };
                })
              }, durationInFrames: 390, title: c.shareWorkout ?? "Compartilhar treino", variant: "ghost" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { icon: Clock3, label: c.duration, value: `${workout.duration} min` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { icon: Target, label: c.exercises, value: `${workout.exercises.length}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { icon: TimerReset, label: c.avgRest, value: `${averageRest}s` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { icon: Zap, label: c.totalVolume, value: `${Math.round(totalLoad / 1e3)}k kg` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-4 rounded-2xl border p-4", style: {
            borderColor: "rgba(34,211,238,0.2)",
            background: "rgba(34,211,238,0.04)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: 88,
              flexShrink: 0
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPreviewCard, { composition: WorkoutCompleteVideo, inputProps: {
              name: trainingState.profile.name ?? "Atleta",
              workoutName: workout.name,
              duration: workout.duration,
              totalSets,
              totalVolume: Math.round(totalLoad / 1e3),
              calories: estimatedCalories,
              weekNumber: trainingState.periodization.currentWeek,
              locale,
              exercises: workout.exercises.map((item) => {
                const ex = getExercise(item.exerciseId);
                return {
                  name: cleanLegacyText(ex?.name ?? item.exerciseId),
                  muscle: cleanLegacyText(ex?.muscle ?? ""),
                  sets: item.sets.length,
                  completed: item.sets.filter((_, si) => completedSets.has(`${item.exerciseId}-${si}`)).length,
                  topWeight: Math.max(...item.sets.map((s) => s.weight ?? 0))
                };
              })
            }, durationInFrames: 390, title: c.shareWorkout ?? "Compartilhar treino", previewFrame: 45 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-foreground", children: "Compartilhe seu treino" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-xs text-muted-foreground", children: "Story pronto para Instagram e WhatsApp com seus stats reais" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-[10px] font-semibold uppercase tracking-widest", style: {
                color: "#22d3ee"
              }, children: "Formato 9:16 · 13 seg" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-4 xl:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan", children: c.blockRead }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mt-1 font-display text-lg font-semibold", children: [
            c.weekLabel,
            " ",
            trainingState.periodization.currentWeek,
            " ",
            c.weekCycle
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: trainingState.periodization.summary.shortTerm }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: currentPeriodWeek?.emphasis })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan", children: c.strategicAdj }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 font-display text-lg font-semibold", children: c.proDir }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: trainingState.periodization.adjustments.recoveryBias }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: trainingState.periodization.adjustments.splitBias })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 xl:grid-cols-[1.5fr_1fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan", children: c.quickSummary }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 font-display text-lg font-semibold", children: c.sessionMetrics })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: c.planned })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: c.sets, value: `${totalSets}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: c.reps, value: `${totalReps}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: c.type, value: formatDisplayValue(workout.type, "type") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AIInsightCard, { className: "h-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
            aiRecommendations.primary.title,
            ":"
          ] }),
          " ",
          aiRecommendations.primary.message
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan", children: c.customTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-lg font-semibold", children: c.customDesc }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: c.customNote })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
              const suggestedRecord = getSuggestedAddRecord();
              if (!suggestedRecord) {
                toast.error(c.noCompatible);
                return;
              }
              appendEdit({
                type: "add_exercise",
                workoutId: id,
                exerciseId: suggestedRecord.id,
                reason: "adicao_manual"
              });
            }, className: "inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-2 text-xs font-semibold text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              c.addExercise
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => commitCustomization(null), className: "inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-2 text-xs font-semibold text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-3.5 w-3.5" }),
              c.restoreWorkout
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", previewValidation.valid ? "bg-success/10 text-success" : "bg-primary/10 text-primary"), children: previewValidation.valid ? c.validCustom : c.reviewRec }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: exerciseListRef, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: c.blocksTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: c.blocksDesc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
            const exerciseNames = workout.exercises.slice(0, 4).map((item) => getExercise(item.exerciseId)?.name).filter(Boolean).join(", ");
            const msg = `Vou fazer o ${workout.name} agora (${workout.exercises.length} exercícios, ${workout.duration} min). Exercícios principais: ${exerciseNames}. Quais dicas você me dá para maximizar os resultados hoje?`;
            window.dispatchEvent(new CustomEvent("open-ai-coach", {
              detail: {
                message: msg
              }
            }));
          }, className: "inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan transition hover:bg-cyan/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
            "Coach mode"
          ] })
        ] }),
        workout.exercises.map((item, index) => {
          const exercise = getExercise(item.exerciseId);
          if (!exercise) return null;
          const userWeight = userWeights[item.exerciseId] ?? 0;
          const effectiveWeight = (set) => userWeight > 0 ? userWeight : set.weight;
          const exerciseVolume = item.sets.reduce((sum, set) => sum + set.reps * effectiveWeight(set), 0);
          const isBodyweightExercise = /peso.corporal|barra.fixa|paralelas|parede|trx/i.test(exercise.equipment ?? "");
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-[2rem] border border-border bg-surface transition hover:border-primary/25", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-0 lg:grid-cols-[220px_1fr]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExerciseMedia, { exerciseId: exercise.id, size: "card", className: "rounded-none lg:h-full lg:aspect-auto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan", children: [
                    c.exerciseLabel,
                    " ",
                    index + 1
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-xl font-semibold", children: getExerciseName(exercise.id, exercise.name, locale) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: getExerciseBiomechanics(exercise.biomechanics, locale) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/exercicio/$id", params: {
                  id: exercise.id
                }, className: "inline-flex items-center justify-center rounded-full border border-border bg-elevated px-3 py-1.5 text-[11px] font-semibold text-foreground", children: c.viewExercise })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  const alternatives = getCompatibleAlternatives(exercise.id);
                  if (alternatives.length === 0) {
                    toast.error(c.noSwap);
                    return;
                  }
                  setSwapPicker({
                    exerciseId: exercise.id,
                    slotIndex: index
                  });
                }, className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-3.5 w-3.5" }),
                  c.swap
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => appendEdit({
                  type: "reorder_exercise",
                  workoutId: id,
                  exerciseId: exercise.id,
                  newOrder: Math.max(index - 1, 0)
                }), disabled: index === 0, className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground disabled:opacity-40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-3.5 w-3.5" }),
                  c.moveUp
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => appendEdit({
                  type: "reorder_exercise",
                  workoutId: id,
                  exerciseId: exercise.id,
                  newOrder: Math.min(index + 1, workout.exercises.length - 1)
                }), disabled: index === workout.exercises.length - 1, className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground disabled:opacity-40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-3.5 w-3.5" }),
                  c.moveDown
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  const alternatives = getCompatibleAlternatives(exercise.id);
                  if (alternatives.length > 0) {
                    setSwapPicker({
                      exerciseId: exercise.id,
                      slotIndex: index
                    });
                  } else {
                    appendEdit({
                      type: "remove_exercise",
                      workoutId: id,
                      exerciseId: exercise.id,
                      reason: "remocao_manual"
                    });
                  }
                }, className: "inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                  c.swapRemove
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/10 px-2.5 py-1 text-primary", children: getMuscleGroupLabel(exercise.muscle, locale) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setRestTimer({
                  remaining: item.rest,
                  total: item.rest,
                  exerciseName: getExerciseName(exercise.id, exercise.name, locale)
                }), className: "inline-flex items-center gap-1 rounded-full bg-background/50 px-2.5 py-1 text-muted-foreground transition hover:bg-elevated hover:text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TimerReset, { className: "h-3 w-3" }),
                  c.restLabel,
                  " ",
                  item.rest,
                  "s"
                ] }),
                isBodyweightExercise ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-cyan/10 px-2.5 py-1 text-cyan", children: c.bodyweight }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                  setWeightInput(userWeight > 0 ? String(userWeight) : "");
                  setWeightPicker({
                    exerciseId: item.exerciseId,
                    name: getExerciseName(exercise.id, exercise.name, locale),
                    repsPerSet: item.sets[0]?.reps ?? 10
                  });
                }, className: "inline-flex items-center gap-1 rounded-full bg-cyan/10 px-2.5 py-1 text-cyan transition hover:bg-cyan/20", children: exerciseVolume > 0 ? `${c.volumeLabel} ${Math.round(exerciseVolume)} kg` : c.weightTBD }),
                item.tag ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-elevated px-2.5 py-1 text-foreground/80", children: item.tag }) : null
              ] }),
              item.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-start gap-1.5 rounded-xl border border-cyan/20 bg-cyan/5 px-3 py-2 text-[11px] leading-relaxed text-cyan/90", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mt-0.5 h-3 w-3 shrink-0 text-cyan" }),
                item.notes
              ] }),
              started && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: c.progress }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: item.sets.map((_, si) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-2 w-2 rounded-full transition-colors", completedSets.has(`${item.exerciseId}-${si}`) ? "bg-success" : "bg-elevated border border-border") }, si)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-success", children: [
                  item.sets.filter((_, si) => completedSets.has(`${item.exerciseId}-${si}`)).length,
                  "/",
                  item.sets.length
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-2", children: item.sets.map((set, setIndex) => {
                const setKey = `${item.exerciseId}-${setIndex}`;
                const isDone = completedSets.has(setKey);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("grid items-center gap-3 rounded-2xl border px-3 py-2 text-sm transition-all", started ? "grid-cols-[32px_72px_1fr_auto]" : "grid-cols-[72px_1fr_auto]", isDone ? "border-success/30 bg-success/5" : "border-border bg-elevated/40"), children: [
                  started && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleSet(item.exerciseId, setIndex, item.rest, getExerciseName(exercise.id, exercise.name, locale)), className: cn("grid h-7 w-7 place-items-center rounded-full border-2 transition-all", isDone ? "border-success bg-success text-background" : "border-muted-foreground/40 bg-transparent text-transparent hover:border-success/60"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("rounded-full px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-[0.16em]", isDone ? "bg-success/10 text-success" : "bg-background/50 text-cyan"), children: [
                    c.setLabel,
                    " ",
                    setIndex + 1
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("font-medium", isDone ? "text-muted-foreground line-through" : "text-foreground"), children: [
                    set.reps,
                    " rep · ",
                    isBodyweightExercise ? c.bodyweight : userWeight > 0 ? `${userWeight} kg` : set.weight > 0 ? `${set.weight} kg` : "-- kg"
                  ] }),
                  isDone && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-success" })
                ] }, setKey);
              }) })
            ] })
          ] }) }, item.exerciseId);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: restTimer && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 60
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0,
        y: 60
      }, transition: {
        type: "spring",
        stiffness: 300,
        damping: 28
      }, className: "fixed bottom-24 left-1/2 z-40 -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-2xl border border-primary/30 bg-surface/95 px-5 py-3 shadow-glow-primary backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: c.restTimer }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-3xl font-black text-primary tabular-nums", children: [
            restTimer.remaining,
            "s"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground truncate max-w-[120px]", children: restTimer.exerciseName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-12 w-12 -rotate-90", viewBox: "0 0 36 36", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "18", cy: "18", r: "15.9", fill: "none", stroke: "oklch(0.30 0.04 262)", strokeWidth: "3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "18", cy: "18", r: "15.9", fill: "none", stroke: "oklch(0.74 0.17 53)", strokeWidth: "3", strokeDasharray: `${restTimer.remaining / restTimer.total * 100} 100`, strokeLinecap: "round" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setRestTimer(null);
          toast(c.skipRest);
        }, className: "grid h-8 w-8 place-items-center rounded-full border border-border bg-elevated text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
      ] }) }) }),
      started && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky bottom-4 z-10 flex justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleEncerrar, className: "inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] text-primary-foreground shadow-glow-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4 w-4" }),
        c.endWorkout,
        " (",
        completedSets.size,
        "/",
        workout.exercises.reduce((a, i) => a + i.sets.length, 0),
        " ",
        c.seriesUnit,
        ")"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: weightPicker && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, exit: {
        opacity: 0
      }, onClick: () => setWeightPicker(null), className: "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" }, "weight-backdrop"),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        y: "100%"
      }, animate: {
        y: 0
      }, exit: {
        y: "100%"
      }, transition: {
        type: "spring",
        stiffness: 340,
        damping: 34
      }, className: "fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-border bg-background p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 h-1 w-10 rounded-full bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan", children: c.setWeightTitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-base font-bold", children: weightPicker.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: c.setWeightDesc }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "0.5", value: weightInput, onChange: (e) => setWeightInput(e.target.value), onKeyDown: (e) => {
            if (e.key === "Enter") {
              const w = parseFloat(weightInput);
              if (!isNaN(w) && w >= 0) {
                setUserWeights((prev) => ({
                  ...prev,
                  [weightPicker.exerciseId]: w
                }));
                toast.success(`${c.weightSet} ${w} kg`);
              }
              setWeightPicker(null);
            }
          }, placeholder: c.weightPlaceholder, autoFocus: true, className: "flex-1 rounded-2xl border border-border bg-elevated px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-muted-foreground", children: "kg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            const w = parseFloat(weightInput);
            if (!isNaN(w) && w >= 0) {
              setUserWeights((prev) => ({
                ...prev,
                [weightPicker.exerciseId]: w
              }));
              toast.success(`${c.weightSet} ${w} kg`);
            }
            setWeightPicker(null);
          }, className: "rounded-2xl px-5 py-3 text-sm font-bold text-white", style: {
            background: "linear-gradient(135deg,#22d3ee,#3b82f6)"
          }, children: c.saveWeight })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-[10px] text-muted-foreground", children: [
          c.estimatedVol,
          " ",
          weightInput && !isNaN(parseFloat(weightInput)) ? `${Math.round(parseFloat(weightInput) * weightPicker.repsPerSet)} ${c.perSet}` : "—"
        ] })
      ] }, "weight-drawer")
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: swapPicker && (() => {
      const alternatives = getCompatibleAlternatives(swapPicker.exerciseId);
      const currentEx = getExercise(swapPicker.exerciseId);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0
        }, animate: {
          opacity: 1
        }, exit: {
          opacity: 0
        }, onClick: () => setSwapPicker(null), className: "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" }, "swap-backdrop"),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          y: "100%"
        }, animate: {
          y: 0
        }, exit: {
          y: "100%"
        }, transition: {
          type: "spring",
          stiffness: 340,
          damping: 34
        }, className: "fixed bottom-0 left-0 right-0 z-50 flex max-h-[78vh] flex-col rounded-t-3xl border-t border-border bg-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-3 h-1 w-10 rounded-full bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan", children: c.swapTitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: currentEx ? getExerciseName(currentEx.id, currentEx.name, locale) : c.exerciseLabel })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                appendEdit({
                  type: "remove_exercise",
                  workoutId: id,
                  exerciseId: swapPicker.exerciseId,
                  reason: "remocao_manual"
                });
                setSwapPicker(null);
              }, className: "inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-[10px] font-semibold text-destructive", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }),
                c.removeBtn
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSwapPicker(null), className: "rounded-full p-2 text-muted-foreground hover:bg-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4 h-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto flex-1 px-4 py-3 space-y-2", children: alternatives.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground", children: c.noAlternatives }) : alternatives.map((alt) => {
            const altEx = getExercise(alt.id);
            if (!altEx) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              appendEdit({
                type: "replace_exercise",
                workoutId: id,
                fromExerciseId: swapPicker.exerciseId,
                toExerciseId: alt.id,
                reason: "substituicao_manual"
              });
              setSwapPicker(null);
            }, className: "flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-3 text-left transition hover:border-primary/40 hover:bg-elevated active:scale-[0.99]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExerciseMedia, { exerciseId: alt.id, size: "thumb", className: "h-full w-full" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-semibold", children: getExerciseName(alt.id, altEx.name, locale) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate text-[11px] text-muted-foreground", children: [
                  getExerciseBiomechanics(altEx.biomechanics, locale),
                  " · ",
                  altEx.equipment
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-4 w-4 shrink-0 text-primary" })
            ] }, alt.id);
          }) })
        ] }, "swap-drawer")
      ] });
    })() })
  ] });
}
function InfoCard({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-background/35 p-2.5 backdrop-blur sm:p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-semibold text-foreground sm:text-base", children: value })
  ] });
}
function MetricCard({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 rounded-2xl border border-border bg-elevated/40 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "break-words text-[10px] uppercase tracking-[0.18em] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 break-words font-display text-lg font-bold leading-tight text-foreground sm:text-xl", children: value })
  ] });
}
export {
  WorkoutDetailPage as component
};