import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
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
      <div>
        <h1 className="font-display text-3xl font-bold">Biblioteca</h1>
        <p className="text-sm text-muted-foreground">Biomecânica, instruções, erros comuns e substituições.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar exercício..."
          className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
        />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden">
        {types.map((t) => (
          <button key={t} onClick={() => setType(t)} className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
            type === t ? "border-primary/60 bg-gradient-primary text-primary-foreground" : "border-border bg-surface text-muted-foreground",
          )}>{t}</button>
        ))}
        <span className="mx-1 self-center text-border">|</span>
        {muscles.map((m) => (
          <button key={m} onClick={() => setMuscle(m)} className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
            muscle === m ? "border-cyan/60 bg-cyan/15 text-cyan" : "border-border bg-surface text-muted-foreground",
          )}>{m}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <Link key={e.id} to="/app/exercicio/$id" params={{ id: e.id }}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition hover:border-primary/40 hover:bg-elevated"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-ai text-[10px] font-bold text-background/80">GIF</div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{e.name}</div>
              <div className="truncate text-xs text-muted-foreground">{e.muscle} · {e.equipment}</div>
              <span className="mt-1 inline-block rounded-full border border-border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan">{e.type}</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center text-sm text-muted-foreground">Nenhum exercício encontrado.</div>}
      </div>
    </div>
  );
}
