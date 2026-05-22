import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export function BrandOverlay({ position = "bottom" }: { position?: "top" | "bottom" }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const style: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    opacity,
    ...(position === "bottom"
      ? { bottom: 60, paddingBottom: 0 }
      : { top: 60, paddingTop: 0 }),
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={style}>
        {/* Logo real do app */}
        <img
          src="/logo favicton 3D Body Scan.png"
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            boxShadow: "0 0 24px rgba(34,211,238,0.5), 0 0 8px rgba(251,146,60,0.3)",
          }}
        />
        <span style={{
          fontFamily: "sans-serif",
          fontWeight: 900,
          fontSize: 26,
          background: "linear-gradient(90deg, #22d3ee, #ffffff, #fb923c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: -0.5,
        }}>
          3D Body Scanner
        </span>
      </div>
    </AbsoluteFill>
  );
}
