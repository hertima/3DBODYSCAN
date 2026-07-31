import { createFileRoute } from "@tanstack/react-router";
import { getUserFromToken } from "@/lib/server-auth";

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

async function isValidOtp(uid: string, code: string, secret: string): Promise<boolean> {
  const now = Math.floor(Date.now() / (15 * 60 * 1000));
  for (const w of [now, now - 1]) {
    const sig = await hmacSign(`otp:${uid}:${w}`, secret);
    const num = parseInt(sig.slice(0, 8), 16) % 1000000;
    if (String(num).padStart(6, "0") === code) return true;
  }
  return false;
}

export const Route = createFileRoute("/api/verify-code")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getUserFromToken(request.headers.get("Authorization"));
        if (!user) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json()) as { code?: string };
        const { code } = body;

        if (!code || !/^\d{6}$/.test(code)) {
          return Response.json({ valid: false, reason: "invalid_format" });
        }

        const secret = process.env.VERIFICATION_SECRET ?? "zyrox-verify-2025";
        const valid = await isValidOtp(user.uid, code, secret);

        return Response.json({ valid, reason: valid ? undefined : "invalid_code" });
      },
    },
  },
});
