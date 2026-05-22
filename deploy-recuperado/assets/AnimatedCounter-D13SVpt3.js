import { W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { u as useCurrentFrame, i as interpolate } from "./index-CcuZFuTS.js";
function AnimatedCounter({ from, to, startFrame, endFrame, decimals = 0, suffix = "", prefix = "", style }) {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style, children: [
    prefix,
    value.toFixed(decimals),
    suffix
  ] });
}
export {
  AnimatedCounter as A
};