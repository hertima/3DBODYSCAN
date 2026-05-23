import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { House, Dumbbell, BookOpen, BarChart3, ScanLine, User, Flame, Loader2, RefreshCw, Sun, Moon } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SUPPORTED_LOCALES, getStoredLocale, setStoredLocale } from "@/lib/locale";
import { isOnboarded, loadOnboarding, saveOnboarding } from "@/lib/onboarding";
import { onAuth } from "@/lib/auth";
import { loadProfileFromFirestore } from "@/lib/firestore-profile";
import {
  restoreLocalStateFromFirestore,
  startLocalStateAutosync,
  startRealtimeSync,
} from "@/lib/firestore-local-state";
import { useTrainingState } from "@/hooks/use-training-state";
import { useGamification } from "@/hooks/use-gamification";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { cn } from "@/lib/utils";
import { getStoredTheme, setStoredTheme } from "@/lib/theme";

const AiChat = lazy(() =>
  import("@/components/AiChat").then((module) => ({ default: module.AiChat })),
);

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [{ title: "3D Body Scanner | Dashboard" }, { name: "description", content: "Seu painel de evolucao 3D Body Scanner." }],
  }),
  component: AppLayout,
});

type NavItem = { to: string; label: string; icon: typeof House; exact?: boolean };

const NAV_COPY = {
  pt: ["Inicio", "Treinos", "Biblioteca", "Analytics", "3D Scan", "Perfil"],
  es: ["Inicio", "Entrenos", "Biblioteca", "Analitica", "3D Scan", "Perfil"],
  en: ["Home", "Workouts", "Library", "Analytics", "3D Scan", "Profile"],
  fr: ["Accueil", "Seances", "Bibliotheque", "Analytics", "3D Scan", "Profil"],
  de: ["Start", "Training", "Bibliothek", "Analytics", "3D Scan", "Profil"],
} as const;

function getNav(locale: keyof typeof NAV_COPY): NavItem[] {
  const labels = NAV_COPY[locale] ?? NAV_COPY.pt;
  return [
    { to: "/app", label: labels[0], icon: House, exact: true },
    { to: "/app/treinos", label: labels[1], icon: Dumbbell },
    { to: "/app/exercicios", label: labels[2], icon: BookOpen },
    { to: "/app/analytics", label: labels[3], icon: BarChart3 },
    { to: "/app/corpo", label: labels[4], icon: ScanLine },
    { to: "/app/perfil", label: labels[5], icon: User },
  ];
}

function ThemeToggleButton() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(getStoredTheme());
    const handler = (e: Event) => setTheme((e as CustomEvent<"dark" | "light">).detail);
    window.addEventListener("zyrox-theme-change", handler);
    return () => window.removeEventListener("zyrox-theme-change", handler);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setStoredTheme(next);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Alternar tema"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary/30 hover:bg-elevated hover:text-foreground"
    >
      {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
    </button>
  );
}

function AppLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [authTimedOut, setAuthTimedOut] = useState(false);
  const [trainingRefresh, setTrainingRefresh] = useState(0);
  const [identity, setIdentity] = useState({ name: "Atleta 3D Body Scanner", avatarUrl: "" });
  const [locale, setLocale] = useState<ReturnType<typeof getStoredLocale>>(getStoredLocale);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setLocale(getStoredLocale());

    let cancelled = false;
    let stopAutosync: (() => void) | null = null;
    let stopRealtimeSync: (() => void) | null = null;
    const timeout = window.setTimeout(() => {
      if (!cancelled) setAuthTimedOut(true);
    }, 4500);

    const applyIdentity = (user: NonNullable<Parameters<Parameters<typeof onAuth>[0]>[0]>) => {
      const current = loadOnboarding();
      setIdentity({
        name: current.name?.trim() || user.displayName || user.email?.split("@")[0] || "Atleta 3D Body Scanner",
        avatarUrl: current.avatarUrl ?? "",
      });
    };

    const unsub = onAuth((user) => {
      window.clearTimeout(timeout);
      setAuthTimedOut(false);
      void (async () => {
        if (!user) {
          navigate({ to: "/" });
          return;
        }

        const onRemoteChange = () => {
          if (cancelled) return;
          applyIdentity(user);
          setTrainingRefresh((value) => value + 1);
        };

        if (isOnboarded()) {
          applyIdentity(user);
          setReady(true);
          stopAutosync?.();
          stopRealtimeSync?.();
          stopAutosync = startLocalStateAutosync(user.uid);
          stopRealtimeSync = startRealtimeSync(user.uid, onRemoteChange);
          void restoreLocalStateFromFirestore(user.uid).then(() => {
            if (cancelled) return;
            applyIdentity(user);
            setTrainingRefresh((value) => value + 1);
          }).catch(() => {});
          return;
        }

        const profile = await loadProfileFromFirestore(user.uid).catch(() => null);
        if (profile) saveOnboarding(profile);

        if (cancelled) return;

        if (!isOnboarded()) {
          navigate({ to: "/onboarding/$step", params: { step: "1" } });
          return;
        }

        stopAutosync?.();
        stopRealtimeSync?.();
        stopAutosync = startLocalStateAutosync(user.uid);
        stopRealtimeSync = startRealtimeSync(user.uid, onRemoteChange);
        applyIdentity(user);
        setReady(true);
        void restoreLocalStateFromFirestore(user.uid).then(() => {
          if (cancelled) return;
          applyIdentity(user);
          setTrainingRefresh((value) => value + 1);
        }).catch(() => {});
      })();
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      stopAutosync?.();
      stopRealtimeSync?.();
      unsub();
    };
  }, [navigate]);

  const handleLocaleChange = (nextLocale: string) => {
    if (!SUPPORTED_LOCALES.some((item) => item.code === nextLocale)) return;
    setStoredLocale(nextLocale as typeof locale);
    setLocale(nextLocale as typeof locale);
    window.location.reload();
  };

  if (!ready) return <AppLoadingFallback timedOut={authTimedOut} onLogin={() => navigate({ to: "/" })} />;

  return (
    <ReadyAppLayout
      identity={identity}
      locale={locale}
      trainingRefresh={trainingRefresh}
      handleLocaleChange={handleLocaleChange}
    />
  );
}

