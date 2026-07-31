import { createFileRoute } from "@tanstack/react-router";
import type { WeekPlan, Meal } from "@/lib/meal-plan";
import { verifyFirebaseToken } from "@/lib/server-auth";
import { OPENAI_MODEL } from "@/lib/openai-config";

type ProfileInput = {
  goal: string;
  weight: number;
  height: number;
  age: number;
  gender: string;
  dietType: string;
  mealFrequency: string;
  metabolismType: string;
  name?: string;
  trainingDays?: number;
  experience?: string;
  trainingType?: string;
  focusMuscles?: string[];
  trackCycle?: boolean;
  menstrualCyclePhase?: string;
  consistency?: string;
  // plano calórico já fechado no onboarding — quando presente, usar em vez de recalcular
  calorieTarget?: number;
  calorieProtein?: number;
  // divisão semanal de treino real (ex: "Mon: Peito (...), Tue: Costas (...)")
  weeklySplit?: string;
};

type MealPlanRequest = {
  locale?: string;
  regenerationId?: string;
  avoidFoods?: string[];
  profile: ProfileInput;
};

const GOAL_LABEL: Record<string, string> = {
  mass: "muscle mass gain",
  strength: "maximum strength",
  hybrid: "hypertrophy + strength",
  athletic: "athletic performance",
  weight_loss: "weight loss",
  definition: "muscle definition / cutting",
  endurance: "endurance",
  wellness: "health and wellness",
};

const FOOD_CULTURE: Record<string, string> = {
  pt: "Brazil — affordable everyday foods: arroz branco, feijão preto/carioca, frango grelhado, carne moída, ovos, batata doce, mandioca, tapioca, pão integral, iogurte natural, banana, mamão, brócolis, espinafre, azeite, sardinha enlatada — avoid salmon, shrimp, premium seafood",
  es: "Latin America — affordable everyday foods: arroz, frijoles, pollo asado, carne molida, huevos, plátano, yuca, papa, tortilla integral, tomate, lechuga, frutas locales (mango, piña, naranja), aceite vegetal, atún en lata, yogur natural — avoid shrimp, salmon",
  en: "USA/UK — affordable everyday foods: oats, whole grain bread, brown rice, sweet potato, chicken breast, eggs, Greek yogurt, cottage cheese, canned tuna, black beans, broccoli, spinach, carrots, olive oil, peanut butter, apple, banana — avoid salmon, shrimp, premium fish",
  fr: "France/francophone — affordable everyday foods: pain complet, riz, pâtes complètes, poulet, oeufs, yaourt nature, fromage blanc, lentilles, haricots verts, carottes, épinards, huile d'olive, sardines en boîte, thon en boîte, fruits de saison — éviter saumon, crevettes",
  de: "Germany/DACH — affordable everyday foods: Vollkornbrot, Haferflocken, Hähnchen, Kartoffeln, Eier, Magerquark, Linsen, Brokkoli, Karotten, Spinat, Olivenöl, Thunfisch aus der Dose, Beeren, Nüsse, Hüttenkäse — kein Lachs, keine Meeresfrüchte",
};

