import { createFileRoute } from "@tanstack/react-router";
import { verifyFirebaseToken } from "@/lib/server-auth";

const LANGUAGE_NAME: Record<string, string> = {
  pt: "português brasileiro",
  es: "español",
  en: "English",
  fr: "français",
  de: "Deutsch",
};

export const Route = createFileRoute("/api/chat-stream")({
  server: {
    handlers: {
      POST: async ({ request }) => {
    const uid = await verifyFirebaseToken(request.headers.get("Authorization"));
    if (!uid) return new Response("Unauthorized", { status: 401 });

    const key = process.env.OPENAI_API_KEY;
    if (!key) return new Response("API key not configured", { status: 500 });

    const { messages, userContext, locale, athleteMemory } = (await request.json()) as {
      messages: Array<{ role: string; content: string }>;
      userContext: string;
      locale: string;
      athleteMemory?: string;
    };

    const lang = LANGUAGE_NAME[locale] ?? LANGUAGE_NAME.pt;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: buildCoachPrompt(userContext, lang, athleteMemory) },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.75,
        stream: true,
      }),
    });

    if (!res.ok) {
      return new Response(await res.text(), { status: res.status });
    }

    return new Response(res.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  },
    },
  },
});

function buildCoachPrompt(userContext: string, lang: string, athleteMemory?: string): string {
  return `You are ZYROX 3D Body Scan AI Coach — an elite personal trainer and sports nutritionist with full access to the athlete's scan history, workout logs, and body measurements. You are the intelligent engine of the app.

${userContext}
${athleteMemory ? "\n" + athleteMemory : ""}

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
