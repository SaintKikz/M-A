import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { useProgress, levelFor } from "./store/progress";
import { Assistant } from "./components/Assistant";
import { SearchPalette } from "./components/SearchPalette";

// Le Dashboard tire tout le moteur de recommandations (et donc tout le contenu) :
// il est chargé à la demande comme les autres routes.
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Routes lourdes chargées à la demande (code-splitting)
const Path = lazy(() => import("./pages/Path"));
const ModulePage = lazy(() => import("./pages/ModulePage"));
const LessonPage = lazy(() => import("./pages/LessonPage"));
const Drill = lazy(() => import("./pages/Drill"));
const Desk = lazy(() => import("./pages/Desk"));
const MissionPage = lazy(() => import("./pages/MissionPage"));
const DealRoom = lazy(() => import("./pages/DealRoom"));
const CasePage = lazy(() => import("./pages/CasePage"));
const Arena = lazy(() => import("./pages/Arena"));
const ArenaSessionPage = lazy(() => import("./pages/ArenaSessionPage"));
const ArenaLive = lazy(() => import("./pages/ArenaLive"));
const BossPage = lazy(() => import("./pages/BossPage"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const DeckPage = lazy(() => import("./pages/DeckPage"));
const RedBook = lazy(() => import("./pages/RedBook"));
const Glossary = lazy(() => import("./pages/Glossary"));
const Plan = lazy(() => import("./pages/Plan"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Academy = lazy(() => import("./pages/Academy"));
const ChapterPage = lazy(() => import("./pages/ChapterPage"));
const Resources = lazy(() => import("./pages/Resources"));
const Tools = lazy(() => import("./pages/Tools"));
const Excel = lazy(() => import("./pages/Excel"));
const Mistakes = lazy(() => import("./pages/Mistakes"));
const Diagnostic = lazy(() => import("./pages/Diagnostic"));
const DealDocs = lazy(() => import("./pages/DealDocs"));
const BuyerScreening = lazy(() => import("./pages/BuyerScreening"));
const AnalystDay = lazy(() => import("./pages/AnalystDay"));

const NAV = [
  { to: "/", label: "Dashboard", emoji: "📊" },
  { to: "/academy", label: "Académie", emoji: "🎓" },
  { to: "/path", label: "Interview Track", emoji: "🗺️" },
  { to: "/drill", label: "Daily Drill", emoji: "⚡" },
  { to: "/tools", label: "Outils", emoji: "🧮" },
  { to: "/excel", label: "Excel Lab", emoji: "🟩" },
  { to: "/desk", label: "Analyst Desk", emoji: "💼" },
  { to: "/dealroom", label: "Deal Room", emoji: "🏢" },
  { to: "/arena", label: "Interview Arena", emoji: "🎤" },
  { to: "/flashcards", label: "Flashcards", emoji: "🃏" },
  { to: "/redbook", label: "Red Book Bank", emoji: "📕" },
  { to: "/mistakes", label: "Mistake Book", emoji: "📓" },
  { to: "/analystday", label: "Analyst Day", emoji: "🌆" },
  { to: "/resources", label: "Ressources", emoji: "📚" },
  { to: "/glossary", label: "Glossaire", emoji: "📖" },
  { to: "/plan", label: "Plan 8 semaines", emoji: "🗓️" },
  { to: "/profile", label: "Profil", emoji: "👤" },
  { to: "/settings", label: "Paramètres", emoji: "⚙️" },
];

export default function App() {
  const { xp, streak, addStudyMinutes } = useProgress();
  const lvl = levelFor(xp);
  const loc = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); setMenuOpen(false); }, [loc.pathname]);

  // Temps d'étude réel : +1 min chaque minute où l'app est visible.
  useEffect(() => {
    const t = setInterval(() => { if (document.visibilityState === "visible") addStudyMinutes(1); }, 60000);
    return () => clearInterval(t);
  }, [addStudyMinutes]);

  return (
    <div className="min-h-screen md:flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-surface/60 sticky top-0 h-screen p-4">
        <div className="px-2 mb-6">
          <div className="font-black text-lg tracking-tight">M&A <span className="text-accent">Training Lab</span></div>
          <div className="text-[11px] text-muted mt-0.5">Road to M&A Analyst</div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"}
              className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-accent/15 text-accent" : "text-muted hover:text-ink hover:bg-surface2"}`}>
              <span>{n.emoji}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 p-3 rounded-xl bg-surface2 border border-border">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gold">🔥 {streak}j</span>
            <span className="text-accent">{xp} XP</span>
          </div>
          <div className="text-[11px] text-muted mt-1">Niv. {lvl.index} — {lvl.name}</div>
          <div className="h-1.5 bg-bg rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-accent2 rounded-full" style={{ width: `${lvl.progress * 100}%` }} />
          </div>
        </div>
      </aside>

      {/* Topbar mobile */}
      <div className="md:hidden sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"
          className="flex items-center gap-2 font-black">
          <span className="text-xl leading-none">{menuOpen ? "✕" : "☰"}</span>
          M&A <span className="text-accent">Lab</span>
        </button>
        <div className="text-xs font-bold"><span className="text-gold mr-3">🔥 {streak}</span><span className="text-accent">{xp} XP</span></div>
      </div>

      {/* Menu complet mobile (via ☰) */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-bg/95 backdrop-blur pt-16 px-4 overflow-y-auto fade-up">
          <nav className="grid grid-cols-2 gap-2 pb-24">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"}
                className={({ isActive }) => `flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-semibold border transition-colors ${isActive ? "bg-accent/15 text-accent border-accent/40" : "bg-surface text-ink border-border hover:bg-surface2"}`}>
                <span className="text-lg">{n.emoji}</span>{n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-8 max-w-5xl">
        <Suspense fallback={<div className="text-muted text-sm py-12 text-center">Chargement…</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/:toolId" element={<Tools />} />
          <Route path="/excel" element={<Excel />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="/dealdocs" element={<DealDocs />} />
          <Route path="/screening" element={<BuyerScreening />} />
          <Route path="/analystday" element={<AnalystDay />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/academy/:chapterId" element={<ChapterPage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/path" element={<Path />} />
          <Route path="/path/:moduleId" element={<ModulePage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/drill" element={<Drill />} />
          <Route path="/desk" element={<Desk />} />
          <Route path="/desk/:missionId" element={<MissionPage />} />
          <Route path="/dealroom" element={<DealRoom />} />
          <Route path="/dealroom/:caseId" element={<CasePage />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/arena/live" element={<ArenaLive />} />
          <Route path="/arena/:sessionId" element={<ArenaSessionPage />} />
          <Route path="/boss/:bossId" element={<BossPage />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/flashcards/:deckId" element={<DeckPage />} />
          <Route path="/redbook" element={<RedBook />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        </Suspense>
      </main>

      {/* Assistant IA flottant — disponible partout */}
      <Assistant />
      {/* Recherche globale — Cmd/Ctrl+K */}
      <SearchPalette />

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-border grid grid-cols-5">
        {[NAV[0], NAV[1], NAV[3], NAV[6], NAV[8]].map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === "/"}
            className={({ isActive }) => `flex flex-col items-center py-2 text-[10px] font-semibold ${isActive ? "text-accent" : "text-muted"}`}>
            <span className="text-lg">{n.emoji}</span>{n.label.split(" ")[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
