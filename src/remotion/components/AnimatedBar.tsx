import { interpolate, useCurrentFrame } from "remotion";

interface AnimatedBarProps {
  pct: number;
  startFrame: number;
  color: string;
  height?: number;
  borderRadius?: number;
  style?: React.CSSProperties;
}

export function AnimatedBar({ pct, startFrame, color, height = 8, borderRadius = 999, style }: AnimatedBarProps) {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [startFrame, startFrame + 40], [0, Math.min(100, pct)], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <div style={{ width: "100%", height, borderRadius, background: "rgba(255,255,255,0.08)", overflow: "hidden", ...style }}>
      <div style={{
        width: `${width}%`,
        height: "100%",
        borderRadius,
        background: color,
        boxShadow: `0 0 12px ${color}60`,
        transition: "none",
      }} />
    </div>
  );
}
