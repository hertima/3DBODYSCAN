import { O as useRouter, r as reactExports, W as jsxRuntimeExports, a1 as Outlet } from "./server-C0e4gypg.js";
import { u as useNavigate, g as getStoredLocale, L as Link, A as AnimatePresence, m as motion, S as SUPPORTED_LOCALES, s as setStoredLocale, i as isOnboarded, b as saveOnboarding, l as loadOnboarding } from "./router-BDD3RgVy.js";
import { L as Logo } from "./Logo-Djt7ORzu.js";
import { L as LocaleSwitcher } from "./LocaleSwitcher-Io0trIIn.js";
import { o as onAuth } from "./auth-B50w1j0O.js";
import { loadProfileFromFirestore } from "./firestore-profile-CBXOZDAC.js";
import { startLocalStateAutosync, startRealtimeSync, restoreLocalStateFromFirestore } from "./firestore-local-state-D31V5Cyg.js";
import { u as useTrainingState } from "./use-training-state-DNcnklus.js";
import { u as useGamification } from "./use-gamification-CyAvBw87.js";
import { c as cn } from "./utils-Bz4m9VPB.js";
import { F as Flame } from "./flame-B4I7h4kj.js";
import { H as House } from "./house-DD_2jI5n.js";
import { D as Dumbbell } from "./dumbbell-DL1Diyp6.js";
import { B as BookOpen } from "./book-open-Pq6oLUlx.js";
import { C as ChartColumn } from "./chart-column-BIQlOIt7.js";
import { S as ScanLine } from "./scan-line-CN8Ia3oi.js";
import { U as User } from "./user-Bh11TJpu.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
import "./zyrox-logo-CI_vdZ1P.js";
import "./index-meb4Aqgc.js";
import "./chevron-right-DRYfnruU.js";
import "./check-j8hLnasa.js";
import "./sparkles-BO3UjRsf.js";
import "./firebase-CeVmTMBf.js";
import "./workout-history-D2efW0ov.js";
import "./app-copy-wxZoQ7QO.js";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const AiChat = reactExports.lazy(() => import("./AiChat-ujUuonyL.js").then((module) => ({
  default: module.AiChat
})));
const NAV_COPY = {
  pt: ["Inicio", "Treinos", "Biblioteca", "Analytics", "3D Scan", "Perfil"],
  es: ["Inicio", "Entrenos", "Biblioteca", "Analitica", "3D Scan", "Perfil"],
  en: ["Home", "Workouts", "Library", "Analytics", "3D Scan", "Profile"],
  fr: ["Accueil", "Seances", "Bibliotheque", "Analytics", "3D Scan", "Profil"],
  de: ["Start", "Training", "Bibliothek", "Analytics", "3D Scan", "Profil"]
};
function getNav(locale) {
  const labels = NAV_COPY[locale] ?? NAV_COPY.pt;
  return [{
    to: "/app",
    label: labels[0],
    icon: House,
    exact: true
  }, {
    to: "/app/treinos",
    label: labels[1],
    icon: Dumbbell
  }, {
    to: "/app/exercicios",
    label: labels[2],
    icon: BookOpen
  }, {
    to: "/app/analytics",
    label: labels[3],
    icon: ChartColumn
  }, {
    to: "/app/corpo",
    label: labels[4],
    icon: ScanLine
  }, {
    to: "/app/perfil",
    label: labels[5],
    icon: User
  }];
}
function AppLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = reactExports.useState(false);
  const [trainingRefresh, setTrainingRefresh] = reactExports.useState(0);
  const [identity, setIdentity] = reactExports.useState({
    name: "Atleta 3D Body Scan",
    avatarUrl: ""
  });
  const [locale, setLocale] = reactExports.useState("pt");
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    setLocale(getStoredLocale());
    let cancelled = false;
    let stopAutosync = null;
    let stopRealtimeSync = null;
    const applyIdentity = (user) => {
      const current = loadOnboarding();
      setIdentity({
        name: current.name?.trim() || user.displayName || user.email?.split("@")[0] || "Atleta 3D Body Scan",
        avatarUrl: current.avatarUrl ?? ""
      });
    };
    const unsub = onAuth((user) => {
      void (async () => {
        if (!user) {
          navigate({
            to: "/"
          });
          return;
        }
        const onRemoteChange = () => {
          if (cancelled) return;
          applyIdentity(user);
          setTrainingRefresh((value) => value + 1);
        };
        if (isOnboarded()) {
          applyIdentity(user);
          setReady(true);
          stopAutosync?.();
          stopRealtimeSync?.();
          stopAutosync = startLocalStateAutosync(user.uid);
          stopRealtimeSync = startRealtimeSync(user.uid, onRemoteChange);
          void restoreLocalStateFromFirestore(user.uid).then(() => {
            if (cancelled) return;
            applyIdentity(user);
            setTrainingRefresh((value) => value + 1);
          }).catch(() => {
          });
          return;
        }
        const profile = await loadProfileFromFirestore(user.uid).catch(() => null);
        if (profile) saveOnboarding(profile);
        if (cancelled) return;
        if (!isOnboarded()) {
          navigate({
            to: "/onboarding/$step",
            params: {
              step: "1"
            }
          });
          return;
        }
        stopAutosync?.();
        stopRealtimeSync?.();
        stopAutosync = startLocalStateAutosync(user.uid);
        stopRealtimeSync = startRealtimeSync(user.uid, onRemoteChange);
        applyIdentity(user);
        setReady(true);
        void restoreLocalStateFromFirestore(user.uid).then(() => {
          if (cancelled) return;
          applyIdentity(user);
          setTrainingRefresh((value) => value + 1);
        }).catch(() => {
        });
      })();
    });
    return () => {
      cancelled = true;
      stopAutosync?.();
      stopRealtimeSync?.();
      unsub();
    };
  }, [navigate]);
  const handleLocaleChange = (nextLocale) => {
    if (!SUPPORTED_LOCALES.some((item) => item.code === nextLocale)) return;
    setStoredLocale(nextLocale);
    setLocale(nextLocale);
    window.location.reload();
  };
  if (!ready) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ReadyAppLayout, { identity, locale, trainingRefresh, handleLocaleChange });
}
function ReadyAppLayout({
  identity,
  locale,
  trainingRefresh,
  handleLocaleChange
}) {
  const loc = useLocation();
  const nav = getNav(locale);
  const trainingState = useTrainingState(trainingRefresh);
  const {
    gamification
  } = useGamification(trainingState);
  const initials = identity.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("").slice(0, 2) || "AZ";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen overflow-x-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur", style: {
      paddingTop: "env(safe-area-inset-top)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-3 sm:px-4 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 38 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 sm:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LocaleSwitcher, { value: locale, onChange: (next) => handleLocaleChange(next), compact: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/onboarding/$step", params: {
          step: "1"
        }, className: "hidden rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/15 sm:inline-flex", children: "Onboarding" }),
        gamification.streakDays > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-primary md:flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5" }),
          " ",
          gamification.streakDays,
          " dias"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground sm:h-9 sm:w-9", children: identity.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: identity.avatarUrl, alt: identity.name, className: "h-full w-full object-cover" }) : initials })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex w-full max-w-6xl gap-0 px-3 sm:px-4 lg:gap-8 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "sticky top-[68px] hidden h-[calc(100vh-68px)] w-56 shrink-0 py-6 lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "space-y-1", children: nav.map((n) => {
        const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: n.to, className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active ? "bg-elevated text-foreground border-l-2 border-cyan" : "text-muted-foreground hover:bg-surface hover:text-foreground border-l-2 border-transparent"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(n.icon, { className: cn("h-4 w-4", active && "text-primary") }),
          n.label
        ] }, n.to);
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative min-w-0 flex-1 pb-nav-safe pt-5 lg:pb-12 lg:pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed left-0 top-0 h-[500px] w-[400px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[120px] opacity-30", style: {
          background: "radial-gradient(circle,rgba(34,211,238,0.3) 0%,transparent 70%)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed bottom-0 right-0 h-[500px] w-[400px] translate-x-1/2 translate-y-1/4 rounded-full blur-[120px] opacity-25", style: {
          background: "radial-gradient(circle,rgba(251,146,60,0.3) 0%,transparent 70%)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0,
          y: 6
        }, animate: {
          opacity: 1,
          y: 0
        }, exit: {
          opacity: 0,
          y: -6
        }, transition: {
          duration: 0.18,
          ease: "easeOut"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }, loc.pathname) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AiChat, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed inset-x-0 bottom-0 z-30 max-w-[100vw] border-t border-border bg-background/95 backdrop-blur lg:hidden", style: {
      paddingBottom: "env(safe-area-inset-bottom)",
      paddingLeft: "env(safe-area-inset-left)",
      paddingRight: "env(safe-area-inset-right)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid w-full max-w-xl grid-cols-6 px-1 pt-2 pb-1", children: nav.map((n) => {
      const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: n.to, className: cn("min-w-0 flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[10px] font-medium transition-all duration-150 active:scale-95", active ? "text-primary" : "text-muted-foreground hover:text-foreground"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(n.icon, { className: cn("h-5 w-5 transition-all", active && "drop-shadow-[0_0_8px_var(--primary)] scale-110") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-full truncate", children: n.label })
      ] }, n.to);
    }) }) })
  ] });
}
export {
  AppLayout as component
};