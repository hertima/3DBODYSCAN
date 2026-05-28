import { calistheniaPuraCatalog } from "./calisthenia-pura-catalog";
import { musculacaoPrincipalCatalog } from "./musculacao-principal-catalog";

export type MuscleGroup =
  | "Peito" | "Costas" | "Ombros" | "Bíceps" | "Tríceps"
  | "Pernas" | "Glúteos" | "Core" | "Antebraço" | "Full Body";

export type ExerciseType = "Musculação" | "Calistenia";

export type Exercise = {
  id: string;
  name: string;
  type: ExerciseType;
  muscle: MuscleGroup;
  sourceGroup?: string;
  muscleSecondary?: MuscleGroup[];
  equipment: string;
  biomechanics: string;
  instructions: string[];
  mistakes: string[];
  alternatives: string[];
  gifUrl?: string;
};

const curatedExercises: Exercise[] = [
  { id: "supino-reto", name: "Supino Reto", type: "Musculação", muscle: "Peito", equipment: "Barra", biomechanics: "Empurrar horizontal", instructions: ["Deite no banco com os pés firmes no chão", "Pegada um pouco mais aberta que os ombros", "Desça a barra controlado até o peito", "Empurre explosivo mantendo escápulas retraídas"], mistakes: ["Arquear lombar excessivamente", "Cotovelos abertos 90°", "Saltar barra do peito"], alternatives: ["supino-halter", "flexao"] },
  { id: "supino-halter", name: "Supino com Halteres", type: "Musculação", muscle: "Peito", equipment: "Banco", biomechanics: "Empurrar horizontal", instructions: ["Halteres na altura do peito", "Empurre em arco até quase tocar"], mistakes: ["Travar cotovelos", "Pouca amplitude"], alternatives: ["supino-reto", "crucifixo"] },
  { id: "crucifixo", name: "Crucifixo", type: "Musculação", muscle: "Peito", equipment: "Halteres", biomechanics: "Adução horizontal", instructions: ["Cotovelos levemente flexionados", "Abra controlado e feche contraindo o peito"], mistakes: ["Descer demais e perder tensão"], alternatives: ["crossover"] },
  { id: "crossover", name: "Crossover Cabos", type: "Musculação", muscle: "Peito", equipment: "Cabos", biomechanics: "Adução horizontal", instructions: ["Inclinação leve à frente", "Puxe cruzando à frente"], mistakes: ["Usar peso demais"], alternatives: ["crucifixo"] },

  { id: "remada-curvada", name: "Remada Curvada", type: "Musculação", muscle: "Costas", equipment: "Barra", biomechanics: "Puxar horizontal", instructions: ["Tronco a 45°", "Puxe a barra ao umbigo", "Aperte escápulas"], mistakes: ["Tronco subindo a cada repetição"], alternatives: ["remada-baixa", "remada-australiana"] },
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
  { id: "mergulho", name: "Mergulho em Paralelas", type: "Calistenia", muscle: "Tríceps", equipment: "Paralelas", biomechanics: "Empurrar vertical", instructions: ["Tronco vertical para tríceps", "Desça até 90°"], mistakes: ["Cabeça caindo à  frente"], alternatives: ["triceps-corda"] },

  { id: "agachamento", name: "Agachamento Livre", type: "Musculação", muscle: "Pernas", equipment: "Barra", biomechanics: "Agachamento", instructions: ["Barra apoiada no trapézio", "Desça até paralelo", "Suba empurrando o chão"], mistakes: ["Joelhos colapsando para dentro", "Lombar arredondada"], alternatives: ["leg-press", "agachamento-pc"] },
  { id: "leg-press", name: "Leg Press 45°", type: "Musculação", muscle: "Pernas", equipment: "Máquina", biomechanics: "Empurrar pernas", instructions: ["Pés na largura dos ombros", "Desça até 90°"], mistakes: ["Tirar quadril do banco"], alternatives: ["agachamento"] },
  { id: "stiff", name: "Stiff", type: "Musculação", muscle: "Pernas", equipment: "Barra", biomechanics: "Hip hinge", instructions: ["Pernas semi-flexionadas", "Desça com coluna neutra"], mistakes: ["Arredondar lombar"], alternatives: ["levantamento-terra"] },
  { id: "levantamento-terra", name: "Levantamento Terra", type: "Musculação", muscle: "Pernas", equipment: "Barra", biomechanics: "Hip hinge", instructions: ["Barra junto ao corpo", "Empurre o chão"], mistakes: ["Subir com lombar"], alternatives: ["stiff"] },
  { id: "cadeira-extensora", name: "Cadeira Extensora", type: "Musculação", muscle: "Pernas", equipment: "Máquina", biomechanics: "Extensão joelho", instructions: ["Contração total no topo"], mistakes: ["Parar muito no topo"], alternatives: ["agachamento"] },
  { id: "mesa-flexora", name: "Mesa Flexora", type: "Musculação", muscle: "Pernas", equipment: "Máquina", biomechanics: "Flexão joelho", instructions: ["Quadril fixo no banco"], mistakes: ["Usar quadril"], alternatives: ["stiff"] },
  { id: "panturrilha", name: "Panturrilha em Pé", type: "Musculação", muscle: "Pernas", equipment: "Máquina", biomechanics: "Flexão plantar", instructions: ["Amplitude total"], mistakes: ["Amplitude curta"], alternatives: [] },

  { id: "elevacao-quadril", name: "Elevação de Quadril", type: "Musculação", muscle: "Glúteos", equipment: "Barra", biomechanics: "Hip thrust", instructions: ["Apoio escapular no banco", "Empurre quadril ao teto"], mistakes: ["Hiperextender lombar"], alternatives: ["agachamento"] },
  { id: "abdutor", name: "Cadeira Abdutora", type: "Musculação", muscle: "Glúteos", equipment: "Máquina", biomechanics: "Abdução quadril", instructions: ["Tronco levemente à frente"], mistakes: ["Balançar"], alternatives: [] },
  { id: "panturrilha-pc", name: "Panturrilha em Pé (Peso Corporal)", type: "Calistenia", muscle: "Pernas", equipment: "Peso corporal", biomechanics: "Flexão plantar", instructions: ["Fique na ponta dos pés na borda de um degrau ou plano", "Suba ao máximo e desça abaixo do nível do calcanhar", "Controle em 2s de descida"], mistakes: ["Amplitude curta", "Usar impulso"], alternatives: ["panturrilha-halter"] },
  { id: "panturrilha-halter", name: "Panturrilha com Haltere", type: "Musculação", muscle: "Pernas", equipment: "Halteres", biomechanics: "Flexão plantar", instructions: ["Segure haltere em uma mão, apoie a outra na parede", "Suba na ponta do pé fazendo movimento completo"], mistakes: ["Amplitude curta", "Velocidade alta"], alternatives: ["panturrilha-pc"] },

  { id: "prancha", name: "Prancha", type: "Calistenia", muscle: "Core", equipment: "Peso corporal", biomechanics: "Anti-extensão", instructions: ["Linha reta corpo", "Glúteos contraídos"], mistakes: ["Quadril alto demais"], alternatives: ["abdominal"] },
  { id: "abdominal", name: "Abdominal Crunch", type: "Calistenia", muscle: "Core", equipment: "Peso corporal", biomechanics: "Flexão tronco", instructions: ["Eleve apenas escápulas"], mistakes: ["Puxar pescoço"], alternatives: ["prancha"] },
  { id: "leg-raise", name: "Elevação de Pernas", type: "Calistenia", muscle: "Core", equipment: "Barra fixa", biomechanics: "Flexão quadril", instructions: ["Pernas estendidas até 90°"], mistakes: ["Balanço"], alternatives: ["abdominal"] },
  { id: "ab-roller", name: "Ab Roller", type: "Calistenia", muscle: "Core", equipment: "Peso corporal", biomechanics: "Anti-extensão", instructions: ["Avance sem arquear lombar"], mistakes: ["Arquear lombar"], alternatives: ["prancha"] },

  { id: "flexao", name: "Flexão de Braço", type: "Calistenia", muscle: "Peito", equipment: "Peso corporal", biomechanics: "Empurrar horizontal", instructions: ["Corpo alinhado", "Desça até peito quase tocar o chão"], mistakes: ["Quadril caindo"], alternatives: ["supino-halter"] },
  { id: "flexao-fechada", name: "Flexão Fechada", type: "Calistenia", muscle: "Tríceps", equipment: "Peso corporal", biomechanics: "Extensão cotovelo", instructions: ["Mãos próximas abaixo do peito", "Cotovelos colados ao tronco na subida"], mistakes: ["Abrir cotovelos", "Quadril caindo"], alternatives: ["triceps-corda", "mergulho"] },
  { id: "dips-cadeira", name: "Dips na Cadeira", type: "Calistenia", muscle: "Tríceps", equipment: "Peso corporal", biomechanics: "Extensão cotovelo", instructions: ["Apoio nas mãos atrás do corpo", "Desça até cotovelos a 90°", "Empurre subindo sem travar"], mistakes: ["Ombros subindo", "Amplitude curta"], alternatives: ["mergulho", "flexao-fechada"] },
  { id: "remada-australiana", name: "Remada Australiana", type: "Calistenia", muscle: "Costas", equipment: "Barra fixa", biomechanics: "Puxar horizontal", instructions: ["Corpo inclinado sob a barra, calcanhar no chão", "Puxe o peito até a barra mantendo escápulas retraídas", "Desça controlado"], mistakes: ["Quadril caindo", "Usar impulso"], alternatives: ["remada-curvada", "barra-fixa"] },
  { id: "superman", name: "Superman", type: "Calistenia", muscle: "Costas", equipment: "Peso corporal", biomechanics: "Extensão", instructions: ["Deite de bruços com braços estendidos à frente", "Eleve peito e pernas simultaneamente contraindo as costas", "Segure 2s no topo e desça controlado"], mistakes: ["Usar impulso", "Pescoço tenso"], alternatives: ["remada-australiana"] },
{ id: "curl-barra-fixa", name: "Rosca na Barra Fixa", type: "Calistenia", muscle: "Bíceps", equipment: "Barra fixa", biomechanics: "Flexão de cotovelo", instructions: ["Pegada supinada na barra", "Puxe concentrando a contração no bíceps", "Cotovelso na frente do corpo"], mistakes: ["Balanço corporal", "Usar as costas"], alternatives: ["rosca-direta", "remada-australiana"] },
  { id: "elevacao-toalha", name: "Elevação Lateral com Toalha", type: "Calistenia", muscle: "Ombros", equipment: "Parede", biomechanics: "Abdução", instructions: ["Toalha presa na parede ou porta", "Incline o corpo e eleve lateralmente com resistência", "Controle a descida"], mistakes: ["Usar trapézio", "Movimento rápido"], alternatives: ["elevacao-lateral", "handstand"] },
  { id: "pike-push-up", name: "Pike Push-up", type: "Calistenia", muscle: "Ombros", equipment: "Peso corporal", biomechanics: "Empurrar vertical", instructions: ["Quadril elevado formando V invertido", "Desça a cabeça entre as mãos", "Empurre subindo sem abrir o quadril"], mistakes: ["Quadril caindo", "Cotovelos muito abertos"], alternatives: ["handstand", "desenvolvimento"] },
  { id: "agachamento-pc", name: "Agachamento Livre (Peso Corporal)", type: "Calistenia", muscle: "Pernas", equipment: "Peso corporal", biomechanics: "Agachamento", instructions: ["Pés na largura dos ombros", "Desça até coxa paralela ao chão", "Suba empurrando com os calcanhares"], mistakes: ["Joelhos colapsando para dentro", "Levantar calcanhares"], alternatives: ["agachamento-bulgaro-pc", "pistol-squat"] },
  { id: "afundo-pc", name: "Afundo (Peso Corporal)", type: "Calistenia", muscle: "Pernas", equipment: "Peso corporal", biomechanics: "Agachamento unilateral", instructions: ["Dê um passo largo à frente", "Desça o joelho traseiro próximo ao chão", "Suba e alterne as pernas"], mistakes: ["Tronco muito inclinado", "Joelho ultrapassar o pé"], alternatives: ["agachamento-bulgaro-pc", "pistol-squat"] },
  { id: "agachamento-bulgaro-pc", name: "Agachamento Búlgaro", type: "Calistenia", muscle: "Pernas", equipment: "Peso corporal", biomechanics: "Agachamento unilateral", instructions: ["Pé traseiro elevado num banco ou degrau", "Desça o joelho traseiro próximo ao chão", "Suba empurrando com o calcanhar da frente"], mistakes: ["Joelho ultrapassar muito o pé", "Tronco muito inclinado"], alternatives: ["pistol-squat", "afundo-pc"] },
  { id: "hip-thrust-solo", name: "Hip Thrust no Solo", type: "Calistenia", muscle: "Glúteos", equipment: "Peso corporal", biomechanics: "Hip thrust", instructions: ["Deite com joelhos dobrados e pés no chão", "Eleve o quadril contraindo glúteos no topo", "Segure 2s no pico e desça controlado"], mistakes: ["Hiperextender lombar", "Usar impulso"], alternatives: ["elevacao-quadril", "agachamento-bulgaro-pc"] },
  { id: "ponte-gluteos-unilateral", name: "Ponte de Glúteos Unilateral", type: "Calistenia", muscle: "Glúteos", equipment: "Peso corporal", biomechanics: "Hip thrust", instructions: ["Deite com uma perna estendida", "Eleve o quadril empurrando com o calcanhar da perna apoiada", "Contraia glúteos no topo e desça controlado"], mistakes: ["Usar impulso", "Quadril torto"], alternatives: ["hip-thrust-solo", "elevacao-quadril"] },
  { id: "muscle-up", name: "Muscle Up", type: "Calistenia", muscle: "Costas", equipment: "Barra fixa", biomechanics: "Puxar + Empurrar", instructions: ["Explosão na transição"], mistakes: ["Falta de puxada alta"], alternatives: ["barra-fixa"] },
  { id: "pistol-squat", name: "Pistol Squat", type: "Calistenia", muscle: "Pernas", equipment: "Peso corporal", biomechanics: "Agachamento unilateral", instructions: ["Equilíbrio em uma perna"], mistakes: ["Calcanhar levantando"], alternatives: ["agachamento-bulgaro-pc"] },
  { id: "handstand", name: "Handstand Push-up", type: "Calistenia", muscle: "Ombros", equipment: "Parede", biomechanics: "Empurrar vertical invertido", instructions: ["Cabeça toca o chão controlado"], mistakes: ["Hiperextender lombar"], alternatives: ["pike-push-up"] },
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
  type: ExerciseType | "Híbrido" | "Funcional";
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

const strengthType = curatedExercises[0]!.type;
const calisthenicsType =
  curatedExercises.find((exercise) => exercise.type !== strengthType)?.type ?? strengthType;

const chestMuscle = curatedExercises.find((exercise) => exercise.id === "supino-reto")!.muscle;
const backMuscle = curatedExercises.find((exercise) => exercise.id === "remada-curvada")!.muscle;
const shouldersMuscle = curatedExercises.find((exercise) => exercise.id === "desenvolvimento")!.muscle;
const bicepsMuscle = curatedExercises.find((exercise) => exercise.id === "rosca-direta")!.muscle;
const tricepsMuscle = curatedExercises.find((exercise) => exercise.id === "triceps-corda")!.muscle;
const legsMuscle = curatedExercises.find((exercise) => exercise.id === "agachamento")!.muscle;
const glutesMuscle = curatedExercises.find((exercise) => exercise.id === "elevacao-quadril")!.muscle;
const coreMuscle = curatedExercises.find((exercise) => exercise.id === "prancha")!.muscle;
const forearmMuscle = "Antebra\u00E7o" as MuscleGroup;
const fullBodyMuscle = coreMuscle;

const catalogMuscleMap = [
  { match: "ABDOMEN CORE", muscle: coreMuscle },
  { match: "BICEPS", muscle: bicepsMuscle },
  { match: "ANTEBRACO", muscle: forearmMuscle },
  { match: "TRICEPS", muscle: tricepsMuscle },
  { match: "TRICEP", muscle: tricepsMuscle },
  { match: "PEITORAL", muscle: chestMuscle },
  { match: "PEITO", muscle: chestMuscle },
  { match: "DELTOIDES", muscle: shouldersMuscle },
  { match: "COSTAS", muscle: backMuscle },
  { match: "TRAPEZIO", muscle: backMuscle },
  { match: "OMBRO", muscle: shouldersMuscle },
  { match: "PANTURRILHA", muscle: legsMuscle },
  { match: "GLUTEOS", muscle: glutesMuscle },
  { match: "GLUTEO", muscle: glutesMuscle },
  { match: "PERNAS", muscle: legsMuscle },
  { match: "MEMBROS INFERIORES", muscle: legsMuscle },
  { match: "GLUTE", muscle: glutesMuscle },
  { match: "FOREARM", muscle: forearmMuscle },
  { match: "FULL BODY", muscle: coreMuscle },
] as const;

const calisthenicsKeywords = [
  "pull up",
  "chin up",
  "pushup",
  "push up",
  "muscle up",
  "handstand",
  "front lever",
  "back lever",
  "planche",
  "human flag",
  "pistol",
  "dip",
  "parallel",
  "bars",
  "inverted row",
  "sphinx",
  "dragon flag",
  "prancha",
  "plank",
  "l sit",
  "toes to bar",
  "abdominal",
  "crunch",
  "sit up",
  "bicicleta",
  "prancha",
  "barra livre",
] as const;

const gymEquipmentKeywords = [
  "halter",
  "dumbbell",
  "barra",
  "barbell",
  "anilha",
  "plate",
  "pulley",
  "smith",
  "guiada",
  "polia",
  "cabo",
  "cable",
  "cross",
  "crossover",
  "maquina",
  "machine",
  "chest press",
  "shoulder press",
  "press peitoral",
  "press alto",
  "supino",
  "fly",
  "peitoral",
  "leg press",
  "extensora",
  "flexora",
  "hack",
  "bench press",
] as const;

const chestBodyweightOverrides = [
  "apoio batendo palmas",
  "apoio de frente com medball",
  "apoio de frente de joelhos",
  "decline push up",
  "deficit push ups",
  "flex de cotovelo declinado utilizando o banco",
  "flexao aberta lateral",
  "flexao apoio alto",
  "flexao assistida",
  "flex de cotovelo braços aberto",
  "flex de cotovelo completa",
  "knee push ups",
  "pike push up",
  "plyometric push ups",
  "push up bars",
  "paralelas",
] as const;

const gymCableOverrides = [
  "puxada alta nuca",
  "puxada alta tradicional",
  "puxada alta triangulo",
  "puxada cruzada",
  "remada aberta",
  "remada",
  "crucifixo baixo no croos em pe",
  "crucifixo baixo no cross em pe",
] as const;

const coreOverrides = [
  "declinado smith",
] as const;

const corePathOverrides = [
  "PEITORAL (1)/DECLINADO SMITH",
] as const;

const catalogOverrides = [
  { match: "cadeira flex", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "avanco", muscle: legsMuscle, type: strengthType, equipment: "Halteres" },
  { match: "agachamento pes afastados", muscle: legsMuscle, type: strengthType, equipment: "Barra" },
  { match: "agachamento sumo peso corporal", muscle: legsMuscle, type: strengthType, equipment: "Halteres" },
  { match: "facepull", muscle: backMuscle, type: strengthType, equipment: "Cabos" },
  { match: "cable fly", muscle: shouldersMuscle, type: strengthType, equipment: "Cabos" },
  { match: "cable rear delt fly", muscle: shouldersMuscle, type: strengthType, equipment: "Cabos" },
  { match: "rear delt fly", muscle: shouldersMuscle, type: strengthType, equipment: "Cabos" },
  { match: "abs lateral", muscle: coreMuscle, type: strengthType, equipment: "Maquina" },
  { match: "aducao deitada unilateral", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "afundo lateral com barra", muscle: legsMuscle, type: strengthType, equipment: "Barra" },
  { match: "flexora em pe unilateral", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "flexao de joelho", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "mesa flexora", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "pulley pegada aberta atras da nuca", muscle: backMuscle, type: strengthType, equipment: "Cabos" },
  { match: "pulley pegada aberta pronada", muscle: backMuscle, type: strengthType, equipment: "Cabos" },
  { match: "crucifixo polia baixa", muscle: shouldersMuscle, type: strengthType, equipment: "Cabos" },
  { match: "crucifixo invertido polia baixa", muscle: shouldersMuscle, type: strengthType, equipment: "Cabos" },
  { match: "crucifixo inverto com halteres", muscle: shouldersMuscle, type: strengthType, equipment: "Halteres" },
  { match: "crucifixo invertido com halter", muscle: shouldersMuscle, type: strengthType, equipment: "Halteres" },
  { match: "crucifixo invertido na maquina", muscle: shouldersMuscle, type: strengthType, equipment: "Maquina" },
  { match: "voador invertido", muscle: backMuscle, type: strengthType, equipment: "Maquina" },
  { match: "elevacao lateral com halters", muscle: shouldersMuscle, type: strengthType, equipment: "Halteres" },
  { match: "elevacao do cotovelo unilateral", muscle: shouldersMuscle, type: strengthType, equipment: "Halteres" },
  { match: "fitness gifs 4 u", muscle: backMuscle, type: strengthType, equipment: "Barra" },
  { match: "arnold dips maschine", muscle: tricepsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "triceps coice com halteres", muscle: tricepsMuscle, type: strengthType, equipment: "Halteres" },
  { match: "extensao unilateral", muscle: forearmMuscle, type: strengthType, equipment: "Barra" },
  { match: "frontal lateral invertido", muscle: shouldersMuscle, type: strengthType, equipment: "Halteres" },
  { match: "gemeos sentado", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "negative calf raise", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "reverse hyperextension", muscle: glutesMuscle, type: strengthType, equipment: "Maquina" },
  { match: "extensao no elastico", muscle: glutesMuscle, type: strengthType, equipment: "Elastico" },
  { match: "flex de joelho em pe no cabo cross", muscle: backMuscle, type: calisthenicsType, equipment: "Barra fixa" },
] as const;

const strengthNameKeywords = [
  "agachamento frontal",
  "agachamento livre",
  "agachamento sumo",
  "agachamento bulgaro",
  "supino",
  "remada",
  "puxada",
  "levantamento",
  "terra",
  "stiff",
  "rosca",
  "triceps",
  "tricep",
  "desenvolvimento",
  "elevacao lateral",
  "crucifixo",
  "crossover",
  "extensora",
  "flexora",
  "leg press",
  "panturrilha",
  "abdutora",
  "abdutor",
  "adutora",
  "afundo",
  "passada",
  "hack",
  "smith",
  "curl",
  "pulldown",
  "row",
  "bench press",
  "facepull",
  "face pull",
  "voador",
  "voador invertido",
  "voador inverso",
  "front squat",
  "goblet squat",
  "lunge",
] as const;

const explicitBodyweightKeywords = [
  "peso corporal",
  "bodyweight",
  "com salto",
  "jump squat",
  "pistol squat",
  "push up",
  "pushup",
  "pull up",
  "pullup",
  "chin up",
  "chinup",
  "barra fixa",
  "prancha",
  "plank",
  "abdominal",
  "crunch",
  "sit up",
  "flexao",
  "flexao de braco",
  "paralela",
  "dip",
] as const;

function normalizeCatalogValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[._]/g, " ")
    .toLowerCase();
}

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferMuscleFromCatalog(path: string): MuscleGroup {
  const normalized = normalizeCatalogValue(path).toUpperCase();
  const normalizedName = normalizeCatalogValue(extractCatalogName(path));
  const override = catalogOverrides.find((item) => normalizedName.includes(item.match));
  if (override) return override.muscle;

  // Nome tem prioridade sobre pasta para exercícios que podem estar na pasta errada
  if (normalizedName.includes("abducao") && !normalizedName.includes("ombro")) return glutesMuscle;
  if (normalizedName.includes("aducao") && !normalizedName.includes("ombro")) return glutesMuscle;

  const folderMatch = catalogMuscleMap.find((item) => normalized.includes(item.match));
  if (folderMatch) {
    return folderMatch.muscle;
  }

  if (
    normalizedName.includes("abs") ||
    normalizedName.includes("abdominal") ||
    normalizedName.includes("crunch") ||
    normalizedName.includes("prancha") ||
    normalizedName.includes("plank") ||
    normalizedName.includes("leg raise") ||
    normalizedName.includes("knee raise") ||
    normalizedName.includes("core")
  ) {
    return coreMuscle;
  }

  if (
    normalizedName.includes("aducao") ||
    normalizedName.includes("abducao") ||
    normalizedName.includes("afundo") ||
    normalizedName.includes("agachamento") ||
    normalizedName.includes("passada") ||
    normalizedName.includes("avanco") ||
    normalizedName.includes("lunge") ||
    normalizedName.includes("stiff") ||
    normalizedName.includes("terra") ||
    normalizedName.includes("leg press") ||
    normalizedName.includes("extensora") ||
    normalizedName.includes("flexora")
  ) {
    return legsMuscle;
  }

  if (
    normalizedName.includes("glute") ||
    normalizedName.includes("gluteo") ||
    normalizedName.includes("gluteos") ||
    normalizedName.includes("hip thrust") ||
    normalizedName.includes("coice de gluteo") ||
    normalizedName.includes("coice no cabo") ||
    normalizedName.includes("kickback") ||
    normalizedName.includes("abdutora")
  ) {
    return glutesMuscle;
  }

  if (
    normalizedName.includes("ombro") ||
    normalizedName.includes("deltoid") ||
    normalizedName.includes("deltoide") ||
    normalizedName.includes("deltoides") ||
    normalizedName.includes("elevacao lateral") ||
    normalizedName.includes("elevacao frontal") ||
    normalizedName.includes("desenvolvimento") ||
    normalizedName.includes("arnold") ||
    normalizedName.includes("frontal") ||
    normalizedName.includes("lateral") ||
    normalizedName.includes("encolhimento") ||
    normalizedName.includes("shrug")
  ) {
    return shouldersMuscle;
  }

  if (
    normalizedName.includes("triceps") ||
    normalizedName.includes("tricep") ||
    normalizedName.includes("frances") ||
    normalizedName.includes("corda") ||
    normalizedName.includes("coice") ||
    normalizedName.includes("overhead extension") ||
    normalizedName.includes("overhead extensions") ||
    normalizedName.includes("pushdown") ||
    normalizedName.includes("testa")
  ) {
    return tricepsMuscle;
  }

  if (
    normalizedName.includes("biceps") ||
    normalizedName.includes("rosca") ||
    normalizedName.includes("curl") ||
    normalizedName.includes("martelo")
  ) {
    return bicepsMuscle;
  }

  if (
    normalizedName.includes("costas") ||
    normalizedName.includes("remada") ||
    normalizedName.includes("puxada") ||
    normalizedName.includes("pulldown") ||
    normalizedName.includes("pulley") ||
    normalizedName.includes("trap")
  ) {
    return backMuscle;
  }

  if (
    normalizedName.includes("peito") ||
    normalizedName.includes("supino") ||
    normalizedName.includes("crossover") ||
    normalizedName.includes("crucifixo") ||
    normalizedName.includes("fly")
  ) {
    return chestMuscle;
  }

  if (
    normalizedName.includes("panturrilha") ||
    normalizedName.includes("gemeos") ||
    normalizedName.includes("calf raise") ||
    normalizedName.includes("calf")
  ) {
    return legsMuscle;
  }


  if (corePathOverrides.some((keyword) => normalized.includes(keyword))) {
    return coreMuscle;
  }

  if (coreOverrides.some((keyword) => normalizedName.includes(keyword))) {
    return coreMuscle;
  }

  return coreMuscle;
}

