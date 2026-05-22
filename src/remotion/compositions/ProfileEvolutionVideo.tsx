import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
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
  pt: {
    xpTotal: "XP Total",
    streak: "Sequência",
    nextLevel: "para o próximo nível",
    sessions: "Sessões",
    week: "Semana",
    consist: "Consistência",
    achievements: "Conquistas",
    athlete: "Atleta 3D Body Scanner",
    tagline: "Evolução em progresso",
  },
  es: {
    xpTotal: "XP Total",
    streak: "Racha",
    nextLevel: "para el siguiente nivel",
    sessions: "Sesiones",
    week: "Semana",
    consist: "Consistencia",
    achievements: "Logros",
    athlete: "Atleta 3D Body Scanner",
    tagline: "Evolución en progreso",
  },
  en: {
    xpTotal: "Total XP",
    streak: "Streak",
    nextLevel: "to next level",
    sessions: "Sessions",
    week: "Week",
    consist: "Consistency",
    achievements: "Achievements",
    athlete: "3D Body Scanner Athlete",
    tagline: "Evolution in progress",
  },
  fr: {
    xpTotal: "XP Total",
    streak: "Série",
    nextLevel: "pour le prochain niveau",
    sessions: "Séances",
    week: "Semaine",
    consist: "Régularité",
    achievements: "Succès",
    athlete: "Athlète 3D Body Scanner",
    tagline: "Évolution en cours",
  },
  de: {
    xpTotal: "XP Gesamt",
    streak: "Serie",
    nextLevel: "zum nächsten Level",
    sessions: "Sessions",
    week: "Woche",
    consist: "Konstanz",
    achievements: "Erfolge",
    athlete: "3D Body Scanner Athlet",
    tagline: "Evolution im Gange",
  },
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

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const mascotScale = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const avatarScale = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
  const xpScale = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 120 } });
  const xpBar = interpolate(frame, [30, 80], [0, Math.min(100, (xp % 1000) / 10)], { extrapolateRight: "clamp" });
  const statsOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });
  const badgesOpacity = interpolate(frame, [65, 85], [0, 1], { extrapolateRight: "clamp" });
  const footerOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" });

  const initials = name.split(" ").slice(0, 2).map(p => p[0]?.toUpperCase() ?? "").join("");

  return (
    <AbsoluteFill style={{ fontFamily: "sans-serif", overflow: "hidden" }}>
      <GradientBackground variant="dark" />

      {/* Glow de fundo */}
      <div style={{
        position: "absolute", top: -100, left: -100,
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
        filter: "blur(40px)",
      }} />
      <div style={{
        position: "absolute", bottom: 200, right: -100,
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)",
        filter: "blur(40px)",
      }} />

      {/* ─── TOP BRANDING ─── */}
      <div style={{
        position: "absolute", top: 80, left: 0, right: 0,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
        opacity: headerOpacity,
      }}>
        <img
          src="/logo favicton 3D Body Scanner.png"
          style={{ width: 56, height: 56, borderRadius: 14, boxShadow: "0 0 24px rgba(34,211,238,0.6)" }}
        />
        <span style={{
          fontWeight: 900, fontSize: 26, letterSpacing: -0.5,
          background: "linear-gradient(90deg, #22d3ee, #ffffff, #fb923c)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          3D Body Scanner
        </span>
      </div>

      {/* ─── MASCOTE ─── */}
      <div style={{
        position: "absolute", top: 170, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        transform: `scale(${mascotScale})`,
        filter: "drop-shadow(0 0 60px rgba(34,211,238,0.45)) drop-shadow(0 0 30px rgba(251,146,60,0.35))",
      }}>
        <img src="/mascote.png" style={{ width: 420, height: 420, objectFit: "contain" }} />
      </div>

      {/* ─── AVATAR + NOME ─── */}
      <div style={{
        position: "absolute", top: 600, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center",
        transform: `scale(${avatarScale})`,
      }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            style={{
              width: 96, height: 96, borderRadius: 30,
              objectFit: "cover", marginBottom: 18,
              boxShadow: "0 0 40px rgba(34,211,238,0.5), 0 0 0 3px rgba(34,211,238,0.4)",
            }}
          />
        ) : (
          <div style={{
            width: 96, height: 96, borderRadius: 30,
            background: "linear-gradient(135deg,#22d3ee,#3b82f6,#fb923c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 40px rgba(34,211,238,0.5)",
            fontSize: 38, fontWeight: 900, color: "#fff", marginBottom: 18,
          }}>
            {initials || "🏋️"}
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 42, fontWeight: 900, letterSpacing: -1,
            background: "linear-gradient(90deg,#22d3ee,#fff,#fb923c)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {name}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 12 }}>
            <span style={{ fontSize: 14, color: "#22d3ee", fontWeight: 700, background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 999, padding: "5px 16px" }}>
              {level}
            </span>
            <span style={{ fontSize: 14, color: "#fb923c", fontWeight: 700, background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 999, padding: "5px 16px" }}>
              {goal}
            </span>
          </div>
        </div>
      </div>

      {/* ─── XP BAR ─── */}
      <Sequence from={30}>
        <div style={{ position: "absolute", top: 880, left: 48, right: 48 }}>
          <div style={{
            transform: `scale(${xpScale})`,
            background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(251,146,60,0.25)",
            borderRadius: 28, padding: "28px 32px",
            boxShadow: "0 0 40px rgba(251,146,60,0.08)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
                  {t.xpTotal}
                </div>
                <AnimatedCounter from={0} to={xp} startFrame={0} endFrame={50} suffix=" XP" style={{ fontSize: 44, fontWeight: 900, color: "#fb923c" }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
                  {t.streak}
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#4ade80" }}>🔥 {streak}</div>
              </div>
            </div>
            <AnimatedBar pct={xpBar} startFrame={0} color="linear-gradient(90deg,#fb923c,#fbbf24)" height={12} />
            <div style={{ marginTop: 8, fontSize: 12, color: "rgba(148,163,184,0.35)" }}>
              {xp % 1000}/1000 XP {t.nextLevel}
            </div>
          </div>
        </div>
      </Sequence>

      {/* ─── STATS ─── */}
      <Sequence from={50}>
        <div style={{
          position: "absolute", top: 1120, left: 48, right: 48,
          display: "flex", gap: 18, opacity: statsOpacity,
        }}>
          {[
            { label: t.sessions, value: String(totalSessions), color: "#22d3ee" },
            { label: t.week, value: `${weekNumber}/12`, color: "#a78bfa" },
            { label: t.consist, value: `${consistency}%`, color: "#4ade80" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, background: "rgba(255,255,255,0.05)", border: `1.5px solid ${s.color}30`,
              borderRadius: 22, padding: "22px 10px", textAlign: "center",
              boxShadow: `0 0 24px ${s.color}14`,
            }}>
              <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </Sequence>

      {/* ─── CONQUISTAS ─── */}
      {badges.length > 0 && (
        <Sequence from={65}>
          <div style={{ position: "absolute", top: 1330, left: 48, right: 48, opacity: badgesOpacity }}>
            <div style={{ fontSize: 12, color: "rgba(148,163,184,0.4)", letterSpacing: 3.5, textTransform: "uppercase", marginBottom: 20 }}>
              {t.achievements}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {badges.slice(0, 6).map((b, i) => {
                const bScale = spring({ frame: frame - 65 - i * 6, fps, config: { damping: 14, stiffness: 130 } });
                return (
                  <div key={i} style={{
                    transform: `scale(${bScale})`,
                    width: 80, height: 80, borderRadius: 24,
                    background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 36,
                    boxShadow: "0 0 16px rgba(34,211,238,0.08)",
                  }}>
                    {b}
                  </div>
                );
              })}
            </div>
          </div>
        </Sequence>
      )}

      {/* ─── TAGLINE ─── */}
      <div style={{
        position: "absolute", top: 1580, left: 48, right: 48, textAlign: "center",
        opacity: badgesOpacity,
      }}>
        <div style={{
          fontSize: 20, fontWeight: 700, letterSpacing: 2,
          textTransform: "uppercase", color: "rgba(148,163,184,0.35)",
        }}>
          {t.tagline}
        </div>
      </div>

      {/* ─── FOOTER BRANDING ─── */}
      <div style={{
        position: "absolute", bottom: 80, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        opacity: footerOpacity,
      }}>
        <div style={{
          width: 200, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/logo favicton 3D Body Scanner.png"
            style={{ width: 40, height: 40, borderRadius: 11, boxShadow: "0 0 16px rgba(34,211,238,0.5)" }}
          />
          <span style={{
            fontWeight: 900, fontSize: 20, letterSpacing: -0.5,
            background: "linear-gradient(90deg, #22d3ee, #ffffff, #fb923c)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            3D Body Scanner
          </span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(148,163,184,0.3)", letterSpacing: 2 }}>zyrox.app</div>
      </div>
    </AbsoluteFill>
  );
}
