import { useState } from "react";
import { Card, PageTitle, Tag } from "../components/ui";
import { DEAL_DOCS, DOC_STAGES, type DealDoc } from "../data/dealdocs";

const SIDE_COLOR: Record<DealDoc["side"], string> = {
  "sell-side": "accent", "buy-side": "purple", "les deux": "muted",
};

function DocCard({ doc }: { doc: DealDoc }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="!p-4">
      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Tag color={SIDE_COLOR[doc.side]}>{doc.side}</Tag>
            <span className="text-[11px] text-muted">{doc.stage}</span>
          </div>
          <div className="font-bold text-sm">{doc.name}{doc.fr && <span className="text-muted font-normal"> · {doc.fr}</span>}</div>
          <p className="text-xs text-muted mt-1 leading-relaxed">{doc.what}</p>
        </div>
        <span className="text-muted shrink-0">{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-border space-y-2.5 text-xs fade-up">
          <div>
            <div className="font-bold text-muted uppercase tracking-wide text-[10px] mb-0.5">Qui le produit</div>
            <p className="leading-relaxed">{doc.producedBy}</p>
          </div>
          <div className="rounded-lg bg-accent/10 border border-accent/30 px-3 py-2">
            <div className="font-bold text-accent uppercase tracking-wide text-[10px] mb-0.5">Ton rôle d'analyste</div>
            <p className="leading-relaxed">{doc.analystRole}</p>
          </div>
          <div className="rounded-lg bg-red/10 border border-red/30 px-3 py-2">
            <div className="font-bold text-red uppercase tracking-wide text-[10px] mb-0.5">Le piège</div>
            <p className="leading-relaxed">{doc.trap}</p>
          </div>
          {doc.example && (
            <div className="rounded-lg bg-surface2 px-3 py-2">
              <div className="font-bold text-muted uppercase tracking-wide text-[10px] mb-0.5">Exemple (fictif)</div>
              <p className="italic leading-relaxed">{doc.example}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default function DealDocs() {
  const [stage, setStage] = useState<string>("all");
  const [side, setSide] = useState<string>("all");
  const shown = DEAL_DOCS.filter((d) =>
    (stage === "all" || d.stage === stage) &&
    (side === "all" || d.side === side || d.side === "les deux"));

  return (
    <div>
      <PageTitle emoji="📄" title="Les documents du deal" sub="De la pitch au closing : ce qu'est chaque document, qui le produit, ce que TOI tu fais dessus, et le piège qui coûte cher. Tous les exemples sont fictifs." />

      <div className="mb-5">
        <div className="flex flex-wrap gap-1.5 mb-2">
          <button onClick={() => setStage("all")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${stage === "all" ? "bg-accent/15 text-accent border-accent/40" : "border-border text-muted hover:text-ink"}`}>Tout le process</button>
          {DOC_STAGES.map((s) => (
            <button key={s} onClick={() => setStage(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${stage === s ? "bg-accent/15 text-accent border-accent/40" : "border-border text-muted hover:text-ink"}`}>{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", "sell-side", "buy-side"].map((s) => (
            <button key={s} onClick={() => setSide(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${side === s ? "bg-accent2/15 text-accent2 border-accent2/40" : "border-border text-muted hover:text-ink"}`}>
              {s === "all" ? "Les deux côtés" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline du process */}
      <Card className="mb-5 !p-4 overflow-x-auto">
        <div className="text-xs font-bold text-muted uppercase tracking-wide mb-3">Chronologie d'un process sell-side</div>
        <div className="flex items-center gap-1 min-w-[560px]">
          {DOC_STAGES.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <button onClick={() => setStage(s)}
                className={`flex-1 text-center px-2 py-2 rounded-lg text-[11px] font-semibold border transition-colors ${stage === s ? "bg-accent/15 text-accent border-accent/40" : "bg-surface2 border-border text-muted hover:text-ink"}`}>
                {s}
                <div className="text-[10px] font-normal opacity-70 mt-0.5">{DEAL_DOCS.filter((d) => d.stage === s).length} doc.</div>
              </button>
              {i < DOC_STAGES.length - 1 && <span className="text-muted text-xs shrink-0">→</span>}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        {shown.map((d) => <DocCard key={d.id} doc={d} />)}
      </div>
      {shown.length === 0 && <p className="text-sm text-muted text-center py-8">Aucun document avec ces filtres.</p>}
    </div>
  );
}
