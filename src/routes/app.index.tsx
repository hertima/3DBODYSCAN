import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Flame, Trophy, Activity, Sparkles, Play, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { AIInsightCard } from "@/components/AIInsightCard";
import { useAIInsights } from "@/hooks/use-ai-insights";
import { useGamification } from "@/hooks/use-gamification";
import { useTrainingState } from "@/hooks/use-training-state";
import { resolveTrainingSplit } from "@/domain/training/rules";
import { getSplitLabel } from "@/lib/training-i18n";
import { getDashboardCopy } from "@/lib/app-copy";

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
  const trainingState = useTrainingState();
  const today = trainingState.workouts[0];
  const split = resolveTrainingSplit(trainingState.profile);
  const splitLabel = getSplitLabel(split);
  const dashboardCopy = getDashboardCopy();
  const aiRecommendations = useAIInsights(trainingState);
  const { gamification, dopamineLoop } = useGamification(trainingState);
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
  const readinessScore = Math.round(
    (gamification.hydrationCompletionRate +
      gamification.nutritionCompletionRate +
      trainingState.body.confidenceScore) /
      3,
  );
  const weeklyPlanLabel =
    plannedDays === 1 ? "1 sessão planejada pela IA" : `${plannedDays} sessões planejadas pela IA`;
  const weekTrend = [
    { day: "Seg", value: 0 },
    { day: "Ter", value: 0 },
    { day: "Qua", value: 0 },
    { day: "Qui", value: 0 },
    { day: "Sex", value: 0 },
    { day: "Sab", value: 0 },
    { day: "Dom", value: 0 },
  ].map((item, dayIndex) => {
    const planned = trainingState.schedule.find((entry) => entry.dayIndex === dayIndex)?.workoutId;
    const workout = trainingState.workouts.find((entry) => entry.id === planned);
    return {
      ...item,
      value: workout
        ? workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)
        : 0,
    };
  });
  const stats = [
    {
      label: "Séries da semana",
      value: String(totalSets),
      delta: `${totalExercises} exercícios`,
      icon: Activity,
      color: "text-cyan",
    },
    {
      label: "Frequência",
      value: `${plannedDays}/${Math.max(plannedDays, 1)}`,
      delta: `${plannedDays} dias`,
      icon: Flame,
      color: "text-primary",
    },
    {
      label: "Treinos no plano",
      value: String(trainingState.workouts.length),
      delta: `${gamification.achievements.filter((item) => item.unlocked).length} conquistas`,
      icon: Trophy,
      color: "text-success",
    },
    {
      label: "Readiness",
      value: `${readinessScore}%`,
      delta: trainingState.nutrition.readinessLevel,
      icon: Zap,
      color: "text-cyan",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Olá, atleta</p>
        <h1 className="font-display text-3xl font-bold text-gradient-brand">Pronto para evoluir?</h1>
      </div>

      {today ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-surface p-5 shadow-elevated"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            {dashboardCopy.todayWorkout}
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold">{today.name}</h2>
          <p className="text-sm text-muted-foreground">
            {today.focus} | {today.duration} min | {today.exercises.length} exercícios
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
            <span className="rounded-full bg-cyan/10 px-2 py-1 text-cyan">
              Semana {trainingState.periodization.currentWeek}/12
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
              {currentPeriodWeek?.phase ?? "base"}
            </span>
            <span className="rounded-full bg-success/10 px-2 py-1 text-success">
              {trainingState.periodization.modality}
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
              <Play className="h-4 w-4" /> Iniciar
            </Link>
          </div>
        </motion.div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-surface p-4">
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
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Nível atual
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-gradient-ai">
            Lv {gamification.level}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{gamification.xp} XP acumulado</div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Streak
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-primary">
            {gamification.streakDays} dias
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Consistência baseada em treino e hidratação
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Missão diária
          </div>
          <div className="mt-2 text-sm font-semibold">{dailyMission.title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{dailyMission.description}</div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-gradient-ai transition-all"
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
              Ritmo da semana
            </div>
            <div className="font-display text-xl font-bold">{totalSets} séries planejadas</div>
          </div>
          <Link to="/app/analytics" className="text-xs font-semibold text-cyan">
            Ver tudo
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
          <h3 className="font-display text-lg font-semibold">Recomendações da IA</h3>
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
        className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
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






