import React from "react";

export default function HowItWorks() {
  return (
    <section aria-labelledby="howitworks">
      <h2 id="howitworks" className="text-2xl font-semibold mb-4">How it works</h2>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Step name="User" desc="Artist / manager interacts with UI" />
        <Arrow />
        <Step name="Vercel API" desc="/api/* routes" />
        <Arrow />
        <Step name="n8n webhooks" desc="Automations & integrations" />
        <Arrow />
        <Step name="Integrations" desc="Slack / Calendar / Drive / Platforms" />
      </div>
    </section>
  );
}

function Step({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{desc}</div>
    </div>
  );
}

function Arrow() {
  return <div className="text-2xl text-slate-400">→</div>;
}