function inferTypeFromCatalog(path: string): ExerciseType {
  const normalized = normalizeCatalogValue(path);
  const normalizedName = normalizeCatalogValue(extractCatalogName(path));
  const override = catalogOverrides.find((item) => normalizedName.includes(item.match));
  if (override) return override.type;
  const isCalisthenics = calisthenicsKeywords.some((keyword) => normalized.includes(keyword));
  const hasGymEquipment = gymEquipmentKeywords.some((keyword) => normalized.includes(keyword));
  const hasStrengthName = strengthNameKeywords.some((keyword) => normalizedName.includes(keyword));
  const isExplicitBodyweight = explicitBodyweightKeywords.some((keyword) => normalized.includes(keyword) || normalizedName.includes(keyword));
  const inferredEquipment = inferEquipmentFromCatalog(path);
  const hasStrengthEquipment =
    inferredEquipment === "Barra" ||
    inferredEquipment === "Halteres" ||
    inferredEquipment === "Cabos" ||
    inferredEquipment === "Maquina";
  const bodyweightStyleEquipment =
    inferredEquipment === "Peso corporal" ||
    inferredEquipment === "Barra fixa" ||
    inferredEquipment === "Paralelas" ||
      inferredEquipment === "Parede" ||
      inferredEquipment === "TRX";

  if (chestBodyweightOverrides.some((keyword) => normalizedName.includes(keyword))) {
    return calisthenicsType;
  }

  if (gymCableOverrides.some((keyword) => normalizedName.includes(keyword))) {
    return strengthType;
  }

  if (hasStrengthEquipment && !isExplicitBodyweight) return strengthType;
  if (hasStrengthName && !isExplicitBodyweight) return strengthType;
  if (hasGymEquipment) return strengthType;
  if (isExplicitBodyweight || isCalisthenics || bodyweightStyleEquipment) {
    return calisthenicsType;
  }

  return strengthType;
}

