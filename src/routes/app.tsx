import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { House, Dumbbell, BookOpen, BarChart3, ScanLine, User, Flame, Loader2, RefreshCw, Sun, Moon } from "lucide-react";
import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SUPPORTED_LOCALES, getStoredLocale, setStoredLocale } from "@/lib/locale";
import { isOnboarded, loadOnboarding, saveOnboarding } from "@/lib/onboarding";
import { onAuth, auth } from "@/lib/auth";
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
import { NotificationBell } from "@/components/NotificationBell";
import { usePushNotifications } from "@/hooks/use-push-notifications";

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
  pt: ["Início", "Treinos", "Biblioteca", "Analytics", "3D Scan", "Perfil"],
  es: ["Inicio", "Entrenos", "Biblioteca", "Analítica", "3D Scan", "Perfil"],
  en: ["Home", "Workouts", "Library", "Analytics", "3D Scan", "Profile"],
  fr: ["Accueil", "Séances", "Bibliothèque", "Analytics", "3D Scan", "Profil"],
  de: ["Start", "Training", "Bibliothek", "Analytics", "3D Scan", "Profil"],
} as const;

const SHELL_COPY = {
  pt: {
    loading: "Preparando seu painel",
    loadingHint: "Verificando sua sessão e sincronizando seus dados.",
    authTimeout: "A autenticação está demorando mais que o normal. Você pode tentar novamente ou voltar para o login.",
    retry: "Tentar novamente",
    goToLogin: "Ir para login",
    online: "Conexão restaurada · sincronizando dados...",
    offline: "Sem internet · dados salvos localmente",
    streakDays: "dias",
  },
  es: {
    loading: "Preparando tu panel",
    loadingHint: "Verificando tu sesión y sincronizando tus datos.",
    authTimeout: "La autenticación está tardando más de lo normal. Puedes intentarlo de nuevo o volver al inicio de sesión.",
    retry: "Intentar de nuevo",
    goToLogin: "Ir al inicio de sesión",
    online: "Conexión restaurada · sincronizando datos...",
    offline: "Sin internet · datos guardados localmente",
    streakDays: "días",
  },
  en: {
    loading: "Setting up your dashboard",
    loadingHint: "Verifying your session and syncing your data.",
    authTimeout: "Authentication is taking longer than normal. You can try again or go back to login.",
    retry: "Try again",
    goToLogin: "Go to login",
    online: "Connection restored · syncing data...",
    offline: "No internet · data saved locally",
    streakDays: "days",
  },
  fr: {
    loading: "Préparation de votre tableau de bord",
    loadingHint: "Vérification de votre session et synchronisation de vos données.",
    authTimeout: "L'authentification prend plus de temps que prévu. Vous pouvez réessayer ou revenir à la connexion.",
    retry: "Réessayer",
    goToLogin: "Aller à la connexion",
    online: "Connexion rétablie · synchronisation en cours...",
    offline: "Pas d'internet · données sauvegardées localement",
    streakDays: "jours",
  },
  de: {
    loading: "Dashboard wird vorbereitet",
    loadingHint: "Sitzung wird überprüft und Daten werden synchronisiert.",
    authTimeout: "Die Authentifizierung dauert länger als erwartet. Du kannst es erneut versuchen oder zur Anmeldung zurückkehren.",
    retry: "Erneut versuchen",
    goToLogin: "Zur Anmeldung",
    online: "Verbindung wiederhergestellt · Daten werden synchronisiert...",
    offline: "Kein Internet · Daten lokal gespeichert",
    streakDays: "Tage",
  },
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
  // getStoredLocale() só existe de verdade no cliente (localStorage) — usar como
  // initializer do useState roda a função também durante o SSR, retornando o
  // idioma padrão "pt" no servidor mas o idioma real no cliente. Isso causa
  // mismatch de hydration nessa tela específica (o layout que envolve TODO o
  // app autenticado) — suspeita forte de ser a causa do "Preparando painel"
  // travado pra sempre em navegação real. Corrigido pro mesmo padrão já usado
  // em paywall/configuracoes/corpo/analytics/index hoje.
  const [locale, setLocale] = useState<ReturnType<typeof getStoredLocale>>("pt");

  // Otimismo: se onboarding está em localStorage, mostra o app imediatamente
  // Roda ANTES do primeiro paint (sem flash de loading para usuários retornando)
  // Firebase verifica a sessão em background e redireciona se expirada
  useLayoutEffect(() => {
    if (isOnboarded()) {
      const current = loadOnboarding();
      setIdentity({
        name: current.name?.trim() || "Atleta 3D Body Scanner",
        avatarUrl: current.avatarUrl ?? "",
      });
      setReady(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    // Fast path: espera Firebase Auth ler do IndexedDB (geralmente < 200ms)
    // auth.authStateReady() é a API correta — auth.currentUser é null antes dessa promessa resolver
    auth.authStateReady().then(() => {
      if (!cancelled && auth.currentUser && isOnboarded()) {
        window.clearTimeout(timeout);
        applyIdentity(auth.currentUser);
        setReady(true);
      }
    }).catch(() => {});

    const unsub = onAuth((user) => {
      window.clearTimeout(timeout);
      setAuthTimedOut(false);
      void (async () => {
        try {
          if (!user) {
            navigate({ to: "/" });
            return;
          }

          // Bloquear acesso se e-mail ainda não verificado após novo cadastro
          const pendingUid = localStorage.getItem("zyrox.emailPending");
          if (pendingUid === user.uid) {
            navigate({ to: "/email-pendente" });
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
            void Promise.all([
              restoreLocalStateFromFirestore(user.uid),
              import("@/lib/workout-customizations").then(({ restoreCustomizationsFromFirestore }) =>
                restoreCustomizationsFromFirestore(user.uid),
              ),
            ]).then(() => {
              if (cancelled) return;
              applyIdentity(user);
              setTrainingRefresh((value) => value + 1);
            }).catch(() => {});
            return;
          }

          // Timeout de 5s — evita travar se Firestore demorar na 1ª sessão
          const profile = await Promise.race([
            loadProfileFromFirestore(user.uid),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
          ]).catch(() => null);
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
          void Promise.all([
            restoreLocalStateFromFirestore(user.uid),
            import("@/lib/workout-customizations").then(({ restoreCustomizationsFromFirestore }) =>
              restoreCustomizationsFromFirestore(user.uid),
            ),
          ]).then(() => {
            if (cancelled) return;
            applyIdentity(user);
            setTrainingRefresh((value) => value + 1);
          }).catch(() => {});
        } catch {
          // Erro inesperado: mostra o app de qualquer forma para não travar
          if (!cancelled) {
            if (isOnboarded()) setReady(true);
            else navigate({ to: "/" });
          }
        }
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

  useEffect(() => {
    const handler = (e: Event) => {
      const next = (e as CustomEvent<typeof locale>).detail;
      setLocale(next);
    };
    window.addEventListener("zyrox-locale-change", handler);
    return () => window.removeEventListener("zyrox-locale-change", handler);
  }, []);

  const handleLocaleChange = (nextLocale: string) => {
    if (!SUPPORTED_LOCALES.some((item) => item.code === nextLocale)) return;
    const locale = nextLocale as ReturnType<typeof getStoredLocale>;
    setLocale(locale);
    setStoredLocale(locale);
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
  const sc = SHELL_COPY[getStoredLocale()] ?? SHELL_COPY.pt;
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-foreground">
      <div className="w-full max-w-sm text-center">
        <Logo size={54} className="mx-auto" />
        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          {sc.loading}
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {timedOut ? sc.authTimeout : sc.loadingHint}
        </p>
        {timedOut && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground"
            >
              <RefreshCw className="h-4 w-4" />
              {sc.retry}
            </button>
            <button
              type="button"
              onClick={onLogin}
              className="rounded-2xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {sc.goToLogin}
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
  const [showAiChat, setShowAiChat] = useState(false);
  const sc = SHELL_COPY[locale] ?? SHELL_COPY.pt;
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
  usePushNotifications();

  useEffect(() => {
    if (typeof window === "undefined") return;
    let timeoutId: number | null = null;
    let idleId: number | null = null;
    const schedule = () => setShowAiChat(true);
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(schedule, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(schedule, 1800) as unknown as number;
    }
    return () => {
      if (idleId !== null && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, []);

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
          {isOnline ? sc.online : sc.offline}
        </div>
      )}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-3 sm:px-4 lg:px-8">
          <Logo size={38} />
            <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggleButton />
            <LocaleSwitcher value={locale} onChange={(next) => handleLocaleChange(next)} tiny />
            <Link
              to="/onboarding/$step"
              params={{ step: "1" }}
              className="hidden rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/15 sm:inline-flex"
            >
              Onboarding
            </Link>
            {gamification.streakDays > 0 && (
              <div className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-primary md:flex">
                <Flame className="h-3.5 w-3.5" /> {gamification.streakDays} {sc.streakDays}
              </div>
            )}
            <NotificationBell
              streakDays={gamification.streakDays}
              hasDailyMission={false}
            />
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
          <div className="pointer-events-none fixed left-0 top-0 h-[400px] w-[300px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[80px] opacity-20" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.3) 0%,transparent 70%)", willChange: "transform" }} />
          <div className="pointer-events-none fixed bottom-0 right-0 h-[400px] w-[300px] translate-x-1/2 translate-y-1/4 rounded-full blur-[80px] opacity-15" style={{ background: "radial-gradient(circle,rgba(251,146,60,0.3) 0%,transparent 70%)", willChange: "transform" }} />
          <motion.div
            key={loc.pathname + "-" + locale}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      {showAiChat && (
        <Suspense fallback={null}>
          <AiChat />
        </Suspense>
      )}
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
                <n.icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
                <span className="max-w-full truncate">{n.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
