import { W as jsxRuntimeExports, r as reactExports, a1 as Outlet } from "./server-C0e4gypg.js";
import { u as useNavigate, a as useParams, g as getStoredLocale, m as motion, S as SUPPORTED_LOCALES, s as setStoredLocale } from "./router-BDD3RgVy.js";
import { L as Logo } from "./Logo-Djt7ORzu.js";
import { c as cn } from "./utils-Bz4m9VPB.js";
import { a as getOnboardingCopy } from "./app-copy-wxZoQ7QO.js";
import { g as getCurrentUser } from "./auth-B50w1j0O.js";
import { A as ArrowLeft } from "./arrow-left-D6mNKGvq.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
import "./zyrox-logo-CI_vdZ1P.js";
import "./firebase-CeVmTMBf.js";
function ProgressBar({ value, className }) {
  const v = Math.max(0, Math.min(100, value));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-1.5 w-full overflow-hidden rounded-full bg-elevated", className), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-full rounded-full bg-gradient-primary shadow-glow-primary transition-all duration-500",
      style: { width: `${v}%` }
    }
  ) });
}
const TOTAL = 11;
function OnboardingLayout() {
  const navigate = useNavigate();
  const params = useParams({
    strict: false
  });
  const step = Math.max(1, Math.min(TOTAL, parseInt(params.step ?? "1", 10) || 1));
  const progress = step / TOTAL * 100;
  const [locale, setLocale] = reactExports.useState("pt");
  reactExports.useEffect(() => {
    setLocale(getStoredLocale());
  }, []);
  const copy = getOnboardingCopy(locale);
  const handleLocale = (newLocale) => {
    setStoredLocale(newLocale);
    setLocale(newLocale);
  };
  const goBack = () => {
    if (step > 1) navigate({
      to: "/onboarding/$step",
      params: {
        step: String(step - 1)
      }
    });
    else navigate({
      to: "/"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed left-0 top-0 h-[500px] w-[400px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[120px] opacity-25", style: {
      background: "radial-gradient(circle,rgba(34,211,238,0.3) 0%,transparent 70%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed bottom-0 right-0 h-[500px] w-[400px] translate-x-1/2 translate-y-1/4 rounded-full blur-[120px] opacity-20", style: {
      background: "radial-gradient(circle,rgba(251,146,60,0.3) 0%,transparent 70%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      scale: 0.88
    }, animate: {
      opacity: 1,
      scale: 1
    }, transition: {
      duration: 1.2,
      ease: "easeOut"
    }, className: "pointer-events-none fixed right-0 bottom-0 z-0", style: {
      transform: "translateX(45%)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/mascote-sem-fundo.png", alt: "", style: {
      width: 420,
      height: 420,
      objectFit: "contain",
      opacity: 0.45,
      filter: "drop-shadow(0 0 50px rgba(34,211,238,0.5)) drop-shadow(0 0 25px rgba(251,146,60,0.4))"
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-xl items-center justify-between px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: goBack, "aria-label": copy.stepBack, className: "rounded-full p-2 text-primary hover:bg-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { withText: true, size: 34 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          if (getCurrentUser()) navigate({
            to: "/app"
          });
          else navigate({
            to: "/"
          });
        }, className: "text-sm font-medium text-muted-foreground hover:text-foreground", children: copy.skipLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-xl px-4 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-2.5", children: SUPPORTED_LOCALES.map((loc) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleLocale(loc.code), title: loc.nativeLabel, className: cn("relative overflow-hidden rounded-md transition-all duration-200", locale === loc.code ? "ring-2 ring-primary shadow-glow-primary scale-110 opacity-100" : "opacity-40 hover:opacity-70 hover:scale-105"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: loc.flagSrc, alt: loc.flag, className: "h-[18px] w-[26px] object-cover block", loading: "eager" }) }, loc.code)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-xl px-4 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
            copy.stepLabel,
            " ",
            String(step).padStart(2, "0"),
            " / ",
            TOTAL
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cyan", children: [
            Math.round(progress),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { value: progress })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto w-full max-w-xl flex-1 px-4 py-6 pb-36", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}, locale) })
  ] });
}
export {
  OnboardingLayout as component
};