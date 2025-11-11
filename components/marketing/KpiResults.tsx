import React from "react";

const METRICS = [
  { k: "Asset Turnaround", v: "40–60% faster" },
  { k: "On-brand Content", v: "25–35% more shipped" },
  { k: "Safety Gaps", v: "Fewer, documented compliance" },
  { k: "Clear ROI", v: "Streams, tickets, engagement" },
];

export default function KpiResults() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Results / KPIs</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map(m => (
          <div key={m.k} className="p-4 border rounded bg-white dark:bg-slate-800">
            <div className="text-sm text-slate-500">{m.k}</div>
            <div className="font-semibold mt-2">{m.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}