import type { AppLocale } from "@/lib/locale";
import { getStoredLocale } from "@/lib/locale";
import type { MuscleGroup } from "@/data/library";

const muscleGroupLabels: Record<MuscleGroup, Record<AppLocale, string>> = {
  Peito:     { pt: "Peito",     es: "Pecho",           fr: "Pectoraux",     de: "Brust",      en: "Chest"      },
  Costas:    { pt: "Costas",    es: "Espalda",         fr: "Dos",           de: "Rücken",     en: "Back"       },
  Ombros:    { pt: "Ombros",    es: "Hombros",         fr: "Épaules",       de: "Schultern",  en: "Shoulders"  },
  "Bíceps":  { pt: "Bíceps",    es: "Bíceps",          fr: "Biceps",        de: "Bizeps",     en: "Biceps"     },
  "Tríceps": { pt: "Tríceps",   es: "Tríceps",         fr: "Triceps",       de: "Trizeps",    en: "Triceps"    },
  Pernas:    { pt: "Pernas",    es: "Piernas",         fr: "Jambes",        de: "Beine",      en: "Legs"       },
  "Glúteos": { pt: "Glúteos",   es: "Glúteos",         fr: "Fessiers",      de: "Gesäß",      en: "Glutes"     },
  Core:      { pt: "Core",      es: "Core",            fr: "Core",          de: "Core",       en: "Core"       },
  "Antebraço": { pt: "Antebraço", es: "Antebrazo",    fr: "Avant-bras",    de: "Unterarme",  en: "Forearms"   },
  "Full Body": { pt: "Full Body", es: "Cuerpo Completo", fr: "Corps Complet", de: "Ganzkörper", en: "Full Body" },
};

export function getMuscleGroupLabel(muscle: MuscleGroup | string, locale: AppLocale = getStoredLocale()): string {
  const entry = muscleGroupLabels[muscle as MuscleGroup];
  if (!entry) return muscle;
  return entry[locale] ?? entry.pt;
}

type ExerciseTranslation = Partial<Record<AppLocale, string>>;

