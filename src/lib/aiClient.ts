// ─── Coach IA : Claude branché directement dans la plateforme ───────────────
// La clé API est stockée en localStorage et les appels partent du navigateur
// (dangerouslyAllowBrowser). C'est acceptable pour un usage PERSONNEL en local.
// ⚠️ Ne déploie JAMAIS ce site publiquement avec cette approche : toute personne
// visitant la page pourrait voler la clé. Pour un déploiement, passe par un
// petit proxy backend (Cloudflare Worker / Vercel Function) qui garde la clé.

import Anthropic from "@anthropic-ai/sdk";
import type { GradeResult } from "./grader";

export interface AiConfig {
  apiKey: string;
  model: string;
}

const STORAGE_KEY = "ma-lab-ai-config";

export const AI_MODELS = [
  { id: "claude-opus-4-8", label: "Claude Opus 4.8 — le meilleur coach (recommandé)" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6 — rapide et économique" },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5 — le moins cher" },
];

export function getAiConfig(): AiConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cfg = JSON.parse(raw) as AiConfig;
    return cfg.apiKey ? cfg : null;
  } catch {
    return null;
  }
}

export function saveAiConfig(cfg: AiConfig | null) {
  if (!cfg || !cfg.apiKey) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

export function aiEnabled(): boolean {
  return getAiConfig() !== null;
}

function client(): Anthropic {
  const cfg = getAiConfig();
  if (!cfg) throw new Error("Coach IA non configuré. Ajoute ta clé API dans Profil → Coach IA.");
  return new Anthropic({ apiKey: cfg.apiKey, dangerouslyAllowBrowser: true });
}

function model(): string {
  return getAiConfig()?.model ?? "claude-opus-4-8";
}

function textOf(response: Anthropic.Message): string {
  for (const block of response.content) if (block.type === "text") return block.text;
  return "";
}

/** Test de connexion : renvoie null si OK, sinon le message d'erreur. */
export async function aiTest(): Promise<string | null> {
  try {
    const resp = await client().messages.create({
      model: model(),
      max_tokens: 64,
      messages: [{ role: "user", content: "Réponds uniquement : OK" }],
    });
    return textOf(resp).includes("OK") ? null : "Réponse inattendue de l'API.";
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) return "Clé API invalide.";
    if (e instanceof Anthropic.APIError) return `Erreur API (${e.status}) : ${e.message}`;
    return e instanceof Error ? e.message : "Erreur inconnue.";
  }
}

// ─── Correction IA d'une réponse (remplace le grader heuristique) ───────────
const GRADE_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "integer", description: "Note globale de 0 à 100, calibrée sur un vrai entretien M&A junior" },
    technique: { type: "integer", description: "Sous-score 0-100 : précision et exactitude technique" },
    structure: { type: "integer", description: "Sous-score 0-100 : organisation de la réponse (annonce, points, conclusion)" },
    concision: { type: "integer", description: "Sous-score 0-100 : calibrage oral 30-90 secondes, zéro remplissage" },
    verdict: { type: "string", description: "Verdict en 1-2 phrases, en français, direct mais constructif" },
    misses: { type: "array", items: { type: "string" }, description: "Concepts clés manquants ou faux (vide si rien)" },
    tips: { type: "array", items: { type: "string" }, description: "2-4 conseils concrets et actionnables, en français" },
    betterAnswer: { type: "string", description: "La réponse idéale, telle qu'un excellent candidat la dirait à l'oral (même langue que la question)" },
  },
  required: ["score", "technique", "structure", "concision", "verdict", "misses", "tips", "betterAnswer"],
  additionalProperties: false,
} as const;

const GRADER_SYSTEM = `Tu es un interviewer M&A senior (Managing Director) dans une banque d'affaires de premier plan. Tu évalues les réponses d'un étudiant qui prépare des entretiens de stage en M&A.

Critères de notation (0-100) : précision technique, structure (réponse d'abord, justification ensuite), concision (une réponse d'entretien dure 30-90 secondes), honnêteté intellectuelle (inventer ou bluffer est éliminatoire ; dire "je ne suis pas sûr, mais mon intuition est..." est valorisé ; demander une clarification pertinente est un plus).

Calibrage : 85+ = prêt pour un vrai entretien ; 65-84 = bonne base, un recruteur creuserait ; 40-64 = des éléments justes mais des manques ; <40 = insuffisant.

Sois exigeant mais pédagogue : ton feedback doit rendre la prochaine tentative meilleure.`;

