import { useEffect, useState } from "react";
import logo from "@/assets/zyrox-logo.png";

type Props = {
  onFinish?: () => void;
};

export function SplashScreen({ onFinish }: Props) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"), 1000);
    const t3 = setTimeout(() => onFinish?.(), 1350);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "var(--background, #070B14)",
        opacity: phase === "out" ? 0 : 1,
        pointerEvents: phase === "out" ? "none" : undefined,
        transition: phase === "out" ? "opacity 0.35s ease" : "none",
      }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,211,238,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: phase === "in" ? 0 : 1,
          transform: phase === "in" ? "scale(0.75)" : "scale(1)",
          transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        <div className="relative">
          <div
            className="absolute inset-0 rounded-3xl blur-2xl"
            style={{
              background: "linear-gradient(135deg,rgba(34,211,238,0.5),rgba(251,146,60,0.5))",
              transform: "scale(1.3)",
            }}
          />
          <img
            src={logo}
            alt="3D Body Scanner"
            className="relative h-28 w-28 rounded-2xl"
            style={{
              boxShadow: "0 0 0 1px rgba(34,211,238,0.3), 0 8px 32px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      </div>

      {/* Nome */}
      <p
        className="mt-5 text-sm font-semibold tracking-widest text-muted-foreground"
        style={{
          opacity: phase === "in" ? 0 : 1,
          transition: "opacity 0.4s ease 0.15s",
        }}
      >
        3D BODY SCANNER
      </p>
    </div>
  );
}