const exerciseNames: Record<string, ExerciseTranslation> = {
  "supino-reto":            { en: "Bench Press",               es: "Press de Banca",              fr: "Développé Couché",           de: "Bankdrücken"               },
  "supino-halter":          { en: "Dumbbell Bench Press",       es: "Press Mancuernas",            fr: "Développé Couché Haltères",  de: "Kurzhantel Bankdrücken"    },
  "crucifixo":              { en: "Dumbbell Fly",               es: "Aperturas con Mancuernas",    fr: "Écarté Haltères",            de: "Fliegende Kurzhantel"      },
  "crossover":              { en: "Cable Crossover",            es: "Cable Crossover",             fr: "Câble Croisé",               de: "Kabelzug Kreuz"            },
  "remada-curvada":         { en: "Barbell Row",                es: "Remo con Barra",              fr: "Rowing Barre",               de: "Langhantelrudern"          },
  "remada-baixa":           { en: "Seated Cable Row",           es: "Remo en Polea Baja",          fr: "Rowing à la Poulie Basse",   de: "Sitzrudern am Kabel"       },
  "puxada-frente":          { en: "Lat Pulldown",               es: "Jalón al Pecho",              fr: "Tirage à la Poulie Haute",   de: "Latziehen"                 },
  "barra-fixa":             { en: "Pull-Up",                    es: "Dominadas",                   fr: "Traction",                   de: "Klimmzug"                  },
  "desenvolvimento":        { en: "Military Press",             es: "Press Militar",               fr: "Développé Militaire",        de: "Militärpress"              },
  "desenvolvimento-halter": { en: "Dumbbell Shoulder Press",    es: "Press Hombros Mancuernas",    fr: "Développé Épaules Haltères", de: "Schulterdrücken Kurzhantel"},
  "elevacao-lateral":       { en: "Lateral Raise",              es: "Elevaciones Laterales",       fr: "Élévation Latérale",         de: "Seitheben"                 },
  "elevacao-cabos":         { en: "Cable Lateral Raise",        es: "Elevaciones Laterales Cable", fr: "Élévation Latérale Câble",   de: "Seitheben Kabel"           },
  "rosca-direta":           { en: "Barbell Curl",               es: "Curl de Bíceps con Barra",    fr: "Curl Barre",                 de: "Langhantel-Curl"           },
  "rosca-alternada":        { en: "Alternating Dumbbell Curl",  es: "Curl Alterno con Mancuernas", fr: "Curl Alterné Haltères",      de: "Wechselnder Kurzhantel-Curl"},
  "rosca-martelo":          { en: "Hammer Curl",                es: "Curl Martillo",               fr: "Curl Marteau",               de: "Hammer-Curl"               },
  "triceps-corda":          { en: "Rope Triceps Pushdown",      es: "Extensión de Tríceps Cuerda", fr: "Extension Triceps Corde",    de: "Trizeps-Seildrücken"       },
  "triceps-frances":        { en: "Skull Crusher",              es: "Press Francés",               fr: "Extension Couchée",          de: "Trizeps-Strecken liegend"  },
  "mergulho":               { en: "Parallel Bar Dip",           es: "Fondos en Paralelas",         fr: "Dips aux Barres Parallèles", de: "Dips an Parallelstangen"   },
  "agachamento":            { en: "Barbell Squat",              es: "Sentadilla con Barra",        fr: "Squat Barre",                de: "Kniebeuge mit Langhantel"   },
  "leg-press":              { en: "Leg Press 45°",              es: "Prensa 45°",                  fr: "Presse à Cuisse 45°",        de: "Beinpresse 45°"            },
  "stiff":                  { en: "Romanian Deadlift",          es: "Peso Muerto Rumano",          fr: "Soulevé de Terre Roumain",   de: "Rumänisches Kreuzheben"    },
  "levantamento-terra":     { en: "Deadlift",                   es: "Peso Muerto",                 fr: "Soulevé de Terre",           de: "Kreuzheben"                },
  "cadeira-extensora":      { en: "Leg Extension",              es: "Extensión de Cuádriceps",     fr: "Extension Quadriceps",       de: "Beinstreckung"             },
  "mesa-flexora":           { en: "Lying Leg Curl",             es: "Curl de Isquiotibiales",      fr: "Curl Ischio-Jambiers",       de: "Beinbeuger"                },
  "panturrilha":            { en: "Standing Calf Raise",        es: "Elevación de Talones",        fr: "Mollets Debout",             de: "Wadenheben Stehend"        },
  "elevacao-quadril":       { en: "Hip Thrust",                 es: "Hip Thrust",                  fr: "Hip Thrust",                 de: "Hip Thrust"                },
  "abdutor":                { en: "Hip Abduction Machine",      es: "Máquina Abductora",           fr: "Machine Abducteur",          de: "Abduktionsmaschine"        },
  "prancha":                { en: "Plank",                      es: "Plancha",                     fr: "Planche",                    de: "Plank"                     },
  "abdominal":              { en: "Crunch",                     es: "Crunch Abdominal",            fr: "Crunch",                     de: "Crunch"                    },
  "leg-raise":              { en: "Leg Raise",                  es: "Elevación de Piernas",        fr: "Élévation de Jambes",        de: "Beinheben"                 },
  "ab-roller":              { en: "Ab Roller",                  es: "Rueda Abdominal",             fr: "Rouleau Abdominal",          de: "Bauchroller"               },
  "flexao":                 { en: "Push-Up",                    es: "Flexiones",                   fr: "Pompe",                      de: "Liegestütz"                },
  "flexao-fechada":         { en: "Close-Grip Push-Up",         es: "Flexiones Cerradas",          fr: "Pompe Serrée",               de: "Enger Liegestütz"          },
  "dips-cadeira":           { en: "Chair Dip",                  es: "Fondos en Silla",             fr: "Dips sur Chaise",            de: "Stuhl-Dip"                 },
  "remada-australiana":     { en: "Australian Row",             es: "Remo Australiano",            fr: "Rowing Australien",          de: "Australisches Rudern"      },
  "curl-barra-fixa":        { en: "Supinated Pull-Up",          es: "Dominadas Supinadas",         fr: "Traction Supinée",           de: "Supinierter Klimmzug"      },
  "elevacao-toalha":        { en: "Towel Lateral Raise",        es: "Elevación con Toalla",        fr: "Élévation avec Serviette",   de: "Seitheben mit Handtuch"    },
  "pike-push-up":           { en: "Pike Push-Up",               es: "Flexión en Pico",             fr: "Pompe en V",                 de: "Pike Liegestütz"           },
  "agachamento-bulgaro-pc": { en: "Bulgarian Split Squat",      es: "Sentadilla Búlgara",          fr: "Fente Bulgare",              de: "Bulgarische Kniebeuge"     },
  "hip-thrust-solo":        { en: "Bodyweight Hip Thrust",      es: "Hip Thrust en el Suelo",      fr: "Hip Thrust au Sol",          de: "Boden-Hip-Thrust"          },
  "muscle-up":              { en: "Muscle-Up",                  es: "Muscle Up",                   fr: "Muscle Up",                  de: "Muscle Up"                 },
  "pistol-squat":           { en: "Pistol Squat",               es: "Sentadilla Pistola",          fr: "Squat Pistol",               de: "Pistol Squat"              },
  "handstand":              { en: "Handstand Push-Up",          es: "Flexión en Pino",             fr: "Pompe en Équilibre",         de: "Handstand-Liegestütz"      },
  "front-lever":            { en: "Front Lever",                es: "Front Lever",                 fr: "Front Lever",                de: "Front Lever"               },
};

