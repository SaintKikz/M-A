import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { aiEnabled, aiInterviewTurn, aiInterviewDebrief, type LiveMessage, type InterviewDebrief } from "../lib/aiClient";
import { useProgress } from "../store/progress";
import { Card, PageTitle, Btn, Tag, ScoreRing } from "../components/ui";

const PERSONAS = [
  {
    id: "live-hr", emoji: "🙂", title: "Screening RH", difficulty: "Échauffement",
    persona: "Claire, HR Business Partner, bienveillante mais très attentive à la cohérence du parcours et à la motivation réelle. Elle a vu 200 candidats ce mois-ci.",
    focus: "Fit et motivation : parcours, why M&A, why this bank, forces/faiblesses, disponibilité. Aucune question technique.",
  },
  {
    id: "live-analyst", emoji: "🤓", title: "Technique — Analyste", difficulty: "Intermédiaire",
    persona: "Hugo, Analyst 2, a passé les mêmes entretiens il y a deux ans. Questions techniques rapides, veut des réponses structurées et justes, pas de blabla.",
    focus: "Technique fondamentale : 3 états financiers, EV vs equity value, multiples, DCF, questions de calcul mental simples. Rythme soutenu.",
  },
  {
    id: "live-associate", emoji: "🧐", title: "Deep Dive — Associate", difficulty: "Avancé",
    persona: "Sarah, Associate, ex-analyste top-bucket. Elle pose une question simple puis creuse avec des 'pourquoi' successifs jusqu'à trouver la limite de compréhension du candidat.",
    focus: "Valorisation en profondeur : DCF, WACC, comps, cas limites (EBITDA négatif, banques), accretion/dilution. Chaque réponse appelle une relance.",
  },
  {
    id: "live-md", emoji: "👑", title: "Final Round — MD", difficulty: "Difficile",
    persona: "Isabelle, Managing Director, 30 ans de M&A. Elle ne teste plus la technique — elle teste le jugement, la maturité, et si elle imagine le candidat devant un client dans 3 ans.",
    focus: "Jugement et maturité : mises en situation client, discussion de deals d'actualité, questions de marché, décisions difficiles. Conversation de haut niveau.",
  },
  {
    id: "live-stress", emoji: "😈", title: "Don't Bullshit Mode", difficulty: "Extrême",
    persona: "Alexandre, Executive Director, réputé pour faire craquer les candidats. Questions ambiguës, pièges, contre-pieds. Il ne cherche pas la bonne réponse : il cherche comment le candidat se comporte quand il ne l'a pas.",
    focus: "Questions pièges et stress : questions sans bonne réponse unique, affirmations fausses à challenger, pression volontaire. Détecter et punir le bluff ; récompenser l'honnêteté structurée et les demandes de clarification.",
  },
];

