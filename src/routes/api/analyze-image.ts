import { createFileRoute } from "@tanstack/react-router";
import { verifyFirebaseToken } from "@/lib/server-auth";
import { OPENAI_MODEL } from "@/lib/openai-config";

const MAX_IMAGE_B64 = 7 * 1024 * 1024; // ~5 MB decoded

export const Route = createFileRoute("/api/analyze-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const uid = await verifyFirebaseToken(request.headers.get("Authorization"));
        if (!uid) return new Response("Unauthorized", { status: 401 });

        const key = process.env.OPENAI_API_KEY;
        if (!key) return new Response("API key not configured", { status: 500 });

        const body = (await request.json()) as {
          imageBase64: string;
          userContext: string;
          locale: string;
          kind: "body" | "food";
          height?: number;
          weight?: number;
          sex?: string;
          age?: number;
        };

        const imageBase64 = String(body.imageBase64 ?? "");
        if (!imageBase64 || imageBase64.length > MAX_IMAGE_B64)
          return new Response("Image too large or missing", { status: 400 });

        const userContext = String(body.userContext ?? "").slice(0, 3000);
        const locale = String(body.locale ?? "pt").slice(0, 5);
        const kind = body.kind === "food" ? "food" : "body";
        const height = typeof body.height === "number" ? body.height : undefined;
        const weight = typeof body.weight === "number" ? body.weight : undefined;
        const sex = typeof body.sex === "string" ? body.sex : undefined;
        const age = typeof body.age === "number" ? body.age : undefined;

        const LANGUAGE_NAME: Record<string, string> = {
          pt: "português brasileiro", es: "español", en: "English", fr: "français", de: "Deutsch",
        };
        const lang = LANGUAGE_NAME[locale] ?? LANGUAGE_NAME.pt;

        let systemContent: string;
        let userText: string;

        if (kind === "body") {
          const calParts = [
            height ? `height=${height}cm` : null,
            weight ? `weight=${weight}kg` : null,
            sex ? `sex=${sex === "male" || sex === "masculino" ? "male" : "female"}` : null,
            age ? `age=${age}years` : null,
          ].filter(Boolean).join(", ");
          const cal = calParts ? `Athlete data: ${calParts}.` : "";
          systemContent = `You are a certified sports scientist and personal trainer for ZYROX 3D Body Scanner — PhD-level expertise in body composition. ${cal}

SCIENTIFIC STANDARDS TO APPLY:
- Body fat % norms: ACSM guidelines (male fit=14-17%, female fit=21-24%); Pollock & Wilmore skinfold reference tables by sex and age group
- Muscle mass: FFM estimation via Boer formula (men: 0.407W + 0.267H − 19.2; women: 0.252W + 0.473H − 48.3) using provided weight/height
- Waist-to-hip ratio: WHO standards (male risk >0.90, female risk >0.85)
- BMI cross-reference: WHO classification for plausibility check
- Age-adjusted norms: body fat naturally increases ~1% per decade; muscle mass peaks at 25-30 and declines ~3-8% per decade after 30

ESTIMATION RULES:
1. Use athlete's sex to apply sex-specific body fat reference ranges (males carry less essential fat, females carry more)
2. Use athlete's age to adjust expected body fat % upward for older athletes
3. Use weight+height to calculate expected muscle mass via Boer formula, then adjust from visual lean mass assessment
4. Circumference estimates must be anatomically consistent with each other (waist always < hip for females)
5. Body fat % must be physiologically plausible: male minimum 3%, female minimum 10%

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

        try {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: OPENAI_MODEL,
              messages: [
                { role: "system", content: `${systemContent}\n\n${userContext}` },
                {
                  role: "user",
                  content: [
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: "high" } },
                    { type: "text", text: userText },
                  ],
                },
              ],
              max_tokens: 600,
              response_format: { type: "json_object" },
            }),
          });

          if (!res.ok) {
            const err = await res.text();
            console.error("[analyze-image] OpenAI error:", res.status, err);
            return new Response(JSON.stringify({ analysis: "", measurements: null }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const json = (await res.json()) as { choices: [{ message: { content: string } }] };
          try {
            const parsed = JSON.parse(json.choices[0].message.content) as {
              analysis: string;
              measurements?: Record<string, number>;
            };
            return new Response(JSON.stringify({ analysis: parsed.analysis ?? "", measurements: parsed.measurements ?? null }), {
              headers: { "Content-Type": "application/json" },
            });
          } catch {
            return new Response(JSON.stringify({ analysis: json.choices[0].message.content, measurements: null }), {
              headers: { "Content-Type": "application/json" },
            });
          }
        } catch (err) {
          console.error("[analyze-image] Error:", err);
          return new Response(JSON.stringify({ analysis: "", measurements: null }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
