import { createServerFn } from "@tanstack/react-start";

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type AILocale = "pt" | "es" | "en" | "fr" | "de";

type AskPayload = { messages: ChatMessage[]; userContext: string; locale: AILocale };
type InsightPayload = { userContext: string; task: string; locale: AILocale };
type PlanPayload = { userContext: string; locale: AILocale };

const LANGUAGE_NAME: Record<AILocale, string> = {
  pt: "português brasileiro",
  es: "español",
  en: "English",
  fr: "français",
  de: "Deutsch",
};

// ── Chat interativo ──────────────────────────────────────────────
export const askAICoach = createServerFn({ method: "POST" })
  .inputValidator((d: AskPayload) => d)
  .handler(async ({ data }) => {
    const reply = await callOpenAI(
      [
        { role: "system", content: buildCoachPrompt(data.userContext, data.locale) },
        ...data.messages,
      ],
      600,
    );
    return { reply };
  });

// ── Insight pontual (para cards do app) ─────────────────────────
export const generateAIInsight = createServerFn({ method: "POST" })
  .inputValidator((d: InsightPayload) => d)
  .handler(async ({ data }) => {
    const content = await callOpenAI(
      [
        { role: "system", content: buildCoachPrompt(data.userContext, data.locale) },
        { role: "user", content: data.task },
      ],
      320,
    );
    return { content };
  });

// ── Plano completo pós-onboarding ────────────────────────────────
export const generateTrainingPlan = createServerFn({ method: "POST" })
  .inputValidator((d: PlanPayload) => d)
  .handler(async ({ data }) => {
    const plan = await callOpenAI(
      [
        { role: "system", content: buildPlannerPrompt(data.locale) },
        {
          role: "user",
          content: `Generate a personalized plan for this athlete:\n\n${data.userContext}`,
        },
      ],
      1400,
    );
    return { plan };
  });

// ── Análise de imagem corporal (visão) ───────────────────────────
type VisionPayload = {
  imageBase64: string;
  userContext: string;
  locale: AILocale;
  kind: "body" | "food";
  height?: number;
  weight?: number;
};

export type DetectedMeasurements = {
  peito?: number; cintura?: number; quadril?: number;
  braco?: number; coxa?: number; panturrilha?: number;
  bodyFat?: number; muscleMass?: number; weight?: number;
};

export const analyzeImage = createServerFn({ method: "POST" })
  .inputValidator((d: VisionPayload) => d)
  .handler(async ({ data }) => {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY não configurada");

    const lang = LANGUAGE_NAME[data.locale] ?? LANGUAGE_NAME.pt;

    let systemContent: string;
    let userText: string;

    if (data.kind === "body") {
      const cal = data.height && data.weight
        ? `Calibration data: height=${data.height}cm, weight=${data.weight}kg.`
        : "";
      systemContent = `You are an expert body composition analyst for ZYROX 3D Body Scan. ${cal}
Analyze the full-body photo and respond with ONLY a valid JSON object — no markdown, no extra text:
{
  "analysis": "<2-sentence encouraging summary in ${lang}>",
  "measurements": {
    "peito": <chest circumference cm, integer>,
    "cintura": <waist circumference cm, integer>,
    "quadril": <hip circumference cm, integer>,
    "braco": <bicep circumference cm, integer>,
    "coxa": <thigh circumference cm, integer>,
    "panturrilha": <calf circumference cm, integer>,
    "bodyFat": <body fat percentage, 1 decimal>,
    "muscleMass": <muscle mass kg, 1 decimal>
  }
}
Use visible body proportions and calibration data. Estimates must be realistic.`;
      userText = "Analyze this body scan and return the JSON.";
    } else {
      systemContent = `You are a sports nutritionist for ZYROX. Analyze the food photo and respond with ONLY valid JSON — no markdown:
{
  "analysis": "<2-sentence nutritional summary in ${lang}>",
  "measurements": {
    "kcal": <total calories integer>,
    "protein": <protein grams integer>,
    "carbs": <carbs grams integer>,
    "fat": <fat grams integer>
  }
}`;
      userText = "Analyze this food photo and return the JSON.";
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: `${systemContent}\n\n${data.userContext}` },
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${data.imageBase64}`, detail: "high" } },
              { type: "text", text: userText },
            ],
          },
        ],
        max_tokens: 600,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as { choices: [{ message: { content: string } }] };

    try {
      const parsed = JSON.parse(json.choices[0].message.content) as {
        analysis: string;
        measurements?: DetectedMeasurements;
      };
      return { analysis: parsed.analysis ?? "", measurements: parsed.measurements ?? null };
    } catch {
      return { analysis: json.choices[0].message.content, measurements: null };
    }
  });

// ── Shared fetch ─────────────────────────────────────────────────
async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  maxTokens = 600,
): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY não configurada no servidor");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages,
      max_tokens: maxTokens,
      temperature: 0.75,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI ${res.status}: ${err}`);
  }

  const json = (await res.json()) as { choices: [{ message: { content: string } }] };
  return json.choices[0].message.content;
}

