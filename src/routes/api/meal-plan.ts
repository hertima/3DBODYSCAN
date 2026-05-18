import { createFileRoute } from "@tanstack/react-router";
import type { WeekPlan } from "@/lib/meal-plan";
import { verifyFirebaseToken } from "@/lib/server-auth";

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
};

type MealPlanRequest = {
  locale?: string;
  regenerationId?: string;
  avoidFoods?: string[];
  profile: ProfileInput;
};

const GOAL_LABEL: Record<string, string> = {
  mass: "ganho de massa muscular",
  strength: "força máxima",
  hybrid: "hipertrofia + força",
  athletic: "performance atlética",
  weight_loss: "perda de peso",
  definition: "definição muscular",
  endurance: "resistência",
  wellness: "saúde e bem-estar",
};

export const Route = createFileRoute("/api/meal-plan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
    const uid = await verifyFirebaseToken(request.headers.get("Authorization"));
    if (!uid) return new Response("Unauthorized", { status: 401 });

    const { profile, locale = "pt", regenerationId, avoidFoods = [] } = (await request.json()) as MealPlanRequest;
    const key = process.env.OPENAI_API_KEY;

    const goalLabel = GOAL_LABEL[profile.goal] ?? profile.goal;
    const bmr =
      profile.gender === "female"
        ? 655 + 9.6 * profile.weight + 1.8 * profile.height - 4.7 * profile.age
        : 88.4 + 13.4 * profile.weight + 4.8 * profile.height - 5.7 * profile.age;
    const tdee = Math.round(bmr * 1.55);

    const variationSeed = regenerationId ?? crypto.randomUUID();
    const avoidList = avoidFoods.slice(0, 35).join(", ");
    const fallbackPlan = () => buildFallbackMealPlan(profile, locale, variationSeed);

    if (!key) {
      return jsonResponse(fallbackPlan());
    }

    const prompt = `Você é um nutricionista esportivo de elite. Crie SOMENTE um plano alimentar de 12 semanas personalizado.

IMPORTANTE:
- Isto NÃO é treino.
- NÃO escreva exercícios, séries, repetições, descanso, workout, treino, aquecimento ou blocos de musculação.
- A resposta deve conter apenas refeições, alimentos, calorias e macros.
- O idioma da resposta deve seguir este locale: ${locale}.

PERFIL:
- Objetivo: ${goalLabel}
- Peso: ${profile.weight}kg | Altura: ${profile.height}cm | Idade: ${profile.age} anos
- Gênero: ${profile.gender === "female" ? "Feminino" : profile.gender === "male" ? "Masculino" : "Outro"}
- Tipo de dieta: ${profile.dietType || "onívoro"}
- Metabolismo: ${profile.metabolismType || "balanceado"}
- TDEE estimado: ${tdee} kcal/dia
${profile.name ? `- Nome: ${profile.name}` : ""}
- Seed obrigatório de variação: ${variationSeed}
${avoidList ? `- Evite repetir estes alimentos do plano anterior, exceto se forem essenciais: ${avoidList}` : ""}

REGRAS:
- Semanas 1-4: fase de adaptação (calorias base)
- Semanas 5-8: fase de desenvolvimento (+5-10% calorias se ganho de massa, -5% se perda)
- Semanas 9-12: fase de otimização/pico
- Proteína: mínimo 1.8g/kg de peso corporal
- O plano deve parecer uma prescrição profissional de nutricionista: estratégia, ajuste calórico, timing, hidratação, adesão, lista de compras e substituições.
- Cada refeição deve ter nome criativo, 2-5 alimentos, calorias e macros
- O "tip" deve ser uma dica prática e específica para aquela semana
- Cada semana deve ter 7 dias com refeições diferentes. Não use o mesmo cardápio de segunda a domingo.
- Varie fontes de proteína, carboidratos, gorduras e vegetais entre os dias e entre as semanas.
- Não repita a mesma combinação de alimentos em dias seguidos.
- Ao regenerar, crie um plano visivelmente diferente usando o seed de variação.
- "weekFocus" deve falar de nutrição, exemplo: calorias, proteína, hidratação, adesão alimentar.
- "tip" deve ser uma dica alimentar prática. Nunca dica de treino.

Responda SOMENTE com JSON válido neste formato exato:
{
  "weeks": [
    {
      "week": 1,
      "phase": "adaptacao",
      "weekFocus": "string curta (ex: Adaptação e controle calórico)",
      "strategy": "estratégia nutricional profissional da semana em 1 frase",
      "dailyCalories": número,
      "calorieAdjustment": "ex: manutenção técnica, déficit leve, superávit controlado",
      "macros": {"protein": número, "carbs": número, "fat": número},
      "macroStrategy": "como distribuir proteína, carboidrato e gordura ao longo do dia",
      "breakfast": {"name": "string", "foods": ["alimento1","alimento2","alimento3"], "calories": número, "protein": número, "carbs": número, "fat": número},
      "morningSnack": {"name": "string", "foods": ["alimento1","alimento2"], "calories": número, "protein": número, "carbs": número, "fat": número},
      "lunch": {"name": "string", "foods": ["alimento1","alimento2","alimento3","alimento4"], "calories": número, "protein": número, "carbs": número, "fat": número},
      "preWorkout": {"name": "string", "foods": ["alimento1","alimento2"], "calories": número, "protein": número, "carbs": número, "fat": número},
      "dinner": {"name": "string", "foods": ["alimento1","alimento2","alimento3"], "calories": número, "protein": número, "carbs": número, "fat": número},
      "tip": "string",
      "hydrationTarget": "meta prática de água/eletrólitos da semana",
      "mealTiming": "orientação de horários e pré/pós-treino",
      "adherenceGoal": "meta simples de adesão da semana",
      "groceryFocus": ["item de compra 1","item de compra 2","item de compra 3","item de compra 4"],
      "swapOptions": ["troca alimentar 1","troca alimentar 2","troca alimentar 3"],
      "days": [
        {
          "day": 0,
          "breakfast": {"name": "string", "foods": ["alimento1","alimento2"], "calories": número, "protein": número, "carbs": número, "fat": número},
          "morningSnack": {"name": "string", "foods": ["alimento1","alimento2"], "calories": número, "protein": número, "carbs": número, "fat": número},
          "lunch": {"name": "string", "foods": ["alimento1","alimento2","alimento3"], "calories": número, "protein": número, "carbs": número, "fat": número},
          "preWorkout": {"name": "string", "foods": ["alimento1","alimento2"], "calories": número, "protein": número, "carbs": número, "fat": número},
          "dinner": {"name": "string", "foods": ["alimento1","alimento2","alimento3"], "calories": número, "protein": número, "carbs": número, "fat": número}
        }
      ]
    }
  ]
}
Gere as 12 semanas completas. Se couber, em cada semana, "days" deve ter exatamente 7 itens, com day de 0 a 6.`;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content:
                "Você é um nutricionista esportivo especializado. Responda APENAS com JSON válido, sem markdown, sem explicações.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 7000,
          temperature: 0.95,
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        return jsonResponse(fallbackPlan());
      }

      const json = (await res.json()) as { choices?: [{ message?: { content?: string } }] };
      const content = json.choices?.[0]?.message?.content;
      if (!content) {
        return jsonResponse(fallbackPlan());
      }

      const parsed = JSON.parse(content) as { weeks?: WeekPlan[]; workouts?: unknown };
      const weeks = normalizeMealPlanWeeks(parsed.weeks, profile, variationSeed);
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

