export async function callN8N(path: string, payload: unknown) {
  const url = `${process.env.N8N_BASE_URL}${path}`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.N8N_SECRET || "",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`n8n error ${r.status}`);
  return r.json().catch(() => ({}));
}