function inferEquipmentFromCatalog(path: string) {
  const normalized = normalizeCatalogValue(path);
  const normalizedName = normalizeCatalogValue(extractCatalogName(path));
  const override = catalogOverrides.find((item) => normalizedName.includes(item.match));
  if (override) return override.equipment;
  const hasStrengthName = strengthNameKeywords.some((keyword) => normalizedName.includes(keyword));
  const isExplicitBodyweight = explicitBodyweightKeywords.some((keyword) => normalized.includes(keyword) || normalizedName.includes(keyword));

  if (chestBodyweightOverrides.some((keyword) => normalizedName.includes(keyword))) {
    return "Peso corporal";
  }

  if (gymCableOverrides.some((keyword) => normalizedName.includes(keyword))) {
    return "Cabos";
  }

  if (normalized.includes("barra fixa") || normalized.includes("pull-up")) return "Barra fixa";
  if (normalized.includes("paralela") || normalized.includes("dip")) return "Paralelas";
  if (normalized.includes("parede") || normalized.includes("handstand")) return "Parede";
  if (
    normalized.includes("maquina") ||
    normalized.includes("machine") ||
    normalized.includes("press") ||
    normalized.includes("peitoral") ||
    normalized.includes("guiada") ||
    normalized.includes("hack") ||
    normalized.includes("voador")
  ) return "Maquina";
  if (normalized.includes("pulley")) return "Cabos";
  if (normalized.includes("facepull") || normalized.includes("face pull")) return "Cabos";
  if (normalized.includes("barra") || normalized.includes("barbell")) return "Barra";
  if (normalized.includes("halter") || normalized.includes("dumbbell")) return "Halteres";
  if (normalized.includes("anilha") || normalized.includes("plate")) return "Barra";
  if (
    normalized.includes("polia") ||
    normalized.includes("cabo") ||
    normalized.includes("cross") ||
    normalized.includes("crossover") ||
    normalized.includes("cable") ||
    normalized.includes("fly")
  ) return "Cabos";
  if (hasStrengthName && !isExplicitBodyweight) return "Maquina";
  if (normalized.includes("bola")) return "Bola";
  if (normalized.includes("trx")) return "TRX";
  if (normalized.includes("bench") || normalized.includes("banco")) return "Banco";
  if (isExplicitBodyweight) return "Peso corporal";

  return "Maquina";
}

