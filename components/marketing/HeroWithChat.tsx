"use client";
import React, { useState, useRef, useEffect } from "react";

type Msg = { id: string; role: "user" | "agent"; text: string };

export default function HeroWithChat() {
  const [messages, setMessages] = useState<Msg[]>(() => [
    { id: "sys", role: "agent", text: "Creative Ops Agent ready — ask about booking, safety, or releases." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading]);

  async function send() {
    if (!input.trim()) return;
    const userMsg: Msg = { id: String(Date.now()), role: "user", text: input.trim() };
    setMessages((s) => [...s, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const r = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, context: { origin: "hero" } }),
      });
      const data = await r.json().catch(() => ({}));
      const replyText = data?.reply ?? data?.message ?? "Sorry — no response from the agent.";
      setMessages((s) => [...s, { id: `a-${Date.now()}`, role: "agent", text: String(replyText) }]);
    } catch (err) {
      setMessages((s) => [...s, { id: `err-${Date.now()}`, role: "agent", text: "Agent error — try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="hero-heading" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div>
        <h1 id="hero-heading" className="text-4xl font-bold">
          Your Creative Ops Agent — From Idea to Show Day.
        </h1>
        <p className="mt-4 text-muted">
          AI-assisted direction + n8n automations to plan, produce, and publish across music, modeling, aerial,
          circus/fire, and game design.
        </p>
        <div className="mt-6 flex gap-3">
          <button data-cta="hero-primary" onClick={() => (document.getElementById("chat-input") as HTMLInputElement)?.focus()} className="px-4 py-2 rounded btn-accent">
            Talk to the Agent
          </button>
          <a href="#booking" data-cta="hero-book" className="px-4 py-2 rounded border" >
            Book a Session
          </a>
        </div>
      </div>

      <div className="card p-4 shadow-sm">
        <div ref={listRef} className="h-56 overflow-auto space-y-3" aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={`p-2 rounded ${m.role === "user" ? "bg-glass text-[var(--text)] self-end" : "bg-[color-mix(in srgb, var(--accent) 8%, transparent)] text-[var(--text)]"}`}>
              <div className="text-sm">{m.text}</div>
            </div>
          ))}
          {loading && <div className="text-sm text-muted">Agent typing…</div>}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            className="flex-1 rounded px-3 py-2 border border-slate-200 dark:border-slate-700 bg-transparent"
            placeholder="Ask the Creative Ops Agent..."
            aria-label="Chat input"
          />
          <button onClick={send} disabled={loading} className="px-4 py-2 rounded bg-violet-600 text-white" data-cta="hero-send">
            Send
          </button>
        </div>
      </div>
    </section>
  );
}