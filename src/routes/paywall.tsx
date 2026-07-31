import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Check,
  Sparkles,
  Zap,
  Shield,
  Brain,
  Dumbbell,
  Flame,
  TrendingUp,
  Star,
  Activity,
  ChevronRight,
  Lock,
  Users,
  Clock,
  Target,
  Sun,
  Moon,
} from "lucide-react";
import { loadOnboarding, type OnboardingState } from "@/lib/onboarding";
import { getStoredLocale, setStoredLocale, SUPPORTED_LOCALES, type AppLocale } from "@/lib/locale";
import { getStoredTheme, setStoredTheme, applyTheme, type AppTheme } from "@/lib/theme";
import logo from "@/assets/zyrox-logo.png";

export const Route = createFileRoute("/paywall")({
  head: () => ({
    meta: [
      { title: "Seu Plano Está Pronto | 3D Body Scanner" },
      {
        name: "description",
        content: "A IA criou seu plano exclusivo de evolução corporal.",
      },
    ],
  }),
  component: PaywallPage,
});

// ── Visual config (icons/colors — locale-independent) ──
const FEATURE_ICONS = [
  { icon: Brain, color: "#22d3ee", glow: "rgba(34,211,238,0.25)", bg: "rgba(34,211,238,0.07)" },
  { icon: Activity, color: "#fb923c", glow: "rgba(251,146,60,0.25)", bg: "rgba(251,146,60,0.07)" },
  { icon: Dumbbell, color: "#4ade80", glow: "rgba(74,222,128,0.25)", bg: "rgba(74,222,128,0.07)" },
  {
    icon: TrendingUp,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.25)",
    bg: "rgba(167,139,250,0.07)",
  },
  { icon: Flame, color: "#f472b6", glow: "rgba(244,114,182,0.25)", bg: "rgba(244,114,182,0.07)" },
  { icon: Target, color: "#fbbf24", glow: "rgba(251,191,36,0.25)", bg: "rgba(251,191,36,0.07)" },
] as const;

// ── Pricing per locale ──
const PRICING: Record<
  AppLocale,
  {
    monthly: string;
    annual: string;
    annualTotal: string;
    monthlyFull: string;
    dailyAnnual: string;
    dailyMonthly: string;
    savings: string;
    perMonth: string;
    perDay: string;
    billedAs: string;
  }
> = {
  pt: {
    monthly: "R$ 59,90",
    annual: "R$ 37,90",
    annualTotal: "R$ 454,80",
    monthlyFull: "R$ 59,90",
    dailyAnnual: "R$ 1,25",
    dailyMonthly: "R$ 1,99",
    savings: "R$ 264,00",
    perMonth: "/mês",
    perDay: "/dia",
    billedAs: "cobrado hoje",
  },
  es: {
    monthly: "$34.99",
    annual: "$19.99",
    annualTotal: "$239.88",
    monthlyFull: "$34.99",
    dailyAnnual: "$0.67",
    dailyMonthly: "$1.17",
    savings: "$180.00",
    perMonth: "/mo",
    perDay: "/day",
    billedAs: "charged today",
  },
  en: {
    monthly: "$34.99",
    annual: "$19.99",
    annualTotal: "$239.88",
    monthlyFull: "$34.99",
    dailyAnnual: "$0.67",
    dailyMonthly: "$1.17",
    savings: "$180.00",
    perMonth: "/mo",
    perDay: "/day",
    billedAs: "charged today",
  },
  fr: {
    monthly: "€34,99",
    annual: "€19,99",
    annualTotal: "€239,88",
    monthlyFull: "€34,99",
    dailyAnnual: "€0,67",
    dailyMonthly: "€1,17",
    savings: "€180,00",
    perMonth: "/mois",
    perDay: "/jour",
    billedAs: "facturé aujourd'hui",
  },
  de: {
    monthly: "€34,99",
    annual: "€19,99",
    annualTotal: "€239,88",
    monthlyFull: "€34,99",
    dailyAnnual: "€0,67",
    dailyMonthly: "€1,17",
    savings: "€180,00",
    perMonth: "/Monat",
    perDay: "/Tag",
    billedAs: "heute abgerechnet",
  },
};

