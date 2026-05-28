import type { OfficialMuscleCategory } from "@/domain/exercises/catalog";
import type { TrainingSplit, WorkoutTemplate } from "@/domain/training/rules";
import { type AppLocale, getDefaultLocale, getStoredLocale } from "@/lib/locale";

export type { AppLocale };

const defaultLocale: AppLocale = getDefaultLocale();

const trainingCopy = {
  pt: {
    focusSeparator: " | ",
    categoryLabels: {
      peitoral: "Peitoral",
      costas_trapezio: "Costas e Trap\u00E9zio",
      deltoides: "Deltoides",
      biceps_antebraco: "B\u00EDceps e Antebra\u00E7o",
      triceps: "Tr\u00EDceps",
      abdomen_core: "Abd\u00F4men e Core",
      membros_inferiores_gluteos: "Membros Inferiores e Gl\u00FAteos",
      panturrilha: "Panturrilha",
    } satisfies Record<OfficialMuscleCategory, string>,
    splitLabels: {
      full_body: "Corpo Inteiro",
      upper_lower: "Superior/Inferior",
      push_pull_legs: "Empurrar/Puxar/Pernas",
      female_lower_priority: "Inferiores Priorit\u00E1rios",
      male_upper_lower_bias: "Superior/Inferior com Vi\u00E9s Superior",
      performance_hybrid: "Performance H\u00EDbrida",
    } satisfies Record<TrainingSplit, string>,
    workoutTypes: { musculacao: "Muscula\u00E7\u00E3o", funcional: "Funcional", calistenia: "Calistenia", hibrido: "H\u00EDbrido" },
    workoutNames: {
      Push: "Treino de Empurrar",
      Pull: "Treino de Puxar",
      Legs: "Treino de Pernas",
      LegsLowerPriority: "Treino de Inferiores e Gl\u00FAteos",
      Upper: "Treino de Superiores",
      Lower: "Treino Inferior",
      "Hybrid Performance": "Treino de Performance H\u00EDbrida",
      "Functional Performance": "Treino Funcional",
    },
    goalTags: { ganho_massa: "Hipertrofia", perda_peso: "Defini\u00E7\u00E3o", definicao: "Defini\u00E7\u00E3o", forca: "For\u00E7a", performance: "Performance", saude: "Sa\u00FAde" },
    weekDays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
    intensityLabels: { leve: "Leve", moderada: "Moderada", pesada: "Pesada" },
    phaseLabels: { base: "Base", progressao: "Progress\u00E3o", intensificacao: "Intensifica\u00E7\u00E3o", deload: "Deload" },
    modalityLabels: { academia: "Academia", musculacao: "Muscula\u00E7\u00E3o", funcional: "Funcional", calistenia: "Calistenia", hibrido: "H\u00EDbrido" },
  },
  es: {
    focusSeparator: " | ",
    categoryLabels: {
      peitoral: "Pecho",
      costas_trapezio: "Espalda y Trapecio",
      deltoides: "Deltoides",
      biceps_antebraco: "B\u00EDceps y Antebrazo",
      triceps: "Tr\u00EDceps",
      abdomen_core: "Abdomen y Core",
      membros_inferiores_gluteos: "Piernas y Gl\u00FAteos",
      panturrilha: "Pantorrilla",
    } satisfies Record<OfficialMuscleCategory, string>,
    splitLabels: {
      full_body: "Cuerpo Completo",
      upper_lower: "Superior/Inferior",
      push_pull_legs: "Empuje/Tir\u00F3n/Piernas",
      female_lower_priority: "Prioridad en Inferiores",
      male_upper_lower_bias: "Superior/Inferior con Sesgo Superior",
      performance_hybrid: "Rendimiento H\u00EDbrido",
    } satisfies Record<TrainingSplit, string>,
    workoutTypes: { musculacao: "Musculaci\u00F3n", funcional: "Funcional", calistenia: "Calistenia", hibrido: "H\u00EDbrido" },
    workoutNames: {
      Push: "Entrenamiento de Empuje",
      Pull: "Entrenamiento de Tir\u00F3n",
      Legs: "Entrenamiento de Piernas",
      LegsLowerPriority: "Entrenamiento de Piernas y Gl\u00FAteos",
      Upper: "Entrenamiento Superior",
      Lower: "Entrenamiento Inferior",
      "Hybrid Performance": "Entrenamiento de Rendimiento H\u00EDbrido",
      "Functional Performance": "Entrenamiento Funcional",
    },
    goalTags: { ganho_massa: "Hipertrofia", perda_peso: "Definici\u00F3n", definicao: "Definici\u00F3n", forca: "Fuerza", performance: "Rendimiento", saude: "Salud" },
    weekDays: ["Lun", "Mar", "Mi\u00E9", "Jue", "Vie", "S\u00E1b", "Dom"],
    intensityLabels: { leve: "Suave", moderada: "Moderada", pesada: "Pesada" },
    phaseLabels: { base: "Base", progressao: "Progresi\u00F3n", intensificacao: "Intensificaci\u00F3n", deload: "Descarga" },
    modalityLabels: { academia: "Gimnasio", musculacao: "Musculaci\u00F3n", funcional: "Funcional", calistenia: "Calistenia", hibrido: "H\u00EDbrido" },
  },
  en: {
    focusSeparator: " | ",
    categoryLabels: {
      peitoral: "Chest",
      costas_trapezio: "Back and Traps",
      deltoides: "Delts",
      biceps_antebraco: "Biceps and Forearms",
      triceps: "Triceps",
      abdomen_core: "Abs and Core",
      membros_inferiores_gluteos: "Lower Body and Glutes",
      panturrilha: "Calves",
    } satisfies Record<OfficialMuscleCategory, string>,
    splitLabels: {
      full_body: "Full Body",
      upper_lower: "Upper/Lower",
      push_pull_legs: "Push/Pull/Legs",
      female_lower_priority: "Lower Priority",
      male_upper_lower_bias: "Upper/Lower with Upper Bias",
      performance_hybrid: "Hybrid Performance",
    } satisfies Record<TrainingSplit, string>,
    workoutTypes: { musculacao: "Strength", funcional: "Functional", calistenia: "Calisthenics", hibrido: "Hybrid" },
    workoutNames: {
      Push: "Push Workout",
      Pull: "Pull Workout",
      Legs: "Leg Workout",
      LegsLowerPriority: "Lower Body and Glutes Workout",
      Upper: "Upper Workout",
      Lower: "Lower Workout",
      "Hybrid Performance": "Hybrid Performance Workout",
      "Functional Performance": "Functional Workout",
    },
    goalTags: { ganho_massa: "Hypertrophy", perda_peso: "Cut", definicao: "Cut", forca: "Strength", performance: "Performance", saude: "Health" },
    weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    intensityLabels: { leve: "Light", moderada: "Moderate", pesada: "Heavy" },
    phaseLabels: { base: "Base", progressao: "Progression", intensificacao: "Intensification", deload: "Deload" },
    modalityLabels: { academia: "Gym", musculacao: "Strength", funcional: "Functional", calistenia: "Calisthenics", hibrido: "Hybrid" },
  },
  fr: {
    focusSeparator: " | ",
    categoryLabels: {
      peitoral: "Pectoraux",
      costas_trapezio: "Dos et Trap\u00E8zes",
      deltoides: "Delto\u00EFdes",
      biceps_antebraco: "Biceps et Avant-bras",
      triceps: "Triceps",
      abdomen_core: "Abdos et Core",
      membros_inferiores_gluteos: "Bas du Corps et Fessiers",
      panturrilha: "Mollets",
    } satisfies Record<OfficialMuscleCategory, string>,
    splitLabels: {
      full_body: "Corps Complet",
      upper_lower: "Haut/Bas",
      push_pull_legs: "Pouss\u00E9e/Tirage/Jambes",
      female_lower_priority: "Priorit\u00E9 Bas du Corps",
      male_upper_lower_bias: "Haut/Bas avec Biais Haut",
      performance_hybrid: "Performance Hybride",
    } satisfies Record<TrainingSplit, string>,
    workoutTypes: { musculacao: "Musculation", funcional: "Fonctionnel", calistenia: "Calisth\u00E9nie", hibrido: "Hybride" },
    workoutNames: {
      Push: "S\u00E9ance de Pouss\u00E9e",
      Pull: "S\u00E9ance de Tirage",
      Legs: "S\u00E9ance Jambes",
      LegsLowerPriority: "S\u00E9ance Jambes et Fessiers",
      Upper: "S\u00E9ance Haut du Corps",
      Lower: "S\u00E9ance Bas du Corps",
      "Hybrid Performance": "S\u00E9ance de Performance Hybride",
      "Functional Performance": "S\u00E9ance Fonctionnelle",
    },
    goalTags: { ganho_massa: "Hypertrophie", perda_peso: "D\u00E9finition", definicao: "D\u00E9finition", forca: "Force", performance: "Performance", saude: "Sant\u00E9" },
    weekDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    intensityLabels: { leve: "L\u00E9g\u00E8re", moderada: "Mod\u00E9r\u00E9e", pesada: "Lourde" },
    phaseLabels: { base: "Base", progressao: "Progression", intensificacao: "Intensification", deload: "Deload" },
    modalityLabels: { academia: "Salle", musculacao: "Musculation", funcional: "Fonctionnel", calistenia: "Calisth\u00E9nie", hibrido: "Hybride" },
  },
  de: {
    focusSeparator: " | ",
    categoryLabels: {
      peitoral: "Brust",
      costas_trapezio: "R\u00FCcken und Trapez",
      deltoides: "Deltoideus",
      biceps_antebraco: "Bizeps und Unterarme",
      triceps: "Trizeps",
      abdomen_core: "Bauch und Core",
      membros_inferiores_gluteos: "Unterk\u00F6rper und Gluteus",
      panturrilha: "Waden",
    } satisfies Record<OfficialMuscleCategory, string>,
    splitLabels: {
      full_body: "Ganzk\u00F6rper",
      upper_lower: "Oberk\u00F6rper/Unterk\u00F6rper",
      push_pull_legs: "Push/Pull/Beine",
      female_lower_priority: "Unterk\u00F6rper-Priorit\u00E4t",
      male_upper_lower_bias: "Ober/Unter mit Oberk\u00F6rper-Bias",
      performance_hybrid: "Hybride Performance",
    } satisfies Record<TrainingSplit, string>,
    workoutTypes: { musculacao: "Krafttraining", funcional: "Funktionell", calistenia: "Calisthenics", hibrido: "Hybrid" },
    workoutNames: {
      Push: "Push-Training",
      Pull: "Pull-Training",
      Legs: "Beintraining",
      LegsLowerPriority: "Beine-und-Gluteus-Training",
      Upper: "Oberk\u00F6rper-Training",
      Lower: "Unterk\u00F6rper-Training",
      "Hybrid Performance": "Hybrides Performance-Training",
      "Functional Performance": "Funktionelles Training",
    },
    goalTags: { ganho_massa: "Hypertrophie", perda_peso: "Definition", definicao: "Definition", forca: "Kraft", performance: "Performance", saude: "Gesundheit" },
    weekDays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    intensityLabels: { leve: "Leicht", moderada: "Moderat", pesada: "Schwer" },
    phaseLabels: { base: "Basis", progressao: "Progression", intensificacao: "Intensivierung", deload: "Deload" },
    modalityLabels: { academia: "Fitnessstudio", musculacao: "Krafttraining", funcional: "Funktionell", calistenia: "Calisthenics", hibrido: "Hybrid" },
  },
} as const;

