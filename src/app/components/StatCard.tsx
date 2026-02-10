"use client";

type Props = {
  title: string;
  value: string;
  hint?: string;
  accent?: "normal" | "danger";
};

export function StatCard({ title, value, hint, accent = "normal" }: Props) {
  const glow =
    accent === "danger"
      ? "shadow-[0_0_40px_rgba(239,68,68,0.10)]"
      : "shadow-[0_0_40px_rgba(163,230,53,0.08)]";

  const ring =
    accent === "danger"
      ? "ring-1 ring-red-500/20"
      : "ring-1 ring-lime-400/20";

  const badge =
    accent === "danger"
      ? "bg-red-500/15 text-red-200 ring-1 ring-red-500/25"
      : "bg-lime-400/15 text-lime-200 ring-1 ring-lime-400/25";

  return (
    <div
      className={[
        "rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4",
        glow,
        ring,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-neutral-300">{title}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">
            {value}
          </div>
          {hint ? (
            <div className="mt-2 text-xs leading-5 text-neutral-400">
              {hint}
            </div>
          ) : null}
        </div>

        <span className={["shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold", badge].join(" ")}>
          {accent === "danger" ? "Watch" : "OK"}
        </span>
      </div>
    </div>
  );
}
