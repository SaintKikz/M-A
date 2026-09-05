import { Link } from "react-router-dom";
import { CASES } from "../data/cases";
import { REAL_DEALS } from "../data/realdeals";
import { useProgress } from "../store/progress";
import { Card, PageTitle, Tag } from "../components/ui";
import type { CaseStudy } from "../lib/types";

const LEVELS = [
  { key: "beginner", label: "Beginner", color: "green" },
  { key: "intermediate", label: "Intermediate", color: "accent" },
  { key: "advanced", label: "Advanced", color: "gold" },
  { key: "professional", label: "Professional", color: "red" },
] as const;

function CaseCard({ c, score }: { c: CaseStudy; score?: number }) {
  return (
    <Link to={`/dealroom/${c.id}`}>
      <Card className="h-full" onClick={() => {}}>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Tag color="muted">{c.sector}</Tag>
          {score !== undefined && <Tag color={score >= 70 ? "green" : "gold"}>✓ {score}%</Tag>}
        </div>
        <div className="font-bold text-sm leading-snug">{c.title}</div>
        <div className="text-xs text-muted mt-2">⏱️ {c.minutes} min · {c.questions.length} questions · +{c.xp} XP</div>
      </Card>
    </Link>
  );
}

export default function DealRoom() {
  const { completedCases } = useProgress();
  return (
    <div>
      <PageTitle emoji="🏢" title="Deal Room" sub="Les case studies pour tout appliquer, du calcul d'EV au comité d'investissement. Cas d'école fictifs + Real Deal Files sur de vraies transactions célèbres — celles qu'on cite en entretien." />

      {/* ═══ Real Deal Files ═══ */}
      <Card className="mb-4 border-gold/40 !p-4">
        <div className="font-bold">📰 Real Deal Files</div>
        <p className="text-sm text-muted mt-1">
          De VRAIS deals, transformés en cas pratiques : LVMH/Tiffany, Microsoft/Activision, Musk/Twitter, UBS/Credit Suisse…
          Chiffres publics simplifiés. Maîtrise-en deux ou trois : ce sont tes munitions pour « tell me about a deal ».
        </p>
      </Card>
      {LEVELS.map((lvl) => {
        const deals = REAL_DEALS.filter((c) => c.level === lvl.key);
        if (deals.length === 0) return null;
        return (
          <div key={`rd-${lvl.key}`} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag color="gold">📰 Real Deal</Tag>
              <Tag color={lvl.color}>{lvl.label}</Tag>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {deals.map((c) => <CaseCard key={c.id} c={c} score={completedCases[c.id]} />)}
            </div>
          </div>
        );
      })}

      {/* ═══ Cas d'école fictifs ═══ */}
      <div className="border-t border-border pt-6 mt-8 mb-4">
        <div className="font-bold">🎓 Cas d'école</div>
        <p className="text-sm text-muted mt-1">12 cas fictifs mais réalistes, calibrés pour progresser méthode par méthode (EV, DCF, comps, accretion, LBO, buyer recommendation…).</p>
      </div>
      {LEVELS.map((lvl) => {
        const cases = CASES.filter((c) => c.level === lvl.key);
        return (
          <div key={lvl.key} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Tag color={lvl.color}>{lvl.label}</Tag>
              <span className="text-xs text-muted">{cases.filter((c) => completedCases[c.id] !== undefined).length}/{cases.length} complétés</span>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {cases.map((c) => <CaseCard key={c.id} c={c} score={completedCases[c.id]} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
