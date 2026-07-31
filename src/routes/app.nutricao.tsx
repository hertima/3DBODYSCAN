import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils, Sparkles, ChevronLeft, ChevronRight,
  RefreshCw, Coffee, Apple, Sun, Zap, Moon, Info, Droplets, Clock, ShoppingBasket, Replace,
} from "lucide-react";
import { loadMealPlan, saveMealPlan, clearMealPlan, type MealPlan, type WeekPlan, type Meal } from "@/lib/meal-plan";
import { loadOnboarding } from "@/lib/onboarding";
import { getNutritionCopy } from "@/lib/app-copy";
import { getStoredLocale } from "@/lib/locale";
import { getAuthToken } from "@/lib/auth";
import { getCurrentTrainingState, type GeneratedTrainingState } from "@/domain/training/engine";

const SPLIT_DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildWeeklySplitSummary(trainingState: GeneratedTrainingState): string {
  return trainingState.schedule
    .map((entry, i) => {
      const workout = entry.workoutId
        ? (trainingState.workouts.find((w) => w.id === entry.workoutId) ?? null)
        : null;
      if (!workout) return `${SPLIT_DAY_LABELS[i]}: rest`;
      return `${SPLIT_DAY_LABELS[i]}: ${workout.name}${workout.focus ? ` (${workout.focus})` : ""}`;
    })
    .join(", ");
}

export const Route = createFileRoute("/app/nutricao")({
  head: () => ({
    meta: [
      { title: "Plano Alimentar | 3D Body Scanner" },
      { name: "description", content: "Seu plano alimentar personalizado de 12 semanas." },
    ],
  }),
  component: NutricaoPage,
});

const MEAL_ICONS = {
  breakfast: { icon: Coffee, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  morningSnack: { icon: Apple, color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  lunch: { icon: Sun, color: "text-cyan", bg: "bg-cyan/10 border-cyan/20" },
  preWorkout: { icon: Zap, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  dinner: { icon: Moon, color: "text-indigo-400", bg: "bg-indigo-400/10 border-indigo-400/20" },
} as const;

type MealKey = keyof typeof MEAL_ICONS;

function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider">
        <span className="text-muted-foreground">{label}</span>
        <span className={color}>{value}g</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (value / max) * 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
        />
      </div>
    </div>
  );
}

const MEAL_ACCENT: Record<MealKey, string> = {
  breakfast:    "#f59e0b",
  morningSnack: "#10b981",
  lunch:        "#22d3ee",
  preWorkout:   "#ff8a1f",
  dinner:       "#818cf8",
};

const PHASE_STYLE: Record<string, { color: string; bg: string; label: Record<string, string> }> = {
  adaptacao:    { color: "#22d3ee", bg: "rgba(34,211,238,0.12)",  label: { pt: "Adaptação",   es: "Adaptación",  en: "Adaptation", fr: "Adaptation", de: "Anpassung" } },
  desenvolvimento: { color: "#ff8a1f", bg: "rgba(255,138,31,0.12)", label: { pt: "Desenvolvimento", es: "Desarrollo",   en: "Development", fr: "Développement", de: "Entwicklung" } },
  otimizacao:   { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", label: { pt: "Otimização",  es: "Optimización", en: "Optimization", fr: "Optimisation", de: "Optimierung" } },
};

function MacroChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ border: `1px solid ${color}55`, background: `${color}12`, color }}>
      <span style={{ opacity: 0.7 }}>{label} </span>{value}g
    </span>
  );
}

