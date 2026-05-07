import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Apple, Chrome } from "lucide-react";
import { PrimaryButton } from "@/components/PrimaryButton";
import logo from "@/assets/zyrox-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar — ZYROX" },
      { name: "description", content: "Acesse sua conta ZYROX e continue sua evolução." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const VALID_EMAIL = "herculesacademiarv@gmail.com";
  const VALID_PASSWORD = "123456";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD) {
        navigate({ to: "/app" });
      } else {
        setLoading(false);
        setError("Email ou senha incorretos.");
      }
    }, 700);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-80" />
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-cyan/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              src={logo}
              alt="ZYROX"
              className="mb-4 h-16 w-16 rounded-2xl shadow-glow-primary"
            />
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Entre para continuar sua evolução
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => navigate({ to: "/app" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-elevated/60 px-3 py-2.5 text-sm font-medium transition hover:bg-elevated"
            >
              <Chrome className="h-4 w-4" /> Google
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/app" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-elevated/60 px-3 py-2.5 text-sm font-medium transition hover:bg-elevated"
            >
              <Apple className="h-4 w-4" /> Apple
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            ou com email
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Email
              </span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@zyrox.app"
                  className="w-full rounded-xl border border-border bg-elevated/60 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary/60 focus:bg-elevated"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Senha
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-elevated/60 py-2.5 pl-9 pr-10 text-sm outline-none transition focus:border-primary/60 focus:bg-elevated"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="inline-flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-border bg-elevated accent-primary" />
                Lembrar de mim
              </label>
              <button type="button" className="font-medium text-cyan hover:underline">
                Esqueci a senha
              </button>
            </div>

            {error && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}

            <PrimaryButton type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
                </>
              ) : (
                <>
                  Entrar <ArrowRight className="h-4 w-4" />
                </>
              )}
            </PrimaryButton>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Novo no ZYROX?{" "}
            <Link to="/onboarding/$step" params={{ step: "1" }} className="font-semibold text-foreground hover:text-primary">
              Criar conta
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Built for evolution · ZYROX
        </p>
      </motion.div>
    </div>
  );
}
