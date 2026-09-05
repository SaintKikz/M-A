import { Link } from "react-router-dom";
import { ARENA_SESSIONS } from "../data/arena";
import { useProgress } from "../store/progress";
import { Card, PageTitle, Tag, diffLabel, diffColor } from "../components/ui";

const MODE_LABEL: Record<string, { label: string; color: string }> = {
  fit: { label: "Fit / RH", color: "green" },
  technical: { label: "Technique", color: "accent" },
  deal: { label: "Deal Discussion", color: "purple" },
  stress: { label: "Stress", color: "red" },
  bullshit: { label: "Don't Bullshit Mode", color: "red" },
  full: { label: "Full Mock", color: "gold" },
};

export default function Arena() {
  const { arenaResults } = useProgress();
  return (
    <div>
      <PageTitle emoji="🎤" title="Interview Arena" sub="Des entretiens simulés, du screening RH au final round MD. Le coach corrige chaque réponse : concepts manquants, longueur, bullshit détecté. Écris tes réponses comme tu les DIRAIS." />

      <Link to="/arena/live">
        <Card className="mb-5 border-2 border-accent2/60 hover:border-accent2" onClick={() => {}}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">🤖</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold">Entretien Live IA</span>
                <Tag color="purple">Nouveau</Tag>
                <Tag color="gold">+150 XP</Tag>
              </div>
              <p className="text-sm text-muted mt-1">
                Un vrai entretien conversationnel : l'interviewer (RH → MD → Don't Bullshit Mode) rebondit sur TES réponses,
                creuse tes imprécisions, et te débriefe à la fin comme un vrai recruteur. Nécessite ta clé API (Profil → Coach IA).
              </p>
            </div>
          </div>
        </Card>
      </Link>

      <div className="grid md:grid-cols-2 gap-3">
        {ARENA_SESSIONS.map((a) => {
          const score = arenaResults[a.id];
          const mode = MODE_LABEL[a.mode];
          return (
            <Link key={a.id} to={`/arena/${a.id}`}>
              <Card className="h-full" onClick={() => {}}>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Tag color={mode.color}>{mode.label}</Tag>
                  <Tag color={diffColor(a.difficulty)}>{diffLabel(a.difficulty)}</Tag>
                  {score !== undefined && <Tag color={score >= 70 ? "green" : "gold"}>Meilleur : {score}%</Tag>}
                </div>
                <div className="font-bold text-sm">{a.title}</div>
                <div className="text-xs text-muted mt-1">{a.interviewer} · {a.turns.length} questions · +{a.xp} XP</div>
                <p className="text-xs text-muted mt-2 italic leading-relaxed">{a.persona}</p>
              </Card>
            </Link>
          );
        })}
      </div>
      <p className="text-xs text-muted mt-6">🎙️ Oral Answer Trainer : écris tes réponses comme à l'oral. Avec le Coach IA configuré (Profil), chaque réponse des sessions scriptées est aussi corrigée par Claude.</p>
    </div>
  );
}
