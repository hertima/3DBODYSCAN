import { createFileRoute, Outlet, useNavigate, useParams, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ProgressBar } from "@/components/ProgressBar";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding · ZYROX" },
      { name: "description", content: "Configuração inteligente do seu plano fitness ZYROX." },
    ],
  }),
  component: OnboardingLayout,
});

const TOTAL = 9;

function OnboardingLayout() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { step?: string };
  const step = Math.max(1, Math.min(TOTAL, parseInt(params.step ?? "1", 10) || 1));
  const progress = (step / TOTAL) * 100;

  const goBack = () => {
    if (step > 1) navigate({ to: "/onboarding/$step", params: { step: String(step - 1) } });
    else navigate({ to: "/" });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-4">
          <button onClick={goBack} aria-label="Voltar" className="rounded-full p-2 text-primary hover:bg-elevated">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Logo withText size={24} />
          <Link to="/app" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Pular
          </Link>
        </div>
        <div className="mx-auto max-w-xl px-4 pb-3">
          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]">
            <span className="text-primary">Passo {String(step).padStart(2, "0")} / {TOTAL}</span>
            <span className="text-cyan">{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6 pb-32">
        <Outlet />
      </main>
    </div>
  );
}