function inferBiomechanicsFromCatalog(muscle: MuscleGroup, type: ExerciseType, exerciseName = "") {
  const n = exerciseName.toLowerCase();

  if (muscle === "Peito") {
    if (n.includes("crucifixo") || n.includes("voador") || n.includes("fly") || n.includes("crossover") || n.includes("cross")) return "Adução horizontal";
    return "Empurrar horizontal";
  }
  if (muscle === "Costas") {
    if (n.includes("remada") || n.includes("serrote")) return "Remada";
    if (n.includes("puxada") || n.includes("pulldown") || n.includes("barra fixa") || n.includes("pull up") || n.includes("pullup")) return "Puxada";
    return "Puxar";
  }
  if (muscle === "Ombros") {
    if (n.includes("elevacao lateral") || n.includes("lateral")) return "Elevação lateral";
    if (n.includes("elevacao frontal") || n.includes("frontal")) return "Elevação frontal";
    if (n.includes("posterior") || n.includes("facepull") || n.includes("face pull") || n.includes("bird")) return "Deltóide posterior";
    return "Empurrar vertical";
  }
  if (muscle === bicepsMuscle) {
    if (n.includes("martelo") || n.includes("hammer")) return "Rosca martelo";
    return "Rosca bíceps";
  }
  if (muscle === tricepsMuscle) {
    if (n.includes("coice") || n.includes("kickback")) return "Tríceps coice";
    if (n.includes("testa") || n.includes("frances") || n.includes("skull")) return "Tríceps testa";
    return "Tríceps";
  }
  if (muscle === legsMuscle || muscle === glutesMuscle) {
    if (n.includes("abducao") || n.includes("abdutora")) return "Abdução";
    if (n.includes("aducao") || n.includes("adutora")) return "Adução";
    if (n.includes("extensora") || n.includes("leg extension")) return "Isolamento quadriceps";
    if (n.includes("flexora") || n.includes("mesa flex") || n.includes("leg curl")) return "Isolamento posterior";
    if (n.includes("hip thrust") || n.includes("pelvica") || n.includes("ponte") ||
        (n.includes("extensao") && (n.includes("quadril") || n.includes("apoio")))) return "Hip thrust";
    if (n.includes("stiff") || n.includes("terra") || n.includes("romeno") || n.includes("deadlift")) return "Hip hinge";
    if (n.includes("leg press")) return "Empurrar pernas";
    if (n.includes("agachamento") || n.includes("squat") || n.includes("goblet")) return "Agachamento";
    if (n.includes("afundo") || n.includes("avanco") || n.includes("passada") || n.includes("lunge")) return "Afundo";
    if (n.includes("panturrilha") || n.includes("gemeos") || n.includes("calf")) return "Panturrilha";
    return "Dominante de pernas";
  }
  if (muscle === "Core") return "Estabilidade de core";
  if (muscle === forearmMuscle) return "Pegada e antebraço";
  if (type === calisthenicsType) return "Controle corporal";
  return "Movimento global";
}

