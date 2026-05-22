import { type Macro, type Meal } from "@/data/nutrition";
import { type FoodScan } from "@/data/scans";
import { type AthleteProfile } from "@/domain/athlete/profile";

export type NutritionSnapshot = {
  kcal: Macro;
  macros: {
    protein: Macro;
    fat: Macro;
    carbs: Macro;
  };
  meals: Meal[];
};

export type NutritionInsight = {
  id: string;
  title: string;
  desc: string;
  tone: "alerta" | "equilibrio" | "performance";
};

export type NutritionEvaluation = {
  balanceLabel: string;
  primaryMessage: string;
  insights: NutritionInsight[];
  latestFoodScan: FoodScan | null;
};

type Locale = "pt" | "es" | "en" | "fr" | "de";

const GOAL_LABELS: Record<string, Record<Locale, string>> = {
  ganho_massa: { pt: "ganho de massa",    es: "ganancia muscular", en: "muscle gain",    fr: "prise de masse",    de: "Muskelaufbau"    },
  perda_peso:  { pt: "perda de peso",     es: "pérdida de peso",   en: "weight loss",    fr: "perte de poids",    de: "Gewichtsverlust" },
  definicao:   { pt: "definição",         es: "definición",        en: "definition",     fr: "définition",        de: "Definition"      },
  forca:       { pt: "força",             es: "fuerza",            en: "strength",       fr: "force",             de: "Kraft"           },
  performance: { pt: "performance",       es: "rendimiento",       en: "performance",    fr: "performance",       de: "Leistung"        },
  saude:       { pt: "saúde",             es: "salud",             en: "health",         fr: "santé",             de: "Gesundheit"      },
};

function getGoalLabel(profile: AthleteProfile, locale: Locale): string {
  return GOAL_LABELS[profile.goal ?? "saude"]?.[locale] ?? profile.goal ?? "saúde";
}

function getRemainingPercent(macro: Macro) {
  if (macro.goal <= 0) return 0;
  return Math.max(0, 100 - Math.round((macro.eaten / macro.goal) * 100));
}

type MsgFn = (pct: number, goal: string) => string;
type MsgSet = { proteinLow: MsgFn; kcalOpen: MsgFn; balanced: MsgFn; balanceLow: string; balanceOpen: string; balanceGood: string; hydrationTitle: string; hydrationOutdoor: string; hydrationIndoor: string; proteinTitle: string; proteinLowDesc: (g: number) => string; proteinOkDesc: string; scanTitle: string; scanDesc: (meal: string, kcal: number, protein: number, conf: number) => string; noScanDesc: string };

