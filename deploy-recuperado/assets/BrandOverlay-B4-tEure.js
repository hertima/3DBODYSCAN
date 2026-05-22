import { W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { u as useCurrentFrame, i as interpolate, A as AbsoluteFill } from "./index-CcuZFuTS.js";
function BrandOverlay({ position = "bottom" }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const style = {
    position: "absolute",
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    opacity,
    ...position === "bottom" ? { bottom: 60, paddingBottom: 0 } : { top: 60, paddingTop: 0 }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AbsoluteFill, { style: { pointerEvents: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: "/logo favicton 3D Body Scan.png",
        style: {
          width: 52,
          height: 52,
          borderRadius: 14,
          boxShadow: "0 0 24px rgba(34,211,238,0.5), 0 0 8px rgba(251,146,60,0.3)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      fontFamily: "sans-serif",
      fontWeight: 900,
      fontSize: 26,
      background: "linear-gradient(90deg, #22d3ee, #ffffff, #fb923c)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: -0.5
    }, children: "3D Body Scan" })
  ] }) });
}
export {
  BrandOverlay as B
};