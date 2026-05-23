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
  shareText?: string;
}

async function imgToDataUrl(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const fresh = new Image();
    fresh.crossOrigin = "anonymous";
    fresh.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = fresh.naturalWidth || 1;
        c.height = fresh.naturalHeight || 1;
        c.getContext("2d")!.drawImage(fresh, 0, 0);
        resolve(c.toDataURL());
      } catch { resolve(null); }
    };
    fresh.onerror = () => resolve(null);
    const sep = src.includes("?") ? "&" : "?";
    fresh.src = src + sep + "_cb=" + Date.now();
  });
}

async function inlineImages(container: HTMLElement): Promise<() => void> {
  const imgs = Array.from(container.querySelectorAll("img")) as HTMLImageElement[];
  const origSrcs: string[] = [];
  const origFilters: string[] = [];
  await Promise.all(imgs.map(async (img, i) => {
    origSrcs[i] = img.src;
    origFilters[i] = img.style.filter;
    img.style.filter = "none"; // CSS filter no SVG foreignObject não renderiza em todos os browsers
    if (!img.src || img.src.startsWith("data:")) return;
    if (!img.complete || img.naturalWidth === 0) {
      await new Promise<void>((resolve) => {
        const t = setTimeout(resolve, 4000);
        img.addEventListener("load", () => { clearTimeout(t); resolve(); }, { once: true });
        img.addEventListener("error", () => { clearTimeout(t); resolve(); }, { once: true });
      });
    }
    if (img.naturalWidth === 0) return;
    try {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext("2d")!.drawImage(img, 0, 0);
      img.src = c.toDataURL();
      await new Promise((r) => setTimeout(r, 60));
    } catch {
      const dataUrl = await imgToDataUrl(origSrcs[i]);
      if (dataUrl) { img.src = dataUrl; await new Promise((r) => setTimeout(r, 60)); }
    }
  }));
  return () => imgs.forEach((img, i) => {
    if (origSrcs[i]) img.src = origSrcs[i];
    img.style.filter = origFilters[i] ?? "";
  });
}

async function captureFrame(container: HTMLElement, outW: number, outH: number): Promise<HTMLCanvasElement> {
  const { toPng } = await import("html-to-image");
  const pixelRatio = Math.max(2, Math.ceil(outW / (container.offsetWidth || outW)));
  const dataUrl = await toPng(container, {
    pixelRatio,
    cacheBust: true,
    style: { borderRadius: "0", overflow: "hidden" },
    fetchRequestInit: { mode: "cors" as RequestMode, credentials: "omit" as RequestCredentials },
  });
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
  onProgress: (n: number) => void,
): Promise<Blob> {
  const GIF = await loadGifJs();
  const outW = 540; const outH = 960;
  const frameCount = 24;
  const step = Math.max(1, Math.floor(durationInFrames / frameCount));
  const delay = Math.round((step / fps) * 1000);
  const gif = new GIF({ workers: 2, quality: 4, width: outW, height: outH, workerScript: "/gif.worker.js" });
  player.pause();
  for (let i = 0; i < frameCount; i++) {
    player.seekTo(i * step);
    await new Promise((r) => setTimeout(r, 300));
    const canvas = await captureFrame(container, outW, outH);
    gif.addFrame(canvas, { delay, copy: true });
    onProgress(Math.round(((i + 1) / frameCount) * 90));
  }
  return new Promise((resolve) => {
    gif.on("finished", (blob: Blob) => resolve(blob));
    gif.render();
  });
}

