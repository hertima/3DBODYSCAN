export type MuscleGroup =
  | "Peito" | "Costas" | "Ombros" | "Bíceps" | "Tríceps"
  | "Pernas" | "Glúteos" | "Core" | "Antebraço" | "Full Body";

export type ExerciseType = "Musculação" | "Calistenia";

export type Exercise = {
  id: string;
  name: string;
  type: ExerciseType;
  muscle: MuscleGroup;
  muscleSecondary?: MuscleGroup[];
  equipment: string;
  biomechanics: string;
  instructions: string[];
  mistakes: string[];
  alternatives: string[];
  gifUrl?: string;
};

export const exercises: Exercise[] = [
  { id: "supino-reto", name: "Supino Reto", type: "Musculação", muscle: "Peito", equipment: "Barra", biomechanics: "Empurrar horizontal", instructions: ["Deite no banco com os pés firmes no chão", "Pegada um pouco mais aberta que os ombros", "Desça a barra controlado até o peito", "Empurre explosivo mantendo escápulas retraídas"], mistakes: ["Arquear lombar excessivamente", "Cotovelos abertos 90°", "Saltar barra do peito"], alternatives: ["supino-halter", "flexao"] },
  { id: "supino-halter", name: "Supino com Halteres", type: "Musculação", muscle: "Peito", equipment: "Halteres", biomechanics: "Empurrar horizontal", instructions: ["Halteres na altura do peito", "Empurre em arco até quase tocar"], mistakes: ["Travar cotovelos", "Pouca amplitude"], alternatives: ["supino-reto", "crucifixo"] },
  { id: "crucifixo", name: "Crucifixo", type: "Musculação", muscle: "Peito", equipment: "Halteres", biomechanics: "Adução horizontal", instructions: ["Cotovelos levemente flexionados", "Abra controlado e feche contraindo o peito"], mistakes: ["Descer demais e perder tensão"], alternatives: ["crossover"] },
  { id: "crossover", name: "Crossover Cabos", type: "Musculação", muscle: "Peito", equipment: "Cabos", biomechanics: "Adução horizontal", instructions: ["Inclinação leve à frente", "Puxe cruzando à frente"], mistakes: ["Usar peso demais"], alternatives: ["crucifixo"] },

  { id: "remada-curvada", name: "Remada Curvada", type: "Musculação", muscle: "Costas", equipment: "Barra", biomechanics: "Puxar horizontal", instructions: ["Tronco a 45°", "Puxe a barra ao umbigo", "Aperte escápulas"], mistakes: ["Tronco subindo a cada repetição"], alternatives: ["remada-baixa", "remada-cavalinho"] },
  { id: "remada-baixa", name: "Remada Baixa", type: "Musculação", muscle: "Costas", equipment: "Cabos", biomechanics: "Puxar horizontal", instructions: ["Coluna neutra", "Puxe ao abdômen"], mistakes: ["Balançar tronco"], alternatives: ["remada-curvada"] },
  { id: "puxada-frente", name: "Puxada Frontal", type: "Musculação", muscle: "Costas", equipment: "Cabos", biomechanics: "Puxar vertical", instructions: ["Pegada pronada larga", "Puxe ao peito alto"], mistakes: ["Inclinar demais"], alternatives: ["barra-fixa"] },
  { id: "barra-fixa", name: "Barra Fixa", type: "Calistenia", muscle: "Costas", equipment: "Barra fixa", biomechanics: "Puxar vertical", instructions: ["Suba até queixo passar a barra", "Desça controlado total"], mistakes: ["Balanço com pernas"], alternatives: ["puxada-frente"] },

  { id: "desenvolvimento", name: "Desenvolvimento Militar", type: "Musculação", muscle: "Ombros", equipment: "Barra", biomechanics: "Empurrar vertical", instructions: ["Barra na altura do queixo", "Empurre acima da cabeça"], mistakes: ["Arquear lombar"], alternatives: ["desenvolvimento-halter"] },
  { id: "desenvolvimento-halter", name: "Desenvolvimento com Halteres", type: "Musculação", muscle: "Ombros", equipment: "Halteres", biomechanics: "Empurrar vertical", instructions: ["Halteres na altura dos ombros", "Suba em arco"], mistakes: ["Tocar halteres no topo bruscamente"], alternatives: ["desenvolvimento"] },
  { id: "elevacao-lateral", name: "Elevação Lateral", type: "Musculação", muscle: "Ombros", equipment: "Halteres", biomechanics: "Abdução", instructions: ["Cotovelos levemente flexionados", "Suba até linha do ombro"], mistakes: ["Usar trapézio"], alternatives: ["elevacao-cabos"] },
  { id: "elevacao-cabos", name: "Elevação Lateral Cabos", type: "Musculação", muscle: "Ombros", equipment: "Cabos", biomechanics: "Abdução", instructions: ["Cabo cruza pelo corpo"], mistakes: ["Inclinar tronco"], alternatives: ["elevacao-lateral"] },

  { id: "rosca-direta", name: "Rosca Direta", type: "Musculação", muscle: "Bíceps", equipment: "Barra", biomechanics: "Flexão de cotovelo", instructions: ["Cotovelos colados ao tronco", "Suba contraindo bíceps"], mistakes: ["Balanço de tronco"], alternatives: ["rosca-alternada"] },
  { id: "rosca-alternada", name: "Rosca Alternada", type: "Musculação", muscle: "Bíceps", equipment: "Halteres", biomechanics: "Flexão de cotovelo", instructions: ["Supinação no meio do movimento"], mistakes: ["Movimento muito rápido"], alternatives: ["rosca-direta"] },
  { id: "rosca-martelo", name: "Rosca Martelo", type: "Musculação", muscle: "Bíceps", equipment: "Halteres", biomechanics: "Flexão neutra", instructions: ["Pegada neutra", "Trabalha braquial"], mistakes: ["Usar inércia"], alternatives: ["rosca-alternada"] },

  { id: "triceps-corda", name: "Tríceps Corda", type: "Musculação", muscle: "Tríceps", equipment: "Cabos", biomechanics: "Extensão", instructions: ["Cotovelos fixos", "Abra a corda no final"], mistakes: ["Mover cotovelo"], alternatives: ["triceps-frances"] },
  { id: "triceps-frances", name: "Tríceps Francês", type: "Musculação", muscle: "Tríceps", equipment: "Halteres", biomechanics: "Extensão", instructions: ["Cotovelos apontando ao teto", "Desça atrás da cabeça"], mistakes: ["Abrir cotovelos"], alternatives: ["triceps-corda"] },
  { id: "mergulho", name: "Mergulho em Paralelas", type: "Calistenia", muscle: "Tríceps", equipment: "Paralelas", biomechanics: "Empurrar vertical", instructions: ["Tronco vertical para tríceps", "Desça até 90°"], mistakes: ["Cabeça caindo à frente"], alternatives: ["triceps-corda"] },

  { id: "agachamento", name: "Agachamento Livre", type: "Musculação", muscle: "Pernas", equipment: "Barra", biomechanics: "Agachamento", instructions: ["Barra apoiada no trapézio", "Desça até paralelo", "Suba empurrando o chão"], mistakes: ["Joelhos colapsando para dentro", "Lombar arredondada"], alternatives: ["leg-press", "agachamento-livre"] },
  { id: "leg-press", name: "Leg Press 45°", type: "Musculação", muscle: "Pernas", equipment: "Máquina", biomechanics: "Empurrar pernas", instructions: ["Pés na largura dos ombros", "Desça até 90°"], mistakes: ["Tirar quadril do banco"], alternatives: ["agachamento"] },
  { id: "stiff", name: "Stiff", type: "Musculação", muscle: "Pernas", equipment: "Barra", biomechanics: "Hip hinge", instructions: ["Pernas semi-flexionadas", "Desça com coluna neutra"], mistakes: ["Arredondar lombar"], alternatives: ["levantamento-terra"] },
  { id: "levantamento-terra", name: "Levantamento Terra", type: "Musculação", muscle: "Pernas", equipment: "Barra", biomechanics: "Hip hinge", instructions: ["Barra junto ao corpo", "Empurre o chão"], mistakes: ["Subir com lombar"], alternatives: ["stiff"] },
  { id: "cadeira-extensora", name: "Cadeira Extensora", type: "Musculação", muscle: "Pernas", equipment: "Máquina", biomechanics: "Extensão joelho", instructions: ["Contração total no topo"], mistakes: ["Parar muito no topo"], alternatives: ["agachamento"] },
  { id: "mesa-flexora", name: "Mesa Flexora", type: "Musculação", muscle: "Pernas", equipment: "Máquina", biomechanics: "Flexão joelho", instructions: ["Quadril fixo no banco"], mistakes: ["Usar quadril"], alternatives: ["stiff"] },
  { id: "panturrilha", name: "Panturrilha em Pé", type: "Musculação", muscle: "Pernas", equipment: "Máquina", biomechanics: "Flexão plantar", instructions: ["Amplitude total"], mistakes: ["Amplitude curta"], alternatives: [] },

  { id: "elevacao-quadril", name: "Elevação de Quadril", type: "Musculação", muscle: "Glúteos", equipment: "Barra", biomechanics: "Hip thrust", instructions: ["Apoio escapular no banco", "Empurre quadril ao teto"], mistakes: ["Hiperextender lombar"], alternatives: ["agachamento"] },
  { id: "abdutor", name: "Cadeira Abdutora", type: "Musculação", muscle: "Glúteos", equipment: "Máquina", biomechanics: "Abdução quadril", instructions: ["Tronco levemente à frente"], mistakes: ["Balançar"], alternatives: [] },

  { id: "prancha", name: "Prancha", type: "Calistenia", muscle: "Core", equipment: "Peso corporal", biomechanics: "Anti-extensão", instructions: ["Linha reta corpo", "Glúteos contraídos"], mistakes: ["Quadril alto demais"], alternatives: ["abdominal"] },
  { id: "abdominal", name: "Abdominal Crunch", type: "Calistenia", muscle: "Core", equipment: "Peso corporal", biomechanics: "Flexão tronco", instructions: ["Eleve apenas escápulas"], mistakes: ["Puxar pescoço"], alternatives: ["prancha"] },
  { id: "leg-raise", name: "Elevação de Pernas", type: "Calistenia", muscle: "Core", equipment: "Barra fixa", biomechanics: "Flexão quadril", instructions: ["Pernas estendidas até 90°"], mistakes: ["Balanço"], alternatives: ["abdominal"] },
  { id: "ab-roller", name: "Ab Roller", type: "Calistenia", muscle: "Core", equipment: "Roda abdominal", biomechanics: "Anti-extensão", instructions: ["Avance sem arquear lombar"], mistakes: ["Arquear lombar"], alternatives: ["prancha"] },

  { id: "flexao", name: "Flexão de Braço", type: "Calistenia", muscle: "Peito", equipment: "Peso corporal", biomechanics: "Empurrar horizontal", instructions: ["Corpo alinhado", "Desça até peito quase tocar o chão"], mistakes: ["Quadril caindo"], alternatives: ["supino-halter"] },
  { id: "muscle-up", name: "Muscle Up", type: "Calistenia", muscle: "Costas", equipment: "Barra fixa", biomechanics: "Puxar + Empurrar", instructions: ["Explosão na transição"], mistakes: ["Falta de puxada alta"], alternatives: ["barra-fixa"] },
  { id: "pistol-squat", name: "Pistol Squat", type: "Calistenia", muscle: "Pernas", equipment: "Peso corporal", biomechanics: "Agachamento unilateral", instructions: ["Equilíbrio em uma perna"], mistakes: ["Calcanhar levantando"], alternatives: ["agachamento"] },
  { id: "handstand", name: "Handstand Push-up", type: "Calistenia", muscle: "Ombros", equipment: "Parede", biomechanics: "Empurrar vertical invertido", instructions: ["Cabeça toca o chão controlado"], mistakes: ["Hiperextender lombar"], alternatives: ["desenvolvimento"] },
  { id: "front-lever", name: "Front Lever", type: "Calistenia", muscle: "Core", equipment: "Barra fixa", biomechanics: "Isometria", instructions: ["Corpo paralelo ao chão"], mistakes: ["Quadril caindo"], alternatives: ["leg-raise"] },
];

