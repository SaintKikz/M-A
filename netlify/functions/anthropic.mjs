// ─── Proxy serveur pour l'API Anthropic ─────────────────────────────────────
// Garde la clé API côté serveur : le navigateur ne la voit jamais.
// Configuration Netlify (Site configuration → Environment variables) :
//   ANTHROPIC_API_KEY  la clé, jamais exposée au client
//   AI_ACCESS_TOKEN    un secret partagé que le client doit présenter
// Sans ces deux variables, la fonction refuse de servir : le mode « clé locale »
// du navigateur reste alors le seul disponible.

import Anthropic from "@anthropic-ai/sdk";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const accessToken = process.env.AI_ACCESS_TOKEN;
  if (!apiKey) return json(503, { error: "ANTHROPIC_API_KEY n'est pas configurée sur le serveur." });
  if (!accessToken) return json(503, { error: "AI_ACCESS_TOKEN n'est pas configuré sur le serveur." });

  // Le jeton évite qu'un tiers qui trouve l'URL consomme ton quota.
  const presented = event.headers["x-ma-lab-token"];
  if (presented !== accessToken) return json(401, { error: "Jeton d'accès invalide." });

  let parsed;
  try { parsed = JSON.parse(event.body ?? "{}"); }
  catch { return json(400, { error: "Corps de requête JSON invalide." }); }

  const params = parsed?.params;
  if (!params || typeof params !== "object") return json(400, { error: "Paramètres de message manquants." });
  if (typeof params.model !== "string" || !params.model.startsWith("claude-")) return json(400, { error: "Modèle invalide." });
  if (!Array.isArray(params.messages) || params.messages.length === 0 || params.messages.length > 80)
    return json(400, { error: "Liste de messages invalide." });

  // Bornes de sécurité : un endpoint personnel ne doit pas pouvoir être détourné.
  params.max_tokens = Math.min(Math.max(Number(params.max_tokens) || 1024, 1), 4096);
  const size = JSON.stringify(params.messages).length + JSON.stringify(params.system ?? "").length;
  if (size > 120_000) return json(413, { error: "Requête trop volumineuse." });

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create(params);
    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    return json(200, { text });
  } catch (error) {
    const status = error instanceof Anthropic.APIError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Échec de la requête Anthropic.";
    console.error("Proxy Anthropic —", status, message);
    return json(status >= 400 && status < 600 ? status : 500, { error: message });
  }
};
