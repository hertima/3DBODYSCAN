import { a2 as TSS_SERVER_FUNCTION, a6 as getServerFnById, a3 as createServerFn } from "./server-C0e4gypg.js";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("01db2874b4b64d979299e5a078ebc9e55a487ca5718ff5fa68eff8898d577197"));
createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("52d063375b11993e2ab4af7319e586e007680db95abb501089ea983ad35dcb1d"));
createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("3731e3d1f427887db31e228f311f8d9ca6d24bc6bacbd498169b370ee10d6aa8"));
createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("304cb3175500817ba823ac0fbb4689bf3d15b933582a85b21041c0dfccd1a49d"));
function buildUserContext(state) {
  const GOAL_MAP = {
    mass: "Hypertrophy / Mass gain",
    strength: "Strength",
    hybrid: "Hybrid",
    athletic: "Athletic performance",
    weight_loss: "Weight loss",
    definition: "Muscle definition / Cutting",
    endurance: "Endurance",
    wellness: "Wellness"
  };
  const EXP_MAP = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced"
  };
  const GENDER_MAP = {
    male: "Male",
    female: "Female",
    other: "Non-binary / Other"
  };
  const parts = [];
  if (state.name) parts.push(`Name: ${state.name}`);
  if (state.goal) parts.push(`Goal: ${GOAL_MAP[state.goal] ?? state.goal}`);
  if (state.experience) parts.push(`Level: ${EXP_MAP[state.experience] ?? state.experience}`);
  if (state.weight) parts.push(`Weight: ${state.weight} kg`);
  if (state.height) parts.push(`Height: ${state.height} cm`);
  if (state.age) parts.push(`Age: ${state.age} yrs`);
  if (state.gender) parts.push(`Sex: ${GENDER_MAP[state.gender] ?? state.gender}`);
  if (state.metabolismType) parts.push(`Metabolism: ${state.metabolismType}`);
  if (state.location) parts.push(`Training location: ${state.location}`);
  if (state.days?.length) parts.push(`Frequency: ${state.days.length}x/week`);
  if (state.duration) parts.push(`Session duration: ${state.duration} min`);
  if (state.equipment?.length) parts.push(`Equipment: ${state.equipment.join(", ")}`);
  if (state.focusMuscles?.length) parts.push(`Muscle focus: ${state.focusMuscles.join(", ")}`);
  if (state.dietType) parts.push(`Diet style: ${state.dietType}`);
  if (state.mealFrequency) parts.push(`Meals/day: ${state.mealFrequency}`);
  if (state.oneRepMax) {
    const orm = state.oneRepMax;
    const vals = [orm.bench ? `Bench ${orm.bench}kg` : null, orm.squat ? `Squat ${orm.squat}kg` : null, orm.deadlift ? `Deadlift ${orm.deadlift}kg` : null, orm.ohp ? `OHP ${orm.ohp}kg` : null].filter(Boolean);
    if (vals.length) parts.push(`1RM: ${vals.join(", ")}`);
  }
  return parts.length === 0 ? "Profile not yet filled." : `Athlete profile:
${parts.map((p) => `• ${p}`).join("\n")}`;
}
export {
  buildUserContext as b
};