export const Route = createFileRoute("/api/meal-plan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
    const uid = await verifyFirebaseToken(request.headers.get("Authorization"));
    if (!uid) return new Response("Unauthorized", { status: 401 });

    const raw = (await request.json()) as MealPlanRequest;
    const profile = raw.profile;
    const locale = String(raw.locale ?? "pt").slice(0, 5);
    const regenerationId = raw.regenerationId ? String(raw.regenerationId).slice(0, 64) : undefined;
    const avoidFoods = Array.isArray(raw.avoidFoods) ? raw.avoidFoods.slice(0, 35).map((f) => String(f).slice(0, 100)) : [];
    const key = process.env.OPENAI_API_KEY;

    const goalLabel = GOAL_LABEL[profile.goal] ?? profile.goal;

    // Mifflin-St Jeor (same formula as calorie-calculator.ts)
    const bmr =
      profile.gender === "female"
        ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
        : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;

    const activityDays = profile.trainingDays ?? 4;
    const activityMult =
      activityDays <= 1 ? 1.2
      : activityDays <= 3 ? 1.375
      : activityDays <= 5 ? 1.55
      : 1.725;

    const metAdj =
      profile.metabolismType === "slow" || profile.metabolismType === "lento" ? 0.95
      : profile.metabolismType === "fast" || profile.metabolismType === "rápido" ? 1.05
      : 1.0;

    const tdee = Math.round(bmr * activityMult * metAdj);

    const surplusOrDeficit =
      profile.goal === "mass" ? 350
      : profile.goal === "strength" ? 200
      : profile.goal === "hybrid" ? 100
      : profile.goal === "definition" ? -200
      : profile.goal === "weight_loss" ? -500
      : profile.goal === "endurance" ? 150
      : 0;

    const targetCalories = profile.calorieTarget ?? Math.max(1200, tdee + surplusOrDeficit);

    const proteinTarget = profile.calorieProtein ?? Math.round(profile.weight * (
      profile.goal === "weight_loss" || profile.goal === "definition" ? 2.4
      : profile.goal === "mass" ? 2.2
      : 1.8
    ));

    const variationSeed = regenerationId ?? crypto.randomUUID();
    const avoidList = avoidFoods.slice(0, 35).join(", ");
    const fallbackPlan = () => buildFallbackMealPlan(profile, locale, variationSeed, tdee, targetCalories);

    if (!key) {
      return jsonResponse(fallbackPlan());
    }

    const LANGUAGE_NAME: Record<string, string> = {
      pt: "português brasileiro", es: "español", en: "English", fr: "français", de: "Deutsch",
    };
    const mealLang = LANGUAGE_NAME[locale] ?? LANGUAGE_NAME.pt;

    const foodCulture = FOOD_CULTURE[locale] ?? FOOD_CULTURE.pt;

    const prompt = `OUTPUT LANGUAGE: ${mealLang}
MANDATORY: Every single text value in the JSON MUST be written in ${mealLang}. Zero exceptions. Never use Portuguese if the target language is not Portuguese.

Create a personalized 12-week nutrition plan. Nutrition only — no workouts, no training references.

PROFILE:
- Goal: ${goalLabel}
- Weight: ${profile.weight}kg | Height: ${profile.height}cm | Age: ${profile.age} years
- Gender: ${profile.gender === "female" ? "Female" : profile.gender === "male" ? "Male" : "Other"}
- Diet type: ${profile.dietType || "omnivore"}
- Metabolism: ${profile.metabolismType || "balanced"}
- Training days per week: ${activityDays}
${profile.weeklySplit ? `- Actual weekly training split (align meal timing/pre-workout carbs with training days, lighter on rest days): ${profile.weeklySplit}` : ""}
- BMR (resting): ${Math.round(bmr)} kcal/day
- TDEE (active): ${tdee} kcal/day
- Caloric target: ${targetCalories} kcal/day (${surplusOrDeficit > 0 ? `+${surplusOrDeficit}` : surplusOrDeficit} kcal ${surplusOrDeficit >= 0 ? "surplus" : "deficit"})
- Protein target: ${proteinTarget}g/day (${profile.weight}kg × ${profile.goal === "weight_loss" || profile.goal === "definition" ? "2.4" : profile.goal === "mass" ? "2.2" : "1.8"}g/kg)
- Meal frequency: ${profile.mealFrequency || "5 meals/day"}
${profile.experience ? `- Fitness experience: ${profile.experience}` : ""}
${profile.trainingType ? `- Training type: ${profile.trainingType}` : ""}
${profile.focusMuscles && profile.focusMuscles.length > 0 ? `- Muscle focus: ${profile.focusMuscles.join(", ")}` : ""}
${profile.trackCycle && profile.gender === "female" && profile.menstrualCyclePhase ? `- Menstrual cycle phase: ${profile.menstrualCyclePhase} (adapt nutrition accordingly: carb cycling, iron intake, bloating management)` : ""}
${profile.consistency ? `- Training consistency: ${profile.consistency}` : ""}
${profile.name ? `- Name: ${profile.name}` : ""}
- Variation seed (use this to produce a different plan on each regeneration): ${variationSeed}
${avoidList ? `- Do NOT repeat these foods from the previous plan unless nutritionally essential: ${avoidList}` : ""}

REGIONAL FOOD CULTURE: ${foodCulture}
Prioritize these culturally appropriate, affordable everyday foods. Name all food items using local terminology in ${mealLang}. Use AFFORDABLE, ACCESSIBLE ingredients only — no salmon, shrimp, or premium seafood.

RULES:
- ALL 12 weeks use EXACTLY ${targetCalories} kcal/day — do NOT change the daily calorie total between phases
- Weeks 1-4 (adaptacao): simpler meals, build consistency, straightforward food choices
- Weeks 5-8 (desenvolvimento): increase variety, refine meal timing, optimize nutrient quality
- Weeks 9-12 (otimizacao): peak adherence, advanced food quality, precise macro distribution
- Protein: minimum 1.8g/kg body weight per day
- The plan must read like a professional nutritionist's prescription: include strategy, caloric adjustment, meal timing, hydration, adherence, shopping focus, and food swaps
- Each meal must have a creative local name (in ${mealLang}), 3 to 5 SPECIFIC foods with quantities, calories and macros — never list only 2 foods
- Breakfast must contain eggs and/or dairy (e.g., eggs, Greek yogurt, cottage, ricotta, cheese) — NEVER ground beef, fish, or chicken for breakfast
- Morning snack: light, portable (fruit + dairy or nuts)
- Lunch: the largest meal with protein + carb + vegetables + healthy fat
- Pre-workout: 2-3 hours before training — carb-focused + moderate protein, easy to digest
- Dinner: lean protein + vegetables + moderate carbs
- Use ONLY popular, affordable, everyday foods from the regional food culture above
- "weekFocus" must address nutrition (e.g., caloric intake, protein distribution, hydration, adherence)
- "tip" must be a practical nutrition tip — never a workout tip
- Use the variation seed to ensure a visibly different plan on each regeneration

Respond ONLY with valid JSON in this exact format (no markdown, no text outside JSON):
{
  "weeks": [
    {
      "week": 1,
      "phase": "adaptacao",
      "weekFocus": "<short nutrition focus string in ${mealLang}>",
      "strategy": "<professional nutritional strategy for this week, 1 sentence, in ${mealLang}>",
      "dailyCalories": <number>,
      "calorieAdjustment": "<caloric approach in ${mealLang}, e.g.: controlled surplus, technical maintenance, light deficit>",
      "macros": {"protein": <number>, "carbs": <number>, "fat": <number>},
      "macroStrategy": "<how to distribute protein, carbs and fat throughout the day, in ${mealLang}>",
      "breakfast": {"name": "<creative meal name in ${mealLang}>", "foods": ["food1","food2","food3"], "calories": <number>, "protein": <number>, "carbs": <number>, "fat": <number>},
      "morningSnack": {"name": "<snack name in ${mealLang}>", "foods": ["food1","food2"], "calories": <number>, "protein": <number>, "carbs": <number>, "fat": <number>},
      "lunch": {"name": "<meal name in ${mealLang}>", "foods": ["food1","food2","food3","food4"], "calories": <number>, "protein": <number>, "carbs": <number>, "fat": <number>},
      "preWorkout": {"name": "<meal name in ${mealLang}>", "foods": ["food1","food2"], "calories": <number>, "protein": <number>, "carbs": <number>, "fat": <number>},
      "dinner": {"name": "<meal name in ${mealLang}>", "foods": ["food1","food2","food3"], "calories": <number>, "protein": <number>, "carbs": <number>, "fat": <number>},
      "tip": "<practical nutrition tip for this week in ${mealLang}>",
      "hydrationTarget": "<practical hydration goal for the week in ${mealLang}>",
      "mealTiming": "<meal timing and pre/post-workout nutrition guidance in ${mealLang}>",
      "adherenceGoal": "<simple weekly adherence goal in ${mealLang}>",
      "groceryFocus": ["<key grocery item 1 in ${mealLang}>","<item 2>","<item 3>","<item 4>"],
      "swapOptions": ["<food swap option 1 in ${mealLang}>","<swap 2>","<swap 3>"]
    }
  ]
}
IMPORTANT: Do NOT include a "days" array inside any week — only the 12 weekly summaries above.
Generate all 12 weeks. Vary meals, proteins, carbs, and fats across all weeks.
FINAL REMINDER: ALL text values MUST be in ${mealLang}. No Portuguese if the target language is not Portuguese.`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      let res: Response;
      try {
        res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
              {
                role: "system",
                content: `You are an elite sports nutritionist. Respond ONLY with valid JSON — no markdown, no text outside the JSON object. OUTPUT LANGUAGE IS ${mealLang}. This is non-negotiable: every text value in the JSON (weekFocus, strategy, tip, meal names, food items, hydrationTarget, mealTiming, adherenceGoal, calorieAdjustment, macroStrategy, groceryFocus, swapOptions) MUST be written exclusively in ${mealLang}. If ${mealLang} is not Portuguese, do NOT use a single Portuguese word anywhere in the response.`,
              },
              { role: "user", content: prompt },
            ],
            max_tokens: 5000,
            temperature: 0.9,
            response_format: { type: "json_object" },
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!res.ok) {
        return jsonResponse(fallbackPlan());
      }

      const json = (await res.json()) as { choices?: [{ message?: { content?: string } }] };
      const content = json.choices?.[0]?.message?.content;
      if (!content) {
        return jsonResponse(fallbackPlan());
      }

      let parsed: { weeks?: WeekPlan[]; workouts?: unknown };
      try {
        parsed = JSON.parse(content) as { weeks?: WeekPlan[]; workouts?: unknown };
      } catch {
        return jsonResponse(fallbackPlan());
      }

      const weeks = normalizeMealPlanWeeks(parsed.weeks, profile, variationSeed, targetCalories);
      if (parsed.workouts || !isValidMealPlanWeeks(weeks)) {
        return jsonResponse(fallbackPlan());
      }

      return jsonResponse({
        version: 2,
        generatedAt: new Date().toISOString(),
        locale,
        weeks,
      });
    } catch {
      return jsonResponse(fallbackPlan());
    }
  },
    },
  },
});

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
  });
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isMeal(value: unknown): value is WeekPlan["breakfast"] {
  if (!value || typeof value !== "object") return false;
  const meal = value as WeekPlan["breakfast"];
  return (
    typeof meal.name === "string" &&
    Array.isArray(meal.foods) &&
    meal.foods.length >= 2 &&
    meal.foods.every((food) => typeof food === "string") &&
    isNumber(meal.calories) &&
    isNumber(meal.protein) &&
    isNumber(meal.carbs) &&
    isNumber(meal.fat)
  );
}

