const KEY = "zyrox.meal-plan";

export type Meal = {
  name: string;
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type WeekPlan = {
  week: number;
  phase?: "adaptacao" | "desenvolvimento" | "otimizacao";
  weekFocus: string;
  strategy?: string;
  dailyCalories: number;
  calorieAdjustment?: string;
  macros: { protein: number; carbs: number; fat: number };
  macroStrategy?: string;
  breakfast: Meal;
  morningSnack: Meal;
  lunch: Meal;
  preWorkout: Meal;
  dinner: Meal;
  tip: string;
  hydrationTarget?: string;
  mealTiming?: string;
  adherenceGoal?: string;
  groceryFocus?: string[];
  swapOptions?: string[];
  days?: DayMealPlan[];
};

export type DayMealPlan = {
  day: number;
  breakfast: Meal;
  morningSnack: Meal;
  lunch: Meal;
  preWorkout: Meal;
  dinner: Meal;
};

export type MealPlan = {
  version?: number;
  generatedAt: string;
  locale?: string;
  weeks: WeekPlan[];
};

export function loadMealPlan(): MealPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MealPlan) : null;
  } catch {
    return null;
  }
}

export function saveMealPlan(plan: MealPlan) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(plan));
}

export function clearMealPlan() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
