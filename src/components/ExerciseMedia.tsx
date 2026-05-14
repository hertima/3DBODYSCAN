import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Anchor,
  Dumbbell,
  Flame,
  Hexagon,
  Mountain,
  Target,
  Wind,
  Zap,
} from "lucide-react";
import { getExerciseGifUrl } from "@/data/exercise-gif-map";
import { getExercise, type MuscleGroup } from "@/data/library";
import { cn } from "@/lib/utils";

type Size = "thumb" | "card" | "hero";

type Props = {
  exerciseId: string;
  size?: Size;
  className?: string;
  muscle?: MuscleGroup;
  src?: string;
};

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"] as const;

const muscleStyle: Record<
  MuscleGroup,
  { grad: string; ring: string; Icon: typeof Dumbbell; short: string }
> = {
  Peito: {
    grad: "from-orange-500/30 via-rose-500/20 to-transparent",
    ring: "ring-orange-500/40",
    Icon: Flame,
    short: "PEITO",
  },
  Costas: {
    grad: "from-cyan-500/30 via-blue-500/20 to-transparent",
    ring: "ring-cyan-400/40",
    Icon: Mountain,
    short: "COSTAS",
  },
  Ombros: {
    grad: "from-amber-400/30 via-orange-500/20 to-transparent",
    ring: "ring-amber-400/40",
    Icon: Wind,
    short: "OMBROS",
  },
  Biceps: {
    grad: "from-violet-500/30 via-fuchsia-500/20 to-transparent",
    ring: "ring-violet-400/40",
    Icon: Dumbbell,
    short: "BICEPS",
  },
  Triceps: {
    grad: "from-pink-500/30 via-rose-500/20 to-transparent",
    ring: "ring-pink-400/40",
    Icon: Zap,
    short: "TRICEPS",
  },
  Pernas: {
    grad: "from-emerald-500/30 via-teal-500/20 to-transparent",
    ring: "ring-emerald-400/40",
    Icon: Activity,
    short: "PERNAS",
  },
  Gluteos: {
    grad: "from-fuchsia-500/30 via-pink-500/20 to-transparent",
    ring: "ring-fuchsia-400/40",
    Icon: Hexagon,
    short: "GLUTEOS",
  },
  Core: {
    grad: "from-yellow-400/30 via-orange-500/20 to-transparent",
    ring: "ring-yellow-400/40",
    Icon: Target,
    short: "CORE",
  },
  Antebraco: {
    grad: "from-sky-500/30 via-cyan-500/20 to-transparent",
    ring: "ring-sky-400/40",
    Icon: Anchor,
    short: "ANTEBRACO",
  },
  "Full Body": {
    grad: "from-orange-500/30 via-cyan-500/20 to-transparent",
    ring: "ring-primary/40",
    Icon: Flame,
    short: "FULL BODY",
  },
};

export function ExerciseMedia({ exerciseId, size = "card", className, muscle, src }: Props) {
  const exercise = getExercise(exerciseId);
  const target = muscle ?? exercise?.muscle ?? "Core";
  const mappedMediaSrc = getExerciseGifUrl(exerciseId, exercise?.name);
  const mediaSrc = src ?? exercise?.gifUrl ?? mappedMediaSrc ?? `/exercises/${exerciseId}.gif`;
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isVideo = VIDEO_EXTENSIONS.some((extension) => mediaSrc.toLowerCase().endsWith(extension));

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const radius = size === "thumb" ? "rounded-xl" : size === "card" ? "rounded-2xl" : "rounded-3xl";
  const aspect = size === "thumb" ? "aspect-square" : "aspect-[4/3]";
  const style = muscleStyle[target] ?? muscleStyle.Core;
  const Icon = style.Icon;

  return (
    <div ref={containerRef} className={cn("relative isolate overflow-hidden bg-elevated", radius, aspect, className)}>
      {visible && !failed &&
        (isVideo ? (
          <video
            src={mediaSrc}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <img
            src={mediaSrc}
            alt={exercise?.name ?? "Exercicio"}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ))}

      {failed && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-elevated to-background" />
          <div className={cn("absolute inset-0 bg-gradient-to-br", style.grad)} />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <motion.div
            aria-hidden
            className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-60 blur-3xl"
            style={{ background: "oklch(0.74 0.17 53 / 0.5)" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {size === "thumb" ? (
            <div className="absolute inset-0 grid place-items-center">
              <Icon className="h-7 w-7 text-primary drop-shadow-[0_0_8px_oklch(0.74_0.17_53/0.6)]" />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between p-3">
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "rounded-full bg-background/60 px-2 py-0.5 text-[9px] font-bold tracking-[0.2em] text-foreground/90 ring-1 backdrop-blur",
                    style.ring,
                  )}
                >
                  {style.short}
                </span>
                <span className="font-display text-[9px] font-black tracking-[0.3em] text-muted-foreground/70">
                  3D Body Scan
                </span>
              </div>
              <motion.div
                className="grid place-items-center"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  className={cn(
                    "grid h-14 w-14 place-items-center rounded-xl bg-background/40 ring-1 backdrop-blur-sm",
                    style.ring,
                  )}
                >
                  <Icon
                    className="h-7 w-7 text-primary drop-shadow-[0_0_10px_oklch(0.74_0.17_53/0.7)]"
                    strokeWidth={1.8}
                  />
                </div>
              </motion.div>
              <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                {exercise?.equipment ?? "--"}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
