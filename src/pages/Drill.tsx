import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { QUIZ } from "../data/quiz";
import { allCards } from "../lib/cards";
import { fixLinkForTag, topicLabel } from "../lib/coach";
import { useProgress, type SrsGrade } from "../store/progress";
import { QuizRunner } from "../components/QuizPlayer";
import { Card, PageTitle, Btn, ScoreRing, Tag } from "../components/ui";
import type { QuizItem } from "../lib/types";

// Construit le drill du jour : 5 flashcards + mix de questions, pondéré par les faiblesses.
function buildDrill(tagErrors: Record<string, number>, seedStr: string) {
  let seed = Array.from(seedStr).reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const weight = (q: QuizItem) => 1 + q.tags.reduce((a, t) => a + (tagErrors[t] ?? 0), 0) * 2;
  const pick = (pool: QuizItem[], n: number, used: Set<string>) => {
    const out: QuizItem[] = [];
    const candidates = pool.filter((q) => !used.has(q.id));
    for (let i = 0; i < n && candidates.length > 0; i++) {
      const total = candidates.reduce((a, q) => a + weight(q), 0);
      let r = rand() * total;
      let idx = 0;
      for (let j = 0; j < candidates.length; j++) { r -= weight(candidates[j]); if (r <= 0) { idx = j; break; } }
      const q = candidates.splice(idx, 1)[0];
      used.add(q.id);
      out.push(q);
    }
    return out;
  };
  const used = new Set<string>();
  const technical = QUIZ.filter((q) => ["accounting", "valuation", "dcf", "comps", "precedents", "corp-finance"].includes(q.topic) && q.kind === "mcq");
  const calc = QUIZ.filter((q) => q.kind === "numeric");
  const fit = QUIZ.filter((q) => q.topic === "behavioral");
  const deal = QUIZ.filter((q) => ["mna-process", "accretion-dilution", "lbo", "capital-markets", "industry"].includes(q.topic));
  const traps = QUIZ.filter((q) => q.trap);
  return [
    ...pick(technical, 3, used),
    ...pick(calc, 1, used),
    ...pick(deal, 1, used),
    ...pick(traps, 1, used),
    ...pick(fit, 1, used),
  ];
}

