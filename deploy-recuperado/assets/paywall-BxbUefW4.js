import { W as jsxRuntimeExports, r as reactExports } from "./server-C0e4gypg.js";
import { u as useNavigate, l as loadOnboarding, m as motion, L as Link } from "./router-BDD3RgVy.js";
import { u as useCurrentFrame, a as useVideoConfig, s as spring, i as interpolate, A as AbsoluteFill, S as Sequence } from "./index-CcuZFuTS.js";
import { G as GradientBackground } from "./VideoPlayerModal-BQaBY8IB.js";
import { B as BrandOverlay } from "./BrandOverlay-B4-tEure.js";
import { S as ShareVideoButton } from "./ShareVideoButton-DuyJVam8.js";
import { l as logo } from "./zyrox-logo-CI_vdZ1P.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
import { U as Users } from "./users-D_krSHkN.js";
import { S as Star } from "./star-ZSSEjwfB.js";
import { C as Clock } from "./clock-pfs1_d9-.js";
import { B as Brain } from "./brain-80Gcp3VO.js";
import { T as TrendingUp } from "./trending-up-DCMFIZtG.js";
import { D as Dumbbell } from "./dumbbell-DL1Diyp6.js";
import { F as Flame } from "./flame-B4I7h4kj.js";
import { T as Target } from "./target-DclDxru3.js";
import { L as Lock } from "./lock-B10xzRBV.js";
import { C as Check } from "./check-j8hLnasa.js";
import { Z as Zap } from "./zap-DR4zCOeL.js";
import { C as ChevronRight } from "./chevron-right-DRYfnruU.js";
import { S as Shield } from "./shield-CuwT-hx3.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
const FEATURES$1 = [
  { icon: "🤖", title: "IA Treinador", desc: "Plano personalizado com dados reais" },
  { icon: "📷", title: "3D Body Scan", desc: "Análise corporal por câmera" },
  { icon: "📊", title: "Analytics", desc: "Progresso e equilíbrio muscular" },
  { icon: "🍽️", title: "Nutrição IA", desc: "Calorias e macros automáticos" },
  { icon: "🎯", title: "12 Semanas", desc: "Periodização profissional" },
  { icon: "🔥", title: "Gamificação", desc: "XP, streaks e conquistas" }
];
function PaywallShowcaseVideo({ planName = "Pro" }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ frame, fps, config: { damping: 11, stiffness: 90 } });
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AbsoluteFill, { style: { fontFamily: "sans-serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GradientBackground, { variant: "dark" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandOverlay, { position: "top" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 145, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { transform: `scale(${logoScale})`, marginBottom: 12 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/mascote-05.png",
          style: {
            width: 380,
            height: 380,
            objectFit: "contain",
            filter: "drop-shadow(0 0 60px rgba(34,211,238,0.5)) drop-shadow(0 0 30px rgba(251,146,60,0.4))"
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { opacity: titleOpacity, textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 15, color: "rgba(148,163,184,0.6)", letterSpacing: 4, textTransform: "uppercase" }, children: [
          "Plano ",
          planName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 40,
          fontWeight: 900,
          letterSpacing: -1,
          marginTop: 6,
          background: "linear-gradient(90deg,#22d3ee,#ffffff,#fb923c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }, children: "3D Body Scan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, color: "rgba(148,163,184,0.5)", marginTop: 8 }, children: "Treine como um atleta profissional" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 350, left: 48, right: 48 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: FEATURES$1.map((f, i) => {
      const fOpacity = interpolate(frame, [25 + i * 10, 45 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const fX = interpolate(frame, [25 + i * 10, 45 + i * 10], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const fScale = spring({ frame: frame - 25 - i * 10, fps, config: { damping: 14, stiffness: 130 } });
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        opacity: fOpacity,
        transform: `translateX(${fX}px) scale(${fScale})`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: "14px 18px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          width: 46,
          height: 46,
          borderRadius: 14,
          background: "rgba(34,211,238,0.12)",
          border: "1px solid rgba(34,211,238,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0
        }, children: f.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, fontWeight: 700, color: "#e2e8f0" }, children: f.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(148,163,184,0.55)", marginTop: 2 }, children: f.desc })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginLeft: "auto", color: "#22d3ee", fontSize: 18 }, children: "✓" })
      ] }, i);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 100, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: 130, left: 48, right: 48 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      background: "linear-gradient(135deg,#22d3ee,#3b82f6)",
      borderRadius: 20,
      padding: "18px",
      textAlign: "center",
      boxShadow: "0 0 40px rgba(34,211,238,0.3)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: 900, color: "#060b14", letterSpacing: 1 }, children: "Comece sua transformação" }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandOverlay, { position: "bottom" })
  ] });
}
const GOAL_LABELS = {
  mass: {
    label: "Hipertrofia Muscular",
    short: "Hipertrofia"
  },
  strength: {
    label: "Força Máxima",
    short: "Força"
  },
  hybrid: {
    label: "Treino Híbrido",
    short: "Híbrido"
  },
  athletic: {
    label: "Performance Atlética",
    short: "Performance"
  },
  definition: {
    label: "Definição",
    short: "Definição"
  },
  weight_loss: {
    label: "Emagrecimento",
    short: "Emagrecimento"
  },
  endurance: {
    label: "Resistência",
    short: "Resistência"
  },
  wellness: {
    label: "Bem-estar",
    short: "Bem-estar"
  }
};
const EXP_LABELS = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado"
};
const LOC_LABELS = {
  gym: "Academia",
  home: "Casa",
  hybrid: "Academia + Casa",
  outdoor: "Ar Livre"
};
const GOAL_PROJECTIONS = {
  mass: [{
    metric: "Massa muscular",
    value: "+3–5 kg",
    period: "em 12 semanas"
  }, {
    metric: "Volume de treino",
    value: "+40%",
    period: "progresso garantido"
  }, {
    metric: "Força estimada",
    value: "+25%",
    period: "nos principais lifts"
  }],
  strength: [{
    metric: "Força máxima",
    value: "+30%",
    period: "em 12 semanas"
  }, {
    metric: "1RM estimado",
    value: "+15–20 kg",
    period: "supino e agachamento"
  }, {
    metric: "Técnica",
    value: "100%",
    period: "das repetições otimizadas"
  }],
  definition: [{
    metric: "Gordura corporal",
    value: "−3–5%",
    period: "em 12 semanas"
  }, {
    metric: "Cintura",
    value: "−5–8 cm",
    period: "com protocolo correto"
  }, {
    metric: "Massa muscular",
    value: "mantida",
    period: "durante o déficit"
  }],
  weight_loss: [{
    metric: "Peso corporal",
    value: "−4–6 kg",
    period: "em 12 semanas"
  }, {
    metric: "Gordura",
    value: "−3–4%",
    period: "preservando músculo"
  }, {
    metric: "Metabolismo",
    value: "+12%",
    period: "melhora estimada"
  }],
  hybrid: [{
    metric: "Composição corporal",
    value: "+15%",
    period: "melhora geral"
  }, {
    metric: "Força + cardio",
    value: "2x/sem",
    period: "divisão otimizada"
  }, {
    metric: "Recuperação",
    value: "acelerada",
    period: "protocolo de deload"
  }],
  athletic: [{
    metric: "Performance",
    value: "+25%",
    period: "em 12 semanas"
  }, {
    metric: "Potência",
    value: "+20%",
    period: "explosão e velocidade"
  }, {
    metric: "Resistência",
    value: "+35%",
    period: "capacidade aeróbica"
  }],
  endurance: [{
    metric: "VO₂ máx",
    value: "+18%",
    period: "em 12 semanas"
  }, {
    metric: "Distância",
    value: "+30%",
    period: "capacidade de corrida"
  }, {
    metric: "Frequência",
    value: "otimizada",
    period: "sem overtraining"
  }],
  wellness: [{
    metric: "Disposição",
    value: "+40%",
    period: "melhora reportada"
  }, {
    metric: "Sono",
    value: "+1.5h",
    period: "qualidade restaurada"
  }, {
    metric: "Consistência",
    value: "2x maior",
    period: "vs. treino livre"
  }]
};
const PLANS = [{
  id: "monthly",
  label: "Mensal",
  price: "R$ 39,90",
  originalPrice: null,
  period: "/mês",
  priceNote: "Renovação mensal",
  badge: null,
  highlight: false
}, {
  id: "annual",
  label: "Anual",
  price: "R$ 19,90",
  originalPrice: "R$ 39,90",
  period: "/mês",
  priceNote: "Cobrado R$ 238,80/ano · Economia de R$ 240",
  badge: "Mais popular",
  highlight: true
}, {
  id: "lifetime",
  label: "Vitalício",
  price: "R$ 297",
  originalPrice: null,
  period: " único",
  priceNote: "Acesso permanente · Paga 1x, usa para sempre",
  badge: "Melhor valor",
  highlight: false
}];
const AI_INSIGHTS = [{
  icon: Brain,
  text: "Protocolo de sobrecarga progressiva otimizado para seu nível"
}, {
  icon: Dumbbell,
  text: "Divisão muscular calculada para máxima recuperação"
}, {
  icon: Flame,
  text: "Metabolismo e calorias calibrados ao seu objetivo"
}, {
  icon: Target,
  text: "Periodização automática com deload inteligente"
}];
const FEATURES = ["Treino IA adaptativo", "3D Body Scan semanal", "Análise nutricional IA", "Metabolismo personalizado", "+500 exercícios em GIF", "Analytics corporal", "Ciclo hormonal feminino", "Suporte prioritário"];
function useCountdown(initialSeconds) {
  const [seconds, setSeconds] = reactExports.useState(initialSeconds);
  reactExports.useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s2) => s2 - 1), 1e3);
    return () => clearInterval(id);
  }, [seconds]);
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}
function getCompatibilityScore(profile) {
  let score = 88;
  if (profile.goal) score += 2;
  if (profile.experience) score += 2;
  if (profile.location) score += 2;
  if (profile.days?.length) score += Math.min(profile.days.length, 2);
  if (profile.name) score += 1;
  if (profile.equipment?.length) score += 1;
  return Math.min(score, 98);
}
function PaywallPage() {
  const navigate = useNavigate();
  const profile = loadOnboarding();
  const [selectedPlan, setSelectedPlan] = reactExports.useState("annual");
  const [loading, setLoading] = reactExports.useState(false);
  const countdown = useCountdown(23 * 60 + 47);
  const goalInfo = GOAL_LABELS[profile.goal ?? ""] ?? {
    short: "Fitness"
  };
  const expLabel = EXP_LABELS[profile.experience ?? ""] ?? "Seu nível";
  const locLabel = LOC_LABELS[profile.location ?? ""] ?? "Seu ambiente";
  const daysCount = profile.days?.length ?? 4;
  const duration = profile.duration ?? 60;
  const equipCount = profile.equipment?.length ?? 0;
  const firstName = profile.name?.split(" ")[0] || "Atleta";
  const compatibility = getCompatibilityScore(profile);
  const projections = GOAL_PROJECTIONS[profile.goal ?? ""] ?? GOAL_PROJECTIONS.wellness;
  const handleStart = () => {
    setLoading(true);
    setTimeout(() => navigate({
      to: "/criar-conta"
    }), 900);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-x-hidden text-foreground", style: {
    background: "#060b14"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed left-0 top-0 h-[700px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[140px]", style: {
      background: "radial-gradient(circle,rgba(34,211,238,0.18) 0%,transparent 70%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed bottom-0 right-0 h-[700px] w-[500px] translate-x-1/2 translate-y-1/4 rounded-full blur-[140px]", style: {
      background: "radial-gradient(circle,rgba(251,146,60,0.18) 0%,transparent 70%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 mx-auto max-w-sm px-5 pb-14 pt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-xl blur-md", style: {
              background: "linear-gradient(135deg,rgba(34,211,238,0.5),rgba(251,146,60,0.5))",
              transform: "scale(1.3)"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "3D Body Scan", className: "relative h-9 w-9 rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-black", style: {
            background: "linear-gradient(90deg,#22d3ee,#fff,#fb923c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }, children: "3D Body Scan" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]", style: {
          background: "rgba(34,211,238,0.1)",
          border: "1px solid rgba(34,211,238,0.2)",
          color: "#22d3ee"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
          " IA Concluída"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: -8
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.35
      }, className: "mb-4 flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold", style: {
        background: "rgba(74,222,128,0.08)",
        border: "1px solid rgba(74,222,128,0.15)",
        color: "rgba(74,222,128,0.9)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
        "847 atletas ativaram o plano esta semana",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex gap-0.5", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-2.5 w-2.5 fill-current" }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 18
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.45
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl font-black leading-tight", style: {
          background: "linear-gradient(90deg,#22d3ee 0%,#ffffff 45%,#fb923c 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }, children: [
          "Seu Protocolo",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "de ",
          goalInfo.short,
          " Está",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Pronto, ",
          firstName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm", style: {
          color: "rgba(148,163,184,0.8)"
        }, children: "A IA analisou seu perfil e gerou um protocolo exclusivo de 12 semanas. Só falta ativar." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.95
      }, animate: {
        opacity: 1,
        scale: 1
      }, transition: {
        delay: 0.1,
        duration: 0.35
      }, className: "mt-4 flex items-center justify-between rounded-2xl px-4 py-3", style: {
        background: "rgba(251,146,60,0.08)",
        border: "1px solid rgba(251,146,60,0.2)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold", style: {
          color: "rgba(251,146,60,0.9)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
          "Seu plano expira em"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-black tabular-nums", style: {
          color: "#fb923c"
        }, children: countdown })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        scale: 0.96
      }, animate: {
        opacity: 1,
        scale: 1
      }, transition: {
        delay: 0.14,
        duration: 0.4
      }, className: "mt-4 rounded-3xl p-px", style: {
        background: "linear-gradient(135deg,rgba(34,211,238,0.35),rgba(255,255,255,0.05) 50%,rgba(251,146,60,0.35))"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl p-5", style: {
        background: "rgba(9,14,24,0.95)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]", style: {
            color: "#22d3ee"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-3.5 w-3.5" }),
            " Análise da IA"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black", style: {
            background: "rgba(74,222,128,0.12)",
            border: "1px solid rgba(74,222,128,0.25)",
            color: "#4ade80"
          }, children: [
            compatibility,
            "% compatível"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2.5", children: [{
          label: "Objetivo",
          value: goalInfo.short
        }, {
          label: "Nível",
          value: expLabel
        }, {
          label: "Local",
          value: locLabel
        }, {
          label: "Frequência",
          value: `${daysCount}x/semana`
        }, {
          label: "Duração",
          value: `${duration} min`
        }, {
          label: "Equipamentos",
          value: equipCount > 0 ? `${equipCount} itens` : "Peso corporal"
        }].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-3", style: {
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.15em]", style: {
            color: "rgba(100,116,139,0.8)"
          }, children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-sm font-bold text-white", children: item.value })
        ] }, item.label)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 14
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.2,
        duration: 0.4
      }, className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]", style: {
          color: "rgba(148,163,184,0.6)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5", style: {
            color: "#4ade80"
          } }),
          "Resultados esperados para você"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: projections.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-3 text-center", style: {
          background: "rgba(74,222,128,0.05)",
          border: "1px solid rgba(74,222,128,0.12)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-black", style: {
            color: "#4ade80"
          }, children: p.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[10px] font-semibold", style: {
            color: "rgba(248,250,252,0.7)"
          }, children: p.metric }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[9px]", style: {
            color: "rgba(100,116,139,0.7)"
          }, children: p.period })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 14
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.26,
        duration: 0.4
      }, className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-xs font-bold uppercase tracking-[0.18em]", style: {
          color: "rgba(148,163,184,0.6)"
        }, children: "Dentro do seu protocolo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: AI_INSIGHTS.map(({
          icon: Icon,
          text
        }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-2xl px-4 py-3", style: {
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full", style: {
            background: "rgba(34,211,238,0.1)",
            border: "1px solid rgba(34,211,238,0.2)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5", style: {
            color: "#22d3ee"
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
            color: "rgba(248,250,252,0.8)"
          }, children: text })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 14
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.32,
        duration: 0.4
      }, className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: {
            background: "rgba(255,255,255,0.06)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full px-3 py-1.5", style: {
            background: "rgba(251,146,60,0.1)",
            border: "1px solid rgba(251,146,60,0.2)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3", style: {
              color: "#fb923c"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.18em]", style: {
              color: "#fb923c"
            }, children: "Escolha seu plano" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: {
            background: "rgba(255,255,255,0.06)"
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isAnnual = plan.id === "annual";
          const isLifetime = plan.id === "lifetime";
          const accentColor = isAnnual ? "#fb923c" : isLifetime ? "#22d3ee" : "rgba(255,255,255,0.5)";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedPlan(plan.id), className: "relative w-full rounded-2xl p-4 text-left transition-all", style: {
            border: `1.5px solid ${isSelected ? accentColor : "rgba(255,255,255,0.07)"}`,
            background: isSelected ? `${accentColor}0d` : "rgba(255,255,255,0.02)",
            transform: isSelected ? "scale(1.01)" : "scale(1)"
          }, children: [
            plan.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2.5 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.15em] text-white", style: {
              background: isAnnual ? "linear-gradient(135deg,#ea580c,#fb923c)" : "linear-gradient(135deg,#0891b2,#22d3ee)",
              boxShadow: isAnnual ? "0 0 10px rgba(251,146,60,0.5)" : "0 0 10px rgba(34,211,238,0.5)"
            }, children: plan.badge }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-5 w-5 shrink-0 place-items-center rounded-full transition-all", style: {
                  border: `2px solid ${isSelected ? accentColor : "rgba(255,255,255,0.2)"}`,
                  background: isSelected ? accentColor : "transparent"
                }, children: isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-black" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-white", children: plan.label }),
                  plan.priceNote && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px]", style: {
                    color: "rgba(148,163,184,0.6)"
                  }, children: plan.priceNote })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                plan.originalPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs line-through", style: {
                  color: "rgba(148,163,184,0.45)"
                }, children: [
                  plan.originalPrice,
                  "/mês"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-black text-white", children: plan.price }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
                    color: "rgba(148,163,184,0.6)"
                  }, children: plan.period })
                ] })
              ] })
            ] })
          ] }, plan.id);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl p-4", style: {
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-[10px] font-bold uppercase tracking-[0.18em]", style: {
            color: "rgba(148,163,184,0.5)"
          }, children: "Incluído em todos os planos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-4 gap-y-2", children: FEATURES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs", style: {
            color: "rgba(248,250,252,0.8)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 shrink-0", style: {
              color: "#4ade80"
            } }),
            f
          ] }, f)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.42,
        duration: 0.4
      }, className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.button, { whileTap: {
          scale: 0.97
        }, onClick: handleStart, disabled: loading, className: "flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-base font-black text-white transition disabled:opacity-60", style: {
          background: "linear-gradient(135deg,#c2410c,#ea580c,#fb923c,#fdba74)",
          boxShadow: "0 0 40px rgba(251,146,60,0.5), 0 4px 20px rgba(0,0,0,0.5)"
        }, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 animate-pulse" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }),
          "Ativar Meu Plano Agora",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-2xl px-4 py-3 text-center", style: {
          background: "rgba(74,222,128,0.06)",
          border: "1px solid rgba(74,222,128,0.15)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-xs font-bold", style: {
            color: "#4ade80"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
            "Garantia total de 7 dias — devolução sem perguntas"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10px]", style: {
            color: "rgba(100,116,139,0.7)"
          }, children: "Se não evoluir na primeira semana, devolvemos 100% do valor." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-center text-xs", style: {
          color: "rgba(100,116,139,0.5)"
        }, children: [
          "Já tem uma conta?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-semibold transition hover:opacity-80", style: {
            color: "#22d3ee"
          }, children: "Fazer login" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShareVideoButton, { composition: PaywallShowcaseVideo, inputProps: {
        planName: "Pro"
      }, durationInFrames: 450, title: "Compartilhar 3D Body Scan", label: "Ver preview do app", variant: "ghost" }) })
    ] })
  ] });
}
export {
  PaywallPage as component
};