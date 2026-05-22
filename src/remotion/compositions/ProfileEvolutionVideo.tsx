import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { AnimatedBar } from "../components/AnimatedBar";

export interface ProfileEvolutionVideoProps {
  name?: string;
  goal?: string;
  level?: string;
  totalSessions?: number;
  weekNumber?: number;
  consistency?: number;
  xp?: number;
  streak?: number;
  badges?: string[];
  locale?: "pt" | "es" | "en" | "fr" | "de";
  avatarUrl?: string;
}

const copy = {
  pt: { xpTotal: "XP Total", streak: "Sequência", sessions: "Sessões", week: "Semana", consist: "Consistência", achievements: "Conquistas", tagline: "Evolução em progresso" },
  es: { xpTotal: "XP Total", streak: "Racha", sessions: "Sesiones", week: "Semana", consist: "Consistencia", achievements: "Logros", tagline: "Evolución en progreso" },
  en: { xpTotal: "Total XP", streak: "Streak", sessions: "Sessions", week: "Week", consist: "Consistency", achievements: "Achievements", tagline: "Evolution in progress" },
  fr: { xpTotal: "XP Total", streak: "Série", sessions: "Séances", week: "Semaine", consist: "Régularité", achievements: "Succès", tagline: "Évolution en cours" },
  de: { xpTotal: "XP Gesamt", streak: "Serie", sessions: "Sessions", week: "Woche", consist: "Konstanz", achievements: "Erfolge", tagline: "Evolution im Gange" },
};

