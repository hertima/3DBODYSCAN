import { a2 as TSS_SERVER_FUNCTION, a3 as createServerFn } from "./server-C0e4gypg.js";
import { O as OPENAI_MODEL } from "./openai-config-D_XaIbeQ.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const LANGUAGE_NAME = {
  pt: "português brasileiro",
  es: "español",
  en: "English",
  fr: "français",
  de: "Deutsch"
};
const askAICoach_createServerFn_handler = createServerRpc({
  id: "01db2874b4b64d979299e5a078ebc9e55a487ca5718ff5fa68eff8898d577197",
  name: "askAICoach",
  filename: "src/lib/ai-service.ts"
}, (opts) => askAICoach.__executeServer(opts));
const askAICoach = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(askAICoach_createServerFn_handler, async ({
  data
}) => {
  const reply = await callOpenAI([{
    role: "system",
    content: buildCoachPrompt(data.userContext, data.locale)
  }, ...data.messages], 600);
  return {
    reply
  };
});
const generateAIInsight_createServerFn_handler = createServerRpc({
  id: "52d063375b11993e2ab4af7319e586e007680db95abb501089ea983ad35dcb1d",
  name: "generateAIInsight",
  filename: "src/lib/ai-service.ts"
}, (opts) => generateAIInsight.__executeServer(opts));
const generateAIInsight = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(generateAIInsight_createServerFn_handler, async ({
  data
}) => {
  const content = await callOpenAI([{
    role: "system",
    content: buildCoachPrompt(data.userContext, data.locale)
  }, {
    role: "user",
    content: data.task
  }], 320);
  return {
    content
  };
});
const generateTrainingPlan_createServerFn_handler = createServerRpc({
  id: "3731e3d1f427887db31e228f311f8d9ca6d24bc6bacbd498169b370ee10d6aa8",
  name: "generateTrainingPlan",
  filename: "src/lib/ai-service.ts"
}, (opts) => generateTrainingPlan.__executeServer(opts));
const generateTrainingPlan = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(generateTrainingPlan_createServerFn_handler, async ({
  data
}) => {
  const plan = await callOpenAI([{
    role: "system",
    content: buildPlannerPrompt(data.locale)
  }, {
    role: "user",
    content: `Generate a personalized plan for this athlete:

${data.userContext}`
  }], 1400);
  return {
    plan
  };
});
const analyzeImage_createServerFn_handler = createServerRpc({
  id: "304cb3175500817ba823ac0fbb4689bf3d15b933582a85b21041c0dfccd1a49d",
  name: "analyzeImage",
  filename: "src/lib/ai-service.ts"
}, (opts) => analyzeImage.__executeServer(opts));
const analyzeImage = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(analyzeImage_createServerFn_handler, async ({
  data
}) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY não configurada");
  const lang = LANGUAGE_NAME[data.locale] ?? LANGUAGE_NAME.pt;
  let systemContent;
  let userText;
  if (data.kind === "body") {
    const cal = data.height && data.weight ? `Calibration data: height=${data.height}cm, weight=${data.weight}kg.` : "";
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
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{
        role: "system",
        content: `${systemContent}

${data.userContext}`
      }, {
        role: "user",
        content: [{
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${data.imageBase64}`,
            detail: "high"
          }
        }, {
          type: "text",
          text: userText
        }]
      }],
      max_tokens: 600,
      response_format: {
        type: "json_object"
      }
    })
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const json = await res.json();
  try {
    const parsed = JSON.parse(json.choices[0].message.content);
    return {
      analysis: parsed.analysis ?? "",
      measurements: parsed.measurements ?? null
    };
  } catch {
    return {
      analysis: json.choices[0].message.content,
      measurements: null
    };
  }
});
async function callOpenAI(messages, maxTokens = 600) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY não configurada no servidor");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.75
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI ${res.status}: ${err}`);
  }
  const json = await res.json();
  return json.choices[0].message.content;
}
function buildCoachPrompt(userContext, locale) {
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
function buildPlannerPrompt(locale) {
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
export {
  analyzeImage_createServerFn_handler,
  askAICoach_createServerFn_handler,
  generateAIInsight_createServerFn_handler,
  generateTrainingPlan_createServerFn_handler
};