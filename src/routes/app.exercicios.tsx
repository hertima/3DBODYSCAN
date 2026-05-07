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
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Biblioteca</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} exercícios · biomecânica e técnica</p>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:text-primary">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar exercício..."
          className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
        />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden">
        {types.map((t) => (
          <button key={t} onClick={() => setType(t)} className={cn(
            "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
            type === t ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border-border bg-surface text-muted-foreground",
          )}>{t}</button>
        ))}
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden">
        {muscles.map((m) => (
          <button key={m} onClick={() => setMuscle(m)} className={cn(
            "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
            muscle === m ? "border-cyan/60 bg-cyan/15 text-cyan" : "border-border bg-surface text-muted-foreground",
          )}>{m}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((e) => (
          <Link
            key={e.id}
            to="/app/exercicio/$id"
            params={{ id: e.id }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-primary/40 hover:shadow-glow-primary/30"
          >
            <ExerciseMedia exerciseId={e.id} size="card" />
            <button
              type="button"
              onClick={(ev) => { ev.preventDefault(); }}
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-background/70 text-muted-foreground backdrop-blur transition hover:text-primary"
              aria-label="Favoritar"
            >
              <Star className="h-3.5 w-3.5" />
            </button>
            <div className="space-y-1 p-3">
              <div className="line-clamp-2 text-sm font-semibold leading-tight">{e.name}</div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">{e.equipment}</span>
                <span className="rounded-full border border-border px-1.5 py-0.5 font-bold uppercase tracking-wider text-cyan">{e.type === "Musculação" ? "MUSC" : "CALIS"}</span>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center text-sm text-muted-foreground">Nenhum exercício encontrado.</div>}
      </div>
    </div>
  );
}
