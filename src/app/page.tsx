"use client";

import { useMemo, useState } from "react";
import { DemoHeader } from "./_components/DemoHeader";
import { DemoSidebar, type DemoView } from "./_components/DemoSidebar";
import { StatCard } from "./_components/StatCard";
import { EventStream } from "./_components/EventStream";
import { PersonPanel } from "./_components/PersonPanel";
import { seedDemoState } from "./_demo/seed";

export default function Page() {
  const initial = useMemo(() => seedDemoState(), []);
  const [view, setView] = useState<DemoView>("overview");
  const [selectedPersonId, setSelectedPersonId] = useState<string>(
    initial.people[0]?.id ?? ""
  );

  const selectedPerson = initial.people.find((p) => p.id === selectedPersonId);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <DemoHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
          <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-7rem)]">
            <DemoSidebar view={view} setView={setView} />
            <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-3">
              <div className="text-xs font-semibold text-neutral-300">
                People (Demo)
              </div>
              <div className="mt-2 space-y-1">
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

              <div className="mt-3 text-[11px] leading-4 text-neutral-400">
                This is a frontend-only simulation of Orbio’s “Signal Engine”:
                events → workflows → risk → recommendations.
              </div>
            </div>
          </div>

          <main className="space-y-4">
            {/* Top stats (ClickHouse-ish vibe) */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard
                title="Active Workflows"
                value={`${initial.stats.activeWorkflows}`}
                hint="Temporal-like state machines running in the demo."
              />
              <StatCard
                title="At-Risk People"
                value={`${initial.stats.atRisk}`}
                hint="Risk ≥ 65 with confidence ≥ 0.6."
              />
              <StatCard
                title="Events (last 24h)"
                value={`${initial.stats.events24h}`}
                hint="Kafka-ish stream, including duplicates/out-of-order."
              />
            </div>

            {/* Main split */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_420px]">
              <section className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">
                      Event Stream ({view})
                    </div>
                    <div className="mt-1 text-xs text-neutral-400">
                      Live-ish timeline of HR signals across tools.
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-lime-400/15 px-2 py-1 text-[10px] font-semibold text-lime-200 ring-1 ring-lime-400/25">
                      Demo Mode
                    </span>
                  </div>
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

              <aside className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4">
                <div className="text-sm font-semibold">Person Intelligence</div>
                <div className="mt-1 text-xs text-neutral-400">
                  Risk score + drivers + recommended actions.
                </div>

                <div className="mt-4">
                  {selectedPerson ? (
                    <PersonPanel
                      person={selectedPerson}
                      signals={initial.signalsByPersonId[selectedPerson.id]}
                      recommendations={
                        initial.recommendationsByPersonId[selectedPerson.id]
                      }
                      workflows={initial.workflowsByPersonId[selectedPerson.id]}
                    />
                  ) : (
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4 text-sm text-neutral-300">
                      Pick a person to view signals.
                    </div>
                  )}
                </div>
              </aside>
            </div>

            {/* Footer note */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-4 text-xs text-neutral-400">
              Design goal: “feels enterprise” without backend. Next files will add
              the sidebar, event stream UI, and the demo data + types.
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
