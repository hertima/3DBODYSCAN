import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, Dumbbell, BookOpen, BarChart3, ScanLine, User, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SUPPORTED_LOCALES, getStoredLocale, setStoredLocale } from "@/lib/locale";
import { isOnboarded, loadOnboarding } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [{ title: "3D Body Scan | Dashboard" }, { name: "description", content: "Seu painel de evolucao 3D Body Scan." }],
  }),
  component: AppLayout,
});

type NavItem = { to: string; label: string; icon: typeof Home; exact?: boolean };

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
    { to: "/app", label: labels[0], icon: Home, exact: true },
    { to: "/app/treinos", label: labels[1], icon: Dumbbell },
    { to: "/app/exercicios", label: labels[2], icon: BookOpen },
    { to: "/app/analytics", label: labels[3], icon: BarChart3 },
    { to: "/app/corpo", label: labels[4], icon: ScanLine },
    { to: "/app/perfil", label: labels[5], icon: User },
  ];
}

function AppLayout() {
  const navigate = useNavigate();
  const loc = useLocation();
  const [ready, setReady] = useState(false);
  const [identity, setIdentity] = useState({ name: "Atleta 3D Body Scan", avatarUrl: "" });
  const [locale, setLocale] = useState(getStoredLocale());
  const nav = getNav(locale);
  const initials =
    identity.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "AZ";

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!isOnboarded()) {
      navigate({ to: "/onboarding/$step", params: { step: "1" } });
      return;
    }

    const current = loadOnboarding();
    setIdentity({
      name: current.name?.trim() || current.email?.trim() || "Atleta 3D Body Scan",
      avatarUrl: current.avatarUrl ?? "",
    });
    setReady(true);
  }, [navigate]);

  const handleLocaleChange = (nextLocale: string) => {
    if (!SUPPORTED_LOCALES.some((item) => item.code === nextLocale)) return;
    setStoredLocale(nextLocale as typeof locale);
    setLocale(nextLocale as typeof locale);
    window.location.reload();
  };

  if (!ready) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-3 sm:px-4 lg:px-8">
          <Logo size={38} />
            <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="block md:block">
              <LocaleSwitcher value={locale} onChange={(next) => handleLocaleChange(next)} compact />
            </div>
            <div className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-primary md:flex">
              <Flame className="h-3.5 w-3.5" /> 21 dias
            </div>
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
        <main className="relative min-w-0 flex-1 pb-28 pt-5 lg:pb-12 lg:pt-6">
          <div className="pointer-events-none fixed left-0 top-0 h-[500px] w-[400px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[120px] opacity-30" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.3) 0%,transparent 70%)" }} />
          <div className="pointer-events-none fixed bottom-0 right-0 h-[500px] w-[400px] translate-x-1/2 translate-y-1/4 rounded-full blur-[120px] opacity-25" style={{ background: "radial-gradient(circle,rgba(251,146,60,0.3) 0%,transparent 70%)" }} />
          <Outlet />
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 max-w-[100vw] overflow-hidden border-t border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid w-full max-w-xl grid-cols-6 px-1.5 py-2">
          {nav.map((n) => {
            const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "min-w-0 flex flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <n.icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_6px_var(--primary)]")} />
                <span className="max-w-full truncate">{n.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
