import { FLASHCARDS } from "../data/flashcards";
import { BANK } from "../data";
import { GLOSSARY } from "../data/glossary";
import type { Flashcard } from "./types";

// Pool complet de cartes : decks natifs + questions Red Book + termes du glossaire.
// Les ids dérivés : rbfc-<questionId> et gl-<termId>.
let pool: Flashcard[] | null = null;

export function allCards(): Flashcard[] {
  if (!pool) {
    pool = [
      ...FLASHCARDS,
      ...BANK.map((q) => ({
        id: `rbfc-${q.id}`, deck: "redbook",
        front: q.question,
        back: q.shortAnswer + (q.trap ? `\n\n⚠️ ${q.trap}` : ""),
        tags: q.tags,
      })),
      ...GLOSSARY.map((g) => ({
        id: `gl-${g.id}`, deck: "glossary",
        front: `${g.term} — définition + version entretien ?`,
        back: `${g.definition}\n\n🇬🇧 ${g.interviewVersion}${g.formula ? `\n\n🧮 ${g.formula}` : ""}`,
        tags: g.tags,
      })),
    ];
  }
  return pool;
}

export function cardById(id: string): Flashcard | undefined {
  return allCards().find((c) => c.id === id);
}
