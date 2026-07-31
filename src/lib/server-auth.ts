async function lookupToken(token: string): Promise<{ localId: string; email?: string } | null> {
  const apiKey = process.env.FIREBASE_API_KEY ?? process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { users?: Array<{ localId: string; email?: string }> };
    return data.users?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function verifyFirebaseToken(authHeader: string | null | undefined): Promise<string | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const user = await lookupToken(authHeader.slice(7));
  return user?.localId ?? null;
}

export async function getUserFromToken(authHeader: string | null | undefined): Promise<{ uid: string; email: string } | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const user = await lookupToken(authHeader.slice(7));
  if (!user?.localId || !user?.email) return null;
  return { uid: user.localId, email: user.email };
}