export function ProfileEvolutionVideo({
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
  avatarUrl,
}: ProfileEvolutionVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = copy[locale] ?? copy.pt;

  const fadeIn   = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const heroY    = interpolate(frame, [0, 24], [48, 0], { extrapolateRight: "clamp" });
  const heroScale = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });

  const cardOpacity = interpolate(frame, [22, 40], [0, 1], { extrapolateRight: "clamp" });
  const cardY       = interpolate(frame, [22, 40], [40, 0], { extrapolateRight: "clamp" });
  const cardScale   = spring({ frame: frame - 22, fps, config: { damping: 16, stiffness: 105 } });

  const statsOpacity = interpolate(frame, [42, 58], [0, 1], { extrapolateRight: "clamp" });
  const statsY       = interpolate(frame, [42, 58], [36, 0], { extrapolateRight: "clamp" });

  const badgesOpacity = interpolate(frame, [60, 78], [0, 1], { extrapolateRight: "clamp" });

  const mascoteScale   = spring({ frame: frame - 82, fps, config: { damping: 13, stiffness: 65 } });
  const mascoteOpacity = interpolate(frame, [82, 106], [0, 1], { extrapolateRight: "clamp" });

  const ringPulse = interpolate(frame % 75, [0, 37, 75], [1, 1.06, 1]);

  const initials = name.split(" ").slice(0, 2).map(p => p[0]?.toUpperCase() ?? "").join("");
  const xpBar = Math.min(100, (xp % 1000) / 10);

  return (
    <AbsoluteFill style={{ fontFamily: "'Space Grotesk', sans-serif", overflow: "hidden" }}>

      {/* ─── FUNDO ─── */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(175deg,#080e1c 0%,#0c1829 45%,#090f1a 100%)" }} />
      <div style={{
        position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
        width: 900, height: 900, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(34,211,238,0.07) 0%,transparent 65%)",
        filter: "blur(50px)",
      }} />
      <div style={{
        position: "absolute", bottom: -300, right: -200,
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(251,146,60,0.06) 0%,transparent 65%)",
        filter: "blur(60px)",
      }} />

      {/* ─── LOGO ─── */}
      <div style={{
        position: "absolute", top: 56, left: 0, right: 0,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
        opacity: fadeIn,
      }}>
        <img src="/logo favicton 3D Body Scan.png" style={{ width: 46, height: 46, borderRadius: 12, boxShadow: "0 0 18px rgba(34,211,238,0.45)" }} />
        <span style={{
          fontWeight: 900, fontSize: 22, letterSpacing: 0.2,
          background: "linear-gradient(90deg,#22d3ee,#e2e8f0,#fb923c)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>3D Body Scanner</span>
      </div>

      {/* ─── HERO: AVATAR + NOME ─── */}
      <div style={{
        position: "absolute", top: 148, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
        transform: `scale(${heroScale}) translateY(${heroY}px)`,
        opacity: fadeIn,
      }}>
        {/* Anel pulsante + avatar */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            position: "absolute",
            width: 180, height: 180, borderRadius: "50%",
            border: "2px solid rgba(34,211,238,0.22)",
            transform: `scale(${ringPulse})`,
          }} />
          <div style={{
            position: "absolute",
            width: 168, height: 168, borderRadius: "50%",
            border: "2.5px solid rgba(34,211,238,0.5)",
          }} />
          <div style={{
            width: 154, height: 154, borderRadius: "50%",
            overflow: "hidden",
            background: avatarUrl ? "transparent" : "linear-gradient(135deg,#22d3ee,#3b82f6,#fb923c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 56, fontWeight: 900, color: "#fff",
          }}>
            {avatarUrl
              ? <img src={avatarUrl} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              : initials || "💪"}
          </div>
        </div>

        {/* Nome */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 62, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1,
            background: "linear-gradient(90deg,#22d3ee,#f1f5f9,#fb923c)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>{name}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 18 }}>
            <span style={{
              fontSize: 16, color: "#22d3ee", fontWeight: 700,
              background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.35)",
              borderRadius: 999, padding: "8px 22px", letterSpacing: 0.3,
            }}>{level}</span>
            <span style={{
              fontSize: 16, color: "#fb923c", fontWeight: 700,
              background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.35)",
              borderRadius: 999, padding: "8px 22px", letterSpacing: 0.3,
            }}>{goal}</span>
          </div>
        </div>
      </div>

      {/* ─── LINHA DIVISÓRIA ─── */}
      <div style={{
        position: "absolute", top: 495, left: 48, right: 48, height: 1,
        background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.25),rgba(251,146,60,0.2),transparent)",
        opacity: cardOpacity,
      }} />

      {/* ─── XP CARD ─── */}
      <Sequence from={22}>
        <div style={{
          position: "absolute", top: 520, left: 48, right: 48,
          transform: `scale(${cardScale}) translateY(${cardY}px)`,
          opacity: cardOpacity,
          background: "rgba(14,22,42,0.85)",
          border: "1px solid rgba(251,146,60,0.25)",
          borderRadius: 26, padding: "26px 30px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: "rgba(148,163,184,0.45)", letterSpacing: 3.5, textTransform: "uppercase", marginBottom: 8 }}>{t.xpTotal}</div>
              <AnimatedCounter from={0} to={xp} startFrame={0} endFrame={45} suffix=" XP" style={{ fontSize: 52, fontWeight: 900, color: "#fb923c", letterSpacing: -1 }} />
            </div>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)",
              borderRadius: 20, padding: "14px 22px", gap: 4,
            }}>
              <span style={{ fontSize: 10, color: "rgba(148,163,184,0.45)", letterSpacing: 3, textTransform: "uppercase" }}>{t.streak}</span>
              <span style={{ fontSize: 38, fontWeight: 900, color: "#4ade80", lineHeight: 1 }}>🔥 {streak}</span>
            </div>
          </div>
          <AnimatedBar pct={xpBar} startFrame={0} color="linear-gradient(90deg,#fb923c,#fbbf24,#fb923c)" height={10} />
          <div style={{ marginTop: 10, fontSize: 12, color: "rgba(148,163,184,0.3)", letterSpacing: 0.3 }}>
            {xp % 1000} / 1000 XP
          </div>
        </div>
      </Sequence>

      {/* ─── STATS ─── */}
      <Sequence from={42}>
        <div style={{
          position: "absolute", top: 762, left: 48, right: 48,
          display: "flex", gap: 14,
          opacity: statsOpacity,
          transform: `translateY(${statsY}px)`,
        }}>
          {[
            { label: t.sessions, value: String(totalSessions), color: "#22d3ee", glow: "rgba(34,211,238,0.15)" },
            { label: t.week,     value: `${weekNumber}/12`,    color: "#a78bfa", glow: "rgba(167,139,250,0.15)" },
            { label: t.consist,  value: `${consistency}%`,    color: "#4ade80", glow: "rgba(74,222,128,0.15)" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1,
              background: `rgba(255,255,255,0.04)`,
              border: `1px solid ${s.color}28`,
              borderRadius: 22, padding: "20px 6px", textAlign: "center",
              boxShadow: `inset 0 1px 0 ${s.glow}`,
            }}>
              <div style={{ fontSize: 11, color: "rgba(148,163,184,0.45)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 10 }}>{s.label}</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </Sequence>

      {/* ─── CONQUISTAS ─── */}
      {badges.length > 0 && (
        <Sequence from={60}>
          <div style={{ position: "absolute", top: 942, left: 48, right: 48, opacity: badgesOpacity }}>
            <div style={{ fontSize: 10, color: "rgba(148,163,184,0.35)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>{t.achievements}</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {badges.slice(0, 6).map((b, i) => {
                const s = spring({ frame: frame - 60 - i * 6, fps, config: { damping: 13, stiffness: 120 } });
                return (
                  <div key={i} style={{
                    transform: `scale(${s})`,
                    width: 90, height: 90, borderRadius: 26,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
                  }}>{b}</div>
                );
              })}
            </div>
          </div>
        </Sequence>
      )}

      {/* ─── MASCOTE FINAL ─── */}
      <Sequence from={82}>
        <div style={{
          position: "absolute", top: 1190, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          transform: `scale(${mascoteScale})`,
          opacity: mascoteOpacity,
        }}>
          <div style={{ width: 220, height: 1, background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.35),rgba(251,146,60,0.25),transparent)", marginBottom: 8 }} />
          <img
            src="/MASCOTE SEM FUNDO.png"
            style={{ width: 400, height: 400, objectFit: "contain", filter: "drop-shadow(0 0 40px rgba(34,211,238,0.38))" }}
          />
          <div style={{
            fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase",
            color: "rgba(148,163,184,0.28)", marginTop: 4,
          }}>{t.tagline}</div>
        </div>
      </Sequence>

    </AbsoluteFill>
  );
}
