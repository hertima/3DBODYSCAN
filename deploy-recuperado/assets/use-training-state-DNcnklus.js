import { r as reactExports } from "./server-C0e4gypg.js";
import { G as foodScans, H as bodyMeasures, C as bodyScans, D as bodyComposition, g as getStoredLocale, a0 as getCurrentTrainingState, l as loadOnboarding, q as buildAthleteProfile, a1 as buildEnvironmentContextFromOnboarding, O as buildExerciseCatalog, a2 as buildBodyTrainingContext, a3 as buildAIWorkoutCandidates, a4 as buildNutritionTrainingContext, a5 as buildPeriodizationBlock, a6 as canAddExerciseToSelection } from "./router-BDD3RgVy.js";
import { g as getWorkoutHistory } from "./workout-history-D2efW0ov.js";
import { a as auth } from "./firebase-CeVmTMBf.js";
function daysBetween(dateStr) {
  const d = new Date(dateStr);
  const now = /* @__PURE__ */ new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1e3 * 60 * 60 * 24));
}
function buildWorkoutMemory() {
  const history = getWorkoutHistory();
  const total = history.length;
  const last28 = history.filter((w) => daysBetween(w.date) <= 28).length;
  const lastDate = history[0]?.date ?? null;
  const exerciseWeightMap = /* @__PURE__ */ new Map();
  history.slice(0, 12).forEach((w) => {
    w.exercises.forEach((e) => {
      const maxWeight = Math.max(...e.sets.map((s) => s.weight), 0);
      if (!exerciseWeightMap.has(e.name)) exerciseWeightMap.set(e.name, []);
      exerciseWeightMap.get(e.name).push(maxWeight);
    });
  });
  const plateaus = [];
  const strongPoints = [];
  exerciseWeightMap.forEach((weights, name) => {
    if (weights.length < 3) return;
    const recent = weights.slice(0, 3);
    const isStagnant = Math.max(...recent) === Math.min(...recent) && recent[0] > 0;
    const isProgressing = recent[0] > recent[recent.length - 1];
    if (isStagnant) plateaus.push(name);
    if (isProgressing) strongPoints.push(name);
  });
  const recentNames = history.slice(0, 5).map((w) => w.name);
  const recentSummary = recentNames.length > 0 ? `Últimos ${recentNames.length} treinos: ${recentNames.join(", ")}` : "Sem treinos registrados ainda";
  return { totalSessions: total, last28Days: last28, lastWorkoutDate: lastDate, recentSummary, plateaus, strongPoints };
}
function buildScanMemory() {
  const scans = bodyScans;
  if (scans.length === 0) {
    return {
      scanCount: 0,
      latestDate: null,
      bodyFatCurrent: bodyComposition.bodyFat,
      bodyFatChange: null,
      weightKg: bodyComposition.weight,
      weightChange: null,
      waistCm: null,
      waistChange: null,
      musclePriorities: [],
      trend: null
    };
  }
  const latest = scans[0];
  const oldest = scans[scans.length - 1];
  return {
    scanCount: scans.length,
    latestDate: latest.data,
    bodyFatCurrent: latest.estimativas.percentualGorduraEstimado,
    bodyFatChange: parseFloat(
      (latest.estimativas.percentualGorduraEstimado - oldest.estimativas.percentualGorduraEstimado).toFixed(1)
    ),
    weightKg: latest.calibragem.pesoKg,
    weightChange: parseFloat((latest.calibragem.pesoKg - oldest.calibragem.pesoKg).toFixed(1)),
    waistCm: latest.estimativas.cinturaCmEstimada,
    waistChange: parseFloat(
      (latest.estimativas.cinturaCmEstimada - oldest.estimativas.cinturaCmEstimada).toFixed(1)
    ),
    musclePriorities: latest.analiseIA.prioridadeMuscular,
    trend: latest.analiseIA.tendenciaCorporal
  };
}
function buildMeasurementMemory() {
  const chest = bodyMeasures.find((m) => m.key === "peito");
  const arm = bodyMeasures.find((m) => m.key === "braco");
  const thigh = bodyMeasures.find((m) => m.key === "coxa");
  const calf = bodyMeasures.find((m) => m.key === "panturrilha");
  return {
    chest: chest?.value ?? null,
    arm: arm?.value ?? null,
    thigh: thigh?.value ?? null,
    calf: calf?.value ?? null,
    deltaChest: chest?.delta ?? null,
    deltaArm: arm?.delta ?? null
  };
}
function buildNutritionMemory() {
  const recent = foodScans.slice(0, 10);
  if (recent.length === 0) return { avgProteinG: null, avgCaloriesKcal: null, recentScansCount: 0 };
  const avgProtein = Math.round(
    recent.reduce((sum, f) => sum + f.estimativas.proteinaG, 0) / recent.length
  );
  const avgCalories = Math.round(
    recent.reduce((sum, f) => sum + f.estimativas.kcal, 0) / recent.length
  );
  return { avgProteinG: avgProtein, avgCaloriesKcal: avgCalories, recentScansCount: recent.length };
}
function buildAthleteMemory() {
  return {
    workoutHistory: buildWorkoutMemory(),
    bodyScanTrend: buildScanMemory(),
    measurements: buildMeasurementMemory(),
    nutrition: buildNutritionMemory()
  };
}
function serializeMemoryForAI(memory) {
  const lines = ["## Histórico e Memória do Atleta"];
  lines.push(`
### Treinos`);
  lines.push(`- Total de sessões registradas: ${memory.workoutHistory.totalSessions}`);
  lines.push(`- Frequência últimos 28 dias: ${memory.workoutHistory.last28Days} treinos`);
  if (memory.workoutHistory.lastWorkoutDate) {
    lines.push(`- Último treino: ${memory.workoutHistory.lastWorkoutDate}`);
  }
  lines.push(`- ${memory.workoutHistory.recentSummary}`);
  if (memory.workoutHistory.plateaus.length > 0) {
    lines.push(`- ⚠️ PLATÔ DETECTADO em: ${memory.workoutHistory.plateaus.slice(0, 3).join(", ")} (peso estagnado 3+ sessões)`);
  }
  if (memory.workoutHistory.strongPoints.length > 0) {
    lines.push(`- ✅ Progredindo em: ${memory.workoutHistory.strongPoints.slice(0, 3).join(", ")}`);
  }
  if (memory.bodyScanTrend.scanCount > 0) {
    lines.push(`
### Scans Corporais (${memory.bodyScanTrend.scanCount} scans)`);
    if (memory.bodyScanTrend.bodyFatCurrent !== null) {
      const fatChange = memory.bodyScanTrend.bodyFatChange;
      lines.push(`- Gordura corporal atual: ${memory.bodyScanTrend.bodyFatCurrent}%${fatChange !== null ? ` (${fatChange > 0 ? "+" : ""}${fatChange}% vs início)` : ""}`);
    }
    if (memory.bodyScanTrend.weightKg !== null) {
      const wChange = memory.bodyScanTrend.weightChange;
      lines.push(`- Peso: ${memory.bodyScanTrend.weightKg}kg${wChange !== null ? ` (${wChange > 0 ? "+" : ""}${wChange}kg)` : ""}`);
    }
    if (memory.bodyScanTrend.waistCm !== null) {
      const wChange = memory.bodyScanTrend.waistChange;
      lines.push(`- Cintura: ${memory.bodyScanTrend.waistCm}cm${wChange !== null ? ` (${wChange > 0 ? "+" : ""}${wChange}cm)` : ""}`);
    }
    if (memory.bodyScanTrend.trend) {
      lines.push(`- Tendência corporal: ${memory.bodyScanTrend.trend}`);
    }
    if (memory.bodyScanTrend.musclePriorities.length > 0) {
      lines.push(`- Prioridade muscular pelo scan: ${memory.bodyScanTrend.musclePriorities.join(", ")}`);
    }
  }
  const m = memory.measurements;
  if (m.chest || m.arm) {
    lines.push(`
### Medidas`);
    if (m.chest) lines.push(`- Peito: ${m.chest}cm${m.deltaChest ? ` (${m.deltaChest > 0 ? "+" : ""}${m.deltaChest}cm)` : ""}`);
    if (m.arm) lines.push(`- Braço: ${m.arm}cm${m.deltaArm ? ` (${m.deltaArm > 0 ? "+" : ""}${m.deltaArm}cm)` : ""}`);
    if (m.thigh) lines.push(`- Coxa: ${m.thigh}cm`);
    if (m.calf) lines.push(`- Panturrilha: ${m.calf}cm`);
  }
  if (memory.nutrition.recentScansCount > 0) {
    lines.push(`
### Nutrição (média dos últimos ${memory.nutrition.recentScansCount} scans)`);
    if (memory.nutrition.avgProteinG) lines.push(`- Proteína média: ${memory.nutrition.avgProteinG}g/refeição`);
    if (memory.nutrition.avgCaloriesKcal) lines.push(`- Calorias médias: ${memory.nutrition.avgCaloriesKcal}kcal/refeição`);
  }
  return lines.join("\n");
}
const CACHE_KEY = "_zyrox_ai_workout_v3";
function weekKey() {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1e3));
}
function getAIWorkoutPlan(profileKey) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.weekKey !== weekKey()) return null;
    if (parsed.profileKey !== profileKey) return null;
    return parsed;
  } catch {
    return null;
  }
}
function setAIWorkoutPlan(plan) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...plan, weekKey: weekKey() }));
  } catch {
  }
}
function clearAIWorkoutPlan() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
  }
}
function buildProfileKey(profile, locale = "pt") {
  return [
    profile.goal,
    profile.level,
    profile.sex ?? "null",
    profile.trainingType ?? "musculacao",
    profile.location,
    profile.consistency ?? "ocasional",
    profile.availableDays.join(","),
    profile.workoutDurationMin,
    [...profile.equipment ?? []].sort().join(","),
    [...profile.preferredFocus ?? []].sort().join(","),
    locale
  ].join("|");
}
function collectAIExerciseIds(aiPlan) {
  if (!aiPlan) return [];
  return Array.from(new Set(aiPlan.workouts.flatMap((workout) => workout.exercises.map((exercise) => exercise.exerciseId))));
}
function mergeAIWorkouts(rulesWorkouts, aiPlan) {
  const catalogById = new Map(buildExerciseCatalog().map((record) => [record.id, record]));
  return rulesWorkouts.map((workout) => {
    const aiWorkout = aiPlan.workouts.find((w) => w.id === workout.id);
    if (!aiWorkout) return workout;
    const acceptedRecords = [];
    const mergedExercises = aiWorkout.exercises.map((aiEx, index) => {
      const rulesSlot = workout.exercises[index];
      const rulesEx = workout.exercises.find((e) => e.exerciseId === aiEx.exerciseId);
      const aiRecord = catalogById.get(aiEx.exerciseId);
      const slotRecord = rulesSlot ? catalogById.get(rulesSlot.exerciseId) : null;
      const invalidCategory = !!rulesSlot && !!aiRecord && !!slotRecord && aiRecord.category !== slotRecord.category;
      const repeatedPattern = !!aiRecord && !canAddExerciseToSelection(acceptedRecords, aiRecord);
      if (!aiRecord || invalidCategory || repeatedPattern) {
        if (slotRecord) acceptedRecords.push(slotRecord);
        return rulesSlot;
      }
      acceptedRecords.push(aiRecord);
      return {
        exerciseId: aiEx.exerciseId,
        sets: Array.from({ length: aiEx.sets }).map(() => ({
          reps: Math.round((aiEx.repsMin + aiEx.repsMax) / 2),
          weight: rulesEx?.sets[0]?.weight ?? 0
        })),
        rest: aiEx.rest,
        notes: aiEx.aiNote || void 0
      };
    }).filter((ex) => !!ex.exerciseId);
    if (mergedExercises.length < 4) return workout;
    return { ...workout, exercises: mergedExercises };
  });
}
function useTrainingState(refreshKey = 0) {
  const locale = getStoredLocale();
  const base = reactExports.useMemo(() => getCurrentTrainingState(), [refreshKey, locale]);
  const [aiPlan, setAiPlanState] = reactExports.useState(null);
  const [aiLoading, setAiLoading] = reactExports.useState(false);
  const fetchAIPlan = reactExports.useCallback(async (options = {}) => {
    setAiLoading(true);
    try {
      const onboarding = loadOnboarding();
      const profile = buildAthleteProfile(onboarding);
      const environment = buildEnvironmentContextFromOnboarding(profile, onboarding);
      const catalog = buildExerciseCatalog();
      const body = buildBodyTrainingContext();
      const { resolveWorkoutTemplates } = await import("./router-BDD3RgVy.js").then((n) => n.a9);
      const resolvedTemplates = resolveWorkoutTemplates(profile);
      const candidates = buildAIWorkoutCandidates(profile, environment, body, resolvedTemplates, catalog);
      const locale2 = getStoredLocale();
      const memory = buildAthleteMemory();
      const athleteMemory = serializeMemoryForAI(memory);
      const nutrition = buildNutritionTrainingContext();
      const periodization = buildPeriodizationBlock(profile, body, nutrition, environment, locale2);
      const currentWeekData = periodization.weeks[periodization.currentWeek - 1];
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/ai-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? { Authorization: `Bearer ${token}` } : {}
        },
        body: JSON.stringify({
          profile: {
            goal: profile.goal,
            level: profile.level,
            sex: profile.sex,
            location: profile.location,
            trainingType: profile.trainingType,
            availableDays: profile.availableDays.length || 3,
            workoutDurationMin: profile.workoutDurationMin,
            name: profile.name,
            modality: periodization.modality,
            currentWeek: periodization.currentWeek,
            currentPhase: currentWeekData?.phase ?? "base",
            phaseEmphasis: currentWeekData?.emphasis ?? "",
            volumeBias: currentWeekData?.volumeBias ?? "moderado",
            intensityBias: currentWeekData?.intensityBias ?? "moderada",
            equipment: profile.equipment,
            consistency: profile.consistency,
            splitBias: periodization.adjustments.splitBias,
            trackCycle: profile.trackCycle,
            menstrualCyclePhase: profile.menstrualCyclePhase,
            injuries: profile.injuries,
            limitations: profile.limitations,
            focusMuscles: profile.preferredFocus,
            dietType: onboarding.dietType,
            metabolismType: onboarding.metabolismType
          },
          workoutCandidates: candidates,
          locale: locale2,
          athleteMemory,
          regenerationId: options.regenerationId,
          avoidExerciseIds: options.avoidExerciseIds ?? []
        })
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json();
      const profileKey = buildProfileKey(profile, locale2);
      const plan = {
        workouts: json.workouts ?? [],
        scheduleReasons: json.scheduleReasons ?? [],
        weekFocus: json.weekFocus ?? "",
        profileKey,
        weekKey: 0
      };
      setAIWorkoutPlan(plan);
      setAiPlanState(plan);
    } catch {
    }
    setAiLoading(false);
  }, []);
  reactExports.useEffect(() => {
    const onboarding = loadOnboarding();
    const profile = buildAthleteProfile(onboarding);
    const profileKey = buildProfileKey(profile, locale);
    const cached = getAIWorkoutPlan(profileKey);
    if (cached) {
      setAiPlanState(cached);
      return;
    }
    fetchAIPlan();
  }, [refreshKey, locale, fetchAIPlan]);
  const mergedWorkouts = reactExports.useMemo(() => {
    if (!aiPlan) return base.workouts;
    return mergeAIWorkouts(base.workouts, aiPlan);
  }, [base.workouts, aiPlan]);
  const regenerate = reactExports.useCallback(() => {
    const regenerationId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const avoidExerciseIds = collectAIExerciseIds(aiPlan);
    try {
      localStorage.setItem("_zyrox_regen_seed", regenerationId);
    } catch {
    }
    clearAIWorkoutPlan();
    setAiPlanState(null);
    fetchAIPlan({ regenerationId, avoidExerciseIds });
  }, [aiPlan, fetchAIPlan]);
  return {
    ...base,
    workouts: mergedWorkouts,
    aiReady: !!aiPlan,
    aiLoading,
    aiReasons: aiPlan?.scheduleReasons ?? [],
    aiWeekFocus: aiPlan?.weekFocus ?? "",
    regenerate
  };
}
export {
  buildAthleteMemory as b,
  serializeMemoryForAI as s,
  useTrainingState as u
};