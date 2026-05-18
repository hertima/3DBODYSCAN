import { createFileRoute } from "@tanstack/react-router";
import { OPENAI_MODEL } from "@/lib/openai-config";

export const Route = createFileRoute("/api/analyze-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Auth opcional — usuário já autenticado pelo Firebase no client

        const key = process.env.OPENAI_API_KEY;
        if (!key) return new Response("API key not configured", { status: 500 });

        const { imageBase64, userContext, locale, kind, height, weight } = (await request.json()) as {
          imageBase64: string;
          userContext: string;
          locale: string;
          kind: "body" | "food";
          height?: number;
          weight?: number;
        };

        const LANGUAGE_NAME: Record<string, string> = {
          pt: "português brasileiro", es: "español", en: "English", fr: "français", de: "Deutsch",
        };
        const lang = LANGUAGE_NAME[locale] ?? LANGUAGE_NAME.pt;

        let systemContent: string;
        let userText: string;

        if (kind === "body") {
          const cal = height && weight ? `Calibration data: height=${height}cm, weight=${weight}kg.` : "";
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
