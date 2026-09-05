import { Link } from "react-router-dom";
import { DECKS } from "../data/flashcards";
import { allCards } from "../lib/cards";
import { useProgress } from "../store/progress";
import { Card, PageTitle, Tag } from "../components/ui";

export default function Flashcards() {
  const { srs, activeCards } = useProgress();
  const now = new Date();

  return (
    <div>
      <PageTitle emoji="🃏" title="Flashcards" sub="Répétition espacée façon Anki : Again / Hard / Medium / Easy. Les cartes reviennent au bon moment — la régularité bat le bachotage." />
      <div className="grid md:grid-cols-3 gap-3">
        {DECKS.map((d) => {
          const cards = allCards().filter((c) => c.deck === d.id);
          const total = cards.length;
          const due = cards.filter((f) => activeCards.includes(f.id) && (!srs[f.id] || new Date(srs[f.id].due) <= now)).length;
          return (
            <Link key={d.id} to={`/flashcards/${d.id}`}>
              <Card className="h-full" onClick={() => {}}>
                <div className="text-3xl mb-2">{d.emoji}</div>
                <div className="font-bold text-sm">{d.name}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Tag color="muted">{total} cartes</Tag>
                  {due > 0 && <Tag color="gold">{due} à revoir</Tag>}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
      <p className="text-xs text-muted mt-6">Le deck « Red Book Questions » transforme les 220 questions de la banque en cartes recto/verso.</p>
    </div>
  );
}