function extractCatalogName(path: string) {
  const filename = path.split("/").pop() ?? path;
  const withoutExtension = filename.replace(/\.(gif|mp4|webm|mov)$/i, "");
  const withoutCounter = withoutExtension.replace(/\s*\(\d+\)\s*$/g, "");
  const normalized = normalizeCatalogValue(withoutCounter).replace(/-/g, " ");
  return toTitleCase(normalized);
}

function extractCatalogSourceGroup(path: string) {
  const folder = path.split("/")[0] ?? "";
  return toTitleCase(
    normalizeCatalogValue(folder)
      .replace(/\(\d+\)/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function extractCatalogFingerprint(path: string) {
  const filename = path.split("/").pop() ?? path;
  const withoutExtension = filename.replace(/\.(gif|mp4|webm|mov)$/i, "");
  const withoutCounter = withoutExtension.replace(/\s*\(\d+\)\s*$/g, "");

  return normalizeCatalogValue(withoutCounter)
    .replace(/-/g, " ")
    .replace(/\b0+\d+\b/g, " ")
    .replace(/\b\d+\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCatalogFamilyKey(path: string) {
  const familyStopWords = new Set([
    "com",
    "no",
    "na",
    "de",
    "do",
    "da",
    "em",
    "reto",
    "reta",
    "inclinado",
    "declinado",
    "banco",
    "halter",
    "halteres",
    "cabo",
    "cabos",
    "cable",
    "cross",
    "crossover",
    "maquina",
    "pulley",
    "barra",
    "livre",
    "step",
    "medball",
    "bola",
    "smith",
    "pegada",
    "tradicional",
    "unilateral",
    "bilateral",
    "sentado",
    "sentada",
    "empe",
    "pe",
    "overhead",
  ]);

  const tokenAliases = new Map<string, string>([
    ["tricep", "triceps"],
    ["extensions", "extension"],
    ["halters", "halteres"],
  ]);

  const tokens = extractCatalogFingerprint(path)
    .split(" ")
    .map((token) => tokenAliases.get(token) ?? token)
    .filter((token) => token && !familyStopWords.has(token));

  return [...new Set(tokens)].sort().slice(0, 3).join(" ");
}

function getAutoInstructions(biomechanics: string): string[] {
  const b = biomechanics.toLowerCase();
  if (b.includes("empurrar horizontal") || b.includes("press horizontal"))
    return ["Posicione-se com o equipamento na altura do peito e escápulas retraídas", "Empurre em linha reta ou em arco controlado até quase a extensão dos cotovelos", "Desça de forma lenta e controlada sentindo o alongamento muscular", "Mantenha o core ativado e o corpo estável durante todo o movimento"];
  if (b.includes("puxar horizontal") || b.includes("remada"))
    return ["Posicione o tronco inclinado ou sentado com coluna neutra", "Puxe o peso em direção ao abdômen retraindo as escápulas", "Segure 1s na contração máxima antes de soltar", "Retorne controlado até a extensão completa dos braços"];
  if (b.includes("puxar vertical") || b.includes("puxada"))
    return ["Posicione-se com os braços estendidos acima segurando a carga", "Deprime as escápulas antes de iniciar o movimento", "Puxe os cotovelos para baixo e para trás trazendo a carga ao peito", "Retorne controlado até a extensão completa sem perder a tensão"];
  if (b.includes("empurrar vertical") || b.includes("desenvolvimento") || b.includes("overhead"))
    return ["Posicione a carga na altura dos ombros com core ativado e lombar neutra", "Empurre verticalmente acima da cabeça sem travar os cotovelos no topo", "Desça de forma controlada de volta à altura dos ombros", "Mantenha o abdômen contraído para proteger a lombar durante todo o movimento"];
  if (b.includes("agachamento") || b.includes("squat"))
    return ["Pés na largura dos ombros com pontas levemente abertas", "Inicie empurrando os joelhos na direção dos dedos dos pés", "Desça mantendo o peito alto e a lombar neutra até a profundidade adequada", "Suba empurrando com os calcanhares contraindo glúteos e quadríceps"];
  if (b.includes("hip hinge") || b.includes("terra") || b.includes("stiff"))
    return ["Fique em pé com coluna neutra e core pré-ativado", "Inicie o movimento empurrando o quadril para trás — não curve a lombar", "Desça mantendo a coluna neutra até sentir o alongamento do posterior de coxa", "Suba empurrando o quadril à frente e contraindo glúteos"];
  if (b.includes("hip thrust") || b.includes("glúteo"))
    return ["Apoie as escápulas no banco e posicione os pés no chão", "Contraia os glúteos e empurre o quadril verticalmente para cima", "Segure 2s no topo com quadril, joelhos e ombros em linha reta", "Desça controlado sem encostar o quadril completamente antes de repetir"];
  if (b.includes("abdução") || b.includes("abducao"))
    return ["Posicione-se com o equipamento e cotovelos levemente flexionados", "Abra o braço ou a perna lateralmente de forma controlada até a amplitude máxima", "Segure 1s no ponto de abertura máxima contraindo o músculo alvo", "Retorne de forma lenta e controlada mantendo a tensão"];
  if (b.includes("adução") || b.includes("aducao") || b.includes("crossover") || b.includes("crucifixo"))
    return ["Posicione-se com os braços abertos e cotovelos levemente flexionados", "Feche os braços em arco contraindo o músculo alvo no centro", "Segure 1s na contração máxima", "Retorne controlado ao ponto de alongamento sem perder o controle"];
  if (b.includes("flexão de cotovelo") || b.includes("rosca") || b.includes("curl"))
    return ["Segure a carga com cotovelos fixos ao lado do tronco", "Suba contraindo conscientemente o músculo alvo", "Segure 1s no topo com contração máxima", "Desça de forma totalmente controlada até a extensão completa"];
  if (b.includes("extensão") || b.includes("triceps") || b.includes("extension"))
    return ["Posicione-se com cotovelos fixos apontando para o teto ou à frente", "Estenda o cotovelo contraindo o tríceps completamente", "Segure 1s na extensão máxima", "Retorne controlado até o ponto de máximo alongamento do tríceps"];
  if (b.includes("flexão plantar") || b.includes("panturrilha") || b.includes("calf"))
    return ["Posicione a meia planta do pé na borda da superfície de apoio", "Desça os calcanhares abaixo do nível para o máximo alongamento", "Suba na ponta dos pés o mais alto possível contraindo a panturrilha", "Segure 2s no topo e desça de forma muito controlada (3s)"];
  if (b.includes("anti-extensão") || b.includes("isometria") || b.includes("prancha"))
    return ["Posicione-se com o corpo em linha reta da cabeça aos calcanhares", "Ative glúteos, abdômen e quadríceps simultaneamente", "Mantenha a respiração constante — não prenda o ar", "Segure o tempo máximo mantendo todas as compensações sob controle"];
  if (b.includes("flexão tronco") || b.includes("abdominal") || b.includes("crunch"))
    return ["Deite com joelhos dobrados e pés apoiados no chão", "Contraia o abdômen e eleve apenas as escápulas — não o tronco inteiro", "Expire completamente na contração máxima", "Desça controlado sem apoiar completamente antes da próxima rep"];
  return [
    "Posicione-se de forma estável com o equipamento necessário",
    "Execute o movimento em amplitude completa de forma controlada",
    "Segure 1s na contração máxima antes de retornar",
    "Mantenha o core ativado e a coluna neutra durante todo o exercício",
  ];
}

function getAutoMistakes(biomechanics: string): string[] {
  const b = biomechanics.toLowerCase();
  if (b.includes("empurrar horizontal"))
    return ["Arquear a lombar excessivamente para empurrar mais peso", "Cotovelos completamente abertos a 90° sobrecarregando os ombros", "Descer sem controle usando apenas a gravidade"];
  if (b.includes("puxar"))
    return ["Usar impulso do tronco em vez de ativar os músculos das costas", "Não retrair as escápulas no ponto de contração máxima", "Encurtar a amplitude sem completar a extensão dos braços"];
  if (b.includes("empurrar vertical") || b.includes("overhead"))
    return ["Arquear a lombar para compensar falta de mobilidade de ombro", "Travar os cotovelos no topo eliminando tensão no deltóide", "Inclinar demais o tronco transferindo carga para o peitoral"];
  if (b.includes("agachamento") || b.includes("squat"))
    return ["Joelhos colapsando para dentro ao subir — indica fraqueza de glúteo médio", "Lombar arredondada no fundo do movimento", "Calcanhares se levantando do chão durante a execução"];
  if (b.includes("hip hinge"))
    return ["Arredondar a lombar durante o movimento — principal causa de lesão", "Dobrar os joelhos em excesso transformando em agachamento", "Descer a carga longe do corpo criando alavanca prejudicial"];
  if (b.includes("flexão de cotovelo") || b.includes("curl"))
    return ["Balançar o tronco usando impulso em vez de força muscular", "Não completar a amplitude — nem subir nem descer totalmente", "Cotovelos se afastando do tronco durante a execução"];
  if (b.includes("extensão") || b.includes("triceps"))
    return ["Mover os cotovelos durante o movimento — devem permanecer fixos", "Usar impulso para completar as repetições em vez de força do tríceps", "Amplitude reduzida que não trabalha o músculo completamente"];
  if (b.includes("flexão plantar") || b.includes("panturrilha"))
    return ["Amplitude curta sem descer ao alongamento máximo", "Usar impulso do joelho em vez de força da panturrilha", "Velocidade alta que desperdiça a fase excêntrica fundamental"];
  return [
    "Usar impulso ou inércia em vez de controle muscular",
    "Amplitude incompleta que limita o desenvolvimento muscular",
    "Não manter a posição correta durante todo o movimento",
  ];
}

const catalogExercises: Exercise[] = [];
const typeOrder = [strengthType, calisthenicsType];
const muscleOrder: MuscleGroup[] = [
  chestMuscle,
  backMuscle,
  shouldersMuscle,
  bicepsMuscle,
  tricepsMuscle,
  legsMuscle,
  glutesMuscle,
  coreMuscle,
  forearmMuscle,
  fullBodyMuscle,
];

musculacaoPrincipalCatalog.forEach((path) => {
  const name = extractCatalogName(path);
  const sourceGroup = extractCatalogSourceGroup(path);
  const muscle = inferMuscleFromCatalog(path);
  const type = inferTypeFromCatalog(path);

  const biomechanics = inferBiomechanicsFromCatalog(muscle, type, name);
  catalogExercises.push({
    id: `catalog-${catalogExercises.length + 1}`,
    name,
    type,
    muscle,
    sourceGroup,
    equipment: inferEquipmentFromCatalog(path),
    biomechanics,
    instructions: getAutoInstructions(biomechanics),
    mistakes: getAutoMistakes(biomechanics),
    alternatives: [],
    gifUrl: encodeURI(`/musculacao-media/${path}`),
  });
});

calistheniaPuraCatalog.forEach((path) => {
  const name = extractCatalogName(path);
  const muscle = inferMuscleFromCatalog(path);

  const calBiomechanics = inferBiomechanicsFromCatalog(muscle, calisthenicsType, name);
  catalogExercises.push({
    id: `catalog-${catalogExercises.length + 1}`,
    name,
    type: calisthenicsType,
    muscle,
    sourceGroup: "Calistenia",
    equipment: inferEquipmentFromCatalog(path),
    biomechanics: calBiomechanics,
    instructions: getAutoInstructions(calBiomechanics),
    mistakes: getAutoMistakes(calBiomechanics),
    alternatives: [],
    gifUrl: encodeURI(`/calistenia-pura/Calistenia/${path}`),
  });
});

const compareLibraryExercises = (left: Exercise, right: Exercise) => {
  const typeDifference = typeOrder.indexOf(left.type) - typeOrder.indexOf(right.type);
  if (typeDifference !== 0) return typeDifference;

  const muscleDifference = muscleOrder.indexOf(left.muscle) - muscleOrder.indexOf(right.muscle);
  if (muscleDifference !== 0) return muscleDifference;

  return left.name.localeCompare(right.name);
};

export const exercises: Exercise[] = [...curatedExercises, ...catalogExercises];
export const libraryExercises: Exercise[] = [...curatedExercises, ...catalogExercises].sort(compareLibraryExercises);

const exerciseMap = new Map(exercises.map((e) => [e.id, e]));
const workoutMap = new Map(workouts.map((w) => [w.id, w]));

export function getExercise(id: string) {
  return exerciseMap.get(id);
}
export function getWorkout(id: string) {
  return workoutMap.get(id);
}







