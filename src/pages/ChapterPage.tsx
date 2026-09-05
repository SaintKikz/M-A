import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { chapterById } from "../data/academy";
import { quizById } from "../data/quiz";
import { useProgress } from "../store/progress";
import { QuizCard } from "../components/QuizPlayer";
import { ExercisePlayer } from "../components/ChapterExercises";
import { OpenAnswer } from "../components/OpenAnswer";
import { Diagram } from "../components/Diagram";
import { Card, PageTitle, Tag, Btn, ScoreRing } from "../components/ui";
import { aiEnabled, aiExplain } from "../lib/aiClient";
import type { QuizItem } from "../lib/types";

const STEPS = ["Comprendre", "Approfondir", "Exemples", "Quiz", "Exercices", "Mini-cas"] as const;

function AiExplainButton({ concept, text }: { concept: string; text: string }) {
  const [out, setOut] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  if (!aiEnabled()) return null;
  return (
    <div className="mt-3">
      {!out ? (
        <Btn kind="ghost" disabled={loading} onClick={async () => {
          setLoading(true);
          try { setOut(await aiExplain(concept, text)); } catch { setOut("(Erreur du coach IA — réessaie plus tard.)"); }
          setLoading(false);
        }}>{loading ? "🤖 Le coach cherche une autre approche…" : "🤖 Pas clair ? Explique-moi autrement"}</Btn>
      ) : (
        <div className="rounded-xl border border-accent2/40 bg-accent2/5 p-4 fade-up">
          <div className="text-xs uppercase tracking-wider font-bold text-accent2 mb-2">🤖 Autre angle, par le coach</div>
          <p className="text-sm leading-relaxed whitespace-pre-line">{out}</p>
        </div>
      )}
    </div>
  );
}

