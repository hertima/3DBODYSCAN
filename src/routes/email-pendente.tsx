import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { getStoredLocale } from "@/lib/locale";

export const Route = createFileRoute("/email-pendente")({
  head: () => ({
    meta: [{ title: "Verifique seu e-mail | 3D Body Scanner" }],
  }),
  component: EmailPendentePage,
});

const COPY = {
  pt: {
    heading: "Confirme seu e-mail",
    codeSentTo: "Código enviado para",
    verifying: "Verificando...",
    confirmed: "E-mail confirmado!",
    redirecting: "Redirecionando...",
    errorWrong: "Código incorreto. Verifique e tente novamente.",
    errorManyWrong: "Código incorreto. Solicite um novo código abaixo.",
    errorVerify: "Erro ao verificar. Tente novamente.",
    errorResend: "Erro ao reenviar. Tente novamente.",
    noCode: "Não recebeu o código?",
    resend: "Reenviar código",
    resending: "Reenviando...",
    resent: "Código reenviado!",
    checkSpam: "Verifique também o spam.",
    signOut: "Sair",
  },
  es: {
    heading: "Confirma tu correo",
    codeSentTo: "Código enviado a",
    verifying: "Verificando...",
    confirmed: "¡Correo confirmado!",
    redirecting: "Redirigiendo...",
    errorWrong: "Código incorrecto. Verifica e intenta de nuevo.",
    errorManyWrong: "Código incorrecto. Solicita un nuevo código abajo.",
    errorVerify: "Error al verificar. Intenta de nuevo.",
    errorResend: "Error al reenviar. Intenta de nuevo.",
    noCode: "¿No recibiste el código?",
    resend: "Reenviar código",
    resending: "Reenviando...",
    resent: "¡Código reenviado!",
    checkSpam: "Revisa también el spam.",
    signOut: "Salir",
  },
  en: {
    heading: "Confirm your email",
    codeSentTo: "Code sent to",
    verifying: "Verifying...",
    confirmed: "Email confirmed!",
    redirecting: "Redirecting...",
    errorWrong: "Incorrect code. Check and try again.",
    errorManyWrong: "Incorrect code. Request a new code below.",
    errorVerify: "Verification error. Try again.",
    errorResend: "Resend error. Try again.",
    noCode: "Didn't receive the code?",
    resend: "Resend code",
    resending: "Resending...",
    resent: "Code resent!",
    checkSpam: "Also check your spam folder.",
    signOut: "Sign out",
  },
  fr: {
    heading: "Confirmez votre e-mail",
    codeSentTo: "Code envoyé à",
    verifying: "Vérification...",
    confirmed: "E-mail confirmé !",
    redirecting: "Redirection...",
    errorWrong: "Code incorrect. Vérifiez et réessayez.",
    errorManyWrong: "Code incorrect. Demandez un nouveau code ci-dessous.",
    errorVerify: "Erreur de vérification. Réessayez.",
    errorResend: "Erreur d'envoi. Réessayez.",
    noCode: "Vous n'avez pas reçu le code ?",
    resend: "Renvoyer le code",
    resending: "Envoi en cours...",
    resent: "Code renvoyé !",
    checkSpam: "Vérifiez aussi vos spams.",
    signOut: "Se déconnecter",
  },
  de: {
    heading: "E-Mail bestätigen",
    codeSentTo: "Code gesendet an",
    verifying: "Wird überprüft...",
    confirmed: "E-Mail bestätigt!",
    redirecting: "Weiterleitung...",
    errorWrong: "Falscher Code. Überprüfe ihn und versuche es erneut.",
    errorManyWrong: "Falscher Code. Fordere unten einen neuen an.",
    errorVerify: "Fehler bei der Überprüfung. Versuche es erneut.",
    errorResend: "Fehler beim Senden. Versuche es erneut.",
    noCode: "Keinen Code erhalten?",
    resend: "Code erneut senden",
    resending: "Wird gesendet...",
    resent: "Code erneut gesendet!",
    checkSpam: "Prüfe auch deinen Spam-Ordner.",
    signOut: "Abmelden",
  },
} as const;

type Locale = keyof typeof COPY;

