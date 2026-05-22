import { type AthleteProfile } from "@/domain/athlete/profile";
import { type BodyTrainingContext } from "@/domain/body/state";
import { type EnvironmentContext } from "@/domain/environment/context";
import { type NutritionTrainingContext } from "@/domain/nutrition/state";

export type TrainingModality = "musculacao" | "funcional" | "calistenia";
export type CyclePhase = "base" | "progressao" | "intensificacao" | "deload";

export type PeriodizationWeek = {
  week: number;
  phase: CyclePhase;
  emphasis: string;
  volumeBias: "baixo" | "moderado" | "alto";
  intensityBias: "leve" | "moderada" | "pesada";
};

export type SexSpecificAdjustment = {
  recoveryBias: string;
  hormonalContext: string;
  metabolicContext: string;
  splitBias: string;
};

export type TwelveWeekBlock = {
  modality: TrainingModality;
  goal: string;
  currentWeek: number;
  weeks: PeriodizationWeek[];
  summary: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  adjustments: SexSpecificAdjustment;
};

const emphasisCopy = {
  pt: {
    base: { calistenia: "técnica, controle corporal e volume base", hibrido: "fundação de força e skill", default: "volume base e execução limpa" },
    progressao: { forca: "sobrecarga progressiva nos movimentos principais", ganho_massa: "crescimento de volume e tensão mecânica", default: "construção de capacidade e aderência" },
    intensificacao: { calistenia: "alavancas mais difíceis e consolidação de skill", hibrido: "transferência entre carga externa e domínio corporal", default: "mais carga, menos dispersão e foco nos compostos" },
    deload: "redução de fadiga, consolidação técnica e transição do bloco",
  },
  es: {
    base: { calistenia: "técnica, control corporal y volumen base", hibrido: "fundamento de fuerza y skill", default: "volumen base y ejecución limpia" },
    progressao: { forca: "sobrecarga progresiva en movimientos principales", ganho_massa: "crecimiento de volumen y tensión mecánica", default: "construcción de capacidad y adherencia" },
    intensificacao: { calistenia: "palancas más difíciles y consolidación de skill", hibrido: "transferencia entre carga externa y dominio corporal", default: "más carga, menos dispersión y foco en compuestos" },
    deload: "reducción de fatiga, consolidación técnica y transición del bloque",
  },
  en: {
    base: { calistenia: "technique, body control and base volume", hibrido: "strength foundation and skill", default: "base volume and clean execution" },
    progressao: { forca: "progressive overload on main movements", ganho_massa: "volume growth and mechanical tension", default: "capacity building and adherence" },
    intensificacao: { calistenia: "harder levers and skill consolidation", hibrido: "transfer between external load and body control", default: "more load, less dispersion and focus on compounds" },
    deload: "fatigue reduction, technical consolidation and block transition",
  },
  fr: {
    base: { calistenia: "technique, contrôle corporel et volume de base", hibrido: "fondation de force et skill", default: "volume de base et exécution propre" },
    progressao: { forca: "surcharge progressive sur les mouvements principaux", ganho_massa: "croissance du volume et tension mécanique", default: "construction de capacité et adhérence" },
    intensificacao: { calistenia: "leviers plus difficiles et consolidation du skill", hibrido: "transfert entre charge externe et maîtrise corporelle", default: "plus de charge, moins de dispersion et focus sur les composés" },
    deload: "réduction de la fatigue, consolidation technique et transition de bloc",
  },
  de: {
    base: { calistenia: "Technik, Körperkontrolle und Basisvolumen", hibrido: "Kraftfundament und Skill", default: "Basisvolumen und saubere Ausführung" },
    progressao: { forca: "progressive Überlastung bei Hauptbewegungen", ganho_massa: "Volumenwachstum und mechanische Spannung", default: "Kapazitätsaufbau und Kontinuität" },
    intensificacao: { calistenia: "schwierigere Hebel und Skill-Konsolidierung", hibrido: "Übertragung zwischen externer Last und Körperkontrolle", default: "mehr Last, weniger Streuung und Fokus auf Grundübungen" },
    deload: "Müdigkeitsreduktion, technische Konsolidierung und Blockwechsel",
  },
} as const;

type EmphasisLang = keyof typeof emphasisCopy;

