import { getExercise, type Workout, type WorkoutExercise, type WorkoutSet } from "@/data/library";
import { buildAthleteProfile, type AthleteProfile, type AthleteSex } from "@/domain/athlete/profile";
import { buildBodyTrainingContext, type BodyTrainingContext } from "@/domain/body/state";
import {
  buildEnvironmentContextFromOnboarding,
  type EnvironmentContext,
} from "@/domain/environment/context";
import {
  buildExerciseCatalog,
  isFunctionalExerciseRecord,
  type ExerciseCatalogRecord,
  type OfficialMuscleCategory,
} from "@/domain/exercises/catalog";
import { applyWorkoutCustomization } from "@/domain/training/customization";
import {
  EXERCISES_PER_WORKOUT,
  resolveTrainingSplit,
  resolveWorkoutDensity,
  resolveWorkoutIntensity,
  resolveWorkoutTemplates,
  type WorkoutTemplate,
  type WorkoutCategoryTemplate,
} from "@/domain/training/rules";
import { buildPeriodizationBlock, type TwelveWeekBlock } from "@/domain/training/periodization";
import {
  buildNutritionTrainingContext,
  type NutritionTrainingContext,
} from "@/domain/nutrition/state";
import { loadOnboarding } from "@/lib/onboarding";
import {
  getCategoryLabel,
  getFocusSeparator,
  getGoalTagLabel,
  getWorkoutNameLabel,
  translateWorkoutName,
} from "@/lib/training-i18n";
import { getStoredLocale, type AppLocale } from "@/lib/locale";
import { getWorkoutCustomization } from "@/lib/workout-customizations";

export type GeneratedWeekPlanEntry = {
  dayIndex: number;
  workoutId: string | null;
  intensity: "Leve" | "Moderado" | "Pesado" | null;
  tag: string | null;
};

export type GeneratedTrainingState = {
  profile: AthleteProfile;
  environment: EnvironmentContext;
  body: BodyTrainingContext;
  nutrition: NutritionTrainingContext;
  periodization: TwelveWeekBlock;
  workouts: Workout[];
  schedule: GeneratedWeekPlanEntry[];
};

type GeneratedTrainingOptions = {
  applyCustomizations?: boolean;
};

const DEFAULT_WEEK_DAYS = [0, 1, 2] as const;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function resolveWorkoutName(
  template: WorkoutTemplate,
  profile: AthleteProfile,
  index: number,
  locale: AppLocale,
) {
  const name = getWorkoutNameLabel(
    template.name,
    { prefersLowerPriority: prefersLowerPriority(profile), index },
    locale,
  );
  return translateWorkoutName(name, locale);
}

function prefersLowerPriority(profile: AthleteProfile) {
  return (
    profile.sex === "feminino" && ["ganho_massa", "definicao", "perda_peso"].includes(profile.goal)
  );
}

function resolveFocus(template: WorkoutTemplate, locale: AppLocale) {
  return unique(template.categories.map((item) => getCategoryLabel(item.primary, locale))).join(
    getFocusSeparator(locale),
  );
}

function resolveWorkoutTag(profile: AthleteProfile) {
  return getGoalTagLabel(profile.goal);
}

function resolveRestSeconds(
  category: OfficialMuscleCategory,
  intensity: "leve" | "moderada" | "pesada",
  isResistanceFocus = false,
) {
  // Resistência/condicionamento metabólico: descanso curto entre séries, mesmo pra
  // pernas/compostos — é o próprio estímulo do objetivo (NSCA/ACSM: circuitos com
  // descanso curto), não o descanso padrão de hipertrofia/força.
  if (isResistanceFocus) return 30;

  if (category === "membros_inferiores_gluteos") return intensity === "pesada" ? 120 : 90;
  if (category === "peitoral" || category === "costas_trapezio" || category === "deltoides") {
    return intensity === "pesada" ? 90 : 75;
  }
  return intensity === "leve" ? 45 : 60;
}

function resolveSetScheme(
  category: OfficialMuscleCategory,
  intensity: "leve" | "moderada" | "pesada",
  density: "alta" | "moderada" | "controlada",
  isResistanceFocus = false,
): WorkoutSet[] {
  // Resistência muscular/condicionamento metabólico: 15-20 reps com carga leve
  // (<67% 1RM), conforme NSCA/ACSM — bem acima do range de hipertrofia/força.
  const repsBase = isResistanceFocus
    ? 18
    : category === "abdomen_core"
      ? 15
      : category === "panturrilha"
        ? 18
        : intensity === "pesada"
          ? 8
          : 12;
  const numberOfSets = density === "alta" ? 2 : 3;

  return Array.from({ length: numberOfSets }).map((_, index) => ({
    reps: Math.max(8, repsBase - (intensity === "pesada" ? index : 0)),
    weight: 0,
  }));
}

export function supportsProfileEquipment(record: ExerciseCatalogRecord, profile: AthleteProfile) {
  // Peso corporal é sempre disponível — não precisa de equipamento selecionado
  if (record.equipment === "peso_corporal") return true;

  if (profile.equipment.length === 0) {
    // Casa sem equipamento → apenas peso corporal (já tratado acima)
    if (profile.location === "casa") return false;
    // Outdoor → barra fixa e paralelas públicas mesmo sem seleção
    if (profile.location === "outdoor") {
      return ["barra_fixa", "paralelas", "parede", "trx"].includes(record.equipment);
    }
    // Academia/híbrido sem equipamento selecionado → assume acesso completo
    return true;
  }

  const equipmentMap: Record<string, string[]> = {
    barra: ["barras", "barra", "anilhas", "rack"],
    halteres: ["halteres", "halter", "kettlebell"],
    cabos: ["cabos", "cabo"],
    maquina: ["maquinas", "maquina"],
    peso_corporal: ["peso corporal"],
    barra_fixa: ["barra fixa"],
    paralelas: ["paralelas", "argolas"],
    parede: ["parede"],
    banco: ["banco"],
    trx: ["trx"],
    bola: ["bola"],
    elastico: ["elasticos", "elastico", "elasticos"],
  };

  const accepted = equipmentMap[record.equipment] ?? [record.equipment];
  const normalizedEquipment = profile.equipment.map(normalizeName);

  return accepted.some((candidate) => normalizedEquipment.includes(normalizeName(candidate)));
}

