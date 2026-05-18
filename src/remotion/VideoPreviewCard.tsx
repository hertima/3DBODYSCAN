import { useState, type ComponentType } from "react";
import { Player } from "@remotion/player";
import { Play, Share2 } from "lucide-react";
import { VideoPlayerModal } from "./VideoPlayerModal";

interface VideoPreviewCardProps {
  composition: ComponentType<Record<string, unknown>>;
  inputProps: Record<string, unknown>;
  durationInFrames?: number;
  fps?: number;
  title?: string;
  label?: string;
  previewFrame?: number;
}

export function VideoPreviewCard({
  composition,
  inputProps,
  durationInFrames = 450,
  fps = 30,
  title = "Compartilhar vídeo",
  label,
  previewFrame = 45,
}: VideoPreviewCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setModalOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: hovered
            ? "0 0 40px rgba(34,211,238,0.3), 0 8px 32px rgba(0,0,0,0.6)"
            : "0 0 24px rgba(34,211,238,0.1), 0 4px 16px rgba(0,0,0,0.5)",
          transition: "box-shadow 0.25s ease, transform 0.2s ease",
          transform: hovered ? "scale(1.015)" : "scale(1)",
          border: "1px solid rgba(34,211,238,0.2)",
          aspectRatio: "9/16",
          width: "100%",
        }}
      >
        {/* Remotion preview — frame estático */}
        <Player
          component={composition}
          inputProps={inputProps}
          durationInFrames={durationInFrames}
          fps={fps}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{ width: "100%", height: "100%" }}
          initialFrame={previewFrame}
          autoPlay={false}
          controls={false}
          clickToPlay={false}
          loop={false}
        />

        {/* Overlay gradiente */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(6,11,20,0.85) 0%, rgba(6,11,20,0.1) 50%, transparent 100%)",
            transition: "background 0.25s ease",
          }}
        />

        {/* Botão Play central */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: hovered
                ? "rgba(34,211,238,0.95)"
                : "rgba(34,211,238,0.75)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: hovered
                ? "0 0 32px rgba(34,211,238,0.8)"
                : "0 0 16px rgba(34,211,238,0.4)",
              transition: "all 0.2s ease",
              transform: hovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            <Play
              size={28}
              fill="#060b14"
              color="#060b14"
              style={{ marginLeft: 3 }}
            />
          </div>
        </div>

        {/* Label inferior */}
        {label && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#e2e8f0",
                fontFamily: "sans-serif",
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
              }}
            >
              {label}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(34,211,238,0.15)",
                border: "1px solid rgba(34,211,238,0.3)",
                borderRadius: 10,
                padding: "6px 10px",
                color: "#22d3ee",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "sans-serif",
              }}
            >
              <Share2 size={12} /> Compartilhar
            </div>
          </div>
        )}
      </div>

      <VideoPlayerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        composition={composition}
        inputProps={inputProps}
        durationInFrames={durationInFrames}
        fps={fps}
        title={title}
      />
    </>
  );
}
