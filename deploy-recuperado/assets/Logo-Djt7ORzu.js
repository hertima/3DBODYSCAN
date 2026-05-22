import { r as reactExports, W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { c as cn } from "./utils-Bz4m9VPB.js";
import { L as Link } from "./router-BDD3RgVy.js";
import { l as logo } from "./zyrox-logo-CI_vdZ1P.js";
function Logo({ className, withText = true, size = 40 }) {
  const [imgFailed, setImgFailed] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: cn("inline-flex items-center gap-2.5", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", style: { width: size, height: size }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-xl blur-md", style: { background: "linear-gradient(135deg,rgba(34,211,238,0.5),rgba(251,146,60,0.5))", transform: "scale(1.2)" } }),
      imgFailed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "relative grid place-items-center rounded-xl text-white font-black",
          style: { width: size, height: size, fontSize: size * 0.32, background: "linear-gradient(135deg,#06b6d4,#fb923c)", boxShadow: "0 0 0 1px rgba(34,211,238,0.2), 0 4px 12px rgba(0,0,0,0.5)" },
          children: "ZX"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: logo,
          alt: "3D Body Scan",
          width: size,
          height: size,
          className: "relative rounded-xl",
          style: { width: size, height: size, boxShadow: "0 0 0 1px rgba(34,211,238,0.2), 0 4px 12px rgba(0,0,0,0.5)" },
          onError: () => setImgFailed(true)
        }
      )
    ] }),
    withText && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-display font-black tracking-tight",
        style: { fontSize: size * 0.38, background: "linear-gradient(90deg,#22d3ee,#ffffff,#fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
        children: "3D Body Scan"
      }
    )
  ] });
}
export {
  Logo as L
};