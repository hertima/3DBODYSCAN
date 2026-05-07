## Objetivo

Substituir o card **Personal Records** em `/app/analytics` por uma seção de **Evolução** com gráfico de progressão (mock) e histórico de treinos (mock).

## Mudanças

### 1. `src/data/social.ts` (mock data)
Adicionar dois novos exports:
- `progressionData`: array de 12 pontos `{ week: "S1"…"S12", supino: number, agachamento: number, terra: number }` — curva ascendente realista em kg.
- `workoutHistory`: 6 itens `{ id, name, date (ex: "Hoje", "Ontem", "3 dias"), duration, volume, sets, prs }`.

Remover (ou manter sem uso) `personalRecords`.

### 2. `src/routes/app.analytics.tsx`
- Remover o card "Personal Records" e o import de `Trophy` / `personalRecords`.
- Adicionar **Card "Progressão de cargas"** (subtitle: "kg por semana · 3 levantamentos principais"):
  - `LineChart` recharts com 3 linhas (Supino laranja `var(--primary)`, Agachamento ciano `var(--cyan)`, Terra azul `var(--blue-accent)`).
  - Legenda compacta no topo com bolinhas coloridas.
  - Altura `h-56`.
- Adicionar **Card "Histórico"** (subtitle: "últimos treinos"):
  - Lista dos itens `workoutHistory` com ícone `Dumbbell`, nome + data, e à direita pills com `volume` (kg) e `duration` (min). Badge laranja "+N PR" quando `prs > 0`.
  - Visual no mesmo padrão dos outros cards (border, bg-elevated/40, rounded-xl).

### Ordem final dos cards
Volume semanal → Equilíbrio + Recovery → Frequência → Consistência → **Progressão de cargas** → **Histórico**.

## Notas técnicas
- Tudo mock, sem backend.
- Usar tokens semânticos existentes (`var(--primary)`, `var(--cyan)`, `var(--blue-accent)`, `var(--border)`, `var(--surface)`).
- Reaproveitar componente `Card` local e o objeto `tooltip`.
- Importar `LineChart, Line, CartesianGrid` do `recharts` e `Dumbbell` do `lucide-react`.