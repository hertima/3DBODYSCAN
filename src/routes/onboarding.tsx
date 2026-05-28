import { createFileRoute, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ProgressBar } from "@/components/ProgressBar";
import { SUPPORTED_LOCALES, getStoredLocale, setStoredLocale, type AppLocale } from "@/lib/locale";
import { getOnboardingCopy } from "@/lib/app-copy";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding · 3D Body Scanner" },
      { name: "description", content: "Configuração inteligente do seu plano fitness 3D Body Scanner." },
    ],
  }),
  component: OnboardingLayout,
});

const TOTAL = 13;

function OnboardingLayout() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { step?: string };
  const step = Math.max(1, Math.min(TOTAL, parseInt(params.step ?? "1", 10) || 1));
  const progress = (step / TOTAL) * 100;

  const [locale, setLocale] = useState<AppLocale>("pt");

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);
  const copy = getOnboardingCopy(locale);

  const handleLocale = (newLocale: AppLocale) => {
    setStoredLocale(newLocale);
    setLocale(newLocale);
  };

  const goBack = () => {
    if (step > 1) navigate({ to: "/onboarding/$step", params: { step: String(step - 1) } });
    else navigate({ to: "/" });
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden"
    >
      {/* Brand glows */}
      <div className="pointer-events-none fixed left-0 top-0 h-[500px] w-[400px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[120px] opacity-25" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.3) 0%,transparent 70%)" }} />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[500px] w-[400px] translate-x-1/2 translate-y-1/4 rounded-full blur-[120px] opacity-20" style={{ background: "radial-gradient(circle,rgba(251,146,60,0.3) 0%,transparent 70%)" }} />


      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        {/* Top bar: back / logo / skip */}
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <button onClick={goBack} aria-label={copy.stepBack} className="rounded-full p-2 text-primary hover:bg-elevated">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Logo withText size={34} />
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <button
              onClick={() => {
                if (getCurrentUser()) navigate({ to: "/app" });
                else navigate({ to: "/" });
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {copy.skipLabel}
            </button>
          </div>
        </div>

        {/* Language flags row */}
        <div className="mx-auto max-w-xl px-4 pb-2">
          <div className="flex items-center justify-center gap-2.5">
            {SUPPORTED_LOCALES.map((loc) => (
              <button
                key={loc.code}
                onClick={() => handleLocale(loc.code)}
                title={loc.nativeLabel}
                className={cn(
                  "relative overflow-hidden rounded-md transition-all duration-200",
                  locale === loc.code
                    ? "ring-2 ring-primary shadow-glow-primary scale-110 opacity-100"
                    : "opacity-40 hover:opacity-70 hover:scale-105",
                )}
              >
                <img
                  src={loc.flagSrc}
                  alt={loc.flag}
                  className="h-[18px] w-[26px] object-cover block"
                  loading="eager"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="mx-auto max-w-xl px-4 pb-3">
          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]">
            <span className="text-primary">{copy.stepLabel} {String(step).padStart(2, "0")} / {TOTAL}</span>
            <span className="text-cyan">{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6 pb-36">
        {/* key={locale} forces remount of child when locale changes so copy updates instantly */}
        <Outlet key={locale} />
      </main>
    </div>
  );
}
