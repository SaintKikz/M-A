import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Recherche globale (Cmd/Ctrl+K) ────────────────────────────────────────
interface Hit { kind: string; title: string; sub: string; to: string; keywords: string }

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

async function buildIndex(): Promise<Hit[]> {
  const hits: Hit[] = [];
  const pages: [string, string, string][] = [
    ["Dashboard", "Vue d'ensemble et prochaine session", "/"],
    ["Académie", "Chapitres théoriques par niveau", "/academy"],
    ["Interview Track", "Parcours de préparation entretien", "/path"],
    ["Daily Drill", "10 questions quotidiennes adaptatives", "/drill"],
    ["Outils", "Calculateurs : DCF, WACC, LBO, merger…", "/tools"],
    ["Excel Lab", "Raccourcis banking + Shortcut Arena", "/excel"],
    ["Analyst Desk", "Missions d'analyste chronométrées", "/desk"],
    ["Deal Room", "Cas M&A complets", "/dealroom"],
    ["Interview Arena", "Simulations d'entretien", "/arena"],
    ["Flashcards", "Révision espacée (SRS)", "/flashcards"],
    ["Red Book Bank", "Banque de questions d'entretien", "/redbook"],
    ["Mistake Book", "Journal d'erreurs et retry", "/mistakes"],
    ["Analyst Day", "Simulation d'une journée d'analyste", "/analystday"],
    ["Diagnostic", "Évaluation d'entrée : Desk Ready Score", "/diagnostic"],
    ["Documents du deal", "Teaser → SPA : qui produit quoi", "/dealdocs"],
    ["Buyer screening", "Trier un univers d'acheteurs", "/screening"],
    ["Ressources", "Formules, cheat sheets, bibliothèque", "/resources"],
    ["Glossaire", "200+ termes M&A", "/glossary"],
    ["Plan 8 semaines", "Programme de préparation", "/plan"],
    ["Profil", "Progression et compétences", "/profile"],
  ];
  for (const [title, sub, to] of pages) hits.push({ kind: "Page", title, sub, to, keywords: "" });
  const toolDefs: [string, string][] = [
    ["Bridge EV ↔ Equity", "bridge"], ["Actions diluées (TSM)", "tsm"], ["WACC builder", "wacc"],
    ["DCF", "dcf"], ["Accretion / Dilution", "merger"], ["LBO returns", "lbo"],
    ["IRR ↔ MOIC", "irrmoic"], ["CAGR & prime", "quick"], ["Football field", "field"],
  ];
  for (const [title, id] of toolDefs) hits.push({ kind: "Outil", title, sub: "Calculateur", to: `/tools/${id}`, keywords: "calculateur outil" });
  // Le contenu n'est chargé qu'à la première ouverture de la palette.
  const [{ GLOSSARY }, { BANK }, curriculum, { CHAPTERS }, { MISSIONS }, { CASES }, { REAL_DEALS }, { EXCEL_SHORTCUTS }] =
    await Promise.all([
      import("../data/glossary"), import("../data"), import("../data/curriculum"),
      import("../data/academy"), import("../data/missions"), import("../data/cases"),
      import("../data/realdeals"), import("../data/excel"),
    ]);
  const { LESSONS, MODULES, moduleById } = curriculum;

  for (const g of GLOSSARY) hits.push({ kind: "Glossaire", title: g.term, sub: g.definition.slice(0, 90), to: `/glossary?q=${encodeURIComponent(g.term)}`, keywords: g.tags.join(" ") + " " + (g.fr ?? "") });
  for (const c of CHAPTERS) hits.push({ kind: "Académie", title: c.title, sub: c.hook.slice(0, 90), to: `/academy/${c.id}`, keywords: "" });
  for (const l of LESSONS) hits.push({ kind: "Leçon", title: l.title, sub: moduleById[l.moduleId]?.title ?? "", to: `/lesson/${l.id}`, keywords: "" });
  for (const m of MODULES) hits.push({ kind: "Module", title: m.title, sub: m.description.slice(0, 90), to: `/path/${m.id}`, keywords: m.topic });
  for (const m of MISSIONS) hits.push({ kind: "Mission", title: m.title, sub: `${m.from} · ${m.minutes} min`, to: `/desk/${m.id}`, keywords: m.topic });
  for (const c of CASES) hits.push({ kind: "Cas", title: c.title, sub: `${c.sector} · ${c.level}`, to: `/dealroom/${c.id}`, keywords: c.buyer + " " + c.target });
  for (const d of REAL_DEALS) hits.push({ kind: "Deal", title: d.title, sub: d.sector, to: `/dealroom/${d.id}`, keywords: d.buyer + " " + d.target });
  for (const q of BANK) hits.push({ kind: "Question", title: q.question.slice(0, 90), sub: `${q.category} · ${q.sub}`, to: `/redbook?q=${encodeURIComponent(q.question.slice(0, 40))}`, keywords: q.tags.join(" ") });
  for (const s of EXCEL_SHORTCUTS) hits.push({ kind: "Raccourci", title: s.action, sub: `${s.mac} · ${s.win}`, to: "/excel", keywords: s.category });
  return hits;
}

