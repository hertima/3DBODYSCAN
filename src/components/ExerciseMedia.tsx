import { useState } from "react";
import { motion } from "framer-motion";
import { getExercise, type MuscleGroup } from "@/data/library";
import { MuscleSilhouette } from "./MuscleSilhouette";
import { cn } from "@/lib/utils";

type Size = "thumb" | "card" | "hero";

type Props = {
  exerciseId: string;
  size?: Size;
  className?: string;
  /** Override default muscle (when not derived from exercise id) */
  muscle?: MuscleGroup;
  /** Override gif path */
  src?: string;
};

/**
 * Renders an exercise animation. Tries to load /exercises/{id}.gif (or `src`);
 * falls back to a ZYROX-styled animated silhouette with the target muscle highlighted.
 */
export function ExerciseMedia({ exerciseId, size = "card", className, muscle, src }: Props) {
  const ex = getExercise(exerciseId);
  const targetMuscle = muscle ?? ex?.muscle ?? "Full Body";
  const gifSrc = src ?? ex?.gifUrl ?? `/exercises/${exerciseId}.gif`;
  const [failed, setFailed] = useState(false);

  const radius = size === "thumb" ? "rounded-xl" : size === "card" ? "rounded-2xl" : "rounded-3xl";
  const aspect = size === "thumb" ? "aspect-square" : size === "card" ? "aspect-square" : "aspect-[4/3]";

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden",
        radius,
        aspect,
        size === "thumb" ? "bg-white" : "bg-white",
        className,
      )}
    >
      {/* Real gif if available */}
      {!failed && (
        <img
          src={gifSrc}
          alt={ex?.name ?? "Exercício"}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Placeholder */}
      {failed && (
        <>
          {/* subtle radial */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 110%, oklch(0.74 0.17 53 / 0.18) 0%, transparent 60%)",
            }}
          />
          {/* watermark */}
          {size !== "thumb" && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="select-none font-display text-[28%] font-black uppercase tracking-[0.3em] text-slate-200/80">
                ZYROX
              </span>
            </div>
          )}
          {/* silhouette */}
          <motion.div
            className="absolute inset-0 grid place-items-center p-2"
            animate={size === "thumb" ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <MuscleSilhouette muscle={targetMuscle} variant="light" />
          </motion.div>
          {/* glow pulse */}
          {size !== "thumb" && (
            <motion.div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3"
              style={{
                background:
                  "linear-gradient(to top, oklch(0.74 0.17 53 / 0.25), transparent)",
              }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </>
      )}
    </div>
  );
}
