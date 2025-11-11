import React from "react";

const PILLARS = [
  { k: "Auth & Identity", d: "Google, Adobe, Meta" },
  { k: "Asset Ops", d: "Frame.io, Drive/Dropbox, S3" },
  { k: "Project/Release Mgmt", d: "Notion/Asana, Distro/ISRC" },
  { k: "Marketing & Audience", d: "IG/YouTube/TikTok, email" },
  { k: "Performance & Events", d: "Eventbrite, Calendar, Maps" },
  { k: "Rights & Royalties", d: "Songtrust, ASCAP/BMI, Getty/NFT" },
  { k: "Analytics & Wellness", d: "GA4, Spotify, Sheets" },
  { k: "AI & Automation", d: "OpenAI, Runway, n8n" },
];

export default function PillarsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {PILLARS.map((p) => (
        <div key={p.k} className="p-4 border rounded bg-white dark:bg-slate-800 dark:border-slate-700">
          <h3 className="font-semibold">{p.k}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{p.d}</p>
        </div>
      ))}
    </div>
  );
}