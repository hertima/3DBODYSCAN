import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Flame } from "lucide-react";
import { buildTrainingAnalytics } from "@/domain/training/analytics";
import { useTrainingState } from "@/hooks/use-training-state";
import { loadOnboarding } from "@/lib/onboarding";
import { loadWorkoutsFromFirestore } from "@/lib/firestore-workouts";
import { auth } from "@/lib/firebase";
import { getCaloriesFromOnboarding } from "@/lib/calorie-calculator";
import { cn } from "@/lib/utils";
import { getStoredLocale, type AppLocale } from "@/lib/locale";
import { getModalityLabel, getPhaseLabel, getVolumeBiasLabel, translateWorkoutName, getWeekDayLabels, getCategoryLabel } from "@/lib/training-i18n";
import { buildExerciseCatalog } from "@/domain/exercises/catalog";
import type { FitnessGoal } from "@/lib/onboarding";
import { getWorkoutHistory, type SavedWorkout } from "@/lib/workout-history";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics | 3D Body Scanner" },
      { name: "description", content: "Training analytics, muscle balance, recovery and consistency." },
    ],
  }),
  component: Analytics,
});

const COPY = {
  pt: {
    subtitle: "Painel ligado ao treino atual, ao perfil e ao contexto real do atleta.",
    customNutrition: "Nutrição Personalizada", kcalDay: "kcal/dia",
    protein: "Proteína", carbs: "Carbs", fat: "Gordura",
    bmr: "TMB (Repouso)", tdee: "TDEE (Ativo)",
    blockTitle: (w: number) => `Bloco ${w}/12`, blockSubtitle: "Leitura profissional do ciclo atual",
    cycleTitle: "Horizonte do ciclo", cycleSubtitle: "Curto, médio e longo prazo ligados ao motor",
    recoveryAdjustment: "Ajuste de recuperação:", volumeLabel: "volume",
    volumeChartTitle: "Volume semanal planejado", volumeChartSubtitle: "Estimativa baseada no treino gerado, categoria e equipamento",
    muscleTitle: "Equilíbrio muscular", muscleSubtitle: "Distribuição do plano entre os grupos oficiais",
    recoverySubtitle: "Leitura baseada em ambiente, consistência, duração e prontidão estimada",
    readiness: "Prontidão", frequencyTitle: "Frequência semanal", frequencySubtitle: "Dias de treino ativos no plano atual",
    consistencyTitle: "Consistência", consistencySubtitle: "Mapa projetado das últimas 12 semanas pelo padrão do atleta",
    consistencyLabel: (v: number) => `Consistência ${v}`,
    progressionTitle: "Progressão estimada", progressionSubtitle: "Projeção de 12 semanas para os levantamentos principais",
    bench: "Supino", squat: "Agachamento", deadlift: "Terra",
    workoutsTitle: "Treinos da semana", workoutsSubtitle: "Leitura do plano atual com o volume estimado por sessão",
    sets: "séries",
    recoveryScore: "Recovery Score", shareWeek: "Compartilhar semana", weekLabel: "Sem.",
    adherence: "Aderência", worked: "Treinou", partial: "Parcial", rest: "Descanso",
    done: "Feitos", missed: "Faltou", day: "Dia", did: "Fez", off: "Off",
    frequencyRealSubtitle: (n: number) => `${n} treinos reais · planejado vs realizado`,
    macroLabels: { mass: "Superávit p/ hipertrofia", strength: "Superávit leve p/ força", hybrid: "Manutenção ativa", definition: "Déficit leve p/ definição", weight_loss: "Déficit calórico p/ emagrecimento", endurance: "Superávit p/ resistência", wellness: "Manutenção / bem-estar", athletic: "Performance atlética", default: "Manutenção / performance" },
  },
  es: {
    subtitle: "Panel conectado al entrenamiento actual, perfil y contexto real del atleta.",
    customNutrition: "Nutrición Personalizada", kcalDay: "kcal/día",
    protein: "Proteína", carbs: "Carbos", fat: "Grasas",
    bmr: "TMB (Reposo)", tdee: "TDEE (Activo)",
    blockTitle: (w: number) => `Bloque ${w}/12`, blockSubtitle: "Lectura profesional del ciclo actual",
    cycleTitle: "Horizonte del ciclo", cycleSubtitle: "Corto, medio y largo plazo vinculados al motor",
    recoveryAdjustment: "Ajuste de recuperación:", volumeLabel: "volumen",
    volumeChartTitle: "Volumen semanal planificado", volumeChartSubtitle: "Estimación basada en el entrenamiento generado, categoría y equipamiento",
    muscleTitle: "Equilibrio muscular", muscleSubtitle: "Distribución del plan entre grupos oficiales",
    recoverySubtitle: "Basado en entorno, consistencia, duración y disponibilidad estimada",
    readiness: "Disponibilidad", frequencyTitle: "Frecuencia semanal", frequencySubtitle: "Días de entrenamiento activos en el plan actual",
    consistencyTitle: "Consistencia", consistencySubtitle: "Mapa proyectado de las últimas 12 semanas según el patrón del atleta",
    consistencyLabel: (v: number) => `Consistencia ${v}`,
    progressionTitle: "Progresión estimada", progressionSubtitle: "Proyección de 12 semanas para los levantamientos principales",
    bench: "Press de Banca", squat: "Sentadilla", deadlift: "Peso Muerto",
    workoutsTitle: "Entrenamientos de la semana", workoutsSubtitle: "Lectura del plan actual con el volumen estimado por sesión",
    sets: "series",
    recoveryScore: "Recovery Score", shareWeek: "Compartir semana", weekLabel: "Sem.",
    adherence: "Adherencia", worked: "Entrenó", partial: "Parcial", rest: "Descanso",
    done: "Hechos", missed: "Faltó", day: "Día", did: "Hizo", off: "Off",
    frequencyRealSubtitle: (n: number) => `${n} entrenamientos reales · planificado vs realizado`,
    macroLabels: { mass: "Superávit para hipertrofia", strength: "Superávit leve para fuerza", hybrid: "Mantenimiento activo", definition: "Déficit leve para definición", weight_loss: "Déficit calórico para adelgazar", endurance: "Superávit para resistencia", wellness: "Mantenimiento / bienestar", athletic: "Rendimiento atlético", default: "Mantenimiento / rendimiento" },
  },
  en: {
    subtitle: "Dashboard connected to the current workout, profile, and real athlete context.",
    customNutrition: "Personalized Nutrition", kcalDay: "kcal/day",
    protein: "Protein", carbs: "Carbs", fat: "Fat",
    bmr: "BMR (Rest)", tdee: "TDEE (Active)",
    blockTitle: (w: number) => `Block ${w}/12`, blockSubtitle: "Professional read of the current cycle",
    cycleTitle: "Cycle horizon", cycleSubtitle: "Short, mid and long term linked to the engine",
    recoveryAdjustment: "Recovery adjustment:", volumeLabel: "volume",
    volumeChartTitle: "Planned weekly volume", volumeChartSubtitle: "Estimate based on generated workout, category and equipment",
    muscleTitle: "Muscle balance", muscleSubtitle: "Distribution of the plan across official groups",
    recoverySubtitle: "Based on environment, consistency, duration and estimated readiness",
    readiness: "Readiness", frequencyTitle: "Weekly frequency", frequencySubtitle: "Active training days in the current plan",
    consistencyTitle: "Consistency", consistencySubtitle: "12-week projected map based on athlete pattern",
    consistencyLabel: (v: number) => `Consistency ${v}`,
    progressionTitle: "Estimated progression", progressionSubtitle: "12-week projection for the main lifts",
    bench: "Bench Press", squat: "Squat", deadlift: "Deadlift",
    workoutsTitle: "Week workouts", workoutsSubtitle: "Current plan with estimated volume per session",
    sets: "sets",
    recoveryScore: "Recovery Score", shareWeek: "Share week", weekLabel: "Wk",
    adherence: "Adherence", worked: "Trained", partial: "Partial", rest: "Rest",
    done: "Done", missed: "Missed", day: "Day", did: "Done", off: "Off",
    frequencyRealSubtitle: (n: number) => `${n} real workouts · planned vs done`,
    macroLabels: { mass: "Surplus for hypertrophy", strength: "Light surplus for strength", hybrid: "Active maintenance", definition: "Light deficit for definition", weight_loss: "Caloric deficit for weight loss", endurance: "Surplus for endurance", wellness: "Maintenance / wellness", athletic: "Athletic performance", default: "Maintenance / performance" },
  },
  fr: {
    subtitle: "Tableau de bord lié à l'entraînement actuel, au profil et au contexte réel de l'athlète.",
    customNutrition: "Nutrition Personnalisée", kcalDay: "kcal/jour",
    protein: "Protéines", carbs: "Glucides", fat: "Lipides",
    bmr: "MB (Repos)", tdee: "TDEE (Actif)",
    blockTitle: (w: number) => `Bloc ${w}/12`, blockSubtitle: "Lecture professionnelle du cycle actuel",
    cycleTitle: "Horizon du cycle", cycleSubtitle: "Court, moyen et long terme liés au moteur",
    recoveryAdjustment: "Ajustement récupération :", volumeLabel: "volume",
    volumeChartTitle: "Volume hebdomadaire planifié", volumeChartSubtitle: "Estimation basée sur l'entraînement généré, catégorie et équipement",
    muscleTitle: "Équilibre musculaire", muscleSubtitle: "Distribution du plan entre les groupes officiels",
    recoverySubtitle: "Basé sur l'environnement, la constance, la durée et la disponibilité estimée",
    readiness: "Disponibilité", frequencyTitle: "Fréquence hebdomadaire", frequencySubtitle: "Jours d'entraînement actifs dans le plan actuel",
    consistencyTitle: "Constance", consistencySubtitle: "Carte projetée sur 12 semaines selon le schéma de l'athlète",
    consistencyLabel: (v: number) => `Constance ${v}`,
    progressionTitle: "Progression estimée", progressionSubtitle: "Projection sur 12 semaines pour les mouvements principaux",
    bench: "Développé Couché", squat: "Squat", deadlift: "Soulevé de Terre",
    workoutsTitle: "Entraînements de la semaine", workoutsSubtitle: "Lecture du plan actuel avec le volume estimé par séance",
    sets: "séries",
    recoveryScore: "Score de Récupération", shareWeek: "Partager la semaine", weekLabel: "Sem.",
    adherence: "Adhérence", worked: "Entraîné", partial: "Partiel", rest: "Repos",
    done: "Faits", missed: "Manqué", day: "Jour", did: "Fait", off: "Off",
    frequencyRealSubtitle: (n: number) => `${n} séances réelles · planifié vs réalisé`,
    macroLabels: { mass: "Surplus pour hypertrophie", strength: "Surplus léger pour la force", hybrid: "Maintien actif", definition: "Déficit léger pour définition", weight_loss: "Déficit calorique pour perte de poids", endurance: "Surplus pour l'endurance", wellness: "Maintien / bien-être", athletic: "Performance athlétique", default: "Maintien / performance" },
  },
  de: {
    subtitle: "Dashboard verbunden mit aktuellem Training, Profil und realem Athletenkontext.",
    customNutrition: "Personalisierte Ernährung", kcalDay: "kcal/Tag",
    protein: "Protein", carbs: "Kohlenhydrate", fat: "Fette",
    bmr: "Grundumsatz (Ruhe)", tdee: "TDEE (Aktiv)",
    blockTitle: (w: number) => `Block ${w}/12`, blockSubtitle: "Professionelle Analyse des aktuellen Zyklus",
    cycleTitle: "Zyklushorizont", cycleSubtitle: "Kurz-, mittel- und langfristige Ziele verknüpft mit der Engine",
    recoveryAdjustment: "Recovery-Anpassung:", volumeLabel: "Volumen",
    volumeChartTitle: "Geplantes Wochenvolumen", volumeChartSubtitle: "Schätzung basierend auf generiertem Training, Kategorie und Ausrüstung",
    muscleTitle: "Muskelbalance", muscleSubtitle: "Verteilung des Plans auf offizielle Gruppen",
    recoverySubtitle: "Basiert auf Umgebung, Konstanz, Dauer und geschätzter Bereitschaft",
    readiness: "Bereitschaft", frequencyTitle: "Wöchentliche Frequenz", frequencySubtitle: "Aktive Trainingstage im aktuellen Plan",
    consistencyTitle: "Konstanz", consistencySubtitle: "Projektierte 12-Wochen-Karte basierend auf dem Athletenmuster",
    consistencyLabel: (v: number) => `Konstanz ${v}`,
    progressionTitle: "Geschätzte Progression", progressionSubtitle: "12-Wochen-Projektion für die Hauptlifts",
    bench: "Bankdrücken", squat: "Kniebeuge", deadlift: "Kreuzheben",
    workoutsTitle: "Trainings der Woche", workoutsSubtitle: "Aktueller Plan mit geschätztem Volumen pro Einheit",
    sets: "Sätze",
    recoveryScore: "Recovery Score", shareWeek: "Woche teilen", weekLabel: "Wo.",
    adherence: "Einhaltung", worked: "Trainiert", partial: "Teilweise", rest: "Ruhe",
    done: "Erledigt", missed: "Verpasst", day: "Tag", did: "Getan", off: "Off",
    frequencyRealSubtitle: (n: number) => `${n} echte Trainings · geplant vs. durchgeführt`,
    macroLabels: { mass: "Überschuss für Hypertrophie", strength: "Leichter Überschuss für Kraft", hybrid: "Aktive Erhaltung", definition: "Leichtes Defizit für Definition", weight_loss: "Kaloriendefizit zur Gewichtsabnahme", endurance: "Überschuss für Ausdauer", wellness: "Erhaltung / Wohlbefinden", athletic: "Athletische Performance", default: "Erhaltung / Performance" },
  },
};

