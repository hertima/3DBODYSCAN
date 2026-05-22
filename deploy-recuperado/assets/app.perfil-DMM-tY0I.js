import { r as reactExports, W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { c as createLucideIcon, u as useNavigate, l as loadOnboarding, q as buildAthleteProfile, v as buildGeneratedTrainingState, e as getSplitLabel, r as resolveTrainingSplit, j as getModalityLabel, d as clearOnboarding } from "./router-BDD3RgVy.js";
import { P as ProfileEvolutionVideo } from "./ProfileEvolutionVideo-CrgorISr.js";
import { S as ShareVideoButton } from "./ShareVideoButton-DuyJVam8.js";
import { A as AIInsightCard } from "./AIInsightCard-CiRV3C7C.js";
import { u as useGamification } from "./use-gamification-CyAvBw87.js";
import { l as logout } from "./auth-B50w1j0O.js";
import { b as getDashboardCopy } from "./app-copy-wxZoQ7QO.js";
import { c as cn } from "./utils-Bz4m9VPB.js";
import { F as Flame } from "./flame-B4I7h4kj.js";
import { Z as Zap } from "./zap-DR4zCOeL.js";
import { T as Trophy } from "./trophy-D4ROBLa0.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
import { T as Target } from "./target-DclDxru3.js";
import { T as Timer } from "./timer-GJNEDQY1.js";
import { U as User } from "./user-Bh11TJpu.js";
import { B as Brain } from "./brain-80Gcp3VO.js";
import { M as Moon } from "./moon-DOTTN2ld.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
import "./index-CcuZFuTS.js";
import "./VideoPlayerModal-BQaBY8IB.js";
import "./AnimatedCounter-D13SVpt3.js";
import "./AnimatedBar-OjSZ2IxW.js";
import "./firebase-CeVmTMBf.js";
const __iconNode$4 = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
      key: "3c2336"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const BadgeCheck = createLucideIcon("badge-check", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode);
const normalizedGoalLabels = {
  ganho_massa: "Ganho de Massa",
  perda_peso: "Perda de Peso",
  definicao: "Definição",
  forca: "Força",
  performance: "Performance",
  saude: "Saude"
};
const normalizedExperienceLabels = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado"
};
const normalizedLocationLabels = {
  academia: "Academia",
  casa: "Casa",
  hibrido: "Híbrido",
  outdoor: "Outdoor"
};
const normalizedConsistencyLabels = {
  ocasional: "Ocasional",
  regular: "Regular",
  elite: "Elite"
};
const gymSizeLabels = {
  pequena: "Academia Pequena",
  media: "Academia Média",
  grande: "Academia Grande"
};
const crowdLevelLabels = {
  vazio: "Horário Vazio",
  normal: "Horário Normal",
  pico: "Horário de Pico"
};
const sexLabels = {
  feminino: "Feminino",
  masculino: "Masculino"
};
const menstrualPhaseLabels = {
  menstrual: "Menstrual | intensidade leve",
  follicular: "Folicular | progressão",
  ovulatory: "Ovulatória | pico controlado",
  luteal: "Lútea | recuperação protegida"
};
function Perfil() {
  const navigate = useNavigate();
  const [profile, setProfile] = reactExports.useState({});
  reactExports.useEffect(() => {
    setProfile(loadOnboarding());
  }, []);
  const athleteProfile = buildAthleteProfile(profile);
  const profileInitials = athleteProfile.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("").slice(0, 2) || "AZ";
  const trainingState = buildGeneratedTrainingState(athleteProfile);
  const {
    gamification,
    dopamineLoop
  } = useGamification(trainingState);
  const normalizedFocus = normalizedGoalLabels[athleteProfile.goal];
  const normalizedExperience = normalizedExperienceLabels[athleteProfile.level];
  const normalizedLocation = normalizedLocationLabels[athleteProfile.location];
  const normalizedConsistency = normalizedConsistencyLabels[athleteProfile.consistency];
  const normalizedSplit = getSplitLabel(resolveTrainingSplit(athleteProfile));
  const normalizedTrainingType = getModalityLabel(trainingState.periodization.modality);
  const dashboardCopy = getDashboardCopy();
  const normalizedDaysPerWeek = athleteProfile.availableDays.length;
  const plannedDaysPerWeek = trainingState.schedule.filter((item) => item.workoutId).length;
  const normalizedDuration = `${athleteProfile.workoutDurationMin} min`;
  const gymContext = trainingState.environment.gymSize ? gymSizeLabels[trainingState.environment.gymSize] : "Não se aplica";
  const crowdContext = trainingState.environment.crowdLevel ? crowdLevelLabels[trainingState.environment.crowdLevel] : "Não se aplica";
  const unlockedCount = gamification.achievements.filter((achievement) => achievement.unlocked).length;
  const equipmentSummary = athleteProfile.equipment.length ? `${athleteProfile.equipment.length} itens selecionados` : "Sem restrição informada";
  const frequencySummary = normalizedDaysPerWeek > 0 ? `${normalizedDaysPerWeek} dias por semana` : `${plannedDaysPerWeek} dias planejados automaticamente`;
  const sexSummary = athleteProfile.sex ? sexLabels[athleteProfile.sex] : "Não informado";
  const muscleFocusSummary = athleteProfile.preferredFocus.length ? athleteProfile.preferredFocus.join(", ") : athleteProfile.sex === "feminino" ? "Membros inferiores e glúteos" : "Equilibrado";
  const cycleSummary = athleteProfile.sex === "feminino" ? athleteProfile.trackCycle ? athleteProfile.menstrualCyclePhase ? menstrualPhaseLabels[athleteProfile.menstrualCyclePhase] : "Ativo | fase não informada" : "Não ativado" : "Não se aplica";
  const completion = Math.min(100, [profile.email, profile.name, profile.avatarUrl, profile.goal, profile.consistency, profile.experience, profile.location, profile.trainingType, profile.gymSize, profile.crowdLevel, profile.equipment?.length, profile.days?.length, profile.duration, profile.result, profile.completedAt].filter(Boolean).length * 9);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden rounded-[2rem] border border-border bg-gradient-surface p-5 shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.78_0.14_220_/_0.16),transparent_38%),radial-gradient(circle_at_bottom_left,oklch(0.74_0.17_53_/_0.18),transparent_35%)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute bottom-0 right-0 z-0", style: {
        transform: "translateX(30%)",
        animation: "mascotFadeIn 1.1s ease-out forwards",
        opacity: 0
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/mascote-sem-fundo.png", alt: "", style: {
        width: 200,
        height: 200,
        objectFit: "contain",
        opacity: 0.55,
        filter: "drop-shadow(0 0 30px rgba(34,211,238,0.45)) drop-shadow(0 0 15px rgba(251,146,60,0.35))"
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-18 w-18 shrink-0 place-items-center overflow-hidden rounded-[1.6rem] bg-gradient-primary text-xl font-black text-primary-foreground shadow-glow-primary", children: profile.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profile.avatarUrl, alt: athleteProfile.name, className: "h-full w-full object-cover" }) : profileInitials }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1 rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-3 w-3" }),
                athleteProfile.name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl text-gradient-brand", children: dashboardCopy.profileTitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
                normalizedExperience,
                " | ",
                normalizedLocation
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShareVideoButton, { composition: ProfileEvolutionVideo, inputProps: {
                name: athleteProfile.name,
                goal: normalizedFocus ?? athleteProfile.goal,
                level: normalizedExperience ?? athleteProfile.level,
                totalSessions: trainingState.workouts.length,
                weekNumber: trainingState.periodization.currentWeek,
                consistency: gamification.workoutCompletionRate,
                xp: gamification.xp,
                streak: gamification.streakDays,
                badges: gamification.achievements.filter((a) => a.unlocked).slice(0, 6).map((a) => a.icon ?? "🏆")
              }, durationInFrames: 390, title: "Compartilhar perfil", label: "Compartilhar perfil" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden rounded-2xl border border-border bg-background/40 px-4 py-3 text-right backdrop-blur sm:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "Engine score" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-2xl font-bold text-gradient-ai", children: trainingState.workouts.length * 12 + normalizedDaysPerWeek * 8 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Flame, value: `${Math.max(normalizedDaysPerWeek, 1)} dias`, label: "Rotina ativa", accent: "text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Zap, value: `${trainingState.workouts.length}x`, label: "Treinos na semana", accent: "text-cyan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Trophy, value: `${unlockedCount}`, label: dashboardCopy.achievementsOpen, accent: "text-success" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Trophy, value: `Lv ${gamification.level}`, label: "Nível", accent: "text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Sparkles, value: `${gamification.xp}`, label: "XP total", accent: "text-cyan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Flame, value: `${gamification.streakDays} dias`, label: "Streak", accent: "text-success" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-2xl border border-border bg-background/35 p-4 backdrop-blur", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progresso do atleta" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              completion,
              "% concluído"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-2 w-full overflow-hidden rounded-full bg-elevated/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-gradient-ai transition-all", style: {
            width: `${completion}%`
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileChip, { icon: Target, label: normalizedFocus }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileChip, { icon: Sparkles, label: normalizedTrainingType }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileChip, { icon: MapPin, label: normalizedLocation }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileChip, { icon: CalendarDays, label: `${plannedDaysPerWeek} dias/semana` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileChip, { icon: Timer, label: normalizedDuration })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AIInsightCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Leitura da IA:" }),
      " seu perfil está calibrado para",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyan", children: normalizedFocus.toLowerCase() }),
      ", com janela ideal de",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyan", children: normalizedDuration.toLowerCase() }),
      ", consistência",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyan", children: normalizedConsistency.toLowerCase() }),
      " e divisão",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyan", children: normalizedSplit.toLowerCase() }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AIInsightCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: dopamineLoop.headline }),
      " ",
      dopamineLoop.message,
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan", children: dopamineLoop.momentumLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: dopamineLoop.nextUnlock })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: "Missões premium" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Jornada distribuída entre diária, semanal, mensal, trimestral, semestral e anual" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3", children: Object.entries(gamification.missions).map(([window2, missions]) => {
        const mission = missions[0];
        const progressPct = Math.min(100, Math.round(mission.progress / mission.target * 100));
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-elevated/45 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan", children: window2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm font-semibold", children: mission.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: mission.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              mission.progress,
              " / ",
              mission.target
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              progressPct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-2 w-full overflow-hidden rounded-full bg-background/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-gradient-ai transition-all", style: {
            width: `${progressPct}%`
          } }) })
        ] }, window2);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-5 xl:grid-cols-[1.2fr_0.8fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: "Blueprint do atleta" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Resumo do plano usado pelo motor de personalização" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
            "Plano ativo"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: Target, label: "Foco principal", value: normalizedFocus }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: User, label: "Perfil biológico", value: sexSummary }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: Sparkles, label: "Modalidade", value: normalizedTrainingType }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: Brain, label: "Experiência", value: normalizedExperience }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: MapPin, label: "Ambiente", value: normalizedLocation }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: Target, label: "Foco muscular", value: muscleFocusSummary }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: Moon, label: "Ciclo menstrual", value: cycleSummary }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: CalendarDays, label: "Frequência", value: frequencySummary }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: Timer, label: "Duração média", value: normalizedDuration }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: Sparkles, label: "Equipamentos", value: equipmentSummary }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: Zap, label: "Consistência", value: normalizedConsistency }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: Brain, label: "Divisão ativa", value: `${normalizedSplit} | ${trainingState.workouts.length} treinos` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: MapPin, label: "Porte / acesso", value: gymContext }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanCard, { icon: CalendarDays, label: "Fluxo da academia", value: crowdContext })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: dashboardCopy.achievementsTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            unlockedCount,
            " de ",
            gamification.achievements.length,
            " desbloqueadas"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: gamification.achievements.map((achievement) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-3 rounded-2xl border p-3 transition", achievement.unlocked ? "border-primary/25 bg-elevated/50" : "border-border bg-background/30 opacity-60"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg", achievement.unlocked ? "bg-primary/15 text-primary" : "bg-elevated text-muted-foreground"), children: achievement.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: achievement.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] leading-relaxed text-muted-foreground", children: achievement.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground", children: achievement.unlocked ? "On" : "Lock" })
        ] }, achievement.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
        to: "/app/configuracoes"
      }), className: "flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }),
        "Configurações"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
        await logout();
        clearOnboarding();
        window.location.assign("/");
      }, className: "flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm font-medium text-destructive transition hover:bg-destructive/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        "Sair da conta"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        clearOnboarding();
        setProfile({});
        navigate({
          to: "/onboarding/$step",
          params: {
            step: "1"
          }
        });
      }, className: "flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 text-sm font-medium text-muted-foreground transition hover:bg-elevated", children: "Refazer onboarding" })
    ] })
  ] });
}
function StatCard({
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
function ProfileChip({
  icon: Icon,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-medium text-foreground/90", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-cyan" }),
    label
  ] });
}
function PlanCard({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-elevated/45 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-cyan" }),
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 font-display text-lg font-bold leading-tight", children: value })
  ] });
}
export {
  Perfil as component
};