import { Link, useParams } from "react-router-dom";
import { moduleById, lessonById, bossById } from "../data/curriculum";
import { MISSIONS } from "../data/missions";
import { CASES } from "../data/cases";
import { ARENA_SESSIONS } from "../data/arena";
import { BANK } from "../data";
import { useProgress } from "../store/progress";
import { Card, PageTitle, Tag, Btn } from "../components/ui";

const TOPIC_TO_BANK: Record<string, string> = {
  accounting: "Accounting", valuation: "Valuation", dcf: "Valuation", comps: "Valuation",
  precedents: "Valuation", "mna-process": "M&A", "accretion-dilution": "M&A", lbo: "LBO",
  "capital-markets": "Capital Markets", industry: "Industry", behavioral: "Behavioral",
  "deal-awareness": "Behavioral", foundations: "M&A", "corp-finance": "Valuation",
};

export default function ModulePage() {
  const { moduleId } = useParams();
  const mod = moduleById[moduleId ?? ""];
  const { completedLessons, bossResults } = useProgress();
  if (!mod) return <p>Module introuvable.</p>;

  const boss = mod.bossId ? bossById[mod.bossId] : null;
  const allDone = mod.lessonIds.length > 0 && mod.lessonIds.every((l) => completedLessons.includes(l));
  const missions = MISSIONS.filter((m) => m.topic === mod.topic);
  const cases = CASES.filter((c) => mod.topic === "industry" || (mod.topic === "lbo" && c.id === "cs9"));
  const arena = ARENA_SESSIONS.filter((a) => (mod.topic === "behavioral" ? a.mode === "fit" || a.mode === "full" || a.mode === "bullshit" : false));
  const bankCount = BANK.filter((q) => q.category === TOPIC_TO_BANK[mod.topic]).length;

  return (
    <div>
      <Link to="/path" className="text-sm text-muted hover:text-ink">← Learning Path</Link>
      <PageTitle emoji={mod.emoji} title={mod.title} sub={mod.description} />

      {mod.lessonIds.length > 0 && (
        <div className="space-y-2 mb-6">
          <div className="font-bold text-sm uppercase tracking-wider text-muted mb-2">Micro-leçons</div>
          {mod.lessonIds.map((lid, i) => {
            const l = lessonById[lid];
            const done = completedLessons.includes(lid);
            return (
              <Link key={lid} to={`/lesson/${lid}`}>
                <Card className="mb-2 flex items-center gap-4" onClick={() => {}}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${done ? "bg-green/20 text-green" : "bg-surface2 text-muted"}`}>
                    {done ? "✓" : i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{l.title}</div>
                    <div className="text-xs text-muted">{l.minutes} min · {l.steps.filter((s) => s.type !== "explain").length} exercices · +{l.xp} XP</div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {(missions.length > 0 || arena.length > 0 || cases.length > 0 || mod.lessonIds.length === 0) && (
        <div className="mb-6">
          <div className="font-bold text-sm uppercase tracking-wider text-muted mb-2">Entraînement pratique</div>
          <div className="grid md:grid-cols-2 gap-3">
            {missions.map((m) => (
              <Link key={m.id} to={`/desk/${m.id}`}><Card className="h-full" onClick={() => {}}>
                <Tag color="purple">💼 Mission</Tag>
                <div className="font-semibold text-sm mt-2">{m.title}</div>
              </Card></Link>
            ))}
            {cases.map((c) => (
              <Link key={c.id} to={`/dealroom/${c.id}`}><Card className="h-full" onClick={() => {}}>
                <Tag color="accent">🏢 Case</Tag>
                <div className="font-semibold text-sm mt-2">{c.title}</div>
              </Card></Link>
            ))}
            {arena.map((a) => (
              <Link key={a.id} to={`/arena/${a.id}`}><Card className="h-full" onClick={() => {}}>
                <Tag color="gold">🎤 Interview</Tag>
                <div className="font-semibold text-sm mt-2">{a.title}</div>
              </Card></Link>
            ))}
            {bankCount > 0 && (
              <Link to="/redbook"><Card className="h-full" onClick={() => {}}>
                <Tag color="red">📕 Red Book</Tag>
                <div className="font-semibold text-sm mt-2">{bankCount} questions {TOPIC_TO_BANK[mod.topic]} dans la banque</div>
              </Card></Link>
            )}
          </div>
        </div>
      )}

      {boss && (
        <Card className={`border-2 ${bossResults[boss.id]?.passed ? "border-green/50" : "border-gold/50"}`}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{boss.emoji}</div>
            <div className="flex-1">
              <div className="font-bold">{boss.title}</div>
              <div className="text-sm text-muted">{boss.quizIds.length} questions chronométrées ({boss.timeLimitMin} min) + 1 réponse écrite · ≥{boss.passScore}% pour valider · Badge : {boss.badge}</div>
              {bossResults[boss.id] && <div className="text-sm mt-1">Meilleur score : <b>{bossResults[boss.id].score}%</b> {bossResults[boss.id].passed ? "🏅" : "— retente-le !"}</div>}
            </div>
            <Link to={`/boss/${boss.id}`}><Btn kind={allDone || mod.lessonIds.length === 0 ? "gold" : "ghost"}>{bossResults[boss.id]?.passed ? "Rejouer" : "Affronter"}</Btn></Link>
          </div>
          {!allDone && mod.lessonIds.length > 0 && <p className="text-xs text-muted mt-3">Conseil : termine les leçons avant d'affronter le boss (mais rien ne t'en empêche 😈).</p>}
        </Card>
      )}
    </div>
  );
}
