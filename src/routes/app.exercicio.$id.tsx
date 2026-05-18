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
import { getWorkoutHistory } from "@/lib/workout-history";
import { ExerciseMedia } from "@/components/ExerciseMedia";
import { cleanLegacyText, normalizeText } from "@/lib/formatting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStoredLocale, type AppLocale } from "@/lib/locale";
import { getCategoryLabel, getWorkoutTypeLabel } from "@/lib/training-i18n";
import { getExerciseName, getExerciseBiomechanics, getEquipmentLabel } from "@/lib/exercise-i18n";
import type { OfficialMuscleCategory } from "@/domain/exercises/catalog";

export const Route = createFileRoute("/app/exercicio/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${cleanLegacyText(getExercise(params.id)?.name ?? "Exercício")} | 3D Body Scan` }],
  }),
  component: Detail,
});

const COPY = {
  pt: {
    back: "Voltar", favorite: "Favoritar",
    notFound: "Exercício não encontrado", notFoundDesc: "Este exercício não existe na biblioteca atual.",
    tabs: { alvo: "Alvo", instr: "Instruções", equip: "Equip.", anal: "Análise" },
    mainMuscle: "Músculo principal", movementPattern: "Padrão de movimento",
    primaryFocus: "Foco primário", biomechanics: "Biomecânica",
    equipment: "Equipamento", execution: "Execução",
    movementFocusPre: "Movimento focado em", movementFocusMid: "com ênfase em",
    howToExecute: "Como executar", commonMistakes: "Erros comuns",
    type: "Tipo:", substitutions: "Substituições",
    bestWeight: "Melhor peso", lastVolume: "Último volume", sessions: "Sessões", recordReps: "Recorde reps",
    bodyweight: "Peso corp.", unlockAnalysis: "Faça seu primeiro treino com este exercício para desbloquear a análise.",
  },
  es: {
    back: "Volver", favorite: "Favorito",
    notFound: "Ejercicio no encontrado", notFoundDesc: "Este ejercicio no existe en la biblioteca actual.",
    tabs: { alvo: "Objetivo", instr: "Instrucciones", equip: "Equip.", anal: "Análisis" },
    mainMuscle: "Músculo principal", movementPattern: "Patrón de movimiento",
    primaryFocus: "Foco primario", biomechanics: "Biomecánica",
    equipment: "Equipamiento", execution: "Ejecución",
    movementFocusPre: "Movimiento enfocado en", movementFocusMid: "con énfasis en",
    howToExecute: "Cómo ejecutar", commonMistakes: "Errores comunes",
    type: "Tipo:", substitutions: "Sustituciones",
    bestWeight: "Mejor peso", lastVolume: "Último volumen", sessions: "Sesiones", recordReps: "Récord reps",
    bodyweight: "Peso corp.", unlockAnalysis: "Haz tu primer entrenamiento con este ejercicio para desbloquear el análisis.",
  },
  en: {
    back: "Back", favorite: "Favorite",
    notFound: "Exercise not found", notFoundDesc: "This exercise does not exist in the current library.",
    tabs: { alvo: "Target", instr: "Instructions", equip: "Equip.", anal: "Analysis" },
    mainMuscle: "Primary muscle", movementPattern: "Movement pattern",
    primaryFocus: "Primary focus", biomechanics: "Biomechanics",
    equipment: "Equipment", execution: "Execution",
    movementFocusPre: "Movement focused on", movementFocusMid: "with emphasis on",
    howToExecute: "How to execute", commonMistakes: "Common mistakes",
    type: "Type:", substitutions: "Substitutions",
    bestWeight: "Best weight", lastVolume: "Last volume", sessions: "Sessions", recordReps: "Rep record",
    bodyweight: "Bodyweight", unlockAnalysis: "Complete your first workout with this exercise to unlock the analysis.",
  },
  fr: {
    back: "Retour", favorite: "Favori",
    notFound: "Exercice introuvable", notFoundDesc: "Cet exercice n'existe pas dans la bibliothèque actuelle.",
    tabs: { alvo: "Cible", instr: "Instructions", equip: "Équip.", anal: "Analyse" },
    mainMuscle: "Muscle principal", movementPattern: "Schéma de mouvement",
    primaryFocus: "Focus principal", biomechanics: "Biomécanique",
    equipment: "Équipement", execution: "Exécution",
    movementFocusPre: "Mouvement axé sur", movementFocusMid: "avec emphase sur",
    howToExecute: "Comment exécuter", commonMistakes: "Erreurs courantes",
    type: "Type :", substitutions: "Substitutions",
    bestWeight: "Meilleur poids", lastVolume: "Dernier volume", sessions: "Séances", recordReps: "Record reps",
    bodyweight: "Poids corps", unlockAnalysis: "Faites votre premier entraînement avec cet exercice pour débloquer l'analyse.",
  },
  de: {
    back: "Zurück", favorite: "Favorit",
    notFound: "Übung nicht gefunden", notFoundDesc: "Diese Übung existiert nicht in der aktuellen Bibliothek.",
    tabs: { alvo: "Ziel", instr: "Anleitung", equip: "Ausrüst.", anal: "Analyse" },
    mainMuscle: "Hauptmuskel", movementPattern: "Bewegungsmuster",
    primaryFocus: "Primärfokus", biomechanics: "Biomechanik",
    equipment: "Ausrüstung", execution: "Ausführung",
    movementFocusPre: "Bewegung fokussiert auf", movementFocusMid: "mit Schwerpunkt auf",
    howToExecute: "So ausführen", commonMistakes: "Häufige Fehler",
    type: "Typ:", substitutions: "Ersatzübungen",
    bestWeight: "Bestes Gewicht", lastVolume: "Letztes Volumen", sessions: "Einheiten", recordReps: "Wiederholungsrekord",
    bodyweight: "Körpergewicht", unlockAnalysis: "Absolviere dein erstes Training mit dieser Übung, um die Analyse freizuschalten.",
  },
} as const;

