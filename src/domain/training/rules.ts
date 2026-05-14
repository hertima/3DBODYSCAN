import type {
  AthleteConsistency,
  AthleteGoal,
  AthleteLevel,
  AthleteProfile,
  AthleteSex,
} from "@/domain/athlete/profile";
import type { OfficialMuscleCategory } from "@/domain/exercises/catalog";

export const EXERCISES_PER_WORKOUT = 8;

export type TrainingSplit =
  | "full_body"
  | "upper_lower"
  | "push_pull_legs"
  | "female_lower_priority"
  | "male_upper_lower_bias"
  | "performance_hybrid";

export type WorkoutCategoryTemplate = {
  primary: OfficialMuscleCategory;
  secondary?: OfficialMuscleCategory;
  slots: number;
};

export type WorkoutTemplate = {
  name: string;
  split: TrainingSplit;
  categories: WorkoutCategoryTemplate[];
};

function resolveGoalBias(goal: AthleteGoal) {
  if (goal === "ganho_massa") return "hipertrofia";
  if (goal === "perda_peso") return "densidade";
  if (goal === "definicao") return "recomposicao";
  if (goal === "forca") return "forca";
  return "performance";
}

function prefersLowerPriority(sex: AthleteSex | null, goal: AthleteGoal) {
  return sex === "feminino" && ["ganho_massa", "definicao", "perda_peso"].includes(goal);
}

export function resolveTrainingSplit(profile: AthleteProfile): TrainingSplit {
  const trainingDays = profile.availableDays.length || 3;

  if (profile.goal === "performance") return "performance_hybrid";
  if (trainingDays <= 2) return "full_body";
  if (trainingDays === 3) return "push_pull_legs";
  if (trainingDays === 4 && prefersLowerPriority(profile.sex, profile.goal)) {
    return "female_lower_priority";
  }
  if (trainingDays === 4 && profile.sex === "masculino") {
    return "male_upper_lower_bias";
  }
  if (trainingDays >= 5) return "push_pull_legs";
  return "upper_lower";
}

function buildPushTemplate(): WorkoutTemplate {
  return {
    name: "Push",
    split: "push_pull_legs",
    categories: [
      { primary: "peitoral", slots: 2 },
      { primary: "deltoides", slots: 2 },
      { primary: "triceps", slots: 2 },
      { primary: "peitoral", secondary: "abdomen_core", slots: 1 },
      { primary: "deltoides", secondary: "triceps", slots: 1 },
    ],
  };
}

function buildPullTemplate(): WorkoutTemplate {
  return {
    name: "Pull",
    split: "push_pull_legs",
    categories: [
      { primary: "costas_trapezio", slots: 3 },
      { primary: "biceps_antebraco", slots: 2 },
      { primary: "deltoides", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
      { primary: "costas_trapezio", secondary: "biceps_antebraco", slots: 1 },
    ],
  };
}

function buildLegsTemplate(): WorkoutTemplate {
  return {
    name: "Legs",
    split: "push_pull_legs",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 5 },
      { primary: "panturrilha", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
      { primary: "membros_inferiores_gluteos", secondary: "panturrilha", slots: 1 },
    ],
  };
}

function buildFemaleLowerTemplate(): WorkoutTemplate[] {
  return [
    {
      name: "Lower A",
      split: "female_lower_priority",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 1 },
        { primary: "membros_inferiores_gluteos", secondary: "deltoides", slots: 1 },
      ],
    },
    {
      name: "Upper",
      split: "female_lower_priority",
      categories: [
        { primary: "peitoral", slots: 2 },
        { primary: "costas_trapezio", slots: 2 },
        { primary: "deltoides", slots: 1 },
        { primary: "triceps", slots: 1 },
        { primary: "biceps_antebraco", slots: 1 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Lower B",
      split: "female_lower_priority",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 1 },
        { primary: "membros_inferiores_gluteos", secondary: "abdomen_core", slots: 1 },
      ],
    },
  ];
}

function buildUpperLowerTemplates(split: TrainingSplit): WorkoutTemplate[] {
  return [
    {
      name: "Upper",
      split,
      categories: [
        { primary: "peitoral", slots: 2 },
        { primary: "costas_trapezio", slots: 2 },
        { primary: "deltoides", slots: 1 },
        { primary: "triceps", slots: 1 },
        { primary: "biceps_antebraco", slots: 1 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Lower",
      split,
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 1 },
        { primary: "membros_inferiores_gluteos", secondary: "deltoides", slots: 1 },
      ],
    },
  ];
}

export function resolveWorkoutTemplates(profile: AthleteProfile): WorkoutTemplate[] {
  const split = resolveTrainingSplit(profile);

  if (split === "push_pull_legs") return [buildPushTemplate(), buildPullTemplate(), buildLegsTemplate()];
  if (split === "female_lower_priority") return buildFemaleLowerTemplate();
  if (split === "male_upper_lower_bias") return buildUpperLowerTemplates(split);
  if (split === "upper_lower") return buildUpperLowerTemplates(split);
  if (split === "performance_hybrid") {
    return [
      {
        name: "Hybrid Performance",
        split,
        categories: [
          { primary: "costas_trapezio", slots: 2 },
          { primary: "peitoral", slots: 1 },
          { primary: "deltoides", slots: 1 },
          { primary: "membros_inferiores_gluteos", slots: 2 },
          { primary: "abdomen_core", slots: 1 },
          { primary: "biceps_antebraco", secondary: "triceps", slots: 1 },
        ],
      },
    ];
  }

  return [
    {
      name: "Treino Base",
      split,
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 2 },
        { primary: "peitoral", slots: 1 },
        { primary: "costas_trapezio", slots: 1 },
        { primary: "deltoides", slots: 1 },
        { primary: "biceps_antebraco", slots: 1 },
        { primary: "triceps", slots: 1 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
  ];
}

export function resolveWorkoutDensity(profile: AthleteProfile) {
  const goalBias = resolveGoalBias(profile.goal);
  const duration = profile.workoutDurationMin;

  if (goalBias === "densidade" || duration <= 40) return "alta";
  if (profile.level === "avancado" || profile.consistency === "elite") return "moderada";
  return "controlada";
}

export function resolveWorkoutIntensity(level: AthleteLevel, consistency: AthleteConsistency) {
  if (level === "avancado" && consistency === "elite") return "pesada";
  if (level === "intermediario") return "moderada";
  return "leve";
}
