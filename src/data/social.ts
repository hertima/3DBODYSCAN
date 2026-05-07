export const volumeTrend = [
  { day: "Seg", volume: 6200 },
  { day: "Ter", volume: 0 },
  { day: "Qua", volume: 8420 },
  { day: "Qui", volume: 7100 },
  { day: "Sex", volume: 12350 },
  { day: "Sáb", volume: 5400 },
  { day: "Dom", volume: 0 },
];

export const muscleRadar = [
  { muscle: "Peito", value: 85 },
  { muscle: "Costas", value: 92 },
  { muscle: "Pernas", value: 78 },
  { muscle: "Ombros", value: 70 },
  { muscle: "Braços", value: 88 },
  { muscle: "Core", value: 65 },
];

export const consistencyHeatmap = Array.from({ length: 84 }, (_, i) => ({
  day: i,
  value: Math.floor(Math.random() * 5),
}));

export const progressionData = [
  { week: "S1", supino: 70, agachamento: 95, terra: 120 },
  { week: "S2", supino: 72, agachamento: 100, terra: 122 },
  { week: "S3", supino: 72, agachamento: 100, terra: 125 },
  { week: "S4", supino: 75, agachamento: 105, terra: 130 },
  { week: "S5", supino: 77, agachamento: 107, terra: 132 },
  { week: "S6", supino: 78, agachamento: 110, terra: 135 },
  { week: "S7", supino: 80, agachamento: 112, terra: 138 },
  { week: "S8", supino: 82, agachamento: 115, terra: 140 },
  { week: "S9", supino: 84, agachamento: 117, terra: 142 },
  { week: "S10", supino: 86, agachamento: 118, terra: 145 },
  { week: "S11", supino: 88, agachamento: 120, terra: 148 },
  { week: "S12", supino: 90, agachamento: 122, terra: 150 },
];

export type HistorySet = { reps: number; weight: number; pr?: boolean };
export type HistoryExercise = { name: string; muscle: string; sets: HistorySet[] };
export type HistoryEntry = {
  id: string;
  name: string;
  date: string;
  duration: number;
  volume: number;
  sets: number;
  prs: number;
  exercises: HistoryExercise[];
};

