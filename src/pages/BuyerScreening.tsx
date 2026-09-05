import { useMemo, useState } from "react";
import { Card, PageTitle, Btn, Tag, ScoreRing } from "../components/ui";
import { SCREENING, TIER_META, type Tier, type Buyer } from "../data/screening";
import { useProgress } from "../store/progress";

const TIERS: Tier[] = ["T1", "T2", "T3", "OUT"];

function BuyerCard({ b, assigned, onAssign, revealed }: {
  b: Buyer; assigned?: Tier; onAssign: (t: Tier) => void; revealed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const right = assigned === b.answer;
  return (
    <Card className={`!p-4 ${revealed ? (right ? "border-green/50" : "border-red/50") : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 cursor-pointer" onClick={() => setOpen(!open)}>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Tag color={b.kind === "Sponsor" ? "purple" : "accent"}>{b.kind}</Tag>
            <span className="text-[11px] text-muted">{b.geo}</span>
          </div>
          <div className="font-bold text-sm">{b.name}</div>
          <p className="text-xs text-muted mt-1 leading-relaxed">{b.profile}</p>
        </div>
        <span className="text-muted shrink-0 cursor-pointer" onClick={() => setOpen(!open)}>{open ? "−" : "+"}</span>
      </div>

      {open && (
        <div className="mt-2 space-y-1.5 text-xs fade-up">
          <div><span className="font-bold text-muted">Capacité :</span> {b.financials}</div>
          <div><span className="font-bold text-muted">Historique :</span> {b.history}</div>
        </div>
      )}

      <div className="flex gap-1.5 mt-3">
        {TIERS.map((t) => (
          <button key={t} onClick={() => onAssign(t)} disabled={revealed}
            className="flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-colors disabled:cursor-not-allowed bg-surface2 border-border text-muted enabled:hover:text-ink"
            style={assigned === t ? {
              background: `color-mix(in srgb, var(--color-${TIER_META[t].color}) 18%, transparent)`,
              borderColor: `var(--color-${TIER_META[t].color})`,
              color: `var(--color-${TIER_META[t].color})`,
            } : undefined}>
            {TIER_META[t].label}
          </button>
        ))}
      </div>

      {revealed && (
        <div className="mt-3 pt-3 border-t border-border text-xs fade-up">
          <div className="font-bold mb-1">
            {right ? <span className="text-green">✓ Correct — {TIER_META[b.answer].label}</span>
                   : <span className="text-red">✗ Réponse modèle : {TIER_META[b.answer].label}</span>}
          </div>
          <p className="text-muted leading-relaxed">{b.why}</p>
        </div>
      )}
    </Card>
  );
}

export default function BuyerScreening() {
  const [picks, setPicks] = useState<Record<string, Tier>>({});
  const [revealed, setRevealed] = useState(false);
  const { addXp } = useProgress();

  const total = SCREENING.buyers.length;
  const done = Object.keys(picks).length;
  const score = useMemo(
    () => Math.round((SCREENING.buyers.filter((b) => picks[b.id] === b.answer).length / total) * 100),
    [picks, total]);

  const submit = () => {
    setRevealed(true);
    addXp(40 + Math.round(score / 2));
    window.scrollTo(0, 0);
  };

  const grouped = TIERS.map((t) => ({ tier: t, buyers: SCREENING.buyers.filter((b) => picks[b.id] === t) }));

  return (
    <div>
      <PageTitle emoji="🎯" title="Buyer screening" sub="La tâche d'analyste par excellence : transformer un univers brut en liste d'acheteurs hiérarchisée et défendable." />

      {revealed && (
        <Card className="mb-5 text-center">
          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={score} size={100} />
            <div className="font-bold">
              {score >= 80 ? "Excellent tri — tu as le réflexe du fit stratégique."
               : score >= 60 ? "Bon tri, mais relis les justifications des erreurs."
               : "Le tri par taille ne suffit pas : relis chaque « pourquoi » ci-dessous."}
            </div>
            <p className="text-xs text-muted max-w-lg">
              Ce qui compte en entretien, ce n'est pas le tier exact — c'est ta capacité à justifier chaque classement en une phrase.
            </p>
          </div>
        </Card>
      )}

      {/* Brief */}
      <Card className="mb-5">
        <div className="text-xs font-bold text-muted uppercase tracking-wide mb-1">La cible (fictive)</div>
        <h2 className="font-bold text-lg">{SCREENING.target}</h2>
        <div className="text-xs text-accent font-semibold mb-2">{SCREENING.sector}</div>
        <p className="text-sm text-muted leading-relaxed">{SCREENING.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          {SCREENING.metrics.map((m) => (
            <div key={m.label} className="bg-surface2 rounded-lg px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-muted font-semibold">{m.label}</div>
              <div className="text-sm font-bold mt-0.5">{m.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
          <div className="text-[10px] font-bold text-accent uppercase tracking-wide mb-1">Ta mission</div>
          <p className="text-sm leading-relaxed">{SCREENING.mandate}</p>
        </div>
      </Card>

      {/* Légende des tiers */}
      <div className="grid md:grid-cols-4 gap-2 mb-5">
        {TIERS.map((t) => (
          <div key={t} className="bg-surface border border-border rounded-xl px-3 py-2.5">
            <div className="text-xs font-bold" style={{ color: `var(--color-${TIER_META[t].color})` }}>{TIER_META[t].label}</div>
            <p className="text-[11px] text-muted mt-0.5 leading-snug">{TIER_META[t].desc}</p>
            {done > 0 && <div className="text-[10px] text-muted mt-1">{grouped.find((g) => g.tier === t)?.buyers.length ?? 0} classé(s)</div>}
          </div>
        ))}
      </div>

      {/* Barre de progression + soumission */}
      {!revealed && (
        <div className="sticky top-2 z-20 mb-4 bg-surface border border-border rounded-xl px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <div className="text-xs font-semibold text-muted mb-1">{done}/{total} acheteurs classés</div>
            <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(done / total) * 100}%` }} />
            </div>
          </div>
          <Btn onClick={submit} disabled={done < total}>Valider mon tri →</Btn>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {SCREENING.buyers.map((b) => (
          <BuyerCard key={b.id} b={b} assigned={picks[b.id]} revealed={revealed}
            onAssign={(t) => setPicks((p) => ({ ...p, [b.id]: t }))} />
        ))}
      </div>

      {revealed && (
        <div className="mt-5 flex justify-center">
          <Btn kind="ghost" onClick={() => { setPicks({}); setRevealed(false); window.scrollTo(0, 0); }}>Recommencer 🔁</Btn>
        </div>
      )}
    </div>
  );
}
