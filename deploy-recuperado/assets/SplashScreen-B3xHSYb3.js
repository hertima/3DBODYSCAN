import { W as jsxRuntimeExports, r as reactExports } from "./server-C0e4gypg.js";
import { u as useCurrentFrame, a as useVideoConfig, s as spring, i as interpolate, E as Easing, P as Player } from "./index-CcuZFuTS.js";
import { l as logo } from "./zyrox-logo-CI_vdZ1P.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BDD3RgVy.js";
import "./openai-config-D_XaIbeQ.js";
function SplashComposition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ fps, frame, from: 0.4, to: 1, durationInFrames: 30, config: { damping: 14, stiffness: 120 } });
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const textOpacity = interpolate(frame, [28, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY = interpolate(frame, [28, 48], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const taglineOpacity = interpolate(frame, [50, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [50, 68], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const glowOpacity = interpolate(frame, [20, 60, 110, 140], [0, 0.7, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [120, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        background: "oklch(0.14 0.03 260)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        opacity: fadeOut,
        fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, oklch(0.74 0.17 53 / 0.25) 0%, transparent 70%)",
              opacity: glowOpacity,
              filter: "blur(40px)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              opacity: 0.04,
              backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "30px 30px"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Zyrox", style: { width: "100%", height: "100%", objectFit: "contain" } })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              opacity: textOpacity,
              transform: `translateY(${textY}px)`,
              fontSize: 42,
              fontWeight: 900,
              letterSpacing: "0.25em",
              color: "oklch(0.98 0.01 250)",
              textTransform: "uppercase"
            },
            children: "ZYROX"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              opacity: taglineOpacity,
              transform: `translateY(${taglineY}px)`,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.3em",
              color: "oklch(0.74 0.17 53)",
              textTransform: "uppercase"
            },
            children: "3D Body Scan"
          }
        )
      ]
    }
  );
}
function SplashScreen({ onFinish }) {
  const [visible, setVisible] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 1400);
    return () => clearTimeout(timer);
  }, [onFinish]);
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[9999]", style: { background: "oklch(0.14 0.03 260)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Player,
    {
      component: SplashComposition,
      durationInFrames: 150,
      compositionWidth: 390,
      compositionHeight: 844,
      fps: 30,
      playbackRate: 1,
      loop: false,
      controls: false,
      style: { width: "100%", height: "100%" },
      inputProps: {},
      autoPlay: true
    }
  ) });
}
export {
  SplashScreen
};