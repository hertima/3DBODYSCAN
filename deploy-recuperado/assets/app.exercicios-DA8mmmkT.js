import { r as reactExports, W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { P as ProfileEvolutionVideo } from "./ProfileEvolutionVideo-CrgorISr.js";
import { u as useExerciseCatalog, V as VideoPreviewCard } from "./use-exercise-catalog-DyPEApy6.js";
import { c as createLucideIcon, g as getStoredLocale, w as isFunctionalExerciseRecord, x as libraryExercises, l as loadOnboarding, y as normalizeText, z as getCategoryLabel, B as getWorkoutTypeLabel, p as cleanLegacyText } from "./router-BDD3RgVy.js";
import { E as ExerciseMedia, g as getExerciseName, a as getExerciseBiomechanics, b as getMuscleGroupLabel, c as getEquipmentLabel } from "./exercise-i18n-3xmGI5hM.js";
import { c as cn } from "./utils-Bz4m9VPB.js";
import { B as BookOpen } from "./book-open-Pq6oLUlx.js";
import { D as Dumbbell } from "./dumbbell-DL1Diyp6.js";
import { A as Activity } from "./activity-BvoCTLhw.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
import { S as Star } from "./star-ZSSEjwfB.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CcuZFuTS.js";
import "./VideoPlayerModal-BQaBY8IB.js";
import "./AnimatedCounter-D13SVpt3.js";
import "./AnimatedBar-OjSZ2IxW.js";
import "./play-DI3yn4ti.js";
import "./openai-config-D_XaIbeQ.js";
import "./flame-B4I7h4kj.js";
import "./target-DclDxru3.js";
import "./zap-DR4zCOeL.js";
const __iconNode$1 = [
  ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54", key: "1djwo0" }],
  [
    "path",
    {
      d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
      key: "1tzkfa"
    }
  ],
  ["path", { d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05", key: "14pb5j" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Earth = createLucideIcon("earth", __iconNode$1);
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
const modes = ["Musculacao", "Funcional", "Calistenia"];
const strengthMuscles = ["Abdomen Core", "Biceps E Antebraco", "Costas E Trapezio", "Deltoides", "Membros Inferiores E Gluteos", "Panturrilha", "Peitoral", "Triceps"];
const allMuscle = "Todos";
const COPY = {
  pt: {
    engine: "Biblioteca global",
    title: "Biblioteca Global 500+ GIFs",
    subtitle: "Exercícios organizados para montar treinos de musculação, funcional e calistenia.",
    exercises: "Exercícios",
    search: "Buscar exercício, equipamento ou movimento...",
    organized: "Exercícios por modalidade",
    noResults: "Nenhum exercício encontrado",
    adjustFilters: "Troque a modalidade, o grupo muscular ou refine a busca.",
    cataloged: "exercícios disponíveis",
    thisGroup: "neste grupo",
    all: "Todos",
    showing: "exibindo",
    global: "Para alunos no mundo inteiro",
    strength: "Musculação",
    functional: "Funcional",
    calisthenics: "Calistenia"
  },
  es: {
    engine: "Biblioteca global",
    title: "Biblioteca Global 500+ GIFs",
    subtitle: "Ejercicios organizados para crear entrenamientos de musculación, funcional y calistenia.",
    exercises: "Ejercicios",
    search: "Buscar ejercicio, equipamiento o movimiento...",
    organized: "Ejercicios por modalidad",
    noResults: "No se encontraron ejercicios",
    adjustFilters: "Cambia la modalidad, el grupo muscular o ajusta la búsqueda.",
    cataloged: "ejercicios disponibles",
    thisGroup: "en este grupo",
    all: "Todos",
    showing: "mostrando",
    global: "Para alumnos de todo el mundo",
    strength: "Musculación",
    functional: "Funcional",
    calisthenics: "Calistenia"
  },
  en: {
    engine: "Global library",
    title: "Global 500+ GIF Library",
    subtitle: "Exercises organized for strength, functional, and calisthenics workout generation.",
    exercises: "Exercises",
    search: "Search exercise, equipment, or movement...",
    organized: "Exercises by modality",
    noResults: "No exercises found",
    adjustFilters: "Change the modality, muscle group, or refine the search.",
    cataloged: "available exercises",
    thisGroup: "in this group",
    all: "All",
    showing: "showing",
    global: "For students worldwide",
    strength: "Strength",
    functional: "Functional",
    calisthenics: "Calisthenics"
  },
  fr: {
    engine: "Bibliotheque globale",
    title: "Bibliotheque Globale 500+ GIFs",
    subtitle: "Exercices organises pour generer des seances de musculation, fonctionnel et callisthenie.",
    exercises: "Exercices",
    search: "Rechercher exercice, equipement ou mouvement...",
    organized: "Exercices par modalite",
    noResults: "Aucun exercice trouve",
    adjustFilters: "Changez la modalite, le groupe musculaire ou affinez la recherche.",
    cataloged: "exercices disponibles",
    thisGroup: "dans ce groupe",
    all: "Tous",
    showing: "affichage",
    global: "Pour des eleves dans le monde entier",
    strength: "Musculation",
    functional: "Fonctionnel",
    calisthenics: "Callisthenie"
  },
  de: {
    engine: "Globale Bibliothek",
    title: "Globale 500+ GIF Bibliothek",
    subtitle: "Ubungen fur Trainingsplane in Krafttraining, funktionellem Training und Calisthenics.",
    exercises: "Ubungen",
    search: "Suche nach Ubung, Equipment oder Bewegung...",
    organized: "Ubungen nach Modalitat",
    noResults: "Keine Ubungen gefunden",
    adjustFilters: "Wechsle Modalitat, Muskelgruppe oder verfeinere die Suche.",
    cataloged: "verfugbare Ubungen",
    thisGroup: "in dieser Gruppe",
    all: "Alle",
    showing: "anzeige",
    global: "Fur Schuler weltweit",
    strength: "Krafttraining",
    functional: "Funktionell",
    calisthenics: "Calisthenics"
  }
};
const normalize = (value) => normalizeText(value);
const displayValue = (value) => cleanLegacyText(value);
function getModeLabel(mode, locale) {
  const labels = {
    Musculacao: {
      pt: "Musculação",
      es: "Musculación",
      en: "Strength",
      fr: "Musculation",
      de: "Krafttraining"
    },
    Calistenia: {
      pt: "Calistenia",
      es: "Calistenia",
      en: "Calisthenics",
      fr: "Callisthénie",
      de: "Calisthenics"
    },
    Funcional: {
      pt: "Funcional",
      es: "Funcional",
      en: "Functional",
      fr: "Fonctionnel",
      de: "Funktionell"
    }
  };
  return labels[mode]?.[locale] ?? labels[mode]?.pt ?? mode;
}
function getCatalogMuscleLabel(category) {
  if (category === "abdomen_core") return "Abdomen Core";
  if (category === "biceps_antebraco") return "Biceps E Antebraco";
  if (category === "costas_trapezio") return "Costas E Trapezio";
  if (category === "deltoides") return "Deltoides";
  if (category === "membros_inferiores_gluteos") return "Membros Inferiores E Gluteos";
  if (category === "panturrilha") return "Panturrilha";
  if (category === "peitoral") return "Peitoral";
  return "Triceps";
}
const muscleGroupKeyMap = {
  "Abdomen Core": "abdomen_core",
  "Biceps E Antebraco": "biceps_antebraco",
  "Costas E Trapezio": "costas_trapezio",
  "Deltoides": "deltoides",
  "Membros Inferiores E Gluteos": "membros_inferiores_gluteos",
  "Panturrilha": "panturrilha",
  "Peitoral": "peitoral",
  "Triceps": "triceps"
};
function getMuscleGroupSectionLabel(muscle, locale) {
  const category = muscleGroupKeyMap[muscle];
  if (!category) return muscle;
  return getCategoryLabel(category, locale);
}
function Library() {
  const locale = getStoredLocale();
  const copy = COPY[locale] ?? COPY.pt;
  const catalog = useExerciseCatalog();
  const catalogById = reactExports.useMemo(() => new Map(catalog.map((record) => [record.id, record])), [catalog]);
  const [q, setQ] = reactExports.useState("");
  const [mode, setMode] = reactExports.useState("Musculacao");
  const [muscle, setMuscle] = reactExports.useState(allMuscle);
  const muscles = strengthMuscles;
  reactExports.useEffect(() => {
    if (muscle !== allMuscle && !muscles.includes(muscle)) {
      setMuscle(allMuscle);
    }
  }, [muscle, muscles]);
  const stats = reactExports.useMemo(() => {
    const strengthCount = catalog.filter((record) => record.trainingType === "musculacao").length;
    const calisthenicsCount = catalog.filter((record) => record.trainingType === "calistenia").length;
    const functionalCount = catalog.filter(isFunctionalExerciseRecord).length;
    return {
      total: catalog.length,
      strengthCount,
      functionalCount,
      calisthenicsCount
    };
  }, [catalog]);
  const filtered = reactExports.useMemo(() => libraryExercises.filter((exercise) => {
    const record = catalogById.get(exercise.id);
    if (!record) return false;
    const normalizedQuery = normalize(q);
    const modeMatches = mode === "Funcional" ? isFunctionalExerciseRecord(record) : record.trainingType === normalize(mode);
    const muscleMatches = muscle === allMuscle || getCatalogMuscleLabel(record.category) === muscle;
    const haystack = [exercise.name, exercise.equipment, exercise.biomechanics, exercise.sourceGroup ?? "", record.name.pt, record.aliases.join(" "), record.movementPattern.pt, record.equipment, record.category, getCatalogMuscleLabel(record.category)].map(normalize).join(" ");
    return modeMatches && muscleMatches && (q === "" || haystack.includes(normalizedQuery));
  }), [q, mode, muscle, catalogById]);
  const groupedSections = reactExports.useMemo(() => {
    const modeSections = [mode];
    return modeSections.map((sectionMode) => {
      const itemsForMode = sectionMode === "Funcional" ? filtered : filtered.filter((exercise) => {
        const record = catalogById.get(exercise.id);
        return record ? record.trainingType === normalize(sectionMode) : false;
      });
      const groups = muscles.map((currentMuscle) => ({
        muscle: currentMuscle,
        items: itemsForMode.filter((exercise) => {
          const record = catalogById.get(exercise.id);
          return record ? getCatalogMuscleLabel(record.category) === currentMuscle : false;
        })
      })).filter((group) => group.items.length > 0);
      return {
        type: sectionMode,
        total: itemsForMode.length,
        groups
      };
    }).filter((section) => section.total > 0);
  }, [filtered, muscles, mode, catalogById]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden rounded-[2rem] border border-border bg-gradient-surface p-5 shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.78_0.14_220_/_0.16),transparent_38%),radial-gradient(circle_at_bottom_left,oklch(0.74_0.17_53_/_0.18),transparent_36%)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3 w-3" }),
            copy.engine
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-display text-3xl font-bold leading-tight text-gradient-brand", children: copy.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-sm text-muted-foreground", children: copy.subtitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/35 px-3 py-1.5 text-[11px] font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Earth, { className: "h-3.5 w-3.5 text-cyan" }),
            [copy.global, getModeLabel(mode, locale)].join(" | ")
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TopStat, { icon: BookOpen, value: `${stats.total}`, label: copy.exercises, accent: "text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TopStat, { icon: Dumbbell, value: `${stats.strengthCount}`, label: copy.strength, accent: "text-success" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TopStat, { icon: Activity, value: `${stats.functionalCount}`, label: copy.functional, accent: "text-cyan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TopStat, { icon: Sparkles, value: `${stats.calisthenicsCount}`, label: copy.calisthenics, accent: "text-primary" })
        ] })
      ] })
    ] }),
    (() => {
      const profile = loadOnboarding();
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-2xl border p-4", style: {
        borderColor: "rgba(251,146,60,0.2)",
        background: "rgba(251,146,60,0.04)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          width: 88,
          flexShrink: 0
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPreviewCard, { composition: ProfileEvolutionVideo, inputProps: {
          name: profile.name ?? "Atleta",
          goal: profile.goal ?? "wellness",
          avatarUrl: profile.avatarUrl ?? void 0
        }, durationInFrames: 360, title: "Compartilhar perfil", previewFrame: 60 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-foreground", children: "Mostre sua evolução" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-xs text-muted-foreground", children: "Gere um story com seu perfil de atleta e compartilhe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-[10px] font-semibold uppercase tracking-widest", style: {
            color: "#fb923c"
          }, children: "Story 9:16 · Instagram / WhatsApp" })
        ] })
      ] });
    })(),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-3xl border border-border bg-surface p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: copy.search, className: "w-full rounded-2xl border border-border bg-elevated/60 py-3 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary/40" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1 rounded-2xl border border-border bg-elevated/35 p-1", children: modes.map((currentMode) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode(currentMode), className: cn("rounded-xl px-2 py-2 text-xs font-semibold transition", mode === currentMode ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "text-muted-foreground hover:text-foreground"), children: getModeLabel(currentMode, locale) }, currentMode)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: [allMuscle, ...muscles].map((currentMuscle) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMuscle(currentMuscle), className: cn("rounded-full border px-3 py-1.5 text-[11px] font-semibold transition", muscle === currentMuscle ? "border-cyan/60 bg-cyan/15 text-cyan" : "border-border bg-background/40 text-muted-foreground hover:text-foreground"), children: currentMuscle === allMuscle ? copy.all : getMuscleGroupSectionLabel(currentMuscle, locale) }, currentMuscle)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex items-center justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: copy.organized }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          copy.showing,
          " ",
          filtered.length,
          " / ",
          stats.total,
          " ",
          copy.cataloged
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: groupedSections.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        groupedSections.length > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold", children: getModeLabel(section.type, locale) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              section.total,
              " ",
              copy.exercises.toLowerCase()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-elevated px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/80", children: getModeLabel(section.type, locale) })
        ] }) : null,
        section.groups.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-semibold", children: getMuscleGroupSectionLabel(group.muscle, locale) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              group.items.length,
              " ",
              copy.exercises.toLowerCase(),
              " ",
              copy.thisGroup
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3", children: group.items.map((exercise) => /* @__PURE__ */ jsxRuntimeExports.jsx(ExerciseCard, { exercise, locale }, exercise.id)) })
        ] }, `${section.type}-${group.muscle}`))
      ] }, section.type)) }),
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-dashed border-border bg-surface/50 p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-elevated text-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-xl font-semibold", children: copy.noResults }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: copy.adjustFilters })
      ] }) : null
    ] })
  ] });
}
function TopStat({
  icon: Icon,
  value,
  label,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-background/35 p-3 backdrop-blur", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-4 w-4", accent) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 font-display text-xl font-bold", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground", children: label })
  ] });
}
function ExerciseCard({
  exercise,
  locale
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `/app/exercicio/${exercise.id}`, className: "group overflow-hidden rounded-3xl border border-border bg-surface transition hover:border-primary/35 hover:shadow-elevated active:scale-[0.99]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExerciseMedia, { exerciseId: exercise.id, size: "card", className: "rounded-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (event) => {
        event.preventDefault();
      }, className: "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-border bg-background/65 text-muted-foreground backdrop-blur transition hover:text-primary", "aria-label": "Favoritar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold leading-tight", children: getExerciseName(exercise.id, displayValue(exercise.name), locale) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: getExerciseBiomechanics(displayValue(exercise.biomechanics), locale) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-elevated px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/80", children: getWorkoutTypeLabel(exercise.type, locale) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/10 px-2.5 py-1 text-primary", children: getMuscleGroupLabel(exercise.muscle, locale) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-background/50 px-2.5 py-1 text-muted-foreground", children: getEquipmentLabel(exercise.equipment, locale) })
      ] })
    ] })
  ] });
}
export {
  Library as component
};