import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import logo from "@/assets/zyrox-logo.png";
import { getAuthCopy } from "@/lib/app-copy";
import { getStoredLocale, setStoredLocale } from "@/lib/locale";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar Senha | 3D Body Scan" },
      { name: "description", content: "Recuperacao local de senha no ambiente 3D Body Scan." },
    ],
  }),
  component: RecoverPasswordPage,
});

function RecoverPasswordPage() {
  const [locale, setLocale] = useState(getStoredLocale());
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const authCopy = getAuthCopy();
  const VALID_EMAIL = "herculesacademiarv@gmail.com";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const sanitizedEmail = email.trim().toLowerCase();
    if (!sanitizedEmail) {
      setError(authCopy.recoverMissingEmail);
      return;
    }

    if (sanitizedEmail === VALID_EMAIL) {
      setMessage(authCopy.recoverDemoFound);
      return;
    }

    setMessage(authCopy.recoverDemoOnly);
  };

  const handleLocaleChange = (nextLocale: string) => {
    setStoredLocale(nextLocale as typeof locale);
    setLocale(nextLocale as typeof locale);
    window.location.reload();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 text-foreground" style={{ background: "#060b14" }}>
      {/* Glow ciano — esquerda */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.22) 0%,transparent 70%)" }} />
      {/* Glow laranja — direita */}
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[600px] w-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle,rgba(251,146,60,0.22) 0%,transparent 70%)" }} />
      {/* Orb central */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: "rgba(251,191,36,0.08)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card com borda gradiente */}
        <div className="relative overflow-hidden rounded-3xl p-px" style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.25),rgba(255,255,255,0.05) 50%,rgba(251,146,60,0.25))" }}>
          <div className="rounded-3xl p-6" style={{ background: "rgba(10,15,26,0.92)", backdropFilter: "blur(24px)" }}>

            <div className="mb-4 flex justify-end">
              <LocaleSwitcher value={locale} onChange={(next) => handleLocaleChange(next)} compact />
            </div>
            <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium hover:opacity-80" style={{ color: "#22d3ee" }}>
              <ArrowLeft className="h-4 w-4" />
              {authCopy.backToLogin}
            </Link>

            <div className="mb-6 flex flex-col items-center text-center">
              {/* Logo com duplo anel ciano + laranja */}
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-3xl blur-xl" style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.5),rgba(251,146,60,0.5))", transform: "scale(1.15)" }} />
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.45, type: "spring" }}
                  src={logo}
                  alt="3D Body Scan"
                  className="relative h-24 w-24 rounded-2xl"
                  style={{ boxShadow: "0 0 0 1px rgba(34,211,238,0.3), 0 0 0 3px rgba(251,146,60,0.15), 0 8px 32px rgba(0,0,0,0.6)" }}
                />
              </div>
              {/* Título com gradiente brand */}
              <h1
                className="font-display text-2xl font-black tracking-tight"
                style={{ background: "linear-gradient(90deg,#22d3ee 0%,#ffffff 45%,#fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                {authCopy.recoverTitle}
              </h1>
              <p className="mt-1 text-sm" style={{ color: "rgba(148,163,184,0.85)" }}>{authCopy.recoverSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium" style={{ color: "#94a3b8" }}>{authCopy.emailLabel}</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#475569" }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={authCopy.emailPlaceholder}
                    className="w-full rounded-xl py-2.5 pl-9 pr-3 text-sm text-white outline-none transition"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.05)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                </div>
              </label>

              {error && (
                <p className="rounded-lg px-3 py-2 text-xs font-medium" style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#f87171" }}>
                  {error}
                </p>
              )}

              {message && (
                <p className="rounded-lg px-3 py-2 text-xs font-medium" style={{ border: "1px solid rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.08)", color: "#22d3ee" }}>
                  {message}
                </p>
              )}

              {/* Botão primário — gradiente laranja */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white transition"
                style={{ background: "linear-gradient(135deg,#ea580c,#fb923c,#fdba74)", boxShadow: "0 0 24px rgba(251,146,60,0.35), 0 4px 16px rgba(0,0,0,0.4)" }}
              >
                {authCopy.recoverCta}
              </motion.button>
            </form>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(100,116,139,0.5)" }}>
          3D Body Scan — Evolucao com tecnologia
        </p>
      </motion.div>
    </div>
  );
}
