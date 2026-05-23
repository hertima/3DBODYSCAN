import { useEffect, useRef, useState } from "react";

type Props = {
  exerciseCount: number;
  durationMinutes: number;
  calories: number;
  workoutName: string;
  onFinish?: () => void;
};

const COLORS = ["#22d3ee", "#a78bfa", "#f59e0b", "#34d399", "#f97316", "#ec4899", "#3b82f6"];

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pieces = Array.from({ length: 90 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: Math.random() * 9 + 4,
      h: Math.random() * 5 + 3,
      color: COLORS[i % COLORS.length],
      rot: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 2.5 + 1.2,
      vr: (Math.random() - 0.5) * 0.12,
      alpha: 0.7 + Math.random() * 0.3,
    }));

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

function useCountUp(target: number, duration = 1200, delay = 400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(target * ease));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return value;
}

export function WorkoutCompleteAnimation({ exerciseCount, durationMinutes, calories, workoutName, onFinish }: Props) {
  const [visible, setVisible] = useState(false);
  const dur = useCountUp(durationMinutes, 1000, 600);
  const exs = useCountUp(exerciseCount, 1000, 750);
  const cal = useCountUp(calories, 1200, 900);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 60);
    const t2 = setTimeout(() => onFinish?.(), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
      style={{ background: "oklch(0.11 0.04 262 / 0.97)", backdropFilter: "blur(16px)" }}
    >
      <ConfettiCanvas />

      {/* Glow radial de fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse,rgba(34,211,238,0.12) 0%,transparent 70%)" }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full"
          style={{ background: "radial-gradient(ellipse,rgba(251,146,60,0.10) 0%,transparent 70%)" }} />
      </div>

      {/* Conteúdo central */}
      <div
        className="relative z-10 flex flex-col items-center gap-7 px-6 text-center transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)" }}
      >
        {/* Anel animado com ícone */}
        <div className="relative flex items-center justify-center">
          {/* Anel externo pulsante */}
          <div className="absolute h-36 w-36 rounded-full animate-ping opacity-10"
            style={{ background: "conic-gradient(#22d3ee,#a78bfa,#f59e0b,#22d3ee)", animationDuration: "2s" }} />
          {/* Anel principal */}
          <div className="h-28 w-28 rounded-full flex items-center justify-center"
            style={{
              background: "conic-gradient(from 180deg,#22d3ee 0%,#a78bfa 40%,#f59e0b 70%,#22d3ee 100%)",
              padding: "3px",
              filter: "drop-shadow(0 0 24px rgba(34,211,238,0.5))"
            }}>
            <div className="h-full w-full rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.14 0.04 262)" }}>
              <span style={{ fontSize: 44 }}>🏆</span>
            </div>
          </div>
        </div>

        {/* Título */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary mb-2">Treino concluído</p>
          <h1
            className="font-display text-3xl font-black leading-tight"
            style={{ background: "linear-gradient(135deg,#22d3ee,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {workoutName}
          </h1>
        </div>

        {/* Stats em card glassmorphism */}
        <div
          className="flex gap-0 rounded-2xl overflow-hidden border"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}
        >
          {[
            { value: dur, label: "min", color: "#22d3ee" },
            { value: exs, label: "exercícios", color: "#a78bfa" },
            { value: cal, label: "kcal", color: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center px-7 py-4"
              style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : undefined }}>
              <span className="font-display text-3xl font-black" style={{ color: s.color }}>{s.value}</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: `${s.color}80` }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Barra de progresso — conta regressiva visual */}
        <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-none"
            style={{
              width: visible ? "100%" : "0%",
              background: "linear-gradient(90deg,#22d3ee,#a78bfa)",
              transition: "width 3.8s linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}
