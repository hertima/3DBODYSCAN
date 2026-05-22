import { useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { X, Share2, Download, Loader2, Film } from "lucide-react";
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

// Encontra o elemento interno da composição Remotion (sem CSS scale)
function findCompositionEl(container: HTMLElement, cW: number, cH: number): HTMLElement {
  const all = container.querySelectorAll("*");
  for (const el of Array.from(all)) {
    const h = el as HTMLElement;
    if (h.style.width === `${cW}px` && h.style.height === `${cH}px`) return h;
  }
  // Fallback: procura pelo filho do elemento com transform:scale
  const scaled = container.querySelector('[style*="scale"]') as HTMLElement | null;
  if (scaled?.firstElementChild) return scaled.firstElementChild as HTMLElement;
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
  const el = findCompositionEl(container, cW, cH);
  const dataUrl = await toPng(el, { pixelRatio: 1, cacheBust: false });
  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((res) => { img.onload = () => res(); });
  const c = document.createElement("canvas");
  c.width = outW; c.height = outH;
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

// GIF melhorado: 30 frames, qualidade 3 (cores fiéis), 540×960 Stories
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
  const outW = 540;
  const outH = Math.round((outW * cH) / cW);
  const frameCount = 30;
  const step = Math.max(1, Math.floor(durationInFrames / frameCount));
  const delay = Math.round((step / fps) * 1000);

  const gif = new GIF({ workers: 2, quality: 3, width: outW, height: outH, workerScript: "/gif.worker.js" });

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

// Vídeo: MediaRecorder (MP4 no iOS 14.3+ / WebM no Android)
function getVideoMimeType(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  for (const t of ["video/mp4;codecs=avc1", "video/webm;codecs=vp9", "video/webm"]) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return null;
}

async function buildVideo(
  container: HTMLElement,
  player: PlayerRef,
  durationInFrames: number,
  fps: number,
  cW: number,
  cH: number,
  onProgress: (n: number) => void,
): Promise<Blob> {
  const mimeType = getVideoMimeType();
  if (!mimeType) throw new Error("Vídeo não suportado neste navegador");

  const outW = 540;
  const outH = Math.round((outW * cH) / cW);

  const canvas = document.createElement("canvas");
  canvas.width = outW; canvas.height = outH;
  const ctx = canvas.getContext("2d")!;

  // Precisa pintar algo no canvas ANTES de criar o captureStream
  player.pause();
  player.seekTo(0);
  await new Promise((r) => setTimeout(r, 120));
  const firstFrame = await captureFrame(container, cW, cH, outW, outH);
  ctx.drawImage(firstFrame, 0, 0);

  const stream = canvas.captureStream(30);

  // Cria MediaRecorder com fallback sem codec específico
  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType });
  } catch {
    recorder = new MediaRecorder(stream);
  }

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
  recorder.start(100);

  const frameCount = 25;
  const step = Math.max(1, Math.floor(durationInFrames / frameCount));
  const frameDurationMs = Math.round((step / fps) * 1000);

  for (let i = 0; i < frameCount; i++) {
    player.seekTo(i * step);
    await new Promise((r) => setTimeout(r, 80));
    const frame = await captureFrame(container, cW, cH, outW, outH);
    ctx.drawImage(frame, 0, 0);
    await new Promise((r) => setTimeout(r, frameDurationMs));
    onProgress(Math.round(((i + 1) / frameCount) * 90));
  }

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      if (chunks.length === 0) { reject(new Error("Nenhum frame gravado")); return; }
      resolve(new Blob(chunks, { type: recorder.mimeType || mimeType }));
    };
    recorder.stop();
  });
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function shareOrDownload(blob: Blob, filename: string, shareText: string) {
  const file = new File([blob], filename, { type: blob.type });
  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "3D Body Scanner", text: shareText });
      return;
    }
  } catch (e: unknown) {
    if ((e as Error)?.name === "AbortError") return;
  }
  triggerDownload(blob, filename);
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
  formatLabel,
  shareText = "Minha evolução no 3D Body Scanner 🏋️",
}: VideoPlayerModalProps) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState<"gif" | "video" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const videoMimeType = getVideoMimeType();
  const videoExt = videoMimeType?.startsWith("video/mp4") ? "mp4" : "webm";

  const runGenerate = async (mode: "gif" | "video"): Promise<Blob | null> => {
    if (!containerRef.current || !playerRef.current) return null;
    setGenerating(mode);
    setProgress(0);
    setErrorMsg(null);
    try {
      const blob = mode === "gif"
        ? await buildGif(containerRef.current, playerRef.current, durationInFrames, fps, compositionWidth, compositionHeight, setProgress)
        : await buildVideo(containerRef.current, playerRef.current, durationInFrames, fps, compositionWidth, compositionHeight, setProgress);
      setProgress(100);
      return blob;
    } catch (e) {
      console.error(`${mode} error`, e);
      setErrorMsg(`Falha ao gerar ${mode.toUpperCase()}. Tente novamente.`);
      return null;
    } finally {
      playerRef.current?.play();
      setGenerating(null);
    }
  };

  const handleGif = async () => {
    const blob = await runGenerate("gif");
    if (blob) await shareOrDownload(blob, "3dbodyscanner.gif", shareText);
  };

  const handleVideo = async () => {
    const blob = await runGenerate("video");
    if (blob) await shareOrDownload(blob, `3dbodyscanner.${videoExt}`, shareText);
  };

  const handleDownload = async () => {
    const blob = await runGenerate("gif");
    if (blob) triggerDownload(blob, "3dbodyscanner.gif");
  };

  const isGenerating = generating !== null;
  const label = isGenerating
    ? `Gerando ${generating?.toUpperCase()}… ${progress}%`
    : shareLabel;

  const fmt = formatLabel ?? (videoMimeType
    ? "GIF · Vídeo Stories · Instagram · WhatsApp"
    : "GIF animado · pronto para Instagram e WhatsApp");

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={!isGenerating ? onClose : undefined}
    >
      <div
        style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", fontFamily: "sans-serif" }}>{title}</span>
          <button onClick={onClose} disabled={isGenerating} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "6px 8px", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}>
            <X size={18} />
          </button>
        </div>

        {/* Player preview */}
        <div
          ref={containerRef}
          style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 0 40px rgba(34,211,238,0.15)", maxHeight: "60vh", aspectRatio: `${compositionWidth}/${compositionHeight}`, margin: "0 auto", width: "100%" }}
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
            autoPlay loop
          />
        </div>

        {/* Progress */}
        {isGenerating && (
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", height: 6 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: generating === "video" ? "linear-gradient(90deg,#a78bfa,#3b82f6)" : "linear-gradient(90deg,#22d3ee,#3b82f6)", transition: "width 0.3s", borderRadius: 8 }} />
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <p style={{ fontSize: 12, color: "#f87171", textAlign: "center", fontFamily: "sans-serif", margin: 0 }}>{errorMsg}</p>
        )}

        {/* Botões */}
        <div style={{ display: "flex", gap: 10 }}>
          {/* GIF */}
          <button
            onClick={handleGif}
            disabled={isGenerating}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: isGenerating && generating === "gif" ? "rgba(34,211,238,0.3)" : "linear-gradient(135deg,#22d3ee,#3b82f6)", border: "none", borderRadius: 14, padding: "13px 10px", fontSize: 13, fontWeight: 700, color: "#060b14", cursor: isGenerating ? "wait" : "pointer", fontFamily: "sans-serif" }}
          >
            {isGenerating && generating === "gif" ? <Loader2 size={15} className="animate-spin" /> : <Share2 size={15} />}
            {isGenerating && generating === "gif" ? label : "Compartilhar GIF"}
          </button>

          {/* Vídeo (se suportado) */}
          {videoMimeType && (
            <button
              onClick={handleVideo}
              disabled={isGenerating}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: isGenerating && generating === "video" ? "rgba(167,139,250,0.3)" : "linear-gradient(135deg,#a78bfa,#ec4899)", border: "none", borderRadius: 14, padding: "13px 10px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: isGenerating ? "wait" : "pointer", fontFamily: "sans-serif" }}
            >
              {isGenerating && generating === "video" ? <Loader2 size={15} className="animate-spin" /> : <Film size={15} />}
              {isGenerating && generating === "video" ? label : `Vídeo ${videoExt.toUpperCase()}`}
            </button>
          )}

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "13px 14px", color: "#94a3b8", cursor: isGenerating ? "wait" : "pointer" }}
          >
            {isGenerating ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
          </button>
        </div>

        <p style={{ fontSize: 11, color: "rgba(148,163,184,0.35)", textAlign: "center", fontFamily: "sans-serif", margin: 0 }}>{fmt}</p>
      </div>
    </div>
  );
}