export type WorkoutSet = { reps: number; weight: number; rpe?: number };
export type WorkoutExercise = {
  exerciseId: string;
  sets: WorkoutSet[];
  rest: number;
  notes?: string;
  tag?: "Superset" | "Dropset" | "Rest-Pause";
};
export type Workout = {
  id: string;
  name: string;
  focus: string;
  duration: number;
  type: ExerciseType | "Híbrido";
  exercises: WorkoutExercise[];
};

export const workouts: Workout[] = [
  { id: "push", name: "Push Day", focus: "Peito · Ombros · Tríceps", duration: 65, type: "Musculação", exercises: [
    { exerciseId: "supino-reto", sets: [{reps:8,weight:80},{reps:8,weight:80},{reps:6,weight:85},{reps:6,weight:85}], rest: 120 },
    { exerciseId: "supino-halter", sets: [{reps:10,weight:30},{reps:10,weight:30},{reps:10,weight:30}], rest: 90 },
    { exerciseId: "desenvolvimento-halter", sets: [{reps:10,weight:22},{reps:10,weight:22},{reps:8,weight:24}], rest: 90 },
    { exerciseId: "elevacao-lateral", sets: [{reps:15,weight:10},{reps:15,weight:10},{reps:12,weight:12}], rest: 60, tag: "Dropset" },
    { exerciseId: "triceps-corda", sets: [{reps:12,weight:25},{reps:12,weight:25},{reps:12,weight:25}], rest: 60 },
  ]},
  { id: "pull", name: "Pull Day", focus: "Costas · Bíceps", duration: 60, type: "Musculação", exercises: [
    { exerciseId: "barra-fixa", sets: [{reps:8,weight:0},{reps:8,weight:0},{reps:6,weight:0}], rest: 120 },
    { exerciseId: "remada-curvada", sets: [{reps:10,weight:60},{reps:10,weight:60},{reps:8,weight:65}], rest: 90 },
    { exerciseId: "puxada-frente", sets: [{reps:10,weight:55},{reps:10,weight:55},{reps:10,weight:55}], rest: 90 },
    { exerciseId: "rosca-direta", sets: [{reps:10,weight:25},{reps:10,weight:25},{reps:10,weight:25}], rest: 60 },
    { exerciseId: "rosca-martelo", sets: [{reps:12,weight:14},{reps:12,weight:14},{reps:12,weight:14}], rest: 60 },
  ]},
  { id: "legs", name: "Leg Day", focus: "Quadríceps · Posterior · Glúteo", duration: 70, type: "Musculação", exercises: [
    { exerciseId: "agachamento", sets: [{reps:8,weight:100},{reps:8,weight:100},{reps:6,weight:110},{reps:6,weight:110}], rest: 150 },
    { exerciseId: "leg-press", sets: [{reps:12,weight:200},{reps:12,weight:200},{reps:10,weight:220}], rest: 120 },
    { exerciseId: "stiff", sets: [{reps:10,weight:70},{reps:10,weight:70},{reps:10,weight:70}], rest: 90 },
    { exerciseId: "cadeira-extensora", sets: [{reps:15,weight:50},{reps:15,weight:50},{reps:12,weight:60}], rest: 60 },
    { exerciseId: "panturrilha", sets: [{reps:20,weight:80},{reps:20,weight:80},{reps:20,weight:80}], rest: 45 },
  ]},
  { id: "upper", name: "Upper Power", focus: "Membros superiores", duration: 55, type: "Híbrido", exercises: [
    { exerciseId: "supino-reto", sets: [{reps:5,weight:90},{reps:5,weight:90},{reps:5,weight:90}], rest: 150 },
    { exerciseId: "barra-fixa", sets: [{reps:6,weight:0},{reps:6,weight:0},{reps:6,weight:0}], rest: 120 },
    { exerciseId: "desenvolvimento", sets: [{reps:6,weight:50},{reps:6,weight:50},{reps:6,weight:50}], rest: 120 },
  ]},
  { id: "calisthenics", name: "Skill Calistenia", focus: "Força funcional", duration: 50, type: "Calistenia", exercises: [
    { exerciseId: "muscle-up", sets: [{reps:3,weight:0},{reps:3,weight:0},{reps:3,weight:0}], rest: 180 },
    { exerciseId: "handstand", sets: [{reps:5,weight:0},{reps:5,weight:0},{reps:5,weight:0}], rest: 120 },
    { exerciseId: "pistol-squat", sets: [{reps:6,weight:0},{reps:6,weight:0},{reps:6,weight:0}], rest: 90 },
    { exerciseId: "front-lever", sets: [{reps:1,weight:0},{reps:1,weight:0},{reps:1,weight:0}], rest: 120, tag: "Rest-Pause" },
  ]},
  { id: "core", name: "Core Burn", focus: "Estabilidade central", duration: 30, type: "Calistenia", exercises: [
    { exerciseId: "prancha", sets: [{reps:60,weight:0},{reps:60,weight:0},{reps:60,weight:0}], rest: 45 },
    { exerciseId: "ab-roller", sets: [{reps:12,weight:0},{reps:12,weight:0},{reps:12,weight:0}], rest: 60 },
    { exerciseId: "leg-raise", sets: [{reps:12,weight:0},{reps:12,weight:0},{reps:12,weight:0}], rest: 60 },
  ]},
];

export function getExercise(id: string) {
  return exercises.find(e => e.id === id);
}
export function getWorkout(id: string) {
  return workouts.find(w => w.id === id);
}
