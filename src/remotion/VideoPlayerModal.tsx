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

// ─── carrega imagem como data URL (inline) ───────────────────────────────────
// Data URL é same-origin por definição → html-to-image nunca tem problema de CORS

async function toDataUrl(src: string, cors = false): Promise<string> {
  // Tenta fetch primeiro
  try {
    const res = await fetch(src, { mode: cors ? "cors" : "same-origin", cache: "no-store" });
    if (res.ok) {
      const blob = await res.blob();
      return await blobToBase64(blob);
    }
  } catch { /* segue para XHR */ }

  // Fallback: XMLHttpRequest (mais compatível em alguns ambientes)
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", encodeURI(src));
    if (cors) xhr.withCredentials = false;
    xhr.responseType = "blob";
    xhr.timeout = 8000;
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        blobToBase64(xhr.response as Blob).then(resolve).catch(() => resolve(""));
      } else { resolve(""); }
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

// ─── monta HTML estático (sem Player, sem transforms) ────────────────────────

function el(
  tag: string,
  css: Record<string, string>,
  children?: (HTMLElement | Text)[],
  attrs?: Record<string, string>,
): HTMLElement {
  const e = document.createElement(tag);
  Object.assign(e.style, css);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  children?.forEach((c) => e.appendChild(c));
  return e;
}

function txt(s: string): Text { return document.createTextNode(s); }

