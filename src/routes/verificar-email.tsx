import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { isOnboarded } from "@/lib/onboarding";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, Loader2, ArrowRight } from "lucide-react";

type Status = "loading" | "success" | "expired" | "invalid" | "error";

export const Route = createFileRoute("/verificar-email")({
  validateSearch: (s: Record<string, unknown>) => ({
    uid: String(s.uid ?? ""),
    exp: String(s.exp ?? ""),
    tok: String(s.tok ?? ""),
  }),
  head: () => ({
    meta: [{ title: "Verificar E-mail | 3D Body Scanner" }],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { uid, exp, tok } = Route.useSearch();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!uid || !exp || !tok) {
      setStatus("invalid");
      return;
    }
    fetch("/api/verify-email-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, exp, tok }),
    })
      .then((r) => r.json())
      .then((data: { valid: boolean; reason?: string }) => {
        if (data.valid) {
          localStorage.removeItem("zyrox.emailPending");
          setStatus("success");
        } else if (data.reason === "expired") setStatus("expired");
        else setStatus("invalid");
      })
      .catch(() => setStatus("error"));
  }, [uid, exp, tok]);

  const states: Record<Status, { icon: React.ReactNode; title: string; desc: string; color: string }> = {
    loading: {
      icon: <Loader2 className="h-10 w-10 animate-spin" style={{ color: "#22d3ee" }} />,
      title: "Verificando...",
      desc: "Aguarde um momento.",
      color: "#22d3ee",
    },
    success: {
      icon: <CheckCircle2 className="h-10 w-10" style={{ color: "#4ade80" }} />,
      title: "E-mail confirmado!",
      desc: "Sua conta está ativa. Agora você pode acessar o app.",
      color: "#4ade80",
    },
    expired: {
      icon: <Clock className="h-10 w-10" style={{ color: "#fb923c" }} />,
      title: "Link expirado",
      desc: "Este link de verificação expirou. Faça login e solicite um novo e-mail de verificação.",
      color: "#fb923c",
    },
    invalid: {
      icon: <XCircle className="h-10 w-10" style={{ color: "#f87171" }} />,
      title: "Link inválido",
      desc: "Este link de verificação não é válido. Verifique se copiou o link corretamente.",
      color: "#f87171",
    },
    error: {
      icon: <XCircle className="h-10 w-10" style={{ color: "#f87171" }} />,
      title: "Erro ao verificar",
      desc: "Ocorreu um erro. Tente novamente mais tarde.",
      color: "#f87171",
    },
  };

  const s = states[status];

  return (
    <div
      style={{
        background: "#09090b",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: 420 }}
      >
        {/* Card */}
        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {/* Barra topo */}
          <div style={{ background: s.color, height: 4 }} />

          <div style={{ padding: "40px 40px 36px", textAlign: "center" }}>
            {/* Mascote */}
            <img
              src="https://3dbodyscan.herculesacademiarv.workers.dev/MASCOTE%20SEM%20FUNDO.png"
              width={72}
              height={72}
              alt="3D Body Scanner"
              style={{ display: "block", margin: "0 auto 24px" }}
            />

            {/* Ícone de status */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              {s.icon}
            </div>

            {/* Texto */}
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 4,
                color: "#22d3ee",
                textTransform: "uppercase",
              }}
            >
              3D Body Scanner
            </p>
            <h1
              style={{
                margin: "0 0 12px",
                fontSize: 22,
                fontWeight: 700,
                color: "#fafafa",
                lineHeight: 1.2,
              }}
            >
              {s.title}
            </h1>
            <p style={{ margin: "0 0 32px", fontSize: 14, lineHeight: 1.6, color: "#a1a1aa" }}>
              {s.desc}
            </p>

            {/* CTA */}
            {status === "success" && (
              <button
                type="button"
                onClick={() => {
                  if (isOnboarded()) navigate({ to: "/app" });
                  else navigate({ to: "/onboarding/$step", params: { step: "1" } });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#22d3ee",
                  color: "#09090b",
                  borderRadius: 10,
                  padding: "12px 32px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Continuar <ArrowRight size={16} />
              </button>
            )}
            {(status === "expired" || status === "invalid" || status === "error") && (
              <Link
                to="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#27272a",
                  color: "#fafafa",
                  borderRadius: 10,
                  padding: "12px 32px",
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Voltar ao login
              </Link>
            )}
          </div>

          {/* Rodapé */}
          <div style={{ borderTop: "1px solid #27272a", padding: "16px 40px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "#52525b" }}>
              Se você não criou uma conta no 3D Body Scanner,<br />ignore este e-mail com segurança.
            </p>
          </div>
        </div>

        {/* Rodapé externo */}
        <p style={{ margin: "20px 0 0", textAlign: "center", fontSize: 12, color: "#3f3f46" }}>
          © 2025 3D Body Scanner · Todos os direitos reservados
        </p>
      </motion.div>
    </div>
  );
}
