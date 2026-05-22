import { useMemo } from "react";
import type { SavedWorkout } from "@/lib/workout-history";
import type { FirestoreBodyScan } from "@/lib/firestore-body-scans";
import type { FirestoreFoodScan } from "@/lib/firestore-food-scans";
import type { AthleteProfile } from "@/domain/athlete/profile";

function startOfWeek(d: Date) {
  const t = new Date(d);
  t.setDate(t.getDate() - ((t.getDay() + 6) % 7)); // segunda-feira
  t.setHours(0, 0, 0, 0);
  return t;
}
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function startOfQuarter(d: Date) { const m = Math.floor(d.getMonth() / 3) * 3; return new Date(d.getFullYear(), m, 1); }
function startOfSemester(d: Date) { return new Date(d.getFullYear(), d.getMonth() < 6 ? 0 : 6, 1); }
function startOfYear(d: Date) { return new Date(d.getFullYear(), 0, 1); }

function computeStreak(workouts: SavedWorkout[]): number {
  if (workouts.length === 0) return 0;
  const days = Array.from(new Set(workouts.map((w) => new Date(w.date).toDateString())))
    .map((s) => new Date(s))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const day of days) {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((cursor.getTime() - d.getTime()) / 86400000);
    if (diff > 1) break;
    streak++;
    cursor = d;
  }
  return streak;
}

function computeXP(workouts: SavedWorkout[]): number {
  return workouts.reduce((sum, w) => {
    const base = 100;
    const dur = Math.floor((w.duration ?? 0) / 10) * 5;
    const comp = Math.round(((w.completedSets ?? 0) / Math.max(1, w.totalSets ?? 1)) * 50);
    return sum + base + dur + comp;
  }, 0);
}

export function useRealGamification(
  workouts: SavedWorkout[],
  bodyScans: FirestoreBodyScan[],
  foodScans: FirestoreFoodScan[],
  profile: AthleteProfile,
) {
  return useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();
    const week = startOfWeek(now);
    const month = startOfMonth(now);
    const quarter = startOfQuarter(now);
    const semester = startOfSemester(now);
    const year = startOfYear(now);

    const inRange = (w: SavedWorkout, from: Date) => new Date(w.date) >= from;

    const todayW   = workouts.filter((w) => new Date(w.date).toDateString() === todayStr);
    const weekW    = workouts.filter((w) => inRange(w, week));
    const monthW   = workouts.filter((w) => inRange(w, month));
    const quarterW = workouts.filter((w) => inRange(w, quarter));
    const semW     = workouts.filter((w) => inRange(w, semester));
    const yearW    = workouts.filter((w) => inRange(w, year));

    const xp     = computeXP(workouts);
    const level  = Math.max(1, Math.floor(xp / 500) + 1);
    const streak = computeStreak(workouts);

    const weekTarget = Math.max(3, profile.availableDays.length || 3);
    const monthTarget  = weekTarget * 4;
    const quarterTarget = weekTarget * 13;
    const semTarget    = weekTarget * 26;
    const yearTarget   = weekTarget * 52;

    const latestBodyFat = bodyScans[0]?.estimativas.percentualGorduraEstimado ?? 0;
    const prevBodyFat   = bodyScans[1]?.estimativas.percentualGorduraEstimado ?? latestBodyFat;
    const bodyImproving = latestBodyFat < prevBodyFat && bodyScans.length > 1;

    const todayFoodKcal = foodScans
      .filter((f) => new Date(f.date).toDateString() === todayStr)
      .reduce((s, f) => s + (f.kcal ?? 0), 0);

    const workoutRate = Math.min(100, Math.round((weekW.length / weekTarget) * 100));

    const missions = {
      diaria: [{
        id: "daily-workout", window: "diaria" as const,
        title: "Fechar o treino do dia",
        description: "Conclua o bloco principal sem perder a ordem planejada.",
        progress: Math.min(todayW.length, 1), target: 1,
        completed: todayW.length >= 1,
      }],
      semanal: [{
        id: "weekly-consistency", window: "semanal" as const,
        title: "Consistência da semana",
        description: "Feche os treinos planejados da semana com aderência alta.",
        progress: weekW.length, target: weekTarget,
        completed: weekW.length >= weekTarget,
      }],
      mensal: [{
        id: "monthly-rhythm", window: "mensal" as const,
        title: "Ritmo mensal",
        description: "Sustente treinos em bloco contínuo durante o mês.",
        progress: monthW.length, target: monthTarget,
        completed: monthW.length >= monthTarget,
      }],
      trimestral: [{
        id: "quarterly-transform", window: "trimestral" as const,
        title: "Transformação do bloco",
        description: "Consolide um trimestre de evolução com scans confiáveis.",
        progress: quarterW.length + bodyScans.length,
        target: Math.max(1, quarterTarget + 3),
        completed: quarterW.length >= quarterTarget,
      }],
      semestral: [{
        id: "semester-engine", window: "semestral" as const,
        title: "Motor de consistência",
        description: "Segure o plano por seis meses com alto controle de execução.",
        progress: semW.length, target: Math.max(1, semTarget),
        completed: semW.length >= semTarget,
      }],
      anual: [{
        id: "annual-journey", window: "anual" as const,
        title: "Jornada anual premium",
        description: "Feche o ano com corpo, treino e aderência evoluindo juntos.",
        progress: yearW.length, target: Math.max(1, yearTarget),
        completed: yearW.length >= yearTarget,
      }],
    };

    const achievements = [
      { id: "first-week",   title: "Primeira Semana",    desc: "7 dias de consistência no plano",         icon: "🔥",  unlocked: streak >= 7 || workouts.length >= 7 },
      { id: "plan-set",     title: "Plano Estruturado",  desc: "7 treinos planejados na semana",           icon: "📋",  unlocked: weekW.length >= weekTarget },
      { id: "21-days",      title: "Disciplina Cinza",   desc: "21 dias consecutivos de aderência",        icon: "💎",  unlocked: streak >= 21 },
      { id: "skill-master", title: "Skill Master",       desc: "Perfil orientado para performance",        icon: "⚡",  unlocked: profile.level === "avancado" },
      { id: "xp-marathon",  title: "Maratona",           desc: "1000 XP acumulados no ecossistema",        icon: "🏆",  unlocked: xp >= 1000 },
      { id: "ai-adapted",   title: "AI Adapted",         desc: "30+ treinos com dados reais registrados",  icon: "🤖",  unlocked: workouts.length >= 30 },
    ];

    return {
      xp,
      level,
      streakDays: streak,
      workoutCompletionRate: workoutRate,
      hydrationCompletionRate: 0,
      nutritionCompletionRate: todayFoodKcal > 0 ? Math.min(100, Math.round((todayFoodKcal / 2000) * 100)) : 0,
      missions,
      achievements,
      stats: {
        totalWorkouts: workouts.length,
        thisWeek: weekW.length,
        thisMonth: monthW.length,
        bodyScansCount: bodyScans.length,
        foodScansCount: foodScans.length,
        latestBodyFat,
        bodyImproving,
      },
    };
  }, [workouts, bodyScans, foodScans, profile]);
}
