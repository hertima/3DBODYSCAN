import { gifCatalog } from "./gif-catalog";

export const GIF_BASE_PATH = "/gif-catalog";

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

export const exerciseGifMap: ExerciseGifMap = {
  "supino-reto": "Supino (1).gif",
  "supino-halter": "Supino com halteres (1).gif",
  crucifixo: "Crucifixo inclinado com halteres (1).gif",
  crossover: "CROSSOVER (1).gif",
  "remada-curvada": "Remanda Curvada Barra (1).gif",
  "remada-baixa": "remada baixa no pulley triangulo (1).gif",
  "puxada-frente": "Puxada alta tradicional (1).gif",
  "barra-fixa": "Barra Livre pegada aberta (1).gif",
  desenvolvimento: "Desenvolvimento com Barra (1).gif",
  "desenvolvimento-halter": "Desenvolvimento com Halteres (1).gif",
  "elevacao-lateral": "ElevaÇõÇœo lateral 01 (1).gif",
  "elevacao-cabos": "ElevaÇõÇœo lateral no cabo (1).gif",
  "rosca-direta": "Rosca direta (1).gif",
  "rosca-alternada": "Rosca alternada (1).gif",
  "rosca-martelo": "Rosca martelo 01 (1).gif",
  "triceps-corda": "Triceps cord (1).gif",
  "triceps-frances": "Triceps frances (1).gif",
  mergulho: "Paralelas (1).gif",
  agachamento: "Agachamento livre com barra (1).gif",
  "leg-press": "Leg press 45 (1).gif",
  stiff: "Stiff (1).gif",
  "levantamento-terra": "Levantamento terra (1).gif",
  "cadeira-extensora": "Cadeira extensora (1).gif",
  "mesa-flexora": "Mesa flexora (1).gif",
  panturrilha: "Panturrilha em pÇ¸ mÇ­quina (1).gif",
  "elevacao-quadril": "Hip thrust (1).gif",
  abdutor: "Cadeira abdutora (1).gif",
  prancha: "Prancha (1).gif",
  abdominal: "Abdominal Concentrado (1).gif",
  "leg-raise": "ElevaÇõÇœo de pernas solo (1).gif",
  "ab-roller": "ABS rolinho com barra (1).gif",
  flexao: "push-up-bars (1).gif",
  "muscle-up": "pull-up (1).gif",
  "pistol-squat": "Pistol (1).gif",
  handstand: "pike-push-up (1).gif",
  "front-lever": "inverted-row (1).gif",
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
  return gifCatalog.find((candidate) => candidate.endsWith(`/${fileName}`) || candidate === fileName) ?? null;
}

export function getExerciseGifUrl(exerciseId: string, exerciseName?: string) {
  const mappedFile = exerciseGifMap[exerciseId];
  const resolvedMappedFile = mappedFile ? resolveMappedFile(mappedFile) : null;
  const autoMatchedFile = resolvedMappedFile ? null : getAutoMatchedGif(exerciseId, exerciseName);
  const fileName = resolvedMappedFile ?? autoMatchedFile;

  if (!fileName) return null;

  return encodeURI(`${GIF_BASE_PATH}/${fileName}`);
}
