import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Plus, Minus, Pause, Play, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getWorkout, getExercise } from "@/data/library";
import { ExerciseMedia } from "@/components/ExerciseMedia";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/treino/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${getWorkout(params.id)?.name ?? "Treino"} · ZYROX` }],
  }),
  component: TreinoExec,
});

type SetState = { reps: number; weight: number; done: boolean };

function TreinoExec() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const workout = getWorkout(id);

  const [state, setState] = useState<SetState[][]>(
    () => workout?.exercises.map((e) => e.sets.map((s) => ({ reps: s.reps, weight: s.weight, done: false }))) ?? [],
  );
  const [restLeft, setRestLeft] = useState(0);
  const [restRunning, setRestRunning] = useState(false);

  useEffect(() => {
    if (!restRunning) return;
    const id = setInterval(() => setRestLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [restRunning]);

  if (!workout) return <div>Treino não encontrado</div>;

  const totalSets = state.reduce((a, ex) => a + ex.length, 0);
  const doneSets = state.reduce((a, ex) => a + ex.filter((s) => s.done).length, 0);
  const pct = totalSets ? (doneSets / totalSets) * 100 : 0;

  const toggle = (ei: number, si: number) => {
    setState((prev) => {
      const copy = prev.map((ex) => ex.map((s) => ({ ...s })));
      copy[ei][si].done = !copy[ei][si].done;
      return copy;
    });
    if (!state[ei][si].done) {
      setRestLeft(workout.exercises[ei].rest);
      setRestRunning(true);
    }
  };

  const updateSet = (ei: number, si: number, field: "reps" | "weight", delta: number) => {
    setState((prev) => {
      const copy = prev.map((ex) => ex.map((s) => ({ ...s })));
      copy[ei][si][field] = Math.max(0, copy[ei][si][field] + delta);
      return copy;
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate({ to: "/app/treinos" })} className="rounded-full p-2 hover:bg-elevated">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold">{workout.name}</h1>
          <p className="text-xs text-muted-foreground">{workout.focus}</p>
        </div>
        <div className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-cyan">
          {doneSets}/{totalSets}
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <div className="h-full rounded-full bg-gradient-primary transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="space-y-4">
        {workout.exercises.map((ex, ei) => {
          const info = getExercise(ex.exerciseId);
          if (!info) return null;
          return (
            <div key={ei} className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="flex items-center gap-3 border-b border-border bg-elevated/40 p-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <ExerciseMedia exerciseId={info.id} size="thumb" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link to="/app/exercicio/$id" params={{ id: info.id }} className="font-display text-lg font-semibold">
                    {info.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">{info.muscle} · {info.equipment}</div>
                </div>
                {ex.tag && (
                  <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan">
                    {ex.tag}
                  </span>
                )}
              </div>

              <div className="divide-y divide-border">
                <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Peso</div>
                  <div className="col-span-4">Reps</div>
                  <div className="col-span-3 text-right">✓</div>
                </div>
                {state[ei].map((s, si) => (
                  <div key={si} className={cn("grid grid-cols-12 items-center px-4 py-2.5 text-sm", s.done && "bg-success/5")}>
                    <div className="col-span-1 font-semibold text-muted-foreground">{si + 1}</div>
                    <div className="col-span-4 flex items-center gap-2">
                      <button onClick={() => updateSet(ei, si, "weight", -2.5)} className="grid h-7 w-7 place-items-center rounded-md bg-elevated text-muted-foreground"><Minus className="h-3 w-3" /></button>
                      <span className="min-w-10 text-center font-semibold">{s.weight}</span>
                      <button onClick={() => updateSet(ei, si, "weight", 2.5)} className="grid h-7 w-7 place-items-center rounded-md bg-elevated text-muted-foreground"><Plus className="h-3 w-3" /></button>
                    </div>
                    <div className="col-span-4 flex items-center gap-2">
                      <button onClick={() => updateSet(ei, si, "reps", -1)} className="grid h-7 w-7 place-items-center rounded-md bg-elevated text-muted-foreground"><Minus className="h-3 w-3" /></button>
                      <span className="min-w-8 text-center font-semibold">{s.reps}</span>
                      <button onClick={() => updateSet(ei, si, "reps", 1)} className="grid h-7 w-7 place-items-center rounded-md bg-elevated text-muted-foreground"><Plus className="h-3 w-3" /></button>
                    </div>
                    <div className="col-span-3 flex justify-end">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggle(ei, si)}
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-full border transition",
                          s.done
                            ? "border-success bg-success/20 text-success shadow-glow-cyan"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary",
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Descanso: {ex.rest}s
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {restLeft > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-0 bottom-20 z-40 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-2xl border border-cyan/40 bg-surface/95 p-4 shadow-glow-cyan backdrop-blur lg:bottom-8"
          >
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-cyan" />
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Descanso</div>
                <div className="font-display text-2xl font-bold text-gradient-ai">{restLeft}s</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setRestRunning((r) => !r)} className="grid h-10 w-10 place-items-center rounded-full bg-elevated text-foreground">
                {restRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={() => { setRestLeft(0); setRestRunning(false); }} className="rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                Pular
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
