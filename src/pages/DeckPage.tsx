import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DECKS } from "../data/flashcards";
import { allCards } from "../lib/cards";
import { useProgress, type SrsGrade } from "../store/progress";
import { Card, PageTitle, Btn, Tag } from "../components/ui";
import type { Flashcard } from "../lib/types";

export default function DeckPage() {
  const { deckId } = useParams();
  const deck = DECKS.find((d) => d.id === deckId);
  const { srs, reviewCard, addCards, touchStreak } = useProgress();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  const cards: Flashcard[] = useMemo(() => allCards().filter((c) => c.deck === deckId), [deckId]);

  // Cartes dues d'abord, puis nouvelles.
  const ordered = useMemo(() => {
    const now = new Date();
    const due = cards.filter((c) => srs[c.id] && new Date(srs[c.id].due) <= now);
    const fresh = cards.filter((c) => !srs[c.id]);
    const later = cards.filter((c) => srs[c.id] && new Date(srs[c.id].due) > now);
    return [...due, ...fresh, ...later];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  if (!deck) return <p>Deck introuvable.</p>;
  if (ordered.length === 0) return <p className="text-muted">Deck vide.</p>;

  const card = ordered[Math.min(idx, ordered.length - 1)];
  const done = idx >= ordered.length;

  const grade = (g: SrsGrade) => {
    reviewCard(card.id, g);
    addCards([card.id]);
    if (reviewed === 0) touchStreak();
    setReviewed(reviewed + 1);
    setFlipped(false);
    setIdx(idx + 1);
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto text-center pt-16 fade-up">
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-2xl font-bold">Deck terminé !</h1>
        <p className="text-muted mt-2">{reviewed} cartes revues. Elles reviendront selon ta note (Again = demain, Easy = dans plusieurs jours).</p>
        <div className="flex gap-3 justify-center mt-6">
          <Link to="/flashcards"><Btn kind="ghost">← Tous les decks</Btn></Link>
          <Btn onClick={() => { setIdx(0); setReviewed(0); }}>↻ Refaire</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/flashcards" className="text-sm text-muted hover:text-ink">← Decks</Link>
      <PageTitle emoji={deck.emoji} title={deck.name} sub={`Carte ${idx + 1} / ${ordered.length}`} />
      <div className={`card-flip ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
        <div className="card-flip-inner relative h-72 cursor-pointer">
          <Card className="card-face absolute inset-0 flex items-center justify-center text-center overflow-y-auto">
            <div>
              {srs[card.id] && <Tag color="muted">Vue {srs[card.id].reps}×</Tag>}
              <p className="text-lg font-semibold mt-3 leading-snug">{card.front}</p>
              <p className="text-xs text-muted mt-4">Clique pour retourner</p>
            </div>
          </Card>
          <Card className="card-face card-back absolute inset-0 flex items-center justify-center text-center border-accent/40 overflow-y-auto">
            <p className="text-sm leading-relaxed whitespace-pre-line">{card.back}</p>
          </Card>
        </div>
      </div>
      {flipped ? (
        <div className="grid grid-cols-4 gap-2 mt-4 fade-up">
          <Btn kind="danger" onClick={() => grade("again")}>Again</Btn>
          <Btn kind="ghost" onClick={() => grade("hard")}>Hard</Btn>
          <Btn kind="ghost" onClick={() => grade("medium")}>Medium</Btn>
          <Btn kind="success" onClick={() => grade("easy")}>Easy</Btn>
        </div>
      ) : (
        <p className="text-center text-xs text-muted mt-4">Réponds dans ta tête AVANT de retourner — c'est là que la mémoire travaille.</p>
      )}
    </div>
  );
}
