import { W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { u as useCurrentFrame, i as interpolate } from "./index-CcuZFuTS.js";
function AnimatedBar({ pct, startFrame, color, height = 8, borderRadius = 999, style }) {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [startFrame, startFrame + 40], [0, Math.min(100, pct)], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height, borderRadius, background: "rgba(255,255,255,0.08)", overflow: "hidden", ...style }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    width: `${width}%`,
    height: "100%",
    borderRadius,
    background: color,
    boxShadow: `0 0 12px ${color}60`,
    transition: "none"
  } }) });
}
export {
  AnimatedBar as A
};