import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trophy, Clock, Dumbbell, Layers } from "lucide-react";
import { getHistoryEntry } from "@/data/social";
import { cleanLegacyText } from "@/lib/formatting";

export const Route = createFileRoute("/app/historico/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${cleanLegacyText(getHistoryEntry(params.id)?.name ?? "Histórico")} | 3D Body Scan` }],
  }),
  component: HistoryDetail,
});

function HistoryDetail() {
  const { id } = Route.useParams();
  const entry = getHistoryEntry(id);

  if (!entry) {
    return (
      <div className="space-y-4">
        <Link to="/app/analytics" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="rounded-2xl border border-border bg-surface p-6 text-center text-sm text-muted-foreground">
          Treino não encontrado.
        </div>
      </div>
    );
  }

  const totalSets = entry.exercises.reduce((a, e) => a + e.sets.length, 0);

  return (
    <div className="space-y-5">
      <Link to="/app/analytics" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para Analytics
      </Link>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{entry.date}</div>
        <h1 className="mt-1 font-display text-2xl font-bold text-gradient-brand">{cleanLegacyText(entry.name)}</h1>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat icon={<Clock className="h-3.5 w-3.5" />} label="Duração" value={`${entry.duration}min`} />
          <Stat icon={<Layers className="h-3.5 w-3.5" />} label="Séries" value={String(totalSets)} />
          <Stat icon={<Dumbbell className="h-3.5 w-3.5" />} label="Volume" value={`${(entry.volume / 1000).toFixed(1)}t`} />
        </div>
        {entry.prs > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
            <Trophy className="h-3.5 w-3.5" /> {entry.prs} novo{entry.prs > 1 ? "s" : ""} Personal Record neste treino
          </div>
        )}
      </div>

      <div className="space-y-3">
        {entry.exercises.map((ex, i) => (
          <div key={i} className="rounded-2xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-display text-base font-semibold">{cleanLegacyText(ex.name)}</div>
                <div className="text-xs text-muted-foreground">{cleanLegacyText(ex.muscle)} | {ex.sets.length} séries</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Volume</div>
                <div className="font-display text-sm font-bold text-gradient-primary">
                  {ex.sets.reduce((a, s) => a + s.reps * s.weight, 0).toLocaleString()} kg
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="grid grid-cols-12 px-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <div className="col-span-2">Set</div>
                <div className="col-span-4">Reps</div>
                <div className="col-span-4">Carga</div>
                <div className="col-span-2 text-right">PR</div>
              </div>
              {ex.sets.map((s, j) => (
                <div
                  key={j}
                  className={`grid grid-cols-12 items-center rounded-xl border px-2 py-2 text-sm ${
                    s.pr ? "border-primary/40 bg-primary/5" : "border-border bg-elevated/40"
                  }`}
                >
                  <div className="col-span-2 font-mono text-xs text-muted-foreground">#{j + 1}</div>
                  <div className="col-span-4 font-semibold">{s.reps}</div>
                  <div className="col-span-4 font-semibold">{s.weight > 0 ? `${s.weight} kg` : "Peso corporal"}</div>
                  <div className="col-span-2 flex justify-end">
                    {s.pr && (
                      <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <Trophy className="h-2.5 w-2.5" /> PR
                      </span>
                    )}
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
