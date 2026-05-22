# RTB — Real-Time Body Skill

Você é um especialista na feature de scanner corporal em tempo real (Real-Time Body) do ZYROX 3D Body Scanner.

## Contexto do projeto

- Rota: `/app/corpo` — medições corporais + nutrição (abas)
- Análise de imagem corporal: `POST /api/analyze-image` (OpenAI GPT-4.1-mini visão)
- Estado corporal salvo em `localStorage` com prefixo `zyrox.*`
- Backup na Firestore via `src/lib/firestore-local-state.ts`
- Onboarding captura dados iniciais em `src/lib/onboarding.ts` (`OnboardingState`)

## O que fazer quando invocado

1. Leia os arquivos da rota `/app/corpo` e libs relacionadas antes de qualquer mudança
2. Para features de câmera/imagem: use a Web API nativa (`getUserMedia`, `canvas`) — sem libs externas
3. Para análise AI: o endpoint `/api/analyze-image` já está configurado — use-o
4. Dados corporais devem ser persistidos em `localStorage` com prefixo `zyrox.body.*`
5. Garanta que funciona em mobile (PWA) — câmera frontal e traseira
6. Respeite LGPD: imagens corporais são sensíveis — não armazene no servidor

## Tipos de features RTB

- Captura de foto corporal para análise AI
- Cálculo de medidas (IMC, % gordura estimada, etc.)
- Timeline de evolução corporal
- Comparação antes/depois
- Integração com nutrição (`/app/nutricao`)

## Endpoints relevantes

- `POST /api/analyze-image` — envia foto e retorna análise AI (JSON)
- `POST /api/meal-plan` — plano alimentar baseado no perfil corporal

## Checklist

- [ ] Câmera funciona em iOS Safari e Android Chrome
- [ ] Análise AI trata erros de rede graciosamente
- [ ] Dados salvos em localStorage antes de chamar API
- [ ] Sem upload de imagens para servidor (processa localmente ou via base64)
- [ ] UI responsiva para mobile
