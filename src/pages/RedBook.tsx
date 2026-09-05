import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BANK, BANK_CATEGORIES } from "../data";
import { useProgress } from "../store/progress";
import { Card, PageTitle, Tag, Btn, diffLabel, diffColor } from "../components/ui";
import { OpenAnswer } from "../components/OpenAnswer";
import type { BankQuestion } from "../lib/types";

const FREQ_COLOR: Record<string, string> = { "très fréquente": "red", fréquente: "gold", occasionnelle: "muted" };

function BankCard({ q }: { q: BankQuestion }) {
  const [open, setOpen] = useState(false);
  const [practice, setPractice] = useState(false);
  const { weakQuestions, toggleWeak, addCards } = useProgress();
  const isWeak = weakQuestions.includes(q.id);

  return (
    <Card className={isWeak ? "border-red/40" : ""}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 cursor-pointer" onClick={() => setOpen(!open)}>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <Tag color="accent">{q.category}</Tag>
            <Tag color="muted">{q.sub}</Tag>
            <Tag color={diffColor(q.difficulty)}>{diffLabel(q.difficulty)}</Tag>
            <Tag color={FREQ_COLOR[q.frequency]}>{q.frequency}</Tag>
            {q.english && <Tag color="purple">🇬🇧</Tag>}
          </div>
          <div className="font-semibold text-sm leading-snug">{q.question}</div>
        </div>
        <button onClick={() => setOpen(!open)} className="text-muted hover:text-ink text-lg shrink-0">{open ? "−" : "+"}</button>
      </div>

      {open && (
        <div className="mt-4 fade-up">
          {!practice ? (
            <>
              <div className="rounded-lg bg-surface2 p-3 mb-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-green mb-1">Réponse courte</div>
                <p className="text-sm">{q.shortAnswer}</p>
              </div>
              <div className="rounded-lg bg-surface2 p-3 mb-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-accent mb-1">Réponse complète</div>
                <p className="text-sm leading-relaxed">{q.fullAnswer}</p>
              </div>
              {q.intuition && <p className="text-sm text-muted mb-2">💡 <b>Intuition :</b> {q.intuition}</p>}
              {q.example && <p className="text-sm text-muted mb-2">🔢 <b>Exemple :</b> {q.example}</p>}
              {q.trap && <p className="text-sm text-red/90 mb-2">⚠️ <b>Piège :</b> {q.trap}</p>}
              <div className="flex gap-2 mt-3 flex-wrap">
                <Btn kind="ghost" onClick={() => setPractice(true)}>🏋️ Practice</Btn>
                <Btn kind="ghost" onClick={() => addCards([`rbfc-${q.id}`])}>🃏 Add to Flashcards</Btn>
                <Btn kind={isWeak ? "danger" : "ghost"} onClick={() => toggleWeak(q.id)}>{isWeak ? "✓ Marquée faible" : "🚩 Mark as Weak"}</Btn>
              </div>
            </>
          ) : (
            <div>
              <p className="text-xs text-muted mb-2">Mode practice : réponds AVANT de revoir la correction.</p>
              <OpenAnswer keywords={q.tags.concat(q.shortAnswer.split(" ").filter((w) => w.length > 8).slice(0, 3))}
                modelAnswer={`${q.shortAnswer}\n\n${q.fullAnswer}`} idealLengthWords={[30, 180]} />
              <Btn kind="ghost" className="mt-2" onClick={() => setPractice(false)}>← Retour à la fiche</Btn>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default function RedBook() {
  const [cat, setCat] = useState<string>("Toutes");
  const [freq, setFreq] = useState<string>("Toutes");
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [weakOnly, setWeakOnly] = useState(false);
  const { weakQuestions } = useProgress();

  const filtered = useMemo(() => BANK.filter((q) =>
    (cat === "Toutes" || q.category === cat) &&
    (freq === "Toutes" || q.frequency === freq) &&
    (!weakOnly || weakQuestions.includes(q.id)) &&
    (search === "" || (q.question + q.shortAnswer + q.sub).toLowerCase().includes(search.toLowerCase()))
  ), [cat, freq, search, weakOnly, weakQuestions]);

  return (
    <div>
      <PageTitle emoji="📕" title="Red Book Training Bank" sub="220 questions d'entretien reformulées et structurées à partir du programme du guide Wall Street Prep — réponse courte, complète, intuition, pièges. Commence par les « très fréquentes »." />
      <div className="flex flex-wrap gap-2 mb-4">
        {["Toutes", ...BANK_CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${cat === c ? "bg-accent text-white" : "bg-surface2 text-muted hover:text-ink"}`}>
            {c} {c !== "Toutes" && <span className="opacity-60">({BANK.filter((q) => q.category === c).length})</span>}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔎 Rechercher…"
          className="bg-surface2 border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-accent w-56" />
        {["Toutes", "très fréquente", "fréquente", "occasionnelle"].map((f) => (
          <button key={f} onClick={() => setFreq(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${freq === f ? "bg-gold text-black" : "bg-surface2 text-muted hover:text-ink"}`}>{f}</button>
        ))}
        <button onClick={() => setWeakOnly(!weakOnly)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${weakOnly ? "bg-red text-black" : "bg-surface2 text-muted hover:text-ink"}`}>
          🚩 Mes faiblesses ({weakQuestions.length})
        </button>
        <span className="text-xs text-muted ml-auto">{filtered.length} question(s)</span>
      </div>
      <div className="space-y-3">
        {filtered.slice(0, 60).map((q) => <BankCard key={q.id} q={q} />)}
        {filtered.length > 60 && <p className="text-center text-xs text-muted py-4">Affiné à 60 résultats — utilise les filtres pour cibler.</p>}
        {filtered.length === 0 && <p className="text-center text-muted py-8">Aucune question ne correspond à ces filtres.</p>}
      </div>
    </div>
  );
}