function getTrainingCopy(locale: AppLocale = getStoredLocale()) {
  return trainingCopy[locale] ?? trainingCopy[defaultLocale];
}

function normalizeKey(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function getCategoryLabel(category: OfficialMuscleCategory, locale: AppLocale = getStoredLocale()) {
  return getTrainingCopy(locale).categoryLabels[category];
}

export function getFocusSeparator(locale: AppLocale = getStoredLocale()) {
  return getTrainingCopy(locale).focusSeparator;
}

export function getSplitLabel(split: TrainingSplit, locale: AppLocale = getStoredLocale()) {
  return getTrainingCopy(locale).splitLabels[split];
}

export function getWorkoutTypeLabel(type: string, locale: AppLocale = getStoredLocale()) {
  const normalized = normalizeKey(type);
  const labels = getTrainingCopy(locale).workoutTypes;
  if (normalized === "musculacao") return labels.musculacao;
  if (normalized === "funcional") return labels.funcional;
  if (normalized === "hibrido") return labels.hibrido;
  if (normalized === "calistenia") return labels.calistenia;
  return type;
}

export function getWorkoutNameLabel(
  templateName: WorkoutTemplate["name"],
  options: { prefersLowerPriority?: boolean; index?: number } = {},
  locale: AppLocale = getStoredLocale(),
) {
  const labels = getTrainingCopy(locale).workoutNames;
  if (templateName === "Push") return labels.Push;
  if (templateName === "Pull") return labels.Pull;
  if (templateName === "Legs") return options.prefersLowerPriority ? labels.LegsLowerPriority : labels.Legs;
  if (templateName === "Upper") return labels.Upper;
  if (templateName === "Lower") return `${labels.Lower} ${(options.index ?? 0) + 1}`;
  if (templateName === "Hybrid Performance") return labels["Hybrid Performance"];
  if (templateName === "Functional Performance") return labels["Functional Performance"];
  return templateName;
}

export function getGoalTagLabel(goal: keyof (typeof trainingCopy)["pt"]["goalTags"], locale: AppLocale = getStoredLocale()) {
  return getTrainingCopy(locale).goalTags[goal];
}

export function getWeekDayLabels(locale: AppLocale = getStoredLocale()) {
  return getTrainingCopy(locale).weekDays;
}

export function getIntensityLabel(value: "leve" | "moderada" | "pesada" | "Leve" | "Moderado" | "Pesado", locale: AppLocale = getStoredLocale()) {
  const normalized = normalizeKey(value);
  const labels = getTrainingCopy(locale).intensityLabels;
  if (normalized.startsWith("lev")) return labels.leve;
  if (normalized.startsWith("mod")) return labels.moderada;
  return labels.pesada;
}

export function getPhaseLabel(value: "base" | "progressao" | "intensificacao" | "deload", locale: AppLocale = getStoredLocale()) {
  return getTrainingCopy(locale).phaseLabels[value];
}

export function getModalityLabel(value: "academia" | "musculacao" | "funcional" | "calistenia" | "hibrido", locale: AppLocale = getStoredLocale()) {
  return getTrainingCopy(locale).modalityLabels[value];
}

const volumeBiasLabels = {
  pt: { alto: "Alto", moderado: "Moderado", baixo: "Baixo" },
  es: { alto: "Alto", moderado: "Moderado", baixo: "Bajo" },
  en: { alto: "High", moderado: "Moderate", baixo: "Low" },
  fr: { alto: "Élevé", moderado: "Modéré", baixo: "Bas" },
  de: { alto: "Hoch", moderado: "Moderat", baixo: "Niedrig" },
} as const;

export function getVolumeBiasLabel(value: "alto" | "moderado" | "baixo", locale: AppLocale = getStoredLocale()) {
  return (volumeBiasLabels[locale] ?? volumeBiasLabels.pt)[value];
}

const readinessLevelLabels = {
  pt: { alta: "Alta", media: "Média", baixa: "Baixa" },
  es: { alta: "Alta", media: "Media", baixa: "Baja" },
  en: { alta: "High", media: "Medium", baixa: "Low" },
  fr: { alta: "Élevée", media: "Moyenne", baixa: "Faible" },
  de: { alta: "Hoch", media: "Mittel", baixa: "Niedrig" },
} as const;

export function getReadinessLevelLabel(value: "alta" | "media" | "baixa", locale: AppLocale = getStoredLocale()) {
  return (readinessLevelLabels[locale] ?? readinessLevelLabels.pt)[value];
}

const workoutNameTranslations: Record<string, Partial<Record<AppLocale, string>>> = {
  "Peito":                 { en: "Chest",                  es: "Pecho",                    fr: "Pectoraux",                   de: "Brust"                       },
  "Ombros":                { en: "Shoulders",              es: "Hombros",                  fr: "Épaules",                     de: "Schultern"                   },
  "Costas":                { en: "Back",                   es: "Espalda",                  fr: "Dos",                         de: "Rücken"                      },
  "Bíceps":                { en: "Biceps",                 es: "Bíceps",                   fr: "Biceps",                      de: "Bizeps"                      },
  "Quadríceps":            { en: "Quads",                  es: "Cuádriceps",               fr: "Quadriceps",                  de: "Quadrizeps"                  },
  "Posterior":             { en: "Hamstrings",             es: "Isquiotibiales",           fr: "Ischio-jambiers",             de: "Beinbeuger"                  },
  "Corpo Inteiro A":      { en: "Full Body A",             es: "Cuerpo Completo A",        fr: "Corps Complet A",             de: "Ganzkörper A"               },
  "Corpo Inteiro B":      { en: "Full Body B",             es: "Cuerpo Completo B",        fr: "Corps Complet B",             de: "Ganzkörper B"               },
  "Superior A — Empurrar":{ en: "Upper A — Push",         es: "Superior A — Empuje",      fr: "Haut A — Poussée",            de: "Oberkörper A — Drücken"     },
  "Superior B — Puxar":   { en: "Upper B — Pull",         es: "Superior B — Tirón",       fr: "Haut B — Tirage",             de: "Oberkörper B — Ziehen"      },
  "Pernas A — Quadríceps":{ en: "Lower A — Quads",        es: "Piernas A — Cuádriceps",   fr: "Bas A — Quadriceps",          de: "Unterkörper A — Quadrizeps" },
  "Pernas B — Posterior": { en: "Lower B — Hamstrings",   es: "Piernas B — Isquios",      fr: "Bas B — Ischio-jambiers",     de: "Unterkörper B — Beinbeuger" },
  "Pernas A — Glúteos":   { en: "Lower A — Glutes",       es: "Piernas A — Glúteos",      fr: "Bas A — Fessiers",            de: "Unterkörper A — Gesäß"      },
  "Upper — Definição":    { en: "Upper — Sculpting",      es: "Superior — Definición",    fr: "Haut — Sculpture",            de: "Oberkörper — Definition"    },
  "Hybrid Performance":   { en: "Hybrid Performance",     es: "Rendimiento Híbrido",      fr: "Performance Hybride",         de: "Hybride Performance"        },
  // Cross-pair / Antagonist splits
  "Peito + Ombro":              { en: "Chest + Shoulders",        es: "Pecho + Hombros",             fr: "Pectoraux + Épaules",          de: "Brust + Schultern"            },
  "Costas + Bíceps":            { en: "Back + Biceps",             es: "Espalda + Bíceps",            fr: "Dos + Biceps",                 de: "Rücken + Bizeps"              },
  "Costas + Tríceps":           { en: "Back + Triceps",            es: "Espalda + Tríceps",           fr: "Dos + Triceps",                de: "Rücken + Trizeps"             },
  "Pernas + Abdômen":           { en: "Legs + Abs",                es: "Piernas + Abdomen",           fr: "Jambes + Abdos",               de: "Beine + Bauch"                },
  "Peito + Bíceps":             { en: "Chest + Biceps",            es: "Pecho + Bíceps",              fr: "Pectoraux + Biceps",           de: "Brust + Bizeps"               },
  "Ombros + Braços":            { en: "Shoulders + Arms",          es: "Hombros + Brazos",            fr: "Épaules + Bras",               de: "Schultern + Arme"             },
  "Braços":                     { en: "Arms",                      es: "Brazos",                      fr: "Bras",                         de: "Arme"                         },
  "Posterior + Panturrilha":    { en: "Hamstrings + Calves",       es: "Isquios + Pantorrilla",       fr: "Ischio-jambiers + Mollets",    de: "Beinbeuger + Waden"           },
  "Peito + Costas":             { en: "Chest + Back",              es: "Pecho + Espalda",             fr: "Pectoraux + Dos",              de: "Brust + Rücken"               },
  "Posterior + Glúteos":        { en: "Hamstrings + Glutes",       es: "Isquios + Glúteos",           fr: "Ischio-jambiers + Fessiers",   de: "Beinbeuger + Gesäß"           },
  // Female lower-priority split
  "Glúteos + Posterior":        { en: "Glutes + Hamstrings",       es: "Glúteos + Isquios",           fr: "Fessiers + Ischio-jambiers",   de: "Gesäß + Beinbeuger"           },
  "Superior + Core":            { en: "Upper + Core",              es: "Superior + Core",             fr: "Haut du Corps + Core",         de: "Oberkörper + Core"            },
  "Quadríceps + Panturrilha":   { en: "Quads + Calves",            es: "Cuádriceps + Pantorrilla",    fr: "Quadriceps + Mollets",         de: "Quadrizeps + Waden"           },
  "Glúteos + Unilateral":       { en: "Glutes + Unilateral",       es: "Glúteos + Unilateral",        fr: "Fessiers + Unilatéral",        de: "Gesäß + Unilateral"           },
  "Costas + Braços":            { en: "Back + Arms",               es: "Espalda + Brazos",            fr: "Dos + Bras",                   de: "Rücken + Arme"                },
  "Upper — Postura e Definição":{ en: "Upper — Posture & Sculpting", es: "Superior — Postura y Definición", fr: "Haut — Posture et Sculpture", de: "Oberkörper — Haltung & Definition" },
  // Functional templates
  "Funcional A — Força global":         { en: "Functional A — Full Strength",    es: "Funcional A — Fuerza global",        fr: "Fonctionnel A — Force globale",      de: "Funktionell A — Ganzkörperkraft"    },
  "Funcional B — Core e estabilidade":  { en: "Functional B — Core & Stability", es: "Funcional B — Core y estabilidad",   fr: "Fonctionnel B — Core et stabilité",  de: "Funktionell B — Core & Stabilität"  },
  "Funcional C — Pernas e condicionamento": { en: "Functional C — Legs & Conditioning", es: "Funcional C — Piernas y acondicionamiento", fr: "Fonctionnel C — Jambes et conditionnement", de: "Funktionell C — Beine & Kondition" },
  "Funcional D — Superior e core":      { en: "Functional D — Upper & Core",     es: "Funcional D — Superior y core",      fr: "Fonctionnel D — Haut et core",       de: "Funktionell D — Oberkörper & Core"  },
  "Funcional E — Mobilidade ativa":     { en: "Functional E — Active Mobility",  es: "Funcional E — Movilidad activa",     fr: "Fonctionnel E — Mobilité active",    de: "Funktionell E — Aktive Mobilität"   },
  "Funcional F — Potência e coordenação":{ en: "Functional F — Power & Coordination", es: "Funcional F — Potencia y coordinación", fr: "Fonctionnel F — Puissance et coordination", de: "Funktionell F — Kraft & Koordination" },
  // Calisthenics templates
  "Calistenia Empurrar":  { en: "Calisthenics Push",      es: "Calistenia Empuje",        fr: "Callisthénique Poussée",     de: "Calisthenics Drücken"       },
  "Calistenia Puxar":     { en: "Calisthenics Pull",      es: "Calistenia Tirón",         fr: "Callisthénique Tirage",      de: "Calisthenics Ziehen"        },
  "Calistenia Pernas":    { en: "Calisthenics Legs",      es: "Calistenia Piernas",       fr: "Callisthénique Jambes",      de: "Calisthenics Beine"         },
  "Calistenia Core":      { en: "Calisthenics Core",      es: "Calistenia Core",          fr: "Callisthénique Core",        de: "Calisthenics Core"          },
  "Calistenia Skills":    { en: "Calisthenics Skills",    es: "Calistenia Habilidades",   fr: "Callisthénique Compétences", de: "Calisthenics Skills"        },
  "Calistenia Corpo Inteiro": { en: "Calisthenics Full Body", es: "Calistenia Cuerpo Completo", fr: "Callisthénique Corps Complet", de: "Calisthenics Ganzkörper"  },
};

export function translateWorkoutName(name: string, locale: AppLocale = getStoredLocale()): string {
  if (locale === "pt") return name;
  const entry = workoutNameTranslations[name];
  return entry?.[locale] ?? name;
}
