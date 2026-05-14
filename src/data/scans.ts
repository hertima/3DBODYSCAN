export type OrigemScan = "camera" | "galeria";
export type VestimentaScan = "justa" | "normal" | "larga";
export type NivelQualidadeScan = "ruim" | "media" | "boa";

export type EstimativasScanCorporal = {
  peitoCmEstimado: number;
  cinturaCmEstimada: number;
  quadrilCmEstimado: number;
  bracoCmEstimado: number;
  coxaCmEstimada: number;
  panturrilhaCmEstimada: number;
  percentualGorduraEstimado: number;
};

export type CalibragemScanCorporal = {
  alturaCm: number;
  pesoKg: number;
  vestimenta: VestimentaScan;
};

export type QualidadeScanCorporal = {
  iluminacao: NivelQualidadeScan;
  enquadramento: NivelQualidadeScan;
  postura: NivelQualidadeScan;
  confiancaLeitura: number;
};

export type AnaliseDerivadaIA = {
  tendenciaCorporal: string;
  prioridadeMuscular: string[];
  sinalDeRecomposicao: string;
  mudancaDesdeUltimoScan: string;
};

export type BodyScan = {
  id: string;
  data: string;
  miniatura: string;
  origem: OrigemScan;
  calibragem: CalibragemScanCorporal;
  estimativas: EstimativasScanCorporal;
  qualidade: QualidadeScanCorporal;
  analiseIA: AnaliseDerivadaIA;
};

export type FoodScan = {
  id: string;
  data: string;
  refeicao: string;
  miniatura: string;
  origem: OrigemScan;
  estimativas: {
    kcal: number;
    proteinaG: number;
    carboG: number;
  };
  qualidade: {
    confiancaLeitura: number;
  };
};