// Iniciante nunca deve receber um exercício marcado "avancado" (skills de
// calistenia, barra fixa/paralelas sem assistência, etc.) — mesmo que raro, é
// arriscado/desmotivador oferecer isso como ponto de partida. Intermediário e
// avançado não são restringidos aqui.
export function supportsProfileLevel(record: ExerciseCatalogRecord, profile: AthleteProfile) {
  if (profile.level !== "iniciante") return true;
  return record.difficulty !== "avancado";
}

export function supportsEnvironment(
  record: ExerciseCatalogRecord,
  environment: EnvironmentContext,
) {
  if (environment.location === "outdoor") {
    return (
      record.trainingType === "calistenia" &&
      ["peso_corporal", "barra_fixa", "paralelas", "parede", "trx"].includes(record.equipment)
    );
  }

  if (environment.location === "casa") {
    return record.equipment !== "maquina" && record.equipment !== "cabos";
  }

  return true;
}

function supportsTrainingType(
  record: ExerciseCatalogRecord,
  profile: AthleteProfile,
  environment: EnvironmentContext,
) {
  if (profile.trainingType === "calistenia") return record.trainingType === "calistenia";
  if (profile.trainingType === "musculacao") {
    if (record.trainingType === "musculacao") return true;
    // O catálogo de "musculação" não tem NENHUM exercício de peso corporal (0 de
    // ~460) — aluno que treina em casa/ao ar livre sem equipamento de academia e
    // escolheu "musculação" (não "calistenia") ficava com o treino inteiro vazio.
    // Sem esse fallback, é uma tela em branco pro aluno.
    if (
      record.trainingType === "calistenia" &&
      (profile.location === "casa" || profile.location === "outdoor")
    ) {
      return true;
    }
    return false;
  }

  if (profile.trainingType === "funcional") {
    if (record.trainingType === "calistenia") return true;

    if (["barra", "halteres", "banco", "maquina", "cabos"].includes(record.equipment)) return false;
    return isFunctionalExerciseRecord(record);
  }

  // fallback legacy (sem trainingType explícito)
  if (environment.location === "outdoor" || environment.location === "casa") return true;
  return record.trainingType === "musculacao";
}

function scoreEnvironmentFit(record: ExerciseCatalogRecord, environment: EnvironmentContext) {
  let score = 0;

  if (
    environment.location === "casa" &&
    ["peso_corporal", "halteres", "barra", "elastico", "banco"].includes(record.equipment)
  ) {
    score += 3;
  }

  if (
    environment.location === "outdoor" &&
    ["peso_corporal", "barra_fixa", "paralelas", "parede", "trx"].includes(record.equipment)
  ) {
    score += 4;
  }

  if (
    environment.gymSize === "pequena" &&
    (record.equipment === "maquina" || record.equipment === "cabos")
  ) {
    score -= 1;
  }

  if (
    environment.crowdLevel === "pico" &&
    (record.equipment === "maquina" || record.equipment === "cabos")
  ) {
    score -= 2;
  }

  return score;
}

function getMovementPattern(record: ExerciseCatalogRecord) {
  return record.movementPattern.pt;
}

