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

export const Route = createFileRoute("/app/nutricao")({
  head: () => ({
    meta: [
      { title: "Plano Alimentar | 3D Body Scan" },
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

function MealCard({ meal, mealKey, labels }: {
  meal: Meal;
  mealKey: MealKey;
  labels: ReturnType<typeof getNutritionCopy>;
}) {
  const { icon: Icon, color, bg } = MEAL_ICONS[mealKey];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 ${bg}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {labels.meals[mealKey]}
          </span>
        </div>
        <span className={`text-xs font-bold ${color}`}>{meal.calories} kcal</span>
      </div>
      <div className="text-sm font-semibold mb-2">{meal.name}</div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {meal.foods.map((food) => (
          <span
            key={food}
            className="rounded-full border border-border bg-background/50 px-2.5 py-0.5 text-[11px] text-muted-foreground"
          >
            {food}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: labels.macros.proteinShort, value: meal.protein, color: "text-cyan" },
          { label: labels.macros.carbsShort, value: meal.carbs, color: "text-primary" },
          { label: labels.macros.fatShort, value: meal.fat, color: "text-amber-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl bg-background/40 py-1.5">
            <div className={`text-xs font-bold ${color}`}>{value}g</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function NutritionistStructure({ week }: { week: WeekPlan }) {
  const phaseLabel =
    week.phase === "adaptacao" ? "Adaptação" :
    week.phase === "desenvolvimento" ? "Desenvolvimento" :
    week.phase === "otimizacao" ? "Otimização" :
    "Estratégia";

  const blocks = [
    { label: "Fase", value: phaseLabel, icon: Sparkles },
    { label: "Ajuste calórico", value: week.calorieAdjustment, icon: Utensils },
    { label: "Timing", value: week.mealTiming, icon: Clock },
    { label: "Hidratação", value: week.hydrationTarget, icon: Droplets },
  ].filter((item) => item.value);

  return (
    <div className="space-y-3">
      {week.strategy && (
        <div className="rounded-2xl border border-cyan/25 bg-cyan/8 p-4">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-cyan">
            Estratégia da nutricionista
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
            <MiniList title="Adesão" icon={Info} items={[week.adherenceGoal]} />
          )}
          {week.groceryFocus?.length ? (
            <MiniList title="Compras" icon={ShoppingBasket} items={week.groceryFocus} />
          ) : null}
          {week.swapOptions?.length ? (
            <MiniList title="Substituições" icon={Replace} items={week.swapOptions} />
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

function WeekView({ week, labels }: { week: WeekPlan; labels: ReturnType<typeof getNutritionCopy> }) {
  const [day, setDay] = useState(0);
  const mealKeys: MealKey[] = ["breakfast", "morningSnack", "lunch", "preWorkout", "dinner"];
  const dayPlan = week.days?.find((item) => item.day === day);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">
          {labels.weekLabel} {week.week} {labels.weekOf}
        </div>
        <div className="font-display text-lg font-bold mb-1">{week.weekFocus}</div>
        <div className="text-xs text-muted-foreground">{week.dailyCalories} {labels.kcalPerDay}</div>
        <div className="mt-3 space-y-2">
          <MacroBar label={labels.macros.protein} value={week.macros.protein} max={300} color="text-cyan" />
          <MacroBar label={labels.macros.carbs} value={week.macros.carbs} max={500} color="text-primary" />
          <MacroBar label={labels.macros.fat} value={week.macros.fat} max={150} color="text-amber-400" />
        </div>
      </div>

      <div className="flex gap-3 rounded-2xl border border-cyan/20 bg-cyan/5 p-4">
        <Info className="h-4 w-4 shrink-0 text-cyan mt-0.5" />
        <p className="text-xs leading-relaxed text-muted-foreground">{week.tip}</p>
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
          {mealKeys.map((key) => (
            <MealCard key={key} meal={dayPlan?.[key] ?? week[key]} mealKey={key} labels={labels} />
          ))}
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
  ["ovos", "aveia", "frango grelhado", "arroz integral", "brócolis", "batata doce", "tilápia"],
  ["iogurte grego", "banana", "patinho moído", "quinoa", "abobrinha", "mandioca", "salmão"],
  ["cottage", "mamão", "frango desfiado", "feijão", "espinafre", "inhame", "atum"],
  ["claras", "pão integral", "peru", "arroz parboilizado", "salada verde", "cuscuz", "merluza"],
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

    try {
      const res = await fetch("/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          },
        }),
      });

      if (!res.ok) throw new Error(`${res.status}`);

      const data = normalizeMealPlanForUi((await res.json()) as MealPlan);
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
            {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
              <button
                key={w}
                onClick={() => setWeek(w)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-bold transition ${
                  week === w
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-surface text-muted-foreground"
                }`}
              >
                {labels.weekLabel[0]}{w}
              </button>
            ))}
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
                <WeekView week={currentWeek} labels={labels} />
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
