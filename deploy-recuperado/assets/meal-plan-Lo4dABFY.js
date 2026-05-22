const KEY = "zyrox.meal-plan";
function loadMealPlan() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveMealPlan(plan) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(plan));
}
function clearMealPlan() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
export {
  clearMealPlan as c,
  loadMealPlan as l,
  saveMealPlan as s
};