const summaryCopy = {
  pt: {
    short: (w: number, g: string, m: string) => `Semana ${w} do bloco de 12 semanas com foco em ${g} dentro da modalidade ${m}.`,
    medium: "O trimestre alterna base, progressão, intensificação e deload para evitar platô e manter recorrência.",
    long: "A jornada anual usa quatro blocos de 12 semanas para sustentar curto, médio e longo prazo com fundamento profissional.",
  },
  es: {
    short: (w: number, g: string, m: string) => `Semana ${w} del bloque de 12 semanas con foco en ${g} dentro de la modalidad ${m}.`,
    medium: "El trimestre alterna base, progresión, intensificación y descarga para evitar estancamiento y mantener recurrencia.",
    long: "La jornada anual usa cuatro bloques de 12 semanas para sostener corto, medio y largo plazo con fundamento profesional.",
  },
  en: {
    short: (w: number, g: string, m: string) => `Week ${w} of the 12-week block focused on ${g} within the ${m} modality.`,
    medium: "The quarter alternates base, progression, intensification and deload to avoid plateaus and maintain consistency.",
    long: "The annual path uses four 12-week blocks to support short-, mid-, and long-term progress with a professional foundation.",
  },
  fr: {
    short: (w: number, g: string, m: string) => `Semaine ${w} du bloc de 12 semaines axée sur ${g} dans la modalité ${m}.`,
    medium: "Le trimestre alterne base, progression, intensification et deload pour éviter les plateaux et maintenir la régularité.",
    long: "Le parcours annuel utilise quatre blocs de 12 semaines pour soutenir le court, moyen et long terme avec une base professionnelle.",
  },
  de: {
    short: (w: number, g: string, m: string) => `Woche ${w} des 12-Wochen-Blocks mit Fokus auf ${g} innerhalb der ${m}-Modalität.`,
    medium: "Das Quartal wechselt zwischen Basis, Progression, Intensivierung und Deload, um Plateaus zu vermeiden und Konstanz zu halten.",
    long: "Der Jahresverlauf nutzt vier 12-Wochen-Blöcke, um kurz-, mittel- und langfristigen Fortschritt mit professioneller Grundlage zu sichern.",
  },
} as const;

type SummaryLang = keyof typeof summaryCopy;

const goalLabels: Record<string, Record<SummaryLang, string>> = {
  ganho_massa: { pt: "ganho de massa", es: "ganancia de masa", en: "muscle gain", fr: "prise de masse", de: "Muskelaufbau" },
  perda_peso:  { pt: "perda de peso",  es: "pérdida de peso", en: "weight loss",  fr: "perte de poids",  de: "Gewichtsabnahme" },
  definicao:   { pt: "definição",      es: "definición",      en: "definition",   fr: "définition",      de: "Definition" },
  forca:       { pt: "força",          es: "fuerza",          en: "strength",     fr: "force",           de: "Kraft" },
  performance: { pt: "performance",    es: "rendimiento",     en: "performance",  fr: "performance",     de: "Leistung" },
  saude:       { pt: "saúde",          es: "salud",           en: "health",       fr: "santé",           de: "Gesundheit" },
};

const modalityLabels: Record<TrainingModality, Record<SummaryLang, string>> = {
  musculacao: { pt: "musculação",     es: "musculación",   en: "strength training", fr: "musculation",  de: "Krafttraining" },
  funcional:  { pt: "funcional",      es: "funcional",     en: "functional",        fr: "fonctionnel",  de: "funktionelles Training" },
  calistenia: { pt: "calistenia",     es: "calistenia",    en: "calisthenics",      fr: "calisthénie",  de: "Calisthenics" },
};

