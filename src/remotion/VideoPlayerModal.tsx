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
  formatLabel?: string;
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

// ─── PNG: html-to-image para background/texto + canvas direto para imgs ──────

async function buildPng(
  container: HTMLElement,
  player: PlayerRef,
  compositionWidth: number,
  compositionHeight: number,
): Promise<Blob> {
  player.pause();
  player.seekTo(130);
  await new Promise((r) => setTimeout(r, 500));

  const allDivs = Array.from(container.querySelectorAll("div")) as HTMLElement[];
  const compositionEl = allDivs.find(
    (d) => d.style.width === `${compositionWidth}px` && d.style.height === `${compositionHeight}px`
  );
  if (!compositionEl) throw new Error(`compositionEl ${compositionWidth}×${compositionHeight} não encontrado`);

  // Espera as imgs do player carregar (máx 4s cada)
  const liveImgs = Array.from(compositionEl.querySelectorAll("img")) as HTMLImageElement[];
  await Promise.all(liveImgs.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((res) => {
      const t = setTimeout(res, 4000);
      img.addEventListener("load", () => { clearTimeout(t); res(); }, { once: true });
      img.addEventListener("error", () => { clearTimeout(t); res(); }, { once: true });
    });
  }));

  // Posição de cada img no espaço composição (1080×1920), contabilizando o scale do Remotion
  const compRect = compositionEl.getBoundingClientRect();
  const sx = compRect.width / compositionWidth;
  const sy = compRect.height / compositionHeight;
  const liveImgData = liveImgs.map((img) => {
    const r = img.getBoundingClientRect();
    return {
      img,
      cx: (r.left - compRect.left) / sx,
      cy: (r.top  - compRect.top)  / sy,
      cw: r.width  / sx,
      ch: r.height / sy,
    };
  });

  // Clone para capturar fundo/texto — imgs ficam ocultas
  const clone = compositionEl.cloneNode(true) as HTMLElement;
  clone.style.position = "fixed";
  clone.style.left = "0"; clone.style.top = "0";
  clone.style.zIndex = "8000"; clone.style.transform = "none";
  clone.style.pointerEvents = "none";
  Array.from(clone.querySelectorAll("img")).forEach((el) => {
    const img = el as HTMLImageElement;
    img.style.visibility = "hidden";
    img.removeAttribute("crossorigin");
  });

  document.body.appendChild(clone);
  await new Promise((r) => setTimeout(r, 80));

  const { toBlob } = await import("html-to-image");
  const baseBlob = await toBlob(clone, {
    pixelRatio: 0.5, cacheBust: false,
    width: compositionWidth, height: compositionHeight,
  });
  document.body.removeChild(clone);
  if (!baseBlob) throw new Error("html-to-image retornou null");

  // Canvas final 540×960
  const outW = Math.round(compositionWidth * 0.5);
  const outH = Math.round(compositionHeight * 0.5);
  const fc = document.createElement("canvas");
  fc.width = outW; fc.height = outH;
  const ctx = fc.getContext("2d")!;

  // Desenha base (fundo + texto)
  const blobUrl = URL.createObjectURL(baseBlob);
  await new Promise<void>((res, rej) => {
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, 0, 0); URL.revokeObjectURL(blobUrl); res(); };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); rej(new Error("base load failed")); };
    img.src = blobUrl;
  });

  // Desenha imgs do player diretamente no canvas (sem crossOrigin = sem taint para assets locais)
  for (const { img, cx, cy, cw, ch } of liveImgData) {
    if (!img.complete || img.naturalWidth === 0) continue;
    try {
      ctx.drawImage(img, cx * 0.5, cy * 0.5, cw * 0.5, ch * 0.5);
    } catch { /* avatar tainted sem CORS — pula */ }
  }

  player.play();

  return new Promise<Blob>((resolve, reject) =>
    fc.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas.toBlob null"))), "image/png")
  );
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
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [readyBlob, setReadyBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!open) return null;

  const generate = async () => {
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    setGenerating(true);
    setErrorMsg(null);
    setReadyBlob(null);
    playerRef.current?.pause();
    try {
      if (!containerRef.current || !playerRef.current) return;
      const blob = await buildPng(containerRef.current, playerRef.current, compositionWidth, compositionHeight);
      setReadyBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error("generate error:", e);
      setErrorMsg(`Erro: ${(e as Error)?.message ?? String(e)}`);
    } finally {
      playerRef.current?.play();
      setGenerating(false);
    }
  };

  const share = async () => {
    if (!readyBlob) return;
    const file = new File([readyBlob], "evolucao.png", { type: "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "3D Body Scanner", text: shareText });
      } else {
        triggerDownload(readyBlob, "evolucao.png");
      }
    } catch (e: unknown) {
      if ((e as Error)?.name !== "AbortError") triggerDownload(readyBlob, "evolucao.png");
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
        {errorMsg && (
          <p style={{ fontSize: 13, color: "#f87171", textAlign: "center", margin: 0, padding: "10px 16px", background: "rgba(248,113,113,0.08)", borderRadius: 10 }}>
            {errorMsg}
          </p>
        )}

        {!readyBlob ? (
          <button onClick={generate} disabled={generating} style={{ ...btn, background: generating ? "rgba(34,211,238,0.12)" : "linear-gradient(135deg,#22d3ee,#3b82f6)", color: generating ? "#22d3ee" : "#060b14", border: generating ? "1px solid rgba(34,211,238,0.3)" : "none", cursor: generating ? "default" : "pointer" }}>
            {generating ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />}
            {generating ? "Gerando imagem…" : "Compartilhar imagem"}
          </button>
        ) : (
          <>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={share} style={{ ...btn, flex: 1, background: "linear-gradient(135deg,#4ade80,#22d3ee)", color: "#060b14" }}>
                <Share2 size={20} />
                Compartilhar imagem
              </button>
              <button onClick={() => triggerDownload(readyBlob!, "evolucao.png")} title="Baixar" style={{ ...btn, width: "auto", padding: "18px 20px", flex: "none", background: "rgba(255,255,255,0.07)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.12)" }}>
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
          {readyBlob ? "Pronto · toque para compartilhar ou baixar" : "Imagem estática para Instagram / Stories"}
        </p>
      </div>
    </div>
  );
}
