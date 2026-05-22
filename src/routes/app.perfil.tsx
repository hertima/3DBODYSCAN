import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShareVideoButton, ProfileEvolutionVideo } from "@/remotion";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Brain,
  CalendarDays,
  Flame,
  LogOut,
  MapPin,
  Moon,
  Settings,
  Sparkles,
  Target,
  Timer,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { AIInsightCard } from "@/components/AIInsightCard";
import { buildAthleteProfile, type AthleteProfile } from "@/domain/athlete/profile";
import { buildGeneratedTrainingState, type GeneratedTrainingState } from "@/domain/training/engine";
import { resolveTrainingSplit } from "@/domain/training/rules";
import { clearOnboarding, loadOnboarding, type OnboardingState } from "@/lib/onboarding";
import { logout } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { loadProfileFromFirestore } from "@/lib/firestore-profile";
import { loadWorkoutsFromFirestore } from "@/lib/firestore-workouts";
import { loadBodyScansFromFirestore, type FirestoreBodyScan } from "@/lib/firestore-body-scans";
import { loadFoodScansFromFirestore, type FirestoreFoodScan } from "@/lib/firestore-food-scans";
import { useRealGamification } from "@/hooks/use-real-gamification";
import type { SavedWorkout } from "@/lib/workout-history";
import { getModalityLabel, getSplitLabel } from "@/lib/training-i18n";
import { getDashboardCopy, getPerfilCopy, type PerfilCopy } from "@/lib/app-copy";
import { getStoredLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil | 3D Body Scanner" },
      { name: "description", content: "Sua jornada, contexto e configurações do motor." },
    ],
  }),
  component: Perfil,
});


