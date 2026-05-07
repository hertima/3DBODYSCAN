import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell, Zap, Activity, TrendingUp, Calendar, Home, Building2, Trees, Layers,
  Rocket, Target, Clock, Sparkles, ChevronRight,
} from "lucide-react";
import { OptionCard } from "@/components/OptionCard";
import { AIInsightCard } from "@/components/AIInsightCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { loadOnboarding, saveOnboarding, type OnboardingState } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/$step")({
  component: StepPage,
});

const TOTAL = 9;

function StepPage() {
  const { step } = Route.useParams();
  const navigate = useNavigate();
  const stepNum = Math.max(1, Math.min(TOTAL, parseInt(step, 10) || 1));
  const [state, setState] = useState<OnboardingState>({});

  useEffect(() => {
    setState(loadOnboarding());
  }, []);

  const update = (patch: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      saveOnboarding(next);
      return next;
    });
  };

  const canContinue = useMemo(() => {
    switch (stepNum) {
      case 1: return !!state.goal;
      case 2: return !!state.consistency;
      case 3: return !!state.experience;
      case 4: return !!state.location;
      case 5: return (state.equipment?.length ?? 0) > 0;
      case 6: return (state.days?.length ?? 0) > 0;
      case 7: return !!state.duration;
      case 8: return !!state.result;
      default: return true;
    }
  }, [stepNum, state]);

  const next = () => {
    if (stepNum < TOTAL) navigate({ to: "/onboarding/$step", params: { step: String(stepNum + 1) } });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={stepNum}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {stepNum === 1 && <Step1 state={state} update={update} />}
          {stepNum === 2 && <Step2 state={state} update={update} />}
          {stepNum === 3 && <Step3 state={state} update={update} />}
          {stepNum === 4 && <Step4 state={state} update={update} />}
          {stepNum === 5 && <Step5 state={state} update={update} />}
          {stepNum === 6 && <Step6 state={state} update={update} />}
          {stepNum === 7 && <Step7 state={state} update={update} />}
          {stepNum === 8 && <Step8 state={state} update={update} />}
          {stepNum === 9 && <Step9 state={state} />}
        </motion.div>
      </AnimatePresence>

      {stepNum < TOTAL && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-4">
            <button
              onClick={() => navigate({ to: "/onboarding/$step", params: { step: String(Math.max(1, stepNum - 1)) } })}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              ‹ Anterior
            </button>
            <PrimaryButton onClick={next} disabled={!canContinue}>
              Continuar <ChevronRight className="h-4 w-4" />
            </PrimaryButton>
          </div>
        </div>
      )}
    </>
  );
}

function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-3 text-sm text-muted-foreground md:text-base">{subtitle}</p>}
    </div>
  );
}

/* ---------------- Steps ---------------- */

function Step1({ state, update }: any) {
  const opts = [
    { id: "mass", title: "Ganho de Massa", subtitle: "Hipertrofia e Bodybuilding", icon: <Dumbbell className="h-5 w-5" /> },
    { id: "strength", title: "Força Funcional", subtitle: "Calistenia de Elite e Poder", icon: <Activity className="h-5 w-5" /> },
    { id: "hybrid", title: "Performance Híbrida", subtitle: "Domínio de Múltiplas Modalidades", icon: <Zap className="h-5 w-5" /> },
    { id: "athletic", title: "Evolução Atlética", subtitle: "Ajuste de IA para Performance de Elite", icon: <TrendingUp className="h-5 w-5" /> },
  ];
  return (
    <>
      <Heading
        title="Qual o seu foco principal?"
        subtitle="Nossa IA irá personalizar sua trajetória de evolução com base no caminho escolhido."
      />
      <div className="space-y-3">
        {opts.map((o) => (
          <OptionCard key={o.id} active={state.goal === o.id} onClick={() => update({ goal: o.id })} icon={o.icon} title={o.title} subtitle={o.subtitle} />
        ))}
      </div>
      <div className="mt-6">
        <AIInsightCard>
          <span className="font-semibold text-cyan">Insight de IA:</span> seu foco define o algoritmo de progressão e a divisão dos treinos.
        </AIInsightCard>
      </div>
    </>
  );
}

