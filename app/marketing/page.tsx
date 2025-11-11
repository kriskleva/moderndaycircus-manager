import React from "react";
import HeroWithChat from "@/components/marketing/HeroWithChat";
import PillarsGrid from "@/components/marketing/PillarsGrid";
import InteractiveTiles from "@/components/marketing/InteractiveTiles";
import HowItWorks from "@/components/marketing/HowItWorks";
import UseCases from "@/components/marketing/UseCases";
import KpiResults from "@/components/marketing/KpiResults";
import Faq from "@/components/marketing/Faq";
import SiteFooter from "@/components/marketing/SiteFooter";

export default function MarketingPage() {
  return (
    <main
      // use CSS variables from globals.css to guarantee colors
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      className="min-h-screen bg-[var(--bg)] text-[var(--text)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <HeroWithChat />
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">What it does</h2>
          <p className="text-muted">
            A single creative operating system that merges AI direction with n8n automations to plan,
            produce, and publish across music, modeling, aerial, circus/fire, and game design — faster,
            safer, and more cohesive.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            <li>Creative direction & brand systems; visual/story cohesion</li>
            <li>Studio & production coordination; feedback & QC</li>
            <li>Choreography & rehearsal scheduling; cueing & tempo sync</li>
            <li>Fire/aerial safety protocols; permits; inspections; incident logs</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Cross-task API Pillars</h2>
          <PillarsGrid />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Interactive Tiles</h2>
          <InteractiveTiles />
        </section>

        <section className="mt-12">
          <HowItWorks />
        </section>

        <section className="mt-12">
          <UseCases />
        </section>

        <section className="mt-12">
          <KpiResults />
        </section>

        <section className="mt-12">
          <Faq />
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}