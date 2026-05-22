## Objetivo
Remover a aba **Social** e substituir por **Corpo** — uma única tela com Medições corporais (silhueta + cards) e Nutrição (dashboard diário + sugestões de IA). Tudo mock, sem backend.

## Mudanças

### 1. Remover Social
- Deletar `src/routes/app.social.tsx`.
- Em `src/routes/app.tsx` (bottom nav): trocar o item `{ to: "/app/social", label: "Social", icon: Users }` por `{ to: "/app/corpo", label: "Corpo", icon: HeartPulse }`.
- Em `src/data/social.ts`: manter apenas o que `app.analytics.tsx` usa (`volumeTrend`, `muscleRadar`, `consistencyHeatmap`, `progressionData`, `workoutHistory`, tipos de history e `getHistoryEntry`). Remover `feed`, `ranking`, `challenges`, `achievements`, `personalRecords` e tipo `FeedPost`.

### 2. Nova rota `src/routes/app.corpo.tsx`
Layout em tabs internas: **Medições** | **Nutrição** (estado local com `useState`).

Cabeçalho da página:
- H1 "Corpo"
- Sub: "Medições corporais precisas e monitoramento nutricional com inteligência artificial, tudo em um só lugar."

#### Tab Medições
1. **Card "Silhueta corporal"** — usa `MuscleSilhouette` com `muscle="Full Body"` à esquerda + 6 hotspots/labels à direita (Peito, Cintura, Quadril, Braço, Coxa, Panturrilha) com valores em cm, estilo image-28. Layout em 2 colunas no mobile (silhueta `w-1/2`, labels `w-1/2`, fontes pequenas).
2. **AIInsightCard** — "IA detectou +1.2cm no peito e -0.8cm na cintura nas últimas 4 semanas. Recomposição em andamento."
3. **Grid de cards** (2 col) com cada medida — nome, valor atual, delta semanal (↑/↓ + cm) e mini sparkline (simples, SVG inline ou divs com altura).

Mock data novo em `src/data/body.ts`:
```ts
export type BodyMeasure = { key, label, value, unit, delta, history: number[] };
export const bodyMeasures: BodyMeasure[] = [ peito 102, cintura 78, quadril 96, braço 36, coxa 58, panturrilha 39 ];
```

#### Tab Nutrição
1. **Card "Resumo de hoje"** estilo image-30:
   - Anel grande de calorias (1.100 restantes / 2.400 meta) — usa `RadialBarChart` recharts.
   - 3 barras de macros: Proteína 80/200g (laranja), Gordura 88/136g (amarelo/cyan), Carbo 20/40g (roxo/blue-accent).
2. **Lista de refeições** (Café, Almoço, Jantar, Lanche): nome, kcal consumido, botão "+" (visual, sem ação).
3. **AIInsightCard** — "Você está abaixo da meta de proteína em 60%. Sugestão: adicione 150g de frango grelhado no jantar (+45g proteína)."
4. **Card "Sugestões da IA"** (3 itens com ícone Sparkles): hidratação, timing pré-treino, déficit calórico semanal.

Mock data em `src/data/nutrition.ts`:
```ts
export const nutritionToday = { kcal: { eaten: 1300, goal: 2400 }, macros: { protein: {...}, fat: {...}, carbs: {...} }, meals: [...] };
export const aiNutritionTips = [ {icon, title, desc}, ... ];
```

### 3. Atualizar imports
- `src/routes/app.tsx`: remover ícone `Users`, importar `HeartPulse` de `lucide-react`.
- `src/routeTree.gen.ts`: regenerado pelo plugin (não editar manualmente).

## Notas técnicas
- Tudo mock, zero backend.
- Reuso: `MuscleSilhouette`, `AIInsightCard`, tokens semânticos (`var(--primary)`, `var(--cyan)`, `var(--blue-accent)`).
- Mobile-first (390px) — tabs com `flex` + underline ativo laranja, cards `rounded-2xl border border-border bg-surface p-4`.
- Charts via `recharts` (já instalado).
