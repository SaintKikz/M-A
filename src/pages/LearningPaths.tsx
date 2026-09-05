import { Link } from "react-router-dom";
import { Card, PageTitle, Tag, Btn } from "../components/ui";
import { LEARNING_PATHS } from "../data/paths";
import { useProgress, deskReadyScore } from "../store/progress";

export default function LearningPaths() {
  const { skillScores, diagnosticDone } = useProgress();
  const score = deskReadyScore(skillScores);

  return (
    <div>
      <PageTitle emoji="🧭" title="Parcours" sub="Choisis un objectif, pas un menu. Chaque parcours réorganise le contenu existant dans l'ordre où il devient utile — tu peux en changer à tout moment sans rien perdre." />

      {diagnosticDone && score !== null ? (
        <Card className="mb-5 border-accent/40 !p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <div className="text-xs text-muted">Ton Desk Ready Score actuel</div>
              <div className="font-bold text-lg">{score}%</div>
            </div>
            <Link to="/profile" className="ml-auto"><Btn kind="ghost">Voir mes compétences →</Btn></Link>
          </div>
        </Card>
      ) : (
        <Card className="mb-5 border-gold/40 !p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <div className="font-bold">Commence par le diagnostic</div>
              <div className="text-xs text-muted">Il évite de passer 5 heures sur un sujet que tu maîtrises déjà.</div>
            </div>
            <Link to="/diagnostic" className="ml-auto"><Btn>Faire le diagnostic →</Btn></Link>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        {LEARNING_PATHS.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <div className="flex gap-3 items-start">
              <div className="text-3xl shrink-0">{p.emoji}</div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-lg leading-tight">{p.title}</div>
                <div className="text-xs text-muted mt-0.5">{p.audience}</div>
              </div>
              <Tag color="muted">{p.hours}</Tag>
            </div>

            <p className="text-sm text-muted mt-3">{p.goal}</p>

            <div className="mt-4 space-y-2 flex-1">
              {p.steps.map((step) => (
                <Link key={`${step.when}-${step.label}`} to={step.to}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface2/50 p-2.5 hover:border-accent/40 transition-colors">
                  <span className="w-16 shrink-0 text-[10px] uppercase tracking-wider text-muted font-bold">{step.when}</span>
                  <span className="text-sm font-medium flex-1 min-w-0">{step.label}</span>
                  <span className="text-accent shrink-0">→</span>
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
