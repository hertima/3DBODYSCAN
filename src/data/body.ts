export type BodyMeasure = {
  key: string;
  label: string;
  value: number;
  unit: string;
  delta: number; // cm change vs last week (+/-)
  history: number[]; // last 8 points
};

export const bodyMeasures: BodyMeasure[] = [
  { key: "peito", label: "Peito", value: 102, unit: "cm", delta: 1.2, history: [99, 99.5, 100, 100.4, 100.8, 101.2, 101.5, 102] },
  { key: "cintura", label: "Cintura", value: 78, unit: "cm", delta: -0.8, history: [82, 81.4, 80.8, 80.2, 79.7, 79.2, 78.6, 78] },
  { key: "quadril", label: "Quadril", value: 96, unit: "cm", delta: 0.3, history: [95, 95.1, 95.3, 95.4, 95.6, 95.7, 95.8, 96] },
  { key: "braco", label: "Braço", value: 36, unit: "cm", delta: 0.5, history: [34, 34.3, 34.6, 34.9, 35.2, 35.5, 35.8, 36] },
  { key: "coxa", label: "Coxa", value: 58, unit: "cm", delta: 0.4, history: [56.5, 56.8, 57, 57.2, 57.4, 57.6, 57.8, 58] },
  { key: "panturrilha", label: "Panturrilha", value: 39, unit: "cm", delta: 0.2, history: [38.2, 38.3, 38.5, 38.6, 38.7, 38.8, 38.9, 39] },
];

export const bodyComposition = {
  weight: 78.4,
  bodyFat: 14.2,
  muscleMass: 38.6,
};
