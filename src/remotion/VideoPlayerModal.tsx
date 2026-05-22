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

// Encontra o elemento interno da composição Remotion (sem CSS scale aplicado)
function findCompositionEl(container: HTMLElement, cW: number, cH: number): HTMLElement {
  const all = container.querySelectorAll("*");
  for (const el of Array.from(all)) {
    const h = el as HTMLElement;
    if (h.style.width === `${cW}px` && h.style.height === `${cH}px`) {
      return h;
    }
  }
  return container;
}

async function captureFrame(
  container: HTMLElement,
  cW: number,
  cH: number,
  outW: number,
  outH: number,
): Promise<HTMLCanvasElement> {
  const { toPng } = await import("html-to-image");
  // Captura o elemento interno em resolução nativa (sem CSS transform)
  const el = findCompositionEl(container, cW, cH);
  const dataUrl = await toPng(el, { pixelRatio: 1, cacheBust: false });
  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((res) => { img.onload = () => res(); });
  const c = document.createElement("canvas");
  c.width = outW;
  c.height = outH;
  c.getContext("2d")!.drawImage(img, 0, 0, img.width, img.height, 0, 0, outW, outH);
  return c;
}

function loadGifJs(): Promise<new (opts: Record<string, unknown>) => {
  addFrame(c: HTMLCanvasElement, opts: Record<string, unknown>): void;
  render(): void;
  on(e: "finished", cb: (b: Blob) => void): void;
}> {
  return new Promise((resolve, reject) => {
    if ((window as Record<string, unknown>).GIF) {
      resolve((window as Record<string, unknown>).GIF as never);
      return;
    }
    const s = document.createElement("script");
    s.src = "/gif.js";
    s.onload = () => resolve((window as Record<string, unknown>).GIF as never);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function buildGif(
  container: HTMLElement,
  player: PlayerRef,
  durationInFrames: number,
  fps: number,
  cW: number,
  cH: number,
  onProgress: (n: number) => void,
): Promise<Blob> {
  const GIF = await loadGifJs();

  // GIF a 540×960 (9:16 Stories) — resolução adequada para Instagram/WhatsApp
  const outW = 540;
  const outH = Math.round((outW * cH) / cW);

  const frameCount = 20;
  const step = Math.max(1, Math.floor(durationInFrames / frameCount));
  const delay = Math.round((step / fps) * 1000);

  const gif = new GIF({ workers: 2, quality: 8, width: outW, height: outH, workerScript: "/gif.worker.js" });

  player.pause();
  for (let i = 0; i < frameCount; i++) {
    player.seekTo(i * step);
    await new Promise((r) => setTimeout(r, 80));
    const canvas = await captureFrame(container, cW, cH, outW, outH);
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const generate = async (): Promise<Blob | null> => {
    if (!containerRef.current || !playerRef.current) return null;
    setGenerating(true);
    setProgress(0);
    setErrorMsg(null);
    try {
      const blob = await buildGif(
        containerRef.current,
        playerRef.current,
        durationInFrames,
        fps,
        compositionWidth,
        compositionHeight,
        setProgress,
      );
      setProgress(100);
      return blob;
    } catch (e) {
      console.error("gif error", e);
      setErrorMsg("Falha ao gerar GIF. Tente novamente.");
      return null;
    } finally {
      playerRef.current?.play();
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    const blob = await generate();
    if (!blob) return;
    const file = new File([blob], "3dbodyscanner.gif", { type: "image/gif" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "3D Body Scanner", text: shareText });
      } else {
        triggerDownload(blob, "3dbodyscanner.gif");
      }
    } catch (e: unknown) {
      if ((e as Error)?.name !== "AbortError") {
        triggerDownload(blob, "3dbodyscanner.gif");
      }
    }
  };

  const handleDownload = async () => {
    const blob = await generate();
    if (blob) triggerDownload(blob, "3dbodyscanner.gif");
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

        {/* Player preview */}
        <div
          ref={containerRef}
          style={{
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(34,211,238,0.15)",
            maxHeight: "60vh",
            aspectRatio: `${compositionWidth}/${compositionHeight}`,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Player
            ref={playerRef}
            component={composition}
            inputProps={inputProps}
            durationInFrames={durationInFrames}
            fps={fps}
            compositionWidth={compositionWidth}
            compositionHeight={compositionHeight}
            style={{ width: "100%", height: "100%" }}
            autoPlay
            loop
          />
        </div>

        {generating && (
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", height: 6 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#22d3ee,#3b82f6)", transition: "width 0.3s", borderRadius: 8 }} />
          </div>
        )}

        {errorMsg && (
          <p style={{ fontSize: 12, color: "#f87171", textAlign: "center", fontFamily: "sans-serif", margin: 0 }}>
            {errorMsg}
          </p>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleShare}
            disabled={generating}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: generating ? "rgba(34,211,238,0.3)" : "linear-gradient(135deg,#22d3ee,#3b82f6)", border: "none", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 700, color: "#060b14", cursor: generating ? "wait" : "pointer", fontFamily: "sans-serif" }}
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
            {generating ? `Gerando… ${progress}%` : shareLabel}
          </button>
          <button
            onClick={handleDownload}
            disabled={generating}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px", color: "#94a3b8", cursor: generating ? "wait" : "pointer" }}
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          </button>
        </div>

        <p style={{ fontSize: 11, color: "rgba(148,163,184,0.4)", textAlign: "center", fontFamily: "sans-serif", margin: 0 }}>
          {formatLabel}
        </p>
      </div>
    </div>
  );
}
