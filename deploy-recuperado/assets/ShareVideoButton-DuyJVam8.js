import { r as reactExports, W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { S as Share2, V as VideoPlayerModal } from "./VideoPlayerModal-BQaBY8IB.js";
function ShareVideoButton({
  composition,
  inputProps,
  durationInFrames = 450,
  fps = 30,
  title = "Compartilhar vídeo",
  label = "Compartilhar",
  variant = "ghost",
  className
}) {
  const [open, setOpen] = reactExports.useState(false);
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 600,
    fontSize: 13,
    border: "none",
    transition: "opacity 0.2s"
  };
  const variantStyles = {
    primary: {
      background: "linear-gradient(135deg,#22d3ee,#3b82f6)",
      color: "#060b14",
      borderRadius: 12,
      padding: "10px 18px"
    },
    ghost: {
      background: "rgba(34,211,238,0.08)",
      border: "1px solid rgba(34,211,238,0.25)",
      color: "#22d3ee",
      borderRadius: 12,
      padding: "8px 14px"
    },
    icon: {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#94a3b8",
      borderRadius: 10,
      padding: "8px"
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        style: { ...baseStyles, ...variantStyles[variant] },
        className,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 14 }),
          variant !== "icon" && label
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      VideoPlayerModal,
      {
        open,
        onClose: () => setOpen(false),
        composition,
        inputProps,
        durationInFrames,
        fps,
        title
      }
    )
  ] });
}
export {
  ShareVideoButton as S
};