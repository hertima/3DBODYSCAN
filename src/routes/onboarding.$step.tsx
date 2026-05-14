import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Zap,
  Activity,
  TrendingUp,
  Calendar,
  Home,
  Building2,
  Trees,
  Layers,
  Rocket,
  Target,
  Clock,
  Sparkles,
  ChevronRight,
  Camera,
  Frown,
  Timer,
  HelpCircle,
  Scale,
  Flame,
  Utensils,
  Moon,
  User,
  Users,
} from "lucide-react";
import { OptionCard } from "@/components/OptionCard";
import { AIInsightCard } from "@/components/AIInsightCard";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { PrimaryButton } from "@/components/PrimaryButton";
import { loadOnboarding, saveOnboarding, type OnboardingState } from "@/lib/onboarding";
import { getOnboardingCopy } from "@/lib/app-copy";
import { getStoredLocale, setStoredLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/$step")({
  component: StepPage,
});

const TOTAL = 11;

function StepPage() {
  const { step } = Route.useParams();
  const navigate = useNavigate();
  const stepNum = Math.max(1, Math.min(TOTAL, parseInt(step, 10) || 1));
  const [state, setState] = useState<OnboardingState>({});
  const [locale, setLocale] = useState(getStoredLocale());
  const copy = getOnboardingCopy(locale);

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
      case 2: return !!state.problem;
      case 3: return !!state.experience;
      case 4: return !!state.weight && !!state.height;
      case 5: return !!state.metabolismType;
      case 6: return (state.focusMuscles?.length ?? 0) > 0;
      case 7:
        if (!state.location) return false;
        if (state.location === "gym" || state.location === "hybrid") {
          return !!state.gymSize && !!state.crowdLevel;
        }
        return true;
      case 8: return (state.equipment?.length ?? 0) > 0;
      case 9: return !!state.mealFrequency;
      case 10: return !!state.gender && (state.days?.length ?? 0) > 0 && !!state.duration;
      default: return true;
    }
  }, [state, stepNum]);

  const next = () => {
    if (stepNum < TOTAL) {
      navigate({ to: "/onboarding/$step", params: { step: String(stepNum + 1) } });
    }
  };

  const handleLocaleChange = (nextLocale: string) => {
    setStoredLocale(nextLocale as typeof locale);
    setLocale(nextLocale as typeof locale);
    window.location.reload();
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <LocaleSwitcher value={locale} onChange={(nextLocale) => handleLocaleChange(nextLocale)} compact />
      </div>
      <div className="overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={stepNum}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          {stepNum === 1  && <Step1  state={state} update={update} />}
          {stepNum === 2  && <Step2  state={state} update={update} />}
          {stepNum === 3  && <Step3  state={state} update={update} />}
          {stepNum === 4  && <Step4  state={state} update={update} />}
          {stepNum === 5  && <Step5  state={state} update={update} />}
          {stepNum === 6  && <Step6  state={state} update={update} />}
          {stepNum === 7  && <Step7  state={state} update={update} />}
          {stepNum === 8  && <Step8  state={state} update={update} />}
          {stepNum === 9  && <Step9  state={state} update={update} />}
          {stepNum === 10 && <Step10 state={state} update={update} copy={copy} />}
          {stepNum === 11 && <Step11 state={state} />}
        </motion.div>
      </AnimatePresence>
      </div>

      {stepNum < TOTAL && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-4">
            <button
              onClick={() =>
                navigate({
                  to: "/onboarding/$step",
                  params: { step: String(Math.max(1, stepNum - 1)) },
                })
              }
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {copy.stepBack}
            </button>
            <PrimaryButton onClick={next} disabled={!canContinue}>
              {copy.stepNext} <ChevronRight className="h-4 w-4" />
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
      <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl text-gradient-brand">{title}</h1>
      {subtitle && <p className="mt-3 text-sm text-muted-foreground md:text-base">{subtitle}</p>}
    </div>
  );
}

