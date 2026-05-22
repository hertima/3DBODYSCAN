import { W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { A as AbsoluteFill, P as Player } from "./index-CcuZFuTS.js";
import { c as createLucideIcon, X } from "./router-BDD3RgVy.js";
const __iconNode$1 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode);
function GradientBackground({ variant = "dark" }) {
  const gradients = {
    dark: "radial-gradient(ellipse at 20% 20%, rgba(34,211,238,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(251,146,60,0.18) 0%, transparent 50%), linear-gradient(135deg, #060b14 0%, #0a0f1e 100%)",
    corpo: "radial-gradient(ellipse at 30% 30%, rgba(34,211,238,0.22) 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(59,130,246,0.18) 0%, transparent 55%), linear-gradient(135deg, #060b14 0%, #0d1322 100%)",
    workout: "radial-gradient(ellipse at 50% 10%, rgba(251,146,60,0.25) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(34,211,238,0.15) 0%, transparent 50%), linear-gradient(180deg, #060b14 0%, #0a0f1e 100%)",
    analytics: "radial-gradient(ellipse at 20% 50%, rgba(167,139,250,0.2) 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, rgba(34,211,238,0.15) 0%, transparent 55%), linear-gradient(135deg, #060b14 0%, #0a0f1e 100%)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AbsoluteFill, { style: { background: gradients[variant] } });
}
function VideoPlayerModal({
  open,
  onClose,
  composition,
  inputProps,
  durationInFrames = 450,
  fps = 30,
  compositionWidth = 1080,
  compositionHeight = 1920,
  title = "Compartilhar vídeo"
}) {
  if (!open) return null;
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "3D Body Scan", text: "Minha evolução no 3D Body Scan 🏋️" });
      } catch {
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      },
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: { width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 15, fontWeight: 700, color: "#e2e8f0", fontFamily: "sans-serif" }, children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onClose,
                  style: { background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "6px 8px", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderRadius: 20, overflow: "hidden", boxShadow: "0 0 40px rgba(34,211,238,0.15)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Player,
              {
                component: composition,
                inputProps,
                durationInFrames,
                fps,
                compositionWidth,
                compositionHeight,
                style: { width: "100%", aspectRatio: `${compositionWidth}/${compositionHeight}` },
                controls: true,
                autoPlay: true,
                loop: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: handleShare,
                  style: {
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "linear-gradient(135deg,#22d3ee,#3b82f6)",
                    border: "none",
                    borderRadius: 14,
                    padding: "14px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#060b14",
                    cursor: "pointer",
                    fontFamily: "sans-serif"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 16 }),
                    " Compartilhar"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    fontSize: 14,
                    color: "#94a3b8",
                    cursor: "pointer"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "rgba(148,163,184,0.4)", textAlign: "center", fontFamily: "sans-serif", margin: 0 }, children: "Formato Story (9:16) · pronto para Instagram e WhatsApp" })
          ]
        }
      )
    }
  );
}
export {
  GradientBackground as G,
  Share2 as S,
  VideoPlayerModal as V
};