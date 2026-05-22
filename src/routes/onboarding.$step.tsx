import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Zap,
  Activity,
  Calendar,
  House,
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
  CircleQuestionMark,
  Scale,
  Flame,
  Utensils,
  Moon,
  User,
  Users,
} from "lucide-react";
import { OptionCard } from "@/components/OptionCard";
import { ShareVideoButton, OnboardingCelebrationVideo } from "@/remotion";
import { PrimaryButton } from "@/components/PrimaryButton";
import { loadOnboarding, saveOnboarding, type MenstrualCyclePhase, type OnboardingState } from "@/lib/onboarding";
import { getOnboardingCopy } from "@/lib/app-copy";
import { getStoredLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { calculateCalories, type MacroProfile } from "@/lib/calorie-calculator";

export const Route = createFileRoute("/onboarding/$step")({
  component: StepPage,
});

const TOTAL = 14;

function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

function StepPage() {
  const { step } = Route.useParams();
  const navigate = useNavigate();
  const stepNum = Math.max(1, Math.min(TOTAL, parseInt(step, 10) || 1));
  const [state, setState] = useState<OnboardingState>({});
  const locale = getStoredLocale();
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
      case 1: return true;
      case 2: return !!state.goal;
      case 3: return !!state.problem;
      case 4: return !!state.experience;
      case 5: return !!state.weight && !!state.height && !!state.age;
      case 6: return !!state.metabolismType;
      case 7: return (state.focusMuscles?.length ?? 0) > 0;
      case 8: return !!state.location;
      case 9: return !!state.trainingType;
      case 10: {
          if (state.trainingType === "calistenia") return true;
          if (state.location === "home" || state.location === "outdoor") return true;
          return (state.equipment?.length ?? 0) > 0;
        }
      case 11: return !!state.mealFrequency;
      case 12: return !!state.gender;
      case 13: return (state.days?.length ?? 0) > 0;
      default: return true;
    }
  }, [state, stepNum]);

  const next = () => {
    if (stepNum < TOTAL) {
      navigate({ to: "/onboarding/$step", params: { step: String(stepNum + 1) } });
    }
  };

  return (
    <>
      <div className="overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={stepNum}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          {stepNum === 1  && <StepProfile state={state} update={update} copy={copy} />}
          {stepNum === 2  && <Step1  state={state} update={update} copy={copy} />}
          {stepNum === 3  && <Step2  state={state} update={update} copy={copy} />}
          {stepNum === 4  && <Step3  state={state} update={update} copy={copy} />}
          {stepNum === 5  && <Step4  state={state} update={update} copy={copy} />}
          {stepNum === 6  && <Step5  state={state} update={update} copy={copy} />}
          {stepNum === 7  && <Step6  state={state} update={update} copy={copy} />}
          {stepNum === 8  && <Step7  state={state} update={update} copy={copy} />}
          {stepNum === 9  && <StepTrainingType state={state} update={update} copy={copy} />}
          {stepNum === 10 && <Step8  state={state} update={update} copy={copy} />}
          {stepNum === 11 && <Step9  state={state} update={update} copy={copy} />}
          {stepNum === 12 && <Step10  state={state} update={update} copy={copy} />}
          {stepNum === 13 && <Step10b state={state} update={update} copy={copy} />}
          {stepNum === 14 && <Step11  state={state} copy={copy} />}
        </motion.div>
      </AnimatePresence>
      </div>

      {stepNum < TOTAL && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-xl justify-end px-4 py-4">
            <PrimaryButton onClick={next} disabled={!canContinue}>
              {copy.stepNext} <ChevronRight className="h-4 w-4" />
            </PrimaryButton>
          </div>
        </div>
      )}
    </>
  );
}

type CopyType = ReturnType<typeof getOnboardingCopy>;
type StepProps = { state: OnboardingState; update: (patch: Partial<OnboardingState>) => void; copy: CopyType };

function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl text-gradient-brand">{title}</h1>
      {subtitle && <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{subtitle}</p>}
    </div>
  );
}

