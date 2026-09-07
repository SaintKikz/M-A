import { Link } from "react-router-dom";
import { useProgress, levelFor, readinessScore, topicScore, weaknesses, daysUntil, deskReadyScore, bestUnassistedAtlas, atlasStatus } from "../store/progress";
import { SkillRadar } from "../components/Radar";
import { nextStep, recommendations, fixLinkForTag, coverage } from "../lib/coach";
import { Card, Stat, Progress, PageTitle, Tag, Btn } from "../components/ui";
import { MODULES, BOSSES, PLAN } from "../data/curriculum";

const TOPICS: { key: string; label: string }[] = [
  { key: "accounting", label: "Accounting" },
  { key: "valuation", label: "Valuation" },
  { key: "dcf", label: "DCF" },
  { key: "comps", label: "Comps" },
  { key: "mna-process", label: "M&A Process" },
  { key: "accretion-dilution", label: "Accretion/Dilution" },
  { key: "lbo", label: "LBO" },
  { key: "capital-markets", label: "Capital Markets" },
  { key: "industry", label: "Industry" },
  { key: "behavioral", label: "Behavioral" },
];


export default function Dashboard() {
  const s = useProgress();
  const lvl = levelFor(s.xp);
  const ready = readinessScore(s);
  const deskReady = deskReadyScore(s.skillScores);
  const dueMistakes = s.mistakes.filter((m) => !m.retried).length;
  const atlasBest = bestUnassistedAtlas(s.atlasAttempts);
  const atlasState = atlasStatus(s.atlasAttempts);
  const atlasLast = s.atlasAttempts[s.atlasAttempts.length - 1];
  const weak = weaknesses(s.tagErrors);
  const step = nextStep(s);
  const recos = recommendations(s);
  const cov = coverage(s);
  const bossesPassed = Object.values(s.bossResults).filter((b) => b.passed).length;
  const doneModules = MODULES.filter((m) => m.lessonIds.length > 0 && m.lessonIds.every((l) => s.completedLessons.includes(l)));
  // Le rythme suit la PROGRESSION réelle, pas une date fixe dans l'année.
  const currentWeek = Math.min(8, Math.max(1, Math.round((doneModules.length / Math.max(1, MODULES.length)) * 8) + 1));
  const week = PLAN[currentWeek - 1];

  return (
    <div>
      <PageTitle emoji="📊" title="Dashboard" sub={`${doneModules.length}/${MODULES.length} modules validés · Semaine ${currentWeek}/8 : ${week?.title}`} />

      {/* ═══ CONTINUER : la prochaine étape, sans réfléchir ═══ */}
      <Link to={step.to}>
        <Card className="mb-6 border-2 border-accent hover:border-accent2 !p-5" onClick={() => {}}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-xl shrink-0">▶</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] uppercase tracking-wider font-bold text-accent">Continuer là où tu en es</div>
              <div className="font-bold truncate">{step.label}</div>
              <div className="text-xs text-muted">{step.sub}</div>
            </div>
          </div>
        </Card>
      </Link>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Desk Ready Score" value={deskReady !== null ? `${deskReady}%` : `${ready}%`}
          accent={(deskReady ?? ready) >= 75 ? "var(--color-green)" : (deskReady ?? ready) >= 40 ? "var(--color-gold)" : "var(--color-red)"}
          sub={deskReady === null ? "Fais le diagnostic pour le calibrer" : (deskReady >= 75 ? "Prêt pour les entretiens" : deskReady >= 40 ? "En bonne voie" : "Continue à t'entraîner")} />
        <Stat label="Streak" value={<span>🔥 {s.streak}</span>} sub={`Record : ${s.bestStreak} jours`} />
        <Stat label="XP" value={s.xp} sub={`Niv. ${lvl.index} — ${lvl.name}`} />
        <Stat label="Boss vaincus" value={`${bossesPassed}/${BOSSES.length}`} sub={`${s.badges.length} badges · ${(s.studyMinutes / 60).toFixed(1)}h d'étude`} />
      </div>

      {/* ═══ Livrable Excel ═══ */}
      <Link to="/project-atlas">
        <Card className="mb-6 border-accent2/40 hover:border-accent2 !p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-3xl shrink-0">📗</div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-wider font-bold text-accent2">Livrable Excel</div>
              <div className="font-bold">Project Atlas — comps + DCF</div>
              <div className="text-xs text-muted">
                {s.atlasAttempts.length === 0
                  ? "Télécharge le modèle, complète-le dans Excel, fais-le noter."
                  : `${s.atlasAttempts.length} tentative${s.atlasAttempts.length > 1 ? "s" : ""} · dernier score ${atlasLast?.score ?? "—"}/100`}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {atlasBest && (
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider text-muted font-semibold">Record</div>
                  <div className="text-xl font-bold text-accent2">{atlasBest.score}</div>
                </div>
              )}
              <Tag color={atlasState === "Associate-ready" ? "green" : atlasState === "Non commencé" ? "muted" : "accent"}>{atlasState}</Tag>
            </div>
          </div>
        </Card>
      </Link>

      {/* ═══ Compétences + actions rapides ═══ */}
      <div className="grid md:grid-cols-[auto_1fr] gap-4 mb-6">
        <Card className="!p-4 flex flex-col items-center justify-center">
          <div className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-1">Radar de compétences</div>
          <SkillRadar scores={s.skillScores} size={240} />
          {!s.diagnosticDone && (
            <Link to="/diagnostic" className="text-xs font-bold text-accent hover:underline mt-2">Passer le diagnostic →</Link>
          )}
        </Card>
        <div className="grid grid-cols-2 gap-2 content-start">
          {[
            { to: "/drill", emoji: "⚡", label: "Daily Drill", sub: "10 min" },
            { to: "/analystday", emoji: "🌆", label: "Analyst Day", sub: "Simulation" },
            { to: "/tools", emoji: "🧮", label: "Calculateurs", sub: "DCF, LBO, merger" },
            { to: "/quality-control", emoji: "✅", label: "Contrôle qualité", sub: "Deck & modèle" },
            { to: "/excel", emoji: "🟩", label: "Excel Lab", sub: `Record ${s.arcade.best} pts` },
            { to: "/mistakes", emoji: "📓", label: "Mistake Book", sub: dueMistakes > 0 ? `${dueMistakes} à revoir` : "À jour" },
            { to: "/paths", emoji: "🧭", label: "Parcours", sub: "8 objectifs" },
          ].map((a) => (
            <Link key={a.to} to={a.to}>
              <Card className="!p-3.5 h-full hover:border-accent/60">
                <div className="text-lg">{a.emoji}</div>
                <div className="font-bold text-sm mt-0.5">{a.label}</div>
                <div className={`text-[11px] mt-0.5 ${a.to === "/mistakes" && dueMistakes > 0 ? "text-red font-semibold" : "text-muted"}`}>{a.sub}</div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══ Recommandations dynamiques du coach ═══ */}
      <Card className="mb-6 border-accent2/40">
        <div className="font-bold mb-3">🎯 Le coach te recommande aujourd'hui</div>
        {recos.length === 0 ? (
          <p className="text-sm text-muted">Tout est à jour ! Profite-en pour un mock interview dans l'Arena. 🎤</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {recos.map((r, i) => (
              <Link key={i} to={r.to}>
                <Card className="!p-4 h-full" onClick={() => {}}>
                  <div className="font-semibold text-sm">{r.emoji} {r.label}</div>
                  <div className="text-xs text-muted mt-1">{r.reason}</div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Scores par thème */}
        <Card>
          <div className="font-bold mb-4">Scores par compétence</div>
          <div className="space-y-3">
            {TOPICS.map((t) => {
              const sc = topicScore(s.topicStats, t.key);
              return (
                <div key={t.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t.label}</span>
                    <span className="font-mono text-muted">{sc === null ? "—" : `${sc}%`}</span>
                  </div>
                  <Progress value={sc ?? 0} color={sc === null ? "var(--color-surface2)" : sc >= 75 ? "var(--color-green)" : sc >= 50 ? "var(--color-gold)" : "var(--color-red)"} h={6} />
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          {/* Weakness detector — maintenant CLIQUABLE */}
          <Card>
            <div className="font-bold mb-3">🔍 Weakness Detector</div>
            {weak.length === 0 ? (
              <p className="text-sm text-muted">Pas encore assez de données. Fais des drills et des leçons : je détecterai tes faiblesses et je te donnerai le remède exact.</p>
            ) : (
              <div className="space-y-2">
                {weak.map((w) => {
                  const fix = fixLinkForTag(w.tag);
                  return (
                    <Link key={w.tag} to={fix.to} className="flex items-center justify-between gap-2 text-sm bg-red/5 border border-red/30 hover:border-red/60 rounded-lg px-3 py-2 transition-colors">
                      <span>Faible sur <b>{w.tag}</b> <Tag color="red">{w.errors} err.</Tag></span>
                      <span className="text-xs text-accent shrink-0">Soigner →</span>
                    </Link>
                  );
                })}
                <p className="text-xs text-muted pt-1">Clique pour ouvrir la leçon qui corrige chaque faiblesse. Elles reviendront aussi dans tes drills.</p>
              </div>
            )}
          </Card>

          {/* Avancement global compact */}
          <Card>
            <div className="font-bold mb-3">📈 Couverture du programme</div>
            <div className="space-y-2.5">
              {[
                { label: "Leçons", ...cov.lessons, to: "/path" },
                { label: "Boss fights", ...cov.bosses, to: "/path" },
                { label: "Missions", ...cov.missions, to: "/desk" },
                { label: "Case studies", ...cov.cases, to: "/dealroom" },
              ].map((r) => (
                <Link key={r.label} to={r.to} className="block">
                  <div className="flex justify-between text-sm mb-1"><span>{r.label}</span><span className="font-mono text-muted">{r.done}/{r.total}</span></div>
                  <Progress value={(r.done / Math.max(1, r.total)) * 100} h={5} color={r.done === r.total ? "var(--color-green)" : "var(--color-accent)"} />
                </Link>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">{doneModules.length} module(s) validé(s) sur {MODULES.length} · objectif : tout au vert.</p>
          </Card>

          <Card>
            <div className="font-bold mb-3">🏅 Badges</div>
            {s.badges.length === 0 ? (
              <p className="text-sm text-muted">Bats un Boss Fight (≥75%) pour débloquer ton premier badge.</p>
            ) : (
              <div className="flex flex-wrap gap-2">{s.badges.map((b) => <Tag key={b} color="gold">🏅 {b}</Tag>)}</div>
            )}
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/plan"><Btn kind="ghost">🗓️ Voir le plan de la semaine {currentWeek} →</Btn></Link>
      </div>
    </div>
  );
}
