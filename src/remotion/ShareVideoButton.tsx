import { useState, type ComponentType } from "react";
import { Share2 } from "lucide-react";
import { VideoPlayerModal } from "./VideoPlayerModal";
import { cn } from "@/lib/utils";

interface ShareVideoButtonProps {
  composition: ComponentType<Record<string, unknown>>;
  inputProps: Record<string, unknown>;
  durationInFrames?: number;
  fps?: number;
  title?: string;
  label?: string;
  shareLabel?: string;
  formatLabel?: string;
  variant?: "primary" | "ghost" | "icon";
  className?: string;
}

export function ShareVideoButton({
  composition,
  inputProps,
  durationInFrames = 450,
  fps = 30,
  title = "Compartilhar vídeo",
  label = "Compartilhar",
  shareLabel,
  formatLabel,
  variant = "ghost",
  className,
}: ShareVideoButtonProps) {
  const [open, setOpen] = useState(false);

  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 600,
    fontSize: 13,
    border: "none",
    transition: "opacity 0.2s",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg,#22d3ee,#3b82f6)",
      color: "#060b14",
      borderRadius: 12,
      padding: "10px 18px",
    },
    ghost: {
      background: "rgba(34,211,238,0.08)",
      border: "1px solid rgba(34,211,238,0.25)",
      color: "#22d3ee",
      borderRadius: 12,
      padding: "8px 14px",
    },
    icon: {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#94a3b8",
      borderRadius: 10,
      padding: "8px",
    },
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ ...baseStyles, ...variantStyles[variant] }}
        className={className}
      >
        <Share2 size={14} />
        {variant !== "icon" && label}
      </button>

      <VideoPlayerModal
        open={open}
        onClose={() => setOpen(false)}
        composition={composition}
        inputProps={inputProps}
        durationInFrames={durationInFrames}
        fps={fps}
        title={title}
        shareLabel={shareLabel}
        formatLabel={formatLabel}
      />
    </>
  );
}
