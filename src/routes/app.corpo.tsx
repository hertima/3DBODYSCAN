import { createFileRoute } from "@tanstack/react-router";
import { type ChangeEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  Droplets,
  Flame,
  FlipHorizontal2,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Plus,
  Ruler,
  ScanLine,
  Smartphone,
  Sparkles,
  Sun,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { AIInsightCard } from "@/components/AIInsightCard";
import { MuscleSilhouette } from "@/components/MuscleSilhouette";
import { bodyComposition, bodyMeasures } from "@/data/body";
import { type MuscleGroup, exercises } from "@/data/library";
import { nutritionToday } from "@/data/nutrition";
import { bodyScans, foodScans, formatScanDate, type BodyScan, type FoodScan } from "@/data/scans";
import { buildAthleteProfile } from "@/domain/athlete/profile";
import { evaluateNutritionState } from "@/domain/nutrition/analysis";
import { getStoredLocale } from "@/lib/locale";
import { loadOnboarding } from "@/lib/onboarding";
import { buildUserContext, type AILocale, type DetectedMeasurements } from "@/lib/ai-service";
import { auth } from "@/lib/firebase";
import { saveFoodScanToFirestore, loadFoodScansFromFirestore, deleteFoodScanFromFirestore, type FirestoreFoodScan } from "@/lib/firestore-food-scans";
import { saveBodyScanToFirestore, loadBodyScansFromFirestore, deleteBodyScanFromFirestore, type FirestoreBodyScan } from "@/lib/firestore-body-scans";
import { saveMeasurementsToFirestore, loadMeasurementsFromFirestore, uploadBodyPhoto, uploadFoodPhoto, type BodyMeasurements } from "@/lib/firestore-measurements";
import { ShareVideoButton, CorpoEvolutionVideo } from "@/remotion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/corpo")({
  head: () => ({
    meta: [
      { title: "3D Body Scanner | Scan Corporal IA" },
      { name: "description", content: "Scan corporal 3D com IA — medidas, composição e evolução do corpo em tempo real." },
    ],
  }),
  component: CorpoPage,
});

type Tab = "medidas" | "nutricao";
type ScanKind = "body" | "food";
type ScanState = "idle" | "scanning" | "done";
type PendingSource = "camera" | "gallery" | null;
type BodyView = "3d" | "comparar" | "tipo" | "cor" | "musculos";

