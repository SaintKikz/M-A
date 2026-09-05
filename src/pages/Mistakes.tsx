import { useMemo, useState } from "react";
import { Card, PageTitle, Btn, Tag } from "../components/ui";
import { useProgress, topicToSkill, SKILLS, type MistakeEntry } from "../store/progress";
import { QUIZ } from "../data/quiz";
import { QuizCard } from "../components/QuizPlayer";

const quizById = Object.fromEntries(QUIZ.map((q) => [q.id, q]));

function MistakeRow({ m }: { m: MistakeEntry }) {
  const [open, setOpen] = useState(false);
  const [retry, setRetry] = useState(false);
  const { clearMistake, markRetried } = useProgress();
  const quizItem = quizById[m.qid];

  if (retry && quizItem) {
    return (
      <Card className="border-accent/40">
        <QuizCard item={quizItem} source={m.source} onDone={(ok) => { markRetried(m.qid); if (!ok) setTimeout(() => setRetry(false), 0); }} />
        <div className="mt-3 flex justify-end"><Btn kind="ghost" onClick={() => setRetry(false)}>Fermer</Btn></div>
      </Card>
    );
  }

  return (
    <Card className={m.retried ? "opacity-70" : ""}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 cursor-pointer min-w-0" onClick={() => setOpen(!open)}>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Tag color="muted">{m.source}</Tag>
            <span className="text-[11px] text-muted">{m.date}</span>
            {m.retried && <Tag color="green">retentée</Tag>}
          </div>
          <div className="text-sm font-semibold leading-snug">{m.prompt}</div>
        </div>
        <span className="text-muted shrink-0">{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div className="mt-3 space-y-2 text-sm fade-up">
          <div className="rounded-lg bg-red/10 border border-red/30 px-3 py-2"><span className="text-[11px] font-bold text-red uppercase tracking-wide">Ta réponse</span><div className="mt-0.5">{m.userAnswer || "—"}</div></div>
          <div className="rounded-lg bg-green/10 border border-green/30 px-3 py-2"><span className="text-[11px] font-bold text-green uppercase tracking-wide">Bonne réponse</span><div className="mt-0.5">{m.correctAnswer}</div></div>
          {m.explanation && <p className="text-muted text-xs leading-relaxed">{m.explanation}</p>}
          <div className="flex gap-2 pt-1">
            {quizItem && <Btn onClick={() => setRetry(true)}>Retenter 🔁</Btn>}
            <Btn kind="ghost" onClick={() => clearMistake(m.qid)}>J'ai compris, retirer</Btn>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function Mistakes() {
  const { mistakes } = useProgress();
  const [filter, setFilter] = useState<string>("all");

  const groups = useMemo(() => {
    const g: Record<string, MistakeEntry[]> = {};
    for (const m of mistakes) {
      const skill = topicToSkill(m.topic);
      (g[skill] ??= []).push(m);
    }
    return g;
  }, [mistakes]);

  const shown = filter === "all" ? mistakes : (groups[filter] ?? []);

  return (
    <div>
      <PageTitle emoji="📓" title="Mistake Book" sub="Chaque erreur est enregistrée automatiquement avec ta réponse. Le vrai apprentissage se joue ici : comprendre, retenter, sortir la question du livre." />
      {mistakes.length === 0 ? (
        <Card className="text-center py-10">
          <div className="text-3xl mb-2">🧼</div>
          <div className="font-bold">Aucune erreur enregistrée</div>
          <p className="text-sm text-muted mt-1">Fais un Daily Drill ou un chapitre de l'Académie — tes erreurs arriveront ici toutes seules.</p>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${filter === "all" ? "bg-accent/15 text-accent border-accent/40" : "border-border text-muted"}`}>
              Toutes ({mistakes.length})
            </button>
            {SKILLS.filter((s) => groups[s]?.length).map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${filter === s ? "bg-accent/15 text-accent border-accent/40" : "border-border text-muted"}`}>
                {s} ({groups[s].length})
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {shown.map((m) => <MistakeRow key={m.qid} m={m} />)}
          </div>
        </>
      )}
    </div>
  );
}
