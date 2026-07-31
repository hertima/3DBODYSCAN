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
  if (goal === "resistencia") return "resistencia";
  return "performance";
}

function prefersLowerPriority(sex: AthleteSex | null, goal: AthleteGoal) {
  return sex === "feminino" && ["ganho_massa", "definicao", "perda_peso"].includes(goal);
}

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function resolveBlockIndex(profile: AthleteProfile) {
  if (!profile.onboardingCompletedAt) return 0;
  const start = new Date(profile.onboardingCompletedAt);
  if (Number.isNaN(start.getTime())) return 0;

  const diffMs = Date.now() - start.getTime();
  const diffWeeks = Math.max(0, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)));
  return Math.floor(diffWeeks / 12);
}

function resolveRegenerationIndex() {
  if (typeof window === "undefined") return 0;
  try {
    return hashString(window.localStorage.getItem("_zyrox_regen_seed") ?? "") % 7;
  } catch {
    return 0;
  }
}

function resolveRotationIndex(profile: AthleteProfile, variants: number) {
  if (variants <= 1) return 0;
  // resolveBlockIndex fica em 0 nas primeiras 12 semanas de conta nova, e
  // resolveRegenerationIndex também começa igual (sem seed no localStorage ainda) —
  // sem um componente por aluno, toda conta nova cai na mesma rotação (ex: todo
  // treino feminino com "Segunda e Sexta = Perna" pro app inteiro ao mesmo tempo).
  const userSeed = hashString(`${profile.name ?? ""}|${profile.goal ?? ""}|${profile.sex ?? ""}`);
  return (resolveBlockIndex(profile) + resolveRegenerationIndex() + userSeed) % variants;
}

export function resolveTrainingSplit(profile: AthleteProfile): TrainingSplit {
  const trainingDays = profile.availableDays.length || 3;
  const usesBodyweight = profile.location === "outdoor" || profile.location === "casa";

  if (profile.trainingType === "funcional") return "performance_hybrid";
  if (profile.goal === "performance" && !usesBodyweight && profile.trainingType !== "musculacao") return "performance_hybrid";
  if (trainingDays <= 2) return "full_body";
  if (prefersLowerPriority(profile.sex, profile.goal)) return "female_lower_priority";
  if (trainingDays === 3) return "push_pull_legs";
  if (trainingDays === 4 && profile.sex === "masculino") return "male_upper_lower_bias";
  if (trainingDays >= 5) return "push_pull_legs";
  return "upper_lower";
}