const adjustmentsCopy = {
  pt: {
    recovery: { femaleRecomp: "volume distribuído com recuperação mais protegida", femaleDefault: "frequência consistente com margem boa de recuperação", maleRecovery: "intensidade preservada com volume mais controlado", maleDefault: "janela maior para intensificação progressiva quando a base nutricional sustenta.", neutral: "recuperação ajustada pelo estado corporal e nutricional atual." },
    split: { femaleMassDef: "prioridade de inferiores e glúteos quando o objetivo pedir.", femaleDefault: "divisão equilibrada sem perder o foco principal.", maleMassStrength: "mais espaço para peitoral, costas e ombros quando o objetivo justificar.", maleDefault: "divisão equilibrada com foco no objetivo real.", neutral: "o split respeita objetivo, modalidade e contexto do atleta." },
    hormonal: { female: "ajustes finos de densidade e fadiga devem respeitar flutuações hormonais e resposta individual.", male: "blocos de carga podem ser mais agressivos, mas ainda dependem de sono, nutrição e fadiga acumulada.", neutral: "ajustes hormonais dependem do perfil completo e da resposta individual." },
    metabolic: { femaleHigh: "foco em aderência metabólica, densidade moderada e consistência.", femaleLow: "boa tolerância para frequência e bloco estético quando a recuperação acompanha.", maleHigh: "metabolismo pede melhor controle de densidade, energia e aderência.", maleLow: "contexto metabólico favorece ciclos de hipertrofia ou força com boa resposta.", neutral: "o metabolismo do bloco é calibrado por composição corporal, nutrição e aderência." },
  },
  es: {
    recovery: { femaleRecomp: "volumen distribuido con recuperación más protegida", femaleDefault: "frecuencia consistente con buena margen de recuperación", maleRecovery: "intensidad preservada con volumen más controlado", maleDefault: "mayor margen para intensificación progresiva cuando la base nutricional lo sostiene.", neutral: "recuperación ajustada por el estado corporal y nutricional actual." },
    split: { femaleMassDef: "prioridad de piernas y glúteos cuando el objetivo lo requiera.", femaleDefault: "división equilibrada sin perder el enfoque principal.", maleMassStrength: "más espacio para pecho, espalda y hombros cuando el objetivo lo justifique.", maleDefault: "división equilibrada con enfoque en el objetivo real.", neutral: "el split respeta el objetivo, la modalidad y el contexto del atleta." },
    hormonal: { female: "los ajustes finos de densidad y fatiga deben respetar las fluctuaciones hormonales y la respuesta individual.", male: "los bloques de carga pueden ser más agresivos, pero aún dependen del sueño, la nutrición y la fatiga acumulada.", neutral: "los ajustes hormonales dependen del perfil completo y de la respuesta individual." },
    metabolic: { femaleHigh: "foco en adherencia metabólica, densidad moderada y consistencia.", femaleLow: "buena tolerancia para frecuencia y bloque estético cuando la recuperación acompaña.", maleHigh: "el metabolismo pide mejor control de densidad, energía y adherencia.", maleLow: "el contexto metabólico favorece ciclos de hipertrofia o fuerza con buena respuesta.", neutral: "el metabolismo del bloque se calibra por composición corporal, nutrición y adherencia." },
  },
  en: {
    recovery: { femaleRecomp: "distributed volume with more protected recovery", femaleDefault: "consistent frequency with good recovery margin", maleRecovery: "intensity preserved with more controlled volume", maleDefault: "larger window for progressive intensification when nutritional base supports.", neutral: "recovery adjusted by current body and nutritional state." },
    split: { femaleMassDef: "priority of lower body and glutes when objective requires.", femaleDefault: "balanced split without losing main focus.", maleMassStrength: "more space for chest, back and shoulders when objective justifies.", maleDefault: "balanced split focused on real objective.", neutral: "the split respects goal, modality and athlete context." },
    hormonal: { female: "fine adjustments to density and fatigue should respect hormonal fluctuations and individual response.", male: "load blocks can be more aggressive, but still depend on sleep, nutrition and accumulated fatigue.", neutral: "hormonal adjustments depend on the full profile and individual response." },
    metabolic: { femaleHigh: "focus on metabolic adherence, moderate density and consistency.", femaleLow: "good tolerance for frequency and aesthetic block when recovery follows.", maleHigh: "metabolism requires better control of density, energy and adherence.", maleLow: "metabolic context supports hypertrophy or strength cycles with good response.", neutral: "block metabolism is calibrated by body composition, nutrition and adherence." },
  },
  fr: {
    recovery: { femaleRecomp: "volume distribué avec récupération plus protégée", femaleDefault: "fréquence cohérente avec une bonne marge de récupération", maleRecovery: "intensité préservée avec un volume plus contrôlé", maleDefault: "plus grande fenêtre pour l'intensification progressive quand la base nutritionnelle le permet.", neutral: "récupération ajustée par l'état corporel et nutritionnel actuel." },
    split: { femaleMassDef: "priorité aux membres inférieurs et fessiers selon l'objectif.", femaleDefault: "division équilibrée sans perdre le focus principal.", maleMassStrength: "plus de place pour pectoraux, dos et épaules si l'objectif le justifie.", maleDefault: "division équilibrée axée sur l'objectif réel.", neutral: "le split respecte l'objectif, la modalité et le contexte de l'athlète." },
    hormonal: { female: "les ajustements fins de densité et fatigue doivent respecter les fluctuations hormonales et la réponse individuelle.", male: "les blocs de charge peuvent être plus agressifs, mais dépendent toujours du sommeil, de la nutrition et de la fatigue accumulée.", neutral: "les ajustements hormonaux dépendent du profil complet et de la réponse individuelle." },
    metabolic: { femaleHigh: "focus sur l'adhérence métabolique, la densité modérée et la régularité.", femaleLow: "bonne tolérance pour la fréquence et le bloc esthétique quand la récupération suit.", maleHigh: "le métabolisme nécessite un meilleur contrôle de la densité, de l'énergie et de l'adhérence.", maleLow: "le contexte métabolique favorise les cycles d'hypertrophie ou de force avec une bonne réponse.", neutral: "le métabolisme du bloc est calibré par la composition corporelle, la nutrition et l'adhérence." },
  },
  de: {
    recovery: { femaleRecomp: "verteiltes Volumen mit besser geschützter Erholung", femaleDefault: "konsistente Frequenz mit gutem Erholungspuffer", maleRecovery: "Intensität erhalten mit kontrolliertierem Volumen", maleDefault: "größeres Fenster für progressive Intensivierung, wenn die Ernährungsbasis es trägt.", neutral: "Erholung angepasst an aktuellen Körper- und Ernährungszustand." },
    split: { femaleMassDef: "Priorität auf Unterkörper und Gesäß, wenn das Ziel es erfordert.", femaleDefault: "ausgewogene Aufteilung ohne den Hauptfokus zu verlieren.", maleMassStrength: "mehr Raum für Brust, Rücken und Schultern, wenn das Ziel es rechtfertigt.", maleDefault: "ausgewogene Aufteilung mit Fokus auf das tatsächliche Ziel.", neutral: "der Split berücksichtigt Ziel, Modalität und Athletenkontext." },
    hormonal: { female: "Feinabstimmungen bei Dichte und Müdigkeit sollten hormonelle Schwankungen und individuelle Reaktion berücksichtigen.", male: "Lastblöcke können aggressiver sein, hängen aber weiterhin von Schlaf, Ernährung und angesammelter Müdigkeit ab.", neutral: "Hormonelle Anpassungen hängen vom vollständigen Profil und der individuellen Reaktion ab." },
    metabolic: { femaleHigh: "Fokus auf metabolische Kontinuität, moderate Dichte und Konsistenz.", femaleLow: "gute Toleranz für Frequenz und ästhetischen Block, wenn die Erholung mithält.", maleHigh: "Metabolismus erfordert bessere Kontrolle von Dichte, Energie und Kontinuität.", maleLow: "Metabolischer Kontext begünstigt Hypertrophie- oder Kraftzyklen mit guter Reaktion.", neutral: "Block-Metabolismus wird durch Körperzusammensetzung, Ernährung und Kontinuität kalibriert." },
  },
} as const;

