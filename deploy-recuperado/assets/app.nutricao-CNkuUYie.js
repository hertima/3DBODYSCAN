import { r as reactExports, W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { l as loadMealPlan, c as clearMealPlan, s as saveMealPlan } from "./meal-plan-Lo4dABFY.js";
import { c as createLucideIcon, g as getStoredLocale, A as AnimatePresence, m as motion, l as loadOnboarding } from "./router-BDD3RgVy.js";
import { c as getNutritionCopy } from "./app-copy-wxZoQ7QO.js";
import { a as auth } from "./firebase-CeVmTMBf.js";
import { C as ChevronRight } from "./chevron-right-DRYfnruU.js";
import { U as Utensils } from "./utensils-DEbQ0tBJ.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
import { C as Clock } from "./clock-pfs1_d9-.js";
import { D as Droplets, S as Sun } from "./sun-CW7_kSEo.js";
import { M as Moon } from "./moon-DOTTN2ld.js";
import { Z as Zap } from "./zap-DR4zCOeL.js";
import { A as Apple } from "./apple-CmadVI1d.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
const __iconNode$5 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M14 2v2", key: "6buw04" }],
  [
    "path",
    {
      d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
      key: "pwadti"
    }
  ],
  ["path", { d: "M6 2v2", key: "colzsn" }]
];
const Coffee = createLucideIcon("coffee", __iconNode$4);
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M14 4a1 1 0 0 1 1-1", key: "dhj8ez" }],
  ["path", { d: "M15 10a1 1 0 0 1-1-1", key: "1mnyi5" }],
  ["path", { d: "M21 4a1 1 0 0 0-1-1", key: "sfs9ap" }],
  ["path", { d: "M21 9a1 1 0 0 1-1 1", key: "mp6qeo" }],
  ["path", { d: "m3 7 3 3 3-3", key: "x25e72" }],
  ["path", { d: "M6 10V5a2 2 0 0 1 2-2h2", key: "15xut4" }],
  ["rect", { x: "3", y: "14", width: "7", height: "7", rx: "1", key: "1bkyp8" }]
];
const Replace = createLucideIcon("replace", __iconNode$1);
const __iconNode = [
  ["path", { d: "m15 11-1 9", key: "5wnq3a" }],
  ["path", { d: "m19 11-4-7", key: "cnml18" }],
  ["path", { d: "M2 11h20", key: "3eubbj" }],
  ["path", { d: "m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4", key: "yiazzp" }],
  ["path", { d: "M4.5 15.5h15", key: "13mye1" }],
  ["path", { d: "m5 11 4-7", key: "116ra9" }],
  ["path", { d: "m9 11 1 9", key: "1ojof7" }]
];
const ShoppingBasket = createLucideIcon("shopping-basket", __iconNode);
const MEAL_ICONS = {
  breakfast: {
    icon: Coffee,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20"
  },
  morningSnack: {
    icon: Apple,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20"
  },
  lunch: {
    icon: Sun,
    color: "text-cyan",
    bg: "bg-cyan/10 border-cyan/20"
  },
  preWorkout: {
    icon: Zap,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20"
  },
  dinner: {
    icon: Moon,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10 border-indigo-400/20"
  }
};
function MacroBar({
  label,
  value,
  max,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] font-semibold uppercase tracking-wider", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: color, children: [
        value,
        "g"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full overflow-hidden rounded-full bg-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      width: 0
    }, animate: {
      width: `${Math.min(100, value / max * 100)}%`
    }, transition: {
      duration: 0.5,
      ease: "easeOut"
    }, className: `h-full rounded-full ${color.replace("text-", "bg-")}` }) })
  ] });
}
function MealCard({
  meal,
  mealKey,
  labels
}) {
  const {
    icon: Icon,
    color,
    bg
  } = MEAL_ICONS[mealKey];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 8
  }, animate: {
    opacity: 1,
    y: 0
  }, className: `rounded-2xl border p-4 ${bg}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${color}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: labels.meals[mealKey] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-bold ${color}`, children: [
        meal.calories,
        " kcal"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-2", children: meal.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mb-3", children: meal.foods.map((food) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border bg-background/50 px-2.5 py-0.5 text-[11px] text-muted-foreground", children: food }, food)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 text-center", children: [{
      label: labels.macros.proteinShort,
      value: meal.protein,
      color: "text-cyan"
    }, {
      label: labels.macros.carbsShort,
      value: meal.carbs,
      color: "text-primary"
    }, {
      label: labels.macros.fatShort,
      value: meal.fat,
      color: "text-amber-400"
    }].map(({
      label,
      value,
      color: color2
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-background/40 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-xs font-bold ${color2}`, children: [
        value,
        "g"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-wider text-muted-foreground", children: label })
    ] }, label)) })
  ] });
}
function NutritionistStructure({
  week
}) {
  const phaseLabel = week.phase === "adaptacao" ? "Adaptação" : week.phase === "desenvolvimento" ? "Desenvolvimento" : week.phase === "otimizacao" ? "Otimização" : "Estratégia";
  const blocks = [{
    label: "Fase",
    value: phaseLabel,
    icon: Sparkles
  }, {
    label: "Ajuste calórico",
    value: week.calorieAdjustment,
    icon: Utensils
  }, {
    label: "Timing",
    value: week.mealTiming,
    icon: Clock
  }, {
    label: "Hidratação",
    value: week.hydrationTarget,
    icon: Droplets
  }].filter((item) => item.value);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    week.strategy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-cyan/25 bg-cyan/8 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 text-[10px] font-bold uppercase tracking-widest text-cyan", children: "Estratégia da nutricionista" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-foreground", children: week.strategy }),
      week.macroStrategy && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs leading-relaxed text-muted-foreground", children: week.macroStrategy })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2 md:grid-cols-2", children: blocks.map(({
      label,
      value,
      icon: Icon
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-primary" }),
        label
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed text-muted-foreground", children: value })
    ] }, label)) }),
    (week.groceryFocus?.length || week.swapOptions?.length || week.adherenceGoal) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 md:grid-cols-3", children: [
      week.adherenceGoal && /* @__PURE__ */ jsxRuntimeExports.jsx(MiniList, { title: "Adesão", icon: Info, items: [week.adherenceGoal] }),
      week.groceryFocus?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(MiniList, { title: "Compras", icon: ShoppingBasket, items: week.groceryFocus }) : null,
      week.swapOptions?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(MiniList, { title: "Substituições", icon: Replace, items: week.swapOptions }) : null
    ] })
  ] });
}
function MiniList({
  title,
  icon: Icon,
  items
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-primary" }),
      title
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: items.slice(0, 4).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground", children: item }, item)) })
  ] });
}
function WeekView({
  week,
  labels
}) {
  const [day, setDay] = reactExports.useState(0);
  const mealKeys = ["breakfast", "morningSnack", "lunch", "preWorkout", "dinner"];
  const dayPlan = week.days?.find((item) => item.day === day);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-semibold uppercase tracking-widest text-primary mb-1", children: [
        labels.weekLabel,
        " ",
        week.week,
        " ",
        labels.weekOf
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-bold mb-1", children: week.weekFocus }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        week.dailyCalories,
        " ",
        labels.kcalPerDay
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacroBar, { label: labels.macros.protein, value: week.macros.protein, max: 300, color: "text-cyan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacroBar, { label: labels.macros.carbs, value: week.macros.carbs, max: 500, color: "text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacroBar, { label: labels.macros.fat, value: week.macros.fat, max: 150, color: "text-amber-400" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 rounded-2xl border border-cyan/20 bg-cyan/5 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 shrink-0 text-cyan mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed text-muted-foreground", children: week.tip })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NutritionistStructure, { week }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 overflow-x-auto pb-1", children: labels.days.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDay(i), className: `shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition ${day === i ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border border-border bg-surface text-muted-foreground"}`, children: d }, d)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      x: 10
    }, animate: {
      opacity: 1,
      x: 0
    }, exit: {
      opacity: 0,
      x: -10
    }, transition: {
      duration: 0.15
    }, className: "space-y-3", children: mealKeys.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(MealCard, { meal: dayPlan?.[key] ?? week[key], mealKey: key, labels }, key)) }, day) })
  ] });
}
function EmptyState({
  onGenerate,
  loading,
  labels
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 16
  }, animate: {
    opacity: 1,
    y: 0
  }, className: "flex flex-col items-center justify-center py-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 grid h-20 w-20 place-items-center rounded-3xl", style: {
      background: "linear-gradient(135deg,rgba(34,211,238,0.15),rgba(59,130,246,0.15))",
      border: "1px solid rgba(34,211,238,0.2)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Utensils, { className: "h-9 w-9 text-cyan" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold mb-2", children: labels.emptyTitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs mb-8", children: labels.emptyDesc }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onGenerate, disabled: loading, className: "inline-flex items-center gap-2.5 rounded-2xl px-8 py-4 text-sm font-bold text-white shadow-glow-primary transition disabled:opacity-60", style: {
      background: "linear-gradient(135deg,#22d3ee,#3b82f6)"
    }, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }),
      labels.generating
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
      labels.generateBtn
    ] }) }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs text-muted-foreground", children: labels.generatingHint })
  ] });
}
const CLIENT_FOOD_ROTATIONS = [["ovos", "aveia", "frango grelhado", "arroz integral", "brócolis", "batata doce", "tilápia"], ["iogurte grego", "banana", "patinho moído", "quinoa", "abobrinha", "mandioca", "salmão"], ["cottage", "mamão", "frango desfiado", "feijão", "espinafre", "inhame", "atum"], ["claras", "pão integral", "peru", "arroz parboilizado", "salada verde", "cuscuz", "merluza"]];
function normalizeMealPlanForUi(plan) {
  if (!plan || !Array.isArray(plan.weeks) || plan.weeks.length !== 12) return null;
  const weeks = plan.weeks.map((weekItem, index) => {
    if (!isRenderableWeek(weekItem, index)) return null;
    return {
      ...weekItem,
      week: index + 1,
      days: hasCompleteDays(weekItem) ? weekItem.days : buildClientDays(weekItem, index)
    };
  });
  if (weeks.some((weekItem) => weekItem === null)) return null;
  return {
    ...plan,
    version: 2,
    generatedAt: plan.generatedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
    weeks
  };
}
function isRenderableWeek(weekItem, index) {
  return (weekItem.week === index + 1 || typeof weekItem.week !== "number") && typeof weekItem.weekFocus === "string" && typeof weekItem.dailyCalories === "number" && weekItem.macros != null && typeof weekItem.macros.protein === "number" && typeof weekItem.macros.carbs === "number" && typeof weekItem.macros.fat === "number" && isRenderableMeal(weekItem.breakfast) && isRenderableMeal(weekItem.morningSnack) && isRenderableMeal(weekItem.lunch) && isRenderableMeal(weekItem.preWorkout) && isRenderableMeal(weekItem.dinner);
}
function isRenderableMeal(meal) {
  return meal != null && typeof meal.name === "string" && Array.isArray(meal.foods) && meal.foods.length >= 2 && typeof meal.calories === "number" && typeof meal.protein === "number" && typeof meal.carbs === "number" && typeof meal.fat === "number";
}
function hasCompleteDays(weekItem) {
  return Array.isArray(weekItem.days) && weekItem.days.length === 7 && weekItem.days.every((dayItem, index) => dayItem.day === index && isRenderableMeal(dayItem.breakfast) && isRenderableMeal(dayItem.morningSnack) && isRenderableMeal(dayItem.lunch) && isRenderableMeal(dayItem.preWorkout) && isRenderableMeal(dayItem.dinner));
}
function buildClientDays(weekItem, weekIndex) {
  return Array.from({
    length: 7
  }, (_, day) => ({
    day,
    breakfast: buildClientMealVariant(weekItem.breakfast, weekIndex, day, 0),
    morningSnack: buildClientMealVariant(weekItem.morningSnack, weekIndex, day, 1),
    lunch: buildClientMealVariant(weekItem.lunch, weekIndex, day, 2),
    preWorkout: buildClientMealVariant(weekItem.preWorkout, weekIndex, day, 3),
    dinner: buildClientMealVariant(weekItem.dinner, weekIndex, day, 4)
  }));
}
function buildClientMealVariant(meal, weekIndex, day, mealIndex) {
  const rotation = CLIENT_FOOD_ROTATIONS[(weekIndex + day + mealIndex) % CLIENT_FOOD_ROTATIONS.length];
  const foods = meal.foods.map((food, index) => rotation[(index + mealIndex) % rotation.length] ?? food);
  return {
    ...meal,
    name: day === 0 ? meal.name : `${meal.name} ${day + 1}`,
    foods
  };
}
function NutricaoPage() {
  const labels = getNutritionCopy(getStoredLocale());
  const locale = getStoredLocale();
  const [plan, setPlan] = reactExports.useState(null);
  const [week, setWeek] = reactExports.useState(1);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const savedPlan = loadMealPlan();
    const normalizedPlan = normalizeMealPlanForUi(savedPlan);
    if (savedPlan && !normalizedPlan) {
      clearMealPlan();
      setPlan(null);
      return;
    }
    if (normalizedPlan && normalizedPlan !== savedPlan) saveMealPlan(normalizedPlan);
    setPlan(normalizedPlan);
  }, []);
  function collectFoods(source) {
    if (!source) return [];
    const foods = source.weeks.flatMap((weekItem) => {
      const weeklyMeals = [weekItem.breakfast, weekItem.morningSnack, weekItem.lunch, weekItem.preWorkout, weekItem.dinner];
      const dayMeals = (weekItem.days ?? []).flatMap((dayItem) => [dayItem.breakfast, dayItem.morningSnack, dayItem.lunch, dayItem.preWorkout, dayItem.dinner]);
      return [...weeklyMeals, ...dayMeals].flatMap((meal) => meal.foods);
    });
    return Array.from(new Set(foods.map((food) => food.trim()).filter(Boolean))).slice(0, 35);
  }
  async function generate(previousPlan = null) {
    const onboarding = loadOnboarding();
    setLoading(true);
    setError(null);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? {
            Authorization: `Bearer ${token}`
          } : {}
        },
        body: JSON.stringify({
          locale,
          regenerationId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          avoidFoods: collectFoods(previousPlan),
          profile: {
            goal: onboarding.goal ?? "wellness",
            weight: onboarding.weight ?? 70,
            height: onboarding.height ?? 170,
            age: onboarding.age ?? 25,
            gender: onboarding.gender ?? "other",
            dietType: onboarding.dietType ?? "onívoro",
            mealFrequency: onboarding.mealFrequency ?? "5 refeições",
            metabolismType: onboarding.metabolismType ?? "balanceado",
            name: onboarding.name
          }
        })
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = normalizeMealPlanForUi(await res.json());
      if (!data) {
        throw new Error("invalid meal plan");
      }
      saveMealPlan(data);
      setPlan(data);
      setWeek(1);
    } catch {
      setError(labels.error);
    } finally {
      setLoading(false);
    }
  }
  function handleRegenerate() {
    const previousPlan = plan;
    clearMealPlan();
    setPlan(null);
    generate(previousPlan);
  }
  const currentWeek = plan?.weeks.find((w) => w.week === week);
  const dateLocale = locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : locale === "de" ? "de-DE" : locale === "fr" ? "fr-FR" : "en-US";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: labels.tag }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: labels.title })
      ] }),
      plan && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleRegenerate, disabled: loading, className: "flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground disabled:opacity-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` }),
        labels.regenerate
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive", children: error }),
    plan && (plan.locale === void 0 && locale !== "pt" || plan.locale !== void 0 && plan.locale !== locale) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/8 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-400", children: labels.localeMismatch }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleRegenerate, disabled: loading, className: "shrink-0 rounded-xl bg-amber-400/15 px-3 py-1.5 text-xs font-bold text-amber-400 transition hover:bg-amber-400/25 disabled:opacity-50", children: labels.regenerate })
    ] }),
    !plan && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { onGenerate: generate, loading, labels }),
    plan && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setWeek((w) => Math.max(1, w - 1)), disabled: week === 1, className: "rounded-xl p-1.5 transition disabled:opacity-30 hover:bg-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg font-bold", children: [
            labels.weekLabel,
            " ",
            week
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: labels.weekOf })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setWeek((w) => Math.min(12, w + 1)), disabled: week === 12, className: "rounded-xl p-1.5 transition disabled:opacity-30 hover:bg-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 overflow-x-auto pb-1", children: Array.from({
        length: 12
      }, (_, i) => i + 1).map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setWeek(w), className: `shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-bold transition ${week === w ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-muted-foreground"}`, children: [
        labels.weekLabel[0],
        w
      ] }, w)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: currentWeek && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 8
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0,
        y: -8
      }, transition: {
        duration: 0.2
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(WeekView, { week: currentWeek, labels }) }, week) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-[10px] text-muted-foreground", children: [
        labels.generatedAt,
        " ",
        new Date(plan.generatedAt).toLocaleDateString(dateLocale)
      ] })
    ] })
  ] });
}
export {
  NutricaoPage as component
};