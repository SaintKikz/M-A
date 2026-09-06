import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Garde-fou : le rythme affiché doit venir de la progression réelle, jamais
 * d'une date fixe dans l'année. Une deadline codée en dur affiche « J-0 »
 * après le 31 août et n'a aucun sens pour un nouvel utilisateur.
 */
const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

describe("Rythme fondé sur la progression, pas sur une date", () => {
  const files = ["src/pages/Dashboard.tsx", "src/pages/Plan.tsx"];

  it("aucune deadline du 31 août ne subsiste", () => {
    for (const f of files) {
      const src = read(f);
      expect(src, `${f} contient une date fixe`).not.toMatch(/getFullYear\(\)\s*,\s*7\s*,\s*31/);
      expect(src, `${f} déclare une DEADLINE`).not.toMatch(/const DEADLINE/);
    }
  });

  it("aucun compte à rebours « avant fin août » n'est affiché", () => {
    for (const f of files) {
      expect(read(f), `${f}`).not.toMatch(/avant fin ao[uû]t/i);
      expect(read(f), `${f}`).not.toMatch(/J-\$\{days\}/);
    }
  });

  it("la semaine courante se déduit de la progression", () => {
    expect(read("src/pages/Dashboard.tsx")).toMatch(/doneModules\.length/);
    expect(read("src/pages/Plan.tsx")).toMatch(/completedLessons\.includes/);
  });
});
