import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Apple, Chrome } from "lucide-react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { PrimaryButton } from "@/components/PrimaryButton";
import logo from "@/assets/zyrox-logo.png";
import { getStoredLocale, setStoredLocale } from "@/lib/locale";
import { isOnboarded, loadOnboarding, saveOnboarding } from "@/lib/onboarding";
import { getAuthCopy } from "@/lib/app-copy";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar | 3D Body Scan" },
      { name: "description", content: "Acesse sua conta 3D Body Scan e continue sua evolucao." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState(getStoredLocale());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const authCopy = getAuthCopy();

  // Novo usuário (sem dados de onboarding) → vai para onboarding primeiro
  useEffect(() => {
    const existing = loadOnboarding();
    const hasStarted = Object.keys(existing).length > 0;
    if (!hasStarted) {
      navigate({ to: "/onboarding/$step", params: { step: "1" } });
    }
  }, [navigate]);
  const VALID_EMAIL = "herculesacademiarv@gmail.com";
  const VALID_PASSWORD = "123456";

  const deriveDisplayName = (value: string) =>
    value
      .split("@")[0]
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const proceedAfterLogin = () => {
    const current = loadOnboarding();
    saveOnboarding({
      ...current,
      email: VALID_EMAIL,
      name: current.name?.trim() || deriveDisplayName(VALID_EMAIL),
    });

    if (isOnboarded()) {
      navigate({ to: "/app" });
      return;
    }

    navigate({ to: "/onboarding/$step", params: { step: "1" } });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD) {
        proceedAfterLogin();
      } else {
        setLoading(false);
        setError(authCopy.invalidCredentials);
      }
    }, 700);
  };

  const handleLocaleChange = (nextLocale: string) => {
    setStoredLocale(nextLocale as typeof locale);
    setLocale(nextLocale as typeof locale);
    window.location.reload();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 text-foreground" style={{ background: "#060b14" }}>

      {/* Glow ciano — esquerda (lado do "3" do logo) */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.22) 0%,transparent 70%)" }} />
      {/* Glow laranja — direita (lado do "D" do logo) */}
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[600px] w-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle,rgba(251,146,60,0.22) 0%,transparent 70%)" }} />
      {/* Orb central — espelho da luz central do logo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: "rgba(251,191,36,0.08)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Card principal */}
        <div className="relative overflow-hidden rounded-3xl p-px" style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.25),rgba(255,255,255,0.05) 50%,rgba(251,146,60,0.25))" }}>
          <div className="rounded-3xl p-6" style={{ background: "rgba(10,15,26,0.92)", backdropFilter: "blur(24px)" }}>

            {/* Locale top right */}
            <div className="mb-4 flex justify-end">
              <LocaleSwitcher value={locale} onChange={(next) => handleLocaleChange(next)} compact />
            </div>

            {/* Hero do logo */}
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
                  className="relative h-28 w-28 rounded-2xl"
                  style={{ boxShadow: "0 0 0 1px rgba(34,211,238,0.3), 0 0 0 3px rgba(251,146,60,0.15), 0 8px 32px rgba(0,0,0,0.6)" }}
                />
              </div>
              {/* Nome com gradiente do logo */}
              <h1
                className="font-display text-2xl font-black tracking-tight"
                style={{ background: "linear-gradient(90deg,#22d3ee 0%,#ffffff 45%,#fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                3D Body Scan
              </h1>
              <p className="mt-1 text-sm" style={{ color: "rgba(148,163,184,0.85)" }}>{authCopy.loginSubtitle}</p>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {[{ Icon: Chrome, label: "Google" }, { Icon: Apple, label: "Apple" }].map(({ Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  disabled
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium opacity-50 transition"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
                >
                  <Icon className="h-4 w-4" /> {label}
                  <span className="rounded-full px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em]" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>{authCopy.socialSoon}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(100,116,139,0.7)" }}>
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              {authCopy.emailDivider}
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Formulário */}
            <form onSubmit={onSubmit} className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium" style={{ color: "#94a3b8" }}>{authCopy.emailLabel}</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#475569" }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={authCopy.emailPlaceholder}
                    className="w-full rounded-xl py-2.5 pl-9 pr-3 text-sm text-white outline-none transition"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.05)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium" style={{ color: "#94a3b8" }}>{authCopy.passwordLabel}</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#475569" }} />
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={authCopy.passwordPlaceholder}
                    className="w-full rounded-xl py-2.5 pl-9 pr-10 text-sm text-white outline-none transition"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.05)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(251,146,60,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition"
                    style={{ color: "#64748b" }}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="inline-flex items-center gap-2" style={{ color: "#64748b" }}>
                  <input type="checkbox" className="h-3.5 w-3.5 rounded" style={{ accentColor: "#fb923c" }} />
                  {authCopy.rememberMe}
                </label>
                <Link to="/recuperar-senha" className="font-medium transition hover:opacity-80" style={{ color: "#22d3ee" }}>
                  {authCopy.forgotPassword}
                </Link>
              </div>

              {error && (
                <p className="rounded-lg px-3 py-2 text-xs font-medium" style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#f87171" }}>
                  {error}
                </p>
              )}

              {/* Botão Entrar — gradiente laranja do logo */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white transition disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#ea580c,#fb923c,#fdba74)", boxShadow: "0 0 24px rgba(251,146,60,0.35), 0 4px 16px rgba(0,0,0,0.4)" }}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> {authCopy.signingIn}</>
                ) : (
                  <>{authCopy.signIn} <ArrowRight className="h-4 w-4" /></>
                )}
              </motion.button>
            </form>

            <p className="mt-5 text-center text-xs" style={{ color: "#475569" }}>
              Novo no 3D Body Scan?{" "}
              <Link to="/criar-conta" className="font-semibold text-white transition hover:opacity-80">
                {authCopy.createAccount}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(100,116,139,0.5)" }}>
          {authCopy.builtForEvolution}
        </p>
      </motion.div>
    </div>
  );
}
