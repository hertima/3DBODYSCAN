import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, User, Loader2 } from "lucide-react";
import logo from "@/assets/zyrox-logo.png";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { getStoredLocale, setStoredLocale, SUPPORTED_LOCALES, type AppLocale } from "@/lib/locale";
import { isOnboarded, loadOnboarding, saveOnboarding } from "@/lib/onboarding";
import { signUp, onAuth } from "@/lib/auth";
import { getAuthCopy } from "@/lib/app-copy";
import { saveProfileToFirestore } from "@/lib/firestore-profile";
import { saveLocalStateToFirestore } from "@/lib/firestore-local-state";

export const Route = createFileRoute("/criar-conta")({
  head: () => ({
    meta: [
      { title: "Criar Conta | 3D Body Scanner" },
      { name: "description", content: "Crie sua conta 3D Body Scanner e inicie seu onboarding." },
    ],
  }),
  component: SignUpPage,
});

function FlagButton({ code, flagSrc, nativeLabel, selected, onClick }: {
  code: AppLocale;
  flagSrc: string;
  nativeLabel: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={nativeLabel}
      aria-label={nativeLabel}
      className="transition-transform active:scale-90"
    >
      <span
        className="inline-flex overflow-hidden rounded-[5px] transition"
        style={{
          width: 36,
          height: 26,
          border: selected ? "2px solid rgba(34,211,238,0.85)" : "2px solid transparent",
          boxShadow: selected ? "0 0 8px rgba(34,211,238,0.4)" : undefined,
          opacity: selected ? 1 : 0.5,
        }}
      >
        <img src={flagSrc} alt={code} className="h-full w-full object-cover" loading="lazy" />
      </span>
    </button>
  );
}

function SignUpPage() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<AppLocale>("pt");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const signingUpRef = useRef(false);

  const authCopy = getAuthCopy(locale);

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  useEffect(() => {
    const unsub = onAuth((user) => {
      if (signingUpRef.current) return;
      if (user) {
        if (isOnboarded()) navigate({ to: "/app" });
        else navigate({ to: "/onboarding/$step", params: { step: "1" } });
      }
    });
    return unsub;
  }, [navigate]);

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName) { setError(authCopy.missingName); return; }
    if (!trimmedEmail) { setError(authCopy.invalidEmail); return; }
    if (password.length < 6) { setError(authCopy.weakPassword); return; }
    if (password !== confirmPassword) { setError(authCopy.passwordMismatch); return; }

    setLoading(true);
    signingUpRef.current = true;
    try {
      const existing = loadOnboarding();
      const mergedProfile = { ...existing, email: trimmedEmail, name: trimmedName };
      saveOnboarding(mergedProfile);
      const cred = await signUp(trimmedEmail, password);
      saveProfileToFirestore(cred.user.uid, mergedProfile).catch(() => {});
      saveLocalStateToFirestore(cred.user.uid).catch(() => {});
      if (isOnboarded()) navigate({ to: "/app" });
      else navigate({ to: "/onboarding/$step", params: { step: "1" } });
    } catch (err: unknown) {
      signingUpRef.current = false;
      setLoading(false);
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/email-already-in-use") setError("Este e-mail já está em uso.");
      else if (code === "auth/invalid-email") setError(authCopy.invalidEmail);
      else setError("Erro ao criar conta. Tente novamente.");
    }
  };

  const handleLocaleChange = (nextLocale: AppLocale) => {
    setStoredLocale(nextLocale);
    setLocale(nextLocale);
    window.location.reload();
  };

  const inputStyle = {
    border: "1px solid var(--border)",
    background: "var(--elevated)",
    color: "var(--foreground)",
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.10) 0%,transparent 70%)" }} />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[600px] w-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle,rgba(251,146,60,0.10) 0%,transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="relative overflow-hidden rounded-3xl p-px"
          style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.25),rgba(128,128,128,0.08) 50%,rgba(251,146,60,0.25))" }}
        >
          <div className="rounded-3xl p-6" style={{ background: "var(--surface)", backdropFilter: "blur(24px)" }}>

            {/* Bandeiras + toggle */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {SUPPORTED_LOCALES.map((loc) => (
                  <FlagButton
                    key={loc.code}
                    code={loc.code}
                    flagSrc={loc.flagSrc}
                    nativeLabel={loc.nativeLabel}
                    selected={locale === loc.code}
                    onClick={() => handleLocaleChange(loc.code)}
                  />
                ))}
              </div>
              <ThemeToggleButton />
            </div>

            {/* Voltar */}
            <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-80" style={{ color: "#22d3ee" }}>
              <ArrowLeft className="h-4 w-4" />
              {authCopy.backToLogin}
            </Link>

            {/* Logo */}
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-3xl blur-xl" style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.5),rgba(251,146,60,0.5))", transform: "scale(1.15)" }} />
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.45, type: "spring" }}
                  src={logo}
                  alt="3D Body Scanner"
                  className="relative h-24 w-24 rounded-2xl"
                  style={{ boxShadow: "0 0 0 1px rgba(34,211,238,0.3), 0 0 0 3px rgba(251,146,60,0.15), 0 8px 32px rgba(0,0,0,0.3)" }}
                />
              </div>
              <h1
                className="font-display text-2xl font-black tracking-tight"
                style={{ background: "linear-gradient(90deg,#22d3ee 0%,var(--foreground) 45%,#fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                {authCopy.createAccountTitle}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{authCopy.createAccountSubtitle}</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Nome */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{authCopy.nameLabel}</span>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={authCopy.namePlaceholder}
                    className="w-full rounded-xl py-3 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                </div>
              </label>

              {/* Email */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{authCopy.emailLabel}</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={authCopy.emailPlaceholder}
                    className="w-full rounded-xl py-3 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                </div>
              </label>

              {/* Senha */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{authCopy.passwordLabel}</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={authCopy.passwordHint}
                    className="w-full rounded-xl py-3 pl-9 pr-10 text-sm outline-none transition placeholder:text-muted-foreground"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(251,146,60,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {/* Força da senha */}
              {pwdStrength.level > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div key={level} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: level <= pwdStrength.level ? pwdStrength.color : "var(--border)" }} />
                    ))}
                  </div>
                  <div className="text-[10px] font-semibold" style={{ color: pwdStrength.color }}>{pwdStrength.label}</div>
                </div>
              )}

              {/* Confirmar senha */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{authCopy.confirmPasswordLabel}</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={authCopy.confirmPasswordPlaceholder}
                    className="w-full rounded-xl py-3 pl-9 pr-10 text-sm outline-none transition placeholder:text-muted-foreground"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(251,146,60,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition hover:text-foreground">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {confirmPassword && password !== confirmPassword && (
                <p className="text-[11px] font-medium" style={{ color: "#f87171" }}>As senhas não coincidem</p>
              )}

              {error && (
                <p className="rounded-lg px-3 py-2 text-xs font-medium" style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#f87171" }}>
                  {error}
                </p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white transition disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#ea580c,#fb923c,#fdba74)", boxShadow: "0 0 24px rgba(251,146,60,0.35), 0 4px 16px rgba(0,0,0,0.25)" }}
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
      </motion.div>
    </div>
  );
}
