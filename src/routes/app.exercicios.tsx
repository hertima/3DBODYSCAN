import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { ExerciseMedia } from "@/components/ExerciseMedia";
import { libraryExercises, type Exercise } from "@/data/library";
import { useExerciseCatalog } from "@/hooks/use-exercise-catalog";
import { useTrainingState } from "@/hooks/use-training-state";
import { cleanLegacyText, normalizeText } from "@/lib/formatting";
import { getStoredLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/exercicios")({
  head: () => ({
    meta: [
      { title: "Biblioteca | 3D Body Scan" },
      {
        name: "description",
        content: "Biblioteca de exercícios com biomecânica, instruções e substituições.",
      },
    ],
  }),
  component: Library,
});

const types = ["Musculacao", "Calistenia", "Hibrido"] as const;
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
const muscleOrder = strengthMuscles;

const COPY = {
  pt: { engine: "Exercise Engine", title: "Biblioteca 3D Body Scan", subtitle: "Explore movimentos por grupo muscular, equipamento e estilo de treino com uma navegação mais visual.", exercises: "Exercícios", keyGroups: "Grupos-chave", search: "Buscar exercício, padrão de movimento ou foco...", organized: "Biblioteca organizada", noResults: "Nenhum exercício encontrado", adjustFilters: "Ajuste a busca ou troque os filtros para ampliar a biblioteca exibida.", cataloged: "exercícios catalogados", thisGroup: "neste grupo" },
  es: { engine: "Exercise Engine", title: "Biblioteca 3D Body Scan", subtitle: "Explora movimientos por grupo muscular, equipamiento y estilo de entrenamiento con una navegacion mas visual.", exercises: "Ejercicios", keyGroups: "Grupos clave", search: "Buscar ejercicio, patron de movimiento o enfoque...", organized: "Biblioteca organizada", noResults: "No se encontraron ejercicios", adjustFilters: "Ajusta la busqueda o cambia los filtros para ampliar la biblioteca mostrada.", cataloged: "ejercicios catalogados", thisGroup: "en este grupo" },
  en: { engine: "Exercise Engine", title: "3D Body Scan Library", subtitle: "Explore movements by muscle group, equipment, and training style with a more visual navigation flow.", exercises: "Exercises", keyGroups: "Key groups", search: "Search exercise, movement pattern, or focus...", organized: "Organized library", noResults: "No exercises found", adjustFilters: "Adjust your search or change filters to widen the displayed library.", cataloged: "cataloged exercises", thisGroup: "in this group" },
  fr: { engine: "Exercise Engine", title: "Bibliotheque 3D Body Scan", subtitle: "Explorez les mouvements par groupe musculaire, equipement et style d'entrainement avec une navigation plus visuelle.", exercises: "Exercices", keyGroups: "Groupes cles", search: "Rechercher un exercice, un schema de mouvement ou un focus...", organized: "Bibliotheque organisee", noResults: "Aucun exercice trouve", adjustFilters: "Ajustez la recherche ou modifiez les filtres pour elargir la bibliotheque affichee.", cataloged: "exercices catalogues", thisGroup: "dans ce groupe" },
  de: { engine: "Exercise Engine", title: "3D Body Scan Bibliothek", subtitle: "Erkunde Bewegungen nach Muskelgruppe, Equipment und Trainingsstil mit einer visuelleren Navigation.", exercises: "Ubungen", keyGroups: "Schlusselgruppen", search: "Suche nach Ubung, Bewegungsmuster oder Fokus...", organized: "Organisierte Bibliothek", noResults: "Keine Ubungen gefunden", adjustFilters: "Passe die Suche an oder wechsle die Filter, um die angezeigte Bibliothek zu erweitern.", cataloged: "katalogisierte Ubungen", thisGroup: "in dieser Gruppe" },
} as const;

const normalize = (value: string) => normalizeText(value);
const displayValue = (value: string) => cleanLegacyText(value);