// ── All UI copy + goal labels + features + projections per locale ──
const PAYWALL_COPY = {
  pt: {
    compatLabel: "A IA ANALISOU SEU PERFIL",
    heroProtocol: "Protocolo de",
    heroReady: "está pronto,",
    heroSub:
      "A IA mapeou seu perfil completo e gerou um protocolo exclusivo de 12 semanas. Só falta ativar.",
    socialProof: "847 atletas ativaram esta semana",
    offerExpires: "Oferta de boas-vindas expira em",
    annualLabel: "Anual",
    monthlyLabel: "Mensal",
    planAnnual: "Plano anual",
    planMonthly: "Plano mensal",
    halfPrice: "com desconto especial",
    fromPrefix: "De",
    equivalentTo: "equivale a",
    renewal: "renovação",
    savingsAnnual: (s: string) => `🔒 Você economiza ${s} por ano vs. mensal`,
    savingsSwitch: (s: string) => `Troque para anual e economize ${s}`,
    coffee: "Menos que ☕ 1 cafezinho por dia",
    featuresTitle: "Tudo incluído no seu plano",
    projectionsTitle: "Resultados esperados para você",
    testimonialsTitle: "Resultados reais de atletas",
    guaranteeTitle: "Garantia total de 7 dias",
    guaranteeSub: "Se não evoluir na primeira semana, devolvemos 100% do valor sem perguntas.",
    alreadyAccount: "Já tem uma conta?",
    loginLink: "Fazer login",
    paymentSecure: "Pagamento seguro",
    cancelAnytime: "Cancele quando quiser",
    days7: "7 dias de garantia",
    ctaText: "Ativar Meu Plano",
    athleteLabel: "Atleta",
    bestValue: "MELHOR VALOR",
    defaultGoal: "Fitness",
    testimonials: [
      {
        initials: "CM",
        name: "Carlos M.",
        city: "São Paulo · SP",
        color: "#22d3ee",
        result: "−6 kg em 10 sem.",
        rating: 5,
        text: "Nunca tive resultado tão rápido. O plano da IA é outro nível — cada treino faz sentido.",
      },
      {
        initials: "JF",
        name: "Julia F.",
        city: "Rio de Janeiro · RJ",
        color: "#fb923c",
        result: "+2 kg músculo",
        rating: 5,
        text: "O scanner me provou o que a balança não mostra. Perdi gordura e ganhei músculo ao mesmo tempo.",
      },
      {
        initials: "RP",
        name: "Rafael P.",
        city: "Belo Horizonte · MG",
        color: "#4ade80",
        result: "+30% de força",
        rating: 5,
        text: "Treino há 3 anos. Em 12 semanas com o protocolo evoluí mais do que nos 2 anos anteriores.",
      },
    ],
    goalShort: {
      mass: "Hipertrofia",
      strength: "Força",
      hybrid: "Performance Híbrida",
      athletic: "Performance",
      definition: "Definição",
      weight_loss: "Emagrecimento",
      endurance: "Resistência",
      wellness: "Bem-estar",
    } as Record<string, string>,
    features: [
      { title: "Coach IA", desc: "Treinos adaptativos que evoluem com você toda semana" },
      { title: "3D Body Scan", desc: "Análise corporal semanal por câmera — sem balança" },
      { title: "+500 exercícios", desc: "Biblioteca em GIF animado com execução perfeita" },
      { title: "Analytics corporal", desc: "Gráficos de força, peso e composição em tempo real" },
      { title: "Nutrição IA", desc: "Plano de 12 semanas com macros e calorias exatos" },
      { title: "Periodização IA", desc: "Deload automático e sobrecarga progressiva inteligente" },
    ],
    projections: {
      mass: [
        { metric: "Massa muscular", value: "+3–5 kg", period: "em 12 semanas" },
        { metric: "Volume de treino", value: "+40%", period: "progresso garantido" },
        { metric: "Força estimada", value: "+25%", period: "nos principais lifts" },
      ],
      strength: [
        { metric: "Força máxima", value: "+30%", period: "em 12 semanas" },
        { metric: "1RM estimado", value: "+15–20 kg", period: "supino e agachamento" },
        { metric: "Técnica", value: "100%", period: "repetições otimizadas" },
      ],
      definition: [
        { metric: "Gordura corporal", value: "−3–5%", period: "em 12 semanas" },
        { metric: "Cintura", value: "−5–8 cm", period: "com protocolo correto" },
        { metric: "Massa muscular", value: "mantida", period: "durante o déficit" },
      ],
      weight_loss: [
        { metric: "Peso corporal", value: "−4–6 kg", period: "em 12 semanas" },
        { metric: "Gordura", value: "−3–4%", period: "preservando músculo" },
        { metric: "Metabolismo", value: "+12%", period: "melhora estimada" },
      ],
      hybrid: [
        { metric: "Composição", value: "+15%", period: "melhora geral" },
        { metric: "Força + cardio", value: "2x/sem", period: "divisão otimizada" },
        { metric: "Recuperação", value: "acelerada", period: "protocolo de deload" },
      ],
      athletic: [
        { metric: "Performance", value: "+25%", period: "em 12 semanas" },
        { metric: "Potência", value: "+20%", period: "explosão e velocidade" },
        { metric: "Resistência", value: "+35%", period: "capacidade aeróbica" },
      ],
      endurance: [
        { metric: "VO₂ máx", value: "+18%", period: "em 12 semanas" },
        { metric: "Distância", value: "+30%", period: "capacidade de corrida" },
        { metric: "Frequência", value: "otimizada", period: "sem overtraining" },
      ],
      wellness: [
        { metric: "Disposição", value: "+40%", period: "melhora reportada" },
        { metric: "Sono", value: "+1.5h", period: "qualidade restaurada" },
        { metric: "Consistência", value: "2x maior", period: "vs. treino livre" },
      ],
    } as Record<string, { metric: string; value: string; period: string }[]>,
  },
  es: {
    compatLabel: "LA IA ANALIZÓ TU PERFIL",
    heroProtocol: "Protocolo de",
    heroReady: "está listo,",
    heroSub:
      "La IA mapeó tu perfil completo y generó un protocolo exclusivo de 12 semanas. Solo falta activarlo.",
    socialProof: "847 atletas activaron esta semana",
    offerExpires: "La oferta de bienvenida expira en",
    annualLabel: "Anual",
    monthlyLabel: "Mensual",
    planAnnual: "Plan anual",
    planMonthly: "Plan mensual",
    halfPrice: "casi a mitad de precio",
    fromPrefix: "De",
    equivalentTo: "equivale a",
    renewal: "renovación",
    savingsAnnual: (s: string) => `🔒 Ahorras ${s} al año vs. mensual`,
    savingsSwitch: (s: string) => `Cambia al anual y ahorra ${s}`,
    coffee: "Menos que ☕ 1 café al día",
    featuresTitle: "Todo incluido en tu plan",
    projectionsTitle: "Resultados esperados para ti",
    testimonialsTitle: "Resultados reales de atletas",
    guaranteeTitle: "Garantía total de 7 días",
    guaranteeSub: "Si no progresas en la primera semana, te devolvemos el 100% sin preguntas.",
    alreadyAccount: "¿Ya tienes una cuenta?",
    loginLink: "Iniciar sesión",
    paymentSecure: "Pago seguro",
    cancelAnytime: "Cancela cuando quieras",
    days7: "7 días de garantía",
    ctaText: "Activar Mi Plan",
    athleteLabel: "Atleta",
    bestValue: "MEJOR VALOR",
    defaultGoal: "Fitness",
    testimonials: [
      {
        initials: "CM",
        name: "Carlos M.",
        city: "Ciudad de México · MX",
        color: "#22d3ee",
        result: "−6 kg en 10 sem.",
        rating: 5,
        text: "Nunca tuve resultados tan rápidos. El plan de IA es otro nivel — cada entrenamiento tiene sentido.",
      },
      {
        initials: "MG",
        name: "María G.",
        city: "Buenos Aires · AR",
        color: "#fb923c",
        result: "+2 kg músculo",
        rating: 5,
        text: "El scanner me demostró lo que la báscula no puede. Perdí grasa y gané músculo al mismo tiempo.",
      },
      {
        initials: "DR",
        name: "Diego R.",
        city: "Bogotá · CO",
        color: "#4ade80",
        result: "+30% de fuerza",
        rating: 5,
        text: "Llevo 3 años entrenando. En 12 semanas avancé más que en los 2 años anteriores.",
      },
    ],
    goalShort: {
      mass: "Hipertrofia",
      strength: "Fuerza",
      hybrid: "Rendimiento Híbrido",
      athletic: "Rendimiento",
      definition: "Definición",
      weight_loss: "Pérdida de Peso",
      endurance: "Resistencia",
      wellness: "Bienestar",
    } as Record<string, string>,
    features: [
      { title: "Coach IA", desc: "Entrenamientos adaptativos que evolucionan contigo cada semana" },
      { title: "3D Body Scan", desc: "Análisis corporal semanal por cámara — sin báscula" },
      { title: "+500 ejercicios", desc: "Biblioteca GIF animado con ejecución perfecta" },
      {
        title: "Analytics corporal",
        desc: "Gráficos de fuerza, peso y composición en tiempo real",
      },
      { title: "Nutrición IA", desc: "Plan de 12 semanas con macros y calorías exactas" },
      { title: "Periodización IA", desc: "Deload automático y sobrecarga progresiva inteligente" },
    ],
    projections: {
      mass: [
        { metric: "Masa muscular", value: "+3–5 kg", period: "en 12 semanas" },
        { metric: "Volumen de entrenamiento", value: "+40%", period: "progreso garantizado" },
        { metric: "Fuerza estimada", value: "+25%", period: "en los lifts principales" },
      ],
      strength: [
        { metric: "Fuerza máxima", value: "+30%", period: "en 12 semanas" },
        { metric: "1RM estimado", value: "+15–20 kg", period: "press y sentadilla" },
        { metric: "Técnica", value: "100%", period: "repeticiones optimizadas" },
      ],
      definition: [
        { metric: "Grasa corporal", value: "−3–5%", period: "en 12 semanas" },
        { metric: "Cintura", value: "−5–8 cm", period: "con protocolo correcto" },
        { metric: "Masa muscular", value: "preservada", period: "durante el déficit" },
      ],
      weight_loss: [
        { metric: "Peso corporal", value: "−4–6 kg", period: "en 12 semanas" },
        { metric: "Grasa", value: "−3–4%", period: "preservando músculo" },
        { metric: "Metabolismo", value: "+12%", period: "mejora estimada" },
      ],
      hybrid: [
        { metric: "Composición", value: "+15%", period: "mejora general" },
        { metric: "Fuerza + cardio", value: "2x/sem", period: "división optimizada" },
        { metric: "Recuperación", value: "acelerada", period: "protocolo de deload" },
      ],
      athletic: [
        { metric: "Rendimiento", value: "+25%", period: "en 12 semanas" },
        { metric: "Potencia", value: "+20%", period: "explosión y velocidad" },
        { metric: "Resistencia", value: "+35%", period: "capacidad aeróbica" },
      ],
      endurance: [
        { metric: "VO₂ máx", value: "+18%", period: "en 12 semanas" },
        { metric: "Distancia", value: "+30%", period: "capacidad de carrera" },
        { metric: "Frecuencia", value: "optimizada", period: "sin sobreentrenamiento" },
      ],
      wellness: [
        { metric: "Energía", value: "+40%", period: "mejora reportada" },
        { metric: "Sueño", value: "+1.5h", period: "calidad restaurada" },
        { metric: "Consistencia", value: "2x mayor", period: "vs. entrenamiento libre" },
      ],
    } as Record<string, { metric: string; value: string; period: string }[]>,
  },
  en: {
    compatLabel: "AI ANALYZED YOUR PROFILE",
    heroProtocol: "Protocol for",
    heroReady: "is ready,",
    heroSub:
      "AI mapped your complete profile and generated an exclusive 12-week protocol. Just activate it.",
    socialProof: "847 athletes activated this week",
    offerExpires: "Welcome offer expires in",
    annualLabel: "Annual",
    monthlyLabel: "Monthly",
    planAnnual: "Annual plan",
    planMonthly: "Monthly plan",
    halfPrice: "almost half price",
    fromPrefix: "From",
    equivalentTo: "equals",
    renewal: "renewal",
    savingsAnnual: (s: string) => `🔒 You save ${s} per year vs. monthly`,
    savingsSwitch: (s: string) => `Switch to annual and save ${s}`,
    coffee: "Less than ☕ 1 coffee a day",
    featuresTitle: "Everything included in your plan",
    projectionsTitle: "Expected results for you",
    testimonialsTitle: "Real results from athletes",
    guaranteeTitle: "7-day money-back guarantee",
    guaranteeSub:
      "If you don't progress in the first week, we'll refund 100% — no questions asked.",
    alreadyAccount: "Already have an account?",
    loginLink: "Sign in",
    paymentSecure: "Secure payment",
    cancelAnytime: "Cancel anytime",
    days7: "7-day guarantee",
    ctaText: "Activate My Plan",
    athleteLabel: "Athlete",
    bestValue: "BEST VALUE",
    defaultGoal: "Fitness",
    testimonials: [
      {
        initials: "JD",
        name: "John D.",
        city: "New York · NY",
        color: "#22d3ee",
        result: "−12 lbs in 8 wks",
        rating: 5,
        text: "Never had results this fast. The AI plan is next level — every workout makes sense.",
      },
      {
        initials: "SM",
        name: "Sarah M.",
        city: "Los Angeles · CA",
        color: "#fb923c",
        result: "+4 lbs muscle",
        rating: 5,
        text: "The scanner proved what the scale couldn't show. Lost fat and gained muscle at the same time.",
      },
      {
        initials: "MR",
        name: "Mike R.",
        city: "Chicago · IL",
        color: "#4ade80",
        result: "+30% strength",
        rating: 5,
        text: "Been training 3 years. In 12 weeks I progressed more than in the previous 2 years combined.",
      },
    ],
    goalShort: {
      mass: "Muscle Gain",
      strength: "Strength",
      hybrid: "Hybrid Training",
      athletic: "Athletic Performance",
      definition: "Body Definition",
      weight_loss: "Weight Loss",
      endurance: "Endurance",
      wellness: "Wellness",
    } as Record<string, string>,
    features: [
      { title: "AI Coach", desc: "Adaptive workouts that evolve with you every week" },
      { title: "3D Body Scan", desc: "Weekly body analysis by camera — no scale needed" },
      { title: "500+ exercises", desc: "Animated GIF library with perfect execution" },
      { title: "Body Analytics", desc: "Strength, weight and composition charts in real time" },
      { title: "AI Nutrition", desc: "12-week plan with exact macros and calories" },
      { title: "AI Periodization", desc: "Automatic deload and intelligent progressive overload" },
    ],
    projections: {
      mass: [
        { metric: "Muscle mass", value: "+3–5 kg", period: "in 12 weeks" },
        { metric: "Training volume", value: "+40%", period: "guaranteed progress" },
        { metric: "Estimated strength", value: "+25%", period: "on main lifts" },
      ],
      strength: [
        { metric: "Max strength", value: "+30%", period: "in 12 weeks" },
        { metric: "Estimated 1RM", value: "+15–20 kg", period: "bench & squat" },
        { metric: "Technique", value: "100%", period: "reps optimized" },
      ],
      definition: [
        { metric: "Body fat", value: "−3–5%", period: "in 12 weeks" },
        { metric: "Waist", value: "−5–8 cm", period: "with correct protocol" },
        { metric: "Muscle mass", value: "preserved", period: "during deficit" },
      ],
      weight_loss: [
        { metric: "Body weight", value: "−4–6 kg", period: "in 12 weeks" },
        { metric: "Body fat", value: "−3–4%", period: "preserving muscle" },
        { metric: "Metabolism", value: "+12%", period: "estimated improvement" },
      ],
      hybrid: [
        { metric: "Composition", value: "+15%", period: "overall improvement" },
        { metric: "Strength + cardio", value: "2x/wk", period: "optimized split" },
        { metric: "Recovery", value: "accelerated", period: "deload protocol" },
      ],
      athletic: [
        { metric: "Performance", value: "+25%", period: "in 12 weeks" },
        { metric: "Power output", value: "+20%", period: "explosion & speed" },
        { metric: "Endurance", value: "+35%", period: "aerobic capacity" },
      ],
      endurance: [
        { metric: "VO₂ max", value: "+18%", period: "in 12 weeks" },
        { metric: "Distance", value: "+30%", period: "running capacity" },
        { metric: "Frequency", value: "optimized", period: "no overtraining" },
      ],
      wellness: [
        { metric: "Energy levels", value: "+40%", period: "reported improvement" },
        { metric: "Sleep", value: "+1.5h", period: "quality restored" },
        { metric: "Consistency", value: "2x higher", period: "vs. free training" },
      ],
    } as Record<string, { metric: string; value: string; period: string }[]>,
  },
  fr: {
    compatLabel: "L'IA A ANALYSÉ TON PROFIL",
    heroProtocol: "Protocole de",
    heroReady: "est prêt,",
    heroSub:
      "L'IA a analysé ton profil et généré un protocole exclusif de 12 semaines. Il ne reste qu'à l'activer.",
    socialProof: "847 athlètes ont activé cette semaine",
    offerExpires: "L'offre de bienvenue expire dans",
    annualLabel: "Annuel",
    monthlyLabel: "Mensuel",
    planAnnual: "Plan annuel",
    planMonthly: "Plan mensuel",
    halfPrice: "presque moitié prix",
    fromPrefix: "De",
    equivalentTo: "équivaut à",
    renewal: "renouvellement",
    savingsAnnual: (s: string) => `🔒 Tu économises ${s} par an vs. mensuel`,
    savingsSwitch: (s: string) => `Passe à l'annuel et économise ${s}`,
    coffee: "Moins d'un ☕ café par jour",
    featuresTitle: "Tout inclus dans ton plan",
    projectionsTitle: "Résultats attendus pour toi",
    testimonialsTitle: "Vrais résultats d'athlètes",
    guaranteeTitle: "Garantie totale de 7 jours",
    guaranteeSub:
      "Si tu ne progresses pas la première semaine, nous remboursons 100% sans questions.",
    alreadyAccount: "Tu as déjà un compte ?",
    loginLink: "Se connecter",
    paymentSecure: "Paiement sécurisé",
    cancelAnytime: "Annule quand tu veux",
    days7: "7 jours de garantie",
    ctaText: "Activer Mon Plan",
    athleteLabel: "Athlète",
    bestValue: "MEILLEURE OFFRE",
    defaultGoal: "Fitness",
    testimonials: [
      {
        initials: "TB",
        name: "Thomas B.",
        city: "Paris · France",
        color: "#22d3ee",
        result: "−6 kg en 10 sem.",
        rating: 5,
        text: "Je n'avais jamais eu de résultats aussi rapides. Le plan IA est un autre niveau — chaque séance a du sens.",
      },
      {
        initials: "SM",
        name: "Sophie M.",
        city: "Lyon · France",
        color: "#fb923c",
        result: "+2 kg de muscle",
        rating: 5,
        text: "Le scanner m'a prouvé ce que la balance ne montre pas. J'ai perdu de la graisse et gagné du muscle en même temps.",
      },
      {
        initials: "AR",
        name: "Antoine R.",
        city: "Marseille · France",
        color: "#4ade80",
        result: "+30% de force",
        rating: 5,
        text: "Je m'entraîne depuis 3 ans. En 12 semaines avec le protocole, j'ai plus progressé qu'en 2 ans.",
      },
    ],
    goalShort: {
      mass: "Hypertrophie",
      strength: "Force",
      hybrid: "Entraînement Hybride",
      athletic: "Performance",
      definition: "Définition",
      weight_loss: "Perte de Poids",
      endurance: "Endurance",
      wellness: "Bien-être",
    } as Record<string, string>,
    features: [
      { title: "Coach IA", desc: "Entraînements adaptatifs qui évoluent avec toi chaque semaine" },
      { title: "3D Body Scan", desc: "Analyse corporelle hebdomadaire par caméra — sans balance" },
      { title: "+500 exercices", desc: "Bibliothèque GIF animé avec exécution parfaite" },
      {
        title: "Analytics corporel",
        desc: "Graphiques de force, poids et composition en temps réel",
      },
      { title: "Nutrition IA", desc: "Plan de 12 semaines avec macros et calories exacts" },
      {
        title: "Périodisation IA",
        desc: "Déload automatique et surcharge progressive intelligente",
      },
    ],
    projections: {
      mass: [
        { metric: "Masse musculaire", value: "+3–5 kg", period: "en 12 semaines" },
        { metric: "Volume d'entraînement", value: "+40%", period: "progrès garanti" },
        { metric: "Force estimée", value: "+25%", period: "sur les lifts principaux" },
      ],
      strength: [
        { metric: "Force maximale", value: "+30%", period: "en 12 semaines" },
        { metric: "1RM estimé", value: "+15–20 kg", period: "développé & squat" },
        { metric: "Technique", value: "100%", period: "répétitions optimisées" },
      ],
      definition: [
        { metric: "Graisse corporelle", value: "−3–5%", period: "en 12 semaines" },
        { metric: "Tour de taille", value: "−5–8 cm", period: "avec le bon protocole" },
        { metric: "Masse musculaire", value: "préservée", period: "pendant le déficit" },
      ],
      weight_loss: [
        { metric: "Poids corporel", value: "−4–6 kg", period: "en 12 semaines" },
        { metric: "Graisse", value: "−3–4%", period: "en préservant le muscle" },
        { metric: "Métabolisme", value: "+12%", period: "amélioration estimée" },
      ],
      hybrid: [
        { metric: "Composition", value: "+15%", period: "amélioration générale" },
        { metric: "Force + cardio", value: "2x/sem", period: "répartition optimisée" },
        { metric: "Récupération", value: "accélérée", period: "protocole de déload" },
      ],
      athletic: [
        { metric: "Performance", value: "+25%", period: "en 12 semaines" },
        { metric: "Puissance", value: "+20%", period: "explosion & vitesse" },
        { metric: "Endurance", value: "+35%", period: "capacité aérobie" },
      ],
      endurance: [
        { metric: "VO₂ max", value: "+18%", period: "en 12 semaines" },
        { metric: "Distance", value: "+30%", period: "capacité de course" },
        { metric: "Fréquence", value: "optimisée", period: "sans surentraînement" },
      ],
      wellness: [
        { metric: "Énergie", value: "+40%", period: "amélioration reportée" },
        { metric: "Sommeil", value: "+1.5h", period: "qualité restaurée" },
        { metric: "Consistance", value: "2x plus", period: "vs. entraînement libre" },
      ],
    } as Record<string, { metric: string; value: string; period: string }[]>,
  },
  de: {
    compatLabel: "KI HAT DEIN PROFIL ANALYSIERT",
    heroProtocol: "Protokoll für",
    heroReady: "ist bereit,",
    heroSub:
      "Die KI hat dein vollständiges Profil analysiert und ein exklusives 12-Wochen-Protokoll erstellt. Nur noch aktivieren.",
    socialProof: "847 Athleten aktivierten diese Woche",
    offerExpires: "Willkommensangebot läuft ab in",
    annualLabel: "Jährlich",
    monthlyLabel: "Monatlich",
    planAnnual: "Jahresplan",
    planMonthly: "Monatsplan",
    halfPrice: "fast zum halben Preis",
    fromPrefix: "Von",
    equivalentTo: "entspricht",
    renewal: "Verlängerung",
    savingsAnnual: (s: string) => `🔒 Du sparst ${s} pro Jahr vs. monatlich`,
    savingsSwitch: (s: string) => `Wechsle zum Jahresplan und spare ${s}`,
    coffee: "Weniger als ☕ 1 Kaffee pro Tag",
    featuresTitle: "Alles in deinem Plan enthalten",
    projectionsTitle: "Erwartete Ergebnisse für dich",
    testimonialsTitle: "Echte Ergebnisse von Athleten",
    guaranteeTitle: "7 Tage Geld-zurück-Garantie",
    guaranteeSub:
      "Wenn du in der ersten Woche keine Fortschritte machst, erstatten wir 100% — keine Fragen.",
    alreadyAccount: "Hast du bereits ein Konto?",
    loginLink: "Anmelden",
    paymentSecure: "Sichere Zahlung",
    cancelAnytime: "Jederzeit kündigen",
    days7: "7 Tage Garantie",
    ctaText: "Meinen Plan aktivieren",
    athleteLabel: "Athlet",
    bestValue: "BESTES ANGEBOT",
    defaultGoal: "Fitness",
    testimonials: [
      {
        initials: "MM",
        name: "Max M.",
        city: "Berlin · Deutschland",
        color: "#22d3ee",
        result: "−6 kg in 10 Wo.",
        rating: 5,
        text: "Ich hatte noch nie so schnelle Ergebnisse. Der KI-Plan ist ein anderes Level — jedes Workout macht Sinn.",
      },
      {
        initials: "LS",
        name: "Laura S.",
        city: "München · Deutschland",
        color: "#fb923c",
        result: "+2 kg Muskeln",
        rating: 5,
        text: "Der Scanner bewies mir, was die Waage nicht zeigt. Fett verloren und gleichzeitig Muskeln aufgebaut.",
      },
      {
        initials: "FR",
        name: "Felix R.",
        city: "Hamburg · Deutschland",
        color: "#4ade80",
        result: "+30% Kraft",
        rating: 5,
        text: "Ich trainiere seit 3 Jahren. In 12 Wochen habe ich mehr Fortschritte gemacht als in den 2 Jahren davor.",
      },
    ],
    goalShort: {
      mass: "Muskelaufbau",
      strength: "Kraft",
      hybrid: "Hybrid-Training",
      athletic: "Performance",
      definition: "Definition",
      weight_loss: "Gewichtsverlust",
      endurance: "Ausdauer",
      wellness: "Wohlbefinden",
    } as Record<string, string>,
    features: [
      {
        title: "KI-Coach",
        desc: "Adaptive Workouts, die sich jede Woche mit dir weiterentwickeln",
      },
      { title: "3D Body Scan", desc: "Wöchentliche Körperanalyse per Kamera — keine Waage nötig" },
      { title: "500+ Übungen", desc: "Animierte GIF-Bibliothek mit perfekter Ausführung" },
      { title: "Körper-Analytics", desc: "Kraft-, Gewichts- und Kompositions-Charts in Echtzeit" },
      { title: "KI-Ernährung", desc: "12-Wochen-Plan mit genauen Makros und Kalorien" },
      {
        title: "KI-Periodisierung",
        desc: "Automatischer Deload und intelligente progressive Überlastung",
      },
    ],
    projections: {
      mass: [
        { metric: "Muskelmasse", value: "+3–5 kg", period: "in 12 Wochen" },
        { metric: "Trainingsvolumen", value: "+40%", period: "garantierter Fortschritt" },
        { metric: "Geschätzte Kraft", value: "+25%", period: "bei den Hauptlifts" },
      ],
      strength: [
        { metric: "Maximalkraft", value: "+30%", period: "in 12 Wochen" },
        { metric: "Geschätztes 1RM", value: "+15–20 kg", period: "Bankdrücken & Kniebeuge" },
        { metric: "Technik", value: "100%", period: "optimierte Wiederholungen" },
      ],
      definition: [
        { metric: "Körperfett", value: "−3–5%", period: "in 12 Wochen" },
        { metric: "Taillenumfang", value: "−5–8 cm", period: "mit richtigem Protokoll" },
        { metric: "Muskelmasse", value: "erhalten", period: "während des Defizits" },
      ],
      weight_loss: [
        { metric: "Körpergewicht", value: "−4–6 kg", period: "in 12 Wochen" },
        { metric: "Körperfett", value: "−3–4%", period: "Muskel erhalten" },
        { metric: "Stoffwechsel", value: "+12%", period: "geschätzte Verbesserung" },
      ],
      hybrid: [
        { metric: "Komposition", value: "+15%", period: "allgemeine Verbesserung" },
        { metric: "Kraft + Cardio", value: "2x/Wo", period: "optimierte Aufteilung" },
        { metric: "Erholung", value: "beschleunigt", period: "Deload-Protokoll" },
      ],
      athletic: [
        { metric: "Performance", value: "+25%", period: "in 12 Wochen" },
        { metric: "Leistung", value: "+20%", period: "Explosivkraft & Schnelligkeit" },
        { metric: "Ausdauer", value: "+35%", period: "aerobe Kapazität" },
      ],
      endurance: [
        { metric: "VO₂ max", value: "+18%", period: "in 12 Wochen" },
        { metric: "Distanz", value: "+30%", period: "Laufkapazität" },
        { metric: "Häufigkeit", value: "optimiert", period: "kein Übertraining" },
      ],
      wellness: [
        { metric: "Energie", value: "+40%", period: "berichtete Verbesserung" },
        { metric: "Schlaf", value: "+1.5h", period: "Qualität wiederhergestellt" },
        { metric: "Konsistenz", value: "2x höher", period: "vs. freies Training" },
      ],
    } as Record<string, { metric: string; value: string; period: string }[]>,
  },
} as const;

