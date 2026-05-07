import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Flame, Trophy, Activity, Sparkles, Play, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { volumeTrend } from "@/data/social";
import { workouts } from "@/data/library";
import { AIInsightCard } from "@/components/AIInsightCard";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [{ title: "Início · ZYROX" }, { name: "description", content: "Resumo de treinos, IA e progresso." }],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Volume semanal", value: "39.4t", delta: "+12%", icon: Activity, color: "text-cyan" },
  { label: "Frequência", value: "5/6", delta: "Elite", icon: Flame, color: "text-primary" },
  { label: "PRs no mês", value: "7", delta: "+3", icon: Trophy, color: "text-success" },
  { label: "Recovery", value: "82%", delta: "Pronto", icon: Zap, color: "text-cyan" },
];

function Dashboard() {
  const today = workouts[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Olá, atleta</p>
        <h1 className="font-display text-3xl font-bold">Pronto para evoluir?</h1>
      </div>

      {/* Today's workout card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-surface p-5 shadow-elevated"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="text-xs font-semibold uppercase tracking-widest text-primary">Treino de hoje</div>
        <h2 className="mt-2 font-display text-2xl font-bold">{today.name}</h2>
        <p className="text-sm text-muted-foreground">{today.focus} · {today.duration} min · {today.exercises.length} exercícios</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {today.exercises.slice(0, 4).map((e, i) => (
              <div key={i} className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-elevated text-[10px] font-bold text-cyan">
                {i + 1}
              </div>
            ))}
          </div>
          <Link
            to="/app/treino/$id" params={{ id: today.id }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary"
          >
            <Play className="h-4 w-4" /> Iniciar
          </Link>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.delta}</span>
            </div>
            <div className="mt-2 font-display text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Volume mini chart */}
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Volume da semana</div>
            <div className="font-display text-xl font-bold">39.470 kg</div>
          </div>
          <Link to="/app/analytics" className="text-xs font-semibold text-cyan">Ver tudo →</Link>
        </div>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={volumeTrend} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" }} />
              <Area type="monotone" dataKey="volume" stroke="var(--primary)" strokeWidth={2} fill="url(#vg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4 text-cyan" />
          <h3 className="font-display text-lg font-semibold">Recomendações da IA</h3>
        </div>
        <div className="space-y-3">
          <AIInsightCard>
            <div className="font-semibold">Aumente carga em Supino Reto</div>
            <div className="mt-1 text-muted-foreground">Você manteve RPE ≤ 7 nas últimas 3 sessões. Suba para 87,5 kg na próxima.</div>
          </AIInsightCard>
          <AIInsightCard>
            <div className="font-semibold">Deload sugerido para pernas</div>
            <div className="mt-1 text-muted-foreground">Volume acumulado 22% acima da média. Reduza séries em 30% nesta semana.</div>
          </AIInsightCard>
          <AIInsightCard>
            <div className="font-semibold">Substituição inteligente</div>
            <div className="mt-1 text-muted-foreground">Cadeira extensora travando progresso. Tente Búlgaro com halteres.</div>
          </AIInsightCard>
        </div>
      </div>

      <Link to="/app/treinos" className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-cyan" />
          <div>
            <div className="font-semibold">Sua semana ZYROX</div>
            <div className="text-xs text-muted-foreground">6 treinos planejados pela IA</div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </div>
  );
}
