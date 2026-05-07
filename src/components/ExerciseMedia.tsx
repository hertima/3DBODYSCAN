import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Activity, Flame, Zap, Mountain, Hexagon, Anchor, Wind, Target } from "lucide-react";
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

const muscleStyle: Record<MuscleGroup, { grad: string; ring: string; Icon: typeof Dumbbell; short: string }> = {
  Peito:     { grad: "from-orange-500/30 via-rose-500/20 to-transparent",    ring: "ring-orange-500/40", Icon: Flame,    short: "PEITO" },
  Costas:    { grad: "from-cyan-500/30 via-blue-500/20 to-transparent",      ring: "ring-cyan-400/40",   Icon: Mountain, short: "COSTAS" },
  Ombros:    { grad: "from-amber-400/30 via-orange-500/20 to-transparent",   ring: "ring-amber-400/40",  Icon: Wind,     short: "OMBROS" },
  Bíceps:    { grad: "from-violet-500/30 via-fuchsia-500/20 to-transparent", ring: "ring-violet-400/40", Icon: Dumbbell, short: "BÍCEPS" },
  Tríceps:   { grad: "from-pink-500/30 via-rose-500/20 to-transparent",      ring: "ring-pink-400/40",   Icon: Zap,      short: "TRÍCEPS" },
  Pernas:    { grad: "from-emerald-500/30 via-teal-500/20 to-transparent",   ring: "ring-emerald-400/40",Icon: Activity, short: "PERNAS" },
  Glúteos:   { grad: "from-fuchsia-500/30 via-pink-500/20 to-transparent",   ring: "ring-fuchsia-400/40",Icon: Hexagon,  short: "GLÚTEOS" },
  Core:      { grad: "from-yellow-400/30 via-orange-500/20 to-transparent",  ring: "ring-yellow-400/40", Icon: Target,   short: "CORE" },
  Antebraço: { grad: "from-sky-500/30 via-cyan-500/20 to-transparent",       ring: "ring-sky-400/40",    Icon: Anchor,   short: "ANTEBRAÇO" },
  "Full Body": { grad: "from-orange-500/30 via-cyan-500/20 to-transparent",  ring: "ring-primary/40",    Icon: Flame,    short: "FULL BODY" },
};

export function ExerciseMedia({ exerciseId, size = "card", className, muscle, src }: Props) {
  const ex = getExercise(exerciseId);
  const target = muscle ?? ex?.muscle ?? "Full Body";
  const gifSrc = src ?? ex?.gifUrl ?? `/exercises/${exerciseId}.gif`;
  const [failed, setFailed] = useState(false);

  const radius = size === "thumb" ? "rounded-xl" : size === "card" ? "rounded-2xl" : "rounded-3xl";
  const aspect = size === "thumb" ? "aspect-square" : size === "card" ? "aspect-[4/5]" : "aspect-[4/3]";
  const style = muscleStyle[target] ?? muscleStyle["Full Body"];
  const Icon = style.Icon;

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-elevated",
        radius,
        aspect,
        className,
      )}
    >
      {!failed && (
        <img
          src={gifSrc}
          alt={ex?.name ?? "Exercício"}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {failed && (
        <>
          {/* base dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-elevated to-background" />
          {/* muscle accent gradient */}
          <div className={cn("absolute inset-0 bg-gradient-to-br", style.grad)} />
          {/* subtle grid pattern */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {/* glow blob */}
          <motion.div
            aria-hidden
            className={cn("absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl opacity-60")}
            style={{ background: "oklch(0.74 0.17 53 / 0.5)" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {size === "thumb" ? (
            <div className="absolute inset-0 grid place-items-center">
              <Icon className="h-7 w-7 text-primary drop-shadow-[0_0_8px_oklch(0.74_0.17_53/0.6)]" />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <div className="flex items-start justify-between">
                <span className={cn("rounded-full bg-background/60 px-2 py-0.5 text-[9px] font-bold tracking-[0.2em] text-foreground/90 ring-1 backdrop-blur", style.ring)}>
                  {style.short}
                </span>
                <span className="font-display text-[9px] font-black tracking-[0.3em] text-muted-foreground/70">ZYROX</span>
              </div>
              <motion.div
                className="grid place-items-center"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className={cn("grid h-20 w-20 place-items-center rounded-2xl bg-background/40 ring-1 backdrop-blur-sm", style.ring)}>
                  <Icon className="h-10 w-10 text-primary drop-shadow-[0_0_12px_oklch(0.74_0.17_53/0.7)]" strokeWidth={1.6} />
                </div>
              </motion.div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">
                {ex?.equipment ?? "—"}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
