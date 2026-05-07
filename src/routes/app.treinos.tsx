import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Brain, Calendar, Clock, Flame, Play, RefreshCcw,
  CheckCircle2, Loader2, ChevronRight, Zap, Target, TrendingUp,
} from "lucide-react";
import { workouts } from "@/data/library";

export const Route = createFileRoute("/app/treinos")({
  head: () => ({
    meta: [
      { title: "Treinos · ZYROX" },
      { name: "description", content: "Sua semana de treinos organizada pela IA." },
    ],
  }),
  component: TreinosPage,
});

const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

// Placebo: IA "monta" a semana
const WEEK_PLAN: Array<{ day: string; workoutId: string | null; intensity?: "Leve" | "Moderado" | "Pesado"; tag?: string }> = [
  { day: "Seg", workoutId: "push", intensity: "Pesado", tag: "Força" },
  { day: "Ter", workoutId: "pull", intensity: "Moderado", tag: "Hipertrofia" },
  { day: "Qua", workoutId: "core", intensity: "Leve", tag: "Recovery" },
  { day: "Qui", workoutId: "legs", intensity: "Pesado", tag: "PR Day" },
  { day: "Sex", workoutId: "upper", intensity: "Moderado", tag: "Power" },
  { day: "Sáb", workoutId: "calisthenics", intensity: "Moderado", tag: "Skill" },
  { day: "Dom", workoutId: null },
];

const AI_STEPS = [
  "Analisando histórico de 28 dias…",
  "Detectando platôs e recovery…",
  "Distribuindo volume semanal…",
  "Selecionando exercícios prioritários…",
  "Calibrando intensidade por dia…",
  "Pronto.",
];

function TreinosPage() {
  const [aiState, setAiState] = useState<"idle" | "thinking" | "ready">("ready");
  const [stepIdx, setStepIdx] = useState(AI_STEPS.length - 1);

  useEffect(() => {
    if (aiState !== "thinking") return;
    setStepIdx(0);
    const id = setInterval(() => {
      setStepIdx((i) => {
        if (i >= AI_STEPS.length - 1) {
          clearInterval(id);
          setAiState("ready");
          return AI_STEPS.length - 1;
        }
        return i + 1;
      });
    }, 600);
    return () => clearInterval(id);
  }, [aiState]);

  const totalWorkouts = WEEK_PLAN.filter((d) => d.workoutId).length;
  const totalMinutes = WEEK_PLAN.reduce((acc, d) => {
    const w = workouts.find((x) => x.id === d.workoutId);
    return acc + (w?.duration ?? 0);
  }, 0);

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Coach IA</p>
        <h1 className="font-display text-2xl font-bold leading-tight">Sua semana ZYROX</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalWorkouts} treinos · {totalMinutes} min organizados pela IA
        </p>
      </div>

      {/* AI Status card */}
      <motion.div
        layout
        className="relative overflow-hidden rounded-2xl border border-cyan/30 bg-gradient-to-br from-cyan/10 via-surface to-primary/10 p-4"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan/20 blur-3xl" />
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan/20 text-cyan">
            <Brain className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Motor IA v2.4</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Ativo
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={aiState + stepIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 text-xs text-muted-foreground"
              >
                {aiState === "thinking" ? AI_STEPS[stepIdx] : "Plano otimizado para sua próxima semana."}
              </motion.p>
            </AnimatePresence>
          </div>
          <button
            onClick={() => setAiState("thinking")}
            disabled={aiState === "thinking"}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1.5 text-xs font-semibold text-cyan transition hover:bg-cyan/20 disabled:opacity-60"
          >
            {aiState === "thinking" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCcw className="h-3.5 w-3.5" />
            )}
            {aiState === "thinking" ? "Otimizando" : "Reorganizar"}
          </button>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <Stat icon={Calendar} label="Treinos" value={`${totalWorkouts}`} accent="text-cyan" />
        <Stat icon={Clock} label="Tempo" value={`${totalMinutes}m`} accent="text-primary" />
        <Stat icon={Flame} label="Volume" value="+8%" accent="text-success" />
      </div>

      {/* Week selector chips */}
      <div className="flex items-center justify-between gap-1">
        {WEEK_DAYS.map((d, i) => {
          const plan = WEEK_PLAN[i];
          const active = !!plan.workoutId;
          return (
            <div
              key={d}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl border py-2 ${
                active ? "border-primary/40 bg-primary/10" : "border-border bg-surface"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {d}
              </span>
              {active ? (
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow-primary" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
              )}
            </div>
          );
        })}
      </div>

      {/* Plan list */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Plano da semana</h2>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Ordenado pela IA
          </span>
        </div>

        {WEEK_PLAN.map((plan, idx) => {
          const w = workouts.find((x) => x.id === plan.workoutId);

          if (!w) {
            return (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-dashed border-border bg-surface/40 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-elevated text-[11px] font-bold text-muted-foreground">
                    {plan.day}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Descanso ativo</div>
                    <div className="text-xs text-muted-foreground">Mobilidade leve sugerida</div>
                  </div>
                </div>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          }

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link
                to="/app/treino/$id"
                params={{ id: w.id }}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition active:scale-[0.99] hover:border-primary/40"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-cyan/20 text-xs font-bold text-foreground">
                  {plan.day}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold">{w.name}</span>
                    {plan.tag && (
                      <span className="rounded-full bg-cyan/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan">
                        {plan.tag}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="truncate">{w.focus}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {w.duration}m
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Target className="h-3 w-3" /> {w.exercises.length} ex
                    </span>
                    {plan.intensity && (
                      <>
                        <span>·</span>
                        <IntensityPill level={plan.intensity} />
                      </>
                    )}
                  </div>
                </div>
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow-primary transition group-hover:scale-105">
                  <Play className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* AI insights */}
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan" />
          <h3 className="text-sm font-semibold">Por que essa ordem?</h3>
        </div>
        <ul className="space-y-2 text-xs text-muted-foreground">
          <li className="flex gap-2">
            <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            Push antes de Pull para aproveitar pico de testosterona pós-descanso.
          </li>
          <li className="flex gap-2">
            <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan" />
            Leg Day na quinta — você performa melhor com 1 dia de recovery prévio.
          </li>
          <li className="flex gap-2">
            <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            Calistenia no sábado para skill em estado neural fresco.
          </li>
        </ul>
      </div>

      <Link
        to="/app/exercicios"
        className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-elevated text-cyan">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">Biblioteca completa</div>
            <div className="text-[11px] text-muted-foreground">500+ exercícios catalogados</div>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </div>
  );
}

function Stat({
  icon: Icon, label, value, accent,
}: { icon: typeof Calendar; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <Icon className={`h-3.5 w-3.5 ${accent}`} />
      <div className="mt-1 font-display text-lg font-bold leading-none">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function IntensityPill({ level }: { level: "Leve" | "Moderado" | "Pesado" }) {
  const map = {
    Leve: "text-success",
    Moderado: "text-cyan",
    Pesado: "text-primary",
  } as const;
  const dots = level === "Leve" ? 1 : level === "Moderado" ? 2 : 3;
  return (
    <span className={`inline-flex items-center gap-0.5 ${map[level]}`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={`h-1 w-1 rounded-full ${i < dots ? "bg-current" : "bg-border"}`}
        />
      ))}
      <span className="ml-1 font-semibold">{level}</span>
    </span>
  );
}
