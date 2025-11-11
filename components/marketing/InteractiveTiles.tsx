"use client";
import React, { useState } from "react";

function useModal() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}

export default function InteractiveTiles() {
  const booking = useModal();
  const safety = useModal();
  const release = useModal();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button data-cta="tile-book" onClick={() => booking.setOpen(true)} className="p-4 rounded card">
          Book a Session
        </button>
        <button data-cta="tile-safety" onClick={() => safety.setOpen(true)} className="p-4 rounded card">
          Run a Safety Check
        </button>
        <button data-cta="tile-release" onClick={() => release.setOpen(true)} className="p-4 rounded card">
          Orchestrate a Release
        </button>
        <div className="p-4 rounded card">
          <h4 className="font-semibold">Analytics Snapshot</h4>
          <p className="text-muted mt-2">Mock KPIs: streams, video views, ticket interest.</p>
          <button className="mt-3 text-sm underline" data-cta="tile-analytics">View full dashboard</button>
        </div>
      </div>

      {booking.open && <Modal title="Book a Session" onClose={() => booking.setOpen(false)} endpoint="/api/booking" fields={[{k:'name', label:'Name'},{k:'email',label:'Email'},{k:'when',label:'Preferred Date/Time'}]} />}
      {safety.open && <Modal title="Safety Check" onClose={() => safety.setOpen(false)} endpoint="/api/safety" fields={[{k:'site',label:'Site'},{k:'type',label:'Type (aerial/fire)'},{k:'notes',label:'Notes'}]} />}
      {release.open && <Modal title="Release Brief" onClose={() => release.setOpen(false)} endpoint="/api/release-brief" fields={[{k:'title',label:'Release Title'},{k:'assets',label:'Assets (links)'},{k:'date',label:'Release Date'}]} />}
    </>
  );
}

function Modal({ title, onClose, endpoint, fields }: { title: string; onClose: () => void; endpoint: string; fields: {k:string,label:string}[] }) {
  const [values, setValues] = useState<Record<string,string>>(() => Object.fromEntries(fields.map(f => [f.k, ""])));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setMsg(null);
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json?.error ?? r.statusText);
      setMsg("Success");
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setMsg(String(err?.message ?? err));
    } finally { setLoading(false); }
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg p-6 rounded">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="mt-4 space-y-3">
          {fields.map((f) => (
            <label key={f.k} className="block">
              <div className="text-sm">{f.label}</div>
              <input value={values[f.k]} onChange={(e)=>setValues(v=>({...v,[f.k]:e.target.value}))} className="w-full rounded px-3 py-2 border mt-1 bg-transparent" />
            </label>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={submit} disabled={loading} className="px-4 py-2 rounded bg-violet-600 text-white" data-cta="modal-submit">
            {loading ? "Sending…" : "Submit"}
          </button>
          <button onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
          {msg && <div className="ml-auto text-sm">{msg}</div>}
        </div>
      </div>
    </div>
  );
}