import { AbsoluteFill } from "remotion";

export function GradientBackground({ variant = "dark" }: { variant?: "dark" | "corpo" | "workout" | "analytics" }) {
  const gradients: Record<string, string> = {
    dark: "radial-gradient(ellipse at 20% 20%, rgba(34,211,238,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(251,146,60,0.18) 0%, transparent 50%), linear-gradient(135deg, #060b14 0%, #0a0f1e 100%)",
    corpo: "radial-gradient(ellipse at 30% 30%, rgba(34,211,238,0.22) 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(59,130,246,0.18) 0%, transparent 55%), linear-gradient(135deg, #060b14 0%, #0d1322 100%)",
    workout: "radial-gradient(ellipse at 50% 10%, rgba(251,146,60,0.25) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(34,211,238,0.15) 0%, transparent 50%), linear-gradient(180deg, #060b14 0%, #0a0f1e 100%)",
    analytics: "radial-gradient(ellipse at 20% 50%, rgba(167,139,250,0.2) 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, rgba(34,211,238,0.15) 0%, transparent 55%), linear-gradient(135deg, #060b14 0%, #0a0f1e 100%)",
  };

  return (
    <AbsoluteFill style={{ background: gradients[variant] }} />
  );
}