const biomechanicsTranslations: Record<string, Record<AppLocale, string>> = {
  "Empurrar horizontal":         { pt: "Empurrar horizontal",         en: "Horizontal push",            es: "Empuje horizontal",         fr: "Poussée horizontale",      de: "Horizontaler Druck"           },
  "Empurrar vertical":           { pt: "Empurrar vertical",           en: "Vertical push",              es: "Empuje vertical",           fr: "Poussée verticale",        de: "Vertikaler Druck"             },
  "Puxar horizontal":            { pt: "Puxar horizontal",            en: "Horizontal pull",            es: "Tirón horizontal",          fr: "Tirage horizontal",        de: "Horizontaler Zug"             },
  "Puxar vertical":              { pt: "Puxar vertical",              en: "Vertical pull",              es: "Tirón vertical",            fr: "Tirage vertical",          de: "Vertikaler Zug"               },
  "Adução horizontal":           { pt: "Adução horizontal",           en: "Horizontal adduction",       es: "Aducción horizontal",       fr: "Adduction horizontale",    de: "Horizontale Adduktion"        },
  "Abdução":                     { pt: "Abdução",                     en: "Abduction",                  es: "Abducción",                 fr: "Abduction",                de: "Abduktion"                    },
  "Flexão de cotovelo":          { pt: "Flexão de cotovelo",          en: "Elbow flexion",              es: "Flexión de codo",           fr: "Flexion du coude",         de: "Ellbogenbeugung"              },
  "Extensão":                    { pt: "Extensão",                    en: "Extension",                  es: "Extensión",                 fr: "Extension",                de: "Extension"                    },
  "Extensão cotovelo":           { pt: "Extensão cotovelo",           en: "Elbow extension",            es: "Extensión de codo",         fr: "Extension du coude",       de: "Ellbogenstreckung"            },
  "Flexão neutra":               { pt: "Flexão neutra",               en: "Neutral flexion",            es: "Flexión neutra",            fr: "Flexion neutre",           de: "Neutrale Beugung"             },
  "Agachamento":                 { pt: "Agachamento",                 en: "Squat",                      es: "Sentadilla",                fr: "Squat",                    de: "Kniebeuge"                    },
  "Agachamento unilateral":      { pt: "Agachamento unilateral",      en: "Unilateral squat",           es: "Sentadilla unilateral",     fr: "Squat unilatéral",         de: "Einseitiger Kniebeuge"        },
  "Hip hinge":                   { pt: "Hip hinge",                   en: "Hip hinge",                  es: "Bisagra de cadera",         fr: "Rotation de hanche",       de: "Hüftgelenk"                   },
  "Extensão joelho":             { pt: "Extensão joelho",             en: "Knee extension",             es: "Extensión de rodilla",      fr: "Extension du genou",       de: "Kniestreckung"                },
  "Flexão joelho":               { pt: "Flexão joelho",               en: "Knee flexion",               es: "Flexión de rodilla",        fr: "Flexion du genou",         de: "Kniebeugung"                  },
  "Flexão plantar":              { pt: "Flexão plantar",              en: "Plantarflexion",             es: "Flexión plantar",           fr: "Flexion plantaire",        de: "Plantarflexion"               },
  "Hip thrust":                  { pt: "Hip thrust",                  en: "Hip thrust",                 es: "Hip thrust",                fr: "Hip thrust",               de: "Hip thrust"                   },
  "Abdução quadril":             { pt: "Abdução quadril",             en: "Hip abduction",              es: "Abducción de cadera",       fr: "Abduction de hanche",      de: "Hüftabduktion"                },
  "Anti-extensão":               { pt: "Anti-extensão",               en: "Anti-extension",             es: "Anti-extensión",            fr: "Anti-extension",           de: "Anti-Extension"               },
  "Flexão tronco":               { pt: "Flexão tronco",               en: "Trunk flexion",              es: "Flexión de tronco",         fr: "Flexion du tronc",         de: "Rumpfbeugung"                 },
  "Flexão quadril":              { pt: "Flexão quadril",              en: "Hip flexion",                es: "Flexión de cadera",         fr: "Flexion de hanche",        de: "Hüftbeugung"                  },
  "Puxar + Empurrar":            { pt: "Puxar + Empurrar",            en: "Pull + Push",                es: "Tirón + Empuje",            fr: "Tirage + Poussée",         de: "Zug + Druck"                  },
  "Isometria":                   { pt: "Isometria",                   en: "Isometric",                  es: "Isométrico",                fr: "Isométrique",              de: "Isometrisch"                  },
  "Empurrar vertical invertido": { pt: "Empurrar vertical invertido", en: "Inverted vertical push",     es: "Empuje vertical invertido", fr: "Poussée verticale inversée", de: "Invertierter vertikaler Druck" },
};

