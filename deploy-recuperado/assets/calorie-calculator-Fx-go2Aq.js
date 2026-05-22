function calculateCalories(params) {
  const bmr = params.gender === "female" ? 10 * params.weight + 6.25 * params.height - 5 * params.age - 161 : 10 * params.weight + 6.25 * params.height - 5 * params.age + 5;
  const activityMult = params.activityDays <= 1 ? 1.2 : params.activityDays <= 3 ? 1.375 : params.activityDays <= 5 ? 1.55 : 1.725;
  const metAdj = params.metabolismType === "slow" ? 0.95 : params.metabolismType === "fast" ? 1.05 : 1;
  const tdee = Math.round(bmr * activityMult * metAdj);
  const surplusOrDeficit = params.goal === "mass" ? 350 : params.goal === "strength" ? 200 : params.goal === "hybrid" ? 100 : params.goal === "definition" ? -200 : params.goal === "weight_loss" ? -500 : params.goal === "endurance" ? 150 : 0;
  const target = Math.max(1200, tdee + surplusOrDeficit);
  const proteinG = Math.round(params.weight * (params.goal === "weight_loss" || params.goal === "definition" ? 2.4 : params.goal === "mass" ? 2.2 : 1.8));
  const fatG = Math.round(target * 0.25 / 9);
  const carbG = Math.round((target - proteinG * 4 - fatG * 9) / 4);
  const label = params.goal === "mass" ? "Superávit p/ hipertrofia" : params.goal === "strength" ? "Superávit leve p/ força" : params.goal === "hybrid" ? "Manutenção ativa" : params.goal === "definition" ? "Déficit leve p/ definição" : params.goal === "weight_loss" ? "Déficit calórico p/ emagrecimento" : params.goal === "endurance" ? "Superávit p/ resistência" : params.goal === "wellness" ? "Manutenção / bem-estar" : "Manutenção / performance";
  return {
    bmr: Math.round(bmr),
    tdee,
    target,
    protein: proteinG,
    carbs: Math.max(0, carbG),
    fat: fatG,
    surplusOrDeficit,
    label
  };
}
function getCaloriesFromOnboarding(state) {
  if (!state.weight || !state.height || !state.age || !state.gender || !state.goal || !state.metabolismType) return null;
  return calculateCalories({
    weight: state.weight,
    height: state.height,
    age: state.age,
    gender: state.gender,
    activityDays: state.days?.length ?? 4,
    metabolismType: state.metabolismType,
    goal: state.goal
  });
}
export {
  calculateCalories as c,
  getCaloriesFromOnboarding as g
};