export default function ArenaLive() {
  const nav = useNavigate();
  const enabled = aiEnabled();
  const [persona, setPersona] = useState<(typeof PERSONAS)[0] | null>(null);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debrief, setDebrief] = useState<InterviewDebrief | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { completeArena, touchStreak, recordAnswer } = useProgress();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const start = async (p: (typeof PERSONAS)[0]) => {
    setPersona(p);
    setLoading(true);
    setError(null);
    try {
      const opening = await aiInterviewTurn([], p.persona, p.focus);
      setMessages([{ role: "assistant", content: opening }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de connexion à l'API.");
      setPersona(null);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!persona || !input.trim() || loading) return;
    const next: LiveMessage[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const reply = await aiInterviewTurn(next, persona.persona, persona.focus);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur pendant l'entretien — réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const finish = async () => {
    if (!persona || loading) return;
    setLoading(true);
    setError(null);
    try {
      const d = await aiInterviewDebrief(messages, persona.persona);
      setDebrief(d);
      completeArena(`ai-${persona.id}`, d.score, 150);
      recordAnswer("behavioral", [`live-${persona.id}`], d.score >= 60);
      touchStreak();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur pendant le débrief — réessaie.");
    } finally {
      setLoading(false);
    }
  };

  // ── Pas de clé configurée ──
  if (!enabled) {
    return (
      <div className="max-w-xl">
        <Link to="/arena" className="text-sm text-muted hover:text-ink">← Interview Arena</Link>
        <PageTitle emoji="🤖" title="Entretien Live IA" />
        <Card className="border-gold/40">
          <p className="text-sm leading-relaxed mb-4">
            Pour affronter un interviewer IA qui s'adapte à TES réponses, il faut brancher ta clé API Anthropic.
            Ça prend une minute : crée une clé sur <b>console.anthropic.com</b>, puis colle-la dans les réglages.
          </p>
          <Btn onClick={() => nav("/profile")}>⚙️ Configurer le Coach IA →</Btn>
        </Card>
      </div>
    );
  }

  // ── Débrief final ──
  if (debrief && persona) {
    const decisionUI = {
      pass: { emoji: "🎉", text: "Tu passes au tour suivant !", color: "border-green/50" },
      maybe: { emoji: "🤔", text: "Le comité hésite… ça se joue à peu de choses.", color: "border-gold/50" },
      fail: { emoji: "💀", text: "Pas cette fois. Mais chaque entretien raté en prépare un réussi.", color: "border-red/50" },
    }[debrief.decision];
    return (
      <div className="max-w-2xl fade-up">
        <PageTitle emoji={persona.emoji} title={`Débrief — ${persona.title}`} />
        <Card className={`mb-4 ${decisionUI.color} border-2`}>
          <div className="flex items-center gap-5">
            <ScoreRing score={debrief.score} size={100} />
            <div>
              <div className="text-2xl">{decisionUI.emoji}</div>
              <div className="font-bold">{decisionUI.text}</div>
            </div>
          </div>
        </Card>
        <Card className="mb-4">
          <div className="font-bold text-sm mb-2">📝 Le retour du recruteur</div>
          <p className="text-sm leading-relaxed whitespace-pre-line">{debrief.debrief}</p>
        </Card>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Card>
            <div className="font-bold text-sm mb-2 text-green">💪 Forces</div>
            <ul className="text-sm space-y-1.5">{debrief.strengths.map((s, i) => <li key={i}>• {s}</li>)}</ul>
          </Card>
          <Card>
            <div className="font-bold text-sm mb-2 text-red">🎯 À travailler</div>
            <ul className="text-sm space-y-1.5">{debrief.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}</ul>
          </Card>
        </div>
        <div className="flex gap-3">
          <Btn kind="ghost" onClick={() => nav("/arena")}>← Arena</Btn>
          <Btn onClick={() => { setDebrief(null); setPersona(null); setMessages([]); }}>↻ Nouvel entretien</Btn>
        </div>
      </div>
    );
  }

  // ── Choix de la persona ──
  if (!persona) {
    return (
      <div>
        <Link to="/arena" className="text-sm text-muted hover:text-ink">← Interview Arena</Link>
        <PageTitle emoji="🤖" title="Entretien Live IA" sub="Un vrai entretien conversationnel : l'interviewer rebondit sur TES réponses, creuse tes imprécisions, et te débriefe comme un vrai recruteur à la fin. Choisis ton adversaire." />
        {error && <Card className="border-red/50 mb-4"><p className="text-sm text-red">{error}</p></Card>}
        <div className="grid md:grid-cols-2 gap-3">
          {PERSONAS.map((p) => (
            <Card key={p.id} onClick={() => !loading && start(p)} className={loading ? "opacity-50" : ""}>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{p.emoji}</div>
                <div>
                  <div className="font-bold text-sm">{p.title}</div>
                  <Tag color={p.difficulty === "Extrême" ? "red" : p.difficulty === "Difficile" ? "gold" : "accent"}>{p.difficulty}</Tag>
                </div>
              </div>
              <p className="text-xs text-muted mt-2 italic leading-relaxed">{p.persona}</p>
            </Card>
          ))}
        </div>
        {loading && <p className="text-sm text-muted mt-4 animate-pulse">🚪 L'interviewer arrive…</p>}
      </div>
    );
  }

  // ── Entretien en cours ──
  return (
    <div className="max-w-2xl flex flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-bold">{persona.emoji} {persona.title}</div>
          <div className="text-xs text-muted">{messages.filter((m) => m.role === "assistant").length} question(s) posée(s)</div>
        </div>
        <Btn kind="gold" onClick={finish} disabled={loading || messages.filter((m) => m.role === "user").length < 2}>
          🏁 Terminer & débrief
        </Btn>
      </div>

      <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} fade-up`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
              m.role === "user" ? "bg-accent text-white rounded-br-sm" : "bg-surface border border-border rounded-bl-sm"
            }`}>
              {m.role === "assistant" && <div className="text-[11px] font-bold text-gold mb-1">🧑‍💼 Interviewer</div>}
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-muted animate-pulse">
              L'interviewer réfléchit…
            </div>
          </div>
        )}
        {error && <p className="text-sm text-red">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-16 md:bottom-0 bg-bg pt-2 pb-2">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={2}
            placeholder="Ta réponse, comme à l'oral… (Entrée pour envoyer, Maj+Entrée pour un saut de ligne)"
            className="flex-1 bg-surface2 border border-border rounded-xl px-4 py-3 outline-none focus:border-accent text-sm leading-relaxed resize-none"
            disabled={loading}
          />
          <Btn onClick={send} disabled={loading || !input.trim()}>Envoyer</Btn>
        </div>
      </div>
    </div>
  );
}