export async function aiGradeAnswer(
  question: string,
  answer: string,
  context?: { modelAnswer?: string; persona?: string; english?: boolean }
): Promise<GradeResult & { betterAnswer?: string }> {
  const parts = [
    context?.persona ? `Contexte de l'entretien : ${context.persona}` : null,
    `Question posée : ${question}`,
    context?.modelAnswer ? `Éléments de correction (référence interne, ne pas exiger mot pour mot) : ${context.modelAnswer}` : null,
    `Réponse du candidat : """${answer}"""`,
    "Évalue cette réponse.",
  ].filter(Boolean).join("\n\n");

  const resp = await client().messages.create({
    model: model(),
    max_tokens: 2048,
    system: GRADER_SYSTEM,
    output_config: { format: { type: "json_schema", schema: GRADE_SCHEMA } },
    messages: [{ role: "user", content: parts }],
  });

  const data = JSON.parse(textOf(resp)) as {
    score: number; technique: number; structure: number; concision: number;
    verdict: string; misses: string[]; tips: string[]; betterAnswer: string;
  };

  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  return {
    score: clamp(data.score),
    sub: { technique: clamp(data.technique), structure: clamp(data.structure), concision: clamp(data.concision) },
    hits: [],
    misses: data.misses,
    redFlagsHit: [],
    lengthFeedback: null,
    verdict: data.verdict,
    tips: data.tips,
    betterAnswer: data.betterAnswer,
  };
}

// ─── Assistant flottant (bulle d'aide, disponible partout) ──────────────────
const ASSISTANT_SYSTEM = `Tu es le tuteur intégré de "M&A Training Lab", une plateforme d'apprentissage du M&A et de la corporate finance pour un étudiant qui prépare des entretiens de stage en investment banking (objectif : fin août).

Ton rôle : répondre à ses questions pendant qu'il travaille — expliquer un concept, refaire un calcul, donner un exemple, clarifier une correction, ou le tester.

Règles :
- Réponds en français (les termes techniques anglais restent en anglais : EBITDA, walk me through a DCF...).
- Sois CONCIS : 100-200 mots maximum, sauf pour dérouler un calcul qui exige plus.
- Pédagogie active : analogies simples, exemples chiffrés minuscules, et termine souvent par une mini-question pour vérifier la compréhension.
- Si on te donne le contexte de la page affichée, appuie-toi dessus en priorité.
- Si la question sort de la finance, réponds brièvement et ramène gentiment vers la préparation.
- Ne invente jamais : si tu n'es pas sûr, dis-le — c'est aussi ce qu'on enseigne ici pour les entretiens.`;

export async function aiAssistantReply(
  history: LiveMessage[],
  pageContext: string,
  onDelta: (text: string) => void
): Promise<string> {
  const stream = client().messages.stream({
    model: model(),
    max_tokens: 1500,
    system: pageContext
      ? `${ASSISTANT_SYSTEM}\n\n--- Contexte : ce que l'étudiant a sous les yeux en ce moment ---\n${pageContext.slice(0, 2000)}`
      : ASSISTANT_SYSTEM,
    messages: history,
  });
  stream.on("text", onDelta);
  const final = await stream.finalMessage();
  return textOf(final);
}

// ─── « Explique-moi autrement » (Académie) ──────────────────────────────────
export async function aiExplain(concept: string, currentExplanation: string): Promise<string> {
  const resp = await client().messages.create({
    model: model(),
    max_tokens: 1024,
    system: "Tu es un professeur de finance exceptionnel, spécialiste de la vulgarisation pour étudiants qui préparent des stages en M&A. On te donne un concept et l'explication qui n'a pas suffi. Ta mission : expliquer AUTREMENT — angle différent, nouvelle analogie de la vie quotidienne, exemple chiffré ultra-simple. Maximum 150 mots, en français, ton chaleureux et direct. Ne répète pas l'explication d'origine.",
    messages: [{ role: "user", content: `Concept : ${concept}\n\nExplication qui n'a pas suffi :\n${currentExplanation.slice(0, 1500)}\n\nExplique-le moi autrement.` }],
  });
  return textOf(resp);
}

