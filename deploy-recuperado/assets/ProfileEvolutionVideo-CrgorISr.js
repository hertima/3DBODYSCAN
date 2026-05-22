import { W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { u as useCurrentFrame, a as useVideoConfig, i as interpolate, s as spring, A as AbsoluteFill, S as Sequence } from "./index-CcuZFuTS.js";
import { G as GradientBackground } from "./VideoPlayerModal-BQaBY8IB.js";
import { A as AnimatedCounter } from "./AnimatedCounter-D13SVpt3.js";
import { A as AnimatedBar } from "./AnimatedBar-OjSZ2IxW.js";
const copy = {
  pt: {
    xpTotal: "XP Total",
    streak: "Sequência",
    nextLevel: "para o próximo nível",
    sessions: "Sessões",
    week: "Semana",
    consist: "Consistência",
    achievements: "Conquistas",
    athlete: "Atleta 3D Body Scan",
    tagline: "Evolução em progresso"
  },
  es: {
    xpTotal: "XP Total",
    streak: "Racha",
    nextLevel: "para el siguiente nivel",
    sessions: "Sesiones",
    week: "Semana",
    consist: "Consistencia",
    achievements: "Logros",
    athlete: "Atleta 3D Body Scan",
    tagline: "Evolución en progreso"
  },
  en: {
    xpTotal: "Total XP",
    streak: "Streak",
    nextLevel: "to next level",
    sessions: "Sessions",
    week: "Week",
    consist: "Consistency",
    achievements: "Achievements",
    athlete: "3D Body Scan Athlete",
    tagline: "Evolution in progress"
  },
  fr: {
    xpTotal: "XP Total",
    streak: "Série",
    nextLevel: "pour le prochain niveau",
    sessions: "Séances",
    week: "Semaine",
    consist: "Régularité",
    achievements: "Succès",
    athlete: "Athlète 3D Body Scan",
    tagline: "Évolution en cours"
  },
  de: {
    xpTotal: "XP Gesamt",
    streak: "Serie",
    nextLevel: "zum nächsten Level",
    sessions: "Sessions",
    week: "Woche",
    consist: "Konstanz",
    achievements: "Erfolge",
    athlete: "3D Body Scan Athlet",
    tagline: "Evolution im Gange"
  }
};
function ProfileEvolutionVideo({
  name = "Atleta",
  goal = "Hipertrofia",
  level = "Intermediário",
  totalSessions = 47,
  weekNumber = 3,
  consistency = 82,
  xp = 3200,
  streak = 5,
  badges = ["🏆", "🔥", "💪", "⚡"],
  locale = "pt",
  avatarUrl
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = copy[locale] ?? copy.pt;
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const mascotScale = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const avatarScale = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
  const xpScale = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 120 } });
  const xpBar = interpolate(frame, [30, 80], [0, Math.min(100, xp % 1e3 / 10)], { extrapolateRight: "clamp" });
  const statsOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });
  const badgesOpacity = interpolate(frame, [65, 85], [0, 1], { extrapolateRight: "clamp" });
  const footerOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" });
  const initials = name.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AbsoluteFill, { style: { fontFamily: "sans-serif", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GradientBackground, { variant: "dark" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      top: -100,
      left: -100,
      width: 600,
      height: 600,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
      filter: "blur(40px)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      bottom: 200,
      right: -100,
      width: 500,
      height: 500,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)",
      filter: "blur(40px)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      top: 80,
      left: 0,
      right: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      opacity: headerOpacity
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/logo favicton 3D Body Scan.png",
          style: { width: 56, height: 56, borderRadius: 14, boxShadow: "0 0 24px rgba(34,211,238,0.6)" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        fontWeight: 900,
        fontSize: 26,
        letterSpacing: -0.5,
        background: "linear-gradient(90deg, #22d3ee, #ffffff, #fb923c)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }, children: "3D Body Scan" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      top: 170,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      transform: `scale(${mascotScale})`,
      filter: "drop-shadow(0 0 60px rgba(34,211,238,0.45)) drop-shadow(0 0 30px rgba(251,146,60,0.35))"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/mascote.png", style: { width: 420, height: 420, objectFit: "contain" } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      top: 600,
      left: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      transform: `scale(${avatarScale})`
    }, children: [
      avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: avatarUrl,
          style: {
            width: 96,
            height: 96,
            borderRadius: 30,
            objectFit: "cover",
            marginBottom: 18,
            boxShadow: "0 0 40px rgba(34,211,238,0.5), 0 0 0 3px rgba(34,211,238,0.4)"
          }
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: 96,
        height: 96,
        borderRadius: 30,
        background: "linear-gradient(135deg,#22d3ee,#3b82f6,#fb923c)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 40px rgba(34,211,238,0.5)",
        fontSize: 38,
        fontWeight: 900,
        color: "#fff",
        marginBottom: 18
      }, children: initials || "🏋️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: -1,
          background: "linear-gradient(90deg,#22d3ee,#fff,#fb923c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }, children: name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, color: "#22d3ee", fontWeight: 700, background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 999, padding: "5px 16px" }, children: level }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, color: "#fb923c", fontWeight: 700, background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 999, padding: "5px 16px" }, children: goal })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 30, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 880, left: 48, right: 48 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      transform: `scale(${xpScale})`,
      background: "rgba(255,255,255,0.04)",
      border: "1.5px solid rgba(251,146,60,0.25)",
      borderRadius: 28,
      padding: "28px 32px",
      boxShadow: "0 0 40px rgba(251,146,60,0.08)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(148,163,184,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }, children: t.xpTotal }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCounter, { from: 0, to: xp, startFrame: 0, endFrame: 50, suffix: " XP", style: { fontSize: 44, fontWeight: 900, color: "#fb923c" } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(148,163,184,0.5)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }, children: t.streak }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 32, fontWeight: 900, color: "#4ade80" }, children: [
            "🔥 ",
            streak
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedBar, { pct: xpBar, startFrame: 0, color: "linear-gradient(90deg,#fb923c,#fbbf24)", height: 12 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8, fontSize: 12, color: "rgba(148,163,184,0.35)" }, children: [
        xp % 1e3,
        "/1000 XP ",
        t.nextLevel
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 50, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      top: 1120,
      left: 48,
      right: 48,
      display: "flex",
      gap: 18,
      opacity: statsOpacity
    }, children: [
      { label: t.sessions, value: String(totalSessions), color: "#22d3ee" },
      { label: t.week, value: `${weekNumber}/12`, color: "#a78bfa" },
      { label: t.consist, value: `${consistency}%`, color: "#4ade80" }
    ].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      flex: 1,
      background: "rgba(255,255,255,0.05)",
      border: `1.5px solid ${s.color}30`,
      borderRadius: 22,
      padding: "22px 10px",
      textAlign: "center",
      boxShadow: `0 0 24px ${s.color}14`
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(148,163,184,0.5)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }, children: s.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 30, fontWeight: 900, color: s.color }, children: s.value })
    ] }, i)) }) }),
    badges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 65, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 1330, left: 48, right: 48, opacity: badgesOpacity }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(148,163,184,0.4)", letterSpacing: 3.5, textTransform: "uppercase", marginBottom: 20 }, children: t.achievements }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 16, flexWrap: "wrap" }, children: badges.slice(0, 6).map((b, i) => {
        const bScale = spring({ frame: frame - 65 - i * 6, fps, config: { damping: 14, stiffness: 130 } });
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          transform: `scale(${bScale})`,
          width: 80,
          height: 80,
          borderRadius: 24,
          background: "rgba(255,255,255,0.06)",
          border: "1.5px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          boxShadow: "0 0 16px rgba(34,211,238,0.08)"
        }, children: b }, i);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      top: 1580,
      left: 48,
      right: 48,
      textAlign: "center",
      opacity: badgesOpacity
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: "rgba(148,163,184,0.35)"
    }, children: t.tagline }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      bottom: 80,
      left: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      opacity: footerOpacity
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: 200,
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/logo favicton 3D Body Scan.png",
            style: { width: 40, height: 40, borderRadius: 11, boxShadow: "0 0 16px rgba(34,211,238,0.5)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          fontWeight: 900,
          fontSize: 20,
          letterSpacing: -0.5,
          background: "linear-gradient(90deg, #22d3ee, #ffffff, #fb923c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }, children: "3D Body Scan" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(148,163,184,0.3)", letterSpacing: 2 }, children: "zyrox.app" })
    ] })
  ] });
}
export {
  ProfileEvolutionVideo as P
};