function OtpInput({ onComplete, disabled }: { onComplete: (code: string) => void; disabled: boolean }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const update = (index: number, value: string) => {
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    if (v && index < 5) refs.current[index + 1]?.focus();
    if (next.every(Boolean)) onComplete(next.join(""));
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        refs.current[index - 1]?.focus();
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
      } else {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      refs.current[5]?.focus();
      onComplete(pasted);
    }
  };

  useEffect(() => { refs.current[0]?.focus(); }, []);

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
      {digits.map((digit, i) => (
        <span key={i} style={{ display: "contents" }}>
          {i === 3 && (
            <span style={{ fontSize: 20, color: "#3f3f46", fontWeight: 700, lineHeight: 1, userSelect: "none" }}>—</span>
          )}
          <input
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => update(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={onPaste}
            style={{
              width: 48, height: 60,
              textAlign: "center",
              fontSize: 26, fontWeight: 900,
              fontFamily: "'Courier New', Courier, monospace",
              background: digit ? "rgba(34,211,238,0.07)" : "#0a0f1e",
              border: `2px solid ${digit ? "#22d3ee" : "#27272a"}`,
              borderRadius: 12,
              color: "#fafafa",
              outline: "none",
              cursor: disabled ? "not-allowed" : "text",
              opacity: disabled ? 0.5 : 1,
              transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
              caretColor: "#22d3ee",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#22d3ee";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = digit ? "#22d3ee" : "#27272a";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </span>
      ))}
    </div>
  );
}

function EmailPendentePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [locale, setLocale] = useState<Locale>("pt");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const loc = getStoredLocale() as Locale;
    setLocale(loc in COPY ? loc : "pt");
    const user = auth.currentUser;
    if (!user) { navigate({ to: "/" }); return; }
    setEmail(user.email ?? "");
    const pending = localStorage.getItem("zyrox.emailPending");
    if (!pending || pending !== user.uid) {
      navigate({ to: "/onboarding/$step", params: { step: "1" } });
    }
  }, [navigate]);

  const c = COPY[locale] ?? COPY.pt;

  const callApi = async (path: string, body?: object) => {
    const user = auth.currentUser;
    if (!user) throw new Error("not logged in");
    const token = await user.getIdToken();
    return fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Locale": locale,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  const handleCodeComplete = async (code: string) => {
    setVerifying(true);
    setError("");
    try {
      const res = await callApi("/api/verify-code", { code });
      const data = (await res.json()) as { valid: boolean };
      if (data.valid) {
        setVerified(true);
        localStorage.removeItem("zyrox.emailPending");
        setTimeout(() => navigate({ to: "/onboarding/$step", params: { step: "1" } }), 1400);
      } else {
        setAttempts((a) => a + 1);
        setError(attempts >= 2 ? c.errorManyWrong : c.errorWrong);
      }
    } catch {
      setError(c.errorVerify);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResent(false);
    setError("");
    setAttempts(0);
    try {
      const res = await callApi("/api/send-verification");
      if (!res.ok) throw new Error();
      setResent(true);
    } catch {
      setError(c.errorResend);
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{
      background: "#09090b", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-30%", left: "-20%", width: "70vw", height: "70vh", background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: "-30%", right: "-20%", width: "70vw", height: "70vh", background: "radial-gradient(circle, rgba(251,146,60,0.07) 0%, transparent 65%)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}
      >
        {/* Mascot */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <img
            src="/MASCOTE%20SEM%20FUNDO.png"
            width={80} height={80}
            alt="3D Body Scanner"
            style={{ display: "inline-block", filter: "drop-shadow(0 0 20px rgba(34,211,238,0.25))" }}
          />
        </motion.div>

        {/* Card */}
        <div style={{
          background: "#18181b", border: "1px solid #27272a",
          borderRadius: 20, overflow: "hidden",
          boxShadow: "0 0 60px rgba(34,211,238,0.06), 0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <div style={{ background: "linear-gradient(90deg,#22d3ee,#0891b2)", height: 4 }} />

          <div style={{ padding: "36px 32px 32px", textAlign: "center" }}>
            <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: "5px", color: "#22d3ee", textTransform: "uppercase" }}>
              3D Body Scanner
            </p>
            <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "#fafafa", lineHeight: 1.2, letterSpacing: "-0.3px" }}>
              {c.heading}
            </h1>
            <p style={{ margin: "0 0 4px", fontSize: 14, color: "#71717a", lineHeight: 1.6 }}>
              {c.codeSentTo}
            </p>
            {email && (
              <p style={{ margin: "0 0 28px", fontSize: 14, fontWeight: 700, color: "#e2e8f0", wordBreak: "break-all" }}>
                {email}
              </p>
            )}

            {/* OTP / success / loading */}
            <AnimatePresence mode="wait">
              {verified ? (
                <motion.div key="ok" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "8px 0 20px" }}>
                  <CheckCircle2 size={48} style={{ color: "#4ade80" }} />
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#4ade80" }}>{c.confirmed}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#71717a" }}>{c.redirecting}</p>
                </motion.div>
              ) : verifying ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 68, color: "#22d3ee", fontSize: 14, fontWeight: 600 }}>
                  <Loader2 size={18} className="animate-spin" />
                  {c.verifying}
                </motion.div>
              ) : (
                <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <OtpInput onComplete={(code) => void handleCodeComplete(code)} disabled={verifying} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ margin: "16px 0 0", fontSize: 13, color: "#f87171", fontWeight: 500, lineHeight: 1.5 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Resend */}
            {!verified && (
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <p style={{ margin: 0, fontSize: 13, color: "#52525b" }}>{c.noCode}</p>
                <button
                  type="button"
                  onClick={() => void handleResend()}
                  disabled={resending || resent}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "none", border: "none", padding: 0,
                    fontSize: 13, fontWeight: 600,
                    color: resent ? "#4ade80" : "#22d3ee",
                    cursor: resending || resent ? "default" : "pointer",
                    opacity: resending ? 0.6 : 1,
                    transition: "color 0.2s",
                  }}
                >
                  {resending
                    ? <><Loader2 size={13} className="animate-spin" />{c.resending}</>
                    : resent
                    ? <><CheckCircle2 size={13} />{c.resent}</>
                    : <><RefreshCw size={13} />{c.resend}</>}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid #27272a", padding: "14px 32px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <ShieldCheck size={13} style={{ color: "#3f3f46", flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 12, color: "#52525b", lineHeight: 1.5 }}>
              {c.checkSpam}{" "}
              <button
                type="button"
                onClick={() => { localStorage.removeItem("zyrox.emailPending"); navigate({ to: "/" }); }}
                style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", textDecoration: "underline", fontSize: 12, padding: 0 }}
              >
                {c.signOut}
              </button>
            </p>
          </div>
        </div>

        <p style={{ margin: "20px 0 0", textAlign: "center", fontSize: 12, color: "#3f3f46" }}>
          © 2025 3D Body Scanner · Todos os direitos reservados
        </p>
      </motion.div>
    </div>
  );
}
