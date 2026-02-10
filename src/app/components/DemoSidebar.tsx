"use client";

export type DemoView = "overview" | "hiring" | "onboarding" | "retention" | "trust";

type Props = {
  view: DemoView;
  setView: (v: DemoView) => void;
};

const items: Array<{
  key: DemoView;
  title: string;
  desc: string;
  badge?: string;
}> = [
  {
    key: "overview",
    title: "Overview",
    desc: "All signals across the system.",
    badge: "Live-ish",
  },
  {
    key: "hiring",
    title: "Hiring",
    desc: "Interview + outreach + offer signals.",
  },
  {
    key: "onboarding",
    title: "Onboarding",
    desc: "30/60/90-day check-ins and ramp health.",
  },
  {
    key: "retention",
    title: "Retention",
    desc: "Early-warning risk + interventions.",
    badge: "High ROI",
  },
  {
    key: "trust",
    title: "Trust",
    desc: "RBAC + audit logs + retention policy.",
    badge: "Enterprise",
  },
];

function Icon({ name }: { name: DemoView }) {
  // Small inline icons so we don't add deps
  const common = "h-4 w-4";
  switch (name) {
    case "overview":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 13h6v7H4v-7Zm10-9h6v16h-6V4ZM4 4h6v7H4V4Zm10 9h6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "hiring":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 10v-2a6 6 0 0 0-6-6H7a6 6 0 0 0-6 6v2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 8v6m3-3h-6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "onboarding":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M7 3h10v4H7V3Zm-2 6h14v12H5V9Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M8 13h8M8 17h6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "retention":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s-7-4.35-9-9.5C1.5 7 4.5 4 8 4c2 0 3.4 1 4 2 0.6-1 2-2 4-2 3.5 0 6.5 3 5 7.5-2 5.15-9 9.5-9 9.5Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M7 12h2l1.2-2.2L12 14l1.3-2H17"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "trust":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M9 12l2 2 4-5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function DemoSidebar({ view, setView }: Props) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-neutral-300">
          ORBIO · Signal Engine
        </div>
        <div className="rounded-full bg-lime-400/15 px-2 py-1 text-[10px] font-semibold text-lime-200 ring-1 ring-lime-400/25">
          Demo
        </div>
      </div>

      <div className="mt-3 space-y-1">
        {items.map((it) => {
          const active = it.key === view;
          return (
            <button
              key={it.key}
              onClick={() => setView(it.key)}
              className={[
                "w-full rounded-xl px-3 py-2 text-left transition",
                active
                  ? "bg-lime-400/15 ring-1 ring-lime-400/30"
                  : "hover:bg-neutral-800/50",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div
                  className={[
                    "mt-0.5 rounded-lg p-2",
                    active ? "bg-lime-400/15" : "bg-neutral-800/60",
                  ].join(" ")}
                >
                  <Icon name={it.key} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-medium">
                      {it.title}
                    </div>
                    {it.badge ? (
                      <span className="shrink-0 rounded-full bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300">
                        {it.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-xs text-neutral-400">
                    {it.desc}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-950/30 p-3 text-[11px] leading-4 text-neutral-400">
        The green highlights match Orbio’s neon-lime brand vibe. We’ll refine
        polish later—right now we’re shipping a believable demo fast.
      </div>
    </div>
  );
}