const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--foreground)",
  fontSize: 12,
};

function getMacroLabel(goal: FitnessGoal | undefined, copy: typeof COPY.pt): string {
  if (!goal) return copy.macroLabels.default;
  return (copy.macroLabels as Record<string, string>)[goal] ?? copy.macroLabels.default;
}

function buildFrequencyData(
  realWorkouts: SavedWorkout[],
  completionTrend: Array<{ day: string; completed: number }>,
) {
  const countByDay = new Array(7).fill(0);
  realWorkouts.forEach((w) => {
    const dow = (new Date(w.date).getDay() + 6) % 7; // Mon=0..Sun=6
    countByDay[dow]++;
  });
  const totalWeeks = Math.max(1, Math.ceil(realWorkouts.length / 4));
  return completionTrend.map(({ day, completed }, i) => {
    const isPlanned = completed > 0;
    const trained = countByDay[i];
    return {
      day,
      treinou: trained,
      faltou: isPlanned ? Math.max(0, totalWeeks - trained) : 0,
      descanso: !isPlanned ? 1 : 0,
    };
  });
}

function computeRealVolume(workout: SavedWorkout): number {
  return workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).reduce((s2, set) => s2 + set.reps * set.weight, 0),
    0,
  );
}

const ALL_MUSCLE_CATEGORIES_REAL = [
  "peitoral", "costas_trapezio", "deltoides", "biceps_antebraco",
  "triceps", "abdomen_core", "membros_inferiores_gluteos", "panturrilha",
] as const;

