import { useEffect, useRef, useState } from "react";
import { Btn } from "../ui";

/**
 * Timer du livrable. Pausable — l'utilisateur s'entraîne, il peut être
 * interrompu — mais le temps écoulé réel reste enregistré et noté.
 */
export function useAtlasTimer(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const last = useRef<number>(0);

  useEffect(() => {
    if (!running || paused) return;
    last.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      setElapsed((e) => e + (now - last.current) / 1000);
      last.current = now;
    }, 1000);
    return () => clearInterval(id);
  }, [running, paused]);

  return { elapsed, paused, setPaused, reset: () => setElapsed(0) };
}

export function AtlasTimer({ elapsed, paused, onTogglePause, targetMinutes = 90 }: {
  elapsed: number; paused: boolean; onTogglePause: () => void; targetMinutes?: number;
}) {
  const m = Math.floor(elapsed / 60), s = Math.floor(elapsed % 60);
  const over = m >= targetMinutes;
  return (
    <div className="flex items-center gap-3">
      <div className={`font-mono text-lg font-bold tabular-nums ${over ? "text-gold" : "text-ink"}`}>
        {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </div>
      <div className="text-xs text-muted">/ {targetMinutes} min</div>
      <Btn kind="ghost" onClick={onTogglePause}>{paused ? "Reprendre ▶" : "Pause ⏸"}</Btn>
    </div>
  );
}
