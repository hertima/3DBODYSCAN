import { useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { X, Share2, Loader2 } from "lucide-react";
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
    if ((window as unknown as Record<string, unknown>).GIF) {
      resolve((window as unknown as Record<string, unknown>).GIF as never);
      return;
    }
    const s = document.createElement("script");
    s.src = "/gif.js";
    s.onload = () => resolve((window as unknown as Record<string, unknown>).GIF as never);
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

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
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
  formatLabel = "GIF animado · Stories 9:16 · Instagram · WhatsApp",
  shareText = "Minha evolução no 3D Body Scanner 🏋️",
}: VideoPlayerModalProps) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [readyBlob, setReadyBlob] = useState<Blob | null>(null);

  if (!open) return null;

  const handleGenerate = async () => {
    if (!containerRef.current || !playerRef.current) return;
    setGenerating(true);
    setProgress(0);
    setErrorMsg(null);
    setReadyBlob(null);
    try {
      const blob = await buildGif(
        containerRef.current, playerRef.current,
        durationInFrames, fps, compositionWidth, compositionHeight, setProgress,
      );
      setReadyBlob(blob);
    } catch (e) {
      console.error("gif error", e);
      setErrorMsg("Falha ao gerar GIF. Tente novamente.");
    } finally {
      playerRef.current?.play();
      setGenerating(false);
    }
  };

  // Chamado em gesto direto do utilizador — sem async antes do share
  const handleShare = async () => {
    if (!readyBlob) return;
    const file = new File([readyBlob], "3dbodyscanner.gif", { type: "image/gif" });
    try {
      await navigator.share({ files: [file], title: "3D Body Scanner", text: shareText });
    } catch (e: unknown) {
      if ((e as Error)?.name !== "AbortError") {
        setErrorMsg("Não foi possível compartilhar. Tente outro app.");
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.96)",
        display: "flex", flexDirection: "column",
        fontFamily: "sans-serif",
      }}
      onClick={!generating ? onClose : undefined}
    >
      {/* Barra superior */}
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{title}</span>
        <button
          onClick={onClose}
          disabled={generating}
          style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "8px", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Player — ocupa todo o espaço disponível */}
      <div
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "0 12px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={containerRef}
          style={{
            height: "100%",
            aspectRatio: `${compositionWidth}/${compositionHeight}`,
            maxWidth: "100%",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 0 60px rgba(34,211,238,0.18)",
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
            autoPlay loop
          />
        </div>
      </div>

      {/* Área inferior — botões */}
      <div
        style={{ flexShrink: 0, padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: 10 }}
        onClick={(e) => e.stopPropagation()}
      >
        {generating && (
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", height: 5 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#22d3ee,#3b82f6)", transition: "width 0.3s", borderRadius: 8 }} />
          </div>
        )}

        {errorMsg && (
          <p style={{ fontSize: 12, color: "#f87171", textAlign: "center", margin: 0 }}>{errorMsg}</p>
        )}

        {!readyBlob ? (
          /* Passo 1: gerar */
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: generating ? "rgba(34,211,238,0.15)" : "linear-gradient(135deg,#22d3ee,#3b82f6)",
              border: generating ? "1px solid rgba(34,211,238,0.3)" : "none",
              borderRadius: 16, padding: "20px",
              fontSize: 17, fontWeight: 700,
              color: generating ? "#22d3ee" : "#060b14",
              cursor: generating ? "default" : "pointer",
            }}
          >
            {generating ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />}
            {generating ? `Gerando… ${progress}%` : shareLabel}
          </button>
        ) : (
          /* Passo 2: compartilhar (gesto direto → iOS aceita) */
          <button
            onClick={handleShare}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: "linear-gradient(135deg,#4ade80,#22d3ee)",
              border: "none", borderRadius: 16, padding: "20px",
              fontSize: 17, fontWeight: 700, color: "#060b14",
              cursor: "pointer",
            }}
          >
            <Share2 size={20} />
            Compartilhar agora
          </button>
        )}

        <p style={{ fontSize: 11, color: "rgba(148,163,184,0.3)", textAlign: "center", margin: 0 }}>
          {readyBlob ? "GIF pronto! Toque para abrir o menu de compartilhar" : formatLabel}
        </p>
      </div>
    </div>
  );
}
