import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bell, Camera, Shield, SlidersHorizontal, Sparkles } from "lucide-react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { getSettingsCopy } from "@/lib/app-copy";
import { SUPPORTED_LOCALES, getStoredLocale, setStoredLocale } from "@/lib/locale";
import { loadOnboarding } from "@/lib/onboarding";

export const Route = createFileRoute("/app/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações | 3D Body Scan" },
      { name: "description", content: "Preferências, privacidade e ajustes do app." },
    ],
  }),
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const navigate = useNavigate();
  const profile = loadOnboarding();
  const hasCameraSetup = Boolean(profile.height || profile.weight);
  const currentLocale = getStoredLocale();
  const copy = getSettingsCopy();

  const handleLocaleChange = (nextLocale: string) => {
    if (!SUPPORTED_LOCALES.some((item) => item.code === nextLocale)) return;
    setStoredLocale(nextLocale as typeof currentLocale);
    window.location.reload();
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: "/app/perfil" })}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">{copy.pageTag}</p>
          <h1 className="font-display text-2xl font-bold text-gradient-brand">{copy.pageTitle}</h1>
        </div>
      </div>

      <section className="rounded-3xl border border-border bg-surface p-4">
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold">{copy.sectionTitle}</h2>
          <p className="text-xs text-muted-foreground">{copy.sectionSubtitle}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-elevated/45 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">{copy.languageTitle}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {copy.languageDescription}
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <LocaleSwitcher value={currentLocale} onChange={(next) => handleLocaleChange(next)} align="end" />
                </div>
              </div>
            </div>
          </div>
          <SettingRow icon={Bell} title={copy.notificationsTitle} description={copy.notificationsDescription} status={copy.activeStatus} />
          <SettingRow icon={Shield} title={copy.privacyTitle} description={copy.privacyDescription} status={copy.localStatus} />
          <SettingRow icon={Camera} title={copy.bodyScanTitle} description={copy.bodyScanDescription} status={hasCameraSetup ? copy.configuredStatus : copy.pendingStatus} />
          <SettingRow icon={SlidersHorizontal} title={copy.engineTitle} description={copy.engineDescription} status={copy.adaptiveStatus} />
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-4">
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-elevated/45 p-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-cyan/10 text-cyan">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">{copy.profileStateTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {copy.profileStateDescription}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SettingRow({ icon: Icon, title, description, status }: { icon: typeof Bell; title: string; description: string; status: string; }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-elevated/45 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-background/60 text-cyan">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className="rounded-full bg-cyan/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan">{status}</span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
