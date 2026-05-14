import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Repeat,
  Sparkles,
  Star,
  Target,
  Wrench,
  Zap,
} from "lucide-react";
import { getExercise } from "@/data/library";
import { ExerciseMedia } from "@/components/ExerciseMedia";
import { cleanLegacyText, normalizeText } from "@/lib/formatting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/exercicio/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${cleanLegacyText(getExercise(params.id)?.name ?? "Exercício")} | 3D Body Scan` }],
  }),
  component: Detail,
});

const normalize = (value: string) => normalizeText(value);
const displayValue = (value: string) => cleanLegacyText(value);

function formatMuscleLabel(value: string) {
  const normalized = normalize(displayValue(value));

  if (normalized.includes("core")) return "Abdomen Core";
  if (normalized.includes("biceps") || normalized.includes("antebraco")) return "Biceps E Antebraco";
  if (normalized.includes("triceps")) return "Triceps";
  if (normalized.includes("costas")) return "Costas E Trapezio";
  if (normalized.includes("ombros")) return "Deltoides";
  if (normalized.includes("peito")) return "Peitoral";
  if (normalized.includes("panturrilha")) return "Panturrilha";
  if (normalized.includes("pernas") || normalized.includes("gluteos")) return "Membros Inferiores E Gluteos";

  return displayValue(value);
}

function formatTypeLabel(value: string) {
  return normalize(displayValue(value)).includes("calisten") ? "Calistenia" : "Musculacao";
}

function Detail() {
  const { id } = Route.useParams();
  const ex = getExercise(id);
  const navigate = useNavigate();

  if (!ex) return <div>Não encontrado</div>;

  return (
    <div className="space-y-5">
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

      <div className="rounded-3xl border border-border bg-surface p-5">
        <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          {formatMuscleLabel(ex.muscle)}
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-gradient-brand">{displayValue(ex.name)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {displayValue(ex.biomechanics)} | {displayValue(ex.equipment)}
        </p>
      </div>

      <Tabs defaultValue="alvo" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-full bg-surface p-1">
          <TabsTrigger value="alvo" className="rounded-full text-xs">
            <Target className="mr-1 h-3 w-3" />
            Alvo
          </TabsTrigger>
          <TabsTrigger value="instr" className="rounded-full text-xs">
            <BookOpen className="mr-1 h-3 w-3" />
            Instruções
          </TabsTrigger>
          <TabsTrigger value="equip" className="rounded-full text-xs">
            <Wrench className="mr-1 h-3 w-3" />
            Equip.
          </TabsTrigger>
          <TabsTrigger value="anal" className="rounded-full text-xs">
            <BarChart3 className="mr-1 h-3 w-3" />
            Análise
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alvo" className="mt-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="grid gap-4 md:grid-cols-[1fr_250px]">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Músculo principal</div>
                <div className="font-display text-xl font-bold text-primary">{formatMuscleLabel(ex.muscle)}</div>
                <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Padrão de movimento</div>
                <div className="text-sm text-foreground/90">{displayValue(ex.biomechanics)}</div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <MiniStat icon={Target} label="Foco primário" value={formatMuscleLabel(ex.muscle)} accent="text-primary" />
                  <MiniStat icon={Zap} label="Biomecânica" value={displayValue(ex.biomechanics)} accent="text-cyan" />
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/12 via-elevated to-cyan/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Target Zone</div>
                    <div className="mt-1 font-display text-lg font-bold">{formatMuscleLabel(ex.muscle)}</div>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-background/45 text-cyan backdrop-blur">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="rounded-2xl border border-border/80 bg-background/40 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Equipamento</div>
                    <div className="mt-1 text-sm font-semibold text-foreground">{displayValue(ex.equipment)}</div>
                  </div>
                  <div className="rounded-2xl border border-border/80 bg-background/40 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Execução</div>
                    <div className="mt-1 text-sm font-semibold text-foreground">{formatTypeLabel(ex.type)}</div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-cyan/20 bg-cyan/8 px-3 py-3 text-xs leading-relaxed text-foreground/85">
                  Movimento focado em <span className="font-semibold text-cyan">{formatMuscleLabel(ex.muscle)}</span> com enfase em{" "}
                  <span className="font-semibold text-primary">{displayValue(ex.biomechanics).toLowerCase()}</span>.
                </div>
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
              {ex.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-elevated text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-foreground/90">{displayValue(instruction)}</span>
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
              {ex.mistakes.map((mistake, index) => (
                <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-destructive">-</span> {displayValue(mistake)}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="equip" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Equipamento</div>
            <div className="mt-1 font-display text-xl font-bold">{displayValue(ex.equipment)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Tipo: {formatTypeLabel(ex.type)}</div>
          </div>
          {ex.alternatives.length > 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="mb-3 flex items-center gap-2">
                <Repeat className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider">Substituições</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {ex.alternatives.map((alternativeId) => {
                  const alternative = getExercise(alternativeId);
                  if (!alternative) return null;

                  return (
                    <a
                      key={alternativeId}
                      href={`/app/exercicio/${alternativeId}`}
                      className="rounded-full border border-border bg-elevated px-3 py-1.5 text-xs font-semibold hover:border-primary/40"
                    >
                      {displayValue(alternative.name)}
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="anal" className="mt-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Melhor peso" value="--" />
              <Stat label="Último volume" value="--" />
              <Stat label="Sessões" value="0" />
              <Stat label="Recorde reps" value="--" />
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

function MiniStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-elevated/50 p-3">
      <Icon className={`h-4 w-4 ${accent}`} />
      <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
