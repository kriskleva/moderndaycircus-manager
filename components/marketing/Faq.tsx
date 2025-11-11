import React from "react";

const FAQS = [
  { q: "Is my data safe?", a: "Yes — secrets remain server-side and automations run via n8n with API keys stored securely." },
  { q: "Can I integrate my calendar?", a: "Yes — connect Calendar, Eventbrite, and other platforms via n8n." },
  { q: "How does safety reporting work?", a: "Checks generate reports and logs that can be attached to events and incidents." },
];

export default function Faq() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
      <div className="space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="p-3 border rounded bg-white dark:bg-slate-800">
            <summary className="font-semibold">{f.q}</summary>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}