import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { missionById } from "../data/missions";
import { useProgress } from "../store/progress";
import { OpenAnswer } from "../components/OpenAnswer";
import { Card, PageTitle, Tag, diffLabel, diffColor } from "../components/ui";

export default function MissionPage() {
  const { missionId } = useParams();
  const m = missionById[missionId ?? ""];
  const { completeMission, addCards, touchStreak, recordAnswer } = useProgress();
  const [graded, setGraded] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  if (!m) return <p>Mission introuvable.</p>;
  const overTime = elapsed > m.minutes * 60 && graded === null;
  const mmss = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div className="max-w-2xl">
      <Link to="/desk" className="text-sm text-muted hover:text-ink">← Analyst Desk</Link>
      <PageTitle emoji="💼" title={m.title} />
      <div className="flex gap-2 mb-4 items-center flex-wrap">
        <Tag color={diffColor(m.difficulty)}>{diffLabel(m.difficulty)}</Tag>
        <Tag color="muted">Budget : {m.minutes} min</Tag>
        <Tag color="purple">+{m.xp} XP</Tag>
        {graded === null && (
          <span className={`ml-auto font-mono text-sm font-bold px-3 py-1 rounded-lg border ${overTime ? "text-red border-red/50 bg-red/10" : "text-gold border-gold/40 bg-gold/10"}`}>
            ⏱ {mmss}{overTime && " — l'associate s'impatiente…"}
          </span>
        )}
      </div>

      <Card className="mb-4 border-accent2/40">
        <div className="text-xs font-bold text-accent2 uppercase tracking-wide mb-1">{m.from}</div>
        <p className="text-sm leading-relaxed italic">{m.context}</p>
      </Card>

      <Card className="mb-4">
        <div className="font-bold text-sm mb-3">📎 Données</div>
        <div className="space-y-1.5">
          {m.data.map((d, i) => (
            <div key={i} className="flex justify-between gap-4 text-sm border-b border-border/50 pb-1.5 last:border-0">
              <span className="text-muted">{d.label}</span><span className="font-mono text-right">{d.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-4">
        <div className="font-bold text-sm mb-2">🎯 Ta tâche</div>
        <p className="text-sm leading-relaxed mb-4">{m.task}</p>
        <OpenAnswer
          question={`${m.context}\n\nDonnées : ${m.data.map((d) => `${d.label} = ${d.value}`).join(" · ")}\n\nTâche : ${m.task}`}
          keywords={m.keywords} modelAnswer={m.modelAnswer} hints={m.hints} idealLengthWords={[40, 400]}
          placeholder="Réponds comme si tu envoyais ta réponse à ton associate…"
          onGraded={(score) => {
            setGraded(score);
            completeMission(m.id, score, m.xp);
            recordAnswer(m.topic, [m.title], score >= 60);
            if (m.flashcardId) addCards([m.flashcardId]);
            touchStreak();
          }}
        />
      </Card>

      {graded !== null && (
        <Card className="fade-up">
          <div className="font-bold text-sm mb-2">✅ Grille d'auto-évaluation</div>
          <ul className="text-sm space-y-1.5">
            {m.rubric.map((r, i) => <li key={i} className="text-muted">☐ {r}</li>)}
          </ul>
          {m.flashcardId && <p className="text-xs text-muted mt-3">🃏 Flashcard associée ajoutée à ta pile de révision.</p>}
        </Card>
      )}
    </div>
  );
}
