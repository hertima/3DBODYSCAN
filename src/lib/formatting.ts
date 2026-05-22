export function normalizeText(value: string) {
  return cleanLegacyText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
function repairUtf8MojibakeOnce(value: string) {
  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0) & 0xff);
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return value;
  }
}
function repairUtf8Mojibake(value: string) {
  let current = value;
  for (let index = 0; index < 2; index += 1) {
    const repaired = repairUtf8MojibakeOnce(current);
    if (repaired === current) break;
    current = repaired;
  }
  return current;
}
function cleanupSymbols(value: string) {
  return value
    .replaceAll("?", " graus")
    .replaceAll("?", " graus")
    .replaceAll("?", " | ")
    .replaceAll("?", "-")
    .replaceAll("?", "-")
    .replaceAll("?", "-")
    .replaceAll("?", "x")
    .replaceAll("?", "'")
    .replaceAll("?", "'")
    .replaceAll("?", '"')
    .replaceAll("?", '"')
    .replaceAll("??", " | ")
    .replaceAll("??", " | ")
    .replaceAll("??", " ")
    .replaceAll("??", "ao")
    .replaceAll("??", "a")
    .replaceAll("??", "e")
    .replaceAll("??", "a")
    .replaceAll("??", "i")
    .replaceAll("??", "u")
    .replaceAll("??", "o")
    .replaceAll("??", "e")
    .replaceAll("??", " graus");
}
export function cleanLegacyText(value: string) {
  const baseValue = String(value ?? "");
  const repairedValue = repairUtf8Mojibake(baseValue);
  const asciiValue = cleanupSymbols(repairedValue)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return cleanupSymbols(asciiValue)
    .replace(/\s*\|\s*/g, " | ")
    .replace(/\s+/g, " ")
    .trim();
}
