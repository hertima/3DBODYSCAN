import { r as reactExports, W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { c as createLucideIcon, a8 as Route, Y as getExercise, u as useNavigate, g as getStoredLocale, p as cleanLegacyText, B as getWorkoutTypeLabel, y as normalizeText, z as getCategoryLabel } from "./router-BDD3RgVy.js";
import { g as getWorkoutHistory } from "./workout-history-D2efW0ov.js";
import { g as getExerciseName, a as getExerciseBiomechanics, c as getEquipmentLabel, E as ExerciseMedia } from "./exercise-i18n-3xmGI5hM.js";
import { g as useDirection, k as useControllableState, P as Primitive, l as useId, R as Root, I as Item, c as composeEventHandlers, h as Presence, e as createContextScope, i as createRovingFocusGroupScope } from "./index-meb4Aqgc.js";
import { c as cn } from "./utils-Bz4m9VPB.js";
import { A as ArrowLeft } from "./arrow-left-D6mNKGvq.js";
import { S as Star } from "./star-ZSSEjwfB.js";
import { T as Target } from "./target-DclDxru3.js";
import { B as BookOpen } from "./book-open-Pq6oLUlx.js";
import { C as ChartColumn } from "./chart-column-BIQlOIt7.js";
import { Z as Zap } from "./zap-DR4zCOeL.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
import "./flame-B4I7h4kj.js";
import "./activity-BvoCTLhw.js";
import "./dumbbell-DL1Diyp6.js";
import "./play-DI3yn4ti.js";
const __iconNode$2 = [
  ["path", { d: "m17 2 4 4-4 4", key: "nntrym" }],
  ["path", { d: "M3 11v-1a4 4 0 0 1 4-4h14", key: "84bu3i" }],
  ["path", { d: "m7 22-4-4 4-4", key: "1wqhfi" }],
  ["path", { d: "M21 13v1a4 4 0 0 1-4 4H3", key: "1rx37r" }]
];
const Repeat = createLucideIcon("repeat", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
      key: "1ngwbx"
    }
  ]
];
const Wrench = createLucideIcon("wrench", __iconNode);
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
const COPY = {
  pt: {
    back: "Voltar",
    favorite: "Favoritar",
    notFound: "Exercício não encontrado",
    notFoundDesc: "Este exercício não existe na biblioteca atual.",
    tabs: {
      alvo: "Alvo",
      instr: "Instruções",
      equip: "Equip.",
      anal: "Análise"
    },
    mainMuscle: "Músculo principal",
    movementPattern: "Padrão de movimento",
    primaryFocus: "Foco primário",
    biomechanics: "Biomecânica",
    equipment: "Equipamento",
    execution: "Execução",
    movementFocusPre: "Movimento focado em",
    movementFocusMid: "com ênfase em",
    howToExecute: "Como executar",
    commonMistakes: "Erros comuns",
    type: "Tipo:",
    substitutions: "Substituições",
    bestWeight: "Melhor peso",
    lastVolume: "Último volume",
    sessions: "Sessões",
    recordReps: "Recorde reps",
    bodyweight: "Peso corp.",
    unlockAnalysis: "Faça seu primeiro treino com este exercício para desbloquear a análise."
  },
  es: {
    back: "Volver",
    favorite: "Favorito",
    notFound: "Ejercicio no encontrado",
    notFoundDesc: "Este ejercicio no existe en la biblioteca actual.",
    tabs: {
      alvo: "Objetivo",
      instr: "Instrucciones",
      equip: "Equip.",
      anal: "Análisis"
    },
    mainMuscle: "Músculo principal",
    movementPattern: "Patrón de movimiento",
    primaryFocus: "Foco primario",
    biomechanics: "Biomecánica",
    equipment: "Equipamiento",
    execution: "Ejecución",
    movementFocusPre: "Movimiento enfocado en",
    movementFocusMid: "con énfasis en",
    howToExecute: "Cómo ejecutar",
    commonMistakes: "Errores comunes",
    type: "Tipo:",
    substitutions: "Sustituciones",
    bestWeight: "Mejor peso",
    lastVolume: "Último volumen",
    sessions: "Sesiones",
    recordReps: "Récord reps",
    bodyweight: "Peso corp.",
    unlockAnalysis: "Haz tu primer entrenamiento con este ejercicio para desbloquear el análisis."
  },
  en: {
    back: "Back",
    favorite: "Favorite",
    notFound: "Exercise not found",
    notFoundDesc: "This exercise does not exist in the current library.",
    tabs: {
      alvo: "Target",
      instr: "Instructions",
      equip: "Equip.",
      anal: "Analysis"
    },
    mainMuscle: "Primary muscle",
    movementPattern: "Movement pattern",
    primaryFocus: "Primary focus",
    biomechanics: "Biomechanics",
    equipment: "Equipment",
    execution: "Execution",
    movementFocusPre: "Movement focused on",
    movementFocusMid: "with emphasis on",
    howToExecute: "How to execute",
    commonMistakes: "Common mistakes",
    type: "Type:",
    substitutions: "Substitutions",
    bestWeight: "Best weight",
    lastVolume: "Last volume",
    sessions: "Sessions",
    recordReps: "Rep record",
    bodyweight: "Bodyweight",
    unlockAnalysis: "Complete your first workout with this exercise to unlock the analysis."
  },
  fr: {
    back: "Retour",
    favorite: "Favori",
    notFound: "Exercice introuvable",
    notFoundDesc: "Cet exercice n'existe pas dans la bibliothèque actuelle.",
    tabs: {
      alvo: "Cible",
      instr: "Instructions",
      equip: "Équip.",
      anal: "Analyse"
    },
    mainMuscle: "Muscle principal",
    movementPattern: "Schéma de mouvement",
    primaryFocus: "Focus principal",
    biomechanics: "Biomécanique",
    equipment: "Équipement",
    execution: "Exécution",
    movementFocusPre: "Mouvement axé sur",
    movementFocusMid: "avec emphase sur",
    howToExecute: "Comment exécuter",
    commonMistakes: "Erreurs courantes",
    type: "Type :",
    substitutions: "Substitutions",
    bestWeight: "Meilleur poids",
    lastVolume: "Dernier volume",
    sessions: "Séances",
    recordReps: "Record reps",
    bodyweight: "Poids corps",
    unlockAnalysis: "Faites votre premier entraînement avec cet exercice pour débloquer l'analyse."
  },
  de: {
    back: "Zurück",
    favorite: "Favorit",
    notFound: "Übung nicht gefunden",
    notFoundDesc: "Diese Übung existiert nicht in der aktuellen Bibliothek.",
    tabs: {
      alvo: "Ziel",
      instr: "Anleitung",
      equip: "Ausrüst.",
      anal: "Analyse"
    },
    mainMuscle: "Hauptmuskel",
    movementPattern: "Bewegungsmuster",
    primaryFocus: "Primärfokus",
    biomechanics: "Biomechanik",
    equipment: "Ausrüstung",
    execution: "Ausführung",
    movementFocusPre: "Bewegung fokussiert auf",
    movementFocusMid: "mit Schwerpunkt auf",
    howToExecute: "So ausführen",
    commonMistakes: "Häufige Fehler",
    type: "Typ:",
    substitutions: "Ersatzübungen",
    bestWeight: "Bestes Gewicht",
    lastVolume: "Letztes Volumen",
    sessions: "Einheiten",
    recordReps: "Wiederholungsrekord",
    bodyweight: "Körpergewicht",
    unlockAnalysis: "Absolviere dein erstes Training mit dieser Übung, um die Analyse freizuschalten."
  }
};
function getMuscleLabel(muscle, locale) {
  const n = normalizeText(cleanLegacyText(muscle));
  if (n.includes("core")) return getCategoryLabel("abdomen_core", locale);
  if (n.includes("biceps") || n.includes("antebraco")) return getCategoryLabel("biceps_antebraco", locale);
  if (n.includes("triceps")) return getCategoryLabel("triceps", locale);
  if (n.includes("costas")) return getCategoryLabel("costas_trapezio", locale);
  if (n.includes("ombros")) return getCategoryLabel("deltoides", locale);
  if (n.includes("peito")) return getCategoryLabel("peitoral", locale);
  if (n.includes("panturrilha")) return getCategoryLabel("panturrilha", locale);
  if (n.includes("pernas") || n.includes("gluteos")) return getCategoryLabel("membros_inferiores_gluteos", locale);
  if (n.includes("full body")) return getCategoryLabel("peitoral", locale);
  return cleanLegacyText(muscle);
}
function buildExerciseStats(exerciseId, bodyCopy) {
  const history = getWorkoutHistory();
  const sessions = history.filter((w) => w.exercises.some((e) => e.id === exerciseId));
  const allSets = sessions.flatMap((w) => w.exercises.filter((e) => e.id === exerciseId).flatMap((e) => e.sets.filter((s) => s.completed)));
  const weights = allSets.map((s) => s.weight).filter((w) => w > 0);
  const reps = allSets.map((s) => s.reps);
  const bestWeight = weights.length > 0 ? Math.max(...weights) : null;
  const recordReps = reps.length > 0 ? Math.max(...reps) : null;
  const lastSession = sessions[0];
  const lastVolume = lastSession ? lastSession.exercises.filter((e) => e.id === exerciseId).flatMap((e) => e.sets.filter((s) => s.completed)).reduce((sum, s) => sum + s.reps * (s.weight || 1), 0) : null;
  return {
    sessionCount: sessions.length,
    bestWeight: bestWeight ? `${bestWeight} kg` : sessions.length > 0 ? bodyCopy : "--",
    lastVolume: lastVolume && lastVolume > 0 ? `${Math.round(lastVolume)}` : "--",
    recordReps: recordReps ? `${recordReps}` : "--",
    hasHistory: sessions.length > 0
  };
}
function Detail() {
  const {
    id
  } = Route.useParams();
  const ex = getExercise(id);
  const navigate = useNavigate();
  const locale = getStoredLocale();
  const copy = COPY[locale] ?? COPY.pt;
  const stats = ex ? buildExerciseStats(ex.id, copy.bodyweight) : null;
  if (!ex) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
      to: "/app/exercicios"
    }), className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " ",
      copy.back
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-10 text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "🔍" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold", children: copy.notFound }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: copy.notFoundDesc })
    ] })
  ] });
  const exerciseName = getExerciseName(ex.id, cleanLegacyText(ex.name), locale);
  const exerciseBio = getExerciseBiomechanics(cleanLegacyText(ex.biomechanics), locale);
  const exerciseEquip = getEquipmentLabel(ex.equipment, locale);
  const muscleLabel = getMuscleLabel(ex.muscle, locale);
  const typeLabel = getWorkoutTypeLabel(ex.type, locale);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExerciseMedia, { exerciseId: ex.id, size: "hero", className: "border border-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
        to: "/app/exercicios"
      }), className: "absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur", "aria-label": copy.back, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur", "aria-label": copy.favorite, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary", children: muscleLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-display text-2xl font-bold leading-tight text-gradient-brand", children: exerciseName }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
        exerciseBio,
        " | ",
        exerciseEquip
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "alvo", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4 rounded-full bg-surface p-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "alvo", className: "rounded-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "mr-1 h-3 w-3" }),
          copy.tabs.alvo
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "instr", className: "rounded-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "mr-1 h-3 w-3" }),
          copy.tabs.instr
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "equip", className: "rounded-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "mr-1 h-3 w-3" }),
          copy.tabs.equip
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "anal", className: "rounded-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "mr-1 h-3 w-3" }),
          copy.tabs.anal
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "alvo", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-surface p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-[1fr_250px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: copy.mainMuscle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-bold text-primary", children: muscleLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-xs uppercase tracking-wider text-muted-foreground", children: copy.movementPattern }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground/90", children: exerciseBio }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-2 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { icon: Target, label: copy.primaryFocus, value: muscleLabel, accent: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { icon: Zap, label: copy.biomechanics, value: exerciseBio, accent: "text-cyan" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/12 via-elevated to-cyan/10 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-primary", children: "Target Zone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-lg font-bold", children: muscleLabel })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-2xl bg-background/45 text-cyan backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/80 bg-background/40 px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground", children: copy.equipment }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-semibold text-foreground", children: exerciseEquip })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/80 bg-background/40 px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground", children: copy.execution }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-semibold text-foreground", children: typeLabel })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-cyan/20 bg-cyan/8 px-3 py-3 text-xs leading-relaxed text-foreground/85", children: [
            copy.movementFocusPre,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-cyan", children: muscleLabel }),
            " ",
            copy.movementFocusMid,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: exerciseBio.toLowerCase() }),
            "."
          ] })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "instr", className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-cyan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold uppercase tracking-wider", children: copy.howToExecute })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-2", children: ex.instructions.map((instruction, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-elevated text-xs font-bold text-primary", children: index + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/90", children: cleanLegacyText(instruction) })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-destructive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold uppercase tracking-wider", children: copy.commonMistakes })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: ex.mistakes.map((mistake, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "-" }),
            " ",
            cleanLegacyText(mistake)
          ] }, index)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "equip", className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: copy.equipment }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-xl font-bold", children: exerciseEquip }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
            copy.type,
            " ",
            typeLabel
          ] })
        ] }),
        ex.alternatives.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold uppercase tracking-wider", children: copy.substitutions })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ex.alternatives.map((alternativeId) => {
            const alternative = getExercise(alternativeId);
            if (!alternative) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `/app/exercicio/${alternativeId}`, className: "rounded-full border border-border bg-elevated px-3 py-1.5 text-xs font-semibold hover:border-primary/40", children: getExerciseName(alternative.id, cleanLegacyText(alternative.name), locale) }, alternativeId);
          }) })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "anal", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: copy.bestWeight, value: stats?.bestWeight ?? "--" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: copy.lastVolume, value: stats?.lastVolume ?? "--", unit: stats?.lastVolume && stats.lastVolume !== "--" ? "kg" : void 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: copy.sessions, value: String(stats?.sessionCount ?? 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: copy.recordReps, value: stats?.recordReps ?? "--" })
        ] }),
        !stats?.hasHistory && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2 rounded-xl border border-dashed border-border bg-elevated/30 px-3 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 shrink-0 text-cyan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: copy.unlockAnalysis })
        ] })
      ] }) })
    ] })
  ] });
}
function Stat({
  label,
  value,
  unit
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-elevated p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 font-display text-lg font-bold text-primary", children: [
      value,
      unit ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs font-normal text-muted-foreground", children: unit }) : null
    ] })
  ] });
}
function MiniStat({
  icon: Icon,
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-elevated/50 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${accent}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-semibold text-foreground", children: value })
  ] });
}
export {
  Detail as component
};