const getTypeKey = (value: string) =>
  normalize(value).includes("calisten") ? "calistenia" : "musculacao";

const getTypeLabel = (value: string) =>
  getTypeKey(value) === "calistenia" ? "Calistenia" : "Musculacao";

function formatMuscleLabel(value: string) {
  const normalized = normalize(displayValue(value));

  if (normalized.includes("core")) return "Abdomen Core";
  if (normalized.includes("biceps") || normalized.includes("antebraco")) {
    return "Biceps E Antebraco";
  }
  if (normalized.includes("triceps")) return "Triceps";
  if (normalized.includes("costas")) return "Costas E Trapezio";
  if (normalized.includes("ombros")) return "Deltoides";
  if (normalized.includes("peito")) return "Peitoral";
  if (normalized.includes("panturrilha")) return "Panturrilha";
  if (normalized.includes("pernas") || normalized.includes("gluteos")) {
    return "Membros Inferiores E Gluteos";
  }

  return displayValue(value);
}

function formatEquipmentLabel(value: string) {
  const formatted = displayValue(value);
  const normalized = normalize(formatted);

  if (normalized === "barra fixa") return "Barra Fixa";

  return formatted;
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

function supportsEnvironment(
  equipment: string,
  trainingType: "musculacao" | "calistenia",
  location: "academia" | "casa" | "hibrido" | "outdoor",
) {
  if (location === "outdoor") {
    return (
      trainingType === "calistenia" &&
      ["peso_corporal", "barra_fixa", "paralelas", "parede", "trx"].includes(equipment)
    );
  }

  if (location === "casa") {
    return equipment !== "maquina" && equipment !== "cabos";
  }

  return true;
}

function getDefaultType(location: "academia" | "casa" | "hibrido" | "outdoor") {
  if (location === "outdoor") return "Calistenia";
  if (location === "hibrido") return "Hibrido";
  return "Musculacao";
}

function Library() {
  const copy = COPY[getStoredLocale()] ?? COPY.pt;
  const trainingState = useTrainingState();
  const catalog = useExerciseCatalog();
  const catalogById = useMemo(
    () => new Map(catalog.map((record) => [record.id, record])),
    [catalog],
  );
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof types)[number]>(
    getDefaultType(trainingState.environment.location),
  );
  const [muscle, setMuscle] = useState<(typeof muscleOrder)[number]>("Peitoral");
  const muscles = strengthMuscles;

  useEffect(() => {
    setType(getDefaultType(trainingState.environment.location));
  }, [trainingState.environment.location]);

  useEffect(() => {
    if (!muscles.includes(muscle as never)) {
      setMuscle(muscles[0]);
    }
  }, [muscle, muscles]);

  const stats = useMemo(() => {
    const visibleCatalog = catalog.filter((record) =>
      supportsEnvironment(
        record.equipment,
        record.trainingType,
        trainingState.environment.location,
      ),
    );
    const strengthCount = visibleCatalog.filter(
      (record) => record.trainingType === "musculacao",
    ).length;
    const calisthenicsCount = visibleCatalog.filter(
      (record) => record.trainingType === "calistenia",
    ).length;
    const mainGroups = new Set(visibleCatalog.map((record) => record.category)).size;

    return {
      total: visibleCatalog.length,
      strengthCount,
      calisthenicsCount,
      mainGroups,
    };
  }, [catalog, trainingState.environment.location]);

  const filtered = useMemo(
    () =>
      libraryExercises.filter((exercise) => {
        const record = catalogById.get(exercise.id);
        if (!record) return false;

        const normalizedName = normalize(exercise.name);
        const normalizedQuery = normalize(q);
        const typeMatches = type === "Hibrido" ? true : record.trainingType === normalize(type);
        const muscleMatches = getCatalogMuscleLabel(record.category) === muscle;
        const environmentMatches = supportsEnvironment(
          record.equipment,
          record.trainingType,
          trainingState.environment.location,
        );

        return (
          typeMatches &&
          muscleMatches &&
          environmentMatches &&
          (q === "" || normalizedName.includes(normalizedQuery))
        );
      }),
    [q, type, muscle, catalogById, trainingState.environment.location],
  );

  const groupedSections = useMemo(() => {
    const typeSections = type === "Hibrido" ? ["Musculacao", "Calistenia"] : [type];

    return typeSections
      .map((sectionType) => {
        const itemsForType = filtered.filter((exercise) => {
          const record = catalogById.get(exercise.id);
          return record ? record.trainingType === normalize(sectionType) : false;
        });

        const groups = muscles
          .map((currentMuscle) => ({
            muscle: currentMuscle,
            items: itemsForType.filter((exercise) => {
              const record = catalogById.get(exercise.id);
              return record ? getCatalogMuscleLabel(record.category) === currentMuscle : false;
            }),
          }))
          .filter((group) => group.items.length > 0);

        return {
          type: sectionType,
          total: itemsForType.length,
          groups,
        };
      })
      .filter((section) => section.total > 0);
  }, [filtered, muscles, type, catalogById]);

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
                <MapPin className="h-3.5 w-3.5 text-cyan" />
                {[trainingState.environment.location, type].join(" | ")}
              </div>
            </div>

            <button className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border bg-background/45 text-muted-foreground backdrop-blur transition hover:text-primary">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <TopStat
              icon={BookOpen}
              value={`${stats.total}`}
              label={copy.exercises}
              accent="text-primary"
            />
            <TopStat
              icon={Target}
              value={`${stats.mainGroups}`}
              label={copy.keyGroups}
              accent="text-cyan"
            />
            <TopStat
              icon={Zap}
              value={`${stats.strengthCount}`}
              label="Musculação"
              accent="text-success"
            />
            <TopStat
              icon={Sparkles}
              value={`${stats.calisthenicsCount}`}
              label="Calistenia"
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
            {types.map((currentType) => (
              <button
                key={currentType}
                onClick={() => setType(currentType)}
                className={cn(
                  "rounded-xl px-2 py-2 text-xs font-semibold transition",
                  type === currentType
                    ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {currentType}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {muscles.map((currentMuscle) => (
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
                {currentMuscle}
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
              {filtered.length} resultado{filtered.length === 1 ? "" : "s"} separados por tipo e
              grupo muscular
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {groupedSections.map((section) => (
            <div key={section.type} className="space-y-4">
              {groupedSections.length > 1 ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
                  <div>
                    <div className="font-display text-lg font-semibold">{section.type}</div>
                    <div className="text-xs text-muted-foreground">
                      {section.total} {copy.exercises.toLowerCase()}
                    </div>
                  </div>
                  <span className="rounded-full bg-elevated px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/80">
                    {section.type}
                  </span>
                </div>
              ) : null}

              {section.groups.map((group) => (
                <div key={`${section.type}-${group.muscle}`} className="space-y-3">
                  <div>
                    <h3 className="font-display text-base font-semibold">{group.muscle}</h3>
                    <p className="text-xs text-muted-foreground">
                      {group.items.length} {copy.exercises.toLowerCase()} {copy.thisGroup}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((exercise) => (
                      <ExerciseCard key={exercise.id} exercise={exercise} />
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

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <a
      href={`/app/exercicio/${exercise.id}`}
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
              {displayValue(exercise.name)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {displayValue(exercise.biomechanics)}
            </div>
          </div>
          <div className="rounded-full bg-elevated px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/80">
            {getTypeLabel(exercise.type)}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
            {formatMuscleLabel(exercise.muscle)}
          </span>
          <span className="rounded-full bg-background/50 px-2.5 py-1 text-muted-foreground">
            {formatEquipmentLabel(exercise.equipment)}
          </span>
        </div>
      </div>
    </a>
  );
}
