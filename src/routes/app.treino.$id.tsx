import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { WorkoutCompleteAnimation } from "@/components/WorkoutCompleteAnimation";
import { saveWorkoutToHistory } from "@/lib/workout-history";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Clock3,
  Flame,
  Play,
  Plus,
  RefreshCcw,
  Check,
  Sparkles,
  Target,
  TimerReset,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { ExerciseMedia } from "@/components/ExerciseMedia";
import { getExercise } from "@/data/library";
import { useExerciseCatalog } from "@/hooks/use-exercise-catalog";
import { useTrainingState } from "@/hooks/use-training-state";
import {
  isFunctionalExerciseRecord,
  type ExerciseCatalogRecord,
  type OfficialTrainingType,
} from "@/domain/exercises/catalog";
import {
  type WorkoutCustomizationState,
  validateWorkoutCustomization,
} from "@/domain/training/customization";
import { getGeneratedWorkout } from "@/domain/training/engine";
import { cleanLegacyText, normalizeText } from "@/lib/formatting";
import { getWorkoutTypeLabel, translateWorkoutName } from "@/lib/training-i18n";
import { getExerciseName, getExerciseBiomechanics, getMuscleGroupLabel } from "@/lib/exercise-i18n";
import { getStoredLocale } from "@/lib/locale";
import { getGamificationCopy } from "@/lib/app-copy";
import { VideoPreviewCard, WorkoutCompleteVideo } from "@/remotion";

