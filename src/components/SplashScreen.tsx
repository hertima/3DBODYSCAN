import { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { SplashComposition } from "@/remotion/compositions/SplashComposition";

type Props = {
  onFinish?: () => void;
};

export function SplashScreen({ onFinish }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 1400);
    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999]" style={{ background: "oklch(0.14 0.03 260)" }}>
      <Player
        component={SplashComposition}
        durationInFrames={150}
        compositionWidth={390}
        compositionHeight={844}
        fps={30}
        playbackRate={1}
        loop={false}
        controls={false}
        style={{ width: "100%", height: "100%" }}
        inputProps={{}}
        autoPlay
      />
    </div>
  );
}
