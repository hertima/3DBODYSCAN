import { createFileRoute } from "@tanstack/react-router";
import { type ChangeEvent, type ReactNode, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  Droplets,
  Flame,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Plus,
  Ruler,
  ScanLine,
  Smartphone,
  Sparkles,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { AIInsightCard } from "@/components/AIInsightCard";
import { bodyComposition, bodyMeasures } from "@/data/body";
import { nutritionToday } from "@/data/nutrition";
import { bodyScans, foodScans, formatScanDate, type BodyScan, type FoodScan } from "@/data/scans";
import { buildAthleteProfile } from "@/domain/athlete/profile";
import { evaluateNutritionState } from "@/domain/nutrition/analysis";
import { getStoredLocale } from "@/lib/locale";
import { loadOnboarding } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/corpo")({
  head: () => ({
    meta: [
      { title: "3D Body Scan | Scan Corporal IA" },
      { name: "description", content: "Scan corporal 3D com IA — medidas, composição e evolução do corpo em tempo real." },
    ],
  }),
  component: CorpoPage,
});

type Tab = "medidas" | "nutricao";
type ScanKind = "body" | "food";
type ScanState = "idle" | "scanning" | "done";
type PendingSource = "camera" | "gallery" | null;

const COPY = {
  pt: { title: "3D Body Scan", subtitle: "Scan corporal com IA — medidas precisas, composição corporal e evolução visual em tempo real.", measures: "Medidas", nutrition: "Nutrição", bodyScan: "Scan corporal", bodyDesc: "Tire uma foto de corpo inteiro ou envie da galeria para a IA estimar medidas e percentual de gordura.", foodScan: "Scan da alimentação", foodDesc: "Aponte para o prato ou envie da galeria para a IA estimar calorias, proteína e carboidratos.", lastReading: "Última leitura", latestPhoto: "sua foto mais recente", noSavedScan: "nenhum scan salvo ainda", firstScan: "Faça seu primeiro scan para ver sua foto aqui.", todaySummary: "Resumo de hoje", goalsMacros: "metas calóricas e macros", meals: "Refeições", aiSuggestions: "Sugestões da IA", personalized: "ajustes personalizados", historyBody: "Histórico de scans corporais", historyFood: "Histórico de scans de alimentação", evolution: "evolução", camera: "Câmera", gallery: "Galeria", useGallery: "Usar galeria", captureGuide: "Guia de captura", quickCalibration: "Calibragem rápida", distance: "Distância", lighting: "Iluminação", framing: "Enquadramento", posture: "Postura", continue: "Continuar", height: "Altura", weight: "Peso", clothing: "Vestimenta", ready: "Pronto. A precisão estimada é de aproximadamente 1,5 cm com a calibragem aplicada.", back: "Voltar", startScan: "Iniciar scan", scanning: "IA analisando imagem...", analysisDone: "Análise concluída", saveClose: "Salvar e fechar" },
  es: { title: "3D Body Scan", subtitle: "Escaneo corporal con IA — medidas precisas, composicion corporal y evolucion visual en tiempo real.", measures: "Medidas", nutrition: "Nutricion", bodyScan: "Escaneo corporal", bodyDesc: "Toma una foto de cuerpo completo o subela desde la galeria para que la IA estime medidas y porcentaje de grasa.", foodScan: "Escaneo de alimentacion", foodDesc: "Apunta al plato o subelo desde la galeria para que la IA estime calorias, proteina y carbohidratos.", lastReading: "Ultima lectura", latestPhoto: "tu foto mas reciente", noSavedScan: "todavia no hay escaneos guardados", firstScan: "Haz tu primer escaneo para ver tu foto aqui.", todaySummary: "Resumen de hoy", goalsMacros: "metas caloricas y macros", meals: "Comidas", aiSuggestions: "Sugerencias de IA", personalized: "ajustes personalizados", historyBody: "Historial de escaneos corporales", historyFood: "Historial de escaneos de alimentacion", evolution: "evolucion", camera: "Camara", gallery: "Galeria", useGallery: "Usar galeria", captureGuide: "Guia de captura", quickCalibration: "Calibracion rapida", distance: "Distancia", lighting: "Iluminacion", framing: "Encuadre", posture: "Postura", continue: "Continuar", height: "Altura", weight: "Peso", clothing: "Vestimenta", ready: "Listo. La precision estimada es de aproximadamente 1,5 cm con la calibracion aplicada.", back: "Volver", startScan: "Iniciar escaneo", scanning: "IA analizando imagen...", analysisDone: "Analisis completado", saveClose: "Guardar y cerrar" },
  en: { title: "3D Body Scan", subtitle: "AI body scan — precise measurements, body composition, and visual progress in real time.", measures: "Measures", nutrition: "Nutrition", bodyScan: "Body scan", bodyDesc: "Take a full-body photo or upload one from your gallery so AI can estimate measurements and body fat percentage.", foodScan: "Food scan", foodDesc: "Point at the plate or upload from your gallery so AI can estimate calories, protein, and carbs.", lastReading: "Latest reading", latestPhoto: "your most recent photo", noSavedScan: "no saved scan yet", firstScan: "Take your first scan to see your photo here.", todaySummary: "Today's summary", goalsMacros: "calorie goals and macros", meals: "Meals", aiSuggestions: "AI suggestions", personalized: "personalized adjustments", historyBody: "Body scan history", historyFood: "Food scan history", evolution: "progress", camera: "Camera", gallery: "Gallery", useGallery: "Use gallery", captureGuide: "Capture guide", quickCalibration: "Quick calibration", distance: "Distance", lighting: "Lighting", framing: "Framing", posture: "Posture", continue: "Continue", height: "Height", weight: "Weight", clothing: "Clothing", ready: "Done. Estimated precision is approximately 1.5 cm with calibration applied.", back: "Back", startScan: "Start scan", scanning: "AI analyzing image...", analysisDone: "Analysis completed", saveClose: "Save and close" },
  fr: { title: "3D Body Scan", subtitle: "Scan corporel par IA — mesures precises, composition corporelle et evolution visuelle en temps reel.", measures: "Mesures", nutrition: "Nutrition", bodyScan: "Scan corporel", bodyDesc: "Prenez une photo du corps entier ou importez-la depuis la galerie pour que l'IA estime les mesures et le pourcentage de graisse.", foodScan: "Scan alimentaire", foodDesc: "Pointez vers l'assiette ou importez depuis la galerie pour que l'IA estime calories, proteines et glucides.", lastReading: "Derniere lecture", latestPhoto: "votre photo la plus recente", noSavedScan: "aucun scan enregistre pour l'instant", firstScan: "Faites votre premier scan pour voir votre photo ici.", todaySummary: "Resume du jour", goalsMacros: "objectifs caloriques et macros", meals: "Repas", aiSuggestions: "Suggestions de l'IA", personalized: "ajustements personnalises", historyBody: "Historique des scans corporels", historyFood: "Historique des scans alimentaires", evolution: "evolution", camera: "Camera", gallery: "Galerie", useGallery: "Utiliser la galerie", captureGuide: "Guide de capture", quickCalibration: "Calibration rapide", distance: "Distance", lighting: "Eclairage", framing: "Cadrage", posture: "Posture", continue: "Continuer", height: "Taille", weight: "Poids", clothing: "Tenue", ready: "Pret. La precision estimee est d'environ 1,5 cm avec la calibration appliquee.", back: "Retour", startScan: "Demarrer le scan", scanning: "IA en train d'analyser l'image...", analysisDone: "Analyse terminee", saveClose: "Enregistrer et fermer" },
  de: { title: "3D Body Scan", subtitle: "KI-Korperscan — prazise Messungen, Korperzusammensetzung und visuelle Entwicklung in Echtzeit.", measures: "Messungen", nutrition: "Ernahrung", bodyScan: "Korperscan", bodyDesc: "Mache ein Ganzkorperfoto oder lade eines aus der Galerie hoch, damit die KI Masse und Korperfettanteil schatzen kann.", foodScan: "Essensscan", foodDesc: "Richte die Kamera auf den Teller oder lade ein Bild aus der Galerie hoch, damit die KI Kalorien, Protein und Kohlenhydrate schatzen kann.", lastReading: "Letzte Messung", latestPhoto: "dein aktuellstes Foto", noSavedScan: "noch kein Scan gespeichert", firstScan: "Mache deinen ersten Scan, um dein Foto hier zu sehen.", todaySummary: "Heutige Zusammenfassung", goalsMacros: "Kalorienziele und Makros", meals: "Mahlzeiten", aiSuggestions: "KI-Vorschlage", personalized: "personalisierte Anpassungen", historyBody: "Verlauf der Korperscans", historyFood: "Verlauf der Essensscans", evolution: "Entwicklung", camera: "Kamera", gallery: "Galerie", useGallery: "Galerie verwenden", captureGuide: "Aufnahmeleitfaden", quickCalibration: "Schnellkalibrierung", distance: "Abstand", lighting: "Beleuchtung", framing: "Ausrichtung", posture: "Haltung", continue: "Weiter", height: "Grosse", weight: "Gewicht", clothing: "Bekleidung", ready: "Fertig. Die geschatzte Genauigkeit liegt mit Kalibrierung bei etwa 1,5 cm.", back: "Zuruck", startScan: "Scan starten", scanning: "KI analysiert Bild...", analysisDone: "Analyse abgeschlossen", saveClose: "Speichern und schliessen" },
} as const;

