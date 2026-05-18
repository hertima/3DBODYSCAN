import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock, Dumbbell, Flame, Layers, Trophy } from "lucide-react";
import { getHistoryEntry } from "@/data/social";
import { getWorkoutHistoryEntry } from "@/lib/workout-history";
import { cleanLegacyText } from "@/lib/formatting";
import { ShareVideoButton, SessionSummaryVideo } from "@/remotion";

export const Route = createFileRoute("/app/historico/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Histórico | 3D Body Scan` }],
  }),
  component: HistoryDetail,
});

function HistoryDetail() {
  const { id } = Route.useParams();

  // Tenta histórico real salvo pelo usuário primeiro, senão usa dados estáticos
  const saved = getWorkoutHistoryEntry(id);
  const staticEntry = getHistoryEntry(id);

  if (saved) {
    const totalSets = saved.exercises.reduce((a, e) => a + e.sets.length, 0);
    const completedCount = saved.exercises.reduce((a, e) => a + e.sets.filter((s) => s.completed).length, 0);
    const totalVolume = saved.exercises.reduce((a, e) => a + e.sets.reduce((b, s) => b + s.reps * s.weight, 0), 0);

    return (
      <div className="space-y-5">
        <Link to="/app/analytics" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar para Analytics
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{saved.date}</div>
          <h1 className="mt-1 font-display text-2xl font-bold text-gradient-brand">{saved.name}</h1>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat icon={<Clock className="h-3.5 w-3.5" />} label="Duração" value={`${saved.duration}min`} />
            <Stat icon={<Layers className="h-3.5 w-3.5" />} label="Séries" value={`${completedCount}/${totalSets}`} />
            <Stat icon={<Dumbbell className="h-3.5 w-3.5" />} label="Volume" value={totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}t` : "—"} />
            <Stat icon={<Flame className="h-3.5 w-3.5" />} label="Calorias" value={`${saved.calories} kcal`} />
          </div>
          {completedCount === totalSets && totalSets > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-xs font-semibold text-success">
              <Trophy className="h-3.5 w-3.5" /> Treino 100% concluído!
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <ShareVideoButton
              composition={SessionSummaryVideo as never}
              inputProps={{
                workoutName: saved.name,
                date: saved.date,
                duration: saved.duration,
                completedSets: completedCount,
                totalSets,
                totalVolume,
                calories: saved.calories,
                exercises: saved.exercises.map((ex) => ({
                  name: cleanLegacyText(ex.name),
                  muscle: cleanLegacyText(ex.muscle),
                  sets: ex.sets.length,
                  completed: ex.sets.filter((s) => s.completed).length,
                  topWeight: Math.max(...ex.sets.map((s) => s.weight ?? 0)),
                })),
              }}
              durationInFrames={360}
              title="Compartilhar sessão"
            />
          </div>
        </div>

        <div className="space-y-3">
          {saved.exercises.map((ex, i) => {
            const done = ex.sets.filter((s) => s.completed).length;
            return (
              <div key={i} className="rounded-2xl border border-border bg-surface p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="font-display text-base font-semibold">{cleanLegacyText(ex.name)}</div>
                    <div className="text-xs text-muted-foreground">{cleanLegacyText(ex.muscle)} · {done}/{ex.sets.length} séries</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Volume</div>
                    <div className="font-display text-sm font-bold text-gradient-primary">
                      {ex.sets.reduce((a, s) => a + s.reps * s.weight, 0).toLocaleString()} kg
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {ex.sets.map((s, j) => (
                    <div
                      key={j}
                      className={`grid grid-cols-12 items-center rounded-xl border px-2 py-2 text-sm ${
                        s.completed ? "border-success/30 bg-success/5" : "border-border bg-elevated/40"
                      }`}
                    >
                      <div className="col-span-2 font-mono text-xs text-muted-foreground">#{j + 1}</div>
                      <div className="col-span-4 font-semibold">{s.reps} reps</div>
                      <div className="col-span-4 font-semibold">{s.weight > 0 ? `${s.weight} kg` : "Corporal"}</div>
                      <div className="col-span-2 flex justify-end">
                        {s.completed && <Check className="h-4 w-4 text-success" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!staticEntry) {
    return (
      <div className="space-y-4">
        <Link to="/app/analytics" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="rounded-2xl border border-border bg-surface p-10 text-center space-y-3">
          <div className="text-4xl">🏋️</div>
          <div className="font-display text-lg font-semibold">Nenhum treino registrado</div>
          <p className="text-sm text-muted-foreground">Complete um treino e ele aparecerá aqui com todas as séries e métricas.</p>
          <Link to="/app/treinos" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
            Ir para treinos
          </Link>
        </div>
      </div>
    );
  }

  const totalSets = staticEntry.exercises.reduce((a, e) => a + e.sets.length, 0);
  return (
    <div className="space-y-5">
      <Link to="/app/analytics" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para Analytics
      </Link>
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{staticEntry.date}</div>
        <h1 className="mt-1 font-display text-2xl font-bold text-gradient-brand">{cleanLegacyText(staticEntry.name)}</h1>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat icon={<Clock className="h-3.5 w-3.5" />} label="Duração" value={`${staticEntry.duration}min`} />
          <Stat icon={<Layers className="h-3.5 w-3.5" />} label="Séries" value={String(totalSets)} />
          <Stat icon={<Dumbbell className="h-3.5 w-3.5" />} label="Volume" value={`${(staticEntry.volume / 1000).toFixed(1)}t`} />
        </div>
        {staticEntry.prs > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
            <Trophy className="h-3.5 w-3.5" /> {staticEntry.prs} Personal Record{staticEntry.prs > 1 ? "s" : ""} neste treino
          </div>
        )}
      </div>
      <div className="space-y-3">
        {staticEntry.exercises.map((ex, i) => (
          <div key={i} className="rounded-2xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-display text-base font-semibold">{cleanLegacyText(ex.name)}</div>
                <div className="text-xs text-muted-foreground">{cleanLegacyText(ex.muscle)} | {ex.sets.length} séries</div>
              </div>
              <div className="font-display text-sm font-bold text-gradient-primary">
                {ex.sets.reduce((a, s) => a + s.reps * s.weight, 0).toLocaleString()} kg
              </div>
            </div>
            <div className="space-y-1.5">
              {ex.sets.map((s, j) => (
                <div key={j} className={`grid grid-cols-12 items-center rounded-xl border px-2 py-2 text-sm ${s.pr ? "border-primary/40 bg-primary/5" : "border-border bg-elevated/40"}`}>
                  <div className="col-span-2 font-mono text-xs text-muted-foreground">#{j + 1}</div>
                  <div className="col-span-4 font-semibold">{s.reps}</div>
                  <div className="col-span-4 font-semibold">{s.weight > 0 ? `${s.weight} kg` : "Corporal"}</div>
                  <div className="col-span-2 flex justify-end">
                    {s.pr && <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary"><Trophy className="h-2.5 w-2.5" /> PR</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-elevated/40 p-3">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon}{label}
      </div>
      <div className="mt-1 font-display text-base font-bold">{value}</div>
    </div>
  );
}
