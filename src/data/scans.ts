export type BodyScan = {
  id: string;
  date: string; // ISO
  thumb: string; // gradient seed or url
  estimates: { chest: number; waist: number; bodyFat: number };
};

export type FoodScan = {
  id: string;
  date: string;
  meal: string;
  thumb: string;
  estimates: { kcal: number; protein: number; carbs: number };
};

export const bodyScans: BodyScan[] = [
  { id: "b1", date: "2026-05-06", thumb: "linear-gradient(135deg,#1a2740,#0f1a2e)", estimates: { chest: 102, waist: 78, bodyFat: 14.2 } },
  { id: "b2", date: "2026-04-29", thumb: "linear-gradient(135deg,#1a2540,#0d1828)", estimates: { chest: 101.5, waist: 78.6, bodyFat: 14.6 } },
  { id: "b3", date: "2026-04-22", thumb: "linear-gradient(135deg,#16223a,#0c1626)", estimates: { chest: 101.2, waist: 79.2, bodyFat: 14.9 } },
  { id: "b4", date: "2026-04-15", thumb: "linear-gradient(135deg,#142036,#0a1322)", estimates: { chest: 100.8, waist: 79.7, bodyFat: 15.2 } },
  { id: "b5", date: "2026-04-08", thumb: "linear-gradient(135deg,#121e32,#091120)", estimates: { chest: 100.4, waist: 80.2, bodyFat: 15.6 } },
  { id: "b6", date: "2026-04-01", thumb: "linear-gradient(135deg,#101b2e,#080f1d)", estimates: { chest: 100, waist: 80.8, bodyFat: 15.9 } },
];

export const foodScans: FoodScan[] = [
  { id: "f1", date: "2026-05-07", meal: "Almoço", thumb: "linear-gradient(135deg,#3a2410,#1f1408)", estimates: { kcal: 520, protein: 32, carbs: 48 } },
  { id: "f2", date: "2026-05-06", meal: "Jantar", thumb: "linear-gradient(135deg,#2e1f10,#1a1208)", estimates: { kcal: 610, protein: 41, carbs: 52 } },
  { id: "f3", date: "2026-05-06", meal: "Café", thumb: "linear-gradient(135deg,#3a2e10,#1f1908)", estimates: { kcal: 380, protein: 22, carbs: 41 } },
  { id: "f4", date: "2026-05-05", meal: "Almoço", thumb: "linear-gradient(135deg,#2a2410,#161208)", estimates: { kcal: 560, protein: 36, carbs: 58 } },
  { id: "f5", date: "2026-05-04", meal: "Lanche", thumb: "linear-gradient(135deg,#3a2818,#20140a)", estimates: { kcal: 220, protein: 14, carbs: 22 } },
];

export function formatScanDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