export function resolveExerciseFamily(record: ExerciseCatalogRecord) {
  // Vários vídeos do catálogo são "takes" duplicados do mesmo exercício, numerados no
  // fim do nome (ex: "Rosca Direta 03", "Agachamento 03", "Abdução Máquina 02", e às
  // vezes colado sem espaço: "Stiff02"). Sem remover esse número aqui, cada take virava
  // uma família diferente e podia repetir no mesmo treino junto com a versão sem número.
  const name = normalizeName(record.name.pt).replace(/\s*\d{1,2}$/, "");
  const movement = normalizeName(getMovementPattern(record));

  if (name.includes("remada curvada")) return "costas:remada_curvada";
  if (name.includes("remada baixa")) return "costas:remada_baixa";
  if (name.includes("remada unilateral")) return "costas:remada_unilateral";
  if (name.includes("remada"))
    return `costas:${name
      .replace(
        /\b(pronada|supinada|aberta|fechada|neutra|pegada|bilateral|barra|com|no|na|cabo|halteres?)\b/g,
        "",
      )
      .trim()
      .replace(/\s+/g, "_")}`;

  // "Puxada Máquina" (sem "alta" no nome) é a mesma puxada alta/pulldown — sem essa
  // checagem ficava numa família à parte e repetia com "Puxada Alta ...".
  if (
    name.includes("puxada alta") ||
    name.includes("puxada maquina") ||
    name.includes("pulldown") ||
    name.includes("pulley")
  )
    return "costas:puxada_alta";
  if (name.includes("puxada unilateral")) return "costas:puxada_unilateral";
  if (name.includes("puxada cruzada")) return "costas:puxada_cruzada";
  // "Barra Fixa" tem ~16 variantes de calistenia bem diferentes entre si (iniciante
  // assistido, avançado com peso, skills como L-sit/giro, e até um exercício de
  // ativação escapular que nem é a barra fixa completa) — sem separar em subgrupos,
  // o sistema nunca deixava 2 delas aparecerem juntas no mesmo treino, mesmo sendo
  // complementares (ex: escapular como ativação + barra fixa com peso como principal).
  // "Rosca na Barra Fixa" é bíceps (rosca suspensa), não costas — exclui antes de
  // cair no grupo de barra fixa só por causa do nome do equipamento.
  if (
    (name.includes("barra fixa") || name.includes("pull up") || name.includes("chin up")) &&
    !name.includes("rosca")
  ) {
    if (name.includes("escapular")) return "costas:barra_fixa_escapular";
    if (name.includes("assistid") || name.includes("salto")) return "costas:barra_fixa_assistida";
    if (name.includes("com peso")) return "costas:barra_fixa_com_peso";
    if (
      name.includes("arco") ||
      name.includes("bracos alternados") ||
      name.includes("giro") ||
      name.includes("l sit") ||
      name.includes("l-sit") ||
      name.includes("cabeca para baixo")
    ) {
      return "costas:barra_fixa_skill";
    }
    return "costas:barra_fixa";
  }

  // "Encolhimento" (trapézio) tem várias cópias por equipamento (barra, halteres,
  // máquina, smith, sentado) que sem essa checagem ficavam em famílias diferentes.
  // "Atrás" (encolhimento atrás das costas) é mecanicamente distinto, mantido à parte.
  if (name.includes("encolhimento")) {
    if (name.includes("atras")) return "costas:encolhimento_atras";
    return "costas:encolhimento";
  }

  if (name.includes("rosca martelo")) return "biceps:rosca_martelo";
  if (name.includes("rosca scott")) return "biceps:rosca_scott";
  if (name.includes("rosca direta")) return "biceps:rosca_direta";
  if (name.includes("rosca unilateral")) return "biceps:rosca_unilateral";
  if (record.category === "biceps_antebraco" && (name.includes("rosca") || name.includes("curl"))) {
    return `biceps:${name
      .replace(
        /\b(unilateral|bilateral|pronada|supinada|alternada|com|no|na|cabo|halteres?|barra)\b/g,
        "",
      )
      .trim()
      .replace(/\s+/g, "_")}`;
  }

  if (record.category === "triceps") {
    if (name.includes("corda")) return "triceps:corda";
    if (name.includes("frances")) return "triceps:frances";
    if (name.includes("testa")) return "triceps:testa";
    if (name.includes("coice") || name.includes("patada")) return "triceps:coice";
    if (name.includes("mergulho") || name.includes("paralela")) return "triceps:mergulho";
    if (name.includes("extensao") || movement.includes("extensao")) return "triceps:extensao";
  }

  // "incliando" cobre um typo do catálogo de vídeos ("Supino incliando com halteres")
  // que na prática é supino inclinado.
  if (name.includes("supino inclinado") || name.includes("supino incliando"))
    return "peitoral:supino_inclinado";
  if (name.includes("supino declinado")) return "peitoral:supino_declinado";
  // Pegada fechada e "canadense" mudam o ângulo/ênfase (mais tríceps) — mantidos como
  // famílias próprias, distintas do supino reto plano.
  if (name.includes("supino canadense")) return "peitoral:supino_canadense";
  if (name.includes("supino fechado")) return "peitoral:supino_fechado";
  // Qualquer outro "supino" (com/sem equipamento explícito: barra, halteres, máquina,
  // smith) é o mesmo supino reto plano — sem isso, "Supino" e "Supino Barra" e "Supino
  // Com Halteres" viravam famílias diferentes e podiam repetir no mesmo treino.
  if (name.includes("supino")) return "peitoral:supino_reto";
  if (name.includes("crucifixo")) return "peitoral:crucifixo";
  if (name.includes("crossover")) return "peitoral:crossover";

  // "Stiff" tem várias cópias no catálogo (com/sem halteres, takes numerados) que sem
  // essa checagem caíam em famílias diferentes e podiam repetir no mesmo treino.
  if (name.includes("stiff")) return "pernas:stiff";

  // "Hip Thrust" (nome em inglês, catálogo curado) e "Elevação de Quadril" (nome em
  // português, catálogo automático) são o mesmo movimento de extensão de quadril —
  // sem essa checagem, "Hip Thrust no Solo" e "Elevação de Quadril com Peso Corporal"
  // ficavam em famílias diferentes e repetiam no mesmo treino.
  if (name.includes("hip thrust") || name.includes("elevacao de quadril"))
    return "gluteos:hip_thrust";

  // "Desenvolvimento" (catálogo de vídeos, pt) e "Military Press" (entrada cadastrada
  // à parte, en) são o mesmo desenvolvimento de ombro — sem essa checagem, "Desenvolvimento
  // No Smith" e "Desenvolvimento Militar"/"Military Press" ficavam em famílias diferentes
  // e repetiam no mesmo treino.
  if (
    name.includes("desenvolvimento") ||
    name.includes("military press") ||
    name.includes("press militar")
  ) {
    if (name.includes("nuca") || name.includes("atras")) return "ombros:desenvolvimento_nuca";
    if (name.includes("unilateral")) return "ombros:desenvolvimento_unilateral";
    return "ombros:desenvolvimento";
  }

  return `${record.category}:${name
    .replace(/\b(pronada|supinada|aberta|fechada|neutra|pegada|unilateral|bilateral)\b/g, "")
    .trim()
    .replace(/\s+/g, "_")}`;
}

export function resolveMovementBucket(record: ExerciseCatalogRecord) {
  const name = normalizeName(record.name.pt);
  const movement = normalizeName(getMovementPattern(record));

  if (name.includes("remada") || movement.includes("puxar horizontal")) return "horizontal_pull";
  if (
    name.includes("puxada") ||
    name.includes("pulldown") ||
    name.includes("pulley") ||
    name.includes("barra fixa") ||
    movement.includes("puxar vertical")
  )
    return "vertical_pull";
  if (record.category === "biceps_antebraco" || name.includes("rosca") || name.includes("curl"))
    return "biceps_curl";
  if (record.category === "triceps") return "triceps_extension";
  if (
    name.includes("face pull") ||
    name.includes("posterior") ||
    name.includes("crucifixo invertido") ||
    name.includes("encolhimento")
  )
    return "scapula_rear_delt";
  if (
    name.includes("supino") ||
    name.includes("chest press") ||
    name.includes("flexao") ||
    movement.includes("empurrar horizontal")
  )
    return "horizontal_press";
  if (name.includes("desenvolvimento") || movement.includes("empurrar vertical"))
    return "vertical_press";
  if (name.includes("crucifixo") || name.includes("crossover") || name.includes("fly"))
    return "fly";
  if (name.includes("agach") || name.includes("leg press") || name.includes("extensora"))
    return "squat_knee";
  if (
    name.includes("stiff") ||
    name.includes("terra") ||
    name.includes("flexora") ||
    movement.includes("hip hinge")
  )
    return "hinge_posterior";
  if (name.includes("hip thrust") || name.includes("ponte") || name.includes("abdutor"))
    return "glute_hip";
  if (record.category === "panturrilha") return "calf";
  if (record.category === "abdomen_core") return "core";
  return record.category;
}

function getMovementBucketLimit(bucket: string) {
  if (bucket === "horizontal_pull") return 2;
  if (bucket === "vertical_pull") return 2;
  if (bucket === "biceps_curl") return 2;
  if (bucket === "triceps_extension") return 2;
  if (bucket === "horizontal_press") return 2;
  if (bucket === "vertical_press") return 2;
  if (bucket === "fly") return 1;
  if (bucket === "squat_knee") return 2;
  if (bucket === "hinge_posterior") return 2;
  if (bucket === "glute_hip") return 2;
  if (bucket === "core") return 2;
  return 3;
}

