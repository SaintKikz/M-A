import { useState } from "react";
import type { QuizItem } from "../lib/types";
import { gradeNumeric, gradeAnswer } from "../lib/grader";
import { useProgress, topicToSkill, type MistakeEntry } from "../store/progress";
import { Btn, Tag } from "./ui";

export type QuizSource = MistakeEntry["source"];

// Joue un item de quiz (mcq / numeric / open) en mode "tentative d'abord".
export function QuizCard({ item, onDone, source = "other" }: { item: QuizItem; onDone: (correct: boolean) => void; source?: QuizSource }) {
  const [state, setState] = useState<"try" | "hinted" | "done">("try");
  const [picked, setPicked] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState<boolean | null>(null);
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const recordSkill = useProgress((s) => s.recordSkill);
  const logMistake = useProgress((s) => s.logMistake);
  const clearMistake = useProgress((s) => s.clearMistake);

  const finish = (ok: boolean, userAnswer: string) => {
    setCorrect(ok);
    setState("done");
    recordAnswer(item.topic, item.tags, ok);
    recordSkill(topicToSkill(item.topic), ok);
    if (!ok) {
      const correctAnswer =
        item.kind === "mcq" ? item.choices[item.answer]
        : item.kind === "numeric" ? `${item.answer}${item.unit ? ` ${item.unit}` : ""}`
        : item.modelAnswer;
      logMistake({
        qid: item.id, source, topic: item.topic, prompt: item.prompt,
        userAnswer: userAnswer.slice(0, 300), correctAnswer,
        explanation: "explanation" in item ? item.explanation : undefined,
      });
    } else if (source !== "other") {
      // bonne réponse en re-test → la question sort du Mistake Book
      clearMistake(item.id);
    }
    onDone(ok);
  };

  return (
    <div className="fade-up">
      <div className="flex items-center gap-2 mb-3">
        {item.trap && <Tag color="red">⚠️ Question piège</Tag>}
        <Tag color="muted">{item.topic}</Tag>
      </div>
      <p className="text-lg font-semibold leading-snug mb-4">{item.prompt}</p>

      {item.kind === "mcq" && (
        <div className="grid gap-2">
          {item.choices.map((c, i) => {
            let cls = "border-border bg-surface2 hover:border-accent/60";
            if (state === "done") {
              if (i === item.answer) cls = "border-green bg-green/10";
              else if (i === picked) cls = "border-red bg-red/10";
              else cls = "border-border bg-surface2 opacity-60";
            }
            return (
              <button key={i} disabled={state === "done"}
                onClick={() => { setPicked(i); finish(i === item.answer, c); }}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${cls}`}>
                <span className="font-mono text-muted mr-2">{String.fromCharCode(65 + i)}</span>{c}
              </button>
            );
          })}
        </div>
      )}

      {item.kind === "numeric" && (
        <div className="flex gap-2 items-center flex-wrap">
          <input value={input} onChange={(e) => setInput(e.target.value)} disabled={state === "done"}
            onKeyDown={(e) => e.key === "Enter" && input && state !== "done" && finish(gradeNumeric(input, item.answer, item.tolerance), input)}
            placeholder="Ta réponse…" inputMode="decimal"
            className="bg-surface2 border border-border rounded-xl px-4 py-3 w-44 outline-none focus:border-accent text-lg font-mono" />
          {item.unit && <span className="text-muted">{item.unit}</span>}
          {state !== "done" && <Btn onClick={() => input && finish(gradeNumeric(input, item.answer, item.tolerance), input)}>Valider</Btn>}
        </div>
      )}

      {item.kind === "open" && state !== "done" && (
        <div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5}
            placeholder="Écris ta réponse comme tu la dirais en entretien…"
            className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 outline-none focus:border-accent text-sm leading-relaxed" />
          <div className="mt-2">
            <Btn onClick={() => { const g = gradeAnswer(input, item.keywords); finish(g.score >= 60, input); }} disabled={input.trim().length < 10}>Soumettre</Btn>
          </div>
        </div>
      )}

      {state === "done" && (
        <div className={`mt-4 rounded-xl border p-4 pop ${correct ? "border-green/50 bg-green/5" : "border-red/50 bg-red/5"}`}>
          <div className="font-bold mb-1">{correct ? "✅ Correct !" : "❌ Pas tout à fait."}</div>
          {item.kind === "numeric" && !correct && <div className="text-sm mb-1">Réponse attendue : <b className="font-mono">{item.answer}{item.unit ? ` ${item.unit}` : ""}</b></div>}
          {item.kind === "open" && <div className="text-sm mb-2 whitespace-pre-line"><b>Réponse modèle :</b> {item.modelAnswer}</div>}
          <p className="text-sm text-muted leading-relaxed">{"explanation" in item ? item.explanation : null}</p>
        </div>
      )}
    </div>
  );
}

// Enchaîne une liste d'items : score final, combo de bonnes réponses, items ratés.
export function QuizRunner({ items, onFinish, title, source = "other" }: {
  items: QuizItem[];
  onFinish: (score: number, right: number, wrong?: QuizItem[], maxCombo?: number) => void;
  title?: string;
  source?: QuizSource;
}) {
  const [idx, setIdx] = useState(0);
  const [right, setRight] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [wrong, setWrong] = useState<QuizItem[]>([]);
  const [answered, setAnswered] = useState(false);

  if (items.length === 0) return null;
  const item = items[idx];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted font-semibold">{title ?? "Question"} {idx + 1} / {items.length}</div>
        <div className="flex items-center gap-3">
          {combo >= 2 && <span className="text-sm font-bold text-gold pop" key={combo}>🔥 Combo ×{combo}</span>}
          <span className="text-sm font-mono text-muted">{right} ✓</span>
        </div>
      </div>
      <div className="h-1.5 bg-surface2 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(idx / items.length) * 100}%` }} />
      </div>
      <QuizCard key={item.id} item={item} source={source} onDone={(ok) => {
        if (ok) {
          setRight((r) => r + 1);
          setCombo((c) => { const n = c + 1; setMaxCombo((m) => Math.max(m, n)); return n; });
        } else {
          setCombo(0);
          setWrong((w) => [...w, item]);
        }
        setAnswered(true);
      }} />
      {answered && (
        <div className="mt-5 flex justify-end">
          <Btn onClick={() => {
            if (idx + 1 >= items.length) { onFinish(Math.round((right / items.length) * 100), right, wrong, maxCombo); }
            else { setIdx(idx + 1); setAnswered(false); }
          }}>
            {idx + 1 >= items.length ? "Voir mon score →" : "Question suivante →"}
          </Btn>
        </div>
      )}
    </div>
  );
}
