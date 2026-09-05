import { useEffect, useMemo, useRef, useState } from "react";
import { Card, PageTitle, Btn, Tag, Stat } from "../components/ui";
import { EXCEL_SHORTCUTS, EXCEL_CONVENTIONS, EXCEL_FORMULAS, EXCEL_ERRORS, type ExcelShortcut } from "../data/excel";
import { useProgress } from "../store/progress";

const TABS = ["Raccourcis", "Shortcut Arena", "Conventions", "Formules", "Erreurs"] as const;
const CATEGORIES = ["Navigation", "Sélection", "Édition", "Formatage", "Formules & audit", "Feuilles & fenêtre"] as const;

// ─── Référence des raccourcis ───────────────────────────────────────────────
function Reference() {
  const [os, setOs] = useState<"win" | "mac">("win");
  const [cat, setCat] = useState<string>("all");
  const list = EXCEL_SHORTCUTS.filter((s) => cat === "all" || s.category === cat);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex rounded-lg overflow-hidden border border-border text-xs font-bold">
          <button onClick={() => setOs("win")} className={`px-3 py-1.5 ${os === "win" ? "bg-accent text-white" : "bg-surface2 text-muted"}`}>Windows</button>
          <button onClick={() => setOs("mac")} className={`px-3 py-1.5 ${os === "mac" ? "bg-accent text-white" : "bg-surface2 text-muted"}`}>Mac</button>
        </div>
        <button onClick={() => setCat("all")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${cat === "all" ? "bg-accent/15 text-accent border-accent/40" : "border-border text-muted"}`}>Tout</button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${cat === c ? "bg-accent/15 text-accent border-accent/40" : "border-border text-muted"}`}>{c}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        {list.map((sc) => (
          <div key={sc.id} className="flex items-center justify-between gap-3 min-w-0 bg-surface border border-border rounded-xl px-4 py-2.5">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{sc.action}</div>
              {sc.why && <div className="text-[11px] text-muted truncate">{sc.why}</div>}
            </div>
            <kbd className="shrink-0 max-w-[45%] bg-surface2 border border-border rounded-lg px-2.5 py-1 text-xs font-bold text-accent text-right">{os === "win" ? sc.win : sc.mac}</kbd>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted mt-4">💡 Objectif desk : zéro souris pour naviguer, formater et tirer des formules. Entraîne-toi dans l'Arena ci-dessus, puis reproduis dans un vrai classeur.</p>
    </div>
  );
}

// ─── Shortcut Arena ─────────────────────────────────────────────────────────
const ROUNDS = 10;
function Arena() {
  const { arcade, recordArcade, recordSkill } = useProgress();
  const [os, setOs] = useState<"win" | "mac">("win");
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [current, setCurrent] = useState<{ q: ExcelShortcut; choices: string[] } | null>(null);
  const [flash, setFlash] = useState<"" | "good" | "bad">("");
  const startRef = useRef(0);

  const pool = useMemo(() => EXCEL_SHORTCUTS.filter((s) => (os === "win" ? s.win : s.mac) !== "—"), [os]);

  const key = (s: ExcelShortcut) => (os === "win" ? s.win : s.mac);

  const nextQuestion = () => {
    const q = pool[Math.floor(Math.random() * pool.length)];
    const wrong = pool.filter((s) => key(s) !== key(q));
    const distractors = [...wrong].sort(() => Math.random() - 0.5).slice(0, 3).map(key);
    const choices = [...distractors, key(q)].sort(() => Math.random() - 0.5);
    setCurrent({ q, choices });
    startRef.current = performance.now();
  };

  const start = () => {
    setPhase("playing"); setRound(1); setScore(0); setCorrect(0); setTimes([]); setFlash("");
    nextQuestion();
  };

  const answer = (choice: string) => {
    if (!current || flash) return;
    const ms = performance.now() - startRef.current;
    const good = choice === key(current.q);
    setTimes((t) => [...t, ms]);
    if (good) {
      // points : 100 de base + bonus vitesse (max 100 si < 1,5 s)
      const bonus = Math.max(0, Math.round(100 * (1 - Math.min(ms, 6000) / 6000)));
      setScore((s) => s + 100 + bonus);
      setCorrect((c) => c + 1);
    }
    recordSkill("Excel", good);
    setFlash(good ? "good" : "bad");
    setTimeout(() => {
      setFlash("");
      if (round >= ROUNDS) {
        setPhase("done");
      } else {
        setRound((r) => r + 1);
        nextQuestion();
      }
    }, good ? 350 : 1100);
  };

  useEffect(() => {
    if (phase === "done") {
      const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
      recordArcade(score, correct / ROUNDS, Math.round(avgMs));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "idle" || phase === "done") {
    const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    return (
      <div>
        {phase === "done" && (
          <Card className="mb-4 text-center">
            <div className="text-3xl font-black text-accent">{score} pts</div>
            <div className="text-sm text-muted mt-1">{correct}/{ROUNDS} corrects · {(avgMs / 1000).toFixed(1).replace(".", ",")} s de moyenne</div>
            {score >= arcade.best && score > 0 && <div className="text-gold font-bold text-sm mt-2">🏆 Nouveau record !</div>}
          </Card>
        )}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Stat label="Record" value={arcade.best} sub="points" />
          <Stat label="Parties" value={arcade.plays} />
          <Stat label="Dernière précision" value={arcade.history.length ? `${Math.round(arcade.history[arcade.history.length - 1].accuracy * 100)}%` : "—"} />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-border text-xs font-bold">
            <button onClick={() => setOs("win")} className={`px-3 py-1.5 ${os === "win" ? "bg-accent text-white" : "bg-surface2 text-muted"}`}>Windows</button>
            <button onClick={() => setOs("mac")} className={`px-3 py-1.5 ${os === "mac" ? "bg-accent text-white" : "bg-surface2 text-muted"}`}>Mac</button>
          </div>
          <Btn onClick={start}>{phase === "done" ? "Rejouer" : "Lancer l'Arena"} ⚡</Btn>
        </div>
        <p className="text-xs text-muted mt-3">{ROUNDS} commandes, 4 choix. 100 pts par bonne réponse + bonus vitesse. La vitesse compte : sur un desk, ces gestes doivent être des réflexes.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 text-xs font-bold">
        <span className="text-muted">Question {round}/{ROUNDS}</span>
        <span className="text-accent">{score} pts</span>
      </div>
      <Card className={flash === "good" ? "border-green/60" : flash === "bad" ? "border-red/60" : ""}>
        <div className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-1">{current?.q.category}</div>
        <div className="text-lg font-bold">{current?.q.action}</div>
        {flash === "bad" && <div className="text-red text-sm font-semibold mt-2">✗ C'était : {current && key(current.q)}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          {current?.choices.map((c) => (
            <button key={c} onClick={() => answer(c)} disabled={!!flash}
              className={`px-4 py-3 rounded-xl border text-sm font-bold transition-colors ${
                flash && current && c === key(current.q) ? "bg-green/15 border-green/60 text-green"
                : "bg-surface2 border-border hover:border-accent/60 text-ink"}`}>
              {c}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Onglets statiques ──────────────────────────────────────────────────────
function Conventions() {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {EXCEL_CONVENTIONS.map((c) => (
        <Card key={c.rule} className="!p-4">
          <div className="font-bold text-sm">{c.rule}</div>
          <p className="text-xs text-muted mt-1 leading-relaxed">{c.detail}</p>
        </Card>
      ))}
    </div>
  );
}

function Formulas() {
  return (
    <div className="space-y-2">
      {EXCEL_FORMULAS.map((f) => (
        <Card key={f.name} className="!p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm">{f.name}</span>
            <code className="text-[11px] bg-surface2 border border-border rounded px-2 py-0.5 text-accent break-all">{f.syntax}</code>
          </div>
          <p className="text-xs text-muted mt-1.5 leading-relaxed">{f.use}</p>
        </Card>
      ))}
    </div>
  );
}

function Errors() {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {EXCEL_ERRORS.map((e) => (
        <Card key={e.code} className="!p-4">
          <div className="flex items-center gap-2"><Tag color="red">{e.code}</Tag><span className="text-sm font-semibold">{e.meaning}</span></div>
          <p className="text-xs text-muted mt-1.5">{e.fix}</p>
        </Card>
      ))}
    </div>
  );
}

export default function Excel() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Raccourcis");
  return (
    <div>
      <PageTitle emoji="🟩" title="Excel Lab" sub="Le vrai outil de travail de l'analyste. Raccourcis banking, conventions de modeling professionnelles, formules clés — et une arena chronométrée pour en faire des réflexes." />
      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${tab === t ? "bg-accent/15 text-accent border-accent/40" : "bg-surface text-muted border-border hover:text-ink"}`}>
            {t}
          </button>
        ))}
      </div>
      {tab === "Raccourcis" && <Reference />}
      {tab === "Shortcut Arena" && <Arena />}
      {tab === "Conventions" && <Conventions />}
      {tab === "Formules" && <Formulas />}
      {tab === "Erreurs" && <Errors />}
    </div>
  );
}
