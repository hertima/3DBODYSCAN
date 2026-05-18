import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { Dumbbell, Flame, Trophy } from "lucide-react";
import { buildTrainingAnalytics } from "@/domain/training/analytics";
import { useTrainingState } from "@/hooks/use-training-state";
import { loadOnboarding } from "@/lib/onboarding";
import { getCaloriesFromOnboarding } from "@/lib/calorie-calculator";
import { cn } from "@/lib/utils";
import { ShareVideoButton, WeeklyRecapVideo } from "@/remotion";
import { getStoredLocale, type AppLocale } from "@/lib/locale";
import { getModalityLabel, getPhaseLabel, getVolumeBiasLabel, translateWorkoutName } from "@/lib/training-i18n";
import type { FitnessGoal } from "@/lib/onboarding";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics | 3D Body Scan" },
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

function Analytics() {
  const locale = getStoredLocale();
  const copy = COPY[locale] ?? COPY.pt;
  const trainingState = useTrainingState();
  const analytics = buildTrainingAnalytics(trainingState, undefined, locale);
  const { periodization } = trainingState;
  const currentWeek = periodization.weeks[periodization.currentWeek - 1];
  const onboarding = loadOnboarding();
  const macros = getCaloriesFromOnboarding(onboarding);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-gradient-brand">Analytics</h1>
            <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
          </div>
          <ShareVideoButton
            composition={WeeklyRecapVideo as never}
            inputProps={{
              name: onboarding.name ?? "Atleta",
              weekNumber: periodization.currentWeek,
              totalSessions: analytics.workoutHistory.length,
              plannedSessions: (trainingState.profile as { daysPerWeek?: number }).daysPerWeek ?? 4,
              totalVolume: Math.round(analytics.volumeTrend.reduce((a, d) => a + d.volume, 0) / 1000),
              consistency: analytics.recoveryScore,
              phase: currentWeek?.phase ?? "base",
              muscleGroups: analytics.muscleRadar.map((m) => m.muscle),
              goal: onboarding.goal ?? "wellness",
            }}
            durationInFrames={420}
            title="Compartilhar semana"
            variant="ghost"
          />
        </div>
      </motion.div>

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

      <div className="grid gap-5 md:grid-cols-2">
        <Card index={1} title={copy.blockTitle(periodization.currentWeek)} subtitle={copy.blockSubtitle}>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
              <span className="rounded-full bg-cyan/10 px-2 py-1 text-cyan">
                {getModalityLabel(periodization.modality, locale)}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                {getPhaseLabel(currentWeek?.phase ?? "base", locale)}
              </span>
              <span className="rounded-full bg-success/10 px-2 py-1 text-success">
                {copy.volumeLabel} {getVolumeBiasLabel((currentWeek?.volumeBias ?? "alto") as "alto" | "moderado" | "baixo", locale)}
              </span>
            </div>
            <p>{periodization.summary.shortTerm}</p>
            <p>{currentWeek?.emphasis}</p>
          </div>
        </Card>

        <Card index={2} title={copy.cycleTitle} subtitle={copy.cycleSubtitle}>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{periodization.summary.mediumTerm}</p>
            <p>{periodization.summary.longTerm}</p>
            <p>{copy.recoveryAdjustment} {periodization.adjustments.recoveryBias}</p>
          </div>
        </Card>
      </div>

      <Card index={3} title={copy.volumeChartTitle} subtitle={copy.volumeChartSubtitle}>
        <div className="h-52">
          <ResponsiveContainer>
            <AreaChart data={analytics.volumeTrend} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
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
        <Card index={4} title={copy.muscleTitle} subtitle={copy.muscleSubtitle}>
          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={analytics.muscleRadar}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="muscle" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <Radar dataKey="value" stroke="var(--cyan)" fill="var(--cyan)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card index={5} title="Recovery score" subtitle={copy.recoverySubtitle}>
          <div className="relative grid h-64 place-items-center">
            <ResponsiveContainer>
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={[{ name: "Recovery", value: analytics.recoveryScore, fill: "var(--cyan)" }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar background={{ fill: "var(--elevated)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="font-display text-4xl font-bold text-gradient-ai">{analytics.recoveryScore}%</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{copy.readiness}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card index={6} title={copy.frequencyTitle} subtitle={copy.frequencySubtitle}>
        <div className="h-44">
          <ResponsiveContainer>
            <BarChart data={analytics.completionTrend} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="completed" fill="var(--blue-accent)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card index={7} title={copy.consistencyTitle} subtitle={copy.consistencySubtitle}>
        <div className="grid grid-cols-12 gap-1">
          {analytics.consistencyHeatmap.map((item) => (
            <div
              key={item.day}
              className="aspect-square rounded-sm"
              style={{ background: `oklch(0.74 0.17 53 / ${0.08 + item.value * 0.18})` }}
              title={copy.consistencyLabel(item.value)}
            />
          ))}
        </div>
      </Card>

      <Card index={8} title={copy.progressionTitle} subtitle={copy.progressionSubtitle}>
        <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <LegendDot color="var(--primary)" label={copy.bench} />
          <LegendDot color="var(--cyan)" label={copy.squat} />
          <LegendDot color="var(--blue-accent)" label={copy.deadlift} />
        </div>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={analytics.progressionData} margin={{ top: 10, right: 8, bottom: 0, left: -20 }}>
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

      <Card index={9} title={copy.workoutsTitle} subtitle={copy.workoutsSubtitle}>
        <div className="space-y-2">
          {analytics.workoutHistory.map((workout) => (
            <Link
              key={workout.id}
              to="/app/treino/$id"
              params={{ id: workout.id }}
              className="flex items-center gap-3 rounded-xl border border-border bg-elevated/40 p-3 transition hover:border-primary/40 hover:bg-elevated/60"
            >
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface">
                <Dumbbell className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{workout.name}</div>
                <div className="text-xs text-muted-foreground">
                  {workout.date} | {workout.sets} {copy.sets}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="font-display text-sm font-bold text-gradient-primary">
                  {(workout.volume / 1000).toFixed(1)}t
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span>{workout.duration}min</span>
                  {workout.prs > 0 ? (
                    <span className="flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 font-semibold text-primary">
                      <Trophy className="h-2.5 w-2.5" />+{workout.prs} PR
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
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

function Card({
  title,
  subtitle,
  children,
  index = 0,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: (index + 1) * 0.07, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-surface p-4"
    >
      <div className="mb-3">
        <div className="font-display text-base font-semibold">{title}</div>
        {subtitle ? <div className="text-xs text-muted-foreground">{subtitle}</div> : null}
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