// ── System prompts ───────────────────────────────────────────────
function buildCoachPrompt(userContext: string, locale: AILocale): string {
  const lang = LANGUAGE_NAME[locale] ?? LANGUAGE_NAME.pt;
  return `You are ZYROX AI Coach — an elite personal trainer and sports nutritionist integrated into the 3D Body Scan fitness app.

${userContext}

CRITICAL RULE: Always respond in ${lang}. Never switch languages regardless of how the user writes.

## Expert Knowledge Base (Brazilian Fitness Methodology)

**Beginner training:**
- Full Body 3x/week, machines preferred for safety, 15 reps 30–60s rest
- Technique before load — stop at technical failure, not muscular failure
- Warm-up 5–10 min aerobic before resistance training
- Compound movements: squat, leg press, pulley row, bench press machine, shoulder press
- Core: simple abdominal → plank → knee raises → dragon flag progression

**Intermediate / Advanced:**
- AB or ABC split, 4–6x/week; intermediate: 8–12 reps hypertrophy; advanced: 15–20 sets/muscle group
- Synergist groupings: chest+shoulder+triceps / back+biceps / legs separate
- Progressive overload is mandatory for continued results

**Plateau breaking (advanced):**
- Cluster sets: heavy load → 4-rep blocks, 20s intra-set rest, reach 20 total reps
- Rest-pause: train to failure → 15s rest → failure again → repeat
- Peak contraction (isometry): 3s hold at maximum tension point
- Periodization waves: alternate weekly between power (4–6 reps), hypertrophy (8–12), metabolic (15–30)
- Inverse exercise order: start with small/accessory muscles to strengthen limiters
- Submaximal pump sessions between heavy days for recovery + density

**Female athlete specifics:**
- Prioritize glutes + lower body 2x/week (quadriceps day + hamstring/glute day)
- Upper body for symmetry: back + shoulders narrow waist visually
- Calves + adductors 2x/week; adductor chair for knee stability
- Adapt intensity to hormonal cycle phases
- High frequency inferiores OK if alternating heavy / submaximal sessions

**Weight loss / fat loss:**
- Hypertrophy focus burns more fat long-term than cardio alone
- Compound movements = maximum motor unit recruitment = more calories burned
- HIIT aerobic AFTER weights (not on leg day), or separate session
- Caloric deficit + 1.6–2.4g protein/kg bodyweight
- Full Body workouts in deficit: up to 2x hypertrophy vs isolation split

**Recovery & posture:**
- Articular cartilage has no vascular supply → recovers slower than muscle
- Supercompensation curve: growth happens during recovery, not training
- "Spine like an ironing board" for squats, rows, deadlifts
- Core braced at all times under load; stop when posture breaks

**Calisthenics fundamentals:**
- 5 pillars: Push (push-up → handstand push-up), Pull (pull-up), Legs (squat → pistol), Core (plank → hollow body → dragon flag), Mobility (wrist, shoulder, hip, ankle)
- Progression tests: max push-ups, Australian pull-ups, squats, plank hold (sec), bar hang (sec)

Guidelines:
- Be direct, technical, and motivating
- Personalize every response using the user profile
- Keep responses concise: 2–4 short paragraphs
- Suggest concrete, actionable steps — never generic advice
- Never invent data not present in the profile`;
}