function Analytics() {
  const locale = getStoredLocale();
  const copy = COPY[locale] ?? COPY.pt;
  const trainingState = useTrainingState();
  const analytics = buildTrainingAnalytics(trainingState, undefined, locale);
  const { periodization } = trainingState;
  const currentWeek = periodization.weeks[periodization.currentWeek - 1];
  const onboarding = loadOnboarding();
  const macros = getCaloriesFromOnboarding(onboarding);

  const [realWorkouts, setRealWorkouts] = useState<SavedWorkout[]>(() => getWorkoutHistory());
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    loadWorkoutsFromFirestore(uid).then(setRealWorkouts).catch(() => {});
  }, []);

  const frequencyData = buildFrequencyData(realWorkouts, analytics.completionTrend);
  const frequencyMax = Math.max(
    4,
    ...frequencyData.map((item) => item.treinou + item.faltou + item.descanso),
  );

  const realWorkoutHistory = useMemo(() => {
    if (!realWorkouts.length) return analytics.workoutHistory;
    return realWorkouts.slice(0, 20).map((w) => ({
      id: w.id,
      name: w.name,
      date: (() => { try { return new Date(w.date).toLocaleDateString(locale === "pt" ? "pt-BR" : locale, { day: "2-digit", month: "2-digit" }); } catch { return w.date; } })(),
      duration: w.duration,
      volume: computeRealVolume(w),
      sets: w.completedSets,
      prs: 0,
    }));
  }, [realWorkouts, analytics.workoutHistory, locale]);

  const realVolumeTrend = useMemo(() => {
    if (!realWorkouts.length) return analytics.volumeTrend;
    const dayLabels = getWeekDayLabels(locale);
    const volumeByDay = new Array(7).fill(0);
    const countByDay = new Array(7).fill(0);
    realWorkouts.forEach((w) => {
      const dow = (new Date(w.date).getDay() + 6) % 7;
      volumeByDay[dow] += computeRealVolume(w);
      countByDay[dow]++;
    });
    return dayLabels.map((day, i) => ({
      day,
      volume: countByDay[i] > 0 ? Math.round(volumeByDay[i] / countByDay[i]) : 0,
      exercises: 0,
    }));
  }, [realWorkouts, analytics.volumeTrend, locale]);

  const realConsistencyHeatmap = useMemo(() => {
    if (!realWorkouts.length) return analytics.consistencyHeatmap;
    const trainedDates = new Set(realWorkouts.map((w) => w.date.slice(0, 10)));
    const today = new Date();
    return Array.from({ length: 84 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (83 - i));
      return { day: i, value: trainedDates.has(d.toISOString().slice(0, 10)) ? 4 : 0 };
    });
  }, [realWorkouts, analytics.consistencyHeatmap]);

  const realMuscleRadar = useMemo(() => {
    if (!realWorkouts.length) return analytics.muscleRadar;
    const catalog = buildExerciseCatalog();
    const catalogById = new Map(catalog.map((r) => [r.id, r]));
    const distribution = new Map<string, number>();
    realWorkouts.forEach((w) => {
      w.exercises.forEach((ex) => {
        const record = catalogById.get(ex.id);
        if (record) distribution.set(record.category, (distribution.get(record.category) ?? 0) + 1);
      });
    });
    const max = Math.max(...distribution.values(), 1);
    return ALL_MUSCLE_CATEGORIES_REAL.map((cat) => ({
      muscle: getCategoryLabel(cat, locale),
      value: Math.round(((distribution.get(cat) ?? 0) / max) * 100),
    }));
  }, [realWorkouts, analytics.muscleRadar, locale]);

  const realProgressionData = useMemo(() => {
    if (realWorkouts.length < 2) return analytics.progressionData;
    const benchKw = ["supino", "bench", "press"];
    const squatKw = ["agachamento", "squat", "leg press", "hack"];
    const deadliftKw = ["terra", "deadlift", "stiff", "levantamento"];
    const matchKw = (name: string, kw: string[]) => kw.some((k) => name.toLowerCase().includes(k));
    const today = new Date();
    const rows = Array.from({ length: 12 }, (_, wi) => {
      const wStart = new Date(today);
      wStart.setDate(today.getDate() - (11 - wi) * 7);
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 7);
      let maxS = 0, maxA = 0, maxT = 0;
      realWorkouts
        .filter((w) => { const d = new Date(w.date); return d >= wStart && d < wEnd; })
        .forEach((w) => {
          w.exercises.forEach((ex) => {
            const maxW = Math.max(0, ...ex.sets.filter((s) => s.completed && s.weight > 0).map((s) => s.weight));
            if (matchKw(ex.name, benchKw)) maxS = Math.max(maxS, maxW);
            if (matchKw(ex.name, squatKw)) maxA = Math.max(maxA, maxW);
            if (matchKw(ex.name, deadliftKw)) maxT = Math.max(maxT, maxW);
          });
        });
      return { week: `S${wi + 1}`, supino: maxS, agachamento: maxA, terra: maxT };
    });
    const hasRealData = rows.some((r) => r.supino > 0 || r.agachamento > 0 || r.terra > 0);
    return hasRealData ? rows : analytics.progressionData;
  }, [realWorkouts, analytics.progressionData]);

  const realRecoveryScore = useMemo(() => {
    if (!realWorkouts.length) return analytics.recoveryScore;
    const today = new Date();
    const last7 = new Set(Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d.toISOString().slice(0, 10);
    }));
    const trainedLast7 = realWorkouts.filter((w) => last7.has(w.date.slice(0, 10))).length;
    const planned = (trainingState.profile as { daysPerWeek?: number }).daysPerWeek ?? 4;
    return Math.round(Math.max(60, Math.min(98, 65 + (trainedLast7 / planned) * 33)));
  }, [realWorkouts, analytics.recoveryScore, trainingState.profile]);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-gradient-brand">Analytics</h1>
            <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { value: `${periodization.currentWeek}/12`, label: copy.weekLabel, color: "#22d3ee" },
          { value: realWorkouts.length, label: copy.workoutsTitle.split(" ")[0], color: "#fb923c" },
          { value: `${realRecoveryScore}%`, label: copy.readiness, color: "#a855f7" },
          { value: `${(Math.round(realVolumeTrend.reduce((a, d) => a + d.volume, 0) / 100) / 10).toFixed(1)}t`, label: copy.volumeLabel, color: "#10b981" },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface px-2 py-2.5 text-center">
            <div className="font-display text-xl font-bold leading-none" style={{ color: stat.color }}>{stat.value}</div>
            <div className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground truncate">{stat.label}</div>
          </div>
        ))}
      </div>

      {macros && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          className="rounded-2xl border border-primary/20 bg-surface p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/15">
              <Flame className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-base font-semibold">{copy.customNutrition}</div>
              <div className="text-[11px] text-muted-foreground">{getMacroLabel(onboarding.goal, copy)}</div>
            </div>
            {macros.surplusOrDeficit !== 0 && (
              <span className={cn(
                "ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold",
                macros.surplusOrDeficit > 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
              )}>
                {macros.surplusOrDeficit > 0 ? "+" : ""}{macros.surplusOrDeficit} kcal
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 border-y border-border/50 py-3">
            <span className="font-display text-5xl font-black" style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6,#fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {macros.target}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">{copy.kcalDay}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <MacroStat label={copy.protein} value={macros.protein} unit="g" color="#22d3ee" pct={Math.round((macros.protein * 4 / macros.target) * 100)} />
            <MacroStat label={copy.carbs} value={macros.carbs} unit="g" color="#fb923c" pct={Math.round((macros.carbs * 4 / macros.target) * 100)} />
            <MacroStat label={copy.fat} value={macros.fat} unit="g" color="#a78bfa" pct={Math.round((macros.fat * 9 / macros.target) * 100)} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-elevated p-2.5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{copy.bmr}</div>
              <div className="font-display text-base font-bold">{macros.bmr} <span className="text-[10px] font-medium text-muted-foreground">kcal</span></div>
            </div>
            <div className="rounded-xl bg-elevated p-2.5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{copy.tdee}</div>
              <div className="font-display text-base font-bold">{macros.tdee} <span className="text-[10px] font-medium text-muted-foreground">kcal</span></div>
            </div>
          </div>
        </motion.div>
      )}

      <Card index={3} title={copy.volumeChartTitle} subtitle={copy.volumeChartSubtitle}>
        <div className="h-52">
          <ResponsiveContainer>
            <AreaChart data={realVolumeTrend} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="volume" stroke="var(--primary)" strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <MuscleBalanceCard title={copy.muscleTitle} subtitle={copy.muscleSubtitle} data={realMuscleRadar} />
        <RecoveryScoreCard title={copy.recoveryScore} subtitle={copy.recoverySubtitle} score={realRecoveryScore} label={copy.readiness} />
      </div>

      <WeeklyFrequencyCard
        title={copy.frequencyTitle}
        subtitle={copy.frequencyRealSubtitle(realWorkouts.length)}
        data={frequencyData}
        max={frequencyMax}
        labels={{ adherence: copy.adherence, done: copy.done, missed: copy.missed, worked: copy.worked, rest: copy.rest, did: copy.did, off: copy.off }}
      />

      <ConsistencyCard
        title={copy.consistencyTitle}
        subtitle={copy.consistencySubtitle}
        data={realConsistencyHeatmap}
        labelForValue={copy.consistencyLabel}
        labels={{ adherence: copy.adherence, worked: copy.worked, partial: copy.partial, rest: copy.rest, day: copy.day }}
      />

      <Card index={8} title={copy.progressionTitle} subtitle={copy.progressionSubtitle}>
        <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <LegendDot color="var(--primary)" label={copy.bench} />
          <LegendDot color="var(--cyan)" label={copy.squat} />
          <LegendDot color="var(--blue-accent)" label={copy.deadlift} />
        </div>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={realProgressionData} margin={{ top: 10, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="supino" name={copy.bench} stroke="var(--primary)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="agachamento" name={copy.squat} stroke="var(--cyan)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="terra" name={copy.deadlift} stroke="var(--blue-accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function MuscleBalanceCard({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: Array<{ muscle: string; value: number }>;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const size = 300;
  const center = size / 2;
  const radius = 98;
  const levels = [0.25, 0.5, 0.75, 1];
  const active = activeIndex === null ? null : data[activeIndex];
  const points = data.map((item, index) => {
    const angle = -Math.PI / 2 + (index / data.length) * Math.PI * 2;
    const valueRadius = radius * Math.min(1, item.value / 100);
    const x = center + Math.cos(angle) * valueRadius;
    const y = center + Math.sin(angle) * valueRadius;
    const labelX = center + Math.cos(angle) * (radius + 34);
    const labelY = center + Math.sin(angle) * (radius + 30);
    return { ...item, angle, x, y, labelX, labelY };
  });
  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[28px] border p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-6"
      style={{
        background: "linear-gradient(180deg,rgba(17,29,49,0.98),rgba(13,24,42,0.98))",
        borderColor: "rgba(34,211,238,0.18)",
      }}
      onPointerLeave={() => setActiveIndex(null)}
    >
      <PremiumCardHeader title={title} subtitle={subtitle} color="#22d3ee" />
      <div className="relative mt-4 grid min-h-[300px] place-items-center rounded-3xl border border-white/[0.06] bg-[#091321]/70">
        <motion.div
          initial={false}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 6 }}
          transition={{ duration: 0.16 }}
          className="pointer-events-none absolute right-4 top-4 z-20 rounded-2xl border border-white/15 bg-white px-3 py-2 text-[#0b1220] shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
        >
          {active && (
            <>
              <div className="max-w-36 truncate text-xs font-bold uppercase tracking-wider text-[#334155]">{active.muscle}</div>
              <div className="mt-1 font-display text-2xl font-bold leading-none text-[#0891b2]">{active.value}%</div>
            </>
          )}
        </motion.div>

        <svg viewBox={`0 0 ${size} ${size}`} className="h-[300px] w-full max-w-[390px]" role="img" aria-label={title}>
          <defs>
            <radialGradient id="muscleRadarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="muscleRadarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.56" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <circle cx={center} cy={center} r={radius + 16} fill="url(#muscleRadarGlow)" />
          {levels.map((level) => {
            const levelPoints = data.map((_, index) => {
              const angle = -Math.PI / 2 + (index / data.length) * Math.PI * 2;
              const x = center + Math.cos(angle) * radius * level;
              const y = center + Math.sin(angle) * radius * level;
              return `${x},${y}`;
            }).join(" ");
            return <polygon key={level} points={levelPoints} fill="none" stroke="rgba(255,255,255,0.075)" strokeWidth="1" />;
          })}
          {points.map((point) => (
            <line key={point.muscle} x1={center} y1={center} x2={center + Math.cos(point.angle) * radius} y2={center + Math.sin(point.angle) * radius} stroke="rgba(255,255,255,0.055)" />
          ))}
          <motion.polygon
            points={polygon}
            fill="url(#muscleRadarFill)"
            stroke="#22d3ee"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.9, transformOrigin: "center" }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 18px rgba(34,211,238,0.28))" }}
          />
          {points.map((point, index) => {
            const activePoint = activeIndex === index;
            return (
              <g key={point.muscle}>
                <text
                  x={point.labelX}
                  y={point.labelY}
                  textAnchor={point.labelX < center - 10 ? "end" : point.labelX > center + 10 ? "start" : "middle"}
                  dominantBaseline="middle"
                  className={cn("fill-[#728098] text-[11px] font-bold transition", activePoint && "fill-white")}
                >
                  {point.muscle}
                </text>
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={activePoint ? 8 : 5}
                  fill={activePoint ? "#ffffff" : "#22d3ee"}
                  stroke={activePoint ? "#22d3ee" : "transparent"}
                  strokeWidth="3"
                  animate={{ scale: activePoint ? 1.18 : 1 }}
                  style={{ filter: activePoint ? "drop-shadow(0 0 14px rgba(255,255,255,0.7))" : "none" }}
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="18"
                  fill="transparent"
                  className="cursor-pointer"
                  onPointerEnter={() => setActiveIndex(index)}
                  onPointerDown={() => setActiveIndex(index)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </motion.section>
  );
}

function RecoveryScoreCard({
  title,
  subtitle,
  score,
  label,
}: {
  title: string;
  subtitle: string;
  score: number;
  label: string;
}) {
  const [active, setActive] = useState(false);
  const scoreAngle = Math.max(0, Math.min(100, score)) * 3.6;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.42, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[28px] border p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-6"
      style={{
        background: "linear-gradient(180deg,rgba(17,29,49,0.98),rgba(13,24,42,0.98))",
        borderColor: active ? "rgba(255,255,255,0.55)" : "rgba(168,85,247,0.18)",
      }}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onPointerDown={() => setActive(true)}
    >
      <PremiumCardHeader title={title} subtitle={subtitle} color="#a855f7" />
      <button
        type="button"
        className="relative mt-4 grid h-[300px] w-full place-items-center rounded-3xl border border-white/[0.06] bg-[#091321]/70 outline-none transition focus-visible:ring-2 focus-visible:ring-white/80"
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        aria-label={`${label}: ${score}%`}
      >
        <motion.div
          initial={false}
          animate={{ scale: active ? 1.04 : 1 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="relative grid h-60 w-60 place-items-center"
        >
          <motion.div
            initial={{ rotate: -18, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from -90deg, #22d3ee 0deg, #60a5fa ${scoreAngle * 0.55}deg, #a855f7 ${scoreAngle}deg, rgba(255,255,255,0.055) ${scoreAngle}deg 360deg)`,
              boxShadow: active
                ? "0 0 0 2px rgba(255,255,255,0.72), 0 0 36px rgba(147,197,253,0.34)"
                : "0 0 30px rgba(96,165,250,0.18)",
            }}
          />
          <div className="absolute inset-[28px] rounded-full bg-[#091321] shadow-[inset_0_0_34px_rgba(0,0,0,0.34)]" />
          <div className="absolute inset-[14px] rounded-full border border-white/[0.04]" />
          <div className="absolute inset-0 grid place-items-center text-center">
            <motion.div initial={false} animate={{ y: active ? -2 : 0 }} transition={{ duration: 0.16 }}>
              <div
                className="font-display text-5xl font-bold leading-none"
                style={{ color: active ? "#ffffff" : "#60a5fa", textShadow: active ? "0 0 18px rgba(147,197,253,0.55)" : "none" }}
              >
                {score}%
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9fb1ca]">{label}</div>
            </motion.div>
          </div>
        </motion.div>
      </button>
    </motion.section>
  );
}

function PremiumCardHeader({ title, subtitle, color }: { title: string; subtitle: string; color: string }) {
  return (
    <div className="relative flex items-start gap-2.5">
      <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 14px ${color}` }} />
      <div className="min-w-0">
        <h2 className="font-display text-xl font-bold leading-tight text-white">{title}</h2>
        <p className="mt-1 text-sm leading-5 text-[#9fb1ca]">{subtitle}</p>
      </div>
    </div>
  );
}

function ConsistencyCard({
  title,
  subtitle,
  data,
  labelForValue,
  labels,
}: {
  title: string;
  subtitle: string;
  data: Array<{ day: string | number; value: number }>;
  labelForValue: (value: number) => string;
  labels: { adherence: string; worked: string; partial: string; rest: string; day: string };
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : data[activeIndex];
  const completed = data.filter((item) => item.value >= 3).length;
  const partialCount = data.filter((item) => item.value > 0 && item.value < 3).length;
  const adherence = data.length ? Math.round((completed / data.length) * 100) : 0;
  const weeks = Array.from({ length: Math.ceil(data.length / 7) }, (_, index) => data.slice(index * 7, index * 7 + 7));

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.56, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[28px] border p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-6"
      style={{
        background: "linear-gradient(180deg,rgba(17,29,49,0.98),rgba(13,24,42,0.98))",
        borderColor: "rgba(251,146,60,0.18)",
      }}
      onPointerLeave={() => setActiveIndex(null)}
    >
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PremiumCardHeader title={title} subtitle={subtitle} color="#fb923c" />
        <div className="grid grid-cols-3 gap-2 sm:min-w-72">
          <FrequencyMetric label={labels.adherence} value={`${adherence}%`} color="#4ade80" />
          <FrequencyMetric label={labels.worked} value={completed} color="#4ade80" />
          <FrequencyMetric label={labels.partial} value={partialCount} color="#f59e0b" />
        </div>
      </div>

      <div className="relative mt-6 rounded-3xl border border-white/[0.06] bg-[#091321]/70 p-4">
        <motion.div
          initial={false}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 6, scale: active ? 1 : 0.98 }}
          transition={{ duration: 0.16 }}
          className="pointer-events-none absolute right-4 top-4 z-30 rounded-2xl border border-white/15 bg-white px-3 py-2 text-[#0b1220] shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
        >
          {active && (
            <>
              <div className="text-xs font-bold uppercase tracking-wider text-[#334155]">{labels.day} {active.day}</div>
              <div className="mt-1 font-display text-2xl font-bold leading-none" style={{ color: getConsistencyColor(active.value) }}>
                {active.value >= 3 ? labels.worked : active.value > 0 ? labels.partial : labels.rest}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-[#64748b]">{labelForValue(active.value)}</div>
            </>
          )}
        </motion.div>

        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-[#9fb1ca]">
          <LegendDot color="#4ade80" label={labels.worked} />
          <LegendDot color="#f59e0b" label={labels.partial} />
          <LegendDot color="#26344c" label={labels.rest} />
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="grid min-w-[720px] grid-cols-12 gap-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-2">
                {week.map((item, dayIndex) => {
                  const index = weekIndex * 7 + dayIndex;
                  return (
                    <ConsistencyCell
                      key={`${item.day}-${index}`}
                      item={item}
                      active={activeIndex === index}
                      dimmed={activeIndex !== null && activeIndex !== index}
                      onActivate={() => setActiveIndex(index)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ConsistencyCell({
  item,
  active,
  dimmed,
  onActivate,
}: {
  item: { day: string | number; value: number };
  active: boolean;
  dimmed: boolean;
  onActivate: () => void;
}) {
  const color = getConsistencyColor(item.value);
  return (
    <button
      type="button"
      className="h-9 rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-white/80 sm:h-10"
      style={{
        background: color,
        opacity: dimmed ? 0.38 : 1,
        boxShadow: active ? `0 0 0 2px rgba(255,255,255,0.9), 0 12px 30px ${color}55` : "inset 0 1px 0 rgba(255,255,255,0.08)",
        transform: active ? "translateY(-3px) scale(1.05)" : "translateY(0) scale(1)",
      }}
      onPointerEnter={onActivate}
      onPointerDown={onActivate}
      onFocus={onActivate}
      aria-label={`Dia ${item.day}: ${item.value}`}
    />
  );
}

function getConsistencyColor(value: number) {
  if (value >= 3) return "#4ade80";
  if (value > 0) return "#f59e0b";
  return "#26344c";
}

function WeeklyFrequencyCard({
  title,
  subtitle,
  data,
  max,
  labels,
}: {
  title: string;
  subtitle: string;
  data: Array<{ day: string; treinou: number; faltou: number; descanso: number }>;
  max: number;
  labels: { adherence: string; done: string; missed: string; worked: string; rest: string; did: string; off: string };
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const trainedTotal = data.reduce((sum, item) => sum + item.treinou, 0);
  const missedTotal = data.reduce((sum, item) => sum + item.faltou, 0);
  const plannedTotal = trainedTotal + missedTotal;
  const adherence = plannedTotal ? Math.round((trainedTotal / plannedTotal) * 100) : 0;
  const activeItem = activeIndex === null ? null : data[activeIndex];
  const ticks = [max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0]
    .filter((value, index, arr) => arr.indexOf(value) === index);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.49, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[28px] border p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-6"
      style={{
        background:
          "linear-gradient(180deg,rgba(17,29,49,0.98) 0%,rgba(13,24,42,0.98) 100%)",
        borderColor: "rgba(90,119,158,0.24)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-8 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(96,165,250,0.55),transparent)" }}
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold leading-tight text-white">{title}</h2>
          <p className="mt-1 text-sm text-[#9fb1ca]">{subtitle}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:min-w-72">
          <FrequencyMetric label={labels.adherence} value={`${adherence}%`} color="#60a5fa" />
          <FrequencyMetric label={labels.done} value={trainedTotal} color="#3b82f6" />
          <FrequencyMetric label={labels.missed} value={missedTotal} color="#fb7a52" />
        </div>
      </div>

      <div
        className="relative mt-6 rounded-3xl border border-white/[0.06] bg-[#091321]/70 px-4 pb-4 pt-5"
        onPointerLeave={() => setActiveIndex(null)}
      >
        <div className="mb-5 flex flex-wrap items-center gap-4 text-xs text-[#9fb1ca]">
          <LegendDot color="#3b82f6" label={labels.worked} />
          <LegendDot color="#fb7a52" label={labels.missed} />
          <LegendDot color="#1a2840" label={labels.rest} />
        </div>

        <motion.div
          initial={false}
          animate={{
            opacity: activeItem ? 1 : 0,
            y: activeItem ? 0 : 6,
            scale: activeItem ? 1 : 0.98,
          }}
          transition={{ duration: 0.16 }}
          className="pointer-events-none absolute right-4 top-4 z-30 rounded-2xl border border-white/15 bg-white px-3 py-2 text-[#0b1220] shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
        >
          {activeItem && (
            <div className="min-w-32">
              <div className="text-xs font-bold uppercase tracking-wider text-[#334155]">{activeItem.day}</div>
              <div className="mt-1 grid grid-cols-3 gap-2 text-center">
                <TooltipStat label={labels.did} value={activeItem.treinou} color="#2563eb" />
                <TooltipStat label={labels.missed} value={activeItem.faltou} color="#ea580c" />
                <TooltipStat label={labels.off} value={activeItem.descanso} color="#475569" />
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-[26px_1fr] gap-3">
          <div className="flex h-44 flex-col justify-between text-right text-xs font-medium text-[#7f8fa6]">
            {ticks.map((tick) => <span key={tick}>{tick}</span>)}
          </div>
          <div className="relative h-44">
            <div className="absolute inset-0 flex flex-col justify-between">
              {ticks.map((tick) => (
                <span key={tick} className="h-px w-full bg-white/[0.045]" />
              ))}
            </div>
            <div className="relative z-10 grid h-full grid-cols-7 items-end gap-3 sm:gap-5">
              {data.map((item, index) => (
                <FrequencyBar
                  key={item.day}
                  item={item}
                  max={max}
                  active={activeIndex === index}
                  dimmed={activeIndex !== null && activeIndex !== index}
                  onActivate={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function TooltipStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="font-display text-lg font-bold leading-none" style={{ color }}>{value}</div>
      <div className="mt-0.5 text-[10px] font-semibold text-[#64748b]">{label}</div>
    </div>
  );
}

function FrequencyMetric({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[#7f8fa6]">{label}</div>
      <div className="mt-1 font-display text-lg font-bold leading-none" style={{ color }}>{value}</div>
    </div>
  );
}

function FrequencyBar({
  item,
  max,
  active,
  dimmed,
  onActivate,
}: {
  item: { day: string; treinou: number; faltou: number; descanso: number };
  max: number;
  active: boolean;
  dimmed: boolean;
  onActivate: () => void;
}) {
  const trainedHeight = Math.max(0, (item.treinou / max) * 100);
  const missedHeight = Math.max(0, (item.faltou / max) * 100);
  const restHeight = item.descanso > 0 ? Math.max(8, (item.descanso / max) * 100) : 0;
  const hasPlan = item.treinou > 0 || item.faltou > 0;

  return (
    <button
      type="button"
      className="group flex h-full min-w-0 cursor-pointer touch-manipulation flex-col items-center justify-end gap-2 rounded-2xl outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-white/80"
      onPointerEnter={onActivate}
      onPointerDown={onActivate}
      onFocus={onActivate}
      aria-label={`${item.day}: ${item.treinou} treinou, ${item.faltou} faltou, ${item.descanso} descanso`}
    >
      <div className="flex h-[132px] w-full max-w-[74px] items-end justify-center">
        <motion.div
          initial={false}
          animate={{
            y: active ? -8 : 0,
            scaleX: active ? 1.08 : 1,
            opacity: dimmed ? 0.42 : 1,
          }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="relative h-full w-full max-w-[56px] overflow-hidden rounded-t-[14px] bg-[#13213a] ring-1 ring-white/[0.04]"
          style={{
            boxShadow: active
              ? "0 0 0 2px rgba(255,255,255,0.9), 0 18px 42px rgba(96,165,250,0.32)"
              : "0 0 0 0 rgba(255,255,255,0)",
          }}
        >
          {active && (
            <div
              className="pointer-events-none absolute inset-0 z-20"
              style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.22),transparent 45%)" }}
            />
          )}
          <motion.div
            initial={false}
            animate={{ height: `${hasPlan ? Math.max(6, trainedHeight + missedHeight) : restHeight}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-x-0 bottom-0 rounded-t-[14px]"
            style={{
              background: hasPlan
                ? "linear-gradient(180deg,rgba(251,122,82,0.95),rgba(245,107,68,0.95))"
                : "linear-gradient(180deg,#1d2d48,#16243a)",
            }}
          />
          {item.treinou > 0 && (
            <motion.div
              initial={false}
              animate={{ height: `${Math.max(8, trainedHeight)}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-x-0 bottom-0 rounded-t-[14px]"
              style={{
                background: "linear-gradient(180deg,#5aa8ff 0%,#3b82f6 100%)",
                boxShadow: active
                  ? "0 -14px 34px rgba(147,197,253,0.42)"
                  : "0 -10px 28px rgba(59,130,246,0.25)",
              }}
            />
          )}
        </motion.div>
      </div>
      <div className={cn("text-sm font-semibold transition-colors", active ? "text-white" : "text-[#98a7bc]")}>
        {item.day}
      </div>
    </button>
  );
}

function Card({
  title,
  subtitle,
  children,
  index = 0,
  accentColor,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  index?: number;
  accentColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: (index + 1) * 0.07, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-surface p-4"
      style={accentColor ? { borderColor: `${accentColor}22` } : undefined}
    >
      <div className="mb-3">
        <div className="flex items-center gap-2">
          {accentColor && (
            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
          )}
          <span className="font-display text-base font-semibold">{title}</span>
        </div>
        {subtitle ? <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div> : null}
      </div>
      {children}
    </motion.div>
  );
}

function MacroStat({ label, value, unit, color, pct }: { label: string; value: number; unit: string; color: string; pct: number }) {
  return (
    <div className="rounded-2xl bg-elevated p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-xl font-bold mt-1" style={{ color }}>
        {value}<span className="text-[10px] font-medium text-muted-foreground ml-0.5">{unit}</span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, pct)}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground">{pct}%</div>
    </div>
  );
}