function Step2({ state, update }: any) {
  const opts = [
    { id: "occasional", title: "Ocasionalmente", subtitle: "1 a 2 vezes por semana", icon: <Calendar className="h-5 w-5" /> },
    { id: "regular", title: "Regularmente", subtitle: "3 a 5 vezes por semana", icon: <Activity className="h-5 w-5" /> },
    { id: "elite", title: "Atleta de Elite", subtitle: "6+ vezes por semana", icon: <Zap className="h-5 w-5" /> },
  ];
  return (
    <>
      <Heading
        title="Com que frequência você treina?"
        subtitle="Nossa IA precisa entender sua consistência atual para calibrar volume de carga e períodos de recuperação ideais."
      />
      <div className="space-y-3">
        {opts.map((o) => (
          <OptionCard key={o.id} active={state.consistency === o.id} onClick={() => update({ consistency: o.id })} icon={o.icon} title={o.title} subtitle={o.subtitle} />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="text-2xl font-bold text-gradient-primary">94%</div>
          <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Taxa de Adesão</div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="text-2xl font-bold text-cyan">Elite</div>
          <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Benchmark Score</div>
        </div>
      </div>
      <div className="mt-4">
        <AIInsightCard>
          Usuários com consistência <span className="font-semibold text-cyan">Regular</span> apresentam taxa de hipertrofia 42% superior a atletas esporádicos no primeiro trimestre.
        </AIInsightCard>
      </div>
    </>
  );
}

function Step3({ state, update }: any) {
  const opts = [
    { id: "beginner", title: "Iniciante", subtitle: "estou começando", icon: <Rocket className="h-5 w-5" /> },
    { id: "intermediate", title: "Intermediário", subtitle: "já treino há meses", icon: <Dumbbell className="h-5 w-5" /> },
    { id: "advanced", title: "Avançado", subtitle: "anos de consistência", icon: <Zap className="h-5 w-5" /> },
  ];
  return (
    <>
      <Heading
        title="Qual seu nível de experiência?"
        subtitle="A inteligência artificial da ZYROX calibra a intensidade e o volume dos treinos com base na sua maturidade muscular."
      />
      <div className="space-y-3">
        {opts.map((o) => (
          <OptionCard key={o.id} active={state.experience === o.id} onClick={() => update({ experience: o.id })} icon={o.icon} title={o.title} subtitle={o.subtitle} />
        ))}
      </div>
    </>
  );
}

function Step4({ state, update }: any) {
  const opts = [
    { id: "gym", title: "Academia", subtitle: "equipamento completo", icon: <Building2 className="h-5 w-5" /> },
    { id: "home", title: "Casa", subtitle: "home gym ou peso corporal", icon: <Home className="h-5 w-5" /> },
    { id: "hybrid", title: "Híbrido", subtitle: "alterno entre academia e casa", icon: <Layers className="h-5 w-5" /> },
    { id: "outdoor", title: "Outdoor", subtitle: "parque, calistenia ao ar livre", icon: <Trees className="h-5 w-5" /> },
  ];
  return (
    <>
      <Heading title="Onde você treina?" subtitle="Vamos adaptar os treinos ao seu ambiente e equipamentos disponíveis." />
      <div className="space-y-3">
        {opts.map((o) => (
          <OptionCard key={o.id} active={state.location === o.id} onClick={() => update({ location: o.id })} icon={o.icon} title={o.title} subtitle={o.subtitle} />
        ))}
      </div>
    </>
  );
}

const equipmentList = [
  "Halteres", "Barras", "Anilhas", "Banco", "Rack", "Cabos",
  "Máquinas", "Barra fixa", "Paralelas", "Argolas", "Kettlebell", "Elásticos", "Roda abdominal",
];

function Step5({ state, update }: any) {
  const selected = state.equipment ?? [];
  const toggle = (e: string) => {
    const next = selected.includes(e) ? selected.filter((x: string) => x !== e) : [...selected, e];
    update({ equipment: next });
  };
  return (
    <>
      <Heading title="Quais equipamentos você tem acesso?" subtitle="Selecione todos. A IA monta seu plano apenas com o que está disponível." />
      <div className="flex flex-wrap gap-2">
        {equipmentList.map((eq) => {
          const active = selected.includes(eq);
          return (
            <button
              key={eq}
              onClick={() => toggle(eq)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                active
                  ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary"
                  : "border-border bg-surface text-foreground hover:border-primary/30",
              )}
            >
              {eq}
            </button>
          );
        })}
      </div>
    </>
  );
}

const dayLabels = ["S", "T", "Q", "Q", "S", "S", "D"];
const dayFull = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

function Step6({ state, update }: any) {
  const selected = state.days ?? [];
  const toggle = (i: number) => {
    const next = selected.includes(i) ? selected.filter((x: number) => x !== i) : [...selected, i].sort();
    update({ days: next });
  };
  return (
    <>
      <Heading title="Quais dias você pode treinar?" subtitle="Selecione os dias da semana disponíveis." />
      <div className="grid grid-cols-7 gap-2">
        {dayLabels.map((l, i) => {
          const active = selected.includes(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={cn(
                "aspect-square rounded-2xl border text-lg font-semibold transition",
                active
                  ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary"
                  : "border-border bg-surface text-foreground hover:border-primary/30",
              )}
            >
              {l}
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        {selected.length === 0
          ? "Nenhum dia selecionado"
          : selected.length + " dia" + (selected.length > 1 ? "s" : "") + " · " + selected.map((d: number) => dayFull[d]).join(", ")}
      </div>
    </>
  );
}

function Step7({ state, update }: any) {
  const v = state.duration ?? 60;
  return (
    <>
      <Heading title="Quanto tempo por treino?" subtitle="A IA estrutura o volume com base na sua janela de tempo disponível." />
      <div className="rounded-3xl border border-border bg-gradient-surface p-8 text-center shadow-elevated">
        <Clock className="mx-auto mb-3 h-6 w-6 text-cyan" />
        <div className="font-display text-6xl font-bold text-gradient-primary">{v}</div>
        <div className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">minutos</div>
        <input
          type="range"
          min={30}
          max={120}
          step={5}
          value={v}
          onChange={(e) => update({ duration: parseInt(e.target.value, 10) })}
          className="mt-6 w-full accent-[var(--primary)]"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>30 min</span><span>75 min</span><span>120 min</span>
        </div>
      </div>
    </>
  );
}

const results = [
  { id: "hypertrophy", title: "Hipertrofia visível", subtitle: "ganho de massa estético", icon: <Dumbbell className="h-5 w-5" /> },
  { id: "strength", title: "Força máxima", subtitle: "PRs em compostos pesados", icon: <Zap className="h-5 w-5" /> },
  { id: "skill", title: "Skills calistênicos", subtitle: "muscle-up, front lever, planche", icon: <Sparkles className="h-5 w-5" /> },
  { id: "performance", title: "Performance atlética", subtitle: "potência, agilidade, condicionamento", icon: <Target className="h-5 w-5" /> },
];

function Step8({ state, update }: any) {
  return (
    <>
      <Heading title="Qual resultado você quer alcançar?" subtitle="Escolha sua meta principal — a IA otimiza progressão e periodização para isso." />
      <div className="space-y-3">
        {results.map((o) => (
          <OptionCard key={o.id} active={state.result === o.id} onClick={() => update({ result: o.id })} icon={o.icon} title={o.title} subtitle={o.subtitle} />
        ))}
      </div>
    </>
  );
}

const aiPhases = [
  "Analisando padrão de treino...",
  "Calculando recuperação muscular...",
  "Adaptando progressão de carga...",
  "Selecionando exercícios ideais...",
  "Criando seu plano personalizado...",
];

function Step9({ state }: any) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => {
        const np = Math.min(100, p + 1.2);
        const newPhase = Math.min(aiPhases.length - 1, Math.floor((np / 100) * aiPhases.length));
        setPhase(newPhase);
        return np;
      });
    }, 60);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (pct >= 100) {
      saveOnboarding({ ...state, completedAt: new Date().toISOString() });
      const t = setTimeout(() => navigate({ to: "/app" }), 700);
      return () => clearTimeout(t);
    }
  }, [pct, state, navigate]);

  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <div className="relative mb-8 h-44 w-44">
        <div className="absolute inset-0 rounded-full bg-gradient-ai opacity-20 blur-2xl" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-cyan/40 border-t-cyan border-r-cyan"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="absolute inset-3 rounded-full border-2 border-primary/30 border-b-primary"
        />
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <Sparkles className="mx-auto mb-1 h-6 w-6 text-cyan" />
            <div className="font-display text-3xl font-bold text-gradient-ai">{Math.round(pct)}%</div>
          </div>
        </div>
      </div>

      <h1 className="font-display text-2xl font-bold md:text-3xl">Construindo sua inteligência atlética</h1>

      <div className="mt-8 w-full max-w-sm space-y-2 text-left">
        {aiPhases.map((p, i) => (
          <div key={i} className={cn(
            "flex items-center gap-3 rounded-xl border p-3 text-sm transition",
            i < phase && "border-success/30 bg-success/5 text-foreground",
            i === phase && "border-cyan/40 bg-surface text-foreground shadow-glow-cyan",
            i > phase && "border-border bg-surface/40 text-muted-foreground",
          )}>
            <div className={cn(
              "h-2 w-2 rounded-full",
              i < phase && "bg-success",
              i === phase && "bg-cyan animate-pulse",
              i > phase && "bg-muted-foreground/40",
            )} />
            {p}
          </div>
        ))}
      </div>

      <div className="mt-8 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-elevated">
        <div className="h-full rounded-full bg-gradient-ai shadow-glow-cyan transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
