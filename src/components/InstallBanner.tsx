import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, Download } from "lucide-react";

type Platform = "ios" | "android" | "desktop" | null;

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "desktop";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

export function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt?: () => void } | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (sessionStorage.getItem("install-dismissed")) return;

    const p = detectPlatform();
    setPlatform(p);

    if (p === "android") {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as Event & { prompt?: () => void });
        setVisible(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }

    if (p === "ios") {
      const t = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(t);
    }

    if (p === "desktop") {
      const t = setTimeout(() => setVisible(true), 5000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("install-dismissed", "1");
    setVisible(false);
  };

  const installPwa = async () => {
    if (deferredPrompt?.prompt) {
      deferredPrompt.prompt();
    }
    dismiss();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="fixed bottom-20 inset-x-3 z-50 rounded-2xl border border-border shadow-2xl"
          style={{
            background: "var(--surface)",
            boxShadow: "0 0 40px rgba(34,211,238,0.12), 0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <img src="/favicon.png" alt="" className="h-11 w-11 rounded-xl shrink-0 shadow" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-foreground">3D Body Scanner</div>
              <div className="text-xs text-muted-foreground">Instale para acesso rápido e tela cheia</div>
            </div>
            <button
              onClick={dismiss}
              className="shrink-0 rounded-full p-1.5 text-muted-foreground transition hover:bg-elevated hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Divisor */}
          <div className="h-px mx-4" style={{ background: "var(--border)" }} />

          {/* Opções */}
          <div className="px-4 pt-3 pb-4">
            {platform === "ios" ? (
              <div
                className="flex items-start gap-3 rounded-xl p-3"
                style={{ background: "var(--elevated)", border: "1px solid var(--border)" }}
              >
                <Share className="h-5 w-5 shrink-0 text-blue-400 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Abra no <span className="font-semibold text-foreground">Safari</span>, toque em{" "}
                  <Share className="inline h-3 w-3 text-blue-400" />{" "}
                  e selecione{" "}
                  <span className="font-semibold text-foreground">"Adicionar à Tela Inicial"</span>
                </p>
              </div>
            ) : platform === "android" && deferredPrompt ? (
              <button
                onClick={installPwa}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition"
                style={{
                  background: "linear-gradient(135deg,#22d3ee,#0891b2)",
                  boxShadow: "0 4px 14px rgba(34,211,238,0.3)",
                }}
              >
                <Download className="h-4 w-4" /> Instalar app
              </button>
            ) : (
              <div
                className="flex items-center gap-3 rounded-xl p-3"
                style={{ background: "var(--elevated)", border: "1px solid var(--border)" }}
              >
                <Download className="h-5 w-5 shrink-0 text-cyan" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Clique no ícone de instalação na barra do navegador para adicionar à sua área de trabalho.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