function CorpoPage() {
  const copy = COPY[getStoredLocale()] ?? COPY.pt;
  const [tab, setTab] = useState<Tab>("medidas");

  return (
    <div className="space-y-5">
      {/* Hero 3D Body Scan */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan/20 bg-[#070B14] p-5 shadow-elevated">
        {/* Glow ciano esquerda */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-cyan/20 blur-3xl" />
        {/* Glow laranja direita */}
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 rounded-full blur-3xl" style={{ background: "rgba(251,146,60,0.18)" }} />

        <div className="relative flex items-center gap-4">
          <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-cyan/30 bg-[#0d1525] shadow-lg">
            {/* Linha de scan animada */}
            <div className="absolute inset-x-0 top-0 h-px animate-[scan_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-cyan to-transparent opacity-80" />
            <ScanLine className="h-7 w-7 text-cyan drop-shadow-[0_0_8px_var(--cyan)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="font-display text-2xl font-black tracking-tight"
                style={{ background: "linear-gradient(90deg, #22d3ee 0%, #ffffff 45%, #fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                3D Body Scan
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" /> IA
              </span>
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{copy.subtitle}</p>
          </div>
        </div>

        {/* Stats rápidos */}
        <div className="relative mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-cyan/15 bg-white/5 px-3 py-2 text-center">
            <div className="font-display text-lg font-bold text-cyan">6</div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400">Scans</div>
          </div>
          <div className="rounded-xl border border-orange-500/20 bg-white/5 px-3 py-2 text-center">
            <div className="font-display text-lg font-bold" style={{ color: "#fb923c" }}>14.2%</div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400">Gordura</div>
          </div>
          <div className="rounded-xl border border-cyan/15 bg-white/5 px-3 py-2 text-center">
            <div className="font-display text-lg font-bold text-white">92%</div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400">Confiança</div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
        <TabBtn active={tab === "medidas"} onClick={() => setTab("medidas")}>{copy.measures}</TabBtn>
        <TabBtn active={tab === "nutricao"} onClick={() => setTab("nutricao")}>{copy.nutrition}</TabBtn>
      </div>

      {tab === "medidas" ? <MedidasTab copy={copy} /> : <NutricaoTab copy={copy} />}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
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

function MedidasTab({ copy }: { copy: (typeof COPY)[keyof typeof COPY] }) {
  const [lastPhoto, setLastPhoto] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("zyrox.lastBodyPhoto");
  });
  const latestBodyScan = bodyScans[0];
  const bodySummary =
    latestBodyScan?.analiseIA?.mudancaDesdeUltimoScan ??
    "Seu histórico corporal ainda está formando a primeira linha de tendência.";

  return (
    <div className="space-y-4">
      <ScanCTA
        kind="body"
        title={copy.bodyScan}
        desc={copy.bodyDesc}
        copy={copy}
        onScanComplete={(url) => {
          localStorage.setItem("zyrox.lastBodyPhoto", url);
          setLastPhoto(url);
        }}
      />

      <Card>
        <CardHeader title={copy.lastReading} subtitle={lastPhoto ? copy.latestPhoto : copy.noSavedScan} />
        <div className="mt-3 flex gap-3">
          <div className="relative h-72 w-1/2 shrink-0 overflow-hidden rounded-xl border border-border bg-elevated/40">
            {lastPhoto ? (
              <img src={lastPhoto} alt="Último scan corporal" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center">
                <Camera className="h-6 w-6 text-muted-foreground" />
                <p className="text-[10px] leading-tight text-muted-foreground">
                  {copy.firstScan}
                </p>
              </div>
            )}
          </div>
          <div className="flex w-1/2 flex-col justify-between gap-1.5 py-1">
            {bodyMeasures.map((m) => (
              <div
                key={m.key}
                className="flex items-baseline justify-between gap-2 border-b border-border/60 pb-1 last:border-0"
              >
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.label}</span>
                <div className="text-right">
                  <span className={cn("font-display text-base font-bold", m.delta >= 0 ? "text-primary" : "text-cyan")}>
                    {m.value}
                  </span>
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
        <strong>{latestBodyScan?.analiseIA?.tendenciaCorporal ?? "Leitura corporal em consolidação."}</strong>{" "}
        {bodySummary}
      </AIInsightCard>

      <div className="grid grid-cols-2 gap-3">
        {bodyMeasures.map((m) => <MeasureCard key={m.key} m={m} />)}
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
        <div
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
            up ? "bg-primary/10 text-primary" : "bg-cyan/10 text-cyan",
          )}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {up ? "+" : ""}
          {m.delta}
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

function NutricaoTab({ copy }: { copy: (typeof COPY)[keyof typeof COPY] }) {
  const { kcal, macros, meals } = nutritionToday;
  const profile = buildAthleteProfile(loadOnboarding());
  const nutritionEvaluation = evaluateNutritionState(profile, nutritionToday, foodScans);
  const remaining = Math.max(0, kcal.goal - kcal.eaten);
  const pct = Math.min(100, (kcal.eaten / kcal.goal) * 100);

  return (
    <div className="space-y-4">
      <ScanCTA
        kind="food"
        title={copy.foodScan}
        desc={copy.foodDesc}
        copy={copy}
      />

      <Card>
        <CardHeader title={copy.todaySummary} subtitle={copy.goalsMacros} />
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
        <CardHeader title={copy.meals} subtitle={`${kcal.eaten.toLocaleString()} / ${kcal.goal.toLocaleString()} kcal`} />
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
        <strong>{nutritionEvaluation.balanceLabel}.</strong> {nutritionEvaluation.primaryMessage}
      </AIInsightCard>

      <Card>
        <CardHeader title={copy.aiSuggestions} subtitle={copy.personalized} />
        <div className="mt-3 space-y-2">
          {nutritionEvaluation.insights.map((tip, index) => {
            const Icon = [Droplets, Zap, Target][index] ?? Sparkles;
            return (
              <div key={tip.id} className="flex gap-3 rounded-xl border border-border bg-elevated/40 p-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan/10 text-cyan">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{tip.title}</div>
                  <div className="text-xs leading-relaxed text-muted-foreground">{tip.desc}</div>
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
          {eaten}
          <span className="text-muted-foreground">/{goal}g</span>
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-border bg-surface p-4">{children}</div>;
}

function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <div className="font-display text-base font-bold">{title}</div>
      {subtitle ? <div className="text-xs text-muted-foreground">{subtitle}</div> : null}
    </div>
  );
}

function ScanCTA({
  kind,
  title,
  desc,
  copy,
  onScanComplete,
}: {
  kind: ScanKind;
  title: string;
  desc: string;
  copy: (typeof COPY)[keyof typeof COPY];
  onScanComplete?: (dataUrl: string) => void;
}) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<ScanState>("idle");
  const [liveOpen, setLiveOpen] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState<0 | 1>(0);
  const [pending, setPending] = useState<PendingSource>(null);
  const [height, setHeight] = useState<string>(() => {
    if (typeof window === "undefined") return "178";
    return window.localStorage.getItem("zyrox.profile.height") ?? "178";
  });
  const [weight, setWeight] = useState<string>(() => {
    if (typeof window === "undefined") return "78";
    return window.localStorage.getItem("zyrox.profile.weight") ?? "78";
  });
  const [outfit, setOutfit] = useState<"justa" | "normal" | "larga">("normal");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (height) window.localStorage.setItem("zyrox.profile.height", height);
  }, [height]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (weight) window.localStorage.setItem("zyrox.profile.weight", weight);
  }, [weight]);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const openLiveCamera = async () => {
    setLiveError(null);
    setLiveOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: kind === "food" ? "environment" : "user" },
        audio: false,
      });
      streamRef.current = stream;
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch (error: any) {
      const name = error?.name ?? "";
      if (name === "NotAllowedError") setLiveError("Permissão negada. Habilite a câmera nas configurações do navegador.");
      else if (name === "NotFoundError") setLiveError("Nenhuma câmera encontrada neste dispositivo.");
      else if (name === "NotReadableError") setLiveError("Câmera em uso por outro aplicativo.");
      else setLiveError("Não foi possível abrir a câmera. Use Galeria como alternativa.");
    }
  };

  const triggerInput = (src: PendingSource) => {
    if (src === "camera") openLiveCamera();
    else galleryRef.current?.click();
  };

  const handleClick = (src: "camera" | "gallery") => {
    if (kind === "body") {
      setPending(src);
      setGuideStep(0);
      setGuideOpen(true);
      return;
    }
    triggerInput(src);
  };

  const finishWithDataUrl = (dataUrl: string) => {
    setPreview(dataUrl);
    setState("scanning");
    setTimeout(() => {
      setState("done");
      onScanComplete?.(dataUrl);
    }, 1800);
  };

  const captureFromVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 1280;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    closeLive();
    finishWithDataUrl(dataUrl);
  };

  const closeLive = () => {
    stopStream();
    setLiveOpen(false);
  };

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => finishWithDataUrl(reader.result as string);
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const reset = () => {
    setPreview(null);
    setState("idle");
  };

  const result =
    kind === "body"
      ? [
          { k: "Peito", v: "102 cm" },
          { k: "Cintura", v: "78 cm" },
          { k: "% Gordura", v: "14.2%" },
          { k: "Confiança", v: "92%" },
        ]
      : [
          { k: "Calorias", v: "~520 kcal" },
          { k: "Proteina", v: "32 g" },
          { k: "Carbo", v: "48 g" },
        ];

  const isBody = kind === "body";
  const accentColor = isBody ? "#fb923c" : "var(--cyan)";
  const accentBorder = isBody ? "border-orange-500/30" : "border-cyan/30";
  const accentBg = isBody ? "bg-orange-500/10" : "bg-cyan/10";
  const accentText = isBody ? "text-orange-400" : "text-cyan";

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border p-4", isBody ? "border-orange-500/20 bg-gradient-to-br from-[#120a00] to-[#0d0d0d]" : "border-cyan/20 bg-gradient-to-br from-[#001a1a] to-[#0d0d0d]")}>
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl" style={{ background: isBody ? "rgba(251,146,60,0.12)" : "rgba(34,211,238,0.10)" }} />
      <div className="relative flex items-start gap-3">
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl border", accentBorder, accentBg)}>
          <ScanLine className="h-5 w-5" style={{ color: accentColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className={cn("font-display text-base font-bold", accentText)}>{title}</div>
          <div className="text-xs leading-relaxed text-muted-foreground">{desc}</div>
        </div>
      </div>

      <div className="relative mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => handleClick("camera")}
          className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-elegant active:scale-[0.98]"
          style={{ background: isBody ? "linear-gradient(135deg,#ea580c,#fb923c)" : "linear-gradient(135deg,#0891b2,#22d3ee)" }}
        >
          <Camera className="h-4 w-4" /> {copy.camera}
        </button>
        <button
          onClick={() => handleClick("gallery")}
          className={cn("flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold active:scale-[0.98]", accentBorder, accentBg, accentText)}
        >
          <ImageIcon className="h-4 w-4" /> {copy.gallery}
        </button>
      </div>

      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      {liveOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          <div className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
            <div className="font-display text-sm font-bold">{title}</div>
            <button onClick={closeLive} className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative flex-1 overflow-hidden">
            {liveError ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                <Camera className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{liveError}</p>
                <button
                  onClick={() => {
                    closeLive();
                    galleryRef.current?.click();
                  }}
                  className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant"
                >
                  {copy.useGallery}
                </button>
              </div>
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                {kind === "body" ? (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-[80%] w-[55%] rounded-[40%] border-2 border-dashed border-primary/70" />
                  </div>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent px-4 py-6">
                  <button
                    onClick={captureFromVideo}
                    className="grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-gradient-primary shadow-glow-primary active:scale-95"
                  >
                    <Camera className="h-6 w-6 text-primary-foreground" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {guideOpen && kind === "body" ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur animate-fade-in">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="font-display text-sm font-bold">{guideStep === 0 ? copy.captureGuide : copy.quickCalibration}</div>
            <button onClick={() => setGuideOpen(false)} className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mb-4 flex items-center gap-1.5">
              <div className={cn("h-1 flex-1 rounded-full", guideStep >= 0 ? "bg-primary" : "bg-elevated")} />
              <div className={cn("h-1 flex-1 rounded-full", guideStep >= 1 ? "bg-primary" : "bg-elevated")} />
            </div>

            {guideStep === 0 ? (
              <div className="space-y-3">
                <div className="relative mx-auto h-48 w-32 rounded-2xl border-2 border-dashed border-primary/60 bg-elevated/40">
                  <div className="absolute inset-x-0 top-2 text-center text-[9px] font-semibold uppercase tracking-wider text-primary">cabeça</div>
                  <div className="absolute inset-x-0 bottom-2 text-center text-[9px] font-semibold uppercase tracking-wider text-primary">pés</div>
                  <div className="absolute inset-0 m-auto h-24 w-10 rounded-full bg-primary/10" />
                </div>
                <GuideRow icon={Ruler} title="Distância" desc="Posicione o celular a cerca de 2,5m de distância, na altura do quadril." />
                <GuideRow icon={Sun} title="Iluminação" desc="Use luz frontal e uniforme. Evite sombras fortes e contraluz." />
                <GuideRow icon={Maximize2} title="Enquadramento" desc="Corpo inteiro, da cabeça aos pés, centralizado no quadro." />
                <GuideRow icon={Smartphone} title="Postura" desc="Fique em pé, com os braços levemente afastados e roupa justa ou colada ao corpo." />

                <button
                  onClick={() => setGuideStep(1)}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-elegant active:scale-[0.98]"
                >
                  {copy.continue} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Altura</div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={height}
                        onChange={(event) => setHeight(event.target.value)}
                        className="w-16 rounded-xl border border-border bg-elevated/40 px-2 py-2 text-center font-display text-2xl font-bold text-foreground focus:border-primary focus:outline-none"
                      />
                      <span className="text-xs text-muted-foreground">cm</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Peso</div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={weight}
                        onChange={(event) => setWeight(event.target.value)}
                        className="w-16 rounded-xl border border-border bg-elevated/40 px-2 py-2 text-center font-display text-2xl font-bold text-foreground focus:border-primary focus:outline-none"
                      />
                      <span className="text-xs text-muted-foreground">kg</span>
                    </div>
                  </div>
                </div>
                <p className="-mt-2 px-1 text-[11px] leading-relaxed text-muted-foreground">
                  Altura e peso são usados como referência de escala para calcular medidas em cm e estimar percentual de gordura com mais precisão.
                </p>

                <div className="rounded-2xl border border-border bg-surface p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vestimenta</div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["justa", "normal", "larga"] as const).map((option) => (
                      <button
                        key={option}
                        onClick={() => setOutfit(option)}
                        className={cn(
                          "rounded-xl border px-2 py-2 text-xs font-semibold capitalize transition",
                          outfit === option ? "border-primary bg-primary/10 text-primary" : "border-border bg-elevated/40 text-muted-foreground",
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    A IA compensa a folga da roupa para estimar contornos reais.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-cyan/30 bg-cyan/5 p-3 text-[11px] text-cyan">
                  <Check className="h-4 w-4 shrink-0" />
                  Pronto. A precisão estimada é de aproximadamente 1,5 cm com a calibragem aplicada.
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setGuideStep(0)}
                    className="rounded-xl border border-border bg-surface py-3 text-sm font-semibold text-foreground active:scale-[0.98]"
                  >
                    {copy.back}
                  </button>
                  <button
                    onClick={() => {
                      setGuideOpen(false);
                      triggerInput(pending);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-elegant active:scale-[0.98]"
                  >
                    {pending === "camera" ? <Camera className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                    {copy.startScan}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {preview ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="font-display text-sm font-bold">{title}</div>
            <button onClick={reset} className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <img src={preview} alt="scan" className="h-full w-full object-contain" />
            {state === "scanning" ? (
              <>
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 animate-[scan_1.8s_linear_infinite] bg-gradient-to-b from-primary via-primary/60 to-transparent shadow-glow-primary"
                  style={{ height: "40%" }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-background/80 py-3 text-sm font-semibold text-primary backdrop-blur">
                  <Loader2 className="h-4 w-4 animate-spin" /> {copy.scanning}
                </div>
              </>
            ) : null}
            {state === "done" ? (
              <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-border bg-surface/95 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Check className="h-4 w-4" /> {copy.analysisDone}
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
                  {copy.saveClose}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
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

function ScanHistory({ kind }: { kind: ScanKind }) {
  const items = kind === "body" ? bodyScans : foodScans;
  const title = kind === "body" ? "Histórico de scans corporais" : "Histórico de scans de alimentação";

  const series =
    kind === "body"
      ? [...bodyScans].reverse().map((scan) => ({
          date: formatScanDate(scan.data),
          value: scan.estimativas.cinturaCmEstimada,
          value2: scan.estimativas.peitoCmEstimado,
        }))
      : [...foodScans].reverse().map((scan) => ({
          date: formatScanDate(scan.data),
          value: scan.estimativas.kcal,
          value2: scan.estimativas.proteinaG * 10,
        }));

  const min = Math.min(...series.map((item) => item.value));
  const max = Math.max(...series.map((item) => item.value));
  const range = Math.max(0.1, max - min);
  const min2 = Math.min(...series.map((item) => item.value2));
  const max2 = Math.max(...series.map((item) => item.value2));
  const range2 = Math.max(0.1, max2 - min2);

  const path = (values: number[], low: number, currentRange: number) =>
    values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 100;
        const y = 100 - ((value - low) / currentRange) * 90 - 5;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

  const labels = kind === "body" ? { a: "Cintura (cm)", b: "Peito (cm)" } : { a: "Calorias (kcal)", b: "Proteína (g x 10)" };

  return (
    <Card>
      <CardHeader title={title} subtitle={`${items.length} registros | evolução`} />

      <div className="mt-3 rounded-xl border border-border bg-elevated/40 p-3">
        <div className="mb-2 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-primary">
            <span className="h-1.5 w-3 rounded-full bg-primary" /> {labels.a}
          </span>
          <span className="flex items-center gap-1 text-cyan">
            <span className="h-1.5 w-3 rounded-full bg-cyan" /> {labels.b}
          </span>
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-24 w-full">
          <path d={path(series.map((item) => item.value), min, range)} fill="none" stroke="var(--primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path d={path(series.map((item) => item.value2), min2, range2)} fill="none" stroke="var(--cyan)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
          {series.map((item) => <span key={item.date}>{item.date}</span>)}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {items.map((scan) => {
          const isBody = "calibragem" in scan;
          return (
            <div key={scan.id} className="flex items-center gap-3 rounded-xl border border-border bg-elevated/40 p-2">
              <div
                className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-border"
                style={{ background: scan.miniatura }}
              >
                {isBody ? <ScanLine className="h-5 w-5 text-primary/70" /> : <ImageIcon className="h-5 w-5 text-primary/70" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-sm font-semibold">{isBody ? "Scan corporal" : (scan as FoodScan).refeicao}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{formatScanDate(scan.data)}</div>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {isBody ? (
                    <>
                      <Chip label="Peito" value={`${(scan as BodyScan).estimativas.peitoCmEstimado} cm`} />
                      <Chip label="Cintura" value={`${(scan as BodyScan).estimativas.cinturaCmEstimada} cm`} />
                      <Chip label="% G" value={`${(scan as BodyScan).estimativas.percentualGorduraEstimado}%`} />
                      <Chip label="Conf." value={`${(scan as BodyScan).qualidade.confiancaLeitura}%`} />
                    </>
                  ) : (
                    <>
                      <Chip label="kcal" value={`${(scan as FoodScan).estimativas.kcal}`} />
                      <Chip label="P" value={`${(scan as FoodScan).estimativas.proteinaG}g`} />
                      <Chip label="C" value={`${(scan as FoodScan).estimativas.carboG}g`} />
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold">
      <span className="text-muted-foreground">{label}</span> <span className="text-foreground">{value}</span>
    </span>
  );
}
