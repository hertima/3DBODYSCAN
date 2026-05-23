import { useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { X, Share2, Loader2, Download } from "lucide-react";
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

// ─── helpers ──────────────────────────────────────────────────────────────────

async function toDataUrl(src: string, cors = false): Promise<string> {
  if (!src || src.startsWith("data:")) return src;
  try {
    const res = await fetch(src, { mode: cors ? "cors" : "same-origin" });
    if (res.ok) return blobToBase64(res.blob ? await res.blob() : new Blob());
  } catch { /* fallback */ }
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", src);
    if (cors) xhr.withCredentials = false;
    xhr.responseType = "blob";
    xhr.timeout = 8000;
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        blobToBase64(xhr.response as Blob).then(resolve).catch(() => resolve(""));
      } else resolve("");
    };
    xhr.onerror = () => resolve("");
    xhr.ontimeout = () => resolve("");
    xhr.send();
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

// ─── PNG: clone do elemento Remotion interno + data URLs ──────────────────────

async function buildPng(
  container: HTMLElement,
  player: PlayerRef,
  compositionWidth: number,
  compositionHeight: number,
): Promise<Blob> {
  // Seek para frame onde todos os elementos estão visíveis (mascote aparece em frame 82)
  player.pause();
  player.seekTo(130);
  await new Promise((r) => setTimeout(r, 500));

  // Encontra o elemento interno da composição Remotion (1080×1920)
  const allDivs = Array.from(container.querySelectorAll("div")) as HTMLElement[];
  const compositionEl = allDivs.find(
    (d) => d.style.width === `${compositionWidth}px` && d.style.height === `${compositionHeight}px`
  );
  if (!compositionEl) throw new Error(`compositionEl ${compositionWidth}×${compositionHeight} não encontrado`);

  // Clona para não modificar o DOM gerenciado pelo React
  const clone = compositionEl.cloneNode(true) as HTMLElement;

  // Inline todas as imagens como data URLs no clone → elimina CORS no html-to-image
  const imgs = Array.from(clone.querySelectorAll("img")) as HTMLImageElement[];
  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute("src") || "";
      img.style.filter = "none"; // drop-shadow quebra SVG foreignObject
      if (src && !src.startsWith("data:")) {
        const isCors = img.getAttribute("crossorigin") === "anonymous" && !src.startsWith("/");
        const dataUrl = await toDataUrl(src, isCors);
        if (dataUrl) img.setAttribute("src", dataUrl);
      }
    })
  );

  // Posiciona clone dentro do viewport (atrás do modal), remove transform
  clone.style.cssText += ";position:fixed;left:0;top:0;z-index:8000;transform:none;pointer-events:none;";
  document.body.appendChild(clone);

  try {
    const { toBlob } = await import("html-to-image");
    // pixelRatio 0.5 em 1080×1920 → saída 540×960
    const blob = await toBlob(clone, { pixelRatio: 0.5, cacheBust: false });
    if (!blob) throw new Error("html-to-image retornou null");
    console.log("[buildPng] ok:", blob.size, "bytes");
    return blob;
  } finally {
    document.body.removeChild(clone);
    player.play();
  }
}

// ─── GIF ──────────────────────────────────────────────────────────────────────