export function canAddExerciseToSelection(
  selected: ExerciseCatalogRecord[],
  candidate: ExerciseCatalogRecord,
  options: { relaxBucketLimit?: boolean } = {},
) {
  const candidateFamily = resolveExerciseFamily(candidate);
  if (selected.some((record) => resolveExerciseFamily(record) === candidateFamily)) return false;

  if (options.relaxBucketLimit) return true;

  const candidateBucket = resolveMovementBucket(candidate);
  const bucketCount = selected.filter(
    (record) => resolveMovementBucket(record) === candidateBucket,
  ).length;
  return bucketCount < getMovementBucketLimit(candidateBucket);
}

function scoreExerciseQuality(record: ExerciseCatalogRecord, profile: AthleteProfile) {
  let score = 0;
  const name = normalizeName(record.name.pt);
  const movement = normalizeName(getMovementPattern(record));

  if (record.status === "active") score += 100;
  if (record.gifSource === "official") score += 8;
  if (record.gifSource === "catalog") score += 2;

  if (
    [
      "agachamento",
      "supino",
      "remada",
      "puxada",
      "desenvolvimento",
      "stiff",
      "leg press",
      "elevacao",
      "triceps",
      "rosca",
      "panturrilha",
      "abdutor",
      "abdominal",
      "prancha",
    ].some((token) => name.includes(token))
  ) {
    score += 6;
  }

  if (
    ["coice", "agachado", "deitado unilateral", "com apoio", "improviso"].some((token) =>
      name.includes(token),
    )
  ) {
    score -= 8;
  }

  if (
    movement.includes("empurrar horizontal") ||
    movement.includes("puxar horizontal") ||
    movement.includes("puxar vertical") ||
    movement.includes("empurrar vertical") ||
    movement.includes("agach") ||
    movement.includes("hip hinge")
  ) {
    score += 4;
  }

  // Peso livre (barra/halteres) exige mais estabilização e recruta mais
  // musculatura acessória que máquina/cabo pro mesmo padrão de movimento —
  // mas só faz sentido priorizar isso pra quem já é avançado (pede mais
  // controle/técnica); iniciante/intermediário se beneficiam mais da
  // estabilidade guiada da máquina.
  if (profile.level === "avancado") {
    if (record.equipment === "barra") score += 5;
    else if (record.equipment === "halteres") score += 3;
  }

  return score;
}

function scoreGenderFit(record: ExerciseCatalogRecord, profile: AthleteProfile) {
  if (!profile.sex) return 0;
  const name = normalizeName(record.name.pt);
  const movement = normalizeName(getMovementPattern(record));

  if (profile.sex === "feminino") {
    let score = 0;
    // Glúteos/quadril — inclui exercícios pelo nome E pela biomecânica "hip thrust"
    if (["hip thrust", "abdutor", "ponte", "abdutora", "sumo"].some((t) => name.includes(t)))
      score += 14;
    if (record.category === "membros_inferiores_gluteos" && movement.includes("hip thrust"))
      score += 14;
    if (
      ["stiff", "passada", "afundo", "avanco", "agachamento bulgaro"].some((t) => name.includes(t))
    )
      score += 10;
    if (["extensora", "flexora", "cadeira"].some((t) => name.includes(t))) score += 6;
    if (["feminino"].some((t) => name.includes(t))) score += 8;
    if (["masculino"].some((t) => name.includes(t))) score -= 8;
    if (
      ["supino reto", "supino inclinado"].some((t) => name.includes(t)) &&
      record.category === "peitoral"
    )
      score -= 4;
    return score;
  }

  if (profile.sex === "masculino") {
    let score = 0;
    if (["masculino"].some((t) => name.includes(t))) score += 8;
    if (["feminino"].some((t) => name.includes(t))) score -= 8;
    if (
      [
        "supino",
        "agachamento",
        "barra fixa",
        "desenvolvimento",
        "levantamento",
        "stiff",
        "remada curvada",
      ].some((t) => name.includes(t))
    )
      score += 6;
    return score;
  }

  return 0;
}