type AdjLang = keyof typeof adjustmentsCopy;

function resolveTrainingModality(
  profile: AthleteProfile,
  environment: EnvironmentContext,
): TrainingModality {
  if (profile.trainingType === "funcional") return "funcional";
  if (profile.trainingType === "calistenia") return "calistenia";
  if (environment.location === "outdoor") return "calistenia";
  return "musculacao";
}

function resolveCurrentWeek(profile: AthleteProfile) {
  if (!profile.onboardingCompletedAt) return 1;

  const start = new Date(profile.onboardingCompletedAt);
  if (Number.isNaN(start.getTime())) return 1;

  const diffMs = Date.now() - start.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, ((diffWeeks - 1) % 12) + 1);
}

function resolveWeekPhase(week: number): CyclePhase {
  if (week <= 4) return "base";
  if (week <= 8) return "progressao";
  if (week <= 11) return "intensificacao";
  return "deload";
}

function resolveWeekEmphasis(
  phase: CyclePhase,
  modality: TrainingModality,
  profile: AthleteProfile,
  locale: string,
) {
  const lang = (emphasisCopy[locale as EmphasisLang] ?? emphasisCopy.pt);

  if (phase === "deload") return lang.deload;

  if (phase === "base") {
    if (modality === "calistenia") return lang.base.calistenia;
    if (modality === "funcional") return lang.base.hibrido;
    return lang.base.default;
  }

  if (phase === "progressao") {
    if (profile.goal === "forca") return lang.progressao.forca;
    if (profile.goal === "ganho_massa") return lang.progressao.ganho_massa;
    return lang.progressao.default;
  }

  // intensificacao
  if (modality === "calistenia") return lang.intensificacao.calistenia;
  if (modality === "funcional") return lang.intensificacao.hibrido;
  return lang.intensificacao.default;
}

