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

// ─── helpers canvas ───────────────────────────────────────────────────────────

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Carrega qualquer imagem via fetch → blob → createImageBitmap.
 * Nunca taint o canvas. Nunca sofre com cache CORS do browser.
 */
async function fetchBitmap(src: string, corsMode: RequestMode = "same-origin"): Promise<ImageBitmap | null> {
  try {
    const res = await fetch(src, { mode: corsMode });
    if (!res.ok) { console.warn(`fetchBitmap HTTP ${res.status}:`, src); return null; }
    const blob = await res.blob();
    return await createImageBitmap(blob);
  } catch (e) {
    console.warn(`fetchBitmap failed (${corsMode}):`, src, e);
    return null;
  }
}

/** Avatar: tenta CORS, senão tenta no-cors (opaque), senão retorna null */
async function fetchAvatar(url: string): Promise<ImageBitmap | null> {
  if (!url) return null;
  // tenta CORS primeiro (Google, Firebase com CORS configurado)
  const bm = await fetchBitmap(url, "cors");
  if (bm) return bm;
  // fallback: no-cors (opaque) — blob existe mas pode não ser desenhável no canvas
  // neste caso retornamos null e desenhamos gradiente
  return null;
}

/** canvas → Blob, com fallback toDataURL se toBlob retornar null */
function canvasToBlob(c: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      c.toBlob((b) => {
        if (b) { resolve(b); return; }
        // fallback via dataURL
        try {
          const du = c.toDataURL("image/png");
          fetch(du).then((r) => r.blob()).then(resolve).catch(reject);
        } catch (e) { reject(e); }
      }, "image/png");
    } catch (e) {
      try {
        const du = c.toDataURL("image/png");
        fetch(du).then((r) => r.blob()).then(resolve).catch(reject);
      } catch (e2) { reject(e2); }
    }
  });
}

// ─── PNG 100% Canvas 2D ───────────────────────────────────────────────────────

