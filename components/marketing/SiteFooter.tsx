import React from "react";

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t pt-6 text-sm text-slate-600 dark:text-slate-400">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>© {new Date().getFullYear()} Modern Day Circus — Creative Ops</div>
        <div className="flex gap-4">
          <a href="#" aria-label="GitHub">GitHub</a>
          <a href="#" aria-label="Twitter">Twitter</a>
          <a href="#" aria-label="Docs">Docs</a>
        </div>
      </div>
    </footer>
  );
}