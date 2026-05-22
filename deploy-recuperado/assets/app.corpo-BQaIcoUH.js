import { W as jsxRuntimeExports, r as reactExports } from "./server-C0e4gypg.js";
import { A as AIInsightCard } from "./AIInsightCard-CiRV3C7C.js";
import { c as cn } from "./utils-Bz4m9VPB.js";
import { c as createLucideIcon, g as getStoredLocale, C as bodyScans, D as bodyComposition, l as loadOnboarding, X, E as nutritionToday, q as buildAthleteProfile, P as Plus, F as formatScanDate, G as foodScans, H as bodyMeasures, I as exercises } from "./router-BDD3RgVy.js";
import { b as buildUserContext } from "./ai-service-Dcx-r93S.js";
import { a as auth } from "./firebase-CeVmTMBf.js";
import { u as useCurrentFrame, a as useVideoConfig, i as interpolate, s as spring, A as AbsoluteFill, S as Sequence } from "./index-CcuZFuTS.js";
import { G as GradientBackground } from "./VideoPlayerModal-BQaBY8IB.js";
import { B as BrandOverlay } from "./BrandOverlay-B4-tEure.js";
import { A as AnimatedCounter } from "./AnimatedCounter-D13SVpt3.js";
import { A as AnimatedBar } from "./AnimatedBar-OjSZ2IxW.js";
import { S as ShareVideoButton } from "./ShareVideoButton-DuyJVam8.js";
import { S as ScanLine } from "./scan-line-CN8Ia3oi.js";
import { R as RadialBarChart, P as PolarAngleAxis, a as RadialBar } from "./RadialBarChart-DF6-4tNH.js";
import { F as Flame } from "./flame-B4I7h4kj.js";
import { C as Check } from "./check-j8hLnasa.js";
import { D as Droplets, S as Sun } from "./sun-CW7_kSEo.js";
import { Z as Zap } from "./zap-DR4zCOeL.js";
import { T as Target } from "./target-DclDxru3.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
import { C as Camera } from "./camera-BjaEtEca.js";
import { A as ArrowRight } from "./arrow-right-B87Ma675.js";
import { L as LoaderCircle } from "./loader-circle-B6zikF32.js";
import { T as TrendingUp } from "./trending-up-DCMFIZtG.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
import "./generateCategoricalChart-BuWpYmVk.js";
const __iconNode$4 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
];
const Maximize2 = createLucideIcon("maximize-2", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z",
      key: "icamh8"
    }
  ],
  ["path", { d: "m14.5 12.5 2-2", key: "inckbg" }],
  ["path", { d: "m11.5 9.5 2-2", key: "fmmyf7" }],
  ["path", { d: "m8.5 6.5 2-2", key: "vc6u1g" }],
  ["path", { d: "m17.5 15.5 2-2", key: "wo5hmg" }]
];
const Ruler = createLucideIcon("ruler", __iconNode$2);
const __iconNode$1 = [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
];
const Smartphone = createLucideIcon("smartphone", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
function CorpoEvolutionVideo({
  name = "Atleta",
  bodyFatStart = 22,
  bodyFatCurrent = 18,
  weightStart = 80,
  weightCurrent = 82,
  waistStart = 90,
  waistCurrent = 86,
  muscleMass = 68,
  trend = "Recomposição"
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: "clamp" });
  const card1Scale = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 120 } });
  const card2Scale = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 120 } });
  const card3Scale = spring({ frame: frame - 70, fps, config: { damping: 14, stiffness: 120 } });
  const fatDelta = bodyFatCurrent - bodyFatStart;
  const weightDelta = weightCurrent - weightStart;
  const waistDelta = waistCurrent - waistStart;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AbsoluteFill, { style: { fontFamily: "sans-serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GradientBackground, { variant: "corpo" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandOverlay, { position: "top" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      top: 140,
      left: 0,
      right: 0,
      textAlign: "center",
      opacity: titleOpacity,
      transform: `translateY(${titleY}px)`
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, color: "rgba(148,163,184,0.8)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }, children: "Evolução Corporal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: 42,
        fontWeight: 900,
        letterSpacing: -1,
        background: "linear-gradient(90deg,#22d3ee,#ffffff,#fb923c)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }, children: name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        marginTop: 12,
        display: "inline-block",
        background: "rgba(34,211,238,0.15)",
        border: "1px solid rgba(34,211,238,0.3)",
        borderRadius: 999,
        padding: "6px 20px",
        fontSize: 14,
        color: "#22d3ee",
        fontWeight: 700,
        letterSpacing: 1
      }, children: trend })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 320, left: 48, right: 48, display: "flex", flexDirection: "column", gap: 20 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: `scale(${card1Scale})`, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.2)", borderRadius: 24, padding: 28 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(148,163,184,0.7)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }, children: "Gordura Corporal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCounter, { from: bodyFatStart, to: bodyFatCurrent, startFrame: 40, endFrame: 80, decimals: 1, suffix: "%", style: { fontSize: 52, fontWeight: 900, color: fatDelta < 0 ? "#4ade80" : "#f87171" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: "rgba(148,163,184,0.6)" }, children: "Início" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 22, fontWeight: 700, color: "rgba(148,163,184,0.5)" }, children: [
              bodyFatStart,
              "%"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedBar, { pct: bodyFatCurrent * 2.5, startFrame: 50, color: fatDelta < 0 ? "#4ade80" : "#f87171" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 10, fontSize: 13, fontWeight: 700, color: fatDelta < 0 ? "#4ade80" : "#f87171" }, children: [
          fatDelta < 0 ? "▼" : "▲",
          " ",
          Math.abs(fatDelta).toFixed(1),
          "% ",
          fatDelta < 0 ? "eliminados" : "ganhos"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 16 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, transform: `scale(${card2Scale})`, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 24, padding: 24 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(148,163,184,0.7)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }, children: "Peso" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCounter, { from: weightStart, to: weightCurrent, startFrame: 60, endFrame: 100, decimals: 1, suffix: " kg", style: { fontSize: 34, fontWeight: 900, color: "#fb923c" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 6, fontSize: 12, color: weightDelta > 0 ? "#4ade80" : "#f87171", fontWeight: 700 }, children: [
            weightDelta > 0 ? "+" : "",
            weightDelta.toFixed(1),
            " kg"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, transform: `scale(${card3Scale})`, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 24, padding: 24 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(148,163,184,0.7)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }, children: "Cintura" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCounter, { from: waistStart, to: waistCurrent, startFrame: 70, endFrame: 110, decimals: 0, suffix: " cm", style: { fontSize: 34, fontWeight: 900, color: "#a78bfa" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 6, fontSize: 12, color: waistDelta < 0 ? "#4ade80" : "#f87171", fontWeight: 700 }, children: [
            waistDelta > 0 ? "+" : "",
            waistDelta,
            " cm"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 90, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 24, padding: 24 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(148,163,184,0.7)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }, children: "Massa Magra Estimada" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 16 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCounter, { from: 0, to: muscleMass, startFrame: 0, endFrame: 40, decimals: 1, suffix: " kg", style: { fontSize: 40, fontWeight: 900, color: "#4ade80" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedBar, { pct: muscleMass / weightCurrent * 100, startFrame: 10, color: "#4ade80", height: 10 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8, fontSize: 12, color: "rgba(148,163,184,0.6)" }, children: [
              (muscleMass / weightCurrent * 100).toFixed(0),
              "% do peso total"
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandOverlay, { position: "bottom" })
  ] });
}
function MuscleSilhouette({ muscle, className, variant = "light", onSelect }) {
  const [hovered, setHovered] = reactExports.useState(null);
  const base = variant === "light" ? "fill-slate-200" : "fill-elevated";
  const stroke = variant === "light" ? "stroke-slate-400" : "stroke-border";
  const hi = "fill-[oklch(0.74_0.17_53)]";
  const hoverHi = "fill-[oklch(0.74_0.17_53)]/60";
  const dim = "fill-transparent";
  const isInteractive = !!onSelect;
  const getStyleProps = (target) => {
    const isSelected = muscle === target || muscle === "Full Body";
    const isHovered = hovered === target;
    let fillClass = dim;
    if (isSelected) {
      fillClass = hi;
    } else if (isHovered && isInteractive) {
      fillClass = hoverHi;
    }
    return {
      className: cn(
        "transition-all duration-200 ease-out outline-none",
        fillClass,
        isInteractive && "cursor-pointer hover:scale-[1.01] origin-center"
      ),
      filter: isSelected || isHovered ? "url(#neon-glow-orange)" : void 0,
      onClick: isInteractive ? () => onSelect(target) : void 0,
      onMouseEnter: isInteractive ? () => setHovered(target) : void 0,
      onMouseLeave: isInteractive ? () => setHovered(null) : void 0
    };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 200 320",
      className: cn("h-full w-full select-none", className),
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: "neon-glow-orange", x: "-30%", y: "-30%", width: "160%", height: "160%", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "3.5", result: "blur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: cn(base, stroke), strokeWidth: 1, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "100", cy: "28", r: "18" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "92", y: "44", width: "16", height: "10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M60 60 Q100 50 140 60 L150 160 Q100 175 50 160 Z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M60 62 Q40 100 38 150 L48 152 Q54 105 70 70 Z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M140 62 Q160 100 162 150 L152 152 Q146 105 130 70 Z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M38 150 Q34 195 36 230 L48 230 Q52 195 48 152 Z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M162 150 Q166 195 164 230 L152 230 Q148 195 152 152 Z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M55 160 Q100 175 145 160 L140 195 Q100 205 60 195 Z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M62 195 Q70 250 76 280 L94 280 Q98 245 96 198 Z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M138 195 Q130 250 124 280 L106 280 Q102 245 104 198 Z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M76 280 Q72 305 78 318 L92 318 Q96 300 94 280 Z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M124 280 Q128 305 122 318 L108 318 Q104 300 106 280 Z" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M68 75 Q100 70 132 75 L128 110 Q100 118 72 110 Z",
              ...getStyleProps("Peito")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "ellipse",
              {
                cx: "58",
                cy: "72",
                rx: "14",
                ry: "10",
                ...getStyleProps("Ombros")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "ellipse",
              {
                cx: "142",
                cy: "72",
                rx: "14",
                ry: "10",
                ...getStyleProps("Ombros")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M44 95 Q40 130 50 145 L62 142 Q60 110 56 90 Z",
                ...getStyleProps("Bíceps")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M156 95 Q160 130 150 145 L138 142 Q140 110 144 90 Z",
                ...getStyleProps("Bíceps")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { opacity: 0.85, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M50 100 Q46 130 52 145 L58 144 Q56 115 54 100 Z",
                ...getStyleProps("Tríceps")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M150 100 Q154 130 148 145 L142 144 Q144 115 146 100 Z",
                ...getStyleProps("Tríceps")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M40 160 Q36 200 40 225 L48 225 Q50 195 48 158 Z",
                ...getStyleProps("Antebraço")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M160 160 Q164 200 160 225 L152 225 Q150 195 152 158 Z",
                ...getStyleProps("Antebraço")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: "86",
              y: "115",
              width: "28",
              height: "50",
              rx: "6",
              ...getStyleProps("Core")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M70 60 Q100 56 130 60 L128 90 Q100 95 72 90 Z",
              opacity: 0.6,
              ...getStyleProps("Costas")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M66 200 Q72 245 78 278 L92 278 Q96 245 94 202 Z",
                ...getStyleProps("Pernas")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M134 200 Q128 245 122 278 L108 278 Q104 245 106 202 Z",
                ...getStyleProps("Pernas")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M70 175 Q100 188 130 175 L128 200 Q100 208 72 200 Z",
              ...getStyleProps("Glúteos")
            }
          )
        ] })
      ]
    }
  );
}
function getGoalLabel(profile) {
  if (profile.goal === "ganho_massa") return "ganho de massa";
  if (profile.goal === "perda_peso") return "perda de peso";
  if (profile.goal === "definicao") return "definição";
  if (profile.goal === "forca") return "força";
  if (profile.goal === "performance") return "performance";
  return "saude";
}
function getRemainingPercent(macro) {
  if (macro.goal <= 0) return 0;
  return Math.max(0, 100 - Math.round(macro.eaten / macro.goal * 100));
}
function evaluateNutritionState(profile, snapshot, foodScans2) {
  const proteinGap = snapshot.macros.protein.goal - snapshot.macros.protein.eaten;
  const kcalGap = snapshot.kcal.goal - snapshot.kcal.eaten;
  const latestFoodScan = foodScans2[0] ?? null;
  const goalLabel = getGoalLabel(profile);
  const proteinRemainingPct = getRemainingPercent(snapshot.macros.protein);
  const primaryMessage = proteinGap > 35 ? `Você ainda está ${proteinRemainingPct}% abaixo da meta de proteína para ${goalLabel}.` : kcalGap > 250 ? `Seu plano ainda tem espaço calórico para fechar o dia alinhado com ${goalLabel}.` : `Sua alimentação de hoje está mais alinhada com o objetivo de ${goalLabel}.`;
  const balanceLabel = proteinGap > 35 ? "proteína baixa" : kcalGap > 250 ? "janela aberta" : "equilíbrio bom";
  const insights = [
    {
      id: "hidratacao",
      title: "Hidratação",
      desc: profile.location === "outdoor" ? "Treino em ambiente externo pede mais água ao longo do dia e reposição antes do treino." : "Distribua água ao longo do dia e concentre 2 copos nas horas antes do treino.",
      tone: "equilibrio"
    },
    {
      id: "proteina",
      title: "Proteína do dia",
      desc: proteinGap > 35 ? `Faltam cerca de ${Math.max(0, Math.round(proteinGap))}g de proteína. Uma refeição com carne magra, ovos ou whey ajuda a fechar o alvo.` : "A meta de proteína está mais bem distribuída hoje. Mantenha o jantar consistente.",
      tone: proteinGap > 35 ? "alerta" : "equilibrio"
    },
    {
      id: "scan_refeicao",
      title: "Leitura da última refeição",
      desc: latestFoodScan ? `O último scan da refeição ${latestFoodScan.refeicao.toLowerCase()} marcou ${latestFoodScan.estimativas.kcal} kcal, ${latestFoodScan.estimativas.proteinaG}g de proteína e ${latestFoodScan.qualidade.confiancaLeitura}% de confiança.` : "Ainda não existe scan alimentar salvo para validar o prato de hoje.",
      tone: "performance"
    }
  ];
  return {
    balanceLabel,
    primaryMessage,
    insights,
    latestFoodScan
  };
}
const COPY = {
  pt: {
    title: "3D Body Scan",
    subtitle: "Scan corporal com IA — medidas precisas, composição corporal e evolução visual em tempo real.",
    measures: "Medidas",
    nutrition: "Nutrição",
    bodyScan: "Scan corporal",
    bodyDesc: "Tire uma foto de corpo inteiro ou envie da galeria para a IA estimar medidas e percentual de gordura.",
    foodScan: "Scan da alimentação",
    foodDesc: "Aponte para o prato ou envie da galeria para a IA estimar calorias, proteína e carboidratos.",
    lastReading: "Última leitura",
    latestPhoto: "sua foto mais recente",
    noSavedScan: "nenhum scan salvo ainda",
    firstScan: "Faça seu primeiro scan para ver sua foto aqui.",
    todaySummary: "Resumo de hoje",
    goalsMacros: "metas calóricas e macros",
    meals: "Refeições",
    aiSuggestions: "Sugestões da IA",
    personalized: "ajustes personalizados",
    historyBody: "Histórico de scans corporais",
    historyFood: "Histórico de scans de alimentação",
    evolution: "evolução",
    camera: "Câmera",
    gallery: "Galeria",
    useGallery: "Usar galeria",
    captureGuide: "Guia de captura",
    quickCalibration: "Calibragem rápida",
    distance: "Distância",
    lighting: "Iluminação",
    framing: "Enquadramento",
    posture: "Postura",
    continue: "Continuar",
    height: "Altura",
    weight: "Peso",
    clothing: "Vestimenta",
    ready: "Pronto. A precisão estimada é de aproximadamente 1,5 cm com a calibragem aplicada.",
    back: "Voltar",
    startScan: "Iniciar scan",
    scanning: "IA analisando imagem...",
    analysisDone: "Análise concluída",
    saveClose: "Salvar e fechar",
    bodyfat: "Gordura",
    confidence: "Confiança",
    editMeasuresTitle: "Suas Medidas Reais",
    tapToEdit: "Toque no valor para editar",
    saveMeasures: "Salvar medidas",
    body3d: "Corpo 3D",
    compare: "Comparar",
    bodyTypeTab: "Tipo",
    colorMetricTab: "Cor",
    musclesTab: "Músculos",
    edit: "Editar",
    chest: "Peito",
    waist: "Cintura",
    hip: "Quadril",
    arm: "Braço",
    thigh: "Coxa",
    calf: "Panturrilha",
    shoulders: "Ombros",
    leanMass: "Massa magra",
    before: "Anterior",
    current: "Atual",
    monthsAgo: "6 meses atrás",
    today: "Hoje",
    bodyTypeLabel: "Seu tipo corporal",
    rcqLabel: "RCQ",
    chestHipLabel: "Peito/Quad.",
    grew: "Cresceu",
    reduced: "Reduziu",
    zoneEvolution: "Evolução por zona corporal",
    remaining: "restantes",
    protein: "Proteína",
    fat: "Gordura",
    carbs: "Carbo",
    kcalRegistered: (n) => `+${n} kcal registradas pela IA`,
    aiDetectsAuto: "IA detecta calorias e macros automaticamente",
    aimAtPlateModal: "Aponte para o prato — a IA detecta kcal e macros e registra automaticamente.",
    permissionDenied: "Permissão negada. Habilite a câmera nas configurações do navegador.",
    cameraInUse: "Câmera em uso por outro app. Feche outros aplicativos e tente novamente.",
    aiUnavailable: "Análise IA indisponível. Verifique a configuração da chave de API.",
    silhouette: "Silhueta",
    composition: "Composição",
    precision: "Precisão",
    calories: "Calorias",
    macrosLabel: "Macros",
    initializingScanner: "Inicializando scanner",
    cancel: "Cancelar",
    fullBodyCapture: "Corpo inteiro no quadro · Toque para capturar",
    foodCapture: "Aponte para o prato · Toque para capturar",
    calibrateBtn: "Calibrar IA",
    calibrationDataDesc: "Dados de calibração — aumentam a precisão",
    calibratedMsg: "Sistema calibrado · Precisão estimada ±1,5 cm",
    outfitTight: "justa",
    outfitNormal: "normal",
    outfitLoose: "larga",
    startScan3d: "Iniciar Scan 3D",
    scanning3DHeader: "Mapeando · 3D Body Scan",
    analysisDoneHeader: "Análise Concluída",
    aiMappingLabel: "IA Mapeando Pontos 3D",
    bodyCompositionScan: "Composição corporal",
    measureEstimateScan: "Estimativa de medidas",
    fatPctScan: "% Gordura",
    scan3dDone: "Scan 3D Concluído",
    recordsFn: (n) => `${n} registros | evolução`,
    waistSeries: "Cintura (cm)",
    chestSeries: "Peito (cm)",
    calsSeries: "Calorias (kcal)",
    proteinSeries: "Proteína (g x 10)",
    captureSetupItems: [{
      title: "2,5m de distância",
      desc: "Na altura do quadril"
    }, {
      title: "Luz frontal",
      desc: "Sem contraluz"
    }, {
      title: "Corpo inteiro",
      desc: "Cabeça aos pés"
    }, {
      title: "Braços afastados",
      desc: "Roupa justa"
    }],
    noHistoryYet: "Seu histórico corporal ainda está formando a primeira linha de tendência.",
    bodyReadingLabel: "Leitura corporal em consolidação.",
    frontStep: "Frente",
    backStep: "Costas",
    turnAroundMsg: "Ótimo! Agora vire de costas para a câmera.",
    stepFront: "1/2 · FRENTE",
    stepBack: "2/2 · COSTAS",
    frontCaptureGuide: "Posicione-se de frente · Toque para capturar",
    backCaptureGuide: "Agora de costas · Toque para capturar",
    frontCaptured: "Frente capturada ✓",
    mergingPhotos: "Mesclando imagens..."
  },
  es: {
    title: "3D Body Scan",
    subtitle: "Escaneo corporal con IA — medidas precisas, composicion corporal y evolucion visual en tiempo real.",
    measures: "Medidas",
    nutrition: "Nutricion",
    bodyScan: "Escaneo corporal",
    bodyDesc: "Toma una foto de cuerpo completo o subela desde la galeria para que la IA estime medidas y porcentaje de grasa.",
    foodScan: "Escaneo de alimentacion",
    foodDesc: "Apunta al plato o subelo desde la galeria para que la IA estime calorias, proteina y carbohidratos.",
    lastReading: "Ultima lectura",
    latestPhoto: "tu foto mas reciente",
    noSavedScan: "todavia no hay escaneos guardados",
    firstScan: "Haz tu primer escaneo para ver tu foto aqui.",
    todaySummary: "Resumen de hoy",
    goalsMacros: "metas caloricas y macros",
    meals: "Comidas",
    aiSuggestions: "Sugerencias de IA",
    personalized: "ajustes personalizados",
    historyBody: "Historial de escaneos corporales",
    historyFood: "Historial de escaneos de alimentacion",
    evolution: "evolucion",
    camera: "Camara",
    gallery: "Galeria",
    useGallery: "Usar galeria",
    captureGuide: "Guia de captura",
    quickCalibration: "Calibracion rapida",
    distance: "Distancia",
    lighting: "Iluminacion",
    framing: "Encuadre",
    posture: "Postura",
    continue: "Continuar",
    height: "Altura",
    weight: "Peso",
    clothing: "Vestimenta",
    ready: "Listo. La precision estimada es de aproximadamente 1,5 cm con la calibracion aplicada.",
    back: "Volver",
    startScan: "Iniciar escaneo",
    scanning: "IA analizando imagen...",
    analysisDone: "Analisis completado",
    saveClose: "Guardar y cerrar",
    bodyfat: "Grasa",
    confidence: "Confianza",
    editMeasuresTitle: "Tus Medidas Reales",
    tapToEdit: "Toca el valor para editar",
    saveMeasures: "Guardar medidas",
    body3d: "Cuerpo 3D",
    compare: "Comparar",
    bodyTypeTab: "Tipo",
    colorMetricTab: "Color",
    musclesTab: "Músculos",
    edit: "Editar",
    chest: "Pecho",
    waist: "Cintura",
    hip: "Cadera",
    arm: "Brazo",
    thigh: "Muslo",
    calf: "Pantorrilla",
    shoulders: "Hombros",
    leanMass: "Masa magra",
    before: "Anterior",
    current: "Actual",
    monthsAgo: "hace 6 meses",
    today: "Hoy",
    bodyTypeLabel: "Tu tipo corporal",
    rcqLabel: "ICC",
    chestHipLabel: "Pecho/Cad.",
    grew: "Crecio",
    reduced: "Redujo",
    zoneEvolution: "Evolucion por zona corporal",
    remaining: "restantes",
    protein: "Proteina",
    fat: "Grasa",
    carbs: "Carbo",
    kcalRegistered: (n) => `+${n} kcal registradas por IA`,
    aiDetectsAuto: "La IA detecta calorias y macros automaticamente",
    aimAtPlateModal: "Apunta al plato — la IA detecta kcal y macros y registra automaticamente.",
    permissionDenied: "Permiso denegado. Habilita la camara en la configuracion del navegador.",
    cameraInUse: "Camara en uso por otra aplicacion. Cierra otras apps e intenta de nuevo.",
    aiUnavailable: "Analisis IA no disponible. Verifica la configuracion de la clave API.",
    silhouette: "Silueta",
    composition: "Composicion",
    precision: "Precision",
    calories: "Calorias",
    macrosLabel: "Macros",
    initializingScanner: "Inicializando escaner",
    cancel: "Cancelar",
    fullBodyCapture: "Cuerpo entero en el encuadre · Toca para capturar",
    foodCapture: "Apunta al plato · Toca para capturar",
    calibrateBtn: "Calibrar IA",
    calibrationDataDesc: "Datos de calibracion — aumentan la precision",
    calibratedMsg: "Sistema calibrado · Precision estimada ±1,5 cm",
    outfitTight: "ajustada",
    outfitNormal: "normal",
    outfitLoose: "holgada",
    startScan3d: "Iniciar Escaneo 3D",
    scanning3DHeader: "Mapeando · 3D Body Scan",
    analysisDoneHeader: "Analisis Completado",
    aiMappingLabel: "IA Mapeando Puntos 3D",
    bodyCompositionScan: "Composicion corporal",
    measureEstimateScan: "Estimacion de medidas",
    fatPctScan: "% Grasa",
    scan3dDone: "Escaneo 3D Completo",
    recordsFn: (n) => `${n} registros | evolucion`,
    waistSeries: "Cintura (cm)",
    chestSeries: "Pecho (cm)",
    calsSeries: "Calorias (kcal)",
    proteinSeries: "Proteina (g x 10)",
    captureSetupItems: [{
      title: "2,5m de distancia",
      desc: "A la altura de la cadera"
    }, {
      title: "Luz frontal",
      desc: "Sin contraluz"
    }, {
      title: "Cuerpo entero",
      desc: "Cabeza a pies"
    }, {
      title: "Brazos separados",
      desc: "Ropa ajustada"
    }],
    noHistoryYet: "Tu historial corporal todavia esta formando la primera linea de tendencia.",
    bodyReadingLabel: "Lectura corporal en consolidacion.",
    frontStep: "Frente",
    backStep: "Espalda",
    turnAroundMsg: "Genial! Ahora gire de espaldas a la camara.",
    stepFront: "1/2 · FRENTE",
    stepBack: "2/2 · ESPALDA",
    frontCaptureGuide: "Posicionese de frente · Toque para capturar",
    backCaptureGuide: "Ahora de espaldas · Toque para capturar",
    frontCaptured: "Frente capturada ✓",
    mergingPhotos: "Combinando imagenes..."
  },
  en: {
    title: "3D Body Scan",
    subtitle: "AI body scan — precise measurements, body composition, and visual progress in real time.",
    measures: "Measures",
    nutrition: "Nutrition",
    bodyScan: "Body scan",
    bodyDesc: "Take a full-body photo or upload one from your gallery so AI can estimate measurements and body fat percentage.",
    foodScan: "Food scan",
    foodDesc: "Point at the plate or upload from your gallery so AI can estimate calories, protein, and carbs.",
    lastReading: "Latest reading",
    latestPhoto: "your most recent photo",
    noSavedScan: "no saved scan yet",
    firstScan: "Take your first scan to see your photo here.",
    todaySummary: "Today's summary",
    goalsMacros: "calorie goals and macros",
    meals: "Meals",
    aiSuggestions: "AI suggestions",
    personalized: "personalized adjustments",
    historyBody: "Body scan history",
    historyFood: "Food scan history",
    evolution: "progress",
    camera: "Camera",
    gallery: "Gallery",
    useGallery: "Use gallery",
    captureGuide: "Capture guide",
    quickCalibration: "Quick calibration",
    distance: "Distance",
    lighting: "Lighting",
    framing: "Framing",
    posture: "Posture",
    continue: "Continue",
    height: "Height",
    weight: "Weight",
    clothing: "Clothing",
    ready: "Done. Estimated precision is approximately 1.5 cm with calibration applied.",
    back: "Back",
    startScan: "Start scan",
    scanning: "AI analyzing image...",
    analysisDone: "Analysis completed",
    saveClose: "Save and close",
    bodyfat: "Body Fat",
    confidence: "Confidence",
    editMeasuresTitle: "Your Real Measurements",
    tapToEdit: "Tap a value to edit",
    saveMeasures: "Save measurements",
    body3d: "3D Body",
    compare: "Compare",
    bodyTypeTab: "Type",
    colorMetricTab: "Color",
    musclesTab: "Muscles",
    edit: "Edit",
    chest: "Chest",
    waist: "Waist",
    hip: "Hip",
    arm: "Arm",
    thigh: "Thigh",
    calf: "Calf",
    shoulders: "Shoulders",
    leanMass: "Lean Mass",
    before: "Before",
    current: "Current",
    monthsAgo: "6 months ago",
    today: "Today",
    bodyTypeLabel: "Your body type",
    rcqLabel: "WHR",
    chestHipLabel: "Chest/Hip",
    grew: "Grew",
    reduced: "Reduced",
    zoneEvolution: "Zone evolution",
    remaining: "remaining",
    protein: "Protein",
    fat: "Fat",
    carbs: "Carbs",
    kcalRegistered: (n) => `+${n} kcal logged by AI`,
    aiDetectsAuto: "AI detects calories and macros automatically",
    aimAtPlateModal: "Aim at the plate — AI detects kcal and macros and logs automatically.",
    permissionDenied: "Permission denied. Enable the camera in browser settings.",
    cameraInUse: "Camera in use by another app. Close other apps and try again.",
    aiUnavailable: "AI analysis unavailable. Check your API key configuration.",
    silhouette: "Silhouette",
    composition: "Composition",
    precision: "Precision",
    calories: "Calories",
    macrosLabel: "Macros",
    initializingScanner: "Initializing scanner",
    cancel: "Cancel",
    fullBodyCapture: "Full body in frame · Tap to capture",
    foodCapture: "Aim at the plate · Tap to capture",
    calibrateBtn: "Calibrate AI",
    calibrationDataDesc: "Calibration data — increases precision",
    calibratedMsg: "Calibrated · Estimated precision ±1.5 cm",
    outfitTight: "tight",
    outfitNormal: "normal",
    outfitLoose: "loose",
    startScan3d: "Start 3D Scan",
    scanning3DHeader: "Mapping · 3D Body Scan",
    analysisDoneHeader: "Analysis Completed",
    aiMappingLabel: "AI Mapping 3D Points",
    bodyCompositionScan: "Body composition",
    measureEstimateScan: "Measurements estimate",
    fatPctScan: "% Body Fat",
    scan3dDone: "3D Scan Complete",
    recordsFn: (n) => `${n} records | progress`,
    waistSeries: "Waist (cm)",
    chestSeries: "Chest (cm)",
    calsSeries: "Calories (kcal)",
    proteinSeries: "Protein (g x 10)",
    captureSetupItems: [{
      title: "2.5m away",
      desc: "At hip height"
    }, {
      title: "Front lighting",
      desc: "No backlight"
    }, {
      title: "Full body",
      desc: "Head to feet"
    }, {
      title: "Arms out",
      desc: "Fitted clothing"
    }],
    noHistoryYet: "Your body history is still forming the first trend line.",
    bodyReadingLabel: "Body reading consolidating.",
    frontStep: "Front",
    backStep: "Back",
    turnAroundMsg: "Great! Now turn around with your back to the camera.",
    stepFront: "1/2 · FRONT",
    stepBack: "2/2 · BACK",
    frontCaptureGuide: "Face the camera · Tap to capture",
    backCaptureGuide: "Now turn around · Tap to capture",
    frontCaptured: "Front captured ✓",
    mergingPhotos: "Merging images..."
  },
  fr: {
    title: "3D Body Scan",
    subtitle: "Scan corporel par IA — mesures precises, composition corporelle et evolution visuelle en temps reel.",
    measures: "Mesures",
    nutrition: "Nutrition",
    bodyScan: "Scan corporel",
    bodyDesc: "Prenez une photo du corps entier ou importez-la depuis la galerie pour que l'IA estime les mesures et le pourcentage de graisse.",
    foodScan: "Scan alimentaire",
    foodDesc: "Pointez vers l'assiette ou importez depuis la galerie pour que l'IA estime calories, proteines et glucides.",
    lastReading: "Derniere lecture",
    latestPhoto: "votre photo la plus recente",
    noSavedScan: "aucun scan enregistre pour l'instant",
    firstScan: "Faites votre premier scan pour voir votre photo ici.",
    todaySummary: "Resume du jour",
    goalsMacros: "objectifs caloriques et macros",
    meals: "Repas",
    aiSuggestions: "Suggestions de l'IA",
    personalized: "ajustements personnalises",
    historyBody: "Historique des scans corporels",
    historyFood: "Historique des scans alimentaires",
    evolution: "evolution",
    camera: "Camera",
    gallery: "Galerie",
    useGallery: "Utiliser la galerie",
    captureGuide: "Guide de capture",
    quickCalibration: "Calibration rapide",
    distance: "Distance",
    lighting: "Eclairage",
    framing: "Cadrage",
    posture: "Posture",
    continue: "Continuer",
    height: "Taille",
    weight: "Poids",
    clothing: "Tenue",
    ready: "Pret. La precision estimee est d'environ 1,5 cm avec la calibration appliquee.",
    back: "Retour",
    startScan: "Demarrer le scan",
    scanning: "IA en train d'analyser l'image...",
    analysisDone: "Analyse terminee",
    saveClose: "Enregistrer et fermer",
    bodyfat: "Graisse",
    confidence: "Confiance",
    editMeasuresTitle: "Vos Vraies Mesures",
    tapToEdit: "Touchez une valeur pour modifier",
    saveMeasures: "Enregistrer les mesures",
    body3d: "Corps 3D",
    compare: "Comparer",
    bodyTypeTab: "Type",
    colorMetricTab: "Couleur",
    musclesTab: "Muscles",
    edit: "Modifier",
    chest: "Poitrine",
    waist: "Taille",
    hip: "Hanche",
    arm: "Bras",
    thigh: "Cuisse",
    calf: "Mollet",
    shoulders: "Epaules",
    leanMass: "Masse maigre",
    before: "Avant",
    current: "Actuel",
    monthsAgo: "il y a 6 mois",
    today: "Aujourd'hui",
    bodyTypeLabel: "Votre type corporel",
    rcqLabel: "RTH",
    chestHipLabel: "Poitrine/Hanche",
    grew: "Augmente",
    reduced: "Reduit",
    zoneEvolution: "Evolution par zone corporelle",
    remaining: "restants",
    protein: "Proteines",
    fat: "Lipides",
    carbs: "Glucides",
    kcalRegistered: (n) => `+${n} kcal enregistrees par l'IA`,
    aiDetectsAuto: "L'IA detecte les calories et macros automatiquement",
    aimAtPlateModal: "Pointez vers l'assiette — l'IA detecte kcal et macros et enregistre automatiquement.",
    permissionDenied: "Permission refusee. Activez la camera dans les parametres du navigateur.",
    cameraInUse: "Camera utilisee par une autre app. Fermez les autres apps et reessayez.",
    aiUnavailable: "Analyse IA indisponible. Verifiez la configuration de votre cle API.",
    silhouette: "Silhouette",
    composition: "Composition",
    precision: "Precision",
    calories: "Calories",
    macrosLabel: "Macros",
    initializingScanner: "Initialisation du scanner",
    cancel: "Annuler",
    fullBodyCapture: "Corps entier dans le cadre · Touchez pour capturer",
    foodCapture: "Pointez vers l'assiette · Touchez pour capturer",
    calibrateBtn: "Calibrer l'IA",
    calibrationDataDesc: "Donnees de calibration — ameliorent la precision",
    calibratedMsg: "Calibre · Precision estimee ±1,5 cm",
    outfitTight: "ajustee",
    outfitNormal: "normale",
    outfitLoose: "ample",
    startScan3d: "Demarrer le scan 3D",
    scanning3DHeader: "Cartographie · 3D Body Scan",
    analysisDoneHeader: "Analyse Terminee",
    aiMappingLabel: "IA cartographie les points 3D",
    bodyCompositionScan: "Composition corporelle",
    measureEstimateScan: "Estimation des mesures",
    fatPctScan: "% Graisse",
    scan3dDone: "Scan 3D Termine",
    recordsFn: (n) => `${n} enregistrements | evolution`,
    waistSeries: "Taille (cm)",
    chestSeries: "Poitrine (cm)",
    calsSeries: "Calories (kcal)",
    proteinSeries: "Proteines (g x 10)",
    captureSetupItems: [{
      title: "2,5m de distance",
      desc: "A hauteur des hanches"
    }, {
      title: "Eclairage frontal",
      desc: "Sans contre-jour"
    }, {
      title: "Corps entier",
      desc: "De la tete aux pieds"
    }, {
      title: "Bras ecartes",
      desc: "Vetements ajustes"
    }],
    noHistoryYet: "Votre historique corporel est encore en train de former la premiere tendance.",
    bodyReadingLabel: "Lecture corporelle en cours de consolidation.",
    frontStep: "Face",
    backStep: "Dos",
    turnAroundMsg: "Parfait! Tournez-vous maintenant dos a la camera.",
    stepFront: "1/2 · FACE",
    stepBack: "2/2 · DOS",
    frontCaptureGuide: "Positionnez-vous de face · Touchez pour capturer",
    backCaptureGuide: "Maintenant de dos · Touchez pour capturer",
    frontCaptured: "Face capturee ✓",
    mergingPhotos: "Fusion des images..."
  },
  de: {
    title: "3D Body Scan",
    subtitle: "KI-Korperscan — prazise Messungen, Korperzusammensetzung und visuelle Entwicklung in Echtzeit.",
    measures: "Messungen",
    nutrition: "Ernahrung",
    bodyScan: "Korperscan",
    bodyDesc: "Mache ein Ganzkorperfoto oder lade eines aus der Galerie hoch, damit die KI Masse und Korperfettanteil schatzen kann.",
    foodScan: "Essensscan",
    foodDesc: "Richte die Kamera auf den Teller oder lade ein Bild aus der Galerie hoch, damit die KI Kalorien, Protein und Kohlenhydrate schatzen kann.",
    lastReading: "Letzte Messung",
    latestPhoto: "dein aktuellstes Foto",
    noSavedScan: "noch kein Scan gespeichert",
    firstScan: "Mache deinen ersten Scan, um dein Foto hier zu sehen.",
    todaySummary: "Heutige Zusammenfassung",
    goalsMacros: "Kalorienziele und Makros",
    meals: "Mahlzeiten",
    aiSuggestions: "KI-Vorschlage",
    personalized: "personalisierte Anpassungen",
    historyBody: "Verlauf der Korperscans",
    historyFood: "Verlauf der Essensscans",
    evolution: "Entwicklung",
    camera: "Kamera",
    gallery: "Galerie",
    useGallery: "Galerie verwenden",
    captureGuide: "Aufnahmeleitfaden",
    quickCalibration: "Schnellkalibrierung",
    distance: "Abstand",
    lighting: "Beleuchtung",
    framing: "Ausrichtung",
    posture: "Haltung",
    continue: "Weiter",
    height: "Grosse",
    weight: "Gewicht",
    clothing: "Bekleidung",
    ready: "Fertig. Die geschatzte Genauigkeit liegt mit Kalibrierung bei etwa 1,5 cm.",
    back: "Zuruck",
    startScan: "Scan starten",
    scanning: "KI analysiert Bild...",
    analysisDone: "Analyse abgeschlossen",
    saveClose: "Speichern und schliessen",
    bodyfat: "Korperfett",
    confidence: "Vertrauen",
    editMeasuresTitle: "Deine echten Masse",
    tapToEdit: "Tippe auf einen Wert zum Bearbeiten",
    saveMeasures: "Masse speichern",
    body3d: "Korper 3D",
    compare: "Vergleichen",
    bodyTypeTab: "Typ",
    colorMetricTab: "Farbe",
    musclesTab: "Muskeln",
    edit: "Bearbeiten",
    chest: "Brust",
    waist: "Taille",
    hip: "Hufte",
    arm: "Arm",
    thigh: "Oberschenkel",
    calf: "Wade",
    shoulders: "Schultern",
    leanMass: "Muskelmasse",
    before: "Vorher",
    current: "Aktuell",
    monthsAgo: "vor 6 Monaten",
    today: "Heute",
    bodyTypeLabel: "Dein Korpertyp",
    rcqLabel: "WHR",
    chestHipLabel: "Brust/Hufte",
    grew: "Gewachsen",
    reduced: "Reduziert",
    zoneEvolution: "Entwicklung nach Korperzone",
    remaining: "verbleibend",
    protein: "Protein",
    fat: "Fett",
    carbs: "Kohlenhy.",
    kcalRegistered: (n) => `+${n} kcal von KI erfasst`,
    aiDetectsAuto: "KI erkennt Kalorien und Makros automatisch",
    aimAtPlateModal: "Kamera auf den Teller richten — KI erkennt kcal und Makros und speichert automatisch.",
    permissionDenied: "Zugriff verweigert. Aktiviere die Kamera in den Browser-Einstellungen.",
    cameraInUse: "Kamera wird von einer anderen App verwendet. Schliesse andere Apps und versuche es erneut.",
    aiUnavailable: "KI-Analyse nicht verfugbar. Prüfe die API-Schlüssel-Konfiguration.",
    silhouette: "Silhouette",
    composition: "Zusammensetzung",
    precision: "Prazision",
    calories: "Kalorien",
    macrosLabel: "Makros",
    initializingScanner: "Scanner wird initialisiert",
    cancel: "Abbrechen",
    fullBodyCapture: "Ganzer Korper im Bild · Tippen zum Aufnehmen",
    foodCapture: "Kamera auf den Teller · Tippen zum Aufnehmen",
    calibrateBtn: "KI kalibrieren",
    calibrationDataDesc: "Kalibrierdaten — erhohen die Genauigkeit",
    calibratedMsg: "Kalibriert · Geschatzte Genauigkeit ±1,5 cm",
    outfitTight: "eng",
    outfitNormal: "normal",
    outfitLoose: "locker",
    startScan3d: "3D-Scan starten",
    scanning3DHeader: "Kartierung · 3D Body Scan",
    analysisDoneHeader: "Analyse Abgeschlossen",
    aiMappingLabel: "KI kartiert 3D-Punkte",
    bodyCompositionScan: "Korperzusammensetzung",
    measureEstimateScan: "Massschatzung",
    fatPctScan: "% Korperfett",
    scan3dDone: "3D-Scan Abgeschlossen",
    recordsFn: (n) => `${n} Eintrage | Entwicklung`,
    waistSeries: "Taille (cm)",
    chestSeries: "Brust (cm)",
    calsSeries: "Kalorien (kcal)",
    proteinSeries: "Protein (g x 10)",
    captureSetupItems: [{
      title: "2,5m Abstand",
      desc: "Auf Hufthöhe"
    }, {
      title: "Frontales Licht",
      desc: "Kein Gegenlicht"
    }, {
      title: "Ganzer Korper",
      desc: "Kopf bis Fuß"
    }, {
      title: "Arme ausgestreckt",
      desc: "Eng anliegende Kleidung"
    }],
    noHistoryYet: "Deine Körperhistorie bildet noch die erste Trendlinie.",
    bodyReadingLabel: "Körpermessung wird konsolidiert.",
    frontStep: "Vorderseite",
    backStep: "Rückseite",
    turnAroundMsg: "Super! Drehen Sie sich jetzt mit dem Rücken zur Kamera.",
    stepFront: "1/2 · VORNE",
    stepBack: "2/2 · RÜCKEN",
    frontCaptureGuide: "Stellen Sie sich frontal auf · Tippen zum Aufnehmen",
    backCaptureGuide: "Jetzt mit dem Rücken · Tippen zum Aufnehmen",
    frontCaptured: "Vorderseite aufgenommen ✓",
    mergingPhotos: "Bilder werden zusammengefügt..."
  }
};
const BODY_TYPES = {
  pt: {
    hourglass: {
      nome: "Ampulheta",
      sub: "Curvas simétricas",
      desc: "Ombros e quadril equilibrados, cintura bem definida — proporção ideal para estética atlética."
    },
    triangle: {
      nome: "Triângulo",
      sub: "Forma pear",
      desc: "Quadril mais largo que os ombros. Foco em equilíbrio superior e definição."
    },
    invTriangle: {
      nome: "Triâng. Inv.",
      sub: "Forma V",
      desc: "Ombros mais largos que o quadril. Boa base para hipertrofia."
    },
    oval: {
      nome: "Oval",
      sub: "Concentração central",
      desc: "Cintura mais larga que quadril e ombros. Priorize perda de gordura abdominal."
    },
    rectangular: {
      nome: "Retangular",
      sub: "Forma atlética",
      desc: "Medidas uniformes. Ótima base para ganho muscular definido."
    }
  },
  es: {
    hourglass: {
      nome: "Reloj de Arena",
      sub: "Curvas simétricas",
      desc: "Hombros y cadera equilibrados, cintura bien definida — proporción ideal para estética atlética."
    },
    triangle: {
      nome: "Triángulo",
      sub: "Forma pera",
      desc: "Cadera más ancha que los hombros. Foco en equilibrio superior y definición."
    },
    invTriangle: {
      nome: "Triáng. Inv.",
      sub: "Forma V",
      desc: "Hombros más anchos que la cadera. Buena base para hipertrofia."
    },
    oval: {
      nome: "Oval",
      sub: "Concentración central",
      desc: "Cintura más ancha que cadera y hombros. Prioriza la pérdida de grasa abdominal."
    },
    rectangular: {
      nome: "Rectangular",
      sub: "Forma atlética",
      desc: "Medidas uniformes. Excelente base para ganancia muscular definida."
    }
  },
  en: {
    hourglass: {
      nome: "Hourglass",
      sub: "Symmetric curves",
      desc: "Balanced shoulders and hips, well-defined waist — ideal ratio for athletic aesthetics."
    },
    triangle: {
      nome: "Triangle",
      sub: "Pear shape",
      desc: "Hips wider than shoulders. Focus on upper body balance and definition."
    },
    invTriangle: {
      nome: "Inv. Triangle",
      sub: "V-shape",
      desc: "Shoulders wider than hips. Great foundation for hypertrophy."
    },
    oval: {
      nome: "Oval",
      sub: "Central concentration",
      desc: "Waist wider than hips and shoulders. Prioritize abdominal fat loss."
    },
    rectangular: {
      nome: "Rectangular",
      sub: "Athletic shape",
      desc: "Uniform measurements. Great foundation for defined muscle gain."
    }
  },
  fr: {
    hourglass: {
      nome: "Sablier",
      sub: "Courbes symétriques",
      desc: "Épaules et hanches équilibrées, taille bien définie — rapport idéal pour l'esthétique athlétique."
    },
    triangle: {
      nome: "Triangle",
      sub: "Forme poire",
      desc: "Hanches plus larges que les épaules. Focus sur l'équilibre supérieur et la définition."
    },
    invTriangle: {
      nome: "Tri. Inv.",
      sub: "Forme en V",
      desc: "Épaules plus larges que les hanches. Bonne base pour l'hypertrophie."
    },
    oval: {
      nome: "Ovale",
      sub: "Concentration centrale",
      desc: "Taille plus large que hanches et épaules. Privilégiez la perte de graisse abdominale."
    },
    rectangular: {
      nome: "Rectangulaire",
      sub: "Forme athlétique",
      desc: "Mesures uniformes. Excellente base pour un gain musculaire défini."
    }
  },
  de: {
    hourglass: {
      nome: "Sanduhr",
      sub: "Symmetrische Kurven",
      desc: "Ausgeglichene Schultern und Hüften, gut definierte Taille — ideales Verhältnis für athletische Ästhetik."
    },
    triangle: {
      nome: "Dreieck",
      sub: "Birnenform",
      desc: "Hüften breiter als Schultern. Fokus auf Oberkörper-Balance und Definition."
    },
    invTriangle: {
      nome: "Inv. Dreieck",
      sub: "V-Form",
      desc: "Schultern breiter als Hüften. Gute Basis für Hypertrophie."
    },
    oval: {
      nome: "Oval",
      sub: "Zentrale Konzentration",
      desc: "Taille breiter als Hüften und Schultern. Priorisiere den Abbau von Bauchfett."
    },
    rectangular: {
      nome: "Rechteckig",
      sub: "Athletische Form",
      desc: "Gleichmäßige Maße. Hervorragende Basis für definierten Muskelaufbau."
    }
  }
};
function CorpoPage() {
  const copy = COPY[getStoredLocale()] ?? COPY.pt;
  const [tab, setTab] = reactExports.useState("medidas");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl border border-cyan/20 bg-[#070B14] p-5 shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-cyan/20 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 rounded-full blur-3xl", style: {
        background: "rgba(251,146,60,0.18)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-cyan/30 bg-[#0d1525] shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-px animate-[scan_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-cyan to-transparent opacity-80" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-7 w-7 text-cyan drop-shadow-[0_0_8px_var(--cyan)]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-black tracking-tight", style: {
              background: "linear-gradient(90deg, #22d3ee 0%, #ffffff 45%, #fb923c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }, children: "3D Body Scan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" }),
              " IA"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs leading-relaxed text-slate-400", children: copy.subtitle })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-4 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShareVideoButton, { composition: CorpoEvolutionVideo, inputProps: {
        name: loadOnboarding().name ?? "Atleta",
        bodyFatStart: bodyScans.length > 1 ? bodyScans[0].estimativas?.percentualGorduraEstimado ?? 22 : 22,
        bodyFatCurrent: bodyScans.length > 0 ? bodyScans[bodyScans.length - 1].estimativas?.percentualGorduraEstimado ?? 18 : 18,
        weightStart: bodyScans.length > 1 ? bodyScans[0].calibragem?.pesoKg ?? bodyComposition.weight : bodyComposition.weight,
        weightCurrent: bodyScans.length > 0 ? bodyScans[bodyScans.length - 1].calibragem?.pesoKg ?? bodyComposition.weight : bodyComposition.weight,
        waistStart: bodyScans.length > 1 ? bodyScans[0].estimativas?.cinturaCmEstimada ?? 90 : 90,
        waistCurrent: bodyScans.length > 0 ? bodyScans[bodyScans.length - 1].estimativas?.cinturaCmEstimada ?? 86 : 86,
        muscleMass: bodyComposition.muscleMass,
        trend: bodyScans[bodyScans.length - 1]?.analiseIA?.tendenciaCorporal ?? "Evolução"
      }, durationInFrames: 450, title: "Compartilhar evolução corporal", label: "Compartilhar evolução" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-4 grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-cyan/15 bg-white/5 px-3 py-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-bold text-cyan", children: "6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-wider text-slate-400", children: "Scans" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-orange-500/20 bg-white/5 px-3 py-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-bold", style: {
            color: "#fb923c"
          }, children: "14.2%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-wider text-slate-400", children: copy.bodyfat })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-cyan/15 bg-white/5 px-3 py-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-bold text-white", children: "92%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-wider text-slate-400", children: copy.confidence })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 rounded-xl border border-border bg-surface p-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabBtn, { active: tab === "medidas", onClick: () => setTab("medidas"), children: copy.measures }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabBtn, { active: tab === "nutricao", onClick: () => setTab("nutricao"), children: copy.nutrition })
    ] }),
    tab === "medidas" ? /* @__PURE__ */ jsxRuntimeExports.jsx(MedidasTab, { copy }) : /* @__PURE__ */ jsxRuntimeExports.jsx(NutricaoTab, { copy })
  ] });
}
function TabBtn({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: cn("flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition", active ? "bg-gradient-primary text-primary-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground"), children });
}
function useLiveMeasures() {
  const load = () => bodyMeasures.map((m) => {
    if (typeof window === "undefined") return m;
    const saved = localStorage.getItem(`zyrox.measure.${m.key}`);
    return saved !== null ? {
      ...m,
      value: parseFloat(saved)
    } : m;
  });
  const loadComposition = () => ({
    weight: parseFloat(localStorage.getItem("zyrox.bodyWeight") ?? String(bodyComposition.weight)),
    bodyFat: parseFloat(localStorage.getItem("zyrox.bodyFat") ?? String(bodyComposition.bodyFat)),
    muscleMass: parseFloat(localStorage.getItem("zyrox.muscleMass") ?? String(bodyComposition.muscleMass))
  });
  const [measures, setMeasures] = reactExports.useState(load);
  const [composition, setComposition] = reactExports.useState(loadComposition);
  const batchUpdate = (updates) => {
    setMeasures((prev) => prev.map((m) => {
      const v = updates[m.key];
      if (v !== void 0) {
        localStorage.setItem(`zyrox.measure.${m.key}`, String(v));
        return {
          ...m,
          value: v
        };
      }
      return m;
    }));
    const compPatch = {};
    if (updates.bodyFat !== void 0) {
      localStorage.setItem("zyrox.bodyFat", String(updates.bodyFat));
      compPatch.bodyFat = updates.bodyFat;
    }
    if (updates.muscleMass !== void 0) {
      localStorage.setItem("zyrox.muscleMass", String(updates.muscleMass));
      compPatch.muscleMass = updates.muscleMass;
    }
    if (updates.weight !== void 0) {
      localStorage.setItem("zyrox.bodyWeight", String(updates.weight));
      compPatch.weight = updates.weight;
    }
    if (Object.keys(compPatch).length > 0) setComposition((prev) => ({
      ...prev,
      ...compPatch
    }));
  };
  const update = (key, value) => batchUpdate({
    [key]: value
  });
  return {
    measures,
    composition,
    update,
    batchUpdate
  };
}
function MedidasTab({
  copy
}) {
  const [lastPhoto, setLastPhoto] = reactExports.useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("zyrox.lastBodyPhoto");
  });
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const {
    measures,
    composition,
    update,
    batchUpdate
  } = useLiveMeasures();
  const isFemale = loadOnboarding().gender !== "male";
  const latestBodyScan = bodyScans[0];
  const bodySummary = latestBodyScan?.analiseIA?.mudancaDesdeUltimoScan ?? copy.noHistoryYet;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScanCTA, { kind: "body", title: copy.bodyScan, desc: copy.bodyDesc, copy, onScanComplete: (url) => {
      localStorage.setItem("zyrox.lastBodyPhoto", url);
      setLastPhoto(url);
    }, onMeasurementsDetected: (m) => batchUpdate(m) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BodyScanPanel, { female: isFemale, lastPhoto, copy, measures, composition, onEditClick: () => setEditOpen(true) }),
    editOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-white/10 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-black text-white", children: copy.editMeasuresTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400", children: copy.tapToEdit })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditOpen(false), className: "grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/8 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: measures.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-widest text-slate-400", children: m.label }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", inputMode: "decimal", value: m.value, onChange: (e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v) && v > 0) update(m.key, v);
          }, className: "w-20 rounded-xl border border-cyan/30 bg-black/50 px-2 py-1.5 text-center font-display text-xl font-black text-cyan focus:border-cyan focus:outline-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: m.unit })
        ] })
      ] }, m.key)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/10 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditOpen(false), className: "w-full rounded-2xl py-3.5 font-black uppercase tracking-widest text-white", style: {
        background: "linear-gradient(135deg,#0891b2,#22d3ee)",
        boxShadow: "0 0 20px rgba(34,211,238,0.3)"
      }, children: copy.saveMeasures }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AIInsightCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: latestBodyScan?.analiseIA?.tendenciaCorporal ?? copy.bodyReadingLabel }),
      " ",
      bodySummary
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: measures.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MeasureCard, { m }, m.key)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScanHistory, { kind: "body", copy })
  ] });
}
function MeasureCard({
  m
}) {
  const up = m.delta >= 0;
  const min = Math.min(...m.history);
  const max = Math.max(...m.history);
  const range = Math.max(0.1, max - min);
  const points = m.history.map((v, i) => {
    const x = i / (m.history.length - 1) * 100;
    const y = 100 - (v - min) / range * 100;
    return `${x},${y}`;
  }).join(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: m.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-xl font-bold", children: [
          m.value,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs font-medium text-muted-foreground", children: m.unit })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold", up ? "bg-primary/10 text-primary" : "bg-cyan/10 text-cyan"), children: [
        up ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
        up ? "+" : "",
        m.delta
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", className: "mt-2 h-10 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points, fill: "none", stroke: up ? "var(--primary)" : "var(--cyan)", strokeWidth: "2", vectorEffect: "non-scaling-stroke" }) })
  ] });
}
const BASE_COLOR_ZONES = [{
  key: "peito",
  label: "Peito",
  delta: 1.2,
  yPct: 0.2,
  side: "left"
}, {
  key: "cintura",
  label: "Cintura",
  delta: -0.8,
  yPct: 0.4,
  side: "left"
}, {
  key: "quadril",
  label: "Quadril",
  delta: 0.3,
  yPct: 0.52,
  side: "left"
}, {
  key: "braco",
  label: "Braço",
  delta: 0.5,
  yPct: 0.2,
  side: "right"
}, {
  key: "coxa",
  label: "Coxa",
  delta: 0.4,
  yPct: 0.65,
  side: "right"
}, {
  key: "panturrilha",
  label: "Panturrilha",
  delta: 0.2,
  yPct: 0.82,
  side: "right"
}];
function BodyScanPanel({
  female,
  lastPhoto,
  copy,
  measures,
  composition,
  onEditClick
}) {
  const [view, setView] = reactExports.useState("3d");
  const SH = 240;
  const shoulderY = 0.196 * SH;
  const waistY = 0.402 * SH;
  const hipY = 0.518 * SH;
  const thighY = 0.64 * SH;
  const calfY = 0.82 * SH;
  const peito = measures.find((m) => m.key === "peito").value;
  const cintura = measures.find((m) => m.key === "cintura").value;
  const quadril = measures.find((m) => m.key === "quadril").value;
  const braco = measures.find((m) => m.key === "braco").value;
  const coxa = measures.find((m) => m.key === "coxa").value;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl border border-border bg-[#060a12]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border-b border-white/8", children: [
      ["3d", "comparar", "tipo", "cor", "musculos"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView(v), className: cn("flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition", view === v ? "border-b-2 border-cyan bg-cyan/5 text-cyan" : "text-slate-500 hover:text-slate-300"), children: v === "3d" ? copy.body3d : v === "comparar" ? copy.compare : v === "tipo" ? copy.bodyTypeTab : v === "cor" ? copy.colorMetricTab : copy.musclesTab }, v)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onEditClick, className: "shrink-0 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-orange-400 border-l border-white/8", children: copy.edit })
    ] }),
    view === "3d" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0", style: {
        backgroundImage: "linear-gradient(rgba(34,211,238,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.035) 1px,transparent 1px)",
        backgroundSize: "28px 28px"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-24 rounded-full blur-3xl", style: {
        background: "rgba(34,211,238,0.07)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative shrink-0", style: {
          width: 72,
          height: SH
        }, children: [{
          label: copy.chest,
          value: peito,
          unit: "cm",
          y: shoulderY
        }, {
          label: copy.waist,
          value: cintura,
          unit: "cm",
          y: waistY
        }, {
          label: copy.hip,
          value: quadril,
          unit: "cm",
          y: hipY
        }].map(({
          label,
          value,
          unit,
          y
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 flex flex-col items-end", style: {
          top: y - 14
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-[15px] font-black leading-none text-cyan", children: [
            value,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5 text-[8px] font-medium text-cyan/50", children: unit })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] uppercase tracking-widest text-slate-500", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 h-px w-4 bg-cyan/30" })
        ] }, label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative shrink-0", style: {
          width: 130,
          height: SH
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BodySilhouette, { female, width: 130, height: SH }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative shrink-0", style: {
          width: 72,
          height: SH
        }, children: [{
          label: copy.arm,
          value: braco,
          unit: "cm",
          y: shoulderY
        }, {
          label: copy.thigh,
          value: coxa,
          unit: "cm",
          y: thighY
        }, {
          label: copy.bodyfat,
          value: composition.bodyFat,
          unit: "%",
          y: calfY
        }].map(({
          label,
          value,
          unit,
          y
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 flex flex-col items-start", style: {
          top: y - 14
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-4 mb-0.5 bg-orange-400/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-[15px] font-black leading-none text-orange-400", children: [
            value,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5 text-[8px] font-medium text-orange-400/50", children: unit })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] uppercase tracking-widest text-slate-500", children: label })
        ] }, label)) })
      ] }),
      lastPhoto && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-3 overflow-hidden rounded-xl border border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: lastPhoto, alt: "Último scan", className: "h-40 w-full object-cover object-top" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 left-3 text-[9px] font-bold uppercase tracking-widest text-white/70", children: copy.latestPhoto }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          localStorage.removeItem("zyrox.lastBodyPhoto");
          window.location.reload();
        }, className: "absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black/60 text-white/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-3 grid grid-cols-3 gap-2", children: [{
        label: copy.weight,
        value: `${composition.weight}`,
        unit: "kg",
        color: "text-white"
      }, {
        label: copy.bodyfat,
        value: `${composition.bodyFat}`,
        unit: "%",
        color: "text-orange-400"
      }, {
        label: copy.leanMass,
        value: `${composition.muscleMass}`,
        unit: "kg",
        color: "text-cyan"
      }].map(({
        label,
        value,
        unit,
        color
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/8 bg-white/4 p-2 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("font-display text-sm font-black", color), children: [
          value,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-medium text-slate-500", children: [
            " ",
            unit
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] uppercase tracking-widest text-slate-500", children: label })
      ] }, label)) })
    ] }),
    view === "comparar" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0", style: {
        backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)",
        backgroundSize: "28px 28px"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-end justify-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-black uppercase tracking-widest text-orange-400/70", children: copy.before }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BodySilhouette, { female, width: 105, height: 195 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0", style: {
              background: "radial-gradient(ellipse at center,rgba(251,146,60,0.12) 0%,transparent 70%)"
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-sm font-black text-orange-400", children: "78.0 kg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] text-slate-500", children: copy.monthsAgo })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10 flex flex-col items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-slate-600", children: "VS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-black uppercase tracking-widest text-cyan", children: copy.current }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BodySilhouette, { female, width: 105, height: 195 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0", style: {
              background: "radial-gradient(ellipse at center,rgba(34,211,238,0.1) 0%,transparent 70%)"
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-sm font-black text-cyan", children: [
              composition.weight,
              " kg"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] text-slate-500", children: copy.today })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-4 grid grid-cols-3 gap-2", children: [{
        label: copy.weight,
        value: "-0.4 kg"
      }, {
        label: copy.waist,
        value: "-4 cm"
      }, {
        label: copy.bodyfat,
        value: "-2.3%"
      }].map(({
        label,
        value
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-cyan/15 bg-white/4 p-2 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] uppercase tracking-widest text-slate-500", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-sm font-black text-cyan", children: value })
      ] }, label)) })
    ] }),
    view === "tipo" && /* @__PURE__ */ jsxRuntimeExports.jsx(BodyTypeView, { female, measures, copy }),
    view === "cor" && /* @__PURE__ */ jsxRuntimeExports.jsx(ColorMetricView, { female, measures, copy }),
    view === "musculos" && /* @__PURE__ */ jsxRuntimeExports.jsx(MusclesView, { female, copy })
  ] });
}
function BodyTypeView({
  female,
  measures,
  copy
}) {
  const peito = measures.find((m) => m.key === "peito").value;
  const cintura = measures.find((m) => m.key === "cintura").value;
  const quadril = measures.find((m) => m.key === "quadril").value;
  const whr = cintura / quadril;
  const shr = peito / quadril;
  const locale = getStoredLocale();
  const bodyTypeLocale = BODY_TYPES[locale] ?? BODY_TYPES.pt;
  let tipoKey;
  let tipoColor;
  if (whr < 0.75 && Math.abs(peito - quadril) < 7) {
    tipoKey = "hourglass";
    tipoColor = "#22d3ee";
  } else if (quadril > peito + 5) {
    tipoKey = "triangle";
    tipoColor = "#fb923c";
  } else if (peito > quadril + 5) {
    tipoKey = "invTriangle";
    tipoColor = "#3b82f6";
  } else if (whr > 0.85) {
    tipoKey = "oval";
    tipoColor = "#a855f7";
  } else {
    tipoKey = "rectangular";
    tipoColor = "#10b981";
  }
  const tipo = bodyTypeLocale[tipoKey];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0", style: {
      backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)",
      backgroundSize: "28px 28px"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -inset-6 rounded-full blur-3xl", style: {
          background: `${tipoColor}18`
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BodySilhouette, { female, width: 120, height: 205 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-black uppercase tracking-[0.25em] text-slate-500", children: copy.bodyTypeLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-4xl font-black uppercase tracking-tight leading-none", style: {
          color: tipoColor,
          textShadow: `0 0 28px ${tipoColor}55`
        }, children: tipo.nome }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs font-semibold", style: {
          color: `${tipoColor}99`
        }, children: tipo.sub }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-2 max-w-[240px] text-[11px] leading-relaxed text-slate-400", children: tipo.desc })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full grid grid-cols-3 gap-2", children: [{
        label: copy.rcqLabel,
        value: whr.toFixed(2)
      }, {
        label: copy.chestHipLabel,
        value: shr.toFixed(2)
      }, {
        label: copy.confidence,
        value: "92%"
      }].map(({
        label,
        value
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white/3 p-2 text-center", style: {
        borderColor: `${tipoColor}25`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] uppercase tracking-widest text-slate-500", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-sm font-black", style: {
          color: tipoColor
        }, children: value })
      ] }, label)) })
    ] })
  ] });
}
function ColorMetricView({
  female,
  measures,
  copy
}) {
  const colorZones = BASE_COLOR_ZONES.map((z) => ({
    ...z,
    delta: measures.find((m) => m.key === z.key)?.delta ?? z.delta
  }));
  const SH = 240;
  const zoneLabels = {
    peito: copy.chest,
    cintura: copy.waist,
    quadril: copy.hip,
    braco: copy.arm,
    coxa: copy.thigh,
    panturrilha: copy.calf
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0", style: {
      backgroundImage: "linear-gradient(rgba(34,211,238,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.025) 1px,transparent 1px)",
      backgroundSize: "28px 28px"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-black uppercase tracking-widest text-white", children: "ColorMetric" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-slate-500", children: copy.zoneEvolution })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-orange-400" }),
          " ",
          copy.grew
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-cyan" }),
          " ",
          copy.reduced
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative shrink-0", style: {
        width: 78,
        height: SH
      }, children: colorZones.filter((z) => z.side === "left").map((z) => {
        const isGrowth = z.delta > 0;
        const color = isGrowth ? "#fb923c" : "#22d3ee";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 flex flex-col items-end", style: {
          top: z.yPct * SH - 14
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-[14px] font-black leading-none", style: {
            color
          }, children: [
            isGrowth ? "+" : "",
            z.delta,
            " cm"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] uppercase tracking-widest text-slate-500", children: zoneLabels[z.key] ?? z.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 h-px w-4", style: {
            background: color,
            opacity: 0.4
          } })
        ] }, z.key);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", style: {
        width: 130,
        height: SH
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BodySilhouette, { female, width: 130, height: SH }),
        colorZones.map((z) => {
          const isGrowth = z.delta > 0;
          const color = isGrowth ? "rgba(251,146,60,0.22)" : "rgba(34,211,238,0.18)";
          z.side === "left" ? "30%" : "70%";
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute", style: {
            top: `calc(${z.yPct * 100}% - 12px)`,
            left: z.side === "left" ? "5%" : "55%",
            width: 36,
            height: 24,
            borderRadius: "50%",
            background: color,
            filter: "blur(8px)"
          } }, z.key);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative shrink-0", style: {
        width: 78,
        height: SH
      }, children: colorZones.filter((z) => z.side === "right").map((z) => {
        const isGrowth = z.delta > 0;
        const color = isGrowth ? "#fb923c" : "#22d3ee";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 flex flex-col items-start", style: {
          top: z.yPct * SH - 14
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-4 mb-0.5", style: {
            background: color,
            opacity: 0.4
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-[14px] font-black leading-none", style: {
            color
          }, children: [
            isGrowth ? "+" : "",
            z.delta,
            " cm"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] uppercase tracking-widest text-slate-500", children: zoneLabels[z.key] ?? z.label })
        ] }, z.key);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-4 space-y-1.5", children: colorZones.map((z) => {
      const isGrowth = z.delta > 0;
      const color = isGrowth ? "#fb923c" : "#22d3ee";
      const pct = Math.min(100, Math.abs(z.delta) * 20);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 shrink-0 text-[9px] uppercase tracking-widest text-slate-500", children: zoneLabels[z.key] ?? z.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1 overflow-hidden rounded-full bg-white/8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all", style: {
          width: `${pct}%`,
          background: color
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-12 text-right text-[9px] font-bold", style: {
          color
        }, children: [
          isGrowth ? "+" : "",
          z.delta,
          " cm"
        ] })
      ] }, z.key);
    }) })
  ] });
}
function MusclesView({
  female,
  copy
}) {
  const [selectedMuscle, setSelectedMuscle] = reactExports.useState("Peito");
  const recommendedExercises = exercises.filter((e) => e.muscle === selectedMuscle).slice(0, 4);
  const getMuscleStats = (m) => {
    switch (m) {
      case "Peito":
        return {
          recovery: 85,
          status: "Pronto para Treino",
          activeFibers: "94%",
          volume: "18 séries/sem"
        };
      case "Costas":
        return {
          recovery: 62,
          status: "Em Recuperação",
          activeFibers: "88%",
          volume: "20 séries/sem"
        };
      case "Ombros":
        return {
          recovery: 95,
          status: "Excelente Estado",
          activeFibers: "96%",
          volume: "12 séries/sem"
        };
      case "Bíceps":
        return {
          recovery: 40,
          status: "Fadiga Moderada",
          activeFibers: "75%",
          volume: "8 séries/sem"
        };
      case "Tríceps":
        return {
          recovery: 78,
          status: "Recuperado",
          activeFibers: "90%",
          volume: "9 séries/sem"
        };
      case "Pernas":
        return {
          recovery: 30,
          status: "Fadiga Elevada",
          activeFibers: "65%",
          volume: "22 séries/sem"
        };
      case "Glúteos":
        return {
          recovery: 88,
          status: "Pronto para Treino",
          activeFibers: "92%",
          volume: "14 séries/sem"
        };
      case "Core":
        return {
          recovery: 90,
          status: "Excelente Estado",
          activeFibers: "95%",
          volume: "10 séries/sem"
        };
      case "Antebraço":
        return {
          recovery: 70,
          status: "Recuperado",
          activeFibers: "85%",
          volume: "6 séries/sem"
        };
      default:
        return {
          recovery: 100,
          status: "Totalmente Pronto",
          activeFibers: "100%",
          volume: "N/A"
        };
    }
  };
  const stats = getMuscleStats(selectedMuscle);
  const getRecoveryColor = (pct) => {
    if (pct >= 80) return "bg-[#22d3ee] text-[#22d3ee]";
    if (pct >= 50) return "bg-[#fb923c] text-[#fb923c]";
    return "bg-[#ef4444] text-[#ef4444]";
  };
  const recoveryColorClass = getRecoveryColor(stats.recovery);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0", style: {
      backgroundImage: "linear-gradient(rgba(34,211,238,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.02) 1px,transparent 1px)",
      backgroundSize: "24px 24px"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full blur-3xl", style: {
      background: "rgba(251,146,60,0.05)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-black uppercase tracking-widest text-white", children: "Mapeamento Muscular" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-slate-500", children: "Toque em qualquer grupo para analisar" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" }),
        "Silhueta Interativa"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex items-center justify-center rounded-2xl border border-white/5 bg-white/2 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[280px] w-[180px] shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MuscleSilhouette, { muscle: selectedMuscle, onSelect: setSelectedMuscle, variant: "dark" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-between space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/8 bg-white/4 p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold uppercase tracking-wider text-slate-500", children: "Músculo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-2xl font-black text-white leading-tight uppercase truncate", style: {
                textShadow: "0 0 15px rgba(251,146,60,0.3)"
              }, children: selectedMuscle })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-block shrink-0 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10", stats.recovery >= 80 ? "text-cyan border-cyan/20" : stats.recovery >= 50 ? "text-orange-400 border-orange-400/20" : "text-red-400 border-red-400/20"), children: stats.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold uppercase tracking-wider text-slate-400", children: "Status de Recuperação" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-black text-white", children: [
                stats.recovery,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-white/8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-full rounded-full transition-all duration-500 ease-out", recoveryColorClass.split(" ")[0]), style: {
              width: `${stats.recovery}%`
            } }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-center pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/5 bg-white/2 p-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-sm font-bold text-white", children: stats.activeFibers }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] uppercase tracking-widest text-slate-500", children: "Fibras Ativas" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/5 bg-white/2 p-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-sm font-bold text-cyan", children: stats.volume }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] uppercase tracking-widest text-slate-500", children: "Volume Semanal" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 rounded-2xl border border-white/8 bg-white/4 p-4 flex flex-col min-h-[160px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2", children: "Exercícios Recomendados" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5 overflow-y-auto max-h-[140px]", children: [
            recommendedExercises.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-white/5 bg-white/2 px-3 py-2 text-xs hover:bg-white/5 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 pr-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate text-white", children: e.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] text-slate-500 uppercase truncate", children: [
                  e.equipment,
                  " · ",
                  e.biomechanics
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 shrink-0 text-orange-400" })
            ] }, e.id)),
            recommendedExercises.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full items-center justify-center text-center text-[10px] text-slate-500 italic py-4", children: [
              "Nenhum exercício cadastrado para ",
              selectedMuscle
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function NutricaoTab({
  copy
}) {
  const {
    kcal,
    macros
  } = nutritionToday;
  const profile = buildAthleteProfile(loadOnboarding());
  const nutritionEvaluation = evaluateNutritionState(profile, nutritionToday, foodScans);
  const [liveMeals, setLiveMeals] = reactExports.useState(nutritionToday.meals);
  const [liveEaten, setLiveEaten] = reactExports.useState(kcal.eaten);
  const [activeMeal, setActiveMeal] = reactExports.useState(null);
  const [scanDone, setScanDone] = reactExports.useState(false);
  const [addedKcal, setAddedKcal] = reactExports.useState(0);
  const remaining = Math.max(0, kcal.goal - liveEaten);
  const pct = Math.min(100, liveEaten / kcal.goal * 100);
  const handleFoodDetected = (m, meal) => {
    const detected = m.kcal ?? 0;
    if (detected > 0) {
      setLiveMeals((prev) => prev.map((item) => item.id === meal.id ? {
        ...item,
        kcal: item.kcal + detected
      } : item));
      setLiveEaten((prev) => prev + detected);
      setAddedKcal(detected);
      setScanDone(true);
    }
    setActiveMeal(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScanCTA, { kind: "food", title: copy.foodScan, desc: copy.foodDesc, copy }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { title: copy.todaySummary, subtitle: copy.goalsMacros }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-32 w-32 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(RadialBarChart, { width: 128, height: 128, innerRadius: "75%", outerRadius: "100%", data: [{
            name: "kcal",
            value: pct,
            fill: "var(--cyan)"
          }], startAngle: 90, endAngle: -270, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PolarAngleAxis, { type: "number", domain: [0, 100], tick: false }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RadialBar, { background: {
              fill: "var(--elevated)"
            }, dataKey: "value", cornerRadius: 20 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-bold leading-none", children: remaining.toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-wider text-muted-foreground", children: copy.remaining })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MacroBar, { label: copy.protein, eaten: macros.protein.eaten, goal: macros.protein.goal, color: "var(--primary)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MacroBar, { label: copy.fat, eaten: macros.fat.eaten, goal: macros.fat.goal, color: "var(--cyan)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MacroBar, { label: copy.carbs, eaten: macros.carbs.eaten, goal: macros.carbs.goal, color: "var(--blue-accent)" })
        ] })
      ] })
    ] }),
    scanDone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-cyan/30 bg-cyan/10 px-4 py-3", onClick: () => setScanDone(false), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 shrink-0 text-cyan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-cyan", children: copy.kcalRegistered(addedKcal) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { title: copy.meals, subtitle: `${liveEaten.toLocaleString()} / ${kcal.goal.toLocaleString()} kcal` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: liveMeals.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border bg-elevated/40 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-lg bg-surface text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: m.time }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: m.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            m.kcal,
            " / ",
            m.goal,
            " kcal"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setScanDone(false);
          setActiveMeal(m);
        }, className: "grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant active:scale-90 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
      ] }, m.id)) })
    ] }),
    activeMeal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex flex-col bg-black", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-cyan/20 bg-black/90 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-sm font-black text-cyan uppercase tracking-widest", children: [
            "Scan · ",
            activeMeal.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400", children: copy.aiDetectsAuto })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveMeal(null), className: "grid h-8 w-8 place-items-center rounded-full border border-cyan/30 bg-black/60 text-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanCTA, { kind: "food", title: activeMeal.name, desc: copy.aimAtPlateModal, copy, onMeasurementsDetected: (m) => handleFoodDetected(m, activeMeal) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AIInsightCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
        nutritionEvaluation.balanceLabel,
        "."
      ] }),
      " ",
      nutritionEvaluation.primaryMessage
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { title: copy.aiSuggestions, subtitle: copy.personalized }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: nutritionEvaluation.insights.map((tip, index) => {
        const Icon = [Droplets, Zap, Target][index] ?? Sparkles;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 rounded-xl border border-border bg-elevated/40 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan/10 text-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: tip.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs leading-relaxed text-muted-foreground", children: tip.desc })
          ] })
        ] }, tip.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScanHistory, { kind: "food", copy })
  ] });
}
function MacroBar({
  label,
  eaten,
  goal,
  color
}) {
  const pct = Math.min(100, eaten / goal * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold", children: [
        eaten,
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          "/",
          goal,
          "g"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all", style: {
      width: `${pct}%`,
      background: color
    } }) })
  ] });
}
function Card({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-surface p-4", children });
}
function CardHeader({
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-bold", children: title }),
    subtitle ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: subtitle }) : null
  ] });
}
function ScanCTA({
  kind,
  title,
  desc,
  copy,
  onScanComplete,
  onMeasurementsDetected
}) {
  const galleryRef = reactExports.useRef(null);
  const nativeCameraRef = reactExports.useRef(null);
  const videoRef = reactExports.useRef(null);
  const streamRef = reactExports.useRef(null);
  const [preview, setPreview] = reactExports.useState(null);
  const [state, setState] = reactExports.useState("idle");
  const [liveOpen, setLiveOpen] = reactExports.useState(false);
  const [liveError, setLiveError] = reactExports.useState(null);
  const [guideOpen, setGuideOpen] = reactExports.useState(false);
  const [guideStep, setGuideStep] = reactExports.useState(0);
  const [pending, setPending] = reactExports.useState(null);
  const [height, setHeight] = reactExports.useState(() => {
    if (typeof window === "undefined") return "178";
    return window.localStorage.getItem("zyrox.profile.height") ?? "178";
  });
  const [weight, setWeight] = reactExports.useState(() => {
    if (typeof window === "undefined") return "78";
    return window.localStorage.getItem("zyrox.profile.weight") ?? "78";
  });
  const [outfit, setOutfit] = reactExports.useState("normal");
  const [aiAnalysis, setAiAnalysis] = reactExports.useState(null);
  const [aiError, setAiError] = reactExports.useState(null);
  const [scanBooting, setScanBooting] = reactExports.useState(false);
  const bootTimerRef = reactExports.useRef(null);
  const isFemale = loadOnboarding().gender !== "male";
  const [captureStep, setCaptureStep] = reactExports.useState("front");
  const [frontPhoto, setFrontPhoto] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    if (height) window.localStorage.setItem("zyrox.profile.height", height);
  }, [height]);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    if (weight) window.localStorage.setItem("zyrox.profile.weight", weight);
  }, [weight]);
  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };
  const openLiveCamera = async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      nativeCameraRef.current?.click();
      return;
    }
    setLiveError(null);
    setLiveOpen(true);
    const attachStream = (stream) => {
      streamRef.current = stream;
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {
          });
        }
      });
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: kind === "food" ? "environment" : "user"
          }
        },
        audio: false
      });
      attachStream(stream);
    } catch (firstError) {
      const name = firstError?.name ?? "";
      if (name === "NotAllowedError") {
        setLiveError(copy.permissionDenied);
        return;
      }
      if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        closeLive();
        nativeCameraRef.current?.click();
        return;
      }
      if (name === "NotReadableError") {
        setLiveError(copy.cameraInUse);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        attachStream(stream);
      } catch {
        closeLive();
        nativeCameraRef.current?.click();
      }
    }
  };
  const triggerInput = (src) => {
    if (src === "camera") openLiveCamera();
    else galleryRef.current?.click();
  };
  const handleClick = (src) => {
    if (src === "camera") {
      triggerInput("camera");
      setScanBooting(true);
      if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
      bootTimerRef.current = setTimeout(() => setScanBooting(false), 12e3);
      return;
    }
    if (kind === "body") {
      setPending(src);
      setGuideStep(0);
      setGuideOpen(true);
      return;
    }
    triggerInput(src);
  };
  const finishWithDataUrl = async (dataUrl) => {
    setPreview(dataUrl);
    setState("scanning");
    setAiAnalysis(null);
    setAiError(null);
    const base64 = dataUrl.split(",")[1] ?? "";
    const onboarding = loadOnboarding();
    const userContext = buildUserContext(onboarding);
    const locale = getStoredLocale();
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? {
            Authorization: `Bearer ${token}`
          } : {}
        },
        body: JSON.stringify({
          imageBase64: base64,
          userContext,
          locale,
          kind,
          height: parseFloat(height) || void 0,
          weight: parseFloat(weight) || void 0
        })
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const result = await res.json();
      setAiAnalysis(result.analysis);
      if (kind === "body" && result.measurements) {
        const m = result.measurements;
        Object.entries(m).forEach(([k, v]) => {
          if (typeof v === "number") localStorage.setItem(`zyrox.measure.${k}`, String(v));
        });
        if (result.measurements.bodyFat) localStorage.setItem("zyrox.bodyFat", String(result.measurements.bodyFat));
        if (result.measurements.muscleMass) localStorage.setItem("zyrox.muscleMass", String(result.measurements.muscleMass));
        onMeasurementsDetected?.(m);
      }
    } catch {
      setAiError(copy.aiUnavailable);
    }
    setState("done");
    onScanComplete?.(dataUrl);
  };
  const mergePhotos = (frontDataUrl, backDataUrl) => {
    return new Promise((resolve) => {
      const imgFront = new window.Image();
      const imgBack = new window.Image();
      let loaded = 0;
      const onLoad = () => {
        loaded++;
        if (loaded < 2) return;
        const c = document.createElement("canvas");
        c.width = imgFront.width + imgBack.width;
        c.height = Math.max(imgFront.height, imgBack.height);
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(imgFront, 0, 0);
        ctx.drawImage(imgBack, imgFront.width, 0);
        resolve(c.toDataURL("image/jpeg", 0.85));
      };
      imgFront.onload = onLoad;
      imgBack.onload = onLoad;
      imgFront.src = frontDataUrl;
      imgBack.src = backDataUrl;
    });
  };
  const captureFromVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 1280;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    if (kind === "body" && captureStep === "front") {
      setFrontPhoto(dataUrl);
      setCaptureStep("back");
      return;
    }
    if (kind === "body" && captureStep === "back" && frontPhoto) {
      const savedFront = frontPhoto;
      closeLive();
      const merged = await mergePhotos(savedFront, dataUrl);
      finishWithDataUrl(merged);
      return;
    }
    closeLive();
    finishWithDataUrl(dataUrl);
  };
  const closeLive = () => {
    stopStream();
    setLiveOpen(false);
    setCaptureStep("front");
    setFrontPhoto(null);
  };
  const onFile = (event) => {
    setScanBooting(false);
    if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => finishWithDataUrl(reader.result);
    reader.readAsDataURL(file);
    event.target.value = "";
  };
  const reset = () => {
    setPreview(null);
    setState("idle");
    setAiAnalysis(null);
    setAiError(null);
    setCaptureStep("front");
    setFrontPhoto(null);
  };
  const isBody = kind === "body";
  const accentColor = isBody ? "#fb923c" : "var(--cyan)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl border bg-black p-5", style: {
    borderColor: isBody ? "rgba(251,146,60,0.3)" : "rgba(34,211,238,0.3)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full blur-3xl", style: {
      background: isBody ? "rgba(251,146,60,0.15)" : "rgba(34,211,238,0.12)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-3xl", style: {
      background: isBody ? "rgba(234,88,12,0.10)" : "rgba(59,130,246,0.10)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 opacity-30", style: {
      backgroundImage: `linear-gradient(${isBody ? "rgba(251,146,60,0.08)" : "rgba(34,211,238,0.08)"} 1px, transparent 1px), linear-gradient(90deg, ${isBody ? "rgba(251,146,60,0.08)" : "rgba(34,211,238,0.08)"} 1px, transparent 1px)`,
      backgroundSize: "32px 32px"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid h-12 w-12 shrink-0 place-items-center rounded-xl overflow-hidden", style: {
        background: isBody ? "rgba(251,146,60,0.15)" : "rgba(34,211,238,0.12)",
        border: `1px solid ${isBody ? "rgba(251,146,60,0.35)" : "rgba(34,211,238,0.35)"}`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 h-px animate-[scan_1.6s_ease-in-out_infinite]", style: {
          background: isBody ? "linear-gradient(90deg,transparent,#fb923c,transparent)" : "linear-gradient(90deg,transparent,#22d3ee,transparent)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-6 w-6", style: {
          color: accentColor
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base font-black uppercase tracking-widest", style: {
            color: accentColor
          }, children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest", style: {
            color: accentColor,
            borderColor: isBody ? "rgba(251,146,60,0.4)" : "rgba(34,211,238,0.4)",
            background: isBody ? "rgba(251,146,60,0.08)" : "rgba(34,211,238,0.08)"
          }, children: "IA" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] leading-relaxed text-slate-400", children: desc })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-4 grid grid-cols-3 gap-2", children: (isBody ? [[copy.silhouette, "3D"], [copy.composition, "IA"], [copy.precision, "±1.5cm"]] : [[copy.calories, "IA"], [copy.macrosLabel, "3D"], [copy.precision, "±5%"]]).map(([label, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border px-2 py-1.5 text-center", style: {
      borderColor: isBody ? "rgba(251,146,60,0.2)" : "rgba(34,211,238,0.2)",
      background: "rgba(255,255,255,0.03)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xs font-black", style: {
        color: accentColor
      }, children: val }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] uppercase tracking-widest text-slate-500", children: label })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-3 grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleClick("camera"), className: "flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-black uppercase tracking-widest text-white active:scale-[0.97] transition-transform", style: {
        background: isBody ? "linear-gradient(135deg,#c2410c,#fb923c)" : "linear-gradient(135deg,#0369a1,#22d3ee)",
        boxShadow: isBody ? "0 0 16px rgba(251,146,60,0.3)" : "0 0 16px rgba(34,211,238,0.3)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }),
        copy.startScan
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleClick("gallery"), className: "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold active:scale-[0.97] transition-transform", style: {
        borderColor: isBody ? "rgba(251,146,60,0.35)" : "rgba(34,211,238,0.35)",
        color: accentColor,
        background: "rgba(255,255,255,0.03)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4" }),
        " ",
        copy.gallery
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: galleryRef, type: "file", accept: "image/*", className: "hidden", onChange: onFile }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: nativeCameraRef, type: "file", accept: "image/*", capture: kind === "food" ? "environment" : "user", className: "hidden", onChange: onFile }),
    scanBooting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0", style: {
        backgroundImage: "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full blur-3xl", style: {
        background: "rgba(34,211,238,0.08)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col items-center gap-6 px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-48 w-48 items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute h-48 w-48 rounded-full border border-dashed border-cyan/20", style: {
            animation: "bracketPulse 2.5s ease-in-out infinite"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute h-36 w-36 rounded-full border border-cyan/25", style: {
            animation: "bracketPulse 2s ease-in-out infinite"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute h-20 w-20 rounded-full border border-cyan/35", style: {
            animation: "bracketPulse 1.5s ease-in-out infinite"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative grid h-12 w-12 place-items-center rounded-full border border-cyan/60", style: {
            background: "rgba(34,211,238,0.1)",
            boxShadow: "0 0 24px rgba(34,211,238,0.3)"
          }, children: kind === "body" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-6 w-6 text-cyan" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-cyan" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-full bg-gradient-to-r from-transparent via-cyan/30 to-transparent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-px bg-gradient-to-b from-transparent via-cyan/30 to-transparent" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-black uppercase tracking-[0.25em]", style: {
            background: "linear-gradient(90deg,#22d3ee,#ffffff,#3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }, children: "3D Body Scan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan/60", children: copy.initializingScanner })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-xs space-y-2", children: [{
          label: "Camera Ready",
          delay: "0s"
        }, {
          label: "AI Engine Active",
          delay: "0.3s"
        }, {
          label: "Body Detection ON",
          delay: "0.6s"
        }, {
          label: "Calibrating...",
          delay: "0.9s"
        }].map(({
          label,
          delay
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 opacity-0", style: {
          animation: `fadeIn 0.4s ease-out ${delay} forwards`
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold uppercase tracking-widest text-cyan/80", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto h-px flex-1 bg-cyan/20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-cyan/50", children: "OK" })
        ] }, label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-0.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full", style: {
          background: "linear-gradient(90deg,#0891b2,#22d3ee)",
          animation: "shimmer 1.2s linear infinite",
          backgroundSize: "200% 100%",
          width: "100%"
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setScanBooting(false), className: "text-[10px] text-slate-600 underline", children: copy.cancel })
      ] })
    ] }) : null,
    liveOpen ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex flex-col bg-black", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between border-b border-cyan/20 bg-black/90 px-4 py-3 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-cyan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold text-cyan tracking-widest uppercase", children: kind === "body" ? captureStep === "front" ? copy.stepFront : copy.stepBack : "3D Body Scan · Live" }),
          kind === "body" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 ml-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-1.5 w-5 rounded-full transition-colors", "bg-cyan") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-1.5 w-5 rounded-full transition-colors", captureStep === "back" ? "bg-cyan" : "bg-white/20") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: closeLive, className: "grid h-8 w-8 place-items-center rounded-full border border-cyan/30 bg-black/60 text-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1 overflow-hidden bg-black", children: liveError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-4 px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 place-items-center rounded-full border border-cyan/30 bg-cyan/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-7 w-7 text-cyan" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: liveError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          closeLive();
          galleryRef.current?.click();
        }, className: "rounded-xl px-6 py-3 text-sm font-bold text-white", style: {
          background: "linear-gradient(135deg,#0891b2,#22d3ee)"
        }, children: copy.useGallery })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, className: "h-full w-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0", style: {
          backgroundImage: "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-x-0 h-0.5", style: {
          background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.9) 30%, #22d3ee 50%, rgba(34,211,238,0.9) 70%, transparent 100%)",
          boxShadow: "0 0 12px 4px rgba(34,211,238,0.5)",
          animation: "scan3d 2.4s ease-in-out infinite"
        } }),
        kind === "body" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[78%] w-[52%]", style: {
            animation: "bracketPulse 2s ease-in-out infinite"
          }, children: [
            ["top-0 left-0 border-t-2 border-l-2 rounded-tl-lg", "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg", "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg", "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg"].map((cls, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute h-8 w-8 border-cyan ${cls}` }, i)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-[20%] inset-y-[4%] rounded-[50%_50%_45%_45%] border border-cyan/25" }),
            [25, 50, 75].map((pct) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 right-0 flex items-center gap-1", style: {
              top: `${pct}%`
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-3 bg-cyan/50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 border-t border-dashed border-cyan/15" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-3 bg-cyan/50" })
            ] }, pct))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute left-2 top-1/4 space-y-16 text-[9px] font-bold uppercase tracking-widest text-cyan/70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: copy.shoulders }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: copy.waist }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: copy.hip })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-48 w-48", children: ["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((cls, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute h-6 w-6 border-cyan rounded-sm ${cls}` }, i)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-cyan/30 bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-cyan", children: "REC ●" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-cyan/30 bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-cyan/70", children: "AI READY" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 py-8", children: [
          kind === "body" && captureStep === "back" && frontPhoto && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-full border border-cyan/30 bg-black/70 px-3 py-1.5 backdrop-blur", style: {
            animation: "fadeIn 0.3s ease-out forwards"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: frontPhoto, alt: "front", className: "h-8 w-6 rounded object-cover border border-cyan/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-emerald-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold uppercase tracking-widest text-cyan", children: copy.frontCaptured })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan/70", children: kind === "body" ? captureStep === "front" ? copy.frontCaptureGuide : copy.backCaptureGuide : copy.foodCapture }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: captureFromVideo, className: "grid place-items-center rounded-full active:scale-90 transition-transform", style: {
            height: 72,
            width: 72,
            background: kind === "body" && captureStep === "back" ? "linear-gradient(135deg,#c2410c,#fb923c)" : "linear-gradient(135deg,#0891b2,#22d3ee)",
            boxShadow: kind === "body" && captureStep === "back" ? "0 0 0 4px rgba(251,146,60,0.2), 0 0 24px rgba(251,146,60,0.5)" : "0 0 0 4px rgba(34,211,238,0.2), 0 0 24px rgba(34,211,238,0.5)",
            animation: "scanGlow 2s ease-in-out infinite"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-7 w-7 text-white" }) })
        ] })
      ] }) })
    ] }) : null,
    guideOpen && kind === "body" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex flex-col bg-black", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0", style: {
        backgroundImage: "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-cyan/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between border-b border-cyan/20 bg-black/80 px-4 py-3 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-cyan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-black uppercase tracking-widest text-cyan", children: guideStep === 0 ? "Setup · 3D Scan" : "Calibração · IA" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-1.5 w-8 rounded-full transition-colors", guideStep >= 0 ? "bg-cyan" : "bg-white/20") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-1.5 w-8 rounded-full transition-colors", guideStep >= 1 ? "bg-cyan" : "bg-white/20") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setGuideOpen(false), className: "grid h-8 w-8 place-items-center rounded-full border border-cyan/30 bg-black/60 text-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1 overflow-y-auto px-4 py-5", children: guideStep === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto", style: {
          width: 120
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BodySilhouette, { female: isFemale, width: 120, height: 260 }),
          ["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((cls, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute h-5 w-5 border-cyan/60 rounded-sm ${cls}` }, i)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 top-3 text-[8px] font-bold uppercase tracking-widest text-cyan/50", children: copy.shoulders }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 top-[40%] text-[8px] font-bold uppercase tracking-widest text-cyan/50", children: copy.waist }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 bottom-4 text-[8px] font-bold uppercase tracking-widest text-cyan/50", children: copy.hip })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [Ruler, Sun, Maximize2, Smartphone].map((Icon, i) => {
          const item = copy.captureSetupItems[i];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-cyan/20 bg-white/3 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-cyan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-white", children: item?.title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[10px] text-slate-500", children: item?.desc })
          ] }, i);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setGuideStep(1), className: "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black uppercase tracking-widest text-white active:scale-[0.98]", style: {
          background: "linear-gradient(135deg,#0369a1,#22d3ee)",
          boxShadow: "0 0 20px rgba(34,211,238,0.25)"
        }, children: [
          copy.calibrateBtn,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[10px] font-bold uppercase tracking-widest text-cyan/60", children: copy.calibrationDataDesc }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [{
          label: copy.height,
          value: height,
          set: setHeight,
          unit: "cm",
          mode: "numeric"
        }, {
          label: copy.weight,
          value: weight,
          set: setWeight,
          unit: "kg",
          mode: "decimal"
        }].map(({
          label,
          value,
          set,
          unit,
          mode
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-cyan/20 bg-white/3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold uppercase tracking-widest text-cyan/70", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-baseline gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", inputMode: mode, value, onChange: (e) => set(e.target.value), className: "w-full rounded-lg border border-cyan/20 bg-black/40 px-2 py-1.5 text-center font-display text-2xl font-black text-white focus:border-cyan focus:outline-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: unit })
          ] })
        ] }, label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-cyan/20 bg-white/3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold uppercase tracking-widest text-cyan/70", children: copy.clothing }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 grid grid-cols-3 gap-2", children: ["justa", "normal", "larga"].map((option) => {
            const label = option === "justa" ? copy.outfitTight : option === "normal" ? copy.outfitNormal : copy.outfitLoose;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOutfit(option), className: cn("rounded-xl border px-2 py-2 text-xs font-bold capitalize transition", outfit === option ? "border-cyan bg-cyan/15 text-cyan" : "border-white/10 bg-white/3 text-slate-400"), children: label }, option);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-cyan/30 bg-cyan/8 p-3 text-[10px] text-cyan", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 shrink-0" }),
          copy.calibratedMsg
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setGuideStep(0), className: "rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-slate-400 active:scale-[0.98]", children: copy.back }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setGuideOpen(false);
            triggerInput(pending);
          }, className: "flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black uppercase tracking-widest text-white active:scale-[0.98]", style: {
            background: "linear-gradient(135deg,#0369a1,#22d3ee)",
            boxShadow: "0 0 16px rgba(34,211,238,0.25)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
            " ",
            copy.startScan3d
          ] })
        ] })
      ] }) })
    ] }) : null,
    preview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex flex-col bg-black", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-cyan/20 bg-black/90 px-4 py-3 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          state === "scanning" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-cyan" }),
          state === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-success" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold tracking-widest uppercase", style: {
            color: state === "done" ? "var(--success)" : "#22d3ee"
          }, children: state === "scanning" ? copy.scanning3DHeader : copy.analysisDoneHeader })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "grid h-8 w-8 place-items-center rounded-full border border-cyan/30 bg-black/60 text-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: preview, alt: "scan", className: "h-full w-full object-contain" }),
        state === "scanning" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-black/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0", style: {
            backgroundImage: "linear-gradient(rgba(34,211,238,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-x-0 h-0.5", style: {
            background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.8) 30%, #22d3ee 50%, rgba(34,211,238,0.8) 70%, transparent 100%)",
            boxShadow: "0 0 16px 6px rgba(34,211,238,0.4)",
            animation: "scan3d 2s ease-in-out infinite"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-5 py-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-cyan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold uppercase tracking-widest text-cyan", children: copy.aiMappingLabel })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full overflow-hidden rounded-full bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full", style: {
              width: "60%",
              background: "linear-gradient(90deg, #0891b2, #22d3ee)",
              animation: "shimmer 1.5s linear infinite",
              backgroundSize: "200% 100%"
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[9px] font-bold uppercase tracking-widest text-cyan/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: copy.bodyCompositionScan }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: copy.measureEstimateScan }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: copy.fatPctScan })
            ] })
          ] })
        ] }) : null,
        state === "done" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-3 bottom-3 max-h-[62%] overflow-hidden rounded-2xl border border-cyan/20 bg-black/90 backdrop-blur flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-cyan/15 px-4 py-3 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-6 w-6 place-items-center rounded-full bg-success/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-success" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold text-white tracking-wide", children: copy.scan3dDone }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-cyan", children: "IA" })
          ] }),
          aiError ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-xs text-red-400 leading-relaxed", children: aiError }) : aiAnalysis ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto flex-1 p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap", children: aiAnalysis }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 p-3 border-t border-cyan/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "w-full rounded-xl py-3 text-sm font-bold text-white", style: {
            background: "linear-gradient(135deg,#0891b2,#22d3ee)"
          }, children: copy.saveClose }) })
        ] }) : null
      ] })
    ] }) : null
  ] });
}
function BodySilhouette({
  female = true,
  width = 120,
  height = 260,
  className
}) {
  const W = 120, H = 260, cx = 60;
  const torsoLevels = female ? [
    [0.068, 0.118, 14, false],
    // head
    [0.196, 0.298, 7, true],
    // shoulders
    [0.288, 0.318, 7, false],
    // chest/bust
    [0.402, 0.205, 6, true],
    // waist (narrowest)
    [0.518, 0.348, 7, true]
    // hips (widest)
  ] : [
    [0.068, 0.122, 14, false],
    // head
    [0.196, 0.355, 7, true],
    // shoulders (widest for male)
    [0.288, 0.33, 7, false],
    // chest
    [0.402, 0.255, 6, true],
    // waist
    [0.518, 0.278, 7, true]
    // hips (narrower than shoulders)
  ];
  const legLevels = [
    [0.64, 0.115, 7],
    // thigh
    [0.762, 0.092, 6],
    // knee
    [0.878, 0.072, 5]
    // calf
  ];
  const outlineLines = [];
  for (let i = 0; i < torsoLevels.length - 1; i++) {
    const [y1f, rx1] = torsoLevels[i];
    const [y2f, rx2] = torsoLevels[i + 1];
    const y1 = y1f * H, y2 = y2f * H;
    outlineLines.push([cx - rx1 * W, y1, cx - rx2 * W, y2]);
    outlineLines.push([cx + rx1 * W, y1, cx + rx2 * W, y2]);
  }
  const legOffsets = female ? [0.13, 0.165] : [0.13, 0.165];
  const allLegLevels = [[torsoLevels[4][0], 0.145, 7], ...legLevels];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width, height, viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "xMidYMid meet", fill: "none", className, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "bStk", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#22d3ee", stopOpacity: "0.95" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "60%", stopColor: "#38bdf8", stopOpacity: "0.75" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#3b82f6", stopOpacity: "0.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "bFl", x1: "0", y1: "0", x2: "1", y2: "0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#22d3ee", stopOpacity: "0.06" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#22d3ee", stopOpacity: "0.18" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#22d3ee", stopOpacity: "0.06" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "bScn", x1: "0", y1: "0", x2: "1", y2: "0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#22d3ee", stopOpacity: "0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#22d3ee", stopOpacity: "1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#22d3ee", stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: "bGlow", cx: "50%", cy: "50%", r: "50%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#22d3ee", stopOpacity: "0.25" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#22d3ee", stopOpacity: "0" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: cx, y1: "0", x2: cx, y2: H, stroke: "#22d3ee", strokeWidth: "0.35", opacity: "0.15" }),
    outlineLines.map(([x1, y1, x2, y2], i) => /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1, y1, x2, y2, stroke: "url(#bStk)", strokeWidth: "0.7", opacity: "0.35" }, i)),
    [0, 1].map((side) => {
      const sign = side === 0 ? -1 : 1;
      const legCenter = cx + sign * legOffsets[side] * W;
      return allLegLevels.map(([yFrac, rxFrac], j) => {
        if (j >= allLegLevels.length - 1) return null;
        const y1 = yFrac * H;
        const y2 = allLegLevels[j + 1][0] * H;
        const rx1 = rxFrac * W;
        const rx2 = allLegLevels[j + 1][1] * W;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: legCenter - rx1, y1, x2: legCenter - rx2, y2, stroke: "url(#bStk)", strokeWidth: "0.7", opacity: "0.32" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: legCenter + rx1, y1, x2: legCenter + rx2, y2, stroke: "url(#bStk)", strokeWidth: "0.7", opacity: "0.32" })
        ] }, `leg-${side}-${j}`);
      });
    }),
    torsoLevels.map(([yFrac, rxFrac, ry, key], i) => {
      const cy = yFrac * H;
      const rx = rxFrac * W;
      const alpha = 1 - i * 0.06;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
        key && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy, rx: rx + 3, ry: ry + 2, fill: "url(#bGlow)", stroke: "none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy, rx, ry, stroke: "url(#bStk)", strokeWidth: key ? "1.4" : "1", fill: "url(#bFl)", opacity: alpha })
      ] }, i);
    }),
    legLevels.map(([yFrac, rxFrac, ry], j) => {
      const cy = yFrac * H;
      const rx = rxFrac * W;
      return [0, 1].map((side) => {
        const legCenter = cx + (side === 0 ? -1 : 1) * legOffsets[side] * W;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: legCenter, cy, rx, ry, stroke: "url(#bStk)", strokeWidth: "1", fill: "url(#bFl)", opacity: 0.88 - j * 0.08 }, `${j}-${side}`);
      });
    }),
    female && /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M47 3 Q52 -2 57 1 Q60 -3 63 1 Q68 -2 73 3", stroke: "#22d3ee", strokeWidth: "1.2", fill: "none", opacity: "0.45" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "0", width: W, height: "2.5", fill: "url(#bScn)", style: {
      animation: "scan3d 2.2s ease-in-out infinite"
    } }),
    [[0.196, "Ombros"], [0.402, "Cintura"], [0.518, "Quadril"]].map(([yf, lbl]) => {
      const y = yf * H;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: y, x2: "10", y2: y, stroke: "#22d3ee", strokeWidth: "0.9", opacity: "0.6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: W - 10, y1: y, x2: W, y2: y, stroke: "#22d3ee", strokeWidth: "0.9", opacity: "0.6" })
      ] }, lbl);
    })
  ] });
}
function ScanHistory({
  kind,
  copy
}) {
  const items = kind === "body" ? bodyScans : foodScans;
  const title = kind === "body" ? copy.historyBody : copy.historyFood;
  const locale = getStoredLocale();
  const series = kind === "body" ? [...bodyScans].reverse().map((scan) => ({
    date: formatScanDate(scan.data, locale),
    value: scan.estimativas.cinturaCmEstimada,
    value2: scan.estimativas.peitoCmEstimado
  })) : [...foodScans].reverse().map((scan) => ({
    date: formatScanDate(scan.data, locale),
    value: scan.estimativas.kcal,
    value2: scan.estimativas.proteinaG * 10
  }));
  const min = Math.min(...series.map((item) => item.value));
  const max = Math.max(...series.map((item) => item.value));
  const range = Math.max(0.1, max - min);
  const min2 = Math.min(...series.map((item) => item.value2));
  const max2 = Math.max(...series.map((item) => item.value2));
  const range2 = Math.max(0.1, max2 - min2);
  const path = (values, low, currentRange) => values.map((value, index) => {
    const x = index / (values.length - 1) * 100;
    const y = 100 - (value - low) / currentRange * 90 - 5;
    return `${index === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  const labels = kind === "body" ? {
    a: copy.waistSeries,
    b: copy.chestSeries
  } : {
    a: copy.calsSeries,
    b: copy.proteinSeries
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { title, subtitle: copy.recordsFn(items.length) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border border-border bg-elevated/40 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-3 rounded-full bg-primary" }),
          " ",
          labels.a
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-cyan", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-3 rounded-full bg-cyan" }),
          " ",
          labels.b
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", className: "h-24 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: path(series.map((item) => item.value), min, range), fill: "none", stroke: "var(--primary)", strokeWidth: "2", vectorEffect: "non-scaling-stroke" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: path(series.map((item) => item.value2), min2, range2), fill: "none", stroke: "var(--cyan)", strokeWidth: "2", vectorEffect: "non-scaling-stroke" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex justify-between text-[9px] text-muted-foreground", children: series.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.date }, item.date)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: items.map((scan) => {
      const isBody = "calibragem" in scan;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border bg-elevated/40 p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-border", style: {
          background: scan.miniatura
        }, children: isBody ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-5 w-5 text-primary/70" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5 text-primary/70" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: isBody ? copy.bodyScan : scan.refeicao }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: formatScanDate(scan.data, locale) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex flex-wrap gap-1.5", children: isBody ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: copy.chest, value: `${scan.estimativas.peitoCmEstimado} cm` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: copy.waist, value: `${scan.estimativas.cinturaCmEstimada} cm` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: copy.fatPctScan, value: `${scan.estimativas.percentualGorduraEstimado}%` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: copy.confidence, value: `${scan.qualidade.confiancaLeitura}%` })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: "kcal", value: `${scan.estimativas.kcal}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: "P", value: `${scan.estimativas.proteinaG}g` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: "C", value: `${scan.estimativas.carboG}g` })
          ] }) })
        ] })
      ] }, scan.id);
    }) })
  ] });
}
function Chip({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: value })
  ] });
}
export {
  CorpoPage as component
};