export default function Drill() {
  const s = useProgress();
  const today = new Date().toISOString().slice(0, 10);
  const alreadyDone = s.drillHistory.some((d) => d.date === today);
  const [phase, setPhase] = useState<"intro" | "cards" | "quiz" | "done">("intro");
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongItems, setWrongItems] = useState<QuizItem[]>([]);
  const [comboMax, setComboMax] = useState(0);

  // Priorité SRS : cartes EN RETARD d'abord, puis nouvelles cartes actives, puis le pool général.
  const drillCards = useMemo(() => {
    const all = allCards();
    const now = new Date();
    const due = all.filter((c) => s.activeCards.includes(c.id) && s.srs[c.id] && new Date(s.srs[c.id].due) <= now);
    const fresh = all.filter((c) => s.activeCards.includes(c.id) && !s.srs[c.id]);
    const pool = [...due, ...fresh];
    if (pool.length >= 5) return pool.slice(0, 5);
    const start = (today.charCodeAt(9) * 7 + today.charCodeAt(8)) % Math.max(1, all.length - 5);
    const filler = all.slice(start, start + 10).filter((c) => !pool.some((p) => p.id === c.id));
    return [...pool, ...filler].slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const dueCount = useMemo(() => {
    const now = new Date();
    return s.activeCards.filter((id) => s.srs[id] && new Date(s.srs[id].due) <= now).length;
  }, [s.activeCards, s.srs]);

  const items = useMemo(() => buildDrill(s.tagErrors, today), [today]);

  const gradeCard = (grade: SrsGrade) => {
    s.reviewCard(drillCards[cardIdx].id, grade);
    setFlipped(false);
    if (cardIdx + 1 >= drillCards.length) setPhase("quiz");
    else setCardIdx(cardIdx + 1);
  };

  if (phase === "intro") {
    return (
      <div>
        <PageTitle emoji="⚡" title="Daily Drill" sub="Ta routine quotidienne : 5 flashcards, 3 questions techniques, 1 calcul, 1 question deal, 1 piège, 1 fit. 10-15 minutes, tous les jours." />
        <Card className="max-w-xl">
          {alreadyDone && <Tag color="green">✓ Déjà fait aujourd'hui — un 2e passage compte pour l'entraînement, pas pour le streak.</Tag>}
          <div className="text-sm text-muted my-4 space-y-1">
            <p>🃏 5 flashcards {dueCount > 0 && <b className="text-gold">({Math.min(5, dueCount)} en retard — priorité SRS)</b>}</p>
            <p>🧠 3 techniques + 1 calcul + 1 deal + 1 piège + 1 fit</p>
            <p>🔥 Enchaîne les bonnes réponses : chaque combo rapporte des XP bonus</p>
            <p>🎯 Tes erreurs passées reviennent plus souvent (Weakness Detector)</p>
          </div>
          <Btn onClick={() => { setPhase("cards"); s.touchStreak(); }} className="w-full">C'est parti 🔥</Btn>
        </Card>
      </div>
    );
  }

  if (phase === "cards") {
    const card = drillCards[cardIdx];
    return (
      <div className="max-w-xl mx-auto">
        <PageTitle emoji="🃏" title={`Flashcard ${cardIdx + 1}/5`} />
        <div className={`card-flip ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
          <div className="card-flip-inner relative h-64 cursor-pointer">
            <Card className="card-face absolute inset-0 flex items-center justify-center text-center">
              <div><Tag color="muted">{card.deck}</Tag><p className="text-lg font-semibold mt-3">{card.front}</p><p className="text-xs text-muted mt-4">Clique pour retourner</p></div>
            </Card>
            <Card className="card-face card-back absolute inset-0 flex items-center justify-center text-center border-accent/40 overflow-y-auto">
              <p className="text-sm leading-relaxed whitespace-pre-line">{card.back}</p>
            </Card>
          </div>
        </div>
        {flipped && (
          <div className="grid grid-cols-4 gap-2 mt-4 fade-up">
            <Btn kind="danger" onClick={() => gradeCard("again")}>Again</Btn>
            <Btn kind="ghost" onClick={() => gradeCard("hard")}>Hard</Btn>
            <Btn kind="ghost" onClick={() => gradeCard("medium")}>Medium</Btn>
            <Btn kind="success" onClick={() => gradeCard("easy")}>Easy</Btn>
          </div>
        )}
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <div className="max-w-2xl">
        <PageTitle emoji="⚡" title="Daily Drill — Questions" />
        <Card>
          <QuizRunner items={items} title="Drill" source="drill" onFinish={(sc, _right, wrong, maxCombo) => {
            setScore(sc);
            setWrongItems(wrong ?? []);
            setComboMax(maxCombo ?? 0);
            const bonus = (maxCombo ?? 0) >= 3 ? (maxCombo ?? 0) * 3 : 0;
            if (!alreadyDone) { s.recordDrill(sc); if (bonus) s.addXp(bonus); }
            setPhase("done");
          }} />
        </Card>
      </div>
    );
  }

  // ── Écran de fin : XP détaillés + plan de correction ciblé ──
  const comboBonus = comboMax >= 3 ? comboMax * 3 : 0;
  const baseXp = 20 + Math.round(score / 10);
  const wrongByTag = wrongItems.flatMap((q) => q.tags.slice(0, 1).map((t) => ({ tag: t, topic: q.topic })));

  return (
    <div className="max-w-xl mx-auto pt-6 fade-up">
      <div className="text-center">
        <div className="flex justify-center mb-4"><ScoreRing score={score} size={140} /></div>
        <h1 className="text-2xl font-bold">{score === 100 ? "Sans faute. 👑" : score >= 70 ? "Drill terminé ! 💪" : "Drill terminé — on encaisse, on apprend."}</h1>
        <div className="flex justify-center gap-2 mt-3 flex-wrap">
          <Tag color="gold">🔥 Streak : {s.streak} j</Tag>
          <Tag color="accent">+{baseXp} XP</Tag>
          {comboBonus > 0 && <Tag color="purple">🔥 Combo ×{comboMax} : +{comboBonus} XP</Tag>}
        </div>
      </div>

      {wrongByTag.length > 0 ? (
        <Card className="mt-6 border-gold/40">
          <div className="font-bold mb-3">🩹 Plan de correction du jour</div>
          <div className="space-y-2">
            {wrongByTag.map((w, i) => {
              const fix = fixLinkForTag(w.tag);
              return (
                <Link key={i} to={fix.to} className="flex items-center justify-between gap-3 bg-surface2 hover:bg-border rounded-xl px-4 py-2.5 transition-colors">
                  <div className="text-sm"><b>{w.tag}</b> <span className="text-muted">({topicLabel(w.topic)})</span></div>
                  <span className="text-xs text-accent shrink-0">{fix.label} →</span>
                </Link>
              );
            })}
          </div>
          <p className="text-xs text-muted mt-3">Ces notions reviendront plus souvent dans tes prochains drills jusqu'à ce que tu les maîtrises.</p>
        </Card>
      ) : (
        <Card className="mt-6 border-green/40">
          <div className="font-bold mb-1">📌 Recommandation</div>
          <p className="text-sm text-muted">Aucune erreur à corriger — monte en difficulté : une mission Analyst Desk ou un case Deal Room aujourd'hui.</p>
          <div className="flex gap-2 mt-3">
            <Link to="/desk"><Btn kind="ghost">💼 Analyst Desk</Btn></Link>
            <Link to="/dealroom"><Btn kind="ghost">🏢 Deal Room</Btn></Link>
          </div>
        </Card>
      )}

      <div className="text-center mt-6">
        <Link to="/"><Btn kind="ghost">← Dashboard</Btn></Link>
      </div>
    </div>
  );
}
