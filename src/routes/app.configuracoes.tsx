import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bell, Camera, CheckCircle2, Database, KeyRound, Loader2, Shield, SlidersHorizontal, Sparkles, XCircle } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { getSettingsCopy } from "@/lib/app-copy";
import { SUPPORTED_LOCALES, getStoredLocale, setStoredLocale } from "@/lib/locale";
import { loadOnboarding } from "@/lib/onboarding";

type ConnStatus = "checking" | "ok" | "error";

function useFirebaseStatus() {
  const [auth_status, setAuthStatus] = useState<ConnStatus>("checking");
  const [firestore_status, setFirestoreStatus] = useState<ConnStatus>("checking");

  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      () => setAuthStatus("ok"),
      () => setAuthStatus("error"),
    );
    return unsub;
  }, []);

  useEffect(() => {
    getDoc(doc(db, "_ping", "probe"))
      .then(() => setFirestoreStatus("ok"))
      .catch((err: { code?: string }) => {
        // permission-denied = Firestore reached but access blocked (expected)
        setFirestoreStatus(err.code === "permission-denied" ? "ok" : "error");
      });
  }, []);

  return { auth_status, firestore_status };
}

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
  const { auth_status, firestore_status } = useFirebaseStatus();

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
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold">Firebase</h2>
          <p className="text-xs text-muted-foreground">Status da conexão com os serviços</p>
        </div>
        <div className="space-y-3">
          <FirebaseStatusRow icon={KeyRound} label="Authentication" status={auth_status} />
          <FirebaseStatusRow icon={Database} label="Firestore" status={firestore_status} />
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-elevated/45 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-cyan/10 text-cyan">
              <Shield className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">Security Rules</h3>
                <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${firestore_status === "ok" ? "bg-emerald-400/10 text-emerald-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                  {firestore_status === "ok" ? <CheckCircle2 className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
                  {firestore_status === "ok" ? "Ativas" : "Verificando"}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">v2 · 2026-05-18 · Acesso restrito por usuário</p>
            </div>
          </div>
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

function FirebaseStatusRow({ icon: Icon, label, status }: { icon: typeof Database; label: string; status: ConnStatus }) {
  const map = {
    checking: { text: "Verificando…", color: "text-yellow-400", bg: "bg-yellow-400/10", Icon: Loader2, spin: true },
    ok:       { text: "Conectado",    color: "text-emerald-400", bg: "bg-emerald-400/10", Icon: CheckCircle2, spin: false },
    error:    { text: "Erro",         color: "text-red-400",     bg: "bg-red-400/10",     Icon: XCircle, spin: false },
  } as const;
  const s = map[status];
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-elevated/45 p-4">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${s.bg} ${s.color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">{label}</h3>
          <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${s.bg} ${s.color}`}>
            <s.Icon className={`h-3 w-3 ${s.spin ? "animate-spin" : ""}`} />
            {s.text}
          </div>
        </div>
      </div>
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
