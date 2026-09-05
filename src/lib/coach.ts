// ─── Le coach : moteur de recommandations et de progression ────────────────
// Répond à LA question : « qu'est-ce que je fais maintenant ? »

import { MODULES, LESSONS, lessonById, bossById, BOSSES } from "../data/curriculum";
import { MISSIONS } from "../data/missions";
import { ALL_CASES } from "../data/cases";
import { nextChapter } from "../data/academy";
import { allCards } from "./cards";
import { topicScore } from "../store/progress";

export interface NextStep {
  label: string;
  sub: string;
  to: string;
}

export interface Reco {
  emoji: string;
  label: string;
  reason: string;
  to: string;
  priority: number; // plus petit = plus urgent
}

interface CoachState {
  completedLessons: string[];
  completedMissions: Record<string, number>;
  completedCases: Record<string, number>;
  bossResults: Record<string, { score: number; passed: boolean }>;
  drillHistory: { date: string; score: number }[];
  srs: Record<string, { due: string }>;
  activeCards: string[];
  topicStats: Record<string, { right: number; wrong: number }>;
  tagErrors: Record<string, number>;
  chapters: Record<string, number>;
}

// ─── « Continuer » : Académie d'abord, puis l'Interview Track ──────────────
export function nextStep(s: CoachState): NextStep {
  const ch = nextChapter(s.chapters);
  if (ch) {
    return { label: ch.title, sub: `🎓 Académie · Niveau ${ch.level} · ${ch.minutes} min`, to: `/academy/${ch.id}` };
  }
  for (const mod of [...MODULES].sort((a, b) => a.order - b.order)) {
    for (const lid of mod.lessonIds) {
      if (!s.completedLessons.includes(lid)) {
        const l = lessonById[lid];
        return { label: l.title, sub: `${mod.emoji} ${mod.title} · leçon · ${l.minutes} min`, to: `/lesson/${lid}` };
      }
    }
    if (mod.bossId && !s.bossResults[mod.bossId]?.passed && mod.lessonIds.length > 0) {
      const boss = bossById[mod.bossId];
      return { label: boss.title, sub: `${boss.emoji} Valide le module « ${mod.title} » (≥75%)`, to: `/boss/${mod.bossId}` };
    }
  }
  // Toutes les leçons faites : reste-t-il des boss ?
  const boss = BOSSES.find((b) => !s.bossResults[b.id]?.passed);
  if (boss) return { label: boss.title, sub: `${boss.emoji} Dernier boss à vaincre`, to: `/boss/${boss.id}` };
  // Tout est validé : cap sur les mocks.
  return { label: "Full Mock — Final Round MD", sub: "🏆 Le parcours est validé : enchaîne les entretiens complets", to: "/arena" };
}

// ─── Où réviser une faiblesse ? tag/topic → leçon ou module ────────────────
const TAG_TO_LESSON: Record<string, string> = {
  "d&a": "l4", nwc: "l5", inventory: "l5", "deferred-revenue": "l6", goodwill: "l6",
  "3-statements": "l3", "liens-3-statements": "l3", ebitda: "l7", fcf: "l7",
  "ev-bridge": "l10", "minority-interest": "l10", multiples: "l11", methods: "l12",
  "negative-ebitda": "l12", ufcf: "l13", "terminal-value": "l14", wacc: "l9", capm: "l9",
  beta: "l9", "peer-selection": "l15", calendarization: "l15", "control-premium": "l16",
  "process-docs": "l17", auction: "l17", "locked-box": "l17", synergies: "l18",
  "deal-rationale": "l18", intuition: "l19", "cash-deal": "l19", hierarchy: "l19",
  "paper-lbo": "l20", moic: "l20", leverage: "l20", "hy-ig": "l21", "rates-mna": "l21",
  "debt-types": "l21", saas: "l22", fig: "l22", luxury: "l22", healthcare: "l22",
};

export function fixLinkForTag(tag: string): { label: string; to: string } {
  const lid = TAG_TO_LESSON[tag];
  if (lid && lessonById[lid]) return { label: `Leçon « ${lessonById[lid].title} »`, to: `/lesson/${lid}` };
  return { label: "Refais un Daily Drill ciblé", to: "/drill" };
}

const TOPIC_LABELS: Record<string, string> = {
  accounting: "Accounting", valuation: "Valuation", dcf: "DCF", comps: "Comps",
  precedents: "Precedents", "mna-process": "M&A Process", "accretion-dilution": "Accretion/Dilution",
  lbo: "LBO", "capital-markets": "Capital Markets", industry: "Industry", behavioral: "Behavioral",
  foundations: "Foundations", "corp-finance": "Corporate Finance", "deal-awareness": "Deal Awareness",
};