function Step1({ state, update }: { state: OnboardingState; update: (patch: Partial<OnboardingState>) => void }) {
  const copy = getOnboardingCopy();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const opts = [
    { id: "mass", title: copy.goals.mass.title, subtitle: copy.goals.mass.subtitle, icon: <Dumbbell className="h-5 w-5" /> },
    { id: "strength", title: copy.goals.strength.title, subtitle: copy.goals.strength.subtitle, icon: <Activity className="h-5 w-5" /> },
    { id: "hybrid", title: copy.goals.hybrid.title, subtitle: copy.goals.hybrid.subtitle, icon: <Zap className="h-5 w-5" /> },
    { id: "athletic", title: copy.goals.athletic.title, subtitle: copy.goals.athletic.subtitle, icon: <TrendingUp className="h-5 w-5" /> },
  ] as const;
  const previewName = state.name?.trim() || state.email?.trim() || "Seu nome";
  const initials =
    previewName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "AZ";

  const onAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        update({ avatarUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Heading
        title={copy.focusTitle}
        subtitle={copy.focusSubtitle}
      />
      <div className="mb-6 rounded-3xl border border-border bg-surface p-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="grid h-18 w-18 shrink-0 place-items-center overflow-hidden rounded-[1.6rem] bg-gradient-primary text-lg font-black text-primary-foreground shadow-glow-primary"
          >
            {state.avatarUrl ? (
              <img src={state.avatarUrl} alt={previewName} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </button>
          <div className="min-w-0 flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {copy.nameLabel}
            </label>
            <input
              type="text"
              value={state.name ?? ""}
              onChange={(event) => update({ name: event.target.value })}
              placeholder={copy.namePlaceholder}
              className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-primary/40"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan"
            >
              <Camera className="h-3.5 w-3.5" />
              {copy.addPhoto}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
            />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {opts.map((o) => (
          <OptionCard
            key={o.id}
            active={state.goal === o.id}
            onClick={() => update({ goal: o.id })}
            icon={o.icon}
            title={o.title}
            subtitle={o.subtitle}
          />
        ))}
      </div>
      <div className="mt-6">
        <AIInsightCard>
          <span className="font-semibold text-cyan">{copy.insightPrefix}</span> {copy.insightFocus}
        </AIInsightCard>
      </div>
    </>
  );
}

// ── STEP 2: Problema atual ──────────────────────────────────────
function Step2({ state, update }: { state: OnboardingState; update: (patch: Partial<OnboardingState>) => void }) {
  const problems = [
    { id: "no_results", label: "Treino sem resultado", subtitle: "Esforço mas não vejo mudanças", icon: <Frown className="h-5 w-5" /> },
    { id: "no_time", label: "Falta de tempo", subtitle: "Rotina corrida, difícil manter consistência", icon: <Timer className="h-5 w-5" /> },
    { id: "no_plan", label: "Sem plano claro", subtitle: "Não sei o que fazer ou como progredir", icon: <HelpCircle className="h-5 w-5" /> },
    { id: "no_motivation", label: "Falta de motivação", subtitle: "Começo mas não consigo manter", icon: <Zap className="h-5 w-5" /> },
    { id: "plateau", label: "Platô de evolução", subtitle: "Evoluí antes mas travei no mesmo ponto", icon: <Activity className="h-5 w-5" /> },
  ];
  return (
    <>
      <Heading
        title="O que te impede hoje?"
        subtitle="Seja honesto — a IA vai usar isso para adaptar seu plano."
      />
      <div className="space-y-3">
        {problems.map((p) => (
          <OptionCard
            key={p.id}
            active={state.problem === p.id}
            onClick={() => update({ problem: p.id })}
            icon={p.icon}
            title={p.label}
            subtitle={p.subtitle}
          />
        ))}
      </div>
    </>
  );
}

// ── STEP 3: Experiência ─────────────────────────────────────────
function Step3({ state, update }: { state: OnboardingState; update: (patch: Partial<OnboardingState>) => void }) {
  const copy = getOnboardingCopy();
  const opts = [
    { id: "beginner", title: copy.experience.beginner.title, subtitle: copy.experience.beginner.subtitle, icon: <Rocket className="h-5 w-5" /> },
    { id: "intermediate", title: copy.experience.intermediate.title, subtitle: copy.experience.intermediate.subtitle, icon: <Dumbbell className="h-5 w-5" /> },
    { id: "advanced", title: copy.experience.advanced.title, subtitle: copy.experience.advanced.subtitle, icon: <Zap className="h-5 w-5" /> },
  ] as const;
  return (
    <>
      <Heading title={copy.experienceTitle} subtitle={copy.experienceSubtitle} />
      <div className="space-y-3">
        {opts.map((o) => (
          <OptionCard key={o.id} active={state.experience === o.id} onClick={() => update({ experience: o.id })} icon={o.icon} title={o.title} subtitle={o.subtitle} />
        ))}
      </div>
    </>
  );
}

// ── STEP 4: Perfil corporal ─────────────────────────────────────
function Step4({ state, update }: { state: OnboardingState; update: (patch: Partial<OnboardingState>) => void }) {
  const weightVal = state.weight ?? "";
  const heightVal = state.height ?? "";
  return (
    <>
      <Heading
        title="Seu perfil corporal"
        subtitle="A IA usa esses dados para calcular seu metabolismo e calorias ideais."
      />
      <div className="space-y-4">
        <div className="rounded-3xl border border-border bg-surface p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#22d3ee" }}>
            <Scale className="h-3.5 w-3.5" /> Peso atual
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={30}
              max={300}
              value={weightVal}
              onChange={(e) => update({ weight: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="70"
              className="flex-1 rounded-2xl border border-border bg-background/60 px-4 py-3 text-2xl font-black text-white outline-none transition focus:border-primary/40"
            />
            <span className="text-lg font-semibold text-muted-foreground">kg</span>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#fb923c" }}>
            <Activity className="h-3.5 w-3.5" /> Altura
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={100}
              max={250}
              value={heightVal}
              onChange={(e) => update({ height: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="175"
              className="flex-1 rounded-2xl border border-border bg-background/60 px-4 py-3 text-2xl font-black text-white outline-none transition focus:border-primary/40"
            />
            <span className="text-lg font-semibold text-muted-foreground">cm</span>
          </div>
        </div>
        {state.weight && state.height && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 text-center"
            style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.2)" }}
          >
            <div className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(34,211,238,0.7)" }}>IMC Estimado</div>
            <div className="mt-1 font-display text-2xl font-black" style={{ color: "#22d3ee" }}>
              {(state.weight / ((state.height / 100) ** 2)).toFixed(1)}
            </div>
            <div className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>A IA calibrará seu plano com base nisso</div>
          </motion.div>
        )}
      </div>
    </>
  );
}

// ── STEP 5: Metabolismo ─────────────────────────────────────────
function Step5({ state, update }: { state: OnboardingState; update: (patch: Partial<OnboardingState>) => void }) {
  const opts = [
    {
      id: "slow" as const,
      label: "Metabolismo lento",
      subtitle: "Ganho peso com facilidade, dificuldade para emagrecer",
      icon: <Flame className="h-5 w-5" style={{ color: "#fb923c" }} />,
      color: "#fb923c",
    },
    {
      id: "balanced" as const,
      label: "Metabolismo equilibrado",
      subtitle: "Mantenho peso razoavelmente sem muito esforço",
      icon: <Activity className="h-5 w-5" style={{ color: "#22d3ee" }} />,
      color: "#22d3ee",
    },
    {
      id: "fast" as const,
      label: "Metabolismo rápido",
      subtitle: "Dificuldade para ganhar peso, como bastante",
      icon: <Zap className="h-5 w-5" style={{ color: "#4ade80" }} />,
      color: "#4ade80",
    },
  ];
  return (
    <>
      <Heading
        title="Como é seu metabolismo?"
        subtitle="A IA ajusta suas calorias e macros com base no seu perfil metabólico."
      />
      <div className="space-y-3">
        {opts.map((o) => (
          <OptionCard key={o.id} active={state.metabolismType === o.id} onClick={() => update({ metabolismType: o.id })} icon={o.icon} title={o.label} subtitle={o.subtitle} />
        ))}
      </div>
      <div className="mt-5 rounded-2xl p-4" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}>
        <p className="text-xs" style={{ color: "rgba(148,163,184,0.75)" }}>
          <span className="font-semibold" style={{ color: "#22d3ee" }}>IA Nutricional:</span> Com seu tipo metabólico, calcularemos seu TDEE e déficit/superávit ideal automaticamente.
        </p>
      </div>
    </>
  );
}

// ── STEP 6: Partes do corpo ─────────────────────────────────────
const MUSCLE_GROUPS = [
  "Peito", "Costas", "Ombros", "Bíceps", "Tríceps",
  "Abdômen", "Glúteos", "Quadríceps", "Posterior", "Panturrilha",
];

function Step6({ state, update }: { state: OnboardingState; update: (patch: Partial<OnboardingState>) => void }) {
  const selected = state.focusMuscles ?? [];
  const toggle = (m: string) => {
    const next = selected.includes(m) ? selected.filter((x) => x !== m) : [...selected, m];
    update({ focusMuscles: next });
  };
  return (
    <>
      <Heading
        title="Onde quer focar?"
        subtitle="Selecione os grupos musculares prioritários. A IA dá mais volume onde você quer crescer."
      />
      <div className="flex flex-wrap gap-2">
        {MUSCLE_GROUPS.map((m) => {
          const active = selected.includes(m);
          return (
            <button
              key={m}
              onClick={() => toggle(m)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                active
                  ? "border-cyan/60 bg-cyan/10 text-cyan shadow-glow-cyan"
                  : "border-border bg-surface text-foreground hover:border-cyan/30",
              )}
            >
              {m}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-2xl p-3 text-xs" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)", color: "rgba(148,163,184,0.75)" }}>
          <span className="font-semibold" style={{ color: "#22d3ee" }}>IA: </span>
          Mais volume em {selected.slice(0, 3).join(", ")}{selected.length > 3 ? ` +${selected.length - 3}` : ""}. Distribuição otimizada automaticamente.
        </motion.div>
      )}
    </>
  );
}

// ── STEP 7: Local de treino ─────────────────────────────────────
function Step7({ state, update }: { state: OnboardingState; update: (patch: Partial<OnboardingState>) => void }) {
  const copy = getOnboardingCopy();
  const opts = [
    { id: "gym", title: copy.locations.gym.title, subtitle: copy.locations.gym.subtitle, icon: <Building2 className="h-5 w-5" /> },
    { id: "home", title: copy.locations.home.title, subtitle: copy.locations.home.subtitle, icon: <Home className="h-5 w-5" /> },
    { id: "hybrid", title: copy.locations.hybrid.title, subtitle: copy.locations.hybrid.subtitle, icon: <Layers className="h-5 w-5" /> },
    { id: "outdoor", title: copy.locations.outdoor.title, subtitle: copy.locations.outdoor.subtitle, icon: <Trees className="h-5 w-5" /> },
  ] as const;
  return (
    <>
      <Heading title={copy.locationTitle} subtitle={copy.locationSubtitle} />
      <div className="space-y-3">
        {opts.map((o) => (
          <OptionCard
            key={o.id}
            active={state.location === o.id}
            onClick={() => update({
              location: o.id,
              gymSize: o.id === "gym" || o.id === "hybrid" ? state.gymSize : undefined,
              crowdLevel: o.id === "gym" || o.id === "hybrid" ? state.crowdLevel : undefined,
              equipmentAvailability: o.id === "gym" ? "alta" : o.id === "hybrid" ? "media" : o.id === "home" ? "baixa" : "media",
            })}
            icon={o.icon}
            title={o.title}
            subtitle={o.subtitle}
          />
        ))}
      </div>
      {(state.location === "gym" || state.location === "hybrid") && (
        <div className="mt-6 space-y-5">
          <div>
            <div className="mb-2 text-sm font-semibold">{copy.gymSizeTitle}</div>
            <div className="flex flex-wrap gap-2">
              {[{ id: "pequena", label: copy.gymSizes.pequena }, { id: "media", label: copy.gymSizes.media }, { id: "grande", label: copy.gymSizes.grande }].map((opt) => (
                <button key={opt.id} onClick={() => update({ gymSize: opt.id as "pequena" | "media" | "grande" })}
                  className={cn("rounded-full border px-4 py-2 text-sm font-medium transition", state.gymSize === opt.id ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border-border bg-surface text-foreground hover:border-primary/30")}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold">{copy.crowdLevelTitle}</div>
            <div className="flex flex-wrap gap-2">
              {[{ id: "vazio", label: copy.crowdLevels.vazio }, { id: "normal", label: copy.crowdLevels.normal }, { id: "pico", label: copy.crowdLevels.pico }].map((opt) => (
                <button key={opt.id} onClick={() => update({ crowdLevel: opt.id as "vazio" | "normal" | "pico" })}
                  className={cn("rounded-full border px-4 py-2 text-sm font-medium transition", state.crowdLevel === opt.id ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border-border bg-surface text-foreground hover:border-primary/30")}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── STEP 8: Equipamentos ────────────────────────────────────────
const equipmentList = ["Halteres", "Barras", "Anilhas", "Banco", "Rack", "Cabos", "Máquinas", "Barra fixa", "Paralelas", "Argolas", "Kettlebell", "Elásticos", "Roda abdominal"];

function Step8({ state, update }: { state: OnboardingState; update: (patch: Partial<OnboardingState>) => void }) {
  const copy = getOnboardingCopy();
  const selected = state.equipment ?? [];
  const toggle = (eq: string) => {
    const next = selected.includes(eq) ? selected.filter((x) => x !== eq) : [...selected, eq];
    update({ equipment: next });
  };
  return (
    <>
      <Heading title={copy.equipmentTitle} subtitle={copy.equipmentSubtitle} />
      <div className="flex flex-wrap gap-2">
        {equipmentList.map((eq) => {
          const active = selected.includes(eq);
          return (
            <button key={eq} onClick={() => toggle(eq)}
              className={cn("rounded-full border px-4 py-2 text-sm font-medium transition",
                active ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border-border bg-surface text-foreground hover:border-primary/30")}>
              {eq}
            </button>
          );
        })}
      </div>
    </>
  );
}

// ── STEP 9: Hábitos alimentares ─────────────────────────────────
function Step9({ state, update }: { state: OnboardingState; update: (patch: Partial<OnboardingState>) => void }) {
  const meals = [
    { id: "2", label: "2 refeições", subtitle: "Jejum intermitente ou refeições grandes" },
    { id: "3", label: "3 refeições", subtitle: "Café, almoço e janta" },
    { id: "4-5", label: "4-5 refeições", subtitle: "Refeições fracionadas ao longo do dia" },
    { id: "6+", label: "6+ refeições", subtitle: "Alta frequência, porções menores" },
  ];
  const diets = [
    { id: "none", label: "Sem dieta específica" },
    { id: "low_carb", label: "Low carb" },
    { id: "high_protein", label: "Alto proteico" },
    { id: "vegan", label: "Vegano / Vegetariano" },
    { id: "if", label: "Jejum intermitente" },
  ];
  return (
    <>
      <Heading
        title="Seus hábitos alimentares"
        subtitle="A IA sincroniza sua nutrição com seu treino para resultados máximos."
      />
      <div className="mb-5 space-y-3">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(148,163,184,0.6)" }}>Refeições por dia</div>
        {meals.map((m) => (
          <OptionCard key={m.id} active={state.mealFrequency === m.id} onClick={() => update({ mealFrequency: m.id })}
            icon={<Utensils className="h-5 w-5" />} title={m.label} subtitle={m.subtitle} />
        ))}
      </div>
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(148,163,184,0.6)" }}>Estilo alimentar (opcional)</div>
        <div className="flex flex-wrap gap-2">
          {diets.map((d) => (
            <button key={d.id} onClick={() => update({ dietType: state.dietType === d.id ? undefined : d.id })}
              className={cn("rounded-full border px-3 py-1.5 text-sm font-medium transition",
                state.dietType === d.id ? "border-primary/60 bg-gradient-primary text-primary-foreground" : "border-border bg-surface text-foreground hover:border-primary/30")}>
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── STEP 10: Ciclo hormonal + Frequência + Duração ───────────────
function Step10({ state, update, copy }: { state: OnboardingState; update: (patch: Partial<OnboardingState>) => void; copy: ReturnType<typeof getOnboardingCopy> }) {
  const days = state.days ?? [];
  const duration = state.duration ?? 60;
  const toggleDay = (d: number) => {
    const next = days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort((a, b) => a - b);
    update({ days: next });
  };
  return (
    <>
      <Heading
        title="Seu ciclo e rotina"
        subtitle="A IA adapta intensidade, volume e recuperação ao seu perfil completo."
      />

      {/* Gênero */}
      <div className="mb-5">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(148,163,184,0.6)" }}>Sexo biológico</div>
        <div className="flex gap-2">
          {[
            { id: "male" as const, label: "Masculino", icon: <User className="h-4 w-4" /> },
            { id: "female" as const, label: "Feminino", icon: <User className="h-4 w-4" /> },
            { id: "other" as const, label: "Outro", icon: <Users className="h-4 w-4" /> },
          ].map((g) => (
            <button key={g.id} onClick={() => update({ gender: g.id })}
              className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-2xl border py-3 text-sm font-semibold transition",
                state.gender === g.id ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border-border bg-surface text-foreground hover:border-primary/30")}>
              {g.icon} {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ciclo hormonal (apenas feminino) */}
      {state.gender === "female" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(148,163,184,0.6)" }}>Ciclo hormonal</div>
          <button
            onClick={() => update({ trackCycle: !state.trackCycle })}
            className={cn("w-full rounded-2xl border p-4 text-left text-sm transition",
              state.trackCycle ? "border-cyan/50 bg-cyan/5 text-foreground" : "border-border bg-surface text-muted-foreground hover:border-cyan/30")}
          >
            <div className="flex items-center gap-3">
              <Moon className={cn("h-5 w-5", state.trackCycle ? "text-cyan" : "text-muted-foreground")} />
              <div>
                <div className="font-semibold text-foreground">Adaptar treino ao ciclo menstrual</div>
                <div className="text-xs text-muted-foreground">A IA ajusta intensidade e volume por fase do ciclo</div>
              </div>
            </div>
          </button>
        </motion.div>
      )}

      {/* Dias */}
      <div className="mb-5">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(148,163,184,0.6)" }}>{copy.daysTitle}</div>
        <div className="grid grid-cols-7 gap-1.5">
          {copy.weekdaysShort.map((label, i) => {
            const active = days.includes(i);
            return (
              <button key={i} onClick={() => toggleDay(i)}
                className={cn("aspect-square rounded-2xl border text-base font-semibold transition",
                  active ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border-border bg-surface text-foreground hover:border-primary/30")}>
                {label}
              </button>
            );
          })}
        </div>
        {days.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">{days.length}x/semana · {days.map((d) => copy.weekdaysFull[d]).join(", ")}</p>
        )}
      </div>

      {/* Duração */}
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(148,163,184,0.6)" }}>{copy.durationTitle}</div>
        <div className="rounded-3xl border border-border bg-gradient-surface p-5 text-center">
          <Clock className="mx-auto mb-2 h-5 w-5 text-cyan" />
          <div className="font-display text-5xl font-bold text-gradient-primary">{duration}</div>
          <div className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">{copy.minutes}</div>
          <input type="range" min={30} max={120} step={5} value={duration}
            onChange={(e) => update({ duration: parseInt(e.target.value, 10) })}
            className="mt-4 w-full accent-[var(--primary)]" />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>30 min</span><span>75 min</span><span>120 min</span>
          </div>
        </div>
      </div>
    </>
  );
}

const GOAL_LABEL: Record<string, string> = {
  mass: "Hipertrofia",
  strength: "Força",
  hybrid: "Híbrido",
  athletic: "Performance",
};
const EXP_LABEL: Record<string, string> = {
  beginner: "iniciante",
  intermediate: "intermediário",
  advanced: "avançado",
};
const LOC_LABEL: Record<string, string> = {
  gym: "academia",
  home: "casa",
  hybrid: "academia e casa",
  outdoor: "ar livre",
};

function buildPersonalizedPhases(state: OnboardingState): string[] {
  const goal = GOAL_LABEL[state.goal ?? ""] ?? "fitness";
  const exp = EXP_LABEL[state.experience ?? ""] ?? "seu nível";
  const loc = LOC_LABEL[state.location ?? ""] ?? "seu ambiente";
  const days = state.days?.length ?? 4;
  const duration = state.duration ?? 60;
  const equipCount = state.equipment?.length ?? 0;
  const name = state.name?.split(" ")[0] || "você";

  return [
    `Analisando perfil de ${name} · objetivo ${goal}`,
    `Calibrando volume para nivel ${exp}`,
    equipCount > 0
      ? `Mapeando ${equipCount} equipamentos disponíveis`
      : `Adaptando treino para ${loc}`,
    `Estruturando ${days}x por semana · ${duration} min/sessão`,
    `Calculando progressão e sobrecarga progressiva`,
    `Gerando plano exclusivo com IA · 94% de compatibilidade`,
  ];
}

// ── STEP 11: IA Analisando ──────────────────────────────────────
function Step11({ state }: { state: OnboardingState }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const [pct, setPct] = useState(0);
  const phases = buildPersonalizedPhases(state);

  useEffect(() => {
    const id = setInterval(() => {
      setPct((current) => {
        const next = Math.min(100, current + 1.0);
        const nextPhase = Math.min(phases.length - 1, Math.floor((next / 100) * phases.length));
        setPhase(nextPhase);
        return next;
      });
    }, 60);

    return () => clearInterval(id);
  }, [phases.length]);

  useEffect(() => {
    if (pct >= 100) {
      saveOnboarding({ ...state, completedAt: new Date().toISOString() });
      const timeout = setTimeout(() => navigate({ to: "/paywall" }), 800);
      return () => clearTimeout(timeout);
    }
  }, [navigate, pct, state]);

  return (
    <div className="flex flex-col items-center pt-6 text-center">
      {/* Orbital scanner */}
      <div className="relative mb-8 h-44 w-44">
        <div className="absolute inset-0 rounded-full opacity-25 blur-2xl" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.6) 0%,rgba(251,146,60,0.4) 100%)" }} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{ border: "2px solid transparent", borderTopColor: "#22d3ee", borderRightColor: "#22d3ee40" }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 11, ease: "linear" }}
          className="absolute inset-3 rounded-full"
          style={{ border: "2px solid transparent", borderBottomColor: "#fb923c", borderLeftColor: "#fb923c30" }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          className="absolute inset-7 rounded-full"
          style={{ border: "1px solid rgba(34,211,238,0.2)", borderTopColor: "rgba(34,211,238,0.6)" }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <Sparkles className="mx-auto mb-1 h-5 w-5" style={{ color: "#22d3ee" }} />
            <div className="font-display text-3xl font-bold" style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {Math.round(pct)}%
            </div>
          </div>
        </div>
      </div>

      <h1 className="font-display text-2xl font-bold md:text-3xl text-gradient-brand">
        IA Analisando seu Perfil
      </h1>
      <p className="mt-2 text-sm" style={{ color: "rgba(148,163,184,0.7)" }}>
        Processando {Object.keys(state).filter(k => !["completedAt","avatarUrl"].includes(k)).length} variáveis do seu perfil
      </p>

      <div className="mt-7 w-full max-w-sm space-y-2 text-left">
        {phases.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: index <= phase ? 1 : 0.4 }}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 text-sm transition-all",
              index < phase && "border-success/25 bg-success/5 text-foreground",
              index === phase && "border-cyan/40 bg-surface text-foreground shadow-glow-cyan",
              index > phase && "border-border bg-surface/30 text-muted-foreground",
            )}
          >
            <div className={cn(
              "h-2 w-2 shrink-0 rounded-full transition-all",
              index < phase && "bg-success",
              index === phase && "bg-cyan animate-pulse",
              index > phase && "bg-muted-foreground/30",
            )} />
            <span>{item}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-7 w-full max-w-sm">
        <div className="mb-1.5 flex justify-between text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(100,116,139,0.7)" }}>
          <span>Gerando plano</span>
          <span style={{ color: "#22d3ee" }}>{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,#22d3ee,#3b82f6,#fb923c)", boxShadow: "0 0 12px rgba(34,211,238,0.4)" }}
          />
        </div>
      </div>
    </div>
  );
}







