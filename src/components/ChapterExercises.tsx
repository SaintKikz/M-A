import { useMemo, useState } from "react";
import type { Exercise } from "../data/academy/types";
import { Btn, Tag } from "./ui";

// ─── Vrai / Faux ────────────────────────────────────────────────────────────
function TF({ ex, onDone }: { ex: Extract<Exercise, { kind: "tf" }>; onDone: (pct: number) => void }) {
  const [answers, setAnswers] = useState<(boolean | null)[]>(ex.statements.map(() => null));
  const [checked, setChecked] = useState(false);
  const allAnswered = answers.every((a) => a !== null);
  const correct = ex.statements.filter((s, i) => answers[i] === s.answer).length;

  return (
    <div>
      <div className="font-semibold text-sm mb-3">{ex.title}</div>
      <div className="space-y-2">
        {ex.statements.map((s, i) => (
          <div key={i} className={`rounded-xl border p-3 ${checked ? (answers[i] === s.answer ? "border-green/50 bg-green/5" : "border-red/50 bg-red/5") : "border-border bg-surface2"}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm leading-snug">{s.text}</p>
              <div className="flex gap-1.5 shrink-0">
                {([true, false] as const).map((v) => (
                  <button key={String(v)} disabled={checked}
                    onClick={() => setAnswers(answers.map((a, j) => (j === i ? v : a)))}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${answers[i] === v ? "bg-accent text-white border-accent" : "bg-bg border-border text-muted hover:text-ink"}`}>
                    {v ? "Vrai" : "Faux"}
                  </button>
                ))}
              </div>
            </div>
            {checked && <p className="text-xs text-muted mt-2">{answers[i] === s.answer ? "✅" : "❌"} {s.explain}</p>}
          </div>
        ))}
      </div>
      {!checked ? (
        <Btn className="mt-3" disabled={!allAnswered} onClick={() => { setChecked(true); onDone(Math.round((correct / ex.statements.length) * 100)); }}>Vérifier</Btn>
      ) : (
        <Tag color={correct === ex.statements.length ? "green" : "gold"}>{correct}/{ex.statements.length} correct</Tag>
      )}
    </div>
  );
}

// ─── Classement (remettre dans l'ordre) ─────────────────────────────────────
function Order({ ex, onDone }: { ex: Extract<Exercise, { kind: "order" }>; onDone: (pct: number) => void }) {
  const shuffled = useMemo(() => {
    const arr = ex.items.map((it, i) => ({ it, i }));
    let seed = ex.prompt.length * 7 + arr.length;
    for (let k = arr.length - 1; k > 0; k--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (k + 1));
      [arr[k], arr[j]] = [arr[j], arr[k]];
    }
    // Évite le cas où le mélange redonne l'ordre correct
    if (arr.every((a, idx) => a.i === idx) && arr.length > 1) [arr[0], arr[1]] = [arr[1], arr[0]];
    return arr;
  }, [ex]);
  const [picked, setPicked] = useState<number[]>([]); // indices dans shuffled, dans l'ordre cliqué
  const [checked, setChecked] = useState(false);

  const correctCount = picked.filter((sIdx, pos) => shuffled[sIdx].i === pos).length;

  return (
    <div>
      <div className="font-semibold text-sm mb-1">{ex.title}</div>
      <p className="text-sm text-muted mb-3">{ex.prompt} <span className="text-xs">(clique dans l'ordre)</span></p>
      <div className="space-y-1.5 mb-3">
        {picked.map((sIdx, pos) => (
          <div key={sIdx} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm border ${checked ? (shuffled[sIdx].i === pos ? "border-green/50 bg-green/5" : "border-red/50 bg-red/5") : "border-accent/40 bg-accent/5"}`}>
            <span className="font-mono text-xs text-muted w-5">{pos + 1}.</span>
            <span className="flex-1">{shuffled[sIdx].it}</span>
            {!checked && <button className="text-muted hover:text-red text-xs" onClick={() => setPicked(picked.filter((p) => p !== sIdx))}>✕</button>}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {shuffled.map((s, sIdx) => picked.includes(sIdx) ? null : (
          <button key={sIdx} disabled={checked} onClick={() => setPicked([...picked, sIdx])}
            className="px-3 py-2 rounded-lg text-sm bg-surface2 border border-border hover:border-accent/60 transition-colors">
            {s.it}
          </button>
        ))}
      </div>
      {!checked ? (
        <Btn className="mt-3" disabled={picked.length !== ex.items.length} onClick={() => { setChecked(true); onDone(Math.round((correctCount / ex.items.length) * 100)); }}>Vérifier l'ordre</Btn>
      ) : (
        <div className="mt-3 fade-up">
          <Tag color={correctCount === ex.items.length ? "green" : "gold"}>{correctCount}/{ex.items.length} bien placés</Tag>
          <p className="text-xs text-muted mt-2">{ex.explain}</p>
          {correctCount < ex.items.length && (
            <p className="text-xs mt-1">Ordre correct : {ex.items.map((it, i) => `${i + 1}. ${it}`).join(" → ")}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Compléter la formule ───────────────────────────────────────────────────
function Gap({ ex, onDone }: { ex: Extract<Exercise, { kind: "gap" }>; onDone: (pct: number) => void }) {
  const [choices, setChoices] = useState<(number | null)[]>(ex.blanks.map(() => null));
  const [checked, setChecked] = useState(false);
  const parts = ex.template.split("◻");
  const correct = ex.blanks.filter((b, i) => choices[i] === b.correct).length;

  return (
    <div>
      <div className="font-semibold text-sm mb-1">{ex.title}</div>
      <p className="text-sm text-muted mb-3">{ex.prompt}</p>
      <div className="bg-surface2 rounded-xl p-4 font-mono text-sm leading-loose">
        {parts.map((p, i) => (
          <span key={i}>
            {p}
            {i < ex.blanks.length && (
              <select disabled={checked} value={choices[i] ?? ""}
                onChange={(e) => setChoices(choices.map((c, j) => (j === i ? Number(e.target.value) : c)))}
                className={`mx-1 px-2 py-1 rounded-lg border text-xs font-sans font-semibold outline-none ${checked ? (choices[i] === ex.blanks[i].correct ? "border-green bg-green/10 text-green" : "border-red bg-red/10 text-red") : "border-accent/50 bg-bg text-ink"}`}>
                <option value="" disabled>…</option>
                {ex.blanks[i].options.map((o, oi) => <option key={oi} value={oi}>{o}</option>)}
              </select>
            )}
          </span>
        ))}
      </div>
      {!checked ? (
        <Btn className="mt-3" disabled={choices.some((c) => c === null)} onClick={() => { setChecked(true); onDone(Math.round((correct / ex.blanks.length) * 100)); }}>Vérifier</Btn>
      ) : (
        <div className="mt-3 fade-up">
          <Tag color={correct === ex.blanks.length ? "green" : "gold"}>{correct}/{ex.blanks.length} correct</Tag>
          <p className="text-xs text-muted mt-2">{ex.explain}</p>
        </div>
      )}
    </div>
  );
}

export function ExercisePlayer({ ex, onDone }: { ex: Exercise; onDone: (pct: number) => void }) {
  if (ex.kind === "tf") return <TF ex={ex} onDone={onDone} />;
  if (ex.kind === "order") return <Order ex={ex} onDone={onDone} />;
  return <Gap ex={ex} onDone={onDone} />;
}
