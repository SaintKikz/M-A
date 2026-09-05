import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { arenaById } from "../data/arena";
import { useProgress } from "../store/progress";
import { OpenAnswer } from "../components/OpenAnswer";
import { Card, PageTitle, Tag, Btn, ScoreRing } from "../components/ui";

export default function ArenaSessionPage() {
  const { sessionId } = useParams();
  const nav = useNavigate();
  const session = arenaById[sessionId ?? ""];
  const [turnIdx, setTurnIdx] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [turnGraded, setTurnGraded] = useState(false);
  const [finished, setFinished] = useState(false);
  const { completeArena, touchStreak, recordAnswer } = useProgress();
  if (!session) return <p>Session introuvable.</p>;

  const turn = session.turns[turnIdx];
  const isLast = turnIdx === session.turns.length - 1;
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const next = () => {
    if (isLast) {
      completeArena(session.id, avg, session.xp);
      recordAnswer("behavioral", [session.title], avg >= 60);
      touchStreak();
      setFinished(true);
    } else {
      setTurnIdx(turnIdx + 1);
      setTurnGraded(false);
      window.scrollTo(0, 0);
    }
  };

  if (finished) {
    const worst = scores.reduce((mi, sc, i) => (sc < scores[mi] ? i : mi), 0);
    return (
      <div className="max-w-xl mx-auto pt-10 fade-up">
        <div className="text-center">
          <div className="flex justify-center mb-4"><ScoreRing score={avg} size={140} /></div>
          <h1 className="text-2xl font-bold">Entretien terminé</h1>
          <p className="text-muted mt-2">
            {avg >= 80 ? `${session.interviewer} recommande de te faire passer au tour suivant. 🎉` :
             avg >= 60 ? `${session.interviewer} hésite : « du potentiel, mais des réponses à muscler ». Retravaille les corrections et reviens.` :
             `${session.interviewer} ne te fait pas passer — cette fois. Relis chaque réponse modèle à voix haute, puis retente demain.`}
          </p>
        </div>

        {/* Récap question par question */}
        <Card className="mt-6">
          <div className="font-bold text-sm mb-3">📋 Le détail, question par question</div>
          <div className="space-y-2">
            {session.turns.map((t, i) => (
              <div key={i} className={`flex items-start justify-between gap-3 rounded-lg px-3 py-2 text-sm ${i === worst && scores.length > 1 ? "bg-red/5 border border-red/30" : "bg-surface2"}`}>
                <span className="leading-snug">{i + 1}. {t.question.slice(0, 80)}{t.question.length > 80 ? "…" : ""}</span>
                <Tag color={scores[i] >= 75 ? "green" : scores[i] >= 50 ? "gold" : "red"}>{scores[i]}%</Tag>
              </div>
            ))}
          </div>
          {scores.length > 1 && <p className="text-xs text-muted mt-3">🎯 Priorité de travail : la question {worst + 1}. Réécris ta réponse à voix haute avant de refaire la session.</p>}
        </Card>

        <div className="flex gap-3 justify-center mt-6">
          <Btn kind="ghost" onClick={() => nav("/arena")}>← Arena</Btn>
          <Btn onClick={() => { setFinished(false); setTurnIdx(0); setScores([]); setTurnGraded(false); }}>↻ Refaire l'entretien</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link to="/arena" className="text-sm text-muted hover:text-ink">← Interview Arena</Link>
      <PageTitle emoji="🎤" title={session.title} sub={`${session.interviewer} · Question ${turnIdx + 1}/${session.turns.length}`} />
      <div className="h-1.5 bg-surface2 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${(turnIdx / session.turns.length) * 100}%` }} />
      </div>

      <Card className="mb-4 border-gold/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-lg shrink-0">🧑‍💼</div>
          <div>
            <div className="text-xs font-bold text-gold mb-1">{session.interviewer}</div>
            <p className="text-base font-semibold leading-relaxed">{turn.question}</p>
            {turn.english && <Tag color="muted">🇬🇧 Réponds en anglais si tu peux</Tag>}
          </div>
        </div>
      </Card>

      <Card>
        <OpenAnswer
          key={turnIdx}
          question={turn.question}
          keywords={turn.keywords} modelAnswer={turn.modelAnswer}
          redFlags={turn.redFlags} idealLengthWords={turn.idealLengthWords} clarifyOk={turn.clarifyOk}
          placeholder="Réponds comme si tu étais en face…"
          onGraded={(score) => { if (!turnGraded) { setScores([...scores, score]); setTurnGraded(true); } }}
        />
      </Card>

      {turnGraded && (
        <div className="mt-4 flex items-center justify-between fade-up">
          {turn.followUp ? <p className="text-sm text-muted italic mr-4">Relance probable : « {turn.followUp} »</p> : <span />}
          <Btn onClick={next}>{isLast ? "Terminer l'entretien" : "Question suivante →"}</Btn>
        </div>
      )}
    </div>
  );
}
