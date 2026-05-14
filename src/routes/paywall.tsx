import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Check,
  Sparkles,
  Zap,
  Shield,
  ChevronRight,
  Lock,
  Brain,
  Dumbbell,
  Flame,
  Target,
} from "lucide-react";
import { loadOnboarding } from "@/lib/onboarding";
import logo from "@/assets/zyrox-logo.png";

export const Route = createFileRoute("/paywall")({
  head: () => ({
    meta: [
      { title: "Seu Plano Está Pronto | 3D Body Scan" },
      { name: "description", content: "A IA criou seu plano exclusivo de evolução corporal." },
    ],
  }),
  component: PaywallPage,
});

const GOAL_LABELS: Record<string, { label: string; short: string }> = {
  mass: { label: "Hipertrofia Muscular", short: "Hipertrofia" },
  strength: { label: "Força Máxima", short: "Força" },
  hybrid: { label: "Treino Híbrido", short: "Híbrido" },
  athletic: { label: "Performance Atlética", short: "Performance" },
};
const EXP_LABELS: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};
const LOC_LABELS: Record<string, string> = {
  gym: "Academia",
  home: "Casa",
  hybrid: "Academia + Casa",
  outdoor: "Ar Livre",
};
const RESULT_LABELS: Record<string, string> = {
  hypertrophy: "Ganho de massa",
  strength: "Aumento de força",
  skill: "Domínio técnico",
  performance: "Performance atlética",
};

const PLANS = [
  {
    id: "monthly" as const,
    label: "Mensal",
    price: "R$ 39,90",
    period: "/mes",
    priceNote: null,
    badge: null,
  },
  {
    id: "annual" as const,
    label: "Anual",
    price: "R$ 19,90",
    period: "/mes",
    priceNote: "Cobrado R$ 238,80/ano · Economize 50%",
    badge: "Mais popular",
    highlight: true,
  },
  {
    id: "lifetime" as const,
    label: "Vitalício",
    price: "R$ 297",
    period: " único",
    priceNote: "Acesso permanente · Melhor investimento",
    badge: "Melhor valor",
  },
] as const;

const AI_INSIGHTS = [
  { icon: Brain, text: "Protocolo de sobrecarga progressiva otimizado para seu nível" },
  { icon: Dumbbell, text: "Divisão muscular calculada para máxima recuperação" },
  { icon: Flame, text: "Metabolismo e calorias calibrados ao seu objetivo" },
  { icon: Target, text: "Periodização automática com deload inteligente" },
];