export function getExerciseName(exerciseId: string, ptName: string, locale: AppLocale = getStoredLocale()): string {
  if (locale === "pt") return ptName;
  const entry = exerciseNames[exerciseId];
  return entry?.[locale] ?? ptName;
}

export function getExerciseBiomechanics(ptBiomechanics: string, locale: AppLocale = getStoredLocale()): string {
  if (locale === "pt") return ptBiomechanics;
  const entry = biomechanicsTranslations[ptBiomechanics];
  return entry?.[locale] ?? ptBiomechanics;
}

const equipmentLabels: Record<string, Record<AppLocale, string>> = {
  "barra":          { pt: "Barra",          es: "Barra",           fr: "Barre",             de: "Langhantel",       en: "Barbell"       },
  "halteres":       { pt: "Halteres",       es: "Mancuernas",      fr: "Haltères",          de: "Kurzhanteln",      en: "Dumbbells"     },
  "cabos":          { pt: "Cabos",          es: "Cables",          fr: "Câbles",            de: "Kabel",            en: "Cables"        },
  "barra fixa":     { pt: "Barra Fixa",     es: "Barra Fija",      fr: "Barre Fixe",        de: "Klimmzugstange",   en: "Pull-up Bar"   },
  "paralelas":      { pt: "Paralelas",      es: "Paralelas",       fr: "Barres Parallèles", de: "Parallelstangen",  en: "Parallel Bars" },
  "maquina":        { pt: "Máquina",        es: "Máquina",         fr: "Machine",           de: "Maschine",         en: "Machine"       },
  "peso corporal":  { pt: "Peso corporal",  es: "Peso corporal",   fr: "Poids du corps",    de: "Körpergewicht",    en: "Bodyweight"    },
  "roda abdominal": { pt: "Roda Abdominal", es: "Rueda Abdominal", fr: "Rouleau Abdominal", de: "Bauchrolle",       en: "Ab Roller"     },
  "parede":         { pt: "Parede",         es: "Pared",           fr: "Mur",               de: "Wand",             en: "Wall"          },
  "trx":            { pt: "TRX",            es: "TRX",             fr: "TRX",               de: "TRX",              en: "TRX"           },
  "banco":          { pt: "Banco",          es: "Banco",           fr: "Banc",              de: "Bank",             en: "Bench"         },
};

export function getEquipmentLabel(equipment: string, locale: AppLocale = getStoredLocale()): string {
  const normalized = equipment
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
  const entry = equipmentLabels[normalized];
  if (entry) return entry[locale] ?? entry.pt;
  return equipment;
}
