import React from "react";

const CASES = [
  { t: "Music", d: "Release planner → ISRC, pre-save, captions, schedule, KPI loop" },
  { t: "Modeling", d: "Portfolio curation → briefs, selects, proofs, bookings" },
  { t: "Aerial", d: "Rigging checklists, rehearsal blocks, cue sync, readiness logs" },
  { t: "Circus & Fire", d: "Fuel inventory, extinguisher checks, permits, safety crews" },
  { t: "Game Design", d: "Builds, asset bus, show visuals, DMX/OSC cues" },
];

export default function UseCases() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Use-cases by discipline</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CASES.map(c => (
          <div key={c.t} className="p-4 border rounded bg-white dark:bg-slate-800">
            <h4 className="font-semibold">{c.t}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{c.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}