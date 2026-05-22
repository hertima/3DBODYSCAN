import { r as reactExports, W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { u as useNavigate, g as getStoredLocale, m as motion, L as Link, s as setStoredLocale, l as loadOnboarding, b as saveOnboarding, i as isOnboarded } from "./router-BDD3RgVy.js";
import { L as LocaleSwitcher } from "./LocaleSwitcher-Io0trIIn.js";
import { l as logo } from "./zyrox-logo-CI_vdZ1P.js";
import { o as onAuth, s as signUp } from "./auth-B50w1j0O.js";
import { g as getAuthCopy } from "./app-copy-wxZoQ7QO.js";
import { saveProfileToFirestore } from "./firestore-profile-CBXOZDAC.js";
import { saveLocalStateToFirestore } from "./firestore-local-state-D31V5Cyg.js";
import { A as ArrowLeft } from "./arrow-left-D6mNKGvq.js";
import { U as User } from "./user-Bh11TJpu.js";
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
function SignUpPage() {
  const navigate = useNavigate();
  const [locale, setLocale] = reactExports.useState("pt");
  const authCopy = getAuthCopy();
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [fieldErrors, setFieldErrors] = reactExports.useState({});
  const signingUpRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    setLocale(getStoredLocale());
  }, []);
  function getPasswordStrength(pwd) {
    if (pwd.length === 0) return {
      level: 0,
      label: "",
      color: ""
    };
    if (pwd.length < 6) return {
      level: 1,
      label: "Fraca",
      color: "#ef4444"
    };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const extras = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (pwd.length >= 10 && extras >= 2) return {
      level: 4,
      label: "Muito forte",
      color: "#4ade80"
    };
    if (pwd.length >= 8 && extras >= 1) return {
      level: 3,
      label: "Forte",
      color: "#22d3ee"
    };
    return {
      level: 2,
      label: "Média",
      color: "#fb923c"
    };
  }
  const pwdStrength = getPasswordStrength(password);
  reactExports.useEffect(() => {
    const unsub = onAuth((user) => {
      if (signingUpRef.current) return;
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
      }
    });
    return unsub;
  }, [navigate]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName) {
      setError(authCopy.missingName);
      return;
    }
    if (!trimmedEmail) {
      setError(authCopy.invalidEmail);
      return;
    }
    if (password.length < 6) {
      setError(authCopy.weakPassword);
      return;
    }
    if (password !== confirmPassword) {
      setError(authCopy.passwordMismatch);
      return;
    }
    setLoading(true);
    signingUpRef.current = true;
    try {
      const existing = loadOnboarding();
      const mergedProfile = {
        ...existing,
        email: trimmedEmail,
        name: trimmedName
      };
      saveOnboarding(mergedProfile);
      const cred = await signUp(trimmedEmail, password);
      saveProfileToFirestore(cred.user.uid, mergedProfile).catch(() => {
      });
      saveLocalStateToFirestore(cred.user.uid).catch(() => {
      });
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
    } catch (err) {
      signingUpRef.current = false;
      setLoading(false);
      const code = err.code ?? "";
      if (code === "auth/email-already-in-use") {
        setError("Este e-mail já está em uso.");
      } else if (code === "auth/invalid-email") {
        setError(authCopy.invalidEmail);
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
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
          }, children: authCopy.createAccountTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm", style: {
            color: "rgba(148,163,184,0.85)"
          }, children: authCopy.createAccountSubtitle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-medium", style: {
              color: "#94a3b8"
            }, children: authCopy.nameLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", style: {
                color: "#475569"
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: name, onChange: (event) => setName(event.target.value), placeholder: authCopy.namePlaceholder, className: "w-full rounded-xl py-3 pl-9 pr-3 text-sm text-white outline-none transition", style: {
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.05)"
              }, onFocus: (e) => e.currentTarget.style.borderColor = "rgba(34,211,238,0.5)", onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-medium", style: {
              color: "#94a3b8"
            }, children: authCopy.emailLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", style: {
                color: "#475569"
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (event) => setEmail(event.target.value), placeholder: authCopy.emailPlaceholder, className: "w-full rounded-xl py-3 pl-9 pr-3 text-sm text-white outline-none transition", style: {
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPassword ? "text" : "password", required: true, value: password, onChange: (event) => setPassword(event.target.value), placeholder: authCopy.passwordHint, className: "w-full rounded-xl py-3 pl-9 pr-10 text-sm text-white outline-none transition", style: {
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.05)"
              }, onFocus: (e) => e.currentTarget.style.borderColor = "rgba(251,146,60,0.5)", onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword((value) => !value), className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition", style: {
                color: "#64748b"
              }, children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
            ] })
          ] }),
          pwdStrength.level > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4].map((level) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 flex-1 rounded-full transition-all duration-300", style: {
              background: level <= pwdStrength.level ? pwdStrength.color : "rgba(255,255,255,0.08)"
            } }, level)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold", style: {
              color: pwdStrength.color
            }, children: pwdStrength.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-medium", style: {
              color: "#94a3b8"
            }, children: authCopy.confirmPasswordLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", style: {
                color: "#475569"
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showConfirmPassword ? "text" : "password", required: true, value: confirmPassword, onChange: (event) => setConfirmPassword(event.target.value), placeholder: authCopy.confirmPasswordPlaceholder, className: "w-full rounded-xl py-3 pl-9 pr-10 text-sm text-white outline-none transition", style: {
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.05)"
              }, onFocus: (e) => e.currentTarget.style.borderColor = "rgba(251,146,60,0.5)", onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowConfirmPassword((value) => !value), className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition", style: {
                color: "#64748b"
              }, children: showConfirmPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
            ] })
          ] }),
          confirmPassword && password !== confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium", style: {
            color: "#f87171"
          }, children: "As senhas não coincidem" }),
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
            authCopy.creatingAccount
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            authCopy.createAccountCta,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-[11px] uppercase tracking-[0.2em]", style: {
        color: "rgba(100,116,139,0.5)"
      }, children: "3D Body Scan — Evolucao com tecnologia" })
    ] })
  ] });
}
export {
  SignUpPage as component
};