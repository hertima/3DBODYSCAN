import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronDown, RotateCcw, Send, Sparkles } from "lucide-react";
import { buildUserContext, type AILocale, type ChatMessage } from "@/lib/ai-service";
import { buildAthleteMemory, serializeMemoryForAI } from "@/lib/athlete-memory";
import { loadOnboarding } from "@/lib/onboarding";
import { getStoredLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";

// ── Perguntas rápidas por idioma ─────────────────────────────────
const QUICK: Record<AILocale, string[]> = {
  pt: [
    "Qual exercício priorizar essa semana?",
    "Como sair de um plateau de evolução?",
    "Como melhorar minha recuperação muscular?",
    "Devo ajustar minha dieta para meu objetivo?",
  ],
  es: [
    "¿Qué ejercicio priorizar esta semana?",
    "¿Cómo salir de un plateau de progreso?",
    "¿Cómo mejorar mi recuperación muscular?",
    "¿Debo ajustar mi dieta según mi objetivo?",
  ],
  en: [
    "Which exercise should I prioritize this week?",
    "How do I break through a training plateau?",
    "How can I improve muscle recovery?",
    "Should I adjust my diet for my goal?",
  ],
  fr: [
    "Quel exercice prioriser cette semaine ?",
    "Comment sortir d'un plateau d'entraînement ?",
    "Comment améliorer ma récupération musculaire ?",
    "Dois-je ajuster mon alimentation selon mon objectif ?",
  ],
  de: [
    "Welche Übung soll ich diese Woche priorisieren?",
    "Wie überwinde ich ein Training-Plateau?",
    "Wie verbessere ich meine Muskelregeneration?",
    "Sollte ich meine Ernährung anpassen?",
  ],
};

const GREETING: Record<AILocale, (name: string | null) => string> = {
  pt: (n) => `${n ? `Olá, ${n}!` : "Olá!"} Sou seu AI Coach pessoal — treinador e nutricionista de elite. Posso ajudar com treino, dieta, recuperação e progressão de carga. O que precisa hoje?`,
  es: (n) => `${n ? `¡Hola, ${n}!` : "¡Hola!"} Soy tu AI Coach personal — entrenador y nutricionista de élite. Puedo ayudarte con entrenamiento, dieta, recuperación y progresión de carga. ¿Qué necesitas hoy?`,
  en: (n) => `${n ? `Hey, ${n}!` : "Hey!"} I'm your personal AI Coach — elite trainer and nutritionist. I can help with workouts, diet, recovery, and load progression. What do you need today?`,
  fr: (n) => `${n ? `Bonjour, ${n} !` : "Bonjour !"} Je suis votre AI Coach personnel — entraîneur et nutritionniste d'élite. Je peux vous aider avec l'entraînement, l'alimentation, la récupération et la progression. Que souhaitez-vous aujourd'hui ?`,
  de: (n) => `${n ? `Hallo, ${n}!` : "Hallo!"} Ich bin dein persönlicher AI Coach — Elite-Trainer und Ernährungsexperte. Ich helfe dir bei Training, Ernährung, Regeneration und Lastprogression. Was brauchst du heute?`,
};

const PLACEHOLDER: Record<AILocale, string> = {
  pt: "Pergunte ao seu AI Coach...",
  es: "Pregunta a tu AI Coach...",
  en: "Ask your AI Coach...",
  fr: "Demandez à votre AI Coach...",
  de: "Frage deinen AI Coach...",
};

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kbOffset, setKbOffset] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sendRef = useRef(send);

  // Sobe o painel quando teclado iOS abre
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKbOffset(offset);
    };
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => { vv.removeEventListener("resize", update); vv.removeEventListener("scroll", update); };
  }, []);

  const onboarding = loadOnboarding();
  const locale = getStoredLocale() as AILocale;
  const userContext = buildUserContext(onboarding);
  const athleteMemory = serializeMemoryForAI(buildAthleteMemory());
  const firstName = onboarding.name?.split(" ")[0] ?? null;
  const quickList = QUICK[locale] ?? QUICK.pt;

  useEffect(() => { sendRef.current = send; });

  useEffect(() => {
    const handler = (e: Event) => {
      const { message } = (e as CustomEvent<{ message: string }>).detail;
      setOpen(true);
      setTimeout(() => sendRef.current(message), 450);
    };
    window.addEventListener("open-ai-coach", handler);
    return () => window.removeEventListener("open-ai-coach", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    // scroll direto no container — mais confiável no iOS com fixed panels
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
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
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: next, userContext, locale, athleteMemory }),
      });

      if (!res.ok || !res.body) throw new Error(`${res.status}`);

      const assistantMsg: ChatMessage = { role: "assistant", content: "" };
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
            const chunk = JSON.parse(raw) as { choices: [{ delta: { content?: string } }] };
            const token = chunk.choices[0]?.delta?.content ?? "";
            if (token) {
              assistantMsg.content += token;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...assistantMsg };
                return updated;
              });
            }
          } catch { /* chunk incompleto, ignora */ }
        }
      }
    } catch {
      setLoading(false);
      setError("Erro ao conectar. Tente novamente.");
    }
  }

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            onClick={() => setOpen(true)}
            aria-label="Abrir AI Coach"
            className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full shadow-glow-primary"
            style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)" }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Painel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              key="panel"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed left-0 right-0 z-50 flex flex-col rounded-t-3xl border-t border-border bg-background"
              style={{
                bottom: kbOffset,
                maxHeight: kbOffset > 0 ? `calc(100vh - ${kbOffset}px - env(safe-area-inset-top) - 12px)` : "82vh",
                transition: "bottom 0.15s ease, max-height 0.15s ease",
              }}
            >
              {/* Handle */}
              <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border" />

              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                  style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)" }}
                >
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-sm font-bold">3D Body Scan</span>
                    <span
                      className="rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white"
                      style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)" }}
                    >
                      AI
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                    Online · Coach personalizado
                  </div>
                </div>
                <div className="ml-auto flex gap-1">
                  {messages.length > 0 && (
                    <button
                      onClick={() => { setMessages([]); setError(null); }}
                      className="rounded-full p-2 text-muted-foreground hover:bg-elevated"
                      aria-label="Limpar"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full p-2 text-muted-foreground hover:bg-elevated"
                    aria-label="Fechar"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mx-4 h-px bg-border" />

              {/* Mensagens */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto py-4 space-y-3"
                style={{
                  paddingLeft: "max(16px, env(safe-area-inset-left))",
                  paddingRight: "max(16px, env(safe-area-inset-right))",
                  WebkitOverflowScrolling: "touch",
                } as React.CSSProperties}
              >
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-primary/20 bg-surface p-4 text-sm leading-relaxed text-muted-foreground">
                      <AiAvatar />
                      <span className="ml-1 text-foreground font-semibold">
                        {firstName ? (locale === "en" ? `Hey, ${firstName}!` : locale === "es" ? `¡Hola, ${firstName}!` : locale === "de" ? `Hallo, ${firstName}!` : locale === "fr" ? `Bonjour, ${firstName} !` : `Olá, ${firstName}!`) : (locale === "en" ? "Hey!" : locale === "es" ? "¡Hola!" : locale === "de" ? "Hallo!" : locale === "fr" ? "Bonjour !" : "Olá!")}{" "}
                      </span>
                      {GREETING[locale](null).replace(/^[^\s]+\s/, "")}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {quickList.map((q) => (
                        <button
                          key={q}
                          onClick={() => send(q)}
                          className="rounded-2xl border border-border bg-surface px-4 py-3 text-left text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-elevated"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div key={i} className={cn("flex items-end gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                    {m.role === "assistant" && <AiAvatar />}
                    <div
                      className={cn(
                        "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                        m.role === "user"
                          ? "rounded-br-sm bg-gradient-primary text-primary-foreground"
                          : "rounded-bl-sm border border-border bg-surface text-foreground",
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-end gap-2">
                    <AiAvatar />
                    <div className="rounded-2xl rounded-bl-sm border border-border bg-surface px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="h-2 w-2 rounded-full bg-muted-foreground/60"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-xs text-destructive">
                    {error}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div
                className="border-t border-border p-3"
                style={{ paddingBottom: kbOffset > 0 ? "12px" : "calc(12px + env(safe-area-inset-bottom))" }}
              >
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    placeholder={PLACEHOLDER[locale] ?? PLACEHOLDER.pt}
                    className="flex-1 rounded-2xl border border-border bg-elevated px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/40"
                    disabled={loading}
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={!input.trim() || loading}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)" }}
                    aria-label="Enviar"
                  >
                    <Send className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function AiAvatar() {
  return (
    <div
      className="mb-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg"
      style={{
        background: "linear-gradient(135deg,rgba(34,211,238,0.2),rgba(59,130,246,0.2))",
        border: "1px solid rgba(34,211,238,0.25)",
      }}
    >
      <Sparkles className="h-3 w-3 text-cyan" />
    </div>
  );
}
