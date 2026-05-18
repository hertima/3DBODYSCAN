import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ShareVideoButton, PaywallShowcaseVideo } from "@/remotion";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
  Clock,
  Users,
  TrendingUp,
  Star,
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
  definition: { label: "Definição", short: "Definição" },
  weight_loss: { label: "Emagrecimento", short: "Emagrecimento" },
  endurance: { label: "Resistência", short: "Resistência" },
  wellness: { label: "Bem-estar", short: "Bem-estar" },
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

const GOAL_PROJECTIONS: Record<string, { metric: string; value: string; period: string }[]> = {
  mass: [
    { metric: "Massa muscular", value: "+3–5 kg", period: "em 12 semanas" },
    { metric: "Volume de treino", value: "+40%", period: "progresso garantido" },
    { metric: "Força estimada", value: "+25%", period: "nos principais lifts" },
  ],
  strength: [
    { metric: "Força máxima", value: "+30%", period: "em 12 semanas" },
    { metric: "1RM estimado", value: "+15–20 kg", period: "supino e agachamento" },
    { metric: "Técnica", value: "100%", period: "das repetições otimizadas" },
  ],
  definition: [
    { metric: "Gordura corporal", value: "−3–5%", period: "em 12 semanas" },
    { metric: "Cintura", value: "−5–8 cm", period: "com protocolo correto" },
    { metric: "Massa muscular", value: "mantida", period: "durante o déficit" },
  ],
  weight_loss: [
    { metric: "Peso corporal", value: "−4–6 kg", period: "em 12 semanas" },
    { metric: "Gordura", value: "−3–4%", period: "preservando músculo" },
    { metric: "Metabolismo", value: "+12%", period: "melhora estimada" },
  ],
  hybrid: [
    { metric: "Composição corporal", value: "+15%", period: "melhora geral" },
    { metric: "Força + cardio", value: "2x/sem", period: "divisão otimizada" },
    { metric: "Recuperação", value: "acelerada", period: "protocolo de deload" },
  ],
  athletic: [
    { metric: "Performance", value: "+25%", period: "em 12 semanas" },
    { metric: "Potência", value: "+20%", period: "explosão e velocidade" },
    { metric: "Resistência", value: "+35%", period: "capacidade aeróbica" },
  ],
  endurance: [
    { metric: "VO₂ máx", value: "+18%", period: "em 12 semanas" },
    { metric: "Distância", value: "+30%", period: "capacidade de corrida" },
    { metric: "Frequência", value: "otimizada", period: "sem overtraining" },
  ],
  wellness: [
    { metric: "Disposição", value: "+40%", period: "melhora reportada" },
    { metric: "Sono", value: "+1.5h", period: "qualidade restaurada" },
    { metric: "Consistência", value: "2x maior", period: "vs. treino livre" },
  ],
};

const PLANS = [
  {
    id: "monthly" as const,
    label: "Mensal",
    price: "R$ 39,90",
    originalPrice: null,
    period: "/mês",
    priceNote: "Renovação mensal",
    badge: null,
    highlight: false,
  },
  {
    id: "annual" as const,
    label: "Anual",
    price: "R$ 19,90",
    originalPrice: "R$ 39,90",
    period: "/mês",
    priceNote: "Cobrado R$ 238,80/ano · Economia de R$ 240",
    badge: "Mais popular",
    highlight: true,
  },
  {
    id: "lifetime" as const,
    label: "Vitalício",
    price: "R$ 297",
    originalPrice: null,
    period: " único",
    priceNote: "Acesso permanente · Paga 1x, usa para sempre",
    badge: "Melhor valor",
    highlight: false,
  },
] as const;

const AI_INSIGHTS = [
  { icon: Brain, text: "Protocolo de sobrecarga progressiva otimizado para seu nível" },
  { icon: Dumbbell, text: "Divisão muscular calculada para máxima recuperação" },
  { icon: Flame, text: "Metabolismo e calorias calibrados ao seu objetivo" },
  { icon: Target, text: "Periodização automática com deload inteligente" },
];

const FEATURES = [
  "Treino IA adaptativo",
  "3D Body Scan semanal",
  "Análise nutricional IA",
  "Metabolismo personalizado",
  "+500 exercícios em GIF",
  "Analytics corporal",
  "Ciclo hormonal feminino",
  "Suporte prioritário",
];

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function getCompatibilityScore(profile: ReturnType<typeof loadOnboarding>): number {
  let score = 88;
  if (profile.goal) score += 2;
  if (profile.experience) score += 2;
  if (profile.location) score += 2;
  if (profile.days?.length) score += Math.min(profile.days.length, 2);
  if (profile.name) score += 1;
  if (profile.equipment?.length) score += 1;
  return Math.min(score, 98);
}