function Perfil() {
  const navigate = useNavigate();
  const [profile, setProfile]       = useState<OnboardingState>({});
  const [workouts, setWorkouts]     = useState<SavedWorkout[]>([]);
  const [bodyScans, setBodyScans]   = useState<FirestoreBodyScan[]>([]);
  const [foodScans, setFoodScans]   = useState<FirestoreFoodScan[]>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    Promise.all([
      loadProfileFromFirestore(uid),
      loadWorkoutsFromFirestore(uid),
      loadBodyScansFromFirestore(uid),
      loadFoodScansFromFirestore(uid),
    ]).then(([prof, w, b, f]) => {
      const local = loadOnboarding();
      if (prof) {
        setProfile({ ...prof, avatarUrl: prof.avatarUrl ?? local.avatarUrl });
      } else {
        setProfile(local);
      }
      setWorkouts(w);
      setBodyScans(b);
      setFoodScans(f);
    }).catch(() => {
      setProfile(loadOnboarding());
    });
  }, []);

  const locale = getStoredLocale();
  const c = getPerfilCopy(locale);
  const athleteProfile = buildAthleteProfile(profile);
  const profileInitials =
    athleteProfile.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "AZ";
  const trainingState = buildGeneratedTrainingState(athleteProfile);
  const gamification  = useRealGamification(workouts, bodyScans, foodScans, athleteProfile);
  const normalizedFocus = c.goalLabels[athleteProfile.goal];
  const normalizedExperience = c.levelLabels[athleteProfile.level];
  const normalizedLocation = c.locationLabels[athleteProfile.location];
  const normalizedConsistency = c.consistencyLabels[athleteProfile.consistency];
  const normalizedSplit = getSplitLabel(resolveTrainingSplit(athleteProfile), locale);
  const normalizedTrainingType = getModalityLabel(trainingState.periodization.modality, locale);
  const dashboardCopy = getDashboardCopy(locale);
  const normalizedDaysPerWeek = athleteProfile.availableDays.length;
  const plannedDaysPerWeek = trainingState.schedule.filter((item) => item.workoutId).length;
  const normalizedDuration = `${athleteProfile.workoutDurationMin} min`;
  const gymContext = trainingState.environment.gymSize
    ? c.gymSizeLabels[trainingState.environment.gymSize]
    : c.notApplicable;
  const crowdContext = trainingState.environment.crowdLevel
    ? c.crowdLabels[trainingState.environment.crowdLevel]
    : c.notApplicable;
  const equipmentSummary = athleteProfile.equipment.length
    ? `${athleteProfile.equipment.length} ${c.equipmentSelected}`
    : c.equipmentNone;
  const sexSummary = athleteProfile.sex ? c.sexLabels[athleteProfile.sex] : c.notProvided;
  const cycleSummary =
    athleteProfile.sex === "feminino"
      ? athleteProfile.trackCycle
        ? athleteProfile.menstrualCyclePhase
          ? c.cycleLabels[athleteProfile.menstrualCyclePhase]
          : c.cycleActiveUnknown
        : c.cycleNotActive
      : c.notApplicable;

  return (
    <div className="space-y-5 pb-4">
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-surface p-6 shadow-elevated">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.78_0.14_220_/_0.16),transparent_38%),radial-gradient(circle_at_bottom_left,oklch(0.74_0.17_53_/_0.18),transparent_35%)]" />
        <div className="relative flex flex-col items-center text-center gap-4">
          {/* Avatar */}
          <div className={`grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-[1.8rem] text-2xl font-black text-primary-foreground ${profile.avatarUrl ? "bg-transparent shadow-none" : "bg-gradient-primary shadow-glow-primary"}`}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={athleteProfile.name} className="h-full w-full object-cover" />
            ) : (
              profileInitials
            )}
          </div>

          {/* Nome + badge */}
          <div>
            <div className="inline-flex items-center gap-1 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan">
              <BadgeCheck className="h-3 w-3" />
              {athleteProfile.name}
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-gradient-brand">
              {dashboardCopy.profileTitle}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {normalizedExperience} · {normalizedLocation}
            </p>
          </div>

          {/* Share */}
          <ShareVideoButton
            composition={ProfileEvolutionVideo as never}
            inputProps={{
              name: athleteProfile.name,
              goal: normalizedFocus ?? athleteProfile.goal,
              level: normalizedExperience ?? athleteProfile.level,
              totalSessions: trainingState.workouts.length,
              weekNumber: trainingState.periodization.currentWeek,
              consistency: gamification.workoutCompletionRate,
              xp: gamification.xp,
              streak: gamification.streakDays,
              badges: gamification.achievements.filter((a) => a.unlocked).slice(0, 6).map((a) => a.icon ?? "🏆"),
              avatarUrl: profile.avatarUrl ?? undefined,
              locale: getStoredLocale(),
            }}
            durationInFrames={390}
            title={c.shareBtn}
            label={c.shareBtn}
          />

          {/* 3 stats principais */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <StatCard icon={Trophy} value={`Lv ${gamification.level}`} label={c.levelLabel} accent="text-primary" />
            <StatCard icon={Flame} value={`${gamification.streakDays}`} label={c.streakLabel} accent="text-success" />
            <StatCard icon={Zap} value={`${gamification.xp}`} label={c.xpLabel} accent="text-cyan" />
          </div>
        </div>
      </section>

      <AIInsightCard>
        <strong>{c.aiInsightLabel}</strong>{" "}
        {c.aiInsightText
          .replace("{focus}", normalizedFocus.toLowerCase())
          .replace("{duration}", normalizedDuration.toLowerCase())
          .replace("{consistency}", normalizedConsistency.toLowerCase())
          .replace("{split}", normalizedSplit.toLowerCase())}
      </AIInsightCard>

      <MissoesSection missions={gamification.missions} copy={c} />

      <BlueprintSection
        normalizedFocus={normalizedFocus}
        normalizedTrainingType={normalizedTrainingType}
        normalizedExperience={normalizedExperience}
        normalizedLocation={normalizedLocation}
        normalizedConsistency={normalizedConsistency}
        normalizedSplit={normalizedSplit}
        normalizedDuration={normalizedDuration}
        normalizedDaysPerWeek={normalizedDaysPerWeek}
        plannedDaysPerWeek={plannedDaysPerWeek}
        sexSummary={sexSummary}
        cycleSummary={cycleSummary}
        equipmentSummary={equipmentSummary}
        gymContext={gymContext}
        crowdContext={crowdContext}
        athleteProfile={athleteProfile}
        trainingState={trainingState}
        copy={c}
      />

      <section className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => navigate({ to: "/app/configuracoes" })}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          {c.settingsBtn}
        </button>
        <button
          onClick={async () => {
            await logout();
            clearOnboarding();
            window.location.assign("/");
          }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm font-medium text-destructive transition hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          {c.signOutBtn}
        </button>
        <button
          onClick={() => {
            clearOnboarding();
            setProfile({});
            navigate({ to: "/onboarding/$step", params: { step: "1" } });
          }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 text-sm font-medium text-muted-foreground transition hover:bg-elevated"
        >
          {c.redoOnboarding}
        </button>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: typeof Flame;
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/35 p-3 backdrop-blur">
      <Icon className={cn("h-4 w-4", accent)} />
      <div className="mt-2 font-display text-xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
    </div>
  );
}


