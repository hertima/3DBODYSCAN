import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, RadialBarChart, RadialBar, LineChart, Line, CartesianGrid } from "recharts";
import { volumeTrend, muscleRadar, consistencyHeatmap, progressionData, workoutHistory } from "@/data/social";
import { Dumbbell, Trophy } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({ meta: [{ title: "Analytics · ZYROX" }, { name: "description", content: "Volume, recovery, PRs e tendências cinematográficas." }] }),
  component: Analytics,
});

const tooltip = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)", fontSize: 12 };

function Analytics() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Sua evolução em tempo real.</p>
      </div>

      <Card title="Volume semanal" subtitle="kg movidos por dia">
        <div className="h-52">
          <ResponsiveContainer>
            <AreaChart data={volumeTrend} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltip} />
              <Area type="monotone" dataKey="volume" stroke="var(--primary)" strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Equilíbrio muscular" subtitle="distribuição de volume">
          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={muscleRadar}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="muscle" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <Radar dataKey="value" stroke="var(--cyan)" fill="var(--cyan)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recovery score" subtitle="prontidão para treinar">
          <div className="relative grid h-64 place-items-center">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "Recovery", value: 82, fill: "var(--cyan)" }]} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: "var(--elevated)" } as any} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="font-display text-4xl font-bold text-gradient-ai">82%</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Pronto</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Frequência semanal" subtitle="treinos completados">
        <div className="h-44">
          <ResponsiveContainer>
            <BarChart data={volumeTrend} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltip} />
              <Bar dataKey="volume" fill="var(--blue-accent)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Consistência" subtitle="últimas 12 semanas">
        <div className="grid grid-cols-12 gap-1">
          {consistencyHeatmap.map((d) => (
            <div
              key={d.day}
              className="aspect-square rounded-sm"
              style={{ background: `oklch(0.74 0.17 53 / ${0.08 + d.value * 0.18})` }}
              title={`Intensidade ${d.value}`}
            />
          ))}
        </div>
      </Card>

      <Card title="Personal Records" subtitle="seus PRs recentes">
        <div className="space-y-2">
          {personalRecords.map((pr) => (
            <div key={pr.exercise} className="flex items-center gap-3 rounded-xl border border-border bg-elevated/40 p-3">
              <Trophy className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <div className="text-sm font-semibold">{pr.exercise}</div>
                <div className="text-xs text-muted-foreground">{pr.date}</div>
              </div>
              <div className="font-display text-base font-bold text-gradient-primary">{pr.value}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3">
        <div className="font-display text-base font-semibold">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}