function scoreTemplateFit(
  record: ExerciseCatalogRecord,
  template: WorkoutTemplate,
  profile: AthleteProfile,
) {
  let score = 0;
  const name = normalizeName(record.name.pt);
  const movement = normalizeName(getMovementPattern(record));
  const tName = template.name;

  if (tName.includes("Costas") && record.category === "costas_trapezio") score += 12;
  if (tName.includes("Peito") && record.category === "peitoral") score += 12;
  if (tName.includes("Tríceps") && record.category === "triceps") score += 10;
  if (tName.includes("Bíceps") && record.category === "biceps_antebraco") score += 10;
  if (tName.includes("Ombros") && record.category === "deltoides") score += 10;
  if (tName.includes("Ombro") && record.category === "deltoides") score += 10;
  if (tName.includes("Braços") && ["biceps_antebraco", "triceps"].includes(record.category))
    score += 12;
  if (
    (tName.includes("Pernas") ||
      tName.includes("Quadríceps") ||
      tName.includes("Posterior") ||
      tName.includes("Glúteos")) &&
    record.category === "membros_inferiores_gluteos"
  )
    score += 12;
  if (
    (tName.includes("Panturrilha") || tName.includes("Pernas")) &&
    record.category === "panturrilha"
  )
    score += 8;
  if ((tName.includes("Core") || tName.includes("Abdômen")) && record.category === "abdomen_core")
    score += 8;

  // Peito / Ombros — push days
  if (
    tName === "Peito" ||
    tName === "Ombros" ||
    tName.startsWith("Empurrar") ||
    tName.startsWith("Push") ||
    tName.includes(" Push") ||
    tName.startsWith("Upper A")
  ) {
    if (record.category === "peitoral" && movement.includes("empurrar horizontal")) score += 12;
    if (record.category === "deltoides" && movement.includes("empurrar vertical")) score += 10;
    if (record.category === "triceps") score += 8;
    if (record.category === "abdomen_core") score += 2;
  }

  // Costas / Bíceps — pull days
  if (
    tName === "Costas" ||
    tName === "Bíceps" ||
    tName.startsWith("Puxar") ||
    tName.startsWith("Pull") ||
    tName.includes(" Pull") ||
    tName.startsWith("Upper B")
  ) {
    if (
      record.category === "costas_trapezio" &&
      (movement.includes("puxar") || movement.includes("remada"))
    )
      score += 12;
    if (record.category === "biceps_antebraco") score += 8;
    if (record.category === "deltoides" && name.includes("posterior")) score += 6;
    if (record.category === "abdomen_core") score += 2;
  }

  // Superior A — Empurrar (upper/lower splits)
  if (tName === "Superior A — Empurrar" || tName === "Upper A — Empurrar") {
    if (record.category === "peitoral") score += 10;
    if (record.category === "costas_trapezio") score += 8;
    if (record.category === "deltoides") score += 6;
    if (record.category === "triceps") score += 6;
  }

  // Superior B — Puxar (upper/lower splits)
  if (tName === "Superior B — Puxar" || tName === "Upper B — Puxar") {
    if (record.category === "costas_trapezio") score += 12;
    if (record.category === "biceps_antebraco") score += 10;
    if (record.category === "peitoral") score += 6;
  }

  // Quadríceps / Posterior / Legs / Lower — membros inferiores
  if (
    tName === "Quadríceps" ||
    tName === "Posterior" ||
    tName.startsWith("Legs") ||
    tName.includes(" Legs") ||
    tName.startsWith("Lower")
  ) {
    if (record.category === "membros_inferiores_gluteos") score += 12;
    if (record.category === "panturrilha") score += 8;
    if (record.category === "abdomen_core") score += 3;
    if (
      [
        "agachamento",
        "leg press",
        "stiff",
        "extensora",
        "flexora",
        "panturrilha",
        "abdutor",
        "quadril",
        "hip thrust",
        "passada",
        "afundo",
      ].some((t) => name.includes(t))
    ) {
      score += 6;
    }
  }

  // Upper — Definição (female split)
  if (tName.startsWith("Upper")) {
    if (record.category === "costas_trapezio") score += 8;
    if (record.category === "peitoral") score += 8;
    if (record.category === "deltoides") score += 6;
    if (record.category === "triceps") score += 5;
    if (record.category === "biceps_antebraco") score += 5;
  }

  // Hybrid Performance
  if (
    tName === "Hybrid Performance" ||
    tName === "Functional Performance" ||
    tName.startsWith("Funcional")
  ) {
    if (
      [
        "costas_trapezio",
        "peitoral",
        "deltoides",
        "membros_inferiores_gluteos",
        "abdomen_core",
      ].includes(record.category)
    )
      score += 6;
    if (record.trainingType === "calistenia") score += 6;
    if (isFunctionalExerciseRecord(record)) score += 6;
    if (record.equipment === "peso_corporal") score += 5;
    if (["barra", "halteres", "banco", "maquina", "cabos"].includes(record.equipment)) score -= 10;
  }

  if (tName.startsWith("Calistenia")) {
    if (record.trainingType === "calistenia") score += 14;
    if (["peso_corporal", "barra_fixa", "paralelas", "parede", "trx"].includes(record.equipment))
      score += 8;
    if (record.equipment === "maquina" || record.equipment === "cabos") score -= 20;
    if (
      tName.includes("Skills") &&
      (movement.includes("controle") ||
        movement.includes("vertical") ||
        record.category === "abdomen_core")
    )
      score += 8;
    if (
      tName.includes("Full Body") &&
      ["membros_inferiores_gluteos", "costas_trapezio", "peitoral", "abdomen_core"].includes(
        record.category,
      )
    )
      score += 6;
  }

  // Full Body — favorece compostos
  if (tName.startsWith("Full Body")) {
    if (
      movement.includes("agach") ||
      movement.includes("hip hinge") ||
      movement.includes("empurrar") ||
      movement.includes("puxar")
    )
      score += 4;
  }

  // Bônus de ambiente
  if (
    profile.location === "casa" &&
    ["halteres", "peso_corporal", "barra", "elastico", "banco"].includes(record.equipment)
  ) {
    score += 5;
  }
  if (
    profile.location === "hibrido" &&
    (record.trainingType === "calistenia" ||
      ["halteres", "barra", "peso_corporal", "barra_fixa", "paralelas"].includes(record.equipment))
  ) {
    score += 4;
  }
  if (
    profile.goal === "performance" &&
    (record.trainingType === "calistenia" ||
      movement.includes("vertical") ||
      movement.includes("controle"))
  ) {
    score += 3;
  }

  return score;
}

// Mapeia os rótulos de "Onde quer focar?" do onboarding (nas 5 línguas do app)
// pra category do catálogo — usado só pra dar mais prioridade dentro dos slots
// que já existem em cada template, sem mudar a estrutura de categorias/slots.
const FOCUS_CATEGORY_MAP: {
  labels: string[];
  category: OfficialMuscleCategory;
  nameHints?: string[];
}[] = [
  { labels: ["peito", "chest", "pecho", "poitrine", "brust"], category: "peitoral" },
  { labels: ["costas", "back", "espalda", "dos", "rucken"], category: "costas_trapezio" },
  { labels: ["ombros", "shoulders", "hombros", "epaules", "schultern"], category: "deltoides" },
  { labels: ["biceps", "bizeps"], category: "biceps_antebraco" },
  { labels: ["triceps", "trizeps"], category: "triceps" },
  { labels: ["abdomen", "abs", "abdominaux", "bauch"], category: "abdomen_core" },
  {
    labels: ["gluteos", "glutes", "fessiers", "gesass"],
    category: "membros_inferiores_gluteos",
    nameHints: ["gluteo", "hip thrust", "ponte", "abdutor", "abdutora"],
  },
  {
    labels: ["quadriceps", "cuadriceps", "quads", "quadrizeps"],
    category: "membros_inferiores_gluteos",
    nameHints: ["agachamento", "leg press", "extensora", "avanco", "afundo", "passada", "bulgaro"],
  },
  {
    labels: ["posterior", "isquiotibiales", "hamstrings", "ischio jambiers", "beinbeuger"],
    category: "membros_inferiores_gluteos",
    nameHints: ["stiff", "terra", "flexora", "posterior", "isquiotib"],
  },
  { labels: ["panturrilha", "calves", "pantorrilla", "mollets", "waden"], category: "panturrilha" },
];

function scoreFocusFit(record: ExerciseCatalogRecord, profile: AthleteProfile) {
  if (!profile.preferredFocus.length) return 0;
  const focusNormalized = profile.preferredFocus.map((f) => normalizeName(f));
  const name = normalizeName(record.name.pt);
  let score = 0;

  for (const entry of FOCUS_CATEGORY_MAP) {
    if (record.category !== entry.category) continue;
    const matchesFocus = entry.labels.some((label) =>
      focusNormalized.includes(normalizeName(label)),
    );
    if (!matchesFocus) continue;
    if (!entry.nameHints) {
      score += 8;
    } else if (entry.nameHints.some((hint) => name.includes(hint))) {
      score += 8;
    }
  }

  return score;
}

