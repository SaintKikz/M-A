import { useState } from "react";
import { Card, PageTitle, Btn, Tag } from "../components/ui";
import { JURISDICTIONS, FIND_IT, type Jurisdiction } from "../data/publicmna";

function JurisdictionView({ j }: { j: Jurisdiction }) {
  return (
    <div className="space-y-4">
      <Card className="!p-4">
        <p className="text-sm leading-relaxed">{j.intro}</p>
      </Card>

      <div>
        <div className="text-xs font-bold text-muted uppercase tracking-wide mb-2">Les documents</div>
        <div className="grid md:grid-cols-2 gap-3">
          {j.documents.map((d) => (
            <Card key={d.name} className="!p-4">
              <div className="font-bold text-sm">{d.name}</div>
              <p className="text-xs text-muted mt-1 leading-relaxed">{d.purpose}</p>
              <div className="mt-2 rounded-lg bg-accent/10 border border-accent/30 px-3 py-2">
                <div className="text-[10px] font-bold text-accent uppercase tracking-wide mb-0.5">Ce que tu en fais</div>
                <p className="text-xs leading-relaxed">{d.analystUse}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-bold text-muted uppercase tracking-wide mb-2">La méthode</div>
        <Card>
          <ol className="space-y-2">
            {j.workflow.map((w, i) => (
              <li key={w} className="flex gap-3 text-sm">
                <span className="text-accent font-mono shrink-0 font-bold">{i + 1}.</span>
                <span className="leading-relaxed">{w}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div>
        <div className="text-xs font-bold text-muted uppercase tracking-wide mb-2">Sources officielles</div>
        <div className="grid md:grid-cols-2 gap-3">
          {j.resources.map((r) => (
            <Card key={r.url} className="!p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold text-sm leading-snug">{r.title}</div>
                  <div className="text-[11px] text-muted mt-0.5">{r.org}</div>
                </div>
                <a href={r.url} target="_blank" rel="noreferrer noopener" className="text-xs font-bold text-accent hover:underline shrink-0">Ouvrir ↗</a>
              </div>
              <p className="text-xs text-muted mt-2 leading-relaxed">{r.use}</p>
              <div className="text-[10px] text-muted mt-2 pt-2 border-t border-border">
                Vérifié : {r.verified}
                {r.note && <span className="block text-gold mt-0.5">⚠️ {r.note}</span>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function FindIt() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);
  const item = FIND_IT[idx];
  const next = () => { setIdx((idx + 1) % FIND_IT.length); setShow(false); };

  return (
    <div>
      <Card className="mb-4 !p-4 border-accent/30">
        <p className="text-sm">
          <b>Trouve-le dans le filing.</b> Savoir qu'un document existe ne sert à rien si tu ne sais pas
          quelle section ouvrir. Réponds mentalement, puis compare.
        </p>
      </Card>

      <Card>
        <div className="text-xs text-muted font-semibold mb-2">Question {idx + 1} / {FIND_IT.length}</div>
        <p className="font-semibold leading-snug">{item.q}</p>

        {show ? (
          <div className="mt-4 rounded-xl border border-green/40 bg-green/5 px-4 py-3 fade-up">
            <div className="text-[10px] font-bold text-green uppercase tracking-wide mb-1">Réponse</div>
            <p className="text-sm leading-relaxed">{item.a}</p>
          </div>
        ) : (
          <div className="mt-4"><Btn onClick={() => setShow(true)}>Voir la réponse →</Btn></div>
        )}

        {show && <div className="mt-4"><Btn kind="ghost" onClick={next}>Question suivante →</Btn></div>}
      </Card>
    </div>
  );
}

export default function PublicMna() {
  const [tab, setTab] = useState<string>("us");
  const active = JURISDICTIONS.find((j) => j.id === tab);

  return (
    <div>
      <PageTitle emoji="🏛️" title="M&A public" sub="Les documents d'une transaction cotée, par juridiction — et où trouver ce qu'un banquier cherche vraiment dedans." />

      <div className="flex flex-wrap gap-2 mb-5">
        {JURISDICTIONS.map((j) => (
          <button key={j.id} onClick={() => setTab(j.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${tab === j.id ? "bg-accent text-white" : "bg-surface2 text-muted hover:text-ink"}`}>
            {j.emoji} {j.label}
          </button>
        ))}
        <button onClick={() => setTab("find")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${tab === "find" ? "bg-accent text-white" : "bg-surface2 text-muted hover:text-ink"}`}>
          🔍 Trouve-le dans le filing
        </button>
      </div>

      {tab === "find" ? <FindIt /> : active ? <JurisdictionView j={active} /> : null}

      <Card className="mt-5 border-gold/40 !p-4">
        <div className="flex items-start gap-2">
          <Tag color="gold">Important</Tag>
        </div>
        <p className="text-xs text-muted leading-relaxed mt-2">
          Contenu <b>pédagogique</b>, jamais un conseil juridique. Aucun seuil ni délai chiffré n'est donné ici
          volontairement : ces règles varient par juridiction et évoluent. En entretien comme sur un deal, la
          bonne réponse est toujours « je retourne à la source officielle et je date ma vérification » — pas un
          chiffre récité. Chaque lien ci-dessus porte sa date de dernière vérification.
        </p>
      </Card>
    </div>
  );
}
