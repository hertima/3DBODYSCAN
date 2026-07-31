import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Check,
  ArrowRight,
  Brain,
  Camera,
  MessageCircle,
  Dumbbell,
  Utensils,
  ScanLine,
  TrendingUp,
  History,
  GitCompare,
  Trophy,
  Shield,
  Star,
  Sparkles,
  ChevronDown,
  Clock,
  X,
  Lock,
} from "lucide-react";
import { Player } from "@remotion/player";
import logo from "@/assets/zyrox-logo.png";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { MascotIdleVideo } from "@/remotion";

const LANDING_TITLE =
  "3D Body Scanner — App de Treino Personalizado com IA e Scanner Corporal 3D";
const LANDING_DESCRIPTION =
  "App de treino personalizado com Inteligência Artificial: faça um scanner corporal 3D, receba dieta com IA e um plano de evolução fitness que se adapta automaticamente a você.";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: LANDING_TITLE },
      { name: "description", content: LANDING_DESCRIPTION },
      {
        name: "keywords",
        content:
          "app de treino personalizado, dieta com IA, scanner corporal 3D, evolução fitness, coach de IA, plano alimentar inteligente",
      },
      { property: "og:title", content: LANDING_TITLE },
      { property: "og:description", content: LANDING_DESCRIPTION },
      { name: "twitter:title", content: LANDING_TITLE },
      { name: "twitter:description", content: LANDING_DESCRIPTION },
    ],
  }),
  component: LandingPage,
});

// ── Helpers de animação/layout ──

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  className,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  immediate?: boolean;
}) {
  // `immediate` anima direto no mount — usado acima da dobra (Hero), onde
  // whileInView pode nunca disparar (o elemento já está visível sem scroll).
  if (immediate) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionShell({
  children,
  className,
  innerClassName = "max-w-2xl",
  surface = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  surface?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`px-5 py-8 lg:px-10 lg:py-12 ${className ?? ""}`}
      style={
        surface
          ? {
              background:
                "linear-gradient(to bottom, var(--background) 0, var(--surface) 64px, var(--surface) calc(100% - 64px), var(--background) 100%)",
            }
          : undefined
      }
    >
      <div className="mx-auto max-w-6xl">
        <div className={innerClassName}>{children}</div>
      </div>
    </section>
  );
}

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-base text-foreground/90">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
      <span>{children}</span>
    </li>
  );
}

function FeatureChip({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-elevated px-3.5 py-3 text-sm font-semibold leading-snug text-foreground">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `${color}1a`, color }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">{label}</span>
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  const text = typeof children === "string" ? children.trim() : null;

  if (!text) {
    return (
      <h2 className="font-display text-xl font-black leading-tight text-foreground lg:text-3xl">{children}</h2>
    );
  }

  const words = text.split(/\s+/);

  return (
    <h2 className="font-display text-2xl font-black leading-tight text-foreground lg:text-3xl">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, delay: i * 0.035 }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </h2>
  );
}

function SectionKicker({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-cyan">{children}</p>
  );
}

