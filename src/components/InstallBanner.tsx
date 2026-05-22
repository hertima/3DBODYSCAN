import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, Plus } from "lucide-react";

type Platform = "ios" | "android" | null;

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return null;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
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
      // Mostra o banner após 3s no iOS
      const t = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("install-dismissed", "1");
    setVisible(false);
  };

  const install = async () => {
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
          style={{ background: "oklch(0.20 0.04 262)", boxShadow: "0 0 40px rgba(34,211,238,0.15)" }}
        >
          <div className="flex items-start gap-3 p-4">
            <img src="/favicon.png" alt="" className="h-12 w-12 rounded-xl shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-foreground">Instalar 3D Body Scanner</div>
              {platform === "ios" ? (
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Abra no <span className="font-semibold text-foreground">Safari</span>, toque em{" "}
                  <Share className="inline h-3.5 w-3.5 text-blue-400" /> e selecione{" "}
                  <span className="font-semibold text-foreground">"Adicionar à Tela Inicial"</span>
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  Instale para acesso rápido e tela cheia sem barra do browser.
                </p>
              )}
              {platform === "android" && (
                <button
                  onClick={install}
                  className="mt-2 flex items-center gap-1.5 rounded-xl bg-gradient-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                >
                  <Plus className="h-3.5 w-3.5" /> Instalar agora
                </button>
              )}
            </div>
            <button onClick={dismiss} className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
