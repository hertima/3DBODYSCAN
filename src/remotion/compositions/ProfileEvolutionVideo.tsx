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

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const heroScale = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const cardScale = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 110 } });
  const statsOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: "clamp" });
  const badgesOpacity = interpolate(frame, [65, 85], [0, 1], { extrapolateRight: "clamp" });
  const avatarRevealScale = spring({ frame: frame - 88, fps, config: { damping: 12, stiffness: 72 } });
  const avatarRevealOpacity = interpolate(frame, [88, 115], [0, 1], { extrapolateRight: "clamp" });

  const initials = name.split(" ").slice(0, 2).map(p => p[0]?.toUpperCase() ?? "").join("");
  const xpBar = Math.min(100, (xp % 1000) / 10);

  return (
    <AbsoluteFill style={{ fontFamily: "'Space Grotesk', sans-serif", overflow: "hidden" }}>

      {/* Fundo gradiente */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(160deg, #0a0f1e 0%, #0d1a2e 40%, #0a1520 100%)",
      }} />

      {/* Glow sutil topo */}
      <div style={{
        position: "absolute", top: -300, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 800, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 60%)",
        filter: "blur(60px)",
      }} />

      {/* ─── LOGO TOPO ─── */}
      <div style={{
        position: "absolute", top: 72, left: 0, right: 0,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
        opacity: fadeIn,
      }}>
        <img src="/logo favicton 3D Body Scan.png" style={{ width: 48, height: 48, borderRadius: 12, boxShadow: "0 0 20px rgba(34,211,238,0.5)" }} />
        <span style={{
          fontWeight: 900, fontSize: 24, letterSpacing: -0.5,
          background: "linear-gradient(90deg,#22d3ee,#fff,#fb923c)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>3D Body Scanner</span>
      </div>

      {/* ─── HERO: AVATAR + NOME ─── */}
      <div style={{
        position: "absolute", top: 170, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
        transform: `scale(${heroScale})`, opacity: fadeIn,
      }}>
        {/* Avatar */}
        <div style={{
          width: 140, height: 140,
          borderRadius: 38,
          overflow: "hidden",
          background: avatarUrl ? "transparent" : "linear-gradient(135deg,#22d3ee,#3b82f6,#fb923c)",
          boxShadow: "0 0 0 3px rgba(34,211,238,0.5), 0 0 0 6px rgba(34,211,238,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 52, fontWeight: 900, color: "#fff",
        }}>
          {avatarUrl
            ? <img src={avatarUrl} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            : initials || "🏋️"}
        </div>

        {/* Nome */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 52, fontWeight: 900, letterSpacing: -1, lineHeight: 1,
            background: "linear-gradient(90deg,#22d3ee,#fff,#fb923c)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>{name}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 14 }}>
            <span style={{ fontSize: 17, color: "#22d3ee", fontWeight: 700, background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 999, padding: "7px 20px" }}>{level}</span>
            <span style={{ fontSize: 17, color: "#fb923c", fontWeight: 700, background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 999, padding: "7px 20px" }}>{goal}</span>
          </div>
        </div>
      </div>

      {/* ─── XP CARD ─── */}
      <Sequence from={25}>
        <div style={{
          position: "absolute", top: 530, left: 48, right: 48,
          transform: `scale(${cardScale})`,
          background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(251,146,60,0.3)",
          borderRadius: 28, padding: "28px 32px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>{t.xpTotal}</div>
              <AnimatedCounter from={0} to={xp} startFrame={0} endFrame={45} suffix=" XP" style={{ fontSize: 48, fontWeight: 900, color: "#fb923c" }} />
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{t.streak}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#4ade80" }}>🔥 {streak}</div>
            </div>
          </div>
          <AnimatedBar pct={xpBar} startFrame={0} color="linear-gradient(90deg,#fb923c,#fbbf24)" height={10} />
          <div style={{ marginTop: 8, fontSize: 11, color: "rgba(148,163,184,0.35)", letterSpacing: 0.3 }}>
            {xp % 1000}/1000 XP
          </div>
        </div>
      </Sequence>

      {/* ─── STATS 3 CARDS ─── */}
      <Sequence from={45}>
        <div style={{
          position: "absolute", top: 790, left: 48, right: 48,
          display: "flex", gap: 16, opacity: statsOpacity,
        }}>
          {[
            { label: t.sessions, value: String(totalSessions), color: "#22d3ee" },
            { label: t.week, value: `${weekNumber}/12`, color: "#a78bfa" },
            { label: t.consist, value: `${consistency}%`, color: "#4ade80" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, background: "rgba(255,255,255,0.05)", border: `1.5px solid ${s.color}30`,
              borderRadius: 22, padding: "22px 8px", textAlign: "center",
            }}>
              <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </Sequence>

      {/* ─── CONQUISTAS ─── */}
      {badges.length > 0 && (
        <Sequence from={65}>
          <div style={{ position: "absolute", top: 990, left: 48, right: 48, opacity: badgesOpacity }}>
            <div style={{ fontSize: 11, color: "rgba(148,163,184,0.4)", letterSpacing: 3.5, textTransform: "uppercase", marginBottom: 18 }}>{t.achievements}</div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {badges.slice(0, 6).map((b, i) => {
                const s = spring({ frame: frame - 65 - i * 5, fps, config: { damping: 14, stiffness: 130 } });
                return (
                  <div key={i} style={{
                    transform: `scale(${s})`,
                    width: 84, height: 84, borderRadius: 24,
                    background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38,
                  }}>{b}</div>
                );
              })}
            </div>
          </div>
        </Sequence>
      )}

      {/* ─── MASCOTE FINAL ─── */}
      <Sequence from={88}>
        <div style={{
          position: "absolute", top: 1180, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          transform: `scale(${avatarRevealScale})`, opacity: avatarRevealOpacity,
        }}>
          <img src="/MASCOTE SEM FUNDO.png" style={{ width: 320, height: 320, objectFit: "contain", filter: "drop-shadow(0 0 36px rgba(34,211,238,0.5))" }} />
          <div style={{ width: 180, height: 1, background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.4),transparent)" }} />
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(148,163,184,0.3)" }}>
            {t.tagline}
          </div>
        </div>
      </Sequence>

    </AbsoluteFill>
  );
}