let INDEX: Hit[] | null = null;
let loading: Promise<Hit[]> | null = null;

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [ready, setReady] = useState(INDEX !== null);
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQ(""); setSel(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); }, [open]);

  // Construction paresseuse de l'index au premier affichage
  useEffect(() => {
    if (!open || INDEX) return;
    loading ??= buildIndex().then((idx) => { INDEX = idx; return idx; });
    let alive = true;
    loading.then(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, [open]);

  const results = useMemo(() => {
    if (!open || !ready || !INDEX) return [];
    const nq = norm(q.trim());
    if (!nq) return INDEX.filter((h) => h.kind === "Page" || h.kind === "Outil").slice(0, 12);
    const terms = nq.split(/\s+/);
    return INDEX
      .map((h) => {
        const hay = norm(`${h.title} ${h.sub} ${h.keywords}`);
        if (!terms.every((t) => hay.includes(t))) return null;
        // score : titre > sous-titre, préfixe > inclusion
        const t = norm(h.title);
        const score = (t.startsWith(nq) ? 3 : t.includes(nq) ? 2 : 1) + (h.kind === "Page" || h.kind === "Outil" ? 0.5 : 0);
        return { h, score };
      })
      .filter((x): x is { h: Hit; score: number } => x !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((x) => x.h);
  }, [q, open, ready]);

  useEffect(() => { setSel(0); }, [q]);

  const go = (h: Hit) => { setOpen(false); nav(h.to); };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4" onClick={() => setOpen(false)}>
      <div className="w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden fade-up" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === "Enter" && results[sel]) go(results[sel]);
          }}
          placeholder="Rechercher : WACC, teaser, accretion, raccourci…"
          className="w-full bg-transparent px-5 py-4 text-sm outline-none border-b border-border text-ink placeholder:text-muted"
          aria-label="Recherche globale"
        />
        <div className="max-h-[50vh] overflow-y-auto py-1">
          {!ready && <div className="px-5 py-6 text-sm text-muted text-center">Indexation du contenu…</div>}
          {ready && results.length === 0 && <div className="px-5 py-6 text-sm text-muted text-center">Aucun résultat pour « {q} »</div>}
          {results.map((h, i) => (
            <button key={`${h.to}-${i}`} onClick={() => go(h)} onMouseEnter={() => setSel(i)}
              className={`w-full text-left px-5 py-2.5 flex items-center gap-3 ${i === sel ? "bg-accent/12" : ""}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 ${i === sel ? "bg-accent/20 text-accent" : "bg-surface2 text-muted"}`}>{h.kind}</span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink truncate">{h.title}</span>
                {h.sub && <span className="block text-xs text-muted truncate">{h.sub}</span>}
              </span>
            </button>
          ))}
        </div>
        <div className="px-5 py-2 border-t border-border text-[11px] text-muted flex gap-4">
          <span>↑↓ naviguer</span><span>⏎ ouvrir</span><span>esc fermer</span><span className="ml-auto">⌘K / Ctrl+K</span>
        </div>
      </div>
    </div>
  );
}
