import { r as reactExports, W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { g as getStoredLocale, m as motion, L as Link, s as setStoredLocale } from "./router-BDD3RgVy.js";
import { r as resetPassword } from "./auth-B50w1j0O.js";
import { L as LocaleSwitcher } from "./LocaleSwitcher-Io0trIIn.js";
import { l as logo } from "./zyrox-logo-CI_vdZ1P.js";
import { g as getAuthCopy } from "./app-copy-wxZoQ7QO.js";
import { A as ArrowLeft } from "./arrow-left-D6mNKGvq.js";
import { M as Mail } from "./mail-BG_YuJp1.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
import "./firebase-CeVmTMBf.js";
import "./index-meb4Aqgc.js";
import "./utils-Bz4m9VPB.js";
import "./chevron-right-DRYfnruU.js";
import "./check-j8hLnasa.js";
import "./sparkles-BO3UjRsf.js";
function RecoverPasswordPage() {
  const [locale, setLocale] = reactExports.useState("pt");
  const [email, setEmail] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const authCopy = getAuthCopy();
  reactExports.useEffect(() => {
    setLocale(getStoredLocale());
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    const sanitizedEmail = email.trim().toLowerCase();
    if (!sanitizedEmail) {
      setError(authCopy.recoverMissingEmail);
      return;
    }
    setLoading(true);
    try {
      await resetPassword(sanitizedEmail);
      setMessage("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (err) {
      const code = err.code ?? "";
      if (code === "auth/user-not-found" || code === "auth/invalid-email") {
        setError("Nenhuma conta encontrada com este e-mail.");
      } else {
        setError("Erro ao enviar e-mail. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleLocaleChange = (nextLocale) => {
    setStoredLocale(nextLocale);
    setLocale(nextLocale);
    window.location.reload();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 text-foreground", style: {
    background: "#060b14"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -left-40 top-0 h-[600px] w-[500px] rounded-full blur-[120px]", style: {
      background: "radial-gradient(circle,rgba(34,211,238,0.22) 0%,transparent 70%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-40 bottom-0 h-[600px] w-[500px] rounded-full blur-[120px]", style: {
      background: "radial-gradient(circle,rgba(251,146,60,0.22) 0%,transparent 70%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl", style: {
      background: "rgba(251,191,36,0.08)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 24
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.5
    }, className: "relative z-10 w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden rounded-3xl p-px", style: {
        background: "linear-gradient(135deg,rgba(34,211,238,0.25),rgba(255,255,255,0.05) 50%,rgba(251,146,60,0.25))"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl p-6", style: {
        background: "rgba(10,15,26,0.92)",
        backdropFilter: "blur(24px)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LocaleSwitcher, { value: locale, onChange: (next) => handleLocaleChange(next), compact: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mb-5 inline-flex items-center gap-2 text-sm font-medium hover:opacity-80", style: {
          color: "#22d3ee"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          authCopy.backToLogin
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-3xl blur-xl", style: {
              background: "linear-gradient(135deg,rgba(34,211,238,0.5),rgba(251,146,60,0.5))",
              transform: "scale(1.15)"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(motion.img, { initial: {
              scale: 0.8,
              opacity: 0
            }, animate: {
              scale: 1,
              opacity: 1
            }, transition: {
              delay: 0.15,
              duration: 0.45,
              type: "spring"
            }, src: logo, alt: "3D Body Scan", className: "relative h-24 w-24 rounded-2xl", style: {
              boxShadow: "0 0 0 1px rgba(34,211,238,0.3), 0 0 0 3px rgba(251,146,60,0.15), 0 8px 32px rgba(0,0,0,0.6)"
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black tracking-tight", style: {
            background: "linear-gradient(90deg,#22d3ee 0%,#ffffff 45%,#fb923c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }, children: authCopy.recoverTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm", style: {
            color: "rgba(148,163,184,0.85)"
          }, children: authCopy.recoverSubtitle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-medium", style: {
              color: "#94a3b8"
            }, children: authCopy.emailLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", style: {
                color: "#475569"
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (event) => setEmail(event.target.value), placeholder: authCopy.emailPlaceholder, className: "w-full rounded-xl py-2.5 pl-9 pr-3 text-sm text-white outline-none transition", style: {
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.05)"
              }, onFocus: (e) => e.currentTarget.style.borderColor = "rgba(34,211,238,0.5)", onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" })
            ] })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg px-3 py-2 text-xs font-medium", style: {
            border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.08)",
            color: "#f87171"
          }, children: error }),
          message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg px-3 py-2 text-xs font-medium", style: {
            border: "1px solid rgba(34,211,238,0.3)",
            background: "rgba(34,211,238,0.08)",
            color: "#22d3ee"
          }, children: message }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.button, { whileTap: {
            scale: 0.97
          }, type: "submit", disabled: loading, className: "mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white transition disabled:opacity-40", style: {
            background: "linear-gradient(135deg,#ea580c,#fb923c,#fdba74)",
            boxShadow: "0 0 24px rgba(251,146,60,0.35), 0 4px 16px rgba(0,0,0,0.4)"
          }, children: loading ? "Enviando..." : authCopy.recoverCta })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-[11px] uppercase tracking-[0.2em]", style: {
        color: "rgba(100,116,139,0.5)"
      }, children: "3D Body Scan — Evolucao com tecnologia" })
    ] })
  ] });
}
export {
  RecoverPasswordPage as component
};