function cloneMeal(meal: WeekPlan["breakfast"]): WeekPlan["breakfast"] {
  return {
    name: meal.name,
    foods: [...meal.foods],
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
  };
}

// Proteínas para café da manhã: apenas ovos, laticínios, frango desfiado
const breakfastProteinRotations = [
  ["ovos mexidos", "iogurte grego", "omelete", "cottage", "claras mexidas"],
  ["ovo frito", "iogurte natural", "ricota", "queijo minas frescal", "ovos cozidos"],
  ["omelete de 3 ovos", "iogurte proteico", "frango desfiado", "cottage cremoso", "claras"],
  ["ovos estrelados", "iogurte com granola", "frango cozido desfiado", "queijo cottage", "omelete de claras"],
];

// Proteínas para almoço, pré-treino e jantar
const proteinRotations = [
  ["frango grelhado", "carne moída refogada", "peito de frango", "ovos cozidos", "feijão cozido"],
  ["frango assado", "filé de frango", "peito de frango fatiado", "cottage", "lentilha cozida"],
  ["frango desfiado", "carne bovina grelhada", "frango temperado", "iogurte grego", "grão-de-bico cozido"],
  ["peito de peru fatiado", "frango cozido", "carne magra grelhada", "queijo minas", "feijão preto"],
];

