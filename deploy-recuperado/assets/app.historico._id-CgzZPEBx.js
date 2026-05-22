import { W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { a7 as Route, L as Link, p as cleanLegacyText } from "./router-BDD3RgVy.js";
import { a as getWorkoutHistoryEntry } from "./workout-history-D2efW0ov.js";
import { u as useCurrentFrame, a as useVideoConfig, s as spring, i as interpolate, A as AbsoluteFill, S as Sequence } from "./index-CcuZFuTS.js";
import { G as GradientBackground } from "./VideoPlayerModal-BQaBY8IB.js";
import { B as BrandOverlay } from "./BrandOverlay-B4-tEure.js";
import { S as ShareVideoButton } from "./ShareVideoButton-DuyJVam8.js";
import { A as ArrowLeft } from "./arrow-left-D6mNKGvq.js";
import { C as Clock } from "./clock-pfs1_d9-.js";
import { L as Layers } from "./layers-CfonREYS.js";
import { D as Dumbbell } from "./dumbbell-DL1Diyp6.js";
import { F as Flame } from "./flame-B4I7h4kj.js";
import { T as Trophy } from "./trophy-D4ROBLa0.js";
import { C as Check } from "./check-j8hLnasa.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
function SessionSummaryVideo({
  name = "Atleta",
  workoutName = "Push A",
  date = "Hoje",
  duration = 58,
  completedSets = 24,
  totalSets = 24,
  totalVolume = 5200,
  calories = 420,
  exercises = []
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heroScale = spring({ frame, fps, config: { damping: 13, stiffness: 110 } });
  const perfect = completedSets === totalSets && totalSets > 0;
  const pct = totalSets > 0 ? completedSets / totalSets * 100 : 0;
  const arcAngle = interpolate(frame, [10, 60], [0, pct / 100 * 283], { extrapolateRight: "clamp" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AbsoluteFill, { style: { fontFamily: "sans-serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GradientBackground, { variant: "dark" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandOverlay, { position: "top" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 140, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        transform: `scale(${heroScale})`,
        background: perfect ? "rgba(74,222,128,0.15)" : "rgba(34,211,238,0.1)",
        border: `1px solid ${perfect ? "rgba(74,222,128,0.4)" : "rgba(34,211,238,0.3)"}`,
        borderRadius: 999,
        padding: "10px 28px",
        marginBottom: 20,
        fontSize: 15,
        fontWeight: 700,
        color: perfect ? "#4ade80" : "#22d3ee",
        letterSpacing: 2,
        textTransform: "uppercase"
      }, children: perfect ? "🏆 100% Concluído!" : `${pct.toFixed(0)}% Completado` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: -1 }, children: workoutName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 15, color: "rgba(148,163,184,0.6)", marginTop: 6 }, children: [
          name,
          " · ",
          date
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 10, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 310, left: 0, right: 0, display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: 150, height: 150 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: 150, height: 150, style: { position: "absolute", transform: "rotate(-90deg)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: 75, cy: 75, r: 65, fill: "none", stroke: "rgba(255,255,255,0.06)", strokeWidth: 10 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: 75,
            cy: 75,
            r: 65,
            fill: "none",
            stroke: perfect ? "#4ade80" : "#22d3ee",
            strokeWidth: 10,
            strokeDasharray: `${arcAngle} 283`,
            strokeLinecap: "round",
            style: { filter: `drop-shadow(0 0 8px ${perfect ? "#4ade80" : "#22d3ee"})` }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 28, fontWeight: 900, color: "#fff" }, children: [
          completedSets,
          "/",
          totalSets
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(148,163,184,0.5)", letterSpacing: 2 }, children: "SÉRIES" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 35, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 500, left: 48, right: 48, display: "flex", gap: 14 }, children: [
      { label: "Duração", val: `${duration}min`, color: "#22d3ee" },
      { label: "Volume", val: `${(totalVolume / 1e3).toFixed(1)}t`, color: "#fb923c" },
      { label: "Calorias", val: `${calories}`, color: "#4ade80" }
    ].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      flex: 1,
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${s.color}25`,
      borderRadius: 18,
      padding: "14px 10px",
      textAlign: "center"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(148,163,184,0.5)", letterSpacing: 2, textTransform: "uppercase" }, children: s.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, fontWeight: 900, color: s.color, marginTop: 4 }, children: s.val })
    ] }, i)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 55, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 630, left: 48, right: 48 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: exercises.slice(0, 5).map((ex, i) => {
      const opacity = interpolate(frame, [i * 8, i * 8 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        opacity,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 14,
        padding: "10px 16px",
        border: ex.completed === ex.sets ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(255,255,255,0.06)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 600, color: "#e2e8f0" }, children: ex.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(148,163,184,0.5)" }, children: ex.muscle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, fontWeight: 700, color: ex.completed === ex.sets ? "#4ade80" : "#22d3ee" }, children: [
            ex.completed,
            "/",
            ex.sets,
            " séries"
          ] }),
          ex.topWeight > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(148,163,184,0.5)" }, children: [
            ex.topWeight,
            " kg"
          ] })
        ] })
      ] }, i);
    }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandOverlay, { position: "bottom" })
  ] });
}
Array.from({ length: 84 }, (_, i) => ({
  day: i,
  value: Math.floor(Math.random() * 5)
}));
const workoutHistory = [
  {
    id: "w1",
    name: "Push · Peito & Ombros",
    date: "Hoje",
    duration: 62,
    volume: 8420,
    sets: 22,
    prs: 1,
    exercises: [
      { name: "Supino Reto", muscle: "Peito", sets: [
        { reps: 10, weight: 60 },
        { reps: 8, weight: 75 },
        { reps: 6, weight: 85 },
        { reps: 5, weight: 90, pr: true }
      ] },
      { name: "Supino Inclinado Halteres", muscle: "Peito", sets: [
        { reps: 12, weight: 24 },
        { reps: 10, weight: 28 },
        { reps: 8, weight: 30 }
      ] },
      { name: "Desenvolvimento Militar", muscle: "Ombro", sets: [
        { reps: 10, weight: 40 },
        { reps: 8, weight: 45 },
        { reps: 6, weight: 50 }
      ] },
      { name: "Elevação Lateral", muscle: "Ombro", sets: [
        { reps: 15, weight: 10 },
        { reps: 12, weight: 12 },
        { reps: 10, weight: 14 }
      ] },
      { name: "Tríceps Corda", muscle: "Tríceps", sets: [
        { reps: 15, weight: 25 },
        { reps: 12, weight: 30 },
        { reps: 10, weight: 35 }
      ] }
    ]
  },
  {
    id: "w2",
    name: "Pull · Costas & Bíceps",
    date: "Ontem",
    duration: 58,
    volume: 7890,
    sets: 20,
    prs: 0,
    exercises: [
      { name: "Barra Fixa", muscle: "Costas", sets: [
        { reps: 10, weight: 0 },
        { reps: 8, weight: 0 },
        { reps: 6, weight: 10 },
        { reps: 5, weight: 15 }
      ] },
      { name: "Remada Curvada", muscle: "Costas", sets: [
        { reps: 10, weight: 60 },
        { reps: 8, weight: 70 },
        { reps: 6, weight: 80 }
      ] },
      { name: "Puxada Frontal", muscle: "Costas", sets: [
        { reps: 12, weight: 50 },
        { reps: 10, weight: 55 },
        { reps: 8, weight: 60 }
      ] },
      { name: "Rosca Direta", muscle: "Bíceps", sets: [
        { reps: 12, weight: 25 },
        { reps: 10, weight: 28 },
        { reps: 8, weight: 30 }
      ] }
    ]
  },
  {
    id: "w3",
    name: "Legs · Quadríceps",
    date: "3 dias",
    duration: 71,
    volume: 11240,
    sets: 24,
    prs: 2,
    exercises: [
      { name: "Agachamento Livre", muscle: "Quadríceps", sets: [
        { reps: 10, weight: 80 },
        { reps: 8, weight: 100 },
        { reps: 6, weight: 115 },
        { reps: 5, weight: 122, pr: true }
      ] },
      { name: "Leg Press 45°", muscle: "Quadríceps", sets: [
        { reps: 12, weight: 180 },
        { reps: 10, weight: 220 },
        { reps: 8, weight: 250 }
      ] },
      { name: "Stiff", muscle: "Posterior", sets: [
        { reps: 10, weight: 70 },
        { reps: 8, weight: 80 },
        { reps: 6, weight: 90, pr: true }
      ] }
    ]
  },
  {
    id: "w4",
    name: "Push · Tríceps Focus",
    date: "5 dias",
    duration: 54,
    volume: 7120,
    sets: 19,
    prs: 0,
    exercises: [
      { name: "Supino Fechado", muscle: "Tríceps", sets: [
        { reps: 10, weight: 50 },
        { reps: 8, weight: 60 },
        { reps: 6, weight: 70 }
      ] },
      { name: "Tríceps Testa", muscle: "Tríceps", sets: [
        { reps: 12, weight: 25 },
        { reps: 10, weight: 30 },
        { reps: 8, weight: 35 }
      ] }
    ]
  },
  {
    id: "w5",
    name: "Pull · Deadlift Day",
    date: "1 semana",
    duration: 68,
    volume: 10880,
    sets: 21,
    prs: 1,
    exercises: [
      { name: "Levantamento Terra", muscle: "Posterior", sets: [
        { reps: 8, weight: 100 },
        { reps: 5, weight: 130 },
        { reps: 3, weight: 145 },
        { reps: 3, weight: 150, pr: true }
      ] },
      { name: "Remada Cavalinho", muscle: "Costas", sets: [
        { reps: 10, weight: 60 },
        { reps: 8, weight: 70 },
        { reps: 6, weight: 80 }
      ] }
    ]
  },
  {
    id: "w6",
    name: "Full Body · Mobilidade",
    date: "10 dias",
    duration: 45,
    volume: 5230,
    sets: 16,
    prs: 0,
    exercises: [
      { name: "Goblet Squat", muscle: "Quadríceps", sets: [
        { reps: 12, weight: 20 },
        { reps: 10, weight: 24 },
        { reps: 8, weight: 28 }
      ] },
      { name: "Push-up", muscle: "Peito", sets: [
        { reps: 15, weight: 0 },
        { reps: 12, weight: 0 },
        { reps: 10, weight: 0 }
      ] }
    ]
  }
];
const getHistoryEntry = (id) => workoutHistory.find((w) => w.id === id);
function HistoryDetail() {
  const {
    id
  } = Route.useParams();
  const saved = getWorkoutHistoryEntry(id);
  const staticEntry = getHistoryEntry(id);
  if (saved) {
    const totalSets2 = saved.exercises.reduce((a, e) => a + e.sets.length, 0);
    const completedCount = saved.exercises.reduce((a, e) => a + e.sets.filter((s) => s.completed).length, 0);
    const totalVolume = saved.exercises.reduce((a, e) => a + e.sets.reduce((b, s) => b + s.reps * s.weight, 0), 0);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/analytics", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Voltar para Analytics"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: saved.date }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-2xl font-bold text-gradient-brand", children: saved.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }), label: "Duração", value: `${saved.duration}min` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5" }), label: "Séries", value: `${completedCount}/${totalSets2}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-3.5 w-3.5" }), label: "Volume", value: totalVolume > 0 ? `${(totalVolume / 1e3).toFixed(1)}t` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5" }), label: "Calorias", value: `${saved.calories} kcal` })
        ] }),
        completedCount === totalSets2 && totalSets2 > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-xs font-semibold text-success", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-3.5 w-3.5" }),
          " Treino 100% concluído!"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShareVideoButton, { composition: SessionSummaryVideo, inputProps: {
          workoutName: saved.name,
          date: saved.date,
          duration: saved.duration,
          completedSets: completedCount,
          totalSets: totalSets2,
          totalVolume,
          calories: saved.calories,
          exercises: saved.exercises.map((ex) => ({
            name: cleanLegacyText(ex.name),
            muscle: cleanLegacyText(ex.muscle),
            sets: ex.sets.length,
            completed: ex.sets.filter((s) => s.completed).length,
            topWeight: Math.max(...ex.sets.map((s) => s.weight ?? 0))
          }))
        }, durationInFrames: 360, title: "Compartilhar sessão" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: saved.exercises.map((ex, i) => {
        const done = ex.sets.filter((s) => s.completed).length;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-semibold", children: cleanLegacyText(ex.name) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                cleanLegacyText(ex.muscle),
                " · ",
                done,
                "/",
                ex.sets.length,
                " séries"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "Volume" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-sm font-bold text-gradient-primary", children: [
                ex.sets.reduce((a, s) => a + s.reps * s.weight, 0).toLocaleString(),
                " kg"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: ex.sets.map((s, j) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `grid grid-cols-12 items-center rounded-xl border px-2 py-2 text-sm ${s.completed ? "border-success/30 bg-success/5" : "border-border bg-elevated/40"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 font-mono text-xs text-muted-foreground", children: [
              "#",
              j + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-4 font-semibold", children: [
              s.reps,
              " reps"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-4 font-semibold", children: s.weight > 0 ? `${s.weight} kg` : "Corporal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 flex justify-end", children: s.completed && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-success" }) })
          ] }, j)) })
        ] }, i);
      }) })
    ] });
  }
  if (!staticEntry) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/analytics", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Voltar"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-10 text-center space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "🏋️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold", children: "Nenhum treino registrado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Complete um treino e ele aparecerá aqui com todas as séries e métricas." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/treinos", className: "inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground", children: "Ir para treinos" })
      ] })
    ] });
  }
  const totalSets = staticEntry.exercises.reduce((a, e) => a + e.sets.length, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/analytics", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Voltar para Analytics"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: staticEntry.date }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-2xl font-bold text-gradient-brand", children: cleanLegacyText(staticEntry.name) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }), label: "Duração", value: `${staticEntry.duration}min` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5" }), label: "Séries", value: String(totalSets) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-3.5 w-3.5" }), label: "Volume", value: `${(staticEntry.volume / 1e3).toFixed(1)}t` })
      ] }),
      staticEntry.prs > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-3.5 w-3.5" }),
        " ",
        staticEntry.prs,
        " Personal Record",
        staticEntry.prs > 1 ? "s" : "",
        " neste treino"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: staticEntry.exercises.map((ex, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-semibold", children: cleanLegacyText(ex.name) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            cleanLegacyText(ex.muscle),
            " | ",
            ex.sets.length,
            " séries"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-sm font-bold text-gradient-primary", children: [
          ex.sets.reduce((a, s) => a + s.reps * s.weight, 0).toLocaleString(),
          " kg"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: ex.sets.map((s, j) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `grid grid-cols-12 items-center rounded-xl border px-2 py-2 text-sm ${s.pr ? "border-primary/40 bg-primary/5" : "border-border bg-elevated/40"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 font-mono text-xs text-muted-foreground", children: [
          "#",
          j + 1
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-4 font-semibold", children: s.reps }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-4 font-semibold", children: s.weight > 0 ? `${s.weight} kg` : "Corporal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 flex justify-end", children: s.pr && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-2.5 w-2.5" }),
          " PR"
        ] }) })
      ] }, j)) })
    ] }, i)) })
  ] });
}
function Stat({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-elevated/40 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-base font-bold", children: value })
  ] });
}
export {
  HistoryDetail as component
};