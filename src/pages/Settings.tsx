import { useRef, useState } from "react";
import { useProgress, PROGRESS_STORAGE_KEY } from "../store/progress";
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

// ─── Export / import de la progression ─────────────────────────────────────
function DataTransfer() {
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) { setMsg({ kind: "err", text: "Aucune progression à exporter." }); return; }
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ma-training-lab-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ kind: "ok", text: "Export téléchargé." });
  };

  const importJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      // Le format zustand/persist attend { state: {...}, version: n }
      if (!parsed || typeof parsed !== "object" || !("state" in parsed))
        throw new Error("Fichier non reconnu : il doit provenir d'un export de cette application.");
      localStorage.setItem(PROGRESS_STORAGE_KEY, text);
      setMsg({ kind: "ok", text: "Progression importée. Rechargement…" });
      setTimeout(() => window.location.reload(), 800);
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Import impossible." });
    }
  };

  return (
    <Card className="mb-6">
      <div className="font-bold mb-2">📦 Export / import</div>
      <p className="text-sm text-muted mb-3">
        Sauvegarde ta progression dans un fichier JSON, ou restaure-la sur un autre navigateur.
        L'import <b>remplace</b> la progression actuelle.
      </p>
      <div className="flex gap-2 flex-wrap items-center">
        <Btn onClick={exportJson}>Exporter ma progression</Btn>
        <Btn kind="ghost" onClick={() => fileRef.current?.click()}>Importer un fichier</Btn>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) importJson(f); e.target.value = ""; }} />
      </div>
      {msg && <p className={`text-xs mt-3 ${msg.kind === "ok" ? "text-green" : "text-red"}`}>{msg.text}</p>}
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

      <DataTransfer />

      <Card className="border-red/30">
        <div className="font-bold mb-2">⚠️ Zone dangereuse</div>
        <p className="text-sm text-muted mb-3">Réinitialise TOUTE ta progression (XP, streak, scores, flashcards). Ta clé API n'est pas touchée. Irréversible.</p>
        <Btn kind="danger" onClick={() => { if (confirm("Vraiment tout effacer ? Cette action est irréversible.")) reset(); }}>Réinitialiser ma progression</Btn>
      </Card>
    </div>
  );
}