function PaywallPage() {
  const navigate = useNavigate();
  const profile = loadOnboarding();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual" | "lifetime">("annual");
  const [loading, setLoading] = useState(false);
  const countdown = useCountdown(23 * 60 + 47);

  const goalInfo = GOAL_LABELS[profile.goal ?? ""] ?? { label: "Fitness", short: "Fitness" };
  const expLabel = EXP_LABELS[profile.experience ?? ""] ?? "Seu nível";
  const locLabel = LOC_LABELS[profile.location ?? ""] ?? "Seu ambiente";
  const daysCount = profile.days?.length ?? 4;
  const duration = profile.duration ?? 60;
  const equipCount = profile.equipment?.length ?? 0;
  const firstName = profile.name?.split(" ")[0] || "Atleta";
  const compatibility = getCompatibilityScore(profile);
  const projections = GOAL_PROJECTIONS[profile.goal ?? ""] ?? GOAL_PROJECTIONS.wellness;

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => navigate({ to: "/criar-conta" }), 900);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground" style={{ background: "#060b14" }}>
      {/* Glows */}
      <div className="pointer-events-none fixed left-0 top-0 h-[700px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[140px]" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.18) 0%,transparent 70%)" }} />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[700px] w-[500px] translate-x-1/2 translate-y-1/4 rounded-full blur-[140px]" style={{ background: "radial-gradient(circle,rgba(251,146,60,0.18) 0%,transparent 70%)" }} />

      <div className="relative z-10 mx-auto max-w-sm px-5 pb-14 pt-8">

        {/* Logo + badge */}
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
            <Sparkles className="h-3 w-3" /> IA Concluída
          </div>
        </div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-4 flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold"
          style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)", color: "rgba(74,222,128,0.9)" }}
        >
          <Users className="h-3.5 w-3.5" />
          847 atletas ativaram o plano esta semana
          <span className="flex gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-2.5 w-2.5 fill-current" />)}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <h1 className="font-display text-3xl font-black leading-tight" style={{ background: "linear-gradient(90deg,#22d3ee 0%,#ffffff 45%,#fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Seu Protocolo<br />de {goalInfo.short} Está<br />Pronto, {firstName}
          </h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(148,163,184,0.8)" }}>
            A IA analisou seu perfil e gerou um protocolo exclusivo de 12 semanas. Só falta ativar.
          </p>
        </motion.div>

        {/* Urgency timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3"
          style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}
        >
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: "rgba(251,146,60,0.9)" }}>
            <Clock className="h-3.5 w-3.5" />
            Seu plano expira em
          </div>
          <div className="font-display text-lg font-black tabular-nums" style={{ color: "#fb923c" }}>
            {countdown}
          </div>
        </motion.div>

        {/* Card: Resumo IA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.14, duration: 0.4 }}
          className="mt-4 rounded-3xl p-px"
          style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.35),rgba(255,255,255,0.05) 50%,rgba(251,146,60,0.35))" }}
        >
          <div className="rounded-3xl p-5" style={{ background: "rgba(9,14,24,0.95)" }}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#22d3ee" }}>
                <Brain className="h-3.5 w-3.5" /> Análise da IA
              </div>
              <div className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black" style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>
                {compatibility}% compatível
              </div>
            </div>

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
          </div>
        </motion.div>

        {/* Projeções de resultado */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-4"
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(148,163,184,0.6)" }}>
            <TrendingUp className="h-3.5 w-3.5" style={{ color: "#4ade80" }} />
            Resultados esperados para você
          </div>
          <div className="grid grid-cols-3 gap-2">
            {projections.map((p, i) => (
              <div key={i} className="rounded-2xl p-3 text-center" style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.12)" }}>
                <div className="font-display text-base font-black" style={{ color: "#4ade80" }}>{p.value}</div>
                <div className="mt-0.5 text-[10px] font-semibold" style={{ color: "rgba(248,250,252,0.7)" }}>{p.metric}</div>
                <div className="mt-0.5 text-[9px]" style={{ color: "rgba(100,116,139,0.7)" }}>{p.period}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* O que a IA preparou */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.4 }}
          className="mt-4"
        >
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(148,163,184,0.6)" }}>
            Dentro do seu protocolo
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

        {/* Paywall — planos */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
          className="mt-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}>
              <Lock className="h-3 w-3" style={{ color: "#fb923c" }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#fb923c" }}>Escolha seu plano</span>
            </div>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>

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
                    background: isSelected ? `${accentColor}0d` : "rgba(255,255,255,0.02)",
                    transform: isSelected ? "scale(1.01)" : "scale(1)",
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
                          <div className="text-[10px]" style={{ color: "rgba(148,163,184,0.6)" }}>{plan.priceNote}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {plan.originalPrice && (
                        <div className="text-xs line-through" style={{ color: "rgba(148,163,184,0.45)" }}>{plan.originalPrice}/mês</div>
                      )}
                      <div>
                        <span className="font-display text-xl font-black text-white">{plan.price}</span>
                        <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>{plan.period}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Features */}
          <div className="mt-4 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(148,163,184,0.5)" }}>
              Incluído em todos os planos
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(248,250,252,0.8)" }}>
                  <Check className="h-3 w-3 shrink-0" style={{ color: "#4ade80" }} />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
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
              boxShadow: "0 0 40px rgba(251,146,60,0.5), 0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {loading ? (
              <Zap className="h-5 w-5 animate-pulse" />
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Ativar Meu Plano Agora
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </motion.button>

          {/* Garantia em destaque */}
          <div className="mt-3 rounded-2xl px-4 py-3 text-center" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
            <div className="flex items-center justify-center gap-2 text-xs font-bold" style={{ color: "#4ade80" }}>
              <Shield className="h-4 w-4" />
              Garantia total de 7 dias — devolução sem perguntas
            </div>
            <p className="mt-1 text-[10px]" style={{ color: "rgba(100,116,139,0.7)" }}>
              Se não evoluir na primeira semana, devolvemos 100% do valor.
            </p>
          </div>

          <p className="mt-4 text-center text-xs" style={{ color: "rgba(100,116,139,0.5)" }}>
            Já tem uma conta?{" "}
            <Link to="/" className="font-semibold transition hover:opacity-80" style={{ color: "#22d3ee" }}>
              Fazer login
            </Link>
          </p>
        </motion.div>

        {/* Share — depois do CTA */}
        <div className="mt-6 flex justify-center">
          <ShareVideoButton
            composition={PaywallShowcaseVideo as never}
            inputProps={{ planName: "Pro" }}
            durationInFrames={450}
            title="Compartilhar 3D Body Scan"
            label="Ver preview do app"
            variant="ghost"
          />
        </div>
      </div>
    </div>
  );
}
