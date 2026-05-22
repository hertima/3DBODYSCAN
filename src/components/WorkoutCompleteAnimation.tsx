import { useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { WorkoutSummaryComposition } from "@/remotion/compositions/WorkoutSummaryComposition";
import { getStoredLocale } from "@/lib/locale";

type Props = {
  exerciseCount: number;
  durationMinutes: number;
  calories: number;
  workoutName: string;
  onFinish?: () => void;
};

export function WorkoutCompleteAnimation({ exerciseCount, durationMinutes, calories, workoutName, onFinish }: Props) {
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const handler = () => onFinish?.();
    player.addEventListener("ended", handler);
    return () => player.removeEventListener("ended", handler);
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0.14 0.03 260 / 0.96)", backdropFilter: "blur(12px)" }}
    >
      <div style={{ width: 360, height: 560, borderRadius: 28, overflow: "hidden", boxShadow: "0 0 80px oklch(0.74 0.17 53 / 0.2)" }}>
        <Player
          ref={playerRef}
          component={WorkoutSummaryComposition}
          durationInFrames={180}
          compositionWidth={360}
          compositionHeight={560}
          fps={30}
          loop={false}
          controls={false}
          style={{ width: "100%", height: "100%" }}
          inputProps={{ exerciseCount, durationMinutes, calories, workoutName, locale: getStoredLocale() }}
          autoPlay
        />
      </div>
    </div>
  );
}
