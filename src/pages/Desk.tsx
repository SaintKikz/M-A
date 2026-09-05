import { Link } from "react-router-dom";
import { MISSIONS } from "../data/missions";
import { useProgress } from "../store/progress";
import { Card, PageTitle, Tag, diffLabel, diffColor } from "../components/ui";

export default function Desk() {
  const { completedMissions } = useProgress();
  return (
    <div>
      <PageTitle emoji="💼" title="Analyst Desk" sub="Bienvenue au desk. Ton associate, ton VP et le MD ont des tâches pour toi — des vraies, comme en stage. Contexte, données, deadline implicite : à toi de jouer." />
      <div className="grid md:grid-cols-2 gap-3">
        {MISSIONS.map((m) => {
          const score = completedMissions[m.id];
          return (
            <Link key={m.id} to={`/desk/${m.id}`}>
              <Card className="h-full" onClick={() => {}}>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Tag color={diffColor(m.difficulty)}>{diffLabel(m.difficulty)}</Tag>
                  <Tag color="muted">{m.minutes} min</Tag>
                  <Tag color="purple">+{m.xp} XP</Tag>
                  {score !== undefined && <Tag color={score >= 70 ? "green" : "gold"}>✓ {score}%</Tag>}
                </div>
                <div className="text-xs text-muted font-semibold">{m.from} :</div>
                <div className="font-bold text-sm mt-0.5">« {m.title} »</div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
