import { type GeneratedTrainingState } from "@/domain/training/engine";

export const missionWindows = [
  "diaria",
  "semanal",
  "mensal",
  "trimestral",
  "semestral",
  "anual",
] as const;

export type MissionWindow = (typeof missionWindows)[number];

export type GamificationMission = {
  id: string;
  window: MissionWindow;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
};

export type GamificationAchievement = {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  icon: string;
};

export type GamificationState = {
  xp: number;
  level: number;
  streakDays: number;
  workoutCompletionRate: number;
  hydrationCompletionRate: number;
  nutritionCompletionRate: number;
  missions: Record<MissionWindow, GamificationMission[]>;
  achievements: GamificationAchievement[];
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function percentToRate(value: number) {
  return clamp(Math.round(value), 0, 100);
}

function getCompletedWorkouts(state: GeneratedTrainingState) {
  return state.schedule.filter((item) => item.workoutId).length;
}

function getWorkoutCompletionRate(state: GeneratedTrainingState) {
  const completed = getCompletedWorkouts(state);
  const target = Math.max(1, state.profile.availableDays.length || state.workouts.length || 1);
  return percentToRate((completed / target) * 100);
}

function getNutritionCompletionRate(state: GeneratedTrainingState) {
  return percentToRate(
    (state.nutrition.kcalCompletionPct + state.nutrition.proteinCompletionPct) / 2,
  );
}

function getHydrationCompletionRate(state: GeneratedTrainingState) {
  return percentToRate(state.nutrition.hydrationCompletionPct);
}

function buildMissions(state: GeneratedTrainingState): Record<MissionWindow, GamificationMission[]> {
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
        title: "Fechar o treino do dia",
        description: "Conclua o bloco principal sem perder a ordem planejada.",
        progress: Math.min(completedWorkouts, 1),
        target: 1,
        completed: completedWorkouts >= 1,
      },
      {
        id: "daily-hydration",
        window: "diaria",
        title: "Bater a agua do dia",
        description: "Chegue perto da meta de hidratação para sustentar recuperação.",
        progress: hydrationRate,
        target: 100,
        completed: hydrationRate >= 100,
      },
    ],
    semanal: [
      {
        id: "weekly-consistency",
        window: "semanal",
        title: "Consistência da semana",
        description: "Feche os treinos planejados da semana com aderência alta.",
        progress: completedWorkouts,
        target: Math.max(3, state.workouts.length),
        completed: completedWorkouts >= Math.max(3, state.workouts.length),
      },
      {
        id: "weekly-protein",
        window: "semanal",
        title: "Proteína alinhada",
        description: "Mantenha a nutrição da semana acima do alvo médio.",
        progress: nutritionRate,
        target: 80,
        completed: nutritionRate >= 80,
      },
    ],
    mensal: [
      {
        id: "monthly-rhythm",
        window: "mensal",
        title: "Ritmo mensal",
        description: "Sustente treino, agua e comida em bloco continuo.",
        progress: Math.round((workoutRate + hydrationRate + nutritionRate) / 3),
        target: 78,
        completed: (workoutRate + hydrationRate + nutritionRate) / 3 >= 78,
      },
    ],
    trimestral: [
      {
        id: "quarterly-body",
        window: "trimestral",
        title: "Transformação do bloco",
        description: "Consolide um trimestre de evolução com scans confiáveis.",
        progress: bodyConfidence,
        target: 85,
        completed: bodyConfidence >= 85,
      },
    ],
    semestral: [
      {
        id: "semester-engine",
        window: "semestral",
        title: "Motor de consistência",
        description: "Segure o plano por seis meses com alto controle de execução.",
        progress: Math.round((workoutRate * 0.5) + (nutritionRate * 0.25) + (hydrationRate * 0.25)),
        target: 82,
        completed:
          (workoutRate * 0.5) + (nutritionRate * 0.25) + (hydrationRate * 0.25) >= 82,
      },
    ],
    anual: [
      {
        id: "year-transformation",
        window: "anual",
        title: "Jornada anual premium",
        description: "Feche o ano com corpo, treino e aderência evoluindo juntos.",
        progress: Math.round(
          (bodyConfidence * 0.3) +
            (workoutRate * 0.35) +
            (nutritionRate * 0.2) +
            (hydrationRate * 0.15),
        ),
        target: 84,
        completed:
          (bodyConfidence * 0.3) +
            (workoutRate * 0.35) +
            (nutritionRate * 0.2) +
            (hydrationRate * 0.15) >=
          84,
      },
    ],
  };
}

function buildXp(state: GeneratedTrainingState) {
  const completedWorkouts = getCompletedWorkouts(state);
  const hydrationRate = getHydrationCompletionRate(state);
  const nutritionRate = getNutritionCompletionRate(state);
  const bodyConfidence = clamp(state.body.confidenceScore, 0, 100);

  return Math.round(
    completedWorkouts * 180 +
      hydrationRate * 2 +
      nutritionRate * 2 +
      bodyConfidence * 1.5,
  );
}

function buildLevel(xp: number) {
  return Math.max(1, Math.floor(xp / 300) + 1);
}

function buildStreakDays(state: GeneratedTrainingState) {
  const completedWorkouts = getCompletedWorkouts(state);
  const hydrationRate = getHydrationCompletionRate(state);

  return Math.max(1, completedWorkouts * 3 + Math.floor(hydrationRate / 20));
}

function getOnboardingAgeDays(state: GeneratedTrainingState) {
  const completedAt = state.profile.onboardingCompletedAt;
  if (!completedAt) return 0;

  const completedTime = new Date(completedAt).getTime();
  if (Number.isNaN(completedTime)) return 0;

  const elapsed = Date.now() - completedTime;
  return Math.max(0, Math.floor(elapsed / 86400000));
}

function buildAchievements(
  state: GeneratedTrainingState,
  xp: number,
  streakDays: number,
): GamificationAchievement[] {
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
      icon: "7D",
    },
    {
      id: "a2",
      title: "Plano Estruturado",
      desc: `${plannedDays} treinos planejados na semana`,
      unlocked: state.workouts.length >= 3,
      icon: "PL",
    },
    {
      id: "a3",
      title: "Disciplina Cinza",
      desc: "21 dias consecutivos de aderência",
      unlocked: streakDays >= 21,
      icon: "21",
    },
    {
      id: "a4",
      title: "Skill Master",
      desc: "Perfil orientado para performance e skills",
      unlocked:
        profile.goal === "performance" &&
        (profile.location === "outdoor" || profile.location === "hibrido"),
      icon: "SK",
    },
    {
      id: "a5",
      title: "Maratona",
      desc: "1000 XP acumulados no ecossistema",
      unlocked: xp >= 1000,
      icon: "XP",
    },
    {
      id: "a6",
      title: "AI Adapted",
      desc: "30 dias de plano calibrado pela IA",
      unlocked: onboardingAgeDays >= 30 || completedWorkouts >= 10 || longestWorkout >= 8,
      icon: "AI",
    },
  ];
}

export function buildGamificationState(state: GeneratedTrainingState): GamificationState {
  const xp = buildXp(state);
  const streakDays = buildStreakDays(state);

  return {
    xp,
    level: buildLevel(xp),
    streakDays,
    workoutCompletionRate: getWorkoutCompletionRate(state),
    hydrationCompletionRate: getHydrationCompletionRate(state),
    nutritionCompletionRate: getNutritionCompletionRate(state),
    missions: buildMissions(state),
    achievements: buildAchievements(state, xp, streakDays),
  };
}
