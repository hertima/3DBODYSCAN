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
import { Dumbbell, Trophy } from "lucide-react";
import { buildTrainingAnalytics } from "@/domain/training/analytics";
import { useTrainingState } from "@/hooks/use-training-state";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics | 3D Body Scan" },
      {
        name: "description",
        content: "Leitura do treino atual, equilíbrio muscular, recovery e consistência.",
      },
    ],
  }),
  component: Analytics,
});

const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--foreground)",
  fontSize: 12,
};

function Analytics() {
  const trainingState = useTrainingState();
  const analytics = buildTrainingAnalytics(trainingState);
  const { periodization } = trainingState;
  const currentWeek = periodization.weeks[periodization.currentWeek - 1];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold text-gradient-brand">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Painel ligado ao treino atual, ao perfil e ao contexto real do atleta.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card
          title={`Bloco ${periodization.currentWeek}/12`}
          subtitle="Leitura profissional do ciclo atual"
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
              <span className="rounded-full bg-cyan/10 px-2 py-1 text-cyan">
                {periodization.modality}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                {currentWeek?.phase ?? "base"}
              </span>
              <span className="rounded-full bg-success/10 px-2 py-1 text-success">
                volume {currentWeek?.volumeBias ?? "alto"}
              </span>
            </div>
            <p>{periodization.summary.shortTerm}</p>
            <p>{currentWeek?.emphasis}</p>
          </div>
        </Card>

        <Card
          title="Horizonte do ciclo"
          subtitle="Curto, médio e longo prazo ligados ao motor"
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{periodization.summary.mediumTerm}</p>
            <p>{periodization.summary.longTerm}</p>
            <p>Ajuste de recuperação: {periodization.adjustments.recoveryBias}</p>
          </div>
        </Card>
      </div>

      <Card
        title="Volume semanal planejado"
        subtitle="Estimativa baseada no treino gerado, categoria e equipamento"
      >
        <div className="h-52">
          <ResponsiveContainer>
            <AreaChart
              data={analytics.volumeTrend}
              margin={{ top: 10, right: 0, bottom: 0, left: -20 }}
            >
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#g1)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Equilíbrio muscular" subtitle="Distribuição do plano entre os grupos oficiais">
          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={analytics.muscleRadar}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="muscle"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <Radar dataKey="value" stroke="var(--cyan)" fill="var(--cyan)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Recovery score"
          subtitle="Leitura baseada em ambiente, consistência, duração e prontidão estimada"
        >
          <div className="relative grid h-64 place-items-center">
            <ResponsiveContainer>
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={[{ name: "Recovery", value: analytics.recoveryScore, fill: "var(--cyan)" }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: "var(--elevated)" }}
                  dataKey="value"
                  cornerRadius={20}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="font-display text-4xl font-bold text-gradient-ai">
                  {analytics.recoveryScore}%
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  Prontidão
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Frequência semanal" subtitle="Dias de treino ativos no plano atual">
        <div className="h-44">
          <ResponsiveContainer>
            <BarChart
              data={analytics.completionTrend}
              margin={{ top: 10, right: 0, bottom: 0, left: -20 }}
            >
              <XAxis
                dataKey="day"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="completed" fill="var(--blue-accent)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card
        title="Consistência"
        subtitle="Mapa projetado das últimas 12 semanas pelo padrão do atleta"
      >
        <div className="grid grid-cols-12 gap-1">
          {analytics.consistencyHeatmap.map((item) => (
            <div
              key={item.day}
              className="aspect-square rounded-sm"
              style={{ background: `oklch(0.74 0.17 53 / ${0.08 + item.value * 0.18})` }}
              title={`Consistência ${item.value}`}
            />
          ))}
        </div>
      </Card>

      <Card
        title="Progressão estimada"
        subtitle="Projeção de 12 semanas para os levantamentos principais"
      >
        <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <LegendDot color="var(--primary)" label="Supino" />
          <LegendDot color="var(--cyan)" label="Agachamento" />
          <LegendDot color="var(--blue-accent)" label="Terra" />
        </div>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart
              data={analytics.progressionData}
              margin={{ top: 10, right: 8, bottom: 0, left: -20 }}
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="week"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="supino"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="agachamento"
                stroke="var(--cyan)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="terra"
                stroke="var(--blue-accent)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card
        title="Treinos da semana"
        subtitle="Leitura do plano atual com o volume estimado por sessão"
      >
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
                  {workout.date} | {workout.sets} séries
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
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3">
        <div className="font-display text-base font-semibold">{title}</div>
        {subtitle ? <div className="text-xs text-muted-foreground">{subtitle}</div> : null}
      </div>
      {children}
    </div>
  );
}
