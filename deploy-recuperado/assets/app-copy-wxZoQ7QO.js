import { g as getStoredLocale, $ as getDefaultLocale } from "./router-BDD3RgVy.js";
const defaultLocale = getDefaultLocale();
const appCopy = {
  pt: {
    auth: { loginTitle: "Bem-vindo de volta", loginSubtitle: "Seu plano te espera. Entre e evolua.", forgotPassword: "Esqueci a senha", createAccount: "Criar conta", rememberMe: "Lembrar de mim", signIn: "Entrar", signingIn: "Entrando...", emailLabel: "Email", emailPlaceholder: "voce@zyrox.app", passwordLabel: "Senha", passwordPlaceholder: "********", invalidCredentials: "Email ou senha incorretos.", createAccountTitle: "Criar conta", createAccountSubtitle: "Seus dados ficam seguros. Em 2 minutos seu plano de 12 semanas estará pronto.", backToLogin: "Voltar para login", createAccountCta: "Criar minha conta", creatingAccount: "Criando conta...", nameLabel: "Nome", namePlaceholder: "Seu nome", confirmPasswordLabel: "Confirmar senha", confirmPasswordPlaceholder: "Repita a senha", passwordHint: "Mínimo de 6 caracteres", missingName: "Digite seu nome para criar a conta.", invalidEmail: "Digite um email válido.", weakPassword: "A senha precisa ter pelo menos 6 caracteres.", passwordMismatch: "As senhas não conferem.", recoverTitle: "Recuperar senha", recoverSubtitle: "Informe seu email para consultar a conta local", recoverCta: "Consultar senha", recoverMissingEmail: "Digite seu email para recuperar a senha.", recoverDemoFound: "Conta demo localizada. Use a senha 123456 para entrar.", recoverDemoOnly: "Neste ambiente local, apenas a conta demo possui recuperação automática.", socialSoon: "Em breve", emailDivider: "ou com email", builtForEvolution: "Built for evolution | 3D Body Scan" },
    dashboard: { todayWorkout: "Treino de hoje", weeklyTitle: "Sua semana 3D Body Scan", coachLabel: "Coach IA", profileTitle: "Perfil de evolução", achievementsTitle: "Conquistas", achievementsOpen: "Conquistas abertas", greeting: "Olá,", headline: "Bora treinar,", startBtn: "Iniciar", exercisesLabel: "exercícios", weekLabel: "Semana", statSeries: "Séries da semana", statFrequency: "Frequência", statWorkouts: "Treinos no plano", statReadiness: "Readiness", statDays: "dias", statAchievements: "conquistas", levelLabel: "Nível atual", xpLabel: "XP acumulado", streakLabel: "Streak", streakDays: "dias", streakDesc: "Cada dia conta — não quebre sua sequência.", dailyMission: "Missão de hoje", weekRhythm: "Ritmo da semana", setsPlanned: "séries planejadas", viewAll: "Ver tudo", aiTitle: "Recomendações da IA", sessionPlanned: "sessão planejada pela IA", sessionsPlanned: "sessões planejadas pela IA" },
    onboarding: { focusTitle: "O que você quer conquistar?", focusSubtitle: "Isso define toda a estrutura do seu plano — exercícios, volume e progressão.", addPhoto: "Adicionar foto", nameLabel: "Seu nome", namePlaceholder: "Como você quer aparecer no app", stepBack: "Anterior", stepNext: "Continuar", stepLabel: "Passo", skipLabel: "Pular", insightPrefix: "Insight de IA:", insightFocus: "seu foco define o algoritmo de progressão e a divisão do plano.", consistencyTitle: "Com que frequência você treina?", consistencySubtitle: "Isso calibra volume, recuperação e agressividade do plano.", experienceTitle: "Qual seu nível de experiência?", experienceSubtitle: "O plano ajusta intensidade, exercícios e densidade por esse nível.", locationTitle: "Onde você treina?", locationSubtitle: "Vamos adaptar os treinos ao seu ambiente real.", gymSizeTitle: "Porte da academia", crowdLevelTitle: "Horário em que você mais treina", equipmentTitle: "Quais equipamentos você tem acesso?", equipmentSubtitle: "Selecione todos. A IA monta o plano com base no que você realmente tem.", daysTitle: "Quais dias você pode treinar?", daysSubtitle: "Selecione os dias da semana disponíveis.", noDaysSelected: "Nenhum dia selecionado", durationTitle: "Quanto tempo por treino?", durationSubtitle: "A IA estrutura o volume com base na sua janela de tempo.", minutes: "minutos", resultTitle: "Qual resultado você quer alcançar?", resultSubtitle: "Escolha sua meta principal para a periodização ficar coerente.", buildingTitle: "Montando seu protocolo exclusivo...", daysSingular: "dia", daysPlural: "dias", goals: { mass: { title: "Ganho de Massa", subtitle: "Hipertrofia e bodybuilding" }, strength: { title: "Força Funcional", subtitle: "Calistenia, força e poder" }, hybrid: { title: "Performance Híbrida", subtitle: "Mistura de modalidades e contexto real" }, athletic: { title: "Evolução Atlética", subtitle: "Ajuste para performance e condicionamento" }, weight_loss: { title: "Perda de peso", subtitle: "Emagrecer com saúde e preservar músculo" }, definition: { title: "Definição muscular", subtitle: "Reduzir gordura e revelar a musculatura" }, endurance: { title: "Resistência e condicionamento", subtitle: "Melhorar capacidade cardiovascular e fôlego" }, wellness: { title: "Saúde e bem-estar", subtitle: "Manter ativo, reduzir estresse e viver melhor" } }, consistency: { occasional: { title: "Ocasionalmente", subtitle: "1 a 2 vezes por semana" }, regular: { title: "Regularmente", subtitle: "3 a 5 vezes por semana" }, elite: { title: "Atleta de Elite", subtitle: "6+ vezes por semana" } }, experience: { beginner: { title: "Iniciante", subtitle: "Estou começando" }, intermediate: { title: "Intermediário", subtitle: "Já treino há alguns meses" }, advanced: { title: "Avançado", subtitle: "Anos de consistência" } }, locations: { gym: { title: "Academia", subtitle: "Equipamento completo" }, home: { title: "Casa", subtitle: "Home gym ou peso corporal" }, hybrid: { title: "Híbrido", subtitle: "Alterno entre academia e casa" }, outdoor: { title: "Outdoor", subtitle: "Parque e calistenia ao ar livre" } }, gymSizes: { pequena: "Pequena", media: "Média", grande: "Grande" }, crowdLevels: { vazio: "Vazio", normal: "Normal", pico: "Pico" }, weekdaysShort: ["S", "T", "Q", "Q", "S", "S", "D"], weekdaysFull: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"], results: { hypertrophy: { title: "Hipertrofia visível", subtitle: "Ganho de massa e evolução estética" }, strength: { title: "Força máxima", subtitle: "PRs em compostos pesados" }, skill: { title: "Skills de calistenia", subtitle: "Muscle-up, front lever, planche" }, performance: { title: "Performance atlética", subtitle: "Potência, agilidade e condicionamento" } }, aiPhases: ["Analisando padrão de treino...", "Calculando recuperação muscular...", "Adaptando progressão de carga...", "Selecionando exercícios ideais...", "Criando seu plano personalizado..."], defaultName: "Seu nome", problemTitle: "O que te impede hoje?", problemSubtitle: "Seja honesto — a IA vai usar isso para adaptar seu plano.", problems: { no_results: { label: "Treino sem resultado", subtitle: "Esforço mas não vejo mudanças" }, no_time: { label: "Falta de tempo", subtitle: "Rotina corrida, difícil manter consistência" }, no_plan: { label: "Sem plano claro", subtitle: "Não sei o que fazer ou como progredir" }, no_motivation: { label: "Falta de motivação", subtitle: "Começo mas não consigo manter" }, plateau: { label: "Platô de evolução", subtitle: "Evoluí antes mas travei no mesmo ponto" } }, ormTitle: "1RM estimado", ormSubtitle: "Opcional — a IA usa para calibrar a progressão de carga", ormBench: "Supino reto", ormSquat: "Agachamento", ormDeadlift: "Levantamento terra", ormOhp: "Desenvolvimento (OHP)", bodyProfileTitle: "Seu perfil corporal", bodyProfileSubtitle: "Dados usados para calcular seu metabolismo basal e calorias ideais com precisão.", weightLabel: "Peso atual", heightLabel: "Altura", ageLabel: "Idade", ageUnit: "anos", bmiLabel: "IMC", bmiUnderweight: "Abaixo do peso", bmiHealthy: "Peso saudável", bmiOverweight: "Sobrepeso", bmiObese: "Obesidade", metabolismTitle: "Como é seu metabolismo?", metabolismSubtitle: "A IA ajusta suas calorias e macros com base no seu perfil metabólico.", metabolismSlow: { label: "Metabolismo lento", subtitle: "Ganho peso com facilidade, dificuldade para emagrecer" }, metabolismBalanced: { label: "Metabolismo equilibrado", subtitle: "Mantenho peso razoavelmente sem muito esforço" }, metabolismFast: { label: "Metabolismo rápido", subtitle: "Dificuldade para ganhar peso, como bastante" }, caloricPlanTitle: "Seu plano calórico", kcalDay: "kcal / dia", macroProtein: "Proteína", macroCarbs: "Carbs", macroFat: "Gordura", tmbLabel: "TMB (Repouso)", tdeeLabel: "TDEE (Ativo)", metabolismNote: "* Cálculo baseado no perfil médio. Ajuste fino disponível no passo 10 ao informar sexo biológico.", aiNutritionLabel: "IA Nutricional: ", fillBodyDataMsg: "Complete os dados de peso, altura e idade no passo anterior para ver seu plano calórico personalizado.", selectMetabolismMsg: "Selecione seu perfil metabólico para visualizar seu plano calórico e macros personalizados.", focusMuscleTitle: "Onde quer focar?", focusMuscleSubtitle: "Selecione os grupos musculares prioritários. A IA dá mais volume onde você quer crescer.", muscleGroups: ["Peito", "Costas", "Ombros", "Bíceps", "Tríceps", "Abdômen", "Glúteos", "Quadríceps", "Posterior", "Panturrilha"], aiVolumeHintPre: "Mais volume em", aiVolumeHintSuf: "Distribuição otimizada automaticamente.", nutritionHabitsTitle: "Seus hábitos alimentares", nutritionHabitsSubtitle: "A IA sincroniza sua nutrição com seu treino para resultados máximos.", mealsPerDayLabel: "Refeições por dia", dietStyleLabel: "Estilo alimentar (opcional)", mealOptions: { m2: { label: "2 refeições", subtitle: "Jejum intermitente ou refeições grandes" }, m3: { label: "3 refeições", subtitle: "Café, almoço e janta" }, m45: { label: "4-5 refeições", subtitle: "Refeições fracionadas ao longo do dia" }, m6: { label: "6+ refeições", subtitle: "Alta frequência, porções menores" } }, dietOptions: { none: "Sem dieta específica", low_carb: "Low carb", high_protein: "Alto proteico", vegan: "Vegano / Vegetariano", if: "Jejum intermitente" }, cycleRoutineTitle: "Seu ciclo e rotina", cycleRoutineSubtitle: "A IA adapta intensidade, volume e recuperação ao seu perfil completo.", biologicalSexLabel: "Sexo biológico", genderMale: "Masculino", genderFemale: "Feminino", genderOther: "Outro", hormonalCycleLabel: "Ciclo hormonal", trackCycleTitle: "Adaptar treino ao ciclo menstrual", trackCycleSubtitle: "A IA ajusta intensidade e volume por fase do ciclo", perWeekLabel: "x/semana", analysingTitle: "IA Analisando seu Perfil", analysingProcessing: "Processando", analysingVarsSuffix: "variáveis do seu perfil", generatingLabel: "Gerando plano", goalLabels: { mass: "Hipertrofia", strength: "Força", hybrid: "Híbrido", athletic: "Performance", weight_loss: "Perda de peso", definition: "Definição muscular", endurance: "Resistência", wellness: "Bem-estar" }, expLabels: { beginner: "iniciante", intermediate: "intermediário", advanced: "avançado" }, locLabels: { gym: "academia", home: "casa", hybrid: "academia e casa", outdoor: "ar livre" }, phaseProfile: "Analisando perfil de {name} · objetivo {goal}", phaseLevel: "Calibrando volume para nivel {exp}", phaseEquipment: "Mapeando {count} equipamentos disponíveis", phaseLocation: "Adaptando treino para {loc}", phaseSchedule: "Estruturando {days}x por semana · {duration} min/sessão", phaseCalories: "Calculando {target} kcal/dia · {protein}g prot · {carbs}g carbs", phaseCaloriesDefault: "Calculando calorias e macros ideais", phaseFinale: "Gerando plano exclusivo com IA · 94% de compatibilidade" },
    settings: { pageTag: "Preferências", pageTitle: "Configurações", sectionTitle: "App e experiência", sectionSubtitle: "Ajustes principais que impactam seu uso diário do 3D Body Scan.", languageTitle: "Idioma", languageDescription: "Troque o idioma base do aplicativo.", notificationsTitle: "Notificações", notificationsDescription: "Lembretes de treino, streak e acompanhamento de rotina.", privacyTitle: "Privacidade", privacyDescription: "Controle local dos dados de onboarding e histórico salvo no navegador.", bodyScanTitle: "Scan corporal", bodyScanDescription: "Calibragem de altura e peso usada para leituras mais consistentes.", engineTitle: "Motor de treino", engineDescription: "Treinos gerados conforme objetivo, ambiente e equipamentos disponíveis.", activeStatus: "Ativo", localStatus: "Local", configuredStatus: "Configurado", pendingStatus: "Pendente", adaptiveStatus: "Adaptativo", profileStateTitle: "Estado atual do perfil", profileStateDescription: "As preferências do app estão vinculadas ao seu onboarding e ao contexto salvo localmente." }
  },
  es: {
    auth: { loginTitle: "Bienvenido de nuevo", loginSubtitle: "Inicia sesión para continuar tu evolución", forgotPassword: "Olvidé mi contraseña", createAccount: "Crear cuenta", rememberMe: "Recordarme", signIn: "Entrar", signingIn: "Entrando...", emailLabel: "Correo electrónico", emailPlaceholder: "tu@zyrox.app", passwordLabel: "Contraseña", passwordPlaceholder: "********", invalidCredentials: "Correo o contraseña incorrectos.", createAccountTitle: "Crear cuenta", createAccountSubtitle: "Completa tus datos y sigue al onboarding", backToLogin: "Volver al inicio de sesión", createAccountCta: "Continuar al onboarding", creatingAccount: "Creando cuenta...", nameLabel: "Nombre", namePlaceholder: "Tu nombre", confirmPasswordLabel: "Confirmar contraseña", confirmPasswordPlaceholder: "Repite la contraseña", passwordHint: "Mínimo 6 caracteres", missingName: "Escribe tu nombre para crear la cuenta.", invalidEmail: "Escribe un correo electrónico válido.", weakPassword: "La contraseña debe tener al menos 6 caracteres.", passwordMismatch: "Las contraseñas no coinciden.", recoverTitle: "Recuperar contraseña", recoverSubtitle: "Ingresa tu correo para consultar la cuenta local", recoverCta: "Consultar contraseña", recoverMissingEmail: "Escribe tu correo para recuperar la contraseña.", recoverDemoFound: "Cuenta demo encontrada. Usa la contraseña 123456 para entrar.", recoverDemoOnly: "En este entorno local, solo la cuenta demo tiene recuperación automática.", socialSoon: "Próximamente", emailDivider: "o con correo", builtForEvolution: "Built for evolution | 3D Body Scan" },
    dashboard: { todayWorkout: "Entrenamiento de hoy", weeklyTitle: "Tu semana 3D Body Scan", coachLabel: "Coach IA", profileTitle: "Perfil de evolución", achievementsTitle: "Logros", achievementsOpen: "Logros desbloqueados", greeting: "Hola,", headline: "¿Listo para evolucionar?", startBtn: "Iniciar", exercisesLabel: "ejercicios", weekLabel: "Semana", statSeries: "Series de la semana", statFrequency: "Frecuencia", statWorkouts: "Entrenamientos", statReadiness: "Readiness", statDays: "días", statAchievements: "logros", levelLabel: "Nivel actual", xpLabel: "XP acumulado", streakLabel: "Streak", streakDays: "días", streakDesc: "Consistencia basada en entrenamiento e hidratación", dailyMission: "Misión diaria", weekRhythm: "Ritmo de la semana", setsPlanned: "series planificadas", viewAll: "Ver todo", aiTitle: "Recomendaciones de IA", sessionPlanned: "sesión planificada por IA", sessionsPlanned: "sesiones planificadas por IA" },
    onboarding: { focusTitle: "¿Cuál es tu enfoque principal?", focusSubtitle: "3D Body Scan usa este enfoque para definir la estructura de tu progresión.", addPhoto: "Agregar foto", nameLabel: "Tu nombre", namePlaceholder: "Cómo quieres aparecer en la app", stepBack: "Anterior", stepNext: "Continuar", stepLabel: "Paso", skipLabel: "Saltar", insightPrefix: "Insight de IA:", insightFocus: "tu enfoque define el algoritmo de progresión y la división del plan.", consistencyTitle: "¿Con qué frecuencia entrenas?", consistencySubtitle: "Esto calibra el volumen, la recuperación y la intensidad del plan.", experienceTitle: "¿Cuál es tu nivel de experiencia?", experienceSubtitle: "El plan ajusta intensidad, ejercicios y densidad según tu nivel.", locationTitle: "¿Dónde entrenas?", locationSubtitle: "Adaptaremos los entrenamientos a tu entorno real.", gymSizeTitle: "Tamaño del gimnasio", crowdLevelTitle: "Horario en el que sueles entrenar", equipmentTitle: "¿Qué equipamiento tienes disponible?", equipmentSubtitle: "Selecciona todo. La IA crea el plan según lo que realmente tienes.", daysTitle: "¿Qué días puedes entrenar?", daysSubtitle: "Selecciona los días de la semana disponibles.", noDaysSelected: "Ningún día seleccionado", durationTitle: "¿Cuánto tiempo por entrenamiento?", durationSubtitle: "La IA estructura el volumen según tu ventana de tiempo.", minutes: "minutos", resultTitle: "¿Qué resultado quieres alcanzar?", resultSubtitle: "Elige tu meta principal para que la periodización sea coherente.", buildingTitle: "Construyendo tu inteligencia atlética", daysSingular: "día", daysPlural: "días", goals: { mass: { title: "Ganancia de Masa", subtitle: "Hipertrofia y bodybuilding" }, strength: { title: "Fuerza Funcional", subtitle: "Calistenia, fuerza y potencia" }, hybrid: { title: "Rendimiento Híbrido", subtitle: "Mezcla de modalidades y contexto real" }, athletic: { title: "Evolución Atlética", subtitle: "Ajuste para rendimiento y acondicionamiento" }, weight_loss: { title: "Pérdida de peso", subtitle: "Adelgazar con salud y preservar músculo" }, definition: { title: "Definición muscular", subtitle: "Reducir grasa y revelar la musculatura" }, endurance: { title: "Resistencia y acondicionamiento", subtitle: "Mejorar capacidad cardiovascular y resistencia" }, wellness: { title: "Salud y bienestar", subtitle: "Mantenerse activo, reducir estrés y vivir mejor" } }, consistency: { occasional: { title: "Ocasionalmente", subtitle: "1 a 2 veces por semana" }, regular: { title: "Regularmente", subtitle: "3 a 5 veces por semana" }, elite: { title: "Atleta de Elite", subtitle: "6+ veces por semana" } }, experience: { beginner: { title: "Principiante", subtitle: "Estoy empezando" }, intermediate: { title: "Intermedio", subtitle: "Ya entreno desde hace algunos meses" }, advanced: { title: "Avanzado", subtitle: "Años de constancia" } }, locations: { gym: { title: "Gimnasio", subtitle: "Equipamiento completo" }, home: { title: "Casa", subtitle: "Home gym o peso corporal" }, hybrid: { title: "Híbrido", subtitle: "Alterno entre gimnasio y casa" }, outdoor: { title: "Al aire libre", subtitle: "Parque y calistenia al aire libre" } }, gymSizes: { pequena: "Pequeño", media: "Mediano", grande: "Grande" }, crowdLevels: { vazio: "Vacío", normal: "Normal", pico: "Pico" }, weekdaysShort: ["L", "M", "X", "J", "V", "S", "D"], weekdaysFull: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"], results: { hypertrophy: { title: "Hipertrofia visible", subtitle: "Ganancia de masa y evolución estética" }, strength: { title: "Fuerza máxima", subtitle: "PRs en compuestos pesados" }, skill: { title: "Skills de calistenia", subtitle: "Muscle-up, front lever, planche" }, performance: { title: "Rendimiento atlético", subtitle: "Potencia, agilidad y acondicionamiento" } }, aiPhases: ["Analizando tu patrón de entrenamiento...", "Calculando la recuperación muscular...", "Adaptando la progresión de carga...", "Seleccionando los ejercicios ideales...", "Creando tu plan personalizado..."], defaultName: "Tu nombre", problemTitle: "¿Qué te frena hoy?", problemSubtitle: "Sé honesto — la IA usará esto para adaptar tu plan.", problems: { no_results: { label: "Entrenamiento sin resultados", subtitle: "Me esfuerzo pero no veo cambios" }, no_time: { label: "Falta de tiempo", subtitle: "Rutina apretada, difícil mantener la constancia" }, no_plan: { label: "Sin plan claro", subtitle: "No sé qué hacer ni cómo progresar" }, no_motivation: { label: "Falta de motivación", subtitle: "Empiezo pero no logro mantenerme" }, plateau: { label: "Estancamiento", subtitle: "Progressé antes pero me quedé en el mismo punto" } }, ormTitle: "1RM estimado", ormSubtitle: "Opcional — la IA lo usa para calibrar la progresión de carga", ormBench: "Press banca", ormSquat: "Sentadilla", ormDeadlift: "Peso muerto", ormOhp: "Press militar (OHP)", bodyProfileTitle: "Tu perfil corporal", bodyProfileSubtitle: "Datos usados para calcular tu metabolismo basal y calorías ideales con precisión.", weightLabel: "Peso actual", heightLabel: "Altura", ageLabel: "Edad", ageUnit: "años", bmiLabel: "IMC", bmiUnderweight: "Bajo peso", bmiHealthy: "Peso saludable", bmiOverweight: "Sobrepeso", bmiObese: "Obesidad", metabolismTitle: "¿Cómo es tu metabolismo?", metabolismSubtitle: "La IA ajusta tus calorías y macros según tu perfil metabólico.", metabolismSlow: { label: "Metabolismo lento", subtitle: "Subo de peso fácilmente, me cuesta adelgazar" }, metabolismBalanced: { label: "Metabolismo equilibrado", subtitle: "Mantengo el peso razonablemente sin mucho esfuerzo" }, metabolismFast: { label: "Metabolismo rápido", subtitle: "Me cuesta ganar peso, como bastante" }, caloricPlanTitle: "Tu plan calórico", kcalDay: "kcal / día", macroProtein: "Proteína", macroCarbs: "Carbs", macroFat: "Grasa", tmbLabel: "TMB (Reposo)", tdeeLabel: "TDEE (Activo)", metabolismNote: "* Cálculo basado en el perfil promedio. Ajuste fino disponible en el paso 10 al indicar sexo biológico.", aiNutritionLabel: "IA Nutricional: ", fillBodyDataMsg: "Completa los datos de peso, altura y edad en el paso anterior para ver tu plan calórico personalizado.", selectMetabolismMsg: "Selecciona tu perfil metabólico para visualizar tu plan calórico y macros personalizados.", focusMuscleTitle: "¿Dónde quieres enfocarte?", focusMuscleSubtitle: "Selecciona los grupos musculares prioritarios. La IA da más volumen donde quieres crecer.", muscleGroups: ["Pecho", "Espalda", "Hombros", "Bíceps", "Tríceps", "Abdomen", "Glúteos", "Cuádriceps", "Isquiotibiales", "Pantorrilla"], aiVolumeHintPre: "Más volumen en", aiVolumeHintSuf: "Distribución optimizada automáticamente.", nutritionHabitsTitle: "Tus hábitos alimentarios", nutritionHabitsSubtitle: "La IA sincroniza tu nutrición con tu entrenamiento para resultados máximos.", mealsPerDayLabel: "Comidas por día", dietStyleLabel: "Estilo alimentario (opcional)", mealOptions: { m2: { label: "2 comidas", subtitle: "Ayuno intermitente o comidas grandes" }, m3: { label: "3 comidas", subtitle: "Desayuno, almuerzo y cena" }, m45: { label: "4-5 comidas", subtitle: "Comidas fraccionadas a lo largo del día" }, m6: { label: "6+ comidas", subtitle: "Alta frecuencia, porciones pequeñas" } }, dietOptions: { none: "Sin dieta específica", low_carb: "Low carb", high_protein: "Alto en proteínas", vegan: "Vegano / Vegetariano", if: "Ayuno intermitente" }, cycleRoutineTitle: "Tu ciclo y rutina", cycleRoutineSubtitle: "La IA adapta intensidad, volumen y recuperación a tu perfil completo.", biologicalSexLabel: "Sexo biológico", genderMale: "Masculino", genderFemale: "Femenino", genderOther: "Otro", hormonalCycleLabel: "Ciclo hormonal", trackCycleTitle: "Adaptar entrenamiento al ciclo menstrual", trackCycleSubtitle: "La IA ajusta intensidad y volumen por fase del ciclo", perWeekLabel: "x/semana", analysingTitle: "IA Analizando tu Perfil", analysingProcessing: "Procesando", analysingVarsSuffix: "variables de tu perfil", generatingLabel: "Generando plan", goalLabels: { mass: "Hipertrofia", strength: "Fuerza", hybrid: "Híbrido", athletic: "Rendimiento", weight_loss: "Pérdida de peso", definition: "Definición muscular", endurance: "Resistencia", wellness: "Bienestar" }, expLabels: { beginner: "principiante", intermediate: "intermedio", advanced: "avanzado" }, locLabels: { gym: "gimnasio", home: "casa", hybrid: "gimnasio y casa", outdoor: "al aire libre" }, phaseProfile: "Analizando perfil de {name} · objetivo {goal}", phaseLevel: "Calibrando volumen para nivel {exp}", phaseEquipment: "Mapeando {count} equipamientos disponibles", phaseLocation: "Adaptando entrenamiento para {loc}", phaseSchedule: "Estructurando {days}x por semana · {duration} min/sesión", phaseCalories: "Calculando {target} kcal/día · {protein}g prot · {carbs}g carbs", phaseCaloriesDefault: "Calculando calorías y macros ideales", phaseFinale: "Generando plan exclusivo con IA · 94% de compatibilidad" },
    settings: { pageTag: "Preferencias", pageTitle: "Configuración", sectionTitle: "App y experiencia", sectionSubtitle: "Ajustes principales que impactan tu uso diario de 3D Body Scan.", languageTitle: "Idioma", languageDescription: "Cambia el idioma base de la aplicación.", notificationsTitle: "Notificaciones", notificationsDescription: "Recordatorios de entrenamiento, streak y seguimiento de rutina.", privacyTitle: "Privacidad", privacyDescription: "Control local de los datos de onboarding y del historial guardado en el navegador.", bodyScanTitle: "Escaneo corporal", bodyScanDescription: "Calibración de altura y peso usada para lecturas más consistentes.", engineTitle: "Motor de entrenamiento", engineDescription: "Entrenamientos generados según objetivo, entorno y equipamiento disponible.", activeStatus: "Activo", localStatus: "Local", configuredStatus: "Configurado", pendingStatus: "Pendiente", adaptiveStatus: "Adaptativo", profileStateTitle: "Estado actual del perfil", profileStateDescription: "Las preferencias de la app están vinculadas a tu onboarding y al contexto guardado localmente." }
  },
  en: {
    auth: { loginTitle: "Welcome back", loginSubtitle: "Sign in to continue your progress", forgotPassword: "Forgot password", createAccount: "Create account", rememberMe: "Remember me", signIn: "Sign in", signingIn: "Signing in...", emailLabel: "Email", emailPlaceholder: "you@zyrox.app", passwordLabel: "Password", passwordPlaceholder: "********", invalidCredentials: "Incorrect email or password.", createAccountTitle: "Create account", createAccountSubtitle: "Register your details and continue to onboarding", backToLogin: "Back to login", createAccountCta: "Continue to onboarding", creatingAccount: "Creating account...", nameLabel: "Name", namePlaceholder: "Your name", confirmPasswordLabel: "Confirm password", confirmPasswordPlaceholder: "Repeat your password", passwordHint: "Minimum 6 characters", missingName: "Enter your name to create the account.", invalidEmail: "Enter a valid email.", weakPassword: "Your password must be at least 6 characters long.", passwordMismatch: "Passwords do not match.", recoverTitle: "Recover password", recoverSubtitle: "Enter your email to look up the local account", recoverCta: "Check password", recoverMissingEmail: "Enter your email to recover the password.", recoverDemoFound: "Demo account found. Use password 123456 to sign in.", recoverDemoOnly: "In this local environment, only the demo account has automatic recovery.", socialSoon: "Soon", emailDivider: "or with email", builtForEvolution: "Built for evolution | 3D Body Scan" },
    dashboard: { todayWorkout: "Today's workout", weeklyTitle: "Your 3D Body Scan week", coachLabel: "AI Coach", profileTitle: "Progress profile", achievementsTitle: "Achievements", achievementsOpen: "Unlocked achievements", greeting: "Hello,", headline: "Ready to evolve?", startBtn: "Start", exercisesLabel: "exercises", weekLabel: "Week", statSeries: "Weekly sets", statFrequency: "Frequency", statWorkouts: "Workouts in plan", statReadiness: "Readiness", statDays: "days", statAchievements: "achievements", levelLabel: "Current level", xpLabel: "XP earned", streakLabel: "Streak", streakDays: "days", streakDesc: "Consistency based on training and hydration", dailyMission: "Daily mission", weekRhythm: "Weekly rhythm", setsPlanned: "sets planned", viewAll: "View all", aiTitle: "AI Recommendations", sessionPlanned: "session planned by AI", sessionsPlanned: "sessions planned by AI" },
    onboarding: { focusTitle: "What is your main focus?", focusSubtitle: "3D Body Scan uses this focus to define the structure of your progression.", addPhoto: "Add photo", nameLabel: "Your name", namePlaceholder: "How you want to appear in the app", stepBack: "Back", stepNext: "Continue", stepLabel: "Step", skipLabel: "Skip", insightPrefix: "AI insight:", insightFocus: "your focus defines the progression algorithm and the plan split.", consistencyTitle: "How often do you train?", consistencySubtitle: "This calibrates volume, recovery, and plan intensity.", experienceTitle: "What is your experience level?", experienceSubtitle: "The plan adjusts intensity, exercises, and density to your level.", locationTitle: "Where do you train?", locationSubtitle: "We will adapt your workouts to your real environment.", gymSizeTitle: "Gym size", crowdLevelTitle: "What time do you usually train?", equipmentTitle: "Which equipment do you have access to?", equipmentSubtitle: "Select all that apply. AI builds the plan based on what you actually have.", daysTitle: "Which days can you train?", daysSubtitle: "Select the days of the week you have available.", noDaysSelected: "No day selected", durationTitle: "How much time per workout?", durationSubtitle: "AI structures the volume around your available time window.", minutes: "minutes", resultTitle: "What result do you want to achieve?", resultSubtitle: "Choose your main goal so periodization stays coherent.", buildingTitle: "Building your athletic intelligence", daysSingular: "day", daysPlural: "days", goals: { mass: { title: "Muscle Gain", subtitle: "Hypertrophy and bodybuilding" }, strength: { title: "Functional Strength", subtitle: "Calisthenics, strength and power" }, hybrid: { title: "Hybrid Performance", subtitle: "Mixed modalities and real-life context" }, athletic: { title: "Athletic Progress", subtitle: "Performance and conditioning focus" }, weight_loss: { title: "Weight loss", subtitle: "Lose weight healthily and preserve muscle" }, definition: { title: "Muscle definition", subtitle: "Reduce fat and reveal musculature" }, endurance: { title: "Endurance and conditioning", subtitle: "Improve cardiovascular capacity and stamina" }, wellness: { title: "Health and wellness", subtitle: "Stay active, reduce stress and live better" } }, consistency: { occasional: { title: "Occasionally", subtitle: "1 to 2 times per week" }, regular: { title: "Regularly", subtitle: "3 to 5 times per week" }, elite: { title: "Elite Athlete", subtitle: "6+ times per week" } }, experience: { beginner: { title: "Beginner", subtitle: "I am just getting started" }, intermediate: { title: "Intermediate", subtitle: "I have been training for a few months" }, advanced: { title: "Advanced", subtitle: "Years of consistency" } }, locations: { gym: { title: "Gym", subtitle: "Full equipment setup" }, home: { title: "Home", subtitle: "Home gym or bodyweight" }, hybrid: { title: "Hybrid", subtitle: "I alternate between gym and home" }, outdoor: { title: "Outdoor", subtitle: "Park and outdoor calisthenics" } }, gymSizes: { pequena: "Small", media: "Medium", grande: "Large" }, crowdLevels: { vazio: "Empty", normal: "Normal", pico: "Peak" }, weekdaysShort: ["M", "T", "W", "T", "F", "S", "S"], weekdaysFull: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], results: { hypertrophy: { title: "Visible Hypertrophy", subtitle: "Muscle gain and aesthetic progress" }, strength: { title: "Maximum Strength", subtitle: "PRs in heavy compound lifts" }, skill: { title: "Calisthenics Skills", subtitle: "Muscle-up, front lever, planche" }, performance: { title: "Athletic Performance", subtitle: "Power, agility, and conditioning" } }, aiPhases: ["Analyzing training patterns...", "Calculating muscle recovery...", "Adapting load progression...", "Selecting the ideal exercises...", "Creating your personalized plan..."], defaultName: "Your name", problemTitle: "What's holding you back?", problemSubtitle: "Be honest — AI will use this to adapt your plan.", problems: { no_results: { label: "Training without results", subtitle: "I put in the effort but see no changes" }, no_time: { label: "Lack of time", subtitle: "Busy schedule, hard to stay consistent" }, no_plan: { label: "No clear plan", subtitle: "I don’t know what to do or how to progress" }, no_motivation: { label: "Lack of motivation", subtitle: "I start but can’t keep going" }, plateau: { label: "Progress plateau", subtitle: "I improved before but got stuck at the same point" } }, ormTitle: "Estimated 1RM", ormSubtitle: "Optional — AI uses this to calibrate load progression", ormBench: "Bench press", ormSquat: "Squat", ormDeadlift: "Deadlift", ormOhp: "Overhead press (OHP)", bodyProfileTitle: "Your body profile", bodyProfileSubtitle: "Data used to accurately calculate your basal metabolism and ideal calories.", weightLabel: "Current weight", heightLabel: "Height", ageLabel: "Age", ageUnit: "years", bmiLabel: "BMI", bmiUnderweight: "Underweight", bmiHealthy: "Healthy weight", bmiOverweight: "Overweight", bmiObese: "Obese", metabolismTitle: "How is your metabolism?", metabolismSubtitle: "AI adjusts your calories and macros based on your metabolic profile.", metabolismSlow: { label: "Slow metabolism", subtitle: "I gain weight easily and struggle to lose it" }, metabolismBalanced: { label: "Balanced metabolism", subtitle: "I maintain my weight reasonably without much effort" }, metabolismFast: { label: "Fast metabolism", subtitle: "I have trouble gaining weight, I eat a lot" }, caloricPlanTitle: "Your caloric plan", kcalDay: "kcal / day", macroProtein: "Protein", macroCarbs: "Carbs", macroFat: "Fat", tmbLabel: "BMR (Rest)", tdeeLabel: "TDEE (Active)", metabolismNote: "* Calculation based on average profile. Fine-tuning available in step 10 when you enter your biological sex.", aiNutritionLabel: "AI Nutrition: ", fillBodyDataMsg: "Complete your weight, height and age in the previous step to see your personalized caloric plan.", selectMetabolismMsg: "Select your metabolic profile to view your personalized caloric plan and macros.", focusMuscleTitle: "Where do you want to focus?", focusMuscleSubtitle: "Select priority muscle groups. AI gives more volume where you want to grow.", muscleGroups: ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Abs", "Glutes", "Quads", "Hamstrings", "Calves"], aiVolumeHintPre: "More volume on", aiVolumeHintSuf: "Distribution optimized automatically.", nutritionHabitsTitle: "Your eating habits", nutritionHabitsSubtitle: "AI syncs your nutrition with your training for maximum results.", mealsPerDayLabel: "Meals per day", dietStyleLabel: "Diet style (optional)", mealOptions: { m2: { label: "2 meals", subtitle: "Intermittent fasting or large meals" }, m3: { label: "3 meals", subtitle: "Breakfast, lunch and dinner" }, m45: { label: "4-5 meals", subtitle: "Spread-out meals throughout the day" }, m6: { label: "6+ meals", subtitle: "High frequency, smaller portions" } }, dietOptions: { none: "No specific diet", low_carb: "Low carb", high_protein: "High protein", vegan: "Vegan / Vegetarian", if: "Intermittent fasting" }, cycleRoutineTitle: "Your cycle and routine", cycleRoutineSubtitle: "AI adapts intensity, volume and recovery to your complete profile.", biologicalSexLabel: "Biological sex", genderMale: "Male", genderFemale: "Female", genderOther: "Other", hormonalCycleLabel: "Hormonal cycle", trackCycleTitle: "Adapt training to menstrual cycle", trackCycleSubtitle: "AI adjusts intensity and volume per cycle phase", perWeekLabel: "x/week", analysingTitle: "AI Analysing Your Profile", analysingProcessing: "Processing", analysingVarsSuffix: "profile variables", generatingLabel: "Generating plan", goalLabels: { mass: "Hypertrophy", strength: "Strength", hybrid: "Hybrid", athletic: "Performance", weight_loss: "Weight loss", definition: "Muscle definition", endurance: "Endurance", wellness: "Wellness" }, expLabels: { beginner: "beginner", intermediate: "intermediate", advanced: "advanced" }, locLabels: { gym: "gym", home: "home", hybrid: "gym and home", outdoor: "outdoors" }, phaseProfile: "Analysing {name}'s profile · goal: {goal}", phaseLevel: "Calibrating volume for {exp} level", phaseEquipment: "Mapping {count} available pieces of equipment", phaseLocation: "Adapting workout for {loc}", phaseSchedule: "Structuring {days}x per week · {duration} min/session", phaseCalories: "Calculating {target} kcal/day · {protein}g protein · {carbs}g carbs", phaseCaloriesDefault: "Calculating ideal calories and macros", phaseFinale: "Generating exclusive AI plan · 94% compatibility" },
    settings: { pageTag: "Preferences", pageTitle: "Settings", sectionTitle: "App and experience", sectionSubtitle: "Main settings that impact your daily 3D Body Scan experience.", languageTitle: "Language", languageDescription: "Change the app's base language.", notificationsTitle: "Notifications", notificationsDescription: "Workout reminders, streak tracking, and routine follow-up.", privacyTitle: "Privacy", privacyDescription: "Local control of onboarding data and history stored in the browser.", bodyScanTitle: "Body scan", bodyScanDescription: "Height and weight calibration used for more consistent readings.", engineTitle: "Training engine", engineDescription: "Workouts generated according to goal, environment, and available equipment.", activeStatus: "Active", localStatus: "Local", configuredStatus: "Configured", pendingStatus: "Pending", adaptiveStatus: "Adaptive", profileStateTitle: "Current profile state", profileStateDescription: "The app preferences are linked to your onboarding and locally saved context." }
  },
  fr: {
    auth: { loginTitle: "Bon retour", loginSubtitle: "Connectez-vous pour poursuivre votre progression", forgotPassword: "Mot de passe oublié", createAccount: "Créer un compte", rememberMe: "Se souvenir de moi", signIn: "Se connecter", signingIn: "Connexion...", emailLabel: "Email", emailPlaceholder: "vous@zyrox.app", passwordLabel: "Mot de passe", passwordPlaceholder: "********", invalidCredentials: "Email ou mot de passe incorrect.", createAccountTitle: "Créer un compte", createAccountSubtitle: "Renseignez vos informations et passez à l'onboarding", backToLogin: "Retour à la connexion", createAccountCta: "Continuer vers l'onboarding", creatingAccount: "Création du compte...", nameLabel: "Nom", namePlaceholder: "Votre nom", confirmPasswordLabel: "Confirmer le mot de passe", confirmPasswordPlaceholder: "Répétez votre mot de passe", passwordHint: "Minimum 6 caractères", missingName: "Saisissez votre nom pour créer le compte.", invalidEmail: "Saisissez un email valide.", weakPassword: "Le mot de passe doit contenir au moins 6 caractères.", passwordMismatch: "Les mots de passe ne correspondent pas.", recoverTitle: "Récupérer le mot de passe", recoverSubtitle: "Saisissez votre email pour consulter le compte local", recoverCta: "Consulter le mot de passe", recoverMissingEmail: "Saisissez votre email pour récupérer le mot de passe.", recoverDemoFound: "Compte démo trouvé. Utilisez le mot de passe 123456 pour vous connecter.", recoverDemoOnly: "Dans cet environnement local, seul le compte démo dispose d'une récupération automatique.", socialSoon: "Bientôt", emailDivider: "ou avec email", builtForEvolution: "Built for evolution | 3D Body Scan" },
    dashboard: { todayWorkout: "Entraînement du jour", weeklyTitle: "Votre semaine 3D Body Scan", coachLabel: "Coach IA", profileTitle: "Profil de progression", achievementsTitle: "Succès", achievementsOpen: "Succès débloqués", greeting: "Bonjour,", headline: "Prêt à évoluer ?", startBtn: "Démarrer", exercisesLabel: "exercices", weekLabel: "Semaine", statSeries: "Séries de la semaine", statFrequency: "Fréquence", statWorkouts: "Entraînements", statReadiness: "Readiness", statDays: "jours", statAchievements: "succès", levelLabel: "Niveau actuel", xpLabel: "XP accumulé", streakLabel: "Streak", streakDays: "jours", streakDesc: "Régularité basée sur l'entraînement et l'hydratation", dailyMission: "Mission du jour", weekRhythm: "Rythme de la semaine", setsPlanned: "séries planifiées", viewAll: "Voir tout", aiTitle: "Recommandations IA", sessionPlanned: "séance planifiée par l'IA", sessionsPlanned: "séances planifiées par l'IA" },
    onboarding: { focusTitle: "Quel est votre objectif principal ?", focusSubtitle: "3D Body Scan utilise cet objectif pour définir la structure de votre progression.", addPhoto: "Ajouter une photo", nameLabel: "Votre nom", namePlaceholder: "Comment vous souhaitez apparaître dans l'app", stepBack: "Retour", stepNext: "Continuer", stepLabel: "Étape", skipLabel: "Passer", insightPrefix: "Insight IA :", insightFocus: "votre objectif définit l'algorithme de progression et la division du plan.", consistencyTitle: "À quelle fréquence vous entraînez-vous ?", consistencySubtitle: "Cela calibre le volume, la récupération et l'intensité du plan.", experienceTitle: "Quel est votre niveau d'expérience ?", experienceSubtitle: "Le plan ajuste l'intensité, les exercices et la densité selon votre niveau.", locationTitle: "Où vous entraînez-vous ?", locationSubtitle: "Nous allons adapter les entraînements à votre environnement réel.", gymSizeTitle: "Taille de la salle", crowdLevelTitle: "Horaire auquel vous vous entraînez le plus", equipmentTitle: "Quels équipements avez-vous à disposition ?", equipmentSubtitle: "Sélectionnez tout. L'IA construit le plan selon ce que vous avez vraiment.", daysTitle: "Quels jours pouvez-vous vous entraîner ?", daysSubtitle: "Sélectionnez les jours de la semaine disponibles.", noDaysSelected: "Aucun jour sélectionné", durationTitle: "Combien de temps par entraînement ?", durationSubtitle: "L'IA structure le volume selon votre fenêtre de temps.", minutes: "minutes", resultTitle: "Quel résultat souhaitez-vous atteindre ?", resultSubtitle: "Choisissez votre objectif principal pour une périodisation cohérente.", buildingTitle: "Construction de votre intelligence athlétique", daysSingular: "jour", daysPlural: "jours", goals: { mass: { title: "Prise de Masse", subtitle: "Hypertrophie et bodybuilding" }, strength: { title: "Force Fonctionnelle", subtitle: "Calisthénie, force et puissance" }, hybrid: { title: "Performance Hybride", subtitle: "Mélange de modalités et contexte réel" }, athletic: { title: "Évolution Athlétique", subtitle: "Focus performance et conditionnement" }, weight_loss: { title: "Perte de poids", subtitle: "Maigrir sainement et préserver le muscle" }, definition: { title: "Définition musculaire", subtitle: "Réduire la graisse et révéler la musculature" }, endurance: { title: "Endurance et conditionnement", subtitle: "Améliorer la capacité cardiovasculaire et le souffle" }, wellness: { title: "Santé et bien-être", subtitle: "Rester actif, réduire le stress et mieux vivre" } }, consistency: { occasional: { title: "Occasionnellement", subtitle: "1 à 2 fois par semaine" }, regular: { title: "Régulièrement", subtitle: "3 à 5 fois par semaine" }, elite: { title: "Athlète d'élite", subtitle: "6+ fois par semaine" } }, experience: { beginner: { title: "Débutant", subtitle: "Je commence tout juste" }, intermediate: { title: "Intermédiaire", subtitle: "Je m'entraîne depuis quelques mois" }, advanced: { title: "Avancé", subtitle: "Des années de constance" } }, locations: { gym: { title: "Salle", subtitle: "Équipement complet" }, home: { title: "Maison", subtitle: "Home gym ou poids du corps" }, hybrid: { title: "Hybride", subtitle: "J'alterne entre salle et maison" }, outdoor: { title: "Extérieur", subtitle: "Parc et calisthénie en plein air" } }, gymSizes: { pequena: "Petite", media: "Moyenne", grande: "Grande" }, crowdLevels: { vazio: "Vide", normal: "Normal", pico: "Pleine affluence" }, weekdaysShort: ["L", "M", "M", "J", "V", "S", "D"], weekdaysFull: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"], results: { hypertrophy: { title: "Hypertrophie visible", subtitle: "Prise de masse et progression esthétique" }, strength: { title: "Force maximale", subtitle: "PRs sur les mouvements composés lourds" }, skill: { title: "Skills de calisthénie", subtitle: "Muscle-up, front lever, planche" }, performance: { title: "Performance athlétique", subtitle: "Puissance, agilité et conditionnement" } }, aiPhases: ["Analyse de votre profil d'entraînement...", "Calcul de la récupération musculaire...", "Adaptation de la progression de charge...", "Sélection des exercices idéaux...", "Création de votre plan personnalisé..."], defaultName: "Votre nom", problemTitle: "Qu'est-ce qui vous frèine aujourd'hui ?", problemSubtitle: "Soyez honnête — l'IA utilisera ces informations pour adapter votre plan.", problems: { no_results: { label: "Entraînement sans résultats", subtitle: "Je fournis des efforts mais ne vois aucun changement" }, no_time: { label: "Manque de temps", subtitle: "Emploi du temps chargé, difficile de rester régulier" }, no_plan: { label: "Pas de plan clair", subtitle: "Je ne sais pas quoi faire ni comment progresser" }, no_motivation: { label: "Manque de motivation", subtitle: "Je commence mais n'arrive pas à tenir" }, plateau: { label: "Plateau de progression", subtitle: "J'ai progressé avant mais je suis bloqué au même point" } }, ormTitle: "1RM estimé", ormSubtitle: "Optionnel — l'IA l'utilise pour calibrer la progression de charge", ormBench: "Développé couché", ormSquat: "Squat", ormDeadlift: "Souleé de terre", ormOhp: "Développé militaire (OHP)", bodyProfileTitle: "Votre profil corporel", bodyProfileSubtitle: "Données utilisées pour calculer précisément votre métabolisme de base et vos calories idéales.", weightLabel: "Poids actuel", heightLabel: "Taille", ageLabel: "Âge", ageUnit: "ans", bmiLabel: "IMC", bmiUnderweight: "Insuffisance pondérale", bmiHealthy: "Poids santé", bmiOverweight: "Surpoids", bmiObese: "Obésité", metabolismTitle: "Comment est votre métabolisme ?", metabolismSubtitle: "L'IA ajuste vos calories et macros selon votre profil métabolique.", metabolismSlow: { label: "Métabolisme lent", subtitle: "Je prends du poids facilement, j'ai du mal à maigrir" }, metabolismBalanced: { label: "Métabolisme équilibré", subtitle: "Je maintiens mon poids assez facilement" }, metabolismFast: { label: "Métabolisme rapide", subtitle: "J'ai du mal à prendre du poids, je mange beaucoup" }, caloricPlanTitle: "Votre plan calorique", kcalDay: "kcal / jour", macroProtein: "Protéines", macroCarbs: "Glucides", macroFat: "Lipides", tmbLabel: "MB (Repos)", tdeeLabel: "TDEE (Actif)", metabolismNote: "* Calcul basé sur le profil moyen. Ajustement fin disponible à l'étape 10 en renseignant votre sexe biologique.", aiNutritionLabel: "IA Nutrition : ", fillBodyDataMsg: "Complétez vos données de poids, taille et âge à l'étape précédente pour voir votre plan calorique personnalisé.", selectMetabolismMsg: "Sélectionnez votre profil métabolique pour visualiser votre plan calorique et vos macros personnalisés.", focusMuscleTitle: "Où souhaitez-vous vous concentrer ?", focusMuscleSubtitle: "Sélectionnez les groupes musculaires prioritaires. L'IA donne plus de volume là où vous voulez progresser.", muscleGroups: ["Poitrine", "Dos", "Épaules", "Biceps", "Triceps", "Abdominaux", "Fessiers", "Quadriceps", "Ischio-jambiers", "Mollets"], aiVolumeHintPre: "Plus de volume sur", aiVolumeHintSuf: "Distribution optimisée automatiquement.", nutritionHabitsTitle: "Vos habitudes alimentaires", nutritionHabitsSubtitle: "L'IA synchronise votre nutrition avec votre entraînement pour des résultats maximaux.", mealsPerDayLabel: "Repas par jour", dietStyleLabel: "Style alimentaire (optionnel)", mealOptions: { m2: { label: "2 repas", subtitle: "Jeûne intermittent ou grands repas" }, m3: { label: "3 repas", subtitle: "Petit-déjeuner, déjeuner et dîner" }, m45: { label: "4-5 repas", subtitle: "Repas fractionnés tout au long de la journée" }, m6: { label: "6+ repas", subtitle: "Haute fréquence, petites portions" } }, dietOptions: { none: "Pas de régime spécifique", low_carb: "Low carb", high_protein: "Riche en protéines", vegan: "Végane / Végétarien", if: "Jeûne intermittent" }, cycleRoutineTitle: "Votre cycle et routine", cycleRoutineSubtitle: "L'IA adapte l'intensité, le volume et la récupération à votre profil complet.", biologicalSexLabel: "Sexe biologique", genderMale: "Masculin", genderFemale: "Féminin", genderOther: "Autre", hormonalCycleLabel: "Cycle hormonal", trackCycleTitle: "Adapter l'entraînement au cycle menstruel", trackCycleSubtitle: "L'IA ajuste l'intensité et le volume selon la phase du cycle", perWeekLabel: "x/semaine", analysingTitle: "IA Analyse votre Profil", analysingProcessing: "Traitement de", analysingVarsSuffix: "variables de votre profil", generatingLabel: "Génération du plan", goalLabels: { mass: "Hypertrophie", strength: "Force", hybrid: "Hybride", athletic: "Performance", weight_loss: "Perte de poids", definition: "Définition musculaire", endurance: "Endurance", wellness: "Bien-être" }, expLabels: { beginner: "débutant", intermediate: "intermédiaire", advanced: "avancé" }, locLabels: { gym: "salle", home: "maison", hybrid: "salle et maison", outdoor: "extérieur" }, phaseProfile: "Analyse du profil de {name} · objectif {goal}", phaseLevel: "Calibration du volume pour le niveau {exp}", phaseEquipment: "Cartographie de {count} équipements disponibles", phaseLocation: "Adaptation de l'entraînement pour {loc}", phaseSchedule: "Structuration {days}x par semaine · {duration} min/séance", phaseCalories: "Calcul de {target} kcal/jour · {protein}g prot · {carbs}g glucides", phaseCaloriesDefault: "Calcul des calories et macros idéaux", phaseFinale: "Génération du plan exclusif avec IA · 94% de compatibilité" },
    settings: { pageTag: "Préférences", pageTitle: "Paramètres", sectionTitle: "App et expérience", sectionSubtitle: "Réglages principaux qui impactent votre usage quotidien de 3D Body Scan.", languageTitle: "Langue", languageDescription: "Changez la langue de base de l'application.", notificationsTitle: "Notifications", notificationsDescription: "Rappels d'entraînement, streak et suivi de routine.", privacyTitle: "Confidentialité", privacyDescription: "Contrôle local des données d'onboarding et de l'historique sauvegardé dans le navigateur.", bodyScanTitle: "Scan corporel", bodyScanDescription: "Calibration de la taille et du poids utilisée pour des mesures plus cohérentes.", engineTitle: "Moteur d'entraînement", engineDescription: "Entraînements générés selon l'objectif, l'environnement et les équipements disponibles.", activeStatus: "Actif", localStatus: "Local", configuredStatus: "Configuré", pendingStatus: "En attente", adaptiveStatus: "Adaptatif", profileStateTitle: "État actuel du profil", profileStateDescription: "Les préférences de l'app sont liées à votre onboarding et au contexte sauvegardé localement." }
  },
  de: {
    auth: { loginTitle: "Willkommen zurück", loginSubtitle: "Melde dich an, um deine Entwicklung fortzusetzen", forgotPassword: "Passwort vergessen", createAccount: "Konto erstellen", rememberMe: "Angemeldet bleiben", signIn: "Anmelden", signingIn: "Anmeldung läuft...", emailLabel: "E-Mail", emailPlaceholder: "du@zyrox.app", passwordLabel: "Passwort", passwordPlaceholder: "********", invalidCredentials: "E-Mail oder Passwort sind falsch.", createAccountTitle: "Konto erstellen", createAccountSubtitle: "Gib deine Daten ein und fahre mit dem Onboarding fort", backToLogin: "Zurück zum Login", createAccountCta: "Weiter zum Onboarding", creatingAccount: "Konto wird erstellt...", nameLabel: "Name", namePlaceholder: "Dein Name", confirmPasswordLabel: "Passwort bestätigen", confirmPasswordPlaceholder: "Passwort wiederholen", passwordHint: "Mindestens 6 Zeichen", missingName: "Gib deinen Namen ein, um das Konto zu erstellen.", invalidEmail: "Gib eine gültige E-Mail ein.", weakPassword: "Das Passwort muss mindestens 6 Zeichen lang sein.", passwordMismatch: "Die Passwörter stimmen nicht überein.", recoverTitle: "Passwort wiederherstellen", recoverSubtitle: "Gib deine E-Mail ein, um das lokale Konto zu prüfen", recoverCta: "Passwort prüfen", recoverMissingEmail: "Gib deine E-Mail ein, um das Passwort wiederherzustellen.", recoverDemoFound: "Demo-Konto gefunden. Verwende das Passwort 123456 zum Anmelden.", recoverDemoOnly: "In dieser lokalen Umgebung hat nur das Demo-Konto eine automatische Wiederherstellung.", socialSoon: "Demnächst", emailDivider: "oder mit E-Mail", builtForEvolution: "Built for evolution | 3D Body Scan" },
    dashboard: { todayWorkout: "Heutiges Training", weeklyTitle: "Deine 3D Body Scan-Woche", coachLabel: "KI-Coach", profileTitle: "Entwicklungsprofil", achievementsTitle: "Erfolge", achievementsOpen: "Freigeschaltete Erfolge", greeting: "Hallo,", headline: "Bereit zur Evolution?", startBtn: "Starten", exercisesLabel: "Übungen", weekLabel: "Woche", statSeries: "Sätze der Woche", statFrequency: "Frequenz", statWorkouts: "Trainings im Plan", statReadiness: "Readiness", statDays: "Tage", statAchievements: "Erfolge", levelLabel: "Aktuelles Level", xpLabel: "XP gesammelt", streakLabel: "Streak", streakDays: "Tage", streakDesc: "Konstanz basierend auf Training und Hydration", dailyMission: "Tägliche Mission", weekRhythm: "Wochentakt", setsPlanned: "Sätze geplant", viewAll: "Alle anzeigen", aiTitle: "KI-Empfehlungen", sessionPlanned: "Session von KI geplant", sessionsPlanned: "Sessions von KI geplant" },
    onboarding: { focusTitle: "Was ist dein Hauptfokus?", focusSubtitle: "3D Body Scan nutzt diesen Fokus, um die Struktur deiner Progression festzulegen.", addPhoto: "Foto hinzufügen", nameLabel: "Dein Name", namePlaceholder: "Wie du in der App erscheinen möchtest", stepBack: "Zurück", stepNext: "Weiter", insightPrefix: "KI-Insight:", insightFocus: "dein Fokus bestimmt den Progressionsalgorithmus und die Planaufteilung.", consistencyTitle: "Wie oft trainierst du?", consistencySubtitle: "Das kalibriert Volumen, Regeneration und Planintensität.", experienceTitle: "Wie ist dein Erfahrungsniveau?", experienceSubtitle: "Der Plan passt Intensität, Übungen und Dichte an dein Niveau an.", locationTitle: "Wo trainierst du?", locationSubtitle: "Wir passen die Workouts an deine reale Umgebung an.", gymSizeTitle: "Größe des Fitnessstudios", crowdLevelTitle: "Zu welcher Zeit trainierst du meistens?", equipmentTitle: "Zu welchem Equipment hast du Zugang?", equipmentSubtitle: "Wähle alles aus. Die KI erstellt den Plan anhand dessen, was du wirklich hast.", daysTitle: "An welchen Tagen kannst du trainieren?", daysSubtitle: "Wähle die verfügbaren Wochentage aus.", noDaysSelected: "Kein Tag ausgewählt", durationTitle: "Wie viel Zeit pro Training?", durationSubtitle: "Die KI strukturiert das Volumen nach deinem Zeitfenster.", minutes: "Minuten", resultTitle: "Welches Ergebnis möchtest du erreichen?", resultSubtitle: "Wähle dein Hauptziel, damit die Periodisierung stimmig bleibt.", buildingTitle: "Deine athletische Intelligenz wird aufgebaut", daysSingular: "Tag", daysPlural: "Tage", goals: { mass: { title: "Muskelaufbau", subtitle: "Hypertrophie und Bodybuilding" }, strength: { title: "Funktionelle Kraft", subtitle: "Calisthenics, Kraft und Power" }, hybrid: { title: "Hybride Performance", subtitle: "Gemischte Modalitäten und echter Alltag" }, athletic: { title: "Athletische Entwicklung", subtitle: "Fokus auf Leistung und Kondition" }, weight_loss: { title: "Gewichtsabnahme", subtitle: "Gesund abnehmen und Muskelmasse erhalten" }, definition: { title: "Muskeldefinition", subtitle: "Fett reduzieren und Muskeln sichtbar machen" }, endurance: { title: "Ausdauer und Kondition", subtitle: "Kardiokapazität und Ausdauer verbessern" }, wellness: { title: "Gesundheit und Wohlbefinden", subtitle: "Aktiv bleiben, Stress reduzieren und besser leben" } }, consistency: { occasional: { title: "Gelegentlich", subtitle: "1 bis 2 Mal pro Woche" }, regular: { title: "Regelmäßig", subtitle: "3 bis 5 Mal pro Woche" }, elite: { title: "Elite-Athlet", subtitle: "6+ Mal pro Woche" } }, experience: { beginner: { title: "Anfänger", subtitle: "Ich fange gerade erst an" }, intermediate: { title: "Fortgeschritten", subtitle: "Ich trainiere seit einigen Monaten" }, advanced: { title: "Sehr erfahren", subtitle: "Jahre an Konstanz" } }, locations: { gym: { title: "Fitnessstudio", subtitle: "Vollständige Ausstattung" }, home: { title: "Zuhause", subtitle: "Home-Gym oder Körpergewicht" }, hybrid: { title: "Hybrid", subtitle: "Ich wechsle zwischen Studio und Zuhause" }, outdoor: { title: "Outdoor", subtitle: "Park und Calisthenics im Freien" } }, gymSizes: { pequena: "Klein", media: "Mittel", grande: "Groß" }, crowdLevels: { vazio: "Leer", normal: "Normal", pico: "Stoßzeit" }, weekdaysShort: ["M", "D", "M", "D", "F", "S", "S"], weekdaysFull: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], results: { hypertrophy: { title: "Sichtbare Hypertrophie", subtitle: "Muskelaufbau und ästhetischer Fortschritt" }, strength: { title: "Maximalkraft", subtitle: "PRs bei schweren Grundübungen" }, skill: { title: "Calisthenics-Skills", subtitle: "Muscle-up, Front Lever, Planche" }, performance: { title: "Athletische Leistung", subtitle: "Power, Agilität und Kondition" } }, aiPhases: ["Trainingsmuster werden analysiert...", "Muskelregeneration wird berechnet...", "Lastprogression wird angepasst...", "Ideale Übungen werden ausgewählt...", "Dein personalisierter Plan wird erstellt..."], defaultName: "Dein Name", problemTitle: "Was hält dich heute zurück?", problemSubtitle: "Sei ehrlich — die KI nutzt das, um deinen Plan anzupassen.", problems: { no_results: { label: "Training ohne Ergebnisse", subtitle: "Ich gebe alles, aber sehe keine Veränderungen" }, no_time: { label: "Zeitmangel", subtitle: "Vollgepackter Alltag, schwer konsequent zu bleiben" }, no_plan: { label: "Kein klarer Plan", subtitle: "Ich weiß nicht, was ich tun oder wie ich vorankommen soll" }, no_motivation: { label: "Mangelnde Motivation", subtitle: "Ich fange an, kann aber nicht durchhalten" }, plateau: { label: "Fortschrittsplateau", subtitle: "Ich habe Fortschritte gemacht, bin aber feststeckend" } }, ormTitle: "Geschätztes 1WH", ormSubtitle: "Optional — die KI nutzt dies zur Kalibrierung der Lastprogression", ormBench: "Bankdrücken", ormSquat: "Kniebeuge", ormDeadlift: "Kreuzheben", ormOhp: "Schulterdrücken (OHP)", bodyProfileTitle: "Dein Körperprofil", bodyProfileSubtitle: "Daten zur genauen Berechnung deines Grundumsatzes und idealer Kalorien.", weightLabel: "Aktuelles Gewicht", heightLabel: "Größe", ageLabel: "Alter", ageUnit: "Jahre", bmiLabel: "BMI", bmiUnderweight: "Untergewicht", bmiHealthy: "Normalgewicht", bmiOverweight: "Übergewicht", bmiObese: "Adipositas", metabolismTitle: "Wie ist dein Stoffwechsel?", metabolismSubtitle: "Die KI passt deine Kalorien und Makros an dein Stoffwechselprofil an.", metabolismSlow: { label: "Langsamer Stoffwechsel", subtitle: "Ich nehme leicht zu und tue mich schwer abzunehmen" }, metabolismBalanced: { label: "Ausgeglichener Stoffwechsel", subtitle: "Ich halte mein Gewicht ziemlich mühelos" }, metabolismFast: { label: "Schneller Stoffwechsel", subtitle: "Ich nehme schwer zu und esse viel" }, caloricPlanTitle: "Dein Kalorienplan", kcalDay: "kcal / Tag", macroProtein: "Protein", macroCarbs: "Kohlenhydrate", macroFat: "Fett", tmbLabel: "GU (Ruhe)", tdeeLabel: "TDEE (Aktiv)", metabolismNote: "* Berechnung basiert auf Durchschnittsprofil. Feinabstimmung in Schritt 10 nach Angabe des biologischen Geschlechts.", aiNutritionLabel: "KI-Ernährung: ", fillBodyDataMsg: "Ergänze Gewicht, Größe und Alter im vorherigen Schritt, um deinen personalisierten Kalorienplan zu sehen.", selectMetabolismMsg: "Wähle dein Stoffwechselprofil, um deinen personalisierten Kalorienplan und Makros anzuzeigen.", focusMuscleTitle: "Wo möchtest du dich fokussieren?", focusMuscleSubtitle: "Wähle prioritäre Muskelgruppen. Die KI gibt mehr Volumen dorthin, wo du wachsen möchtest.", muscleGroups: ["Brust", "Rücken", "Schultern", "Bizeps", "Trizeps", "Bauch", "Gesäß", "Quadrizeps", "Beinbeuger", "Waden"], aiVolumeHintPre: "Mehr Volumen auf", aiVolumeHintSuf: "Verteilung automatisch optimiert.", nutritionHabitsTitle: "Deine Ernährungsgewohnheiten", nutritionHabitsSubtitle: "Die KI synchronisiert deine Ernährung mit deinem Training für maximale Ergebnisse.", mealsPerDayLabel: "Mahlzeiten pro Tag", dietStyleLabel: "Ernährungsstil (optional)", mealOptions: { m2: { label: "2 Mahlzeiten", subtitle: "Intervallfasten oder große Mahlzeiten" }, m3: { label: "3 Mahlzeiten", subtitle: "Frühstück, Mittag- und Abendessen" }, m45: { label: "4-5 Mahlzeiten", subtitle: "Über den Tag verteilte Mahlzeiten" }, m6: { label: "6+ Mahlzeiten", subtitle: "Hohe Frequenz, kleinere Portionen" } }, dietOptions: { none: "Keine spezifische Diät", low_carb: "Low Carb", high_protein: "Proteinreich", vegan: "Vegan / Vegetarisch", if: "Intervallfasten" }, cycleRoutineTitle: "Dein Zyklus und deine Routine", cycleRoutineSubtitle: "Die KI passt Intensität, Volumen und Erholung an dein vollständiges Profil an.", biologicalSexLabel: "Biologisches Geschlecht", genderMale: "Männlich", genderFemale: "Weiblich", genderOther: "Divers", hormonalCycleLabel: "Hormonzyklus", trackCycleTitle: "Training an den Menstruationszyklus anpassen", trackCycleSubtitle: "Die KI passt Intensität und Volumen je Zyklusphase an", perWeekLabel: "x/Woche", analysingTitle: "KI Analysiert dein Profil", analysingProcessing: "Verarbeitung von", analysingVarsSuffix: "Profilvariablen", generatingLabel: "Plan wird erstellt", goalLabels: { mass: "Hypertrophie", strength: "Kraft", hybrid: "Hybrid", athletic: "Leistung", weight_loss: "Gewichtsabnahme", definition: "Muskeldefinition", endurance: "Ausdauer", wellness: "Wohlbefinden" }, expLabels: { beginner: "Anfänger", intermediate: "Fortgeschritten", advanced: "Sehr erfahren" }, locLabels: { gym: "Fitnessstudio", home: "Zuhause", hybrid: "Studio und Zuhause", outdoor: "Draußen" }, phaseProfile: "Analyse des Profils von {name} · Ziel: {goal}", phaseLevel: "Volumen für {exp}-Level kalibrieren", phaseEquipment: "{count} verfügbare Geräte werden erfasst", phaseLocation: "Training für {loc} anpassen", phaseSchedule: "{days}x pro Woche strukturieren · {duration} Min/Einheit", phaseCalories: "{target} kcal/Tag berechnen · {protein}g Prot · {carbs}g Kohlenhydrate", phaseCaloriesDefault: "Ideale Kalorien und Makros berechnen", phaseFinale: "Exklusiven KI-Plan erstellen · 94% Kompatibilität" },
    settings: { pageTag: "Einstellungen", pageTitle: "Einstellungen", sectionTitle: "App und Erlebnis", sectionSubtitle: "Wichtige Einstellungen, die deine tägliche 3D Body Scan-Nutzung beeinflussen.", languageTitle: "Sprache", languageDescription: "Ändere die Basissprache der App.", notificationsTitle: "Benachrichtigungen", notificationsDescription: "Trainingserinnerungen, Streaks und Routine-Tracking.", privacyTitle: "Datenschutz", privacyDescription: "Lokale Kontrolle der Onboarding-Daten und des im Browser gespeicherten Verlaufs.", bodyScanTitle: "Körperscan", bodyScanDescription: "Größen- und Gewichtskalibrierung für konsistentere Messungen.", engineTitle: "Trainingsmotor", engineDescription: "Workouts werden nach Ziel, Umgebung und verfügbarem Equipment erstellt.", activeStatus: "Aktiv", localStatus: "Lokal", configuredStatus: "Konfiguriert", pendingStatus: "Ausstehend", adaptiveStatus: "Adaptiv", profileStateTitle: "Aktueller Profilstatus", profileStateDescription: "Die App-Einstellungen sind mit deinem Onboarding und dem lokal gespeicherten Kontext verknüpft." }
  }
};
function getAppCopy(locale = getStoredLocale()) {
  return appCopy[locale] ?? appCopy[defaultLocale];
}
function getAuthCopy(locale = getStoredLocale()) {
  return getAppCopy(locale).auth;
}
function getDashboardCopy(locale = getStoredLocale()) {
  return getAppCopy(locale).dashboard;
}
function getOnboardingCopy(locale = getStoredLocale()) {
  return getAppCopy(locale).onboarding;
}
function getSettingsCopy(locale = getStoredLocale()) {
  return getAppCopy(locale).settings;
}
const nutritionCopy = {
  pt: {
    tag: "Nutrição",
    title: "Plano Alimentar",
    regenerate: "Regenerar",
    emptyTitle: "Plano Alimentar IA",
    emptyDesc: "Gere seu plano alimentar personalizado de 12 semanas baseado no seu perfil e objetivo.",
    generateBtn: "Gerar Plano com IA",
    generating: "Gerando plano...",
    generatingHint: "Isso pode levar até 30 segundos...",
    weekLabel: "Semana",
    weekOf: "de 12 semanas",
    generatedAt: "Gerado em",
    days: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    meals: { breakfast: "Café da Manhã", morningSnack: "Lanche da Manhã", lunch: "Almoço", preWorkout: "Pré-Treino", dinner: "Jantar" },
    macros: { protein: "Proteína", carbs: "Carboidratos", fat: "Gorduras", proteinShort: "Prot", carbsShort: "Carb", fatShort: "Gord" },
    kcalPerDay: "kcal/dia",
    twelveWeeks: "12 semanas",
    cardDesc: "Gere seu plano personalizado de 12 semanas",
    error: "Erro ao gerar plano. Verifique sua conexão e tente novamente.",
    localeMismatch: "Seu plano foi gerado em outro idioma. Clique em Regenerar para gerar em português."
  },
  es: {
    tag: "Nutrición",
    title: "Plan Alimentario",
    regenerate: "Regenerar",
    emptyTitle: "Plan Alimentario IA",
    emptyDesc: "Genera tu plan alimentario personalizado de 12 semanas basado en tu perfil y objetivo.",
    generateBtn: "Generar Plan con IA",
    generating: "Generando plan...",
    generatingHint: "Esto puede tardar hasta 30 segundos...",
    weekLabel: "Semana",
    weekOf: "de 12 semanas",
    generatedAt: "Generado el",
    days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    meals: { breakfast: "Desayuno", morningSnack: "Merienda Mañana", lunch: "Almuerzo", preWorkout: "Pre-Entrenamiento", dinner: "Cena" },
    macros: { protein: "Proteína", carbs: "Carbohidratos", fat: "Grasas", proteinShort: "Prot", carbsShort: "Carb", fatShort: "Gras" },
    kcalPerDay: "kcal/día",
    twelveWeeks: "12 semanas",
    cardDesc: "Genera tu plan alimentario personalizado de 12 semanas",
    error: "Error al generar el plan. Verifica tu conexión e inténtalo de nuevo.",
    localeMismatch: "Tu plan fue generado en otro idioma. Haz clic en Regenerar para generarlo en español."
  },
  en: {
    tag: "Nutrition",
    title: "Meal Plan",
    regenerate: "Regenerate",
    emptyTitle: "AI Meal Plan",
    emptyDesc: "Generate your personalized 12-week meal plan based on your profile and goal.",
    generateBtn: "Generate Plan with AI",
    generating: "Generating plan...",
    generatingHint: "This may take up to 30 seconds...",
    weekLabel: "Week",
    weekOf: "of 12 weeks",
    generatedAt: "Generated on",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    meals: { breakfast: "Breakfast", morningSnack: "Morning Snack", lunch: "Lunch", preWorkout: "Pre-Workout", dinner: "Dinner" },
    macros: { protein: "Protein", carbs: "Carbs", fat: "Fat", proteinShort: "Prot", carbsShort: "Carb", fatShort: "Fat" },
    kcalPerDay: "kcal/day",
    twelveWeeks: "12 weeks",
    cardDesc: "Generate your personalized 12-week meal plan",
    error: "Failed to generate plan. Check your connection and try again.",
    localeMismatch: "Your plan was generated in a different language. Click Regenerate to generate it in English."
  },
  fr: {
    tag: "Nutrition",
    title: "Plan Alimentaire",
    regenerate: "Régénérer",
    emptyTitle: "Plan Alimentaire IA",
    emptyDesc: "Générez votre plan alimentaire personnalisé de 12 semaines basé sur votre profil et objectif.",
    generateBtn: "Générer le Plan avec l'IA",
    generating: "Génération en cours...",
    generatingHint: "Cela peut prendre jusqu'à 30 secondes...",
    weekLabel: "Semaine",
    weekOf: "de 12 semaines",
    generatedAt: "Généré le",
    days: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    meals: { breakfast: "Petit-déjeuner", morningSnack: "Collation Matin", lunch: "Déjeuner", preWorkout: "Pré-Entraînement", dinner: "Dîner" },
    macros: { protein: "Protéines", carbs: "Glucides", fat: "Lipides", proteinShort: "Prot", carbsShort: "Gluc", fatShort: "Lip" },
    kcalPerDay: "kcal/jour",
    twelveWeeks: "12 semaines",
    cardDesc: "Générez votre plan alimentaire personnalisé de 12 semaines",
    error: "Erreur lors de la génération du plan. Vérifiez votre connexion et réessayez.",
    localeMismatch: "Votre plan a été généré dans une autre langue. Cliquez sur Régénérer pour l'obtenir en français."
  },
  de: {
    tag: "Ernährung",
    title: "Ernährungsplan",
    regenerate: "Neu generieren",
    emptyTitle: "KI-Ernährungsplan",
    emptyDesc: "Erstelle deinen personalisierten 12-Wochen-Ernährungsplan basierend auf deinem Profil und Ziel.",
    generateBtn: "Plan mit KI erstellen",
    generating: "Plan wird erstellt...",
    generatingHint: "Dies kann bis zu 30 Sekunden dauern...",
    weekLabel: "Woche",
    weekOf: "von 12 Wochen",
    generatedAt: "Erstellt am",
    days: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    meals: { breakfast: "Frühstück", morningSnack: "Vormittagssnack", lunch: "Mittagessen", preWorkout: "Pre-Workout", dinner: "Abendessen" },
    macros: { protein: "Eiweiß", carbs: "Kohlenhydrate", fat: "Fette", proteinShort: "Eiw", carbsShort: "KH", fatShort: "Fett" },
    kcalPerDay: "kcal/Tag",
    twelveWeeks: "12 Wochen",
    cardDesc: "Erstelle deinen personalisierten 12-Wochen-Ernährungsplan",
    error: "Fehler beim Erstellen des Plans. Überprüfe deine Verbindung und versuche es erneut.",
    localeMismatch: "Dein Plan wurde in einer anderen Sprache generiert. Klicke auf Neu generieren, um ihn auf Deutsch zu erhalten."
  }
};
function getNutritionCopy(locale = getStoredLocale()) {
  return nutritionCopy[locale] ?? nutritionCopy.pt;
}
const gamificationCopy = {
  pt: {
    phases: { base: "Base", progressao: "Progressão", intensificacao: "Intensificação", deload: "Deload" },
    modalities: { academia: "Academia", musculacao: "Musculação", funcional: "Funcional", calistenia: "Calistenia", hibrido: "Híbrido" },
    missions: {
      dailyWorkoutTitle: "Fechar o treino do dia",
      dailyWorkoutDesc: "Conclua o bloco principal sem perder a ordem planejada.",
      dailyWaterTitle: "Bater a água do dia",
      dailyWaterDesc: "Chegue perto da meta de hidratação para sustentar recuperação.",
      weeklyConsistencyTitle: "Consistência da semana",
      weeklyConsistencyDesc: "Feche os treinos planejados da semana com aderência alta.",
      weeklyProteinTitle: "Proteína alinhada",
      weeklyProteinDesc: "Mantenha a nutrição da semana acima do alvo médio.",
      monthlyTitle: "Ritmo mensal",
      monthlyDesc: "Sustente treino, água e comida em bloco contínuo.",
      quarterlyTitle: "Transformação do bloco",
      quarterlyDesc: "Consolide um trimestre de evolução com scans confiáveis.",
      semesterTitle: "Motor de consistência",
      semesterDesc: "Segure o plano por seis meses com alto controle de execução.",
      annualTitle: "Jornada anual premium",
      annualDesc: "Feche o ano com corpo, treino e aderência evoluindo juntos."
    },
    loop: {
      missionDone: "Missão concluída",
      nearMilestone: "Você está perto do próximo marco",
      inProgress: "Seu progresso já está em movimento",
      missionClosedMsg: "foi fechada. Hora de empilhar a próxima sem perder o ritmo.",
      missionPctMsg: "Mantenha o plano para consolidar esse ganho.",
      xpRemaining: "Faltam",
      xpToLevel: "XP para o nível",
      levelConsolidated: "consolidado. Prepare o próximo salto.",
      momentum: {
        elite: "ritmo elite",
        hydration: "ajuste de hidratação",
        ready: "pronto para subir",
        bodyFocus: "foco corporal ativo",
        building: "consistência em construção"
      }
    }
  },
  es: {
    phases: { base: "Base", progressao: "Progresión", intensificacao: "Intensificación", deload: "Deload" },
    modalities: { academia: "Gimnasio", musculacao: "Musculación", funcional: "Funcional", calistenia: "Calistenia", hibrido: "Híbrido" },
    missions: {
      dailyWorkoutTitle: "Cerrar el entrenamiento del día",
      dailyWorkoutDesc: "Completa el bloque principal sin perder el orden planificado.",
      dailyWaterTitle: "Alcanzar la meta de agua",
      dailyWaterDesc: "Acércate a la meta de hidratación para favorecer la recuperación.",
      weeklyConsistencyTitle: "Consistencia semanal",
      weeklyConsistencyDesc: "Cierra los entrenamientos planificados de la semana con alta adherencia.",
      weeklyProteinTitle: "Proteína alineada",
      weeklyProteinDesc: "Mantén la nutrición de la semana por encima del objetivo medio.",
      monthlyTitle: "Ritmo mensual",
      monthlyDesc: "Mantén entrenamiento, agua y alimentación en un bloque continuo.",
      quarterlyTitle: "Transformación del bloque",
      quarterlyDesc: "Consolida un trimestre de evolución con escaneos confiables.",
      semesterTitle: "Motor de consistencia",
      semesterDesc: "Mantén el plan por seis meses con alto control de ejecución.",
      annualTitle: "Jornada anual premium",
      annualDesc: "Cierra el año con cuerpo, entrenamiento y adherencia evolucionando juntos."
    },
    loop: {
      missionDone: "Misión completada",
      nearMilestone: "Estás cerca del siguiente hito",
      inProgress: "Tu progreso ya está en marcha",
      missionClosedMsg: "fue cerrada. Es hora de acumular la siguiente sin perder el ritmo.",
      missionPctMsg: "Mantén el plan para consolidar esa ganancia.",
      xpRemaining: "Faltan",
      xpToLevel: "XP para el nivel",
      levelConsolidated: "consolidado. Prepara el siguiente salto.",
      momentum: {
        elite: "ritmo élite",
        hydration: "ajuste de hidratación",
        ready: "listo para subir",
        bodyFocus: "foco corporal activo",
        building: "consistencia en construcción"
      }
    }
  },
  en: {
    phases: { base: "Base", progressao: "Progression", intensificacao: "Intensification", deload: "Deload" },
    modalities: { academia: "Gym", musculacao: "Strength", funcional: "Functional", calistenia: "Calisthenics", hibrido: "Hybrid" },
    missions: {
      dailyWorkoutTitle: "Close today's workout",
      dailyWorkoutDesc: "Complete the main block without breaking the planned order.",
      dailyWaterTitle: "Hit today's water goal",
      dailyWaterDesc: "Get close to the hydration target to sustain recovery.",
      weeklyConsistencyTitle: "Weekly consistency",
      weeklyConsistencyDesc: "Close the planned workouts this week with high adherence.",
      weeklyProteinTitle: "Protein on track",
      weeklyProteinDesc: "Keep this week's nutrition above the average target.",
      monthlyTitle: "Monthly rhythm",
      monthlyDesc: "Sustain training, water, and food in a continuous block.",
      quarterlyTitle: "Block transformation",
      quarterlyDesc: "Consolidate a quarter of evolution with reliable scans.",
      semesterTitle: "Consistency engine",
      semesterDesc: "Hold the plan for six months with high execution control.",
      annualTitle: "Annual premium journey",
      annualDesc: "Close the year with body, training, and adherence evolving together."
    },
    loop: {
      missionDone: "Mission complete",
      nearMilestone: "You're close to the next milestone",
      inProgress: "Your progress is already in motion",
      missionClosedMsg: "was closed. Time to stack the next one without losing the rhythm.",
      missionPctMsg: "Keep the plan to consolidate this gain.",
      xpRemaining: "Need",
      xpToLevel: "XP to reach level",
      levelConsolidated: "consolidated. Prepare the next leap.",
      momentum: {
        elite: "elite pace",
        hydration: "hydration adjustment",
        ready: "ready to level up",
        bodyFocus: "active body focus",
        building: "consistency building"
      }
    }
  },
  fr: {
    phases: { base: "Base", progressao: "Progression", intensificacao: "Intensification", deload: "Deload" },
    modalities: { academia: "Salle", musculacao: "Musculation", funcional: "Fonctionnel", calistenia: "Calisthénie", hibrido: "Hybride" },
    missions: {
      dailyWorkoutTitle: "Terminer l'entraînement du jour",
      dailyWorkoutDesc: "Complétez le bloc principal sans perdre l'ordre planifié.",
      dailyWaterTitle: "Atteindre l'objectif en eau",
      dailyWaterDesc: "Approchez-vous de l'objectif d'hydratation pour favoriser la récupération.",
      weeklyConsistencyTitle: "Régularité de la semaine",
      weeklyConsistencyDesc: "Terminez les entraînements planifiés de la semaine avec une haute adhérence.",
      weeklyProteinTitle: "Protéines alignées",
      weeklyProteinDesc: "Maintenez la nutrition de la semaine au-dessus de l'objectif moyen.",
      monthlyTitle: "Rythme mensuel",
      monthlyDesc: "Maintenez entraînement, eau et alimentation dans un bloc continu.",
      quarterlyTitle: "Transformation du bloc",
      quarterlyDesc: "Consolidez un trimestre d'évolution avec des scans fiables.",
      semesterTitle: "Moteur de régularité",
      semesterDesc: "Tenez le plan pendant six mois avec un haut contrôle d'exécution.",
      annualTitle: "Parcours annuel premium",
      annualDesc: "Terminez l'année avec corps, entraînement et adhérence en progression."
    },
    loop: {
      missionDone: "Mission accomplie",
      nearMilestone: "Vous êtes près du prochain jalon",
      inProgress: "Votre progression est déjà lancée",
      missionClosedMsg: "a été accomplie. Il est temps d'enchaîner la suivante sans perdre le rythme.",
      missionPctMsg: "Tenez le plan pour consolider ce gain.",
      xpRemaining: "Il manque",
      xpToLevel: "XP pour atteindre le niveau",
      levelConsolidated: "consolidé. Préparez le prochain saut.",
      momentum: {
        elite: "rythme élite",
        hydration: "ajustement hydratation",
        ready: "prêt à monter de niveau",
        bodyFocus: "focus corporel actif",
        building: "régularité en construction"
      }
    }
  },
  de: {
    phases: { base: "Basis", progressao: "Progression", intensificacao: "Intensivierung", deload: "Deload" },
    modalities: { academia: "Studio", musculacao: "Krafttraining", funcional: "Funktionell", calistenia: "Kalisthenics", hibrido: "Hybrid" },
    missions: {
      dailyWorkoutTitle: "Heutiges Training abschließen",
      dailyWorkoutDesc: "Beende den Hauptblock ohne die geplante Reihenfolge zu brechen.",
      dailyWaterTitle: "Wasserziel heute erreichen",
      dailyWaterDesc: "Komme nah ans Hydrationsziel, um die Erholung zu sichern.",
      weeklyConsistencyTitle: "Wöchentliche Konstanz",
      weeklyConsistencyDesc: "Beende die geplanten Trainings der Woche mit hoher Treue.",
      weeklyProteinTitle: "Protein im Ziel",
      weeklyProteinDesc: "Halte die Wochenernährung über dem Durchschnittsziel.",
      monthlyTitle: "Monatstakt",
      monthlyDesc: "Halte Training, Wasser und Ernährung in einem kontinuierlichen Block.",
      quarterlyTitle: "Block-Transformation",
      quarterlyDesc: "Konsolidiere ein Quartal Entwicklung mit zuverlässigen Scans.",
      semesterTitle: "Konsistenz-Motor",
      semesterDesc: "Halte den Plan sechs Monate mit hoher Ausführungskontrolle.",
      annualTitle: "Jahres-Premium-Reise",
      annualDesc: "Beende das Jahr mit Körper, Training und Treue, die gemeinsam wachsen."
    },
    loop: {
      missionDone: "Mission erfüllt",
      nearMilestone: "Du bist nah am nächsten Meilenstein",
      inProgress: "Dein Fortschritt ist bereits in Bewegung",
      missionClosedMsg: "wurde abgeschlossen. Zeit, die nächste zu starten ohne den Rhythmus zu verlieren.",
      missionPctMsg: "Halte den Plan, um diesen Gewinn zu festigen.",
      xpRemaining: "Noch",
      xpToLevel: "XP bis Level",
      levelConsolidated: "gefestigt. Bereite den nächsten Sprung vor.",
      momentum: {
        elite: "Elite-Tempo",
        hydration: "Hydration anpassen",
        ready: "bereit aufzusteigen",
        bodyFocus: "aktiver Körperfokus",
        building: "Konstanz im Aufbau"
      }
    }
  }
};
function getGamificationCopy(locale = getStoredLocale()) {
  return gamificationCopy[locale] ?? gamificationCopy.pt;
}
const recommendationsCopy = {
  pt: {
    recovery: {
      title: "Recovery em proteção",
      message: "Sua base nutricional ainda está curta para sustentar carga alta. Mantenha a técnica limpa e segure a agressividade nas últimas séries."
    },
    protein: {
      title: "Proteína abaixo do alvo",
      messagePre: "Seu dia ainda está em",
      messageMid: "% da meta de proteína. Feche isso antes do próximo treino pesado."
    },
    hydration: {
      title: "Hidratação abaixo do alvo",
      messagePre: "Sua água do dia está em",
      messageMid: "% da meta. Suba isso antes do treino para melhorar recuperação e rendimento."
    },
    bodyPriority: {
      title: "Prioridade corporal ativa",
      messagePre: "O scan está puxando prioridade para",
      messageSuf: "O plano da semana já favorece esse bloco sem perder equilíbrio geral."
    },
    peakHours: {
      title: "Academia em horário de pico",
      message: "Seu treino foi priorizado com opções mais viáveis para evitar fila e manter fluidez entre os exercícios."
    },
    execution: {
      title: "Execução do dia",
      messagePre: "No",
      messageMid: "mantenha os primeiros movimentos em técnica limpa e use a progressão de carga só quando o bloco estiver estável em intensidade"
    }
  },
  es: {
    recovery: {
      title: "Recovery en protección",
      message: "Tu base nutricional aún es insuficiente para sostener una carga alta. Mantén la técnica limpia y controla la agresividad en las últimas series."
    },
    protein: {
      title: "Proteína por debajo del objetivo",
      messagePre: "Tu día aún está al",
      messageMid: "% del objetivo de proteína. Ciérralo antes del próximo entrenamiento pesado."
    },
    hydration: {
      title: "Hidratación por debajo del objetivo",
      messagePre: "Tu agua del día está al",
      messageMid: "% del objetivo. Auméntala antes del entrenamiento para mejorar la recuperación y el rendimiento."
    },
    bodyPriority: {
      title: "Prioridad corporal activa",
      messagePre: "El scan está priorizando",
      messageSuf: "El plan de la semana ya favorece ese bloque sin perder el equilibrio general."
    },
    peakHours: {
      title: "Gimnasio en hora pico",
      message: "Tu entrenamiento fue priorizado con opciones más viables para evitar colas y mantener la fluidez entre ejercicios."
    },
    execution: {
      title: "Ejecución del día",
      messagePre: "En",
      messageMid: "mantén los primeros movimientos con técnica limpia y usa la progresión de carga solo cuando el bloque esté estable en intensidad"
    }
  },
  en: {
    recovery: {
      title: "Recovery protection",
      message: "Your nutritional base is still short to sustain high load. Keep technique clean and hold back aggression in the last sets."
    },
    protein: {
      title: "Protein below target",
      messagePre: "Your day is still at",
      messageMid: "% of the protein goal. Close that gap before your next heavy workout."
    },
    hydration: {
      title: "Hydration below target",
      messagePre: "Your daily water is at",
      messageMid: "% of the goal. Bring it up before training to improve recovery and performance."
    },
    bodyPriority: {
      title: "Active body priority",
      messagePre: "The scan is pulling priority toward",
      messageSuf: "This week's plan already favors that block without losing overall balance."
    },
    peakHours: {
      title: "Gym at peak hours",
      message: "Your workout was prioritized with more viable options to avoid queues and keep flow between exercises."
    },
    execution: {
      title: "Today's execution",
      messagePre: "In",
      messageMid: "keep the first movements with clean technique and use load progression only when the block is stable at intensity"
    }
  },
  fr: {
    recovery: {
      title: "Recovery en protection",
      message: "Votre base nutritionnelle est encore insuffisante pour soutenir une charge élevée. Maintenez une technique propre et limitez l'agressivité sur les dernières séries."
    },
    protein: {
      title: "Protéines sous l'objectif",
      messagePre: "Votre journée est encore à",
      messageMid: "% de l'objectif en protéines. Combler ça avant le prochain entraînement intense."
    },
    hydration: {
      title: "Hydratation sous l'objectif",
      messagePre: "Votre eau du jour est à",
      messageMid: "% de l'objectif. Augmentez-la avant l'entraînement pour améliorer la récupération."
    },
    bodyPriority: {
      title: "Priorité corporelle active",
      messagePre: "Le scan tire la priorité vers",
      messageSuf: "Le plan de la semaine favorise déjà ce bloc sans perdre l'équilibre général."
    },
    peakHours: {
      title: "Salle en heure de pointe",
      message: "Votre entraînement a été priorisé avec des options plus viables pour éviter les files et maintenir la fluidité entre les exercices."
    },
    execution: {
      title: "Exécution du jour",
      messagePre: "Dans",
      messageMid: "maintenez les premiers mouvements avec une technique propre et utilisez la progression de charge seulement quand le bloc est stable à l'intensité"
    }
  },
  de: {
    recovery: {
      title: "Recovery-Schutz",
      message: "Deine Ernährungsbasis reicht noch nicht aus, um hohe Belastung zu tragen. Halte die Technik sauber und bremse die Aggressivität in den letzten Sätzen."
    },
    protein: {
      title: "Protein unter dem Ziel",
      messagePre: "Dein Tag liegt noch bei",
      messageMid: "% des Proteinziels. Schließ das vor dem nächsten schweren Training."
    },
    hydration: {
      title: "Hydration unter dem Ziel",
      messagePre: "Dein Tageswasser liegt bei",
      messageMid: "% des Ziels. Bring es vor dem Training hoch, um Erholung und Leistung zu verbessern."
    },
    bodyPriority: {
      title: "Aktiver Körperfokus",
      messagePre: "Der Scan priorisiert",
      messageSuf: "Der Wochenplan begünstigt diesen Block bereits, ohne das Gesamtgleichgewicht zu verlieren."
    },
    peakHours: {
      title: "Studio zur Stoßzeit",
      message: "Dein Training wurde mit praktischeren Optionen priorisiert, um Warteschlangen zu vermeiden und den Fluss zwischen Übungen zu erhalten."
    },
    execution: {
      title: "Heutige Ausführung",
      messagePre: "Im",
      messageMid: "halte die ersten Bewegungen mit sauberer Technik und nutze die Lastprogression erst, wenn der Block stabil ist bei Intensität"
    }
  }
};
function getRecommendationsCopy(locale = getStoredLocale()) {
  return recommendationsCopy[locale] ?? recommendationsCopy.pt;
}
export {
  getOnboardingCopy as a,
  getDashboardCopy as b,
  getNutritionCopy as c,
  getGamificationCopy as d,
  getSettingsCopy as e,
  getRecommendationsCopy as f,
  getAuthCopy as g
};