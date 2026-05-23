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

async function captureFrame(container: HTMLElement, outW: number, outH: number): Promise<HTMLCanvasElement> {
  const { toPng } = await import("html-to-image");
  const natural = Math.ceil(outW / (container.offsetWidth || outW));
  const pixelRatio = Math.min(3, Math.max(2, natural));
  const dataUrl = await toPng(container, {
    pixelRatio,
    cacheBust: false,
    style: { borderRadius: "0", overflow: "hidden" },
  });
  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((res) => { img.onload = () => res(); });
  const c = document.createElement("canvas");
  c.width = outW; c.height = outH;
  c.getContext("2d")!.drawImage(img, 0, 0, img.width, img.height, 0, 0, outW, outH);
  return c;
}

async function buildPng(container: HTMLElement, player: PlayerRef, durationInFrames: number): Promise<Blob> {
  player.pause();
  player.seekTo(Math.floor(durationInFrames * 0.72));
  await new Promise((r) => setTimeout(r, 500));

  // Captura na resolução que funciona (igual ao GIF)
  const base = await captureFrame(container, 540, 960);

  // Escala via canvas para 1080x1920 com qualidade alta
  const scaled = document.createElement("canvas");
  scaled.width = 1080;
  scaled.height = 1920;
  const ctx = scaled.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(base, 0, 0, 1080, 1920);

  return new Promise((resolve) => scaled.toBlob((b) => resolve(b!), "image/png"));
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
  shareLabel = "Gerar imagem",
  shareText = "Minha evolução no 3D Body Scanner 🏋️",
}: VideoPlayerModalProps) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [readyBlob, setReadyBlob] = useState<Blob | null>(null);

  if (!open) return null;

  const handleGenerate = async () => {
    if (!containerRef.current || !playerRef.current) return;
    setGenerating(true);
    setErrorMsg(null);
    setReadyBlob(null);
    try {
      const blob = await buildPng(containerRef.current, playerRef.current, durationInFrames);
      setReadyBlob(blob);
    } catch (e) {
      console.error("png error", e);
      setErrorMsg("Falha ao gerar imagem. Tente novamente.");
    } finally {
      playerRef.current?.play();
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!readyBlob) return;
    const file = new File([readyBlob], "3dbodyscanner.png", { type: "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "3D Body Scanner", text: shareText });
      } else {
        triggerDownload(readyBlob, "3dbodyscanner.png");
      }
    } catch (e: unknown) {
      if ((e as Error)?.name !== "AbortError") triggerDownload(readyBlob, "3dbodyscanner.png");
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.96)", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}
      onClick={!generating ? onClose : undefined}
    >
      {/* Barra superior */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{title}</span>
        <button onClick={onClose} disabled={generating} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "8px", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}>
          <X size={20} />
        </button>
      </div>

      {/* Player */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "0 12px" }} onClick={(e) => e.stopPropagation()}>
        <div ref={containerRef} style={{ height: "100%", aspectRatio: `${compositionWidth}/${compositionHeight}`, maxWidth: "100%", borderRadius: 20, overflow: "hidden", boxShadow: "0 0 60px rgba(34,211,238,0.18)" }}>
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

      {/* Botões */}
      <div style={{ flexShrink: 0, padding: "16px 20px 40px", display: "flex", flexDirection: "column", gap: 10 }} onClick={(e) => e.stopPropagation()}>

        {generating && (
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", height: 5 }}>
            <div style={{ height: "100%", width: "60%", background: "linear-gradient(90deg,#22d3ee,#3b82f6)", borderRadius: 8, animation: "pulse 1s infinite" }} />
          </div>
        )}

        {errorMsg && <p style={{ fontSize: 12, color: "#f87171", textAlign: "center", margin: 0 }}>{errorMsg}</p>}

        {!readyBlob ? (
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: generating ? "rgba(34,211,238,0.12)" : "linear-gradient(135deg,#22d3ee,#3b82f6)",
              border: generating ? "1px solid rgba(34,211,238,0.3)" : "none",
              borderRadius: 16, padding: "20px",
              fontSize: 17, fontWeight: 700,
              color: generating ? "#22d3ee" : "#060b14",
              cursor: generating ? "default" : "pointer",
            }}
          >
            {generating ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />}
            {generating ? "Gerando imagem…" : shareLabel}
          </button>
        ) : (
          <button
            onClick={handleShare}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: "linear-gradient(135deg,#4ade80,#22d3ee)",
              border: "none", borderRadius: 16, padding: "20px",
              fontSize: 17, fontWeight: 700, color: "#060b14", cursor: "pointer",
            }}
          >
            <Share2 size={20} />
            Compartilhar agora
          </button>
        )}

        <p style={{ fontSize: 11, color: "rgba(148,163,184,0.25)", textAlign: "center", margin: 0 }}>
          {readyBlob ? "Imagem pronta · toque para abrir o menu de compartilhar" : "Imagem PNG · Instagram · WhatsApp · Stories"}
        </p>
      </div>
    </div>
  );
}