// ─── Entretien live conversationnel ─────────────────────────────────────────
export interface LiveMessage {
  role: "user" | "assistant";
  content: string;
}

const INTERVIEWER_SYSTEM = (persona: string, focus: string) => `Tu joues le rôle d'un interviewer dans un process de recrutement pour un STAGE en M&A dans une banque d'affaires de premier plan à Paris.

Ta persona : ${persona}
Focus de l'entretien : ${focus}

Règles du jeu de rôle :
- Tu mènes un VRAI entretien : une seule question à la fois, jamais de liste de questions.
- Tu rebondis sur les réponses du candidat : creuse ("pourquoi ?", "et si... ?"), challenge les imprécisions, note mentalement les forces et faiblesses.
- Mélange français et anglais comme en vrai : les questions techniques peuvent être posées en anglais ("Walk me through a DCF"), le reste en français.
- Si le candidat bluff ou invente, pousse-le dans ses retranchements — poliment mais fermement.
- Si le candidat est bon, monte progressivement en difficulté.
- Reste DANS le rôle : pas de méta-commentaires, pas de correction pédagogique pendant l'entretien (le débrief viendra à la fin).
- Tes messages sont courts et naturels, comme à l'oral (2-5 phrases max, puis ta question).
- Commence l'entretien directement par un accueil bref et ta première question.`;

export async function aiInterviewTurn(
  history: LiveMessage[],
  persona: string,
  focus: string
): Promise<string> {
  const resp = await client().messages.create({
    model: model(),
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    system: INTERVIEWER_SYSTEM(persona, focus),
    messages: history.length === 0
      ? [{ role: "user", content: "(Le candidat entre dans la salle et s'assoit.)" }]
      : history,
  });
  return textOf(resp);
}

// ─── Débrief final de l'entretien live ──────────────────────────────────────
const DEBRIEF_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "integer", description: "Note globale 0-100 de la performance en entretien" },
    decision: { type: "string", enum: ["pass", "maybe", "fail"], description: "pass = tour suivant ; maybe = hésitation ; fail = rejeté" },
    strengths: { type: "array", items: { type: "string" }, description: "2-3 forces observées, concrètes" },
    weaknesses: { type: "array", items: { type: "string" }, description: "2-3 axes de progrès prioritaires, concrets" },
    debrief: { type: "string", description: "Débrief de 4-6 phrases, en français, comme un vrai retour de recruteur" },
  },
  required: ["score", "decision", "strengths", "weaknesses", "debrief"],
  additionalProperties: false,
} as const;

export interface InterviewDebrief {
  score: number;
  decision: "pass" | "maybe" | "fail";
  strengths: string[];
  weaknesses: string[];
  debrief: string;
}

export async function aiInterviewDebrief(
  history: LiveMessage[],
  persona: string
): Promise<InterviewDebrief> {
  const transcript = history
    .map((m) => `${m.role === "assistant" ? "INTERVIEWER" : "CANDIDAT"} : ${m.content}`)
    .join("\n\n");

  const resp = await client().messages.create({
    model: model(),
    max_tokens: 2048,
    thinking: { type: "adaptive" },
    system: `Tu es ${persona}. L'entretien est terminé. Tu rédiges maintenant ton évaluation du candidat pour le comité de recrutement. Sois honnête et calibré sur les standards d'un stage M&A en banque d'affaires de premier plan : la complaisance ne rend pas service au candidat.`,
    output_config: { format: { type: "json_schema", schema: DEBRIEF_SCHEMA } },
    messages: [{ role: "user", content: `Transcript de l'entretien :\n\n${transcript}\n\nRédige ton évaluation.` }],
  });

  return JSON.parse(textOf(resp)) as InterviewDebrief;
}
