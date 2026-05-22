import { r as reactExports } from "./server-C0e4gypg.js";
import { d as getGamificationCopy } from "./app-copy-wxZoQ7QO.js";
import { g as getStoredLocale } from "./router-BDD3RgVy.js";
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function percentToRate(value) {
  return clamp(Math.round(value), 0, 100);
}
function getCompletedWorkouts(state) {
  return state.schedule.filter((item) => item.workoutId).length;
}
function getWorkoutCompletionRate(state) {
  const completed = getCompletedWorkouts(state);
  const target = Math.max(1, state.profile.availableDays.length || state.workouts.length || 1);
  return percentToRate(completed / target * 100);
}
function getNutritionCompletionRate(state) {
  return percentToRate(
    (state.nutrition.kcalCompletionPct + state.nutrition.proteinCompletionPct) / 2
  );
}
function getHydrationCompletionRate(state) {
  return percentToRate(state.nutrition.hydrationCompletionPct);
}
function buildMissions(state, t) {
  const completedWorkouts = getCompletedWorkouts(state);
  const workoutRate = getWorkoutCompletionRate(state);
  const hydrationRate = getHydrationCompletionRate(state);
  const nutritionRate = getNutritionCompletionRate(state);
  const bodyConfidence = clamp(state.body.confidenceScore, 0, 100);
  return {
    diaria: [
      {
        id: "daily-workout",
        window: "diaria",
        title: t.dailyWorkoutTitle,
        description: t.dailyWorkoutDesc,
        progress: Math.min(completedWorkouts, 1),
        target: 1,
        completed: completedWorkouts >= 1
      },
      {
        id: "daily-hydration",
        window: "diaria",
        title: t.dailyWaterTitle,
        description: t.dailyWaterDesc,
        progress: hydrationRate,
        target: 100,
        completed: hydrationRate >= 100
      }
    ],
    semanal: [
      {
        id: "weekly-consistency",
        window: "semanal",
        title: t.weeklyConsistencyTitle,
        description: t.weeklyConsistencyDesc,
        progress: completedWorkouts,
        target: Math.max(3, state.workouts.length),
        completed: completedWorkouts >= Math.max(3, state.workouts.length)
      },
      {
        id: "weekly-protein",
        window: "semanal",
        title: t.weeklyProteinTitle,
        description: t.weeklyProteinDesc,
        progress: nutritionRate,
        target: 80,
        completed: nutritionRate >= 80
      }
    ],
    mensal: [
      {
        id: "monthly-rhythm",
        window: "mensal",
        title: t.monthlyTitle,
        description: t.monthlyDesc,
        progress: Math.round((workoutRate + hydrationRate + nutritionRate) / 3),
        target: 78,
        completed: (workoutRate + hydrationRate + nutritionRate) / 3 >= 78
      }
    ],
    trimestral: [
      {
        id: "quarterly-body",
        window: "trimestral",
        title: t.quarterlyTitle,
        description: t.quarterlyDesc,
        progress: bodyConfidence,
        target: 85,
        completed: bodyConfidence >= 85
      }
    ],
    semestral: [
      {
        id: "semester-engine",
        window: "semestral",
        title: t.semesterTitle,
        description: t.semesterDesc,
        progress: Math.round(workoutRate * 0.5 + nutritionRate * 0.25 + hydrationRate * 0.25),
        target: 82,
        completed: workoutRate * 0.5 + nutritionRate * 0.25 + hydrationRate * 0.25 >= 82
      }
    ],
    anual: [
      {
        id: "year-transformation",
        window: "anual",
        title: t.annualTitle,
        description: t.annualDesc,
        progress: Math.round(
          bodyConfidence * 0.3 + workoutRate * 0.35 + nutritionRate * 0.2 + hydrationRate * 0.15
        ),
        target: 84,
        completed: bodyConfidence * 0.3 + workoutRate * 0.35 + nutritionRate * 0.2 + hydrationRate * 0.15 >= 84
      }
    ]
  };
}
function buildXp(state) {
  const completedWorkouts = getCompletedWorkouts(state);
  const hydrationRate = getHydrationCompletionRate(state);
  const nutritionRate = getNutritionCompletionRate(state);
  const bodyConfidence = clamp(state.body.confidenceScore, 0, 100);
  return Math.round(
    completedWorkouts * 180 + hydrationRate * 2 + nutritionRate * 2 + bodyConfidence * 1.5
  );
}
function buildLevel(xp) {
  return Math.max(1, Math.floor(xp / 300) + 1);
}
function buildStreakDays(state) {
  const completedWorkouts = getCompletedWorkouts(state);
  const hydrationRate = getHydrationCompletionRate(state);
  return Math.max(1, completedWorkouts * 3 + Math.floor(hydrationRate / 20));
}
function getOnboardingAgeDays(state) {
  const completedAt = state.profile.onboardingCompletedAt;
  if (!completedAt) return 0;
  const completedTime = new Date(completedAt).getTime();
  if (Number.isNaN(completedTime)) return 0;
  const elapsed = Date.now() - completedTime;
  return Math.max(0, Math.floor(elapsed / 864e5));
}
function buildAchievements(state, xp, streakDays) {
  const completedWorkouts = getCompletedWorkouts(state);
  const plannedDays = Math.max(1, state.schedule.filter((item) => item.workoutId).length);
  const longestWorkout = Math.max(0, ...state.workouts.map((workout) => workout.exercises.length));
  const onboardingAgeDays = getOnboardingAgeDays(state);
  const profile = state.profile;
  return [
    {
      id: "a1",
      title: "Primeira Semana",
      desc: "7 dias de consistência no plano",
      unlocked: streakDays >= 7,
      icon: "7D"
    },
    {
      id: "a2",
      title: "Plano Estruturado",
      desc: `${plannedDays} treinos planejados na semana`,
      unlocked: state.workouts.length >= 3,
      icon: "PL"
    },
    {
      id: "a3",
      title: "Disciplina Cinza",
      desc: "21 dias consecutivos de aderência",
      unlocked: streakDays >= 21,
      icon: "21"
    },
    {
      id: "a4",
      title: "Skill Master",
      desc: "Perfil orientado para performance e skills",
      unlocked: profile.goal === "performance" && (profile.location === "outdoor" || profile.location === "hibrido"),
      icon: "SK"
    },
    {
      id: "a5",
      title: "Maratona",
      desc: "1000 XP acumulados no ecossistema",
      unlocked: xp >= 1e3,
      icon: "XP"
    },
    {
      id: "a6",
      title: "AI Adapted",
      desc: "30 dias de plano calibrado pela IA",
      unlocked: onboardingAgeDays >= 30 || completedWorkouts >= 10 || longestWorkout >= 8,
      icon: "AI"
    }
  ];
}
function buildGamificationState(state, locale) {
  const copy = getGamificationCopy(locale);
  const xp = buildXp(state);
  const streakDays = buildStreakDays(state);
  return {
    xp,
    level: buildLevel(xp),
    streakDays,
    workoutCompletionRate: getWorkoutCompletionRate(state),
    hydrationCompletionRate: getHydrationCompletionRate(state),
    nutritionCompletionRate: getNutritionCompletionRate(state),
    missions: buildMissions(state, copy.missions),
    achievements: buildAchievements(state, xp, streakDays)
  };
}
function getTopMission(state) {
  return state.missions.diaria[0] ?? state.missions.semanal[0] ?? state.missions.mensal[0];
}
function getMomentumLabel(trainingState, streakDays, momentum) {
  if (streakDays >= 21) return momentum.elite;
  if (trainingState.nutrition.hydrationStatus === "baixa") return momentum.hydration;
  if (trainingState.nutrition.readinessLevel === "alta") return momentum.ready;
  if (trainingState.body.priorityLevel === "alta") return momentum.bodyFocus;
  return momentum.building;
}
function buildDopamineLoop(trainingState, locale) {
  const copy = getGamificationCopy(locale);
  const l = copy.loop;
  const gamification = buildGamificationState(trainingState, locale);
  const highlightedMission = getTopMission(gamification);
  const missionPct = Math.min(
    100,
    Math.round(highlightedMission.progress / highlightedMission.target * 100)
  );
  const remainingXp = Math.max(0, gamification.level * 300 - gamification.xp);
  return {
    headline: missionPct >= 100 ? l.missionDone : missionPct >= 70 ? l.nearMilestone : l.inProgress,
    message: missionPct >= 100 ? `${highlightedMission.title.toLowerCase()} ${l.missionClosedMsg}` : `${highlightedMission.title.toLowerCase()} ${missionPct}%. ${l.missionPctMsg}`,
    momentumLabel: getMomentumLabel(trainingState, gamification.streakDays, l.momentum),
    nextUnlock: remainingXp > 0 ? `${l.xpRemaining} ${remainingXp} ${l.xpToLevel} ${gamification.level + 1}.` : `${l.levelConsolidated}`,
    highlightedMission
  };
}
function useGamification(trainingState) {
  const locale = getStoredLocale();
  return reactExports.useMemo(
    () => ({
      gamification: buildGamificationState(trainingState, locale),
      dopamineLoop: buildDopamineLoop(trainingState, locale)
    }),
    [trainingState, locale]
  );
}
export {
  useGamification as u
};