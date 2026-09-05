import { useState } from "react";
import { gradeAnswer, type GradeResult } from "../lib/grader";
import { aiEnabled, aiGradeAnswer } from "../lib/aiClient";
import { Btn, ScoreRing, Tag } from "./ui";

type Result = GradeResult & { betterAnswer?: string; gradedBy: "ai" | "heuristic" };

// Zone de réponse libre : tentative → indice → correction.
// Si le Coach IA est configuré (Profil → Coach IA), Claude corrige la réponse ;
// sinon, le grader heuristique (mots-clés + concision) prend le relais.
export function OpenAnswer({
  keywords, modelAnswer, hints = [], redFlags, idealLengthWords, clarifyOk, placeholder, onGraded, question,
}: {
  keywords: string[];
  modelAnswer: string;
  hints?: string[];
  redFlags?: string[];
  idealLengthWords?: [number, number];
  clarifyOk?: boolean;
  placeholder?: string;
  onGraded?: (score: number) => void;
  question?: string; // contexte passé au coach IA (sinon la question est déduite du modelAnswer)
}) {
  const [text, setText] = useState("");
  const [hintIdx, setHintIdx] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [grading, setGrading] = useState(false);

  const submit = async () => {
    const heuristic = () => ({
      ...gradeAnswer(text, keywords, { redFlags, idealLengthWords, clarifyOk }),
      gradedBy: "heuristic" as const,
    });

    let g: Result;
    if (aiEnabled()) {
      setGrading(true);
      try {
        const ai = await aiGradeAnswer(question ?? "(question implicite — voir éléments de correction)", text, { modelAnswer });
        g = { ...ai, gradedBy: "ai" };
      } catch {
        g = heuristic(); // clé invalide / réseau : on retombe sur l'heuristique
      } finally {
        setGrading(false);
      }
    } else {
      g = heuristic();
    }
    setResult(g);
    onGraded?.(g.score);
  };

  return (
    <div>
      {!result && (
        <>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={7}
            placeholder={placeholder ?? "Écris ta réponse comme tu la dirais à voix haute…"}
            disabled={grading}
            className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 outline-none focus:border-accent text-sm leading-relaxed" />
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Btn onClick={submit} disabled={text.trim().length < 15 || grading}>
              {grading ? "🤖 Le coach lit ta réponse…" : "Soumettre au coach"}
            </Btn>
            {hints.length > 0 && hintIdx < hints.length && (
              <Btn kind="ghost" onClick={() => setHintIdx(hintIdx + 1)}>💡 Indice ({hintIdx}/{hints.length})</Btn>
            )}
            <span className="text-xs text-muted ml-auto">{text.trim() ? text.trim().split(/\s+/).length : 0} mots</span>
          </div>
          {hintIdx > 0 && (
            <div className="mt-3 space-y-2">
              {hints.slice(0, hintIdx).map((h, i) => (
                <div key={i} className="text-sm bg-gold/10 border border-gold/30 rounded-xl px-4 py-2.5 fade-up">💡 {h}</div>
              ))}
            </div>
          )}
        </>
      )}

      {result && (
        <div className="fade-up">
          <div className="flex items-center gap-5 mb-4">
            <ScoreRing score={result.score} size={84} />
            <div>
              <Tag color={result.gradedBy === "ai" ? "purple" : "muted"}>
                {result.gradedBy === "ai" ? "🤖 Corrigé par le Coach IA" : "Correction heuristique"}
              </Tag>
              <div className="font-bold mt-1.5">{result.verdict}</div>
              {result.lengthFeedback && <div className="text-sm text-gold mt-1">⏱️ {result.lengthFeedback}</div>}
            </div>
          </div>

          {/* Sous-scores : les 3 axes qu'un recruteur note vraiment */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "🧠 Technique", v: result.sub.technique },
              { label: "🏗️ Structure", v: result.sub.structure },
              { label: "⏱️ Concision", v: result.sub.concision },
            ].map((x) => (
              <div key={x.label} className="bg-surface2 rounded-xl p-3">
                <div className="text-[11px] font-bold text-muted mb-1.5">{x.label}</div>
                <div className="h-1.5 bg-bg rounded-full overflow-hidden mb-1">
                  <div className="h-full rounded-full transition-all" style={{ width: `${x.v}%`, background: x.v >= 75 ? "var(--color-green)" : x.v >= 50 ? "var(--color-gold)" : "var(--color-red)" }} />
                </div>
                <div className="text-xs font-mono">{x.v}%</div>
              </div>
            ))}
          </div>
          {result.misses.length > 0 && (
            <p className="text-sm text-muted mb-2">📌 <b>Manquant :</b> {result.misses.map((m) => m.split("|")[0]).join(" · ")}</p>
          )}
          {result.tips.length > 0 && (
            <ul className="text-sm space-y-1.5 mb-4">
              {result.tips.map((t, i) => <li key={i} className="text-muted">• {t}</li>)}
            </ul>
          )}
          {result.betterAnswer && (
            <div className="rounded-xl border border-accent2/40 bg-accent2/5 p-4 mb-3">
              <div className="text-xs uppercase tracking-wider font-bold text-accent2 mb-2">🤖 La réponse idéale selon le coach</div>
              <p className="text-sm leading-relaxed whitespace-pre-line">{result.betterAnswer}</p>
            </div>
          )}
          <div className="rounded-xl border border-accent/40 bg-accent/5 p-4">
            <div className="text-xs uppercase tracking-wider font-bold text-accent mb-2">Réponse modèle</div>
            <p className="text-sm leading-relaxed whitespace-pre-line">{modelAnswer}</p>
          </div>
          <details className="mt-3 text-sm text-muted">
            <summary className="cursor-pointer hover:text-ink">Ta réponse</summary>
            <p className="mt-2 whitespace-pre-line bg-surface2 rounded-xl p-3">{text}</p>
          </details>
          <div className="mt-3">
            <Btn kind="ghost" onClick={() => { setResult(null); setText(""); setHintIdx(0); }}>↻ Retenter</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
