"use client";

type Person = {
  id: string;
  name: string;
  kind: "candidate" | "employee";
  role: string;
  team: string;
};

type Signal = {
  risk: number; // 0-100
  confidence: number; // 0-1
  label: "low" | "medium" | "high";
  drivers: Array<{ label: string; weight: "low" | "med" | "high" }>;
  explanation: string;
  updatedAt: string; // ISO
};

type Recommendation = {
  id: string;
  title: string;
  why: string;
  expectedImpact: string; // "72 → 45"
  priority: "P1" | "P2" | "P3";
};

type Workflow = {
  id: string;
  name: string;
  state: string;
  next: string;
  retry?: string;
};

type Props = {
  person: Person;
  signals: Signal;
  recommendations: Recommendation[];
  workflows: Workflow[];
};

function pill(weight: "low" | "med" | "high") {
  if (weight === "high")
    return "bg-red-500/15 text-red-200 ring-1 ring-red-500/25";
  if (weight === "med")
    return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/25";
  return "bg-lime-400/15 text-lime-200 ring-1 ring-lime-400/25";
}

function riskStyle(risk: number) {
  if (risk >= 75) return "text-red-200";
  if (risk >= 55) return "text-amber-200";
  return "text-lime-200";
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function PersonPanel({ person, signals, recommendations, workflows }: Props) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">{person.name}</div>
            <div className="mt-1 text-xs text-neutral-400">
              {person.kind} · {person.role} · {person.team}
            </div>
          </div>

          <span className="rounded-full bg-lime-400/15 px-2 py-1 text-[10px] font-semibold text-lime-200 ring-1 ring-lime-400/25">
            Signal Engine
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-3">
            <div className="text-[11px] font-semibold text-neutral-300">
              Risk Score
            </div>
            <div className={["mt-2 text-3xl font-semibold", riskStyle(signals.risk)].join(" ")}>
              {signals.risk}
              <span className="text-sm text-neutral-500">/100</span>
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              Level: <span className="text-neutral-200">{signals.label}</span>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-3">
            <div className="text-[11px] font-semibold text-neutral-300">
              Confidence
            </div>
            <div className="mt-2 text-3xl font-semibold text-neutral-100">
              {Math.round(signals.confidence * 100)}
              <span className="text-sm text-neutral-500">%</span>
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              Updated: <span className="text-neutral-200">{fmtTime(signals.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drivers */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
        <div className="text-sm font-semibold">Top Drivers</div>
        <div className="mt-1 text-xs text-neutral-400">
          Interpretable factors (what an XGBoost model would surface).
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {signals.drivers.map((d, idx) => (
            <span
              key={idx}
              className={["rounded-full px-2 py-1 text-[10px] font-semibold", pill(d.weight)].join(" ")}
              title={d.weight}
            >
              {d.label}
            </span>
          ))}
        </div>

        <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/20 p-3 text-xs leading-5 text-neutral-300">
          <span className="text-neutral-400">Reason summary: </span>
          {signals.explanation}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
        <div className="text-sm font-semibold">Recommended Actions</div>
        <div className="mt-1 text-xs text-neutral-400">
          Predictions are useless without interventions.
        </div>

        <div className="mt-3 space-y-2">
          {recommendations.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{r.title}</div>
                  <div className="mt-1 text-xs text-neutral-400">{r.why}</div>
                </div>

                <span className="shrink-0 rounded-full bg-neutral-800 px-2 py-1 text-[10px] text-neutral-200">
                  {r.priority}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="text-xs text-neutral-400">
                  Expected risk:{" "}
                  <span className="text-lime-200">{r.expectedImpact}</span>
                </div>

                <button className="rounded-xl bg-lime-400/15 px-3 py-2 text-[11px] font-semibold text-lime-200 ring-1 ring-lime-400/25 hover:bg-lime-400/20">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflows */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
        <div className="text-sm font-semibold">Active Workflows</div>
        <div className="mt-1 text-xs text-neutral-400">
          Temporal-like state tracking (simulated).
        </div>

        <div className="mt-3 space-y-2">
          {workflows.map((w) => (
            <div
              key={w.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{w.name}</div>
                  <div className="mt-1 text-xs text-neutral-400">
                    State: <span className="text-neutral-200">{w.state}</span>
                    <span className="text-neutral-500"> • </span>
                    Next: <span className="text-neutral-200">{w.next}</span>
                  </div>
                  {w.retry ? (
                    <div className="mt-1 text-xs text-neutral-500">
                      Retry scheduled: <span className="text-neutral-300">{w.retry}</span>
                    </div>
                  ) : null}
                </div>

                <button className="shrink-0 rounded-xl bg-neutral-800 px-3 py-2 text-[11px] font-semibold text-neutral-200 hover:bg-neutral-700">
                  Override
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
