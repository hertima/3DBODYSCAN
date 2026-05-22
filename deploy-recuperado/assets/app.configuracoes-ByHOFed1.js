import { W as jsxRuntimeExports, r as reactExports } from "./server-C0e4gypg.js";
import { c as createLucideIcon, u as useNavigate, l as loadOnboarding, g as getStoredLocale, S as SUPPORTED_LOCALES, s as setStoredLocale } from "./router-BDD3RgVy.js";
import { o as onAuthStateChanged, a as auth, g as getDoc, e as doc, f as db } from "./firebase-CeVmTMBf.js";
import { L as LocaleSwitcher } from "./LocaleSwitcher-Io0trIIn.js";
import { e as getSettingsCopy } from "./app-copy-wxZoQ7QO.js";
import { A as ArrowLeft } from "./arrow-left-D6mNKGvq.js";
import { S as Shield } from "./shield-CuwT-hx3.js";
import { C as Camera } from "./camera-BjaEtEca.js";
import { C as CircleCheck } from "./circle-check-CDnoii2G.js";
import { L as LoaderCircle } from "./loader-circle-B6zikF32.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
import "./index-meb4Aqgc.js";
import "./utils-Bz4m9VPB.js";
import "./chevron-right-DRYfnruU.js";
import "./check-j8hLnasa.js";
const __iconNode$4 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$4);
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$3);
const __iconNode$2 = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
];
const Database = createLucideIcon("database", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
];
const KeyRound = createLucideIcon("key-round", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10 5H3", key: "1qgfaw" }],
  ["path", { d: "M12 19H3", key: "yhmn1j" }],
  ["path", { d: "M14 3v4", key: "1sua03" }],
  ["path", { d: "M16 17v4", key: "1q0r14" }],
  ["path", { d: "M21 12h-9", key: "1o4lsq" }],
  ["path", { d: "M21 19h-5", key: "1rlt1p" }],
  ["path", { d: "M21 5h-7", key: "1oszz2" }],
  ["path", { d: "M8 10v4", key: "tgpxqk" }],
  ["path", { d: "M8 12H3", key: "a7s4jb" }]
];
const SlidersHorizontal = createLucideIcon("sliders-horizontal", __iconNode);
function useFirebaseStatus() {
  const [auth_status, setAuthStatus] = reactExports.useState("checking");
  const [firestore_status, setFirestoreStatus] = reactExports.useState("checking");
  reactExports.useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => setAuthStatus("ok"), () => setAuthStatus("error"));
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    getDoc(doc(db, "_ping", "probe")).then(() => setFirestoreStatus("ok")).catch((err) => {
      setFirestoreStatus(err.code === "permission-denied" ? "ok" : "error");
    });
  }, []);
  return {
    auth_status,
    firestore_status
  };
}
function ConfiguracoesPage() {
  const navigate = useNavigate();
  const profile = loadOnboarding();
  const hasCameraSetup = Boolean(profile.height || profile.weight);
  const currentLocale = getStoredLocale();
  const copy = getSettingsCopy();
  const {
    auth_status,
    firestore_status
  } = useFirebaseStatus();
  const handleLocaleChange = (nextLocale) => {
    if (!SUPPORTED_LOCALES.some((item) => item.code === nextLocale)) return;
    setStoredLocale(nextLocale);
    window.location.reload();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
        to: "/app/perfil"
      }), className: "grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-foreground", "aria-label": "Voltar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-cyan", children: copy.pageTag }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-gradient-brand", children: copy.pageTitle })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: copy.sectionTitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: copy.sectionSubtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start gap-3 rounded-2xl border border-border bg-elevated/45 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: copy.languageTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: copy.languageDescription })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full sm:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LocaleSwitcher, { value: currentLocale, onChange: (next) => handleLocaleChange(next), align: "end" }) })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { icon: Bell, title: copy.notificationsTitle, description: copy.notificationsDescription, status: copy.activeStatus }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { icon: Shield, title: copy.privacyTitle, description: copy.privacyDescription, status: copy.localStatus }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { icon: Camera, title: copy.bodyScanTitle, description: copy.bodyScanDescription, status: hasCameraSetup ? copy.configuredStatus : copy.pendingStatus }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { icon: SlidersHorizontal, title: copy.engineTitle, description: copy.engineDescription, status: copy.adaptiveStatus })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: "Firebase" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Status da conexão com os serviços" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FirebaseStatusRow, { icon: KeyRound, label: "Authentication", status: auth_status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FirebaseStatusRow, { icon: Database, label: "Firestore", status: firestore_status }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-elevated/45 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-cyan/10 text-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Security Rules" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${firestore_status === "ok" ? "bg-emerald-400/10 text-emerald-400" : "bg-yellow-400/10 text-yellow-400"}`, children: [
                firestore_status === "ok" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
                firestore_status === "ok" ? "Ativas" : "Verificando"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "v2 · 2026-05-18 · Acesso restrito por usuário" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-3xl border border-border bg-surface p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-2xl border border-border bg-elevated/45 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-cyan/10 text-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: copy.profileStateTitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: copy.profileStateDescription })
      ] })
    ] }) })
  ] });
}
function FirebaseStatusRow({
  icon: Icon,
  label,
  status
}) {
  const map = {
    checking: {
      text: "Verificando…",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      Icon: LoaderCircle,
      spin: true
    },
    ok: {
      text: "Conectado",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      Icon: CircleCheck,
      spin: false
    },
    error: {
      text: "Erro",
      color: "text-red-400",
      bg: "bg-red-400/10",
      Icon: CircleX,
      spin: false
    }
  };
  const s = map[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-elevated/45 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${s.bg} ${s.color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${s.bg} ${s.color}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(s.Icon, { className: `h-3 w-3 ${s.spin ? "animate-spin" : ""}` }),
        s.text
      ] })
    ] }) })
  ] });
}
function SettingRow({
  icon: Icon,
  title,
  description,
  status
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-2xl border border-border bg-elevated/45 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-background/60 text-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-cyan/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan", children: status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: description })
    ] })
  ] });
}
export {
  ConfiguracoesPage as component
};