function MealCard({ meal, mealKey, labels }: {
  meal: Meal;
  mealKey: MealKey;
  labels: ReturnType<typeof getNutritionCopy>;
}) {
  const { icon: Icon } = MEAL_ICONS[mealKey];
  const accent = MEAL_ACCENT[mealKey];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border bg-elevated/30"
      style={{ borderColor: `${accent}30`, borderLeft: `3px solid ${accent}` }}
    >
      <div className="p-3.5">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-xl" style={{ background: `${accent}18` }}>
              <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {labels.meals[mealKey]}
            </span>
          </div>
          <span className="text-xs font-bold rounded-full px-2.5 py-0.5" style={{ color: accent, background: `${accent}15` }}>
            {meal.calories} kcal
          </span>
        </div>

        {/* Meal name */}
        <div className="font-display text-base font-bold leading-snug mb-3">{meal.name}</div>

        {/* Macro chips */}
        <div className="flex flex-wrap gap-2 mb-3.5">
          <MacroChip label={labels.macros.proteinShort} value={meal.protein} color="#22d3ee" />
          <MacroChip label={labels.macros.carbsShort}   value={meal.carbs}   color="#ff8a1f" />
          <MacroChip label={labels.macros.fatShort}     value={meal.fat}     color="#f59e0b" />
        </div>

        {/* Food tags */}
        <div className="flex flex-wrap gap-2">
          {meal.foods.map((food) => (
            <span
              key={food}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
              style={{ borderColor: `${accent}40`, background: `${accent}10`, color: "var(--foreground)" }}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
              {food}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const NUTRI_STRUCT_COPY = {
  pt: {
    strategyTitle: "Estratégia da nutricionista",
    phase: "Fase", calorieAdj: "Ajuste calórico", timing: "Timing", hydration: "Hidratação",
    adherence: "Adesão", groceries: "Compras", swaps: "Substituições",
    phases: { adaptacao: "Adaptação", desenvolvimento: "Desenvolvimento", otimizacao: "Otimização", default: "Estratégia" },
  },
  es: {
    strategyTitle: "Estrategia de la nutricionista",
    phase: "Fase", calorieAdj: "Ajuste calórico", timing: "Timing", hydration: "Hidratación",
    adherence: "Adhesión", groceries: "Compras", swaps: "Sustituciones",
    phases: { adaptacao: "Adaptación", desenvolvimento: "Desarrollo", otimizacao: "Optimización", default: "Estrategia" },
  },
  en: {
    strategyTitle: "Nutritionist strategy",
    phase: "Phase", calorieAdj: "Caloric adjustment", timing: "Timing", hydration: "Hydration",
    adherence: "Adherence", groceries: "Groceries", swaps: "Swaps",
    phases: { adaptacao: "Adaptation", desenvolvimento: "Development", otimizacao: "Optimization", default: "Strategy" },
  },
  fr: {
    strategyTitle: "Stratégie de la nutritionniste",
    phase: "Phase", calorieAdj: "Ajustement calorique", timing: "Timing", hydration: "Hydratation",
    adherence: "Adhérence", groceries: "Courses", swaps: "Substitutions",
    phases: { adaptacao: "Adaptation", desenvolvimento: "Développement", otimizacao: "Optimisation", default: "Stratégie" },
  },
  de: {
    strategyTitle: "Ernährungsberaterin-Strategie",
    phase: "Phase", calorieAdj: "Kalorienanpassung", timing: "Timing", hydration: "Hydratation",
    adherence: "Einhaltung", groceries: "Einkäufe", swaps: "Alternativen",
    phases: { adaptacao: "Anpassung", desenvolvimento: "Entwicklung", otimizacao: "Optimierung", default: "Strategie" },
  },
} as const;

function NutritionistStructure({ week }: { week: WeekPlan }) {
  const nsc = NUTRI_STRUCT_COPY[getStoredLocale() as keyof typeof NUTRI_STRUCT_COPY] ?? NUTRI_STRUCT_COPY.pt;
  const phaseLabel = nsc.phases[week.phase as keyof typeof nsc.phases] ?? nsc.phases.default;

  const blocks = [
    { label: nsc.phase, value: phaseLabel, icon: Sparkles },
    { label: nsc.calorieAdj, value: week.calorieAdjustment, icon: Utensils },
    { label: nsc.timing, value: week.mealTiming, icon: Clock },
    { label: nsc.hydration, value: week.hydrationTarget, icon: Droplets },
  ].filter((item) => item.value);

  return (
    <div className="space-y-3">
      {week.strategy && (
        <div className="rounded-2xl border border-cyan/25 bg-cyan/8 p-4">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-cyan">
            {nsc.strategyTitle}
          </div>
          <p className="text-sm leading-relaxed text-foreground">{week.strategy}</p>
          {week.macroStrategy && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{week.macroStrategy}</p>
          )}
        </div>
      )}

      <div className="grid gap-2 md:grid-cols-2">
        {blocks.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border bg-surface p-3">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary" />
              {label}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{value}</p>
          </div>
        ))}
      </div>

      {(week.groceryFocus?.length || week.swapOptions?.length || week.adherenceGoal) && (
        <div className="grid gap-2 md:grid-cols-3">
          {week.adherenceGoal && (
            <MiniList title={nsc.adherence} icon={Info} items={[week.adherenceGoal]} />
          )}
          {week.groceryFocus?.length ? (
            <MiniList title={nsc.groceries} icon={ShoppingBasket} items={week.groceryFocus} />
          ) : null}
          {week.swapOptions?.length ? (
            <MiniList title={nsc.swaps} icon={Replace} items={week.swapOptions} />
          ) : null}
        </div>
      )}
    </div>
  );
}

function MiniList({ title, icon: Icon, items }: { title: string; icon: typeof Info; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, 4).map((item) => (
          <span key={item} className="rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const ALL_MEAL_KEYS: MealKey[] = ["breakfast", "morningSnack", "lunch", "preWorkout", "dinner"];

// Refeições ocultas são somadas (calorias/macros/alimentos) na refeição de destino,
// para o card visível refletir o total real e não só "esconder" a comida.
const MEAL_FOLD_MAP: Record<string, Partial<Record<MealKey, MealKey>>> = {
  "2": { breakfast: "lunch", morningSnack: "lunch", preWorkout: "dinner" },
  "3": { morningSnack: "breakfast", preWorkout: "lunch" },
};

function resolveVisibleMealKeys(mealFrequency: string | undefined): MealKey[] {
  if (mealFrequency === "2") return ["lunch", "dinner"];
  if (mealFrequency === "3") return ["breakfast", "lunch", "dinner"];
  return ALL_MEAL_KEYS;
}

function foldMeals(source: Record<MealKey, Meal>, mealFrequency: string | undefined): Record<MealKey, Meal> {
  const foldMap = MEAL_FOLD_MAP[mealFrequency ?? ""];
  if (!foldMap) return source;
  const result: Record<MealKey, Meal> = { ...source };
  for (const fromKey of ALL_MEAL_KEYS) {
    const toKey = foldMap[fromKey];
    if (!toKey) continue;
    const from = result[fromKey];
    const to = result[toKey];
    result[toKey] = {
      ...to,
      calories: to.calories + from.calories,
      protein: to.protein + from.protein,
      carbs: to.carbs + from.carbs,
      fat: to.fat + from.fat,
      foods: Array.from(new Set([...to.foods, ...from.foods])),
    };
  }
  return result;
}

function WeekView({ week, labels, mealFrequency }: {
  week: WeekPlan;
  labels: ReturnType<typeof getNutritionCopy>;
  mealFrequency?: string;
}) {
  const [day, setDay] = useState(0);
  const visibleMealKeys = resolveVisibleMealKeys(mealFrequency);
  const dayPlan = week.days?.find((item) => item.day === day);
  const phaseKey = week.phase ?? "adaptacao";
  const phase = PHASE_STYLE[phaseKey] ?? PHASE_STYLE.adaptacao;
  const locale = getStoredLocale();
  const phaseLabel = phase.label[locale as keyof typeof phase.label] ?? phase.label.pt;

  return (
    <div className="space-y-4">
      {/* Week header card */}
      <div className="overflow-hidden rounded-2xl border" style={{ borderColor: `${phase.color}30` }}>
        {/* Top: phase badge + week counter */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider" style={{ background: phase.bg, color: phase.color }}>
            {phaseLabel}
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            {labels.weekLabel} {week.week} / 12
          </span>
        </div>

        {/* Focus + big calorie */}
        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground mb-1 leading-snug">{week.weekFocus}</p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold" style={{ background: `linear-gradient(135deg,${phase.color},#3b82f6)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {week.dailyCalories.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">{labels.kcalPerDay}</span>
          </div>
        </div>

        {/* Macro grid */}
        <div className="grid grid-cols-3 border-t" style={{ borderColor: `${phase.color}20` }}>
          {[
            { label: labels.macros.protein, value: week.macros.protein, color: "#22d3ee" },
            { label: labels.macros.carbs,   value: week.macros.carbs,   color: "#ff8a1f" },
            { label: labels.macros.fat,     value: week.macros.fat,     color: "#f59e0b" },
          ].map(({ label, value, color }, i) => (
            <div key={label} className={`flex flex-col items-center py-3 ${i < 2 ? "border-r" : ""}`} style={{ borderColor: `${phase.color}20`, background: `${color}06` }}>
              <span className="text-xl font-bold" style={{ color }}>{value}g</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="flex gap-3 rounded-2xl border p-4" style={{ borderColor: `${phase.color}25`, background: `${phase.color}08` }}>
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: phase.color }} />
        <p className="text-sm leading-relaxed text-muted-foreground">{week.tip}</p>
      </div>

      <NutritionistStructure week={week} />

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {labels.days.map((d, i) => (
          <button
            key={d}
            onClick={() => setDay(i)}
            className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition ${
              day === i
                ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                : "border border-border bg-surface text-muted-foreground"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={day}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-3"
        >
          {(() => {
            const rawMeals: Record<MealKey, Meal> = {
              breakfast: dayPlan?.breakfast ?? week.breakfast,
              morningSnack: dayPlan?.morningSnack ?? week.morningSnack,
              lunch: dayPlan?.lunch ?? week.lunch,
              preWorkout: dayPlan?.preWorkout ?? week.preWorkout,
              dinner: dayPlan?.dinner ?? week.dinner,
            };
            const foldedMeals = foldMeals(rawMeals, mealFrequency);
            return visibleMealKeys.map((key) => (
              <MealCard key={key} meal={foldedMeals[key]} mealKey={key} labels={labels} />
            ));
          })()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ onGenerate, loading, labels }: {
  onGenerate: () => void;
  loading: boolean;
  labels: ReturnType<typeof getNutritionCopy>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div
        className="mb-6 grid h-20 w-20 place-items-center rounded-3xl"
        style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.15),rgba(59,130,246,0.15))", border: "1px solid rgba(34,211,238,0.2)" }}
      >
        <Utensils className="h-9 w-9 text-cyan" />
      </div>
      <h2 className="font-display text-2xl font-bold mb-2">{labels.emptyTitle}</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-8">{labels.emptyDesc}</p>
      <button
        onClick={onGenerate}
        disabled={loading}
        className="inline-flex items-center gap-2.5 rounded-2xl px-8 py-4 text-sm font-bold text-white shadow-glow-primary transition disabled:opacity-60"
        style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)" }}
      >
        {loading ? (
          <><RefreshCw className="h-4 w-4 animate-spin" />{labels.generating}</>
        ) : (
          <><Sparkles className="h-4 w-4" />{labels.generateBtn}</>
        )}
      </button>
      {loading && (
        <p className="mt-4 text-xs text-muted-foreground">{labels.generatingHint}</p>
      )}
    </motion.div>
  );
}

const CLIENT_FOOD_ROTATIONS = [
  ["ovos mexidos", "aveia com banana", "frango grelhado", "arroz branco", "brócolis cozido", "batata doce", "feijão cozido"],
  ["iogurte grego", "banana", "frango assado", "arroz integral", "abobrinha grelhada", "mandioca cozida", "lentilha"],
  ["cottage", "mamão", "frango desfiado", "batata inglesa", "espinafre refogado", "inhame cozido", "grão-de-bico"],
  ["claras mexidas", "pão integral", "peito de peru", "arroz parboilizado", "salada verde", "cuscuz nordestino", "carne moída"],
];

function normalizeMealPlanForUi(plan: MealPlan | null): MealPlan | null {
  if (!plan || !Array.isArray(plan.weeks) || plan.weeks.length !== 12) return null;

  const weeks = plan.weeks.map((weekItem, index) => {
    if (!isRenderableWeek(weekItem, index)) return null;
    return {
      ...weekItem,
      week: index + 1,
      days: hasCompleteDays(weekItem) ? weekItem.days : buildClientDays(weekItem, index),
    };
  });

  if (weeks.some((weekItem) => weekItem === null)) return null;

  return {
    ...plan,
    version: 2,
    generatedAt: plan.generatedAt ?? new Date().toISOString(),
    weeks: weeks as WeekPlan[],
  };
}

function isRenderableWeek(weekItem: WeekPlan, index: number) {
  return (
    weekItem.week === index + 1 || typeof weekItem.week !== "number"
  ) &&
    typeof weekItem.weekFocus === "string" &&
    typeof weekItem.dailyCalories === "number" &&
    weekItem.macros != null &&
    typeof weekItem.macros.protein === "number" &&
    typeof weekItem.macros.carbs === "number" &&
    typeof weekItem.macros.fat === "number" &&
    isRenderableMeal(weekItem.breakfast) &&
    isRenderableMeal(weekItem.morningSnack) &&
    isRenderableMeal(weekItem.lunch) &&
    isRenderableMeal(weekItem.preWorkout) &&
    isRenderableMeal(weekItem.dinner);
}

function isRenderableMeal(meal: Meal | undefined): meal is Meal {
  return (
    meal != null &&
    typeof meal.name === "string" &&
    Array.isArray(meal.foods) &&
    meal.foods.length >= 2 &&
    typeof meal.calories === "number" &&
    typeof meal.protein === "number" &&
    typeof meal.carbs === "number" &&
    typeof meal.fat === "number"
  );
}

function hasCompleteDays(weekItem: WeekPlan) {
  return (
    Array.isArray(weekItem.days) &&
    weekItem.days.length === 7 &&
    weekItem.days.every((dayItem, index) =>
      dayItem.day === index &&
      isRenderableMeal(dayItem.breakfast) &&
      isRenderableMeal(dayItem.morningSnack) &&
      isRenderableMeal(dayItem.lunch) &&
      isRenderableMeal(dayItem.preWorkout) &&
      isRenderableMeal(dayItem.dinner),
    )
  );
}

function buildClientDays(weekItem: WeekPlan, weekIndex: number): NonNullable<WeekPlan["days"]> {
  return Array.from({ length: 7 }, (_, day) => ({
    day,
    breakfast: buildClientMealVariant(weekItem.breakfast, weekIndex, day, 0),
    morningSnack: buildClientMealVariant(weekItem.morningSnack, weekIndex, day, 1),
    lunch: buildClientMealVariant(weekItem.lunch, weekIndex, day, 2),
    preWorkout: buildClientMealVariant(weekItem.preWorkout, weekIndex, day, 3),
    dinner: buildClientMealVariant(weekItem.dinner, weekIndex, day, 4),
  }));
}

function buildClientMealVariant(meal: Meal, weekIndex: number, day: number, mealIndex: number): Meal {
  const rotation = CLIENT_FOOD_ROTATIONS[(weekIndex + day + mealIndex) % CLIENT_FOOD_ROTATIONS.length];
  const foods = meal.foods.map((food, index) => rotation[(index + mealIndex) % rotation.length] ?? food);
  return {
    ...meal,
    name: day === 0 ? meal.name : `${meal.name} ${day + 1}`,
    foods,
  };
}

function NutricaoPage() {
  const labels = getNutritionCopy(getStoredLocale());
  const locale = getStoredLocale();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [week, setWeek] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  function collectFoods(source: MealPlan | null) {
    if (!source) return [];
    const foods = source.weeks.flatMap((weekItem) => {
      const weeklyMeals = [
        weekItem.breakfast,
        weekItem.morningSnack,
        weekItem.lunch,
        weekItem.preWorkout,
        weekItem.dinner,
      ];
      const dayMeals = (weekItem.days ?? []).flatMap((dayItem) => [
        dayItem.breakfast,
        dayItem.morningSnack,
        dayItem.lunch,
        dayItem.preWorkout,
        dayItem.dinner,
      ]);
      return [...weeklyMeals, ...dayMeals].flatMap((meal) => meal.foods);
    });
    return Array.from(new Set(foods.map((food) => food.trim()).filter(Boolean))).slice(0, 35);
  }

  async function generate(previousPlan: MealPlan | null = null) {
    const onboarding = loadOnboarding();
    setLoading(true);
    setError(null);

    let weeklySplit: string | undefined;
    try {
      weeklySplit = buildWeeklySplitSummary(getCurrentTrainingState());
    } catch {
      weeklySplit = undefined;
    }

    try {
      const token = await getAuthToken();
      const res = await fetch("/api/meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
            name: onboarding.name,
            trainingDays: onboarding.days?.length ?? 4,
            experience: onboarding.experience,
            trainingType: onboarding.trainingType,
            focusMuscles: onboarding.focusMuscles,
            trackCycle: onboarding.trackCycle,
            menstrualCyclePhase: onboarding.menstrualCyclePhase,
            consistency: onboarding.consistency,
            calorieTarget: onboarding.calorieTarget,
            calorieProtein: onboarding.calorieProtein,
            weeklySplit,
          },
        }),
      });

      if (!res.ok) throw new Error(`${res.status}`);

      const data = normalizeMealPlanForUi({ ...((await res.json()) as MealPlan), locale });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{labels.tag}</p>
          <h1 className="font-display text-2xl font-bold">{labels.title}</h1>
        </div>
        {plan && (
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {labels.regenerate}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {plan && ((plan.locale === undefined && locale !== "pt") || (plan.locale !== undefined && plan.locale !== locale)) && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/8 px-4 py-3">
          <p className="text-xs text-amber-400">{labels.localeMismatch}</p>
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="shrink-0 rounded-xl bg-amber-400/15 px-3 py-1.5 text-xs font-bold text-amber-400 transition hover:bg-amber-400/25 disabled:opacity-50"
          >
            {labels.regenerate}
          </button>
        </div>
      )}

      {!plan && <EmptyState onGenerate={generate} loading={loading} labels={labels} />}

      {plan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
            <button
              onClick={() => setWeek((w) => Math.max(1, w - 1))}
              disabled={week === 1}
              className="rounded-xl p-1.5 transition disabled:opacity-30 hover:bg-elevated"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="font-display text-lg font-bold">{labels.weekLabel} {week}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {labels.weekOf}
              </div>
            </div>
            <button
              onClick={() => setWeek((w) => Math.min(12, w + 1))}
              disabled={week === 12}
              className="rounded-xl p-1.5 transition disabled:opacity-30 hover:bg-elevated"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => {
              const wPhase = w <= 4 ? PHASE_STYLE.adaptacao : w <= 8 ? PHASE_STYLE.desenvolvimento : PHASE_STYLE.otimizacao;
              const isActive = week === w;
              return (
                <button
                  key={w}
                  onClick={() => setWeek(w)}
                  className="shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-bold transition"
                  style={isActive
                    ? { background: wPhase.color, color: "#fff" }
                    : { border: `1px solid ${wPhase.color}40`, background: `${wPhase.color}08`, color: wPhase.color }
                  }
                >
                  {labels.weekLabel[0]}{w}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {currentWeek && (
              <motion.div
                key={week}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <WeekView week={currentWeek} labels={labels} mealFrequency={loadOnboarding().mealFrequency} />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-[10px] text-muted-foreground">
            {labels.generatedAt} {new Date(plan.generatedAt).toLocaleDateString(dateLocale)}
          </p>
        </div>
      )}
    </div>
  );
}
