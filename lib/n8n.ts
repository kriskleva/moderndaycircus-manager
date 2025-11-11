export async function callN8N(path: string, body: unknown) {
  const base = process.env.N8N_BASE_URL ?? "https://moderndaycircus.app.n8n.cloud";
  const key = process.env.N8N_SECRET ?? "";
  const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "moderndaycircus"
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const text = await r.text().catch(() => "");
  if (!r.ok) {
    throw new Error(`n8n ${r.status} ${r.statusText} -> ${url}: ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    // fallback: n8n returned plain text (e.g. "Workflow was started")
    return { reply: text };
  }
}
