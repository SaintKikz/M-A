import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, PageTitle, Btn, ScoreRing } from "../components/ui";
import { SkillRadar } from "../components/Radar";
import { QUIZ } from "../data/quiz";
import { EXCEL_SHORTCUTS } from "../data/excel";
import { useProgress, topicToSkill, deskReadyScore, SKILLS, type Skill } from "../store/progress";
import { QuizCard } from "../components/QuizPlayer";
import type { QuizItem } from "../lib/types";

// ─── Construction du diagnostic : 3 questions par compétence ────────────────
const PER_SKILL = 3;

function buildDiagnostic(): { item: QuizItem; skill: Skill }[] {
  const bySkill = new Map<Skill, QuizItem[]>();
  for (const q of QUIZ) {
    // EV/Equity est extrait de Valuation via les tags bridge
    const skill: Skill = q.tags.some((t) => t.includes("ev-bridge") || t.includes("diluted") || t.includes("treasury"))
      ? "EV/Equity" : topicToSkill(q.topic);
    const arr = bySkill.get(skill) ?? [];
    arr.push(q);
    bySkill.set(skill, arr);
  }
  const out: { item: QuizItem; skill: Skill }[] = [];
  for (const skill of SKILLS) {
    if (skill === "Excel") continue; // géré via questions raccourcis
    const pool = [...(bySkill.get(skill) ?? [])].sort(() => Math.random() - 0.5);
    // privilégie un mix de difficultés : 1 facile, 1 moyen, 1 dur si possible
    const sorted = [
      pool.find((q) => q.difficulty <= 2),
      pool.find((q) => q.difficulty === 3),
      pool.find((q) => q.difficulty >= 4) ?? pool.find((q) => q.difficulty === 2),
    ].filter((q): q is QuizItem => q !== undefined);
    const chosen = [...new Set([...sorted, ...pool])].slice(0, PER_SKILL);
    for (const item of chosen) out.push({ item, skill });
  }
  // 3 questions Excel générées depuis les raccourcis (format MCQ)
  const shortcuts = [...EXCEL_SHORTCUTS].sort(() => Math.random() - 0.5).slice(0, PER_SKILL);
  for (const sc of shortcuts) {
    const wrong = EXCEL_SHORTCUTS.filter((x) => x.win !== sc.win).sort(() => Math.random() - 0.5).slice(0, 3).map((x) => x.win);
    const choices = [...wrong, sc.win].sort(() => Math.random() - 0.5);
    out.push({
      skill: "Excel",
      item: {
        id: `diag-xl-${sc.id}`, kind: "mcq", topic: "foundations", tags: ["excel"], difficulty: 2,
        prompt: `Excel (Windows) : ${sc.action}`, choices, answer: choices.indexOf(sc.win),
        explanation: sc.why ?? `Raccourci : ${sc.win}`,
      },
    });
  }
  return out;
}

export default function Diagnostic() {
  const { seedSkills, skillScores, diagnosticDone } = useProgress();
  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<{ skill: Skill; ok: boolean }[]>([]);
  const questions = useMemo(() => (phase === "run" ? buildDiagnostic() : []), [phase === "run"]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = (final: { skill: Skill; ok: boolean }[]) => {
    const scores: Record<string, number> = {};
    for (const skill of SKILLS) {
      const rs = final.filter((r) => r.skill === skill);
      if (rs.length) scores[skill] = Math.round((rs.filter((r) => r.ok).length / rs.length) * 100);
    }
    seedSkills(scores);
    setPhase("done");
    window.scrollTo(0, 0);
  };

  if (phase === "intro") {
    return (
      <div>
        <PageTitle emoji="🎯" title="Diagnostic Desk Ready" sub="24 questions couvrant les 8 compétences de l'analyste. Ton profil de départ calibre les recommandations — et il évoluera ensuite avec CHAQUE réponse que tu donnes dans l'app." />
        <Card>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <ul className="text-sm space-y-2 text-muted">
                <li>📊 3 questions par compétence : Accounting, Valuation, DCF, M&A, LBO, EV/Equity, Process, Excel</li>
                <li>⏱️ 15-20 minutes, sans pause idéalement</li>
                <li>🎯 Résultat : ton radar de compétences + Desk Ready Score /100</li>
                <li>🔁 Refaisable à tout moment (le nouveau résultat remplace l'ancien)</li>
              </ul>
              <div className="mt-5"><Btn onClick={() => { setPhase("run"); setIdx(0); setResults([]); setAnswered(false); }}>Commencer le diagnostic →</Btn></div>
              {diagnosticDone && <p className="text-xs text-muted mt-3">Tu as déjà un diagnostic enregistré — ton radar actuel est visible sur ton <Link className="text-accent" to="/profile">profil</Link>.</p>}
            </div>
            <div className="flex justify-center"><SkillRadar scores={skillScores} /></div>
          </div>
        </Card>
      </div>
    );
  }

  if (phase === "done") {
    const drs = deskReadyScore(skillScores);
    const weak = SKILLS.map((s) => ({ s, v: skillScores[s]?.score ?? 0 })).sort((a, b) => a.v - b.v).slice(0, 2);
    return (
      <div>
        <PageTitle emoji="🎯" title="Ton profil Desk Ready" />
        <Card className="text-center">
          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={drs ?? 0} size={120} />
            <div className="font-bold text-lg">Desk Ready Score</div>
            <p className="text-sm text-muted max-w-md">Ce score évolue en continu : chaque drill, chapitre, boss et mission le met à jour. Le diagnostic n'est que le point de départ.</p>
          </div>
          <div className="flex justify-center mt-4"><SkillRadar scores={skillScores} size={300} /></div>
          <div className="grid md:grid-cols-2 gap-3 mt-5 text-left">
            {weak.map((w) => (
              <div key={w.s} className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
                <div className="text-xs font-bold text-gold uppercase tracking-wide">Priorité</div>
                <div className="font-semibold text-sm mt-0.5">{w.s} — {Math.round(w.v)}/100</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-center mt-6 flex-wrap">
            <Link to="/plan"><Btn>Voir mon plan →</Btn></Link>
            <Link to="/drill"><Btn kind="ghost">Daily Drill ⚡</Btn></Link>
          </div>
        </Card>
      </div>
    );
  }

  const q = questions[idx];
  return (
    <div>
      <div className="flex items-center justify-between mb-4 text-xs font-bold">
        <span className="text-muted">Diagnostic — {idx + 1}/{questions.length}</span>
        <span className="text-accent">{q.skill}</span>
      </div>
      <div className="h-1.5 bg-surface2 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>
      <Card>
        <QuizCard key={q.item.id} item={q.item} source="diagnostic" onDone={(ok) => { setResults((r) => [...r, { skill: q.skill, ok }]); setAnswered(true); }} />
        {answered && (
          <div className="mt-5 flex justify-end">
            <Btn onClick={() => {
              if (idx + 1 >= questions.length) finish([...results]);
              else { setIdx(idx + 1); setAnswered(false); window.scrollTo(0, 0); }
            }}>{idx + 1 >= questions.length ? "Voir mon profil →" : "Suivante →"}</Btn>
          </div>
        )}
      </Card>
    </div>
  );
}
