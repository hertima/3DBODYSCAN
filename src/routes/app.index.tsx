import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Flame, Trophy, Activity, Sparkles, Play, Zap, Utensils } from "lucide-react";
import { loadMealPlan } from "@/lib/meal-plan";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { AIInsightCard } from "@/components/AIInsightCard";
import { SkeletonStatCard, SkeletonWorkoutCard } from "@/components/SkeletonCard";
import { useAIInsights } from "@/hooks/use-ai-insights";
import { useGamification } from "@/hooks/use-gamification";
import { useTrainingState } from "@/hooks/use-training-state";
import { resolveTrainingSplit } from "@/domain/training/rules";
import { getSplitLabel, getReadinessLevelLabel, translateWorkoutName } from "@/lib/training-i18n";
import { getDashboardCopy, getNutritionCopy, getGamificationCopy } from "@/lib/app-copy";
import { getStoredLocale } from "@/lib/locale";
import { loadOnboarding } from "@/lib/onboarding";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Início | 3D Body Scan" },
      { name: "description", content: "Resumo de treinos, IA e progresso." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [loaded, setLoaded] = useState(false);
  const [userName, setUserName] = useState("atleta");
  const trainingState = useTrainingState();
  const today = trainingState.workouts[0];
  const split = resolveTrainingSplit(trainingState.profile);
  const splitLabel = getSplitLabel(split);
  const locale = getStoredLocale();
  const dashboardCopy = getDashboardCopy();
  const nutritionCopy = getNutritionCopy(locale);
  const gamCopy = getGamificationCopy(locale);
  const dateLocale = locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : locale === "de" ? "de-DE" : locale === "fr" ? "fr-FR" : "en-US";
  const aiRecommendations = useAIInsights(trainingState);
  const { gamification, dopamineLoop } = useGamification(trainingState);

  useEffect(() => {
    const profile = loadOnboarding();
    const name = profile.name?.split(" ")[0]?.trim() || "atleta";
    setUserName(name);
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);
  const dailyMission = gamification.missions.diaria[0];
  const currentPeriodWeek =
    trainingState.periodization.weeks[trainingState.periodization.currentWeek - 1];
  const plannedDays = trainingState.schedule.filter((item) => item.workoutId).length;
  const totalSets = trainingState.workouts.reduce(
    (total, workout) =>
      total + workout.exercises.reduce((exerciseTotal, exercise) => exerciseTotal + exercise.sets.length, 0),
    0,
  );
  const totalExercises = trainingState.workouts.reduce(
    (total, workout) => total + workout.exercises.length,
    0,
  );
  const averageDuration =
    trainingState.workouts.length > 0
      ? Math.round(
          trainingState.workouts.reduce((total, workout) => total + workout.duration, 0) /
            trainingState.workouts.length,
        )
      : 0;
  const mealPlan = loadMealPlan();
  const planLocaleMismatch = mealPlan !== null && (
    mealPlan.locale === undefined ? locale !== "pt" : mealPlan.locale !== locale
  );
  const readinessScore = Math.round(
    (gamification.hydrationCompletionRate +
      gamification.nutritionCompletionRate +
      trainingState.body.confidenceScore) /
      3,
  );
  const dc = dashboardCopy;
  const weeklyPlanLabel =
    plannedDays === 1 ? `1 ${dc.sessionPlanned}` : `${plannedDays} ${dc.sessionsPlanned}`;
  const weekTrend = nutritionCopy.days.map((day, dayIndex) => {
    const planned = trainingState.schedule.find((entry) => entry.dayIndex === dayIndex)?.workoutId;
    const workout = trainingState.workouts.find((entry) => entry.id === planned);
    return {
      day,
      value: workout
        ? workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)
        : 0,
    };
  });
  const stats = [
    {
      label: dc.statSeries,
      value: String(totalSets),
      delta: `${totalExercises} ${dc.exercisesLabel}`,
      icon: Activity,
      color: "text-cyan",
    },
    {
      label: dc.statFrequency,
      value: `${plannedDays}/${Math.max(plannedDays, 1)}`,
      delta: `${plannedDays} ${dc.statDays}`,
      icon: Flame,
      color: "text-primary",
    },
    {
      label: dc.statWorkouts,
      value: String(trainingState.workouts.length),
      delta: `${gamification.achievements.filter((item) => item.unlocked).length} ${dc.statAchievements}`,
      icon: Trophy,
      color: "text-success",
    },
    {
      label: dc.statReadiness,
      value: `${readinessScore}%`,
      delta: getReadinessLevelLabel(trainingState.nutrition.readinessLevel, locale),
      icon: Zap,
      color: "text-cyan",
    },
  ] as const;

  if (!loaded) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded-lg bg-elevated" />
          <div className="h-8 w-48 animate-pulse rounded-lg bg-elevated" />
        </div>
        <SkeletonWorkoutCard />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{dc.greeting} {userName}</p>
          <h1 className="font-display text-3xl font-bold text-gradient-brand">{dc.headline}</h1>
        </div>
        <img
          src="/mascote.png"
          alt="Mascote 3D Body Scan"
          className="h-32 w-32 object-contain"
          style={{ filter: "drop-shadow(0 0 20px rgba(34,211,238,0.5)) drop-shadow(0 0 10px rgba(251,146,60,0.4))" }}
        />
      </div>

      <Link
        to="/app/nutricao"
        className={`relative overflow-hidden flex items-center justify-between rounded-2xl border p-4 ${planLocaleMismatch ? "border-amber-400/30 bg-amber-400/5" : "border-cyan/20 bg-cyan/5"}`}
      >
        <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${planLocaleMismatch ? "bg-amber-400/10" : "bg-cyan/10"}`} />
        <div className="flex items-center gap-3">
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl"
            style={planLocaleMismatch
              ? { background: "linear-gradient(135deg,rgba(251,191,36,0.2),rgba(245,158,11,0.2))", border: "1px solid rgba(251,191,36,0.25)" }
              : { background: "linear-gradient(135deg,rgba(34,211,238,0.2),rgba(59,130,246,0.2))", border: "1px solid rgba(34,211,238,0.25)" }}
          >
            <Utensils className={`h-5 w-5 ${planLocaleMismatch ? "text-amber-400" : "text-cyan"}`} />
          </div>
          <div>
            <div className="font-semibold">{nutritionCopy.emptyTitle}</div>
            <div className={`text-xs ${planLocaleMismatch ? "text-amber-400" : "text-muted-foreground"}`}>
              {planLocaleMismatch
                ? nutritionCopy.localeMismatch
                : mealPlan
                  ? `${nutritionCopy.twelveWeeks} · ${new Date(mealPlan.generatedAt).toLocaleDateString(dateLocale)}`
                  : nutritionCopy.cardDesc}
            </div>
          </div>
        </div>
        <ArrowRight className={`h-4 w-4 shrink-0 ${planLocaleMismatch ? "text-amber-400" : "text-cyan"}`} />
      </Link>

      {today ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-surface p-5 shadow-elevated"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {dashboardCopy.todayWorkout}
            </span>
            <span className="urgency-pulse rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest" style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)" }}>
              Hoje
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold">{translateWorkoutName(today.name, locale)}</h2>
          <p className="text-sm text-muted-foreground">
            {today.focus} | {today.duration} min | {today.exercises.length} {dc.exercisesLabel}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
            <span className="rounded-full bg-cyan/10 px-2 py-1 text-cyan">
              {dc.weekLabel} {trainingState.periodization.currentWeek}/12
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
              {gamCopy.phases[(currentPeriodWeek?.phase ?? "base") as keyof typeof gamCopy.phases] ?? currentPeriodWeek?.phase ?? "base"}
            </span>
            <span className="rounded-full bg-success/10 px-2 py-1 text-success">
              {gamCopy.modalities[trainingState.periodization.modality as keyof typeof gamCopy.modalities] ?? trainingState.periodization.modality}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-2">
              {today.exercises.slice(0, 4).map((_, index) => (
                <div
                  key={index}
                  className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-elevated text-[10px] font-bold text-cyan"
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <Link
              to="/app/treino/$id"
              params={{ id: today.id }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary"
            >
              <Play className="h-4 w-4" /> {dc.startBtn}
            </Link>
          </div>
        </motion.div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-interactive rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.delta}
              </span>
            </div>
            <div className="mt-2 font-display text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="card-interactive rounded-2xl border border-border bg-surface p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {dc.levelLabel}
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-gradient-ai">
            Lv {gamification.level}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{gamification.xp} {dc.xpLabel}</div>
        </div>
        <div className="card-interactive rounded-2xl border bg-surface p-4" style={{ borderColor: gamification.streakDays > 0 ? "rgba(251,146,60,0.25)" : "rgba(255,255,255,0.08)" }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {dc.streakLabel}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-display text-3xl font-bold text-primary${gamification.streakDays > 2 ? " streak-glow" : ""}`}>
              {gamification.streakDays}
            </span>
            <span className="text-sm font-semibold text-primary">{dc.streakDays}</span>
            {gamification.streakDays > 0 && (
              <img
                src="/mascote.png"
                alt=""
                className="h-16 w-16 object-contain"
                style={{ filter: "drop-shadow(0 0 14px rgba(251,146,60,0.7))" }}
              />
            )}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {gamification.streakDays === 0
              ? <span className="urgency-pulse font-medium" style={{ color: "rgba(251,146,60,0.9)" }}>Inicie sua sequência hoje</span>
              : dc.streakDesc}
          </div>
        </div>
        <div className="card-interactive rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {dc.dailyMission}
            </div>
            <span className="text-[11px] font-bold text-gradient-ai">
              {Math.min(100, Math.round((dailyMission.progress / dailyMission.target) * 100))}%
            </span>
          </div>
          <div className="mt-2 text-sm font-semibold">{dailyMission.title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{dailyMission.description}</div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-gradient-ai transition-all duration-700"
              style={{
                width: `${Math.min(100, Math.round((dailyMission.progress / dailyMission.target) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      <AIInsightCard>
        <div className="font-semibold">{dopamineLoop.headline}</div>
        <div className="mt-1 text-muted-foreground">{dopamineLoop.message}</div>
        <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan">
          {dopamineLoop.momentumLabel}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{dopamineLoop.nextUnlock}</div>
      </AIInsightCard>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {dc.weekRhythm}
            </div>
            <div className="font-display text-xl font-bold">{totalSets} {dc.setsPlanned}</div>
          </div>
          <Link to="/app/analytics" className="text-xs font-semibold text-cyan">
            {dc.viewAll}
          </Link>
        </div>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekTrend} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#vg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4 text-cyan" />
          <h3 className="font-display text-lg font-semibold">{dc.aiTitle}</h3>
        </div>
        <div className="space-y-3">
          {aiRecommendations.items.map((recommendation) => (
            <AIInsightCard key={recommendation.id}>
              <div className="font-semibold">{recommendation.title}</div>
              <div className="mt-1 text-muted-foreground">{recommendation.message}</div>
            </AIInsightCard>
          ))}
        </div>
      </div>

      <Link
        to="/app/treinos"
        className="card-interactive flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-cyan" />
          <div>
            <div className="font-semibold">{dashboardCopy.weeklyTitle}</div>
            <div className="text-xs text-muted-foreground">
              {weeklyPlanLabel} | {splitLabel}
            </div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </div>
  );
}






