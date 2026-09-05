import { useState } from "react";
import { useProgress } from "../store/progress";
import { Card, PageTitle, Tag, Btn } from "../components/ui";
import { getAiConfig, saveAiConfig, aiTest, AI_MODELS } from "../lib/aiClient";

function AiSettings() {
  const existing = getAiConfig();
  const [apiKey, setApiKey] = useState(existing?.apiKey ?? "");
  const [model, setModel] = useState(existing?.model ?? "claude-opus-4-8");
  const [status, setStatus] = useState<"idle" | "testing" | "ok" | "error">(existing ? "ok" : "idle");
  const [errorMsg, setErrorMsg] = useState("");

  const save = async () => {
    if (!apiKey.trim()) { saveAiConfig(null); setStatus("idle"); return; }
    saveAiConfig({ apiKey: apiKey.trim(), model });
    setStatus("testing");
    const err = await aiTest();
    if (err) { setStatus("error"); setErrorMsg(err); saveAiConfig(null); }
    else setStatus("ok");
  };

  return (
    <Card className={`mb-6 ${status === "ok" ? "border-green/40" : "border-accent2/40"}`}>
      <div className="font-bold mb-1">🤖 Coach IA {status === "ok" && <Tag color="green">✓ Connecté</Tag>}</div>
      <p className="text-sm text-muted mb-4">
        Branche ta clé API Anthropic pour débloquer l'<b>Entretien Live IA</b> (interviewer conversationnel) et la
        <b> correction IA</b> de toutes tes réponses libres. Crée une clé sur <b>console.anthropic.com</b> → API Keys.
        La clé reste stockée en local sur cet ordinateur (jamais envoyée ailleurs qu'à l'API Anthropic).
      </p>
      <div className="space-y-3">
        <input
          type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-ant-api03-…"
          className="w-full bg-surface2 border border-border rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-accent"
        />
        <select value={model} onChange={(e) => setModel(e.target.value)}
          className="w-full bg-surface2 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent">
          {AI_MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
        <div className="flex gap-2 items-center flex-wrap">
          <Btn onClick={save} disabled={status === "testing"}>
            {status === "testing" ? "Test en cours…" : "Enregistrer & tester"}
          </Btn>
          {status === "ok" && apiKey && <Btn kind="ghost" onClick={() => { setApiKey(""); saveAiConfig(null); setStatus("idle"); }}>Déconnecter</Btn>}
          {status === "error" && <span className="text-sm text-red">{errorMsg}</span>}
        </div>
      </div>
      {status === "ok" && (
        <p className="text-xs text-muted mt-4">
          💡 Où l'IA intervient : <b>Arena → Entretien Live IA</b> (interviewer conversationnel + débrief noté) et
          correction automatique de toutes tes réponses libres (missions, boss fights, arena scriptée, leçons).
        </p>
      )}
    </Card>
  );
}

export default function Settings() {
  const reset = useProgress((s) => s.reset);

  return (
    <div className="max-w-2xl">
      <PageTitle emoji="⚙️" title="Paramètres" sub="Coach IA, modèle utilisé, et gestion de tes données." />

      <AiSettings />

      <Card className="mb-6">
        <div className="font-bold mb-2">💾 Tes données</div>
        <p className="text-sm text-muted">
          Toute ta progression (XP, streak, scores, flashcards) et ta clé API sont stockées en <b>localStorage</b>,
          uniquement sur ce navigateur. Rien n'est envoyé sur un serveur — sauf tes réponses à l'API Anthropic
          quand le Coach IA est activé.
        </p>
      </Card>

      <Card className="border-red/30">
        <div className="font-bold mb-2">⚠️ Zone dangereuse</div>
        <p className="text-sm text-muted mb-3">Réinitialise TOUTE ta progression (XP, streak, scores, flashcards). Ta clé API n'est pas touchée. Irréversible.</p>
        <Btn kind="danger" onClick={() => { if (confirm("Vraiment tout effacer ? Cette action est irréversible.")) reset(); }}>Réinitialiser ma progression</Btn>
      </Card>
    </div>
  );
}
