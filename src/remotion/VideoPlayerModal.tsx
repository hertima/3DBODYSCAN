import { Player } from "@remotion/player";
import { X, Share2, Download } from "lucide-react";
import { type ComponentType } from "react";

interface VideoPlayerModalProps {
  open: boolean;
  onClose: () => void;
  composition: ComponentType<Record<string, unknown>>;
  inputProps: Record<string, unknown>;
  durationInFrames?: number;
  fps?: number;
  compositionWidth?: number;
  compositionHeight?: number;
  title?: string;
}

export function VideoPlayerModal({
  open,
  onClose,
  composition,
  inputProps,
  durationInFrames = 450,
  fps = 30,
  compositionWidth = 1080,
  compositionHeight = 1920,
  title = "Compartilhar vídeo",
}: VideoPlayerModalProps) {
  if (!open) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "3D Body Scan", text: "Minha evolução no 3D Body Scan 🏋️" });
      } catch {}
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", fontFamily: "sans-serif" }}>{title}</span>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "6px 8px", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Player */}
        <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 0 40px rgba(34,211,238,0.15)" }}>
          <Player
            component={composition}
            inputProps={inputProps}
            durationInFrames={durationInFrames}
            fps={fps}
            compositionWidth={compositionWidth}
            compositionHeight={compositionHeight}
            style={{ width: "100%", aspectRatio: `${compositionWidth}/${compositionHeight}` }}
            controls
            autoPlay
            loop
          />
        </div>

        {/* Ações */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleShare}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "linear-gradient(135deg,#22d3ee,#3b82f6)",
              border: "none", borderRadius: 14, padding: "14px",
              fontSize: 14, fontWeight: 700, color: "#060b14", cursor: "pointer",
              fontFamily: "sans-serif",
            }}
          >
            <Share2 size={16} /> Compartilhar
          </button>
          <button
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14, padding: "14px 16px",
              fontSize: 14, color: "#94a3b8", cursor: "pointer",
            }}
          >
            <Download size={16} />
          </button>
        </div>

        <p style={{ fontSize: 11, color: "rgba(148,163,184,0.4)", textAlign: "center", fontFamily: "sans-serif", margin: 0 }}>
          Formato Story (9:16) · pronto para Instagram e WhatsApp
        </p>
      </div>
    </div>
  );
}