function buildCard(inputProps: Record<string, unknown>, dataUrls: { logo: string; mascote: string; avatar: string }): HTMLElement {
  const W = 540, H = 960;
  const name     = String(inputProps.name         ?? "Atleta");
  const xp       = Number(inputProps.xp           ?? 0);
  const streak   = Number(inputProps.streak        ?? 0);
  const sessions = Number(inputProps.totalSessions ?? 0);
  const week     = Number(inputProps.weekNumber    ?? 1);
  const consist  = Number(inputProps.consistency  ?? 0);
  const level    = String(inputProps.level         ?? "Iniciante");
  const goal     = String(inputProps.goal          ?? "Hipertrofia");
  const badges   = Array.isArray(inputProps.badges) ? inputProps.badges as string[] : [];
  const initials = name.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");

  const abs = (top: number, left: number, width: number, extra?: Record<string, string>): Record<string, string> => ({
    position: "absolute", top: `${top}px`, left: `${left}px`, width: `${width}px`, ...extra,
  });

  const card = el("div", {
    position: "fixed",
    left: "-9999px",
    top: "0",
    width: `${W}px`,
    height: `${H}px`,
    overflow: "hidden",
    fontFamily: "sans-serif",
    background: "linear-gradient(175deg,#080e1c 0%,#0c1829 45%,#090f1a 100%)",
    boxSizing: "border-box",
  });

  // glow topo
  card.appendChild(el("div", {
    position: "absolute", top: "-150px", left: "50%", transform: "translateX(-50%)",
    width: "700px", height: "700px", borderRadius: "50%",
    background: "radial-gradient(circle,rgba(34,211,238,0.08) 0%,transparent 65%)",
    pointerEvents: "none",
  }));

  // ── logo + título ──────────────────────────────────────────────────────────
  const logoRow = el("div", { ...abs(36, 0, W), display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" });
  if (dataUrls.logo) {
    logoRow.appendChild(el("img", { width: "30px", height: "30px", borderRadius: "8px" }, [], { src: dataUrls.logo }));
  }
  logoRow.appendChild(el("span", { fontSize: "16px", fontWeight: "800", color: "#e2e8f0", letterSpacing: "0.2px" }, [txt("3D Body Scanner")]));
  card.appendChild(logoRow);

  // ── avatar ─────────────────────────────────────────────────────────────────
  const aR = 60, aX = W / 2, aY = 148;
  const avatarWrap = el("div", {
    position: "absolute",
    top: `${aY - aR - 24}px`,
    left: `${aX - aR - 24}px`,
    width: `${(aR + 24) * 2}px`,
    height: `${(aR + 24) * 2}px`,
    borderRadius: "50%",
    border: "2px solid rgba(34,211,238,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxSizing: "border-box",
  });
  const avatarInner = el("div", {
    width: `${aR * 2}px`,
    height: `${aR * 2}px`,
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: dataUrls.avatar ? "transparent" : "linear-gradient(135deg,#22d3ee,#3b82f6,#fb923c)",
    fontSize: `${Math.round(aR * 0.7)}px`,
    fontWeight: "900",
    color: "#fff",
  });
  if (dataUrls.avatar) {
    avatarInner.appendChild(el("img", { width: "100%", height: "100%", objectFit: "cover" }, [], { src: dataUrls.avatar }));
  } else {
    avatarInner.appendChild(txt(initials || "?"));
  }
  avatarWrap.appendChild(avatarInner);
  card.appendChild(avatarWrap);

  // ── nome ───────────────────────────────────────────────────────────────────
  const nameY = aY + aR + 40;
  card.appendChild(el("div", {
    ...abs(nameY, 0, W),
    textAlign: "center",
    fontSize: "40px",
    fontWeight: "900",
    letterSpacing: "-1px",
    background: "linear-gradient(90deg,#22d3ee,#f1f5f9,#fb923c)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: "1",
  }, [txt(name)]));

  // ── chips ──────────────────────────────────────────────────────────────────
  const chipY = nameY + 52;
  const chipRow = el("div", { ...abs(chipY, 0, W), display: "flex", justifyContent: "center", gap: "12px" });
  [[level, "#22d3ee"], [goal, "#fb923c"]].forEach(([t, c]) => {
    chipRow.appendChild(el("span", {
      fontSize: "14px", fontWeight: "700", color: c,
      background: c + "1a",
      border: `1px solid ${c}55`,
      borderRadius: "999px",
      padding: "7px 20px",
    }, [txt(t)]));
  });
  card.appendChild(chipRow);

  // ── divisória ──────────────────────────────────────────────────────────────
  const divY = chipY + 52;
  card.appendChild(el("div", {
    ...abs(divY, 30, W - 60),
    height: "1px",
    background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.3),rgba(251,146,60,0.2),transparent)",
  }));

  // ── card XP ────────────────────────────────────────────────────────────────
  const cardY = divY + 14;
  const xpCard = el("div", {
    ...abs(cardY, 30, W - 60),
    background: "rgba(14,22,42,0.9)",
    border: "1px solid rgba(251,146,60,0.3)",
    borderRadius: "18px",
    padding: "20px 24px",
    boxSizing: "border-box",
  });

  // row: xp + streak
  const xpRow = el("div", { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "14px" });
  xpRow.appendChild(el("div", { fontSize: "38px", fontWeight: "900", color: "#fb923c", lineHeight: "1" }, [txt(`${xp} XP`)]));
  xpRow.appendChild(el("div", { fontSize: "28px", fontWeight: "900", color: "#4ade80", lineHeight: "1" }, [txt(`🔥 ${streak}`)]));
  xpCard.appendChild(xpRow);

  // barra XP
  const barWrap = el("div", { background: "rgba(255,255,255,0.07)", borderRadius: "4px", height: "8px", overflow: "hidden" });
  const pct = Math.min(100, (xp % 1000) / 10);
  barWrap.appendChild(el("div", {
    height: "100%", width: `${pct}%`,
    background: "linear-gradient(90deg,#fb923c,#fbbf24,#fb923c)",
    borderRadius: "4px",
  }));
  xpCard.appendChild(barWrap);
  xpCard.appendChild(el("div", { fontSize: "11px", color: "rgba(148,163,184,0.4)", marginTop: "8px" }, [txt(`${xp % 1000} / 1000 XP`)]));
  card.appendChild(xpCard);

  // ── stats ──────────────────────────────────────────────────────────────────
  const statsY = cardY + 126;
  const statsRow = el("div", { ...abs(statsY, 30, W - 60), display: "flex", gap: "8px" });
  [
    { v: String(sessions), l: "SESSÕES",  col: "#22d3ee" },
    { v: `${week}/12`,     l: "SEMANA",   col: "#a78bfa" },
    { v: `${consist}%`,   l: "CONSIST.", col: "#4ade80" },
  ].forEach((s) => {
    const statCard = el("div", {
      flex: "1",
      background: "rgba(255,255,255,0.04)",
      border: `1.5px solid ${s.col}22`,
      borderRadius: "16px",
      padding: "16px 6px",
      textAlign: "center",
      boxSizing: "border-box",
    });
    statCard.appendChild(el("div", { fontSize: "26px", fontWeight: "900", color: s.col, lineHeight: "1.1" }, [txt(s.v)]));
    statCard.appendChild(el("div", { fontSize: "9px", color: "rgba(148,163,184,0.45)", letterSpacing: "2px", textTransform: "uppercase", marginTop: "8px" }, [txt(s.l)]));
    statsRow.appendChild(statCard);
  });
  card.appendChild(statsRow);

  // ── badges ─────────────────────────────────────────────────────────────────
  if (badges.length > 0) {
    const badgesY = statsY + 90;
    const badgesWrap = el("div", { ...abs(badgesY, 30, W - 60) });
    badgesWrap.appendChild(el("div", { fontSize: "9px", color: "rgba(148,163,184,0.35)", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "12px" }, [txt("CONQUISTAS")]));
    const badgesRow = el("div", { display: "flex", flexWrap: "wrap", gap: "10px" });
    badges.slice(0, 6).forEach((b) => {
      badgesRow.appendChild(el("div", {
        width: "62px", height: "62px", borderRadius: "14px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "28px",
      }, [txt(String(b))]));
    });
    badgesWrap.appendChild(badgesRow);
    card.appendChild(badgesWrap);
  }

  // ── mascote ────────────────────────────────────────────────────────────────
  if (dataUrls.mascote) {
    const mS = 200;
    card.appendChild(el("img", {
      ...abs(H - mS - 60, (W - mS) / 2, mS),
      height: `${mS}px`,
      objectFit: "contain",
    }, [], { src: dataUrls.mascote }));
  }

  // ── tagline ────────────────────────────────────────────────────────────────
  card.appendChild(el("div", {
    ...abs(H - 30, 0, W),
    textAlign: "center",
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: "rgba(148,163,184,0.28)",
  }, [txt("EVOLUÇÃO EM PROGRESSO")]));

  return card;
}