// Sexo entra sempre como foco padrão (junto com o que a pessoa marcar
// explicitamente) — mulher prioriza inferiores/glúteos, homem prioriza
// superiores, refletindo a preferência mais comum de cada perfil.
const SEX_DEFAULT_FOCUS_CATEGORIES: Partial<Record<AthleteSex, OfficialMuscleCategory[]>> = {
  feminino: ["membros_inferiores_gluteos"],
  masculino: ["peitoral", "costas_trapezio", "deltoides"],
};

function getFocusCategories(profile: AthleteProfile): Set<OfficialMuscleCategory> {
  const categories = new Set<OfficialMuscleCategory>();

  if (profile.sex) {
    for (const category of SEX_DEFAULT_FOCUS_CATEGORIES[profile.sex] ?? []) {
      categories.add(category);
    }
  }

  if (profile.preferredFocus.length) {
    const focusNormalized = profile.preferredFocus.map((f) => normalizeName(f));
    for (const entry of FOCUS_CATEGORY_MAP) {
      if (entry.labels.some((label) => focusNormalized.includes(normalizeName(label)))) {
        categories.add(entry.category);
      }
    }
  }

  return categories;
}

// Dá mais espaço no treino pros grupos marcados como foco no onboarding — tira
// 1 slot de cada categoria fora do foco (nunca zera, o grupo continua no
// treino) e distribui esses slots extras entre as categorias de foco. Se o
// template não tiver NENHUMA categoria de foco (ex: dia dedicado de Peito pra
// quem não marcou peito), não mexe em nada — evita esvaziar um split
// dedicado.
function applyFocusPriority(
  categories: WorkoutCategoryTemplate[],
  profile: AthleteProfile,
): WorkoutCategoryTemplate[] {
  const focusCategories = getFocusCategories(profile);
  if (focusCategories.size === 0) return categories;

  const matchesFocus = (rule: WorkoutCategoryTemplate) =>
    focusCategories.has(rule.primary) || (!!rule.secondary && focusCategories.has(rule.secondary));

  const matchingRules = categories.filter(matchesFocus);
  if (matchingRules.length === 0) return categories;

  const adjusted = categories.map((rule) => ({ ...rule }));
  let extraSlots = 0;
  for (const rule of adjusted) {
    if (!matchesFocus(rule) && rule.slots > 1) {
      rule.slots -= 1;
      extraSlots += 1;
    }
  }

  let cursor = 0;
  const matchingAdjusted = adjusted.filter(matchesFocus);
  while (extraSlots > 0 && matchingAdjusted.length > 0) {
    matchingAdjusted[cursor % matchingAdjusted.length].slots += 1;
    extraSlots -= 1;
    cursor += 1;
  }

  return adjusted;
}

function getBodyPriorityScore(record: ExerciseCatalogRecord, body: BodyTrainingContext) {
  const priorityIndex = body.muscularPriorities.indexOf(record.category);
  if (priorityIndex === -1) return 0;

  if (body.priorityLevel === "alta") return 5 - priorityIndex;
  if (body.priorityLevel === "media") return 3 - Math.min(priorityIndex, 2);
  return 1;
}

function downgradeIntensity(intensity: "leve" | "moderada" | "pesada") {
  if (intensity === "pesada") return "moderada" as const;
  if (intensity === "moderada") return "leve" as const;
  return intensity;
}

function resolveAdaptiveIntensity(
  intensity: "leve" | "moderada" | "pesada",
  nutrition: NutritionTrainingContext,
) {
  if (nutrition.readinessLevel === "alta") return intensity;
  if (nutrition.readinessLevel === "media") return intensity === "pesada" ? "moderada" : intensity;
  return downgradeIntensity(intensity);
}

