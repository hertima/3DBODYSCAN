## Objetivo

Substituir os placeholders "GIF" por um sistema de mídia de exercício profissional, e adotar elementos de UX do Befit (tabs no detalhe, player de treino com linhas SET/REPS/PESO, grid 2 colunas na biblioteca) **mantendo a identidade ZYROX** (dark + laranja + cyan, Space Grotesk).

---

## 1. Componente `<ExerciseMedia/>`

Novo arquivo `src/components/ExerciseMedia.tsx`. Centraliza toda renderização de mídia de exercício — quando os GIFs reais existirem, basta plugar a URL aqui.

**Comportamento:**
- Recebe `exerciseId`, `size` (`thumb` | `card` | `hero`) e `muscle`.
- Tenta carregar `/exercises/{id}.gif` (pasta `public/exercises/` — vazia por enquanto).
- Fallback animado quando a imagem não existe:
  - Fundo branco (variante `hero`/`card` — estilo Befit) ou superfície dark (variante `thumb`).
  - Silhueta humana SVG genérica com o **músculo-alvo destacado em laranja** (mapeamento simples: peito, costas, ombros, braços, pernas, core, full body).
  - Glow pulsante sutil + leve flutuação vertical (framer-motion).
  - Watermark "ZYROX" discreto.
- Schema do exercício ganha campo opcional `gifUrl?: string` em `src/data/library.ts` para sobrescrever o caminho padrão.

**Silhuetas:** 1 SVG base + máscara de cor por grupo muscular. Sem dependências novas.

---

## 2. Tela de detalhe `app.exercicio.$id.tsx` (estilo Befit + ZYROX)

- Hero card branco arredondado (24px) ocupando ~50% da tela com `<ExerciseMedia size="hero" />`.
- Botão voltar circular flutuante (canto sup. esq.) + botão favorito (estrela) no canto sup. dir.
- Abaixo, card escuro com:
  - Badge laranja `COSTAS` (grupo muscular).
  - Título grande Space Grotesk.
  - **Tabs ZYROX** (4): `ALVO` · `INSTRUÇÕES` · `EQUIPAMENTO` · `ANÁLISE`.
    - ALVO: silhueta com músculos primário/secundário coloridos.
    - INSTRUÇÕES: lista numerada + erros comuns.
    - EQUIPAMENTO: badge do equipamento + alternativas.
    - ANÁLISE: histórico (mock — melhor peso, último volume).

Reaproveita `Section` que já existe; só reorganiza dentro de tabs (`@/components/ui/tabs`).

---

## 3. Biblioteca `app.exercicios.tsx` (grid 2 colunas card grande)

- Trocar lista compacta por **grid 2 colunas** (mobile) / 3-4 (desktop).
- Cada card:
  - `<ExerciseMedia size="card" />` quadrado no topo (fundo branco, silhueta com músculo destacado).
  - Footer escuro com nome + chip pequeno do tipo (Musculação/Calistenia).
  - Estrela de favorito no canto.
- Filtros (chips) e busca permanecem como estão.

---

## 4. Player de treino `app.treino.$id.tsx` (linhas SET/REPS/PESO)

- Header de stats que já existe (Duração / Calorias / Volume) — manter.
- Para cada exercício:
  - Linha topo: `<ExerciseMedia size="thumb" />` 56×56 (fundo branco arredondado) + nome + `1/4 registrado · 70kg` em laranja.
  - **Tabela de séries** estilo Befit:
    - Cabeçalho cinza pequeno: `SET` · `REPS` · `PESO (KG)`.
    - Cada linha: número da série, input de reps, input de peso, **bolinha de check** (cinza → laranja preenchido quando registrado).
    - Linha registrada ganha fundo levemente laranja translúcido.
  - `+ ADICIONAR SÉRIE` no rodapé do bloco.
- Timer de descanso flutuante já existe — manter, ajustar visual para combinar (pílula com botões −15 / +15 / PULAR).

---

## 5. Detalhes técnicos

- **Sem novas dependências.** Tudo com Tailwind + framer-motion + lucide já instalados.
- Pasta `public/exercises/` criada vazia com um README explicando convenção `{id}.gif`.
- Tokens existentes (`--primary`, `--cyan`, `--surface`, `--gradient-ai`) reutilizados; não inventar cores.
- Acessibilidade: `<ExerciseMedia/>` recebe `alt` derivado do nome do exercício.

---

## Arquivos tocados

- **novo** `src/components/ExerciseMedia.tsx`
- **novo** `src/components/MuscleSilhouette.tsx` (SVG reutilizável)
- **novo** `public/exercises/README.md`
- **edit** `src/data/library.ts` (+ campo `gifUrl?` opcional, + `muscleSecondary?`)
- **edit** `src/routes/app.exercicio.$id.tsx` (tabs + hero)
- **edit** `src/routes/app.exercicios.tsx` (grid de cards)
- **edit** `src/routes/app.treino.$id.tsx` (tabela de séries + thumb)

---

## Fora de escopo (próximos passos opcionais)

- Subir lote real de GIFs (basta dropar em `public/exercises/`).
- Ativar Lovable Cloud Storage para gestão dinâmica.
- Animação 3D real / Lottie por exercício.