// ── Hooks ──
function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const steps = 40;
    const step = target / steps;
    const interval = duration / steps;
    let current = 0;
    const id = setInterval(() => {
      current += step;
      if (current >= target) {
        setValue(target);
        clearInterval(id);
      } else {
        setValue(Math.floor(current));
      }
    }, interval);
    return () => clearInterval(id);
  }, [target, duration]);
  return value;
}

function getCompatibilityScore(profile: ReturnType<typeof loadOnboarding>): number {
  let score = 88;
  if (profile.goal) score += 2;
  if (profile.experience) score += 2;
  if (profile.location) score += 2;
  if (profile.days?.length) score += Math.min(profile.days.length, 2);
  if (profile.name) score += 1;
  if (profile.equipment?.length) score += 1;
  return Math.min(score, 98);
}

function FlagButton({
  code,
  flagSrc,
  nativeLabel,
  selected,
  onClick,
}: {
  code: AppLocale;
  flagSrc: string;
  nativeLabel: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={nativeLabel}
      aria-label={nativeLabel}
      className="transition-transform active:scale-90"
    >
      <span
        className="inline-flex overflow-hidden rounded-[5px] transition"
        style={{
          width: 36,
          height: 26,
          border: selected ? "2px solid rgba(34,211,238,0.85)" : "2px solid transparent",
          boxShadow: selected ? "0 0 8px rgba(34,211,238,0.4)" : undefined,
          opacity: selected ? 1 : 0.5,
        }}
      >
        <img src={flagSrc} alt={code} className="h-full w-full object-cover" loading="lazy" />
      </span>
    </button>
  );
}