// PNG: captura o div interno do Remotion (tamanho nativo) sem o transform scale
async function buildPng(
  captureContainer: HTMLElement,
  capturePlayer: PlayerRef,
  durationInFrames: number,
  compositionWidth: number,
  compositionHeight: number,
): Promise<Blob> {
  const targetFrame = Math.floor(durationInFrames * 0.72);
  capturePlayer.pause();
  for (const f of [0, 90, targetFrame]) {
    capturePlayer.seekTo(f);
    await new Promise((r) => setTimeout(r, 400));
  }
  await new Promise((r) => setTimeout(r, 1500));

  // Localiza o div interno do Remotion Player (dimensões nativas + transform scale)
  const nativeW = `${compositionWidth}px`;
  const nativeH = `${compositionHeight}px`;
  let compositionEl: HTMLElement | null = null;
  for (const el of captureContainer.querySelectorAll<HTMLElement>("div")) {
    if (el.style.width === nativeW && el.style.height === nativeH && el.style.transform) {
      compositionEl = el;
      break;
    }
  }

  // Remove transform para capturar em tamanho nativo — CSS scale não funciona em SVG foreignObject
  const origTransform = compositionEl?.style.transform ?? "";
  if (compositionEl) compositionEl.style.transform = "none";
  await new Promise((r) => setTimeout(r, 80));

  const target = compositionEl ?? captureContainer;
  const restore = await inlineImages(target);

  const { toBlob } = await import("html-to-image");
  // pixelRatio 0.5 sobre 1080×1920 = canvas final 540×960
  const blob = await toBlob(target, {
    pixelRatio: compositionEl ? (540 / compositionWidth) : 2,
    cacheBust: true,
    style: { borderRadius: "0", overflow: "hidden" },
    fetchRequestInit: { mode: "cors" as RequestMode, credentials: "omit" as RequestCredentials },
  });

  restore();
  if (compositionEl) compositionEl.style.transform = origTransform;

  return blob ?? new Promise((resolve) => {
    const c = document.createElement("canvas"); c.width = 540; c.height = 960;
    c.toBlob((b) => resolve(b!), "image/png");
  });
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function VideoPlayerModal({
  open, onClose, composition, inputProps,
  durationInFrames = 450, fps = 30,
  compositionWidth = 1080, compositionHeight = 1920,
  title = "Compartilhar",
  shareLabel = "GIF · WhatsApp",
  shareText = "Minha evolução no 3D Body Scanner 🏋️",
}: VideoPlayerModalProps) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const capturePlayerRef = useRef<PlayerRef>(null);
  const captureContainerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<"gif" | "png" | null>(null);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [readyBlob, setReadyBlob] = useState<Blob | null>(null);

  if (!open) return null;

  const generate = async (type: "gif" | "png") => {
    setMode(type);
    setGenerating(true);
    setProgress(0);
    setErrorMsg(null);
    setReadyBlob(null);
    playerRef.current?.pause();
    try {
      let blob: Blob;
      if (type === "gif") {
        if (!containerRef.current || !playerRef.current) return;
        blob = await buildGif(containerRef.current, playerRef.current, durationInFrames, fps, setProgress);
      } else {
        if (!captureContainerRef.current || !capturePlayerRef.current) return;
        blob = await buildPng(captureContainerRef.current, capturePlayerRef.current, durationInFrames, compositionWidth, compositionHeight);
      }
      setReadyBlob(blob!);
    } catch (e) {
      console.error(e);
      setErrorMsg("Falha ao gerar. Tente novamente.");
    } finally {
      playerRef.current?.play();
      setGenerating(false);
    }
  };

  const share = async () => {
    if (!readyBlob || !mode) return;
    const isGif = mode === "gif";
    const file = new File([readyBlob], isGif ? "evolucao.gif" : "evolucao.png", { type: isGif ? "image/gif" : "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "3D Body Scanner", text: shareText });
      } else {
        triggerDownload(readyBlob, file.name);
      }
    } catch (e: unknown) {
      if ((e as Error)?.name !== "AbortError") triggerDownload(readyBlob, file.name);
    }
  };

  const btn: React.CSSProperties = {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    border: "none", borderRadius: 16, padding: "18px",
    fontSize: 16, fontWeight: 700, cursor: "pointer",
  };

  return (
    <>
      {/* Player oculto a 540×960 — usado exclusivamente para captura do PNG */}
      <div
        ref={captureContainerRef}
        style={{ position: "fixed", left: "-9999px", top: 0, width: 540, height: 960, overflow: "hidden", pointerEvents: "none", zIndex: -1 }}
      >
        <Player
          ref={capturePlayerRef}
          component={composition}
          inputProps={inputProps}
          durationInFrames={durationInFrames}
          fps={fps}
          compositionWidth={compositionWidth}
          compositionHeight={compositionHeight}
          style={{ width: "100%", height: "100%" }}
          initiallyMuted
        />
      </div>

      <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.96)", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }} onClick={!generating ? onClose : undefined}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{title}</span>
          <button onClick={onClose} disabled={generating} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "8px", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "0 12px" }} onClick={(e) => e.stopPropagation()}>
          <div ref={containerRef} style={{ height: "100%", aspectRatio: `${compositionWidth}/${compositionHeight}`, maxWidth: "100%", borderRadius: 20, overflow: "hidden", boxShadow: "0 0 60px rgba(34,211,238,0.18)" }}>
            <Player ref={playerRef} component={composition} inputProps={inputProps} durationInFrames={durationInFrames} fps={fps} compositionWidth={compositionWidth} compositionHeight={compositionHeight} style={{ width: "100%", height: "100%" }} autoPlay loop />
          </div>
        </div>

        <div style={{ flexShrink: 0, padding: "16px 20px 40px", display: "flex", flexDirection: "column", gap: 10 }} onClick={(e) => e.stopPropagation()}>

          {generating && (
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", height: 5 }}>
              <div style={{ height: "100%", width: `${mode === "gif" ? progress : 60}%`, background: "linear-gradient(90deg,#22d3ee,#3b82f6)", transition: "width 0.3s", borderRadius: 8 }} />
            </div>
          )}

          {errorMsg && <p style={{ fontSize: 12, color: "#f87171", textAlign: "center", margin: 0 }}>{errorMsg}</p>}

          {!readyBlob ? (
            <>
              <button onClick={() => generate("gif")} disabled={generating} style={{ ...btn, background: generating && mode === "gif" ? "rgba(34,211,238,0.12)" : "linear-gradient(135deg,#22d3ee,#3b82f6)", color: generating && mode === "gif" ? "#22d3ee" : "#060b14", border: generating && mode === "gif" ? "1px solid rgba(34,211,238,0.3)" : "none", cursor: generating ? "default" : "pointer" }}>
                {generating && mode === "gif" ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />}
                {generating && mode === "gif" ? `Gerando GIF… ${progress}%` : "GIF animado · WhatsApp"}
              </button>

              <button onClick={() => generate("png")} disabled={generating} style={{ ...btn, padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: generating && mode === "png" ? "#c084fc" : "#94a3b8", fontSize: 14, cursor: generating ? "default" : "pointer" }}>
                {generating && mode === "png" ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
                {generating && mode === "png" ? "Gerando imagem…" : "Imagem · Instagram / Stories"}
              </button>
            </>
          ) : (
            <button onClick={share} style={{ ...btn, background: "linear-gradient(135deg,#4ade80,#22d3ee)", color: "#060b14" }}>
              <Share2 size={20} />
              {mode === "gif" ? "Compartilhar GIF" : "Compartilhar imagem"}
            </button>
          )}

          <p style={{ fontSize: 11, color: "rgba(148,163,184,0.22)", textAlign: "center", margin: 0 }}>
            {readyBlob ? "Pronto · toque para abrir o menu" : "GIF animado para WhatsApp · Imagem para Instagram"}
          </p>
        </div>
      </div>
    </>
  );
}
