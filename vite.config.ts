// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Carrega variáveis do .env manualmente (Vite só expõe VITE_* por padrão)
const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !(key in process.env)) process.env[key] = val;
  }
}
// Necessário no Windows com proxies corporativos que interceptam TLS.
// Remova se não estiver atrás de um proxy corporativo.
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const LANG: Record<string, string> = {
  pt: "português brasileiro", es: "español", en: "English", fr: "français", de: "Deutsch",
};

function buildCoachPrompt(userContext: string, lang: string, athleteMemory?: string) {
  return `You are ZYROX 3D Body Scanner AI Coach — an elite personal trainer and sports nutritionist.
${userContext}${athleteMemory ? "\n" + athleteMemory : ""}
CRITICAL RULE: Always respond in ${lang}. Never switch languages.
Be direct, technical, and motivating. Keep responses concise: 2–4 short paragraphs.
Personalize every response. Never invent data not in the profile.
Expert areas: hypertrophy, fat loss, periodization, nutrition, recovery, calisthenics.`;
}

function devApiPlugin(): Plugin {
  return {
    name: "zyrox-dev-api",
    enforce: "pre",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url ?? "";
        if (req.method !== "POST" || !url.startsWith("/api/")) return next();
        if (url === "/api/meal-plan") return next();

        const chunks: Buffer[] = [];
        await new Promise<void>((resolve, reject) => {
          req.on("data", (c: Buffer) => chunks.push(Buffer.from(c)));
          req.on("end", resolve);
          req.on("error", reject);
        });

        let body: Record<string, unknown> = {};
        try { body = JSON.parse(Buffer.concat(chunks).toString() || "{}"); } catch { /* empty body */ }

        const apiKey = process.env.OPENAI_API_KEY ?? "";
        if (!apiKey) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("OPENAI_API_KEY not configured");
          return;
        }

        try {
          // ── /api/chat-stream ──────────────────────────────────────────
          if (url === "/api/chat-stream") {
            const { messages, userContext, locale, athleteMemory } = body as {
              messages: Array<{ role: string; content: string }>;
              userContext: string;
              locale: string;
              athleteMemory?: string;
            };
            const lang = LANG[locale] ?? LANG.pt;

            const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                model: "gpt-4.1-mini",
                messages: [{ role: "system", content: buildCoachPrompt(userContext, lang, athleteMemory) }, ...messages],
                max_tokens: 500,
                temperature: 0.75,
                stream: true,
              }),
            });

            res.writeHead(upstream.status, {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              "X-Accel-Buffering": "no",
            });

            if (upstream.body) {
              const reader = upstream.body.getReader();
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(value);
              }
            }
            res.end();
            return;
          }

          // ── /api/ai-workout ───────────────────────────────────────────
          if (url === "/api/ai-workout") {
            const { profile, workoutCandidates, locale, athleteMemory } = body as {
              profile: Record<string, unknown>;
              workoutCandidates: unknown[];
              locale: string;
              athleteMemory?: string;
            };
            const lang = LANG[locale] ?? LANG.pt;

            const GOAL: Record<string, string> = {
              ganho_massa: "Hipertrofia — ganho de massa muscular máximo",
              perda_peso: "Perda de peso e gordura corporal",
              definicao: "Definição muscular — manter massa, perder gordura",
              forca: "Força máxima — força absoluta e potência",
              performance: "Performance atlética — velocidade, agilidade e potência",
              saude: "Saúde e bem-estar — qualidade de vida e longevidade",
            };
            const CAT: Record<string, string> = {
              peitoral: "Peitoral", costas_trapezio: "Costas/Trapézio", deltoides: "Deltóides",
              biceps_antebraco: "Bíceps", triceps: "Tríceps", abdomen_core: "Abdômen/Core",
              membros_inferiores_gluteos: "Pernas/Glúteos", panturrilha: "Panturrilha",
            };

            const MODALITY_GUIDE: Record<string, string> = {
              academia: "Academia completa — use barras, halteres, máquinas e cabos livremente. Priorize compostos com barra/halter antes de máquinas.",
              calistenia: "Calistenia pura — APENAS peso corporal, barra fixa e paralelas. PROIBIDO selecionar exercícios com halteres ou máquinas. Use progressões de nível: iniciante=flexão/agachamento/remada; intermediário=mergulho/barra/pistol; avançado=archer/muscle-up/L-sit.",
              hibrido: "Treino híbrido — combine peso corporal (barra, paralelas) com equipamentos livres (halteres, barra). Evite máquinas isoladoras.",
            };

            const PHASE_GUIDE: Record<string, Record<string, string>> = {
              academia: {
                base: "FASE BASE: técnica impecável, cargas 60-70% 1RM, aprender os padrões. 3×10-12 em compostos, descanso 90s.",
                progressao: "FASE PROGRESSÃO: sobrecarga progressiva (+2.5-5kg/semana), 3-4×8-10, aumentar intensidade gradual. Descanso 75-90s.",
                intensificacao: "FASE INTENSIFICAÇÃO: cargas pesadas (75-85% 1RM), 4-5×4-8 nos compostos. Técnicas avançadas permitidas (drop-set, rest-pause). Descanso 120-180s.",
                deload: "FASE DELOAD: recuperação ativa. Reduzir 50% do volume. Cargas leves 50-60% 1RM. Foco em técnica e mobilidade. 2×12-15.",
              },
              calistenia: {
                base: "FASE BASE: dominar progressões básicas (flexão, agachamento livre, remada). Foco em alinhamento e controle. 3×8-12 reps lentas.",
                progressao: "FASE PROGRESSÃO: progressões intermediárias (flexão inclinada→declinada, barra assistida→completa). Aumentar reps por semana. 3-4×8-10.",
                intensificacao: "FASE INTENSIFICAÇÃO: progressões avançadas (archer push-up, one-leg squat, muscle-up). Força máxima. 4-5×4-6 controlados.",
                deload: "FASE DELOAD: mobilidade, alongamento ativo, progressões muito fáceis. Volume -50%. Recuperar sistema nervoso.",
              },
              hibrido: {
                base: "FASE BASE: fundação mista — compostos livres (agachamento, remada com halter) + corporais básicos. Técnica antes de carga. 3×10-12.",
                progressao: "FASE PROGRESSÃO: progressão dupla — mais carga nos pesos E mais reps no corporal. 3-4×8-10 em ambos.",
                intensificacao: "FASE INTENSIFICAÇÃO: força nos compostos (halteres pesados, barra) + skills avançados de calistenia. 4-5×5-8.",
                deload: "FASE DELOAD: volume -50%, mobilidade, exercícios corporais leves, sem carga pesada.",
              },
            };

            const goalDesc = GOAL[profile.goal as string] ?? String(profile.goal);
            const modality = (profile.modality as string) ?? "academia";
            const currentWeek = (profile.currentWeek as number) ?? 1;
            const currentPhase = (profile.currentPhase as string) ?? "base";
            const phaseEmphasis = (profile.phaseEmphasis as string) ?? "";
            const volumeBias = (profile.volumeBias as string) ?? "moderado";
            const intensityBias = (profile.intensityBias as string) ?? "moderada";
            const equipment = Array.isArray(profile.equipment) ? (profile.equipment as string[]) : [];
            const consistency = (profile.consistency as string) ?? "regular";
            const splitBias = (profile.splitBias as string) ?? "";

            const levelText = profile.level === "iniciante"
              ? "Iniciante (primeiro ano de treino — técnica e neuroadaptação são prioridade absoluta)"
              : profile.level === "intermediario"
                ? "Intermediário (1-3 anos — base sólida, busca progressão de carga e volume)"
                : "Avançado (3+ anos — periodização complexa, alto volume e intensidade tolerados)";

            const goalSetsReps = profile.goal === "ganho_massa"
              ? { sets: "3-4", reps: "8-12", rest: "60-90s", technique: "controle excêntrico 3s, pausa no pico, progressão de carga semanal" }
              : profile.goal === "forca"
                ? { sets: "4-5", reps: "3-6", rest: "120-180s", technique: "máxima tensão muscular, velocidade de subida explosiva, recuperação completa" }
                : (profile.goal === "perda_peso" || profile.goal === "definicao")
                  ? { sets: "3-4", reps: "12-20", rest: "30-60s", technique: "pouco descanso, supersets permitidos, ritmo elevado" }
                  : profile.goal === "performance"
                    ? { sets: "4", reps: "6-10", rest: "90s", technique: "potência e velocidade na fase concêntrica" }
                    : { sets: "3", reps: "12-15", rest: "60s", technique: "execução controlada, sem excessos" };

            const phaseAdjust = currentPhase === "deload"
              ? `ATENÇÃO DELOAD: Volume reduzido a 50%, cargas leves. Sets: 2. Reps: ${goalSetsReps.reps} (leve). Rest: 90s.`
              : currentPhase === "intensificacao"
                ? `ATENÇÃO INTENSIFICAÇÃO: Menos exercícios isoladores, mais compostos pesados. Sets: ${parseInt(goalSetsReps.sets) + 1 <= 5 ? parseInt(goalSetsReps.sets) + 1 : 5}. Reps: reduzir 2-3 do padrão. Descanso: maior.`
                : currentPhase === "base"
                  ? `ATENÇÃO BASE: Técnica perfeita acima de tudo. Cargas conservadoras. Sets: ${goalSetsReps.sets}. Reps: ${goalSetsReps.reps}.`
                  : `PROGRESSÃO ATIVA: Aumente cargas em relação à semana anterior. Sets: ${goalSetsReps.sets}. Reps: ${goalSetsReps.reps}.`;

            const levelSetsAdjust = profile.level === "iniciante"
              ? "INICIANTE: Máximo 3 séries por exercício. Nunca falhe em técnica. Prefira variações com apoio ou assistência."
              : profile.level === "avancado"
                ? "AVANÇADO: Pode usar 5 séries nos compostos. Técnicas intensas permitidas (rest-pause, drop-set, giant-set)."
                : "INTERMEDIÁRIO: 3-4 séries. Aumente carga quando completar todas as reps com boa técnica.";

            const advancedTechniques = (() => {
              const byGoal = profile.goal === "ganho_massa"
                ? "PIRÂMIDE ASCENDENTE nos compostos: série 1 mais leve (12 reps) → série 2 moderada (10 reps) → série 3 pesada (8 reps). Aumenta o recrutamento muscular progressivamente."
                : profile.goal === "forca"
                  ? "PIRÂMIDE REVERSA: série 1 mais pesada (4-5 reps, carga máxima) → série 2 moderada (6 reps) → série 3 leve (8 reps). Ataca a força máxima com o sistema nervoso fresco."
                  : (profile.goal === "perda_peso" || profile.goal === "definicao")
                    ? "SUPERSETS ANTAGONISTAS: peitoral + costas, bíceps + tríceps (sem descanso entre eles). DROP-SET no último isolador de cada grupo: falhe, tire 20% da carga, continue."
                    : profile.goal === "performance"
                      ? "CLUSTER SETS nos compostos: 2 reps, 15s pausa, 2 reps, 15s pausa, 2 reps (total 6 reps por série). Mantém potência máxima."
                      : "SÉRIES RETAS com controle de execução. Foco em qualidade do movimento.";

              const byLevel = profile.level === "iniciante"
                ? "\nNível INICIANTE: apenas séries retas. Nenhuma técnica especial — domine o movimento primeiro."
                : profile.level === "avancado"
                  ? `\nNível AVANÇADO — técnicas obrigatórias:
- PIRÂMIDE (ascendente ou reversa) nos 2 primeiros compostos de cada treino
- REST-PAUSE: no 3º exercício, após a falha, descanse 15s e faça mais 3-4 reps
- DROP-SET: no último isolador, reduza 20-30% da carga após a falha e continue
- SUPERSET ANTAGONISTA: agrupe exercícios opostos para economizar tempo e aumentar densidade
- GIANT-SET para grupos menores (tríceps, bíceps, panturrilha): 3 exercícios sem pausa`
                  : "\nNível INTERMEDIÁRIO: use pirâmide ascendente nos compostos. Drop-set facultativo no último isolador.";

              return byGoal + byLevel;
            })();

            const sex = profile.sex as string;
            const sexGuidance = sex === "feminino"
              ? `ATLETA FEMININA — programação específica:
- INFERIORES SÃO PRIORIDADE: glúteos, isquiotibiais e quadríceps em TODOS os treinos de perna
- Cadência de inferiores: um treino foco em quadríceps (agachamento, leg press), outro em glúteos/isquiotibiais (stiff, elevação, abdutor)
- Upper body para simetria: costas largas + ombros mediais afinam visualmente a cintura
- Panturrilha e adutora: incluir 2x/semana para base e funcionalidade
- Core: priorizando anti-rotação e estabilização (prancha > crunch)`
              : sex === "masculino"
                ? `ATLETA MASCULINO — programação específica:
- COMPOSTOS SÃO BASE: supino, agachamento, levantamento terra, remada, desenvolvimento devem aparecer em quase todo treino
- V-TAPER: costas (largura via puxada) + ombros mediais + peito superior = amplitude visual
- Pernas: NUNCA negligencie — agachamento/leg press + stiff/cadeira flexora + panturrilha
- Braços: bíceps e tríceps são finalizadores, não protagonistas
- Core: embutir nos compostos + 2 isolados ao final`
                : "";

            const modalityGuide = MODALITY_GUIDE[modality] ?? MODALITY_GUIDE.academia;
            const phaseGuide = (PHASE_GUIDE[modality] ?? PHASE_GUIDE.academia)[currentPhase] ?? "";

            const candidates = workoutCandidates as Array<{
              workoutId: string; workoutName: string; workoutFocus: string;
              exercises: Array<{ id: string; name: string; category: string; equipment: string }>;
            }>;

            const workoutBlocks = candidates.map((w, i) => {
              const lines = w.exercises.map(e => `  - ${e.id} | "${e.name}" | ${CAT[e.category] ?? e.category} | ${e.equipment}`).join("\n");
              return `### Treino ${i + 1}: ${w.workoutName}
Foco: ${w.workoutFocus.split(",").map((c: string) => CAT[c.trim()] ?? c).join(" + ")}
ID: ${w.workoutId}
Exercícios disponíveis — escolha EXATAMENTE 8:
${lines}`;
            }).join("\n\n");

            const prompt = `${athleteMemory ? athleteMemory + "\n\n" : ""}══ PERFIL DO ATLETA ══
Nome: ${profile.name ?? "Atleta"}
Objetivo: ${goalDesc}
Nível: ${levelText}
Sexo: ${sex === "feminino" ? "Feminino" : sex === "masculino" ? "Masculino" : "Não informado"}
Consistência: ${consistency}
Local: ${profile.location} | Modalidade: ${modality.toUpperCase()}
Equipamentos disponíveis: ${equipment.length > 0 ? equipment.join(", ") : "padrão da modalidade"}
Dias/semana: ${profile.availableDays} | Duração: ${profile.workoutDurationMin} min/sessão

══ PERIODIZAÇÃO ══
Semana ${currentWeek}/12 — Fase: ${currentPhase.toUpperCase()}
Ênfase desta semana: ${phaseEmphasis || "treino padrão"}
Volume: ${volumeBias} | Intensidade: ${intensityBias}
Orientação da fase+modalidade: ${phaseGuide}
Split recomendado: ${splitBias || "conforme objetivo"}

══ MODALIDADE ══
${modalityGuide}

══ SEXO ══
${sexGuidance || "Sem diretrizes específicas de sexo"}

══ VOLUME E INTENSIDADE BASE ══
Séries: ${goalSetsReps.sets} | Reps: ${goalSetsReps.reps} | Descanso: ${goalSetsReps.rest}
Técnica base: ${goalSetsReps.technique}
${phaseAdjust}
${levelSetsAdjust}

══ MÉTODOS DE TREINO OBRIGATÓRIOS ══
${advancedTechniques}
IMPORTANTE: Descreva o método utilizado no "aiNote" de cada exercício (ex: "Pirâmide ascendente: 12→10→8 reps com aumento de carga"). Máx 15 palavras em ${lang}.

══ EXERCÍCIOS DISPONÍVEIS ══
${workoutBlocks}

══ REGRAS ABSOLUTAS ══
1. Selecione EXATAMENTE 8 exercícios por treino — nem mais, nem menos
2. Use SOMENTE os IDs listados acima — NUNCA invente IDs
3. Compostos primeiro (multi-articulares), isoladores depois
4. Se modalidade é CALISTENIA: ZERO exercícios com halteres/máquinas/cabos
5. Se modalidade é ACADEMIA: prefira exercícios com barra e halteres antes de máquinas
6. "aiNote": dica técnica ultra-específica para ESTE atleta (máx 15 palavras em ${lang})
7. "scheduleReasons": 3 razões concretas por que esta seleção serve ESTE atleta (cite sexo, objetivo, fase, modalidade)
8. "weekFocus": frase motivacional personalizada para a semana ${currentWeek} na fase ${currentPhase}
9. Ajuste sets/reps conforme a fase — DELOAD = volume reduzido; INTENSIFICAÇÃO = menos reps, mais carga

CRITICAL LANGUAGE RULE: ALL text values ("aiNote", "scheduleReasons" items, "weekFocus") MUST be written in ${lang}. Never use Portuguese if the target language is not Portuguese.

Responda em JSON exatamente neste formato:
{"workouts":[{"id":"workout-id-aqui","exercises":[{"exerciseId":"id-do-exercicio","sets":N,"repsMin":N,"repsMax":N,"rest":N,"aiNote":"dica técnica"}]}],"scheduleReasons":["razão 1","razão 2","razão 3"],"weekFocus":"frase de foco"}`;

            const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                model: "gpt-4.1-mini",
                messages: [
                  { role: "system", content: `ZYROX AI Coach. Return ONLY valid JSON in ${lang}.` },
                  { role: "user", content: prompt },
                ],
                max_tokens: 1800,
                temperature: 0.65,
                response_format: { type: "json_object" },
              }),
            });

            const json = await upstream.json() as { choices: [{ message: { content: string } }] };
            res.writeHead(upstream.status, { "Content-Type": "application/json" });
            res.end(json.choices[0].message.content);
            return;
          }

          // ── /api/meal-plan ────────────────────────────────────────────
          if (url === "/api/meal-plan") {
            const { profile, locale: mealLocale } = body as {
              profile: {
                goal: string; weight: number; height: number; age: number;
                gender: string; dietType: string; metabolismType: string; name?: string;
              };
              locale?: string;
            };
            const mealLang = LANG[mealLocale ?? "pt"] ?? LANG.pt;
            const GOAL_MEAL: Record<string, { label: string; calorieAdj: number; proteinRatio: number; carbRatio: number; fatRatio: number; strategy: string }> = {
              mass:       { label: "Ganho de massa muscular (bulking)", calorieAdj: 400, proteinRatio: 2.2, carbRatio: 5.0, fatRatio: 1.0, strategy: "superávit calórico (+400kcal). Alta proteína + carboidratos para anabolismo. Refeição pré-treino rica em carbs (arroz, batata, aveia). Pós-treino: whey + banana." },
              strength:   { label: "Força máxima e potência", calorieAdj: 300, proteinRatio: 2.0, carbRatio: 4.5, fatRatio: 1.2, strategy: "superávit leve (+300kcal). Alta proteína para recuperação. Carbs complexos antes do treino. Gorduras saudáveis para suporte hormonal." },
              hybrid:     { label: "Hipertrofia + Força (abordagem híbrida)", calorieAdj: 350, proteinRatio: 2.2, carbRatio: 4.5, fatRatio: 1.0, strategy: "superávit moderado (+350kcal). Alternar fases de volume (mais carbs) e intensidade (mais proteína)." },
              athletic:   { label: "Performance atlética", calorieAdj: 200, proteinRatio: 1.8, carbRatio: 5.5, fatRatio: 1.0, strategy: "manutenção + leve superávit. Carbs são o combustível principal. Hidratação e timing são críticos. Pré-treino rico em carbs de rápida absorção." },
              weight_loss: { label: "Perda de peso e gordura corporal", calorieAdj: -400, proteinRatio: 2.4, carbRatio: 2.5, fatRatio: 0.8, strategy: "déficit calórico (-400kcal). PROTEÍNA ALTA para preservar músculo. Carboidratos ciclos: maior nos dias de treino, menor nos dias de descanso. Priorizar fibras e vegetais." },
              definition: { label: "Definição muscular (cutting inteligente)", calorieAdj: -300, proteinRatio: 2.5, carbRatio: 2.0, fatRatio: 0.7, strategy: "déficit moderado (-300kcal). Máxima proteína para preservar massa. Carboidratos apenas ao redor do treino. Jantar: proteína + vegetais, mínimo de carbs." },
              endurance:  { label: "Resistência e condicionamento", calorieAdj: 100, proteinRatio: 1.6, carbRatio: 6.0, fatRatio: 1.0, strategy: "manutenção. Carboidratos são o combustível: aveia, batata-doce, frutas. Refeições menores e mais frequentes. Recuperação com carbs + proteína." },
              wellness:   { label: "Saúde, bem-estar e qualidade de vida", calorieAdj: 0, proteinRatio: 1.6, carbRatio: 3.5, fatRatio: 1.0, strategy: "manutenção calórica. Alimentos integrais, variados e naturais. Sem restrições extremas. Prazer e adesão em primeiro lugar." },
              ganho_massa: { label: "Ganho de massa muscular (bulking)", calorieAdj: 400, proteinRatio: 2.2, carbRatio: 5.0, fatRatio: 1.0, strategy: "superávit calórico (+400kcal). Alta proteína + carboidratos para anabolismo." },
              perda_peso: { label: "Perda de peso e gordura corporal", calorieAdj: -400, proteinRatio: 2.4, carbRatio: 2.5, fatRatio: 0.8, strategy: "déficit calórico (-400kcal). Alta proteína para preservar músculo." },
              definicao:  { label: "Definição muscular", calorieAdj: -300, proteinRatio: 2.5, carbRatio: 2.0, fatRatio: 0.7, strategy: "déficit moderado (-300kcal). Máxima proteína, mínimo carboidrato fora do treino." },
              forca:      { label: "Força máxima", calorieAdj: 300, proteinRatio: 2.0, carbRatio: 4.5, fatRatio: 1.2, strategy: "superávit leve. Alta proteína e carbs complexos." },
              performance: { label: "Performance atlética", calorieAdj: 200, proteinRatio: 1.8, carbRatio: 5.5, fatRatio: 1.0, strategy: "carboidratos são o combustível principal." },
              saude:      { label: "Saúde e bem-estar", calorieAdj: 0, proteinRatio: 1.6, carbRatio: 3.5, fatRatio: 1.0, strategy: "alimentos integrais e naturais, sem restrições extremas." },
            };
            const goalConfig = GOAL_MEAL[profile.goal] ?? GOAL_MEAL.wellness;
            const bmr = profile.gender === "female"
              ? 655 + 9.6 * profile.weight + 1.8 * profile.height - 4.7 * profile.age
              : 88.4 + 13.4 * profile.weight + 4.8 * profile.height - 5.7 * profile.age;
            const tdee = Math.round(bmr * 1.55);
            const targetCalories = tdee + goalConfig.calorieAdj;
            const proteinG = Math.round(profile.weight * goalConfig.proteinRatio);
            const fatG = Math.round(profile.weight * goalConfig.fatRatio);
            const carbG = Math.round((targetCalories - proteinG * 4 - fatG * 9) / 4);

            const prompt = `Você é um nutricionista esportivo de elite especializado em periodização nutricional.

══ PERFIL DO ATLETA ══
${profile.name ? `Nome: ${profile.name}` : ""}
Objetivo: ${goalConfig.label}
Peso: ${profile.weight}kg | Altura: ${profile.height}cm | Idade: ${profile.age} anos
Gênero: ${profile.gender === "female" ? "Feminino" : profile.gender === "male" ? "Masculino" : "Outro"}
Tipo de dieta: ${profile.dietType || "onívoro"} | Metabolismo: ${profile.metabolismType || "balanceado"}

══ METAS NUTRICIONAIS CALCULADAS ══
TDEE: ${tdee} kcal | Ajuste pelo objetivo: ${goalConfig.calorieAdj >= 0 ? "+" : ""}${goalConfig.calorieAdj} kcal
META CALÓRICA BASE: ${targetCalories} kcal/dia
Proteína alvo: ${proteinG}g/dia (${goalConfig.proteinRatio}g/kg)
Carboidratos alvo: ${Math.max(50, carbG)}g/dia
Gorduras alvo: ${fatG}g/dia

══ ESTRATÉGIA NUTRICIONAL DO OBJETIVO ══
${goalConfig.strategy}

══ PERIODIZAÇÃO DE 12 SEMANAS ══
Semanas 1-4 (Adaptação): calorias em ${targetCalories - 100} kcal, introduzir os alimentos, ajustar o corpo
Semanas 5-8 (Desenvolvimento): calorias em ${targetCalories} kcal, máxima aderência ao plano
Semanas 9-12 (Otimização/Pico): calorias em ${targetCalories + (goalConfig.calorieAdj > 0 ? 100 : -50)} kcal, refinar macros e timing

══ REGRAS ABSOLUTAS ══
- Proteína NUNCA abaixo de ${Math.round(profile.weight * 1.8)}g/dia
- Varie as refeições entre semanas (não repita semanas consecutivas)
- Alimentos práticos e acessíveis
- Nome das refeições: criativos e motivadores
- Timing: café da manhã, lanche da manhã, almoço, pré-treino, jantar
- "tip": dica prática e específica para a semana (relacionada ao objetivo)

⚠️ IDIOMA OBRIGATÓRIO: Gere TODO o conteúdo JSON em ${mealLang}.
Isso inclui: weekFocus, tip, nome das refeições (name), nomes dos alimentos (foods[]).
NUNCA use português se o idioma solicitado for outro. Responda COMPLETAMENTE em ${mealLang}.

Responda SOMENTE com JSON válido neste formato:
{"weeks":[{"week":1,"weekFocus":"string","dailyCalories":N,"macros":{"protein":N,"carbs":N,"fat":N},"breakfast":{"name":"","foods":["food1","food2","food3"],"calories":N,"protein":N,"carbs":N,"fat":N},"morningSnack":{"name":"","foods":["food1","food2"],"calories":N,"protein":N,"carbs":N,"fat":N},"lunch":{"name":"","foods":["food1","food2","food3","food4"],"calories":N,"protein":N,"carbs":N,"fat":N},"preWorkout":{"name":"","foods":["food1","food2"],"calories":N,"protein":N,"carbs":N,"fat":N},"dinner":{"name":"","foods":["food1","food2","food3"],"calories":N,"protein":N,"carbs":N,"fat":N},"tip":""}]}
Gere as 12 semanas completas.`;

            const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                model: "gpt-4.1-mini",
                messages: [
                  { role: "system", content: `Sports nutritionist. ONLY valid JSON, no markdown. ALL text content (meal names, food items, tips, weekFocus) MUST be written in ${mealLang}. Never use Portuguese if the target language is different.` },
                  { role: "user", content: prompt },
                ],
                max_tokens: 5000,
                temperature: 0.7,
                response_format: { type: "json_object" },
              }),
            });

            const json = await upstream.json() as { choices: [{ message: { content: string } }] };
            const parsed = JSON.parse(json.choices[0].message.content) as { weeks: unknown[] };
            const plan = { generatedAt: new Date().toISOString(), locale: mealLocale ?? "pt", weeks: parsed.weeks };
            res.writeHead(upstream.status, { "Content-Type": "application/json" });
            res.end(JSON.stringify(plan));
            return;
          }

          // ── /api/analyze-image ────────────────────────────────────────
          if (url === "/api/analyze-image") {
            const { imageBase64, userContext, locale: imgLocale, kind, height, weight } = body as {
              imageBase64: string;
              userContext: string;
              locale: string;
              kind: "body" | "food";
              height?: number;
              weight?: number;
            };

            const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
            if (!imageBase64 || typeof imageBase64 !== "string" || imageBase64.length > MAX_IMAGE_BYTES) {
              res.writeHead(413, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Image too large or missing (max 5 MB)" }));
              return;
            }

            const imgLang = LANG[imgLocale] ?? LANG.pt;

            let systemContent: string;
            if (kind === "body") {
              const cal = height && weight ? `Calibration data: height=${height}cm, weight=${weight}kg.` : "";
              systemContent = `You are an expert body composition analyst for ZYROX 3D Body Scanner. ${cal}
Analyze the full-body photo and respond with ONLY a valid JSON object — no markdown, no extra text:
{"analysis":"<2-sentence encouraging summary in ${imgLang}>","measurements":{"peito":<chest cm int>,"cintura":<waist cm int>,"quadril":<hip cm int>,"braco":<bicep cm int>,"coxa":<thigh cm int>,"panturrilha":<calf cm int>,"bodyFat":<body fat % 1 decimal>,"muscleMass":<muscle mass kg 1 decimal>}}
Use visible body proportions and calibration data. Estimates must be realistic.`;
            } else {
              systemContent = `You are a sports nutritionist for ZYROX. Analyze the food photo and respond with ONLY valid JSON — no markdown:
{"analysis":"<2-sentence nutritional summary in ${imgLang}>","measurements":{"kcal":<total calories int>,"protein":<protein grams int>,"carbs":<carbs grams int>,"fat":<fat grams int>}}`;
            }

            const imgRes = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                model: "gpt-4.1-mini",
                messages: [
                  { role: "system", content: `${systemContent}\n\n${userContext}` },
                  { role: "user", content: [
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: "high" } },
                    { type: "text", text: kind === "body" ? "Analyze this body scan and return the JSON." : "Analyze this food photo and return the JSON." },
                  ]},
                ],
                max_tokens: 600,
                response_format: { type: "json_object" },
              }),
            });

            const imgJson = await imgRes.json() as { choices: [{ message: { content: string } }] };
            try {
              const parsed = JSON.parse(imgJson.choices[0].message.content) as { analysis: string; measurements?: Record<string, number> };
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ analysis: parsed.analysis ?? "", measurements: parsed.measurements ?? null }));
            } catch {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ analysis: imgJson.choices[0].message.content, measurements: null }));
            }
            return;
          }
        } catch (err) {
          console.error("[zyrox-api] Error:", err);
          if (!res.headersSent) { res.writeHead(500); res.end("Internal Server Error"); }
          return;
        }

        next();
      });
    },
  };
}