const MSGS: Record<Locale, MsgSet> = {
  pt: {
    proteinLow:     (pct, goal) => `Você ainda está ${pct}% abaixo da meta de proteína para ${goal}.`,
    kcalOpen:       (_, goal)   => `Seu plano ainda tem espaço calórico para fechar o dia alinhado com ${goal}.`,
    balanced:       (_, goal)   => `Sua alimentação de hoje está mais alinhada com o objetivo de ${goal}.`,
    balanceLow: "proteína baixa", balanceOpen: "janela aberta", balanceGood: "equilíbrio bom",
    hydrationTitle: "Hidratação",
    hydrationOutdoor: "Treino em ambiente externo pede mais água ao longo do dia e reposição antes do treino.",
    hydrationIndoor: "Distribua água ao longo do dia e concentre 2 copos nas horas antes do treino.",
    proteinTitle: "Proteína do dia",
    proteinLowDesc: (g) => `Faltam cerca de ${g}g de proteína. Uma refeição com carne magra, ovos ou whey ajuda a fechar o alvo.`,
    proteinOkDesc: "A meta de proteína está mais bem distribuída hoje. Mantenha o jantar consistente.",
    scanTitle: "Leitura da última refeição",
    scanDesc: (meal, kcal, protein, conf) => `O último scan da refeição ${meal} marcou ${kcal} kcal, ${protein}g de proteína e ${conf}% de confiança.`,
    noScanDesc: "Ainda não existe scan alimentar salvo para validar o prato de hoje.",
  },
  es: {
    proteinLow:     (pct, goal) => `Todavía estás un ${pct}% por debajo del objetivo de proteínas para ${goal}.`,
    kcalOpen:       (_, goal)   => `Tu plan aún tiene espacio calórico para terminar el día alineado con ${goal}.`,
    balanced:       (_, goal)   => `Tu alimentación de hoy está más alineada con el objetivo de ${goal}.`,
    balanceLow: "proteína baja", balanceOpen: "ventana abierta", balanceGood: "buen equilibrio",
    hydrationTitle: "Hidratación",
    hydrationOutdoor: "El entrenamiento al aire libre requiere más agua durante el día y reposición antes del entrenamiento.",
    hydrationIndoor: "Distribuye el agua a lo largo del día y toma 2 vasos antes del entrenamiento.",
    proteinTitle: "Proteína del día",
    proteinLowDesc: (g) => `Faltan unos ${g}g de proteína. Una comida con carne magra, huevos o whey ayuda a alcanzar el objetivo.`,
    proteinOkDesc: "El objetivo de proteínas está mejor distribuido hoy. Mantén la cena consistente.",
    scanTitle: "Lectura de la última comida",
    scanDesc: (meal, kcal, protein, conf) => `El último escaneo de la comida ${meal} registró ${kcal} kcal, ${protein}g de proteína y ${conf}% de confianza.`,
    noScanDesc: "Todavía no hay escaneo alimentario guardado para validar el plato de hoy.",
  },
  en: {
    proteinLow:     (pct, goal) => `You're still ${pct}% below your protein goal for ${goal}.`,
    kcalOpen:       (_, goal)   => `Your plan still has caloric room to finish the day aligned with ${goal}.`,
    balanced:       (_, goal)   => `Today's nutrition is better aligned with your ${goal} goal.`,
    balanceLow: "low protein", balanceOpen: "open window", balanceGood: "good balance",
    hydrationTitle: "Hydration",
    hydrationOutdoor: "Outdoor training calls for more water throughout the day and pre-workout hydration.",
    hydrationIndoor: "Spread water intake throughout the day and drink 2 glasses before your workout.",
    proteinTitle: "Daily protein",
    proteinLowDesc: (g) => `About ${g}g of protein still needed. A meal with lean meat, eggs, or whey will help close the gap.`,
    proteinOkDesc: "Your protein goal is better distributed today. Keep dinner consistent.",
    scanTitle: "Latest meal scan",
    scanDesc: (meal, kcal, protein, conf) => `Last ${meal} scan logged ${kcal} kcal, ${protein}g protein, ${conf}% confidence.`,
    noScanDesc: "No food scan saved yet to validate today's meal.",
  },
  fr: {
    proteinLow:     (pct, goal) => `Vous êtes encore à ${pct}% en dessous de votre objectif protéines pour ${goal}.`,
    kcalOpen:       (_, goal)   => `Votre plan a encore de la marge calorique pour finir la journée en accord avec ${goal}.`,
    balanced:       (_, goal)   => `Votre alimentation d'aujourd'hui est mieux alignée avec l'objectif ${goal}.`,
    balanceLow: "protéines basses", balanceOpen: "fenêtre ouverte", balanceGood: "bon équilibre",
    hydrationTitle: "Hydratation",
    hydrationOutdoor: "L'entraînement en extérieur nécessite plus d'eau tout au long de la journée et une réhydratation avant l'entraînement.",
    hydrationIndoor: "Répartissez l'eau tout au long de la journée et buvez 2 verres avant l'entraînement.",
    proteinTitle: "Protéines du jour",
    proteinLowDesc: (g) => `Il manque environ ${g}g de protéines. Un repas avec de la viande maigre, des œufs ou du whey aidera à atteindre l'objectif.`,
    proteinOkDesc: "L'objectif de protéines est mieux réparti aujourd'hui. Maintenez le dîner constant.",
    scanTitle: "Lecture du dernier repas",
    scanDesc: (meal, kcal, protein, conf) => `Le dernier scan du repas ${meal} a enregistré ${kcal} kcal, ${protein}g de protéines et ${conf}% de confiance.`,
    noScanDesc: "Aucun scan alimentaire enregistré pour valider le repas d'aujourd'hui.",
  },
  de: {
    proteinLow:     (pct, goal) => `Du liegst noch ${pct}% unter dem Proteinziel für ${goal}.`,
    kcalOpen:       (_, goal)   => `Dein Plan hat noch Spielraum für Kalorien, um den Tag passend zu ${goal} abzuschließen.`,
    balanced:       (_, goal)   => `Deine heutige Ernährung ist besser auf das Ziel ${goal} ausgerichtet.`,
    balanceLow: "niedriges Protein", balanceOpen: "offenes Fenster", balanceGood: "gutes Gleichgewicht",
    hydrationTitle: "Hydration",
    hydrationOutdoor: "Outdoor-Training erfordert mehr Wasser über den Tag und Flüssigkeitszufuhr vor dem Training.",
    hydrationIndoor: "Verteile die Wasseraufnahme über den Tag und trinke 2 Gläser vor dem Training.",
    proteinTitle: "Tagesprotein",
    proteinLowDesc: (g) => `Noch ca. ${g}g Protein fehlen. Eine Mahlzeit mit magerem Fleisch, Eiern oder Whey hilft, das Ziel zu erreichen.`,
    proteinOkDesc: "Das Proteinziel ist heute besser verteilt. Halte das Abendessen konsistent.",
    scanTitle: "Letzter Mahlzeiten-Scan",
    scanDesc: (meal, kcal, protein, conf) => `Der letzte Scan der Mahlzeit ${meal} erfasste ${kcal} kcal, ${protein}g Protein und ${conf}% Konfidenz.`,
    noScanDesc: "Noch kein Scan gespeichert, um die heutige Mahlzeit zu validieren.",
  },
};

