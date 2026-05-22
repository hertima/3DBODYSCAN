import { useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { X, Share2, Download, Loader2 } from "lucide-react";
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
  shareLabel?: string;
  formatLabel?: string;
  shareText?: string;
}

async function captureCanvas(el: HTMLElement, w: number, h: number): Promise<HTMLCanvasElement> {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(el, { pixelRatio: 1, cacheBust: false });
  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((res) => { img.onload = () => res(); });
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  c.getContext("2d")!.drawImage(img, 0, 0, w, h);
  return c;
}

async function buildGif(
  containerEl: HTMLElement,
  player: PlayerRef,
  durationInFrames: number,
  fps: number,
  onProgress: (n: number) => void,
): Promise<Blob> {
  // gif.worker.js está em /public/gif.worker.js — sem new URL() para não quebrar SSR
  const GIF = (await import("gif.js")).default;
  const w = containerEl.offsetWidth;
  const h = containerEl.offsetHeight;
  const frameCount = 20;
  const step = Math.max(1, Math.floor(durationInFrames / frameCount));
  const delay = Math.round((step / fps) * 1000);

  const gif = new GIF({ workers: 2, quality: 8, width: w, height: h, workerScript: "/gif.worker.js" });

  player.pause();
  for (let i = 0; i < frameCount; i++) {
    player.seekTo(i * step);
    await new Promise((r) => setTimeout(r, 80));
    const canvas = await captureCanvas(containerEl, w, h);
    gif.addFrame(canvas, { delay, copy: true });
    onProgress(Math.round(((i + 1) / frameCount) * 90));
  }

  return new Promise((resolve) => {
    gif.on("finished", (blob: Blob) => resolve(blob));
    gif.render();
  });
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
  title = "Compartilhar",
  shareLabel = "Compartilhar GIF",
  formatLabel = "GIF animado · pronto para Instagram e WhatsApp",
  shareText = "Minha evolução no 3D Body Scanner 🏋️",
}: VideoPlayerModalProps) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState(false);

  if (!open) return null;

  const generate = async (): Promise<Blob | null> => {
    if (!containerRef.current || !playerRef.current) return null;
    setGenerating(true);
    setProgress(0);
    try {
      const blob = await buildGif(containerRef.current, playerRef.current, durationInFrames, fps, setProgress);
      setProgress(100);
      return blob;
    } catch (e) {
      console.error("gif error", e);
      return null;
    } finally {
      playerRef.current?.play();
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    const blob = await generate();
    if (!blob) return;
    const file = new File([blob], "treino-3dbodyscanner.gif", { type: "image/gif" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "3D Body Scanner", text: shareText });
      } else {
        triggerDownload(blob, "treino-3dbodyscanner.gif");
      }
    } catch {}
  };

  const handleDownload = async () => {
    const blob = await generate();
    if (blob) triggerDownload(blob, "treino-3dbodyscanner.gif");
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={!generating ? onClose : undefined}
    >
      <div
        style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", fontFamily: "sans-serif" }}>{title}</span>
          <button onClick={onClose} disabled={generating} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "6px 8px", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}>
            <X size={18} />
          </button>
        </div>

        <div ref={containerRef} style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 0 40px rgba(34,211,238,0.15)", maxHeight: "60vh", aspectRatio: `${compositionWidth}/${compositionHeight}`, margin: "0 auto" }}>
          <Player
            ref={playerRef}
            component={composition}
            inputProps={inputProps}
            durationInFrames={durationInFrames}
            fps={fps}
            compositionWidth={compositionWidth}
            compositionHeight={compositionHeight}
            style={{ width: "100%", height: "100%" }}
            controls autoPlay loop
          />
        </div>

        {generating && (
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", height: 6 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#22d3ee,#3b82f6)", transition: "width 0.3s", borderRadius: 8 }} />
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleShare} disabled={generating}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: generating ? "rgba(34,211,238,0.3)" : "linear-gradient(135deg,#22d3ee,#3b82f6)", border: "none", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 700, color: "#060b14", cursor: generating ? "wait" : "pointer", fontFamily: "sans-serif" }}
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
            {generating ? `Gerando… ${progress}%` : shareLabel}
          </button>
          <button
            onClick={handleDownload} disabled={generating}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px", color: "#94a3b8", cursor: generating ? "wait" : "pointer" }}
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          </button>
        </div>

        <p style={{ fontSize: 11, color: "rgba(148,163,184,0.4)", textAlign: "center", fontFamily: "sans-serif", margin: 0 }}>{formatLabel}</p>
      </div>
    </div>
  );
}
