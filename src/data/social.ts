export type FeedPost = {
  id: string;
  user: string;
  handle: string;
  avatar: string;
  time: string;
  workout: string;
  volume: number;
  pr?: string;
  likes: number;
  comments: number;
  caption: string;
};

export const feed: FeedPost[] = [
  { id: "1", user: "Lucas Mendes", handle: "@lucasm", avatar: "LM", time: "12 min", workout: "Push Day", volume: 8420, pr: "Supino 90kg x 5", likes: 142, comments: 12, caption: "Novo PR no supino. Bora 💪" },
  { id: "2", user: "Ana Ribeiro", handle: "@anarib", avatar: "AR", time: "1 h", workout: "Skill Calistenia", volume: 0, pr: "Front lever 5s", likes: 211, comments: 28, caption: "Front lever consistente pela primeira vez 🔥" },
  { id: "3", user: "Diego Souza", handle: "@diegoz", avatar: "DS", time: "2 h", workout: "Leg Day", volume: 12350, likes: 89, comments: 6, caption: "Volume insano hoje. IA mandou deload semana que vem." },
  { id: "4", user: "Carla Pinto", handle: "@carlap", avatar: "CP", time: "5 h", workout: "Pull Day", volume: 7890, pr: "Barra fixa 12 reps", likes: 174, comments: 19, caption: "12 barras limpas. Ano passado fazia 3." },
  { id: "5", user: "Renan Alves", handle: "@renan", avatar: "RA", time: "8 h", workout: "Core Burn", volume: 0, likes: 56, comments: 4, caption: "Core liso pós treino." },
];

export const ranking = [
  { rank: 1, name: "Bruno Castro", xp: 18420, streak: 47 },
  { rank: 2, name: "Marina Lopes", xp: 17905, streak: 42 },
  { rank: 3, name: "Você", xp: 16480, streak: 21 },
  { rank: 4, name: "Lucas Mendes", xp: 15110, streak: 18 },
  { rank: 5, name: "Ana Ribeiro", xp: 14620, streak: 33 },
  { rank: 6, name: "Diego Souza", xp: 13880, streak: 12 },
  { rank: 7, name: "Carla Pinto", xp: 13210, streak: 25 },
  { rank: 8, name: "Renan Alves", xp: 11990, streak: 9 },
];

export const challenges = [
  { id: "c1", title: "Octubre de Volume", goal: "30.000 kg em 30 dias", progress: 64, days: 9 },
  { id: "c2", title: "Streak Elite", goal: "30 dias consecutivos", progress: 70, days: 9 },
  { id: "c3", title: "100 Pull-ups Diárias", goal: "100/dia por 21 dias", progress: 38, days: 13 },
];

export const achievements = [
  { id: "a1", title: "Primeira Semana", desc: "7 dias treinando", unlocked: true, icon: "🔥" },
  { id: "a2", title: "Volume Lord", desc: "10.000 kg em uma sessão", unlocked: true, icon: "🏋️" },
  { id: "a3", title: "Disciplina Cinza", desc: "21 dias consecutivos", unlocked: true, icon: "🎯" },
  { id: "a4", title: "Skill Master", desc: "Front lever completo", unlocked: false, icon: "⚡" },
  { id: "a5", title: "Maratona", desc: "100 treinos completos", unlocked: false, icon: "🏆" },
  { id: "a6", title: "AI Adapted", desc: "30 dias com IA", unlocked: true, icon: "🧠" },
];

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

export const personalRecords = [
  { exercise: "Supino Reto", value: "90 kg × 5", date: "Hoje" },
  { exercise: "Agachamento", value: "120 kg × 5", date: "2 dias" },
  { exercise: "Levantamento Terra", value: "150 kg × 3", date: "5 dias" },
];

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

export const workoutHistory = [
  { id: "w1", name: "Push · Peito & Ombros", date: "Hoje", duration: 62, volume: 8420, sets: 22, prs: 1 },
  { id: "w2", name: "Pull · Costas & Bíceps", date: "Ontem", duration: 58, volume: 7890, sets: 20, prs: 0 },
  { id: "w3", name: "Legs · Quadríceps", date: "3 dias", duration: 71, volume: 11240, sets: 24, prs: 2 },
  { id: "w4", name: "Push · Tríceps Focus", date: "5 dias", duration: 54, volume: 7120, sets: 19, prs: 0 },
  { id: "w5", name: "Pull · Deadlift Day", date: "1 semana", duration: 68, volume: 10880, sets: 21, prs: 1 },
  { id: "w6", name: "Full Body · Mobilidade", date: "10 dias", duration: 45, volume: 5230, sets: 16, prs: 0 },
];
