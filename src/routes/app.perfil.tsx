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
import { buildAthleteProfile } from "@/domain/athlete/profile";
import { buildGeneratedTrainingState } from "@/domain/training/engine";
import { useGamification } from "@/hooks/use-gamification";
import { resolveTrainingSplit } from "@/domain/training/rules";
import { clearOnboarding, loadOnboarding, type OnboardingState } from "@/lib/onboarding";
import { logout } from "@/lib/auth";
import { getModalityLabel, getSplitLabel } from "@/lib/training-i18n";
import { getDashboardCopy } from "@/lib/app-copy";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil | 3D Body Scan" },
      { name: "description", content: "Sua jornada, contexto e configurações do motor." },
    ],
  }),
  component: Perfil,
});

const normalizedGoalLabels = {
  ganho_massa: "Ganho de Massa",
  perda_peso: "Perda de Peso",
  definicao: "Definição",
  forca: "Força",
  performance: "Performance",
  saude: "Saude",
} as const;

const normalizedExperienceLabels = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
} as const;

const normalizedLocationLabels = {
  academia: "Academia",
  casa: "Casa",
  hibrido: "Híbrido",
  outdoor: "Outdoor",
} as const;

const normalizedConsistencyLabels = {
  ocasional: "Ocasional",
  regular: "Regular",
  elite: "Elite",
} as const;

const gymSizeLabels = {
  pequena: "Academia Pequena",
  media: "Academia Média",
  grande: "Academia Grande",
} as const;

const crowdLevelLabels = {
  vazio: "Horário Vazio",
  normal: "Horário Normal",
  pico: "Horário de Pico",
} as const;

const sexLabels = {
  feminino: "Feminino",
  masculino: "Masculino",
} as const;

const menstrualPhaseLabels = {
  menstrual: "Menstrual | intensidade leve",
  follicular: "Folicular | progressão",
  ovulatory: "Ovulatória | pico controlado",
  luteal: "Lútea | recuperação protegida",
} as const;

