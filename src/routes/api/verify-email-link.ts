import { createFileRoute } from "@tanstack/react-router";

async function hmacSign(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const Route = createFileRoute("/api/verify-email-link")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { uid?: string; exp?: string; tok?: string };
        const { uid, exp, tok } = body;

        if (!uid || !exp || !tok) {
          return Response.json({ valid: false, reason: "missing_params" });
        }

        const expNum = Number(exp);
        if (isNaN(expNum) || Date.now() > expNum) {
          return Response.json({ valid: false, reason: "expired" });
        }

        const secret = process.env.VERIFICATION_SECRET ?? "zyrox-verify-2025";
        const expected = await hmacSign(`${uid}:${exp}`, secret);

        if (tok !== expected) {
          return Response.json({ valid: false, reason: "invalid_token" });
        }

        return Response.json({ valid: true });
      },
    },
  },
});
