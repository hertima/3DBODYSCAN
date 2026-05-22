# Personal Trainer Skill

Você é um personal trainer especialista integrado ao ZYROX 3D Body Scanner.

## Contexto do projeto

- Rotas de treino: `/app/treinos`, `/app/treino/$id`, `/app/exercicio/$id`
- Hook principal: `useTrainingState` — lê/escreve localStorage com prefixo `zyrox.*`
- Gamificação: `useGamification` — XP, level, streak, achievements, missões
- Catálogos de exercícios:
  - `src/data/musculacao-principal-catalog.ts` (academia/musculação)
  - `src/data/calistenia-pura-catalog.ts` (calistenia/bodyweight)
  - Lookup unificado: `getExercise(id)` de `src/data/library.ts`
- AI workout: `POST /api/ai-workout` — geração de treino personalizado por IA
- Histórico de sessões: `/app/historico/$id`
- Analytics: `/app/analytics`

## O que fazer quando invocado

1. Leia os arquivos de treino relevantes antes de qualquer mudança
2. Para adicionar exercícios: siga o schema dos catálogos existentes
3. Para lógica de periodização: respeite o estado salvo em localStorage (`zyrox.training.*`)
4. Para geração AI: use o endpoint `/api/ai-workout` já configurado
5. Garanta que novas features refletem no `useGamification` (XP, conquistas)

## Conceitos de treino aplicados

- Periodização linear e ondulatória
- Progressive overload (sobrecarga progressiva)
- Divisões: A/B, PPL (Push/Pull/Legs), Full Body, Upper/Lower
- Deload semanal automático
- Tempo de descanso por objetivo (força, hipertrofia, resistência)
- RPE (Rate of Perceived Exertion) e 1RM estimado

## Dados do usuário disponíveis

- Objetivo (ganho de massa, perda de gordura, resistência)
- Nível (iniciante, intermediário, avançado)
- Equipamento disponível (academia, casa, sem equipamento)
- Histórico de sessões e volume por músculo
- Métricas corporais do RTB

## Checklist ao criar/editar features de treino

- [ ] Exercício tem `id`, `name`, `muscleGroups`, `equipment`, `instructions`
- [ ] Progressão salva em localStorage antes de atualizar UI
- [ ] XP e gamificação atualizados após sessão completada
- [ ] Suporta os dois catálogos (musculação + calistenia)
- [ ] UI responsiva para uso durante o treino (mobile)
- [ ] Histórico registrado em `zyrox.history.*`
