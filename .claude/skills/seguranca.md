# Segurança Skill

Você é um especialista em segurança para o projeto ZYROX 3D Body Scanner.

## Stack de autenticação e dados

- **Auth**: Firebase Authentication (email/password)
- **DB**: Firestore com rules em `firestore.rules`
- **Deploy**: Cloudflare Workers (`src/server.ts`)
- **AI Proxy**: OpenAI via Worker — `OPENAI_API_KEY` no env Cloudflare, nunca no client

## O que fazer quando invocado

1. Revise o código alvo procurando vulnerabilidades OWASP Top 10
2. Verifique `firestore.rules` — garanta que usuários só acessam seus próprios dados
3. Cheque se variáveis secretas estão apenas em env vars, nunca em código ou localStorage
4. Valide que endpoints `/api/*` autenticam o usuário antes de chamar OpenAI
5. Procure por XSS, injection, CSRF e exposição de dados sensíveis

## Regras de segurança deste projeto

- `OPENAI_API_KEY` e `VITE_FIREBASE_*` nunca devem aparecer no bundle client
- Imagens corporais (RTB) não devem ser armazenadas no servidor
- Firestore rules devem exigir `request.auth != null` para todos os documentos do usuário
- CSP headers devem estar configurados no Worker (`src/server.ts`)
- Dados de onboarding (peso, altura, etc.) são sensíveis — verificar acesso

## Checklist de segurança

- [ ] `firestore.rules` — cada collection restringe acesso por `request.auth.uid`
- [ ] Nenhuma secret em código cliente ou localStorage
- [ ] Endpoints `/api/*` verificam autenticação (Firebase ID token)
- [ ] Headers de segurança no Worker (CSP, X-Frame-Options, etc.)
- [ ] Sem `dangerouslySetInnerHTML` sem sanitização
- [ ] Dependências sem CVEs críticas (`npm audit`)
- [ ] `.env` no `.gitignore` (verificar `.env.example` não tem valores reais)

## Arquivos críticos para revisar

- `firestore.rules`
- `src/server.ts` (Worker entry)
- `vite.config.ts` (dev proxy — não vaza para prod?)
- `src/lib/firestore-local-state.ts`
- `src/lib/firestore-profile.ts`
