import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { aiEnabled, aiAssistantReply, type LiveMessage } from "../lib/aiClient";
import { Btn } from "./ui";

const SUGGESTIONS = [
  "Explique-moi ce que je lis, simplement",
  "Donne-moi un exemple chiffré",
  "Pose-moi une question pour me tester",
];

/** Capture ce que l'utilisateur a sous les yeux : titre + début du contenu. */
function pageContext(): string {
  const h1 = document.querySelector("main h1")?.textContent ?? "";
  const text = (document.querySelector("main")?.textContent ?? "").replace(/\s+/g, " ").slice(0, 1600);
  return `Page : ${h1}\nContenu affiché : ${text}`;
}

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<LiveMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [partial, setPartial] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const enabled = aiEnabled();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, partial, open]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const next: LiveMessage[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    setPartial("");
    setError(null);
    try {
      let acc = "";
      const final = await aiAssistantReply(next, pageContext(), (d) => { acc += d; setPartial(acc); });
      setMsgs([...next, { role: "assistant", content: final || acc }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de connexion au coach.");
    } finally {
      setBusy(false);
      setPartial("");
    }
  };

  return (
    <>
      {/* Bulle flottante */}
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="Assistant IA"
          className="fixed z-40 right-4 bottom-20 md:bottom-6 w-14 h-14 rounded-full bg-accent2 hover:bg-accent2/85 text-2xl shadow-lg shadow-accent2/30 flex items-center justify-center transition-transform hover:scale-105 pop">
          🤖
        </button>
      )}

      {/* Panneau de chat */}
      {open && (
        <div className="fixed z-40 right-3 bottom-20 md:bottom-6 w-[min(390px,calc(100vw-1.5rem))] h-[min(560px,72vh)] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col fade-up overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface2/60 shrink-0">
            <div>
              <div className="font-bold text-sm">🤖 Ton assistant M&A</div>
              <div className="text-[11px] text-muted">Il voit la page affichée — pose ta question.</div>
            </div>
            <div className="flex items-center gap-1">
              {msgs.length > 0 && (
                <button onClick={() => setMsgs([])} title="Nouvelle conversation"
                  className="text-muted hover:text-ink text-sm px-2 py-1 rounded-lg hover:bg-surface2">↻</button>
              )}
              <button onClick={() => setOpen(false)} aria-label="Fermer"
                className="text-muted hover:text-ink text-lg px-2 py-0.5 rounded-lg hover:bg-surface2">✕</button>
            </div>
          </div>

          {/* Corps */}
          {!enabled ? (
            <div className="flex-1 p-5 flex flex-col items-center justify-center text-center gap-3">
              <div className="text-4xl">🔌</div>
              <p className="text-sm text-muted">Pour activer ton assistant, branche ta clé API Anthropic dans les paramètres (1 minute).</p>
              <Link to="/settings" onClick={() => setOpen(false)}><Btn>⚙️ Configurer le Coach IA</Btn></Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
                {msgs.length === 0 && !partial && (
                  <div className="pt-2">
                    <p className="text-xs text-muted text-center mb-3">Bloqué sur un concept ? Une correction pas claire ? Demande.</p>
                    <div className="space-y-1.5">
                      {SUGGESTIONS.map((s) => (
                        <button key={s} onClick={() => send(s)}
                          className="w-full text-left text-[13px] px-3.5 py-2.5 rounded-xl bg-surface2 border border-border hover:border-accent2/60 transition-colors">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                      m.role === "user" ? "bg-accent text-white rounded-br-sm" : "bg-surface2 border border-border rounded-bl-sm"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {partial && (
                  <div className="flex justify-start">
                    <div className="max-w-[88%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line bg-surface2 border border-border">
                      {partial}<span className="animate-pulse">▍</span>
                    </div>
                  </div>
                )}
                {busy && !partial && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-[13px] bg-surface2 border border-border text-muted animate-pulse">…</div>
                  </div>
                )}
                {error && <p className="text-xs text-red px-1">{error}</p>}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-2.5 border-t border-border shrink-0">
                <div className="flex gap-2 items-end">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                    rows={1}
                    placeholder="Ta question… (Entrée pour envoyer)"
                    disabled={busy}
                    className="flex-1 bg-surface2 border border-border rounded-xl px-3.5 py-2.5 outline-none focus:border-accent2 text-[13px] leading-relaxed resize-none max-h-24"
                  />
                  <button onClick={() => send(input)} disabled={busy || !input.trim()}
                    className="w-10 h-10 rounded-xl bg-accent2 hover:bg-accent2/85 disabled:opacity-40 text-white font-bold shrink-0 transition-colors">
                    ↑
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