function AppLoadingFallback({ timedOut, onLogin }: { timedOut: boolean; onLogin: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-foreground">
      <div className="w-full max-w-sm text-center">
        <Logo size={54} className="mx-auto" />
        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparando seu painel
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {timedOut
            ? "A autenticação está demorando mais que o normal. Você pode tentar novamente ou voltar para o login."
            : "Verificando sua sessão e sincronizando seus dados."}
        </p>
        {timedOut && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </button>
            <button
              type="button"
              onClick={onLogin}
              className="rounded-2xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Ir para login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReadyAppLayout({
  identity,
  locale,
  trainingRefresh,
  handleLocaleChange,
}: {
  identity: { name: string; avatarUrl: string };
  locale: ReturnType<typeof getStoredLocale>;
  trainingRefresh: number;
  handleLocaleChange: (nextLocale: string) => void;
}) {
  const loc = useLocation();
  const nav = getNav(locale);
  const trainingState = useTrainingState(trainingRefresh);
  const { gamification } = useGamification(trainingState);
  const initials =
    identity.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "AZ";

  const { isOnline, justReconnected } = useNetworkStatus();

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Banner offline / reconectado */}
      {(!isOnline || justReconnected) && (
        <div
          className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 py-1.5 text-xs font-bold transition-all"
          style={{
            background: isOnline
              ? "linear-gradient(90deg,rgba(16,185,129,0.95),rgba(5,150,105,0.95))"
              : "linear-gradient(90deg,rgba(245,158,11,0.97),rgba(234,88,12,0.97))",
            color: "#fff",
          }}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-white" : "bg-white animate-pulse"}`} />
          {isOnline ? "Conexão restaurada · sincronizando dados..." : "Sem internet · dados salvos localmente"}
        </div>
      )}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-3 sm:px-4 lg:px-8">
          <Logo size={38} />
            <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggleButton />
            <div className="block md:block">
              <LocaleSwitcher value={locale} onChange={(next) => handleLocaleChange(next)} tiny />
            </div>
            <Link
              to="/onboarding/$step"
              params={{ step: "1" }}
              className="hidden rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/15 sm:inline-flex"
            >
              Onboarding
            </Link>
            {gamification.streakDays > 0 && (
              <div className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-primary md:flex">
                <Flame className="h-3.5 w-3.5" /> {gamification.streakDays} dias
              </div>
            )}
            <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground sm:h-9 sm:w-9">
              {identity.avatarUrl ? (
                <img src={identity.avatarUrl} alt={identity.name} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl gap-0 px-3 sm:px-4 lg:gap-8 lg:px-8">
        <aside className="sticky top-[68px] hidden h-[calc(100vh-68px)] w-56 shrink-0 py-6 lg:block">
          <nav className="space-y-1">
            {nav.map((n) => {
              const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active ? "bg-elevated text-foreground border-l-2 border-cyan" : "text-muted-foreground hover:bg-surface hover:text-foreground border-l-2 border-transparent",
                  )}
                >
                  <n.icon className={cn("h-4 w-4", active && "text-primary")} />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="relative min-w-0 flex-1 pb-nav-safe pt-5 lg:pb-12 lg:pt-6">
          <div className="pointer-events-none fixed left-0 top-0 h-[500px] w-[400px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[120px] opacity-30" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.3) 0%,transparent 70%)" }} />
          <div className="pointer-events-none fixed bottom-0 right-0 h-[500px] w-[400px] translate-x-1/2 translate-y-1/4 rounded-full blur-[120px] opacity-25" style={{ background: "radial-gradient(circle,rgba(251,146,60,0.3) 0%,transparent 70%)" }} />
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={loc.pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Suspense fallback={null}>
        <AiChat />
      </Suspense>
      {/* HIG: safe-area padding + 44px min touch targets */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 max-w-[100vw] border-t border-border bg-background/95 backdrop-blur lg:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <div className="mx-auto grid w-full max-w-xl grid-cols-6 px-1 pt-2 pb-1">
          {nav.map((n) => {
            const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "min-w-0 flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[10px] font-medium transition-all duration-150 active:scale-95",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <n.icon className={cn("h-5 w-5 transition-all", active && "drop-shadow-[0_0_8px_var(--primary)] scale-110")} />
                <span className="max-w-full truncate">{n.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
