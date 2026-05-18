import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import logo from "@/assets/zyrox-logo.png";

export function SplashComposition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ fps, frame, from: 0.4, to: 1, durationInFrames: 30, config: { damping: 14, stiffness: 120 } });
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const textOpacity = interpolate(frame, [28, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY = interpolate(frame, [28, 48], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const taglineOpacity = interpolate(frame, [50, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [50, 68], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const glowOpacity = interpolate(frame, [20, 60, 110, 140], [0, 0.7, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fadeOut = interpolate(frame, [120, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
        gap: 20,
        opacity: fadeOut,
        fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, oklch(0.74 0.17 53 / 0.25) 0%, transparent 70%)",
          opacity: glowOpacity,
          filter: "blur(40px)",
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          width: 80,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={logo} alt="Zyrox" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>

      {/* ZYROX wordmark */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: "0.25em",
          color: "oklch(0.98 0.01 250)",
          textTransform: "uppercase",
        }}
      >
        ZYROX
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.3em",
          color: "oklch(0.74 0.17 53)",
          textTransform: "uppercase",
        }}
      >
        3D Body Scan
      </div>
    </div>
  );
}
