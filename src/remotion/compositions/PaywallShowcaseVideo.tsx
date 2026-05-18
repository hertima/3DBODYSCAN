import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { BrandOverlay } from "../components/BrandOverlay";

export interface PaywallShowcaseVideoProps {
  planName?: string;
}

const FEATURES = [
  { icon: "🤖", title: "IA Treinador", desc: "Plano personalizado com dados reais" },
  { icon: "📷", title: "3D Body Scan", desc: "Análise corporal por câmera" },
  { icon: "📊", title: "Analytics", desc: "Progresso e equilíbrio muscular" },
  { icon: "🍽️", title: "Nutrição IA", desc: "Calorias e macros automáticos" },
  { icon: "🎯", title: "12 Semanas", desc: "Periodização profissional" },
  { icon: "🔥", title: "Gamificação", desc: "XP, streaks e conquistas" },
];

export function PaywallShowcaseVideo({ planName = "Pro" }: PaywallShowcaseVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 11, stiffness: 90 } });
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: "sans-serif" }}>
      <GradientBackground variant="dark" />
      <BrandOverlay position="top" />

      {/* Hero */}
      <div style={{ position: "absolute", top: 145, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ transform: `scale(${logoScale})`, marginBottom: 12 }}>
          <img
            src="/MASCOTE 05.png"
            style={{
              width: 380, height: 380, objectFit: "contain",
              filter: "drop-shadow(0 0 60px rgba(34,211,238,0.5)) drop-shadow(0 0 30px rgba(251,146,60,0.4))",
            }}
          />
        </div>

        <div style={{ opacity: titleOpacity, textAlign: "center" }}>
          <div style={{ fontSize: 15, color: "rgba(148,163,184,0.6)", letterSpacing: 4, textTransform: "uppercase" }}>Plano {planName}</div>
          <div style={{
            fontSize: 40, fontWeight: 900, letterSpacing: -1, marginTop: 6,
            background: "linear-gradient(90deg,#22d3ee,#ffffff,#fb923c)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            3D Body Scan
          </div>
          <div style={{ fontSize: 15, color: "rgba(148,163,184,0.5)", marginTop: 8 }}>
            Treine como um atleta profissional
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ position: "absolute", top: 350, left: 48, right: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FEATURES.map((f, i) => {
            const fOpacity = interpolate(frame, [25 + i * 10, 45 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const fX = interpolate(frame, [25 + i * 10, 45 + i * 10], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const fScale = spring({ frame: frame - 25 - i * 10, fps, config: { damping: 14, stiffness: 130 } });

            return (
              <div key={i} style={{
                opacity: fOpacity, transform: `translateX(${fX}px) scale(${fScale})`,
                display: "flex", alignItems: "center", gap: 18,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18, padding: "14px 18px",
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 14,
                  background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(148,163,184,0.55)", marginTop: 2 }}>{f.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", color: "#22d3ee", fontSize: 18 }}>✓</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <Sequence from={100}>
        <div style={{ position: "absolute", bottom: 130, left: 48, right: 48 }}>
          <div style={{
            background: "linear-gradient(135deg,#22d3ee,#3b82f6)",
            borderRadius: 20, padding: "18px", textAlign: "center",
            boxShadow: "0 0 40px rgba(34,211,238,0.3)",
          }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#060b14", letterSpacing: 1 }}>
              Comece sua transformação
            </div>
          </div>
        </div>
      </Sequence>

      <BrandOverlay position="bottom" />
    </AbsoluteFill>
  );
}
