import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { BrandOverlay } from "../components/BrandOverlay";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { AnimatedBar } from "../components/AnimatedBar";

export interface CorpoEvolutionVideoProps {
  name?: string;
  bodyFatStart?: number;
  bodyFatCurrent?: number;
  weightStart?: number;
  weightCurrent?: number;
  waistStart?: number;
  waistCurrent?: number;
  muscleMass?: number;
  trend?: string;
}

export function CorpoEvolutionVideo({
  name = "Atleta",
  bodyFatStart = 22,
  bodyFatCurrent = 18,
  weightStart = 80,
  weightCurrent = 82,
  waistStart = 90,
  waistCurrent = 86,
  muscleMass = 68,
  trend = "Recomposição",
}: CorpoEvolutionVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [30, 0], { extrapolateRight: "clamp" });

  const card1Scale = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 120 } });
  const card2Scale = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 120 } });
  const card3Scale = spring({ frame: frame - 70, fps, config: { damping: 14, stiffness: 120 } });
  const card4Scale = spring({ frame: frame - 90, fps, config: { damping: 14, stiffness: 120 } });

  const fatDelta = bodyFatCurrent - bodyFatStart;
  const weightDelta = weightCurrent - weightStart;
  const waistDelta = waistCurrent - waistStart;

  return (
    <AbsoluteFill style={{ fontFamily: "sans-serif" }}>
      <GradientBackground variant="corpo" />
      <BrandOverlay position="top" />
      <BrandOverlay position="bottom" />

      {/* Conteúdo — flex column preenchendo do topo ao rodapé entre os overlays */}
      <div style={{
        position: "absolute",
        top: 160, bottom: 150,
        left: 48, right: 48,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}>

        {/* Título */}
        <div style={{ textAlign: "center", opacity: titleOpacity, transform: `translateY(${titleY}px)`, paddingTop: 20 }}>
          <div style={{ fontSize: 20, color: "rgba(148,163,184,0.8)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>
            Evolução Corporal
          </div>
          <div style={{
            fontSize: 56, fontWeight: 900, letterSpacing: -1,
            background: "linear-gradient(90deg,#22d3ee,#ffffff,#fb923c)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {name}
          </div>
          <div style={{
            marginTop: 16, display: "inline-block",
            background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.3)",
            borderRadius: 999, padding: "8px 28px",
            fontSize: 16, color: "#22d3ee", fontWeight: 700, letterSpacing: 1,
          }}>
            {trend}
          </div>
        </div>

        {/* Card Gordura Corporal */}
        <div style={{ transform: `scale(${card1Scale})`, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(34,211,238,0.25)", borderRadius: 28, padding: "36px 36px 28px" }}>
          <div style={{ fontSize: 13, color: "rgba(148,163,184,0.7)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>Gordura Corporal</div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
            <AnimatedCounter from={bodyFatStart} to={bodyFatCurrent} startFrame={40} endFrame={80} decimals={1} suffix="%" style={{ fontSize: 64, fontWeight: 900, color: fatDelta < 0 ? "#4ade80" : "#f87171" }} />
            <div style={{ textAlign: "right", paddingBottom: 8 }}>
              <div style={{ fontSize: 14, color: "rgba(148,163,184,0.6)" }}>Início</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "rgba(148,163,184,0.5)" }}>{bodyFatStart}%</div>
            </div>
          </div>
          <AnimatedBar pct={bodyFatCurrent * 2.5} startFrame={50} color={fatDelta < 0 ? "#4ade80" : "#f87171"} />
          <div style={{ marginTop: 14, fontSize: 15, fontWeight: 700, color: fatDelta < 0 ? "#4ade80" : "#f87171" }}>
            {fatDelta < 0 ? "▼" : "▲"} {Math.abs(fatDelta).toFixed(1)}% {fatDelta < 0 ? "eliminados" : "ganhos"}
          </div>
        </div>

        {/* Peso + Cintura */}
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1, transform: `scale(${card2Scale})`, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(251,146,60,0.25)", borderRadius: 28, padding: "32px 28px" }}>
            <div style={{ fontSize: 12, color: "rgba(148,163,184,0.7)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Peso</div>
            <AnimatedCounter from={weightStart} to={weightCurrent} startFrame={60} endFrame={100} decimals={1} suffix=" kg" style={{ fontSize: 44, fontWeight: 900, color: "#fb923c" }} />
            <div style={{ marginTop: 10, fontSize: 14, color: weightDelta > 0 ? "#4ade80" : "#f87171", fontWeight: 700 }}>
              {weightDelta > 0 ? "+" : ""}{weightDelta.toFixed(1)} kg
            </div>
          </div>
          <div style={{ flex: 1, transform: `scale(${card3Scale})`, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 28, padding: "32px 28px" }}>
            <div style={{ fontSize: 12, color: "rgba(148,163,184,0.7)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Cintura</div>
            <AnimatedCounter from={waistStart} to={waistCurrent} startFrame={70} endFrame={110} decimals={0} suffix=" cm" style={{ fontSize: 44, fontWeight: 900, color: "#a78bfa" }} />
            <div style={{ marginTop: 10, fontSize: 14, color: waistDelta < 0 ? "#4ade80" : "#f87171", fontWeight: 700 }}>
              {waistDelta > 0 ? "+" : ""}{waistDelta} cm
            </div>
          </div>
        </div>

        {/* Massa Magra */}
        <Sequence from={90}>
          <div style={{ transform: `scale(${card4Scale})`, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 28, padding: "36px 36px 28px" }}>
            <div style={{ fontSize: 13, color: "rgba(148,163,184,0.7)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>Massa Magra Estimada</div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <AnimatedCounter from={0} to={muscleMass} startFrame={0} endFrame={40} decimals={1} suffix=" kg" style={{ fontSize: 52, fontWeight: 900, color: "#4ade80" }} />
              <div style={{ flex: 1 }}>
                <AnimatedBar pct={(muscleMass / weightCurrent) * 100} startFrame={10} color="#4ade80" height={12} />
                <div style={{ marginTop: 12, fontSize: 13, color: "rgba(148,163,184,0.6)" }}>
                  {((muscleMass / weightCurrent) * 100).toFixed(0)}% do peso total
                </div>
              </div>
            </div>
          </div>
        </Sequence>

      </div>
    </AbsoluteFill>
  );
}
