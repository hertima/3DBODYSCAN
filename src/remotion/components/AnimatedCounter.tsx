import { interpolate, useCurrentFrame } from "remotion";

interface AnimatedCounterProps {
  from: number;
  to: number;
  startFrame: number;
  endFrame: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
}

export function AnimatedCounter({ from, to, startFrame, endFrame, decimals = 0, suffix = "", prefix = "", style }: AnimatedCounterProps) {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <span style={style}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
}
