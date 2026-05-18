import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { BrandOverlay } from "../components/BrandOverlay";
import { AnimatedCounter } from "../components/AnimatedCounter";

export interface OnboardingCelebrationVideoProps {
  name?: string;
  goal?: string;
  level?: string;
  targetCalories?: number;
  protein?: number;
  daysPerWeek?: number;
  modality?: string;
}

export function OnboardingCelebrationVideo({
  name = "Atleta",
  goal = "Hipertrofia",
  level = "Intermediário",
  targetCalories = 2800,
  protein = 180,
  daysPerWeek = 4,
  modality = "Musculação",
}: OnboardingCelebrationVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 10, stiffness: 80 } });
  const titleOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });

  const stars = [0, 1, 2, 3, 4, 5].map(i => ({
    x: 20 + Math.sin(i * 1.1) * 40 + i * 14,
    y: Math.cos(i * 0.9) * 20 + 10,
    scale: spring({ frame: frame - i * 4, fps, config: { damping: 12, stiffness: 150 } }),
  }));

  return (
    <AbsoluteFill style={{ fontFamily: "sans-serif" }}>
      <GradientBackground variant="workout" />
      <BrandOverlay position="top" />

      {/* Confetti stars */}
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 300, height: 60 }}>
          {stars.map((s, i) => (
            <div key={i} style={{
              position: "absolute", left: s.x * 3, top: s.y,
              transform: `scale(${s.scale})`, fontSize: 24,
            }}>
              ✨
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ transform: `scale(${logoScale})`, fontSize: 80, marginBottom: 20 }}>🎯</div>

        <div style={{ opacity: titleOpacity, textAlign: "center" }}>
          <div style={{ fontSize: 16, color: "rgba(148,163,184,0.7)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>
            Plano criado com IA
          </div>
          <div style={{
            fontSize: 42, fontWeight: 900, letterSpacing: -1,
            background: "linear-gradient(90deg,#fb923c,#ffffff,#22d3ee)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {name}
          </div>
        </div>

        <div style={{ opacity: subtitleOpacity, marginTop: 16, display: "flex", gap: 10 }}>
          <span style={{ fontSize: 13, color: "#22d3ee", background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 999, padding: "5px 14px", fontWeight: 700 }}>{level}</span>
          <span style={{ fontSize: 13, color: "#fb923c", background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 999, padding: "5px 14px", fontWeight: 700 }}>{goal}</span>
          <span style={{ fontSize: 13, color: "#a78bfa", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 999, padding: "5px 14px", fontWeight: 700 }}>{modality}</span>
        </div>
      </div>

      {/* Plano nutricional */}
      <Sequence from={45}>
        <div style={{ position: "absolute", top: 430, left: 48, right: 48 }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.2)", borderRadius: 24, padding: 28 }}>
            <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>Seu plano calórico</div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <AnimatedCounter from={0} to={targetCalories} startFrame={0} endFrame={40} style={{
                fontSize: 60, fontWeight: 900,
                background: "linear-gradient(135deg,#22d3ee,#3b82f6,#fb923c)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }} />
              <div style={{ fontSize: 14, color: "rgba(148,163,184,0.5)", letterSpacing: 3 }}>KCAL/DIA</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "rgba(148,163,184,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>Proteína</div>
                <AnimatedCounter from={0} to={protein} startFrame={10} endFrame={50} suffix="g" style={{ fontSize: 26, fontWeight: 900, color: "#22d3ee" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "rgba(148,163,184,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>Dias/sem</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#fb923c" }}>{daysPerWeek}x</div>
              </div>
            </div>
          </div>
        </div>
      </Sequence>

      <Sequence from={80}>
        <div style={{ position: "absolute", top: 680, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontSize: 16, color: "rgba(148,163,184,0.5)", letterSpacing: 2 }}>Bloco de 12 semanas · Começa agora</div>
        </div>
      </Sequence>

      <BrandOverlay position="bottom" />
    </AbsoluteFill>
  );
}
