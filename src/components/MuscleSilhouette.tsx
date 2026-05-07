import type { MuscleGroup } from "@/data/library";
import { cn } from "@/lib/utils";

type Props = {
  muscle: MuscleGroup;
  className?: string;
  /** Paint highlights in dark-friendly orange vs white-bg orange */
  variant?: "light" | "dark";
};

/**
 * Front-view human silhouette with selectable muscle highlight.
 * Uses simple geometric paths — clean, minimal, ZYROX-styled.
 */
export function MuscleSilhouette({ muscle, className, variant = "light" }: Props) {
  const base = variant === "light" ? "fill-slate-200" : "fill-elevated";
  const stroke = variant === "light" ? "stroke-slate-400" : "stroke-border";
  const hi = "fill-[oklch(0.74_0.17_53)]"; // primary orange
  const dim = "fill-transparent";

  const on = (m: MuscleGroup | MuscleGroup[]) =>
    (Array.isArray(m) ? m.includes(muscle) : m === muscle) ? hi : dim;
  const fullBody = muscle === "Full Body" ? hi : dim;

  return (
    <svg
      viewBox="0 0 200 320"
      className={cn("h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base silhouette */}
      <g className={cn(base, stroke)} strokeWidth={1}>
        {/* Head */}
        <circle cx="100" cy="28" r="18" />
        {/* Neck */}
        <rect x="92" y="44" width="16" height="10" />
        {/* Torso */}
        <path d="M60 60 Q100 50 140 60 L150 160 Q100 175 50 160 Z" />
        {/* Arms */}
        <path d="M60 62 Q40 100 38 150 L48 152 Q54 105 70 70 Z" />
        <path d="M140 62 Q160 100 162 150 L152 152 Q146 105 130 70 Z" />
        {/* Forearms */}
        <path d="M38 150 Q34 195 36 230 L48 230 Q52 195 48 152 Z" />
        <path d="M162 150 Q166 195 164 230 L152 230 Q148 195 152 152 Z" />
        {/* Pelvis */}
        <path d="M55 160 Q100 175 145 160 L140 195 Q100 205 60 195 Z" />
        {/* Thighs */}
        <path d="M62 195 Q70 250 76 280 L94 280 Q98 245 96 198 Z" />
        <path d="M138 195 Q130 250 124 280 L106 280 Q102 245 104 198 Z" />
        {/* Calves */}
        <path d="M76 280 Q72 305 78 318 L92 318 Q96 300 94 280 Z" />
        <path d="M124 280 Q128 305 122 318 L108 318 Q104 300 106 280 Z" />
      </g>

      {/* Highlights overlay */}
      <g>
        {/* Peito */}
        <path d="M68 75 Q100 70 132 75 L128 110 Q100 118 72 110 Z"
          className={cn("transition-colors", on("Peito") || fullBody)} />
        {/* Ombros */}
        <ellipse cx="58" cy="72" rx="14" ry="10" className={cn(on("Ombros") || fullBody)} />
        <ellipse cx="142" cy="72" rx="14" ry="10" className={cn(on("Ombros") || fullBody)} />
        {/* Bíceps */}
        <path d="M44 95 Q40 130 50 145 L62 142 Q60 110 56 90 Z"
          className={cn(on("Bíceps") || fullBody)} />
        <path d="M156 95 Q160 130 150 145 L138 142 Q140 110 144 90 Z"
          className={cn(on("Bíceps") || fullBody)} />
        {/* Tríceps (lateral inner) */}
        <path d="M50 100 Q46 130 52 145 L58 144 Q56 115 54 100 Z"
          className={cn(on("Tríceps") || fullBody)} opacity={0.85} />
        <path d="M150 100 Q154 130 148 145 L142 144 Q144 115 146 100 Z"
          className={cn(on("Tríceps") || fullBody)} opacity={0.85} />
        {/* Antebraço */}
        <path d="M40 160 Q36 200 40 225 L48 225 Q50 195 48 158 Z"
          className={cn(on("Antebraço") || fullBody)} />
        <path d="M160 160 Q164 200 160 225 L152 225 Q150 195 152 158 Z"
          className={cn(on("Antebraço") || fullBody)} />
        {/* Core (abs) */}
        <rect x="86" y="115" width="28" height="50" rx="6"
          className={cn(on("Core") || fullBody)} />
        {/* Costas (visible as upper back hint behind torso) */}
        <path d="M70 60 Q100 56 130 60 L128 90 Q100 95 72 90 Z"
          className={cn(on("Costas") || fullBody)} opacity={0.6} />
        {/* Pernas (quads) */}
        <path d="M66 200 Q72 245 78 278 L92 278 Q96 245 94 202 Z"
          className={cn(on("Pernas") || fullBody)} />
        <path d="M134 200 Q128 245 122 278 L108 278 Q104 245 106 202 Z"
          className={cn(on("Pernas") || fullBody)} />
        {/* Glúteos */}
        <path d="M70 175 Q100 188 130 175 L128 200 Q100 208 72 200 Z"
          className={cn(on("Glúteos") || fullBody)} />
      </g>
    </svg>
  );
}