const COPY = {
  pt: {
    title: "3D Body Scanner", subtitle: "Scan corporal com IA — medidas precisas, composição corporal e evolução visual em tempo real.",
    measures: "Medidas", nutrition: "Nutrição",
    bodyScan: "Scan corporal", bodyDesc: "Tire uma foto de corpo inteiro ou envie da galeria para a IA estimar medidas e percentual de gordura.",
    foodScan: "Scan da alimentação", foodDesc: "Aponte para o prato ou envie da galeria para a IA estimar calorias, proteína e carboidratos.",
    lastReading: "Última leitura", latestPhoto: "sua foto mais recente", noSavedScan: "nenhum scan salvo ainda", firstScan: "Faça seu primeiro scan para ver sua foto aqui.",
    todaySummary: "Resumo de hoje", goalsMacros: "metas calóricas e macros", meals: "Refeições", aiSuggestions: "Sugestões da IA", personalized: "ajustes personalizados",
    historyBody: "Histórico de scans corporais", historyFood: "Histórico de scans de alimentação", evolution: "evolução",
    camera: "Câmera", gallery: "Galeria", useGallery: "Usar galeria",
    captureGuide: "Guia de captura", quickCalibration: "Calibragem rápida", distance: "Distância", lighting: "Iluminação", framing: "Enquadramento", posture: "Postura",
    continue: "Continuar", height: "Altura", weight: "Peso", clothing: "Vestimenta",
    ready: "Pronto. A precisão estimada é de aproximadamente 1,5 cm com a calibragem aplicada.",
    back: "Voltar", startScan: "Iniciar scan", scanning: "IA analisando imagem...", analysisDone: "Análise concluída", saveClose: "Salvar e fechar",
    bodyfat: "Gordura", confidence: "Confiança",
    editMeasuresTitle: "Suas Medidas Reais", tapToEdit: "Toque no valor para editar", saveMeasures: "Salvar medidas",
    body3d: "Corpo 3D", compare: "Comparar", bodyTypeTab: "Tipo", colorMetricTab: "Cor", musclesTab: "Músculos", edit: "Editar",
    chest: "Peito", waist: "Cintura", hip: "Quadril", arm: "Braço", thigh: "Coxa", calf: "Panturrilha", shoulders: "Ombros", leanMass: "Massa magra",
    before: "Anterior", current: "Atual", monthsAgo: "6 meses atrás", today: "Hoje",
    bodyTypeLabel: "Seu tipo corporal", rcqLabel: "RCQ", chestHipLabel: "Peito/Quad.",
    grew: "Cresceu", reduced: "Reduziu", zoneEvolution: "Evolução por zona corporal",
    remaining: "restantes", protein: "Proteína", fat: "Gordura", carbs: "Carbo",
    kcalRegistered: (n: number) => `+${n} kcal registradas pela IA`,
    aiDetectsAuto: "IA detecta calorias e macros automaticamente",
    aimAtPlateModal: "Aponte para o prato — a IA detecta kcal e macros e registra automaticamente.",
    permissionDenied: "Permissão negada. Habilite a câmera nas configurações do navegador.",
    cameraInUse: "Câmera em uso por outro app. Feche outros aplicativos e tente novamente.",
    aiUnavailable: "Análise IA indisponível. Verifique a configuração da chave de API.",
    silhouette: "Silhueta", composition: "Composição", precision: "Precisão", calories: "Calorias", macrosLabel: "Macros",
    initializingScanner: "Inicializando scanner", cancel: "Cancelar",
    fullBodyCapture: "Corpo inteiro no quadro · Toque para capturar", foodCapture: "Aponte para o prato · Toque para capturar",
    calibrateBtn: "Calibrar IA", calibrationDataDesc: "Dados de calibração — aumentam a precisão",
    calibratedMsg: "Sistema calibrado · Precisão estimada ±1,5 cm",
    outfitTight: "justa", outfitNormal: "normal", outfitLoose: "larga", startScan3d: "Iniciar Scan 3D",
    scanning3DHeader: "Mapeando · 3D Body Scanner", analysisDoneHeader: "Análise Concluída", aiMappingLabel: "IA Mapeando Pontos 3D",
    bodyCompositionScan: "Composição corporal", measureEstimateScan: "Estimativa de medidas", fatPctScan: "% Gordura", scan3dDone: "Scan 3D Concluído",
    recordsFn: (n: number) => `${n} registros | evolução`,
    waistSeries: "Cintura (cm)", chestSeries: "Peito (cm)", calsSeries: "Calorias (kcal)", proteinSeries: "Proteína (g x 10)",
    captureSetupItems: [{ title: "2,5m de distância", desc: "Na altura do quadril" }, { title: "Luz frontal", desc: "Sem contraluz" }, { title: "Corpo inteiro", desc: "Cabeça aos pés" }, { title: "Braços afastados", desc: "Roupa justa" }] as { title: string; desc: string }[],
    noHistoryYet: "Seu histórico corporal ainda está formando a primeira linha de tendência.",
    bodyReadingLabel: "Leitura corporal em consolidação.",
    frontStep: "Frente", backStep: "Costas",
    turnAroundMsg: "Ótimo! Agora vire de costas para a câmera.",
    stepFront: "1/2 · FRENTE", stepBack: "2/2 · COSTAS",
    frontCaptureGuide: "Posicione-se de frente · Toque para capturar",
    backCaptureGuide: "Agora de costas · Toque para capturar",
    frontCaptured: "Frente capturada ✓", mergingPhotos: "Mesclando imagens...",
    startFoodScan: "Iniciar Food Scan",
    foodSetupItems: [{ title: "Vista de cima", desc: "Foto aérea do prato" }, { title: "Boa iluminação", desc: "Sem sombras fortes" }, { title: "Prato inteiro", desc: "Tudo no quadro" }, { title: "Porções visíveis", desc: "Inclua todos os itens" }] as { title: string; desc: string }[],
    shareEvolution: "Compartilhar evolução corporal", shareEvolutionShort: "Compartilhar evolução",
    waterBone: "H₂O + osso",
    muscleMappingTitle: "Mapeamento Muscular", muscleTapHint: "Toque em qualquer grupo para analisar", muscleInteractiveBadge: "Silhueta Interativa",
    muscleLabel: "Músculo", recoveryStatusLabel: "Status de Recuperação", activeFibers: "Fibras Ativas",
    weeklyVolume: "Volume Semanal", recommendedExercises: "Exercícios Recomendados",
    noExercisesFor: (m: string) => `Nenhum exercício cadastrado para ${m}`,
    muscleStatusReady: "Pronto para Treino", muscleStatusRecovering: "Em Recuperação", muscleStatusExcellent: "Excelente Estado",
    muscleStatusModerateFatigue: "Fadiga Moderada", muscleStatusRecovered: "Recuperado", muscleStatusHighFatigue: "Fadiga Elevada",
    muscleStatusFullyReady: "Totalmente Pronto", setsWeekSuffix: "séries/sem",
    muscleNames: { Peito: "Peito", Costas: "Costas", Ombros: "Ombros", "Bíceps": "Bíceps", "Tríceps": "Tríceps", Pernas: "Pernas", "Glúteos": "Glúteos", Core: "Core", "Antebraço": "Antebraço", "Full Body": "Corpo Inteiro" } as Record<string, string>,
  },
  es: {
    title: "3D Body Scanner", subtitle: "Escaneo corporal con IA — medidas precisas, composición corporal y evolución visual en tiempo real.",
    measures: "Medidas", nutrition: "Nutrición",
    bodyScan: "Escaneo corporal", bodyDesc: "Toma una foto de cuerpo completo o súbela desde la galería para que la IA estime medidas y porcentaje de grasa.",
    foodScan: "Escaneo de alimentación", foodDesc: "Apunta al plato o súbelo desde la galería para que la IA estime calorías, proteína y carbohidratos.",
    lastReading: "Última lectura", latestPhoto: "tu foto más reciente", noSavedScan: "todavía no hay escaneos guardados", firstScan: "Haz tu primer escaneo para ver tu foto aquí.",
    todaySummary: "Resumen de hoy", goalsMacros: "metas calóricas y macros", meals: "Comidas", aiSuggestions: "Sugerencias de IA", personalized: "ajustes personalizados",
    historyBody: "Historial de escaneos corporales", historyFood: "Historial de escaneos de alimentación", evolution: "evolución",
    camera: "Cámara", gallery: "Galería", useGallery: "Usar galería",
    captureGuide: "Guía de captura", quickCalibration: "Calibración rápida", distance: "Distancia", lighting: "Iluminación", framing: "Encuadre", posture: "Postura",
    continue: "Continuar", height: "Altura", weight: "Peso", clothing: "Vestimenta",
    ready: "Listo. La precisión estimada es de aproximadamente 1,5 cm con la calibración aplicada.",
    back: "Volver", startScan: "Iniciar escaneo", scanning: "IA analizando imagen...", analysisDone: "Análisis completado", saveClose: "Guardar y cerrar",
    bodyfat: "Grasa", confidence: "Confianza",
    editMeasuresTitle: "Tus Medidas Reales", tapToEdit: "Toca el valor para editar", saveMeasures: "Guardar medidas",
    body3d: "Cuerpo 3D", compare: "Comparar", bodyTypeTab: "Tipo", colorMetricTab: "Color", musclesTab: "Músculos", edit: "Editar",
    chest: "Pecho", waist: "Cintura", hip: "Cadera", arm: "Brazo", thigh: "Muslo", calf: "Pantorrilla", shoulders: "Hombros", leanMass: "Masa magra",
    before: "Anterior", current: "Actual", monthsAgo: "hace 6 meses", today: "Hoy",
    bodyTypeLabel: "Tu tipo corporal", rcqLabel: "ICC", chestHipLabel: "Pecho/Cad.",
    grew: "Creció", reduced: "Redujo", zoneEvolution: "Evolución por zona corporal",
    remaining: "restantes", protein: "Proteína", fat: "Grasa", carbs: "Carbo",
    kcalRegistered: (n: number) => `+${n} kcal registradas por IA`,
    aiDetectsAuto: "La IA detecta calorías y macros automáticamente",
    aimAtPlateModal: "Apunta al plato — la IA detecta kcal y macros y registra automáticamente.",
    permissionDenied: "Permiso denegado. Habilita la cámara en la configuración del navegador.",
    cameraInUse: "Cámara en uso por otra aplicación. Cierra otras apps e intenta de nuevo.",
    aiUnavailable: "Análisis IA no disponible. Verifica la configuración de la clave API.",
    silhouette: "Silueta", composition: "Composición", precision: "Precisión", calories: "Calorías", macrosLabel: "Macros",
    initializingScanner: "Inicializando escáner", cancel: "Cancelar",
    fullBodyCapture: "Cuerpo entero en el encuadre · Toca para capturar", foodCapture: "Apunta al plato · Toca para capturar",
    calibrateBtn: "Calibrar IA", calibrationDataDesc: "Datos de calibración — aumentan la precisión",
    calibratedMsg: "Sistema calibrado · Precisión estimada ±1,5 cm",
    outfitTight: "ajustada", outfitNormal: "normal", outfitLoose: "holgada", startScan3d: "Iniciar Escaneo 3D",
    scanning3DHeader: "Mapeando · 3D Body Scanner", analysisDoneHeader: "Análisis Completado", aiMappingLabel: "IA Mapeando Puntos 3D",
    bodyCompositionScan: "Composición corporal", measureEstimateScan: "Estimación de medidas", fatPctScan: "% Grasa", scan3dDone: "Escaneo 3D Completo",
    recordsFn: (n: number) => `${n} registros | evolución`,
    waistSeries: "Cintura (cm)", chestSeries: "Pecho (cm)", calsSeries: "Calorías (kcal)", proteinSeries: "Proteína (g x 10)",
    captureSetupItems: [{ title: "2,5m de distancia", desc: "A la altura de la cadera" }, { title: "Luz frontal", desc: "Sin contraluz" }, { title: "Cuerpo entero", desc: "Cabeza a pies" }, { title: "Brazos separados", desc: "Ropa ajustada" }] as { title: string; desc: string }[],
    noHistoryYet: "Tu historial corporal todavía está formando la primera línea de tendencia.",
    bodyReadingLabel: "Lectura corporal en consolidación.",
    frontStep: "Frente", backStep: "Espalda",
    turnAroundMsg: "¡Genial! Ahora gírate de espaldas a la cámara.",
    stepFront: "1/2 · FRENTE", stepBack: "2/2 · ESPALDA",
    frontCaptureGuide: "Posiciónese de frente · Toque para capturar",
    backCaptureGuide: "Ahora de espaldas · Toque para capturar",
    frontCaptured: "Frente capturada ✓", mergingPhotos: "Combinando imágenes...",
    startFoodScan: "Iniciar Food Scan",
    foodSetupItems: [{ title: "Vista desde arriba", desc: "Foto aérea del plato" }, { title: "Buena iluminación", desc: "Sin sombras fuertes" }, { title: "Plato entero", desc: "Todo en el encuadre" }, { title: "Porciones visibles", desc: "Incluya todos los ítems" }] as { title: string; desc: string }[],
    shareEvolution: "Compartir evolución corporal", shareEvolutionShort: "Compartir evolución",
    waterBone: "H₂O + hueso",
    muscleMappingTitle: "Mapeo Muscular", muscleTapHint: "Toca cualquier grupo para analizar", muscleInteractiveBadge: "Silueta Interactiva",
    muscleLabel: "Músculo", recoveryStatusLabel: "Estado de Recuperación", activeFibers: "Fibras Activas",
    weeklyVolume: "Volumen Semanal", recommendedExercises: "Ejercicios Recomendados",
    noExercisesFor: (m: string) => `Sin ejercicios registrados para ${m}`,
    muscleStatusReady: "Listo para Entrenar", muscleStatusRecovering: "En Recuperación", muscleStatusExcellent: "Estado Excelente",
    muscleStatusModerateFatigue: "Fatiga Moderada", muscleStatusRecovered: "Recuperado", muscleStatusHighFatigue: "Fatiga Elevada",
    muscleStatusFullyReady: "Totalmente Listo", setsWeekSuffix: "series/sem",
    muscleNames: { Peito: "Pecho", Costas: "Espalda", Ombros: "Hombros", "Bíceps": "Bíceps", "Tríceps": "Tríceps", Pernas: "Piernas", "Glúteos": "Glúteos", Core: "Core", "Antebraço": "Antebrazo", "Full Body": "Cuerpo Completo" } as Record<string, string>,
  },
  en: {
    title: "3D Body Scanner", subtitle: "AI body scan — precise measurements, body composition, and visual progress in real time.",
    measures: "Measures", nutrition: "Nutrition",
    bodyScan: "Body scan", bodyDesc: "Take a full-body photo or upload one from your gallery so AI can estimate measurements and body fat percentage.",
    foodScan: "Food scan", foodDesc: "Point at the plate or upload from your gallery so AI can estimate calories, protein, and carbs.",
    lastReading: "Latest reading", latestPhoto: "your most recent photo", noSavedScan: "no saved scan yet", firstScan: "Take your first scan to see your photo here.",
    todaySummary: "Today's summary", goalsMacros: "calorie goals and macros", meals: "Meals", aiSuggestions: "AI suggestions", personalized: "personalized adjustments",
    historyBody: "Body scan history", historyFood: "Food scan history", evolution: "progress",
    camera: "Camera", gallery: "Gallery", useGallery: "Use gallery",
    captureGuide: "Capture guide", quickCalibration: "Quick calibration", distance: "Distance", lighting: "Lighting", framing: "Framing", posture: "Posture",
    continue: "Continue", height: "Height", weight: "Weight", clothing: "Clothing",
    ready: "Done. Estimated precision is approximately 1.5 cm with calibration applied.",
    back: "Back", startScan: "Start scan", scanning: "AI analyzing image...", analysisDone: "Analysis completed", saveClose: "Save and close",
    bodyfat: "Body Fat", confidence: "Confidence",
    editMeasuresTitle: "Your Real Measurements", tapToEdit: "Tap a value to edit", saveMeasures: "Save measurements",
    body3d: "3D Body", compare: "Compare", bodyTypeTab: "Type", colorMetricTab: "Color", musclesTab: "Muscles", edit: "Edit",
    chest: "Chest", waist: "Waist", hip: "Hip", arm: "Arm", thigh: "Thigh", calf: "Calf", shoulders: "Shoulders", leanMass: "Lean Mass",
    before: "Before", current: "Current", monthsAgo: "6 months ago", today: "Today",
    bodyTypeLabel: "Your body type", rcqLabel: "WHR", chestHipLabel: "Chest/Hip",
    grew: "Grew", reduced: "Reduced", zoneEvolution: "Zone evolution",
    remaining: "remaining", protein: "Protein", fat: "Fat", carbs: "Carbs",
    kcalRegistered: (n: number) => `+${n} kcal logged by AI`,
    aiDetectsAuto: "AI detects calories and macros automatically",
    aimAtPlateModal: "Aim at the plate — AI detects kcal and macros and logs automatically.",
    permissionDenied: "Permission denied. Enable the camera in browser settings.",
    cameraInUse: "Camera in use by another app. Close other apps and try again.",
    aiUnavailable: "AI analysis unavailable. Check your API key configuration.",
    silhouette: "Silhouette", composition: "Composition", precision: "Precision", calories: "Calories", macrosLabel: "Macros",
    initializingScanner: "Initializing scanner", cancel: "Cancel",
    fullBodyCapture: "Full body in frame · Tap to capture", foodCapture: "Aim at the plate · Tap to capture",
    calibrateBtn: "Calibrate AI", calibrationDataDesc: "Calibration data — increases precision",
    calibratedMsg: "Calibrated · Estimated precision ±1.5 cm",
    outfitTight: "tight", outfitNormal: "normal", outfitLoose: "loose", startScan3d: "Start 3D Scan",
    scanning3DHeader: "Mapping · 3D Body Scanner", analysisDoneHeader: "Analysis Completed", aiMappingLabel: "AI Mapping 3D Points",
    bodyCompositionScan: "Body composition", measureEstimateScan: "Measurements estimate", fatPctScan: "% Body Fat", scan3dDone: "3D Scan Complete",
    recordsFn: (n: number) => `${n} records | progress`,
    waistSeries: "Waist (cm)", chestSeries: "Chest (cm)", calsSeries: "Calories (kcal)", proteinSeries: "Protein (g x 10)",
    captureSetupItems: [{ title: "2.5m away", desc: "At hip height" }, { title: "Front lighting", desc: "No backlight" }, { title: "Full body", desc: "Head to feet" }, { title: "Arms out", desc: "Fitted clothing" }] as { title: string; desc: string }[],
    noHistoryYet: "Your body history is still forming the first trend line.",
    bodyReadingLabel: "Body reading consolidating.",
    frontStep: "Front", backStep: "Back",
    turnAroundMsg: "Great! Now turn around with your back to the camera.",
    stepFront: "1/2 · FRONT", stepBack: "2/2 · BACK",
    frontCaptureGuide: "Face the camera · Tap to capture",
    backCaptureGuide: "Now turn around · Tap to capture",
    frontCaptured: "Front captured ✓", mergingPhotos: "Merging images...",
    startFoodScan: "Start Food Scan",
    foodSetupItems: [{ title: "Top-down view", desc: "Aerial photo of the plate" }, { title: "Good lighting", desc: "No harsh shadows" }, { title: "Full plate", desc: "Everything in frame" }, { title: "Visible portions", desc: "Include all items" }] as { title: string; desc: string }[],
    shareEvolution: "Share body evolution", shareEvolutionShort: "Share evolution",
    waterBone: "H₂O + bone",
    muscleMappingTitle: "Muscle Mapping", muscleTapHint: "Tap any group to analyze", muscleInteractiveBadge: "Interactive Silhouette",
    muscleLabel: "Muscle", recoveryStatusLabel: "Recovery Status", activeFibers: "Active Fibers",
    weeklyVolume: "Weekly Volume", recommendedExercises: "Recommended Exercises",
    noExercisesFor: (m: string) => `No exercises listed for ${m}`,
    muscleStatusReady: "Ready to Train", muscleStatusRecovering: "Recovering", muscleStatusExcellent: "Excellent Condition",
    muscleStatusModerateFatigue: "Moderate Fatigue", muscleStatusRecovered: "Recovered", muscleStatusHighFatigue: "High Fatigue",
    muscleStatusFullyReady: "Fully Ready", setsWeekSuffix: "sets/wk",
    muscleNames: { Peito: "Chest", Costas: "Back", Ombros: "Shoulders", "Bíceps": "Biceps", "Tríceps": "Triceps", Pernas: "Legs", "Glúteos": "Glutes", Core: "Core", "Antebraço": "Forearm", "Full Body": "Full Body" } as Record<string, string>,
  },
  fr: {
    title: "3D Body Scanner", subtitle: "Scan corporel par IA — mesures précises, composition corporelle et évolution visuelle en temps réel.",
    measures: "Mesures", nutrition: "Nutrition",
    bodyScan: "Scan corporel", bodyDesc: "Prenez une photo du corps entier ou importez-la depuis la galerie pour que l'IA estime les mesures et le pourcentage de graisse.",
    foodScan: "Scan alimentaire", foodDesc: "Pointez vers l'assiette ou importez depuis la galerie pour que l'IA estime calories, protéines et glucides.",
    lastReading: "Dernière lecture", latestPhoto: "votre photo la plus récente", noSavedScan: "aucun scan enregistré pour l'instant", firstScan: "Faites votre premier scan pour voir votre photo ici.",
    todaySummary: "Résumé du jour", goalsMacros: "objectifs caloriques et macros", meals: "Repas", aiSuggestions: "Suggestions de l'IA", personalized: "ajustements personnalisés",
    historyBody: "Historique des scans corporels", historyFood: "Historique des scans alimentaires", evolution: "évolution",
    camera: "Caméra", gallery: "Galerie", useGallery: "Utiliser la galerie",
    captureGuide: "Guide de capture", quickCalibration: "Calibration rapide", distance: "Distance", lighting: "Éclairage", framing: "Cadrage", posture: "Posture",
    continue: "Continuer", height: "Taille", weight: "Poids", clothing: "Tenue",
    ready: "Prêt. La précision estimée est d'environ 1,5 cm avec la calibration appliquée.",
    back: "Retour", startScan: "Démarrer le scan", scanning: "IA en train d'analyser l'image...", analysisDone: "Analyse terminée", saveClose: "Enregistrer et fermer",
    bodyfat: "Graisse", confidence: "Confiance",
    editMeasuresTitle: "Vos Vraies Mesures", tapToEdit: "Touchez une valeur pour modifier", saveMeasures: "Enregistrer les mesures",
    body3d: "Corps 3D", compare: "Comparer", bodyTypeTab: "Type", colorMetricTab: "Couleur", musclesTab: "Muscles", edit: "Modifier",
    chest: "Poitrine", waist: "Taille", hip: "Hanche", arm: "Bras", thigh: "Cuisse", calf: "Mollet", shoulders: "Épaules", leanMass: "Masse maigre",
    before: "Avant", current: "Actuel", monthsAgo: "il y a 6 mois", today: "Aujourd'hui",
    bodyTypeLabel: "Votre type corporel", rcqLabel: "RTH", chestHipLabel: "Poitrine/Hanche",
    grew: "Augmenté", reduced: "Réduit", zoneEvolution: "Évolution par zone corporelle",
    remaining: "restants", protein: "Protéines", fat: "Lipides", carbs: "Glucides",
    kcalRegistered: (n: number) => `+${n} kcal enregistrées par l'IA`,
    aiDetectsAuto: "L'IA détecte les calories et macros automatiquement",
    aimAtPlateModal: "Pointez vers l'assiette — l'IA détecte kcal et macros et enregistre automatiquement.",
    permissionDenied: "Permission refusée. Activez la caméra dans les paramètres du navigateur.",
    cameraInUse: "Caméra utilisée par une autre app. Fermez les autres apps et réessayez.",
    aiUnavailable: "Analyse IA indisponible. Vérifiez la configuration de votre clé API.",
    silhouette: "Silhouette", composition: "Composition", precision: "Précision", calories: "Calories", macrosLabel: "Macros",
    initializingScanner: "Initialisation du scanner", cancel: "Annuler",
    fullBodyCapture: "Corps entier dans le cadre · Touchez pour capturer", foodCapture: "Pointez vers l'assiette · Touchez pour capturer",
    calibrateBtn: "Calibrer l'IA", calibrationDataDesc: "Données de calibration — améliorent la précision",
    calibratedMsg: "Calibré · Précision estimée ±1,5 cm",
    outfitTight: "ajustée", outfitNormal: "normale", outfitLoose: "ample", startScan3d: "Démarrer le scan 3D",
    scanning3DHeader: "Cartographie · 3D Body Scanner", analysisDoneHeader: "Analyse Terminée", aiMappingLabel: "IA cartographie les points 3D",
    bodyCompositionScan: "Composition corporelle", measureEstimateScan: "Estimation des mesures", fatPctScan: "% Graisse", scan3dDone: "Scan 3D Terminé",
    recordsFn: (n: number) => `${n} enregistrements | évolution`,
    waistSeries: "Taille (cm)", chestSeries: "Poitrine (cm)", calsSeries: "Calories (kcal)", proteinSeries: "Protéines (g x 10)",
    captureSetupItems: [{ title: "2,5m de distance", desc: "À hauteur des hanches" }, { title: "Éclairage frontal", desc: "Sans contre-jour" }, { title: "Corps entier", desc: "De la tête aux pieds" }, { title: "Bras écartés", desc: "Vêtements ajustés" }] as { title: string; desc: string }[],
    noHistoryYet: "Votre historique corporel est encore en train de former la première tendance.",
    bodyReadingLabel: "Lecture corporelle en cours de consolidation.",
    frontStep: "Face", backStep: "Dos",
    turnAroundMsg: "Parfait ! Tournez-vous maintenant dos à la caméra.",
    stepFront: "1/2 · FACE", stepBack: "2/2 · DOS",
    frontCaptureGuide: "Positionnez-vous de face · Touchez pour capturer",
    backCaptureGuide: "Maintenant de dos · Touchez pour capturer",
    frontCaptured: "Face capturée ✓", mergingPhotos: "Fusion des images...",
    startFoodScan: "Lancer Food Scan",
    foodSetupItems: [{ title: "Vue de dessus", desc: "Photo aérienne de l'assiette" }, { title: "Bonne lumière", desc: "Sans ombres fortes" }, { title: "Assiette entière", desc: "Tout dans le cadre" }, { title: "Portions visibles", desc: "Inclure tous les aliments" }] as { title: string; desc: string }[],
    shareEvolution: "Partager l'évolution corporelle", shareEvolutionShort: "Partager l'évolution",
    waterBone: "H₂O + os",
    muscleMappingTitle: "Cartographie Musculaire", muscleTapHint: "Touchez un groupe pour analyser", muscleInteractiveBadge: "Silhouette Interactive",
    muscleLabel: "Muscle", recoveryStatusLabel: "État de Récupération", activeFibers: "Fibres Actives",
    weeklyVolume: "Volume Hebdomadaire", recommendedExercises: "Exercices Recommandés",
    noExercisesFor: (m: string) => `Aucun exercice enregistré pour ${m}`,
    muscleStatusReady: "Prêt à l'Entraînement", muscleStatusRecovering: "En Récupération", muscleStatusExcellent: "État Excellent",
    muscleStatusModerateFatigue: "Fatigue Modérée", muscleStatusRecovered: "Récupéré", muscleStatusHighFatigue: "Fatigue Élevée",
    muscleStatusFullyReady: "Totalement Prêt", setsWeekSuffix: "séries/sem",
    muscleNames: { Peito: "Pectoraux", Costas: "Dos", Ombros: "Épaules", "Bíceps": "Biceps", "Tríceps": "Triceps", Pernas: "Jambes", "Glúteos": "Fessiers", Core: "Core", "Antebraço": "Avant-bras", "Full Body": "Corps Entier" } as Record<string, string>,
  },
  de: {
    title: "3D Body Scanner", subtitle: "KI-Körperscan — präzise Messungen, Körperzusammensetzung und visuelle Entwicklung in Echtzeit.",
    measures: "Messungen", nutrition: "Ernährung",
    bodyScan: "Körperscan", bodyDesc: "Mache ein Ganzkörperfoto oder lade eines aus der Galerie hoch, damit die KI Maße und Körperfettanteil schätzen kann.",
    foodScan: "Essensscan", foodDesc: "Richte die Kamera auf den Teller oder lade ein Bild aus der Galerie hoch, damit die KI Kalorien, Protein und Kohlenhydrate schätzen kann.",
    lastReading: "Letzte Messung", latestPhoto: "dein aktuellstes Foto", noSavedScan: "noch kein Scan gespeichert", firstScan: "Mache deinen ersten Scan, um dein Foto hier zu sehen.",
    todaySummary: "Heutige Zusammenfassung", goalsMacros: "Kalorienziele und Makros", meals: "Mahlzeiten", aiSuggestions: "KI-Vorschläge", personalized: "personalisierte Anpassungen",
    historyBody: "Verlauf der Körperscans", historyFood: "Verlauf der Essensscans", evolution: "Entwicklung",
    camera: "Kamera", gallery: "Galerie", useGallery: "Galerie verwenden",
    captureGuide: "Aufnahmeleitfaden", quickCalibration: "Schnellkalibrierung", distance: "Abstand", lighting: "Beleuchtung", framing: "Ausrichtung", posture: "Haltung",
    continue: "Weiter", height: "Größe", weight: "Gewicht", clothing: "Bekleidung",
    ready: "Fertig. Die geschätzte Genauigkeit liegt mit Kalibrierung bei etwa 1,5 cm.",
    back: "Zurück", startScan: "Scan starten", scanning: "KI analysiert Bild...", analysisDone: "Analyse abgeschlossen", saveClose: "Speichern und schließen",
    bodyfat: "Körperfett", confidence: "Vertrauen",
    editMeasuresTitle: "Deine echten Maße", tapToEdit: "Tippe auf einen Wert zum Bearbeiten", saveMeasures: "Maße speichern",
    body3d: "Körper 3D", compare: "Vergleichen", bodyTypeTab: "Typ", colorMetricTab: "Farbe", musclesTab: "Muskeln", edit: "Bearbeiten",
    chest: "Brust", waist: "Taille", hip: "Hüfte", arm: "Arm", thigh: "Oberschenkel", calf: "Wade", shoulders: "Schultern", leanMass: "Muskelmasse",
    before: "Vorher", current: "Aktuell", monthsAgo: "vor 6 Monaten", today: "Heute",
    bodyTypeLabel: "Dein Körpertyp", rcqLabel: "WHR", chestHipLabel: "Brust/Hüfte",
    grew: "Gewachsen", reduced: "Reduziert", zoneEvolution: "Entwicklung nach Körperzone",
    remaining: "verbleibend", protein: "Protein", fat: "Fett", carbs: "Kohlenhy.",
    kcalRegistered: (n: number) => `+${n} kcal von KI erfasst`,
    aiDetectsAuto: "KI erkennt Kalorien und Makros automatisch",
    aimAtPlateModal: "Kamera auf den Teller richten — KI erkennt kcal und Makros und speichert automatisch.",
    permissionDenied: "Zugriff verweigert. Aktiviere die Kamera in den Browser-Einstellungen.",
    cameraInUse: "Kamera wird von einer anderen App verwendet. Schließe andere Apps und versuche es erneut.",
    aiUnavailable: "KI-Analyse nicht verfügbar. Prüfe die API-Schlüssel-Konfiguration.",
    silhouette: "Silhouette", composition: "Zusammensetzung", precision: "Präzision", calories: "Kalorien", macrosLabel: "Makros",
    initializingScanner: "Scanner wird initialisiert", cancel: "Abbrechen",
    fullBodyCapture: "Ganzer Körper im Bild · Tippen zum Aufnehmen", foodCapture: "Kamera auf den Teller · Tippen zum Aufnehmen",
    calibrateBtn: "KI kalibrieren", calibrationDataDesc: "Kalibrierdaten — erhöhen die Genauigkeit",
    calibratedMsg: "Kalibriert · Geschätzte Genauigkeit ±1,5 cm",
    outfitTight: "eng", outfitNormal: "normal", outfitLoose: "locker", startScan3d: "3D-Scan starten",
    scanning3DHeader: "Kartierung · 3D Body Scanner", analysisDoneHeader: "Analyse Abgeschlossen", aiMappingLabel: "KI kartiert 3D-Punkte",
    bodyCompositionScan: "Körperzusammensetzung", measureEstimateScan: "Maßschätzung", fatPctScan: "% Körperfett", scan3dDone: "3D-Scan Abgeschlossen",
    recordsFn: (n: number) => `${n} Einträge | Entwicklung`,
    waistSeries: "Taille (cm)", chestSeries: "Brust (cm)", calsSeries: "Kalorien (kcal)", proteinSeries: "Protein (g x 10)",
    captureSetupItems: [{ title: "2,5m Abstand", desc: "Auf Hüfthöhe" }, { title: "Frontales Licht", desc: "Kein Gegenlicht" }, { title: "Ganzer Körper", desc: "Kopf bis Fuß" }, { title: "Arme ausgestreckt", desc: "Eng anliegende Kleidung" }] as { title: string; desc: string }[],
    noHistoryYet: "Deine Körperhistorie bildet noch die erste Trendlinie.",
    bodyReadingLabel: "Körpermessung wird konsolidiert.",
    frontStep: "Vorderseite", backStep: "Rückseite",
    turnAroundMsg: "Super! Drehen Sie sich jetzt mit dem Rücken zur Kamera.",
    stepFront: "1/2 · VORNE", stepBack: "2/2 · RÜCKEN",
    frontCaptureGuide: "Stellen Sie sich frontal auf · Tippen zum Aufnehmen",
    backCaptureGuide: "Jetzt mit dem Rücken · Tippen zum Aufnehmen",
    frontCaptured: "Vorderseite aufgenommen ✓", mergingPhotos: "Bilder werden zusammengefügt...",
    startFoodScan: "Food Scan starten",
    foodSetupItems: [{ title: "Vogelperspektive", desc: "Luftaufnahme des Tellers" }, { title: "Gutes Licht", desc: "Keine harten Schatten" }, { title: "Ganzer Teller", desc: "Alles im Bild" }, { title: "Sichtbare Portionen", desc: "Alle Speisen einbeziehen" }] as { title: string; desc: string }[],
    shareEvolution: "Körperentwicklung teilen", shareEvolutionShort: "Entwicklung teilen",
    waterBone: "H₂O + Knochen",
    muscleMappingTitle: "Muskelkartierung", muscleTapHint: "Tippe auf eine Gruppe zum Analysieren", muscleInteractiveBadge: "Interaktive Silhouette",
    muscleLabel: "Muskel", recoveryStatusLabel: "Erholungsstatus", activeFibers: "Aktive Fasern",
    weeklyVolume: "Wöchentliches Volumen", recommendedExercises: "Empfohlene Übungen",
    noExercisesFor: (m: string) => `Keine Übungen für ${m} eingetragen`,
    muscleStatusReady: "Trainingsbereit", muscleStatusRecovering: "In Erholung", muscleStatusExcellent: "Ausgezeichneter Zustand",
    muscleStatusModerateFatigue: "Mäßige Ermüdung", muscleStatusRecovered: "Erholt", muscleStatusHighFatigue: "Hohe Ermüdung",
    muscleStatusFullyReady: "Vollständig Bereit", setsWeekSuffix: "Sätze/Wo",
    muscleNames: { Peito: "Brust", Costas: "Rücken", Ombros: "Schultern", "Bíceps": "Bizeps", "Tríceps": "Trizeps", Pernas: "Beine", "Glúteos": "Gesäß", Core: "Core", "Antebraço": "Unterarm", "Full Body": "Ganzer Körper" } as Record<string, string>,
  },
};