// ── STEP PROFILE: Nome e foto ───────────────────────────────────
function StepProfile({ state, update, copy }: StepProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewName = state.name?.trim() || copy.defaultName;
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
      if (typeof reader.result === "string") update({ avatarUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>

      <Heading title={copy.nameLabel} subtitle={copy.focusSubtitle} />
      <div className="rounded-3xl border border-border bg-surface p-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-[2rem] bg-gradient-primary text-3xl font-black text-primary-foreground shadow-glow-primary"
          >
            {state.avatarUrl ? (
              <img src={state.avatarUrl} alt={previewName} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan"
          >
            <Camera className="h-3.5 w-3.5" />
            {copy.addPhoto}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          <div className="w-full text-left">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {copy.nameLabel}
            </label>
            <input
              type="text"
              value={state.name ?? ""}
              onChange={(event) => update({ name: event.target.value })}
              placeholder={copy.namePlaceholder}
              autoFocus
              className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-primary/40"
            />
          </div>
        </div>
      </div>
    </>
  );
}

// ── STEP 1: Objetivo ────────────────────────────────────────────
function Step1({ state, update, copy }: StepProps) {
  const opts = [
    { id: "weight_loss", title: copy.goals.weight_loss.title, subtitle: copy.goals.weight_loss.subtitle, icon: <Flame className="h-5 w-5" />, color: "#f87171" },
    { id: "definition", title: copy.goals.definition.title, subtitle: copy.goals.definition.subtitle, icon: <Target className="h-5 w-5" />, color: "#fb923c" },
    { id: "mass", title: copy.goals.mass.title, subtitle: copy.goals.mass.subtitle, icon: <Dumbbell className="h-5 w-5" />, color: "#22d3ee" },
    { id: "hybrid", title: copy.goals.hybrid.title, subtitle: copy.goals.hybrid.subtitle, icon: <Zap className="h-5 w-5" />, color: "#4ade80" },
    { id: "wellness", title: copy.goals.wellness.title, subtitle: copy.goals.wellness.subtitle, icon: <Sparkles className="h-5 w-5" />, color: "#f9a8d4" },
  ] as const;

  return (
    <>
      <Heading title={copy.focusTitle} subtitle={copy.focusSubtitle} />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {opts.map((o) => (
          <button
            key={o.id}
            onClick={() => update({ goal: o.id })}
            className={cn(
              "relative rounded-2xl border p-4 text-left transition-all duration-200",
              state.goal === o.id
                ? "border-primary/50 bg-surface shadow-glow-primary"
                : "border-border bg-surface/50 hover:border-border/80 hover:bg-surface",
            )}
          >
            {state.goal === o.id && (
              <motion.div
                layoutId="goal-indicator"
                className="absolute inset-0 rounded-2xl"
                style={{ border: `1.5px solid ${o.color}50`, background: `${o.color}08` }}
              />
            )}
            <div className="relative flex items-start gap-3">
              <div className="mt-0.5 rounded-xl p-1.5" style={{ background: `${o.color}15`, color: o.color }}>
                {o.icon}
              </div>
              <div className="min-w-0">
                <div className="font-display text-sm font-bold">{o.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{o.subtitle}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

// ── STEP 2: Problema atual ──────────────────────────────────────
function Step2({ state, update, copy }: StepProps) {
  const problems = [
    { id: "no_results", label: copy.problems.no_results.label, subtitle: copy.problems.no_results.subtitle, icon: <Frown className="h-5 w-5" /> },
    { id: "no_time", label: copy.problems.no_time.label, subtitle: copy.problems.no_time.subtitle, icon: <Timer className="h-5 w-5" /> },
    { id: "no_plan", label: copy.problems.no_plan.label, subtitle: copy.problems.no_plan.subtitle, icon: <CircleQuestionMark className="h-5 w-5" /> },
    { id: "no_motivation", label: copy.problems.no_motivation.label, subtitle: copy.problems.no_motivation.subtitle, icon: <Zap className="h-5 w-5" /> },
    { id: "plateau", label: copy.problems.plateau.label, subtitle: copy.problems.plateau.subtitle, icon: <Activity className="h-5 w-5" /> },
  ];
  return (
    <>
      <Heading title={copy.problemTitle} subtitle={copy.problemSubtitle} />
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
function Step3({ state, update, copy }: StepProps) {
  const opts = [
    { id: "beginner", title: copy.experience.beginner.title, subtitle: copy.experience.beginner.subtitle, icon: <Rocket className="h-5 w-5" /> },
    { id: "intermediate", title: copy.experience.intermediate.title, subtitle: copy.experience.intermediate.subtitle, icon: <Dumbbell className="h-5 w-5" /> },
    { id: "advanced", title: copy.experience.advanced.title, subtitle: copy.experience.advanced.subtitle, icon: <Zap className="h-5 w-5" /> },
  ] as const;

  const ormFields = [
    { key: "bench" as const, label: copy.ormBench, placeholder: "100" },
    { key: "squat" as const, label: copy.ormSquat, placeholder: "120" },
    { key: "deadlift" as const, label: copy.ormDeadlift, placeholder: "140" },
    { key: "ohp" as const, label: copy.ormOhp, placeholder: "70" },
  ];

  const showOrm = state.experience === "advanced";

  return (
    <>
      <Heading title={copy.experienceTitle} subtitle={copy.experienceSubtitle} />
      <div className="space-y-3">
        {opts.map((o) => (
          <OptionCard key={o.id} active={state.experience === o.id} onClick={() => update({ experience: o.id })} icon={o.icon} title={o.title} subtitle={o.subtitle} />
        ))}
      </div>

      <AnimatePresence>
        {showOrm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 overflow-hidden"
          >
            <div className="rounded-3xl border border-primary/20 bg-surface p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-primary/15 grid place-items-center">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{copy.ormTitle}</div>
                  <div className="text-[11px] text-muted-foreground">{copy.ormSubtitle}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ormFields.map((f) => (
                  <div key={f.key}>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{f.label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number" min={10} max={500}
                        value={state.oneRepMax?.[f.key] ?? ""}
                        onChange={(e) => update({ oneRepMax: { ...state.oneRepMax, [f.key]: e.target.value ? Number(e.target.value) : undefined } })}
                        placeholder={f.placeholder}
                        className="w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm font-bold text-white outline-none transition focus:border-primary/40"
                      />
                      <span className="text-xs text-muted-foreground shrink-0">kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── STEP 4: Perfil corporal ─────────────────────────────────────
function Step4({ state, update, copy }: StepProps) {
  const weightVal = state.weight ?? "";
  const heightVal = state.height ?? "";
  const ageVal = state.age ?? "";
  const hasAll = !!state.weight && !!state.height && !!state.age;
  const bmi = hasAll ? state.weight! / ((state.height! / 100) ** 2) : null;
  const bmiLabel = !bmi ? "" : bmi < 18.5 ? copy.bmiUnderweight : bmi < 25 ? copy.bmiHealthy : bmi < 30 ? copy.bmiOverweight : copy.bmiObese;
  const bmiColor = !bmi ? "" : bmi < 18.5 ? "#22d3ee" : bmi < 25 ? "#4ade80" : bmi < 30 ? "#fb923c" : "#f87171";

  const fields = [
    { key: "weight" as const, label: copy.weightLabel, unit: "kg", min: 30, max: 300, placeholder: "70", color: "#22d3ee", val: weightVal },
    { key: "height" as const, label: copy.heightLabel, unit: "cm", min: 100, max: 250, placeholder: "175", color: "#fb923c", val: heightVal },
    { key: "age" as const, label: copy.ageLabel, unit: copy.ageUnit, min: 12, max: 100, placeholder: "25", color: "#a78bfa", val: ageVal },
  ];

  return (
    <>
      <Heading title={copy.bodyProfileTitle} subtitle={copy.bodyProfileSubtitle} />
      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.key} className="rounded-3xl border border-border bg-surface p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: f.color }}>
              <Scale className="h-3.5 w-3.5" /> {f.label}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number" min={f.min} max={f.max} value={f.val}
                onChange={(e) => update({ [f.key]: e.target.value ? Number(e.target.value) : undefined })}
                placeholder={f.placeholder}
                className="flex-1 rounded-2xl border border-border bg-background/60 px-4 py-3 text-2xl font-black text-white outline-none transition focus:border-primary/40"
              />
              <span className="text-base font-semibold text-muted-foreground">{f.unit}</span>
            </div>
          </div>
        ))}

        <AnimatePresence>
          {hasAll && bmi && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl p-4" style={{ background: `${bmiColor}0d`, border: `1px solid ${bmiColor}33` }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: `${bmiColor}bb` }}>{copy.bmiLabel}</div>
                  <div className="font-display text-3xl font-black" style={{ color: bmiColor }}>{bmi.toFixed(1)}</div>
                  <div className="text-xs font-semibold" style={{ color: bmiColor }}>{bmiLabel}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground space-y-1">
                  <div>{copy.weightLabel}: <span className="font-bold text-foreground">{state.weight} kg</span></div>
                  <div>{copy.heightLabel}: <span className="font-bold text-foreground">{state.height} cm</span></div>
                  <div>{copy.ageLabel}: <span className="font-bold text-foreground">{state.age} {copy.ageUnit}</span></div>
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-elevated">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100))}%`, background: `linear-gradient(90deg, #22d3ee, #4ade80, #fb923c, #f87171)` }} />
              </div>
              <div className="mt-1 flex justify-between text-[9px] text-muted-foreground/60">
                <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ── STEP 5: Metabolismo ─────────────────────────────────────────
function Step5({ state, update, copy }: StepProps) {
  const opts = [
    { id: "slow" as const, label: copy.metabolismSlow.label, subtitle: copy.metabolismSlow.subtitle, icon: <Flame className="h-5 w-5" style={{ color: "#fb923c" }} /> },
    { id: "balanced" as const, label: copy.metabolismBalanced.label, subtitle: copy.metabolismBalanced.subtitle, icon: <Activity className="h-5 w-5" style={{ color: "#22d3ee" }} /> },
    { id: "fast" as const, label: copy.metabolismFast.label, subtitle: copy.metabolismFast.subtitle, icon: <Zap className="h-5 w-5" style={{ color: "#4ade80" }} /> },
  ];

  const macros: MacroProfile | null =
    state.metabolismType && state.weight && state.height && state.age && state.goal
      ? calculateCalories({
          weight: state.weight,
          height: state.height,
          age: state.age,
          gender: state.gender ?? "male",
          activityDays: state.days?.length ?? 4,
          metabolismType: state.metabolismType,
          goal: state.goal,
        })
      : null;

  return (
    <>
      <Heading title={copy.metabolismTitle} subtitle={copy.metabolismSubtitle} />
      <div className="space-y-3">
        {opts.map((o) => (
          <OptionCard key={o.id} active={state.metabolismType === o.id} onClick={() => update({ metabolismType: o.id })} icon={o.icon} title={o.label} subtitle={o.subtitle} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {macros ? (
          <motion.div
            key={state.metabolismType}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="mt-5 rounded-3xl border border-primary/20 bg-surface p-5 space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-xl bg-primary/15">
                <Flame className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{copy.caloricPlanTitle}</div>
                <div className="text-[11px] text-muted-foreground">{macros.label}</div>
              </div>
              {macros.surplusOrDeficit !== 0 && (
                <span className={cn(
                  "ml-auto rounded-full px-2 py-1 text-[10px] font-bold",
                  macros.surplusOrDeficit > 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                )}>
                  {macros.surplusOrDeficit > 0 ? "+" : ""}{macros.surplusOrDeficit} kcal
                </span>
              )}
            </div>

            <div className="text-center py-2 border-y border-border/50">
              <div className="font-display text-5xl font-black" style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6,#fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {macros.target}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{copy.kcalDay}</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <MacroBar label={copy.macroProtein} value={macros.protein} unit="g" color="#22d3ee" pct={Math.round((macros.protein * 4 / macros.target) * 100)} />
              <MacroBar label={copy.macroCarbs} value={macros.carbs} unit="g" color="#fb923c" pct={Math.round((macros.carbs * 4 / macros.target) * 100)} />
              <MacroBar label={copy.macroFat} value={macros.fat} unit="g" color="#a78bfa" pct={Math.round((macros.fat * 9 / macros.target) * 100)} />
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-border/50 pt-3 text-xs">
              <div className="rounded-xl bg-elevated p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{copy.tmbLabel}</div>
                <div className="font-display text-base font-bold text-foreground">{macros.bmr} <span className="text-[10px] font-medium text-muted-foreground">kcal</span></div>
              </div>
              <div className="rounded-xl bg-elevated p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{copy.tdeeLabel}</div>
                <div className="font-display text-base font-bold text-foreground">{macros.tdee} <span className="text-[10px] font-medium text-muted-foreground">kcal</span></div>
              </div>
            </div>

            {!state.gender && (
              <p className="text-[10px] text-muted-foreground/60">{copy.metabolismNote}</p>
            )}
          </motion.div>
        ) : state.metabolismType ? (
          <motion.div
            key="missing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-2xl p-3 text-xs text-muted-foreground"
            style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}
          >
            <span className="font-semibold" style={{ color: "#22d3ee" }}>{copy.aiNutritionLabel}</span>
            {copy.fillBodyDataMsg}
          </motion.div>
        ) : (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-2xl p-3 text-xs text-muted-foreground"
            style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}
          >
            <span className="font-semibold" style={{ color: "#22d3ee" }}>{copy.aiNutritionLabel}</span>
            {copy.selectMetabolismMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MacroBar({ label, value, unit, color, pct }: { label: string; value: number; unit: string; color: string; pct: number }) {
  return (
    <div className="rounded-2xl bg-elevated p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-xl font-bold mt-1" style={{ color }}>
        {value}<span className="text-[10px] font-medium text-muted-foreground ml-0.5">{unit}</span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, pct)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground">{pct}%</div>
    </div>
  );
}

// ── STEP 6: Partes do corpo ─────────────────────────────────────
function Step6({ state, update, copy }: StepProps) {
  const selected = state.focusMuscles ?? [];
  const toggle = (m: string) => {
    const next = selected.includes(m) ? selected.filter((x) => x !== m) : [...selected, m];
    update({ focusMuscles: next });
  };
  return (
    <>
      <Heading title={copy.focusMuscleTitle} subtitle={copy.focusMuscleSubtitle} />
      <div className="flex flex-wrap gap-2">
        {(copy.muscleGroups as readonly string[]).map((m) => {
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
          {copy.aiVolumeHintPre} {selected.slice(0, 3).join(", ")}{selected.length > 3 ? ` +${selected.length - 3}` : ""}. {copy.aiVolumeHintSuf}
        </motion.div>
      )}
    </>
  );
}

// ── STEP 7: Local de treino ─────────────────────────────────────
function Step7({ state, update, copy }: StepProps) {
  const opts = [
    { id: "gym", title: copy.locations.gym.title, subtitle: copy.locations.gym.subtitle, icon: <Building2 className="h-5 w-5" />, color: "#fb923c" },
    { id: "home", title: copy.locations.home.title, subtitle: copy.locations.home.subtitle, icon: <House className="h-5 w-5" />, color: "#22d3ee" },
    { id: "hybrid", title: copy.locations.hybrid.title, subtitle: copy.locations.hybrid.subtitle, icon: <Layers className="h-5 w-5" />, color: "#38bdf8" },
    { id: "outdoor", title: copy.locations.outdoor.title, subtitle: copy.locations.outdoor.subtitle, icon: <Trees className="h-5 w-5" />, color: "#4ade80" },
  ] as const;
  const needsGymContext = state.location === "gym" || state.location === "hybrid";
  const selectLocation = (location: (typeof opts)[number]["id"]) => {
    update({
      location,
      gymSize: location === "gym" || location === "hybrid" ? state.gymSize : undefined,
      crowdLevel: location === "gym" || location === "hybrid" ? state.crowdLevel : undefined,
      equipmentAvailability:
        location === "gym" ? "alta" : location === "hybrid" ? "media" : location === "home" ? "baixa" : "media",
      equipment: state.location !== location ? [] : state.equipment,
    });
  };

  return (
    <>
      <Heading title={copy.locationTitle} subtitle={copy.locationSubtitle} />
      <div className="grid gap-3 sm:grid-cols-2">
        {opts.map((option) => {
          const active = state.location === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => selectLocation(option.id)}
              className={cn(
                "relative min-h-[116px] select-none rounded-3xl border p-4 text-left transition-all",
                active
                  ? "border-primary/60 bg-elevated shadow-glow-primary"
                  : "border-border bg-surface hover:border-primary/30 hover:bg-elevated/60",
              )}
            >
              <div className="flex h-full flex-col justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                    style={{
                      background: active ? option.color : `${option.color}18`,
                      color: active ? "#020617" : option.color,
                    }}
                  >
                    {option.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-lg font-bold leading-tight text-foreground">
                      {option.title}
                    </div>
                    <div className="mt-1 text-sm leading-snug text-muted-foreground">
                      {option.subtitle}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Ambiente
                  </span>
                  <span
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full border transition",
                      active ? "border-primary bg-primary" : "border-muted-foreground/40",
                    )}
                  >
                    {active ? <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" /> : null}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

    </>
  );
}

// ── STEP 8: Tipo de Treino ──────────────────────────────────────
function StepTrainingType({ state, update }: StepProps) {
  const selectTrainingType = (trainingType: NonNullable<OnboardingState["trainingType"]>) => {
    update({
      trainingType,
      equipment: filterEquipmentForContext(state.equipment ?? [], state.location ?? "gym", trainingType),
    });
  };

  return (
    <>
      <Heading
        title="Como você quer treinar?"
        subtitle="Essa escolha define quais exercícios e treinos a IA vai montar para você."
      />
      <div className="space-y-3">
        <button
          onClick={() => selectTrainingType("musculacao")}
          className={cn(
            "relative w-full rounded-2xl border p-5 text-left transition-all duration-200",
            state.trainingType === "musculacao"
              ? "border-primary/50 bg-surface shadow-glow-primary"
              : "border-border bg-surface/50 hover:border-border/80 hover:bg-surface",
          )}
        >
          <div className="flex items-start gap-4">
            <div className="mt-0.5 rounded-xl p-2" style={{ background: "rgba(34,211,238,0.12)", color: "#22d3ee" }}>
              <Dumbbell className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-lg font-bold">Musculação</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Treino com pesos — halteres, barras, máquinas e cabos. Academia ou em casa com equipamentos.
              </div>
            </div>
          </div>
        </button>
        <button
          onClick={() => selectTrainingType("funcional")}
          className={cn(
            "relative w-full rounded-2xl border p-5 text-left transition-all duration-200",
            state.trainingType === "funcional"
              ? "border-primary/50 bg-surface shadow-glow-primary"
              : "border-border bg-surface/50 hover:border-border/80 hover:bg-surface",
          )}
        >
          <div className="flex items-start gap-4">
            <div className="mt-0.5 rounded-xl p-2" style={{ background: "rgba(34,211,238,0.12)", color: "#22d3ee" }}>
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-lg font-bold">Funcional</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Treino com movimentos completos — força, core, estabilidade, potência e condicionamento.
              </div>
            </div>
          </div>
        </button>
        <button
          onClick={() => selectTrainingType("calistenia")}
          className={cn(
            "relative w-full rounded-2xl border p-5 text-left transition-all duration-200",
            state.trainingType === "calistenia"
              ? "border-primary/50 bg-surface shadow-glow-primary"
              : "border-border bg-surface/50 hover:border-border/80 hover:bg-surface",
          )}
        >
          <div className="flex items-start gap-4">
            <div className="mt-0.5 rounded-xl p-2" style={{ background: "rgba(251,146,60,0.12)", color: "#fb923c" }}>
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-lg font-bold">Calistenia</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Treino com peso corporal — flexões, barras, paralelas e movimentos funcionais. Pode fazer em qualquer lugar.
              </div>
            </div>
          </div>
        </button>
      </div>
    </>
  );
}

// ── Equipamentos ───────────────────────────────────────────────
// Equipment names must stay in Portuguese — the exercise engine matches against PT names.
const strengthEquipmentByLocation: Record<string, string[]> = {
  home: ["Halteres", "Barras", "Anilhas", "Banco", "Rack", "Barra fixa", "Paralelas", "Argolas", "Kettlebell", "Elásticos", "Roda abdominal"],
  gym: ["Halteres", "Barras", "Anilhas", "Banco", "Rack", "Cabos", "Máquinas", "Barra fixa", "Paralelas", "Argolas", "Kettlebell", "Elásticos", "Roda abdominal"],
  hybrid: ["Halteres", "Barras", "Anilhas", "Banco", "Rack", "Cabos", "Máquinas", "Barra fixa", "Paralelas", "Argolas", "Kettlebell", "Elásticos", "Roda abdominal"],
  outdoor: ["Barra fixa", "Paralelas", "Argolas", "Elásticos"],
};

const functionalEquipmentByLocation: Record<string, string[]> = {
  home: ["Peso corporal", "Tapete/colchonete", "Elásticos", "Barra fixa", "Paralelas", "Argolas", "Roda abdominal", "Corda", "Caixa/step"],
  gym: ["Peso corporal", "Tapete/colchonete", "TRX", "Bola", "Elásticos", "Barra fixa", "Paralelas", "Argolas", "Roda abdominal", "Corda", "Caixa/step"],
  hybrid: ["Peso corporal", "Tapete/colchonete", "TRX", "Bola", "Elásticos", "Barra fixa", "Paralelas", "Argolas", "Roda abdominal", "Corda", "Caixa/step"],
  outdoor: ["Peso corporal", "Barra fixa", "Paralelas", "Argolas", "Elásticos", "Corda"],
};

function resolveEquipmentList(location: string, trainingType: OnboardingState["trainingType"]) {
  if (trainingType === "funcional") {
    return functionalEquipmentByLocation[location] ?? functionalEquipmentByLocation.home;
  }

  return strengthEquipmentByLocation[location] ?? strengthEquipmentByLocation.gym;
}

function filterEquipmentForContext(
  equipment: string[],
  location: string,
  trainingType: OnboardingState["trainingType"],
) {
  const allowed = resolveEquipmentList(location, trainingType);
  return equipment.filter((item) => allowed.includes(item));
}

function Step8({ state, update, copy }: StepProps) {
  const selected = state.equipment ?? [];
  const location = state.location ?? "gym";
  const equipmentList = resolveEquipmentList(location, state.trainingType);
  const allSelected = equipmentList.every((eq) => selected.includes(eq));

  if (state.trainingType === "calistenia") {
    return (
      <>
        <Heading title="Equipamentos" subtitle="Calistenia usa apenas peso corporal." />
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <Activity className="mx-auto mb-3 h-10 w-10 text-primary" />
          <div className="font-display text-lg font-bold">Nenhum equipamento necessário</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Seus treinos de calistenia usam apenas o peso do seu corpo — você pode treinar em qualquer lugar.
          </p>
        </div>
      </>
    );
  }

  const toggle = (eq: string) => {
    const next = selected.includes(eq) ? selected.filter((x) => x !== eq) : [...selected, eq];
    update({ equipment: filterEquipmentForContext(next, location, state.trainingType) });
  };

  const toggleAll = () => {
    update({ equipment: allSelected ? [] : [...equipmentList] });
  };

  return (
    <>
      <Heading title={copy.equipmentTitle} subtitle="A IA monta o plano com base no que você realmente tem." />
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{selected.filter((e) => equipmentList.includes(e)).length} de {equipmentList.length} selecionados</span>
        <button
          onClick={toggleAll}
          className="rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
        >
          {allSelected ? "Desmarcar todos" : "Selecionar todos"}
        </button>
      </div>
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
function Step9({ state, update, copy }: StepProps) {
  const meals = [
    { id: "2", label: copy.mealOptions.m2.label, subtitle: copy.mealOptions.m2.subtitle },
    { id: "3", label: copy.mealOptions.m3.label, subtitle: copy.mealOptions.m3.subtitle },
    { id: "4-5", label: copy.mealOptions.m45.label, subtitle: copy.mealOptions.m45.subtitle },
    { id: "6+", label: copy.mealOptions.m6.label, subtitle: copy.mealOptions.m6.subtitle },
  ];
  const diets = [
    { id: "none", label: copy.dietOptions.none },
    { id: "low_carb", label: copy.dietOptions.low_carb },
    { id: "high_protein", label: copy.dietOptions.high_protein },
    { id: "vegan", label: copy.dietOptions.vegan },
    { id: "if", label: copy.dietOptions.if },
  ];
  return (
    <>
      <Heading title={copy.nutritionHabitsTitle} subtitle={copy.nutritionHabitsSubtitle} />
      <div className="mb-5 space-y-3">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(148,163,184,0.6)" }}>{copy.mealsPerDayLabel}</div>
        {meals.map((m) => (
          <OptionCard key={m.id} active={state.mealFrequency === m.id} onClick={() => update({ mealFrequency: m.id })}
            icon={<Utensils className="h-5 w-5" />} title={m.label} subtitle={m.subtitle} />
        ))}
      </div>
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(148,163,184,0.6)" }}>{copy.dietStyleLabel}</div>
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

// ── STEP 10: Sexo + Ciclo hormonal ─────────────────────────────
function Step10({ state, update, copy }: StepProps) {
  const cyclePhases: Array<{ id: MenstrualCyclePhase; label: string; note: string }> = [
    { id: "menstrual", label: "Menstrual", note: "mais leve" },
    { id: "follicular", label: "Folicular", note: "progressão" },
    { id: "ovulatory", label: "Ovulatória", note: "pico" },
    { id: "luteal", label: "Lútea", note: "controle" },
  ];

  return (
    <>
      <Heading title={copy.cycleRoutineTitle} subtitle={copy.cycleRoutineSubtitle} />

      <div className="mb-5">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(148,163,184,0.6)" }}>{copy.biologicalSexLabel}</div>
        <div className="flex gap-2">
          {[
            { id: "male" as const, label: copy.genderMale, icon: <User className="h-4 w-4" /> },
            { id: "female" as const, label: copy.genderFemale, icon: <User className="h-4 w-4" /> },
            { id: "other" as const, label: copy.genderOther, icon: <Users className="h-4 w-4" /> },
          ].map((g) => (
            <button key={g.id} onClick={() => update({
              gender: g.id,
              trackCycle: g.id === "female" ? state.trackCycle : false,
              menstrualCyclePhase: g.id === "female" ? state.menstrualCyclePhase : undefined,
            })}
              className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-2xl border py-3 text-sm font-semibold transition",
                state.gender === g.id ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow-primary" : "border-border bg-surface text-foreground hover:border-primary/30")}>
              {g.icon} {g.label}
            </button>
          ))}
        </div>
      </div>

      {state.gender === "female" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(148,163,184,0.6)" }}>{copy.hormonalCycleLabel}</div>
          <button
            onClick={() => update({
              trackCycle: !state.trackCycle,
              menstrualCyclePhase: !state.trackCycle ? state.menstrualCyclePhase ?? "follicular" : undefined,
            })}
            className={cn("w-full rounded-2xl border p-4 text-left text-sm transition",
              state.trackCycle ? "border-cyan/50 bg-cyan/5 text-foreground" : "border-border bg-surface text-muted-foreground hover:border-cyan/30")}
          >
            <div className="flex items-center gap-3">
              <Moon className={cn("h-5 w-5", state.trackCycle ? "text-cyan" : "text-muted-foreground")} />
              <div>
                <div className="font-semibold text-foreground">{copy.trackCycleTitle}</div>
                <div className="text-xs text-muted-foreground">{copy.trackCycleSubtitle}</div>
              </div>
            </div>
          </button>
          {state.trackCycle && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {cyclePhases.map((phase) => {
                const active = state.menstrualCyclePhase === phase.id;
                return (
                  <button
                    key={phase.id}
                    onClick={() => update({ menstrualCyclePhase: phase.id })}
                    className={cn(
                      "rounded-2xl border px-3 py-2 text-left transition",
                      active ? "border-primary/60 bg-primary/10 text-foreground" : "border-border bg-surface text-muted-foreground hover:border-primary/30",
                    )}
                  >
                    <div className="text-xs font-bold">{phase.label}</div>
                    <div className="text-[10px] uppercase tracking-[0.16em]">{phase.note}</div>
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}

// ── STEP 10b: Dias + Duração ────────────────────────────────────
function Step10b({ state, update, copy }: StepProps) {
  const days = state.days ?? [];
  const duration = state.duration ?? 60;
  const toggleDay = (d: number) => {
    const next = days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort((a, b) => a - b);
    update({ days: next });
  };

  return (
    <>
      <Heading title={copy.daysTitle} subtitle={copy.durationTitle} />

      <div className="mb-5">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(148,163,184,0.6)" }}>{copy.daysTitle}</div>
        <div className="grid grid-cols-7 gap-1.5">
          {(copy.weekdaysShort as readonly string[]).map((label: string, i: number) => {
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
          <p className="mt-2 text-xs text-muted-foreground">{days.length}{copy.perWeekLabel} · {days.map((d) => copy.weekdaysFull[d]).join(", ")}</p>
        )}
      </div>

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

function buildPersonalizedPhases(state: OnboardingState, copy: CopyType): string[] {
  const goal = (copy.goalLabels as Record<string, string>)[state.goal ?? ""] ?? "fitness";
  const exp = (copy.expLabels as Record<string, string>)[state.experience ?? ""] ?? "";
  const loc = (copy.locLabels as Record<string, string>)[state.location ?? ""] ?? "";
  const days = state.days?.length ?? 4;
  const duration = state.duration ?? 60;
  const equipCount = state.equipment?.length ?? 0;
  const name = state.name?.split(" ")[0] || "você";

  let caloriePhase: string = copy.phaseCaloriesDefault;
  if (state.weight && state.height && state.age && state.metabolismType && state.goal) {
    const m = calculateCalories({
      weight: state.weight,
      height: state.height,
      age: state.age,
      gender: state.gender ?? "male",
      activityDays: days,
      metabolismType: state.metabolismType,
      goal: state.goal,
    });
    caloriePhase = fmt(copy.phaseCalories, { target: m.target, protein: m.protein, carbs: m.carbs });
  }

  return [
    fmt(copy.phaseProfile, { name, goal }),
    fmt(copy.phaseLevel, { exp }),
    equipCount > 0
      ? fmt(copy.phaseEquipment, { count: equipCount })
      : fmt(copy.phaseLocation, { loc }),
    fmt(copy.phaseSchedule, { days, duration }),
    caloriePhase,
    copy.phaseFinale,
  ];
}

// ── STEP 11: IA Analisando ──────────────────────────────────────
function Step11({ state, copy }: { state: OnboardingState; copy: CopyType }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const [pct, setPct] = useState(0);
  const phases = buildPersonalizedPhases(state, copy);
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

  const completedRef = useRef(false);
  useEffect(() => {
    if (pct < 100 || completedRef.current) return;
    completedRef.current = true;
    const current = loadOnboarding();
    saveOnboarding({ ...current, completedAt: new Date().toISOString() });
    window.setTimeout(() => { window.location.href = "/paywall"; }, 600);
  }, [pct]);

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
        {copy.analysingTitle}
      </h1>
      <p className="mt-2 text-sm" style={{ color: "rgba(148,163,184,0.7)" }}>
        {copy.analysingProcessing} {Object.keys(state).filter(k => !["completedAt","avatarUrl"].includes(k)).length} {copy.analysingVarsSuffix}
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
          <span>{copy.generatingLabel}</span>
          <span style={{ color: "#22d3ee" }}>{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,#22d3ee,#3b82f6,#fb923c)", boxShadow: "0 0 12px rgba(34,211,238,0.4)" }}
          />
        </div>
      </div>

      {pct >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-6 flex flex-col items-center gap-4"
        >
          <div
            className="rounded-2xl px-5 py-3 text-center"
            style={{
              background: "rgba(34,211,238,0.08)",
              border: "1px solid rgba(34,211,238,0.2)",
            }}
          >
            <div className="text-sm font-bold" style={{ color: "#22d3ee" }}>
              100% Completo ✓
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {state.name ? `${state.name.split(" ")[0]}, seu plano está pronto!` : "Seu plano personalizado está pronto!"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => { window.location.href = "/paywall"; }}
            className="w-full rounded-full py-3 text-sm font-black text-white"
            style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)", boxShadow: "0 0 20px rgba(34,211,238,0.4)" }}
          >
            Ver meu protocolo →
          </button>
        </motion.div>
      )}
    </div>
  );
}