function networkAccessPlugin(): Plugin {
  return {
    name: "zyrox-network-access",
    apply: "serve",
    enforce: "post",
    transform(code) {
      if (code.includes("http://localhost:")) {
        return {
          code: code.replace(/["'`]https?:\/\/localhost:\d+\//g, (m) => m[0] + "/"),
          map: null,
        };
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const ct = res.getHeader?.("content-type")?.toString() ?? "";
        if (!ct.includes("javascript")) return next();
        const _end = res.end.bind(res);
        (res as any).end = function (chunk: any, ...args: any[]) {
          if (!chunk) return _end(chunk, ...args);
          const str = Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
          if (str.includes("localhost:")) {
            const fixed = str.replace(/https?:\/\/localhost:\d+\//g, "/");
            return _end(Buffer.from(fixed), ...args);
          }
          return _end(chunk, ...args);
        };
        next();
      });
    },
  };
}

export default defineConfig({
  vite: {
    define: {
      // injeta a chave no bundle (lida do .env em dev, do secret do CI em prod)
      "process.env.OPENAI_API_KEY": JSON.stringify(process.env.OPENAI_API_KEY ?? ""),
    },
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    plugins: [devApiPlugin(), networkAccessPlugin()],
    server: {
      host: "0.0.0.0",
      strictPort: false,
      allowedHosts: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes("node_modules/firebase")) return "firebase";
            if (id.includes("node_modules/framer-motion")) return "motion";
            if (id.includes("node_modules/@remotion") || id.includes("node_modules/remotion")) return "remotion";
            if (id.includes("node_modules/@tanstack")) return "tanstack";
          },
        },
      },
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