function resolveAdaptiveDensity(
  density: "alta" | "moderada" | "controlada",
  nutrition: NutritionTrainingContext,
  body: BodyTrainingContext,
) {
  if (nutrition.needsRecoverySupport) return "controlada" as const;
  if (body.recompositionFocus && density === "controlada") return "moderada" as const;
  return density;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getUserSeed(profile?: AthleteProfile): number {
  if (typeof window === "undefined") return 54321;
  try {
    // Seed baseado no perfil do usuário — único por conta, não por dispositivo
    if (profile) {
      const regenerationSeed = localStorage.getItem("_zyrox_regen_seed") ?? "";
      const profileKey = `${profile.name}|${profile.goal}|${profile.level}|${profile.sex ?? ""}|${profile.location}`;
      return hashString(`${profileKey}|${regenerationSeed}`) % 999_983 || 12345;
    }
    let seed = localStorage.getItem("_zyrox_seed");
    if (!seed) {
      seed = String(Math.floor(Math.random() * 999_983));
      localStorage.setItem("_zyrox_seed", seed);
    }
    return parseInt(seed, 10);
  } catch {
    return 54321;
  }
}

function lcgRandom(seed: number): number {
  const s = (seed * 1664525 + 1013904223) & 0x7fffffff;
  return s;
}

function seededPick<T>(ranked: T[], count: number, seed: number): T[] {
  const poolSize = Math.min(ranked.length, Math.max(count + 2, Math.ceil(count * 1.7)));
  const pool = ranked.slice(0, poolSize);
  const result: T[] = [];
  const buf = [...pool];
  let s = seed;
  while (result.length < count && buf.length > 0) {
    s = lcgRandom(s);
    const idx = s % buf.length;
    result.push(buf.splice(idx, 1)[0]);
  }
  return result;
}

function pickDiverseRecords(
  candidates: ExerciseCatalogRecord[],
  count: number,
  seed: number,
  selected: ExerciseCatalogRecord[],
) {
  const picked: ExerciseCatalogRecord[] = [];
  const working = [...selected];
  const poolSize = Math.min(candidates.length, Math.max(count + 6, count * 4));
  const randomizedPool = seededPick(candidates.slice(0, poolSize), poolSize, seed);

  const tryPick = (relaxBucketLimit = false) => {
    for (const candidate of randomizedPool) {
      if (picked.length >= count) return;
      if (picked.some((item) => item.id === candidate.id)) continue;
      if (!canAddExerciseToSelection(working, candidate, { relaxBucketLimit })) continue;

      picked.push(candidate);
      working.push(candidate);
    }
  };

  tryPick(false);
  tryPick(true);

  for (const candidate of candidates) {
    if (picked.length >= count) break;
    if (picked.some((item) => item.id === candidate.id)) continue;
    if (working.some((item) => item.id === candidate.id)) continue;
    // Mesmo no fallback de último recurso (catálogo disponível muito curto), nunca
    // deixa duas variantes do mesmo exercício entrarem juntas (ex: "Pull Up" +
    // "Barra Fixa") — prefere um treino com menos exercícios a um com repetição.
    const candidateFamily = resolveExerciseFamily(candidate);
    if (working.some((item) => resolveExerciseFamily(item) === candidateFamily)) continue;

    picked.push(candidate);
    working.push(candidate);
  }

  return picked;
}

function selectExercisesForTemplate(
  template: WorkoutTemplate,
  catalog: ExerciseCatalogRecord[],
  profile: AthleteProfile,
  environment: EnvironmentContext,
  body: BodyTrainingContext,
  templateIndex: number = 0,
) {
  const selected: ExerciseCatalogRecord[] = [];
  const categoryRules = applyFocusPriority(template.categories, profile);
  const allowedCategories = new Set(
    categoryRules.flatMap((rule) => (rule.secondary ? [rule.primary, rule.secondary] : [rule.primary])),
  );
  const available = catalog
    .filter((record) => record.status === "active")
    .filter((record) => supportsProfileEquipment(record, profile))
    .filter((record) => supportsEnvironment(record, environment))
    .filter((record) => supportsTrainingType(record, profile, environment))
    .filter((record) => supportsProfileLevel(record, profile));

  const rankRecords = (records: ExerciseCatalogRecord[]) =>
    [...records].sort(
      (left, right) =>
        scoreExerciseQuality(right, profile) +
        scoreTemplateFit(right, template, profile) +
        scoreEnvironmentFit(right, environment) +
        getBodyPriorityScore(right, body) +
        scoreGenderFit(right, profile) +
        scoreFocusFit(right, profile) -
        (scoreExerciseQuality(left, profile) +
          scoreTemplateFit(left, template, profile) +
          scoreEnvironmentFit(left, environment) +
          getBodyPriorityScore(left, body) +
          scoreGenderFit(left, profile) +
          scoreFocusFit(left, profile)),
    );

  const weekOfYear = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const userSeed = getUserSeed(profile);
  let slotSeed = userSeed ^ (weekOfYear * 0x9e3779b9) ^ (templateIndex * 0x517cc1b7);

  for (const categoryRule of categoryRules) {
    const candidates = rankRecords(
      available.filter(
        (record) =>
          !selected.some((item) => item.id === record.id) &&
          (record.category === categoryRule.primary ||
            (categoryRule.secondary ? record.category === categoryRule.secondary : false)),
      ),
    );

    selected.push(...pickDiverseRecords(candidates, categoryRule.slots, slotSeed, selected));
    slotSeed = lcgRandom(slotSeed);
  }

  if (selected.length < EXERCISES_PER_WORKOUT) {
    const fallback = rankRecords(
      available.filter(
        (record) =>
          !selected.some((item) => item.id === record.id) && allowedCategories.has(record.category),
      ),
    );
    selected.push(
      ...pickDiverseRecords(fallback, EXERCISES_PER_WORKOUT - selected.length, slotSeed, selected),
    );
  }

  return selected.slice(0, EXERCISES_PER_WORKOUT);
}

export type AICandidateExercise = {
  id: string;
  name: string;
  category: string;
  equipment: string;
  gifUrl: string | null;
};

export type AIWorkoutCandidate = {
  workoutId: string;
  workoutName: string;
  workoutFocus: string;
  exercises: AICandidateExercise[];
};

export function buildAIWorkoutCandidates(
  profile: AthleteProfile,
  environment: EnvironmentContext,
  body: BodyTrainingContext,
  templates: WorkoutTemplate[],
  catalog: ExerciseCatalogRecord[],
): AIWorkoutCandidate[] {
  const available = catalog
    .filter((r) => r.status === "active")
    .filter((r) => supportsProfileEquipment(r, profile))
    .filter((r) => supportsEnvironment(r, environment))
    .filter((r) => supportsTrainingType(r, profile, environment))
    .filter((r) => supportsProfileLevel(r, profile));

  return templates.map((template, index) => {
    const seen = new Set<string>();
    const candidates: AICandidateExercise[] = [];

    for (const categoryRule of template.categories) {
      const pool = [...available]
        .filter((r) => r.category === categoryRule.primary || r.category === categoryRule.secondary)
        .sort(
          (a, b) =>
            scoreExerciseQuality(b, profile) +
            scoreTemplateFit(b, template, profile) +
            getBodyPriorityScore(b, body) +
            scoreGenderFit(b, profile) -
            (scoreExerciseQuality(a, profile) +
              scoreTemplateFit(a, template, profile) +
              getBodyPriorityScore(a, body) +
              scoreGenderFit(a, profile)),
        )
        .slice(0, (categoryRule.slots + 2) * 2);

      for (const r of pool) {
        if (!seen.has(r.id)) {
          seen.add(r.id);
          candidates.push({
            id: r.id,
            name: r.name.pt,
            category: r.category,
            equipment: r.equipment,
            gifUrl: r.gifPath,
          });
        }
      }
    }

    return {
      workoutId: `${resolveTrainingSplit(profile)}-${index + 1}`,
      workoutName: template.name,
      workoutFocus: template.categories.map((c) => c.primary).join(", "),
      exercises: candidates,
    };
  });
}

function buildWorkoutExercises(
  selected: ExerciseCatalogRecord[],
  intensity: "leve" | "moderada" | "pesada",
  density: "alta" | "moderada" | "controlada",
  isResistanceFocus = false,
): WorkoutExercise[] {
  return selected.map((record, index) => ({
    exerciseId: record.id,
    sets: resolveSetScheme(record.category, intensity, density, isResistanceFocus),
    rest: resolveRestSeconds(record.category, intensity, isResistanceFocus),
    tag:
      index === EXERCISES_PER_WORKOUT - 1 && record.category === "abdomen_core"
        ? "Rest-Pause"
        : undefined,
  }));
}

function estimateWorkoutDuration(
  exercises: WorkoutExercise[],
  density: "alta" | "moderada" | "controlada",
  targetDuration: number,
) {
  const workMinutes = exercises.reduce((total, exercise) => total + exercise.sets.length * 2, 0);
  const restMinutes = exercises.reduce(
    (total, exercise) => total + (exercise.rest * exercise.sets.length) / 60,
    0,
  );
  const rawDuration = Math.round(workMinutes + restMinutes);

  if (density === "alta") return Math.min(targetDuration, Math.max(30, rawDuration - 8));
  if (density === "controlada") return Math.min(targetDuration, Math.max(35, rawDuration));
  return Math.min(targetDuration, Math.max(35, rawDuration - 3));
}

function mapIntensityLabel(
  intensity: "leve" | "moderada" | "pesada",
): "Leve" | "Moderado" | "Pesado" {
  if (intensity === "pesada") return "Pesado";
  if (intensity === "moderada") return "Moderado";
  return "Leve";
}

function applyMenstrualCycleIntensity(
  intensity: "leve" | "moderada" | "pesada",
  profile: AthleteProfile,
): "leve" | "moderada" | "pesada" {
  if (profile.sex !== "feminino" || !profile.trackCycle) return intensity;
  if (profile.menstrualCyclePhase === "menstrual") return "leve";
  if (profile.menstrualCyclePhase === "luteal")
    return intensity === "pesada" ? "moderada" : intensity;
  if (profile.menstrualCyclePhase === "ovulatory")
    return intensity === "leve" ? "moderada" : intensity;
  return intensity;
}

function applyMenstrualCycleDensity(
  density: "alta" | "moderada" | "controlada",
  profile: AthleteProfile,
): "alta" | "moderada" | "controlada" {
  if (profile.sex !== "feminino" || !profile.trackCycle) return density;
  if (profile.menstrualCyclePhase === "menstrual") return "controlada";
  if (profile.menstrualCyclePhase === "luteal") return density === "alta" ? "moderada" : density;
  return density;
}

function resolveWorkoutTypeLabel(profile: AthleteProfile): Workout["type"] {
  if (profile.trainingType === "calistenia") return "Calistenia";
  if (profile.trainingType === "funcional") return "Funcional";
  return "Musculação";
}

function applyStoredCustomizations(workouts: Workout[]) {
  if (typeof window === "undefined") return workouts;

  return workouts.map((workout) => {
    const customization = getWorkoutCustomization(workout.id);
    return customization ? applyWorkoutCustomization(workout, customization) : workout;
  });
}

export function buildGeneratedTrainingState(
  profile: AthleteProfile,
  catalog: ExerciseCatalogRecord[] = buildExerciseCatalog(),
  environment?: EnvironmentContext,
  options: GeneratedTrainingOptions = {},
): GeneratedTrainingState {
  const templates = resolveWorkoutTemplates(profile);
  const body = buildBodyTrainingContext();
  const nutrition = buildNutritionTrainingContext();
  const resolvedEnvironment = environment ?? buildEnvironmentContextFromOnboarding(profile, {});
  const locale = getStoredLocale();
  const periodization = buildPeriodizationBlock(
    profile,
    body,
    nutrition,
    resolvedEnvironment,
    locale,
  );
  const intensity = applyMenstrualCycleIntensity(
    resolveAdaptiveIntensity(
      resolveWorkoutIntensity(profile.level, profile.consistency, profile.goal, profile.age),
      nutrition,
    ),
    profile,
  );
  const density = applyMenstrualCycleDensity(
    resolveAdaptiveDensity(resolveWorkoutDensity(profile), nutrition, body),
    profile,
  );

  const workouts = templates.map((template, index) => {
    const selected = selectExercisesForTemplate(
      template,
      catalog,
      profile,
      resolvedEnvironment,
      body,
      index,
    );
    const exercises = buildWorkoutExercises(
      selected,
      intensity,
      density,
      profile.goal === "resistencia",
    );

    return {
      id: `${resolveTrainingSplit(profile)}-${index + 1}`,
      name: resolveWorkoutName(template, profile, index, locale),
      focus: resolveFocus(template, locale),
      duration: estimateWorkoutDuration(exercises, density, profile.workoutDurationMin),
      type: resolveWorkoutTypeLabel(profile),
      exercises,
    } satisfies Workout;
  });
  const resolvedWorkouts =
    options.applyCustomizations === false ? workouts : applyStoredCustomizations(workouts);

  const baseDays =
    profile.availableDays.length > 0 ? profile.availableDays : [...DEFAULT_WEEK_DAYS];
  // Se o split gerou mais treinos do que dias selecionados, expande para cobrir todos
  const trainingDays =
    baseDays.length >= resolvedWorkouts.length
      ? baseDays
      : Array.from({ length: resolvedWorkouts.length }, (_, i) => i % 7);
  const schedule: GeneratedWeekPlanEntry[] = Array.from({ length: 7 }).map((_, dayIndex) => {
    const trainingIndex = trainingDays.indexOf(dayIndex);

    if (trainingIndex === -1) {
      return { dayIndex, workoutId: null, intensity: null, tag: null };
    }

    const workout = resolvedWorkouts[trainingIndex % resolvedWorkouts.length];
    return {
      dayIndex,
      workoutId: workout?.id ?? null,
      intensity: mapIntensityLabel(intensity),
      tag: capitalize(resolveWorkoutTag(profile)),
    };
  });

  return {
    profile,
    environment: resolvedEnvironment,
    body,
    nutrition,
    periodization,
    workouts: resolvedWorkouts,
    schedule,
  };
}

export function getCurrentTrainingState(options: GeneratedTrainingOptions = {}) {
  const onboarding = loadOnboarding();
  const profile = buildAthleteProfile(onboarding);
  const environment = buildEnvironmentContextFromOnboarding(profile, onboarding);
  return buildGeneratedTrainingState(profile, buildExerciseCatalog(), environment, options);
}

export function getGeneratedWorkouts(options: GeneratedTrainingOptions = {}) {
  return getCurrentTrainingState(options).workouts;
}

export function getGeneratedWorkout(id: string, options: GeneratedTrainingOptions = {}) {
  return getGeneratedWorkouts(options).find((workout) => workout.id === id) ?? null;
}

export function getGeneratedExercise(exerciseId: string) {
  return getExercise(exerciseId);
}
