import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import logo from "@/assets/zyrox-logo.png";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { getStoredLocale, setStoredLocale, SUPPORTED_LOCALES, type AppLocale } from "@/lib/locale";
import { clearOnboarding, isOnboarded, saveOnboarding } from "@/lib/onboarding";
import { getAuthCopy } from "@/lib/app-copy";
import { signIn, signInWithGoogle, signInWithApple, onAuth } from "@/lib/auth";
import { loadProfileFromFirestore } from "@/lib/firestore-profile";
import {
  clearManagedLocalState,
  restoreLocalStateFromFirestore,
  saveLocalStateToFirestore,
} from "@/lib/firestore-local-state";

const SplashScreen = lazy(() =>
  import("@/components/SplashScreen").then((module) => ({ default: module.SplashScreen })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar | 3D Body Scanner" },
      { name: "description", content: "Acesse sua conta 3D Body Scanner e continue sua evolucao." },
    ],
  }),
  component: LoginPage,
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
      className="relative flex flex-col items-center gap-1 transition-transform active:scale-90"
    >
      <span
        className="inline-flex overflow-hidden rounded-[5px] transition"
        style={{
          width: 36,
          height: 26,
          border: selected
            ? "2px solid rgba(34,211,238,0.85)"
            : "2px solid transparent",
          boxShadow: selected ? "0 0 8px rgba(34,211,238,0.4)" : undefined,
          opacity: selected ? 1 : 0.5,
        }}
      >
        <img src={flagSrc} alt={code} className="h-full w-full object-cover" loading="lazy" />
      </span>
    </button>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<AppLocale>("pt");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState("");
  const [showSplash, setShowSplash] = useState(false);
  const authCopy = getAuthCopy(locale);

  useEffect(() => {
    setLocale(getStoredLocale());
    if (typeof window !== "undefined" && !sessionStorage.getItem("zyrox_splash_shown")) {
      setShowSplash(true);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuth((user) => {
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signIn(email.trim().toLowerCase(), password);

      try {
        const profile = await loadProfileFromFirestore(cred.user.uid);
        if (profile) {
          saveOnboarding(profile);
        } else {
          clearOnboarding();
        }
      } catch {}

      if (isOnboarded()) {
        navigate({ to: "/app" });
      } else {
        navigate({ to: "/onboarding/$step", params: { step: "1" } });
      }

      void restoreLocalStateFromFirestore(cred.user.uid, { replaceLocal: true })
        .then((restoredLocalState) => {
          if (!restoredLocalState) clearManagedLocalState();
          return saveLocalStateToFirestore(cred.user.uid);
        })
        .catch(() => {});
    } catch (err: unknown) {
      setLoading(false);
      const code = (err as { code?: string }).code ?? "";
      if (
        code === "auth/invalid-credential" ||
        code === "auth/user-not-found" ||
        code === "auth/wrong-password"
      ) {
        setError(authCopy.invalidCredentials);
      } else if (code === "auth/invalid-email") {
        setError(authCopy.invalidEmail);
      } else if (code === "auth/too-many-requests") {
        setError("Muitas tentativas. Tente novamente mais tarde.");
      } else {
        setError(authCopy.invalidCredentials);
      }
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setError("");
    setSocialLoading(provider);
    try {
      await (provider === "google" ? signInWithGoogle() : signInWithApple());
      if (isOnboarded()) {
        navigate({ to: "/app" });
      } else {
        navigate({ to: "/onboarding/$step", params: { step: "1" } });
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        setError(authCopy.invalidCredentials);
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const handleLocaleChange = (nextLocale: AppLocale) => {
    setStoredLocale(nextLocale);
    setLocale(nextLocale);
    window.location.reload();
  };

  return (
    <>
      {showSplash && (
        <Suspense fallback={null}>
          <SplashScreen
            onFinish={() => {
              sessionStorage.setItem("zyrox_splash_shown", "1");
              setShowSplash(false);
            }}
          />
        </Suspense>
      )}

      <div
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        {/* Glow ciano */}
        <div
          className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[500px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle,rgba(34,211,238,0.10) 0%,transparent 70%)" }}
        />
        {/* Glow laranja */}
        <div
          className="pointer-events-none absolute -right-40 bottom-0 h-[600px] w-[500px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle,rgba(251,146,60,0.10) 0%,transparent 70%)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-sm"
        >
          {/* Card */}
          <div
            className="relative overflow-hidden rounded-3xl p-px"
            style={{
              background:
                "linear-gradient(135deg,rgba(34,211,238,0.25),rgba(128,128,128,0.08) 50%,rgba(251,146,60,0.25))",
            }}
          >
            <div
              className="rounded-3xl p-6"
              style={{
                background: "var(--surface)",
                backdropFilter: "blur(24px)",
              }}
            >
              {/* Bandeiras + toggle de tema */}
              <div className="mb-5 flex items-center justify-between">
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

              {/* Logo */}
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div
                    className="absolute inset-0 rounded-3xl blur-xl"
                    style={{
                      background:
                        "linear-gradient(135deg,rgba(34,211,238,0.5),rgba(251,146,60,0.5))",
                      transform: "scale(1.15)",
                    }}
                  />
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.45, type: "spring" }}
                    src={logo}
                    alt="3D Body Scanner"
                    className="relative h-28 w-28 rounded-2xl"
                    style={{
                      boxShadow:
                        "0 0 0 1px rgba(34,211,238,0.3), 0 0 0 3px rgba(251,146,60,0.15), 0 8px 32px rgba(0,0,0,0.4)",
                    }}
                  />
                </div>
                <h1
                  className="font-display text-2xl font-black tracking-tight"
                  style={{
                    background:
                      "linear-gradient(90deg,#22d3ee 0%,var(--foreground) 45%,#fb923c 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  3D Body Scanner
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{authCopy.loginSubtitle}</p>
              </div>

              {/* Botões sociais */}
              <div className="mb-4 grid grid-cols-2 gap-2">
                {/* Apple */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("apple")}
                  disabled={!!socialLoading}
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-50"
                  style={{ border: "1px solid var(--border)", background: "var(--elevated)", color: "var(--foreground)" }}
                >
                  {socialLoading === "apple" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  )}
                  Apple
                </button>
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  disabled={!!socialLoading}
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-50"
                  style={{ border: "1px solid var(--border)", background: "var(--elevated)", color: "var(--foreground)" }}
                >
                  {socialLoading === "google" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  )}
                  Google
                </button>
              </div>

              {/* Divisor */}
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: "var(--border)" }} />
                <span className="text-[11px] text-muted-foreground">{authCopy.emailDivider}</span>
                <div className="h-px flex-1" style={{ background: "var(--border)" }} />
              </div>

              {/* Formulário */}
              <form onSubmit={onSubmit} className="space-y-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {authCopy.emailLabel}
                  </span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={authCopy.emailPlaceholder}
                      className="w-full rounded-xl py-3 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground"
                      style={{
                        border: "1px solid var(--border)",
                        background: "var(--elevated)",
                        color: "var(--foreground)",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {authCopy.passwordLabel}
                  </span>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPwd ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={authCopy.passwordPlaceholder}
                      className="w-full rounded-xl py-3 pl-9 pr-10 text-sm outline-none transition placeholder:text-muted-foreground"
                      style={{
                        border: "1px solid var(--border)",
                        background: "var(--elevated)",
                        color: "var(--foreground)",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(251,146,60,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition hover:text-foreground"
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>

                <div className="flex justify-end pt-1 text-xs">
                  <Link
                    to="/recuperar-senha"
                    className="font-medium transition hover:opacity-80"
                    style={{ color: "#22d3ee" }}
                  >
                    {authCopy.forgotPassword}
                  </Link>
                </div>

                {error && (
                  <p
                    className="rounded-lg px-3 py-2 text-xs font-medium"
                    style={{
                      border: "1px solid rgba(239,68,68,0.3)",
                      background: "rgba(239,68,68,0.08)",
                      color: "#f87171",
                    }}
                  >
                    {error}
                  </p>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold text-white transition disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg,#ea580c,#fb923c,#fdba74)",
                    boxShadow: "0 0 24px rgba(251,146,60,0.35), 0 4px 16px rgba(0,0,0,0.25)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> {authCopy.signingIn}
                    </>
                  ) : (
                    <>
                      {authCopy.signIn} <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-5 text-center text-xs text-muted-foreground">
                Novo no 3D Body Scanner?{" "}
                <Link
                  to="/criar-conta"
                  className="font-semibold text-foreground transition hover:opacity-80"
                >
                  {authCopy.createAccount}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
