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

function AppStoreBadge() {
  return (
    <div
      className="flex items-center gap-2 rounded-xl px-3 py-2 transition"
      style={{
        border: "1px solid var(--border)",
        background: "var(--elevated)",
        opacity: 0.55,
        cursor: "not-allowed",
      }}
      title="Em breve na App Store"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-current text-foreground" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <div className="text-left leading-none">
        <div className="text-[9px] text-muted-foreground">Em breve</div>
        <div className="text-[11px] font-bold text-foreground">App Store</div>
      </div>
    </div>
  );
}

function PlayStoreBadge() {
  return (
    <div
      className="flex items-center gap-2 rounded-xl px-3 py-2 transition"
      style={{
        border: "1px solid var(--border)",
        background: "var(--elevated)",
        opacity: 0.55,
        cursor: "not-allowed",
      }}
      title="Em breve no Google Play"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.18 23.76A2 2 0 0 1 2 22V2a2 2 0 0 1 1.18-1.76l11.19 11.76z" fill="#EA4335"/>
        <path d="M20.5 10.44l-2.83-1.63L14.37 12l3.3 3.19 2.83-1.63a2 2 0 0 0 0-3.12z" fill="#FBBC04"/>
        <path d="M3.18.24 14.37 12 17.67 8.81 4.72.15A2 2 0 0 0 3.18.24z" fill="#4285F4"/>
        <path d="M3.18 23.76c.48.28 1.04.32 1.54.09l12.95-7.66-3.3-3.19z" fill="#34A853"/>
      </svg>
      <div className="text-left leading-none">
        <div className="text-[9px] text-muted-foreground">Em breve</div>
        <div className="text-[11px] font-bold text-foreground">Google Play</div>
      </div>
    </div>
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
          <div className="px-4 pt-3 pb-4 space-y-3">

            {/* PWA — instalar agora */}
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Instalar agora
              </div>
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

            {/* Lojas */}
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Lojas (em breve)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <AppStoreBadge />
                <PlayStoreBadge />
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