function resolveVolumeBias(phase: CyclePhase): PeriodizationWeek["volumeBias"] {
  if (phase === "base" || phase === "progressao") return "alto";
  if (phase === "intensificacao") return "moderado";
  return "baixo";
}

function resolveIntensityBias(phase: CyclePhase): PeriodizationWeek["intensityBias"] {
  if (phase === "base") return "leve";
  if (phase === "progressao") return "moderada";
  if (phase === "intensificacao") return "pesada";
  return "leve";
}

function applyMenstrualCycleVolume(
  volume: PeriodizationWeek["volumeBias"],
  profile: AthleteProfile,
): PeriodizationWeek["volumeBias"] {
  if (!profile.trackCycle || profile.sex !== "feminino") return volume;
  if (profile.menstrualCyclePhase === "menstrual") return "baixo";
  if (profile.menstrualCyclePhase === "luteal") return volume === "alto" ? "moderado" : volume;
  return volume;
}

function applyMenstrualCycleIntensity(
  intensity: PeriodizationWeek["intensityBias"],
  profile: AthleteProfile,
): PeriodizationWeek["intensityBias"] {
  if (!profile.trackCycle || profile.sex !== "feminino") return intensity;
  if (profile.menstrualCyclePhase === "menstrual") return "leve";
  if (profile.menstrualCyclePhase === "luteal") return intensity === "pesada" ? "moderada" : intensity;
  if (profile.menstrualCyclePhase === "ovulatory") return intensity === "leve" ? "moderada" : intensity;
  return intensity;
}

const cycleCopy: Record<AdjLang, { menstrual: string; follicular: string; ovulatory: string; luteal: string; default: string }> = {
  pt: { menstrual: "ciclo menstrual ativo: reduzir densidade, preservar técnica e proteger recuperação.", follicular: "fase folicular informada: boa janela para progressão técnica e aumento gradual de carga.", ovulatory: "fase ovulatória informada: janela favorável para performance, mantendo controle articular.", luteal: "fase lútea informada: controlar fadiga, volume e retenção, sem forçar picos de carga.", default: "ciclo menstrual ativado no onboarding: ajuste fino por fase quando informada." },
  es: { menstrual: "ciclo menstrual activo: reducir densidad, preservar técnica y proteger recuperación.", follicular: "fase folicular registrada: buena ventana para progresión técnica y aumento gradual de carga.", ovulatory: "fase ovulatoria registrada: ventana favorable para rendimiento, manteniendo control articular.", luteal: "fase lútea registrada: controlar fatiga, volumen y retención, sin forzar picos de carga.", default: "ciclo menstrual activado en el onboarding: ajuste fino por fase cuando se informe." },
  en: { menstrual: "active menstrual phase: reduce density, preserve technique and protect recovery.", follicular: "follicular phase logged: good window for technical progression and gradual load increase.", ovulatory: "ovulatory phase logged: favorable window for performance, maintaining joint control.", luteal: "luteal phase logged: manage fatigue, volume and retention without forcing load peaks.", default: "menstrual cycle tracking enabled: fine-tune per phase when logged." },
  fr: { menstrual: "phase menstruelle active : réduire la densité, préserver la technique et protéger la récupération.", follicular: "phase folliculaire enregistrée : bonne fenêtre pour la progression technique et l'augmentation graduelle de charge.", ovulatory: "phase ovulatoire enregistrée : fenêtre favorable pour la performance, en maintenant le contrôle articulaire.", luteal: "phase lutéale enregistrée : gérer la fatigue, le volume et la rétention sans forcer les pics de charge.", default: "suivi du cycle menstruel activé : ajustement fin par phase quand elle est renseignée." },
  de: { menstrual: "aktive Menstruationsphase: Dichte reduzieren, Technik bewahren und Erholung schützen.", follicular: "Follikelphase erfasst: gutes Fenster für technische Progression und graduellen Lastaufbau.", ovulatory: "Ovulationsphase erfasst: günstiges Fenster für Leistung bei Aufrechterhaltung der Gelenkkontrolle.", luteal: "Lutealphase erfasst: Müdigkeit, Volumen und Retention kontrollieren, ohne Lastspitzen zu erzwingen.", default: "Menstruationszyklus-Tracking aktiviert: Feinabstimmung pro Phase, wenn angegeben." },
};