function getMuscleLabel(muscle: string, locale: AppLocale): string {
  const n = normalizeText(cleanLegacyText(muscle));
  if (n.includes("core")) return getCategoryLabel("abdomen_core" as OfficialMuscleCategory, locale);
  if (n.includes("biceps") || n.includes("antebraco")) return getCategoryLabel("biceps_antebraco" as OfficialMuscleCategory, locale);
  if (n.includes("triceps")) return getCategoryLabel("triceps" as OfficialMuscleCategory, locale);
  if (n.includes("costas")) return getCategoryLabel("costas_trapezio" as OfficialMuscleCategory, locale);
  if (n.includes("ombros")) return getCategoryLabel("deltoides" as OfficialMuscleCategory, locale);
  if (n.includes("peito")) return getCategoryLabel("peitoral" as OfficialMuscleCategory, locale);
  if (n.includes("panturrilha")) return getCategoryLabel("panturrilha" as OfficialMuscleCategory, locale);
  if (n.includes("pernas") || n.includes("gluteos")) return getCategoryLabel("membros_inferiores_gluteos" as OfficialMuscleCategory, locale);
  if (n.includes("full body")) return getCategoryLabel("peitoral" as OfficialMuscleCategory, locale);
  return cleanLegacyText(muscle);
}

function buildExerciseStats(exerciseId: string, bodyCopy: string) {
  const history = getWorkoutHistory();
  const sessions = history.filter((w) => w.exercises.some((e) => e.id === exerciseId));
  const allSets = sessions.flatMap((w) =>
    w.exercises.filter((e) => e.id === exerciseId).flatMap((e) => e.sets.filter((s) => s.completed)),
  );

  const weights = allSets.map((s) => s.weight).filter((w) => w > 0);
  const reps = allSets.map((s) => s.reps);
  const bestWeight = weights.length > 0 ? Math.max(...weights) : null;
  const recordReps = reps.length > 0 ? Math.max(...reps) : null;

  const lastSession = sessions[0];
  const lastVolume = lastSession
    ? lastSession.exercises
        .filter((e) => e.id === exerciseId)
        .flatMap((e) => e.sets.filter((s) => s.completed))
        .reduce((sum, s) => sum + s.reps * (s.weight || 1), 0)
    : null;

  return {
    sessionCount: sessions.length,
    bestWeight: bestWeight ? `${bestWeight} kg` : sessions.length > 0 ? bodyCopy : "--",
    lastVolume: lastVolume && lastVolume > 0 ? `${Math.round(lastVolume)}` : "--",
    recordReps: recordReps ? `${recordReps}` : "--",
    hasHistory: sessions.length > 0,
  };
}

