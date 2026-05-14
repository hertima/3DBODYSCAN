export type Macro = { eaten: number; goal: number };
export type Meal = { id: string; name: string; time: string; kcal: number; goal: number };
export type Hydration = { eatenMl: number; goalMl: number };

export const nutritionToday = {
  kcal: { eaten: 1300, goal: 2400 },
  hydration: { eatenMl: 1400, goalMl: 2500 } as Hydration,
  macros: {
    protein: { eaten: 80, goal: 200 } as Macro,
    fat: { eaten: 88, goal: 136 } as Macro,
    carbs: { eaten: 120, goal: 240 } as Macro,
  },
  meals: [
    { id: "m1", name: "Café da manhã", time: "08:00", kcal: 420, goal: 500 },
    { id: "m2", name: "Almoço", time: "12:30", kcal: 680, goal: 800 },
    { id: "m3", name: "Lanche", time: "16:00", kcal: 200, goal: 300 },
    { id: "m4", name: "Jantar", time: "20:00", kcal: 0, goal: 800 },
  ] as Meal[],
};

export const aiNutritionTips = [
  { id: "t1", title: "Hidratação", desc: "Você bebeu 1.4L hoje. Faltam 1.1L para a meta. Tome 2 copos antes do treino." },
  { id: "t2", title: "Pré-treino", desc: "Treino em 2h. Sugiro 30g de aveia + 1 banana — energia limpa sem peso no estômago." },
  { id: "t3", title: "Déficit semanal", desc: "Você está 1.800 kcal abaixo da meta na semana. Ritmo ideal para recomposição." },
];
