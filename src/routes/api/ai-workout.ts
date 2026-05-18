import { createFileRoute } from "@tanstack/react-router";
import type { AIWorkoutCandidate } from "@/domain/training/engine";
import { verifyFirebaseToken } from "@/lib/server-auth";

const LANGUAGE_NAME: Record<string, string> = {
  pt: "português brasileiro",
  es: "español",
  en: "English",
  fr: "français",
  de: "Deutsch",
};

const CATEGORY_LABEL: Record<string, string> = {
  peitoral: "Peitoral",
  costas_trapezio: "Costas/Trapézio",
  deltoides: "Deltóides",
  biceps_antebraco: "Bíceps",
  triceps: "Tríceps",
  abdomen_core: "Abdômen/Core",
  membros_inferiores_gluteos: "Pernas/Glúteos",
  panturrilha: "Panturrilha",
};

const GOAL_LABEL: Record<string, string> = {
  ganho_massa: "hipertrofia (ganho de massa muscular)",
  perda_peso: "perda de peso/gordura",
  definicao: "definição muscular",
  forca: "força máxima",
  performance: "performance atlética",
  saude: "saúde e bem-estar",
};

type ProfileInput = {
  goal: string;
  level: string;
  sex: string | null;
  location: string;
  availableDays: number;
  workoutDurationMin: number;
  name?: string;
  consistency?: string;
  equipment?: string[];
  trainingType?: string;
  modality?: string;
  currentWeek?: number;
  currentPhase?: string;
  phaseEmphasis?: string;
  volumeBias?: string;
  intensityBias?: string;
  splitBias?: string;
  trackCycle?: boolean;
  menstrualCyclePhase?: string | null;
  injuries?: string[];
  limitations?: string[];
  focusMuscles?: string[];
  dietType?: string;
  metabolismType?: string;
};

export const Route = createFileRoute("/api/ai-workout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
    const uid = await verifyFirebaseToken(request.headers.get("Authorization"));
    if (!uid) return new Response("Unauthorized", { status: 401 });

    const key = process.env.OPENAI_API_KEY;
    if (!key) return new Response("not configured", { status: 500 });

    const payload = (await request.json()) as {
      profile: ProfileInput;
      workoutCandidates: AIWorkoutCandidate[];
      locale: string;
      athleteMemory?: string;
      regenerationId?: string;
      avoidExerciseIds?: string[];
    };
    const { profile, workoutCandidates, locale, athleteMemory, regenerationId, avoidExerciseIds = [] } = payload;

    const lang = LANGUAGE_NAME[locale] ?? LANGUAGE_NAME.pt;

    const prompt = buildAIWorkoutPrompt(
      profile,
      workoutCandidates,
      lang,
      athleteMemory,
      { regenerationId, avoidExerciseIds },
    );

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `You are ZYROX AI Coach — elite certified personal trainer and sports scientist. You create hyper-personalized training programs. CRITICAL: Respond in ${lang}. Return ONLY valid JSON, no markdown, no explanation.`,
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1800,
        temperature: regenerationId ? 0.9 : 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(err, { status: res.status });
    }

    const json = (await res.json()) as { choices: [{ message: { content: string } }] };
    const content = json.choices[0].message.content;

    return new Response(content, {
      headers: { "Content-Type": "application/json" },
    });
  },
    },
  },
});

