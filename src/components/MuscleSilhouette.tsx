import { useState, type KeyboardEvent } from "react";
import type { MuscleGroup } from "@/data/library";
import { cn } from "@/lib/utils";

type Props = {
  muscle: MuscleGroup;
  className?: string;
  variant?: "light" | "dark";
  onSelect?: (muscle: MuscleGroup) => void;
};

export function MuscleSilhouette({ muscle, className, variant = "light", onSelect }: Props) {
  const [hovered, setHovered] = useState<MuscleGroup | null>(null);
  const isInteractive = !!onSelect;
  const activeMuscle = hovered ?? muscle;
  const isDark = variant === "dark";
  const bodyFill = isDark ? "url(#bodyDepthDark)" : "url(#bodyDepthLight)";
  const bodyStroke = isDark ? "rgba(148,163,184,0.22)" : "rgba(51,65,85,0.22)";

  const getPartProps = (target: MuscleGroup) => {
    const selected = muscle === target || muscle === "Full Body";
    const active = selected || hovered === target;

    return {
      className: cn(
        "transition-all duration-200 ease-out outline-none",
        isInteractive && "cursor-pointer",
      ),
      fill: active ? "url(#activeHeat)" : "transparent",
      stroke: active ? "rgba(255,255,255,0.72)" : "transparent",
      strokeWidth: active ? 0.75 : 0,
      filter: active ? "url(#activeGlow)" : undefined,
      opacity: active ? 1 : 0,
      onClick: isInteractive ? () => onSelect(target) : undefined,
      onPointerEnter: isInteractive ? () => setHovered(target) : undefined,
      onPointerLeave: isInteractive ? () => setHovered(null) : undefined,
      tabIndex: isInteractive ? 0 : undefined,
      role: isInteractive ? "button" : undefined,
      "aria-label": isInteractive ? target : undefined,
      onKeyDown: isInteractive
        ? (event: KeyboardEvent<SVGElement>) => {
            if (event.key === "Enter" || event.key === " ") onSelect(target);
          }
        : undefined,
    };
  };

  return (
    <svg
      viewBox="0 0 260 340"
      className={cn("h-full w-full select-none", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="stageGlow" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.12" />
          <stop offset="58%" stopColor="#1d4ed8" stopOpacity="0.035" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bodyDepthDark" x1="68" y1="34" x2="188" y2="318" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22324f" />
          <stop offset="44%" stopColor="#152238" />
          <stop offset="100%" stopColor="#0e1729" />
        </linearGradient>
        <linearGradient id="bodyDepthLight" x1="68" y1="34" x2="188" y2="318" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="52%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="activeHeat" x1="78" y1="88" x2="182" y2="142" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffb15f" />
          <stop offset="58%" stopColor="#ff7a1f" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <filter id="activeGlow" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 1  0 0.42 0 0 0.34  0 0 0.1 0 0  0 0 0 0.92 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bodyShadow" x="-35%" y="-25%" width="170%" height="155%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#020617" floodOpacity="0.55" />
        </filter>
        <pattern id="scanGrid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M 26 0 L 0 0 0 26" fill="none" stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect x="10" y="10" width="240" height="320" rx="28" fill="rgba(2,6,23,0.18)" />
      <rect x="10" y="10" width="240" height="320" rx="28" fill="url(#scanGrid)" />
      <circle cx="130" cy="162" r="122" fill="url(#stageGlow)" />
      <path d="M38 82 H222" stroke="rgba(34,211,238,0.08)" />
      <path d="M38 258 H222" stroke="rgba(251,146,60,0.08)" />

      <g filter="url(#bodyShadow)" strokeLinecap="round" strokeLinejoin="round">
        <g fill={bodyFill} stroke={bodyStroke} strokeWidth="1.2">
          <circle cx="130" cy="47" r="17" />
          <path d="M119 64 H141 V77 H119 Z" />
          <path d="M84 87 Q130 72 176 87 L188 162 Q130 180 72 162 Z" />
          <path d="M80 90 Q62 128 58 196 L72 198 Q78 137 94 96 Z" />
          <path d="M180 90 Q198 128 202 196 L188 198 Q182 137 166 96 Z" />
          <path d="M58 196 Q54 242 58 288 L72 288 Q78 238 72 198 Z" />
          <path d="M202 196 Q206 242 202 288 L188 288 Q182 238 188 198 Z" />
          <path d="M76 162 Q130 182 184 162 L176 207 Q130 220 84 207 Z" />
          <path d="M86 207 Q92 257 101 297 H119 Q124 252 122 211 Z" />
          <path d="M174 207 Q168 257 159 297 H141 Q136 252 138 211 Z" />
          <path d="M101 297 Q97 321 103 333 H118 Q122 314 119 297 Z" />
          <path d="M159 297 Q163 321 157 333 H142 Q138 314 141 297 Z" />
        </g>

        <g fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="1">
          <path d="M92 91 Q130 106 168 91" />
          <path d="M80 164 Q130 176 180 164" />
          <path d="M98 205 Q130 215 162 205" />
          <path d="M130 76 V214" />
          <path d="M102 120 Q130 130 158 120" />
        </g>

        <g>
          <path d="M89 102 Q130 94 171 102 L165 135 Q130 144 95 135 Z" {...getPartProps("Peito")} />
          <path d="M106 138 H154 L150 182 Q130 190 110 182 Z" {...getPartProps("Core")} />
          <path d="M84 86 Q130 76 176 86 L170 112 Q130 122 90 112 Z" {...getPartProps("Costas")} />
          <ellipse cx="80" cy="91" rx="17" ry="12" {...getPartProps("Ombros")} />
          <ellipse cx="180" cy="91" rx="17" ry="12" {...getPartProps("Ombros")} />
          <path d="M66 124 Q62 162 72 188 L86 184 Q84 145 78 116 Z" {...getPartProps("Bíceps")} />
          <path d="M194 124 Q198 162 188 188 L174 184 Q176 145 182 116 Z" {...getPartProps("Bíceps")} />
          <path d="M74 126 Q72 166 82 188 L91 184 Q87 148 83 124 Z" {...getPartProps("Tríceps")} />
          <path d="M186 126 Q188 166 178 188 L169 184 Q173 148 177 124 Z" {...getPartProps("Tríceps")} />
          <path d="M62 204 Q58 246 62 283 L72 283 Q76 240 72 202 Z" {...getPartProps("Antebraço")} />
          <path d="M198 204 Q202 246 198 283 L188 283 Q184 240 188 202 Z" {...getPartProps("Antebraço")} />
          <path d="M90 211 Q96 258 103 293 H118 Q121 253 119 214 Z" {...getPartProps("Pernas")} />
          <path d="M170 211 Q164 258 157 293 H142 Q139 253 141 214 Z" {...getPartProps("Pernas")} />
          <path d="M92 188 Q130 204 168 188 L164 215 Q130 225 96 215 Z" {...getPartProps("Glúteos")} />
        </g>

        {(muscle === "Full Body" || activeMuscle === "Full Body") && (
          <path
            d="M84 87 Q130 72 176 87 L188 162 Q130 180 72 162 Z M76 162 Q130 182 184 162 L176 207 Q130 220 84 207 Z"
            fill="url(#activeHeat)"
            opacity="0.34"
            filter="url(#activeGlow)"
          />
        )}
      </g>

      <g className="pointer-events-none">
        <path d="M42 62 H72" stroke="rgba(34,211,238,0.35)" />
        <path d="M188 62 H218" stroke="rgba(251,146,60,0.28)" />
        <circle cx="130" cy="47" r="23" fill="none" stroke="rgba(34,211,238,0.12)" />
        <path d="M54 46 C78 32 104 25 130 25 C156 25 182 32 206 46" fill="none" stroke="rgba(255,255,255,0.055)" />
        <rect x="92" y="101" width="76" height="39" rx="14" fill="none" stroke="rgba(255,255,255,0.08)" />
        <path d="M36 168 H224" stroke="rgba(34,211,238,0.09)" strokeDasharray="4 8" />
      </g>
    </svg>
  );
}