function CountUpNumber({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 0.9,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const steps = 40;
    const stepValue = value / steps;
    const intervalMs = (duration * 1000) / steps;
    let current = 0;
    const id = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplay(value);
        clearInterval(id);
      } else {
        setDisplay(current);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [inView, value, duration]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals).replace(".", ",")
      : Math.floor(display).toLocaleString("pt-BR");

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ── Mockup de telefone reutilizável (exibe screenshots reais do app) ──

function PhoneFrame({
  children,
  className = "",
  maxWidth = 260,
  aspect = "390/844",
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: number;
  aspect?: string;
}) {
  return (
    <div className={`relative mx-auto w-full ${className}`} style={{ maxWidth }}>
      <div className="pointer-events-none absolute inset-0 scale-110 rounded-[3rem] bg-gradient-primary opacity-20 blur-2xl" />
      <div className="relative rounded-[2.2rem] border-[6px] p-1.5 shadow-2xl" style={{ borderColor: "#18181b", background: "#09090b" }}>
        <div className="absolute left-1/2 top-3 h-1.5 w-14 -translate-x-1/2 rounded-full" style={{ background: "#27272a" }} />
        <div className="overflow-hidden rounded-[1.6rem]" style={{ background: "#09090b", aspectRatio: aspect }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function ScreenImg({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="h-full w-full object-cover object-top" />;
}

// ── Dados de conteúdo ──

const HOW_IT_WORKS = [
  {
    icon: Camera,
    title: "Escaneie seu corpo",
    desc: "Aponte a câmera. Em segundos a IA mapeia sua composição corporal completa.",
  },
  {
    icon: Brain,
    title: "A IA analisa",
    desc: "Ela cruza seus dados com objetivo, rotina e histórico — e entende exatamente onde você está.",
  },
  {
    icon: Dumbbell,
    title: "Receba treino e dieta",
    desc: "Seu plano 100% personalizado aparece pronto no app. Comece hoje, sem esperar.",
  },
];

const ECOSYSTEM_FLOW: { icon: React.ComponentType<{ className?: string }>; label: string; color: string }[] = [
  { icon: Camera, label: "Scan 3D", color: "#22d3ee" },
  { icon: Brain, label: "Inteligência Artificial", color: "#fb923c" },
  { icon: Dumbbell, label: "Treino Personalizado", color: "#4ade80" },
  { icon: Utensils, label: "Plano Alimentar", color: "#a78bfa" },
  { icon: MessageCircle, label: "AI Coach", color: "#f472b6" },
  { icon: TrendingUp, label: "Analytics", color: "#22d3ee" },
  { icon: ScanLine, label: "Novo Scan", color: "#fb923c" },
  { icon: Sparkles, label: "Novo Plano", color: "#4ade80" },
];

const WEEKS = [
  { n: 1, label: "Adaptação" },
  { n: 2, label: "Evolução" },
  { n: 3, label: "Progressão" },
  { n: 4, label: "Consistência" },
  { n: 5, label: "Intensidade" },
  { n: 6, label: "Reavaliação" },
  { n: 7, label: "Ajuste fino" },
  { n: 8, label: "Consolidação" },
  { n: 9, label: "Avanço" },
  { n: 10, label: "Refinamento" },
  { n: 11, label: "Pico de forma" },
  { n: 12, label: "Resultado" },
];

const EXERCISE_GIFS = [
  { file: "/gif-catalog/PEITORAL (1)/CRUCIFIXO POLIA BAIXA (1).gif", label: "Crucifixo na polia", muscle: "Peito", color: "#fb923c" },
  { file: "/gif-catalog/COSTAS E TRAPÉZIO (1)/Barra fixa pegada aberta (1).gif", label: "Barra fixa", muscle: "Costas", color: "#22d3ee" },
  { file: "/gif-catalog/MEMBROS INFERIORES E GLÚTEOS (1)/Afundo com barra (1).gif", label: "Afundo com barra", muscle: "Pernas", color: "#4ade80" },
  { file: "/gif-catalog/DELTÓIDES (1)/Arnolda press (1).gif", label: "Arnold press", muscle: "Ombro", color: "#a78bfa" },
  { file: "/gif-catalog/BÍCEPS e ANTEBRAÇO (1)/Rosca alternada (1).gif", label: "Rosca alternada", muscle: "Bíceps", color: "#f472b6" },
  { file: "/gif-catalog/ABDOMEN CORE (1)/ABS borboleta (1).gif", label: "Abdominal borboleta", muscle: "Abdômen", color: "#fbbf24" },
];

const COMPARISON_ROWS = [
  { other: "Mesmo treino por meses", ours: "IA atualiza automaticamente" },
  { other: "Dieta genérica", ours: "Alimentação personalizada" },
  { other: "Sem acompanhamento", ours: "AI Coach 24h" },
  { other: "Sem evolução inteligente", ours: "Scan 3D contínuo" },
  { other: "Você decide tudo", ours: "A IA ajusta para você" },
];

const ANNUAL_FEATURES = [
  "Scan Corporal 3D ilimitado",
  "Coach IA ilimitado",
  "Treinos personalizados",
  "Plano Alimentar Inteligente de 12 semanas",
  "Food Scan",
  "Analytics completos",
  "Comparação corporal",
  "Todas as futuras atualizações",
];

const RESULT_PROJECTIONS = [
  { metric: "Massa muscular", value: "+3–5 kg", period: "em 12 semanas" },
  { metric: "Volume de treino", value: "+40%", period: "progresso garantido" },
  { metric: "Força estimada", value: "+25%", period: "nos principais lifts" },
];

const TESTIMONIALS = [
  {
    initials: "CM",
    name: "Cliente 3D Body Scanner",
    city: "Brasil",
    color: "#22d3ee",
    result: undefined,
    text: "Achei que não ia ter tempo pra treinar direito. O plano se encaixa na minha rotina — e mesmo assim eu vejo evolução real a cada scan.",
    photo: "/MODELO 01.jpg",
  },
  {
    initials: "JF",
    name: "Cliente 3D Body Scanner",
    city: "Brasil",
    color: "#fb923c",
    result: undefined,
    text: "Já tentei vários apps de treino e sempre travava no mesmo lugar. Esse foi o primeiro que realmente muda o plano quando meu corpo muda.",
    photo: "/MODELO 02.jpg",
  },
  {
    initials: "RP",
    name: "Cliente 3D Body Scanner",
    city: "Brasil",
    color: "#4ade80",
    result: undefined,
    text: "Pensei que fosse só mais um app genérico de treino. Não é — o plano muda de verdade a cada novo scan, e isso faz toda diferença no resultado.",
    photo: "/MODELO 03.jpg",
  },
];

const FAQ_ITEMS = [
  {
    q: "Preciso de algum equipamento para fazer o Scan Corporal 3D?",
    a: "Não. Basta a câmera do seu celular. Em poucos segundos a Inteligência Artificial analisa seu corpo e gera seu retrato completo de composição corporal.",
  },
  {
    q: "O treino funciona tanto pra academia quanto pra casa?",
    a: "Sim. No cadastro você informa onde treina e quais equipamentos tem disponíveis, e a IA monta um programa 100% adaptado ao seu ambiente.",
  },
  {
    q: "Sou iniciante, o app funciona pra mim?",
    a: "Sim. A IA considera seu nível de experiência antes de criar qualquer plano — desde o primeiro treino até fases mais avançadas.",
  },
  {
    q: "A IA realmente ajusta o plano sozinha?",
    a: "Sim. A cada novo Scan Corporal, a Inteligência Artificial recalcula automaticamente treino, alimentação e estratégia com base na sua evolução real.",
  },
  {
    q: "Como funciona a garantia de 7 dias?",
    a: "Se dentro dos primeiros 7 dias você achar que o 3D Body Scanner não é pra você, devolvemos 100% do valor pago. Sem burocracia.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. Tanto no plano mensal quanto no anual, você cancela diretamente pelo app, sem multa e sem precisar ligar pra ninguém.",
  },
];

// ── Componentes de seção ──

function StepCard({ icon: Icon, title, desc, index }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; index: number }) {
  return (
    <div className="relative rounded-3xl border border-border bg-elevated p-6">
      <span className="absolute right-5 top-5 font-display text-3xl font-black text-foreground/10">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary/15 text-cyan">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 font-display text-lg font-black text-foreground">{title}</p>
      <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

const OFFER_DURATION_SECONDS = 15 * 60;

function CountdownBadge() {
  const [secondsLeft, setSecondsLeft] = useState(OFFER_DURATION_SECONDS);

  useEffect(() => {
    const key = "zyrox.landingOfferDeadline";
    let deadline = Number(sessionStorage.getItem(key));
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + OFFER_DURATION_SECONDS * 1000;
      sessionStorage.setItem(key, String(deadline));
    }
    setSecondsLeft(Math.max(0, Math.round((deadline - Date.now()) / 1000)));

    const interval = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.round((deadline - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
      <Clock className="h-4 w-4" />
      Condição especial expira em {mm}:{ss}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-elevated">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-base font-semibold text-foreground">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-base leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const handleCTA = () => navigate({ to: "/criar-conta" });
  const scrollToPricing = () =>
    document.getElementById("precos")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const [pastHero, setPastHero] = useState(false);
  const [reachedPricing, setReachedPricing] = useState(false);
  const [reachedFinalCta, setReachedFinalCta] = useState(false);
  const showFloatingCta = pastHero && !reachedPricing && !reachedFinalCta;

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const pricingEl = document.getElementById("precos");
    if (!pricingEl) return;
    const observer = new IntersectionObserver(([entry]) => setReachedPricing(entry.isIntersecting), {
      rootMargin: "0px 0px -60% 0px",
    });
    observer.observe(pricingEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const finalCtaEl = document.getElementById("cta-final");
    if (!finalCtaEl) return;
    const observer = new IntersectionObserver(([entry]) => setReachedFinalCta(entry.isIntersecting), {
      rootMargin: "0px 0px -20% 0px",
    });
    observer.observe(finalCtaEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <AnimatePresence>
        {showFloatingCta && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-5 py-3 backdrop-blur lg:hidden"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          >
            <PrimaryButton
              size="lg"
              className="w-full !py-4 !text-base uppercase tracking-wide"
              onClick={scrollToPricing}
            >
              Começar Agora <ArrowRight className="h-5 w-5" />
            </PrimaryButton>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-background px-5 pb-12 pt-6 lg:px-10 lg:pb-14 lg:pt-8">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-primary opacity-[0.12] blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between lg:mb-8">
            <div className="flex items-center gap-2">
              <img src={logo} alt="3D Body Scanner" className="h-9 w-9 rounded-xl" />
              <span className="font-display text-sm font-black">3D Body Scanner</span>
            </div>
            <ThemeToggleButton />
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <Reveal immediate>
              <h1 className="font-display text-3xl font-black leading-[1.08] lg:text-6xl">
                Seu corpo muda.
                <br />
                <span className="text-gradient-brand">Seu plano também.</span>
              </h1>
              <p className="mt-5 max-w-lg text-base text-muted-foreground lg:text-xl">
                Você treina, se cuida, tenta de tudo — e ainda sente que não sai do lugar. O
                problema nunca foi você: era um plano que nunca mudava junto com seu corpo.
              </p>
              <PrimaryButton size="lg" className="mt-7 w-full !px-10 !py-5 !text-lg uppercase tracking-wide lg:w-auto" onClick={scrollToPricing}>
                Começar Agora <ArrowRight className="h-5 w-5" />
              </PrimaryButton>
              <p className="mt-3 text-base text-muted-foreground">
                Ativação imediata · cancele quando quiser
              </p>

              <div className="mt-5 flex flex-col gap-2 text-base text-muted-foreground">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="flex gap-0.5" style={{ color: "#fbbf24" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </span>
                    <span className="font-semibold text-foreground">
                      <CountUpNumber value={80000} prefix="+" />
                    </span>
                  </span>
                  <span>pessoas transformaram seu corpo</span>
                </div>
                <span className="inline-flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan" /> Garantia de 7 dias
                </span>
              </div>
            </Reveal>

            <Reveal immediate>
              <div className="relative mx-auto max-w-[420px] pb-6 pr-4 lg:max-w-none">
                <div className="relative mx-auto w-full max-w-[380px] overflow-hidden lg:max-w-[460px]" style={{ aspectRatio: "1024/1536" }}>
                  <Player
                    component={MascotIdleVideo}
                    durationInFrames={120}
                    fps={30}
                    compositionWidth={1024}
                    compositionHeight={1536}
                    style={{ width: "100%", height: "100%" }}
                    autoPlay
                    loop
                    acknowledgeRemotionLicense
                  />
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <PhoneFrame maxWidth={180}>
                    <ScreenImg src="/screen-dashboard.png" alt="Dashboard do 3D Body Scanner" />
                  </PhoneFrame>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── FAIXA ── */}
        <div className="pointer-events-none absolute inset-x-[-10%] bottom-0 flex flex-col">
          <div className="w-full overflow-hidden bg-gradient-primary py-3 shadow-glow-primary">
            <div className="flex w-max animate-[marquee_18s_linear_infinite] items-center gap-10 whitespace-nowrap">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex shrink-0 items-center gap-10">
                  {["3D Body Scanner", "Inteligência Artificial", "Evolução Real", "Resultados Comprovados"].map(
                    (word, j) => (
                      <span
                        key={`${i}-${j}`}
                        className="flex items-center gap-10 text-sm font-black uppercase tracking-wide text-primary-foreground"
                      >
                        {word} <span className="opacity-60">•</span>
                      </span>
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <SectionShell surface innerClassName="max-w-5xl">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <Reveal>
            <img
              src="/BODY%20SCAN.png"
              alt="Análise de composição corporal por IA — Scan 3D"
              className="mx-auto aspect-[2/3] max-h-[480px] w-auto rounded-3xl object-cover shadow-2xl"
            />
          </Reveal>
          <Reveal>
            <SectionKicker>Como funciona</SectionKicker>
            <SectionHeading>Do scan ao plano perfeito. Em minutos, não semanas.</SectionHeading>
            <div className="mt-6 space-y-4">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={step.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary/15 text-cyan">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-base font-black text-foreground">
                      {i + 1}. {step.title}
                    </p>
                    <p className="mt-0.5 text-base leading-relaxed text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* ── TUDO QUE VOCÊ RECEBE ── */}
      <SectionShell innerClassName="mx-auto max-w-md text-center">
        <Reveal>
          <SectionKicker>Tudo que você recebe</SectionKicker>
          <SectionHeading>Tudo conectado. Tudo trabalhando junto.</SectionHeading>
          <div className="mt-7 grid grid-cols-2 gap-3">
            {ECOSYSTEM_FLOW.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-elevated px-3 py-4"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${item.color}1a`, color: item.color }}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold leading-tight text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-base font-semibold text-cyan">
            Sete ferramentas. Uma única assinatura. Zero trabalho manual.
          </p>
        </Reveal>
      </SectionShell>

      {/* ── ANTES × DEPOIS ── */}
      <SectionShell surface innerClassName="max-w-5xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <SectionKicker>Antes × depois</SectionKicker>
            <SectionHeading>Enquanto outros apps ficam parados, o seu evolui com você.</SectionHeading>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              O jeito antigo era simples: escolha um treino, siga uma dieta, repita. Só que seu
              corpo muda — e o plano continuava igual. Isso acabou.
            </p>
            <p className="mt-2 text-base font-semibold text-foreground">
              A cada novo Scan, a IA compara sua evolução e reconstrói automaticamente treino,
              dieta e estratégia.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-elevated p-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">Scan 1</p>
                <p className="mt-2 font-display text-2xl font-black text-foreground">
                  <CountUpNumber value={24.8} decimals={1} suffix="%" />
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">de gordura corporal</p>
              </div>
              <div className="relative rounded-2xl border-2 p-4 text-center shadow-glow-primary" style={{ borderColor: "rgba(34,211,238,0.4)" }}>
                <p className="text-[10px] font-black uppercase tracking-wide text-cyan">Semana 12</p>
                <p className="mt-2 font-display text-2xl font-black text-gradient-brand">
                  <CountUpNumber value={18.4} decimals={1} suffix="%" />
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">de gordura corporal</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Exemplo ilustrativo de evolução ao longo do plano de 12 semanas.</p>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <img
              src="/hercules-transformado.webp"
              alt="Aluno transformado com o 3D Body Scanner"
              className="mx-auto h-full max-h-[560px] w-auto object-contain drop-shadow-2xl"
            />
          </Reveal>
        </div>
      </SectionShell>

      {/* ── PLANOS E PREÇOS ── */}
      <SectionShell surface innerClassName="mx-auto max-w-4xl" id="precos">
        <Reveal className="text-center">
          <SectionKicker>Planos e preços</SectionKicker>
          <SectionHeading>Escolha seu plano.</SectionHeading>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            Tudo isso por menos do que custa um personal em um único dia. Enquanto outras
            pessoas pagam centenas de reais por avaliações físicas, planilhas e consultas
            separadas... você reúne tudo em uma única plataforma.
          </p>
          <CountdownBadge />
        </Reveal>

        <Reveal className="mt-8 grid gap-4 lg:grid-cols-2 lg:items-start lg:gap-6">
          <div
            className="relative overflow-hidden rounded-3xl border-2 p-6 shadow-glow-primary lg:p-8"
            style={{ borderColor: "rgba(255,138,31,0.4)", background: "linear-gradient(160deg, oklch(0.74 0.17 53 / 0.12) 0%, transparent 55%)" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Plano Anual
              </p>
              <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-black text-emerald-400">
                <Check className="h-3 w-3" /> 42% OFF
              </div>
            </div>

            <p className="mt-3 text-center text-sm font-semibold text-muted-foreground line-through decoration-2">
              De R$ 59,90/mês
            </p>
            <div className="mt-1.5 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                com desconto especial
              </span>
            </div>

            <div className="mt-3 flex items-end justify-center gap-1.5">
              <span className="font-display text-5xl font-black text-primary drop-shadow-[0_0_24px_oklch(0.74_0.17_53_/_0.6)]">
                R$ 1,15
              </span>
              <span className="mb-2 text-base font-bold text-muted-foreground">/dia</span>
            </div>
            <p className="mt-2 text-center text-sm font-bold text-muted-foreground">
              Menos que ☕ 1 cafezinho por dia
            </p>

            <div className="my-5 h-px w-full bg-primary/20" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Equivale a
                </p>
                <p className="font-display text-2xl font-black text-primary">
                  R$ 34,90<span className="text-sm font-semibold text-muted-foreground">/mês</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Cobrado hoje
                </p>
                <p className="font-display text-2xl font-black text-primary">R$ 418,80</p>
              </div>
            </div>

            <ul className="mt-5 space-y-2">
              {ANNUAL_FEATURES.map((f) => (
                <CheckItem key={f}>{f}</CheckItem>
              ))}
            </ul>
            <PrimaryButton size="lg" className="mt-5 w-full" onClick={handleCTA}>
              Começar Agora <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold text-muted-foreground">
              <Lock className="h-3 w-3" /> Você economiza R$ 300,00 por ano vs. mensal
            </p>
          </div>

          <div
            className="relative overflow-hidden rounded-3xl border-2 p-6 lg:p-8"
            style={{ borderColor: "oklch(0.72 0.14 305 / 0.4)", background: "linear-gradient(160deg, oklch(0.72 0.14 305 / 0.14) 0%, transparent 55%)" }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Plano Mensal
            </p>
            <div className="mt-3 flex items-end justify-center gap-1.5">
              <span className="font-display text-5xl font-black">R$ 1,99</span>
              <span className="mb-2 text-base font-bold text-muted-foreground">/dia</span>
            </div>
            <p className="mt-2 text-center text-sm font-bold text-muted-foreground">
              Menos que ☕ 1 cafezinho por dia
            </p>

            <div className="my-5 h-px w-full bg-border" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Equivale a
                </p>
                <p className="font-display text-2xl font-black">
                  R$ 59,90<span className="text-sm font-semibold text-muted-foreground">/mês</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Renovação
                </p>
                <p className="font-display text-2xl font-black">R$ 59,90</p>
              </div>
            </div>

            <PrimaryButton
              variant="outline"
              size="lg"
              className="mt-5 w-full border-none"
              style={{ background: "oklch(0.72 0.14 305)", color: "#fff" }}
              onClick={handleCTA}
            >
              Começar Agora
            </PrimaryButton>
            <p
              className="mt-4 rounded-xl px-3 py-2 text-center text-xs font-bold"
              style={{ background: "oklch(0.72 0.14 305 / 0.16)", color: "oklch(0.72 0.14 305)" }}
            >
              Troque para anual e economize R$ 300,00
            </p>
          </div>
        </Reveal>

        <Reveal className="mx-auto mt-6 max-w-2xl rounded-2xl border border-border bg-elevated p-5 text-center">
          <div className="flex items-center justify-center gap-2 font-semibold">
            <Shield className="h-4 w-4 text-cyan" /> Garantia de 7 dias.
          </div>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            Experimente o 3D Body Scanner sem riscos. Se dentro dos primeiros 7 dias você não
            acreditar que esta é a melhor plataforma fitness que já utilizou, devolvemos 100% do
            seu investimento. Sem burocracia. Sem complicação.
          </p>
        </Reveal>
      </SectionShell>

      {/* ── PLANO DE 12 SEMANAS (principal) ── */}
      <SectionShell innerClassName="max-w-5xl">
        <Reveal className="text-center">
          <SectionKicker>Sua IA terminou sua análise</SectionKicker>
          <SectionHeading>Seu plano já está pronto.</SectionHeading>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            Você não vai receber um treino. Nem uma dieta. Vai receber um protocolo completo de
            evolução criado exclusivamente para o seu corpo.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-base font-semibold text-foreground">
            Com base no seu Scan 3D, objetivos, rotina, nível de experiência e centenas de
            outras variáveis, a IA criou um plano personalizado para os próximos 84 dias.
          </p>
        </Reveal>

        <Reveal className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {WEEKS.map((w) => (
            <div
              key={w.n}
              className={`rounded-2xl border p-3 text-center ${w.n === 12 ? "border-cyan/40 bg-gradient-primary/10" : "border-border bg-elevated"}`}
            >
              <p className={`text-[10px] font-black uppercase tracking-wide ${w.n === 12 ? "text-cyan" : "text-muted-foreground"}`}>
                Semana {w.n}
              </p>
              <p className="mt-1 text-xs font-bold text-foreground">{w.label}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-10 grid gap-8 sm:grid-cols-2 sm:items-start">
          <div className="text-center">
            <PhoneFrame>
              <ScreenImg src="/screen-nutricao.png" alt="Plano Alimentar Inteligente do 3D Body Scanner" />
            </PhoneFrame>
            <p className="mt-4 text-base font-semibold text-foreground">Plano Alimentar Inteligente</p>
          </div>
          <div className="text-center">
            <PhoneFrame>
              <ScreenImg src="/screen-treinos.png" alt="Treino personalizado do 3D Body Scanner" />
            </PhoneFrame>
            <p className="mt-4 text-base font-semibold text-foreground">Treino personalizado</p>
          </div>
        </Reveal>
      </SectionShell>

      {/* ── BIBLIOTECA DE EXERCÍCIOS ── */}
      <SectionShell surface innerClassName="max-w-5xl">
        <Reveal className="text-center">
          <SectionKicker>Biblioteca de exercícios</SectionKicker>
          <SectionHeading>Nunca mais tenha dúvida sobre como executar um exercício.</SectionHeading>
          <p className="mx-auto mt-2 max-w-xl text-base text-muted-foreground">
            Cada movimento possui vídeo demonstrativo, instruções detalhadas e explicação da
            musculatura trabalhada. Treine com confiança, mesmo sem um personal ao seu lado.
          </p>
        </Reveal>
        <Reveal className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {EXERCISE_GIFS.map((ex) => (
            <div key={ex.label} className="overflow-hidden rounded-2xl border border-border bg-elevated">
              <div className="aspect-square w-full overflow-hidden bg-background">
                <img src={ex.file} alt={ex.label} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-2.5">
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide"
                  style={{ background: `${ex.color}1a`, color: ex.color }}
                >
                  {ex.muscle}
                </span>
                <p className="mt-1.5 text-xs font-semibold text-foreground">{ex.label}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </SectionShell>

      {/* ── IA COACH ── */}
      <SectionShell surface innerClassName="max-w-4xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <SectionKicker>IA Coach</SectionKicker>
            <SectionHeading>Seu treinador nunca dorme.</SectionHeading>
            <ul className="mt-4 space-y-2 text-base text-muted-foreground">
              <li><span className="font-semibold text-foreground">Treinou pouco hoje?</span> A IA adapta seu plano.</li>
              <li><span className="font-semibold text-foreground">Vai viajar?</span> Ela reorganiza sua semana.</li>
              <li><span className="font-semibold text-foreground">Não conseguiu seguir a dieta?</span> Ela cria uma alternativa.</li>
            </ul>
            <p className="mt-4 text-base text-muted-foreground">
              Seu treinador responde com base no seu histórico, objetivos e evolução. Não com
              respostas genéricas.
            </p>
          </Reveal>
          <Reveal>
            <PhoneFrame>
              <ScreenImg src="/screen-coach.png" alt="IA Coach do 3D Body Scanner" />
            </PhoneFrame>
          </Reveal>
        </div>
      </SectionShell>

      {/* ── ANALYTICS ── */}
      <SectionShell innerClassName="max-w-4xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <SectionKicker>Analytics</SectionKicker>
            <SectionHeading>Veja a evolução que o espelho não mostra.</SectionHeading>
            <p className="mt-3 text-base text-muted-foreground">
              Compare seu corpo em 3D. Acompanhe sua gordura corporal. Visualize seu ganho de
              massa muscular. Descubra exatamente onde você evoluiu. Cada novo Scan mostra o
              quanto você avançou.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <FeatureChip icon={TrendingUp} label="Gráficos de evolução" color="#22d3ee" />
              <FeatureChip icon={GitCompare} label="Comparação corporal" color="#fb923c" />
              <FeatureChip icon={History} label="Histórico completo" color="#4ade80" />
              <FeatureChip icon={Trophy} label="Gamificação" color="#a78bfa" />
            </div>
          </Reveal>
          <Reveal>
            <PhoneFrame>
              <ScreenImg src="/screen-analytics.png" alt="Analytics do 3D Body Scanner" />
            </PhoneFrame>
          </Reveal>
        </div>
      </SectionShell>

      {/* ── COMPARAÇÃO ── */}
      <SectionShell innerClassName="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <SectionKicker>A diferença</SectionKicker>
          <SectionHeading>Enquanto outros aplicativos fazem isso...</SectionHeading>
        </Reveal>
        <Reveal className="mt-8 overflow-hidden rounded-3xl border border-border">
          <div className="grid grid-cols-2 bg-elevated text-center text-xs font-black uppercase tracking-wide">
            <div className="px-4 py-3 text-muted-foreground">Outros apps</div>
            <div className="px-4 py-3 text-cyan">3D Body Scanner</div>
          </div>
          {COMPARISON_ROWS.map((row, i) => (
            <div
              key={row.other}
              className={`grid grid-cols-2 ${i % 2 === 0 ? "bg-background" : "bg-surface"}`}
            >
              <div className="flex items-center gap-2 border-t border-border px-4 py-3.5 text-sm text-muted-foreground">
                <X className="h-4 w-4 shrink-0 text-red-400/70" />
                {row.other}
              </div>
              <div className="flex items-center gap-2 border-t border-l border-border px-4 py-3.5 text-sm font-semibold text-foreground">
                <Check className="h-4 w-4 shrink-0 text-cyan" />
                {row.ours}
              </div>
            </div>
          ))}
        </Reveal>
      </SectionShell>

      {/* ── RESULTADOS ESPERADOS ── */}
      <SectionShell innerClassName="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <SectionKicker>Resultados esperados para você</SectionKicker>
          <SectionHeading>Não é sorte. É protocolo.</SectionHeading>
        </Reveal>
        <Reveal className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {RESULT_PROJECTIONS.map((p) => (
            <div key={p.metric} className="rounded-3xl border border-success/25 bg-success/5 p-6 text-center">
              <p className="font-display text-3xl font-black text-success">{p.value}</p>
              <p className="mt-1.5 text-sm font-semibold text-foreground">{p.metric}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{p.period}</p>
            </div>
          ))}
        </Reveal>
      </SectionShell>

      {/* ── DEPOIMENTOS ── */}
      <SectionShell surface innerClassName="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <SectionKicker>Resultados reais de atletas</SectionKicker>
          <SectionHeading>Quem já ativou, já evoluiu.</SectionHeading>
        </Reveal>
        <Reveal className="mt-8 space-y-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-elevated p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {"photo" in t && t.photo ? (
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black"
                      style={{ background: `${t.color}1a`, color: t.color }}
                    >
                      {t.initials}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                </div>
                {t.result && (
                  <span className="shrink-0 rounded-full bg-success/15 px-3 py-1 text-xs font-black text-success">
                    {t.result}
                  </span>
                )}
              </div>
              <div className="mt-3 flex gap-0.5" style={{ color: "#fbbf24" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-2 text-base italic leading-relaxed text-foreground/90">"{t.text}"</p>
            </div>
          ))}
        </Reveal>
      </SectionShell>

      {/* ── FAQ ── */}
      <SectionShell innerClassName="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <SectionKicker>FAQ</SectionKicker>
          <SectionHeading>Perguntas frequentes.</SectionHeading>
        </Reveal>
        <Reveal className="mt-8 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </Reveal>
      </SectionShell>

      {/* ── CTA FINAL ── */}
      <section id="cta-final" className="relative overflow-hidden bg-gradient-hero px-5 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <PhoneFrame maxWidth={300}>
              <ScreenImg src="/screen-corpo.png" alt="Scan Corporal 3D e medidas do 3D Body Scanner" />
            </PhoneFrame>
          </Reveal>
          <Reveal className="text-center lg:text-left">
            <Sparkles className="mx-auto h-6 w-6 text-cyan lg:mx-0" />
            <p className="mt-4 font-display text-2xl font-black leading-tight lg:text-4xl">
              O futuro do fitness não é treinar mais.
              <br className="hidden lg:block" /> É treinar com inteligência.
            </p>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground lg:mx-0 lg:text-base">
              Seu corpo muda. Sua estratégia também. Comece hoje sua evolução.
            </p>
            <PrimaryButton size="lg" className="mt-7 w-full lg:w-auto" onClick={scrollToPricing}>
              Começar Agora <ArrowRight className="h-5 w-5" />
            </PrimaryButton>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-5 py-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} 3D Body Scanner. Todos os direitos reservados.</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <Link to="/privacidade" className="hover:text-foreground">
            Política de Privacidade
          </Link>
          <Link to="/termos" className="hover:text-foreground">
            Termos de Uso
          </Link>
        </div>
      </footer>
    </div>
  );
}
