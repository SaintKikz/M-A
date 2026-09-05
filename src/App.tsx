import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProgress, levelFor } from "./store/progress";
import Dashboard from "./pages/Dashboard";
import Path from "./pages/Path";
import ModulePage from "./pages/ModulePage";
import LessonPage from "./pages/LessonPage";
import Drill from "./pages/Drill";
import Desk from "./pages/Desk";
import MissionPage from "./pages/MissionPage";
import DealRoom from "./pages/DealRoom";
import CasePage from "./pages/CasePage";
import Arena from "./pages/Arena";
import ArenaSessionPage from "./pages/ArenaSessionPage";
import ArenaLive from "./pages/ArenaLive";
import BossPage from "./pages/BossPage";
import Flashcards from "./pages/Flashcards";
import DeckPage from "./pages/DeckPage";
import RedBook from "./pages/RedBook";
import Glossary from "./pages/Glossary";
import Plan from "./pages/Plan";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Academy from "./pages/Academy";
import ChapterPage from "./pages/ChapterPage";
import Resources from "./pages/Resources";
import { Assistant } from "./components/Assistant";

const NAV = [
  { to: "/", label: "Dashboard", emoji: "📊" },
  { to: "/academy", label: "Académie", emoji: "🎓" },
  { to: "/path", label: "Interview Track", emoji: "🗺️" },
  { to: "/drill", label: "Daily Drill", emoji: "⚡" },
  { to: "/desk", label: "Analyst Desk", emoji: "💼" },
  { to: "/dealroom", label: "Deal Room", emoji: "🏢" },
  { to: "/arena", label: "Interview Arena", emoji: "🎤" },
  { to: "/flashcards", label: "Flashcards", emoji: "🃏" },
  { to: "/redbook", label: "Red Book Bank", emoji: "📕" },
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
        <Routes>
          <Route path="/" element={<Dashboard />} />
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
      </main>

      {/* Assistant IA flottant — disponible partout */}
      <Assistant />

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
