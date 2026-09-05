import { useMemo, useState } from "react";
import { GLOSSARY } from "../data/glossary";
import { useProgress } from "../store/progress";
import { Card, PageTitle, Btn, Tag } from "../components/ui";

export default function Glossary() {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const { addCards } = useProgress();
  const [added, setAdded] = useState<string[]>([]);

  const filtered = useMemo(() =>
    GLOSSARY.filter((g) => (g.term + " " + g.definition + " " + g.tags.join(" ")).toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.term.localeCompare(b.term)),
    [search]);

  return (
    <div>
      <PageTitle emoji="📖" title="Glossaire" sub={`${GLOSSARY.length} termes essentiels : définition simple, version entretien, formule, exemple et erreur fréquente.`} />
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔎 EBITDA, WACC, locked-box…"
        className="bg-surface2 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent w-full max-w-md mb-5" />
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((g) => (
          <Card key={g.id} className="cursor-pointer" onClick={() => setOpenId(openId === g.id ? null : g.id)}>
            <div className="flex items-center justify-between">
              <div className="font-bold">{g.term}</div>
              <span className="text-muted">{openId === g.id ? "−" : "+"}</span>
            </div>
            <p className="text-sm text-muted mt-1">{g.definition}</p>
            {openId === g.id && (
              <div className="mt-3 space-y-2 fade-up" onClick={(e) => e.stopPropagation()}>
                <div className="rounded-lg bg-surface2 p-3">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-accent mb-1">Version entretien 🇬🇧</div>
                  <p className="text-sm italic">{g.interviewVersion}</p>
                </div>
                {g.formula && <p className="text-sm font-mono bg-surface2 rounded-lg p-2.5">🧮 {g.formula}</p>}
                {g.example && <p className="text-sm text-muted">🔢 <b>Exemple :</b> {g.example}</p>}
                {g.commonMistake && <p className="text-sm text-red/90">⚠️ <b>Erreur fréquente :</b> {g.commonMistake}</p>}
                <Btn kind="ghost" onClick={() => { addCards([`gl-${g.id}`]); setAdded([...added, g.id]); }} disabled={added.includes(g.id)}>
                  {added.includes(g.id) ? "✓ Ajouté" : "🃏 Add to Flashcards"}
                </Btn>
              </div>
            )}
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted py-8">Aucun terme trouvé.</p>}
      <div className="mt-6"><Tag color="muted">Astuce : chaque terme a sa « version entretien » en anglais — c'est celle qu'on te demandera.</Tag></div>
    </div>
  );
}
