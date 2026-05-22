import { W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { c as cn } from "./utils-Bz4m9VPB.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
function AIInsightCard({ children, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("relative overflow-hidden rounded-2xl border border-cyan/40 bg-surface/60 p-4", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-0 w-1 bg-gradient-ai" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 pl-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mt-0.5 h-4 w-4 shrink-0 text-cyan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm leading-relaxed text-foreground/90", children })
    ] })
  ] });
}
export {
  AIInsightCard as A
};