type CopyType = (typeof COPY)[keyof typeof COPY];

const BODY_TYPES: Record<string, Record<string, { nome: string; sub: string; desc: string }>> = {
  pt: {
    hourglass:    { nome: "Ampulheta",   sub: "Curvas simétricas",        desc: "Ombros e quadril equilibrados, cintura bem definida — proporção ideal para estética atlética." },
    triangle:     { nome: "Triângulo",   sub: "Forma pear",               desc: "Quadril mais largo que os ombros. Foco em equilíbrio superior e definição." },
    invTriangle:  { nome: "Triâng. Inv.", sub: "Forma V",                 desc: "Ombros mais largos que o quadril. Boa base para hipertrofia." },
    oval:         { nome: "Oval",        sub: "Concentração central",     desc: "Cintura mais larga que quadril e ombros. Priorize perda de gordura abdominal." },
    rectangular:  { nome: "Retangular", sub: "Forma atlética",            desc: "Medidas uniformes. Ótima base para ganho muscular definido." },
  },
  es: {
    hourglass:    { nome: "Reloj de Arena", sub: "Curvas simétricas",    desc: "Hombros y cadera equilibrados, cintura bien definida — proporción ideal para estética atlética." },
    triangle:     { nome: "Triángulo",      sub: "Forma pera",           desc: "Cadera más ancha que los hombros. Foco en equilibrio superior y definición." },
    invTriangle:  { nome: "Triáng. Inv.",   sub: "Forma V",              desc: "Hombros más anchos que la cadera. Buena base para hipertrofia." },
    oval:         { nome: "Oval",           sub: "Concentración central", desc: "Cintura más ancha que cadera y hombros. Prioriza la pérdida de grasa abdominal." },
    rectangular:  { nome: "Rectangular",   sub: "Forma atlética",        desc: "Medidas uniformes. Excelente base para ganancia muscular definida." },
  },
  en: {
    hourglass:    { nome: "Hourglass",   sub: "Symmetric curves",       desc: "Balanced shoulders and hips, well-defined waist — ideal ratio for athletic aesthetics." },
    triangle:     { nome: "Triangle",    sub: "Pear shape",             desc: "Hips wider than shoulders. Focus on upper body balance and definition." },
    invTriangle:  { nome: "Inv. Triangle", sub: "V-shape",             desc: "Shoulders wider than hips. Great foundation for hypertrophy." },
    oval:         { nome: "Oval",        sub: "Central concentration",  desc: "Waist wider than hips and shoulders. Prioritize abdominal fat loss." },
    rectangular:  { nome: "Rectangular", sub: "Athletic shape",        desc: "Uniform measurements. Great foundation for defined muscle gain." },
  },
  fr: {
    hourglass:    { nome: "Sablier",     sub: "Courbes symétriques",    desc: "Épaules et hanches équilibrées, taille bien définie — rapport idéal pour l'esthétique athlétique." },
    triangle:     { nome: "Triangle",   sub: "Forme poire",             desc: "Hanches plus larges que les épaules. Focus sur l'équilibre supérieur et la définition." },
    invTriangle:  { nome: "Tri. Inv.",   sub: "Forme en V",             desc: "Épaules plus larges que les hanches. Bonne base pour l'hypertrophie." },
    oval:         { nome: "Ovale",       sub: "Concentration centrale", desc: "Taille plus large que hanches et épaules. Privilégiez la perte de graisse abdominale." },
    rectangular:  { nome: "Rectangulaire", sub: "Forme athlétique",   desc: "Mesures uniformes. Excellente base pour un gain musculaire défini." },
  },
  de: {
    hourglass:    { nome: "Sanduhr",     sub: "Symmetrische Kurven",   desc: "Ausgeglichene Schultern und Hüften, gut definierte Taille — ideales Verhältnis für athletische Ästhetik." },
    triangle:     { nome: "Dreieck",     sub: "Birnenform",            desc: "Hüften breiter als Schultern. Fokus auf Oberkörper-Balance und Definition." },
    invTriangle:  { nome: "Inv. Dreieck", sub: "V-Form",              desc: "Schultern breiter als Hüften. Gute Basis für Hypertrophie." },
    oval:         { nome: "Oval",        sub: "Zentrale Konzentration", desc: "Taille breiter als Hüften und Schultern. Priorisiere den Abbau von Bauchfett." },
    rectangular:  { nome: "Rechteckig", sub: "Athletische Form",       desc: "Gleichmäßige Maße. Hervorragende Basis für definierten Muskelaufbau." },
  },
};

