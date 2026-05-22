import { r as reactExports, W as jsxRuntimeExports } from "./server-C0e4gypg.js";
import { b as buildUserContext } from "./ai-service-Dcx-r93S.js";
import { s as serializeMemoryForAI, b as buildAthleteMemory } from "./use-training-state-DNcnklus.js";
import { c as createLucideIcon, l as loadOnboarding, g as getStoredLocale, A as AnimatePresence, m as motion } from "./router-BDD3RgVy.js";
import { c as cn } from "./utils-Bz4m9VPB.js";
import { a as auth } from "./firebase-CeVmTMBf.js";
import { S as Sparkles } from "./sparkles-BO3UjRsf.js";
import { C as ChevronDown } from "./LocaleSwitcher-Io0trIIn.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./workout-history-D2efW0ov.js";
import "./openai-config-D_XaIbeQ.js";
import "./index-meb4Aqgc.js";
import "./chevron-right-DRYfnruU.js";
import "./check-j8hLnasa.js";
const __iconNode$2 = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
];
const Bot = createLucideIcon("bot", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
const QUICK = {
  pt: [
    "Qual exercício priorizar essa semana?",
    "Como sair de um plateau de evolução?",
    "Como melhorar minha recuperação muscular?",
    "Devo ajustar minha dieta para meu objetivo?"
  ],
  es: [
    "¿Qué ejercicio priorizar esta semana?",
    "¿Cómo salir de un plateau de progreso?",
    "¿Cómo mejorar mi recuperación muscular?",
    "¿Debo ajustar mi dieta según mi objetivo?"
  ],
  en: [
    "Which exercise should I prioritize this week?",
    "How do I break through a training plateau?",
    "How can I improve muscle recovery?",
    "Should I adjust my diet for my goal?"
  ],
  fr: [
    "Quel exercice prioriser cette semaine ?",
    "Comment sortir d'un plateau d'entraînement ?",
    "Comment améliorer ma récupération musculaire ?",
    "Dois-je ajuster mon alimentation selon mon objectif ?"
  ],
  de: [
    "Welche Übung soll ich diese Woche priorisieren?",
    "Wie überwinde ich ein Training-Plateau?",
    "Wie verbessere ich meine Muskelregeneration?",
    "Sollte ich meine Ernährung anpassen?"
  ]
};
const GREETING = {
  pt: (n) => `${n ? `Olá, ${n}!` : "Olá!"} Sou seu AI Coach pessoal — treinador e nutricionista de elite. Posso ajudar com treino, dieta, recuperação e progressão de carga. O que precisa hoje?`,
  es: (n) => `${n ? `¡Hola, ${n}!` : "¡Hola!"} Soy tu AI Coach personal — entrenador y nutricionista de élite. Puedo ayudarte con entrenamiento, dieta, recuperación y progresión de carga. ¿Qué necesitas hoy?`,
  en: (n) => `${n ? `Hey, ${n}!` : "Hey!"} I'm your personal AI Coach — elite trainer and nutritionist. I can help with workouts, diet, recovery, and load progression. What do you need today?`,
  fr: (n) => `${n ? `Bonjour, ${n} !` : "Bonjour !"} Je suis votre AI Coach personnel — entraîneur et nutritionniste d'élite. Je peux vous aider avec l'entraînement, l'alimentation, la récupération et la progression. Que souhaitez-vous aujourd'hui ?`,
  de: (n) => `${n ? `Hallo, ${n}!` : "Hallo!"} Ich bin dein persönlicher AI Coach — Elite-Trainer und Ernährungsexperte. Ich helfe dir bei Training, Ernährung, Regeneration und Lastprogression. Was brauchst du heute?`
};
const PLACEHOLDER = {
  pt: "Pergunte ao seu AI Coach...",
  es: "Pregunta a tu AI Coach...",
  en: "Ask your AI Coach...",
  fr: "Demandez à votre AI Coach...",
  de: "Frage deinen AI Coach..."
};
function AiChat() {
  const [open, setOpen] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([]);
  const [input, setInput] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [kbOffset, setKbOffset] = reactExports.useState(0);
  const bottomRef = reactExports.useRef(null);
  const scrollRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const sendRef = reactExports.useRef(send);
  reactExports.useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKbOffset(offset);
    };
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);
  const onboarding = loadOnboarding();
  const locale = getStoredLocale();
  const userContext = buildUserContext(onboarding);
  const athleteMemory = serializeMemoryForAI(buildAthleteMemory());
  const firstName = onboarding.name?.split(" ")[0] ?? null;
  const quickList = QUICK[locale] ?? QUICK.pt;
  reactExports.useEffect(() => {
    sendRef.current = send;
  });
  reactExports.useEffect(() => {
    const handler = (e) => {
      const { message } = e.detail;
      setOpen(true);
      setTimeout(() => sendRef.current(message), 450);
    };
    window.addEventListener("open-ai-coach", handler);
    return () => window.removeEventListener("open-ai-coach", handler);
  }, []);
  reactExports.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);
  reactExports.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);
  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/chat-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? { Authorization: `Bearer ${token}` } : {}
        },
        body: JSON.stringify({ messages: next, userContext, locale, athleteMemory })
      });
      if (!res.ok || !res.body) throw new Error(`${res.status}`);
      const assistantMsg = { role: "assistant", content: "" };
      setMessages([...next, assistantMsg]);
      setLoading(false);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const chunk = JSON.parse(raw);
            const token2 = chunk.choices[0]?.delta?.content ?? "";
            if (token2) {
              assistantMsg.content += token2;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...assistantMsg };
                return updated;
              });
            }
          } catch {
          }
        }
      }
    } catch {
      setLoading(false);
      setError("Erro ao conectar. Tente novamente.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: !open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.button,
      {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0, opacity: 0 },
        transition: { type: "spring", stiffness: 380, damping: 24 },
        onClick: () => setOpen(true),
        "aria-label": "Abrir AI Coach",
        className: "fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full shadow-glow-primary",
        style: { background: "linear-gradient(135deg,#22d3ee,#3b82f6)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-6 w-6 text-white" })
      },
      "fab"
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setOpen(false),
          className: "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        },
        "backdrop"
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { y: "100%" },
          animate: { y: 0 },
          exit: { y: "100%" },
          transition: { type: "spring", stiffness: 320, damping: 32 },
          className: "fixed left-0 right-0 z-50 flex flex-col rounded-t-3xl border-t border-border bg-background",
          style: {
            bottom: kbOffset,
            maxHeight: kbOffset > 0 ? `calc(100vh - ${kbOffset}px - env(safe-area-inset-top) - 12px)` : "82vh",
            transition: "bottom 0.15s ease, max-height 0.15s ease"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-3 h-1 w-10 rounded-full bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                  style: { background: "linear-gradient(135deg,#22d3ee,#3b82f6)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-5 w-5 text-white" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold", children: "3D Body Scan" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white",
                      style: { background: "linear-gradient(135deg,#22d3ee,#3b82f6)" },
                      children: "AI"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-success" }),
                  "Online · Coach personalizado"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex gap-1", children: [
                messages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      setMessages([]);
                      setError(null);
                    },
                    className: "rounded-full p-2 text-muted-foreground hover:bg-elevated",
                    "aria-label": "Limpar",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setOpen(false),
                    className: "rounded-full p-2 text-muted-foreground hover:bg-elevated",
                    "aria-label": "Fechar",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-5 w-5" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4 h-px bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                ref: scrollRef,
                className: "flex-1 overflow-y-auto py-4 space-y-3",
                style: {
                  paddingLeft: "max(16px, env(safe-area-inset-left))",
                  paddingRight: "max(16px, env(safe-area-inset-right))",
                  WebkitOverflowScrolling: "touch"
                },
                children: [
                  messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-primary/20 bg-surface p-4 text-sm leading-relaxed text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AiAvatar, {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-foreground font-semibold", children: [
                        firstName ? locale === "en" ? `Hey, ${firstName}!` : locale === "es" ? `¡Hola, ${firstName}!` : locale === "de" ? `Hallo, ${firstName}!` : locale === "fr" ? `Bonjour, ${firstName} !` : `Olá, ${firstName}!` : locale === "en" ? "Hey!" : locale === "es" ? "¡Hola!" : locale === "de" ? "Hallo!" : locale === "fr" ? "Bonjour !" : "Olá!",
                        " "
                      ] }),
                      GREETING[locale](null).replace(/^[^\s]+\s/, "")
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2", children: quickList.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => send(q),
                        className: "rounded-2xl border border-border bg-surface px-4 py-3 text-left text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-elevated",
                        children: q
                      },
                      q
                    )) })
                  ] }),
                  messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-end gap-2", m.role === "user" ? "justify-end" : "justify-start"), children: [
                    m.role === "assistant" && /* @__PURE__ */ jsxRuntimeExports.jsx(AiAvatar, {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: cn(
                          "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                          m.role === "user" ? "rounded-br-sm bg-gradient-primary text-primary-foreground" : "rounded-bl-sm border border-border bg-surface text-foreground"
                        ),
                        children: m.content
                      }
                    )
                  ] }, i)),
                  loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AiAvatar, {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl rounded-bl-sm border border-border bg-surface px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        className: "h-2 w-2 rounded-full bg-muted-foreground/60",
                        animate: { y: [0, -5, 0] },
                        transition: { repeat: Infinity, duration: 0.7, delay: i * 0.15 }
                      },
                      i
                    )) }) })
                  ] }),
                  error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-xs text-destructive", children: error }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "border-t border-border p-3",
                style: { paddingBottom: kbOffset > 0 ? "12px" : "calc(12px + env(safe-area-inset-bottom))" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: inputRef,
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          send(input);
                        }
                      },
                      placeholder: PLACEHOLDER[locale] ?? PLACEHOLDER.pt,
                      className: "flex-1 rounded-2xl border border-border bg-elevated px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/40",
                      disabled: loading
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => send(input),
                      disabled: !input.trim() || loading,
                      className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition disabled:opacity-40",
                      style: { background: "linear-gradient(135deg,#22d3ee,#3b82f6)" },
                      "aria-label": "Enviar",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 text-white" })
                    }
                  )
                ] })
              }
            )
          ]
        },
        "panel"
      )
    ] }) })
  ] });
}
function AiAvatar() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "mb-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg",
      style: {
        background: "linear-gradient(135deg,rgba(34,211,238,0.2),rgba(59,130,246,0.2))",
        border: "1px solid rgba(34,211,238,0.25)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-cyan" })
    }
  );
}
export {
  AiChat
};