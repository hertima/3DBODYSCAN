import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Sparkles, Plus, TrendingUp, TrendingDown, Droplets, Zap, Target, Flame, Camera, Image as ImageIcon, ScanLine, X, Loader2, Check, Ruler, Sun, Maximize2, Smartphone, ArrowRight } from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { MuscleSilhouette } from "@/components/MuscleSilhouette";
import { AIInsightCard } from "@/components/AIInsightCard";
import { bodyMeasures, bodyComposition } from "@/data/body";
import { nutritionToday, aiNutritionTips } from "@/data/nutrition";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/corpo")({
  head: () => ({
    meta: [
      { title: "Corpo · ZYROX" },
      { name: "description", content: "Medições corporais precisas e monitoramento nutricional com IA." },
    ],
  }),
  component: CorpoPage,
});

type Tab = "medidas" | "nutricao";

function CorpoPage() {
  const [tab, setTab] = useState<Tab>("medidas");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">Corpo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Medições corporais precisas e monitoramento nutricional com inteligência artificial, tudo em um só lugar.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
        <TabBtn active={tab === "medidas"} onClick={() => setTab("medidas")}>Medições</TabBtn>
        <TabBtn active={tab === "nutricao"} onClick={() => setTab("nutricao")}>Nutrição</TabBtn>
      </div>

      {tab === "medidas" ? <MedidasTab /> : <NutricaoTab />}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition",
        active ? "bg-gradient-primary text-primary-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/* ----------------------------- MEDIDAS ----------------------------- */

function MedidasTab() {
  return (
    <div className="space-y-4">
      <ScanCTA
        kind="body"
        title="Scan corporal"
        desc="Tire uma foto de corpo inteiro ou envie da galeria — a IA mede automaticamente."
      />
      {/* Silhueta + medidas */}
      <Card>
        <CardHeader title="Silhueta corporal" subtitle="leitura mais recente · hoje" />
        <div className="mt-3 flex gap-3">
          <div className="relative h-72 w-1/2 shrink-0 rounded-xl border border-border bg-elevated/40 p-2">
            <MuscleSilhouette muscle="Full Body" variant="dark" />
          </div>
          <div className="flex w-1/2 flex-col justify-between gap-1.5 py-1">
            {bodyMeasures.map((m) => (
              <div key={m.key} className="flex items-baseline justify-between gap-2 border-b border-border/60 pb-1 last:border-0">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.label}</span>
                <div className="text-right">
                  <span className={cn("font-display text-base font-bold", m.delta >= 0 ? "text-primary" : "text-cyan")}>{m.value}</span>
                  <span className="ml-0.5 text-[10px] text-muted-foreground">{m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="Peso" value={`${bodyComposition.weight} kg`} />
          <Stat label="% Gordura" value={`${bodyComposition.bodyFat}%`} />
          <Stat label="Massa magra" value={`${bodyComposition.muscleMass} kg`} />
        </div>
      </Card>

      <AIInsightCard>
        <strong>IA detectou +1.2cm no peito e -0.8cm na cintura</strong> nas últimas 4 semanas.
        Recomposição corporal em andamento — mantenha o déficit calórico leve.
      </AIInsightCard>

      {/* Grid de cards por medida */}
      <div className="grid grid-cols-2 gap-3">
        {bodyMeasures.map((m) => (
          <MeasureCard key={m.key} m={m} />
        ))}
      </div>

      <ScanHistory kind="body" />
    </div>
  );
}

function MeasureCard({ m }: { m: (typeof bodyMeasures)[number] }) {
  const up = m.delta >= 0;
  const min = Math.min(...m.history);
  const max = Math.max(...m.history);
  const range = Math.max(0.1, max - min);
  const points = m.history
    .map((v, i) => {
      const x = (i / (m.history.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
          <div className="font-display text-xl font-bold">
            {m.value}
            <span className="ml-1 text-xs font-medium text-muted-foreground">{m.unit}</span>
          </div>
        </div>
        <div className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold", up ? "bg-primary/10 text-primary" : "bg-cyan/10 text-cyan")}>
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {up ? "+" : ""}{m.delta}
        </div>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-2 h-10 w-full">
        <polyline
          points={points}
          fill="none"
          stroke={up ? "var(--primary)" : "var(--cyan)"}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-elevated/40 p-2 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-sm font-bold">{value}</div>
    </div>
  );
}

/* ----------------------------- NUTRIÇÃO ----------------------------- */

function NutricaoTab() {
  const { kcal, macros, meals } = nutritionToday;
  const remaining = Math.max(0, kcal.goal - kcal.eaten);
  const pct = Math.min(100, (kcal.eaten / kcal.goal) * 100);

  return (
    <div className="space-y-4">
      <ScanCTA
        kind="food"
        title="Scan da alimentação"
        desc="Aponte para o prato ou envie da galeria — a IA estima calorias e macros."
      />
      <Card>
        <CardHeader title="Resumo de hoje" subtitle="metas calóricas e macros" />
        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-32 w-32 shrink-0">
            <RadialBarChart
              width={128}
              height={128}
              innerRadius="75%"
              outerRadius="100%"
              data={[{ name: "kcal", value: pct, fill: "var(--cyan)" }]}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background={{ fill: "var(--elevated)" }} dataKey="value" cornerRadius={20} />
            </RadialBarChart>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <Flame className="h-4 w-4 text-primary" />
              <div className="font-display text-xl font-bold leading-none">{remaining.toLocaleString()}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">restantes</div>
            </div>
          </div>
          <div className="flex-1 space-y-2.5">
            <MacroBar label="Proteína" eaten={macros.protein.eaten} goal={macros.protein.goal} color="var(--primary)" />
            <MacroBar label="Gordura" eaten={macros.fat.eaten} goal={macros.fat.goal} color="var(--cyan)" />
            <MacroBar label="Carbo" eaten={macros.carbs.eaten} goal={macros.carbs.goal} color="var(--blue-accent)" />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Refeições" subtitle={`${kcal.eaten.toLocaleString()} / ${kcal.goal.toLocaleString()} kcal`} />
        <div className="mt-3 space-y-2">
          {meals.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-elevated/40 p-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {m.time}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.kcal} / {m.goal} kcal</div>
              </div>
              <button className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <AIInsightCard>
        <strong>Você está 60% abaixo da meta de proteína.</strong> Sugestão: adicione 150g de frango grelhado no jantar (+45g de proteína) e mantenha o déficit calórico estável.
      </AIInsightCard>

      <Card>
        <CardHeader title="Sugestões da IA" subtitle="ajustes personalizados" />
        <div className="mt-3 space-y-2">
          {aiNutritionTips.map((t, i) => {
            const Icon = [Droplets, Zap, Target][i] ?? Sparkles;
            return (
              <div key={t.id} className="flex gap-3 rounded-xl border border-border bg-elevated/40 p-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan/10 text-cyan">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{t.title}</div>
                  <div className="text-xs leading-relaxed text-muted-foreground">{t.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <ScanHistory kind="food" />
    </div>
  );
}

function MacroBar({ label, eaten, goal, color }: { label: string; eaten: number; goal: number; color: string }) {
  const pct = Math.min(100, (eaten / goal) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="font-display font-bold">
          {eaten}<span className="text-muted-foreground">/{goal}g</span>
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ----------------------------- shared ----------------------------- */

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-surface p-4">{children}</div>;
}

function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <div className="font-display text-base font-bold">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
    </div>
  );
}

/* ----------------------------- SCAN ----------------------------- */

type ScanKind = "body" | "food";
type ScanState = "idle" | "scanning" | "done";
type PendingSource = "camera" | "gallery" | null;

function ScanCTA({ kind, title, desc }: { kind: ScanKind; title: string; desc: string }) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<ScanState>("idle");

  // body-only guide flow
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState<0 | 1>(0); // 0 = guia, 1 = calibragem
  const [pending, setPending] = useState<PendingSource>(null);
  const [height, setHeight] = useState("178");
  const [outfit, setOutfit] = useState<"justa" | "normal" | "larga">("normal");

  const triggerInput = (src: PendingSource) => {
    if (src === "camera") cameraRef.current?.click();
    else galleryRef.current?.click();
  };

  const handleClick = (src: "camera" | "gallery") => {
    if (kind === "body") {
      setPending(src);
      setGuideStep(0);
      setGuideOpen(true);
    } else {
      triggerInput(src);
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
    setState("scanning");
    setTimeout(() => setState("done"), 1800);
    e.target.value = "";
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setState("idle");
  };

  const result =
    kind === "body"
      ? [
          { k: "Peito", v: "102 cm" },
          { k: "Cintura", v: "78 cm" },
          { k: "% Gordura", v: "14.2%" },
        ]
      : [
          { k: "Calorias", v: "~520 kcal" },
          { k: "Proteína", v: "32 g" },
          { k: "Carbo", v: "48 g" },
        ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-elevated/40 p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow-primary">
          <ScanLine className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-base font-bold">{title}</div>
          <div className="text-xs leading-relaxed text-muted-foreground">{desc}</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => handleClick("camera")}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant active:scale-[0.98]"
        >
          <Camera className="h-4 w-4" /> Câmera
        </button>
        <button
          onClick={() => handleClick("gallery")}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-foreground active:scale-[0.98]"
        >
          <ImageIcon className="h-4 w-4" /> Galeria
        </button>
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture={kind === "body" ? "user" : "environment"}
        className="hidden"
        onChange={onFile}
      />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      {/* Guia de captura + calibragem (apenas body) */}
      {guideOpen && kind === "body" && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur animate-fade-in">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="font-display text-sm font-bold">
              {guideStep === 0 ? "Guia de captura" : "Calibragem rápida"}
            </div>
            <button
              onClick={() => setGuideOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* progress */}
            <div className="mb-4 flex items-center gap-1.5">
              <div className={cn("h-1 flex-1 rounded-full", guideStep >= 0 ? "bg-primary" : "bg-elevated")} />
              <div className={cn("h-1 flex-1 rounded-full", guideStep >= 1 ? "bg-primary" : "bg-elevated")} />
            </div>

            {guideStep === 0 ? (
              <div className="space-y-3">
                {/* preview enquadramento */}
                <div className="relative mx-auto h-48 w-32 rounded-2xl border-2 border-dashed border-primary/60 bg-elevated/40">
                  <div className="absolute inset-x-0 top-2 text-center text-[9px] font-semibold uppercase tracking-wider text-primary">
                    cabeça
                  </div>
                  <div className="absolute inset-x-0 bottom-2 text-center text-[9px] font-semibold uppercase tracking-wider text-primary">
                    pés
                  </div>
                  <div className="absolute inset-0 m-auto h-24 w-10 rounded-full bg-primary/10" />
                </div>
                <GuideRow icon={Ruler} title="Distância" desc="Posicione o celular a ~2,5m de distância, na altura do quadril." />
                <GuideRow icon={Sun} title="Iluminação" desc="Luz frontal e uniforme. Evite sombras fortes e contraluz." />
                <GuideRow icon={Maximize2} title="Enquadramento" desc="Corpo inteiro, da cabeça aos pés, centralizado no quadro." />
                <GuideRow icon={Smartphone} title="Postura" desc="Em pé, braços levemente afastados, roupa justa ou colada ao corpo." />

                <button
                  onClick={() => setGuideStep(1)}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-elegant active:scale-[0.98]"
                >
                  Continuar <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sua altura</div>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-24 rounded-xl border border-border bg-elevated/40 px-3 py-2 text-center font-display text-2xl font-bold text-foreground focus:border-primary focus:outline-none"
                    />
                    <span className="text-sm text-muted-foreground">cm</span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    Usado como referência de escala para calcular cm com precisão.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vestimenta</div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["justa", "normal", "larga"] as const).map((o) => (
                      <button
                        key={o}
                        onClick={() => setOutfit(o)}
                        className={cn(
                          "rounded-xl border px-2 py-2 text-xs font-semibold capitalize transition",
                          outfit === o
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-elevated/40 text-muted-foreground",
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    A IA compensa a folga da roupa para estimar contornos reais.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-cyan/30 bg-cyan/5 p-3 text-[11px] text-cyan">
                  <Check className="h-4 w-4 shrink-0" />
                  Pronto. A precisão estimada é de ±1.5 cm com a calibragem aplicada.
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setGuideStep(0)}
                    className="rounded-xl border border-border bg-surface py-3 text-sm font-semibold text-foreground active:scale-[0.98]"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => {
                      setGuideOpen(false);
                      triggerInput(pending);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-elegant active:scale-[0.98]"
                  >
                    {pending === "camera" ? <Camera className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                    Iniciar scan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="font-display text-sm font-bold">{title}</div>
            <button onClick={reset} className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <img src={preview} alt="scan" className="h-full w-full object-contain" />
            {state === "scanning" && (
              <>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 animate-[scan_1.8s_linear_infinite] bg-gradient-to-b from-primary via-primary/60 to-transparent shadow-glow-primary" style={{ height: "40%" }} />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-background/80 py-3 text-sm font-semibold text-primary backdrop-blur">
                  <Loader2 className="h-4 w-4 animate-spin" /> IA analisando imagem…
                </div>
              </>
            )}
            {state === "done" && (
              <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-border bg-surface/95 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Check className="h-4 w-4" /> Análise concluída
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {result.map((r) => (
                    <div key={r.k} className="rounded-xl border border-border bg-elevated/40 p-2 text-center">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.k}</div>
                      <div className="font-display text-sm font-bold">{r.v}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={reset}
                  className="mt-3 w-full rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant"
                >
                  Salvar e fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GuideRow({ icon: Icon, title, desc }: { icon: typeof Ruler; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs leading-relaxed text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}