function CorpoPage() {
  const copy = COPY[getStoredLocale()] ?? COPY.pt;
  const [tab, setTab] = useState<Tab>("medidas");
  const [fsBodyScans, setFsBodyScans] = useState<FirestoreBodyScan[]>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    loadBodyScansFromFirestore(uid).then(setFsBodyScans).catch(() => {});
  }, []);

  const currentFat = fsBodyScans[0]?.estimativas?.percentualGorduraEstimado ?? 0;
  const prevFat = fsBodyScans[1]?.estimativas?.percentualGorduraEstimado;
  const scanConfidence = fsBodyScans[0]?.qualidade?.confiancaLeitura ?? 0;
  const fatImproving = prevFat !== undefined && currentFat < prevFat;
  const fatWorsening = prevFat !== undefined && currentFat > prevFat;

  return (
    <div className="space-y-5">
      {/* Hero 3D Body Scanner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan/20 bg-[#070B14] p-5 shadow-elevated">
        {/* Glow ciano esquerda */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-cyan/20 blur-3xl" />
        {/* Glow laranja direita */}
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 rounded-full blur-3xl" style={{ background: "rgba(251,146,60,0.18)" }} />

        <div className="relative flex items-center gap-4">
          <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-cyan/30 bg-[#0d1525] shadow-lg">
            {/* Linha de scan animada */}
            <div className="absolute inset-x-0 top-0 h-px animate-[scan_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-cyan to-transparent opacity-80" />
            <ScanLine className="h-7 w-7 text-cyan drop-shadow-[0_0_8px_var(--cyan)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="font-display text-2xl font-black tracking-tight"
                style={{ background: "linear-gradient(90deg, #22d3ee 0%, #ffffff 45%, #fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                3D Body Scanner
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" /> IA
              </span>
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{copy.subtitle}</p>
          </div>
        </div>

        {/* Compartilhar evolução */}
        <div className="relative mt-4 flex justify-end">
          <ShareVideoButton
            composition={CorpoEvolutionVideo as never}
            inputProps={{
              name: loadOnboarding().name ?? "Atleta",
              bodyFatStart: fsBodyScans.length > 1 ? (fsBodyScans[fsBodyScans.length - 1]?.estimativas?.percentualGorduraEstimado ?? 22) : 22,
              bodyFatCurrent: currentFat || 18,
              weightStart: loadOnboarding().weight ?? 75,
              weightCurrent: loadOnboarding().weight ?? 75,
              waistStart: fsBodyScans.length > 1 ? (fsBodyScans[fsBodyScans.length - 1]?.estimativas?.cinturaCmEstimada ?? 90) : 90,
              waistCurrent: fsBodyScans[0]?.estimativas?.cinturaCmEstimada ?? 86,
              muscleMass: 68,
              trend: copy.evolution,
            }}
            durationInFrames={450}
            title={copy.shareEvolution}
            label={copy.shareEvolutionShort}
          />
        </div>

        {/* Stats rápidos dinâmicos */}
        <div className="relative mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-cyan/15 bg-white/5 px-3 py-2 text-center">
            <div className="font-display text-lg font-bold text-cyan">{bodyScans.length || "--"}</div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400">Scans</div>
          </div>
          <div className="rounded-xl border border-orange-500/20 bg-white/5 px-3 py-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <span className="font-display text-lg font-bold" style={{ color: "#fb923c" }}>
                {currentFat > 0 ? `${currentFat.toFixed(1)}%` : "--"}
              </span>
              {fatImproving && <span className="text-[11px] font-bold leading-none" style={{ color: "#10b981" }}>↓</span>}
              {fatWorsening && <span className="text-[11px] font-bold leading-none" style={{ color: "#ef4444" }}>↑</span>}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400">{copy.bodyfat}</div>
          </div>
          <div className="rounded-xl border border-cyan/15 bg-white/5 px-3 py-2 text-center">
            <div className="font-display text-lg font-bold text-white">{scanConfidence > 0 ? `${scanConfidence}%` : "--"}</div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400">{copy.confidence}</div>
          </div>
        </div>

        {/* Barra de composição corporal */}
        {currentFat > 0 && (
          <div className="relative mt-3">
            <div className="flex h-2 w-full overflow-hidden rounded-full">
              <div style={{ width: `${Math.min(50, currentFat)}%`, background: "rgba(251,146,60,0.85)" }} />
              <div style={{ width: `${Math.min(60, (bodyComposition.muscleMass / bodyComposition.weight) * 100)}%`, background: "rgba(34,211,238,0.8)" }} />
              <div className="flex-1" style={{ background: "rgba(168,85,247,0.45)" }} />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[8px] font-medium">
              <span style={{ color: "rgba(251,146,60,0.9)" }}>{currentFat.toFixed(1)}% {copy.fat}</span>
              <span style={{ color: "rgba(168,85,247,0.9)" }}>{copy.waterBone}</span>
              <span style={{ color: "rgba(34,211,238,0.9)" }}>{copy.leanMass} {((bodyComposition.muscleMass / bodyComposition.weight) * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
        <TabBtn active={tab === "medidas"} onClick={() => setTab("medidas")}>{copy.measures}</TabBtn>
        <TabBtn active={tab === "nutricao"} onClick={() => setTab("nutricao")}>{copy.nutrition}</TabBtn>
      </div>

      {tab === "medidas" ? <MedidasTab copy={copy} /> : <NutricaoTab copy={copy} />}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition",
        active ? "bg-gradient-primary text-primary-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function useLiveMeasures() {
  const [measures, setMeasures] = useState(bodyMeasures);
  const [composition, setComposition] = useState({
    weight:     bodyComposition.weight,
    bodyFat:    bodyComposition.bodyFat,
    muscleMass: bodyComposition.muscleMass,
  });

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    loadMeasurementsFromFirestore(uid).then((data) => {
      setMeasures((prev) =>
        prev.map((m) => {
          const v = data[m.key as keyof BodyMeasurements];
          return typeof v === "number" ? { ...m, value: v } : m;
        }),
      );
      setComposition({
        weight:     data.weight     ?? bodyComposition.weight,
        bodyFat:    data.bodyFat    ?? bodyComposition.bodyFat,
        muscleMass: data.muscleMass ?? bodyComposition.muscleMass,
      });
    }).catch(() => {});
  }, []);

  const batchUpdate = (updates: Record<string, number>) => {
    const uid = auth.currentUser?.uid;
    setMeasures((prev) =>
      prev.map((m) => {
        const v = updates[m.key];
        return v !== undefined ? { ...m, value: v } : m;
      }),
    );
    const compPatch: Partial<typeof composition> = {};
    if (updates.bodyFat   !== undefined) compPatch.bodyFat    = updates.bodyFat;
    if (updates.muscleMass!== undefined) compPatch.muscleMass = updates.muscleMass;
    if (updates.weight    !== undefined) compPatch.weight     = updates.weight;
    if (Object.keys(compPatch).length > 0) setComposition((prev) => ({ ...prev, ...compPatch }));
    if (uid) {
      const fsUpdate: BodyMeasurements = { ...compPatch };
      bodyMeasures.forEach((m) => { if (updates[m.key] !== undefined) (fsUpdate as Record<string, number>)[m.key] = updates[m.key]; });
      void saveMeasurementsToFirestore(uid, fsUpdate).catch(() => {});
    }
  };

  const update = (key: string, value: number) => batchUpdate({ [key]: value });

  return { measures, composition, update, batchUpdate };
}

function MedidasTab({ copy }: { copy: (typeof COPY)[keyof typeof COPY] }) {
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const [bodySummary, setBodySummary] = useState(copy.noHistoryYet);
  const [editOpen, setEditOpen] = useState(false);
  const [scanTrigger, setScanTrigger] = useState(0);
  const { measures, composition, update, batchUpdate } = useLiveMeasures();
  const isFemale = loadOnboarding().gender !== "male";

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    loadMeasurementsFromFirestore(uid).then((data) => {
      if (data.photoUrl) setLastPhoto(data.photoUrl);
      if (data.lastAnalysis) setBodySummary(data.lastAnalysis);
    }).catch(() => {});
    loadBodyScansFromFirestore(uid).then((scans) => {
      if (scans[0]?.analysis) setBodySummary(scans[0].analysis);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <ScanCTA
        kind="body"
        title={copy.bodyScan}
        desc={copy.bodyDesc}
        copy={copy}
        onScanComplete={(url) => setLastPhoto(url)}
        onMeasurementsDetected={(m) => batchUpdate(m as Record<string, number>)}
        onAnalysis={(text) => setBodySummary(text)}
        onScanSaved={() => setScanTrigger(t => t + 1)}
      />

      <BodyScanPanel female={isFemale} lastPhoto={lastPhoto} copy={copy} measures={measures} composition={composition} onEditClick={() => setEditOpen(true)} />

      {/* Modal de edição de medidas */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <div className="font-display text-base font-black text-white">{copy.editMeasuresTitle}</div>
              <div className="text-[10px] text-slate-400">{copy.tapToEdit}</div>
            </div>
            <button
              onClick={() => setEditOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/8 text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {measures.map((m) => {
              const lm: Record<string, string> = { peito: copy.chest, cintura: copy.waist, quadril: copy.hip, braco: copy.arm, coxa: copy.thigh, panturrilha: copy.calf };
              return (
              <div key={m.key} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{lm[m.key] ?? m.label}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={m.value}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (!isNaN(v) && v > 0) update(m.key, v);
                    }}
                    className="w-20 rounded-xl border border-cyan/30 bg-black/50 px-2 py-1.5 text-center font-display text-xl font-black text-cyan focus:border-cyan focus:outline-none"
                  />
                  <span className="text-xs text-slate-500">{m.unit}</span>
                </div>
              </div>
              );
            })}
          </div>
          <div className="border-t border-white/10 p-4">
            <button
              onClick={() => setEditOpen(false)}
              className="w-full rounded-2xl py-3.5 font-black uppercase tracking-widest text-white"
              style={{ background: "linear-gradient(135deg,#0891b2,#22d3ee)", boxShadow: "0 0 20px rgba(34,211,238,0.3)" }}
            >
              {copy.saveMeasures}
            </button>
          </div>
        </div>
      )}

      <AIInsightCard>
        <strong>{copy.bodyReadingLabel}</strong>{" "}
        {bodySummary}
      </AIInsightCard>

      <div className="grid grid-cols-2 gap-3">
        {measures.map((m) => {
          const lm: Record<string, string> = { peito: copy.chest, cintura: copy.waist, quadril: copy.hip, braco: copy.arm, coxa: copy.thigh, panturrilha: copy.calf };
          return <MeasureCard key={m.key} m={m} label={lm[m.key]} />;
        })}
      </div>

      <ScanHistory kind="body" copy={copy} refreshTrigger={scanTrigger} />
    </div>
  );
}

function MeasureCard({ m, label }: { m: (typeof bodyMeasures)[number]; label?: string }) {
  const up = m.delta >= 0;
  const min = Math.min(...m.history);
  const max = Math.max(...m.history);
  const range = Math.max(0.1, max - min);
  const points = m.history
    .map((v, i) => {
      const x = (i / (m.history.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label ?? m.label}</div>
          <div className="font-display text-xl font-bold">
            {m.value}
            <span className="ml-1 text-xs font-medium text-muted-foreground">{m.unit}</span>
          </div>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
            up ? "bg-primary/10 text-primary" : "bg-cyan/10 text-cyan",
          )}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {up ? "+" : ""}
          {m.delta}
        </div>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-2 h-10 w-full">
        <polyline
          points={points}
          fill="none"
          stroke={up ? "var(--primary)" : "var(--cyan)"}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-elevated/40 p-2 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-sm font-bold">{value}</div>
    </div>
  );
}

// ─── ColorMetric zone data (amber = cresceu, teal = reduziu) ────────────────
const BASE_COLOR_ZONES: { key: string; label: string; delta: number; yPct: number; side: "left" | "right" }[] = [
  { key: "peito",       label: "Peito",       delta:  1.2, yPct: 0.20, side: "left"  },
  { key: "cintura",     label: "Cintura",     delta: -0.8, yPct: 0.40, side: "left"  },
  { key: "quadril",     label: "Quadril",     delta:  0.3, yPct: 0.52, side: "left"  },
  { key: "braco",       label: "Braço",       delta:  0.5, yPct: 0.20, side: "right" },
  { key: "coxa",        label: "Coxa",        delta:  0.4, yPct: 0.65, side: "right" },
  { key: "panturrilha", label: "Panturrilha", delta:  0.2, yPct: 0.82, side: "right" },
];

function BodyScanPanel({
  female,
  lastPhoto,
  copy,
  measures,
  composition,
  onEditClick,
}: {
  female: boolean;
  lastPhoto: string | null;
  copy: (typeof COPY)[keyof typeof COPY];
  measures: typeof bodyMeasures;
  composition: { weight: number; bodyFat: number; muscleMass: number };
  onEditClick: () => void;
}) {
  const [view, setView] = useState<BodyView>("3d");

  const SH = 240;
  const shoulderY = 0.196 * SH;
  const waistY    = 0.402 * SH;
  const hipY      = 0.518 * SH;
  const thighY    = 0.640 * SH;
  const calfY     = 0.820 * SH;

  const peito    = measures.find(m => m.key === "peito")!.value;
  const cintura  = measures.find(m => m.key === "cintura")!.value;
  const quadril  = measures.find(m => m.key === "quadril")!.value;
  const braco    = measures.find(m => m.key === "braco")!.value;
  const coxa     = measures.find(m => m.key === "coxa")!.value;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#060a12]">
      {/* Sub-tabs + botão editar */}
      <div className="flex items-center border-b border-white/8">
        {(["3d", "comparar", "tipo", "cor", "musculos"] as BodyView[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition",
              view === v
                ? "border-b-2 border-cyan bg-cyan/5 text-cyan"
                : "text-slate-500 hover:text-slate-300",
            )}
          >
            {v === "3d"
              ? copy.body3d
              : v === "comparar"
              ? copy.compare
              : v === "tipo"
              ? copy.bodyTypeTab
              : v === "cor"
              ? copy.colorMetricTab
              : copy.musclesTab}
          </button>
        ))}
        <button
          onClick={onEditClick}
          className="shrink-0 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-orange-400 border-l border-white/8"
        >
          {copy.edit}
        </button>
      </div>

      {/* ── CORPO 3D ── */}
      {view === "3d" && (
        <div className="relative p-4">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(34,211,238,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.035) 1px,transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-24 rounded-full blur-3xl" style={{ background: "rgba(34,211,238,0.07)" }} />

          <div className="relative flex items-center justify-center gap-1">
            {/* Medidas esquerda (cyan) */}
            <div className="relative shrink-0" style={{ width: 72, height: SH }}>
              {[
                { label: copy.chest,  value: peito,   unit: "cm", y: shoulderY },
                { label: copy.waist,  value: cintura,  unit: "cm", y: waistY   },
                { label: copy.hip,    value: quadril,  unit: "cm", y: hipY     },
              ].map(({ label, value, unit, y }) => (
                <div key={label} className="absolute right-0 flex flex-col items-end" style={{ top: y - 14 }}>
                  <div className="font-display text-[15px] font-black leading-none text-cyan">
                    {value}<span className="ml-0.5 text-[8px] font-medium text-cyan/50">{unit}</span>
                  </div>
                  <div className="text-[8px] uppercase tracking-widest text-slate-500">{label}</div>
                  <div className="mt-0.5 h-px w-4 bg-cyan/30" />
                </div>
              ))}
            </div>

            {/* Silhueta central */}
            <div className="relative shrink-0" style={{ width: 130, height: SH }}>
              <BodySilhouette female={female} width={130} height={SH} />
            </div>

            {/* Medidas direita (laranja) */}
            <div className="relative shrink-0" style={{ width: 72, height: SH }}>
              {[
                { label: copy.arm,     value: braco,               unit: "cm", y: shoulderY },
                { label: copy.thigh,   value: coxa,                unit: "cm", y: thighY    },
                { label: copy.bodyfat, value: composition.bodyFat, unit: "%",  y: calfY     },
              ].map(({ label, value, unit, y }) => (
                <div key={label} className="absolute left-0 flex flex-col items-start" style={{ top: y - 14 }}>
                  <div className="h-px w-4 mb-0.5 bg-orange-400/30" />
                  <div className="font-display text-[15px] font-black leading-none text-orange-400">
                    {value}<span className="ml-0.5 text-[8px] font-medium text-orange-400/50">{unit}</span>
                  </div>
                  <div className="text-[8px] uppercase tracking-widest text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Última foto miniatura */}
          {lastPhoto && (
            <div className="relative mt-3 overflow-hidden rounded-xl border border-border/60">
              <img src={lastPhoto} alt="Último scan" className="h-40 w-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-3 text-[9px] font-bold uppercase tracking-widest text-white/70">{copy.latestPhoto}</div>
              <button
                onClick={() => {
                  const uid = auth.currentUser?.uid;
                  if (uid) void saveMeasurementsToFirestore(uid, { photoUrl: "" }).catch(() => {});
                  window.location.reload();
                }}
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/60 text-white/70 backdrop-blur active:scale-90 transition-transform"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Composição */}
          <div className="relative mt-3 grid grid-cols-3 gap-2">
            {[
              { label: copy.weight,   value: `${composition.weight}`,     unit: "kg", color: "text-white"      },
              { label: copy.bodyfat,  value: `${composition.bodyFat}`,    unit: "%",  color: "text-orange-400" },
              { label: copy.leanMass, value: `${composition.muscleMass}`, unit: "kg", color: "text-cyan"       },
            ].map(({ label, value, unit, color }) => (
              <div key={label} className="rounded-xl border border-white/8 bg-white/4 p-2 text-center">
                <div className={cn("font-display text-sm font-black", color)}>
                  {value}<span className="text-[9px] font-medium text-slate-500"> {unit}</span>
                </div>
                <div className="text-[8px] uppercase tracking-widest text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── COMPARAR (Lado a Lado) ── */}
      {view === "comparar" && (
        <div className="relative p-4">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative flex items-end justify-center gap-6">
            {/* Antes */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="text-[9px] font-black uppercase tracking-widest text-orange-400/70">{copy.before}</div>
              <div className="relative">
                <BodySilhouette female={female} width={105} height={195} />
                <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center,rgba(251,146,60,0.12) 0%,transparent 70%)" }} />
              </div>
              <div className="text-center">
                <div className="font-display text-sm font-black text-orange-400">78.0 kg</div>
                <div className="text-[8px] text-slate-500">{copy.monthsAgo}</div>
              </div>
            </div>

            {/* VS */}
            <div className="mb-10 flex flex-col items-center gap-1">
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
              <span className="text-[10px] font-black text-slate-600">VS</span>
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
            </div>

            {/* Atual */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="text-[9px] font-black uppercase tracking-widest text-cyan">{copy.current}</div>
              <div className="relative">
                <BodySilhouette female={female} width={105} height={195} />
                <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center,rgba(34,211,238,0.1) 0%,transparent 70%)" }} />
              </div>
              <div className="text-center">
                <div className="font-display text-sm font-black text-cyan">{composition.weight} kg</div>
                <div className="text-[8px] text-slate-500">{copy.today}</div>
              </div>
            </div>
          </div>

          <div className="relative mt-4 grid grid-cols-3 gap-2">
            {[
              { label: copy.weight,  value: "-0.4 kg" },
              { label: copy.waist,   value: "-4 cm"   },
              { label: copy.bodyfat, value: "-2.3%"   },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-cyan/15 bg-white/4 p-2 text-center">
                <div className="text-[8px] uppercase tracking-widest text-slate-500">{label}</div>
                <div className="font-display text-sm font-black text-cyan">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TIPO CORPORAL ── */}
      {view === "tipo" && <BodyTypeView female={female} measures={measures} copy={copy} />}

      {/* ── COLORMETRIC ── */}
      {view === "cor" && <ColorMetricView female={female} measures={measures} copy={copy} />}

      {/* ── MÚSCULOS (Silhueta Muscular) ── */}
      {view === "musculos" && <MusclesView female={female} copy={copy} />}
    </div>
  );
}

function BodyTypeView({ female, measures, copy }: { female: boolean; measures: typeof bodyMeasures; copy: CopyType }) {
  const peito   = measures.find(m => m.key === "peito")!.value;
  const cintura = measures.find(m => m.key === "cintura")!.value;
  const quadril = measures.find(m => m.key === "quadril")!.value;

  const whr = cintura / quadril;
  const shr = peito   / quadril;

  const locale = getStoredLocale();
  const bodyTypeLocale = BODY_TYPES[locale] ?? BODY_TYPES.pt;

  let tipoKey: string;
  let tipoColor: string;

  if (whr < 0.75 && Math.abs(peito - quadril) < 7) {
    tipoKey = "hourglass"; tipoColor = "#22d3ee";
  } else if (quadril > peito + 5) {
    tipoKey = "triangle"; tipoColor = "#fb923c";
  } else if (peito > quadril + 5) {
    tipoKey = "invTriangle"; tipoColor = "#3b82f6";
  } else if (whr > 0.85) {
    tipoKey = "oval"; tipoColor = "#a855f7";
  } else {
    tipoKey = "rectangular"; tipoColor = "#10b981";
  }

  const tipo = bodyTypeLocale[tipoKey];

  return (
    <div className="relative p-5">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 rounded-full blur-3xl" style={{ background: `${tipoColor}18` }} />
          <BodySilhouette female={female} width={120} height={205} />
        </div>

        <div className="text-center">
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">{copy.bodyTypeLabel}</div>
          <div
            className="mt-1 font-display text-4xl font-black uppercase tracking-tight leading-none"
            style={{ color: tipoColor, textShadow: `0 0 28px ${tipoColor}55` }}
          >
            {tipo.nome}
          </div>
          <div className="mt-1 text-xs font-semibold" style={{ color: `${tipoColor}99` }}>{tipo.sub}</div>
          <p className="mx-auto mt-2 max-w-[240px] text-[11px] leading-relaxed text-slate-400">{tipo.desc}</p>
        </div>

        <div className="w-full grid grid-cols-3 gap-2">
          {[
            { label: copy.rcqLabel,       value: whr.toFixed(2) },
            { label: copy.chestHipLabel,  value: shr.toFixed(2) },
            { label: copy.confidence,     value: "92%"          },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border bg-white/3 p-2 text-center" style={{ borderColor: `${tipoColor}25` }}>
              <div className="text-[8px] uppercase tracking-widest text-slate-500">{label}</div>
              <div className="font-display text-sm font-black" style={{ color: tipoColor }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorMetricView({ female, measures, copy }: { female: boolean; measures: typeof bodyMeasures; copy: CopyType }) {
  const colorZones = BASE_COLOR_ZONES.map(z => ({ ...z, delta: measures.find(m => m.key === z.key)?.delta ?? z.delta }));
  const SH = 240;

  const zoneLabels: Record<string, string> = {
    peito: copy.chest, cintura: copy.waist, quadril: copy.hip,
    braco: copy.arm,   coxa: copy.thigh,    panturrilha: copy.calf,
  };

  return (
    <div className="relative p-4">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.025) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-black uppercase tracking-widest text-white">ColorMetric</div>
          <div className="text-[9px] text-slate-500">{copy.zoneEvolution}</div>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-orange-400" /> {copy.grew}</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-cyan" /> {copy.reduced}</span>
        </div>
      </div>

      <div className="relative flex items-center justify-center gap-2">
        {/* Badges esquerda */}
        <div className="relative shrink-0" style={{ width: 78, height: SH }}>
          {colorZones.filter(z => z.side === "left").map((z) => {
            const isGrowth = z.delta > 0;
            const color    = isGrowth ? "#fb923c" : "#22d3ee";
            return (
              <div key={z.key} className="absolute right-0 flex flex-col items-end" style={{ top: z.yPct * SH - 14 }}>
                <div className="font-display text-[14px] font-black leading-none" style={{ color }}>
                  {isGrowth ? "+" : ""}{z.delta} cm
                </div>
                <div className="text-[8px] uppercase tracking-widest text-slate-500">{zoneLabels[z.key] ?? z.label}</div>
                <div className="mt-0.5 h-px w-4" style={{ background: color, opacity: 0.4 }} />
              </div>
            );
          })}
        </div>

        {/* Silhueta colorizada */}
        <div className="relative shrink-0" style={{ width: 130, height: SH }}>
          <BodySilhouette female={female} width={130} height={SH} />
          {/* Halos de cor por zona */}
          {colorZones.map((z) => {
            const isGrowth = z.delta > 0;
            const color    = isGrowth ? "rgba(251,146,60,0.22)" : "rgba(34,211,238,0.18)";
            const cx       = z.side === "left" ? "30%" : "70%";
            return (
              <div
                key={z.key}
                className="pointer-events-none absolute"
                style={{
                  top:    `calc(${z.yPct * 100}% - 12px)`,
                  left:   z.side === "left" ? "5%" : "55%",
                  width:  36,
                  height: 24,
                  borderRadius: "50%",
                  background: color,
                  filter: "blur(8px)",
                }}
              />
            );
          })}
        </div>

        {/* Badges direita */}
        <div className="relative shrink-0" style={{ width: 78, height: SH }}>
          {colorZones.filter(z => z.side === "right").map((z) => {
            const isGrowth = z.delta > 0;
            const color    = isGrowth ? "#fb923c" : "#22d3ee";
            return (
              <div key={z.key} className="absolute left-0 flex flex-col items-start" style={{ top: z.yPct * SH - 14 }}>
                <div className="h-px w-4 mb-0.5" style={{ background: color, opacity: 0.4 }} />
                <div className="font-display text-[14px] font-black leading-none" style={{ color }}>
                  {isGrowth ? "+" : ""}{z.delta} cm
                </div>
                <div className="text-[8px] uppercase tracking-widest text-slate-500">{zoneLabels[z.key] ?? z.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legenda resumo */}
      <div className="relative mt-4 space-y-1.5">
        {colorZones.map((z) => {
          const isGrowth = z.delta > 0;
          const color    = isGrowth ? "#fb923c" : "#22d3ee";
          const pct      = Math.min(100, Math.abs(z.delta) * 20);
          return (
            <div key={z.key} className="flex items-center gap-2">
              <div className="w-16 shrink-0 text-[9px] uppercase tracking-widest text-slate-500">{zoneLabels[z.key] ?? z.label}</div>
              <div className="flex-1 h-1 overflow-hidden rounded-full bg-white/8">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className="w-12 text-right text-[9px] font-bold" style={{ color }}>
                {isGrowth ? "+" : ""}{z.delta} cm
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MusclesView({ female, copy }: { female: boolean; copy: CopyType }) {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>("Peito");
  
  const recommendedExercises = exercises
    .filter((e) => e.muscle === selectedMuscle)
    .slice(0, 4);

  const getMuscleStats = (m: MuscleGroup) => {
    const s = copy.setsWeekSuffix;
    switch (m) {
      case "Peito":     return { recovery: 85, status: copy.muscleStatusReady,          activeFibers: "94%",  volume: `18 ${s}` };
      case "Costas":    return { recovery: 62, status: copy.muscleStatusRecovering,     activeFibers: "88%",  volume: `20 ${s}` };
      case "Ombros":    return { recovery: 95, status: copy.muscleStatusExcellent,      activeFibers: "96%",  volume: `12 ${s}` };
      case "Bíceps":    return { recovery: 40, status: copy.muscleStatusModerateFatigue,activeFibers: "75%",  volume: `8 ${s}`  };
      case "Tríceps":   return { recovery: 78, status: copy.muscleStatusRecovered,      activeFibers: "90%",  volume: `9 ${s}`  };
      case "Pernas":    return { recovery: 30, status: copy.muscleStatusHighFatigue,    activeFibers: "65%",  volume: `22 ${s}` };
      case "Glúteos":   return { recovery: 88, status: copy.muscleStatusReady,          activeFibers: "92%",  volume: `14 ${s}` };
      case "Core":      return { recovery: 90, status: copy.muscleStatusExcellent,      activeFibers: "95%",  volume: `10 ${s}` };
      case "Antebraço": return { recovery: 70, status: copy.muscleStatusRecovered,      activeFibers: "85%",  volume: `6 ${s}`  };
      default:          return { recovery: 100, status: copy.muscleStatusFullyReady,    activeFibers: "100%", volume: "N/A" };
    }
  };

  const stats = getMuscleStats(selectedMuscle);

  const getRecoveryColor = (pct: number) => {
    if (pct >= 80) return "bg-[#22d3ee] text-[#22d3ee]";
    if (pct >= 50) return "bg-[#fb923c] text-[#fb923c]";
    return "bg-[#ef4444] text-[#ef4444]";
  };
  
  const recoveryColorClass = getRecoveryColor(stats.recovery);

  return (
    <div className="relative p-4">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.02) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full blur-3xl" style={{ background: "rgba(251,146,60,0.05)" }} />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-black uppercase tracking-widest text-white">{copy.muscleMappingTitle}</div>
          <div className="text-[9px] text-slate-500">{copy.muscleTapHint}</div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
          {copy.muscleInteractiveBadge}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Side: Interactive Silhouette */}
        <div className="relative flex items-center justify-center rounded-2xl border border-white/5 bg-white/2 p-3">
          <div className="h-[280px] w-[180px] shrink-0">
            <MuscleSilhouette
              muscle={selectedMuscle}
              onSelect={setSelectedMuscle}
              variant="dark"
            />
          </div>
        </div>

        {/* Right Side: Selected Muscle Details & Exercises */}
        <div className="flex flex-col justify-between space-y-3">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{copy.muscleLabel}</span>
                <h4 className="font-display text-2xl font-black text-white leading-tight uppercase truncate" style={{ textShadow: "0 0 15px rgba(251,146,60,0.3)" }}>
                  {copy.muscleNames[selectedMuscle] ?? selectedMuscle}
                </h4>
              </div>
              <span className={cn("inline-block shrink-0 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10", 
                stats.recovery >= 80 ? "text-cyan border-cyan/20" : stats.recovery >= 50 ? "text-orange-400 border-orange-400/20" : "text-red-400 border-red-400/20"
              )}>
                {stats.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold uppercase tracking-wider text-slate-400">{copy.recoveryStatusLabel}</span>
                <span className="font-display font-black text-white">{stats.recovery}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500 ease-out", recoveryColorClass.split(" ")[0])} 
                  style={{ width: `${stats.recovery}%` }} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="rounded-xl border border-white/5 bg-white/2 p-2">
                <div className="font-display text-sm font-bold text-white">{stats.activeFibers}</div>
                <div className="text-[8px] uppercase tracking-widest text-slate-500">{copy.activeFibers}</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/2 p-2">
                <div className="font-display text-sm font-bold text-cyan">{stats.volume}</div>
                <div className="text-[8px] uppercase tracking-widest text-slate-500">{copy.weeklyVolume}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-white/8 bg-white/4 p-4 flex flex-col min-h-[160px]">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{copy.recommendedExercises}</h5>
            <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[140px]">
              {recommendedExercises.map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/2 px-3 py-2 text-xs hover:bg-white/5 transition-colors">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-semibold truncate text-white">{e.name}</div>
                    <div className="text-[9px] text-slate-500 uppercase truncate">{e.equipment} · {e.biomechanics}</div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                </div>
              ))}
              {recommendedExercises.length === 0 && (
                <div className="flex h-full items-center justify-center text-center text-[10px] text-slate-500 italic py-4">
                  {copy.noExercisesFor(selectedMuscle)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MEAL_DEFS = [
  { id: "m1", name: "Café da manhã", time: "08:00", fromH:  4, toH: 10, pct: 0.20 },
  { id: "m2", name: "Almoço",        time: "12:30", fromH: 10, toH: 15, pct: 0.35 },
  { id: "m3", name: "Lanche",        time: "16:00", fromH: 15, toH: 19, pct: 0.15 },
  { id: "m4", name: "Jantar",        time: "20:00", fromH: 19, toH: 28, pct: 0.30 },
];

function NutricaoTab({ copy }: { copy: (typeof COPY)[keyof typeof COPY] }) {
  const onb = loadOnboarding();
  const profile = buildAthleteProfile(onb);

  // — Metas calóricas via Mifflin-St Jeor + objetivo do onboarding —
  const kcalGoal = useMemo(() => {
    const w = onb.weight ?? 75;
    const h = onb.height ?? 175;
    const a = onb.age ?? 30;
    const male = onb.gender !== "female";
    const bmr = male ? 10*w + 6.25*h - 5*a + 5 : 10*w + 6.25*h - 5*a - 161;
    const mult = onb.consistency === "elite" ? 1.725 : onb.consistency === "regular" ? 1.55 : 1.375;
    const tdee = bmr * mult;
    if (onb.goal === "mass")        return Math.round(tdee + 400);
    if (onb.goal === "strength" || onb.goal === "hybrid") return Math.round(tdee + 200);
    if (onb.goal === "weight_loss") return Math.max(1200, Math.round(tdee - 400));
    if (onb.goal === "definition")  return Math.max(1200, Math.round(tdee - 300));
    return Math.round(tdee);
  }, []);

  const macroGoals = useMemo(() => {
    const w = onb.weight ?? 75;
    const isGain = ["mass","strength"].includes(onb.goal ?? "");
    const isLoss = ["weight_loss","definition"].includes(onb.goal ?? "");
    const protein = Math.round(w * (isGain ? 2.2 : isLoss ? 1.8 : 1.6));
    const fat     = Math.round((kcalGoal * 0.25) / 9);
    const carbs   = Math.max(0, Math.round((kcalGoal - protein * 4 - fat * 9) / 4));
    return { protein, fat, carbs };
  }, [kcalGoal]);

  type LiveMeal = { id: string; time: string; name: string; kcal: number; goal: number };

  const [liveMeals, setLiveMeals] = useState<LiveMeal[]>(() =>
    MEAL_DEFS.map(d => ({ id: d.id, name: d.name, time: d.time, goal: Math.round(kcalGoal * d.pct), kcal: 0 }))
  );
  const [liveEaten, setLiveEaten] = useState(0);
  const [liveMacros, setLiveMacros] = useState({ protein: 0, fat: 0, carbs: 0 });

  // Carrega scans de hoje do Firestore ao montar
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    loadFoodScansFromFirestore(uid).then((all) => {
      const todayStr = new Date().toDateString();
      const todayScans = all.filter(s => new Date(s.date).toDateString() === todayStr);
      setLiveMeals(MEAL_DEFS.map(d => ({
        id: d.id, name: d.name, time: d.time,
        goal: Math.round(kcalGoal * d.pct),
        kcal: Math.round(todayScans
          .filter(s => { const h = new Date(s.date).getHours(); return h >= d.fromH && h < d.toH; })
          .reduce((sum, s) => sum + s.kcal, 0)),
      })));
      setLiveEaten(Math.round(todayScans.reduce((sum, s) => sum + s.kcal, 0)));
      setLiveMacros({
        protein: Math.round(todayScans.reduce((sum, s) => sum + s.protein, 0)),
        fat:     Math.round(todayScans.reduce((sum, s) => sum + s.fat, 0)),
        carbs:   Math.round(todayScans.reduce((sum, s) => sum + s.carbs, 0)),
      });
      // Carrega última foto salva
      const latest = all.find(s => s.photoUrl);
      if (latest?.photoUrl) setLastFoodPhoto(latest.photoUrl);
    }).catch(() => {});
  }, [kcalGoal]);

  const [lastFoodPhoto, setLastFoodPhoto] = useState<string | null>(null);
  const [lastFoodData, setLastFoodData] = useState<{ kcal: number; protein: number; fat: number; carbs: number } | null>(null);
  const [scanTrigger, setScanTrigger] = useState(0);

  const remaining = Math.max(0, kcalGoal - liveEaten);
  const pct = Math.min(100, (liveEaten / Math.max(1, kcalGoal)) * 100);

  const nutritionEvaluation = evaluateNutritionState(profile, {
    kcal:    { eaten: liveEaten, goal: kcalGoal },
    macros: {
      protein: { eaten: liveMacros.protein, goal: macroGoals.protein },
      fat:     { eaten: liveMacros.fat,     goal: macroGoals.fat },
      carbs:   { eaten: liveMacros.carbs,   goal: macroGoals.carbs },
    },
    meals: liveMeals,
  }, foodScans, getStoredLocale());

  const handleFoodDetectedTop = (m: Record<string, number>) => {
    const detected = Math.round(m.kcal ?? 0);
    const protein = Math.round(m.protein ?? 0);
    const fat = Math.round(m.fat ?? 0);
    const carbs = Math.round(m.carbs ?? 0);
    setLastFoodData({ kcal: detected, protein, fat, carbs });
    if (detected > 0) {
      const h = new Date().getHours();
      const def = MEAL_DEFS.find(d => h >= d.fromH && h < d.toH) ?? MEAL_DEFS[0];
      setLiveMeals(prev => prev.map(item => item.id === def.id ? { ...item, kcal: item.kcal + detected } : item));
      setLiveEaten(prev => prev + detected);
      setLiveMacros(prev => ({ protein: prev.protein + protein, fat: prev.fat + fat, carbs: prev.carbs + carbs }));
    }
  };

  return (
    <div className="space-y-4">
      <ScanCTA
        kind="food"
        title={copy.foodScan}
        desc={copy.foodDesc}
        copy={copy}
        onScanComplete={(url) => setLastFoodPhoto(url)}
        onMeasurementsDetected={handleFoodDetectedTop}
        onScanSaved={() => setScanTrigger(t => t + 1)}
      />

      {/* Painel da última foto de comida */}
      {lastFoodPhoto && (
        <div className="overflow-hidden rounded-2xl border border-cyan/30 bg-surface">
          <div className="relative h-44 w-full overflow-hidden">
            <img src={lastFoodPhoto} alt="Scan alimentação" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-widest text-white/70">{copy.latestPhoto}</div>
            <button
              onClick={() => { setLastFoodPhoto(null); setLastFoodData(null); }}
              className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/60 text-white/70 backdrop-blur active:scale-90 transition-transform"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          {lastFoodData && (
            <div className="grid grid-cols-4 divide-x divide-border">
              {([
                { label: "kcal",      value: String(lastFoodData.kcal),           color: "var(--primary)" },
                { label: copy.protein, value: `${lastFoodData.protein}g`,          color: "var(--primary)" },
                { label: copy.carbs,   value: `${lastFoodData.carbs}g`,            color: "#a855f7" },
                { label: copy.fat,     value: `${lastFoodData.fat}g`,              color: "var(--cyan)" },
              ] as { label: string; value: string; color: string }[]).map(({ label, value, color }) => (
                <div key={label} className="flex flex-col items-center py-3">
                  <div className="font-display text-base font-bold" style={{ color }}>{value}</div>
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Card>
        <CardHeader title={copy.todaySummary} subtitle={copy.goalsMacros} />
        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-32 w-32 shrink-0">
            <RadialBarChart
              width={128} height={128}
              innerRadius="75%" outerRadius="100%"
              data={[{ name: "kcal", value: pct, fill: "var(--cyan)" }]}
              startAngle={90} endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background={{ fill: "var(--elevated)" }} dataKey="value" cornerRadius={20} />
            </RadialBarChart>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <Flame className="h-4 w-4 text-primary" />
              <div className="font-display text-xl font-bold leading-none">{remaining.toLocaleString()}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{copy.remaining}</div>
            </div>
          </div>
          <div className="flex-1 space-y-2.5">
            <MacroBar label={copy.protein} eaten={liveMacros.protein} goal={macroGoals.protein} color="var(--primary)" />
            <MacroBar label={copy.fat}     eaten={liveMacros.fat}     goal={macroGoals.fat}     color="var(--cyan)" />
            <MacroBar label={copy.carbs}   eaten={liveMacros.carbs}   goal={macroGoals.carbs}   color="var(--blue-accent)" />
          </div>
        </div>
      </Card>

      <div className="rounded-2xl border border-cyan/20 bg-surface p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cyan/10">
            <Sparkles className="h-3.5 w-3.5 text-cyan" />
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            <strong>{nutritionEvaluation.balanceLabel}.</strong> {nutritionEvaluation.primaryMessage}
          </p>
        </div>
        {nutritionEvaluation.insights[0] && (
          <div className="flex items-start gap-3 border-t border-cyan/10 pt-3">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cyan/10">
              <Droplets className="h-3.5 w-3.5 text-cyan" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold">{nutritionEvaluation.insights[0].title}</div>
              <div className="text-xs leading-relaxed text-muted-foreground">{nutritionEvaluation.insights[0].desc}</div>
            </div>
          </div>
        )}
      </div>

      <ScanHistory kind="food" copy={copy} refreshTrigger={scanTrigger} />
    </div>
  );
}


function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-border bg-surface p-4">{children}</div>;
}

function MacroBar({ label, eaten, goal, color }: { label: string; eaten: number; goal: number; color: string }) {
  const pct = Math.min(100, (eaten / goal) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="font-display font-bold">
          {eaten}
          <span className="text-muted-foreground">/{goal}g</span>
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <div className="font-display text-base font-bold">{title}</div>
      {subtitle ? <div className="text-xs text-muted-foreground">{subtitle}</div> : null}
    </div>
  );
}

function ScanCTA({
  kind,
  title,
  desc,
  copy,
  onScanComplete,
  onMeasurementsDetected,
  onAnalysis,
  onScanSaved,
  compact = false,
}: {
  kind: ScanKind;
  title: string;
  desc: string;
  copy: (typeof COPY)[keyof typeof COPY];
  onScanComplete?: (dataUrl: string) => void;
  onMeasurementsDetected?: (m: Record<string, number>) => void;
  onAnalysis?: (text: string) => void;
  onScanSaved?: () => void;
  compact?: boolean;
}) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const nativeCameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<ScanState>("idle");
  const [liveOpen, setLiveOpen] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState<0 | 1>(0);
  const [pending, setPending] = useState<PendingSource>(null);
  const onb = loadOnboarding();
  const [height, setHeight] = useState<string>(onb.height?.toString() ?? "178");
  const [weight, setWeight] = useState<string>(onb.weight?.toString() ?? "78");
  const [outfit, setOutfit] = useState<"justa" | "normal" | "larga">("normal");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [scanBooting, setScanBooting] = useState(false);
  const bootTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFemale = onb.gender !== "male";
  const [captureStep, setCaptureStep] = useState<"front" | "back">("front");
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<"user" | "environment">(kind === "food" ? "environment" : "user");

  // Carrega calibração salva do Firestore
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    loadMeasurementsFromFirestore(uid).then((data) => {
      if (data.calibHeight) setHeight(data.calibHeight);
      if (data.calibWeight) setWeight(data.calibWeight);
    }).catch(() => {});
  }, []);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const openLiveCamera = async (facingOverride?: "user" | "environment") => {
    // se navegador não suporta WebRTC, usa câmera nativa via input[capture]
    if (!navigator?.mediaDevices?.getUserMedia) {
      nativeCameraRef.current?.click();
      return;
    }

    setLiveError(null);
    setLiveOpen(true);

    const mode = facingOverride ?? facing;

    const attachStream = (stream: MediaStream) => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = stream;
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode } },
        audio: false,
      });
      attachStream(stream);
    } catch (firstError: any) {
      const name = firstError?.name ?? "";
      if (name === "NotAllowedError") {
        setLiveError(copy.permissionDenied);
        return;
      }
      if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        closeLive();
        nativeCameraRef.current?.click();
        return;
      }
      if (name === "NotReadableError") {
        setLiveError(copy.cameraInUse);
        return;
      }
      // fallback sem constraint
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        attachStream(stream);
      } catch {
        closeLive();
        nativeCameraRef.current?.click();
      }
    }
  };

  const flipCamera = async () => {
    const next = facing === "user" ? "environment" : "user";
    setFacing(next);
    await openLiveCamera(next);
  };

  const triggerInput = (src: PendingSource) => {
    if (src === "camera") openLiveCamera();
    else galleryRef.current?.click();
  };

  const handleClick = (src: "camera" | "gallery") => {
    setPending(src);
    setGuideStep(0);
    setGuideOpen(true);
  };

  const makeThumbnail = (src: string, size = 96): Promise<string> =>
    new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = size; c.height = size;
        const ctx = c.getContext("2d")!;
        const scale = size / Math.min(img.width, img.height);
        const w = img.width * scale, h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        resolve(c.toDataURL("image/jpeg", 0.6));
      };
      img.onerror = () => resolve("");
      img.src = src;
    });

  const finishWithDataUrl = async (dataUrl: string) => {
    setPreview(dataUrl);
    setState("scanning");
    setAiAnalysis(null);
    setAiError(null);

    const base64 = dataUrl.split(",")[1] ?? "";
    const onboarding = loadOnboarding();
    const userContext = buildUserContext(onboarding);
    const locale = getStoredLocale() as AILocale;

    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          imageBase64: base64,
          userContext,
          locale,
          kind,
          height: parseFloat(height) || undefined,
          weight: parseFloat(weight) || undefined,
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const result = (await res.json()) as { analysis: string; measurements: DetectedMeasurements | null };
      setAiAnalysis(result.analysis);
      if (result.analysis) onAnalysis?.(result.analysis);

      const uid = auth.currentUser?.uid;

      if (kind === "body") {
        // Sempre mostra a foto imediatamente, independente de medidas ou upload
        onScanComplete?.(dataUrl);

        if (result.measurements) {
          const m = result.measurements as Record<string, number>;
          const now = new Date().toISOString();
          const onb = loadOnboarding();
          const scanId = `bs_${Date.now()}`;
          const bodyScan: FirestoreBodyScan = {
            id: scanId,
            date: now,
            analysis: result.analysis ?? "",
            estimativas: {
              peitoCmEstimado:           m.peito       ?? 0,
              cinturaCmEstimada:         m.cintura      ?? 0,
              quadrilCmEstimado:         m.quadril      ?? 0,
              bracoCmEstimado:           m.braco        ?? 0,
              coxaCmEstimada:            m.coxa         ?? 0,
              panturrilhaCmEstimada:     m.panturrilha  ?? 0,
              percentualGorduraEstimado: m.bodyFat      ?? 0,
            },
            calibragem: { alturaCm: onb.height ?? 170, pesoKg: onb.weight ?? (m.weight ?? 70) },
            qualidade: { confiancaLeitura: 85 },
          };
          if (uid) {
            // Gera thumbnail pequeno (96px) para salvar inline no Firestore
            void makeThumbnail(dataUrl).then((thumb) => {
              const scanWithPhoto = { ...bodyScan, photoUrl: thumb || undefined };
              void saveBodyScanToFirestore(uid, scanWithPhoto).then(() => {
                onScanSaved?.();
              }).catch(() => {});
              // Medidas + upload real para Storage (async, não bloqueante)
              const fsData: BodyMeasurements = {
                lastAnalysis: result.analysis ?? "",
                bodyFat:    m.bodyFat    ?? undefined,
                muscleMass: m.muscleMass ?? undefined,
                weight:     m.weight     ?? undefined,
              };
              bodyMeasures.forEach((bm) => {
                if (typeof m[bm.key] === "number") (fsData as Record<string, unknown>)[bm.key] = m[bm.key];
              });
              void uploadBodyPhoto(uid, dataUrl).then((url) => {
                fsData.photoUrl = url;
                void saveMeasurementsToFirestore(uid, fsData).catch(() => {});
              }).catch(() => {
                void saveMeasurementsToFirestore(uid, fsData).catch(() => {});
              });
            });
          }
          onMeasurementsDetected?.(m);
        }
      }

      if (kind === "food") {
        // Sempre mostra a foto imediatamente
        onScanComplete?.(dataUrl);

        if (result.measurements) {
          const m = result.measurements as Record<string, number>;
          const now = new Date().toISOString();
          const scanId = `fs_${Date.now()}`;
          if (uid) {
            // Thumbnail inline — não depende de Storage
            void makeThumbnail(dataUrl).then((thumb) => {
              void saveFoodScanToFirestore(uid, {
                id: scanId,
                date: now,
                kcal: Math.round(m.kcal ?? 0),
                protein: Math.round(m.protein ?? 0),
                carbs: Math.round(m.carbs ?? 0),
                fat: Math.round(m.fat ?? 0),
                analysis: result.analysis ?? "",
                photoUrl: thumb || undefined,
              }).then(() => {
                onScanSaved?.();
              }).catch(() => {});
            });
          }
          onMeasurementsDetected?.(m);
        }
      }
    } catch {
      setAiError(copy.aiUnavailable);
      // Mesmo com erro na API, mostra a foto
      onScanComplete?.(dataUrl);
    }

    setState("done");
  };

  const mergePhotos = (frontDataUrl: string, backDataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const imgFront = new window.Image();
      const imgBack = new window.Image();
      let loaded = 0;
      const onLoad = () => {
        loaded++;
        if (loaded < 2) return;
        const c = document.createElement("canvas");
        c.width = imgFront.width + imgBack.width;
        c.height = Math.max(imgFront.height, imgBack.height);
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(imgFront, 0, 0);
        ctx.drawImage(imgBack, imgFront.width, 0);
        resolve(c.toDataURL("image/jpeg", 0.85));
      };
      imgFront.onload = onLoad;
      imgBack.onload = onLoad;
      imgFront.src = frontDataUrl;
      imgBack.src = backDataUrl;
    });
  };

  const captureFromVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 1280;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    // Body scan: captura em dois passos (frente + costas)
    if (kind === "body" && captureStep === "front") {
      setFrontPhoto(dataUrl);
      setCaptureStep("back");
      return;
    }

    if (kind === "body" && captureStep === "back" && frontPhoto) {
      const savedFront = frontPhoto;
      closeLive();
      const merged = await mergePhotos(savedFront, dataUrl);
      finishWithDataUrl(merged);
      return;
    }

    // Food scan ou fallback: captura única
    closeLive();
    finishWithDataUrl(dataUrl);
  };

  const closeLive = () => {
    stopStream();
    setLiveOpen(false);
    setCaptureStep("front");
    setFrontPhoto(null);
  };

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    setScanBooting(false);
    if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => finishWithDataUrl(reader.result as string);
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const reset = () => {
    setPreview(null);
    setState("idle");
    setAiAnalysis(null);
    setAiError(null);
    setCaptureStep("front");
    setFrontPhoto(null);
  };

  const isBody = kind === "body";
  const accentColor = isBody ? "#fb923c" : "var(--cyan)";
  const accentBorder = isBody ? "border-orange-500/30" : "border-cyan/30";
  const accentBg = isBody ? "bg-orange-500/10" : "bg-cyan/10";
  const accentText = isBody ? "text-orange-400" : "text-cyan";

  const ctaButtons = (
    <>
      <button
        onClick={() => handleClick("camera")}
        className="flex items-center justify-center gap-2 rounded-xl px-3 py-3.5 text-sm font-black uppercase tracking-widest text-white active:scale-[0.97] transition-transform"
        style={{ background: isBody ? "linear-gradient(135deg,#c2410c,#fb923c)" : "linear-gradient(135deg,#0369a1,#22d3ee)", boxShadow: isBody ? "0 0 16px rgba(251,146,60,0.3)" : "0 0 16px rgba(34,211,238,0.3)" }}
      >
        <Camera className="h-4 w-4" />
        {copy.startScan}
      </button>
      <button
        onClick={() => handleClick("gallery")}
        className="flex items-center justify-center gap-2 rounded-xl border px-3 py-3.5 text-sm font-semibold active:scale-[0.97] transition-transform"
        style={{ borderColor: isBody ? "rgba(251,146,60,0.35)" : "rgba(34,211,238,0.35)", color: accentColor, background: "rgba(255,255,255,0.03)" }}
      >
        <ImageIcon className="h-4 w-4" /> {copy.gallery}
      </button>
    </>
  );

  const hiddenInputs = (
    <>
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <input ref={nativeCameraRef} type="file" accept="image/*" capture={kind === "food" ? "environment" : "user"} className="hidden" onChange={onFile} />
    </>
  );

  return (
    <>
      {compact ? (
        <div className="w-full">
          <div className="grid grid-cols-2 gap-3">
            {ctaButtons}
          </div>
          {hiddenInputs}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border bg-black p-5"
          style={{ borderColor: isBody ? "rgba(251,146,60,0.3)" : "rgba(34,211,238,0.3)" }}
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full blur-3xl" style={{ background: isBody ? "rgba(251,146,60,0.15)" : "rgba(34,211,238,0.12)" }} />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-3xl" style={{ background: isBody ? "rgba(234,88,12,0.10)" : "rgba(59,130,246,0.10)" }} />
          <div className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(${isBody ? "rgba(251,146,60,0.08)" : "rgba(34,211,238,0.08)"} 1px, transparent 1px), linear-gradient(90deg, ${isBody ? "rgba(251,146,60,0.08)" : "rgba(34,211,238,0.08)"} 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative flex items-center gap-3">
            <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl overflow-hidden"
              style={{ background: isBody ? "rgba(251,146,60,0.15)" : "rgba(34,211,238,0.12)", border: `1px solid ${isBody ? "rgba(251,146,60,0.35)" : "rgba(34,211,238,0.35)"}` }}
            >
              <div className="absolute inset-x-0 h-px animate-[scan_1.6s_ease-in-out_infinite]"
                style={{ background: isBody ? "linear-gradient(90deg,transparent,#fb923c,transparent)" : "linear-gradient(90deg,transparent,#22d3ee,transparent)" }}
              />
              <ScanLine className="h-6 w-6" style={{ color: accentColor }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-black uppercase tracking-widest" style={{ color: accentColor }}>{title}</span>
                <span className="rounded-full border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest"
                  style={{ color: accentColor, borderColor: isBody ? "rgba(251,146,60,0.4)" : "rgba(34,211,238,0.4)", background: isBody ? "rgba(251,146,60,0.08)" : "rgba(34,211,238,0.08)" }}
                >IA</span>
              </div>
              <div className="text-[11px] leading-relaxed text-slate-400">{desc}</div>
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-3 gap-2">
            {(isBody
              ? [[copy.silhouette, "3D"], [copy.composition, "IA"], [copy.precision, "±1.5cm"]]
              : [[copy.calories, "IA"], [copy.macrosLabel, "3D"], [copy.precision, "±5%"]]
            ).map(([label, val]) => (
              <div key={label} className="rounded-xl border px-2 py-1.5 text-center"
                style={{ borderColor: isBody ? "rgba(251,146,60,0.2)" : "rgba(34,211,238,0.2)", background: "rgba(255,255,255,0.03)" }}
              >
                <div className="font-display text-xs font-black" style={{ color: accentColor }}>{val}</div>
                <div className="text-[8px] uppercase tracking-widest text-slate-500">{label}</div>
              </div>
            ))}
          </div>
          <div className="relative mt-3 grid grid-cols-2 gap-2">
            {ctaButtons}
          </div>
          {hiddenInputs}
        </div>
      )}

      {/* Boot screen — aparece ao clicar Câmera */}
      {scanBooting ? (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black">
          <div className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full blur-3xl" style={{ background: "rgba(34,211,238,0.08)" }} />

          <div className="relative flex flex-col items-center gap-6 px-8">
            {/* Scanner visual */}
            <div className="relative flex h-48 w-48 items-center justify-center">
              <div className="absolute h-48 w-48 rounded-full border border-dashed border-cyan/20" style={{ animation: "bracketPulse 2.5s ease-in-out infinite" }} />
              <div className="absolute h-36 w-36 rounded-full border border-cyan/25" style={{ animation: "bracketPulse 2s ease-in-out infinite" }} />
              <div className="absolute h-20 w-20 rounded-full border border-cyan/35" style={{ animation: "bracketPulse 1.5s ease-in-out infinite" }} />
              <div className="relative grid h-12 w-12 place-items-center rounded-full border border-cyan/60"
                style={{ background: "rgba(34,211,238,0.1)", boxShadow: "0 0 24px rgba(34,211,238,0.3)" }}
              >
                {kind === "body"
                  ? <ScanLine className="h-6 w-6 text-cyan" />
                  : <Sparkles className="h-5 w-5 text-cyan" />
                }
              </div>
              {/* Cross-hairs */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-full w-px bg-gradient-to-b from-transparent via-cyan/30 to-transparent" />
              </div>
            </div>

            {/* Título */}
            <div className="text-center">
              <div className="font-display text-xl font-black uppercase tracking-[0.25em]"
                style={{ background: "linear-gradient(90deg,#22d3ee,#ffffff,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                3D Body Scanner
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan/60">
                {copy.initializingScanner}
              </div>
            </div>

            {/* System check list */}
            <div className="w-full max-w-xs space-y-2">
              {[
                { label: "Camera Ready", delay: "0s" },
                { label: "AI Engine Active", delay: "0.3s" },
                { label: "Body Detection ON", delay: "0.6s" },
                { label: "Calibrating...", delay: "0.9s" },
              ].map(({ label, delay }) => (
                <div key={label} className="flex items-center gap-3 opacity-0"
                  style={{ animation: `fadeIn 0.4s ease-out ${delay} forwards` }}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-cyan/80">{label}</span>
                  <div className="ml-auto h-px flex-1 bg-cyan/20" />
                  <span className="text-[9px] text-cyan/50">OK</span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="h-0.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#0891b2,#22d3ee)", animation: "shimmer 1.2s linear infinite", backgroundSize: "200% 100%", width: "100%" }}
              />
            </div>

            <button onClick={() => setScanBooting(false)} className="text-[10px] text-slate-600 underline">
              {copy.cancel}
            </button>
          </div>
        </div>
      ) : null}

      {liveOpen ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black">
          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-cyan/20 bg-black/90 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
              <span className="font-display text-sm font-bold text-cyan tracking-widest uppercase">
                {kind === "body" ? (captureStep === "front" ? copy.stepFront : copy.stepBack) : "3D Body Scanner · Live"}
              </span>
              {kind === "body" && (
                <div className="flex items-center gap-1 ml-1">
                  <div className={cn("h-1.5 w-5 rounded-full transition-colors", "bg-cyan")} />
                  <div className={cn("h-1.5 w-5 rounded-full transition-colors", captureStep === "back" ? "bg-cyan" : "bg-white/20")} />
                </div>
              )}
            </div>
            <button onClick={closeLive} className="grid h-10 w-10 place-items-center rounded-full border-2 border-white/30 bg-black/70 text-white active:scale-90 transition-transform">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden bg-black">
            {liveError ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full border border-cyan/30 bg-cyan/10">
                  <Camera className="h-7 w-7 text-cyan" />
                </div>
                <p className="text-sm text-slate-400">{liveError}</p>
                <button
                  onClick={() => { closeLive(); galleryRef.current?.click(); }}
                  className="rounded-xl px-6 py-3 text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#0891b2,#22d3ee)" }}
                >
                  {copy.useGallery}
                </button>
              </div>
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

                {/* Grid overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage: "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Sweep scan line */}
                <div
                  className="pointer-events-none absolute inset-x-0 h-0.5"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.9) 30%, #22d3ee 50%, rgba(34,211,238,0.9) 70%, transparent 100%)",
                    boxShadow: "0 0 12px 4px rgba(34,211,238,0.5)",
                    animation: "scan3d 2.4s ease-in-out infinite",
                  }}
                />

                {kind === "body" ? (
                  <>
                    {/* Body silhouette guide */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div
                        className="relative h-[78%] w-[52%]"
                        style={{ animation: "bracketPulse 2s ease-in-out infinite" }}
                      >
                        {/* Corner brackets */}
                        {[
                          "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
                          "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
                          "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
                          "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
                        ].map((cls, i) => (
                          <div key={i} className={`absolute h-8 w-8 border-cyan ${cls}`} />
                        ))}
                        {/* Center silhouette */}
                        <div className="absolute inset-x-[20%] inset-y-[4%] rounded-[50%_50%_45%_45%] border border-cyan/25" />
                        {/* Measurement tick marks */}
                        {[25, 50, 75].map((pct) => (
                          <div key={pct} className="absolute left-0 right-0 flex items-center gap-1" style={{ top: `${pct}%` }}>
                            <div className="h-px w-3 bg-cyan/50" />
                            <div className="flex-1 border-t border-dashed border-cyan/15" />
                            <div className="h-px w-3 bg-cyan/50" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Side labels */}
                    <div className="pointer-events-none absolute left-2 top-1/4 space-y-16 text-[9px] font-bold uppercase tracking-widest text-cyan/70">
                      <div>{copy.shoulders}</div>
                      <div>{copy.waist}</div>
                      <div>{copy.hip}</div>
                    </div>
                  </>
                ) : (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative h-48 w-48">
                      {["top-0 left-0 border-t-2 border-l-2","top-0 right-0 border-t-2 border-r-2","bottom-0 left-0 border-b-2 border-l-2","bottom-0 right-0 border-b-2 border-r-2"].map((cls,i) => (
                        <div key={i} className={`absolute h-6 w-6 border-cyan rounded-sm ${cls}`} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Status bar top */}
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 py-2">
                  <span className="rounded-full border border-cyan/30 bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-cyan">
                    REC ●
                  </span>
                  <span className="rounded-full border border-cyan/30 bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-cyan/70">
                    AI READY
                  </span>
                </div>

                {/* Capture button — frente e verso */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 py-8">
                  {/* Indicador da foto de frente já capturada */}
                  {kind === "body" && captureStep === "back" && frontPhoto && (
                    <div className="flex items-center gap-2 rounded-full border border-cyan/30 bg-black/70 px-3 py-1.5 backdrop-blur"
                      style={{ animation: "fadeIn 0.3s ease-out forwards" }}
                    >
                      <img src={frontPhoto} alt="front" className="h-8 w-6 rounded object-cover border border-cyan/40" />
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-cyan">{copy.frontCaptured}</span>
                    </div>
                  )}
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan/70">
                    {kind === "body"
                      ? (captureStep === "front" ? copy.frontCaptureGuide : copy.backCaptureGuide)
                      : copy.foodCapture}
                  </p>
                  {/* Row: sair — capturar — virar câmera */}
                  <div className="flex w-full items-center justify-between px-6">
                    {/* Sair */}
                    <button
                      onClick={closeLive}
                      className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-white/30 bg-black/60 backdrop-blur">
                        <X className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">{copy.cancel}</span>
                    </button>

                    {/* Capturar */}
                    <button
                      onClick={captureFromVideo}
                      className="grid place-items-center rounded-full active:scale-90 transition-transform"
                      style={{
                        height: 72, width: 72,
                        background: kind === "body" && captureStep === "back"
                          ? "linear-gradient(135deg,#c2410c,#fb923c)"
                          : "linear-gradient(135deg,#0891b2,#22d3ee)",
                        boxShadow: kind === "body" && captureStep === "back"
                          ? "0 0 0 4px rgba(251,146,60,0.2), 0 0 24px rgba(251,146,60,0.5)"
                          : "0 0 0 4px rgba(34,211,238,0.2), 0 0 24px rgba(34,211,238,0.5)",
                        animation: "scanGlow 2s ease-in-out infinite",
                      }}
                    >
                      <Camera className="h-7 w-7 text-white" />
                    </button>

                    {/* Virar câmera */}
                    <button
                      onClick={flipCamera}
                      className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-cyan/40 bg-black/60 backdrop-blur">
                        <FlipHorizontal2 className="h-5 w-5 text-cyan" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-cyan/60">
                        {facing === "user" ? "traseira" : "frontal"}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {guideOpen ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black">
          {/* Grid bg */}
          <div className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-cyan/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-cyan/20 bg-black/80 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
              <span className="font-display text-sm font-black uppercase tracking-widest text-cyan">
                {kind === "food" ? "Setup · Food Scan" : (guideStep === 0 ? "Setup · 3D Scan" : "Calibração · IA")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {kind === "body" && (
                <div className="flex items-center gap-1">
                  <div className={cn("h-1.5 w-8 rounded-full transition-colors", guideStep >= 0 ? "bg-cyan" : "bg-white/20")} />
                  <div className={cn("h-1.5 w-8 rounded-full transition-colors", guideStep >= 1 ? "bg-cyan" : "bg-white/20")} />
                </div>
              )}
              {kind === "food" && <div className="h-1.5 w-8 rounded-full bg-cyan" />}
              <button onClick={() => setGuideOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border-2 border-white/30 bg-black/70 text-white active:scale-90 transition-transform">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 overflow-y-auto px-4 py-5">
            {kind === "food" ? (
              <div className="flex flex-col gap-4">
                {/* Ícone central */}
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border border-cyan/20 bg-black/60"
                  style={{ boxShadow: "0 0 32px rgba(34,211,238,0.15)" }}
                >
                  <Sparkles className="h-9 w-9 text-cyan" />
                </div>

                {/* 4 cards de instrução */}
                <div className="grid grid-cols-2 gap-3">
                  {([Camera, Sun, Maximize2, Target] as const).map((Icon, i) => {
                    const item = copy.foodSetupItems[i];
                    return (
                      <div key={i} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-4">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                        <div>
                          <div className="text-[11px] font-bold text-white">{item?.title}</div>
                          <div className="mt-0.5 text-[10px] text-slate-500">{item?.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setGuideOpen(false);
                    if (pending === "camera") {
                      setScanBooting(true);
                      if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
                      bootTimerRef.current = setTimeout(() => setScanBooting(false), 12000);
                    }
                    triggerInput(pending);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white active:scale-[0.98] transition-transform"
                  style={{ background: "linear-gradient(135deg,#0369a1,#22d3ee)", boxShadow: "0 0 24px rgba(34,211,238,0.35)" }}
                >
                  {copy.startFoodScan} <Zap className="h-4 w-4" />
                </button>
              </div>
            ) : guideStep === 0 ? (
              <div className="space-y-4">
                {/* 3D body diagram */}
                <div className="relative mx-auto" style={{ width: 120 }}>
                  <BodySilhouette female={isFemale} width={120} height={260} />
                  {["top-0 left-0 border-t-2 border-l-2","top-0 right-0 border-t-2 border-r-2","bottom-0 left-0 border-b-2 border-l-2","bottom-0 right-0 border-b-2 border-r-2"].map((cls,i)=>(
                    <div key={i} className={`absolute h-5 w-5 border-cyan/60 rounded-sm ${cls}`} />
                  ))}
                  <div className="absolute right-0 top-3 text-[8px] font-bold uppercase tracking-widest text-cyan/50">{copy.shoulders}</div>
                  <div className="absolute right-0 top-[40%] text-[8px] font-bold uppercase tracking-widest text-cyan/50">{copy.waist}</div>
                  <div className="absolute right-0 bottom-4 text-[8px] font-bold uppercase tracking-widest text-cyan/50">{copy.hip}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {([Ruler, Sun, Maximize2, Smartphone] as const).map((Icon, i) => {
                    const item = copy.captureSetupItems[i];
                    return (
                    <div key={i} className="rounded-xl border border-cyan/20 bg-white/3 p-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-cyan" />
                        <span className="text-[11px] font-bold text-white">{item?.title}</span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-slate-500">{item?.desc}</p>
                    </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setGuideStep(1)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black uppercase tracking-widest text-white active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg,#0369a1,#22d3ee)", boxShadow: "0 0 20px rgba(34,211,238,0.25)" }}
                >
                  {copy.calibrateBtn} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-cyan/60">
                  {copy.calibrationDataDesc}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: copy.height, value: height, set: setHeight, unit: "cm", mode: "numeric" as const },
                    { label: copy.weight, value: weight, set: setWeight, unit: "kg", mode: "decimal" as const },
                  ].map(({ label, value, set, unit, mode }) => (
                    <div key={label} className="rounded-2xl border border-cyan/20 bg-white/3 p-4">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-cyan/70">{label}</div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <input
                          type="number"
                          inputMode={mode}
                          value={value}
                          onChange={(e) => set(e.target.value)}
                          className="w-full rounded-lg border border-cyan/20 bg-black/40 px-2 py-1.5 text-center font-display text-2xl font-black text-white focus:border-cyan focus:outline-none"
                        />
                        <span className="text-xs text-slate-500">{unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-cyan/20 bg-white/3 p-4">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-cyan/70">{copy.clothing}</div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["justa", "normal", "larga"] as const).map((option) => {
                      const label = option === "justa" ? copy.outfitTight : option === "normal" ? copy.outfitNormal : copy.outfitLoose;
                      return (
                      <button key={option} onClick={() => setOutfit(option)}
                        className={cn("rounded-xl border px-2 py-2 text-xs font-bold capitalize transition",
                          outfit === option ? "border-cyan bg-cyan/15 text-cyan" : "border-white/10 bg-white/3 text-slate-400")}
                      >{label}</button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-cyan/30 bg-cyan/8 p-3 text-[10px] text-cyan">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  {copy.calibratedMsg}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setGuideStep(0)}
                    className="rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-slate-400 active:scale-[0.98]"
                  >{copy.back}</button>
                  <button
                    onClick={() => {
                      setGuideOpen(false);
                      // Persiste calibração no Firestore
                      const uid = auth.currentUser?.uid;
                      if (uid) void saveMeasurementsToFirestore(uid, { calibHeight: height, calibWeight: weight }).catch(() => {});
                      if (pending === "camera") {
                        setScanBooting(true);
                        if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
                        bootTimerRef.current = setTimeout(() => setScanBooting(false), 12000);
                      }
                      triggerInput(pending);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black uppercase tracking-widest text-white active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg,#0369a1,#22d3ee)", boxShadow: "0 0 16px rgba(34,211,238,0.25)" }}
                  >
                    <Zap className="h-4 w-4" /> {copy.startScan3d}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {preview ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan/20 bg-black/90 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2">
              {state === "scanning" && <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />}
              {state === "done" && <span className="h-2 w-2 rounded-full bg-success" />}
              <span className="font-display text-sm font-bold tracking-widest uppercase" style={{ color: state === "done" ? "var(--success)" : "#22d3ee" }}>
                {state === "scanning" ? copy.scanning3DHeader : copy.analysisDoneHeader}
              </span>
            </div>
            <button onClick={reset} className="grid h-8 w-8 place-items-center rounded-full border border-cyan/30 bg-black/60 text-cyan">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <img src={preview} alt="scan" className="h-full w-full object-contain" />

            {state === "scanning" ? (
              <>
                {/* Dark overlay */}
                <div className="pointer-events-none absolute inset-0 bg-black/30" />
                {/* Grid */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage: "linear-gradient(rgba(34,211,238,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.07) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                {/* Sweep line */}
                <div
                  className="pointer-events-none absolute inset-x-0 h-0.5"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.8) 30%, #22d3ee 50%, rgba(34,211,238,0.8) 70%, transparent 100%)",
                    boxShadow: "0 0 16px 6px rgba(34,211,238,0.4)",
                    animation: "scan3d 2s ease-in-out infinite",
                  }}
                />
                {/* Status panel */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-5 py-6">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan" />
                    <span className="font-display text-sm font-bold uppercase tracking-widest text-cyan">
                      {copy.aiMappingLabel}
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "60%",
                        background: "linear-gradient(90deg, #0891b2, #22d3ee)",
                        animation: "shimmer 1.5s linear infinite",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-cyan/60">
                    <span>{copy.bodyCompositionScan}</span>
                    <span>{copy.measureEstimateScan}</span>
                    <span>{copy.fatPctScan}</span>
                  </div>
                </div>
              </>
            ) : null}

            {state === "done" ? (
              <div className="absolute inset-x-3 bottom-3 max-h-[62%] overflow-hidden rounded-2xl border border-cyan/20 bg-black/90 backdrop-blur flex flex-col">
                <div className="flex items-center gap-2 border-b border-cyan/15 px-4 py-3 shrink-0">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-success/20">
                    <Check className="h-3.5 w-3.5 text-success" />
                  </div>
                  <span className="font-display text-sm font-bold text-white tracking-wide">
                    {copy.scan3dDone}
                  </span>
                  <span className="ml-auto rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-cyan">
                    IA
                  </span>
                </div>
                {aiError ? (
                  <div className="p-4 text-xs text-red-400 leading-relaxed">{aiError}</div>
                ) : aiAnalysis ? (
                  <div className="overflow-y-auto flex-1 p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {aiAnalysis}
                  </div>
                ) : null}
                <div className="shrink-0 p-3 border-t border-cyan/15">
                  <button
                    onClick={reset}
                    className="w-full rounded-xl py-3 text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#0891b2,#22d3ee)" }}
                  >
                    {copy.saveClose}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function GuideRow({ icon: Icon, title, desc }: { icon: typeof Ruler; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs leading-relaxed text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function BodySilhouette({ female = true, width = 120, height = 260, className }: { female?: boolean; width?: number; height?: number; className?: string }) {
  const W = 120, H = 260, cx = 60;

  // Each level: [yFraction, rxFraction, ryPx, isKeyLevel]
  // Female: hourglass — hips wider than shoulders
  // Male: V-taper — shoulders wider than hips
  const torsoLevels: [number, number, number, boolean][] = female ? [
    [0.068, 0.118, 14,  false],   // head
    [0.196, 0.298,  7,  true ],   // shoulders
    [0.288, 0.318,  7,  false],   // chest/bust
    [0.402, 0.205,  6,  true ],   // waist (narrowest)
    [0.518, 0.348,  7,  true ],   // hips (widest)
  ] : [
    [0.068, 0.122, 14,  false],   // head
    [0.196, 0.355,  7,  true ],   // shoulders (widest for male)
    [0.288, 0.330,  7,  false],   // chest
    [0.402, 0.255,  6,  true ],   // waist
    [0.518, 0.278,  7,  true ],   // hips (narrower than shoulders)
  ];

  const legLevels: [number, number, number][] = [
    [0.640, 0.115, 7],  // thigh
    [0.762, 0.092, 6],  // knee
    [0.878, 0.072, 5],  // calf
  ];

  // Outline connection lines between torso levels
  const outlineLines: [number, number, number, number][] = [];
  for (let i = 0; i < torsoLevels.length - 1; i++) {
    const [y1f, rx1] = torsoLevels[i];
    const [y2f, rx2] = torsoLevels[i + 1];
    const y1 = y1f * H, y2 = y2f * H;
    outlineLines.push([cx - rx1 * W, y1, cx - rx2 * W, y2]);
    outlineLines.push([cx + rx1 * W, y1, cx + rx2 * W, y2]);
  }

  // Leg outline connections
  const legOffsets = female ? [0.130, 0.165] : [0.130, 0.165]; // offset from center for each leg
  const allLegLevels = [[torsoLevels[4][0], 0.145, 7], ...legLevels] as [number, number, number][];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" fill="none" className={className}>
      <defs>
        <linearGradient id="bStk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95"/>
          <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.75"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5"/>
        </linearGradient>
        <linearGradient id="bFl" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.06"/>
          <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.06"/>
        </linearGradient>
        <linearGradient id="bScn" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0"/>
          <stop offset="50%" stopColor="#22d3ee" stopOpacity="1"/>
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
        </linearGradient>
        <radialGradient id="bGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Vertical axis */}
      <line x1={cx} y1="0" x2={cx} y2={H} stroke="#22d3ee" strokeWidth="0.35" opacity="0.15"/>

      {/* Outline connection lines between levels */}
      {outlineLines.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#bStk)" strokeWidth="0.7" opacity="0.35"/>
      ))}

      {/* Leg outline lines */}
      {[0, 1].map((side) => {
        const sign = side === 0 ? -1 : 1;
        const legCenter = cx + sign * legOffsets[side] * W;
        return allLegLevels.map(([yFrac, rxFrac], j) => {
          if (j >= allLegLevels.length - 1) return null;
          const y1 = yFrac * H;
          const y2 = allLegLevels[j + 1][0] * H;
          const rx1 = (rxFrac as number) * W;
          const rx2 = (allLegLevels[j + 1][1] as number) * W;
          return (
            <g key={`leg-${side}-${j}`}>
              <line x1={legCenter - rx1} y1={y1} x2={legCenter - rx2} y2={y2} stroke="url(#bStk)" strokeWidth="0.7" opacity="0.32"/>
              <line x1={legCenter + rx1} y1={y1} x2={legCenter + rx2} y2={y2} stroke="url(#bStk)" strokeWidth="0.7" opacity="0.32"/>
            </g>
          );
        });
      })}

      {/* Torso cross-section ellipses */}
      {torsoLevels.map(([yFrac, rxFrac, ry, key], i) => {
        const cy = yFrac * H;
        const rx = rxFrac * W;
        const alpha = 1 - i * 0.06;
        return (
          <g key={i}>
            {key && (
              <ellipse cx={cx} cy={cy} rx={rx + 3} ry={ry + 2} fill="url(#bGlow)" stroke="none"/>
            )}
            <ellipse
              cx={cx} cy={cy} rx={rx} ry={ry}
              stroke="url(#bStk)" strokeWidth={key ? "1.4" : "1"}
              fill="url(#bFl)"
              opacity={alpha}
            />
          </g>
        );
      })}

      {/* Leg ellipses */}
      {legLevels.map(([yFrac, rxFrac, ry], j) => {
        const cy = yFrac * H;
        const rx = rxFrac * W;
        return [0, 1].map((side) => {
          const legCenter = cx + (side === 0 ? -1 : 1) * legOffsets[side] * W;
          return (
            <ellipse
              key={`${j}-${side}`}
              cx={legCenter} cy={cy} rx={rx} ry={ry}
              stroke="url(#bStk)" strokeWidth="1"
              fill="url(#bFl)"
              opacity={0.88 - j * 0.08}
            />
          );
        });
      })}

      {/* Hair cue (female only) */}
      {female && (
        <path d="M47 3 Q52 -2 57 1 Q60 -3 63 1 Q68 -2 73 3" stroke="#22d3ee" strokeWidth="1.2" fill="none" opacity="0.45"/>
      )}

      {/* Animated scan line */}
      <rect x="0" y="0" width={W} height="2.5" fill="url(#bScn)" style={{ animation: "scan3d 2.2s ease-in-out infinite" }}/>

      {/* Measurement tick markers */}
      {([[0.196, "Ombros"], [0.402, "Cintura"], [0.518, "Quadril"]] as [number, string][]).map(([yf, lbl]) => {
        const y = yf * H;
        return (
          <g key={lbl}>
            <line x1="0" y1={y} x2="10" y2={y} stroke="#22d3ee" strokeWidth="0.9" opacity="0.6"/>
            <line x1={W - 10} y1={y} x2={W} y2={y} stroke="#22d3ee" strokeWidth="0.9" opacity="0.6"/>
          </g>
        );
      })}
    </svg>
  );
}

function ScanHistory({ kind, copy, refreshTrigger = 0 }: { kind: ScanKind; copy: CopyType; refreshTrigger?: number }) {
  const locale = getStoredLocale();
  const [loading, setLoading] = useState(true);
  const [bodyScansFs, setBodyScansFs] = useState<FirestoreBodyScan[]>([]);
  const [foodScansFs, setFoodScansFs] = useState<FirestoreFoodScan[]>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) { setLoading(false); return; }
    if (kind === "body") {
      loadBodyScansFromFirestore(uid)
        .then((s) => { setBodyScansFs(s.slice(0, 4)); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      loadFoodScansFromFirestore(uid)
        .then((s) => { setFoodScansFs(s.slice(0, 4)); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [kind, refreshTrigger]);

  const title = kind === "body" ? copy.historyBody : copy.historyFood;
  const totalCount = kind === "body" ? bodyScansFs.length : foodScansFs.length;

  const series = kind === "body"
    ? [...bodyScansFs].reverse().map((scan) => ({
        date: formatScanDate(scan.date, locale),
        value: scan.estimativas.cinturaCmEstimada,
        value2: scan.estimativas.peitoCmEstimado,
      }))
    : [...foodScansFs].reverse().map((scan) => ({
        date: formatScanDate(scan.date, locale),
        value: scan.kcal,
        value2: scan.protein * 10,
      }));

  const min = Math.min(...series.map((item) => item.value));
  const max = Math.max(...series.map((item) => item.value));
  const range = Math.max(0.1, max - min);
  const min2 = Math.min(...series.map((item) => item.value2));
  const max2 = Math.max(...series.map((item) => item.value2));
  const range2 = Math.max(0.1, max2 - min2);

  const path = (values: number[], low: number, currentRange: number) =>
    values
      .map((value, index) => {
        const x = (index / Math.max(1, values.length - 1)) * 100;
        const y = 100 - ((value - low) / currentRange) * 90 - 5;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

  const labels = kind === "body"
    ? { a: copy.waistSeries, b: copy.chestSeries }
    : { a: copy.calsSeries, b: copy.proteinSeries };

  const emptyCard = (
    <div className="rounded-xl border border-border bg-elevated/30 p-4 text-center text-sm text-muted-foreground">
      {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : copy.firstScan}
    </div>
  );

  return (
    <Card>
      <CardHeader title={title} subtitle={loading ? "…" : copy.recordsFn(totalCount)} />

      {series.length > 1 && (
        <div className="mt-3 rounded-xl border border-border bg-elevated/40 p-3">
          <div className="mb-2 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-primary">
              <span className="h-1.5 w-3 rounded-full bg-primary" /> {labels.a}
            </span>
            <span className="flex items-center gap-1 text-cyan">
              <span className="h-1.5 w-3 rounded-full bg-cyan" /> {labels.b}
            </span>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-24 w-full">
            <path d={path(series.map((item) => item.value), min, range)} fill="none" stroke="var(--primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d={path(series.map((item) => item.value2), min2, range2)} fill="none" stroke="var(--cyan)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
            {series.map((item) => <span key={item.date}>{item.date}</span>)}
          </div>
        </div>
      )}

      <div className="mt-3 space-y-2">
        {kind === "body" && (bodyScansFs.length === 0
          ? emptyCard
          : bodyScansFs.map((scan, i) => (
            <div key={scan.id ?? i} className="overflow-hidden rounded-xl border border-cyan/20 bg-elevated/40">
              <div className="flex items-start gap-3 p-2">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-border" style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.15),rgba(59,130,246,0.1))" }}>
                  {scan.photoUrl
                    ? <img src={scan.photoUrl} alt="scan" className="h-full w-full object-cover object-top" />
                    : <ScanLine className="h-5 w-5 text-cyan/70" />
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-sm font-semibold">{copy.bodyScan}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{formatScanDate(scan.date, locale)}</div>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <Chip label={copy.chest}      value={`${scan.estimativas.peitoCmEstimado} cm`} />
                    <Chip label={copy.waist}      value={`${scan.estimativas.cinturaCmEstimada} cm`} />
                    <Chip label={copy.fatPctScan} value={`${scan.estimativas.percentualGorduraEstimado}%`} />
                    <Chip label={copy.confidence} value={`${scan.qualidade?.confiancaLeitura ?? 85}%`} />
                  </div>
                </div>
                <button
                  onClick={() => {
                    const uid = auth.currentUser?.uid;
                    if (!uid || !scan.id) return;
                    setBodyScansFs(prev => prev.filter((_, j) => j !== i));
                    void deleteBodyScanFromFirestore(uid, scan.id).catch(() => {});
                  }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-black/40 text-white/40 active:scale-90 transition-transform"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {scan.analysis ? (
                <div className="border-t border-cyan/10 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                  {scan.analysis}
                </div>
              ) : null}
            </div>
          ))
        )}
        {kind === "food" && (foodScansFs.length === 0
          ? emptyCard
          : foodScansFs.map((scan, i) => {
            const kcalColor = scan.kcal >= 600 ? "#fb923c" : scan.kcal >= 300 ? "#22d3ee" : "#10b981";
            return (
              <div key={scan.id ?? i} className="overflow-hidden rounded-xl border border-border bg-elevated/40" style={{ borderLeft: `3px solid ${kcalColor}` }}>
                <div className="flex items-start gap-3 p-2">
                  <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-border" style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.15),rgba(59,130,246,0.1))" }}>
                    {scan.photoUrl
                      ? <img src={scan.photoUrl} alt="scan" className="h-full w-full object-cover" />
                      : <ImageIcon className="h-5 w-5 text-primary/70" />
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-sm font-semibold">{copy.foodScan}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{formatScanDate(scan.date, locale)}</div>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <Chip label="kcal" value={`${scan.kcal}`} />
                      <Chip label="P" value={`${scan.protein}g`} />
                      <Chip label="C" value={`${scan.carbs}g`} />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const uid = auth.currentUser?.uid;
                      if (!uid || !scan.id) return;
                      setFoodScansFs(prev => prev.filter((_, j) => j !== i));
                      void deleteFoodScanFromFirestore(uid, scan.id).catch(() => {});
                    }}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-black/40 text-white/40 active:scale-90 transition-transform"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {scan.analysis ? (
                  <div className="border-t border-border/50 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                    {scan.analysis}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

function foodEmojiFor(refeicao: string): string {
  const lower = refeicao.toLowerCase();
  if (lower.includes("cafe") || lower.includes("café") || lower.includes("manha") || lower.includes("manhã") || lower.includes("breakfast")) return "☕";
  if (lower.includes("pre") || lower.includes("pré") || lower.includes("pre-treino")) return "⚡";
  if (lower.includes("pos") || lower.includes("pós") || lower.includes("pos-treino") || lower.includes("post")) return "🥤";
  if (lower.includes("lanche") || lower.includes("snack") || lower.includes("lanche")) return "🥜";
  if (lower.includes("jantar") || lower.includes("dinner") || lower.includes("cena") || lower.includes("noite")) return "🍖";
  if (lower.includes("almoco") || lower.includes("almoço") || lower.includes("lunch")) return "🥗";
  return "🍽️";
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold">
      <span className="text-muted-foreground">{label}</span> <span className="text-foreground">{value}</span>
    </span>
  );
}