const carbRotations = [
  ["arroz branco", "banana", "batata doce", "aveia", "pão integral"],
  ["arroz integral", "mamão", "mandioca cozida", "granola natural", "tapioca"],
  ["batata inglesa cozida", "maçã", "macarrão integral", "inhame cozido", "cuscuz nordestino"],
  ["pão de forma integral", "laranja", "quinoa cozida", "batata doce assada", "arroz parboilizado"],
];

const fatRotations = [
  ["pasta de amendoim", "castanhas mistas", "azeite de oliva", "abacate", "amendoim torrado"],
  ["chia", "nozes", "azeite extra virgem", "pasta de amendoim integral", "linhaça moída"],
  ["amêndoas", "óleo de coco", "sementes de girassol", "queijo minas frescal", "gergelim"],
  ["amendoim", "castanha-do-pará", "azeite", "guacamole", "mix de castanhas"],
];

const vegetableRotations = [
  ["brócolis cozido", "salada verde", "abobrinha grelhada", "cenoura ralada"],
  ["espinafre refogado", "rúcula", "pepino fatiado", "tomate cereja"],
  ["couve refogada", "alface americana", "berinjela assada", "beterraba cozida"],
  ["vagem cozida", "mix de folhas verdes", "pimentão", "repolho refogado"],
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function pickRotation<T>(items: T[][], seed: number, day: number) {
  return items[(seed + day) % items.length];
}

function buildMealVariant(
  base: WeekPlan["breakfast"],
  mealKey: "breakfast" | "morningSnack" | "lunch" | "preWorkout" | "dinner",
  week: number,
  day: number,
  seed: number,
): WeekPlan["breakfast"] {
  const bfProtein = pickRotation(breakfastProteinRotations, seed + week, day);
  const protein = pickRotation(proteinRotations, seed + week, day);
  const carbs = pickRotation(carbRotations, seed + week * 3, day);
  const fats = pickRotation(fatRotations, seed + week * 5, day);
  const veggies = pickRotation(vegetableRotations, seed + week * 7, day);
  const shift = (week + day + seed) % 5;

  const foodsByMeal = {
    breakfast: [bfProtein[shift % bfProtein.length], carbs[0], fats[0]],
    morningSnack: [bfProtein[(shift + 1) % bfProtein.length], carbs[1], fats[1]],
    lunch: [protein[2], carbs[2], veggies[day % veggies.length], fats[2]],
    preWorkout: [carbs[3], protein[3], carbs[0]],
    dinner: [protein[3], veggies[(day + 1) % veggies.length], carbs[4], fats[3]],
  };

  const mealNames = {
    breakfast: ["Café Proteico", "Manhã Energética", "Café da Manhã Completo", "Início Forte"],
    morningSnack: ["Lanche da Manhã", "Pausa Proteica", "Lanche Funcional", "Reforço Matinal"],
    lunch: ["Almoço Completo", "Prato de Performance", "Almoço Equilibrado", "Prato do Dia"],
    preWorkout: ["Combustível Pré-Treino", "Energia para o Treino", "Pré-Treino Leve", "Carga de Energia"],
    dinner: ["Jantar de Recuperação", "Noite Leve e Nutritiva", "Jantar Completo", "Jantar Equilibrado"],
  };

  return {
    ...cloneMeal(base),
    name: mealNames[mealKey][(day + week + seed) % mealNames[mealKey].length],
    foods: foodsByMeal[mealKey],
  };
}

function buildFallbackDays(week: WeekPlan, profile: ProfileInput, seedText: string) {
  const seed = hashString(`${seedText}|${profile.goal}|${profile.dietType}|${week.week}`);
  return Array.from({ length: 7 }, (_, day) => ({
    day,
    breakfast: buildMealVariant(week.breakfast, "breakfast", week.week, day, seed),
    morningSnack: buildMealVariant(week.morningSnack, "morningSnack", week.week, day, seed),
    lunch: buildMealVariant(week.lunch, "lunch", week.week, day, seed),
    preWorkout: buildMealVariant(week.preWorkout, "preWorkout", week.week, day, seed),
    dinner: buildMealVariant(week.dinner, "dinner", week.week, day, seed),
  }));
}

function resolvePhase(week: number): NonNullable<WeekPlan["phase"]> {
  if (week <= 4) return "adaptacao";
  if (week <= 8) return "desenvolvimento";
  return "otimizacao";
}

function resolveCalorieAdjustment(profile: ProfileInput, week: WeekPlan) {
  const goal = profile.goal;
  if (goal === "weight_loss" || goal === "definition") {
    if (week.week <= 4) return "Déficit leve com proteína alta para preservar massa magra.";
    if (week.week <= 8) return "Déficit moderado com carboidratos posicionados em torno do treino.";
    return "Ajuste fino do déficit conforme energia, fome e evolução das medidas.";
  }

  if (goal === "mass") {
    if (week.week <= 4) return "Calorias próximas da manutenção para consolidar adesão.";
    if (week.week <= 8) return "Superávit controlado para ganho gradual sem excesso de gordura.";
    return "Otimização do superávit com digestibilidade e performance como prioridade.";
  }

  return "Calorias calibradas para energia estável, recuperação e consistência.";
}

function completeProfessionalFields(week: WeekPlan, profile: ProfileInput): WeekPlan {
  const phase = week.phase ?? resolvePhase(week.week);
  const phaseLabel = phase === "adaptacao" ? "adaptação" : phase === "desenvolvimento" ? "desenvolvimento" : "otimização";
  const proteinAnchor = Math.max(25, Math.round(week.macros.protein / 5));

  return {
    ...week,
    phase,
    strategy:
      week.strategy ??
      `Semana de ${phaseLabel} com proteína distribuída, fibras em todas as refeições principais e carboidratos ajustados à rotina de treino.`,
    calorieAdjustment: week.calorieAdjustment ?? resolveCalorieAdjustment(profile, week),
    macroStrategy:
      week.macroStrategy ??
      `Mirar cerca de ${proteinAnchor}g de proteína por refeição e concentrar carboidratos no almoço e pré-treino.`,
    hydrationTarget:
      week.hydrationTarget ??
      `Meta base: 35 ml/kg de água ao dia, com uma porção extra de 500 ml em dias de treino.`,
    mealTiming:
      week.mealTiming ??
      "Pré-treino 60-120 min antes da sessão; jantar com proteína magra e vegetais para recuperação sem pesar.",
    adherenceGoal:
      week.adherenceGoal ??
      "Cumprir pelo menos 85% das refeições planejadas e registrar ajustes de fome, energia e saciedade.",
    groceryFocus:
      Array.isArray(week.groceryFocus) && week.groceryFocus.length >= 3
        ? week.groceryFocus
        : ["proteínas magras", "carboidratos integrais", "vegetais variados", "gorduras boas"],
    swapOptions:
      Array.isArray(week.swapOptions) && week.swapOptions.length >= 3
        ? week.swapOptions
        : ["frango por peixe ou ovos", "arroz por batata doce ou quinoa", "iogurte por cottage ou kefir"],
  };
}

function buildFallbackMealPlan(profile: ProfileInput, locale: string, seedText: string, tdeeInput?: number, targetCaloriesInput?: number) {
  const bmr = tdeeInput
    ? 0
    : profile.gender === "female"
      ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
      : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  const actDays = profile.trainingDays ?? 4;
  const actMult = actDays <= 1 ? 1.2 : actDays <= 3 ? 1.375 : actDays <= 5 ? 1.55 : 1.725;
  const metA = profile.metabolismType === "slow" || profile.metabolismType === "lento" ? 0.95
    : profile.metabolismType === "fast" || profile.metabolismType === "rápido" ? 1.05 : 1.0;
  const tdee = tdeeInput ?? Math.round(bmr * actMult * metA);
  const targetCalories = targetCaloriesInput ?? tdee;
  const seed = hashString(`${seedText}|${profile.goal}|${profile.dietType}|${profile.metabolismType}`);

  const proteinMultiplier = profile.goal === "weight_loss" || profile.goal === "definition" ? 2.4
    : profile.goal === "mass" ? 2.2 : 1.8;

  const weeks = Array.from({ length: 12 }, (_, index) => {
    const weekNumber = index + 1;
    const phase = resolvePhase(weekNumber);
    const dailyCalories = resolveDailyCalories(tdee, targetCalories, weekNumber);
    const protein = Math.max(Math.round(profile.weight * proteinMultiplier), 110);
    const fat = Math.max(Math.round((dailyCalories * 0.25) / 9), 45);
    const carbs = Math.max(Math.round((dailyCalories - protein * 4 - fat * 9) / 4), 90);
    const macros = { protein, carbs, fat };
    const meals = buildBaseMeals(macros, dailyCalories, weekNumber, seed);

    const baseWeek: WeekPlan = {
      week: weekNumber,
      phase,
      weekFocus: resolveWeekFocus(profile.goal, phase),
      strategy: resolveNutritionStrategy(profile.goal, phase),
      dailyCalories,
      calorieAdjustment: resolveCalorieAdjustment(profile, {
        week: weekNumber,
        phase,
        weekFocus: "",
        dailyCalories,
        macros,
        ...meals,
        tip: "",
      }),
      macros,
      macroStrategy:
        "Proteína distribuída em todas as refeições, carboidratos mais presentes no almoço e pré-treino, gorduras boas longe do horário imediato do treino.",
      ...meals,
      tip: resolveWeekTip(weekNumber, profile.goal),
      hydrationTarget: `Meta de ${Math.round(profile.weight * 35)} ml de água ao dia, com 500 ml extras nos dias de maior suor.`,
      mealTiming: "Pré-treino entre 60 e 120 minutos antes da sessão; última refeição com proteína magra, vegetais e carboidrato conforme fome.",
      adherenceGoal: "Manter 85% de adesão semanal e ajustar temperos, preparo e substituições sem sair das calorias.",
      groceryFocus: resolveGroceryFocus(seed, weekNumber),
      swapOptions: resolveSwapOptions(profile.dietType),
    };

    return {
      ...baseWeek,
      days: buildFallbackDays(baseWeek, profile, seedText),
    };
  });

  return {
    version: 2,
    generatedAt: new Date().toISOString(),
    locale,
    weeks,
  };
}

function resolveDailyCalories(_tdee: number, targetCalories: number, _week: number) {
  return Math.max(1200, targetCalories);
}

function buildBaseMeals(macros: WeekPlan["macros"], dailyCalories: number, week: number, seed: number) {
  const bfProtein = pickRotation(breakfastProteinRotations, seed + week, 0);
  const protein = pickRotation(proteinRotations, seed + week, 0);
  const carbs = pickRotation(carbRotations, seed + week * 3, 0);
  const fats = pickRotation(fatRotations, seed + week * 5, 0);
  const veggies = pickRotation(vegetableRotations, seed + week * 7, 0);

  return {
    breakfast: buildMeal("Café da Manhã Proteico", [bfProtein[0], carbs[0], fats[0]], dailyCalories, macros, 0.22),
    morningSnack: buildMeal("Lanche da Manhã", [bfProtein[1], carbs[1], fats[1]], dailyCalories, macros, 0.1),
    lunch: buildMeal("Almoço Completo", [protein[2], carbs[2], veggies[0], fats[2]], dailyCalories, macros, 0.3),
    preWorkout: buildMeal("Combustível Pré-Treino", [carbs[3], protein[3], carbs[0]], dailyCalories, macros, 0.14),
    dinner: buildMeal("Jantar de Recuperação", [protein[4] ?? protein[3], veggies[1], carbs[4], fats[3]], dailyCalories, macros, 0.24),
  };
}

function buildMeal(
  name: string,
  foods: string[],
  dailyCalories: number,
  macros: WeekPlan["macros"],
  ratio: number,
) {
  return {
    name,
    foods,
    calories: Math.round(dailyCalories * ratio),
    protein: Math.round(macros.protein * ratio),
    carbs: Math.round(macros.carbs * ratio),
    fat: Math.round(macros.fat * ratio),
  };
}

function resolveWeekFocus(goal: string, phase: NonNullable<WeekPlan["phase"]>) {
  if (phase === "adaptacao") return "Adaptação alimentar e rotina proteica";
  if (phase === "desenvolvimento") {
    return goal === "weight_loss" || goal === "definition"
      ? "Controle de déficit com energia para treinar"
      : "Desenvolvimento calórico e recuperação muscular";
  }
  return "Otimização de aderência, digestão e performance";
}

function resolveNutritionStrategy(goal: string, phase: NonNullable<WeekPlan["phase"]>) {
  if (goal === "weight_loss" || goal === "definition") {
    return phase === "adaptacao"
      ? "Criar déficit leve com alto volume alimentar, proteínas magras e vegetais em refeições principais."
      : "Sustentar o déficit com carboidratos estratégicos e opções de alta saciedade.";
  }
  if (goal === "mass") {
    return phase === "adaptacao"
      ? "Subir calorias com digestibilidade, proteína suficiente e carboidratos de fácil execução."
      : "Manter superávit controlado priorizando treino bem alimentado e recuperação.";
  }
  return "Manter energia estável com refeições simples, proteína suficiente e carboidratos bem distribuídos.";
}

function resolveWeekTip(week: number, goal: string) {
  const tips = [
    "Prepare duas proteínas base no início da semana para reduzir decisões e manter aderência.",
    "Use vegetais em almoço e jantar para melhorar saciedade sem estourar calorias.",
    "Deixe o pré-treino simples e repetível: carboidrato fácil + proteína leve.",
    "Ajuste temperos e molhos sem transformar pequenas escolhas em excesso calórico.",
  ];
  if (goal === "weight_loss" || goal === "definition") {
    tips.push("Se a fome subir, aumente salada, legumes e água antes de cortar mais calorias.");
  } else {
    tips.push("Se o peso não subir após duas semanas, aumente uma porção de carboidrato no almoço.");
  }
  return tips[(week - 1) % tips.length];
}

function resolveGroceryFocus(seed: number, week: number) {
  const protein = pickRotation(proteinRotations, seed, week);
  const carbs = pickRotation(carbRotations, seed + 2, week);
  const veggies = pickRotation(vegetableRotations, seed + 4, week);
  const fats = pickRotation(fatRotations, seed + 6, week);
  return [protein[0], protein[2], carbs[2], veggies[0], fats[0]];
}

function resolveSwapOptions(dietType: string) {
  if (/veg/i.test(dietType)) {
    return ["tofu por tempeh", "lentilha por grão-de-bico", "iogurte vegetal proteico por shake vegetal"];
  }
  return ["frango por tilápia ou ovos", "arroz por batata doce ou quinoa", "iogurte grego por cottage ou kefir"];
}

function isBaseWeekPlan(value: unknown, index: number): value is WeekPlan {
  if (!value || typeof value !== "object") return false;
  const item = value as WeekPlan;

  return (
    item.week === index + 1 &&
    typeof item.weekFocus === "string" &&
    isNumber(item.dailyCalories) &&
    item.macros != null &&
    isNumber(item.macros.protein) &&
    isNumber(item.macros.carbs) &&
    isNumber(item.macros.fat) &&
    isMeal(item.breakfast) &&
    isMeal(item.morningSnack) &&
    isMeal(item.lunch) &&
    isMeal(item.preWorkout) &&
    isMeal(item.dinner) &&
    typeof item.tip === "string"
  );
}

function hasValidDays(week: WeekPlan) {
  return (
    Array.isArray(week.days) &&
    week.days.length === 7 &&
    week.days.every((day, dayIndex) => isValidDayPlan(day, dayIndex)) &&
    !hasDuplicateAdjacentDayMeals(week)
  );
}

function enforceCalorieTarget(week: WeekPlan, targetCalories: number): WeekPlan {
  if (week.dailyCalories === targetCalories) return week;
  const ratio = week.dailyCalories > 0 ? targetCalories / week.dailyCalories : 1;

  const scaleMeal = (meal: Meal): Meal => ({
    ...meal,
    calories: Math.round(meal.calories * ratio),
    protein: Math.round(meal.protein * ratio),
    carbs: Math.round(meal.carbs * ratio),
    fat: Math.round(meal.fat * ratio),
  });

  return {
    ...week,
    dailyCalories: targetCalories,
    macros: {
      protein: Math.round(week.macros.protein * ratio),
      carbs: Math.round(week.macros.carbs * ratio),
      fat: Math.round(week.macros.fat * ratio),
    },
    breakfast: scaleMeal(week.breakfast),
    morningSnack: scaleMeal(week.morningSnack),
    lunch: scaleMeal(week.lunch),
    preWorkout: scaleMeal(week.preWorkout),
    dinner: scaleMeal(week.dinner),
  };
}

function normalizeMealPlanWeeks(
  weeks: unknown,
  profile: ProfileInput,
  seedText: string,
  targetCalories: number,
): WeekPlan[] | null {
  if (!Array.isArray(weeks) || weeks.length !== 12) return null;

  return weeks.map((week, index): WeekPlan | null => {
    if (!isBaseWeekPlan(week, index)) return null;
    const calibrated = enforceCalorieTarget(week, targetCalories);
    const completed = completeProfessionalFields(calibrated, profile);
    return {
      ...completed,
      days: hasValidDays(completed) ? completed.days : buildFallbackDays(completed, profile, seedText),
    } as WeekPlan;
  }).filter((week): week is WeekPlan => week !== null);
}

function hasDuplicateAdjacentDayMeals(week: WeekPlan) {
  if (!Array.isArray(week.days)) return true;

  const signature = (day: NonNullable<WeekPlan["days"]>[number]) =>
    ["breakfast", "morningSnack", "lunch", "preWorkout", "dinner"]
      .map((mealKey) => day[mealKey as keyof typeof day])
      .filter((meal): meal is WeekPlan["breakfast"] => typeof meal === "object" && meal !== null && "foods" in meal)
      .flatMap((meal) => meal.foods.map((food) => food.toLowerCase().trim()))
      .sort()
      .join("|");

  for (let i = 1; i < week.days.length; i++) {
    if (signature(week.days[i]) === signature(week.days[i - 1])) return true;
  }

  return false;
}

function isValidDayPlan(value: unknown, index: number): value is NonNullable<WeekPlan["days"]>[number] {
  if (!value || typeof value !== "object") return false;
  const day = value as NonNullable<WeekPlan["days"]>[number];
  return (
    day.day === index &&
    isMeal(day.breakfast) &&
    isMeal(day.morningSnack) &&
    isMeal(day.lunch) &&
    isMeal(day.preWorkout) &&
    isMeal(day.dinner)
  );
}

function containsTrainingText(value: string) {
  return /\b(treino|exerc[ií]cio|s[eé]rie|repeti[cç][aã]o|workout|descanso|supino|agachamento|remada|puxada)\b/i.test(value);
}

function isValidMealPlanWeeks(weeks: unknown): weeks is WeekPlan[] {
  if (!Array.isArray(weeks) || weeks.length !== 12) return false;

  return weeks.every((week, index) => {
    return (
      isBaseWeekPlan(week, index) &&
      hasValidDays(week)
    );
  });
}
