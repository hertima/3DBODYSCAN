import { useEffect } from "react";

export function ConfettiOverlay() {
  useEffect(() => {
    let cancelled = false;

    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;

      const end = Date.now() + 3000;

      const frame = () => {
        if (cancelled || Date.now() > end) return;
        confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, zIndex: 9999 });
        confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, zIndex: 9999 });
        requestAnimationFrame(frame);
      };

      frame();
    });

    return () => { cancelled = true; };
  }, []);

  return null;
}
