import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, Repeat, BookOpen, Star, Target, Wrench, BarChart3 } from "lucide-react";
import { getExercise } from "@/data/library";
import { ExerciseMedia } from "@/components/ExerciseMedia";
import { MuscleSilhouette } from "@/components/MuscleSilhouette";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/exercicio/$id")({
  head: ({ params }) => ({ meta: [{ title: `${getExercise(params.id)?.name ?? "Exercício"} · ZYROX` }] }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const ex = getExercise(id);
  const navigate = useNavigate();
  if (!ex) return <div>Não encontrado</div>;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative">
        <ExerciseMedia exerciseId={ex.id} size="hero" className="border border-border" />
        <button
          onClick={() => navigate({ to: "/app/exercicios" })}
          className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur"
          aria-label="Favoritar"
        >
          <Star className="h-5 w-5" />
        </button>
      </div>

      {/* Header card */}
      <div className="rounded-3xl border border-border bg-surface p-5">
        <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          {ex.muscle}
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold leading-tight">{ex.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{ex.biomechanics} · {ex.equipment}</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="alvo" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-full bg-surface p-1">
          <TabsTrigger value="alvo" className="rounded-full text-xs"><Target className="mr-1 h-3 w-3" />Alvo</TabsTrigger>
          <TabsTrigger value="instr" className="rounded-full text-xs"><BookOpen className="mr-1 h-3 w-3" />Instruções</TabsTrigger>
          <TabsTrigger value="equip" className="rounded-full text-xs"><Wrench className="mr-1 h-3 w-3" />Equip.</TabsTrigger>
          <TabsTrigger value="anal" className="rounded-full text-xs"><BarChart3 className="mr-1 h-3 w-3" />Análise</TabsTrigger>
        </TabsList>

        <TabsContent value="alvo" className="mt-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Músculo principal</div>
                <div className="font-display text-xl font-bold text-primary">{ex.muscle}</div>
                <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Padrão de movimento</div>
                <div className="text-sm text-foreground/90">{ex.biomechanics}</div>
              </div>
              <div className="h-44 w-28 shrink-0 overflow-hidden rounded-2xl bg-white p-2">
                <MuscleSilhouette muscle={ex.muscle} variant="light" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="instr" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan" />
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider">Como executar</h3>
            </div>
            <ol className="space-y-2">
              {ex.instructions.map((i, k) => (
                <li key={k} className="flex gap-3 text-sm">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-elevated text-xs font-bold text-primary">{k + 1}</span>
                  <span className="text-foreground/90">{i}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider">Erros comuns</h3>
            </div>
            <ul className="space-y-1.5">
              {ex.mistakes.map((m, k) => (
                <li key={k} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-destructive">•</span> {m}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="equip" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Equipamento</div>
            <div className="mt-1 font-display text-xl font-bold">{ex.equipment}</div>
            <div className="mt-1 text-xs text-muted-foreground">Tipo: {ex.type}</div>
          </div>
          {ex.alternatives.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="mb-3 flex items-center gap-2">
                <Repeat className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider">Substituições</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {ex.alternatives.map((a) => {
                  const alt = getExercise(a);
                  if (!alt) return null;
                  return (
                    <Link key={a} to="/app/exercicio/$id" params={{ id: a }} className="rounded-full border border-border bg-elevated px-3 py-1.5 text-xs font-semibold hover:border-primary/40">
                      {alt.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="anal" className="mt-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Melhor peso" value="—" />
              <Stat label="Último volume" value="—" />
              <Stat label="Sessões" value="0" />
              <Stat label="Recorde reps" value="—" />
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Conclua treinos para desbloquear a análise deste exercício.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-elevated p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-bold text-primary">{value}</div>
    </div>
  );
}