async function captureFrame(container: HTMLElement, outW: number, outH: number): Promise<HTMLCanvasElement> {
  const { toPng } = await import("html-to-image");
  const pixelRatio = Math.max(2, Math.ceil(outW / (container.offsetWidth || outW)));
  const dataUrl = await toPng(container, { pixelRatio, cacheBust: false, style: { borderRadius: "0", overflow: "hidden" } });
  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((res) => { img.onload = () => res(); });
  const cv = document.createElement("canvas");
  cv.width = outW; cv.height = outH;
  cv.getContext("2d")!.drawImage(img, 0, 0, img.width, img.height, 0, 0, outW, outH);
  return cv;
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
  const outW = 540, outH = 960;
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

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function VideoPlayerModal({
  open, onClose, composition, inputProps,
  durationInFrames = 450, fps = 30,
  compositionWidth = 1080, compositionHeight = 1920,
  title = "Compartilhar",
  shareText = "Minha evolução no 3D Body Scanner 🏋️",
}: VideoPlayerModalProps) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<"gif" | "png" | null>(null);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [readyBlob, setReadyBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!open) return null;

  const generate = async (type: "gif" | "png") => {
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
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
        if (!containerRef.current || !playerRef.current) return;
        blob = await buildPng(containerRef.current, playerRef.current, compositionWidth, compositionHeight);
      }
      setReadyBlob(blob);
      if (type === "png") setPreviewUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error("generate error:", e);
      setErrorMsg(`Erro: ${(e as Error)?.message ?? String(e)}`);
    } finally {
      playerRef.current?.play();
      setGenerating(false);
    }
  };

  const share = async () => {
    if (!readyBlob || !mode) return;
    const isGif = mode === "gif";
    const fileName = isGif ? "evolucao.gif" : "evolucao.png";
    const file = new File([readyBlob], fileName, { type: isGif ? "image/gif" : "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "3D Body Scanner", text: shareText });
      } else {
        triggerDownload(readyBlob, fileName);
      }
    } catch (e: unknown) {
      if ((e as Error)?.name !== "AbortError") triggerDownload(readyBlob, fileName);
    }
  };

  const btn: React.CSSProperties = {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    border: "none", borderRadius: 16, padding: "18px",
    fontSize: 16, fontWeight: 700, cursor: "pointer",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.96)", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }} onClick={!generating ? onClose : undefined}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{title}</span>
        <button onClick={onClose} disabled={generating} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "8px", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "0 12px" }} onClick={(e) => e.stopPropagation()}>
        {previewUrl ? (
          <img src={previewUrl} style={{ height: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: 20, boxShadow: "0 0 60px rgba(34,211,238,0.18)" }} />
        ) : (
          <div ref={containerRef} style={{ height: "100%", aspectRatio: `${compositionWidth}/${compositionHeight}`, maxWidth: "100%", borderRadius: 20, overflow: "hidden", boxShadow: "0 0 60px rgba(34,211,238,0.18)" }}>
            <Player ref={playerRef} component={composition} inputProps={inputProps} durationInFrames={durationInFrames} fps={fps} compositionWidth={compositionWidth} compositionHeight={compositionHeight} style={{ width: "100%", height: "100%" }} autoPlay loop />
          </div>
        )}
      </div>

      <div style={{ flexShrink: 0, padding: "16px 20px 40px", display: "flex", flexDirection: "column", gap: 10 }} onClick={(e) => e.stopPropagation()}>
        {generating && (
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", height: 5 }}>
            <div style={{ height: "100%", width: `${mode === "gif" ? progress : 60}%`, background: "linear-gradient(90deg,#22d3ee,#3b82f6)", transition: "width 0.3s", borderRadius: 8 }} />
          </div>
        )}

        {errorMsg && (
          <p style={{ fontSize: 13, color: "#f87171", textAlign: "center", margin: 0, padding: "10px 16px", background: "rgba(248,113,113,0.08)", borderRadius: 10 }}>
            {errorMsg}
          </p>
        )}

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
          <>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={share} style={{ ...btn, flex: 1, background: "linear-gradient(135deg,#4ade80,#22d3ee)", color: "#060b14" }}>
                <Share2 size={20} />
                {mode === "gif" ? "Compartilhar GIF" : "Compartilhar imagem"}
              </button>
              <button onClick={() => triggerDownload(readyBlob!, mode === "gif" ? "evolucao.gif" : "evolucao.png")} title="Baixar" style={{ ...btn, width: "auto", padding: "18px 20px", flex: "none", background: "rgba(255,255,255,0.07)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.12)" }}>
                <Download size={20} />
              </button>
            </div>
            {previewUrl && (
              <button onClick={() => { setReadyBlob(null); URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }} style={{ background: "none", border: "none", color: "rgba(148,163,184,0.4)", fontSize: 12, cursor: "pointer", padding: "4px" }}>
                ← voltar ao vídeo
              </button>
            )}
          </>
        )}

        <p style={{ fontSize: 11, color: "rgba(148,163,184,0.22)", textAlign: "center", margin: 0 }}>
          {readyBlob ? "Pronto · toque para compartilhar ou baixar" : "GIF animado para WhatsApp · Imagem estática para Instagram"}
        </p>
      </div>
    </div>
  );
}
