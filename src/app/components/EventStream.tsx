"use client";

export type EventView = "overview" | "hiring" | "onboarding" | "retention" | "trust";

export type DemoPerson = {
  id: string;
  name: string;
  kind: "candidate" | "employee";
  role: string;
  team: string;
};

export type DemoEvent = {
  id: string;
  ts: string; // ISO
  personId: string;
  source: "ATS" | "Email" | "WhatsApp" | "Slack" | "HRIS" | "Survey";
  lane: "hiring" | "onboarding" | "retention" | "trust";
  type:
    | "INTERVIEW_COMPLETED"
    | "NO_SHOW"
    | "OFFER_SENT"
    | "OFFER_ACCEPTED"
    | "CHECKIN_MISSED"
    | "SENTIMENT_DROP"
    | "MANAGER_FEEDBACK_GAP"
    | "ACCESS_LOG"
    | "DATA_RETENTION_UPDATED";
  title: string;
  detail?: string;
  severity: "low" | "med" | "high";
  duplicate?: boolean;
  outOfOrder?: boolean;
};

type Props = {
  view: EventView;
  events: DemoEvent[];
  people: DemoPerson[];
  selectedPersonId: string;
  onSelectPerson: (id: string) => void;
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "2-digit",
  });
}

function pillClass(sev: DemoEvent["severity"]) {
  if (sev === "high")
    return "bg-red-500/15 text-red-200 ring-1 ring-red-500/25";
  if (sev === "med")
    return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/25";
  return "bg-lime-400/15 text-lime-200 ring-1 ring-lime-400/25";
}

function sourceDot(source: DemoEvent["source"]) {
  // keep it simple: just one shared Orbio-lime dot, plus label
  return (
    <span className="inline-flex items-center gap-2 text-xs text-neutral-300">
      <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_18px_rgba(163,230,53,0.35)]" />
      {source}
    </span>
  );
}

function viewFilter(view: EventView, e: DemoEvent) {
  if (view === "overview") return true;
  if (view === "trust") return e.lane === "trust";
  return e.lane === view;
}

export function EventStream({
  view,
  events,
  people,
  selectedPersonId,
  onSelectPerson,
}: Props) {
  const personById = new Map(people.map((p) => [p.id, p]));
  const filtered = events
    .filter((e) => viewFilter(view, e))
    .sort((a, b) => +new Date(b.ts) - +new Date(a.ts))
    .slice(0, 60);

  return (
    <div className="space-y-2">
      {filtered.map((e) => {
        const p = personById.get(e.personId);
        const active = e.personId === selectedPersonId;

        return (
          <button
            key={e.id}
            onClick={() => onSelectPerson(e.personId)}
            className={[
              "w-full rounded-2xl border p-3 text-left transition",
              active
                ? "border-lime-400/30 bg-lime-400/10"
                : "border-neutral-800 bg-neutral-950/30 hover:bg-neutral-900/40",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={["rounded-full px-2 py-1 text-[10px] font-semibold", pillClass(e.severity)].join(" ")}>
                    {e.type}
                  </span>

                  {e.duplicate ? (
                    <span className="rounded-full bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300">
                      duplicate
                    </span>
                  ) : null}

                  {e.outOfOrder ? (
                    <span className="rounded-full bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300">
                      out-of-order
                    </span>
                  ) : null}

                  <span className="text-xs text-neutral-500">{fmtTime(e.ts)}</span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <div className="truncate text-sm font-semibold">
                    {e.title}
                  </div>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {sourceDot(e.source)}
                  <span className="text-xs text-neutral-500">•</span>
                  <span className="truncate text-xs text-neutral-400">
                    {p ? (
                      <>
                        <span className="text-neutral-200">{p.name}</span>{" "}
                        <span className="text-neutral-500">
                          ({p.kind}, {p.team})
                        </span>
                      </>
                    ) : (
                      <span className="text-neutral-500">Unknown person</span>
                    )}
                  </span>
                </div>

                {e.detail ? (
                  <div className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-400">
                    {e.detail}
                  </div>
                ) : null}
              </div>

              <div className="shrink-0">
                <div
                  className={[
                    "rounded-xl px-2 py-1 text-[10px] font-semibold",
                    active
                      ? "bg-lime-400/15 text-lime-200 ring-1 ring-lime-400/25"
                      : "bg-neutral-800 text-neutral-300",
                  ].join(" ")}
                >
                  Open
                </div>
              </div>
            </div>
          </button>
        );
      })}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4 text-sm text-neutral-400">
          No events in this view.
        </div>
      ) : null}
    </div>
  );
}
