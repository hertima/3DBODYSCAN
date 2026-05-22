import { r as reactExports, W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { c as createLucideIcon, u as useNavigate, g as getStoredLocale, m as motion, L as Link, s as setStoredLocale, b as saveOnboarding, d as clearOnboarding, i as isOnboarded } from "./router-BDD3RgVy.js";
import { L as LocaleSwitcher } from "./LocaleSwitcher-Io0trIIn.js";
import { l as logo } from "./zyrox-logo-CI_vdZ1P.js";
import { g as getAuthCopy } from "./app-copy-wxZoQ7QO.js";
import { o as onAuth, a as signIn } from "./auth-B50w1j0O.js";
import { loadProfileFromFirestore } from "./firestore-profile-CBXOZDAC.js";
import { restoreLocalStateFromFirestore, clearManagedLocalState, saveLocalStateToFirestore } from "./firestore-local-state-D31V5Cyg.js";
import { A as Apple } from "./apple-CmadVI1d.js";
import { M as Mail } from "./mail-BG_YuJp1.js";
import { L as Lock } from "./lock-B10xzRBV.js";
import { E as EyeOff, a as Eye } from "./eye-zceRJec1.js";
import { L as LoaderCircle } from "./loader-circle-B6zikF32.js";
import { A as ArrowRight } from "./arrow-right-B87Ma675.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
import "./index-meb4Aqgc.js";
import "./utils-Bz4m9VPB.js";
import "./chevron-right-DRYfnruU.js";
import "./check-j8hLnasa.js";
import "./sparkles-BO3UjRsf.js";
import "./firebase-CeVmTMBf.js";
const __iconNode = [
  ["path", { d: "M10.88 21.94 15.46 14", key: "xkve6t" }],
  ["path", { d: "M21.17 8H12", key: "19dcdn" }],
  ["path", { d: "M3.95 6.06 8.54 14", key: "g8jz9m" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }]
];
const Chromium = createLucideIcon("chromium", __iconNode);
const SplashScreen = reactExports.lazy(() => import("./SplashScreen-B3xHSYb3.js").then((module) => ({
  default: module.SplashScreen
})));
function LoginPage() {
  const navigate = useNavigate();
  const [locale, setLocale] = reactExports.useState("pt");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPwd, setShowPwd] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [showSplash, setShowSplash] = reactExports.useState(false);
  const authCopy = getAuthCopy();
  reactExports.useEffect(() => {
    setLocale(getStoredLocale());
    if (typeof window !== "undefined" && !sessionStorage.getItem("zyrox_splash_shown")) {
      setShowSplash(true);
    }
  }, []);
  reactExports.useEffect(() => {
    const unsub = onAuth((user) => {
      if (user) {
        if (isOnboarded()) {
          navigate({
            to: "/app"
          });
        } else {
          navigate({
            to: "/onboarding/$step",
            params: {
              step: "1"
            }
          });
        }
        return;
      }
    });
    return unsub;
  }, [navigate]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signIn(email.trim().toLowerCase(), password);
      try {
        const profile = await loadProfileFromFirestore(cred.user.uid);
        if (profile) {
          saveOnboarding(profile);
        } else {
          clearOnboarding();
        }
      } catch {
      }
      if (isOnboarded()) {
        navigate({
          to: "/app"
        });
      } else {
        navigate({
          to: "/onboarding/$step",
          params: {
            step: "1"
          }
        });
      }
      void restoreLocalStateFromFirestore(cred.user.uid, {
        replaceLocal: true
      }).then((restoredLocalState) => {
        if (!restoredLocalState) clearManagedLocalState();
        return saveLocalStateToFirestore(cred.user.uid);
      }).catch(() => {
      });
    } catch (err) {
      setLoading(false);
      const code = err.code ?? "";
      if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
        setError(authCopy.invalidCredentials);
      } else if (code === "auth/invalid-email") {
        setError(authCopy.invalidEmail);
      } else if (code === "auth/too-many-requests") {
        setError("Muitas tentativas. Tente novamente mais tarde.");
      } else {
        setError(authCopy.invalidCredentials);
      }
    }
  };
  const handleLocaleChange = (nextLocale) => {
    setStoredLocale(nextLocale);
    setLocale(nextLocale);
    window.location.reload();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    showSplash && /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplashScreen, { onFinish: () => {
      sessionStorage.setItem("zyrox_splash_shown", "1");
      setShowSplash(false);
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 text-foreground", style: {
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
      }, className: "relative z-10 w-full max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden rounded-3xl p-px", style: {
          background: "linear-gradient(135deg,rgba(34,211,238,0.25),rgba(255,255,255,0.05) 50%,rgba(251,146,60,0.25))"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl p-6", style: {
          background: "rgba(10,15,26,0.92)",
          backdropFilter: "blur(24px)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LocaleSwitcher, { value: locale, onChange: (next) => handleLocaleChange(next), compact: true }) }),
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
              }, src: logo, alt: "3D Body Scan", className: "relative h-28 w-28 rounded-2xl", style: {
                boxShadow: "0 0 0 1px rgba(34,211,238,0.3), 0 0 0 3px rgba(251,146,60,0.15), 0 8px 32px rgba(0,0,0,0.6)"
              } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black tracking-tight", style: {
              background: "linear-gradient(90deg,#22d3ee 0%,#ffffff 45%,#fb923c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }, children: "3D Body Scan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm", style: {
              color: "rgba(148,163,184,0.85)"
            }, children: authCopy.loginSubtitle })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2.5", children: [{
            Icon: Chromium,
            label: "Google"
          }, {
            Icon: Apple,
            label: "Apple"
          }].map(({
            Icon,
            label
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: true, className: "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium opacity-50 transition", style: {
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            color: "#94a3b8"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
            " ",
            label,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em]", style: {
              border: "1px solid rgba(255,255,255,0.1)"
            }, children: authCopy.socialSoon })
          ] }, label)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em]", style: {
            color: "rgba(100,116,139,0.7)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: {
              background: "rgba(255,255,255,0.06)"
            } }),
            authCopy.emailDivider,
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1", style: {
              background: "rgba(255,255,255,0.06)"
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-medium", style: {
                color: "#94a3b8"
              }, children: authCopy.emailLabel }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", style: {
                  color: "#475569"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: authCopy.emailPlaceholder, className: "w-full rounded-xl py-3 pl-9 pr-3 text-sm text-white outline-none transition", style: {
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.05)"
                }, onFocus: (e) => e.currentTarget.style.borderColor = "rgba(34,211,238,0.5)", onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-medium", style: {
                color: "#94a3b8"
              }, children: authCopy.passwordLabel }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", style: {
                  color: "#475569"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPwd ? "text" : "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), placeholder: authCopy.passwordPlaceholder, className: "w-full rounded-xl py-3 pl-9 pr-10 text-sm text-white outline-none transition", style: {
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.05)"
                }, onFocus: (e) => e.currentTarget.style.borderColor = "rgba(251,146,60,0.5)", onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPwd((v) => !v), className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition", style: {
                  color: "#64748b"
                }, children: showPwd ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2", style: {
                color: "#64748b"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "h-3.5 w-3.5 rounded", style: {
                  accentColor: "#fb923c"
                } }),
                authCopy.rememberMe
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/recuperar-senha", className: "font-medium transition hover:opacity-80", style: {
                color: "#22d3ee"
              }, children: authCopy.forgotPassword })
            ] }),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg px-3 py-2 text-xs font-medium", style: {
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.08)",
              color: "#f87171"
            }, children: error }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(motion.button, { whileTap: {
              scale: 0.97
            }, type: "submit", disabled: loading, className: "mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white transition disabled:opacity-40", style: {
              background: "linear-gradient(135deg,#ea580c,#fb923c,#fdba74)",
              boxShadow: "0 0 24px rgba(251,146,60,0.35), 0 4px 16px rgba(0,0,0,0.4)"
            }, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
              " ",
              authCopy.signingIn
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              authCopy.signIn,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-5 text-center text-xs", style: {
            color: "#475569"
          }, children: [
            "Novo no 3D Body Scan?",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/criar-conta", className: "font-semibold text-white transition hover:opacity-80", children: authCopy.createAccount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 border-t pt-4", style: {
            borderColor: "rgba(255,255,255,0.06)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs tracking-wide", style: {
              color: "#fbbf24"
            }, children: "★★★★★" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px]", style: {
              color: "rgba(100,116,139,0.75)"
            }, children: "+12.800 atletas transformando seus resultados" })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-[11px] uppercase tracking-[0.2em]", style: {
          color: "rgba(100,116,139,0.5)"
        }, children: authCopy.builtForEvolution })
      ] })
    ] })
  ] });
}
export {
  LoginPage as component
};