function buildPlannerPrompt(locale: AILocale): string {
  const lang = LANGUAGE_NAME[locale] ?? LANGUAGE_NAME.pt;
  return `You are an expert periodization and sports nutrition system integrated into ZYROX 3D Body Scan.

CRITICAL RULE: Respond entirely in ${lang}.

When given an athlete profile, generate a personalized plan summary with:
## Estratégia (Strategy)
2–3 sentences about the approach for the stated goal.

## Protocolo de Treino (Training Protocol)
Day split, weekly volume, session focus. Adapt for the athlete's level (beginner: full body 3x; intermediate: AB split 4-5x; advanced: 5-6x with emphasis days).

## Nutrição (Nutrition)
Calorie target, macro split (protein/carbs/fat in grams), pre/post-workout timing.

## Progressão (Progression)
How to advance over the next 4 weeks. Include specific techniques (progressive overload, periodization waves, plateau-breaking methods if applicable).

Format: Markdown with ## headers. Concise and direct.`;
}

// ── Monta contexto do usuário (usado no cliente, exportado) ─────
export function buildUserContext(state: {
  name?: string;
  goal?: string;
  experience?: string;
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  metabolismType?: string;
  location?: string;
  days?: number[];
  duration?: number;
  equipment?: string[];
  focusMuscles?: string[];
  dietType?: string;
  mealFrequency?: string;
  oneRepMax?: { bench?: number; squat?: number; deadlift?: number; ohp?: number };
}): string {
  const GOAL_MAP: Record<string, string> = {
    mass: "Hypertrophy / Mass gain",
    strength: "Strength",
    hybrid: "Hybrid",
    athletic: "Athletic performance",
    weight_loss: "Weight loss",
    definition: "Muscle definition / Cutting",
    endurance: "Endurance",
    wellness: "Wellness",
  };
  const EXP_MAP: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  const GENDER_MAP: Record<string, string> = {
    male: "Male",
    female: "Female",
    other: "Non-binary / Other",
  };

  const parts: string[] = [];
  if (state.name) parts.push(`Name: ${state.name}`);
  if (state.goal) parts.push(`Goal: ${GOAL_MAP[state.goal] ?? state.goal}`);
  if (state.experience) parts.push(`Level: ${EXP_MAP[state.experience] ?? state.experience}`);
  if (state.weight) parts.push(`Weight: ${state.weight} kg`);
  if (state.height) parts.push(`Height: ${state.height} cm`);
  if (state.age) parts.push(`Age: ${state.age} yrs`);
  if (state.gender) parts.push(`Sex: ${GENDER_MAP[state.gender] ?? state.gender}`);
  if (state.metabolismType) parts.push(`Metabolism: ${state.metabolismType}`);
  if (state.location) parts.push(`Training location: ${state.location}`);
  if (state.days?.length) parts.push(`Frequency: ${state.days.length}x/week`);
  if (state.duration) parts.push(`Session duration: ${state.duration} min`);
  if (state.equipment?.length) parts.push(`Equipment: ${state.equipment.join(", ")}`);
  if (state.focusMuscles?.length) parts.push(`Muscle focus: ${state.focusMuscles.join(", ")}`);
  if (state.dietType) parts.push(`Diet style: ${state.dietType}`);
  if (state.mealFrequency) parts.push(`Meals/day: ${state.mealFrequency}`);
  if (state.oneRepMax) {
    const orm = state.oneRepMax;
    const vals = [
      orm.bench ? `Bench ${orm.bench}kg` : null,
      orm.squat ? `Squat ${orm.squat}kg` : null,
      orm.deadlift ? `Deadlift ${orm.deadlift}kg` : null,
      orm.ohp ? `OHP ${orm.ohp}kg` : null,
    ].filter(Boolean);
    if (vals.length) parts.push(`1RM: ${vals.join(", ")}`);
  }

  return parts.length === 0
    ? "Profile not yet filled."
    : `Athlete profile:\n${parts.map((p) => `• ${p}`).join("\n")}`;
}