function Detail() {
  const { id } = Route.useParams();
  const ex = getExercise(id);
  const navigate = useNavigate();
  const locale = getStoredLocale();
  const copy = COPY[locale] ?? COPY.pt;
  const stats = ex ? buildExerciseStats(ex.id, copy.bodyweight) : null;

  if (!ex) return (
    <div className="space-y-4">
      <button onClick={() => navigate({ to: "/app/exercicios" })} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {copy.back}
      </button>
      <div className="rounded-2xl border border-border bg-surface p-10 text-center space-y-3">
        <div className="text-4xl">🔍</div>
        <div className="font-display text-lg font-semibold">{copy.notFound}</div>
        <p className="text-sm text-muted-foreground">{copy.notFoundDesc}</p>
      </div>
    </div>
  );

  const exerciseName = getExerciseName(ex.id, cleanLegacyText(ex.name), locale);
  const exerciseBio = getExerciseBiomechanics(cleanLegacyText(ex.biomechanics), locale);
  const exerciseEquip = getEquipmentLabel(ex.equipment, locale);
  const muscleLabel = getMuscleLabel(ex.muscle, locale);
  const typeLabel = getWorkoutTypeLabel(ex.type, locale);

  return (
    <div className="space-y-5">
      <div className="relative">
        <ExerciseMedia exerciseId={ex.id} size="hero" className="border border-border" />
        <button
          onClick={() => navigate({ to: "/app/exercicios" })}
          className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur"
          aria-label={copy.back}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur"
          aria-label={copy.favorite}
        >
          <Star className="h-5 w-5" />
        </button>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5">
        <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          {muscleLabel}
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-gradient-brand">{exerciseName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {exerciseBio} | {exerciseEquip}
        </p>
      </div>

      <Tabs defaultValue="alvo" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-full bg-surface p-1">
          <TabsTrigger value="alvo" className="rounded-full text-xs">
            <Target className="mr-1 h-3 w-3" />
            {copy.tabs.alvo}
          </TabsTrigger>
          <TabsTrigger value="instr" className="rounded-full text-xs">
            <BookOpen className="mr-1 h-3 w-3" />
            {copy.tabs.instr}
          </TabsTrigger>
          <TabsTrigger value="equip" className="rounded-full text-xs">
            <Wrench className="mr-1 h-3 w-3" />
            {copy.tabs.equip}
          </TabsTrigger>
          <TabsTrigger value="anal" className="rounded-full text-xs">
            <BarChart3 className="mr-1 h-3 w-3" />
            {copy.tabs.anal}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alvo" className="mt-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="grid gap-4 md:grid-cols-[1fr_250px]">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{copy.mainMuscle}</div>
                <div className="font-display text-xl font-bold text-primary">{muscleLabel}</div>
                <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{copy.movementPattern}</div>
                <div className="text-sm text-foreground/90">{exerciseBio}</div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <MiniStat icon={Target} label={copy.primaryFocus} value={muscleLabel} accent="text-primary" />
                  <MiniStat icon={Zap} label={copy.biomechanics} value={exerciseBio} accent="text-cyan" />
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/12 via-elevated to-cyan/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Target Zone</div>
                    <div className="mt-1 font-display text-lg font-bold">{muscleLabel}</div>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-background/45 text-cyan backdrop-blur">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="rounded-2xl border border-border/80 bg-background/40 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{copy.equipment}</div>
                    <div className="mt-1 text-sm font-semibold text-foreground">{exerciseEquip}</div>
                  </div>
                  <div className="rounded-2xl border border-border/80 bg-background/40 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{copy.execution}</div>
                    <div className="mt-1 text-sm font-semibold text-foreground">{typeLabel}</div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-cyan/20 bg-cyan/8 px-3 py-3 text-xs leading-relaxed text-foreground/85">
                  {copy.movementFocusPre} <span className="font-semibold text-cyan">{muscleLabel}</span>{" "}
                  {copy.movementFocusMid}{" "}
                  <span className="font-semibold text-primary">{exerciseBio.toLowerCase()}</span>.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="instr" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan" />
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider">{copy.howToExecute}</h3>
            </div>
            <ol className="space-y-2">
              {ex.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-elevated text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-foreground/90">{cleanLegacyText(instruction)}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider">{copy.commonMistakes}</h3>
            </div>
            <ul className="space-y-1.5">
              {ex.mistakes.map((mistake, index) => (
                <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-destructive">-</span> {cleanLegacyText(mistake)}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="equip" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{copy.equipment}</div>
            <div className="mt-1 font-display text-xl font-bold">{exerciseEquip}</div>
            <div className="mt-1 text-xs text-muted-foreground">{copy.type} {typeLabel}</div>
          </div>
          {ex.alternatives.length > 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="mb-3 flex items-center gap-2">
                <Repeat className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider">{copy.substitutions}</h3>
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
                      {getExerciseName(alternative.id, cleanLegacyText(alternative.name), locale)}
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
              <Stat label={copy.bestWeight} value={stats?.bestWeight ?? "--"} />
              <Stat label={copy.lastVolume} value={stats?.lastVolume ?? "--"} unit={stats?.lastVolume && stats.lastVolume !== "--" ? "kg" : undefined} />
              <Stat label={copy.sessions} value={String(stats?.sessionCount ?? 0)} />
              <Stat label={copy.recordReps} value={stats?.recordReps ?? "--"} />
            </div>
            {!stats?.hasHistory && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-border bg-elevated/30 px-3 py-3">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-cyan" />
                <p className="text-xs text-muted-foreground">
                  {copy.unlockAnalysis}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-xl border border-border bg-elevated p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-bold text-primary">
        {value}{unit ? <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span> : null}
      </div>
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
