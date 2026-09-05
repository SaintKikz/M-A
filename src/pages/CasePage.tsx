import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { caseById } from "../data/cases";
import { useProgress } from "../store/progress";
import { gradeAnswer } from "../lib/grader";
import { Card, PageTitle, Tag, Btn, ScoreRing } from "../components/ui";

export default function CasePage() {
  const { caseId } = useParams();
  const c = caseById[caseId ?? ""];
  const { completeCase, touchStreak, recordAnswer } = useProgress();
  const [answers, setAnswers] = useState<string[]>(() => (c ? c.questions.map(() => "") : []));
  const [hintsShown, setHintsShown] = useState<boolean[]>(() => (c ? c.questions.map(() => false) : []));
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  if (!c) return <p>Case introuvable.</p>;

  const submit = () => {
    const perQ = c.questions.map((q, i) => gradeAnswer(answers[i], q.keywords).score);
    setScores(perQ);
    const totalPts = c.questions.reduce((a, q) => a + q.points, 0);
    const earned = c.questions.reduce((a, q, i) => a + (perQ[i] / 100) * q.points, 0);
    const final = Math.round((earned / totalPts) * 100);
    completeCase(c.id, final, c.xp);
    recordAnswer("mna-process", [c.title], final >= 60);
    touchStreak();
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const final = submitted ? Math.round(c.questions.reduce((a, q, i) => a + (scores[i] / 100) * q.points, 0) / c.questions.reduce((a, q) => a + q.points, 0) * 100) : 0;

  return (
    <div className="max-w-3xl">
      <Link to="/dealroom" className="text-sm text-muted hover:text-ink">← Deal Room</Link>
      <PageTitle emoji="🏢" title={c.title} />
      <div className="flex gap-2 mb-4 flex-wrap">
        <Tag color="accent">{c.level}</Tag><Tag color="muted">{c.sector}</Tag><Tag color="muted">⏱️ {c.minutes} min</Tag><Tag color="purple">+{c.xp} XP</Tag>
      </div>
      {c.disclaimer && <p className="text-xs text-muted mb-4 italic">{c.disclaimer}</p>}

      {submitted && (
        <Card className="mb-6 flex items-center gap-6 border-accent/50 fade-up">
          <ScoreRing score={final} size={100} />
          <div>
            <div className="font-bold text-lg">{final >= 75 ? "Niveau comité d'investissement 👏" : final >= 50 ? "Solide — compare chaque réponse au modèle." : "Refais ce case dans 3 jours après avoir revu les corrections."}</div>
            <div className="text-sm text-muted mt-1">Score pondéré par les points de chaque question.</div>
          </div>
        </Card>
      )}

      <Card className="mb-4"><div className="font-bold text-sm mb-2">📋 Contexte</div><p className="text-sm leading-relaxed">{c.context}</p></Card>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card><div className="font-bold text-sm mb-2">🏦 Acheteur / Process</div><p className="text-sm text-muted leading-relaxed">{c.buyer}</p></Card>
        <Card><div className="font-bold text-sm mb-2">🎯 Cible</div><p className="text-sm text-muted leading-relaxed">{c.target}</p></Card>
      </div>
      <Card className="mb-4">
        <div className="font-bold text-sm mb-3">📎 Données financières</div>
        <div className="space-y-1.5">
          {c.financials.map((d, i) => (
            <div key={i} className="flex justify-between gap-4 text-sm border-b border-border/50 pb-1.5 last:border-0">
              <span className="text-muted shrink-0">{d.label}</span><span className="font-mono text-right">{d.value}</span>
            </div>
          ))}
        </div>
      </Card>
      {(c.synergies || c.risks) && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {c.synergies && <Card><div className="font-bold text-sm mb-2">🔗 Synergies potentielles</div><p className="text-sm text-muted">{c.synergies}</p></Card>}
          {c.risks && <Card><div className="font-bold text-sm mb-2">⚠️ Risques</div><p className="text-sm text-muted">{c.risks}</p></Card>}
        </div>
      )}

      <div className="space-y-5">
        {c.questions.map((q, i) => (
          <Card key={i} className={submitted ? (scores[i] >= 60 ? "border-green/40" : "border-red/40") : ""}>
            <div className="flex items-start justify-between gap-3">
              <div className="font-semibold text-sm leading-relaxed">Q{i + 1}. {q.q}</div>
              <Tag color="muted">{q.points} pts</Tag>
            </div>
            {!submitted ? (
              <>
                <textarea value={answers[i]} onChange={(e) => setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))}
                  rows={5} placeholder="Ta réponse structurée…"
                  className="w-full mt-3 bg-surface2 border border-border rounded-xl px-4 py-3 outline-none focus:border-accent text-sm leading-relaxed" />
                {q.hint && !hintsShown[i] && <button onClick={() => setHintsShown(hintsShown.map((h, j) => (j === i ? true : h)))} className="text-xs text-gold mt-1 hover:underline">💡 Voir l'indice</button>}
                {q.hint && hintsShown[i] && <div className="text-xs bg-gold/10 border border-gold/30 rounded-lg px-3 py-2 mt-2">💡 {q.hint}</div>}
              </>
            ) : (
              <div className="mt-3 fade-up">
                <div className="text-sm mb-2">Ton score : <b>{scores[i]}%</b></div>
                <details className="text-sm text-muted mb-2"><summary className="cursor-pointer hover:text-ink">Ta réponse</summary><p className="mt-1 whitespace-pre-line bg-surface2 rounded-lg p-3">{answers[i] || "(vide)"}</p></details>
                <div className="rounded-xl border border-accent/40 bg-accent/5 p-4">
                  <div className="text-xs uppercase tracking-wider font-bold text-accent mb-1">Correction détaillée</div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{q.modelAnswer}</p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {!submitted && (
        <div className="mt-6 flex justify-end">
          <Btn onClick={submit} disabled={answers.every((a) => a.trim().length < 10)}>Rendre ma copie 📤</Btn>
        </div>
      )}
    </div>
  );
}