function buildWindowMeta(wl: PerfilCopy["windowLabels"]): Record<string, { label: string; color: string; icon: string }> {
  return {
    diaria:      { label: wl.diaria,      color: "#22d3ee", icon: "⚡" },
    semanal:     { label: wl.semanal,     color: "#3b82f6", icon: "📅" },
    mensal:      { label: wl.mensal,      color: "#a78bfa", icon: "🌙" },
    trimestral:  { label: wl.trimestral,  color: "#f59e0b", icon: "🔥" },
    semestral:   { label: wl.semestral,   color: "#f97316", icon: "⭐" },
    anual:       { label: wl.anual,       color: "#ec4899", icon: "🏆" },
  };
}

function RingProgress({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={4} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ filter: `drop-shadow(0 0 4px ${color}80)`, transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  );
}

type MissionMap = Record<string, Array<{ title: string; description: string; progress: number; target: number; completed: boolean }>>;

function MissoesSection({ missions, copy }: { missions: MissionMap; copy: PerfilCopy }) {
  const entries = Object.entries(missions).filter(([, ms]) => Array.isArray(ms) && ms.length > 0);
  const overall = entries.length
    ? Math.round(entries.reduce((sum, [, ms]) => sum + Math.min(100, ((ms[0]?.progress ?? 0) / (ms[0]?.target || 1)) * 100), 0) / entries.length)
    : 0;

  const WINDOW_META = buildWindowMeta(copy.windowLabels);
  return (
    <section className="rounded-3xl border border-border bg-surface p-4 space-y-4">
      {/* Header com score geral */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">{copy.missionsTitle}</h2>
          <p className="text-[11px] text-muted-foreground">{copy.missionsSubtitle}</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/4 px-4 py-2">
          <span className="font-display text-2xl font-black" style={{ background: "linear-gradient(135deg,#22d3ee,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {overall}%
          </span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">{copy.adherenceLabel}</span>
        </div>
      </div>

      {/* Barra de jornada horizontal */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/6">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${overall}%`, background: "linear-gradient(90deg,#22d3ee,#3b82f6,#a78bfa,#f59e0b,#f97316,#ec4899)" }}
        />
      </div>

      {/* Grid de anéis — linha de resumo */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {entries.map(([window, ms]) => {
          const mission = ms[0];
          if (!mission) return null;
          const pct = Math.min(100, Math.round((mission.progress / (mission.target || 1)) * 100));
          const meta = WINDOW_META[window] ?? { label: window, color: "#64748b", icon: "📌" };
          return (
            <div key={window} className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <RingProgress pct={pct} color={meta.color} size={52} />
                <div className="absolute inset-0 flex items-center justify-center text-sm" style={{ transform: "none" }}>
                  {meta.icon}
                </div>
              </div>
              <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: meta.color }}>{meta.label}</span>
              <span className="text-[9px] font-semibold text-foreground/70">{pct}%</span>
            </div>
          );
        })}
      </div>

    </section>
  );
}

type BlueprintProps = {
  normalizedFocus: string;
  normalizedTrainingType: string;
  normalizedExperience: string;
  normalizedLocation: string;
  normalizedConsistency: string;
  normalizedSplit: string;
  normalizedDuration: string;
  normalizedDaysPerWeek: number;
  plannedDaysPerWeek: number;
  sexSummary: string;
  cycleSummary: string;
  equipmentSummary: string;
  gymContext: string;
  crowdContext: string;
  athleteProfile: AthleteProfile;
  trainingState: GeneratedTrainingState;
  copy: PerfilCopy;
};

function BlueprintSection({
  normalizedFocus, normalizedTrainingType, normalizedExperience, normalizedLocation,
  normalizedConsistency, normalizedSplit, normalizedDuration, normalizedDaysPerWeek,
  plannedDaysPerWeek, sexSummary, cycleSummary, equipmentSummary,
  gymContext, crowdContext, athleteProfile, trainingState, copy,
}: BlueprintProps) {
  const expScore = athleteProfile.level === "avancado" ? 100 : athleteProfile.level === "intermediario" ? 66 : 33;
  const _daysPerWeek = normalizedDaysPerWeek || plannedDaysPerWeek;
  const conBase = athleteProfile.consistency === "elite" ? 100 : athleteProfile.consistency === "regular" ? 66 : 33;
  const conDayBonus = _daysPerWeek >= 6 ? 33 : _daysPerWeek >= 4 ? 16 : 0;
  const conScore = Math.min(100, conBase + conDayBonus);
  const volScore = Math.min(100, Math.round((_daysPerWeek / 7) * 100));
  const durScore = Math.min(100, Math.round((athleteProfile.workoutDurationMin / 120) * 100));
  const focScore = Math.min(100, Math.round((athleteProfile.preferredFocus.length / 10) * 100));
  const eqpScore = Math.min(100, Math.round((athleteProfile.equipment.length / 15) * 100));

  const muscles = athleteProfile.preferredFocus.length
    ? athleteProfile.preferredFocus
    : ["Equilibrado"];

  const muscleColors: Record<string, string> = {
    Peito: "#22d3ee", Costas: "#3b82f6", Ombros: "#a78bfa", Bíceps: "#34d399",
    Tríceps: "#f59e0b", Quadríceps: "#f97316", Posterior: "#ec4899",
    Glúteos: "#e879f9", Panturrilha: "#06b6d4", Abdômen: "#84cc16",
  };

  return (
    <section className="rounded-3xl border border-border bg-surface p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">{copy.blueprintTitle}</h2>
          <p className="text-[11px] text-muted-foreground">{copy.blueprintSubtitle}</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          <Sparkles className="h-3 w-3" /> {copy.activePlanBadge}
        </div>
      </div>

      {/* Score ring + Equalizer — visual único, distinto do radar de analytics */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan/15 bg-black/30 p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(34,211,238,0.07),transparent_55%)]" />
        <div className="relative flex items-center gap-5">
          {/* Anel de score */}
          <div className="relative h-20 w-20 shrink-0">
            {(() => {
              const score = Math.round((expScore + conScore + volScore + durScore + focScore + eqpScore) / 6);
              const r = 34, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
              return (
                <>
                  <svg width={80} height={80} className="absolute inset-0" style={{ transform: "rotate(-90deg)" }}>
                    <defs>
                      <linearGradient id="bpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                    <circle cx={40} cy={40} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7} />
                    <circle cx={40} cy={40} r={r} fill="none" stroke="url(#bpGrad)" strokeWidth={7}
                      strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
                      style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.55))", transition: "stroke-dasharray 0.7s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-xl font-black" style={{ background: "linear-gradient(135deg,#22d3ee,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {score}
                    </span>
                    <span className="text-[7px] font-bold uppercase tracking-widest text-white/25">score</span>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Barras equalizadoras verticais */}
          <div className="flex flex-1 items-end justify-between gap-1.5" style={{ height: 80 }}>
            {([
              { label: "EXP", value: expScore, color: "#a78bfa" },
              { label: "CON", value: conScore, color: "#22d3ee" },
              { label: "VOL", value: volScore, color: "#3b82f6" },
              { label: "DUR", value: durScore, color: "#f59e0b" },
              { label: "FOC", value: focScore, color: "#34d399" },
              { label: "EQP", value: eqpScore, color: "#f97316" },
            ] as const).map(({ label, value, color }) => {
              const barH = Math.max(4, Math.round((value / 100) * 52));
              return (
                <div key={label} className="flex flex-1 flex-col items-center justify-end gap-1" style={{ height: 80 }}>
                  <span className="text-[8px] font-bold tabular-nums" style={{ color }}>{value}</span>
                  <div style={{
                    width: "100%", maxWidth: 26, height: barH,
                    background: `linear-gradient(to top, ${color}40, ${color}cc)`,
                    boxShadow: `0 0 8px ${color}55`,
                    borderRadius: "3px 3px 2px 2px",
                    transition: "height 0.6s ease",
                  }} />
                  <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: `${color}99` }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Atributos badge-style */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Target,       label: copy.attrGoal,        value: normalizedFocus,                                                    color: "#a78bfa" },
          { icon: Sparkles,     label: copy.attrModality,    value: normalizedTrainingType,                                             color: "#22d3ee" },
          { icon: Brain,        label: copy.attrSplit,       value: normalizedSplit,                                                    color: "#3b82f6" },
          { icon: CalendarDays, label: copy.attrFrequency,   value: `${plannedDaysPerWeek || normalizedDaysPerWeek} ${copy.daysPerWeekSuffix}`, color: "#f59e0b" },
          { icon: Timer,        label: copy.attrDuration,    value: normalizedDuration,                                                color: "#34d399" },
          { icon: MapPin,       label: copy.attrEnvironment, value: normalizedLocation,                                                color: "#f97316" },
          { icon: User,         label: copy.attrBioProfile,  value: sexSummary,                                                        color: "#ec4899" },
          { icon: MapPin,       label: copy.attrGym,         value: gymContext,                                                        color: "#06b6d4" },
          ...(athleteProfile.sex === "feminino" ? [{ icon: Moon, label: copy.attrCycle, value: cycleSummary, color: "#e879f9" }] : []),
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-start gap-2.5 rounded-2xl border bg-white/3 p-3" style={{ borderColor: `${color}20` }}>
            <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-xl" style={{ background: `${color}15` }}>
              <Icon className="h-3.5 w-3.5" style={{ color }} />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
              <div className="mt-0.5 truncate text-xs font-semibold leading-tight">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Foco muscular — cloud */}
      <div>
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{copy.muscleFocusLabel}</div>
        <div className="flex flex-wrap gap-1.5">
          {muscles.map((m) => {
            const color = muscleColors[m] ?? "#64748b";
            return (
              <span key={m} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold"
                style={{ borderColor: `${color}40`, background: `${color}12`, color }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                {m}
              </span>
            );
          })}
        </div>
      </div>

      {/* Divisão ativa — cronograma semanal real */}
      <div className="rounded-2xl border border-primary/20 bg-primary/6 px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[9px] font-bold uppercase tracking-widest text-primary/60">{copy.activeSplitLabel}</div>
          <span className="rounded-full border border-border bg-elevated/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {plannedDaysPerWeek} {copy.daysPerWeekSuffix}
          </span>
        </div>
        <div className="space-y-1">
          {trainingState.schedule.map((entry, i) => {
            const workout = entry.workoutId
              ? trainingState.workouts.find((w) => w.id === entry.workoutId) ?? null
              : null;
            const isRepeat = !!workout && trainingState.schedule.slice(0, i).some((e) => e.workoutId === workout.id);
            return (
              <div key={i} className="flex items-center gap-2 min-w-0">
                <span className={cn(
                  "w-7 shrink-0 text-[10px] font-bold",
                  workout ? "text-primary" : "text-muted-foreground/35",
                )}>
                  {copy.scheduleDays[i]}
                </span>
                {workout ? (
                  <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
                    <span className="text-[11px] font-semibold text-foreground leading-tight">{workout.name}</span>
                    {workout.focus && (
                      <span className="min-w-0 truncate text-[10px] text-muted-foreground leading-tight">· {workout.focus}</span>
                    )}
                    {isRepeat && (
                      <span className="ml-auto shrink-0 text-[9px] font-bold text-primary/40">↩</span>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] text-muted-foreground/35">{copy.restDayLabel}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