function buildAIWorkoutPrompt(
  profile: ProfileInput,
  candidates: AIWorkoutCandidate[],
  lang: string,
  athleteMemory?: string,
  regeneration?: { regenerationId?: string; avoidExerciseIds?: string[] },
): string {
  const goalDescription = GOAL_LABEL[profile.goal] ?? profile.goal;
  const levelText =
    profile.level === "iniciante"
      ? "Iniciante (primeiro ano de treino, foco em técnica e neuroadaptação)"
      : profile.level === "intermediario"
        ? "Intermediário (1-3 anos, base sólida, busca progressão de carga)"
        : "Avançado (3+ anos, periodização complexa, alto volume tolerado)";

  const setsRepsGuide =
    profile.goal === "ganho_massa"
      ? "3-4 séries, 8-12 reps, 60-90s descanso"
      : profile.goal === "forca"
        ? "4-5 séries, 4-6 reps, 120-180s descanso"
        : profile.goal === "perda_peso" || profile.goal === "definicao"
          ? "3 séries, 12-15 reps, 45-60s descanso"
          : "3-4 séries, 8-12 reps, 60-90s descanso";

  const levelSetsAdjust =
    profile.level === "iniciante"
      ? "Iniciante: reduzir para 2-3 séries, garantir técnica perfeita antes de carga."
      : profile.level === "avancado"
        ? "Avançado: pode usar 4-5 séries, incluir variações de periodização."
        : "";

  const workoutBlocks = candidates
    .map((w, i) => {
      const exerciseLines = w.exercises
        .map((e) => `  - ${e.id} | "${e.name}" | ${CATEGORY_LABEL[e.category] ?? e.category} | ${e.equipment}`)
        .join("\n");
      return `### Treino ${i + 1}: ${w.workoutName}
Foco muscular: ${w.workoutFocus.split(",").map((c) => CATEGORY_LABEL[c.trim()] ?? c).join(", ")}
ID do treino: ${w.workoutId}
Exercícios disponíveis (selecione exatamente 8):
${exerciseLines}`;
    })
    .join("\n\n");

  const consistencyText =
    profile.consistency === "elite"
      ? "Elite (treina 5-6x/semana com alta disciplina)"
      : profile.consistency === "regular"
        ? "Regular (treina 3-4x/semana com boa consistência)"
        : "Ocasional (treina quando pode, irregularidade comum)";

  const phaseContext = profile.currentPhase
    ? `Fase atual: ${profile.currentPhase} (semana ${profile.currentWeek ?? 1}/12) — ${profile.phaseEmphasis ?? ""}\nVolume desta semana: ${profile.volumeBias ?? "moderado"} | Intensidade: ${profile.intensityBias ?? "moderada"}`
    : "";

  const locationLabel =
    profile.location === "academia" ? "Academia (acesso completo: barras, halteres, cabos, máquinas, banco)" :
    profile.location === "casa" ? "Casa (SEM máquinas e SEM cabos/polias — use apenas halteres, barras, peso corporal, elásticos)" :
    profile.location === "outdoor" ? "Outdoor/Parque (SOMENTE calistenia e peso corporal — sem equipamentos de academia)" :
    "Híbrido (academia + casa — priorize exercícios versáteis que funcionem nos dois ambientes)";

  const equipmentContext = profile.equipment && profile.equipment.length > 0
    ? `Equipamentos disponíveis: ${profile.equipment.join(", ")}`
    : profile.location === "academia" ? "Equipamentos: acesso completo à academia"
    : profile.location === "casa" ? "Equipamentos caseiros disponíveis"
    : "";

  const trainingTypeLabel =
    profile.trainingType === "funcional" ? "Funcional" :
    profile.trainingType === "calistenia" ? "Calistenia" :
    "Musculação";

  const focusContext = profile.focusMuscles && profile.focusMuscles.length > 0
    ? `Músculos prioritários (foco do atleta): ${profile.focusMuscles.join(", ")}`
    : "";

  const injuryContext = [
    ...(profile.injuries && profile.injuries.length > 0 ? [`LESÕES ATIVAS: ${profile.injuries.join(", ")} — EVITE exercícios que agravem`] : []),
    ...(profile.limitations && profile.limitations.length > 0 ? [`Limitações: ${profile.limitations.join(", ")}`] : []),
  ].join("\n");

  const nutritionContext = [
    profile.dietType ? `Dieta: ${profile.dietType}` : "",
    profile.metabolismType ? `Metabolismo: ${profile.metabolismType}` : "",
  ].filter(Boolean).join(" | ");

  const cycleContext = profile.trackCycle
    ? `Ciclo menstrual ativado no onboarding${profile.menstrualCyclePhase ? `; fase atual: ${profile.menstrualCyclePhase}` : ""}. Ajuste volume, descanso e intensidade à fase informada.`
    : "";

  const femaleContext = profile.sex === "feminino"
    ? `PERFIL FEMININO: não use divisão genérica masculina como padrão. Priorize glúteos e membros inferiores, com superior em manutenção/postura. ${cycleContext}`
    : "";
  const variationContext = regeneration?.regenerationId
    ? `\nREGENERAÇÃO SOLICITADA:\n- Seed de variação: ${regeneration.regenerationId}\n- Gere uma seleção visivelmente diferente do plano anterior.\n${regeneration.avoidExerciseIds?.length ? `- Evite repetir estes IDs quando houver alternativa compatível: ${regeneration.avoidExerciseIds.slice(0, 40).join(", ")}` : ""}\n- Preserve a coerência com modalidade, ambiente, fase e segurança, mas varie exercícios, ordem e notas técnicas.`
    : "";

  return `${athleteMemory ? athleteMemory + "\n\n" : ""}PERFIL DO ATLETA${profile.name ? ` — ${profile.name}` : ""}:
- Objetivo: ${goalDescription}
- Nível: ${levelText}
- Consistência: ${consistencyText}
- Sexo: ${profile.sex === "feminino" ? "Feminino" : profile.sex === "masculino" ? "Masculino" : "Não informado"}
- Modalidade escolhida no onboarding: ${trainingTypeLabel}
- Local de treino: ${locationLabel}
- Dias por semana: ${profile.availableDays}
- Duração por sessão: ${profile.workoutDurationMin} minutos
${equipmentContext}
${focusContext}
${nutritionContext ? `- ${nutritionContext}` : ""}
${phaseContext}
${femaleContext}
${injuryContext}
${variationContext}

TAREFA: Crie um programa de treino ALTAMENTE PERSONALIZADO para ESTE atleta específico. Use TODOS os dados acima para tomar decisões de seleção de exercício, volume e intensidade. Trate como um personal trainer de bolso que conhece o histórico completo do atleta.

Parâmetros base de volume/intensidade:
- ${setsRepsGuide}
- ${levelSetsAdjust}

${workoutBlocks}

REGRAS CRÍTICAS:
1. Selecione EXATAMENTE 8 exercícios por treino
2. Use SOMENTE os IDs da lista acima (nunca invente IDs) — os candidatos já foram filtrados por local e equipamento
3. RESPEITE a modalidade do onboarding: Musculação=exercícios de musculação; Funcional=movimentos funcionais, core, estabilidade, unilateralidade e condicionamento; Calistenia=peso corporal/calistenia
4. RESPEITE o local de treino: casa=sem máquinas/cabos, outdoor=só calistenia, academia=tudo disponível
5. Priorize compostos primeiro, isolados depois. Para feminino: glúteos/inferiores comandam a divisão; superior entra como manutenção, postura e definição
6. Nunca use rosca/bíceps em vaga de tríceps; tríceps precisa ser extensão, corda, francês, testa, coice ou mergulho
7. Não repita família/padrão do mesmo exercício: mudança de pegada, abertura ou máquina parecida NÃO conta como exercício novo. Exemplo proibido no mesmo treino: Remada Curvada + Remada Curvada Pronada + Remada Curvada Aberta
8. Em treino de costas, use no máximo 2 remadas horizontais; combine com puxada vertical, trapézio, deltoide posterior, bíceps ou core quando a divisão pedir
9. O "aiNote" deve ser uma dica técnica ESPECÍFICA para este atleta (máx 15 palavras, em ${lang})
10. Personalize sets/reps dentro dos parâmetros base conforme nível, objetivo e fase atual
11. "scheduleReasons": 3 razões específicas sobre POR QUÊ esta seleção é ideal para ESTE atleta (cite dados reais do perfil: modalidade, lesões, foco muscular, fase, consistência)
12. "weekFocus": uma frase de foco PERSONALIZADA para esta semana e este atleta específico
13. Em regeneração, varie o plano anterior sem violar as regras de segurança e compatibilidade

Responda com JSON exatamente neste formato:
{
  "workouts": [
    {
      "id": "workout-id-aqui",
      "exercises": [
        {"exerciseId": "id-do-exercicio", "sets": N, "repsMin": N, "repsMax": N, "rest": N, "aiNote": "dica técnica"}
      ]
    }
  ],
  "scheduleReasons": ["razão específica 1", "razão específica 2", "razão específica 3"],
  "weekFocus": "frase de foco da semana"
}`;
}
