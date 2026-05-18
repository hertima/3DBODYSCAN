import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";

type Props = {
  exerciseCount?: number;
  durationMinutes?: number;
  calories?: number;
  workoutName?: string;
};

function StatItem({ label, value, unit, delay, frame, fps }: {
  label: string; value: number; unit: string; delay: number; frame: number; fps: number;
}) {
  const opacity = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(frame, [delay, delay + 18], [-24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const s = spring({ fps, frame, from: 0.85, to: 1, durationInFrames: 20, delay, config: { damping: 12 } });

  return (
    <div style={{ opacity, transform: `translateX(${x}px) scale(${s})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ fontSize: 36, fontWeight: 900, color: "oklch(0.98 0.01 250)", lineHeight: 1 }}>
        {value}
        <span style={{ fontSize: 16, fontWeight: 600, color: "oklch(0.74 0.17 53)", marginLeft: 3 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", color: "oklch(0.65 0.04 262)", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

export function WorkoutSummaryComposition({ exerciseCount = 8, durationMinutes = 45, calories = 380, workoutName = "Treino A" }: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const iconScale = spring({ fps, frame, from: 0, to: 1, durationInFrames: 35, delay: 10, config: { damping: 10, stiffness: 100 } });
  const iconOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const titleOpacity = interpolate(frame, [38, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [38, 56], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const subtitleOpacity = interpolate(frame, [48, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const dividerScale = interpolate(frame, [65, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) });

  const ctaOpacity = interpolate(frame, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [110, 130], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const fadeOut = interpolate(frame, [155, 178], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "oklch(0.14 0.03 260)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        opacity: bgOpacity * fadeOut,
        fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "0 32px",
      }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute",
        width: 320,
        height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, oklch(0.74 0.17 53 / 0.2) 0%, transparent 70%)",
        filter: "blur(48px)",
        top: "20%",
      }} />

      {/* Grid */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.035,
        backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      {/* Mascote */}
      <div style={{
        transform: `scale(${iconScale})`, opacity: iconOpacity, marginBottom: 12,
        filter: "drop-shadow(0 0 32px rgba(34,211,238,0.5)) drop-shadow(0 0 16px rgba(251,146,60,0.4))",
      }}>
        <img
          src="/superhero character.png"
          style={{ width: 140, height: 140, objectFit: "contain" }}
        />
      </div>

      {/* Title */}
      <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, marginBottom: 6 }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: "oklch(0.98 0.01 250)", textAlign: "center", letterSpacing: "0.05em" }}>
          TREINO COMPLETO
        </div>
      </div>

      {/* Subtitle */}
      <div style={{ opacity: subtitleOpacity, marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "oklch(0.74 0.17 53)", letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center" }}>
          {workoutName}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        width: `${dividerScale * 60}%`,
        height: 1,
        background: "linear-gradient(to right, transparent, oklch(0.74 0.17 53 / 0.5), transparent)",
        marginBottom: 28,
      }} />

      {/* Stats */}
      <div style={{ display: "flex", gap: 36, alignItems: "flex-start", marginBottom: 36 }}>
        <StatItem label="Exercícios" value={exerciseCount} unit="" delay={82} frame={frame} fps={fps} />
        <div style={{ width: 1, height: 50, background: "oklch(0.30 0.04 262)", alignSelf: "center" }} />
        <StatItem label="Minutos" value={durationMinutes} unit="min" delay={94} frame={frame} fps={fps} />
        <div style={{ width: 1, height: 50, background: "oklch(0.30 0.04 262)", alignSelf: "center" }} />
        <StatItem label="Calorias" value={calories} unit="kcal" delay={106} frame={frame} fps={fps} />
      </div>

      {/* CTA */}
      <div style={{
        opacity: ctaOpacity,
        transform: `translateY(${ctaY}px)`,
        padding: "12px 28px",
        borderRadius: 12,
        background: "oklch(0.74 0.17 53)",
        fontSize: 13,
        fontWeight: 700,
        color: "oklch(0.14 0.03 260)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}>
        Ver Histórico
      </div>
    </div>
  );
}
