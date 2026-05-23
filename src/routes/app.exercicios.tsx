import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { loadOnboarding } from "@/lib/onboarding";
import {
  BookOpen,
  Activity,
  Dumbbell,
  Globe2,
  Search,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { ExerciseMedia } from "@/components/ExerciseMedia";
import { libraryExercises, type Exercise } from "@/data/library";
import { useExerciseCatalog } from "@/hooks/use-exercise-catalog";
import { cleanLegacyText, normalizeText } from "@/lib/formatting";
import { getStoredLocale, type AppLocale } from "@/lib/locale";
import {
  getExerciseBiomechanics,
  getEquipmentLabel,
  getExerciseName,
  getMuscleGroupLabel,
} from "@/lib/exercise-i18n";
import { getCategoryLabel, getWorkoutTypeLabel } from "@/lib/training-i18n";
import {
  isFunctionalExerciseRecord,
  type OfficialMuscleCategory,
} from "@/domain/exercises/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/exercicios")({
  head: () => ({
    meta: [
      { title: "Biblioteca | 3D Body Scanner" },
      {
        name: "description",
        content: "Biblioteca de exercícios com biomecânica, instruções e substituições.",
      },
    ],
  }),
  component: Library,
});

const modes = ["Musculacao", "Funcional", "Calistenia"] as const;
type ModeFilter = (typeof modes)[number];
const strengthMuscles = [
  "Abdomen Core",
  "Biceps E Antebraco",
  "Costas E Trapezio",
  "Deltoides",
  "Membros Inferiores E Gluteos",
  "Panturrilha",
  "Peitoral",
  "Triceps",
] as const;
const allMuscle = "Todos" as const;
const muscleOrder = strengthMuscles;
type MuscleFilter = typeof allMuscle | (typeof muscleOrder)[number];

const COPY = {
  pt: { engine: "Biblioteca global", title: "Biblioteca Global 500+ GIFs", subtitle: "Exercícios organizados para montar treinos de musculação, funcional e calistenia.", exercises: "Exercícios", search: "Buscar exercício, equipamento ou movimento...", organized: "Exercícios por modalidade", noResults: "Nenhum exercício encontrado", adjustFilters: "Troque a modalidade, o grupo muscular ou refine a busca.", cataloged: "exercícios disponíveis", thisGroup: "neste grupo", all: "Todos", showing: "exibindo", global: "Para alunos no mundo inteiro", strength: "Musculação", functional: "Funcional", calisthenics: "Calistenia" },
  es: { engine: "Biblioteca global", title: "Biblioteca Global 500+ GIFs", subtitle: "Ejercicios organizados para crear entrenamientos de musculación, funcional y calistenia.", exercises: "Ejercicios", search: "Buscar ejercicio, equipamiento o movimiento...", organized: "Ejercicios por modalidad", noResults: "No se encontraron ejercicios", adjustFilters: "Cambia la modalidad, el grupo muscular o ajusta la búsqueda.", cataloged: "ejercicios disponibles", thisGroup: "en este grupo", all: "Todos", showing: "mostrando", global: "Para alumnos de todo el mundo", strength: "Musculación", functional: "Funcional", calisthenics: "Calistenia" },
  en: { engine: "Global library", title: "Global 500+ GIF Library", subtitle: "Exercises organized for strength, functional, and calisthenics workout generation.", exercises: "Exercises", search: "Search exercise, equipment, or movement...", organized: "Exercises by modality", noResults: "No exercises found", adjustFilters: "Change the modality, muscle group, or refine the search.", cataloged: "available exercises", thisGroup: "in this group", all: "All", showing: "showing", global: "For students worldwide", strength: "Strength", functional: "Functional", calisthenics: "Calisthenics" },
  fr: { engine: "Bibliotheque globale", title: "Bibliotheque Globale 500+ GIFs", subtitle: "Exercices organises pour generer des seances de musculation, fonctionnel et callisthenie.", exercises: "Exercices", search: "Rechercher exercice, equipement ou mouvement...", organized: "Exercices par modalite", noResults: "Aucun exercice trouve", adjustFilters: "Changez la modalite, le groupe musculaire ou affinez la recherche.", cataloged: "exercices disponibles", thisGroup: "dans ce groupe", all: "Tous", showing: "affichage", global: "Pour des eleves dans le monde entier", strength: "Musculation", functional: "Fonctionnel", calisthenics: "Callisthenie" },
  de: { engine: "Globale Bibliothek", title: "Globale 500+ GIF Bibliothek", subtitle: "Ubungen fur Trainingsplane in Krafttraining, funktionellem Training und Calisthenics.", exercises: "Ubungen", search: "Suche nach Ubung, Equipment oder Bewegung...", organized: "Ubungen nach Modalitat", noResults: "Keine Ubungen gefunden", adjustFilters: "Wechsle Modalitat, Muskelgruppe oder verfeinere die Suche.", cataloged: "verfugbare Ubungen", thisGroup: "in dieser Gruppe", all: "Alle", showing: "anzeige", global: "Fur Schuler weltweit", strength: "Krafttraining", functional: "Funktionell", calisthenics: "Calisthenics" },
} as const;

