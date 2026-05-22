import { W as jsxRuntimeExports, r as reactExports } from "./server-C0e4gypg.js";
import { c as createLucideIcon, m as motion, R as Route, u as useNavigate, g as getStoredLocale, l as loadOnboarding, A as AnimatePresence, b as saveOnboarding } from "./router-BDD3RgVy.js";
import { c as cn } from "./utils-Bz4m9VPB.js";
import { C as Check } from "./check-j8hLnasa.js";
import { u as useCurrentFrame, a as useVideoConfig, s as spring, i as interpolate, A as AbsoluteFill, S as Sequence } from "./index-CcuZFuTS.js";
import { G as GradientBackground } from "./VideoPlayerModal-BQaBY8IB.js";
import { B as BrandOverlay } from "./BrandOverlay-B4-tEure.js";
import { A as AnimatedCounter } from "./AnimatedCounter-D13SVpt3.js";
import { S as ShareVideoButton } from "./ShareVideoButton-DuyJVam8.js";
import { a as getOnboardingCopy } from "./app-copy-wxZoQ7QO.js";
import { c as calculateCalories } from "./calorie-calculator-Fx-go2Aq.js";
import { C as ChevronRight } from "./chevron-right-DRYfnruU.js";
import { F as Flame } from "./flame-B4I7h4kj.js";
import { T as Target } from "./target-DclDxru3.js";
import { D as Dumbbell } from "./dumbbell-DL1Diyp6.js";
import { A as Activity } from "./activity-BvoCTLhw.js";
import { Z as Zap } from "./zap-DR4zCOeL.js";
import { T as TrendingUp } from "./trending-up-DCMFIZtG.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
import { C as Camera } from "./camera-BjaEtEca.js";
import { T as Timer } from "./timer-GJNEDQY1.js";
import { H as House } from "./house-DD_2jI5n.js";
import { L as Layers } from "./layers-CfonREYS.js";
import { U as Utensils } from "./utensils-DEbQ0tBJ.js";
import { U as User } from "./user-Bh11TJpu.js";
import { U as Users } from "./users-D_krSHkN.js";
import { M as Moon } from "./moon-DOTTN2ld.js";
import { C as Clock } from "./clock-pfs1_d9-.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
const __iconNode$5 = [
  ["path", { d: "M10 12h4", key: "a56b0p" }],
  ["path", { d: "M10 8h4", key: "1sr2af" }],
  ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3", key: "1rgiei" }],
  [
    "path",
    {
      d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",
      key: "secmi2"
    }
  ],
  ["path", { d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16", key: "16ra0t" }]
];
const Building2 = createLucideIcon("building-2", __iconNode$5);
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleQuestionMark = createLucideIcon("circle-question-mark", __iconNode$4);
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M16 16s-1.5-2-4-2-4 2-4 2", key: "epbg0q" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }]
];
const Frown = createLucideIcon("frown", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5", key: "qeys4" }],
  [
    "path",
    {
      d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09",
      key: "u4xsad"
    }
  ],
  [
    "path",
    {
      d: "M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z",
      key: "676m9"
    }
  ],
  ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05", key: "92ym6u" }]
];
const Rocket = createLucideIcon("rocket", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M12 3v18", key: "108xh3" }],
  ["path", { d: "m19 8 3 8a5 5 0 0 1-6 0zV7", key: "zcdpyk" }],
  ["path", { d: "M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1", key: "1yorad" }],
  ["path", { d: "m5 8 3 8a5 5 0 0 1-6 0zV7", key: "eua70x" }],
  ["path", { d: "M7 21h10", key: "1b0cd5" }]
];
const Scale = createLucideIcon("scale", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z", key: "1l6gj6" }],
  ["path", { d: "M7 16v6", key: "1a82de" }],
  ["path", { d: "M13 19v3", key: "13sx9i" }],
  [
    "path",
    {
      d: "M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5",
      key: "1sj9kv"
    }
  ]
];
const Trees = createLucideIcon("trees", __iconNode);
function OnboardingCelebrationVideo({
  name = "Atleta",
  goal = "Hipertrofia",
  level = "Intermediário",
  targetCalories = 2800,
  protein = 180,
  daysPerWeek = 4,
  modality = "Musculação"
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ frame, fps, config: { damping: 10, stiffness: 80 } });
  const titleOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const stars = [0, 1, 2, 3, 4, 5].map((i) => ({
    x: 20 + Math.sin(i * 1.1) * 40 + i * 14,
    y: Math.cos(i * 0.9) * 20 + 10,
    scale: spring({ frame: frame - i * 4, fps, config: { damping: 12, stiffness: 150 } })
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AbsoluteFill, { style: { fontFamily: "sans-serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GradientBackground, { variant: "workout" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandOverlay, { position: "top" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 130, left: 0, right: 0, display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "relative", width: 300, height: 60 }, children: stars.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      left: s.x * 3,
      top: s.y,
      transform: `scale(${s.scale})`,
      fontSize: 24
    }, children: "✨" }, i)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 200, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { transform: `scale(${logoScale})`, fontSize: 80, marginBottom: 20 }, children: "🎯" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { opacity: titleOpacity, textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 16, color: "rgba(148,163,184,0.7)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }, children: "Plano criado com IA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: -1,
          background: "linear-gradient(90deg,#fb923c,#ffffff,#22d3ee)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }, children: name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { opacity: subtitleOpacity, marginTop: 16, display: "flex", gap: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: "#22d3ee", background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 999, padding: "5px 14px", fontWeight: 700 }, children: level }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: "#fb923c", background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 999, padding: "5px 14px", fontWeight: 700 }, children: goal }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: "#a78bfa", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 999, padding: "5px 14px", fontWeight: 700 }, children: modality })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 45, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 430, left: 48, right: 48 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.2)", borderRadius: 24, padding: 28 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(148,163,184,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16, textAlign: "center" }, children: "Seu plano calórico" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: 20 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCounter, { from: 0, to: targetCalories, startFrame: 0, endFrame: 40, style: {
          fontSize: 60,
          fontWeight: 900,
          background: "linear-gradient(135deg,#22d3ee,#3b82f6,#fb923c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, color: "rgba(148,163,184,0.5)", letterSpacing: 3 }, children: "KCAL/DIA" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", gap: 24 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(148,163,184,0.4)", letterSpacing: 2, textTransform: "uppercase" }, children: "Proteína" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCounter, { from: 0, to: protein, startFrame: 10, endFrame: 50, suffix: "g", style: { fontSize: 26, fontWeight: 900, color: "#22d3ee" } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(148,163,184,0.4)", letterSpacing: 2, textTransform: "uppercase" }, children: "Dias/sem" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 26, fontWeight: 900, color: "#fb923c" }, children: [
            daysPerWeek,
            "x"
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 80, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 680, left: 0, right: 0, textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 16, color: "rgba(148,163,184,0.5)", letterSpacing: 2 }, children: "Bloco de 12 semanas · Começa agora" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandOverlay, { position: "bottom" })
  ] });
}
function OptionCard({ active, onClick, icon, title, subtitle, multi, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      type: "button",
      whileTap: { scale: 0.98 },
      onClick,
      className: cn(
        "group relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
        active ? "border-primary/60 bg-elevated shadow-glow-primary" : "border-border bg-surface hover:border-primary/30 hover:bg-elevated/60",
        className
      ),
      children: [
        icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "grid h-12 w-12 shrink-0 place-items-center rounded-xl transition",
              active ? "bg-gradient-primary text-primary-foreground" : "bg-elevated text-cyan"
            ),
            children: icon
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold text-foreground", children: title }),
          subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: subtitle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition",
              multi ? "rounded-md" : "",
              active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
            ),
            children: active && (multi ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 w-2.5 rounded-full bg-primary-foreground" }))
          }
        )
      ]
    }
  );
}
function PrimaryButton({ children, className, variant = "primary", size = "md", ...rest }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none";
  const sizes = { md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const variants = {
    primary: "bg-gradient-primary text-primary-foreground shadow-glow-primary hover:opacity-95",
    ghost: "text-muted-foreground hover:text-foreground",
    outline: "border border-border bg-surface text-foreground hover:bg-elevated"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.button,
    {
      whileTap: { scale: 0.97 },
      className: cn(base, sizes[size], variants[variant], className),
      ...rest,
      children
    }
  );
}
const TOTAL = 12;
function fmt(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
function StepPage() {
  const {
    step
  } = Route.useParams();
  const navigate = useNavigate();
  const stepNum = Math.max(1, Math.min(TOTAL, parseInt(step, 10) || 1));
  const [state, setState] = reactExports.useState({});
  const locale = getStoredLocale();
  const copy = getOnboardingCopy(locale);
  reactExports.useEffect(() => {
    setState(loadOnboarding());
  }, []);
  const update = (patch) => {
    setState((prev) => {
      const next2 = {
        ...prev,
        ...patch
      };
      saveOnboarding(next2);
      return next2;
    });
  };
  const canContinue = reactExports.useMemo(() => {
    switch (stepNum) {
      case 1:
        return !!state.goal;
      case 2:
        return !!state.problem;
      case 3:
        return !!state.experience;
      case 4:
        return !!state.weight && !!state.height && !!state.age;
      case 5:
        return !!state.metabolismType;
      case 6:
        return (state.focusMuscles?.length ?? 0) > 0;
      case 7:
        if (!state.location) return false;
        if (state.location === "gym" || state.location === "hybrid") {
          return !!state.gymSize && !!state.crowdLevel;
        }
        return true;
      case 8:
        return !!state.trainingType;
      case 9: {
        if (state.trainingType === "calistenia") return true;
        if (state.location === "home" || state.location === "outdoor") return true;
        return (state.equipment?.length ?? 0) > 0;
      }
      case 10:
        return !!state.mealFrequency;
      case 11:
        return !!state.gender && (state.days?.length ?? 0) > 0 && !!state.duration;
      default:
        return true;
    }
  }, [state, stepNum]);
  const next = () => {
    if (stepNum < TOTAL) {
      navigate({
        to: "/onboarding/$step",
        params: {
          step: String(stepNum + 1)
        }
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      x: 16
    }, animate: {
      opacity: 1,
      x: 0
    }, exit: {
      opacity: 0,
      x: -16
    }, transition: {
      duration: 0.25
    }, children: [
      stepNum === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step1, { state, update, copy }),
      stepNum === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step2, { state, update, copy }),
      stepNum === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step3, { state, update, copy }),
      stepNum === 4 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step4, { state, update, copy }),
      stepNum === 5 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step5, { state, update, copy }),
      stepNum === 6 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step6, { state, update, copy }),
      stepNum === 7 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step7, { state, update, copy }),
      stepNum === 8 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepTrainingType, { state, update, copy }),
      stepNum === 9 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step8, { state, update, copy }),
      stepNum === 10 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step9, { state, update, copy }),
      stepNum === 11 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step10, { state, update, copy }),
      stepNum === 12 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step11, { state, copy })
    ] }, stepNum) }) }),
    stepNum < TOTAL && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex max-w-xl justify-end px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PrimaryButton, { onClick: next, disabled: !canContinue, children: [
      copy.stepNext,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
    ] }) }) })
  ] });
}
function Heading({
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold leading-tight md:text-4xl text-gradient-brand", children: title }),
    subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground md:text-base", children: subtitle })
  ] });
}
function Step1({
  state,
  update,
  copy
}) {
  const fileInputRef = reactExports.useRef(null);
  const opts = [{
    id: "weight_loss",
    title: copy.goals.weight_loss.title,
    subtitle: copy.goals.weight_loss.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5" }),
    color: "#f87171"
  }, {
    id: "definition",
    title: copy.goals.definition.title,
    subtitle: copy.goals.definition.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-5 w-5" }),
    color: "#fb923c"
  }, {
    id: "mass",
    title: copy.goals.mass.title,
    subtitle: copy.goals.mass.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-5 w-5" }),
    color: "#22d3ee"
  }, {
    id: "strength",
    title: copy.goals.strength.title,
    subtitle: copy.goals.strength.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5" }),
    color: "#a78bfa"
  }, {
    id: "hybrid",
    title: copy.goals.hybrid.title,
    subtitle: copy.goals.hybrid.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }),
    color: "#4ade80"
  }, {
    id: "athletic",
    title: copy.goals.athletic.title,
    subtitle: copy.goals.athletic.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5" }),
    color: "#3b82f6"
  }, {
    id: "endurance",
    title: copy.goals.endurance.title,
    subtitle: copy.goals.endurance.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "h-5 w-5" }),
    color: "#34d399"
  }, {
    id: "wellness",
    title: copy.goals.wellness.title,
    subtitle: copy.goals.wellness.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }),
    color: "#f9a8d4"
  }];
  const previewName = state.name?.trim() || state.email?.trim() || copy.defaultName;
  const initials = previewName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("").slice(0, 2) || "AZ";
  const onAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") update({
        avatarUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { title: copy.focusTitle, subtitle: copy.focusSubtitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 rounded-3xl border border-border bg-surface p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => fileInputRef.current?.click(), className: "grid h-18 w-18 shrink-0 place-items-center overflow-hidden rounded-[1.6rem] bg-gradient-primary text-lg font-black text-primary-foreground shadow-glow-primary", children: state.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: state.avatarUrl, alt: previewName, className: "h-full w-full object-cover" }) : initials }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: copy.nameLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: state.name ?? "", onChange: (event) => update({
          name: event.target.value
        }), placeholder: copy.namePlaceholder, className: "w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-primary/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => fileInputRef.current?.click(), className: "mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-3.5 w-3.5" }),
          copy.addPhoto
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", className: "hidden", onChange: onAvatarChange })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: opts.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => update({
      goal: o.id
    }), className: cn("relative rounded-2xl border p-4 text-left transition-all duration-200", state.goal === o.id ? "border-primary/50 bg-surface shadow-glow-primary" : "border-border bg-surface/50 hover:border-border/80 hover:bg-surface"), children: [
      state.goal === o.id && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { layoutId: "goal-indicator", className: "absolute inset-0 rounded-2xl", style: {
        border: `1.5px solid ${o.color}50`,
        background: `${o.color}08`
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 rounded-xl p-1.5", style: {
          background: `${o.color}15`,
          color: o.color
        }, children: o.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-sm font-bold", children: o.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-xs text-muted-foreground", children: o.subtitle })
        ] })
      ] })
    ] }, o.id)) })
  ] });
}
function Step2({
  state,
  update,
  copy
}) {
  const problems = [{
    id: "no_results",
    label: copy.problems.no_results.label,
    subtitle: copy.problems.no_results.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Frown, { className: "h-5 w-5" })
  }, {
    id: "no_time",
    label: copy.problems.no_time.label,
    subtitle: copy.problems.no_time.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-5 w-5" })
  }, {
    id: "no_plan",
    label: copy.problems.no_plan.label,
    subtitle: copy.problems.no_plan.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "h-5 w-5" })
  }, {
    id: "no_motivation",
    label: copy.problems.no_motivation.label,
    subtitle: copy.problems.no_motivation.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" })
  }, {
    id: "plateau",
    label: copy.problems.plateau.label,
    subtitle: copy.problems.plateau.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5" })
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { title: copy.problemTitle, subtitle: copy.problemSubtitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: problems.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(OptionCard, { active: state.problem === p.id, onClick: () => update({
      problem: p.id
    }), icon: p.icon, title: p.label, subtitle: p.subtitle }, p.id)) })
  ] });
}
function Step3({
  state,
  update,
  copy
}) {
  const opts = [{
    id: "beginner",
    title: copy.experience.beginner.title,
    subtitle: copy.experience.beginner.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "h-5 w-5" })
  }, {
    id: "intermediate",
    title: copy.experience.intermediate.title,
    subtitle: copy.experience.intermediate.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-5 w-5" })
  }, {
    id: "advanced",
    title: copy.experience.advanced.title,
    subtitle: copy.experience.advanced.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" })
  }];
  const ormFields = [{
    key: "bench",
    label: copy.ormBench,
    placeholder: "100"
  }, {
    key: "squat",
    label: copy.ormSquat,
    placeholder: "120"
  }, {
    key: "deadlift",
    label: copy.ormDeadlift,
    placeholder: "140"
  }, {
    key: "ohp",
    label: copy.ormOhp,
    placeholder: "70"
  }];
  const showOrm = state.experience === "intermediate" || state.experience === "advanced";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { title: copy.experienceTitle, subtitle: copy.experienceSubtitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: opts.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(OptionCard, { active: state.experience === o.id, onClick: () => update({
      experience: o.id
    }), icon: o.icon, title: o.title, subtitle: o.subtitle }, o.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showOrm && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      height: 0
    }, animate: {
      opacity: 1,
      height: "auto"
    }, exit: {
      opacity: 0,
      height: 0
    }, transition: {
      duration: 0.3
    }, className: "mt-5 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-primary/20 bg-surface p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-lg bg-primary/15 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-[0.18em] text-primary", children: copy.ormTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: copy.ormSubtitle })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ormFields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground", children: f.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 10, max: 500, value: state.oneRepMax?.[f.key] ?? "", onChange: (e) => update({
            oneRepMax: {
              ...state.oneRepMax,
              [f.key]: e.target.value ? Number(e.target.value) : void 0
            }
          }), placeholder: f.placeholder, className: "w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm font-bold text-white outline-none transition focus:border-primary/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: "kg" })
        ] })
      ] }, f.key)) })
    ] }) }) })
  ] });
}
function Step4({
  state,
  update,
  copy
}) {
  const weightVal = state.weight ?? "";
  const heightVal = state.height ?? "";
  const ageVal = state.age ?? "";
  const hasAll = !!state.weight && !!state.height && !!state.age;
  const bmi = hasAll ? state.weight / (state.height / 100) ** 2 : null;
  const bmiLabel = !bmi ? "" : bmi < 18.5 ? copy.bmiUnderweight : bmi < 25 ? copy.bmiHealthy : bmi < 30 ? copy.bmiOverweight : copy.bmiObese;
  const bmiColor = !bmi ? "" : bmi < 18.5 ? "#22d3ee" : bmi < 25 ? "#4ade80" : bmi < 30 ? "#fb923c" : "#f87171";
  const fields = [{
    key: "weight",
    label: copy.weightLabel,
    unit: "kg",
    min: 30,
    max: 300,
    placeholder: "70",
    color: "#22d3ee",
    val: weightVal
  }, {
    key: "height",
    label: copy.heightLabel,
    unit: "cm",
    min: 100,
    max: 250,
    placeholder: "175",
    color: "#fb923c",
    val: heightVal
  }, {
    key: "age",
    label: copy.ageLabel,
    unit: copy.ageUnit,
    min: 12,
    max: 100,
    placeholder: "25",
    color: "#a78bfa",
    val: ageVal
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { title: copy.bodyProfileTitle, subtitle: copy.bodyProfileSubtitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]", style: {
          color: f.color
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-3.5 w-3.5" }),
          " ",
          f.label
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: f.min, max: f.max, value: f.val, onChange: (e) => update({
            [f.key]: e.target.value ? Number(e.target.value) : void 0
          }), placeholder: f.placeholder, className: "flex-1 rounded-2xl border border-border bg-background/60 px-4 py-3 text-2xl font-black text-white outline-none transition focus:border-primary/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-semibold text-muted-foreground", children: f.unit })
        ] })
      ] }, f.key)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: hasAll && bmi && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0
      }, className: "rounded-2xl p-4", style: {
        background: `${bmiColor}0d`,
        border: `1px solid ${bmiColor}33`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.15em]", style: {
              color: `${bmiColor}bb`
            }, children: copy.bmiLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl font-black", style: {
              color: bmiColor
            }, children: bmi.toFixed(1) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold", style: {
              color: bmiColor
            }, children: bmiLabel })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-xs text-muted-foreground space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              copy.weightLabel,
              ": ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                state.weight,
                " kg"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              copy.heightLabel,
              ": ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                state.height,
                " cm"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              copy.ageLabel,
              ": ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                state.age,
                " ",
                copy.ageUnit
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-2 w-full overflow-hidden rounded-full bg-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all duration-500", style: {
          width: `${Math.min(100, Math.max(0, (bmi - 15) / 25 * 100))}%`,
          background: `linear-gradient(90deg, #22d3ee, #4ade80, #fb923c, #f87171)`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex justify-between text-[9px] text-muted-foreground/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "15" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "18.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "25" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "40" })
        ] })
      ] }) })
    ] })
  ] });
}
function Step5({
  state,
  update,
  copy
}) {
  const opts = [{
    id: "slow",
    label: copy.metabolismSlow.label,
    subtitle: copy.metabolismSlow.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5", style: {
      color: "#fb923c"
    } })
  }, {
    id: "balanced",
    label: copy.metabolismBalanced.label,
    subtitle: copy.metabolismBalanced.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5", style: {
      color: "#22d3ee"
    } })
  }, {
    id: "fast",
    label: copy.metabolismFast.label,
    subtitle: copy.metabolismFast.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5", style: {
      color: "#4ade80"
    } })
  }];
  const macros = state.metabolismType && state.weight && state.height && state.age && state.goal ? calculateCalories({
    weight: state.weight,
    height: state.height,
    age: state.age,
    gender: state.gender ?? "male",
    activityDays: state.days?.length ?? 4,
    metabolismType: state.metabolismType,
    goal: state.goal
  }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { title: copy.metabolismTitle, subtitle: copy.metabolismSubtitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: opts.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(OptionCard, { active: state.metabolismType === o.id, onClick: () => update({
      metabolismType: o.id
    }), icon: o.icon, title: o.label, subtitle: o.subtitle }, o.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: macros ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 14
    }, animate: {
      opacity: 1,
      y: 0
    }, exit: {
      opacity: 0,
      y: -8
    }, transition: {
      duration: 0.35
    }, className: "mt-5 rounded-3xl border border-primary/20 bg-surface p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-7 w-7 place-items-center rounded-xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-[0.18em] text-primary", children: copy.caloricPlanTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: macros.label })
        ] }),
        macros.surplusOrDeficit !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("ml-auto rounded-full px-2 py-1 text-[10px] font-bold", macros.surplusOrDeficit > 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"), children: [
          macros.surplusOrDeficit > 0 ? "+" : "",
          macros.surplusOrDeficit,
          " kcal"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-2 border-y border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-5xl font-black", style: {
          background: "linear-gradient(135deg,#22d3ee,#3b82f6,#fb923c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }, children: macros.target }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground", children: copy.kcalDay })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacroBar, { label: copy.macroProtein, value: macros.protein, unit: "g", color: "#22d3ee", pct: Math.round(macros.protein * 4 / macros.target * 100) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacroBar, { label: copy.macroCarbs, value: macros.carbs, unit: "g", color: "#fb923c", pct: Math.round(macros.carbs * 4 / macros.target * 100) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacroBar, { label: copy.macroFat, value: macros.fat, unit: "g", color: "#a78bfa", pct: Math.round(macros.fat * 9 / macros.target * 100) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 border-t border-border/50 pt-3 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-elevated p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: copy.tmbLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-base font-bold text-foreground", children: [
            macros.bmr,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-muted-foreground", children: "kcal" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-elevated p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: copy.tdeeLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-base font-bold text-foreground", children: [
            macros.tdee,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-muted-foreground", children: "kcal" })
          ] })
        ] })
      ] }),
      !state.gender && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60", children: copy.metabolismNote })
    ] }, state.metabolismType) : state.metabolismType ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, exit: {
      opacity: 0
    }, className: "mt-4 rounded-2xl p-3 text-xs text-muted-foreground", style: {
      background: "rgba(34,211,238,0.05)",
      border: "1px solid rgba(34,211,238,0.15)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", style: {
        color: "#22d3ee"
      }, children: copy.aiNutritionLabel }),
      copy.fillBodyDataMsg
    ] }, "missing") : /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, exit: {
      opacity: 0
    }, className: "mt-4 rounded-2xl p-3 text-xs text-muted-foreground", style: {
      background: "rgba(34,211,238,0.05)",
      border: "1px solid rgba(34,211,238,0.15)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", style: {
        color: "#22d3ee"
      }, children: copy.aiNutritionLabel }),
      copy.selectMetabolismMsg
    ] }, "hint") })
  ] });
}
function MacroBar({
  label,
  value,
  unit,
  color,
  pct
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-elevated p-3 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-xl font-bold mt-1", style: {
      color
    }, children: [
      value,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-muted-foreground ml-0.5", children: unit })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-1 w-full overflow-hidden rounded-full bg-background/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      width: 0
    }, animate: {
      width: `${Math.min(100, pct)}%`
    }, transition: {
      duration: 0.6,
      ease: "easeOut"
    }, className: "h-full rounded-full", style: {
      background: color
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] text-muted-foreground", children: [
      pct,
      "%"
    ] })
  ] });
}
function Step6({
  state,
  update,
  copy
}) {
  const selected = state.focusMuscles ?? [];
  const toggle = (m) => {
    const next = selected.includes(m) ? selected.filter((x) => x !== m) : [...selected, m];
    update({
      focusMuscles: next
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { title: copy.focusMuscleTitle, subtitle: copy.focusMuscleSubtitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: copy.muscleGroups.map((m) => {
      const active = selected.includes(m);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggle(m), className: cn("rounded-full border px-4 py-2 text-sm font-medium transition", active ? "border-cyan/60 bg-cyan/10 text-cyan shadow-glow-cyan" : "border-border bg-surface text-foreground hover:border-cyan/30"), children: m }, m);
    }) }),
    selected.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, className: "mt-4 rounded-2xl p-3 text-xs", style: {
      background: "rgba(34,211,238,0.06)",
      border: "1px solid rgba(34,211,238,0.15)",
      color: "rgba(148,163,184,0.75)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", style: {
        color: "#22d3ee"
      }, children: "IA: " }),
      copy.aiVolumeHintPre,
      " ",
      selected.slice(0, 3).join(", "),
      selected.length > 3 ? ` +${selected.length - 3}` : "",
      ". ",
      copy.aiVolumeHintSuf
    ] })
  ] });
}
function Step7({
  state,
  update,
  copy
}) {
  const opts = [{
    id: "gym",
    title: copy.locations.gym.title,
    subtitle: copy.locations.gym.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5" }),
    color: "#fb923c"
  }, {
    id: "home",
    title: copy.locations.home.title,
    subtitle: copy.locations.home.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-5 w-5" }),
    color: "#22d3ee"
  }, {
    id: "hybrid",
    title: copy.locations.hybrid.title,
    subtitle: copy.locations.hybrid.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-5 w-5" }),
    color: "#38bdf8"
  }, {
    id: "outdoor",
    title: copy.locations.outdoor.title,
    subtitle: copy.locations.outdoor.subtitle,
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trees, { className: "h-5 w-5" }),
    color: "#4ade80"
  }];
  const needsGymContext = state.location === "gym" || state.location === "hybrid";
  const selectLocation = (location) => {
    update({
      location,
      gymSize: location === "gym" || location === "hybrid" ? state.gymSize : void 0,
      crowdLevel: location === "gym" || location === "hybrid" ? state.crowdLevel : void 0,
      equipmentAvailability: location === "gym" ? "alta" : location === "hybrid" ? "media" : location === "home" ? "baixa" : "media",
      equipment: state.location !== location ? [] : state.equipment
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { title: copy.locationTitle, subtitle: copy.locationSubtitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: opts.map((option) => {
      const active = state.location === option.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => selectLocation(option.id), className: cn("relative min-h-[116px] select-none rounded-3xl border p-4 text-left transition-all", active ? "border-primary/60 bg-elevated shadow-glow-primary" : "border-border bg-surface hover:border-primary/30 hover:bg-elevated/60"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl", style: {
            background: active ? option.color : `${option.color}18`,
            color: active ? "#020617" : option.color
          }, children: option.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-bold leading-tight text-foreground", children: option.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm leading-snug text-muted-foreground", children: option.subtitle })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground", children: "Ambiente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("grid h-6 w-6 place-items-center rounded-full border transition", active ? "border-primary bg-primary" : "border-muted-foreground/40"), children: active ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-primary-foreground" }) : null })
        ] })
      ] }) }, option.id);
    }) }),
    needsGymContext && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 10
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "mt-5 rounded-3xl border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: "Detalhes da academia" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Isso ajuda a IA a evitar máquinas concorridas e escolher alternativas melhores." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground", children: copy.gymSizeTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [{
            id: "pequena",
            label: copy.gymSizes.pequena
          }, {
            id: "media",
            label: copy.gymSizes.media
          }, {
            id: "grande",
            label: copy.gymSizes.grande
          }].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => update({
            gymSize: opt.id
          }), className: cn("rounded-2xl border px-3 py-2.5 text-sm font-semibold transition", state.gymSize === opt.id ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border-border bg-background/50 text-foreground hover:border-primary/30"), children: opt.label }, opt.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground", children: copy.crowdLevelTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [{
            id: "vazio",
            label: copy.crowdLevels.vazio
          }, {
            id: "normal",
            label: copy.crowdLevels.normal
          }, {
            id: "pico",
            label: copy.crowdLevels.pico
          }].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => update({
            crowdLevel: opt.id
          }), className: cn("rounded-2xl border px-3 py-2.5 text-sm font-semibold transition", state.crowdLevel === opt.id ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border-border bg-background/50 text-foreground hover:border-primary/30"), children: opt.label }, opt.id)) })
        ] })
      ] })
    ] })
  ] });
}
function StepTrainingType({
  state,
  update
}) {
  const selectTrainingType = (trainingType) => {
    update({
      trainingType,
      equipment: filterEquipmentForContext(state.equipment ?? [], state.location ?? "gym", trainingType)
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { title: "Como você quer treinar?", subtitle: "Essa escolha define quais exercícios e treinos a IA vai montar para você." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => selectTrainingType("musculacao"), className: cn("relative w-full rounded-2xl border p-5 text-left transition-all duration-200", state.trainingType === "musculacao" ? "border-primary/50 bg-surface shadow-glow-primary" : "border-border bg-surface/50 hover:border-border/80 hover:bg-surface"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 rounded-xl p-2", style: {
          background: "rgba(34,211,238,0.12)",
          color: "#22d3ee"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-bold", children: "Musculação" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: "Treino com pesos — halteres, barras, máquinas e cabos. Academia ou em casa com equipamentos." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => selectTrainingType("funcional"), className: cn("relative w-full rounded-2xl border p-5 text-left transition-all duration-200", state.trainingType === "funcional" ? "border-primary/50 bg-surface shadow-glow-primary" : "border-border bg-surface/50 hover:border-border/80 hover:bg-surface"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 rounded-xl p-2", style: {
          background: "rgba(34,211,238,0.12)",
          color: "#22d3ee"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-bold", children: "Funcional" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: "Treino com movimentos completos — força, core, estabilidade, potência e condicionamento." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => selectTrainingType("calistenia"), className: cn("relative w-full rounded-2xl border p-5 text-left transition-all duration-200", state.trainingType === "calistenia" ? "border-primary/50 bg-surface shadow-glow-primary" : "border-border bg-surface/50 hover:border-border/80 hover:bg-surface"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 rounded-xl p-2", style: {
          background: "rgba(251,146,60,0.12)",
          color: "#fb923c"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-bold", children: "Calistenia" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: "Treino com peso corporal — flexões, barras, paralelas e movimentos funcionais. Pode fazer em qualquer lugar." })
        ] })
      ] }) })
    ] })
  ] });
}
const strengthEquipmentByLocation = {
  home: ["Halteres", "Barras", "Anilhas", "Banco", "Rack", "Barra fixa", "Paralelas", "Argolas", "Kettlebell", "Elásticos", "Roda abdominal"],
  gym: ["Halteres", "Barras", "Anilhas", "Banco", "Rack", "Cabos", "Máquinas", "Barra fixa", "Paralelas", "Argolas", "Kettlebell", "Elásticos", "Roda abdominal"],
  hybrid: ["Halteres", "Barras", "Anilhas", "Banco", "Rack", "Cabos", "Máquinas", "Barra fixa", "Paralelas", "Argolas", "Kettlebell", "Elásticos", "Roda abdominal"],
  outdoor: ["Barra fixa", "Paralelas", "Argolas", "Elásticos"]
};
const functionalEquipmentByLocation = {
  home: ["Peso corporal", "Tapete/colchonete", "Elásticos", "Barra fixa", "Paralelas", "Argolas", "Roda abdominal", "Corda", "Caixa/step"],
  gym: ["Peso corporal", "Tapete/colchonete", "TRX", "Bola", "Elásticos", "Barra fixa", "Paralelas", "Argolas", "Roda abdominal", "Corda", "Caixa/step"],
  hybrid: ["Peso corporal", "Tapete/colchonete", "TRX", "Bola", "Elásticos", "Barra fixa", "Paralelas", "Argolas", "Roda abdominal", "Corda", "Caixa/step"],
  outdoor: ["Peso corporal", "Barra fixa", "Paralelas", "Argolas", "Elásticos", "Corda"]
};
function resolveEquipmentList(location, trainingType) {
  if (trainingType === "funcional") {
    return functionalEquipmentByLocation[location] ?? functionalEquipmentByLocation.home;
  }
  return strengthEquipmentByLocation[location] ?? strengthEquipmentByLocation.gym;
}
function filterEquipmentForContext(equipment, location, trainingType) {
  const allowed = resolveEquipmentList(location, trainingType);
  return equipment.filter((item) => allowed.includes(item));
}
function Step8({
  state,
  update,
  copy
}) {
  const selected = state.equipment ?? [];
  const location = state.location ?? "gym";
  const equipmentList = resolveEquipmentList(location, state.trainingType);
  const allSelected = equipmentList.every((eq) => selected.includes(eq));
  if (state.trainingType === "calistenia") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { title: "Equipamentos", subtitle: "Calistenia usa apenas peso corporal." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "mx-auto mb-3 h-10 w-10 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-bold", children: "Nenhum equipamento necessário" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Seus treinos de calistenia usam apenas o peso do seu corpo — você pode treinar em qualquer lugar." })
      ] })
    ] });
  }
  const toggle = (eq) => {
    const next = selected.includes(eq) ? selected.filter((x) => x !== eq) : [...selected, eq];
    update({
      equipment: filterEquipmentForContext(next, location, state.trainingType)
    });
  };
  const toggleAll = () => {
    update({
      equipment: allSelected ? [] : [...equipmentList]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { title: copy.equipmentTitle, subtitle: "A IA monta o plano com base no que você realmente tem." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
        selected.filter((e) => equipmentList.includes(e)).length,
        " de ",
        equipmentList.length,
        " selecionados"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: toggleAll, className: "rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10", children: allSelected ? "Desmarcar todos" : "Selecionar todos" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: equipmentList.map((eq) => {
      const active = selected.includes(eq);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggle(eq), className: cn("rounded-full border px-4 py-2 text-sm font-medium transition", active ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border-border bg-surface text-foreground hover:border-primary/30"), children: eq }, eq);
    }) })
  ] });
}
function Step9({
  state,
  update,
  copy
}) {
  const meals = [{
    id: "2",
    label: copy.mealOptions.m2.label,
    subtitle: copy.mealOptions.m2.subtitle
  }, {
    id: "3",
    label: copy.mealOptions.m3.label,
    subtitle: copy.mealOptions.m3.subtitle
  }, {
    id: "4-5",
    label: copy.mealOptions.m45.label,
    subtitle: copy.mealOptions.m45.subtitle
  }, {
    id: "6+",
    label: copy.mealOptions.m6.label,
    subtitle: copy.mealOptions.m6.subtitle
  }];
  const diets = [{
    id: "none",
    label: copy.dietOptions.none
  }, {
    id: "low_carb",
    label: copy.dietOptions.low_carb
  }, {
    id: "high_protein",
    label: copy.dietOptions.high_protein
  }, {
    id: "vegan",
    label: copy.dietOptions.vegan
  }, {
    id: "if",
    label: copy.dietOptions.if
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { title: copy.nutritionHabitsTitle, subtitle: copy.nutritionHabitsSubtitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs font-bold uppercase tracking-[0.15em]", style: {
        color: "rgba(148,163,184,0.6)"
      }, children: copy.mealsPerDayLabel }),
      meals.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(OptionCard, { active: state.mealFrequency === m.id, onClick: () => update({
        mealFrequency: m.id
      }), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Utensils, { className: "h-5 w-5" }), title: m.label, subtitle: m.subtitle }, m.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs font-bold uppercase tracking-[0.15em]", style: {
        color: "rgba(148,163,184,0.6)"
      }, children: copy.dietStyleLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: diets.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update({
        dietType: state.dietType === d.id ? void 0 : d.id
      }), className: cn("rounded-full border px-3 py-1.5 text-sm font-medium transition", state.dietType === d.id ? "border-primary/60 bg-gradient-primary text-primary-foreground" : "border-border bg-surface text-foreground hover:border-primary/30"), children: d.label }, d.id)) })
    ] })
  ] });
}
function Step10({
  state,
  update,
  copy
}) {
  const days = state.days ?? [];
  const duration = state.duration ?? 60;
  const cyclePhases = [{
    id: "menstrual",
    label: "Menstrual",
    note: "mais leve"
  }, {
    id: "follicular",
    label: "Folicular",
    note: "progressão"
  }, {
    id: "ovulatory",
    label: "Ovulatória",
    note: "pico"
  }, {
    id: "luteal",
    label: "Lútea",
    note: "controle"
  }];
  const toggleDay = (d) => {
    const next = days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort((a, b) => a - b);
    update({
      days: next
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { title: copy.cycleRoutineTitle, subtitle: copy.cycleRoutineSubtitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs font-bold uppercase tracking-[0.15em]", style: {
        color: "rgba(148,163,184,0.6)"
      }, children: copy.biologicalSexLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [{
        id: "male",
        label: copy.genderMale,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" })
      }, {
        id: "female",
        label: copy.genderFemale,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" })
      }, {
        id: "other",
        label: copy.genderOther,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" })
      }].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => update({
        gender: g.id,
        trackCycle: g.id === "female" ? state.trackCycle : false,
        menstrualCyclePhase: g.id === "female" ? state.menstrualCyclePhase : void 0
      }), className: cn("flex flex-1 items-center justify-center gap-1.5 rounded-2xl border py-3 text-sm font-semibold transition", state.gender === g.id ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border-border bg-surface text-foreground hover:border-primary/30"), children: [
        g.icon,
        " ",
        g.label
      ] }, g.id)) })
    ] }),
    state.gender === "female" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 8
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs font-bold uppercase tracking-[0.15em]", style: {
        color: "rgba(148,163,184,0.6)"
      }, children: copy.hormonalCycleLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update({
        trackCycle: !state.trackCycle,
        menstrualCyclePhase: !state.trackCycle ? state.menstrualCyclePhase ?? "follicular" : void 0
      }), className: cn("w-full rounded-2xl border p-4 text-left text-sm transition", state.trackCycle ? "border-cyan/50 bg-cyan/5 text-foreground" : "border-border bg-surface text-muted-foreground hover:border-cyan/30"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: cn("h-5 w-5", state.trackCycle ? "text-cyan" : "text-muted-foreground") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: copy.trackCycleTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: copy.trackCycleSubtitle })
        ] })
      ] }) }),
      state.trackCycle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4", children: cyclePhases.map((phase) => {
        const active = state.menstrualCyclePhase === phase.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => update({
          menstrualCyclePhase: phase.id
        }), className: cn("rounded-2xl border px-3 py-2 text-left transition", active ? "border-primary/60 bg-primary/10 text-foreground" : "border-border bg-surface text-muted-foreground hover:border-primary/30"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: phase.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.16em]", children: phase.note })
        ] }, phase.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs font-bold uppercase tracking-[0.15em]", style: {
        color: "rgba(148,163,184,0.6)"
      }, children: copy.daysTitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1.5", children: copy.weekdaysShort.map((label, i) => {
        const active = days.includes(i);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleDay(i), className: cn("aspect-square rounded-2xl border text-base font-semibold transition", active ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border-border bg-surface text-foreground hover:border-primary/30"), children: label }, i);
      }) }),
      days.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
        days.length,
        copy.perWeekLabel,
        " · ",
        days.map((d) => copy.weekdaysFull[d]).join(", ")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs font-bold uppercase tracking-[0.15em]", style: {
        color: "rgba(148,163,184,0.6)"
      }, children: copy.durationTitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-gradient-surface p-5 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "mx-auto mb-2 h-5 w-5 text-cyan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-5xl font-bold text-gradient-primary", children: duration }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-xs uppercase tracking-widest text-muted-foreground", children: copy.minutes }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 30, max: 120, step: 5, value: duration, onChange: (e) => update({
          duration: parseInt(e.target.value, 10)
        }), className: "mt-4 w-full accent-[var(--primary)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "30 min" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "75 min" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "120 min" })
        ] })
      ] })
    ] })
  ] });
}
function buildPersonalizedPhases(state, copy) {
  const goal = copy.goalLabels[state.goal ?? ""] ?? "fitness";
  const exp = copy.expLabels[state.experience ?? ""] ?? "";
  const loc = copy.locLabels[state.location ?? ""] ?? "";
  const days = state.days?.length ?? 4;
  const duration = state.duration ?? 60;
  const equipCount = state.equipment?.length ?? 0;
  const name = state.name?.split(" ")[0] || "você";
  let caloriePhase = copy.phaseCaloriesDefault;
  if (state.weight && state.height && state.age && state.metabolismType && state.goal) {
    const m = calculateCalories({
      weight: state.weight,
      height: state.height,
      age: state.age,
      gender: state.gender ?? "male",
      activityDays: days,
      metabolismType: state.metabolismType,
      goal: state.goal
    });
    caloriePhase = fmt(copy.phaseCalories, {
      target: m.target,
      protein: m.protein,
      carbs: m.carbs
    });
  }
  return [fmt(copy.phaseProfile, {
    name,
    goal
  }), fmt(copy.phaseLevel, {
    exp
  }), equipCount > 0 ? fmt(copy.phaseEquipment, {
    count: equipCount
  }) : fmt(copy.phaseLocation, {
    loc
  }), fmt(copy.phaseSchedule, {
    days,
    duration
  }), caloriePhase, copy.phaseFinale];
}
function Step11({
  state,
  copy
}) {
  const navigate = useNavigate();
  const [phase, setPhase] = reactExports.useState(0);
  const [pct, setPct] = reactExports.useState(0);
  const phases = buildPersonalizedPhases(state, copy);
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      setPct((current) => {
        const next = Math.min(100, current + 1);
        const nextPhase = Math.min(phases.length - 1, Math.floor(next / 100 * phases.length));
        setPhase(nextPhase);
        return next;
      });
    }, 60);
    return () => clearInterval(id);
  }, [phases.length]);
  reactExports.useEffect(() => {
    if (pct >= 100) {
      saveOnboarding({
        ...state,
        completedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      const timeout = setTimeout(() => navigate({
        to: "/paywall"
      }), 800);
      return () => clearTimeout(timeout);
    }
  }, [navigate, pct, state]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center pt-6 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-8 h-44 w-44", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full opacity-25 blur-2xl", style: {
        background: "radial-gradient(circle,rgba(34,211,238,0.6) 0%,rgba(251,146,60,0.4) 100%)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
        rotate: 360
      }, transition: {
        repeat: Infinity,
        duration: 7,
        ease: "linear"
      }, className: "absolute inset-0 rounded-full", style: {
        border: "2px solid transparent",
        borderTopColor: "#22d3ee",
        borderRightColor: "#22d3ee40"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
        rotate: -360
      }, transition: {
        repeat: Infinity,
        duration: 11,
        ease: "linear"
      }, className: "absolute inset-3 rounded-full", style: {
        border: "2px solid transparent",
        borderBottomColor: "#fb923c",
        borderLeftColor: "#fb923c30"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
        rotate: 360
      }, transition: {
        repeat: Infinity,
        duration: 18,
        ease: "linear"
      }, className: "absolute inset-7 rounded-full", style: {
        border: "1px solid rgba(34,211,238,0.2)",
        borderTopColor: "rgba(34,211,238,0.6)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mx-auto mb-1 h-5 w-5", style: {
          color: "#22d3ee"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-3xl font-bold", style: {
          background: "linear-gradient(135deg,#22d3ee,#3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }, children: [
          Math.round(pct),
          "%"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold md:text-3xl text-gradient-brand", children: copy.analysingTitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm", style: {
      color: "rgba(148,163,184,0.7)"
    }, children: [
      copy.analysingProcessing,
      " ",
      Object.keys(state).filter((k) => !["completedAt", "avatarUrl"].includes(k)).length,
      " ",
      copy.analysingVarsSuffix
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-7 w-full max-w-sm space-y-2 text-left", children: phases.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0.4
    }, animate: {
      opacity: index <= phase ? 1 : 0.4
    }, className: cn("flex items-center gap-3 rounded-xl border p-3 text-sm transition-all", index < phase && "border-success/25 bg-success/5 text-foreground", index === phase && "border-cyan/40 bg-surface text-foreground shadow-glow-cyan", index > phase && "border-border bg-surface/30 text-muted-foreground"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-2 w-2 shrink-0 rounded-full transition-all", index < phase && "bg-success", index === phase && "bg-cyan animate-pulse", index > phase && "bg-muted-foreground/30") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item })
    ] }, index)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7 w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex justify-between text-[10px] font-semibold uppercase tracking-[0.15em]", style: {
        color: "rgba(100,116,139,0.7)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: copy.generatingLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
          color: "#22d3ee"
        }, children: [
          Math.round(pct),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full overflow-hidden rounded-full", style: {
        background: "rgba(255,255,255,0.05)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "h-full rounded-full", style: {
        width: `${pct}%`,
        background: "linear-gradient(90deg,#22d3ee,#3b82f6,#fb923c)",
        boxShadow: "0 0 12px rgba(34,211,238,0.4)"
      } }) })
    ] }),
    pct >= 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 16
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.4,
      ease: "easeOut"
    }, className: "mt-6 flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl px-5 py-3 text-center", style: {
        background: "rgba(34,211,238,0.08)",
        border: "1px solid rgba(34,211,238,0.2)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", style: {
          color: "#22d3ee"
        }, children: "100% Completo ✓" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: state.name ? `${state.name.split(" ")[0]}, seu plano está pronto!` : "Seu plano personalizado está pronto!" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShareVideoButton, { composition: OnboardingCelebrationVideo, inputProps: {
        name: state.name ?? "Atleta",
        goal: state.goal ?? "ganho_massa",
        level: state.experience ?? "iniciante",
        modality: state.trainingType ?? "musculacao",
        daysPerWeek: state.days?.length ?? 4
      }, durationInFrames: 300, title: "Compartilhar meu plano", label: "Compartilhar meu plano", variant: "primary" })
    ] })
  ] });
}
export {
  StepPage as component
};