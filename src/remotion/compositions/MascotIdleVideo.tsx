import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export interface MascotIdleVideoProps {
  src?: string;
}

const LOOP = 120; // 4s a 30fps

// Loop com a mascote flutuando, brilho pulsante e uma linha de scan varrendo de cima a baixo.
export function MascotIdleVideo({ src = "/mascote-hero.webp" }: MascotIdleVideoProps) {
  const frame = useCurrentFrame() % LOOP;

  const floatY = Math.sin((frame / LOOP) * Math.PI * 2) * 18;
  const tilt = Math.sin((frame / LOOP) * Math.PI * 2) * 2;
  const glow = interpolate(Math.sin((frame / LOOP) * Math.PI * 2), [-1, 1], [0.4, 0.85]);

  const scanProgress = (frame % LOOP) / LOOP; // 0 → 1
  const scanY = interpolate(scanProgress, [0, 1], [-10, 110]);
  const scanOpacity = interpolate(scanProgress, [0, 0.08, 0.85, 1], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${floatY}px) rotate(${tilt}deg)`,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: `drop-shadow(0 0 ${40 + glow * 50}px rgba(34,211,238,${glow})) drop-shadow(0 0 ${30 + glow * 35}px rgba(251,146,60,${glow * 0.8}))`,
            }}
          />
          {/* Linha de scan */}
          <div
            style={{
              position: "absolute",
              left: "6%",
              right: "6%",
              top: `${scanY}%`,
              height: 6,
              opacity: scanOpacity,
              background: "linear-gradient(90deg, transparent, #22d3ee, #fb923c, transparent)",
              boxShadow: "0 0 24px 6px rgba(34,211,238,0.7)",
              borderRadius: 999,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
}
