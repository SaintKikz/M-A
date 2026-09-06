import { useRef, useState } from "react";
import { Card, Btn } from "../ui";

const MAX_BYTES = 20 * 1024 * 1024;

/** Dépôt du classeur complété. Le fichier ne quitte jamais le navigateur. */
export function AtlasUploader({ onSubmit, busy, error }: {
  onSubmit: (file: File) => void; busy: boolean; error: string | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = (f: File | undefined) => {
    setLocalError(null);
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".xlsx")) {
      setLocalError("Seuls les fichiers .xlsx sont acceptés. Enregistre depuis Excel au format « Classeur Excel (.xlsx) ».");
      return;
    }
    if (f.size > MAX_BYTES) {
      setLocalError(`Fichier trop volumineux (${(f.size / 1024 / 1024).toFixed(1)} Mo). Limite : 20 Mo.`);
      return;
    }
    setFile(f);
  };

  const shown = localError ?? error;

  return (
    <Card>
      <div className="font-bold mb-1">Dépose ton classeur complété</div>
      <p className="text-xs text-muted mb-3">
        Le fichier est analysé <b>dans ton navigateur</b>. Il n'est envoyé nulle part et n'est pas conservé.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files?.[0]); }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed px-5 py-8 text-center cursor-pointer transition-colors ${
          dragging ? "border-accent bg-accent/10" : file ? "border-green/50 bg-green/5" : "border-border hover:border-accent/50"}`}>
        <div className="text-2xl mb-1">{file ? "📗" : "📥"}</div>
        <div className="text-sm font-semibold">
          {file ? file.name : "Glisse ton fichier .xlsx ici"}
        </div>
        <div className="text-xs text-muted mt-0.5">
          {file ? `${(file.size / 1024).toFixed(0)} Ko — clique pour changer` : "ou clique pour parcourir"}
        </div>
        <input ref={inputRef} type="file" accept=".xlsx" className="hidden"
          onChange={(e) => { accept(e.target.files?.[0]); e.target.value = ""; }} />
      </div>

      {shown && (
        <div className="mt-3 rounded-lg bg-red/10 border border-red/30 px-3 py-2 text-xs text-red leading-relaxed">
          {shown}
        </div>
      )}

      <div className="mt-4">
        <Btn onClick={() => file && onSubmit(file)} disabled={!file || busy}>
          {busy ? "Analyse en cours…" : "Envoyer pour revue →"}
        </Btn>
      </div>
    </Card>
  );
}