export function evaluateNutritionState(
  profile: AthleteProfile,
  snapshot: NutritionSnapshot,
  foodScans: FoodScan[],
  locale: string = "pt",
): NutritionEvaluation {
  const loc = (["pt", "es", "en", "fr", "de"].includes(locale) ? locale : "pt") as Locale;
  const m = MSGS[loc];

  const proteinGap = snapshot.macros.protein.goal - snapshot.macros.protein.eaten;
  const kcalGap = snapshot.kcal.goal - snapshot.kcal.eaten;
  const latestFoodScan = foodScans[0] ?? null;
  const goalLabel = getGoalLabel(profile, loc);
  const proteinRemainingPct = getRemainingPercent(snapshot.macros.protein);

  const primaryMessage =
    proteinGap > 35
      ? m.proteinLow(proteinRemainingPct, goalLabel)
      : kcalGap > 250
        ? m.kcalOpen(0, goalLabel)
        : m.balanced(0, goalLabel);

  const balanceLabel =
    proteinGap > 35 ? m.balanceLow : kcalGap > 250 ? m.balanceOpen : m.balanceGood;

  const insights: NutritionInsight[] = [
    {
      id: "hidratacao",
      title: m.hydrationTitle,
      desc: profile.location === "outdoor" ? m.hydrationOutdoor : m.hydrationIndoor,
      tone: "equilibrio",
    },
    {
      id: "proteina",
      title: m.proteinTitle,
      desc: proteinGap > 35
        ? m.proteinLowDesc(Math.max(0, Math.round(proteinGap)))
        : m.proteinOkDesc,
      tone: proteinGap > 35 ? "alerta" : "equilibrio",
    },
    {
      id: "scan_refeicao",
      title: m.scanTitle,
      desc: latestFoodScan
        ? m.scanDesc(latestFoodScan.refeicao.toLowerCase(), latestFoodScan.estimativas.kcal, latestFoodScan.estimativas.proteinaG, latestFoodScan.qualidade.confiancaLeitura)
        : m.noScanDesc,
      tone: "performance",
    },
  ];

  return { balanceLabel, primaryMessage, insights, latestFoodScan };
}