export const bodyScans: BodyScan[] = [
  {
    id: "b1",
    data: "2026-05-06",
    miniatura: "linear-gradient(135deg,#1a2740,#0f1a2e)",
    origem: "camera",
    calibragem: { alturaCm: 178, pesoKg: 78.4, vestimenta: "normal" },
    estimativas: {
      peitoCmEstimado: 102,
      cinturaCmEstimada: 78,
      quadrilCmEstimado: 96,
      bracoCmEstimado: 36,
      coxaCmEstimada: 58,
      panturrilhaCmEstimada: 39,
      percentualGorduraEstimado: 14.2,
    },
    qualidade: {
      iluminacao: "boa",
      enquadramento: "boa",
      postura: "boa",
      confiancaLeitura: 92,
    },
    analiseIA: {
      tendenciaCorporal: "recomposicao",
      prioridadeMuscular: ["peitoral", "deltoides"],
      sinalDeRecomposicao: "cintura reduzindo com manutencao de peitoral",
      mudancaDesdeUltimoScan: "ganho visual de tronco com queda de gordura",
    },
  },
  {
    id: "b2",
    data: "2026-04-29",
    miniatura: "linear-gradient(135deg,#1a2540,#0d1828)",
    origem: "galeria",
    calibragem: { alturaCm: 178, pesoKg: 78.9, vestimenta: "normal" },
    estimativas: {
      peitoCmEstimado: 101.5,
      cinturaCmEstimada: 78.6,
      quadrilCmEstimado: 95.8,
      bracoCmEstimado: 35.8,
      coxaCmEstimada: 57.8,
      panturrilhaCmEstimada: 38.9,
      percentualGorduraEstimado: 14.6,
    },
    qualidade: {
      iluminacao: "boa",
      enquadramento: "boa",
      postura: "media",
      confiancaLeitura: 89,
    },
    analiseIA: {
      tendenciaCorporal: "recomposicao",
      prioridadeMuscular: ["peitoral", "abdomen_core"],
      sinalDeRecomposicao: "cintura em queda gradual",
      mudancaDesdeUltimoScan: "tronco mais seco e cintura menor",
    },
  },
  {
    id: "b3",
    data: "2026-04-22",
    miniatura: "linear-gradient(135deg,#16223a,#0c1626)",
    origem: "camera",
    calibragem: { alturaCm: 178, pesoKg: 79.2, vestimenta: "normal" },
    estimativas: {
      peitoCmEstimado: 101.2,
      cinturaCmEstimada: 79.2,
      quadrilCmEstimado: 95.7,
      bracoCmEstimado: 35.5,
      coxaCmEstimada: 57.6,
      panturrilhaCmEstimada: 38.8,
      percentualGorduraEstimado: 14.9,
    },
    qualidade: {
      iluminacao: "media",
      enquadramento: "boa",
      postura: "boa",
      confiancaLeitura: 87,
    },
    analiseIA: {
      tendenciaCorporal: "ajuste_estetico",
      prioridadeMuscular: ["abdomen_core", "peitoral"],
      sinalDeRecomposicao: "gordura visual estabilizando",
      mudancaDesdeUltimoScan: "leve reducao de cintura",
    },
  },
  {
    id: "b4",
    data: "2026-04-15",
    miniatura: "linear-gradient(135deg,#142036,#0a1322)",
    origem: "camera",
    calibragem: { alturaCm: 178, pesoKg: 79.5, vestimenta: "normal" },
    estimativas: {
      peitoCmEstimado: 100.8,
      cinturaCmEstimada: 79.7,
      quadrilCmEstimado: 95.6,
      bracoCmEstimado: 35.2,
      coxaCmEstimada: 57.4,
      panturrilhaCmEstimada: 38.7,
      percentualGorduraEstimado: 15.2,
    },
    qualidade: {
      iluminacao: "media",
      enquadramento: "media",
      postura: "boa",
      confiancaLeitura: 84,
    },
    analiseIA: {
      tendenciaCorporal: "ajuste_estetico",
      prioridadeMuscular: ["abdomen_core"],
      sinalDeRecomposicao: "cintura ainda acima do alvo",
      mudancaDesdeUltimoScan: "melhora inicial de definicao",
    },
  },
  {
    id: "b5",
    data: "2026-04-08",
    miniatura: "linear-gradient(135deg,#121e32,#091120)",
    origem: "galeria",
    calibragem: { alturaCm: 178, pesoKg: 79.9, vestimenta: "larga" },
    estimativas: {
      peitoCmEstimado: 100.4,
      cinturaCmEstimada: 80.2,
      quadrilCmEstimado: 95.4,
      bracoCmEstimado: 34.9,
      coxaCmEstimada: 57.2,
      panturrilhaCmEstimada: 38.6,
      percentualGorduraEstimado: 15.6,
    },
    qualidade: {
      iluminacao: "media",
      enquadramento: "media",
      postura: "media",
      confiancaLeitura: 79,
    },
    analiseIA: {
      tendenciaCorporal: "baseline",
      prioridadeMuscular: ["abdomen_core"],
      sinalDeRecomposicao: "ponto inicial do bloco",
      mudancaDesdeUltimoScan: "sem comparacao relevante",
    },
  },
  {
    id: "b6",
    data: "2026-04-01",
    miniatura: "linear-gradient(135deg,#101b2e,#080f1d)",
    origem: "camera",
    calibragem: { alturaCm: 178, pesoKg: 80.3, vestimenta: "normal" },
    estimativas: {
      peitoCmEstimado: 100,
      cinturaCmEstimada: 80.8,
      quadrilCmEstimado: 95,
      bracoCmEstimado: 34.6,
      coxaCmEstimada: 57,
      panturrilhaCmEstimada: 38.5,
      percentualGorduraEstimado: 15.9,
    },
    qualidade: {
      iluminacao: "boa",
      enquadramento: "media",
      postura: "media",
      confiancaLeitura: 81,
    },
    analiseIA: {
      tendenciaCorporal: "baseline",
      prioridadeMuscular: ["peitoral", "abdomen_core"],
      sinalDeRecomposicao: "scan inicial do ciclo",
      mudancaDesdeUltimoScan: "ponto zero",
    },
  },
];

export const foodScans: FoodScan[] = [
  {
    id: "f1",
    data: "2026-05-07",
    refeicao: "Almoco",
    miniatura: "linear-gradient(135deg,#3a2410,#1f1408)",
    origem: "camera",
    estimativas: { kcal: 520, proteinaG: 32, carboG: 48 },
    qualidade: { confiancaLeitura: 88 },
  },
  {
    id: "f2",
    data: "2026-05-06",
    refeicao: "Jantar",
    miniatura: "linear-gradient(135deg,#2e1f10,#1a1208)",
    origem: "galeria",
    estimativas: { kcal: 610, proteinaG: 41, carboG: 52 },
    qualidade: { confiancaLeitura: 91 },
  },
  {
    id: "f3",
    data: "2026-05-06",
    refeicao: "Cafe",
    miniatura: "linear-gradient(135deg,#3a2e10,#1f1908)",
    origem: "camera",
    estimativas: { kcal: 380, proteinaG: 22, carboG: 41 },
    qualidade: { confiancaLeitura: 84 },
  },
  {
    id: "f4",
    data: "2026-05-05",
    refeicao: "Almoco",
    miniatura: "linear-gradient(135deg,#2a2410,#161208)",
    origem: "camera",
    estimativas: { kcal: 560, proteinaG: 36, carboG: 58 },
    qualidade: { confiancaLeitura: 86 },
  },
  {
    id: "f5",
    data: "2026-05-04",
    refeicao: "Lanche",
    miniatura: "linear-gradient(135deg,#3a2818,#20140a)",
    origem: "galeria",
    estimativas: { kcal: 220, proteinaG: 14, carboG: 22 },
    qualidade: { confiancaLeitura: 79 },
  },
];

export function formatScanDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