const WCOPY = {
  pt: { shareWorkout: "Compartilhar treino", shareWorkoutTitle: "Compartilhe seu treino", shareWorkoutDesc: "Story pronto para Instagram e WhatsApp com seus stats reais", shareWorkoutFormat: "Formato 9:16 · 13 seg", notFound: "Treino não encontrado", notFoundDesc: "O treino solicitado não existe na biblioteca atual.", highlight: "Treino em destaque", workoutProtocol: "Protocolo de treino", weekLabel: "Semana", started: "Treino iniciado", startBtn: "Iniciar treino", duration: "Duração", exercises: "Exercícios", avgRest: "Descanso médio", totalVolume: "Volume total", blockRead: "Leitura do bloco", weekCycle: "do ciclo atual", strategicAdj: "Ajuste estratégico", proDir: "Direção profissional", quickSummary: "Resumo rápido", sessionMetrics: "Métricas da sessão", planned: "Planejado", sets: "Séries", reps: "Repetições", type: "Tipo", customTitle: "Customização do treino", customDesc: "Ajuste sem perder a coerência", customNote: "Troque, remova, adicione ou reordene exercícios mantendo o treino alinhado com categoria e ambiente.", addExercise: "Adicionar exercício", restoreWorkout: "Restaurar treino", validCustom: "Customização válida", reviewRec: "Revisão recomendada", blocksTitle: "Blocos do treino", blocksDesc: "Ordem pronta para executar sem sair da tela", exerciseLabel: "Exercício", viewExercise: "Ver exercício", swap: "Substituir", moveUp: "Subir", moveDown: "Descer", swapRemove: "Trocar / Remover", restLabel: "Descanso", bodyweight: "Peso corporal", volumeLabel: "Volume", weightTBD: "Peso a definir", progress: "Progresso:", setLabel: "Série", restTimer: "Descanso", skipRest: "Descanso pulado.", endWorkout: "Encerrar Treino", seriesUnit: "séries", setDone: "concluída!", workoutStarted: "Treino iniciado! Boa sorte 💪", restDone: "Descanse terminado! Próxima série.", setWeightTitle: "Definir carga", setWeightDesc: "Informe o peso que usará em todas as séries", weightPlaceholder: "Ex: 20", saveWeight: "Salvar", weightSet: "Carga definida:", estimatedVol: "Volume estimado:", perSet: "kg/série", swapTitle: "Trocar exercício", removeBtn: "Remover", noAlternatives: "Nenhuma substituição compatível encontrada para este ambiente e equipamento.", restored: "Treino restaurado para a versão original.", customized: "Treino personalizado com sucesso.", customFailed: "Não foi possível aplicar a customização.", noCompatible: "Nenhum exercício compatível encontrado para adicionar.", noSwap: "Nenhuma substituição compatível encontrada.", workoutDone: "Treino concluído!", viewHistory: "Ver histórico" },
  es: { shareWorkout: "Compartir entrenamiento", shareWorkoutTitle: "Comparte tu entrenamiento", shareWorkoutDesc: "Story listo para Instagram y WhatsApp con tus stats reales", shareWorkoutFormat: "Formato 9:16 · 13 seg", notFound: "Entrenamiento no encontrado", notFoundDesc: "El entrenamiento solicitado no existe en la biblioteca actual.", highlight: "Entrenamiento destacado", workoutProtocol: "Protocolo de entrenamiento", weekLabel: "Semana", started: "Entrenamiento iniciado", startBtn: "Iniciar entrenamiento", duration: "Duración", exercises: "Ejercicios", avgRest: "Descanso promedio", totalVolume: "Volumen total", blockRead: "Lectura del bloque", weekCycle: "del ciclo actual", strategicAdj: "Ajuste estratégico", proDir: "Dirección profesional", quickSummary: "Resumen rápido", sessionMetrics: "Métricas de sesión", planned: "Planificado", sets: "Series", reps: "Repeticiones", type: "Tipo", customTitle: "Personalización del entrenamiento", customDesc: "Ajusta sin perder coherencia", customNote: "Intercambia, elimina, agrega o reordena ejercicios manteniendo el entrenamiento alineado con categoría y entorno.", addExercise: "Agregar ejercicio", restoreWorkout: "Restaurar entrenamiento", validCustom: "Personalización válida", reviewRec: "Revisión recomendada", blocksTitle: "Bloques del entrenamiento", blocksDesc: "Orden listo para ejecutar sin salir de la pantalla", exerciseLabel: "Ejercicio", viewExercise: "Ver ejercicio", swap: "Sustituir", moveUp: "Subir", moveDown: "Bajar", swapRemove: "Cambiar / Eliminar", restLabel: "Descanso", bodyweight: "Peso corporal", volumeLabel: "Volumen", weightTBD: "Peso a definir", progress: "Progreso:", setLabel: "Serie", restTimer: "Descanso", skipRest: "Descanso omitido.", endWorkout: "Terminar entrenamiento", seriesUnit: "series", setDone: "completada!", workoutStarted: "¡Entrenamiento iniciado! Mucha suerte 💪", restDone: "¡Descanso terminado! Siguiente serie.", setWeightTitle: "Definir carga", setWeightDesc: "Indica el peso que usarás en todas las series", weightPlaceholder: "Ej: 20", saveWeight: "Guardar", weightSet: "Carga definida:", estimatedVol: "Volumen estimado:", perSet: "kg/serie", swapTitle: "Cambiar ejercicio", removeBtn: "Eliminar", noAlternatives: "No se encontró sustitución compatible para este entorno y equipamiento.", restored: "Entrenamiento restaurado a la versión original.", customized: "Entrenamiento personalizado con éxito.", customFailed: "No se pudo aplicar la personalización.", noCompatible: "No se encontró ejercicio compatible para agregar.", noSwap: "No se encontró sustitución compatible.", workoutDone: "¡Entrenamiento completado!", viewHistory: "Ver historial" },
  en: { shareWorkout: "Share workout", shareWorkoutTitle: "Share your workout", shareWorkoutDesc: "Story ready for Instagram and WhatsApp with your real stats", shareWorkoutFormat: "9:16 format · 13 sec", notFound: "Workout not found", notFoundDesc: "The requested workout does not exist in the current library.", highlight: "Featured workout", workoutProtocol: "Workout protocol", weekLabel: "Week", started: "Workout started", startBtn: "Start workout", duration: "Duration", exercises: "Exercises", avgRest: "Avg rest", totalVolume: "Total volume", blockRead: "Block overview", weekCycle: "of current cycle", strategicAdj: "Strategic adjustment", proDir: "Professional direction", quickSummary: "Quick summary", sessionMetrics: "Session metrics", planned: "Planned", sets: "Sets", reps: "Reps", type: "Type", customTitle: "Workout customization", customDesc: "Adjust without losing coherence", customNote: "Swap, remove, add or reorder exercises keeping the workout aligned with category and environment.", addExercise: "Add exercise", restoreWorkout: "Restore workout", validCustom: "Valid customization", reviewRec: "Review recommended", blocksTitle: "Workout blocks", blocksDesc: "Order ready to execute without leaving the screen", exerciseLabel: "Exercise", viewExercise: "View exercise", swap: "Swap", moveUp: "Move up", moveDown: "Move down", swapRemove: "Swap / Remove", restLabel: "Rest", bodyweight: "Bodyweight", volumeLabel: "Volume", weightTBD: "Weight TBD", progress: "Progress:", setLabel: "Set", restTimer: "Rest", skipRest: "Rest skipped.", endWorkout: "End Workout", seriesUnit: "sets", setDone: "done!", workoutStarted: "Workout started! Good luck 💪", restDone: "Rest done! Next set.", setWeightTitle: "Set load", setWeightDesc: "Enter the weight you will use for all sets", weightPlaceholder: "E.g. 20", saveWeight: "Save", weightSet: "Load set:", estimatedVol: "Estimated volume:", perSet: "kg/set", swapTitle: "Swap exercise", removeBtn: "Remove", noAlternatives: "No compatible substitution found for this environment and equipment.", restored: "Workout restored to original version.", customized: "Workout customized successfully.", customFailed: "Could not apply customization.", noCompatible: "No compatible exercise found to add.", noSwap: "No compatible substitution found.", workoutDone: "Workout complete!", viewHistory: "View history" },
  fr: { shareWorkout: "Partager l'entraînement", shareWorkoutTitle: "Partagez votre entraînement", shareWorkoutDesc: "Story prêt pour Instagram et WhatsApp avec vos vrais stats", shareWorkoutFormat: "Format 9:16 · 13 sec", notFound: "Entraînement introuvable", notFoundDesc: "L'entraînement demandé n'existe pas dans la bibliothèque actuelle.", highlight: "Entraînement en vedette", workoutProtocol: "Protocole d'entraînement", weekLabel: "Semaine", started: "Entraînement démarré", startBtn: "Démarrer l'entraînement", duration: "Durée", exercises: "Exercices", avgRest: "Repos moyen", totalVolume: "Volume total", blockRead: "Lecture du bloc", weekCycle: "du cycle actuel", strategicAdj: "Ajustement stratégique", proDir: "Direction professionnelle", quickSummary: "Résumé rapide", sessionMetrics: "Métriques de séance", planned: "Planifié", sets: "Séries", reps: "Répétitions", type: "Type", customTitle: "Personnalisation de l'entraînement", customDesc: "Ajustez sans perdre la cohérence", customNote: "Échangez, supprimez, ajoutez ou réordonnez des exercices en gardant l'entraînement aligné avec la catégorie et l'environnement.", addExercise: "Ajouter un exercice", restoreWorkout: "Restaurer l'entraînement", validCustom: "Personnalisation valide", reviewRec: "Révision recommandée", blocksTitle: "Blocs d'entraînement", blocksDesc: "Ordre prêt à exécuter sans quitter l'écran", exerciseLabel: "Exercice", viewExercise: "Voir l'exercice", swap: "Remplacer", moveUp: "Monter", moveDown: "Descendre", swapRemove: "Remplacer / Supprimer", restLabel: "Repos", bodyweight: "Poids du corps", volumeLabel: "Volume", weightTBD: "Poids à définir", progress: "Progrès :", setLabel: "Série", restTimer: "Repos", skipRest: "Repos ignoré.", endWorkout: "Terminer l'entraînement", seriesUnit: "séries", setDone: "terminée !", workoutStarted: "Entraînement démarré ! Bonne chance 💪", restDone: "Repos terminé ! Prochaine série.", setWeightTitle: "Définir la charge", setWeightDesc: "Indiquez le poids que vous utiliserez pour toutes les séries", weightPlaceholder: "Ex : 20", saveWeight: "Sauvegarder", weightSet: "Charge définie :", estimatedVol: "Volume estimé :", perSet: "kg/série", swapTitle: "Remplacer l'exercice", removeBtn: "Supprimer", noAlternatives: "Aucune substitution compatible trouvée pour cet environnement et équipement.", restored: "Entraînement restauré à la version originale.", customized: "Entraînement personnalisé avec succès.", customFailed: "Impossible d'appliquer la personnalisation.", noCompatible: "Aucun exercice compatible trouvé à ajouter.", noSwap: "Aucune substitution compatible trouvée.", workoutDone: "Entraînement terminé !", viewHistory: "Voir l'historique" },
  de: { shareWorkout: "Training teilen", shareWorkoutTitle: "Training teilen", shareWorkoutDesc: "Story für Instagram und WhatsApp mit deinen echten Stats bereit", shareWorkoutFormat: "Format 9:16 · 13 Sek", notFound: "Training nicht gefunden", notFoundDesc: "Das angeforderte Training existiert nicht in der aktuellen Bibliothek.", highlight: "Empfohlenes Training", workoutProtocol: "Trainingsprotokoll", weekLabel: "Woche", started: "Training gestartet", startBtn: "Training starten", duration: "Dauer", exercises: "Übungen", avgRest: "Ø Pause", totalVolume: "Gesamtvolumen", blockRead: "Block-Übersicht", weekCycle: "des aktuellen Zyklus", strategicAdj: "Strategische Anpassung", proDir: "Professionelle Richtung", quickSummary: "Kurzübersicht", sessionMetrics: "Einheitsmetriken", planned: "Geplant", sets: "Sätze", reps: "Wiederholungen", type: "Typ", customTitle: "Training anpassen", customDesc: "Anpassen ohne Kohärenz zu verlieren", customNote: "Tausche, entferne, füge hinzu oder ordne Übungen um, ohne die Ausrichtung nach Kategorie und Umgebung zu verlieren.", addExercise: "Übung hinzufügen", restoreWorkout: "Training wiederherstellen", validCustom: "Anpassung gültig", reviewRec: "Überprüfung empfohlen", blocksTitle: "Trainingsblöcke", blocksDesc: "Reihenfolge bereit ohne den Bildschirm zu verlassen", exerciseLabel: "Übung", viewExercise: "Übung anzeigen", swap: "Ersetzen", moveUp: "Nach oben", moveDown: "Nach unten", swapRemove: "Tauschen / Entfernen", restLabel: "Pause", bodyweight: "Körpergewicht", volumeLabel: "Volumen", weightTBD: "Gewicht festzulegen", progress: "Fortschritt:", setLabel: "Satz", restTimer: "Pause", skipRest: "Pause übersprungen.", endWorkout: "Training beenden", seriesUnit: "Sätze", setDone: "erledigt!", workoutStarted: "Training gestartet! Viel Erfolg 💪", restDone: "Pause vorbei! Nächster Satz.", setWeightTitle: "Last festlegen", setWeightDesc: "Gib das Gewicht ein, das du für alle Sätze verwenden wirst", weightPlaceholder: "z. B. 20", saveWeight: "Speichern", weightSet: "Last festgelegt:", estimatedVol: "Geschätztes Volumen:", perSet: "kg/Satz", swapTitle: "Übung tauschen", removeBtn: "Entfernen", noAlternatives: "Keine kompatible Ersatzübung für diese Umgebung und Ausrüstung gefunden.", restored: "Training auf Originalversion wiederhergestellt.", customized: "Training erfolgreich angepasst.", customFailed: "Anpassung konnte nicht angewendet werden.", noCompatible: "Keine kompatible Übung zum Hinzufügen gefunden.", noSwap: "Keine kompatible Ersatzübung gefunden.", workoutDone: "Training abgeschlossen!", viewHistory: "Verlauf ansehen" },
} as const;
import {
  clearWorkoutCustomization,
  getWorkoutCustomization,
  saveWorkoutCustomization,
} from "@/lib/workout-customizations";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/treino/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${getGeneratedWorkout(params.id)?.name ?? "Treino"} | 3D Body Scanner` }],
  }),
  component: WorkoutDetailPage,
});

function formatDisplayValue(value: string, kind: "text" | "type" = "text") {
  const cleaned = cleanLegacyText(value);
  return kind === "type" ? getWorkoutTypeLabel(cleaned) : cleaned;
}

function playBeep() {
  try {
    const ctx = new AudioContext();
    // dois beeps de conclusão
    [0, 0.18].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.5);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.5);
    });
  } catch {}
}

function playTick() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 440;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch {}
}

function playWarningBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch {}
}

function WorkoutDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const exerciseListRef = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [subCycleBySlot, setSubCycleBySlot] = useState<Record<number, number>>({});
  const [swapPicker, setSwapPicker] = useState<{ exerciseId: string; slotIndex: number } | null>(null);
  const [weightPicker, setWeightPicker] = useState<{ exerciseId: string; name: string; repsPerSet: number } | null>(null);
  const [weightInput, setWeightInput] = useState("");
  const [userWeights, setUserWeights] = useState<Record<string, number>>({});
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());
  const [restTimer, setRestTimer] = useState<{ remaining: number; total: number; exerciseName: string } | null>(null);
  const [revision, setRevision] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const historyIdRef = useRef<string>("");
  const trainingState = useTrainingState();
  const baseWorkout = getGeneratedWorkout(id, { applyCustomizations: false });
  const workout = trainingState.workouts.find((w) => w.id === id) ?? getGeneratedWorkout(id);
  const catalog = useExerciseCatalog();
  const catalogById = useMemo(
    () => new Map(catalog.map((record) => [record.id, record])),
    [catalog],
  );
  const storedCustomization = revision >= 0 ? getWorkoutCustomization(id) : null;

  const locale = getStoredLocale();
  const c = WCOPY[locale as keyof typeof WCOPY] ?? WCOPY.pt;
  const gamCopy = getGamificationCopy(locale);

  if (!workout || !baseWorkout) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-5">
        <h1 className="font-display text-xl font-bold">{c.notFound}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {c.notFoundDesc}
        </p>
      </div>
    );
  }

  const profile = trainingState.profile;
  const environment = trainingState.environment;
  const currentPeriodWeek =
    trainingState.periodization.weeks[trainingState.periodization.currentWeek - 1];
  const supportsProfileEquipment = (equipment: string) => {
    if (equipment === "peso_corporal") return true;
    if (profile.equipment.length === 0) {
      if (profile.location === "casa") return false;
      if (profile.location === "outdoor") {
        return ["barra_fixa", "paralelas", "parede", "trx"].includes(equipment);
      }
      return true;
    }

    const equipmentMap: Record<string, string[]> = {
      barra: ["barras", "barra", "anilhas", "rack"],
      halteres: ["halteres", "halter", "kettlebell"],
      cabos: ["cabos", "cabo"],
      maquina: ["maquinas", "maquina"],
      peso_corporal: ["peso corporal"],
      barra_fixa: ["barra fixa"],
      paralelas: ["paralelas", "argolas"],
      parede: ["parede"],
      banco: ["banco"],
      trx: ["trx"],
      bola: ["bola"],
      elastico: ["elasticos", "elastico"],
    };

    const accepted = equipmentMap[equipment] ?? [equipment];
    const normalizedEquipment = profile.equipment.map(normalizeText);
    return accepted.some((candidate) => normalizedEquipment.includes(normalizeText(candidate)));
  };

  const supportsTrainingType = (record: ExerciseCatalogRecord) => {
    if (profile.trainingType === "calistenia") return record.trainingType === "calistenia";
    if (profile.trainingType === "funcional") return isFunctionalExerciseRecord(record);
    return record.trainingType === "musculacao";
  };

  const supportsEnvironment = (equipment: string, trainingType: OfficialTrainingType) => {
    if (environment.location === "outdoor") {
      return (
        trainingType === "calistenia" &&
        ["peso_corporal", "barra_fixa", "paralelas", "parede", "trx"].includes(equipment)
      );
    }

    if (environment.location === "casa") {
      return equipment !== "maquina" && equipment !== "cabos";
    }

    return true;
  };

  const commitCustomization = (nextCustomization: WorkoutCustomizationState | null) => {
    if (!nextCustomization || nextCustomization.edits.length === 0) {
      clearWorkoutCustomization(id);
      toast.success(c.restored);
      setRevision((value) => value + 1);
      return;
    }

    const validation = validateWorkoutCustomization(baseWorkout, nextCustomization);
    if (!validation.valid) {
      toast.error(validation.issues[0] ?? c.customFailed);
      return;
    }

    saveWorkoutCustomization(nextCustomization);
    toast.success(c.customized);
    setRevision((value) => value + 1);
  };

  const appendEdit = (edit: WorkoutCustomizationState["edits"][number]) => {
    const nextCustomization: WorkoutCustomizationState = {
      workoutId: id,
      edits: [...(storedCustomization?.edits ?? []), edit],
      updatedAt: new Date().toISOString(),
    };
    commitCustomization(nextCustomization);
  };

  const getCompatibleAlternatives = (exerciseId: string) => {
    const currentRecord = catalogById.get(exerciseId);
    if (!currentRecord) return [];

    const usedIds = new Set(workout.exercises.map((item) => item.exerciseId));
    const strict = catalog.filter((record) => {
      if (record.id === exerciseId) return false;
      if (usedIds.has(record.id)) return false;
      if (record.category !== currentRecord.category) return false;
      if (!supportsTrainingType(record)) return false;
      if (!supportsProfileEquipment(record.equipment)) return false;
      if (!supportsEnvironment(record.equipment, record.trainingType)) return false;
      return true;
    });
    if (strict.length > 0) return strict;
    // fallback: same category ignoring environment filter
    return catalog.filter((record) => {
      if (record.id === exerciseId) return false;
      if (usedIds.has(record.id)) return false;
      if (!supportsTrainingType(record)) return false;
      return record.category === currentRecord.category;
    });
  };

  const getSuggestedAddRecord = () => {
    const currentCategories = new Set(
      workout.exercises.map((item) => catalogById.get(item.exerciseId)?.category).filter(Boolean),
    );
    const usedIds = new Set(workout.exercises.map((item) => item.exerciseId));

    return (
      catalog.find((record) => {
      if (usedIds.has(record.id)) return false;
      if (!supportsTrainingType(record)) return false;
      if (!currentCategories.has(record.category)) return false;
        if (!supportsProfileEquipment(record.equipment)) return false;
        if (!supportsEnvironment(record.equipment, record.trainingType)) return false;
        return record.status === "active";
      }) ?? null
    );
  };

  const previewValidation = storedCustomization
    ? validateWorkoutCustomization(baseWorkout, storedCustomization)
    : { valid: true, issues: [] };

  const totalSets = workout.exercises.reduce((acc, item) => acc + item.sets.length, 0);
  const totalReps = workout.exercises.reduce(
    (acc, item) => acc + item.sets.reduce((sum, set) => sum + set.reps, 0),
    0,
  );
  const totalLoad = workout.exercises.reduce(
    (acc, item) => acc + item.sets.reduce((sum, set) => sum + set.reps * set.weight, 0),
    0,
  );
  const averageRest = Math.round(
    workout.exercises.reduce((acc, item) => acc + item.rest, 0) / workout.exercises.length,
  );

  useEffect(() => {
    if (!showSummary) return;
    let raf = 0;
    import("canvas-confetti").then(({ default: confetti }) => {
      // burst inicial
      confetti({ particleCount: 120, spread: 180, origin: { y: 0.3 }, zIndex: 99999 });
      // chuva lateral por 3s
      const end = Date.now() + 3000;
      const fire = () => {
        if (Date.now() > end) return;
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, zIndex: 99999 });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, zIndex: 99999 });
        raf = requestAnimationFrame(fire);
      };
      fire();
    });
    return () => cancelAnimationFrame(raf);
  }, [showSummary]);

  useEffect(() => {
    if (!restTimer) return;
    if (restTimer.remaining <= 0) {
      playBeep();
      toast.success(c.restDone, { duration: 3000 });
      setRestTimer(null);
      return;
    }
    if (restTimer.remaining <= 3) {
      playWarningBeep();
    } else {
      playTick();
    }
    const id = setTimeout(() => setRestTimer((prev) => prev ? { ...prev, remaining: prev.remaining - 1 } : null), 1000);
    return () => clearTimeout(id);
  }, [restTimer]);

  const toggleSet = useCallback((exerciseId: string, setIndex: number, restSeconds: number, exerciseName: string) => {
    const key = `${exerciseId}-${setIndex}`;
    setCompletedSets((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        return next;
      }
      next.add(key);
      return next;
    });
    if (!completedSets.has(key)) {
      toast.success(`${c.setLabel} ${setIndex + 1} ${c.setDone}`, { duration: 2000 });
      if ("vibrate" in navigator) navigator.vibrate(40);
      if (restSeconds > 0) {
        setRestTimer({ remaining: restSeconds, total: restSeconds, exerciseName });
      }
    } else {
      setRestTimer(null);
    }
  }, [completedSets, c]);

  const handleStartWorkout = () => {
    setStarted(true);
    toast(c.workoutStarted, { duration: 2500 });
    exerciseListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const estimatedCalories = Math.round(workout.duration * 6.5);

  const handleEncerrar = () => {
    const historyId = `${workout.id}-${Date.now()}`;
    historyIdRef.current = historyId;
    saveWorkoutToHistory({
      id: historyId,
      workoutId: workout.id,
      name: workout.name,
      date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
      duration: workout.duration,
      calories: estimatedCalories,
      completedSets: completedSets.size,
      totalSets: workout.exercises.reduce((acc, item) => acc + item.sets.length, 0),
      exercises: workout.exercises.map((item) => {
        const ex = getExercise(item.exerciseId);
        return {
          id: item.exerciseId,
          name: ex?.name ?? item.exerciseId,
          muscle: ex?.muscle ?? "",
          sets: item.sets.map((set, si) => ({
            reps: set.reps,
            weight: set.weight,
            completed: completedSets.has(`${item.exerciseId}-${si}`),
          })),
        };
      }),
    });
    setShowSummary(true);
  };

  return (
    <>
      {showSummary && (
        <WorkoutCompleteAnimation
          exerciseCount={workout.exercises.length}
          durationMinutes={workout.duration}
          calories={estimatedCalories}
          workoutName={workout.name}
          onFinish={() => {
            setShowSummary(false);
            setShowShareModal(true);
          }}
        />
      )}
      {showShareModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/97 backdrop-blur-md px-5"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
        >
          <div className="flex w-full max-w-xs flex-col items-center gap-5 text-center">
            <div className="text-6xl">🏆</div>
            <div>
              <h2 className="font-display text-2xl font-bold text-gradient-brand">{c.workoutDone}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{completedSets.size}/{totalSets} {c.seriesUnit}</p>
            </div>
            <div style={{ width: 180 }}>
              <VideoPreviewCard
                composition={WorkoutCompleteVideo as never}
                inputProps={{
                  name: trainingState.profile.name ?? "Atleta",
                  workoutName: workout.name,
                  duration: workout.duration,
                  totalSets,
                  totalVolume: Math.round(totalLoad / 1000),
                  calories: estimatedCalories,
                  weekNumber: trainingState.periodization.currentWeek,
                  locale,
                  exercises: workout.exercises.map((item) => {
                    const ex = getExercise(item.exerciseId);
                    return {
                      name: getExerciseName(item.exerciseId, ex?.name ?? item.exerciseId, locale),
                      muscle: getMuscleGroupLabel((ex?.muscle ?? "") as Parameters<typeof getMuscleGroupLabel>[0], locale),
                      sets: item.sets.length,
                      completed: item.sets.filter((_, si) => completedSets.has(`${item.exerciseId}-${si}`)).length,
                      topWeight: Math.max(...item.sets.map((s) => s.weight ?? 0)),
                    };
                  }),
                }}
                durationInFrames={390}
                title={c.shareWorkout}
                shareLabel={c.shareWorkout}
                formatLabel={c.shareWorkoutFormat}
                previewFrame={45}
              />
            </div>
            <button
              onClick={() => {
                setShowShareModal(false);
                navigate({ to: "/app/historico/$id", params: { id: historyIdRef.current } });
              }}
              className="w-full rounded-full bg-gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow-primary"
            >
              {c.viewHistory}
            </button>
          </div>
        </motion.div>
      )}
    <div className="space-y-5 pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: "/app/treinos" })}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">
            {c.highlight}
          </p>
          <h1 className="font-display text-2xl font-bold text-gradient-brand">{translateWorkoutName(workout.name, locale)}</h1>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-surface p-4 shadow-elevated sm:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.74_0.17_53_/_0.18),transparent_34%),radial-gradient(circle_at_bottom_left,oklch(0.78_0.14_220_/_0.14),transparent_36%)]" />
        <div className="relative">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                <Flame className="h-3 w-3" />
                {c.workoutProtocol}
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold sm:mt-3 sm:text-3xl">
                {translateWorkoutName(workout.name, locale)}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:mt-2">
                {formatDisplayValue(workout.focus)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
                <span className="rounded-full bg-cyan/10 px-2 py-1 text-cyan">
                  {c.weekLabel} {trainingState.periodization.currentWeek}/12
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                  {gamCopy.phases[(currentPeriodWeek?.phase ?? "base") as keyof typeof gamCopy.phases]}
                </span>
                <span className="rounded-full bg-success/10 px-2 py-1 text-success">
                  {gamCopy.modalities[trainingState.periodization.modality as keyof typeof gamCopy.modalities]}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleStartWorkout}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary sm:px-6 sm:py-3"
              >
                <Play className="h-4 w-4" />
                {started ? c.started : c.startBtn}
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
            <InfoCard icon={Clock3} label={c.duration} value={`${workout.duration} min`} />
            <InfoCard icon={Target} label={c.exercises} value={`${workout.exercises.length}`} />
            <InfoCard icon={TimerReset} label={c.avgRest} value={`${averageRest}s`} />
            <InfoCard
              icon={Zap}
              label={c.totalVolume}
              value={`${Math.round(totalLoad / 1000)}k kg`}
            />
          </div>

          <div className="mt-4 flex items-center gap-4 rounded-2xl border p-4" style={{ borderColor: "rgba(34,211,238,0.2)", background: "rgba(34,211,238,0.04)" }}>
            <div style={{ width: 88, flexShrink: 0 }}>
              <VideoPreviewCard
                composition={WorkoutCompleteVideo as never}
                inputProps={{
                  name: trainingState.profile.name ?? "Atleta",
                  workoutName: workout.name,
                  duration: workout.duration,
                  totalSets,
                  totalVolume: Math.round(totalLoad / 1000),
                  calories: estimatedCalories,
                  weekNumber: trainingState.periodization.currentWeek,
                  locale,
                  exercises: workout.exercises.map((item) => {
                    const ex = getExercise(item.exerciseId);
                    return {
                      name: getExerciseName(item.exerciseId, ex?.name ?? item.exerciseId, locale),
                      muscle: getMuscleGroupLabel((ex?.muscle ?? "") as Parameters<typeof getMuscleGroupLabel>[0], locale),
                      sets: item.sets.length,
                      completed: item.sets.filter((_, si) => completedSets.has(`${item.exerciseId}-${si}`)).length,
                      topWeight: Math.max(...item.sets.map((s) => s.weight ?? 0)),
                    };
                  }),
                }}
                durationInFrames={390}
                title={c.shareWorkout}
                shareLabel={c.shareWorkout}
                formatLabel={c.shareWorkoutFormat}
                previewFrame={45}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-foreground">{c.shareWorkoutTitle}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{c.shareWorkoutDesc}</div>
              <div className="mt-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#22d3ee" }}>{c.shareWorkoutFormat}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan">
          {c.blockRead}
        </div>
        <h3 className="mt-1 font-display text-lg font-semibold">
          {c.weekLabel} {trainingState.periodization.currentWeek} {c.weekCycle}
        </h3>
        {trainingState.periodization.summary.shortTerm && (
          <p className="mt-2 text-sm text-muted-foreground">
            {trainingState.periodization.summary.shortTerm}
          </p>
        )}
        {currentPeriodWeek?.emphasis && (
          <p className="mt-2 text-sm text-muted-foreground">{currentPeriodWeek.emphasis}</p>
        )}
        {(trainingState.periodization.adjustments.recoveryBias || trainingState.periodization.adjustments.splitBias) && (
          <div className="mt-3 border-t border-border pt-3 space-y-2">
            {trainingState.periodization.adjustments.recoveryBias && (
              <p className="text-sm text-muted-foreground">
                {trainingState.periodization.adjustments.recoveryBias}
              </p>
            )}
            {trainingState.periodization.adjustments.splitBias && (
              <p className="text-sm text-muted-foreground">
                {trainingState.periodization.adjustments.splitBias}
              </p>
            )}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-border bg-surface p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan">
              {c.customTitle}
            </div>
            <h2 className="mt-1 font-display text-lg font-semibold">
              {c.customDesc}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {c.customNote}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const suggestedRecord = getSuggestedAddRecord();
                if (!suggestedRecord) {
                  toast.error(c.noCompatible);
                  return;
                }
                appendEdit({
                  type: "add_exercise",
                  workoutId: id,
                  exerciseId: suggestedRecord.id,
                  reason: "adicao_manual",
                });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-2 text-xs font-semibold text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              {c.addExercise}
            </button>

            <button
              type="button"
              onClick={() => commitCustomization(null)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-2 text-xs font-semibold text-muted-foreground"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              {c.restoreWorkout}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
              previewValidation.valid ? "bg-success/10 text-success" : "bg-primary/10 text-primary",
            )}
          >
            {previewValidation.valid ? c.validCustom : c.reviewRec}
          </span>
        </div>
      </section>

      <div ref={exerciseListRef} className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">{c.blocksTitle}</h2>
            <p className="text-xs text-muted-foreground">
              {c.blocksDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const exerciseNames = workout.exercises
                .slice(0, 4)
                .map((item) => getExercise(item.exerciseId)?.name)
                .filter(Boolean)
                .join(", ");
              const msg = `Vou fazer o ${workout.name} agora (${workout.exercises.length} exercícios, ${workout.duration} min). Exercícios principais: ${exerciseNames}. Quais dicas você me dá para maximizar os resultados hoje?`;
              window.dispatchEvent(new CustomEvent("open-ai-coach", { detail: { message: msg } }));
            }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan transition hover:bg-cyan/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Coach mode
          </button>
        </div>

        {workout.exercises.map((item, index) => {
          const exercise = getExercise(item.exerciseId);
          if (!exercise) return null;

          const userWeight = userWeights[item.exerciseId] ?? 0;
          const effectiveWeight = (set: { reps: number; weight: number }) =>
            userWeight > 0 ? userWeight : set.weight;
          const exerciseVolume = item.sets.reduce(
            (sum, set) => sum + set.reps * effectiveWeight(set),
            0,
          );
          const isBodyweightExercise = /peso.corporal|barra.fixa|paralelas|parede|trx/i.test(
            exercise.equipment ?? "",
          );

          return (
            <div
              key={item.exerciseId}
              className="overflow-hidden rounded-[2rem] border border-border bg-surface transition hover:border-primary/25"
            >
              <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
                <ExerciseMedia
                  exerciseId={exercise.id}
                  size="card"
                  className="rounded-none lg:h-full lg:aspect-auto"
                />
                <div className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan">
                        {c.exerciseLabel} {index + 1}
                      </div>
                      <h3 className="mt-1 text-xl font-semibold">{getExerciseName(exercise.id, exercise.name, locale)}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{getExerciseBiomechanics(exercise.biomechanics, locale)}</p>
                    </div>

                    <Link
                      to="/app/exercicio/$id"
                      params={{ id: exercise.id }}
                      className="inline-flex items-center justify-center rounded-full border border-border bg-elevated px-3 py-1.5 text-[11px] font-semibold text-foreground"
                    >
                      {c.viewExercise}
                    </Link>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const alternatives = getCompatibleAlternatives(exercise.id);
                        if (alternatives.length === 0) {
                          toast.error(c.noSwap);
                          return;
                        }
                        setSwapPicker({ exerciseId: exercise.id, slotIndex: index });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      {c.swap}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        appendEdit({
                          type: "reorder_exercise",
                          workoutId: id,
                          exerciseId: exercise.id,
                          newOrder: Math.max(index - 1, 0),
                        })
                      }
                      disabled={index === 0}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground disabled:opacity-40"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                      {c.moveUp}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        appendEdit({
                          type: "reorder_exercise",
                          workoutId: id,
                          exerciseId: exercise.id,
                          newOrder: Math.min(index + 1, workout.exercises.length - 1),
                        })
                      }
                      disabled={index === workout.exercises.length - 1}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground disabled:opacity-40"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                      {c.moveDown}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const alternatives = getCompatibleAlternatives(exercise.id);
                        if (alternatives.length > 0) {
                          setSwapPicker({ exerciseId: exercise.id, slotIndex: index });
                        } else {
                          appendEdit({
                            type: "remove_exercise",
                            workoutId: id,
                            exerciseId: exercise.id,
                            reason: "remocao_manual",
                          });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {c.swapRemove}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                      {getMuscleGroupLabel(exercise.muscle, locale)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setRestTimer({ remaining: item.rest, total: item.rest, exerciseName: getExerciseName(exercise.id, exercise.name, locale) })
                      }
                      className="inline-flex items-center gap-1 rounded-full bg-background/50 px-2.5 py-1 text-muted-foreground transition hover:bg-elevated hover:text-foreground"
                    >
                      <TimerReset className="h-3 w-3" />
                      {c.restLabel} {item.rest}s
                    </button>
                    {isBodyweightExercise ? (
                      <span className="rounded-full bg-cyan/10 px-2.5 py-1 text-cyan">
                        {c.bodyweight}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setWeightInput(userWeight > 0 ? String(userWeight) : "");
                          setWeightPicker({ exerciseId: item.exerciseId, name: getExerciseName(exercise.id, exercise.name, locale), repsPerSet: item.sets[0]?.reps ?? 10 });
                        }}
                        className="inline-flex items-center gap-1 rounded-full bg-cyan/10 px-2.5 py-1 text-cyan transition hover:bg-cyan/20"
                      >
                        {exerciseVolume > 0
                          ? `${c.volumeLabel} ${Math.round(exerciseVolume)} kg`
                          : c.weightTBD}
                      </button>
                    )}
                    {item.tag ? (
                      <span className="rounded-full bg-elevated px-2.5 py-1 text-foreground/80">
                        {item.tag}
                      </span>
                    ) : null}
                  </div>

                  {item.notes && (
                    <div className="mt-3 flex items-start gap-1.5 rounded-xl border border-cyan/20 bg-cyan/5 px-3 py-2 text-[11px] leading-relaxed text-cyan/90">
                      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-cyan" />
                      {item.notes}
                    </div>
                  )}

                  {started && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {c.progress}
                      </div>
                      <div className="flex gap-1">
                        {item.sets.map((_, si) => (
                          <div
                            key={si}
                            className={cn(
                              "h-2 w-2 rounded-full transition-colors",
                              completedSets.has(`${item.exerciseId}-${si}`) ? "bg-success" : "bg-elevated border border-border"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-success">
                        {item.sets.filter((_, si) => completedSets.has(`${item.exerciseId}-${si}`)).length}/{item.sets.length}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 grid gap-2">
                    {item.sets.map((set, setIndex) => {
                      const setKey = `${item.exerciseId}-${setIndex}`;
                      const isDone = completedSets.has(setKey);
                      return (
                      <div
                        key={setKey}
                        className={cn(
                          "grid items-center gap-3 rounded-2xl border px-3 py-2 text-sm transition-all",
                          started ? "grid-cols-[32px_72px_1fr_auto]" : "grid-cols-[72px_1fr_auto]",
                          isDone ? "border-success/30 bg-success/5" : "border-border bg-elevated/40"
                        )}
                      >
                        {started && (
                          <button
                            onClick={() => toggleSet(item.exerciseId, setIndex, item.rest, getExerciseName(exercise.id, exercise.name, locale))}
                            className={cn(
                              "grid h-7 w-7 place-items-center rounded-full border-2 transition-all",
                              isDone ? "border-success bg-success text-background" : "border-muted-foreground/40 bg-transparent text-transparent hover:border-success/60"
                            )}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <span className={cn(
                          "rounded-full px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-[0.16em]",
                          isDone ? "bg-success/10 text-success" : "bg-background/50 text-cyan"
                        )}>
                          {c.setLabel} {setIndex + 1}
                        </span>
                        <span className={cn("font-medium", isDone ? "text-muted-foreground line-through" : "text-foreground")}>
                          {set.reps} rep · {isBodyweightExercise
                            ? c.bodyweight
                            : userWeight > 0
                              ? `${userWeight} kg`
                              : set.weight > 0
                                ? `${set.weight} kg`
                                : "-- kg"}
                        </span>
                        {isDone && <Check className="h-4 w-4 text-success" />}
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest timer overlay */}
      <AnimatePresence>
        {restTimer && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2"
          >
            <div className="flex items-center gap-4 rounded-2xl border border-primary/30 bg-surface/95 px-5 py-3 shadow-glow-primary backdrop-blur-sm">
              <div className="text-center">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{c.restTimer}</div>
                <div className="font-display text-3xl font-black text-primary tabular-nums">{restTimer.remaining}s</div>
                <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">{restTimer.exerciseName}</div>
              </div>
              <div className="h-12 w-12 relative">
                <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="oklch(0.30 0.04 262)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="oklch(0.74 0.17 53)"
                    strokeWidth="3"
                    strokeDasharray={`${Math.min((restTimer.remaining / restTimer.total) * 100, 100)} 100`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setRestTimer(prev => prev ? { ...prev, remaining: prev.remaining + 15, total: Math.max(prev.total, prev.remaining + 15) } : null)}
                  className="grid h-7 w-12 place-items-center rounded-full border border-border bg-elevated text-xs font-bold text-muted-foreground transition hover:text-foreground"
                >
                  +15s
                </button>
                <button
                  onClick={() => setRestTimer(prev => prev ? { ...prev, remaining: Math.max(5, prev.remaining - 15) } : null)}
                  className="grid h-7 w-12 place-items-center rounded-full border border-border bg-elevated text-xs font-bold text-muted-foreground transition hover:text-foreground"
                >
                  −15s
                </button>
              </div>
              <button
                onClick={() => { setRestTimer(null); toast(c.skipRest); }}
                className="grid h-8 w-8 place-items-center rounded-full border border-border bg-elevated text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {started && (
        <div className="sticky bottom-4 z-10 flex justify-center px-4">
          <button
            onClick={handleEncerrar}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] text-primary-foreground shadow-glow-primary"
          >
            <Flame className="h-4 w-4" />
            {c.endWorkout} ({completedSets.size}/{workout.exercises.reduce((a, i) => a + i.sets.length, 0)} {c.seriesUnit})
          </button>
        </div>
      )}
    </div>

    {/* Weight Picker Drawer */}
    <AnimatePresence>
      {weightPicker && (
        <>
          <motion.div
            key="weight-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setWeightPicker(null)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            key="weight-drawer"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-border bg-background p-5"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan">{c.setWeightTitle}</div>
            <div className="mt-1 font-display text-base font-bold">{weightPicker.name}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {c.setWeightDesc}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="number"
                min="0"
                step="0.5"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const w = parseFloat(weightInput);
                    if (!isNaN(w) && w >= 0) {
                      setUserWeights((prev) => ({ ...prev, [weightPicker.exerciseId]: w }));
                      toast.success(`${c.weightSet} ${w} kg`);
                    }
                    setWeightPicker(null);
                  }
                }}
                placeholder={c.weightPlaceholder}
                autoFocus
                className="flex-1 rounded-2xl border border-border bg-elevated px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/40"
              />
              <span className="text-sm font-semibold text-muted-foreground">kg</span>
              <button
                onClick={() => {
                  const w = parseFloat(weightInput);
                  if (!isNaN(w) && w >= 0) {
                    setUserWeights((prev) => ({ ...prev, [weightPicker.exerciseId]: w }));
                    toast.success(`${c.weightSet} ${w} kg`);
                  }
                  setWeightPicker(null);
                }}
                className="rounded-2xl px-5 py-3 text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)" }}
              >
                {c.saveWeight}
              </button>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              {c.estimatedVol} {weightInput && !isNaN(parseFloat(weightInput))
                ? `${Math.round(parseFloat(weightInput) * weightPicker.repsPerSet)} ${c.perSet}`
                : "—"}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Swap Picker Drawer */}
    <AnimatePresence>
      {swapPicker && (() => {
        const alternatives = getCompatibleAlternatives(swapPicker.exerciseId);
        const currentEx = getExercise(swapPicker.exerciseId);
        return (
          <>
            <motion.div
              key="swap-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSwapPicker(null)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              key="swap-drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[78vh] flex-col rounded-t-3xl border-t border-border bg-background"
            >
              <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border" />
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan">{c.swapTitle}</div>
                  <div className="font-display text-base font-bold">{currentEx ? getExerciseName(currentEx.id, currentEx.name, locale) : c.exerciseLabel}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      appendEdit({
                        type: "remove_exercise",
                        workoutId: id,
                        exerciseId: swapPicker.exerciseId,
                        reason: "remocao_manual",
                      });
                      setSwapPicker(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-[10px] font-semibold text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    {c.removeBtn}
                  </button>
                  <button onClick={() => setSwapPicker(null)} className="rounded-full p-2 text-muted-foreground hover:bg-elevated">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mx-4 h-px bg-border" />
              <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
                {alternatives.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    {c.noAlternatives}
                  </div>
                ) : (
                  alternatives.map((alt) => {
                    const altEx = getExercise(alt.id);
                    if (!altEx) return null;
                    return (
                      <button
                        key={alt.id}
                        onClick={() => {
                          appendEdit({
                            type: "replace_exercise",
                            workoutId: id,
                            fromExerciseId: swapPicker.exerciseId,
                            toExerciseId: alt.id,
                            reason: "substituicao_manual",
                          });
                          setSwapPicker(null);
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-3 text-left transition hover:border-primary/40 hover:bg-elevated active:scale-[0.99]"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-elevated">
                          <ExerciseMedia exerciseId={alt.id} size="thumb" className="h-full w-full" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{getExerciseName(alt.id, altEx.name, locale)}</div>
                          <div className="truncate text-[11px] text-muted-foreground">{getExerciseBiomechanics(altEx.biomechanics, locale)} · {altEx.equipment}</div>
                        </div>
                        <RefreshCcw className="h-4 w-4 shrink-0 text-primary" />
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        );
      })()}
    </AnimatePresence>
    </>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/35 p-2.5 backdrop-blur sm:p-3">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground sm:text-base">{value}</div>
    </div>
  );
}