export default function ChapterPage() {
  const { chapterId } = useParams();
  const nav = useNavigate();
  const ch = chapterById[chapterId ?? ""];
  const [step, setStep] = useState(0);
  const [quizRight, setQuizRight] = useState(0);
  const [quizDone, setQuizDone] = useState(0);
  const [exScores, setExScores] = useState<number[]>([]);
  const [caseScore, setCaseScore] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const { completeChapter, chapters, touchStreak } = useProgress();

  const quizItems: QuizItem[] = useMemo(() => {
    if (!ch) return [];
    return [...ch.quizIds.map((id) => quizById[id]).filter(Boolean), ...(ch.extraQuiz ?? [])];
  }, [ch]);

  if (!ch) return <p>Chapitre introuvable.</p>;

  const allQuizDone = quizDone >= quizItems.length;
  const allExDone = exScores.length >= ch.exercises.length;
  const quizPct = quizItems.length ? Math.round((quizRight / quizItems.length) * 100) : 100;
  const exPct = ch.exercises.length ? Math.round(exScores.reduce((a, b) => a + b, 0) / ch.exercises.length) : 100;

  const finish = () => {
    const final = Math.round(quizPct * 0.45 + exPct * 0.3 + (caseScore ?? 0) * 0.25);
    completeChapter(ch.id, final, ch.xp);
    touchStreak();
    setFinished(true);
    window.scrollTo(0, 0);
  };

  if (finished) {
    const final = chapters[ch.id] ?? 0;
    return (
      <div className="max-w-xl mx-auto text-center pt-12 fade-up">
        <div className="flex justify-center mb-4"><ScoreRing score={final} size={140} /></div>
        <h1 className="text-2xl font-bold">Chapitre complété !</h1>
        <p className="text-muted mt-2">Quiz {quizPct}% · Exercices {exPct}% · Mini-cas {caseScore ?? 0}% → maîtrise {final}%. +{ch.xp} XP.</p>
        {final < 75 && <p className="text-sm text-gold mt-2">💡 En dessous de 75%, reviens refaire le quiz dans 2-3 jours — la maîtrise se construit par répétition.</p>}
        <div className="flex gap-3 justify-center mt-6">
          <Btn kind="ghost" onClick={() => nav("/academy")}>← Académie</Btn>
          <Btn onClick={() => { setFinished(false); setStep(0); setQuizDone(0); setQuizRight(0); setExScores([]); setCaseScore(null); }}>↻ Refaire</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link to="/academy" className="text-sm text-muted hover:text-ink">← Académie · Niveau {ch.level}</Link>
      <PageTitle emoji={ch.emoji} title={ch.title} sub={ch.hook} />

      {/* Stepper */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${step === i ? "bg-accent text-white" : i < step ? "bg-accent/15 text-accent" : "bg-surface2 text-muted hover:text-ink"}`}>
            {i + 1}. {s}
          </button>
        ))}
      </div>

      {/* ── 1. Comprendre (explication simple + analogie) ── */}
      {step === 0 && (
        <div className="fade-up space-y-4">
          <Card>
            <Tag color="green">Explication simple — zéro jargon</Tag>
            <div className="mt-3 space-y-3">
              {ch.simple.split("\n\n").map((p, i) => <p key={i} className="text-[15px] leading-relaxed">{p}</p>)}
            </div>
            <AiExplainButton concept={ch.title} text={ch.simple} />
          </Card>
          <Card className="border-gold/40">
            <Tag color="gold">🌍 L'analogie de la vie réelle</Tag>
            <p className="text-[15px] leading-relaxed mt-3 italic">{ch.analogy}</p>
          </Card>
          {ch.diagrams[0] && <Diagram spec={ch.diagrams[0]} />}
          <div className="flex justify-end"><Btn onClick={() => setStep(1)}>Approfondir →</Btn></div>
        </div>
      )}

      {/* ── 2. Approfondir (deep + pièges + usage M&A + diagrammes) ── */}
      {step === 1 && (
        <div className="fade-up space-y-4">
          <Card>
            <Tag color="accent">Version approfondie — pourquoi ça marche</Tag>
            <div className="mt-3 space-y-3">
              {ch.deep.split("\n\n").map((p, i) => <p key={i} className="text-[15px] leading-relaxed">{p}</p>)}
            </div>
            <AiExplainButton concept={ch.title} text={ch.deep} />
          </Card>
          {ch.diagrams.slice(1).map((d, i) => <Diagram key={i} spec={d} />)}
          <Card className="border-red/30">
            <Tag color="red">⚠️ Pièges & exceptions</Tag>
            <ul className="mt-3 space-y-2">
              {ch.traps.map((t, i) => <li key={i} className="text-sm leading-relaxed">• {t}</li>)}
            </ul>
          </Card>
          <Card className="border-accent2/40">
            <Tag color="purple">🎯 En M&A et en entretien</Tag>
            <p className="text-sm leading-relaxed mt-3">{ch.mnaUse}</p>
          </Card>
          <div className="flex justify-end"><Btn onClick={() => setStep(2)}>Voir les exemples →</Btn></div>
        </div>
      )}

      {/* ── 3. Exemples ── */}
      {step === 2 && (
        <div className="fade-up space-y-4">
          {ch.examples.map((ex, i) => (
            <Card key={i}>
              <div className="font-bold text-sm mb-2">{["🔢", "🌐", "❌", "🤝"][i] ?? "•"} {ex.title}</div>
              <p className="text-sm leading-relaxed">{ex.body}</p>
            </Card>
          ))}
          <div className="flex justify-end"><Btn onClick={() => setStep(3)}>Passer au quiz →</Btn></div>
        </div>
      )}

      {/* ── 4. Quiz ── */}
      {step === 3 && (
        <div className="fade-up space-y-5">
          <p className="text-sm text-muted">Réponds à tout — chaque correction est détaillée. Score comptabilisé dans ta maîtrise du chapitre.</p>
          {quizItems.slice(0, quizDone + 1).map((q) => (
            <Card key={q.id}>
              <QuizCard item={q} onDone={(ok) => { if (ok) setQuizRight((r) => r + 1); setQuizDone((d) => d + 1); }} />
            </Card>
          ))}
          {allQuizDone && (
            <div className="flex items-center justify-between">
              <Tag color={quizPct >= 75 ? "green" : "gold"}>Quiz : {quizRight}/{quizItems.length}</Tag>
              <Btn onClick={() => setStep(4)}>Exercices →</Btn>
            </div>
          )}
        </div>
      )}

      {/* ── 5. Exercices variés ── */}
      {step === 4 && (
        <div className="fade-up space-y-5">
          {ch.exercises.map((ex, i) => (
            <Card key={i}>
              <ExercisePlayer ex={ex} onDone={(pct) => setExScores((s) => [...s, pct])} />
            </Card>
          ))}
          {allExDone && (
            <div className="flex items-center justify-between">
              <Tag color={exPct >= 75 ? "green" : "gold"}>Exercices : {exPct}%</Tag>
              <Btn onClick={() => setStep(5)}>Le mini-cas final →</Btn>
            </div>
          )}
        </div>
      )}

      {/* ── 6. Mini-cas ── */}
      {step === 5 && (
        <div className="fade-up space-y-4">
          <Card className="border-gold/40">
            <Tag color="gold">🎬 Mini-cas — applique tout le chapitre</Tag>
            <p className="text-sm leading-relaxed mt-3 italic">{ch.miniCase.context}</p>
            <p className="text-sm font-semibold mt-3">{ch.miniCase.task}</p>
          </Card>
          <Card>
            <OpenAnswer
              question={`${ch.miniCase.context}\n\n${ch.miniCase.task}`}
              keywords={ch.miniCase.keywords}
              modelAnswer={ch.miniCase.modelAnswer}
              hints={ch.miniCase.hints}
              idealLengthWords={[40, 350]}
              onGraded={(s) => setCaseScore(s)}
            />
          </Card>
          {caseScore !== null && (
            <div className="flex justify-end"><Btn kind="gold" onClick={finish}>Terminer le chapitre 🎓</Btn></div>
          )}
        </div>
      )}
    </div>
  );
}
