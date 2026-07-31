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

async function generateOtpCode(uid: string, secret: string): Promise<string> {
  const window = Math.floor(Date.now() / (15 * 60 * 1000));
  const sig = await hmacSign(`otp:${uid}:${window}`, secret);
  const num = parseInt(sig.slice(0, 8), 16) % 1000000;
  return String(num).padStart(6, "0");
}

const EMAIL_COPY = {
  pt: {
    heading: "Confirme seu e-mail",
    body: "Digite este código no app para ativar sua conta:",
    expiry: "Expira em",
    expiryValue: "15 minutos",
    footer: "Se você não criou uma conta no 3D Body Scanner,\nignoré este e-mail com segurança.",
    subject: "Seu codigo de verificacao — 3D Body Scanner",
  },
  es: {
    heading: "Confirma tu correo",
    body: "Ingresa este código en la app para activar tu cuenta:",
    expiry: "Expira en",
    expiryValue: "15 minutos",
    footer: "Si no creaste una cuenta en 3D Body Scanner,\nignora este correo con seguridad.",
    subject: "Tu codigo de verificacion — 3D Body Scanner",
  },
  en: {
    heading: "Confirm your email",
    body: "Enter this code in the app to activate your account:",
    expiry: "Expires in",
    expiryValue: "15 minutes",
    footer: "If you didn't create a 3D Body Scanner account,\nyou can safely ignore this email.",
    subject: "Your verification code — 3D Body Scanner",
  },
  fr: {
    heading: "Confirmez votre e-mail",
    body: "Entrez ce code dans l'app pour activer votre compte :",
    expiry: "Expire dans",
    expiryValue: "15 minutes",
    footer: "Si vous n'avez pas créé de compte 3D Body Scanner,\nignoriez cet e-mail en toute sécurité.",
    subject: "Votre code de verification — 3D Body Scanner",
  },
  de: {
    heading: "E-Mail bestätigen",
    body: "Gib diesen Code in der App ein, um dein Konto zu aktivieren:",
    expiry: "Läuft ab in",
    expiryValue: "15 Minuten",
    footer: "Wenn du kein 3D Body Scanner-Konto erstellt hast,\nkannst du diese E-Mail ignorieren.",
    subject: "Dein Verifizierungscode — 3D Body Scanner",
  },
} as const;
type EmailLocale = keyof typeof EMAIL_COPY;

function buildEmailHtml(code: string, locale: EmailLocale = "pt"): string {
  const cp = EMAIL_COPY[locale] ?? EMAIL_COPY.pt;
  const [d0, d1, d2, d3, d4, d5] = code.split("");

  const box = (d: string) =>
    `<td style="padding:0 4px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr>` +
    `<td align="center" valign="middle" width="52" height="64" ` +
    `style="background-color:#0a0f1e;border:2px solid #22d3ee;border-radius:12px;width:52px;height:64px;">` +
    `<span style="font-size:30px;font-weight:900;color:#22d3ee;font-family:'Courier New',Courier,monospace;line-height:1;">${d}</span>` +
    `</td></tr></table></td>`;

  const sep =
    `<td style="padding:0 8px;vertical-align:middle;">` +
    `<span style="font-size:18px;color:#3f3f46;font-weight:700;line-height:1;">&#8211;</span>` +
    `</td>`;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090b;padding:40px 16px;font-family:Helvetica,Arial,sans-serif;">
<tr><td align="center">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:480px;">

  <tr><td align="center" style="padding-bottom:28px;">
    <img src="https://3dbodyscan.herculesacademiarv.workers.dev/MASCOTE%20SEM%20FUNDO.png" width="90" height="90" alt="3D Body Scanner" style="display:block;margin:0 auto;" />
  </td></tr>

  <tr><td style="background-color:#18181b;border:1px solid #27272a;border-radius:20px;overflow:hidden;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td height="4" style="background-color:#22d3ee;font-size:0;line-height:0;">&nbsp;</td></tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:44px 32px 40px;text-align:center;">

        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:5px;color:#22d3ee;text-transform:uppercase;">3D Body Scanner</p>
        <h1 style="margin:0 0 10px;font-size:24px;font-weight:800;color:#fafafa;line-height:1.2;letter-spacing:-0.3px;">${cp.heading}</h1>
        <p style="margin:0 0 36px;font-size:15px;line-height:1.7;color:#a1a1aa;">${cp.body}</p>

        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 10px;">
          <tr>${box(d0)}${box(d1)}${box(d2)}${sep}${box(d3)}${box(d4)}${box(d5)}</tr>
        </table>

        <p style="margin:20px 0 0;font-size:13px;color:#52525b;">
          ${cp.expiry} <span style="color:#e2e8f0;font-weight:600;">${cp.expiryValue}</span>
        </p>

      </td></tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="border-top:1px solid #27272a;padding:20px 32px;text-align:center;">
        <p style="margin:0;font-size:12px;line-height:1.7;color:#52525b;">
          ${cp.footer.replace("\n", "<br>")}
        </p>
      </td></tr>
    </table>

  </td></tr>

  <tr><td style="padding:24px 0 0;text-align:center;">
    <p style="margin:0;font-size:12px;color:#3f3f46;">&copy; 2025 3D Body Scanner &middot; Todos os direitos reservados</p>
  </td></tr>

</table>
</td></tr>
</table>`;
}

async function getGmailAccessToken(): Promise<string | null> {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

function buildRawEmail(to: string, subject: string, html: string): string {
  const boundary = "boundary_3dbodyscanner";
  const subjectEncoded = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const htmlB64Raw = btoa(unescape(encodeURIComponent(html)));
  const htmlB64 = htmlB64Raw.match(/.{1,76}/g)?.join("\r\n") ?? htmlB64Raw;
  const raw = [
    `From: 3D Body Scanner <bodyscanner.suporte@gmail.com>`,
    `To: ${to}`,
    `Subject: ${subjectEncoded}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    htmlB64,
    `--${boundary}--`,
  ].join("\r\n");
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const Route = createFileRoute("/api/send-verification")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getUserFromToken(request.headers.get("Authorization"));
        if (!user) return new Response("Unauthorized", { status: 401 });

        const locale = (request.headers.get("X-Locale") ?? "pt") as EmailLocale;
        const cp = EMAIL_COPY[locale] ?? EMAIL_COPY.pt;

        const secret = process.env.VERIFICATION_SECRET ?? "zyrox-verify-2025";
        const code = await generateOtpCode(user.uid, secret);

        const accessToken = await getGmailAccessToken();
        if (!accessToken) return new Response("Email service not configured", { status: 500 });

        const rawEmail = buildRawEmail(
          user.email,
          cp.subject,
          buildEmailHtml(code, locale)
        );

        const res = await fetch(
          "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ raw: rawEmail }),
          }
        );

        if (!res.ok) {
          const err = await res.text().catch(() => "");
          console.error("[send-verification] Gmail error:", err);
          return new Response("Failed to send email", { status: 500 });
        }

        return Response.json({ success: true });
      },
    },
  },
});