export function topicLabel(t: string): string { return TOPIC_LABELS[t] ?? t; }

export function moduleForTopic(topic: string): { label: string; to: string } | null {
  const mod = MODULES.find((m) => m.topic === topic && m.lessonIds.length > 0) ?? MODULES.find((m) => m.topic === topic);
  return mod ? { label: mod.title, to: `/path/${mod.id}` } : null;
}

// ─── Recommandations du jour ────────────────────────────────────────────────
export function recommendations(s: CoachState): Reco[] {
  const recos: Reco[] = [];
  const today = new Date().toISOString().slice(0, 10);
  const isWeekend = [0, 6].includes(new Date().getDay());

  // 1. Le drill quotidien, toujours en premier s'il n'est pas fait.
  if (!s.drillHistory.some((d) => d.date === today)) {
    recos.push({ emoji: "⚡", label: "Daily Drill", reason: "Pas encore fait aujourd'hui — protège ton streak.", to: "/drill", priority: 1 });
  }

  // 2. Cartes en retard.
  const now = new Date();
  const due = s.activeCards.filter((id) => s.srs[id] && new Date(s.srs[id].due) <= now).length;
  if (due >= 5) {
    recos.push({ emoji: "🃏", label: `${due} cartes en retard`, reason: "La répétition espacée ne marche que si tu honores les échéances.", to: "/flashcards", priority: 2 });
  }

  // 3. Ta pire faiblesse, avec le remède.
  const weakest = Object.entries(s.tagErrors).filter(([, v]) => v >= 2).sort((a, b) => b[1] - a[1])[0];
  if (weakest) {
    const fix = fixLinkForTag(weakest[0]);
    recos.push({ emoji: "🩹", label: `Soigne « ${weakest[0]} »`, reason: `${Math.round(weakest[1])} erreurs récentes → ${fix.label}.`, to: fix.to, priority: 3 });
  }

  // 4. Un boss à portée : toutes les leçons du module faites, boss pas encore battu.
  const bossReady = MODULES.find((m) => m.bossId && m.lessonIds.length > 0 && m.lessonIds.every((l) => s.completedLessons.includes(l)) && !s.bossResults[m.bossId!]?.passed);
  if (bossReady) {
    recos.push({ emoji: bossById[bossReady.bossId!].emoji, label: bossById[bossReady.bossId!].title, reason: "Toutes les leçons sont faites : le boss t'attend (≥75%).", to: `/boss/${bossReady.bossId}`, priority: 4 });
  }

  // 5. Le week-end : un case ou une mission longue.
  if (isWeekend) {
    const nextCase = ALL_CASES.find((c) => s.completedCases[c.id] === undefined);
    if (nextCase) {
      recos.push({ emoji: "🏢", label: `Case : ${nextCase.title.split("—")[0].trim()}`, reason: `C'est le week-end — ${nextCase.minutes} min pour un vrai cas (${nextCase.level}).`, to: `/dealroom/${nextCase.id}`, priority: 5 });
    }
  } else {
    // 5bis. En semaine : une mission Analyst Desk pas encore faite.
    const nextMission = MISSIONS.find((m) => s.completedMissions[m.id] === undefined);
    if (nextMission) {
      recos.push({ emoji: "💼", label: nextMission.title, reason: `Mission ${nextMission.from.toLowerCase()} · ${nextMission.minutes} min.`, to: `/desk/${nextMission.id}`, priority: 6 });
    }
  }

  // 6. Topic le plus faible mesuré → module.
  const topics = Object.entries(s.topicStats)
    .map(([t]) => ({ t, sc: topicScore(s.topicStats, t) }))
    .filter((x) => x.sc !== null && x.sc < 60);
  const worstTopic = topics.sort((a, b) => (a.sc ?? 0) - (b.sc ?? 0))[0];
  if (worstTopic) {
    const mod = moduleForTopic(worstTopic.t);
    if (mod) recos.push({ emoji: "📉", label: `${topicLabel(worstTopic.t)} : ${worstTopic.sc}%`, reason: `Ton score le plus faible → retravaille « ${mod.label} ».`, to: mod.to, priority: 7 });
  }

  return recos.sort((a, b) => a.priority - b.priority).slice(0, 4);
}

// ─── Stats de couverture (pour le dashboard) ────────────────────────────────
export function coverage(s: CoachState) {
  return {
    lessons: { done: s.completedLessons.length, total: LESSONS.length },
    bosses: { done: Object.values(s.bossResults).filter((b) => b.passed).length, total: BOSSES.length },
    cases: { done: Object.keys(s.completedCases).length, total: ALL_CASES.length },
    missions: { done: Object.keys(s.completedMissions).length, total: MISSIONS.length },
    cardsSeen: { done: s.activeCards.length, total: allCards().length },
  };
}
