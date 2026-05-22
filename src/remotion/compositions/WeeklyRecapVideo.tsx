import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { BrandOverlay } from "../components/BrandOverlay";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { AnimatedBar } from "../components/AnimatedBar";

export interface WeeklyRecapVideoProps {
  name?: string;
  weekNumber?: number;
  totalSessions?: number;
  plannedSessions?: number;
  totalVolume?: number;
  consistency?: number;
  phase?: string;
  muscleGroups?: Array<{ label: string; pct: number; color: string }>;
  goal?: string;
}

export function WeeklyRecapVideo({
  name = "Atleta",
  weekNumber = 3,
  totalSessions = 4,
  plannedSessions = 4,
  totalVolume = 12400,
  consistency = 85,
  phase = "Base",
  muscleGroups = [],
  goal = "Hipertrofia",
}: WeeklyRecapVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 25], [30, 0], { extrapolateRight: "clamp" });

  const consistencyScale = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 100 } });
  const consistencyAngle = interpolate(frame, [20, 70], [0, (consistency / 100) * 360], { extrapolateRight: "clamp" });

  const defaultMuscles = muscleGroups.length > 0 ? muscleGroups : [
    { label: "Peito", pct: 88, color: "#22d3ee" },
    { label: "Costas", pct: 75, color: "#fb923c" },
    { label: "Pernas", pct: 92, color: "#4ade80" },
    { label: "Ombros", pct: 65, color: "#a78bfa" },
  ];

  return (
    <AbsoluteFill style={{ fontFamily: "sans-serif" }}>
      <GradientBackground variant="analytics" />
      <BrandOverlay position="top" />

      {/* Header */}
      <div style={{
        position: "absolute", top: 140, left: 48, right: 48,
        opacity: headerOpacity, transform: `translateY(${headerY}px)`,
      }}>
        <div style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", letterSpacing: 4, textTransform: "uppercase" }}>
          Recap Semanal · Semana {weekNumber}/12
        </div>
        <div style={{
          fontSize: 40, fontWeight: 900, letterSpacing: -1, marginTop: 6,
          background: "linear-gradient(90deg,#a78bfa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          {name}
        </div>
        <div style={{
          marginTop: 10, display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: 999, padding: "6px 16px",
        }}>
          <span style={{ fontSize: 13, color: "#a78bfa", fontWeight: 700 }}>{phase}</span>
          <span style={{ fontSize: 13, color: "rgba(148,163,184,0.5)" }}>·</span>
          <span style={{ fontSize: 13, color: "rgba(148,163,184,0.7)" }}>{goal}</span>
        </div>
      </div>

      {/* Consistência — círculo */}
      <Sequence from={20}>
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ transform: `scale(${consistencyScale})`, position: "relative", width: 160, height: 160 }}>
            <svg width={160} height={160} style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
              <circle cx={80} cy={80} r={70} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
              <circle cx={80} cy={80} r={70} fill="none" stroke="url(#consistGrad)" strokeWidth={12}
                strokeDasharray={`${(consistencyAngle / 360) * (2 * Math.PI * 70)} ${2 * Math.PI * 70}`}
                strokeLinecap="round" />
              <defs>
                <linearGradient id="consistGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <AnimatedCounter from={0} to={consistency} startFrame={0} endFrame={50} suffix="%" style={{ fontSize: 38, fontWeight: 900, color: "#fff" }} />
              <div style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", letterSpacing: 2, textTransform: "uppercase" }}>consistência</div>
            </div>
          </div>
        </div>
      </Sequence>

      {/* Stats rápidas */}
      <Sequence from={40}>
        <div style={{ position: "absolute", top: 490, left: 48, right: 48, display: "flex", gap: 14 }}>
          {[
            { label: "Sessões", value: `${totalSessions}/${plannedSessions}`, color: "#4ade80" },
            { label: "Volume", value: `${(totalVolume / 1000).toFixed(1)}t`, color: "#fb923c" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}25`,
              borderRadius: 20, padding: "18px 16px", textAlign: "center",
            }}>
              <div style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </Sequence>

      {/* Grupos musculares */}
      <Sequence from={60}>
        <div style={{ position: "absolute", top: 620, left: 48, right: 48 }}>
          <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>Equilíbrio muscular</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {defaultMuscles.map((m, i) => {
              const labelOpacity = interpolate(frame, [i * 10, i * 10 + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={i} style={{ opacity: labelOpacity }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{m.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.pct}%</span>
                  </div>
                  <AnimatedBar pct={m.pct} startFrame={i * 10} color={m.color} height={7} />
                </div>
              );
            })}
          </div>
        </div>
      </Sequence>

      <BrandOverlay position="bottom" />
    </AbsoluteFill>
  );
}
