import { useEffect, useRef, useState } from "react";
import { Btn } from "../ui";
import {
  startAttempt, pause as pauseT, resume as resumeT,
  activeSeconds, wallSeconds, finishAttempt, type AttemptTiming,
} from "../../lib/atlasTiming";

/**
 * Chronomètre d'une tentative. Le compteur VISIBLE se met en pause, mais le
 * temps horloge continue : c'est lui qui note la vitesse (cf. atlasTiming.ts).
 * Chaque appel à `restart()` ouvre une nouvelle tentative repartant de zéro.
 */
export function useAtlasTimer(running: boolean) {
  const timing = useRef<AttemptTiming>(startAttempt());
  const [, tick] = useState(0);
  const [paused, setPausedState] = useState(false);

  useEffect(() => {
    if (!running || paused) return;
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [running, paused]);

  const setPaused = (p: boolean) => {
    timing.current = p ? pauseT(timing.current) : resumeT(timing.current);
    setPausedState(p);
    tick((n) => n + 1);
  };

  return {
    /** Temps travaillé affiché à l'écran. */
    elapsed: activeSeconds(timing.current),
    /** Temps horloge, utilisé pour la note de vitesse. */
    wall: wallSeconds(timing.current),
    paused, setPaused,
    /** Fige les durées au moment de l'envoi. */
    finish: () => finishAttempt(timing.current),
    /** Nouvelle tentative : tout repart de zéro. */
    restart: () => { timing.current = startAttempt(); setPausedState(false); tick((n) => n + 1); },
  };
}

export function AtlasTimer({ elapsed, wall, paused, onTogglePause, targetMinutes = 90 }: {
  elapsed: number; wall: number; paused: boolean; onTogglePause: () => void; targetMinutes?: number;
}) {
  const m = Math.floor(elapsed / 60), s = Math.floor(elapsed % 60);
  const over = m >= targetMinutes;
  const drift = wall - elapsed; // temps passé en pause
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className={`font-mono text-lg font-bold tabular-nums ${over ? "text-gold" : "text-ink"}`}>
        {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </div>
      <div className="text-xs text-muted">/ {targetMinutes} min</div>
      <Btn kind="ghost" onClick={onTogglePause}>{paused ? "Reprendre ▶" : "Pause ⏸"}</Btn>
      {drift > 90 && (
        <span className="text-[11px] text-gold" title="La vitesse est notée sur le temps horloge">
          ⏸ {Math.round(drift / 60)} min de pause — la vitesse reste notée sur le temps réel
        </span>
      )}
    </div>
  );
}