// ── Empurrar A/B ─────────────────────────────────────────────────
function buildPushA(): WorkoutTemplate {
  return {
    name: "Peito",
    split: "push_pull_legs",
    categories: [
      { primary: "peitoral", slots: 3 },
      { primary: "deltoides", slots: 2 },
      { primary: "triceps", slots: 2 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
}

function buildPushB(): WorkoutTemplate {
  return {
    name: "Ombros",
    split: "push_pull_legs",
    categories: [
      { primary: "deltoides", slots: 3 },
      { primary: "peitoral", slots: 2 },
      { primary: "triceps", slots: 2 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
}

// ── Puxar A/B ────────────────────────────────────────────────────
function buildPullA(): WorkoutTemplate {
  return {
    name: "Costas",
    split: "push_pull_legs",
    categories: [
      { primary: "costas_trapezio", slots: 4 },
      { primary: "biceps_antebraco", slots: 2 },
      { primary: "deltoides", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
}

function buildPullB(): WorkoutTemplate {
  return {
    name: "Bíceps",
    split: "push_pull_legs",
    categories: [
      { primary: "costas_trapezio", slots: 3 },
      { primary: "biceps_antebraco", slots: 3 },
      { primary: "costas_trapezio", secondary: "biceps_antebraco", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
}

// ── Pernas A/B (PPL) ─────────────────────────────────────────────
function buildLegsA(): WorkoutTemplate {
  return {
    name: "Quadríceps",
    split: "push_pull_legs",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 4 },
      { primary: "membros_inferiores_gluteos", secondary: "panturrilha", slots: 1 },
      { primary: "panturrilha", slots: 1 },
      { primary: "abdomen_core", slots: 2 },
    ],
  };
}

function buildLegsB(): WorkoutTemplate {
  return {
    name: "Posterior",
    split: "push_pull_legs",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 4 },
      { primary: "membros_inferiores_gluteos", secondary: "abdomen_core", slots: 2 },
      { primary: "panturrilha", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
}

// ── Full Body A/B ────────────────────────────────────────────────
function buildFullBodyA(): WorkoutTemplate {
  return {
    name: "Corpo Inteiro A",
    split: "full_body",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 2 },
      { primary: "peitoral", slots: 1 },
      { primary: "costas_trapezio", slots: 2 },
      { primary: "deltoides", slots: 1 },
      { primary: "triceps", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
}

function buildFullBodyB(): WorkoutTemplate {
  return {
    name: "Corpo Inteiro B",
    split: "full_body",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 2 },
      { primary: "costas_trapezio", slots: 2 },
      { primary: "peitoral", slots: 1 },
      { primary: "biceps_antebraco", slots: 1 },
      { primary: "triceps", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
}

// ── Upper A/B ────────────────────────────────────────────────────
function buildUpperA(split: TrainingSplit): WorkoutTemplate {
  return {
    name: "Superior A — Empurrar",
    split,
    categories: [
      { primary: "peitoral", slots: 3 },
      { primary: "costas_trapezio", slots: 2 },
      { primary: "deltoides", slots: 1 },
      { primary: "triceps", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
}

function buildUpperB(split: TrainingSplit): WorkoutTemplate {
  return {
    name: "Superior B — Puxar",
    split,
    categories: [
      { primary: "costas_trapezio", slots: 3 },
      { primary: "peitoral", slots: 2 },
      { primary: "biceps_antebraco", slots: 2 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
}

// ── Lower A/B (Upper/Lower splits) ───────────────────────────────
function buildLowerA(split: TrainingSplit): WorkoutTemplate {
  return {
    name: "Pernas A — Quadríceps",
    split,
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 5 },
      { primary: "panturrilha", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
      { primary: "membros_inferiores_gluteos", secondary: "panturrilha", slots: 1 },
    ],
  };
}

function buildLowerB(split: TrainingSplit): WorkoutTemplate {
  return {
    name: "Pernas B — Posterior",
    split,
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 4 },
      { primary: "membros_inferiores_gluteos", secondary: "abdomen_core", slots: 2 },
      { primary: "panturrilha", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
}

// ── Female Lower Priority ────────────────────────────────────────
function buildFemaleLower(): WorkoutTemplate[] {
  return [
    {
      name: "Pernas A — Glúteos",
      split: "female_lower_priority",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 1 },
        { primary: "membros_inferiores_gluteos", secondary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Superior — Definição",
      split: "female_lower_priority",
      categories: [
        { primary: "costas_trapezio", slots: 2 },
        { primary: "peitoral", slots: 2 },
        { primary: "deltoides", slots: 1 },
        { primary: "triceps", slots: 1 },
        { primary: "biceps_antebraco", slots: 1 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Pernas B — Posterior",
      split: "female_lower_priority",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 4 },
        { primary: "membros_inferiores_gluteos", secondary: "abdomen_core", slots: 2 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
  ];
}

function buildStrengthClassicTemplates(profile: AthleteProfile, trainingDays: number, variant: "A" | "B"): WorkoutTemplate[] {
  if (trainingDays <= 2) return [buildFullBodyA(), buildFullBodyB()];

  // Decide se o treino começa empurrando (Peito) ou puxando (Costas) com base num seed
  // por aluno (nome+objetivo+sexo) — não pode depender só da semana civil, ou todo
  // aluno que faz onboarding na mesma semana cai na mesma variante (segunda sempre
  // Peito ou sempre Costas pra todo mundo ao mesmo tempo).
  const startsWithPull = hashString(`${profile.name ?? ""}|${profile.goal ?? ""}|${profile.sex ?? ""}|split-start`) % 2 === 1;

  if (trainingDays === 3) {
    return startsWithPull
      ? [buildPullB(), buildPushB(), buildLegsB()]
      : [buildPushA(), buildPullA(), buildLegsA()];
  }

  if (trainingDays === 4) {
    const split = profile.sex === "masculino" ? "male_upper_lower_bias" : "upper_lower";
    return [buildUpperA(split), buildLowerA(split), buildUpperB(split), buildLowerB(split)];
  }

  // Alterna o dia inicial (Peito/Empurrar vs Costas/Puxar) por aluno — sem isso, a
  // segunda-feira era sempre Peito pra todo mundo.
  return (
    !startsWithPull
      ? [buildPushA(), buildPullA(), buildLegsA(), buildPushB(), buildPullB(), buildLegsB()]
      : [buildPullA(), buildPushA(), buildLegsA(), buildPushB(), buildPullB(), buildLegsB()]
  ).slice(0, Math.min(6, trainingDays));
}

function buildStrengthCrossPairTemplates(trainingDays: number): WorkoutTemplate[] {
  const split = "upper_lower" as const;
  const templates: WorkoutTemplate[] = [
    {
      name: "Peito + Ombro",
      split,
      categories: [
        { primary: "peitoral", slots: 4 },
        { primary: "deltoides", slots: 3 },
        { primary: "triceps", slots: 1 },
      ],
    },
    {
      name: "Costas + Bíceps",
      split,
      categories: [
        { primary: "costas_trapezio", slots: 4 },
        { primary: "biceps_antebraco", slots: 3 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Costas + Tríceps",
      split,
      categories: [
        { primary: "costas_trapezio", slots: 4 },
        { primary: "triceps", slots: 3 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Pernas + Abdômen",
      split,
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 2 },
      ],
    },
    {
      name: "Peito + Bíceps",
      split,
      categories: [
        { primary: "peitoral", slots: 4 },
        { primary: "biceps_antebraco", slots: 3 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Ombros + Braços",
      split,
      categories: [
        { primary: "deltoides", slots: 3 },
        { primary: "triceps", slots: 2 },
        { primary: "biceps_antebraco", slots: 2 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Braços",
      split,
      categories: [
        { primary: "biceps_antebraco", slots: 3 },
        { primary: "triceps", slots: 3 },
        { primary: "deltoides", slots: 1 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Posterior + Panturrilha",
      split,
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 2 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
  ];

  if (trainingDays <= 3) return [templates[0], templates[1], templates[3]];
  return templates.slice(0, Math.min(templates.length, trainingDays));
}

function buildStrengthAntagonistTemplates(trainingDays: number): WorkoutTemplate[] {
  const split = "upper_lower" as const;
  const templates: WorkoutTemplate[] = [
    {
      name: "Peito + Ombro",
      split,
      categories: [
        { primary: "peitoral", slots: 4 },
        { primary: "deltoides", slots: 3 },
        { primary: "triceps", slots: 1 },
      ],
    },
    {
      name: "Costas + Bíceps",
      split,
      categories: [
        { primary: "costas_trapezio", slots: 4 },
        { primary: "biceps_antebraco", slots: 3 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Peito + Costas",
      split,
      categories: [
        { primary: "peitoral", slots: 3 },
        { primary: "costas_trapezio", slots: 3 },
        { primary: "deltoides", slots: 1 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Pernas + Abdômen",
      split,
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 2 },
      ],
    },
    {
      name: "Ombros + Braços",
      split,
      categories: [
        { primary: "deltoides", slots: 3 },
        { primary: "biceps_antebraco", slots: 2 },
        { primary: "triceps", slots: 2 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Braços",
      split,
      categories: [
        { primary: "biceps_antebraco", slots: 3 },
        { primary: "triceps", slots: 3 },
        { primary: "deltoides", slots: 1 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Posterior + Glúteos",
      split,
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 2 },
      ],
    },
    {
      name: "Costas + Tríceps",
      split,
      categories: [
        { primary: "costas_trapezio", slots: 4 },
        { primary: "triceps", slots: 3 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
  ];

  if (trainingDays <= 3) return [templates[0], templates[1], templates[3]];
  return templates.slice(0, Math.min(templates.length, trainingDays));
}

function buildStrengthLowerPriorityTemplates(trainingDays: number, rotation = 0): WorkoutTemplate[] {
  const glutesPosterior: WorkoutTemplate = {
    name: "Glúteos + Posterior",
    split: "female_lower_priority",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 6 },
      { primary: "panturrilha", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
  const upperCore: WorkoutTemplate = {
    name: "Superior + Core",
    split: "female_lower_priority",
    categories: [
      { primary: "costas_trapezio", slots: 2 },
      { primary: "peitoral", slots: 1 },
      { primary: "deltoides", slots: 2 },
      { primary: "triceps", secondary: "biceps_antebraco", slots: 1 },
      { primary: "abdomen_core", slots: 2 },
    ],
  };
  const quadCalves: WorkoutTemplate = {
    name: "Quadríceps + Panturrilha",
    split: "female_lower_priority",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 5 },
      { primary: "panturrilha", slots: 2 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
  const unilateralGlute: WorkoutTemplate = {
    name: "Glúteos + Unilateral",
    split: "female_lower_priority",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 6 },
      { primary: "membros_inferiores_gluteos", secondary: "abdomen_core", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
  const upperBackArms: WorkoutTemplate = {
    name: "Costas + Braços",
    split: "female_lower_priority",
    categories: [
      { primary: "costas_trapezio", slots: 3 },
      { primary: "deltoides", slots: 1 },
      { primary: "biceps_antebraco", slots: 2 },
      { primary: "triceps", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };
  const upperPosture: WorkoutTemplate = {
    name: "Superior — Postura e Definição",
    split: "female_lower_priority",
    categories: [
      { primary: "costas_trapezio", slots: 3 },
      { primary: "deltoides", slots: 2 },
      { primary: "triceps", slots: 1 },
      { primary: "biceps_antebraco", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
    ],
  };

  const variants = [
    [glutesPosterior, upperCore, quadCalves, unilateralGlute, upperBackArms, upperPosture],
    [quadCalves, upperCore, glutesPosterior, unilateralGlute, upperBackArms, upperPosture],
    [glutesPosterior, upperPosture, quadCalves, upperBackArms, unilateralGlute, upperCore],
  ];
  const templates = variants[rotation % variants.length];

  if (trainingDays <= 2) return [templates[0], templates[1]];
  if (trainingDays === 3) return templates.slice(0, 3);
  if (trainingDays === 4) return templates.slice(0, 4);
  return templates.slice(0, Math.min(templates.length, trainingDays));
}

function buildStrengthBlockTemplates(profile: AthleteProfile, trainingDays: number, variant: "A" | "B") {
  if (prefersLowerPriority(profile.sex, profile.goal)) {
    const rotation = resolveRotationIndex(profile, 3);
    return buildStrengthLowerPriorityTemplates(trainingDays, rotation);
  }

  const rotation = resolveRotationIndex(profile, 3);
  if (rotation === 1) return buildStrengthCrossPairTemplates(trainingDays);
  if (rotation === 2) return buildStrengthAntagonistTemplates(trainingDays);
  return buildStrengthClassicTemplates(profile, trainingDays, variant);
}

function buildFunctionalTemplates(trainingDays: number): WorkoutTemplate[] {
  const templates: WorkoutTemplate[] = [
    {
      name: "Funcional A — Força global",
      split: "performance_hybrid",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 2 },
        { primary: "peitoral", slots: 1 },
        { primary: "costas_trapezio", slots: 1 },
        { primary: "deltoides", slots: 1 },
        { primary: "abdomen_core", slots: 3 },
      ],
    },
    {
      name: "Funcional B — Core e estabilidade",
      split: "performance_hybrid",
      categories: [
        { primary: "abdomen_core", slots: 4 },
        { primary: "membros_inferiores_gluteos", slots: 2 },
        { primary: "deltoides", slots: 1 },
        { primary: "costas_trapezio", secondary: "peitoral", slots: 1 },
      ],
    },
    {
      name: "Funcional C — Pernas e condicionamento",
      split: "performance_hybrid",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 4 },
        { primary: "abdomen_core", slots: 2 },
        { primary: "panturrilha", slots: 1 },
        { primary: "peitoral", secondary: "costas_trapezio", slots: 1 },
      ],
    },
    {
      name: "Funcional D — Superior e core",
      split: "performance_hybrid",
      categories: [
        { primary: "peitoral", slots: 2 },
        { primary: "costas_trapezio", slots: 2 },
        { primary: "deltoides", slots: 1 },
        { primary: "triceps", secondary: "biceps_antebraco", slots: 1 },
        { primary: "abdomen_core", slots: 2 },
      ],
    },
    {
      name: "Funcional E — Mobilidade ativa",
      split: "performance_hybrid",
      categories: [
        { primary: "abdomen_core", slots: 3 },
        { primary: "membros_inferiores_gluteos", slots: 2 },
        { primary: "deltoides", slots: 1 },
        { primary: "costas_trapezio", slots: 1 },
        { primary: "peitoral", slots: 1 },
      ],
    },
    {
      name: "Funcional F — Potência e coordenação",
      split: "performance_hybrid",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 3 },
        { primary: "abdomen_core", slots: 2 },
        { primary: "deltoides", slots: 1 },
        { primary: "peitoral", secondary: "costas_trapezio", slots: 2 },
      ],
    },
  ];

  const sequences = [
    templates,
    [templates[1], templates[0], templates[2], templates[3], templates[4], templates[5]],
    [templates[2], templates[1], templates[3], templates[0], templates[5], templates[4]],
  ];
  return sequences[0].slice(0, Math.min(templates.length, Math.max(1, trainingDays)));
}

function buildCalistheniaTemplates(trainingDays: number): WorkoutTemplate[] {
  const templates: WorkoutTemplate[] = [
    {
      name: "Calistenia Empurrar",
      split: "performance_hybrid",
      categories: [
        { primary: "peitoral", slots: 3 },
        { primary: "deltoides", slots: 2 },
        { primary: "triceps", slots: 2 },
        { primary: "abdomen_core", slots: 1 },
      ],
    },
    {
      name: "Calistenia Puxar",
      split: "performance_hybrid",
      categories: [
        { primary: "costas_trapezio", slots: 4 },
        { primary: "biceps_antebraco", slots: 2 },
        { primary: "abdomen_core", slots: 2 },
      ],
    },
    {
      name: "Calistenia Pernas",
      split: "performance_hybrid",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 2 },
      ],
    },
    {
      name: "Calistenia Core",
      split: "performance_hybrid",
      categories: [
        { primary: "abdomen_core", slots: 5 },
        { primary: "membros_inferiores_gluteos", slots: 1 },
        { primary: "deltoides", slots: 1 },
        { primary: "costas_trapezio", slots: 1 },
      ],
    },
    {
      name: "Calistenia Skills",
      split: "performance_hybrid",
      categories: [
        { primary: "deltoides", slots: 2 },
        { primary: "costas_trapezio", slots: 2 },
        { primary: "peitoral", slots: 1 },
        { primary: "triceps", slots: 1 },
        { primary: "abdomen_core", slots: 2 },
      ],
    },
    {
      name: "Calistenia Corpo Inteiro",
      split: "performance_hybrid",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 2 },
        { primary: "costas_trapezio", slots: 2 },
        { primary: "peitoral", slots: 1 },
        { primary: "deltoides", slots: 1 },
        { primary: "abdomen_core", slots: 2 },
      ],
    },
  ];

  if (trainingDays <= 2) return [templates[5], templates[3]].slice(0, Math.max(1, trainingDays));
  if (trainingDays === 3) return [templates[0], templates[1], templates[2]];
  if (trainingDays === 4) return [templates[0], templates[1], templates[2], templates[3]];
  if (trainingDays === 5) return [templates[0], templates[1], templates[2], templates[3], templates[4]];
  return templates.slice(0, Math.min(templates.length, trainingDays));
}

// ── Semana atual (alterna A/B a cada semana) ─────────────────────
function currentWeekVariant(): "A" | "B" {
  const weekOfYear = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return weekOfYear % 2 === 0 ? "A" : "B";
}

export function resolveWorkoutTemplates(profile: AthleteProfile): WorkoutTemplate[] {
  const split = resolveTrainingSplit(profile);
  const variant = currentWeekVariant();
  const trainingDays = profile.availableDays.length || 3;

  if (profile.trainingType === "funcional") {
    return buildFunctionalTemplates(trainingDays);
  }

  if (profile.trainingType === "calistenia") {
    return buildCalistheniaTemplates(trainingDays);
  }

  if (profile.trainingType === "musculacao" && split !== "performance_hybrid") {
    return buildStrengthBlockTemplates(profile, trainingDays, variant);
  }

  if (split === "push_pull_legs") {
    if (trainingDays >= 5) {
      return [buildPushA(), buildPullA(), buildLegsA(), buildPushB(), buildPullB(), buildLegsB()];
    }
    return variant === "A"
      ? [buildPushA(), buildPullA(), buildLegsA()]
      : [buildPushB(), buildPullB(), buildLegsB()];
  }

  if (split === "female_lower_priority") {
    return buildStrengthLowerPriorityTemplates(trainingDays, resolveRotationIndex(profile, 3));
  }

  if (split === "male_upper_lower_bias" || split === "upper_lower") {
    // 4 dias → 4 treinos distintos (Upper A, Lower A, Upper B, Lower B)
    if (trainingDays >= 4) {
      return [buildUpperA(split), buildLowerA(split), buildUpperB(split), buildLowerB(split)];
    }
    // 2-3 dias → alterna semanas A / B
    return variant === "A"
      ? [buildUpperA(split), buildLowerA(split)]
      : [buildUpperB(split), buildLowerB(split)];
  }

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

  return variant === "A" ? [buildFullBodyA()] : [buildFullBodyB()];
}

export function resolveWorkoutDensity(profile: AthleteProfile) {
  const goalBias = resolveGoalBias(profile.goal);
  const duration = profile.workoutDurationMin;

  // Terceira idade (60+): mais tempo de descanso entre séries, nunca densidade alta —
  // prioriza recuperação articular e cardiovascular sobre volume por minuto.
  if (profile.age != null && profile.age >= 60) {
    return profile.age >= 70 ? "controlada" : "moderada";
  }

  // Resistência/condicionamento metabólico pede densidade alta (descanso curto,
  // quase circuito) por definição do objetivo — não é sobre nível/duração.
  if (goalBias === "densidade" || goalBias === "resistencia" || duration <= 40) return "alta";
  if (profile.level === "avancado" || profile.consistency === "elite") return "moderada";

  // Mulheres recuperam força mais rápido entre séries que homens (evidência: até
  // 25-50% menos tempo de recuperação necessário — maior % de fibras tipo I, menor
  // acidose metabólica), então toleram um degrau de densidade acima da linha de
  // base conservadora usada por padrão.
  if (profile.sex === "feminino") return "moderada";

  return "controlada";
}

export function resolveWorkoutIntensity(
  level: AthleteLevel,
  consistency: AthleteConsistency,
  goal?: AthleteGoal,
  age?: number | null,
) {
  // Força sempre usa intensidade maior, independente do nível
  const base = ((): "leve" | "moderada" | "pesada" => {
    if (goal === "forca") {
      if (level === "iniciante") return "moderada";
      return "pesada";
    }
    // Resistência muscular usa carga leve por definição (<67% 1RM, NSCA/ACSM) —
    // mesmo pra avançado, já que o estímulo é reps altas, não carga alta.
    if (goal === "resistencia") return "leve";
    if (level === "avancado" && consistency === "elite") return "pesada";
    // Sem essa linha, avançado com consistência "regular"/"ocasional" (não "elite")
    // caía direto pra "leve" — mesma intensidade de um iniciante.
    if (level === "avancado" || level === "intermediario") return "moderada";
    return "leve";
  })();

  // Terceira idade: nunca treino pesado (60+) e prioriza carga leve/controlada a
  // partir dos 70, independente de nível/consistência — segurança articular acima
  // de progressão de carga.
  if (age != null && age >= 70) return "leve";
  if (age != null && age >= 60 && base === "pesada") return "moderada";
  return base;
}