export const workoutHistory: HistoryEntry[] = [
  {
    id: "w1", name: "Push · Peito & Ombros", date: "Hoje", duration: 62, volume: 8420, sets: 22, prs: 1,
    exercises: [
      { name: "Supino Reto", muscle: "Peito", sets: [
        { reps: 10, weight: 60 }, { reps: 8, weight: 75 }, { reps: 6, weight: 85 }, { reps: 5, weight: 90, pr: true },
      ]},
      { name: "Supino Inclinado Halteres", muscle: "Peito", sets: [
        { reps: 12, weight: 24 }, { reps: 10, weight: 28 }, { reps: 8, weight: 30 },
      ]},
      { name: "Desenvolvimento Militar", muscle: "Ombro", sets: [
        { reps: 10, weight: 40 }, { reps: 8, weight: 45 }, { reps: 6, weight: 50 },
      ]},
      { name: "Elevação Lateral", muscle: "Ombro", sets: [
        { reps: 15, weight: 10 }, { reps: 12, weight: 12 }, { reps: 10, weight: 14 },
      ]},
      { name: "Tríceps Corda", muscle: "Tríceps", sets: [
        { reps: 15, weight: 25 }, { reps: 12, weight: 30 }, { reps: 10, weight: 35 },
      ]},
    ],
  },
  {
    id: "w2", name: "Pull · Costas & Bíceps", date: "Ontem", duration: 58, volume: 7890, sets: 20, prs: 0,
    exercises: [
      { name: "Barra Fixa", muscle: "Costas", sets: [
        { reps: 10, weight: 0 }, { reps: 8, weight: 0 }, { reps: 6, weight: 10 }, { reps: 5, weight: 15 },
      ]},
      { name: "Remada Curvada", muscle: "Costas", sets: [
        { reps: 10, weight: 60 }, { reps: 8, weight: 70 }, { reps: 6, weight: 80 },
      ]},
      { name: "Puxada Frontal", muscle: "Costas", sets: [
        { reps: 12, weight: 50 }, { reps: 10, weight: 55 }, { reps: 8, weight: 60 },
      ]},
      { name: "Rosca Direta", muscle: "Bíceps", sets: [
        { reps: 12, weight: 25 }, { reps: 10, weight: 28 }, { reps: 8, weight: 30 },
      ]},
    ],
  },
  {
    id: "w3", name: "Legs · Quadríceps", date: "3 dias", duration: 71, volume: 11240, sets: 24, prs: 2,
    exercises: [
      { name: "Agachamento Livre", muscle: "Quadríceps", sets: [
        { reps: 10, weight: 80 }, { reps: 8, weight: 100 }, { reps: 6, weight: 115 }, { reps: 5, weight: 122, pr: true },
      ]},
      { name: "Leg Press 45°", muscle: "Quadríceps", sets: [
        { reps: 12, weight: 180 }, { reps: 10, weight: 220 }, { reps: 8, weight: 250 },
      ]},
      { name: "Stiff", muscle: "Posterior", sets: [
        { reps: 10, weight: 70 }, { reps: 8, weight: 80 }, { reps: 6, weight: 90, pr: true },
      ]},
    ],
  },
  {
    id: "w4", name: "Push · Tríceps Focus", date: "5 dias", duration: 54, volume: 7120, sets: 19, prs: 0,
    exercises: [
      { name: "Supino Fechado", muscle: "Tríceps", sets: [
        { reps: 10, weight: 50 }, { reps: 8, weight: 60 }, { reps: 6, weight: 70 },
      ]},
      { name: "Tríceps Testa", muscle: "Tríceps", sets: [
        { reps: 12, weight: 25 }, { reps: 10, weight: 30 }, { reps: 8, weight: 35 },
      ]},
    ],
  },
  {
    id: "w5", name: "Pull · Deadlift Day", date: "1 semana", duration: 68, volume: 10880, sets: 21, prs: 1,
    exercises: [
      { name: "Levantamento Terra", muscle: "Posterior", sets: [
        { reps: 8, weight: 100 }, { reps: 5, weight: 130 }, { reps: 3, weight: 145 }, { reps: 3, weight: 150, pr: true },
      ]},
      { name: "Remada Cavalinho", muscle: "Costas", sets: [
        { reps: 10, weight: 60 }, { reps: 8, weight: 70 }, { reps: 6, weight: 80 },
      ]},
    ],
  },
  {
    id: "w6", name: "Full Body · Mobilidade", date: "10 dias", duration: 45, volume: 5230, sets: 16, prs: 0,
    exercises: [
      { name: "Goblet Squat", muscle: "Quadríceps", sets: [
        { reps: 12, weight: 20 }, { reps: 10, weight: 24 }, { reps: 8, weight: 28 },
      ]},
      { name: "Push-up", muscle: "Peito", sets: [
        { reps: 15, weight: 0 }, { reps: 12, weight: 0 }, { reps: 10, weight: 0 },
      ]},
    ],
  },
];

export const getHistoryEntry = (id: string) => workoutHistory.find((w) => w.id === id);

export const achievements = [
  { id: "a1", title: "Primeira Semana", desc: "7 dias treinando", unlocked: true, icon: "🔥" },
  { id: "a2", title: "Volume Lord", desc: "10.000 kg em uma sessão", unlocked: true, icon: "🏋️" },
  { id: "a3", title: "Disciplina Cinza", desc: "21 dias consecutivos", unlocked: true, icon: "🎯" },
  { id: "a4", title: "Skill Master", desc: "Front lever completo", unlocked: false, icon: "⚡" },
  { id: "a5", title: "Maratona", desc: "100 treinos completos", unlocked: false, icon: "🏆" },
  { id: "a6", title: "AI Adapted", desc: "30 dias com IA", unlocked: true, icon: "🧠" },
];
