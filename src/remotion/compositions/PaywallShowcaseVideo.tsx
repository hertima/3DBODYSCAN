import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { BrandOverlay } from "../components/BrandOverlay";

export interface PaywallShowcaseVideoProps {
  planName?: string;
}

const FEATURES = [
  { icon: "🤖", title: "IA Treinador", desc: "Plano personalizado com dados reais" },
  { icon: "📷", title: "3D Body Scanner", desc: "Análise corporal por câmera" },
  { icon: "📊", title: "Analytics", desc: "Progresso e equilíbrio muscular" },
  { icon: "🍽️", title: "Nutrição IA", desc: "Calorias e macros automáticos" },
  { icon: "🎯", title: "12 Semanas", desc: "Periodização profissional" },
  { icon: "🔥", title: "Gamificação", desc: "XP, streaks e conquistas" },
];

// Layout (1080×1920):
// 0–90    BrandOverlay top
// 90–530  Hero: mascote + título
// 530–1750 Features (6 itens flex, sem espaço vazio)
// 1750–1840 CTA
// 1840–1920 BrandOverlay bottom
const FEATURES_TOP = 530;
const FEATURES_BOTTOM = 1750;
const FEATURES_GAP = 14;
const ITEM_HEIGHT = (FEATURES_BOTTOM - FEATURES_TOP - FEATURES_GAP * (FEATURES.length - 1)) / FEATURES.length;

export function PaywallShowcaseVideo({ planName = "Pro" }: PaywallShowcaseVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mascoteScale = spring({ frame, fps, config: { damping: 11, stiffness: 90 } });
  const headerOpacity = interpolate(frame, [8, 25], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: "sans-serif" }}>
      <GradientBackground variant="dark" />
      <BrandOverlay position="top" />

      {/* Hero: mascote grande + título */}
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ transform: `scale(${mascoteScale})` }}>
          <img
            src="/MASCOTE SEM FUNDO.png"
            style={{
              width: 320, height: 320, objectFit: "contain",
              filter: "drop-shadow(0 0 50px rgba(34,211,238,0.55)) drop-shadow(0 0 25px rgba(251,146,60,0.45))",
            }}
          />
        </div>
        <div style={{ opacity: headerOpacity, textAlign: "center", marginTop: 4 }}>
          <div style={{ fontSize: 13, color: "rgba(148,163,184,0.55)", letterSpacing: 5, textTransform: "uppercase" }}>
            Plano {planName}
          </div>
          <div style={{
            fontSize: 36, fontWeight: 900, letterSpacing: -1, marginTop: 4,
            background: "linear-gradient(90deg,#22d3ee,#ffffff,#fb923c)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            3D Body Scanner
          </div>
        </div>
      </div>

      {/* Features: preenchem todo o espaço entre o hero e o CTA */}
      {FEATURES.map((f, i) => {
        const top = FEATURES_TOP + i * (ITEM_HEIGHT + FEATURES_GAP);
        const fOpacity = interpolate(frame, [18 + i * 7, 34 + i * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fX = interpolate(frame, [18 + i * 7, 34 + i * 7], [28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            position: "absolute", top, left: 48, right: 48,
            height: ITEM_HEIGHT,
            opacity: fOpacity, transform: `translateX(${fX}px)`,
            display: "flex", alignItems: "center", gap: 24,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 24, padding: "0 28px",
            boxSizing: "border-box",
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20, flexShrink: 0,
              background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36,
            }}>
              {f.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", lineHeight: 1.2 }}>{f.title}</div>
              <div style={{ fontSize: 17, color: "rgba(148,163,184,0.65)", marginTop: 6 }}>{f.desc}</div>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#22d3ee", fontSize: 22, fontWeight: 900,
            }}>✓</div>
          </div>
        );
      })}

      {/* CTA */}
      <Sequence from={75}>
        <div style={{ position: "absolute", top: FEATURES_BOTTOM + 10, left: 48, right: 48 }}>
          <div style={{
            background: "linear-gradient(135deg,#22d3ee,#3b82f6)",
            borderRadius: 22, padding: "22px", textAlign: "center",
            boxShadow: "0 0 40px rgba(34,211,238,0.3)",
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#060b14", letterSpacing: 0.5 }}>
              Comece sua transformação
            </div>
          </div>
        </div>
      </Sequence>

      <BrandOverlay position="bottom" />
    </AbsoluteFill>
  );
}
