import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, User, Loader2 } from "lucide-react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { PrimaryButton } from "@/components/PrimaryButton";
import logo from "@/assets/zyrox-logo.png";
import { getStoredLocale, setStoredLocale, type AppLocale } from "@/lib/locale";
import { isOnboarded, loadOnboarding, saveOnboarding } from "@/lib/onboarding";
import { signUp, onAuth } from "@/lib/auth";
import { getAuthCopy } from "@/lib/app-copy";
import { saveProfileToFirestore } from "@/lib/firestore-profile";
import { saveLocalStateToFirestore } from "@/lib/firestore-local-state";

export const Route = createFileRoute("/criar-conta")({
  head: () => ({
    meta: [
      { title: "Criar Conta | 3D Body Scanner" },
      { name: "description", content: "Crie sua conta local 3D Body Scanner e inicie seu onboarding." },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<AppLocale>("pt");
  const authCopy = getAuthCopy();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const signingUpRef = useRef(false);

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  function getPasswordStrength(pwd: string): { level: number; label: string; color: string } {
    if (pwd.length === 0) return { level: 0, label: "", color: "" };
    if (pwd.length < 6) return { level: 1, label: "Fraca", color: "#ef4444" };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const extras = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (pwd.length >= 10 && extras >= 2) return { level: 4, label: "Muito forte", color: "#4ade80" };
    if (pwd.length >= 8 && extras >= 1) return { level: 3, label: "Forte", color: "#22d3ee" };
    return { level: 2, label: "Média", color: "#fb923c" };
  }

  const pwdStrength = getPasswordStrength(password);

  // Redireciona se já estiver autenticado ao abrir a página (não durante o cadastro)
  useEffect(() => {
    const unsub = onAuth((user) => {
      if (signingUpRef.current) return;
      if (user) {
        if (isOnboarded()) {
          navigate({ to: "/app" });
        } else {
          navigate({ to: "/onboarding/$step", params: { step: "1" } });
        }
      }
    });
    return unsub;
  }, [navigate]);

  const handleSubmit = async (event: FormEvent) => {
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
      // Salva onboarding ANTES do signUp para que o onAuth já veja isOnboarded() correto
      const existing = loadOnboarding();
      const mergedProfile = { ...existing, email: trimmedEmail, name: trimmedName };
      saveOnboarding(mergedProfile);
      const cred = await signUp(trimmedEmail, password);
      saveProfileToFirestore(cred.user.uid, mergedProfile).catch(() => {});
      saveLocalStateToFirestore(cred.user.uid).catch(() => {});
      if (isOnboarded()) {
        navigate({ to: "/app" });
      } else {
        navigate({ to: "/onboarding/$step", params: { step: "1" } });
      }
    } catch (err: unknown) {
      signingUpRef.current = false;
      setLoading(false);
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/email-already-in-use") {
        setError("Este e-mail já está em uso.");
      } else if (code === "auth/invalid-email") {
        setError(authCopy.invalidEmail);
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    }
  };

  const handleLocaleChange = (nextLocale: AppLocale) => {
    setStoredLocale(nextLocale);
    setLocale(nextLocale);
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
                  alt="3D Body Scanner"
                  className="relative h-24 w-24 rounded-2xl"
                  style={{ boxShadow: "0 0 0 1px rgba(34,211,238,0.3), 0 0 0 3px rgba(251,146,60,0.15), 0 8px 32px rgba(0,0,0,0.6)" }}
                />
              </div>
              {/* Título com gradiente brand */}
              <h1
                className="font-display text-2xl font-black tracking-tight"
                style={{ background: "linear-gradient(90deg,#22d3ee 0%,#ffffff 45%,#fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                {authCopy.createAccountTitle}
              </h1>
              <p className="mt-1 text-sm" style={{ color: "rgba(148,163,184,0.85)" }}>{authCopy.createAccountSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium" style={{ color: "#94a3b8" }}>{authCopy.nameLabel}</span>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#475569" }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={authCopy.namePlaceholder}
                    className="w-full rounded-xl py-3 pl-9 pr-3 text-sm text-white outline-none transition"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.05)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                </div>
              </label>

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
                    className="w-full rounded-xl py-3 pl-9 pr-3 text-sm text-white outline-none transition"
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
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={authCopy.passwordHint}
                    className="w-full rounded-xl py-3 pl-9 pr-10 text-sm text-white outline-none transition"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.05)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(251,146,60,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition"
                    style={{ color: "#64748b" }}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {pwdStrength.level > 0 && (
                <div className="mt-1 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: level <= pwdStrength.level ? pwdStrength.color : "rgba(255,255,255,0.08)" }}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] font-semibold" style={{ color: pwdStrength.color }}>
                    {pwdStrength.label}
                  </div>
                </div>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium" style={{ color: "#94a3b8" }}>{authCopy.confirmPasswordLabel}</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#475569" }} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder={authCopy.confirmPasswordPlaceholder}
                    className="w-full rounded-xl py-3 pl-9 pr-10 text-sm text-white outline-none transition"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.05)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(251,146,60,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition"
                    style={{ color: "#64748b" }}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {confirmPassword && password !== confirmPassword && (
                <p className="text-[11px] font-medium" style={{ color: "#f87171" }}>
                  As senhas não coincidem
                </p>
              )}

              {error && (
                <p className="rounded-lg px-3 py-2 text-xs font-medium" style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#f87171" }}>
                  {error}
                </p>
              )}

              {/* Botão primário — gradiente laranja */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white transition disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#ea580c,#fb923c,#fdba74)", boxShadow: "0 0 24px rgba(251,146,60,0.35), 0 4px 16px rgba(0,0,0,0.4)" }}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> {authCopy.creatingAccount}</>
                ) : (
                  <>{authCopy.createAccountCta} <ArrowRight className="h-4 w-4" /></>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(100,116,139,0.5)" }}>
          3D Body Scanner — Evolucao com tecnologia
        </p>
      </motion.div>
    </div>
  );
}