function resolveCycleContext(profile: AthleteProfile, fallback: string, locale: string) {
  if (!profile.trackCycle || profile.sex !== "feminino") return fallback;

  const lang = (locale in cycleCopy ? locale : "pt") as AdjLang;
  const c = cycleCopy[lang];
  const phase = profile.menstrualCyclePhase;
  if (phase === "menstrual")  return c.menstrual;
  if (phase === "follicular") return c.follicular;
  if (phase === "ovulatory")  return c.ovulatory;
  if (phase === "luteal")     return c.luteal;
  return c.default;
}

function buildSexSpecificAdjustment(
  profile: AthleteProfile,
  body: BodyTrainingContext,
  nutrition: NutritionTrainingContext,
  locale: string,
): SexSpecificAdjustment {
  const t = adjustmentsCopy[locale as AdjLang] ?? adjustmentsCopy.pt;

  if (profile.sex === "feminino") {
    return {
      recoveryBias:
        body.recompositionFocus || nutrition.needsRecoverySupport
          ? t.recovery.femaleRecomp
          : t.recovery.femaleDefault,
      hormonalContext: resolveCycleContext(profile, t.hormonal.female, locale),
      metabolicContext:
        body.bodyFatPct && body.bodyFatPct > 18
          ? t.metabolic.femaleHigh
          : t.metabolic.femaleLow,
      splitBias:
        profile.goal === "ganho_massa" || profile.goal === "definicao"
          ? t.split.femaleMassDef
          : t.split.femaleDefault,
    };
  }

  if (profile.sex === "masculino") {
    return {
      recoveryBias:
        nutrition.needsRecoverySupport
          ? t.recovery.maleRecovery
          : t.recovery.maleDefault,
      hormonalContext: resolveCycleContext(profile, t.hormonal.male, locale),
      metabolicContext:
        body.bodyFatPct && body.bodyFatPct > 20
          ? t.metabolic.maleHigh
          : t.metabolic.maleLow,
      splitBias:
        profile.goal === "ganho_massa" || profile.goal === "forca"
          ? t.split.maleMassStrength
          : t.split.maleDefault,
    };
  }

  return {
    recoveryBias: t.recovery.neutral,
    hormonalContext: resolveCycleContext(profile, t.hormonal.neutral, locale),
    metabolicContext: t.metabolic.neutral,
    splitBias: t.split.neutral,
  };
}

function buildSummary(
  modality: TrainingModality,
  goal: AthleteProfile["goal"],
  currentWeek: number,
  locale: string,
) {
  const lang = (locale in summaryCopy ? locale : "pt") as SummaryLang;
  const t = summaryCopy[lang];
  const translatedGoal = goalLabels[goal]?.[lang] ?? goal.replaceAll("_", " ");
  const translatedModality = modalityLabels[modality][lang];
  return {
    shortTerm: t.short(currentWeek, translatedGoal, translatedModality),
    mediumTerm: t.medium,
    longTerm: t.long,
  };
}

export function buildPeriodizationBlock(
  profile: AthleteProfile,
  body: BodyTrainingContext,
  nutrition: NutritionTrainingContext,
  environment: EnvironmentContext,
  locale = "pt",
): TwelveWeekBlock {
  const modality = resolveTrainingModality(profile, environment);
  const currentWeek = resolveCurrentWeek(profile);

  return {
    modality,
    goal: profile.goal,
    currentWeek,
    weeks: Array.from({ length: 12 }, (_, index) => {
      const week = index + 1;
      const phase = resolveWeekPhase(week);

      return {
        week,
        phase,
        emphasis: resolveWeekEmphasis(phase, modality, profile, locale),
        volumeBias: applyMenstrualCycleVolume(resolveVolumeBias(phase), profile),
        intensityBias: applyMenstrualCycleIntensity(resolveIntensityBias(phase), profile),
      };
    }),
    summary: buildSummary(modality, profile.goal, currentWeek, locale),
    adjustments: buildSexSpecificAdjustment(profile, body, nutrition, locale),
  };
}
