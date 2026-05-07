import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star, SlidersHorizontal } from "lucide-react";
import { exercises } from "@/data/library";
import { ExerciseMedia } from "@/components/ExerciseMedia";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/exercicios")({
  head: () => ({ meta: [{ title: "Biblioteca · ZYROX" }, { name: "description", content: "Mais de 500 exercícios com biomecânica, instruções e substituições." }] }),
  component: Library,
});

const types = ["Todos", "Musculação", "Calistenia"] as const;
const muscles = ["Todos", "Peito", "Costas", "Ombros", "Bíceps", "Tríceps", "Pernas", "Glúteos", "Core"] as const;

function Library() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("Todos");
  const [muscle, setMuscle] = useState<(typeof muscles)[number]>("Todos");

  const filtered = useMemo(() => exercises.filter((e) =>
    (type === "Todos" || e.type === type) &&
    (muscle === "Todos" || e.muscle === muscle) &&
    (q === "" || e.name.toLowerCase().includes(q.toLowerCase())),
  ), [q, type, muscle]);

  return (
    <div className="w-full max-w-full space-y-3 overflow-x-hidden">
      <div className="flex min-w-0 items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold">Biblioteca</h1>
          <p className="truncate text-xs text-muted-foreground">{filtered.length} exercícios · biomecânica e técnica</p>
        </div>
        <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:text-primary">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar exercício..."
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
        />
      </div>

      <div className="grid w-full min-w-0 grid-cols-3 gap-1 rounded-xl border border-border bg-surface p-1">
        {types.map((t) => (
          <button key={t} onClick={() => setType(t)} className={cn(
            "min-w-0 truncate rounded-lg px-1 py-1.5 text-[11px] font-semibold transition",
            type === t ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "text-muted-foreground",
          )}>{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {muscles.map((m) => (
          <button key={m} onClick={() => setMuscle(m)} className={cn(
            "min-w-0 truncate rounded-lg border px-1.5 py-1 text-[10px] font-semibold transition",
            muscle === m ? "border-cyan/60 bg-cyan/15 text-cyan" : "border-border bg-surface text-muted-foreground",
          )}>{m}</button>
        ))}
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        {filtered.map((e) => (
          <Link
            key={e.id}
            to="/app/exercicio/$id"
            params={{ id: e.id }}
            className="group grid min-w-0 grid-cols-[48px_minmax(0,1fr)_44px] items-center gap-2 rounded-xl border border-border bg-surface p-2 transition hover:border-primary/40 active:scale-[0.99]"
          >
            <div className="h-12 w-12 overflow-hidden rounded-lg">
              <ExerciseMedia exerciseId={e.id} size="thumb" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold leading-tight">{e.name}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="shrink-0 rounded-full bg-elevated px-1.5 py-0.5 font-semibold text-foreground/80">{e.muscle}</span>
                <span>·</span>
                <span className="truncate">{e.equipment}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={(ev) => { ev.preventDefault(); }}
              className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground hover:text-primary"
              aria-label="Favoritar"
            >
              <Star className="h-3.5 w-3.5" />
            </button>
          </Link>
        ))}
        {filtered.length === 0 && <div className="text-center text-sm text-muted-foreground">Nenhum exercício encontrado.</div>}
      </div>
    </div>
  );
}