function PaywallPage() {
  const navigate = useNavigate();
  const profile = loadOnboarding();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual" | "lifetime">("annual");
  const [loading, setLoading] = useState(false);

  const goalInfo = GOAL_LABELS[profile.goal ?? ""] ?? { label: "Fitness", short: "Fitness" };
  const expLabel = EXP_LABELS[profile.experience ?? ""] ?? "Seu nível";
  const locLabel = LOC_LABELS[profile.location ?? ""] ?? "Seu ambiente";
  const resultLabel = RESULT_LABELS[profile.result ?? ""] ?? "Evolução corporal";
  const daysCount = profile.days?.length ?? 4;
  const duration = profile.duration ?? 60;
  const equipCount = profile.equipment?.length ?? 0;
  const firstName = profile.name?.split(" ")[0] || "Atleta";

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => navigate({ to: "/" }), 900);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground" style={{ background: "#060b14" }}>
      {/* Glows */}
      <div className="pointer-events-none fixed left-0 top-0 h-[700px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[140px]" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.18) 0%,transparent 70%)" }} />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[700px] w-[500px] translate-x-1/2 translate-y-1/4 rounded-full blur-[140px]" style={{ background: "radial-gradient(circle,rgba(251,146,60,0.18) 0%,transparent 70%)" }} />

      <div className="relative z-10 mx-auto max-w-sm px-5 pb-14 pt-8">

        {/* Logo pequena + badge */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl blur-md" style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.5),rgba(251,146,60,0.5))", transform: "scale(1.3)" }} />
              <img src={logo} alt="3D Body Scan" className="relative h-9 w-9 rounded-xl" />
            </div>
            <span className="font-display text-sm font-black" style={{ background: "linear-gradient(90deg,#22d3ee,#fff,#fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              3D Body Scan
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", color: "#22d3ee" }}>
            <Sparkles className="h-3 w-3" /> IA Concluida
          </div>
        </div>

        {/* ── SEÇÃO 1: O que a IA encontrou ── */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <h1 className="font-display text-3xl font-black leading-tight" style={{ background: "linear-gradient(90deg,#22d3ee 0%,#ffffff 45%,#fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Plano Criado<br />para Você, {firstName}
          </h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(148,163,184,0.8)" }}>
            A IA analisou seu perfil completo e gerou um protocolo exclusivo.
          </p>
        </motion.div>

        {/* Card: Resumo do plano gerado pela IA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="mt-5 rounded-3xl p-px"
          style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.35),rgba(255,255,255,0.05) 50%,rgba(251,146,60,0.35))" }}
        >
          <div className="rounded-3xl p-5" style={{ background: "rgba(9,14,24,0.95)" }}>
            {/* Header do card */}
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#22d3ee" }}>
              <Brain className="h-3.5 w-3.5" /> Análise da IA · {Math.round(Math.random() * 5 + 91)}% compatibilidade
            </div>

            {/* Dados do perfil */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Objetivo", value: goalInfo.short },
                { label: "Nível", value: expLabel },
                { label: "Local", value: locLabel },
                { label: "Frequência", value: `${daysCount}x/semana` },
                { label: "Duração", value: `${duration} min` },
                { label: "Equipamentos", value: equipCount > 0 ? `${equipCount} itens` : "Peso corporal" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(100,116,139,0.8)" }}>{item.label}</div>
                  <div className="mt-0.5 text-sm font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="mt-3 rounded-2xl px-4 py-3" style={{ background: "linear-gradient(135deg,rgba(251,146,60,0.08),rgba(251,146,60,0.04))", border: "1px solid rgba(251,146,60,0.2)" }}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(251,146,60,0.8)" }}>Meta Principal</div>
              <div className="mt-0.5 text-sm font-bold" style={{ color: "#fdba74" }}>{resultLabel}</div>
            </div>
          </div>
        </motion.div>

        {/* ── SEÇÃO 2: O que a IA preparou (insights) ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.4 }}
          className="mt-5"
        >
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(148,163,184,0.6)" }}>
            O que a IA preparou para você
          </div>
          <div className="space-y-2">
            {AI_INSIGHTS.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: "#22d3ee" }} />
                </div>
                <span className="text-sm" style={{ color: "rgba(248,250,252,0.8)" }}>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── SEÇÃO 3: Paywall (acesso bloqueado) ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
          className="mt-6"
        >
          {/* Separador com lock */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}>
              <Lock className="h-3 w-3" style={{ color: "#fb923c" }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#fb923c" }}>Acesso Completo</span>
            </div>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Planos */}
          <div className="space-y-2.5">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const isAnnual = plan.id === "annual";
              const isLifetime = plan.id === "lifetime";
              const accentColor = isAnnual ? "#fb923c" : isLifetime ? "#22d3ee" : "rgba(255,255,255,0.5)";

              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className="relative w-full rounded-2xl p-4 text-left transition-all"
                  style={{
                    border: `1.5px solid ${isSelected ? accentColor : "rgba(255,255,255,0.07)"}`,
                    background: isSelected ? `${accentColor}0a` : "rgba(255,255,255,0.02)",
                  }}
                >
                  {plan.badge && (
                    <div
                      className="absolute -top-2.5 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.15em] text-white"
                      style={{
                        background: isAnnual ? "linear-gradient(135deg,#ea580c,#fb923c)" : "linear-gradient(135deg,#0891b2,#22d3ee)",
                        boxShadow: isAnnual ? "0 0 10px rgba(251,146,60,0.5)" : "0 0 10px rgba(34,211,238,0.5)",
                      }}
                    >
                      {plan.badge}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-5 w-5 shrink-0 place-items-center rounded-full transition-all"
                        style={{
                          border: `2px solid ${isSelected ? accentColor : "rgba(255,255,255,0.2)"}`,
                          background: isSelected ? accentColor : "transparent",
                        }}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-black" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{plan.label}</div>
                        {plan.priceNote && (
                          <div className="text-[11px]" style={{ color: "rgba(148,163,184,0.6)" }}>{plan.priceNote}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-xl font-black text-white">{plan.price}</span>
                      <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>{plan.period}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* O que está incluído */}
          <div className="mt-4 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                "Treino IA adaptativo",
                "3D Body Scan",
                "Análise alimentar",
                "Metabolismo IA",
                "+500 exercícios GIF",
                "Analytics corporal",
                "Ciclo hormonal",
                "Suporte prioritário",
              ].map((f) => (
                <div key={f} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(248,250,252,0.75)" }}>
                  <Check className="h-3 w-3 shrink-0" style={{ color: "#4ade80" }} />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.4 }}
          className="mt-6"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-base font-black text-white transition disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg,#c2410c,#ea580c,#fb923c,#fdba74)",
              boxShadow: "0 0 32px rgba(251,146,60,0.45), 0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {loading ? (
              <Zap className="h-5 w-5 animate-pulse" />
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Começar Evolução
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </motion.button>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs" style={{ color: "rgba(100,116,139,0.65)" }}>
            <Shield className="h-3 w-3" />
            Garantia de 7 dias · Cancele quando quiser
          </div>

          <p className="mt-4 text-center text-xs" style={{ color: "rgba(100,116,139,0.5)" }}>
            Já tem uma conta?{" "}
            <Link to="/" className="font-semibold transition hover:opacity-80" style={{ color: "#22d3ee" }}>
              Fazer login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
