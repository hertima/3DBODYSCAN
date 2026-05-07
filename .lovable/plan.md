
# ZYROX — Web App (Onboarding + Dashboard)

Vou construir a versão web do ZYROX seguindo o PRD: identidade dark premium athletic, onboarding inteligente em 9 telas e dashboard com analytics, treinos e biblioteca. Tudo em **português (BR)**, **somente frontend** (dados mockados, estado em localStorage), pronto para receber backend depois.

## Identidade visual

Aplicar paleta oficial em `src/styles.css` como tokens semânticos (oklch):
- Background `#070B14`, Surface `#0F172A`, Elevated `#131D31`
- Primary Orange `#FF8A1F` + Soft `#FFB86B` (gradiente do botão principal)
- Cyan `#38BDF8`, Accent Blue `#3B82F6`
- Texts: `#F8FAFC` / `#94A3B8` / `#64748B`
- Success `#4ADE80`, Error `#F43F5E`

Tokens extras: `--gradient-primary`, `--gradient-ai` (cyan→blue), `--shadow-elevated`, `--glow-primary`, `--glow-cyan`. Border-radius 20–24px. Tipografia: **Space Grotesk** (headlines) + **Inter** (body/label) via Google Fonts.

Logo enviado copiado para `src/assets/zyrox-logo.png` e usado em header, splash e favicon (`public/`).

## Estrutura de rotas (TanStack Start)

```
src/routes/
  __root.tsx              metadata global, fontes, dark theme
  index.tsx               splash/landing → CTA "Começar"
  onboarding.tsx          layout (header ZYROX + Skip + progress + Outlet)
  onboarding.index.tsx    redirect → step 1
  onboarding.$step.tsx    renderiza tela 1..9 dinamicamente
  app.tsx                 layout autenticado (sidebar + bottom nav mobile)
  app.index.tsx           Dashboard (home)
  app.treinos.tsx         Lista de treinos + treino do dia
  app.treino.$id.tsx      Execução de treino (registro de série em 2 toques)
  app.exercicios.tsx      Biblioteca de exercícios (busca + filtros)
  app.exercicio.$id.tsx   Detalhe (GIF, instruções, erros, substituições)
  app.analytics.tsx       Volume, PRs, recovery, heatmap, radar
  app.social.tsx          Feed + ranking + desafios (mock)
  app.perfil.tsx          Perfil + gamificação (XP, streak, conquistas)
```

Cada rota com `head()` próprio (title/description/og em PT-BR).

## Onboarding (9 telas, cinematográfico)

Layout fixo: voltar ←, wordmark **ZYROX**, "Pular", barra de progresso laranja animada, footer com "Anterior" + botão **Continuar** com gradiente.

1. Objetivo fitness (Ganho de Massa, Força Funcional, Performance Híbrida, Evolução Atlética)
2. Consistência (Ocasional / Regular / Atleta de Elite) + AI Insight card
3. Experiência (Iniciante / Intermediário / Avançado)
4. Local de treino (Academia / Casa / Híbrido / Outdoor)
5. Equipamentos (multi-select com chips)
6. Dias disponíveis na semana (S T Q Q S S D)
7. Tempo por treino (slider 30–120 min)
8. Resultado desejado (timeline visual)
9. **Tela de IA** — "Analisando padrão...", "Calculando recuperação...", "Adaptando progressão...", "Criando plano ideal..." com glow cyan, partículas suaves, barras animadas → ao concluir, salva perfil em localStorage e redireciona para `/app`.

Estado persistido em `localStorage` (`zyrox.onboarding`). Animações com Framer Motion (já no stack shadcn) — spring nos selects, shimmer no loading IA, fade/slide entre steps.

Componentes: `OnboardingShell`, `ProgressBar`, `OptionCard` (ícone + título + subtítulo + radio com glow laranja quando ativo, igual aos mockups), `AIInsightCard` (borda cyan), `PrimaryButton` (gradiente + glow).

## Dashboard `/app`

- **Header**: saudação, streak 🔥, XP/nível, avatar
- **Card "Treino de hoje"** (gradiente sutil, CTA Iniciar)
- **Stats grid**: Volume semanal, Frequência, PRs, Recovery Score (com mini-charts)
- **AI Recommendations**: 2–3 cards (deload sugerido, troca de exercício, etc.)
- **Atividade recente** + músculos treinados (heatmap corporal SVG simples)

## Treinos

- Lista de treinos da semana (mock 6 treinos: Push, Pull, Legs, Upper, Lower, Full Calistenia)
- **Execução**: cada exercício com GIF placeholder, séries em cards; tap no peso/reps abre numpad mobile; "✓" registra a série (2 toques). Timer de descanso flutuante. Suporta superset/dropset/rest-pause como tags.

## Biblioteca de exercícios

~40 exercícios mockados cobrindo musculação + calistenia, com nome, grupo muscular, equipamento, biomecânica, instruções, erros comuns, substituições, GIF (placeholder animado). Busca + filtros por grupo/equipamento/tipo. Lista virtualizada.

## Analytics

Recharts (já compatível): linha de volume, radar muscular, barras de frequência semanal, anel de recovery, lista de PRs recentes, heatmap de consistência (estilo GitHub).

## Social, Perfil, Gamificação

Versões mock leves (feed com 5 posts, ranking top 10, 3 desafios ativos, lista de conquistas com XP/streak/níveis) — suficiente para mostrar a percepção premium sem backend.

## Sistema de design / componentes-base

- Reaproveitar shadcn (Button com variant `premium` gradiente + `ghost-glow`), Card, Tabs, Progress, Badge, Sheet, Drawer
- `Glow` wrapper, `GradientText`, `StatCard`, `ChartCard`
- Tudo via tokens semânticos — zero cores hardcoded em componentes

## Fora de escopo (esta entrega)

- Auth real, banco, IA real, Apple Watch, push, pagamentos premium
- Backend (Lovable Cloud) — adicionar quando você pedir
- Mobile nativo (React Native) — aqui é web responsiva (mobile-first, layout cinematográfico em desktop)

## Detalhes técnicos

- Framer Motion para transições (spring, shared layout, shimmer)
- Mock data em `src/data/*.ts` (exercises, workouts, feed, achievements)
- Hook `useOnboarding()` + `useUserProfile()` lendo localStorage
- Rota `/app/*` checa se onboarding foi concluído; se não, redireciona para `/onboarding/1`
- Favicon e meta og:image usando o logo ZYROX

Resultado: experiência web completa, fluida e premium do ZYROX, mobile-first, pronta para evoluir com Lovable Cloud + IA quando você quiser.
