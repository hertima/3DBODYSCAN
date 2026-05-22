import { gifCatalog } from "./gif-catalog";

export const GIF_BASE_PATH = "/musculacao-media";

type ExerciseGifMap = Record<string, string>;

const STOP_WORDS = new Set([
  "com",
  "de",
  "do",
  "da",
  "no",
  "na",
  "em",
  "para",
  "pegada",
  "livre",
  "banco",
  "maquina",
  "smith",
  "barra",
  "halteres",
  "halter",
  "cabo",
  "cross",
  "peso",
  "corporal",
  "solo",
  "reto",
  "tradicional",
  "unilateral",
  "bilateral",
  "sentado",
  "sentada",
  "inclinado",
  "frontal",
]);

const CALISTENIA_PATH = "/calistenia-pura/Calistenia";

export const exerciseGifMap: ExerciseGifMap = {
  // ── Calistenia / Peso Corporal ───────────────────────────────────
  "remada-australiana": `${CALISTENIA_PATH}/Remada Invertida na Mesa.mp4`,
  "curl-barra-fixa": `${CALISTENIA_PATH}/Barra Fixa para o Braquial.mp4`,
  "elevacao-toalha": `${CALISTENIA_PATH}/Elevação lateral com toalha na parede.mp4`,
  "pike-push-up": `${CALISTENIA_PATH}/Flexão inclinada.mp4`,
  "flexao-fechada": `${CALISTENIA_PATH}/Flexão Fechada com bola medicinal.mp4`,
  "dips-cadeira": `${CALISTENIA_PATH}/Dips na cadeira.mp4`,
  "agachamento-bulgaro-pc": `${CALISTENIA_PATH}/Agachamento Búlgaro com Peso Corporal.mp4`,
  "hip-thrust-solo": `${CALISTENIA_PATH}/Ponte em Unilateral.mp4`,
  "agachamento-pc": `${CALISTENIA_PATH}/Agachamento.mp4`,
  "afundo-pc": `${CALISTENIA_PATH}/Afundo.mp4`,
  "ponte-gluteos-unilateral": "single-leg-glute-bridge (1).mp4",
  "panturrilha-pc": `${CALISTENIA_PATH}/Elevação de panturrilha em pé.mp4`,
  "superman": "superman (1).mp4",
"panturrilha-halter": "Panturrilha com halteres (1).mp4",
  // ── Musculação ───────────────────────────────────────────────────
  "supino-reto": "Supino (1).mp4",
  "supino-halter": "Supino com halteres (1).mp4",
  crucifixo: "Crucifixo inclinado com halteres (1).mp4",
  crossover: "CROSSOVER (1).mp4",
  "remada-curvada": "Remanda Curvada Barra (1).mp4",
  "remada-baixa": "remada baixa no pulley triangulo (1).mp4",
  "puxada-frente": "Puxada alta tradicional (1).mp4",
  "barra-fixa": "Barra Livre pegada aberta (1).mp4",
  desenvolvimento: "Desenvolvimento com Barra (1).mp4",
  "desenvolvimento-halter": "Desenvolvimento com Halteres (1).mp4",
  "elevacao-lateral": "Elevação lateral 01 (1).mp4",
  "elevacao-cabos": "Elevação lateral no cabo (1).mp4",
  "rosca-direta": "Rosca direta (1).mp4",
  "rosca-alternada": "Rosca alternada (1).mp4",
  "rosca-martelo": "Rosca martelo 01 (1).mp4",
  "triceps-corda": "Triceps cord (1).mp4",
  "triceps-frances": "Triceps frances (1).mp4",
  "mergulho": "Paralelas (1).mp4",
  "agachamento": "Agachamento livre com barra (1).mp4",
  "leg-press": "Leg press 45 (1).mp4",
  "stiff": "Stiff (1).mp4",
  "levantamento-terra": "Levantamento terra (1).mp4",
  "cadeira-extensora": "Cadeira extensora (1).mp4",
  "mesa-flexora": "Mesa flexora (1).mp4",
  "panturrilha": "Panturrilha em pé máquina (1).mp4",
  "elevacao-quadril": "Hip thrust (1).mp4",
  "abdutor": "Cadeira abdutora (1).mp4",
  "prancha": "Prancha (1).mp4",
  "abdominal": "Abdominal Concentrado (1).mp4",
  "leg-raise": "Elevação de pernas solo (1).mp4",
  "ab-roller": "ABS rolinho com barra (1).mp4",
  flexao: "push-up-bars (1).mp4",
  "muscle-up": "pull-up (1).mp4",
  "pistol-squat": "Pistol (1).mp4",
  handstand: "pike-push-up (1).mp4",
  "front-lever": "inverted-row (1).mp4",
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokenize(value: string) {
  return normalize(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token && !STOP_WORDS.has(token));
}

function scoreCatalogMatch(tokens: string[], candidate: string) {
  const normalizedCandidate = normalize(candidate);
  let score = 0;

  for (const token of tokens) {
    if (normalizedCandidate.includes(token)) score += token.length;
  }

  return score;
}

function getAutoMatchedGif(exerciseId: string, exerciseName?: string) {
  const tokens = Array.from(
    new Set([...tokenize(exerciseId.replaceAll("-", " ")), ...tokenize(exerciseName ?? "")]),
  );

  if (tokens.length === 0) return null;

  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const fileName of gifCatalog) {
    const score = scoreCatalogMatch(tokens, fileName);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = fileName;
    }
  }

  return bestScore >= 8 ? bestMatch : null;
}

function resolveMappedFile(fileName: string) {
  const target = fileName.toLowerCase();
  return (
    gifCatalog.find((candidate) => {
      const lower = candidate.toLowerCase();
      return lower.endsWith(`/${target}`) || lower === target;
    }) ?? null
  );
}

export function getExerciseGifUrl(exerciseId: string, exerciseName?: string) {
  const mappedFile = exerciseGifMap[exerciseId];

  // caminho absoluto (calistenia ou outra pasta fora de GIF_BASE_PATH)
  if (mappedFile?.startsWith("/")) return encodeURI(mappedFile);

  const resolvedMappedFile = mappedFile ? resolveMappedFile(mappedFile) : null;
  const autoMatchedFile = resolvedMappedFile ? null : getAutoMatchedGif(exerciseId, exerciseName);
  const fileName = resolvedMappedFile ?? autoMatchedFile;

  if (!fileName) return null;

  return encodeURI(`${GIF_BASE_PATH}/${fileName}`);
}