async function buildPng(inputProps: Record<string, unknown>): Promise<Blob> {
  const W = 540, H = 960;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  const name     = String(inputProps.name         ?? "Atleta");
  const xp       = Number(inputProps.xp           ?? 0);
  const streak   = Number(inputProps.streak        ?? 0);
  const sessions = Number(inputProps.totalSessions ?? 0);
  const week     = Number(inputProps.weekNumber    ?? 1);
  const consist  = Number(inputProps.consistency  ?? 0);
  const level    = String(inputProps.level         ?? "Iniciante");
  const goal     = String(inputProps.goal          ?? "Hipertrofia");
  const badges   = Array.isArray(inputProps.badges) ? inputProps.badges as string[] : [];
  const avatarUrl = inputProps.avatarUrl ? String(inputProps.avatarUrl) : "";

  console.log("[buildPng] iniciando", { name, xp, avatarUrl: avatarUrl.slice(0, 40) });

  // carrega imagens em paralelo
  const [logoBm, mascoteBm, avatarBm] = await Promise.all([
    fetchBitmap("/logo favicton 3D Body Scan.png"),
    fetchBitmap("/MASCOTE SEM FUNDO.png"),
    fetchAvatar(avatarUrl),
  ]);

  console.log("[buildPng] bitmaps:", { logo: !!logoBm, mascote: !!mascoteBm, avatar: !!avatarBm });

  // ── fundo ──────────────────────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#080e1c"); bg.addColorStop(0.45, "#0c1829"); bg.addColorStop(1, "#090f1a");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const glow1 = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 320);
  glow1.addColorStop(0, "rgba(34,211,238,0.1)"); glow1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow1; ctx.fillRect(0, 0, W, 400);

  // ── logo + título ──────────────────────────────────────────────────────────
  if (logoBm) {
    const lS = 32, lX = W / 2 - 90, lY = 36;
    ctx.save(); rr(ctx, lX, lY, lS, lS, 8); ctx.clip();
    ctx.drawImage(logoBm, lX, lY, lS, lS); ctx.restore();
    logoBm.close();
  }
  ctx.font = "800 16px sans-serif"; ctx.fillStyle = "#e2e8f0";
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.fillText("3D Body Scanner", W / 2 - 50, 52);

  // ── avatar ─────────────────────────────────────────────────────────────────
  const aR = 60, aX = W / 2, aY = 148;
  ctx.save(); ctx.beginPath(); ctx.arc(aX, aY, aR + 14, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(34,211,238,0.5)"; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(aX, aY, aR + 22, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(34,211,238,0.2)"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();

  ctx.save(); ctx.beginPath(); ctx.arc(aX, aY, aR, 0, Math.PI * 2); ctx.clip();
  if (avatarBm) {
    ctx.drawImage(avatarBm, aX - aR, aY - aR, aR * 2, aR * 2);
    avatarBm.close();
  } else {
    const ag = ctx.createLinearGradient(aX - aR, aY - aR, aX + aR, aY + aR);
    ag.addColorStop(0, "#22d3ee"); ag.addColorStop(1, "#fb923c");
    ctx.fillStyle = ag; ctx.fillRect(aX - aR, aY - aR, aR * 2, aR * 2);
    const initials = name.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
    ctx.font = `900 ${Math.round(aR * 0.7)}px sans-serif`; ctx.fillStyle = "#fff";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(initials || "?", aX, aY);
  }
  ctx.restore();

  // ── nome ───────────────────────────────────────────────────────────────────
  const nameY = aY + aR + 40;
  const ng = ctx.createLinearGradient(0, 0, W, 0);
  ng.addColorStop(0, "#22d3ee"); ng.addColorStop(0.5, "#f1f5f9"); ng.addColorStop(1, "#fb923c");
  ctx.font = "900 40px sans-serif"; ctx.fillStyle = ng;
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  ctx.fillText(name, W / 2, nameY);

  // ── chips level / goal ─────────────────────────────────────────────────────
  const chipY = nameY + 22;
  const chips: [string, string, number][] = [[level, "#22d3ee", -84], [goal, "#fb923c", 84]];
  chips.forEach(([txt, col, off]) => {
    ctx.font = "700 13px sans-serif";
    const tw = ctx.measureText(txt).width + 32;
    const cx = W / 2 + off - tw / 2;
    ctx.fillStyle = col + "1a"; rr(ctx, cx, chipY, tw, 30, 15); ctx.fill();
    ctx.strokeStyle = col + "66"; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(txt, cx + tw / 2, chipY + 15);
  });

  // ── divisória ──────────────────────────────────────────────────────────────
  const divY = chipY + 50;
  const dl = ctx.createLinearGradient(30, 0, W - 30, 0);
  dl.addColorStop(0, "rgba(0,0,0,0)"); dl.addColorStop(0.4, "rgba(34,211,238,0.3)");
  dl.addColorStop(0.7, "rgba(251,146,60,0.2)"); dl.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath(); ctx.moveTo(30, divY); ctx.lineTo(W - 30, divY);
  ctx.strokeStyle = dl; ctx.lineWidth = 1; ctx.stroke();

  // ── card XP ────────────────────────────────────────────────────────────────
  const cardY = divY + 14;
  ctx.fillStyle = "rgba(14,22,42,0.9)"; ctx.strokeStyle = "rgba(251,146,60,0.3)"; ctx.lineWidth = 1;
  rr(ctx, 30, cardY, W - 60, 118, 18); ctx.fill(); ctx.stroke();

  ctx.font = "900 38px sans-serif"; ctx.fillStyle = "#fb923c";
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.fillText(`${xp} XP`, 54, cardY + 52);

  ctx.font = "900 28px sans-serif"; ctx.fillStyle = "#4ade80";
  ctx.textAlign = "right";
  ctx.fillText(`🔥 ${streak}`, W - 54, cardY + 52);

  const barY = cardY + 74, barW = W - 108;
  ctx.fillStyle = "rgba(255,255,255,0.07)"; rr(ctx, 54, barY, barW, 8, 4); ctx.fill();
  const pct = Math.min(1, (xp % 1000) / 1000);
  if (pct > 0) {
    const barGrad = ctx.createLinearGradient(54, 0, 54 + barW, 0);
    barGrad.addColorStop(0, "#fb923c"); barGrad.addColorStop(0.5, "#fbbf24"); barGrad.addColorStop(1, "#fb923c");
    ctx.fillStyle = barGrad; rr(ctx, 54, barY, barW * pct, 8, 4); ctx.fill();
  }
  ctx.font = "400 11px sans-serif"; ctx.fillStyle = "rgba(148,163,184,0.4)";
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.fillText(`${xp % 1000} / 1000 XP`, 54, barY + 22);

  // ── stats ──────────────────────────────────────────────────────────────────
  const statsY = cardY + 134;
  const sData = [
    { v: String(sessions), l: "SESSÕES",  col: "#22d3ee" },
    { v: `${week}/12`,     l: "SEMANA",   col: "#a78bfa" },
    { v: `${consist}%`,   l: "CONSIST.", col: "#4ade80" },
  ];
  const sW = (W - 76) / 3;
  sData.forEach((s, i) => {
    const sx = 30 + i * (sW + 8);
    ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.strokeStyle = s.col + "22"; ctx.lineWidth = 1.5;
    rr(ctx, sx, statsY, sW, 76, 16); ctx.fill(); ctx.stroke();
    ctx.font = "900 26px sans-serif"; ctx.fillStyle = s.col;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(s.v, sx + sW / 2, statsY + 34);
    ctx.font = "500 9px sans-serif"; ctx.fillStyle = "rgba(148,163,184,0.45)";
    ctx.fillText(s.l, sx + sW / 2, statsY + 60);
  });

  // ── badges ─────────────────────────────────────────────────────────────────
  if (badges.length > 0) {
    const bY = statsY + 96;
    ctx.font = "500 9px sans-serif"; ctx.fillStyle = "rgba(148,163,184,0.35)";
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillText("CONQUISTAS", 30, bY);
    const bSz = 62;
    badges.slice(0, 6).forEach((b, i) => {
      const bx = 30 + i * (bSz + 10);
      ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1;
      rr(ctx, bx, bY + 10, bSz, bSz, 14); ctx.fill(); ctx.stroke();
      ctx.font = `${Math.round(bSz * 0.46)}px serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#fff";
      ctx.fillText(String(b), bx + bSz / 2, bY + 10 + bSz / 2);
    });
  }

  // ── mascote ────────────────────────────────────────────────────────────────
  if (mascoteBm) {
    const mS = 200, mX = W / 2 - mS / 2, mY = H - mS - 60;
    ctx.drawImage(mascoteBm, mX, mY, mS, mS);
    mascoteBm.close();
    console.log("[buildPng] mascote desenhado");
  }

  // ── tagline ────────────────────────────────────────────────────────────────
  ctx.font = "700 9px sans-serif"; ctx.fillStyle = "rgba(148,163,184,0.28)";
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  ctx.fillText("EVOLUÇÃO EM PROGRESSO", W / 2, H - 28);

  console.log("[buildPng] convertendo para blob...");
  const blob = await canvasToBlob(c);
  console.log("[buildPng] blob gerado:", blob.size, "bytes");
  return blob;
}

// ─── GIF (html-to-image) ─────────────────────────────────────────────────────

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
        blob = await buildPng(inputProps);
      }
      setReadyBlob(blob);
      if (type === "png") setPreviewUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error("generate error:", e);
      setErrorMsg(`Erro: ${(e as Error)?.message ?? "falha ao gerar"}`);
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

      {/* preview PNG ou player */}
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
