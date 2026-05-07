import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Activity, Trophy, Watch, Sparkles, Dumbbell } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PrimaryButton } from "@/components/PrimaryButton";
import logo from "@/assets/zyrox-logo.png";
import { isOnboarded } from "@/lib/onboarding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZYROX — Built For Evolution" },
      { name: "description", content: "Plataforma fitness AI-first. Motor inteligente, analytics premium, social fitness e calistenia + musculação." },
      { property: "og:title", content: "ZYROX — Neo Athletic Intelligence" },
      { property: "og:description", content: "IA adaptativa real, UX cinematográfico, evolução corporal." },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Brain, title: "IA Adaptativa", desc: "Progressão automática, deload e detecção de platô em tempo real." },
  { icon: Activity, title: "Analytics Premium", desc: "Volume, recovery, PRs, heatmap muscular e tendências cinematográficas." },
  { icon: Dumbbell, title: "Musculação + Calistenia", desc: "Biblioteca com 500+ exercícios, biomecânica e substituições." },
  { icon: Trophy, title: "Gamificação", desc: "XP, streaks, conquistas, ranking e desafios viciantes." },
  { icon: Watch, title: "Smartwatch", desc: "Apple Watch nativo: séries, BPM e timer no pulso." },
  { icon: Sparkles, title: "Social Fitness", desc: "Feed, amigos, desafios e ranking elite." },
];

function Index() {
  const navigate = useNavigate();
  const onboarded = typeof window !== "undefined" && isOnboarded();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-hero" />
      <div className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full bg-cyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-96 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <Link to="/onboarding/$step" params={{ step: "1" }} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Entrar
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5">
        <section className="flex flex-col items-center pb-16 pt-10 text-center md:pt-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-6">
            <img src={logo} alt="" className="h-24 w-24 rounded-2xl shadow-glow-primary" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-surface/60 px-3 py-1 text-xs font-medium text-cyan"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-glow-cyan" />
            AI MOTOR V2.4 ACTIVE
          </motion.div>
          <h1 className="font-display text-4xl font-bold leading-[1.05] md:text-6xl">
            Neo Athletic
            <br />
            <span className="text-gradient-primary">Intelligence</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            ZYROX combina IA adaptativa, analytics corporais e experiência cinematográfica para transformar
            seu treino em uma plataforma de evolução real.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <PrimaryButton
              size="lg"
              onClick={() =>
                onboarded
                  ? navigate({ to: "/app" })
                  : navigate({ to: "/onboarding/$step", params: { step: "1" } })
              }
            >
              {onboarded ? "Abrir meu app" : "Começar agora"}
              <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
            <Link to="/app" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Explorar dashboard →
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Built For Evolution.</span>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-gradient-surface p-5 shadow-elevated"
            >
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-elevated text-cyan">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </section>
      </main>

      <footer className="relative z-10 mx-auto max-w-6xl px-5 pb-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ZYROX · Neo Athletic Intelligence
      </footer>
    </div>
  );
}
