import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Flame, Trophy, Zap, LogOut, Settings } from "lucide-react";
import { achievements } from "@/data/social";
import { clearOnboarding, loadOnboarding } from "@/lib/onboarding";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/perfil")({
  head: () => ({ meta: [{ title: "Perfil · ZYROX" }, { name: "description", content: "Sua jornada, conquistas e configurações." }] }),
  component: Perfil,
});

function Perfil() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ReturnType<typeof loadOnboarding>>({});
  useEffect(() => setProfile(loadOnboarding()), []);

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-surface p-5 shadow-elevated">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-primary text-xl font-bold text-primary-foreground shadow-glow-primary">VC</div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-xl font-bold">Atleta ZYROX</h1>
            <p className="text-xs text-muted-foreground">Nível 12 · Membro desde 2025</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat icon={<Flame className="h-4 w-4 text-primary" />} value="21" label="Streak" />
          <Stat icon={<Zap className="h-4 w-4 text-cyan" />} value="16.4k" label="XP" />
          <Stat icon={<Trophy className="h-4 w-4 text-primary" />} value="7" label="PRs" />
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground"><span>Nível 12</span><span>Nível 13</span></div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
            <div className="h-full rounded-full bg-gradient-primary" style={{ width: "68%" }} />
          </div>
          <div className="mt-1 text-right text-[10px] font-semibold text-cyan">2.480 / 3.650 XP</div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Conquistas</h2>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((a) => (
            <div key={a.id} className={`rounded-2xl border p-3 text-center transition ${a.unlocked ? "border-primary/30 bg-surface" : "border-border bg-surface/40 opacity-50"}`}>
              <div className="text-2xl">{a.icon}</div>
              <div className="mt-1 text-xs font-semibold">{a.title}</div>
              <div className="text-[10px] text-muted-foreground">{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Seu plano</h2>
        <div className="space-y-2 rounded-2xl border border-border bg-surface p-4 text-sm">
          <Row label="Foco" value={({mass:"Ganho de Massa",strength:"Força Funcional",hybrid:"Performance Híbrida",athletic:"Evolução Atlética"} as any)[profile.goal ?? ""] ?? "—"} />
          <Row label="Experiência" value={({beginner:"Iniciante",intermediate:"Intermediário",advanced:"Avançado"} as any)[profile.experience ?? ""] ?? "—"} />
          <Row label="Local" value={({gym:"Academia",home:"Casa",hybrid:"Híbrido",outdoor:"Outdoor"} as any)[profile.location ?? ""] ?? "—"} />
          <Row label="Dias/semana" value={String(profile.days?.length ?? "—")} />
          <Row label="Duração" value={profile.duration ? `${profile.duration} min` : "—"} />
        </div>
      </section>

      <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-4 text-sm font-medium text-muted-foreground hover:text-foreground">
        <Settings className="h-4 w-4" /> Configurações
      </button>
      <button
        onClick={() => { clearOnboarding(); navigate({ to: "/" }); }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 p-4 text-sm font-medium text-destructive hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" /> Refazer onboarding
      </button>
    </div>
  );
}

function Stat({ icon, value, label }: any) {
  return (
    <div className="rounded-xl bg-elevated p-3 text-center">
      <div className="mb-1 flex justify-center">{icon}</div>
      <div className="font-display text-lg font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-1.5 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
