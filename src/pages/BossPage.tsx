import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { bossById, moduleById } from "../data/curriculum";
import { quizById } from "../data/quiz";
import { useProgress } from "../store/progress";
import { QuizRunner } from "../components/QuizPlayer";
import { OpenAnswer } from "../components/OpenAnswer";
import { Card, PageTitle, Btn, ScoreRing, Tag } from "../components/ui";

export default function BossPage() {
  const { bossId } = useParams();
  const nav = useNavigate();
  const boss = bossById[bossId ?? ""];
  const [phase, setPhase] = useState<"intro" | "quiz" | "written" | "done">("intro");
  const [quizScore, setQuizScore] = useState(0);
  const [writtenScore, setWrittenScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const { completeBoss, touchStreak } = useProgress();

  useEffect(() => {
    if (phase !== "quiz" && phase !== "written") return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  if (!boss) return <p>Boss introuvable.</p>;
  const mod = moduleById[boss.moduleId];
  const items = boss.quizIds.map((id) => quizById[id]).filter(Boolean);
  const finalScore = Math.round(quizScore * 0.75 + writtenScore * 0.25);
  const timeUp = timeLeft === 0 && (phase === "quiz" || phase === "written");

  const finish = (ws: number) => {
    setWrittenScore(ws);
    const final = Math.round(quizScore * 0.75 + ws * 0.25);
    completeBoss(boss.id, final, final >= boss.passScore, boss.xp, boss.badge);
    touchStreak();
    setPhase("done");
    window.scrollTo(0, 0);
  };

  if (phase === "intro") {
    return (
      <div className="max-w-xl mx-auto pt-8">
        <Link to={`/path/${boss.moduleId}`} className="text-sm text-muted hover:text-ink">← {mod?.title}</Link>
        <div className="text-center mt-8 fade-up">
          <div className="text-7xl mb-4">{boss.emoji}</div>
          <h1 className="text-3xl font-black">{boss.title}</h1>
          <p className="text-muted mt-3">{items.length} questions + 1 réponse écrite · ⏱️ {boss.timeLimitMin} minutes · ≥{boss.passScore}% pour valider le module</p>
          <p className="text-sm text-gold mt-2">🏅 Badge en jeu : {boss.badge} · +{boss.xp} XP</p>
          <Btn kind="gold" className="mt-6 !px-8 !py-3 text-base" onClick={() => { setTimeLeft(boss.timeLimitMin * 60); setPhase("quiz"); }}>
            ⚔️ Lancer le combat
          </Btn>
          <p className="text-xs text-muted mt-4">Si tu échoues, un plan de correction ciblé sera généré. Pas de honte — les boss sont faits pour être retentés.</p>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const passed = finalScore >= boss.passScore;
    return (
      <div className="max-w-xl mx-auto text-center pt-10 fade-up">
        <div className="text-6xl mb-3">{passed ? "🏆" : "💀"}</div>
        <div className="flex justify-center mb-4"><ScoreRing score={finalScore} size={140} /></div>
        <h1 className="text-2xl font-bold">{passed ? `Boss vaincu ! Badge « ${boss.badge} » débloqué` : "Le boss t'a repoussé… cette fois."}</h1>
        <p className="text-sm text-muted mt-2">Quiz : {quizScore}% (75% du score) · Écrit : {writtenScore}% (25%)</p>
        {!passed && (
          <Card className="mt-6 text-left border-red/40">
            <div className="font-bold mb-2">🩹 Plan de correction ciblé</div>
            <ul className="text-sm text-muted space-y-1.5">
              <li>1. Refais les micro-leçons du module « {mod?.title} » (surtout celles liées aux questions ratées ci-dessus).</li>
              <li>2. Rejoue 2 Daily Drills — tes erreurs y reviendront automatiquement.</li>
              <li>3. Révise le deck de flashcards correspondant jusqu'à 0 carte « Again ».</li>
              <li>4. Retente le boss dans 48h minimum : la mémoire a besoin d'une nuit (ou deux).</li>
            </ul>
          </Card>
        )}
        <div className="flex gap-3 justify-center mt-6">
          <Btn kind="ghost" onClick={() => nav(`/path/${boss.moduleId}`)}>← Module</Btn>
          <Btn onClick={() => { setPhase("intro"); setQuizScore(0); setWrittenScore(0); }}>↻ Retenter</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <PageTitle emoji={boss.emoji} title={boss.title} />
        <div className={`font-mono text-xl font-bold px-4 py-2 rounded-xl border ${timeLeft < 60 ? "text-red border-red/50 bg-red/10" : "text-gold border-gold/40 bg-gold/10"}`}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </div>
      </div>
      {timeUp && <Card className="mb-4 border-red/50"><p className="text-sm text-red font-bold">⏰ Temps écoulé ! Termine quand même — mais en vrai entretien, c'était fini.</p></Card>}

      {phase === "quiz" && (
        <Card>
          <QuizRunner items={items} title="Boss" source="boss" onFinish={(sc) => { setQuizScore(sc); setPhase("written"); window.scrollTo(0, 0); }} />
        </Card>
      )}

      {phase === "written" && (
        <Card className="fade-up">
          <Tag color="red">✍️ Épreuve finale — réponse écrite</Tag>
          <p className="text-lg font-semibold mt-3 mb-4">{boss.writtenQuestion.q}</p>
          <OpenAnswer question={boss.writtenQuestion.q} keywords={boss.writtenQuestion.keywords} modelAnswer={boss.writtenQuestion.modelAnswer}
            idealLengthWords={[40, 250]} onGraded={(s) => finish(s)} placeholder="Réponds comme en entretien, structuré et précis…" />
        </Card>
      )}
    </div>
  );
}
