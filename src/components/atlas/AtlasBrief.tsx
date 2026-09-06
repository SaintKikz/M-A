import { Card, Tag } from "../ui";
import { atlasCompany } from "../../data/projectAtlas";

/** Le mail de l'Associate — c'est le point d'entrée du livrable. */
export function AtlasBrief() {
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="bg-surface2 px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <Tag color="purple">Associate</Tag>
          <span className="text-sm font-semibold">Emma Roberts</span>
          <span className="text-xs text-muted ml-auto">aujourd'hui · 09:12</span>
        </div>
        <div className="text-xs text-muted mt-1">
          À : Analyste · Cc : James Chen (VP), Sarah Laurent (MD)
        </div>
        <div className="font-bold text-sm mt-2">
          {atlasCompany.codename} — valorisation préliminaire pour demain
        </div>
      </div>
      <div className="px-5 py-4 text-sm leading-relaxed space-y-3">
        <p>Bonjour,</p>
        <p>
          Peux-tu mettre à jour les <b>trading comps</b> et le <b>DCF</b> d'Atlas à partir des informations
          financières jointes ? Il nous faut une fourchette de valorisation préliminaire pour la discussion
          interne de demain matin.
        </p>
        <p>
          Merci de t'assurer que le modèle est <b>entièrement lié</b> et de faire tourner tes contrôles
          avant de me le renvoyer.
        </p>
        <p className="text-muted">Merci,<br />Emma</p>
      </div>
      <div className="px-5 py-3 bg-surface2/50 border-t border-border text-xs text-muted">
        <b className="text-ink">Équipe du deal :</b> Sarah Laurent (MD) · James Chen (VP) · Emma Roberts (Associate) · toi (Analyste)
      </div>
    </Card>
  );
}