const proteinRotations = [
  ["ovos", "iogurte grego", "frango grelhado", "tilapia", "patinho moido"],
  ["claras", "cottage", "atum", "salmão", "tofu"],
  ["whey protein", "queijo minas", "peru", "carne magra", "lentilha"],
  ["omelete", "kefir", "frango desfiado", "merluza", "grão-de-bico"],
];

const carbRotations = [
  ["aveia", "banana", "arroz integral", "batata doce", "mandioca"],
  ["pão integral", "mamão", "quinoa", "inhame", "macarrão integral"],
  ["tapioca", "maçã", "feijão", "abóbora", "cuscuz"],
  ["granola sem açúcar", "morango", "arroz parboilizado", "batata inglesa", "lentilha"],
];

const fatRotations = [
  ["pasta de amendoim", "castanhas", "azeite de oliva", "abacate", "sementes"],
  ["chia", "nozes", "azeite extra virgem", "tahine", "linhaça"],
  ["queijo cottage", "amêndoas", "azeitonas", "gema de ovo", "castanha-do-pará"],
  ["iogurte natural", "amendoim", "óleo de coco", "sardinha", "gergelim"],
];

const vegetableRotations = [
  ["brócolis", "salada verde", "abobrinha", "cenoura"],
  ["espinafre", "rúcula", "pepino", "tomate"],
  ["couve", "aspargos", "berinjela", "beterraba"],
  ["vagem", "alface", "repolho", "chuchu"],
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
  const protein = pickRotation(proteinRotations, seed + week, day);
  const carbs = pickRotation(carbRotations, seed + week * 3, day);
  const fats = pickRotation(fatRotations, seed + week * 5, day);
  const veggies = pickRotation(vegetableRotations, seed + week * 7, day);
  const shift = (week + day + seed) % 5;

  const foodsByMeal = {
    breakfast: [protein[shift % protein.length], carbs[0], fats[0]],
    morningSnack: [protein[1], carbs[1], fats[1]],
    lunch: [protein[2], carbs[2], veggies[day % veggies.length], fats[2]],
    preWorkout: [carbs[3], protein[3]],
    dinner: [protein[3], veggies[(day + 1) % veggies.length], carbs[4], fats[3]],
  };

  const mealNames = {
    breakfast: ["Café Proteico", "Manhã de Energia", "Base Matinal", "Início Forte"],
    morningSnack: ["Snack Leve", "Pausa Proteica", "Lanche Funcional", "Reforço da Manhã"],
    lunch: ["Almoço Completo", "Prato de Performance", "Almoço Equilibrado", "Base do Dia"],
    preWorkout: ["Combustível Pré-Treino", "Energia Sustentada", "Pré-Treino Leve", "Carga de Energia"],
    dinner: ["Jantar de Recuperação", "Noite Leve", "Final Nutritivo", "Jantar Equilibrado"],
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

function buildFallbackMealPlan(profile: ProfileInput, locale: string, seedText: string) {
  const bmr =
    profile.gender === "female"
      ? 655 + 9.6 * profile.weight + 1.8 * profile.height - 4.7 * profile.age
      : 88.4 + 13.4 * profile.weight + 4.8 * profile.height - 5.7 * profile.age;
  const tdee = Math.round(bmr * 1.55);
  const seed = hashString(`${seedText}|${profile.goal}|${profile.dietType}|${profile.metabolismType}`);

  const weeks = Array.from({ length: 12 }, (_, index) => {
    const weekNumber = index + 1;
    const phase = resolvePhase(weekNumber);
    const dailyCalories = resolveDailyCalories(tdee, profile.goal, weekNumber);
    const protein = Math.max(Math.round(profile.weight * 1.9), 110);
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

function resolveDailyCalories(tdee: number, goal: string, week: number) {
  if (goal === "weight_loss" || goal === "definition") {
    const deficit = week <= 4 ? 300 : week <= 8 ? 400 : 350;
    return Math.max(1500, tdee - deficit);
  }
  if (goal === "mass") {
    const surplus = week <= 4 ? 150 : week <= 8 ? 250 : 200;
    return tdee + surplus;
  }
  if (goal === "strength" || goal === "hybrid" || goal === "athletic") {
    return tdee + (week <= 4 ? 0 : week <= 8 ? 120 : 80);
  }
  return tdee;
}

function buildBaseMeals(macros: WeekPlan["macros"], dailyCalories: number, week: number, seed: number) {
  const protein = pickRotation(proteinRotations, seed + week, 0);
  const carbs = pickRotation(carbRotations, seed + week * 3, 0);
  const fats = pickRotation(fatRotations, seed + week * 5, 0);
  const veggies = pickRotation(vegetableRotations, seed + week * 7, 0);

  return {
    breakfast: buildMeal("Café da Manhã Proteico", [protein[0], carbs[0], fats[0]], dailyCalories, macros, 0.22),
    morningSnack: buildMeal("Lanche de Sustentação", [protein[1], carbs[1]], dailyCalories, macros, 0.1),
    lunch: buildMeal("Almoço Completo", [protein[2], carbs[2], veggies[0], fats[2]], dailyCalories, macros, 0.3),
    preWorkout: buildMeal("Combustível Pré-Treino", [carbs[3], protein[3]], dailyCalories, macros, 0.14),
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
  const textFields = [item.weekFocus, item.tip].filter((field): field is string => typeof field === "string");

  return (
    item.week === index + 1 &&
    typeof item.weekFocus === "string" &&
    !textFields.some(containsTrainingText) &&
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

function normalizeMealPlanWeeks(
  weeks: unknown,
  profile: ProfileInput,
  seedText: string,
): WeekPlan[] | null {
  if (!Array.isArray(weeks) || weeks.length !== 12) return null;

  return weeks.map((week, index): WeekPlan | null => {
    if (!isBaseWeekPlan(week, index)) return null;
    const completed = completeProfessionalFields(week, profile);
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
