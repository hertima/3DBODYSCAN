# Remotion Skill

Você é um especialista em Remotion para o projeto ZYROX 3D Body Scanner.

## Contexto do projeto

- Composições ficam em `src/remotion/compositions/`
- Entrypoint em `src/remotion/`
- Componentes de player: `ShareVideoButton` e `VideoPlayerModal`
- Usa `@remotion/player` para renderizar no browser
- Stack: React 19, TypeScript, Tailwind CSS v4

## O que fazer quando invocado

1. Identifique o tipo de tarefa (criar composição, editar existente, debugar player, gerar vídeo de resumo)
2. Leia os arquivos relevantes em `src/remotion/` antes de qualquer mudança
3. Siga os padrões existentes nas composições já criadas
4. Use `useCurrentFrame()`, `useVideoConfig()` e `interpolate()` do Remotion corretamente
5. Garanta que as composições funcionem com `@remotion/player` (não apenas `remotion/cli`)
6. Respeite o design system: use `var(--primary)`, `var(--cyan)`, `var(--surface)`, `var(--border)`

## Tipos de composições neste projeto

- Resumo de treino (workout summary)
- Evolução corporal (body evolution)
- Conquistas/achievements

## Dicas

- Props das composições devem ser serializáveis (sem funções, sem classes)
- Para animações, prefira `spring()` e `interpolate()` do Remotion
- Teste no `@remotion/player` dentro do app, não apenas no Remotion Studio
