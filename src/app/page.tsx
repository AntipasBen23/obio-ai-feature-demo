"use client";

import { useMemo, useState } from "react";
import { DemoSidebar, type DemoView } from "./components/DemoSidebar";
import { StatCard } from "./components/StatCard";
import { EventStream } from "./components/EventStream";
import { PersonPanel } from "./components/PersonPanel";
import { seedDemoState } from "./demo/seed";

export default function Page() {
  const initial = useMemo(() => seedDemoState(), []);
  const [view, setView] = useState<DemoView>("overview");
  const [selectedPersonId, setSelectedPersonId] = useState(
    initial.people[0]?.id ?? ""
  );

  const selectedPerson = initial.people.find(
    (p) => p.id === selectedPersonId
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* FULL-SCREEN FEATURE ENTRY */}
      <div className="mx-auto max-w-[1600px] px-4 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          {/* LEFT: NAV + PEOPLE */}
          <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] space-y-4">
            <DemoSidebar view={view} setView={setView} />

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-neutral-300">
                  People (Demo)
                </div>
                <span className="rounded-full bg-lime-400/15 px-2 py-1 text-[10px] font-semibold text-lime-200 ring-1 ring-lime-400/25">
                  Live
                </span>
              </div>

              <div className="mt-3 space-y-1">
                {initial.people.map((p) => {
                  const active = p.id === selectedPersonId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPersonId(p.id)}
                      className={[
                        "w-full rounded-xl px-3 py-2 text-left transition",
                        active
                          ? "bg-lime-400/15 ring-1 ring-lime-400/30"
                          : "hover:bg-neutral-800/50",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {p.name}
                          </div>
                          <div className="truncate text-xs text-neutral-400">
                            {p.role} · {p.team}
                          </div>
                        </div>
                        <div className="shrink-0 rounded-full bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300">
                          {p.kind}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT: CORE FEATURE */}
          <main className="space-y-4">
            {/* TOP STATS (signal overview) */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard
                title="Active Workflows"
                value={`${initial.stats.activeWorkflows}`}
                hint="Long-running HR workflows (Temporal-style)."
              />
              <StatCard
                title="At-Risk Talent"
                value={`${initial.stats.atRisk}`}
                hint="Risk ≥ 65 with confidence ≥ 0.6."
                accent="danger"
              />
              <StatCard
                title="Signals (24h)"
                value={`${initial.stats.events24h}`}
                hint="Cross-tool HR events processed."
              />
            </div>

            {/* MAIN SPLIT */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_440px]">
              {/* EVENT STREAM */}
              <section className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">
                      Signal Stream · {view}
                    </div>
                    <div className="mt-1 text-xs text-neutral-400">
                      Real-time HR signals across ATS, chat, interviews,
                      onboarding.
                    </div>
                  </div>

                  <span className="rounded-full bg-lime-400/15 px-2 py-1 text-[10px] font-semibold text-lime-200 ring-1 ring-lime-400/25">
                    Signal Engine
                  </span>
                </div>

                <div className="mt-4">
                  <EventStream
                    view={view}
                    events={initial.events}
                    people={initial.people}
                    selectedPersonId={selectedPersonId}
                    onSelectPerson={setSelectedPersonId}
                  />
                </div>
              </section>

              {/* PERSON INTELLIGENCE */}
              <aside className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4">
                <div className="text-sm font-semibold">
                  Talent Intelligence
                </div>
                <div className="mt-1 text-xs text-neutral-400">
                  Risk, drivers, and recommended actions.
                </div>

                <div className="mt-4">
                  {selectedPerson ? (
                    <PersonPanel
                      person={selectedPerson}
                      signals={
                        initial.signalsByPersonId[selectedPerson.id]
                      }
                      recommendations={
                        initial.recommendationsByPersonId[
                          selectedPerson.id
                        ]
                      }
                      workflows={
                        initial.workflowsByPersonId[selectedPerson.id]
                      }
                    />
                  ) : (
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4 text-sm text-neutral-300">
                      Select a person to view intelligence.
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
