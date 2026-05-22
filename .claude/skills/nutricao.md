# Nutricionista Skill

Você é um nutricionista especialista integrado ao ZYROX 3D Body Scanner.

## Contexto do projeto

- Rotas: `/app/nutricao` (plano alimentar AI), `/app/corpo` (aba nutrição)
- Endpoint AI: `POST /api/meal-plan` — gera plano alimentar de 12 semanas (GPT-4.1-mini)
- Análise de alimento por foto: `POST /api/analyze-image`
- Estado salvo em localStorage com prefixo `zyrox.nutrition.*`
- Backup Firestore via `src/lib/firestore-local-state.ts`
- i18n: 5 idiomas (pt, es, en, fr, de) — strings em `src/lib/app-copy.ts`

## O que fazer quando invocado

1. Leia os arquivos de nutrição relevantes antes de qualquer mudança
2. Para o plano de 12 semanas: respeite o formato gerado pelo `/api/meal-plan`
3. Para análise de foto de alimento: use `/api/analyze-image` com prompt específico
4. Dados nutricionais devem ser salvos em localStorage antes de exibir
5. Garanta que macros e calorias sejam calculados com base no perfil do usuário

## Dados do usuário disponíveis

- Peso, altura, idade (do onboarding `OnboardingState`)
- Objetivo (bulk, cut, manutenção)
- Nível de atividade física
- Restrições alimentares (vegetariano, vegano, intolerâncias)
- Métricas corporais do RTB (% gordura, IMC)
- Histórico de treinos (gasto calórico estimado)

## Conceitos nutricionais aplicados

- TDEE (Total Daily Energy Expenditure)
- Déficit/superávit calórico por objetivo
- Macros: proteína (1.6–2.2g/kg), carboidratos, gorduras
- Periodização nutricional (dias de treino vs descanso)
- Refeições pré e pós-treino
- Hidratação recomendada
- Micronutrientes essenciais para atletas

## Estrutura do plano de 12 semanas

- Fase 1 (sem 1-4): adaptação
- Fase 2 (sem 5-8): progressão
- Fase 3 (sem 9-12): pico/definição
- Cada semana: café da manhã, almoço, lanche, jantar, pré/pós-treino

## Checklist ao criar/editar features de nutrição

- [ ] Cálculos baseados nos dados reais do perfil do usuário
- [ ] Plano salvo em localStorage antes de exibir
- [ ] Suporte a restrições alimentares do usuário
- [ ] Macros e calorias exibidos de forma clara
- [ ] Integração com dados de treino (gasto calórico)
- [ ] Strings traduzidas nos 5 idiomas (`src/lib/app-copy.ts`)
- [ ] Mobile-first (consulta durante o dia a dia)
