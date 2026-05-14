import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Clock3,
  Flame,
  Play,
  Plus,
  RefreshCcw,
  Sparkles,
  Target,
  TimerReset,
  Trash2,
  Zap,
} from "lucide-react";
import { AIInsightCard } from "@/components/AIInsightCard";
import { ExerciseMedia } from "@/components/ExerciseMedia";
import { getExercise } from "@/data/library";
import { useAIInsights } from "@/hooks/use-ai-insights";
import { useExerciseCatalog } from "@/hooks/use-exercise-catalog";
import { useTrainingState } from "@/hooks/use-training-state";
import {
  type WorkoutCustomizationState,
  validateWorkoutCustomization,
} from "@/domain/training/customization";
import { getGeneratedWorkout } from "@/domain/training/engine";
import { cleanLegacyText } from "@/lib/formatting";
import { getWorkoutTypeLabel } from "@/lib/training-i18n";
import {
  clearWorkoutCustomization,
  getWorkoutCustomization,
  saveWorkoutCustomization,
} from "@/lib/workout-customizations";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/treino/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${getGeneratedWorkout(params.id)?.name ?? "Treino"} | 3D Body Scan` }],
  }),
  component: WorkoutDetailPage,
});

function formatDisplayValue(value: string, kind: "text" | "type" = "text") {
  const cleaned = cleanLegacyText(value);
  return kind === "type" ? getWorkoutTypeLabel(cleaned) : cleaned;
}

function normalizeText(value: string) {
  return cleanLegacyText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function WorkoutDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const exerciseListRef = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const trainingState = useTrainingState();
  const baseWorkout = getGeneratedWorkout(id, { applyCustomizations: false });
  const workout = getGeneratedWorkout(id);
  const catalog = useExerciseCatalog();
  const catalogById = useMemo(
    () => new Map(catalog.map((record) => [record.id, record])),
    [catalog],
  );
  const storedCustomization = revision >= 0 ? getWorkoutCustomization(id) : null;

  if (!workout || !baseWorkout) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-5">
        <h1 className="font-display text-xl font-bold">Treino não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O treino solicitado não existe na biblioteca atual.
        </p>
      </div>
    );
  }

  const profile = trainingState.profile;
  const environment = trainingState.environment;
  const currentPeriodWeek =
    trainingState.periodization.weeks[trainingState.periodization.currentWeek - 1];
  const aiRecommendations = useAIInsights(trainingState);

  const supportsProfileEquipment = (equipment: string) => {
    if (profile.equipment.length === 0) return true;

    const equipmentMap: Record<string, string[]> = {
      barra: ["barras", "barra"],
      halteres: ["halteres", "halter"],
      cabos: ["cabos", "cabo"],
      maquina: ["maquinas", "maquina"],
      peso_corporal: ["peso corporal"],
      barra_fixa: ["barra fixa"],
      paralelas: ["paralelas"],
      parede: ["parede"],
      banco: ["banco"],
      trx: ["trx"],
      bola: ["bola"],
      elastico: ["elasticos", "elastico"],
    };

    const accepted = equipmentMap[equipment] ?? [equipment];
    const normalizedEquipment = profile.equipment.map(normalizeText);
    return accepted.some((candidate) => normalizedEquipment.includes(normalizeText(candidate)));
  };

  const supportsEnvironment = (equipment: string, trainingType: "musculacao" | "calistenia") => {
    if (environment.location === "outdoor") {
      return (
        trainingType === "calistenia" &&
        ["peso_corporal", "barra_fixa", "paralelas", "parede", "trx"].includes(equipment)
      );
    }

    if (environment.location === "casa") {
      return equipment !== "maquina" && equipment !== "cabos";
    }

    return true;
  };

  const commitCustomization = (nextCustomization: WorkoutCustomizationState | null) => {
    if (!nextCustomization || nextCustomization.edits.length === 0) {
      clearWorkoutCustomization(id);
      setFeedback("Treino restaurado para a versão original.");
      setRevision((value) => value + 1);
      return;
    }

    const validation = validateWorkoutCustomization(baseWorkout, nextCustomization);
    if (!validation.valid) {
      setFeedback(validation.issues[0] ?? "Não foi possível aplicar a customização.");
      return;
    }

    saveWorkoutCustomization(nextCustomization);
    setFeedback("Treino personalizado com sucesso.");
    setRevision((value) => value + 1);
  };

  const appendEdit = (edit: WorkoutCustomizationState["edits"][number]) => {
    const nextCustomization: WorkoutCustomizationState = {
      workoutId: id,
      edits: [...(storedCustomization?.edits ?? []), edit],
      updatedAt: new Date().toISOString(),
    };
    commitCustomization(nextCustomization);
  };

  const getCompatibleAlternatives = (exerciseId: string) => {
    const currentRecord = catalogById.get(exerciseId);
    if (!currentRecord) return [];

    const usedIds = new Set(workout.exercises.map((item) => item.exerciseId));
    return catalog.filter((record) => {
      if (record.id === exerciseId) return false;
      if (usedIds.has(record.id)) return false;
      if (record.category !== currentRecord.category) return false;
      if (record.trainingType !== currentRecord.trainingType) return false;
      if (!supportsProfileEquipment(record.equipment)) return false;
      if (!supportsEnvironment(record.equipment, record.trainingType)) return false;
      return record.status === "active";
    });
  };

  const getSuggestedAddRecord = () => {
    const currentCategories = new Set(
      workout.exercises.map((item) => catalogById.get(item.exerciseId)?.category).filter(Boolean),
    );
    const usedIds = new Set(workout.exercises.map((item) => item.exerciseId));

    return (
      catalog.find((record) => {
        if (usedIds.has(record.id)) return false;
        if (!currentCategories.has(record.category)) return false;
        if (!supportsProfileEquipment(record.equipment)) return false;
        if (!supportsEnvironment(record.equipment, record.trainingType)) return false;
        return record.status === "active";
      }) ?? null
    );
  };

  const previewValidation = storedCustomization
    ? validateWorkoutCustomization(baseWorkout, storedCustomization)
    : { valid: true, issues: [] };

  const totalSets = workout.exercises.reduce((acc, item) => acc + item.sets.length, 0);
  const totalReps = workout.exercises.reduce(
    (acc, item) => acc + item.sets.reduce((sum, set) => sum + set.reps, 0),
    0,
  );
  const totalLoad = workout.exercises.reduce(
    (acc, item) => acc + item.sets.reduce((sum, set) => sum + set.reps * set.weight, 0),
    0,
  );
  const averageRest = Math.round(
    workout.exercises.reduce((acc, item) => acc + item.rest, 0) / workout.exercises.length,
  );

  const handleStartWorkout = () => {
    setStarted(true);
    exerciseListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: "/app/treinos" })}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">
            Treino em destaque
          </p>
          <h1 className="font-display text-2xl font-bold text-gradient-brand">{workout.name}</h1>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-surface p-4 shadow-elevated sm:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.74_0.17_53_/_0.18),transparent_34%),radial-gradient(circle_at_bottom_left,oklch(0.78_0.14_220_/_0.14),transparent_36%)]" />
        <div className="relative">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                <Flame className="h-3 w-3" />
                Workout protocol
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold sm:mt-3 sm:text-3xl">
                {workout.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:mt-2">
                {formatDisplayValue(workout.focus)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
                <span className="rounded-full bg-cyan/10 px-2 py-1 text-cyan">
                  Semana {trainingState.periodization.currentWeek}/12
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                  {currentPeriodWeek?.phase ?? "base"}
                </span>
                <span className="rounded-full bg-success/10 px-2 py-1 text-success">
                  {trainingState.periodization.modality}
                </span>
              </div>
            </div>

            <button
              onClick={handleStartWorkout}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary sm:px-6 sm:py-3"
            >
              <Play className="h-4 w-4" />
              {started ? "Treino iniciado" : "Iniciar treino"}
            </button>
          </div>

          <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
            <InfoCard icon={Clock3} label="Duração" value={`${workout.duration} min`} />
            <InfoCard icon={Target} label="Exercícios" value={`${workout.exercises.length}`} />
            <InfoCard icon={TimerReset} label="Descanso médio" value={`${averageRest}s`} />
            <InfoCard
              icon={Zap}
              label="Volume total"
              value={`${Math.round(totalLoad / 1000)}k kg`}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-border bg-surface p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan">
            Leitura do bloco
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold">
            Semana {trainingState.periodization.currentWeek} do ciclo atual
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {trainingState.periodization.summary.shortTerm}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{currentPeriodWeek?.emphasis}</p>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan">
            Ajuste estratégico
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold">Direção profissional</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {trainingState.periodization.adjustments.recoveryBias}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {trainingState.periodization.adjustments.splitBias}
          </p>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan">
                Resumo rápido
              </div>
              <h3 className="mt-1 font-display text-lg font-semibold">Métricas da sessão</h3>
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Planejado
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <MetricCard label="Séries" value={`${totalSets}`} />
            <MetricCard label="Repetições" value={`${totalReps}`} />
            <MetricCard label="Tipo" value={formatDisplayValue(workout.type, "type")} />
          </div>
        </div>

        <AIInsightCard className="h-full">
          <span className="font-semibold">{aiRecommendations.primary.title}:</span>{" "}
          {aiRecommendations.primary.message}
        </AIInsightCard>
      </div>

      <section className="rounded-3xl border border-border bg-surface p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan">
              Customização do treino
            </div>
            <h2 className="mt-1 font-display text-lg font-semibold">
              Ajuste sem perder a coerência
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Troque, remova, adicione ou reordene exercícios mantendo o treino alinhado com
              categoria e ambiente.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const suggestedRecord = getSuggestedAddRecord();
                if (!suggestedRecord) {
                  setFeedback("Não encontrei exercício compatível para adicionar agora.");
                  return;
                }

                appendEdit({
                  type: "add_exercise",
                  workoutId: id,
                  exerciseId: suggestedRecord.id,
                  reason: "adicao_manual",
                });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-2 text-xs font-semibold text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              Adicionar exercício
            </button>

            <button
              type="button"
              onClick={() => commitCustomization(null)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-2 text-xs font-semibold text-muted-foreground"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Restaurar treino
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
              previewValidation.valid ? "bg-success/10 text-success" : "bg-primary/10 text-primary",
            )}
          >
            {previewValidation.valid ? "Customização válida" : "Revisão recomendada"}
          </span>
          {feedback ? (
            <span className="rounded-full bg-cyan/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan">
              {feedback}
            </span>
          ) : null}
        </div>
      </section>

      <div ref={exerciseListRef} className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Blocos do treino</h2>
            <p className="text-xs text-muted-foreground">
              Ordem pronta para executar sem sair da tela
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-cyan" />
            Coach mode
          </div>
        </div>

        {workout.exercises.map((item, index) => {
          const exercise = getExercise(item.exerciseId);
          if (!exercise) return null;

          const exerciseVolume = item.sets.reduce((sum, set) => sum + set.reps * set.weight, 0);

          return (
            <div
              key={item.exerciseId}
              className="overflow-hidden rounded-[2rem] border border-border bg-surface transition hover:border-primary/25"
            >
              <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
                <ExerciseMedia
                  exerciseId={exercise.id}
                  size="card"
                  className="rounded-none lg:h-full lg:aspect-auto"
                />
                <div className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan">
                        Exercício {index + 1}
                      </div>
                      <h3 className="mt-1 text-xl font-semibold">{exercise.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{exercise.biomechanics}</p>
                    </div>

                    <Link
                      to="/app/exercicio/$id"
                      params={{ id: exercise.id }}
                      className="inline-flex items-center justify-center rounded-full border border-border bg-elevated px-3 py-1.5 text-[11px] font-semibold text-foreground"
                    >
                      Ver exercício
                    </Link>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const alternatives = getCompatibleAlternatives(exercise.id);
                        if (alternatives.length === 0) {
                          setFeedback("Não encontrei substituição compatível para esse exercício.");
                          return;
                        }

                        appendEdit({
                          type: "replace_exercise",
                          workoutId: id,
                          fromExerciseId: exercise.id,
                          toExerciseId: alternatives[0].id,
                          reason: "substituicao_manual",
                        });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      Substituir
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        appendEdit({
                          type: "reorder_exercise",
                          workoutId: id,
                          exerciseId: exercise.id,
                          newOrder: Math.max(index - 1, 0),
                        })
                      }
                      disabled={index === 0}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground disabled:opacity-40"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                      Subir
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        appendEdit({
                          type: "reorder_exercise",
                          workoutId: id,
                          exerciseId: exercise.id,
                          newOrder: Math.min(index + 1, workout.exercises.length - 1),
                        })
                      }
                      disabled={index === workout.exercises.length - 1}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground disabled:opacity-40"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                      Descer
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        appendEdit({
                          type: "remove_exercise",
                          workoutId: id,
                          exerciseId: exercise.id,
                          reason: "remocao_manual",
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remover
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                      {formatDisplayValue(exercise.muscle)}
                    </span>
                    <span className="rounded-full bg-background/50 px-2.5 py-1 text-muted-foreground">
                      Descanso {item.rest}s
                    </span>
                    <span className="rounded-full bg-cyan/10 px-2.5 py-1 text-cyan">
                      Volume {Math.round(exerciseVolume)} kg
                    </span>
                    {item.tag ? (
                      <span className="rounded-full bg-elevated px-2.5 py-1 text-foreground/80">
                        {item.tag}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 grid gap-2">
                    {item.sets.map((set, setIndex) => (
                      <div
                        key={`${item.exerciseId}-${setIndex}`}
                        className="grid grid-cols-[72px_1fr_auto] items-center gap-3 rounded-2xl border border-border bg-elevated/40 px-3 py-2 text-sm"
                      >
                        <span className="rounded-full bg-background/50 px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan">
                          Série {setIndex + 1}
                        </span>
                        <span className="font-medium text-foreground">
                          {set.reps} repetições planejadas
                        </span>
                        <span className="font-display text-base font-bold text-primary">
                          {set.weight} kg
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/35 p-2.5 backdrop-blur sm:p-3">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground sm:text-base">{value}</div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-elevated/40 p-3">
      <div className="break-words text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 break-words font-display text-lg font-bold leading-tight text-foreground sm:text-xl">
        {value}
      </div>
    </div>
  );
}