// ─── PNG via html-to-image com HTML próprio (sem Player, sem transforms) ────────

async function buildPng(inputProps: Record<string, unknown>): Promise<Blob> {
  const avatarUrl = inputProps.avatarUrl ? String(inputProps.avatarUrl) : "";

  const [logo, mascote, avatar] = await Promise.all([
    toDataUrl("/logo favicton 3D Body Scan.png"),
    toDataUrl("/MASCOTE SEM FUNDO.png"),
    avatarUrl ? toDataUrl(avatarUrl, true) : Promise.resolve(""),
  ]);

  console.log("[buildPng] dataUrls:", { logo: logo.length, mascote: mascote.length, avatar: avatar.length });

  const card = buildCard(inputProps, { logo, mascote, avatar });
  document.body.appendChild(card);

  try {
    const { toBlob } = await import("html-to-image");
    const blob = await toBlob(card, {
      pixelRatio: 1,
      cacheBust: false,
      style: { overflow: "hidden" },
    });
    if (!blob) throw new Error("html-to-image retornou null");
    console.log("[buildPng] ok:", blob.size, "bytes");
    return blob;
  } finally {
    document.body.removeChild(card);
  }
}

// ─── GIF (html-to-image via Player) ─────────────────────────────────────────

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

// ─── Modal ───────────────────────────────────────────────────────────────────

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
              <button
                onClick={() => triggerDownload(readyBlob!, mode === "gif" ? "evolucao.gif" : "evolucao.png")}
                title="Baixar"
                style={{ ...btn, width: "auto", padding: "18px 20px", flex: "none", background: "rgba(255,255,255,0.07)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.12)" }}
              >
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