function Perfil() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<OnboardingState>({});

  useEffect(() => {
    setProfile(loadOnboarding());
  }, []);

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
  const { gamification, dopamineLoop } = useGamification(trainingState);
  const normalizedFocus = normalizedGoalLabels[athleteProfile.goal];
  const normalizedExperience = normalizedExperienceLabels[athleteProfile.level];
  const normalizedLocation = normalizedLocationLabels[athleteProfile.location];
  const normalizedConsistency = normalizedConsistencyLabels[athleteProfile.consistency];
  const normalizedSplit = getSplitLabel(resolveTrainingSplit(athleteProfile));
  const normalizedTrainingType = getModalityLabel(trainingState.periodization.modality);
  const dashboardCopy = getDashboardCopy();
  const normalizedDaysPerWeek = athleteProfile.availableDays.length;
  const plannedDaysPerWeek = trainingState.schedule.filter((item) => item.workoutId).length;
  const normalizedDuration = `${athleteProfile.workoutDurationMin} min`;
  const gymContext = trainingState.environment.gymSize
    ? gymSizeLabels[trainingState.environment.gymSize]
    : "Não se aplica";
  const crowdContext = trainingState.environment.crowdLevel
    ? crowdLevelLabels[trainingState.environment.crowdLevel]
    : "Não se aplica";
  const unlockedCount = gamification.achievements.filter((achievement) => achievement.unlocked).length;
  const equipmentSummary = athleteProfile.equipment.length
    ? `${athleteProfile.equipment.length} itens selecionados`
    : "Sem restrição informada";
  const frequencySummary =
    normalizedDaysPerWeek > 0
      ? `${normalizedDaysPerWeek} dias por semana`
      : `${plannedDaysPerWeek} dias planejados automaticamente`;
  const sexSummary = athleteProfile.sex ? sexLabels[athleteProfile.sex] : "Não informado";
  const muscleFocusSummary = athleteProfile.preferredFocus.length
    ? athleteProfile.preferredFocus.join(", ")
    : athleteProfile.sex === "feminino"
      ? "Membros inferiores e glúteos"
      : "Equilibrado";
  const cycleSummary =
    athleteProfile.sex === "feminino"
      ? athleteProfile.trackCycle
        ? athleteProfile.menstrualCyclePhase
          ? menstrualPhaseLabels[athleteProfile.menstrualCyclePhase]
          : "Ativo | fase não informada"
        : "Não ativado"
      : "Não se aplica";
  const completion = Math.min(
    100,
    [
      profile.email,
      profile.name,
      profile.avatarUrl,
      profile.goal,
      profile.consistency,
      profile.experience,
      profile.location,
      profile.trainingType,
      profile.gymSize,
      profile.crowdLevel,
      profile.equipment?.length,
      profile.days?.length,
      profile.duration,
      profile.result,
      profile.completedAt,
    ].filter(Boolean).length * 9,
  );

  return (
    <div className="space-y-5 pb-4">
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-surface p-5 shadow-elevated">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.78_0.14_220_/_0.16),transparent_38%),radial-gradient(circle_at_bottom_left,oklch(0.74_0.17_53_/_0.18),transparent_35%)]" />
        {/* Mascote decorativo */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 z-0"
          style={{ transform: "translateX(30%)", animation: "mascotFadeIn 1.1s ease-out forwards", opacity: 0 }}
        >
          <img
            src="/mascote-sem-fundo.png"
            alt=""
            style={{
              width: 200, height: 200, objectFit: "contain",
              opacity: 0.55,
              filter: "drop-shadow(0 0 30px rgba(34,211,238,0.45)) drop-shadow(0 0 15px rgba(251,146,60,0.35))",
            }}
          />
        </div>
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-18 w-18 shrink-0 place-items-center overflow-hidden rounded-[1.6rem] bg-gradient-primary text-xl font-black text-primary-foreground shadow-glow-primary">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={athleteProfile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profileInitials
                )}
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan">
                  <BadgeCheck className="h-3 w-3" />
                  {athleteProfile.name}
                </div>
                <h1 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl text-gradient-brand">
                  {dashboardCopy.profileTitle}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {normalizedExperience} | {normalizedLocation}
                </p>
                <div className="mt-3">
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
                    }}
                    durationInFrames={390}
                    title="Compartilhar perfil"
                    label="Compartilhar perfil"
                  />
                </div>
              </div>
            </div>

            <div className="hidden rounded-2xl border border-border bg-background/40 px-4 py-3 text-right backdrop-blur sm:block">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Engine score
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-gradient-ai">
                {trainingState.workouts.length * 12 + normalizedDaysPerWeek * 8}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <StatCard
              icon={Flame}
              value={`${Math.max(normalizedDaysPerWeek, 1)} dias`}
              label="Rotina ativa"
              accent="text-primary"
            />
            <StatCard
              icon={Zap}
              value={`${trainingState.workouts.length}x`}
              label="Treinos na semana"
              accent="text-cyan"
            />
            <StatCard
              icon={Trophy}
              value={`${unlockedCount}`}
              label={dashboardCopy.achievementsOpen}
              accent="text-success"
            />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <StatCard icon={Trophy} value={`Lv ${gamification.level}`} label="Nível" accent="text-primary" />
            <StatCard icon={Sparkles} value={`${gamification.xp}`} label="XP total" accent="text-cyan" />
            <StatCard
              icon={Flame}
              value={`${gamification.streakDays} dias`}
              label="Streak"
              accent="text-success"
            />
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-background/35 p-4 backdrop-blur">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progresso do atleta</span>
              <span>{completion}% concluído</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-elevated/80">
              <div
                className="h-full rounded-full bg-gradient-ai transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <ProfileChip icon={Target} label={normalizedFocus} />
              <ProfileChip icon={Sparkles} label={normalizedTrainingType} />
              <ProfileChip icon={MapPin} label={normalizedLocation} />
              <ProfileChip
                icon={CalendarDays}
                label={`${plannedDaysPerWeek} dias/semana`}
              />
              <ProfileChip icon={Timer} label={normalizedDuration} />
            </div>
          </div>
        </div>
      </section>

      <AIInsightCard>
        <strong>Leitura da IA:</strong> seu perfil está calibrado para{" "}
        <span className="text-cyan">{normalizedFocus.toLowerCase()}</span>, com janela ideal de{" "}
        <span className="text-cyan">{normalizedDuration.toLowerCase()}</span>, consistência{" "}
        <span className="text-cyan">{normalizedConsistency.toLowerCase()}</span> e divisão{" "}
        <span className="text-cyan">{normalizedSplit.toLowerCase()}</span>.
      </AIInsightCard>

      <AIInsightCard>
        <strong>{dopamineLoop.headline}</strong> {dopamineLoop.message}
        <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan">
          {dopamineLoop.momentumLabel}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{dopamineLoop.nextUnlock}</div>
      </AIInsightCard>

      <section className="rounded-3xl border border-border bg-surface p-4">
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold">Missões premium</h2>
          <p className="text-xs text-muted-foreground">
            Jornada distribuída entre diária, semanal, mensal, trimestral, semestral e anual
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(gamification.missions).map(([window, missions]) => {
            const mission = missions[0];
            const progressPct = Math.min(100, Math.round((mission.progress / mission.target) * 100));

            return (
              <div key={window} className="rounded-2xl border border-border bg-elevated/45 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan">
                  {window}
                </div>
                <div className="mt-2 text-sm font-semibold">{mission.title}</div>
                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {mission.description}
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {mission.progress} / {mission.target}
                  </span>
                  <span>{progressPct}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background/60">
                  <div
                    className="h-full rounded-full bg-gradient-ai transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-surface p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold">Blueprint do atleta</h2>
              <p className="text-xs text-muted-foreground">
                Resumo do plano usado pelo motor de personalização
              </p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3 w-3" />
              Plano ativo
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <PlanCard icon={Target} label="Foco principal" value={normalizedFocus} />
            <PlanCard icon={User} label="Perfil biológico" value={sexSummary} />
            <PlanCard icon={Sparkles} label="Modalidade" value={normalizedTrainingType} />
            <PlanCard icon={Brain} label="Experiência" value={normalizedExperience} />
            <PlanCard icon={MapPin} label="Ambiente" value={normalizedLocation} />
            <PlanCard icon={Target} label="Foco muscular" value={muscleFocusSummary} />
            <PlanCard icon={Moon} label="Ciclo menstrual" value={cycleSummary} />
            <PlanCard
              icon={CalendarDays}
              label="Frequência"
              value={frequencySummary}
            />
            <PlanCard icon={Timer} label="Duração média" value={normalizedDuration} />
            <PlanCard
              icon={Sparkles}
              label="Equipamentos"
              value={equipmentSummary}
            />
            <PlanCard icon={Zap} label="Consistência" value={normalizedConsistency} />
            <PlanCard
              icon={Brain}
              label="Divisão ativa"
              value={`${normalizedSplit} | ${trainingState.workouts.length} treinos`}
            />
            <PlanCard icon={MapPin} label="Porte / acesso" value={gymContext} />
            <PlanCard icon={CalendarDays} label="Fluxo da academia" value={crowdContext} />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-4">
            <div className="mb-4">
              <h2 className="font-display text-lg font-semibold">{dashboardCopy.achievementsTitle}</h2>
              <p className="text-xs text-muted-foreground">
                {unlockedCount} de {gamification.achievements.length} desbloqueadas
              </p>
            </div>

            <div className="space-y-2.5">
            {gamification.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3 transition",
                  achievement.unlocked
                    ? "border-primary/25 bg-elevated/50"
                    : "border-border bg-background/30 opacity-60",
                )}
              >
                <div
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg",
                    achievement.unlocked
                      ? "bg-primary/15 text-primary"
                      : "bg-elevated text-muted-foreground",
                  )}
                >
                  {achievement.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{achievement.title}</div>
                  <div className="text-[11px] leading-relaxed text-muted-foreground">
                    {achievement.desc}
                  </div>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {achievement.unlocked ? "On" : "Lock"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => navigate({ to: "/app/configuracoes" })}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Configurações
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
          Sair da conta
        </button>
        <button
          onClick={() => {
            clearOnboarding();
            setProfile({});
            navigate({ to: "/onboarding/$step", params: { step: "1" } });
          }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 text-sm font-medium text-muted-foreground transition hover:bg-elevated"
        >
          Refazer onboarding
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

function ProfileChip({
  icon: Icon,
  label,
}: {
  icon: typeof Target;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-medium text-foreground/90">
      <Icon className="h-3.5 w-3.5 text-cyan" />
      {label}
    </div>
  );
}

function PlanCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-elevated/45 p-4">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-cyan" />
        {label}
      </div>
      <div className="mt-2 font-display text-lg font-bold leading-tight">{value}</div>
    </div>
  );
}



