import { useEffect, useMemo, useRef, useState } from "react";
import { Card, PageTitle, Btn, Tag, ScoreRing } from "../components/ui";
import { SCENARIOS, type AnalystTask, type DayScenario } from "../data/analystday";
import { gradeAnswer, gradeNumeric } from "../lib/grader";
import { useProgress } from "../store/progress";

const ROLE_COLOR: Record<AnalystTask["role"], string> = {
  Associate: "accent", VP: "purple", MD: "gold", "Analyste senior": "muted",
};

interface Result { taskId: string; correct: boolean; score: number; given: string }

// ─── Exécution d'une tâche ──────────────────────────────────────────────────
function TaskRunner({ task, onDone }: { task: AnalystTask; onDone: (r: Result) => void }) {
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<number | null>(null);
  const [order, setOrder] = useState<string[]>(() =>
    task.items ? [...task.items].sort(() => Math.random() - 0.5) : []);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const submit = () => {
    let correct = false, score = 0, given = "";
    if (task.kind === "mcq") {
      given = task.choices?.[picked ?? -1] ?? "";
      correct = picked === task.answer;
      score = correct ? 100 : 0;
    } else if (task.kind === "numeric") {
      given = input;
      correct = gradeNumeric(input, task.numericAnswer ?? 0, task.tolerance);
      score = correct ? 100 : 0;
    } else if (task.kind === "open") {
      given = input;
      const g = gradeAnswer(input, task.keywords ?? []);
      score = g.score;
      correct = g.score >= 60;
    } else {
      given = order.join(" → ");
      const right = order.filter((it, i) => it === task.items?.[i]).length;
      score = Math.round((right / (task.items?.length ?? 1)) * 100);
      correct = score >= 70;
    }
    const r = { taskId: task.id, correct, score, given };
    setResult(r); setDone(true);
    onDone(r);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };

  const canSubmit = task.kind === "mcq" ? picked !== null
    : task.kind === "order" ? true
    : input.trim().length >= (task.kind === "numeric" ? 1 : 20);

  return (
    <div>
      <div className="rounded-xl bg-surface2 border border-border p-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Tag color={ROLE_COLOR[task.role]}>{task.role}</Tag>
          <span className="text-xs font-semibold">{task.from}</span>
          <span className="text-[11px] text-muted ml-auto">{task.time}</span>
        </div>
        <div className="font-bold text-sm mb-1">{task.subject}</div>
        <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{task.body}</p>
        <div className="text-[11px] text-gold font-semibold mt-2">⏳ {task.deadline}</div>
      </div>

      <p className="font-semibold mb-3">{task.question}</p>

      {task.kind === "mcq" && (
        <div className="grid gap-2">
          {task.choices?.map((c, i) => {
            let cls = "border-border bg-surface2 hover:border-accent/60";
            if (done) {
              if (i === task.answer) cls = "border-green bg-green/10";
              else if (i === picked) cls = "border-red bg-red/10";
              else cls = "border-border bg-surface2 opacity-60";
            } else if (picked === i) cls = "border-accent bg-accent/10";
            return (
              <button key={i} disabled={done} onClick={() => setPicked(i)}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${cls}`}>
                <span className="font-mono text-muted mr-2">{String.fromCharCode(65 + i)}</span>{c}
              </button>
            );
          })}
        </div>
      )}

      {task.kind === "numeric" && (
        <div className="flex gap-2 items-center flex-wrap">
          <input value={input} onChange={(e) => setInput(e.target.value)} disabled={done} inputMode="decimal"
            placeholder="Ta réponse…"
            className="bg-surface2 border border-border rounded-xl px-4 py-3 w-44 outline-none focus:border-accent text-lg font-mono" />
          {task.unit && <span className="text-muted">{task.unit}</span>}
        </div>
      )}

      {task.kind === "open" && (
        <textarea value={input} onChange={(e) => setInput(e.target.value)} disabled={done} rows={6}
          placeholder="Rédige ta réponse comme tu l'enverrais vraiment…"
          className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 outline-none focus:border-accent text-sm leading-relaxed" />
      )}

      {task.kind === "order" && (
        <div className="space-y-1.5">
          {order.map((it, i) => {
            const rightHere = done && task.items?.[i] === it;
            return (
              <div key={it} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${done ? (rightHere ? "border-green/50 bg-green/5" : "border-red/40 bg-red/5") : "border-border bg-surface2"}`}>
                <span className="text-xs font-mono text-muted w-5 shrink-0">{i + 1}</span>
                <span className="text-sm flex-1">{it}</span>
                {!done && (
                  <span className="flex flex-col gap-0.5 shrink-0">
                    <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter"
                      className="text-xs px-1.5 rounded bg-border/60 disabled:opacity-30 hover:bg-accent/30">▲</button>
                    <button onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label="Descendre"
                      className="text-xs px-1.5 rounded bg-border/60 disabled:opacity-30 hover:bg-accent/30">▼</button>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!done && <div className="mt-4"><Btn onClick={submit} disabled={!canSubmit}>Envoyer ma réponse →</Btn></div>}

      {done && result && (
        <div className={`mt-4 rounded-xl border p-4 pop ${result.correct ? "border-green/50 bg-green/5" : "border-red/50 bg-red/5"}`}>
          <div className="font-bold mb-2">
            {result.correct ? `✅ Bien joué — ${result.score}/100` : `❌ ${result.score}/100`}
          </div>
          {task.kind === "order" && <div className="text-xs text-muted mb-2">Ordre attendu : {task.items?.join(" → ")}</div>}
          <div className="text-sm mb-2"><b>Réponse modèle :</b> <span className="whitespace-pre-line">{task.modelAnswer}</span></div>
          <p className="text-sm text-muted leading-relaxed border-t border-border pt-2 mt-2">💡 {task.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ─── La journée ─────────────────────────────────────────────────────────────
function Day({ scenario, onExit }: { scenario: DayScenario; onExit: () => void }) {
  const [phase, setPhase] = useState<"triage" | "work" | "done">("triage");
  const [queue, setQueue] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [answered, setAnswered] = useState(false);
  const startRef = useRef<number>(0);
  const { addXp, recordSkill, logMistake } = useProgress();

  // Timer persistant tant que la journée tourne (survit à la navigation interne)
  useEffect(() => {
    if (phase !== "work") return;
    if (!startRef.current) startRef.current = Date.now();
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const byUrgency = useMemo(
    () => [...scenario.tasks].sort((a, b) => b.urgency - a.urgency || a.time.localeCompare(b.time)),
    [scenario]);

  const toggle = (id: string) =>
    setQueue((q) => (q.includes(id) ? q.filter((x) => x !== id) : [...q, id]));

  // Score de priorisation : corrélation entre l'ordre choisi et l'urgence réelle
  const triageScore = useMemo(() => {
    if (queue.length !== scenario.tasks.length) return 0;
    const ideal = byUrgency.map((t) => t.id);
    let hits = 0;
    queue.forEach((id, i) => {
      const idealPos = ideal.indexOf(id);
      if (Math.abs(idealPos - i) <= 1) hits++;
    });
    return Math.round((hits / queue.length) * 100);
  }, [queue, byUrgency, scenario.tasks.length]);

  const tasksInOrder = queue.map((id) => scenario.tasks.find((t) => t.id === id)!).filter(Boolean);

  const finishTask = (r: Result) => {
    setResults((rs) => [...rs, r]);
    setAnswered(true);
    const task = tasksInOrder[idx];
    recordSkill(task.skill as never, r.correct);
    if (!r.correct) {
      logMistake({
        qid: `ad-${scenario.id}-${task.id}`, source: "other", topic: task.skill,
        prompt: `${task.subject} — ${task.question}`,
        userAnswer: r.given, correctAnswer: task.modelAnswer, explanation: task.explanation,
      });
    }
  };

  if (phase === "triage") {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">📥 Ta boîte de réception</h2>
          <button onClick={onExit} className="text-xs text-muted hover:text-ink">← Changer de journée</button>
        </div>
        <Card className="mb-4 !p-4">
          <p className="text-sm text-muted leading-relaxed">{scenario.intro}</p>
        </Card>
        <Card className="mb-4 !p-4 border-accent/40">
          <p className="text-sm"><b>Étape 1 — priorise.</b> Clique sur les messages dans l'ordre où tu vas les traiter. Ton ordre est noté : en banque, savoir quoi faire d'abord vaut autant que savoir le faire.</p>
        </Card>

        <div className="space-y-2">
          {scenario.tasks.map((t) => {
            const pos = queue.indexOf(t.id);
            return (
              <button key={t.id} onClick={() => toggle(t.id)}
                className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${pos >= 0 ? "border-accent/50 bg-accent/10" : "border-border bg-surface hover:border-accent/30"}`}>
                <div className="flex items-start gap-3">
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${pos >= 0 ? "bg-accent text-white" : "bg-surface2 text-muted"}`}>
                    {pos >= 0 ? pos + 1 : "·"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag color={ROLE_COLOR[t.role]}>{t.role}</Tag>
                      <span className="text-xs font-semibold">{t.from}</span>
                      <span className="text-[11px] text-muted">{t.time}</span>
                      <span className="text-[11px] text-gold ml-auto">{t.deadline}</span>
                    </div>
                    <div className="font-semibold text-sm mt-1">{t.subject}</div>
                    <p className="text-xs text-muted mt-0.5 line-clamp-2">{t.body}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Btn onClick={() => { setPhase("work"); window.scrollTo(0, 0); }} disabled={queue.length !== scenario.tasks.length}>
            Commencer la journée ({queue.length}/{scenario.tasks.length}) →
          </Btn>
          {queue.length > 0 && <button onClick={() => setQueue([])} className="text-xs text-muted hover:text-ink">Réinitialiser</button>}
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const avg = results.length ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length) : 0;
    const global = Math.round(avg * 0.75 + triageScore * 0.25);
    const mins = Math.floor(elapsed / 60);
    return (
      <div>
        <Card className="text-center">
          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={global} size={120} />
            <div className="font-bold text-lg">Journée terminée</div>
            <p className="text-sm text-muted">{mins} min · {results.filter((r) => r.correct).length}/{results.length} tâches réussies</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
            <div className="bg-surface2 rounded-xl px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">Exécution</div>
              <div className="text-xl font-bold text-accent mt-0.5">{avg}/100</div>
            </div>
            <div className="bg-surface2 rounded-xl px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">Priorisation</div>
              <div className="text-xl font-bold text-gold mt-0.5">{triageScore}/100</div>
            </div>
            <div className="bg-surface2 rounded-xl px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">Temps</div>
              <div className="text-xl font-bold mt-0.5">{mins} min</div>
            </div>
          </div>
          <div className="mt-5 text-left space-y-2">
            <div className="text-xs font-bold text-muted uppercase tracking-wide">Ordre de traitement idéal</div>
            {byUrgency.map((t, i) => {
              const yours = queue.indexOf(t.id);
              return (
                <div key={t.id} className="flex items-center gap-2 text-xs">
                  <span className="w-5 text-muted font-mono">{i + 1}</span>
                  <span className="flex-1">{t.subject}</span>
                  <span className={Math.abs(yours - i) <= 1 ? "text-green" : "text-red"}>
                    ta position : {yours + 1}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 justify-center mt-6 flex-wrap">
            <Btn onClick={onExit}>Autre journée →</Btn>
            <Btn kind="ghost" onClick={() => { setPhase("triage"); setQueue([]); setIdx(0); setResults([]); setElapsed(0); startRef.current = 0; setAnswered(false); }}>Recommencer 🔁</Btn>
          </div>
        </Card>
      </div>
    );
  }

  const task = tasksInOrder[idx];
  return (
    <div>
      <div className="sticky top-2 z-20 mb-4 bg-surface border border-border rounded-xl px-4 py-2.5 flex items-center gap-4">
        <div className="text-xs font-semibold text-muted">Tâche {idx + 1}/{tasksInOrder.length}</div>
        <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(idx / tasksInOrder.length) * 100}%` }} />
        </div>
        <div className="text-xs font-mono text-gold">⏱ {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}</div>
      </div>

      <Card>
        <TaskRunner key={task.id} task={task} onDone={finishTask} />
      </Card>

      {answered && (
        <div className="mt-5 flex justify-end">
          <Btn onClick={() => {
            if (idx + 1 >= tasksInOrder.length) {
              const avg = Math.round([...results].reduce((a, r) => a + r.score, 0) / Math.max(1, results.length));
              addXp(60 + Math.round(avg / 2));
              setPhase("done");
            } else { setIdx(idx + 1); setAnswered(false); }
            window.scrollTo(0, 0);
          }}>
            {idx + 1 >= tasksInOrder.length ? "Terminer la journée →" : "Tâche suivante →"}
          </Btn>
        </div>
      )}
    </div>
  );
}

export default function AnalystDay() {
  const [active, setActive] = useState<DayScenario | null>(null);

  if (active) {
    return (
      <div>
        <PageTitle emoji="🌆" title={active.title} sub={`Difficulté : ${active.difficulty}`} />
        <Day scenario={active} onExit={() => setActive(null)} />
      </div>
    );
  }

  return (
    <div>
      <PageTitle emoji="🌆" title="Analyst Day" sub="Une vraie journée d'analyste : les demandes arrivent en désordre, avec des urgences différentes. Tu priorises, tu exécutes, tu es noté sur les deux." />
      <div className="grid md:grid-cols-2 gap-4">
        {SCENARIOS.map((s) => (
          <Card key={s.id} className="cursor-pointer flex flex-col" onClick={() => { setActive(s); window.scrollTo(0, 0); }}>
            <div className="flex items-center gap-2 mb-2">
              <Tag color={s.difficulty === "Standard" ? "green" : s.difficulty === "Chargée" ? "gold" : "red"}>{s.difficulty}</Tag>
              <span className="text-xs text-muted">{s.tasks.length} tâches</span>
            </div>
            <div className="font-bold">{s.title}</div>
            <p className="text-sm text-muted mt-1.5 leading-relaxed flex-1">{s.intro.slice(0, 180)}…</p>
            <div className="text-xs font-semibold text-accent mt-3">Commencer la journée →</div>
          </Card>
        ))}
      </div>
      <Card className="mt-4 !p-4 border-accent/30">
        <p className="text-xs text-muted leading-relaxed">
          <b className="text-ink">Comment tu es noté :</b> 75% sur l'exécution (justesse des réponses) et 25% sur la priorisation
          (l'ordre dans lequel tu traites les demandes). Un analyste qui fait un travail parfait dans le mauvais ordre
          rate quand même sa journée. Toutes les sociétés et personnes citées sont fictives.
        </p>
      </Card>
    </div>
  );
}
