import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { BrandOverlay } from "../components/BrandOverlay";
import { AnimatedCounter } from "../components/AnimatedCounter";

const sessionCopy = {
  pt: { completed: "100% Concluído!", completedPct: "% Completado", series: "SÉRIES", duration: "Duração", volume: "Volume", calories: "Calorias", sets: "séries" },
  es: { completed: "100% Completado!", completedPct: "% Completado", series: "SERIES", duration: "Duración", volume: "Volumen", calories: "Calorías", sets: "series" },
  en: { completed: "100% Done!", completedPct: "% Complete", series: "SETS", duration: "Duration", volume: "Volume", calories: "Calories", sets: "sets" },
  fr: { completed: "100% Terminé !", completedPct: "% Terminé", series: "SÉRIES", duration: "Durée", volume: "Volume", calories: "Calories", sets: "séries" },
  de: { completed: "100% Geschafft!", completedPct: "% Abgeschlossen", series: "SÄTZE", duration: "Dauer", volume: "Volumen", calories: "Kalorien", sets: "Sätze" },
};

export interface SessionSummaryVideoProps {
  name?: string;
  workoutName?: string;
  date?: string;
  duration?: number;
  completedSets?: number;
  totalSets?: number;
  totalVolume?: number;
  calories?: number;
  exercises?: Array<{ name: string; muscle: string; sets: number; completed: number; topWeight: number }>;
  locale?: string;
}

export function SessionSummaryVideo({
  name = "Atleta",
  workoutName = "Push A",
  date = "Hoje",
  duration = 58,
  completedSets = 24,
  totalSets = 24,
  totalVolume = 5200,
  calories = 420,
  exercises = [],
  locale = "pt",
}: SessionSummaryVideoProps) {
  const copy = sessionCopy[locale as keyof typeof sessionCopy] ?? sessionCopy.pt;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heroScale = spring({ frame, fps, config: { damping: 13, stiffness: 110 } });
  const perfect = completedSets === totalSets && totalSets > 0;
  const pct = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const arcAngle = interpolate(frame, [10, 60], [0, pct / 100 * 283], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: "sans-serif" }}>
      <GradientBackground variant="dark" />
      <BrandOverlay position="top" />

      {/* Hero */}
      <div style={{ position: "absolute", top: 140, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          transform: `scale(${heroScale})`,
          background: perfect ? "rgba(74,222,128,0.15)" : "rgba(34,211,238,0.1)",
          border: `1px solid ${perfect ? "rgba(74,222,128,0.4)" : "rgba(34,211,238,0.3)"}`,
          borderRadius: 999, padding: "10px 28px", marginBottom: 20,
          fontSize: 15, fontWeight: 700, color: perfect ? "#4ade80" : "#22d3ee",
          letterSpacing: 2, textTransform: "uppercase",
        }}>
          {perfect ? `🏆 ${copy.completed}` : `${pct.toFixed(0)}${copy.completedPct}`}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>{workoutName}</div>
          <div style={{ fontSize: 15, color: "rgba(148,163,184,0.6)", marginTop: 6 }}>{name} · {date}</div>
        </div>
      </div>

      {/* Progresso circular */}
      <Sequence from={10}>
        <div style={{ position: "absolute", top: 310, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 150, height: 150 }}>
            <svg width={150} height={150} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
              <circle cx={75} cy={75} r={65} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
              <circle cx={75} cy={75} r={65} fill="none" stroke={perfect ? "#4ade80" : "#22d3ee"} strokeWidth={10}
                strokeDasharray={`${arcAngle} 283`} strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 8px ${perfect ? "#4ade80" : "#22d3ee"})` }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{completedSets}/{totalSets}</div>
              <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", letterSpacing: 2 }}>{copy.series}</div>
            </div>
          </div>
        </div>
      </Sequence>

      {/* Stats */}
      <Sequence from={35}>
        <div style={{ position: "absolute", top: 500, left: 48, right: 48, display: "flex", gap: 14 }}>
          {[
            { label: copy.duration, val: `${duration}min`, color: "#22d3ee" },
            { label: copy.volume, val: `${(totalVolume / 1000).toFixed(1)}t`, color: "#fb923c" },
            { label: copy.calories, val: `${calories}`, color: "#4ade80" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}25`,
              borderRadius: 18, padding: "14px 10px", textAlign: "center",
            }}>
              <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", letterSpacing: 2, textTransform: "uppercase" }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color, marginTop: 4 }}>{s.val}</div>
            </div>
          ))}
        </div>
      </Sequence>

      {/* Exercícios */}
      <Sequence from={55}>
        <div style={{ position: "absolute", top: 630, left: 48, right: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {exercises.slice(0, 5).map((ex, i) => {
              const opacity = interpolate(frame, [i * 8, i * 8 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={i} style={{
                  opacity, display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "10px 16px",
                  border: ex.completed === ex.sets ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{ex.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)" }}>{ex.muscle}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: ex.completed === ex.sets ? "#4ade80" : "#22d3ee" }}>
                      {ex.completed}/{ex.sets} {copy.sets}
                    </div>
                    {ex.topWeight > 0 && <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)" }}>{ex.topWeight} kg</div>}
                  </div>
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