const normalize = (value: string) => normalizeText(value);
const displayValue = (value: string) => cleanLegacyText(value);

function getModeLabel(mode: ModeFilter | string, locale: AppLocale): string {
  const labels: Record<ModeFilter, Partial<Record<AppLocale, string>>> = {
    Musculacao: {
      pt: "Musculação",
      es: "Musculación",
      en: "Strength",
      fr: "Musculation",
      de: "Krafttraining",
    },
    Calistenia: {
      pt: "Calistenia",
      es: "Calistenia",
      en: "Calisthenics",
      fr: "Callisthénie",
      de: "Calisthenics",
    },
    Funcional: {
      pt: "Funcional",
      es: "Funcional",
      en: "Functional",
      fr: "Fonctionnel",
      de: "Funktionell",
    },
  };

  return labels[mode as ModeFilter]?.[locale] ?? labels[mode as ModeFilter]?.pt ?? mode;
}

function getCatalogMuscleLabel(category: string): (typeof strengthMuscles)[number] {
  if (category === "abdomen_core") return "Abdomen Core";
  if (category === "biceps_antebraco") return "Biceps E Antebraco";
  if (category === "costas_trapezio") return "Costas E Trapezio";
  if (category === "deltoides") return "Deltoides";
  if (category === "membros_inferiores_gluteos") return "Membros Inferiores E Gluteos";
  if (category === "panturrilha") return "Panturrilha";
  if (category === "peitoral") return "Peitoral";
  return "Triceps";
}

const muscleGroupKeyMap: Record<string, OfficialMuscleCategory> = {
  "Abdomen Core": "abdomen_core",
  "Biceps E Antebraco": "biceps_antebraco",
  "Costas E Trapezio": "costas_trapezio",
  "Deltoides": "deltoides",
  "Membros Inferiores E Gluteos": "membros_inferiores_gluteos",
  "Panturrilha": "panturrilha",
  "Peitoral": "peitoral",
  "Triceps": "triceps",
};

function getMuscleGroupSectionLabel(muscle: string, locale: AppLocale): string {
  const category = muscleGroupKeyMap[muscle];
  if (!category) return muscle;
  return getCategoryLabel(category, locale);
}