// ── Main component ──
function PaywallPage() {
  const navigate = useNavigate();
  // Estado inicial vazio (igual ao que loadOnboarding() retorna no servidor, sem
  // localStorage) e só lê o valor real depois de montar no cliente — chamar
  // loadOnboarding() direto no corpo do componente causava mismatch de hydration
  // (servidor sempre via "Fitness" genérico, cliente via o objetivo real tipo
  // "Definição", e o React descartava a árvore inteira pra tentar corrigir).
  const [profile, setProfile] = useState<OnboardingState>({});
  const [billing, setBilling] = useState<"annual" | "monthly">("annual");
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState<AppLocale>("pt");
  const [theme, setTheme] = useState<AppTheme>("dark");
  const [showStickyCta, setShowStickyCta] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const footerCtaRef = useRef<HTMLDivElement | null>(null);
  const countdown = useCountdown(23 * 60 + 47);

  useEffect(() => {
    setProfile(loadOnboarding());
    setLocale(getStoredLocale());
    const storedTheme = getStoredTheme();
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  useEffect(() => {
    const updateStickyCta = () => {
      const heroBottom =
        heroRef.current?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY;
      const footerTop =
        footerCtaRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      setShowStickyCta(heroBottom < -16 && footerTop > window.innerHeight - 24);
    };

    updateStickyCta();
    window.addEventListener("scroll", updateStickyCta, { passive: true });
    window.addEventListener("resize", updateStickyCta);
    return () => {
      window.removeEventListener("scroll", updateStickyCta);
      window.removeEventListener("resize", updateStickyCta);
    };
  }, []);

  const copy =
    locale === "es"
      ? PAYWALL_COPY.es
      : locale === "en"
        ? PAYWALL_COPY.en
        : locale === "fr"
          ? PAYWALL_COPY.fr
          : locale === "de"
            ? PAYWALL_COPY.de
            : PAYWALL_COPY.pt;
  const pr =
    locale === "es"
      ? PRICING.es
      : locale === "en"
        ? PRICING.en
        : locale === "fr"
          ? PRICING.fr
          : locale === "de"
            ? PRICING.de
            : PRICING.pt;
  const currentPrice = billing === "annual" ? pr.annual : pr.monthly;
  const dailyPrice = billing === "annual" ? pr.dailyAnnual : pr.dailyMonthly;

  const firstName = profile.name?.split(" ")[0] || copy.athleteLabel;
  const compatibility = getCompatibilityScore(profile);
  const animatedScore = useCountUp(compatibility, 1600);
  const goalShort = copy.goalShort[profile.goal ?? ""] ?? copy.defaultGoal;
  const projections = copy.projections[profile.goal ?? ""] ?? copy.projections.wellness;

  const handleLocaleChange = (code: AppLocale) => {
    console.log("[PAYWALL] locale change →", code, "| antes:", locale);
    setLocale(code);
    setStoredLocale(code);
    console.log("[PAYWALL] setLocale chamado com:", code);
  };

  const handleThemeToggle = () => {
    const next: AppTheme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setStoredTheme(next);
  };

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => navigate({ to: "/criar-conta" }), 900);
  };

  const isLight = theme === "light";
  const pageBg = isLight ? "#eef3f8" : "#030711";
  const textPrimary = isLight ? "#0b1220" : "#ffffff";
  const textMuted = isLight ? "#334155" : "rgba(148,163,184,0.75)";
  const textSubtle = isLight ? "#64748b" : "rgba(100,116,139,0.55)";
  const accentOrange = isLight ? "#c2410c" : "#fb923c";
  const accentOrangeSoft = isLight ? "#ea580c" : "#fdba74";
  const accentCyan = isLight ? "#0891b2" : "#22d3ee";
  const accentGreen = isLight ? "#15803d" : "#4ade80";
  const cardBg = isLight
    ? "linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))"
    : "linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))";
  const cardBorder = isLight
    ? "1px solid rgba(100,116,139,0.22)"
    : "1px solid rgba(255,255,255,0.07)";

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: pageBg, color: textPrimary }}
    >
      {/* Cinematic background glows — só no dark */}
      {!isLight && (
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 20% 10%,rgba(34,211,238,0.12) 0%,transparent 60%)," +
              "radial-gradient(ellipse 80% 50% at 80% 90%,rgba(251,146,60,0.12) 0%,transparent 60%)," +
              "radial-gradient(ellipse 60% 40% at 50% 50%,rgba(167,139,250,0.04) 0%,transparent 70%)",
          }}
        />
      )}

      <div className="relative z-10 mx-auto max-w-sm px-5 pb-8 pt-8">
        {/* ── Header ── */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div
                className="pointer-events-none absolute inset-0 rounded-xl blur-lg"
                style={{
                  background: "linear-gradient(135deg,rgba(34,211,238,0.6),rgba(251,146,60,0.6))",
                  transform: "scale(1.4)",
                }}
              />
              <img src={logo} alt="3D Body Scanner" className="relative h-9 w-9 rounded-xl" />
            </div>
            <span
              className="font-display text-sm font-black"
              style={{
                color: isLight ? textPrimary : "#f8fafc",
                textShadow: isLight
                  ? "0 1px 0 rgba(255,255,255,0.65)"
                  : "0 0 12px rgba(34,211,238,0.16)",
              }}
            >
              3D Body Scanner
            </span>
          </div>
        </div>

        {/* ── Bandeiras + tema ── */}
        <div className="mb-5 flex items-center gap-2">
          {SUPPORTED_LOCALES.map((loc) => (
            <button
              key={loc.code}
              type="button"
              title={loc.nativeLabel}
              aria-label={loc.nativeLabel}
              onClick={() => {
                setLocale(loc.code);
                setStoredLocale(loc.code);
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "inline-flex",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  overflow: "hidden",
                  borderRadius: 5,
                  width: 36,
                  height: 26,
                  border:
                    locale === loc.code
                      ? "2px solid rgba(34,211,238,0.85)"
                      : "2px solid transparent",
                  boxShadow: locale === loc.code ? "0 0 8px rgba(34,211,238,0.4)" : undefined,
                  opacity: locale === loc.code ? 1 : 0.5,
                  transition: "opacity 0.15s",
                }}
              >
                <img
                  src={loc.flagSrc}
                  alt={loc.code}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    pointerEvents: "none",
                  }}
                />
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={handleThemeToggle}
            title={isLight ? "Modo escuro" : "Modo claro"}
            className="ml-auto transition-transform active:scale-90"
            style={{
              width: 36,
              height: 26,
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isLight ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.1)",
              boxShadow: isLight ? "0 1px 6px rgba(15,23,42,0.12)" : "none",
              color: isLight ? "#0f172a" : "#e2e8f0",
            }}
          >
            {isLight ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>

        {/* locale key — força remount do conteúdo ao trocar idioma */}
        <div key={locale}>
          {/* ── HERO ── */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-7 text-center"
          >
            {/* Mascote */}
            <div className="relative mx-auto mb-4 h-56 w-56">
              <div
                className="pointer-events-none absolute inset-0 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle,rgba(34,211,238,0.55) 0%,rgba(251,146,60,0.35) 50%,transparent 70%)",
                  transform: "scale(1.8)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 animate-pulse rounded-full blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle,rgba(34,211,238,0.35) 0%,rgba(167,139,250,0.15) 60%,transparent 80%)",
                  animationDuration: "3s",
                }}
              />
              <img
                src="/MASCOTE SEM FUNDO.png"
                alt="3D Body Scanner"
                className="relative h-full w-full object-contain"
                style={{
                  filter:
                    "drop-shadow(0 0 32px rgba(34,211,238,0.55)) drop-shadow(0 8px 24px rgba(0,0,0,0.6))",
                }}
              />
            </div>

            {/* Compatibility score */}
            <div className="mb-4 flex flex-col items-center gap-2">
              <div
                className="flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em]"
                style={{
                  background: isLight ? "rgba(234,88,12,0.11)" : "rgba(251,146,60,0.1)",
                  border: isLight
                    ? "1px solid rgba(194,65,12,0.3)"
                    : "1px solid rgba(251,146,60,0.25)",
                  color: accentOrange,
                }}
              >
                <Zap className="h-3 w-3" />
                {copy.compatLabel}
              </div>
              <div className="flex items-end gap-1">
                <span
                  className="font-display text-6xl font-black leading-none"
                  style={{
                    color: accentOrange,
                    textShadow: isLight ? "none" : "0 0 24px rgba(251,146,60,0.45)",
                  }}
                >
                  {animatedScore}
                </span>
                <span
                  className="mb-2 font-display text-2xl font-black"
                  style={{ color: isLight ? "#c2410c" : "rgba(251,146,60,0.6)" }}
                >
                  %
                </span>
              </div>
              <div
                className="h-1.5 w-48 overflow-hidden rounded-full"
                style={{ background: isLight ? "rgba(15,23,42,0.14)" : "rgba(255,255,255,0.07)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${animatedScore}%` }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg,${accentCyan},${accentOrangeSoft})`,
                    boxShadow: isLight ? "none" : "0 0 8px rgba(251,146,60,0.6)",
                  }}
                />
              </div>
            </div>

            <h1
              className="font-display text-[2.1rem] font-black leading-[1.15]"
              style={{ color: textPrimary }}
            >
              {copy.heroProtocol}
              <br />
              <span
                style={{
                  color: accentCyan,
                }}
              >
                {goalShort}
              </span>{" "}
              <span style={{ color: accentOrange }}>{copy.heroReady}</span>
              <br />
              <span style={{ color: accentOrange }}>{firstName}</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: textMuted }}>
              {copy.heroSub}
            </p>
          </motion.div>

          {/* ── Social proof ── */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
            className="mb-5 flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold"
            style={{
              background: isLight ? "rgba(22,163,74,0.12)" : "rgba(74,222,128,0.07)",
              border: isLight
                ? "1px solid rgba(21,128,61,0.26)"
                : "1px solid rgba(74,222,128,0.14)",
              color: accentGreen,
            }}
          >
            <Users className="h-3.5 w-3.5" />
            {copy.socialProof}
            <span className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-2.5 w-2.5 fill-current" />
              ))}
            </span>
          </motion.div>

          {/* ── Urgency timer ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="mb-6 flex items-center justify-between rounded-2xl px-4 py-3"
            style={{
              background: isLight
                ? "linear-gradient(135deg,rgba(234,88,12,0.12),rgba(255,247,237,0.92))"
                : "linear-gradient(135deg,rgba(251,146,60,0.08),rgba(251,146,60,0.04))",
              border: isLight ? "1px solid rgba(194,65,12,0.28)" : "1px solid rgba(251,146,60,0.2)",
            }}
          >
            <div
              className="flex items-center gap-2 text-xs font-semibold"
              style={{ color: accentOrange }}
            >
              <Clock className="h-3.5 w-3.5" />
              {copy.offerExpires}
            </div>
            <div
              className="font-display text-xl font-black tabular-nums"
              style={{
                color: accentOrangeSoft,
                textShadow: isLight ? "none" : "0 0 12px rgba(251,146,60,0.6)",
              }}
            >
              {countdown}
            </div>
          </motion.div>

          {/* ── Toggle ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-3"
          >
            <div
              className="flex gap-1.5 rounded-2xl p-1.5"
              style={{
                background: isLight ? "rgba(226,232,240,0.86)" : "rgba(255,255,255,0.04)",
                border: isLight
                  ? "1px solid rgba(100,116,139,0.24)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <button
                onClick={() => setBilling("annual")}
                className="relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-3 text-sm font-black transition-all"
                style={{
                  background:
                    billing === "annual"
                      ? "linear-gradient(135deg,#c2410c,#ea580c,#fb923c)"
                      : "transparent",
                  color: billing === "annual" ? "#fff" : textSubtle,
                  boxShadow:
                    billing === "annual"
                      ? isLight
                        ? "0 8px 18px rgba(194,65,12,0.24)"
                        : "0 0 24px rgba(251,146,60,0.4), 0 2px 12px rgba(0,0,0,0.4)"
                      : "none",
                }}
              >
                <div className="flex items-center gap-1.5">
                  {copy.annualLabel}
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-black"
                    style={{
                      background:
                        billing === "annual" ? "rgba(255,255,255,0.2)" : "rgba(74,222,128,0.15)",
                      color: billing === "annual" ? "#fff" : accentGreen,
                    }}
                  >
                    −37%
                  </span>
                </div>
                {billing !== "annual" && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider"
                    style={{ color: accentGreen }}
                  >
                    {copy.bestValue}
                  </span>
                )}
              </button>
              <button
                onClick={() => setBilling("monthly")}
                className="flex-1 rounded-xl py-3.5 text-sm font-black transition-all"
                style={{
                  background:
                    billing === "monthly"
                      ? isLight
                        ? "rgba(255,255,255,0.92)"
                        : "rgba(255,255,255,0.07)"
                      : "transparent",
                  color: billing === "monthly" ? textPrimary : textSubtle,
                  boxShadow:
                    billing === "monthly" && isLight ? "0 1px 8px rgba(15,23,42,0.12)" : "none",
                }}
              >
                {copy.monthlyLabel}
              </button>
            </div>
          </motion.div>

          {/* ── Price card ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mb-7 overflow-hidden rounded-3xl"
            style={{
              background:
                billing === "annual"
                  ? isLight
                    ? "linear-gradient(160deg,rgba(255,255,255,0.98) 0%,rgba(255,247,237,0.96) 55%)"
                    : "linear-gradient(160deg,rgba(194,65,12,0.18) 0%,rgba(9,14,24,0.97) 45%)"
                  : isLight
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.04)",
              border:
                billing === "annual"
                  ? isLight
                    ? "1.5px solid rgba(194,65,12,0.28)"
                    : "1.5px solid rgba(251,146,60,0.4)"
                  : isLight
                    ? "1.5px solid rgba(100,116,139,0.2)"
                    : "1.5px solid rgba(255,255,255,0.1)",
              boxShadow:
                billing === "annual"
                  ? isLight
                    ? "0 16px 40px rgba(15,23,42,0.1), 0 0 0 1px rgba(194,65,12,0.08)"
                    : "0 0 60px rgba(251,146,60,0.2), 0 0 120px rgba(251,146,60,0.08)"
                  : isLight
                    ? "0 12px 28px rgba(15,23,42,0.08)"
                    : "none",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={billing}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                <div className="flex items-center justify-between px-6 pb-0 pt-6">
                  <div
                    className="text-[11px] font-black uppercase tracking-[0.12em]"
                    style={{ color: textSubtle }}
                  >
                    {billing === "annual" ? copy.planAnnual : copy.planMonthly}
                  </div>
                  {billing === "annual" && (
                    <div
                      className="flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black"
                      style={{
                        background: "rgba(74,222,128,0.15)",
                        border: isLight
                          ? "1px solid rgba(21,128,61,0.28)"
                          : "1px solid rgba(74,222,128,0.3)",
                        color: accentGreen,
                      }}
                    >
                      <Check className="h-3 w-3" />
                      37% OFF
                    </div>
                  )}
                </div>

                <div className="px-6 pb-2 pt-4 text-center">
                  {billing === "annual" && (
                    <>
                      <div
                        className="mb-2 text-base font-semibold line-through"
                        style={{
                          color: isLight ? "rgba(71,85,105,0.72)" : "rgba(148,163,184,0.25)",
                        }}
                      >
                        {`${copy.fromPrefix} ${pr.monthlyFull}${pr.perMonth}`}
                      </div>
                      <div
                        className="mb-1 inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[11px] font-black"
                        style={{
                          background: "rgba(74,222,128,0.12)",
                          border: isLight
                            ? "1px solid rgba(21,128,61,0.24)"
                            : "1px solid rgba(74,222,128,0.25)",
                          color: accentGreen,
                        }}
                      >
                        {copy.halfPrice}
                      </div>
                    </>
                  )}

                  {/* Daily price — main anchor */}
                  <div className="relative inline-flex flex-col items-center">
                    <div
                      className="pointer-events-none absolute"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        width: "220px",
                        height: "100px",
                        background:
                          billing === "annual"
                            ? isLight
                              ? "radial-gradient(ellipse,rgba(234,88,12,0.12) 0%,transparent 72%)"
                              : "radial-gradient(ellipse,rgba(251,146,60,0.35) 0%,transparent 70%)"
                            : isLight
                              ? "radial-gradient(ellipse,rgba(15,23,42,0.06) 0%,transparent 70%)"
                              : "radial-gradient(ellipse,rgba(255,255,255,0.12) 0%,transparent 70%)",
                        filter: "blur(20px)",
                      }}
                    />
                    <div className="relative flex items-end gap-1.5">
                      <span
                        className="font-display font-black leading-none"
                        style={{
                          fontSize: "clamp(3.5rem,15vw,5rem)",
                          color: billing === "annual" ? accentOrange : textPrimary,
                          textShadow:
                            billing === "annual"
                              ? isLight
                                ? "none"
                                : "0 0 40px rgba(251,146,60,0.7), 0 0 80px rgba(251,146,60,0.3)"
                              : "none",
                          letterSpacing: 0,
                        }}
                      >
                        {dailyPrice}
                      </span>
                      <span className="mb-3 text-base font-bold" style={{ color: textSubtle }}>
                        {pr.perDay}
                      </span>
                    </div>
                  </div>

                  {/* Coffee anchor */}
                  <div
                    className="mb-5 mt-2 flex items-center justify-center gap-1.5 text-sm font-bold"
                    style={{ color: textMuted }}
                  >
                    <span>{copy.coffee}</span>
                  </div>

                  <div
                    className="mb-5 h-px w-full"
                    style={{
                      background:
                        billing === "annual"
                          ? "linear-gradient(90deg,transparent,rgba(251,146,60,0.2),transparent)"
                          : isLight
                            ? "linear-gradient(90deg,transparent,rgba(0,0,0,0.08),transparent)"
                            : "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className="text-left text-[11px] font-semibold uppercase tracking-[0.12em]"
                        style={{ color: textSubtle }}
                      >
                        {copy.equivalentTo}
                      </div>
                      <div
                        className="font-display text-2xl font-black"
                        style={{
                          color: billing === "annual" ? accentOrange : textPrimary,
                        }}
                      >
                        {currentPrice}
                        <span className="text-sm font-semibold" style={{ color: textSubtle }}>
                          {pr.perMonth}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-[11px] font-semibold uppercase tracking-[0.12em]"
                        style={{ color: textSubtle }}
                      >
                        {billing === "annual" ? pr.billedAs : copy.renewal}
                      </div>
                      <div
                        className="font-display text-2xl font-black"
                        style={{
                          color: billing === "annual" ? accentOrange : textPrimary,
                        }}
                      >
                        {billing === "annual" ? pr.annualTotal : pr.monthly}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-2 px-6 py-3 text-center text-[11px] font-bold"
                  style={{
                    background:
                      billing === "annual"
                        ? isLight
                          ? "rgba(234,88,12,0.09)"
                          : "rgba(251,146,60,0.07)"
                        : isLight
                          ? "rgba(0,0,0,0.03)"
                          : "rgba(255,255,255,0.03)",
                    borderTop:
                      billing === "annual"
                        ? isLight
                          ? "1px solid rgba(194,65,12,0.18)"
                          : "1px solid rgba(251,146,60,0.15)"
                        : isLight
                          ? "1px solid rgba(0,0,0,0.07)"
                          : "1px solid rgba(255,255,255,0.06)",
                    color: billing === "annual" ? accentOrange : textSubtle,
                  }}
                >
                  {billing === "annual"
                    ? copy.savingsAnnual(pr.savings)
                    : copy.savingsSwitch(pr.savings)}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ── Features 2×3 ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mb-7"
          >
            <p
              className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: textSubtle }}
            >
              {copy.featuresTitle}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {FEATURE_ICONS.map(({ icon: Icon, color, glow, bg }, i) => {
                const feat = copy.features[i];
                return (
                  <div
                    key={feat.title}
                    className="rounded-2xl p-4"
                    style={{
                      background: isLight
                        ? `linear-gradient(135deg,${color}16,rgba(255,255,255,0.95))`
                        : bg,
                      border: isLight ? `1px solid ${color}38` : `1px solid ${color}25`,
                      boxShadow: isLight ? "0 10px 24px rgba(15,23,42,0.07)" : `0 0 20px ${glow}`,
                    }}
                  >
                    <div
                      className="mb-3 grid h-10 w-10 place-items-center rounded-2xl"
                      style={{
                        background: `${color}18`,
                        border: isLight ? `1px solid ${color}45` : `1px solid ${color}35`,
                        boxShadow: isLight ? "none" : `0 0 12px ${glow}`,
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color }} />
                    </div>
                    <div className="text-sm font-black" style={{ color: textPrimary }}>
                      {feat.title}
                    </div>
                    <div className="mt-1 text-[11px] leading-snug" style={{ color: textMuted }}>
                      {feat.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Projections ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="mb-7"
          >
            <p
              className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: textSubtle }}
            >
              {copy.projectionsTitle}
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {projections.map((proj, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-3.5 text-center"
                  style={{
                    background: isLight
                      ? "linear-gradient(135deg,rgba(22,163,74,0.11),rgba(255,255,255,0.95))"
                      : "linear-gradient(135deg,rgba(74,222,128,0.07),rgba(74,222,128,0.03))",
                    border: isLight
                      ? "1px solid rgba(21,128,61,0.24)"
                      : "1px solid rgba(74,222,128,0.14)",
                    boxShadow: isLight
                      ? "0 8px 20px rgba(15,23,42,0.06)"
                      : "0 0 16px rgba(74,222,128,0.07)",
                  }}
                >
                  <div
                    className="font-display text-lg font-black leading-none"
                    style={{
                      color: accentGreen,
                      textShadow: isLight ? "none" : "0 0 12px rgba(74,222,128,0.5)",
                    }}
                  >
                    {proj.value}
                  </div>
                  <div
                    className="mt-1.5 text-[10px] font-bold leading-snug"
                    style={{ color: textPrimary }}
                  >
                    {proj.metric}
                  </div>
                  <div className="mt-0.5 text-[9px]" style={{ color: textSubtle }}>
                    {proj.period}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Testimonials ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mb-7"
          >
            <p
              className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: textSubtle }}
            >
              {copy.testimonialsTitle}
            </p>
            <div className="space-y-3">
              {copy.testimonials.map(({ initials, name, city, color, result, rating, text }) => (
                <div
                  key={name}
                  className="rounded-2xl p-4"
                  style={{ background: cardBg, border: cardBorder }}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-black text-white"
                        style={{
                          background: isLight
                            ? `linear-gradient(135deg,${color},${color}cc)`
                            : `linear-gradient(135deg,${color}50,${color}20)`,
                          border: isLight ? `1.5px solid ${color}70` : `1.5px solid ${color}35`,
                          boxShadow: isLight
                            ? "0 6px 14px rgba(15,23,42,0.1)"
                            : `0 0 12px ${color}25`,
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-black" style={{ color: textPrimary }}>
                          {name}
                        </div>
                        <div className="text-[10px]" style={{ color: textSubtle }}>
                          {city}
                        </div>
                      </div>
                    </div>
                    <div
                      className="rounded-xl px-2.5 py-1 text-[11px] font-black"
                      style={{
                        background: isLight ? `${color}18` : `${color}15`,
                        border: isLight ? `1px solid ${color}45` : `1px solid ${color}25`,
                        color: isLight && (color as string) === "#fbbf24" ? "#a16207" : color,
                      }}
                    >
                      {result}
                    </div>
                  </div>
                  <div className="mb-2.5 flex gap-0.5">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" style={{ color: "#fbbf24" }} />
                    ))}
                  </div>
                  <p
                    className="text-[13px] font-medium italic leading-relaxed"
                    style={{ color: textMuted }}
                  >
                    "{text}"
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Guarantee ── */}
          <div
            className="rounded-2xl px-5 py-4 text-center"
            style={{
              background: isLight
                ? "linear-gradient(135deg,rgba(22,163,74,0.1),rgba(255,255,255,0.95))"
                : "linear-gradient(135deg,rgba(74,222,128,0.06),rgba(74,222,128,0.02))",
              border: isLight
                ? "1px solid rgba(21,128,61,0.22)"
                : "1px solid rgba(74,222,128,0.14)",
            }}
          >
            <div
              className="flex items-center justify-center gap-2 text-sm font-black"
              style={{ color: accentGreen }}
            >
              <Shield className="h-4 w-4" />
              {copy.guaranteeTitle}
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: textMuted }}>
              {copy.guaranteeSub}
            </p>
          </div>

          <p className="mt-5 text-center text-xs" style={{ color: textSubtle }}>
            {copy.alreadyAccount}{" "}
            <Link
              to="/"
              className="font-bold transition hover:opacity-80"
              style={{ color: accentCyan }}
            >
              {copy.loginLink}
            </Link>
          </p>

          <motion.div
            ref={footerCtaRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56, duration: 0.35 }}
            className="mt-4"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              disabled={loading}
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-4 py-3.5 text-sm font-black text-white transition disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg,#c2410c,#ea580c,#fb923c,#fdba74)",
                boxShadow: isLight
                  ? "0 16px 34px rgba(194,65,12,0.32), 0 5px 14px rgba(15,23,42,0.16)"
                  : "0 0 38px rgba(251,146,60,0.52), 0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
              />
              {loading ? (
                <Zap className="h-5 w-5 animate-pulse" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 text-center leading-tight">
                    {copy.ctaText} — {currentPrice}
                    {pr.perMonth}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </>
              )}
            </motion.button>
            <div
              className="mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 text-xs font-semibold leading-snug"
              style={{ color: isLight ? textMuted : "rgba(226,232,240,0.78)" }}
            >
              <span className="flex items-center gap-1">
                <Lock className="h-4 w-4" /> {copy.paymentSecure}
              </span>
              <span>·</span>
              <span>{copy.cancelAnytime}</span>
              <span>·</span>
              <span>{copy.days7}</span>
            </div>
          </motion.div>
        </div>
        {/* /locale key */}
      </div>

      {/* ── Sticky CTA ── */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: 96, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 96, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="paywall-sticky-shell fixed bottom-0 left-0 right-0 z-50 px-5 pt-2.5"
            style={{
              paddingBottom: "max(1.05rem, env(safe-area-inset-bottom))",
              background: !isLight
                ? "linear-gradient(to top,rgba(3,7,17,1) 64%,rgba(3,7,17,0.76) 82%,transparent)"
                : "linear-gradient(to top,rgba(238,243,248,1) 64%,rgba(238,243,248,0.82) 82%,transparent)",
            }}
          >
            <div
              className="paywall-sticky-meta mb-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 text-xs font-semibold leading-snug"
              style={{ color: isLight ? textMuted : "rgba(226,232,240,0.78)" }}
            >
              <span className="flex items-center gap-1">
                <Lock className="h-4 w-4" /> {copy.paymentSecure}
              </span>
              <span>·</span>
              <span>{copy.cancelAnytime}</span>
              <span>·</span>
              <span>{copy.days7}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              disabled={loading}
              className="paywall-sticky-button relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-4 py-3 text-sm font-black text-white transition disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg,#c2410c,#ea580c,#fb923c,#fdba74)",
                boxShadow: isLight
                  ? "0 14px 30px rgba(194,65,12,0.34), 0 4px 12px rgba(15,23,42,0.18)"
                  : "0 0 40px rgba(251,146,60,0.55), 0 0 80px rgba(251,146,60,0.2), 0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
              />
              {loading ? (
                <Zap className="h-5 w-5 animate-pulse" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 text-center leading-tight">
                    {copy.ctaText} — {currentPrice}
                    {pr.perMonth}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