function Library() {
  const locale = getStoredLocale();
  const copy = COPY[locale] ?? COPY.pt;
  const catalog = useExerciseCatalog();
  const catalogById = useMemo(
    () => new Map(catalog.map((record) => [record.id, record])),
    [catalog],
  );
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<ModeFilter>("Musculacao");
  const [muscle, setMuscle] = useState<MuscleFilter>(allMuscle);
  const muscles = strengthMuscles;

  useEffect(() => {
    if (muscle !== allMuscle && !muscles.includes(muscle as never)) {
      setMuscle(allMuscle);
    }
  }, [muscle, muscles]);

  const stats = useMemo(() => {
    const strengthCount = catalog.filter(
      (record) => record.trainingType === "musculacao",
    ).length;
    const calisthenicsCount = catalog.filter(
      (record) => record.trainingType === "calistenia",
    ).length;
    const functionalCount = catalog.filter(isFunctionalExerciseRecord).length;

    return {
      total: catalog.length,
      strengthCount,
      functionalCount,
      calisthenicsCount,
    };
  }, [catalog]);

  const filtered = useMemo(
    () =>
      libraryExercises.filter((exercise) => {
        const record = catalogById.get(exercise.id);
        if (!record) return false;

        const normalizedQuery = normalize(q);
        const haystack = [
          exercise.name,
          exercise.equipment,
          exercise.biomechanics,
          exercise.sourceGroup ?? "",
          record.name.pt,
          record.aliases.join(" "),
          record.movementPattern.pt,
          record.equipment,
          record.category,
          getCatalogMuscleLabel(record.category),
        ].map(normalize).join(" ");

        // Com query ativa: busca em todo o catálogo, ignora modo e músculo
        if (q !== "") return haystack.includes(normalizedQuery);

        const modeMatches =
          mode === "Funcional"
            ? isFunctionalExerciseRecord(record)
            : record.trainingType === normalize(mode);
        const muscleMatches =
          muscle === allMuscle || getCatalogMuscleLabel(record.category) === muscle;

        return modeMatches && muscleMatches;
      }),
    [q, mode, muscle, catalogById],
  );

  const groupedSections = useMemo(() => {
    const modeSections = [mode];

    return modeSections
      .map((sectionMode) => {
        const itemsForMode =
          sectionMode === "Funcional"
            ? filtered
            : filtered.filter((exercise) => {
                const record = catalogById.get(exercise.id);
                return record ? record.trainingType === normalize(sectionMode) : false;
              });

        const groups = muscles
          .map((currentMuscle) => ({
            muscle: currentMuscle,
            items: itemsForMode.filter((exercise) => {
              const record = catalogById.get(exercise.id);
              return record ? getCatalogMuscleLabel(record.category) === currentMuscle : false;
            }),
          }))
          .filter((group) => group.items.length > 0);

        return {
          type: sectionMode,
          total: itemsForMode.length,
          groups,
        };
      })
      .filter((section) => section.total > 0);
  }, [filtered, muscles, mode, catalogById]);

  return (
    <div className="space-y-5 pb-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-surface p-5 shadow-elevated">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.78_0.14_220_/_0.16),transparent_38%),radial-gradient(circle_at_bottom_left,oklch(0.74_0.17_53_/_0.18),transparent_36%)]" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan">
                <BookOpen className="h-3 w-3" />
                {copy.engine}
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-gradient-brand">
                {copy.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {copy.subtitle}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/35 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
                <Globe2 className="h-3.5 w-3.5 text-cyan" />
                {[copy.global, getModeLabel(mode, locale)].join(" | ")}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <TopStat
              icon={BookOpen}
              value={`${stats.total}`}
              label={copy.exercises}
              accent="text-primary"
            />
            <TopStat
              icon={Dumbbell}
              value={`${stats.strengthCount}`}
              label={copy.strength}
              accent="text-success"
            />
            <TopStat
              icon={Activity}
              value={`${stats.functionalCount}`}
              label={copy.functional}
              accent="text-cyan"
            />
            <TopStat
              icon={Sparkles}
              value={`${stats.calisthenicsCount}`}
              label={copy.calisthenics}
              accent="text-primary"
            />
          </div>
        </div>
      </section>


      <section className="rounded-3xl border border-border bg-surface p-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={copy.search}
              className="w-full rounded-2xl border border-border bg-elevated/60 py-3 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary/40"
            />
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-2xl border border-border bg-elevated/35 p-1">
            {modes.map((currentMode) => (
              <button
                key={currentMode}
                onClick={() => setMode(currentMode)}
                className={cn(
                  "rounded-xl px-2 py-2 text-xs font-semibold transition",
                  mode === currentMode
                    ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {getModeLabel(currentMode, locale)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {[allMuscle, ...muscles].map((currentMuscle) => (
              <button
                key={currentMuscle}
                onClick={() => setMuscle(currentMuscle)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
                  muscle === currentMuscle
                    ? "border-cyan/60 bg-cyan/15 text-cyan"
                    : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
                )}
              >
                {currentMuscle === allMuscle ? copy.all : getMuscleGroupSectionLabel(currentMuscle, locale)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">{copy.organized}</h2>
            <p className="text-xs text-muted-foreground">
              {copy.showing} {filtered.length} / {stats.total} {copy.cataloged}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {groupedSections.map((section) => (
            <div key={section.type} className="space-y-4">
              {groupedSections.length > 1 ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
                  <div>
                    <div className="font-display text-lg font-semibold">{getModeLabel(section.type, locale)}</div>
                    <div className="text-xs text-muted-foreground">
                      {section.total} {copy.exercises.toLowerCase()}
                    </div>
                  </div>
                  <span className="rounded-full bg-elevated px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/80">
                    {getModeLabel(section.type, locale)}
                  </span>
                </div>
              ) : null}

              {section.groups.map((group) => (
                <div key={`${section.type}-${group.muscle}`} className="space-y-3">
                  <div>
                    <h3 className="font-display text-base font-semibold">{getMuscleGroupSectionLabel(group.muscle, locale)}</h3>
                    <p className="text-xs text-muted-foreground">
                      {group.items.length} {copy.exercises.toLowerCase()} {copy.thisGroup}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((exercise) => (
                      <ExerciseCard key={exercise.id} exercise={exercise} locale={locale} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface/50 p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-elevated text-cyan">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">{copy.noResults}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {copy.adjustFilters}
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function TopStat({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: typeof BookOpen;
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/35 p-3 backdrop-blur">
      <Icon className={cn("h-4 w-4", accent)} />
      <div className="mt-2 font-display text-xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
    </div>
  );
}

function ExerciseCard({ exercise, locale }: { exercise: Exercise; locale: AppLocale }) {
  return (
    <Link
      to="/app/exercicio/$id"
      params={{ id: exercise.id }}
      className="group overflow-hidden rounded-3xl border border-border bg-surface transition hover:border-primary/35 hover:shadow-elevated active:scale-[0.99]"
    >
      <div className="relative">
        <ExerciseMedia exerciseId={exercise.id} size="card" className="rounded-none" />
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-border bg-background/65 text-muted-foreground backdrop-blur transition hover:text-primary"
          aria-label="Favoritar"
        >
          <Star className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base font-semibold leading-tight">
              {getExerciseName(exercise.id, displayValue(exercise.name), locale)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {getExerciseBiomechanics(displayValue(exercise.biomechanics), locale)}
            </div>
          </div>
          <div className="rounded-full bg-elevated px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/80">
            {getWorkoutTypeLabel(exercise.type, locale)}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
            {getMuscleGroupLabel(exercise.muscle, locale)}
          </span>
          <span className="rounded-full bg-background/50 px-2.5 py-1 text-muted-foreground">
            {getEquipmentLabel(exercise.equipment, locale)}
          </span>
        </div>
      </div>
    </Link>
  );
}
